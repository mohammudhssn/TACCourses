import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C } from "./constants/brand";
import { LESSONS } from "./data/lessons";
import Sidebar from "./components/Sidebar";
import IntroScreen from "./components/IntroScreen";
import CompleteScreen from "./components/CompleteScreen";
import Block from "./components/Block";

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [lessonIdx, setLessonIdx] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showCompletionAnim, setShowCompletionAnim] = useState(false);
  const contentRef = useRef(null);
  const lesson = LESSONS[lessonIdx];
  const progress = completed.size / LESSONS.length;

  // Scroll progress tracking
  useEffect(() => {
    const el = contentRef.current;
    if (!el || screen !== "lesson") return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight <= clientHeight ? 0 : scrollTop / (scrollHeight - clientHeight);
      setReadingProgress(Math.min(1, Math.max(0, pct)));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [screen, lessonIdx]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
      if (screen !== "lesson") return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (lessonIdx < LESSONS.length - 1) goLesson(lessonIdx + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (lessonIdx > 0) goLesson(lessonIdx - 1);
        else setScreen("intro");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [screen, lessonIdx]);

  const goLesson = useCallback((idx) => {
    setLessonIdx(idx);
    setReadingProgress(0);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleLessonClick = useCallback((idx) => {
    setScreen("lesson");
    goLesson(idx);
    setMobileMenuOpen(false);
  }, [goLesson]);

  const markComplete = useCallback(() => {
    const next = new Set(completed);
    next.add(lessonIdx);
    setCompleted(next);

    // Show completion animation
    setShowCompletionAnim(true);
    setTimeout(() => setShowCompletionAnim(false), 800);

    setTimeout(() => {
      if (lessonIdx < LESSONS.length - 1) {
        setLessonIdx(lessonIdx + 1);
        setReadingProgress(0);
        if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setScreen("complete");
      }
    }, 400);
  }, [completed, lessonIdx]);

  const topBarWidth = screen === "complete" ? "100%" : screen === "intro" ? "0%" : `${(lessonIdx / LESSONS.length) * 100}%`;

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          screen={screen}
          lessonIdx={lessonIdx}
          completed={completed}
          progress={progress}
          onLessonClick={handleLessonClick}
          isMobile={false}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden w-[280px]"
            >
              <Sidebar
                screen={screen}
                lessonIdx={lessonIdx}
                completed={completed}
                progress={progress}
                onLessonClick={handleLessonClick}
                onClose={() => setMobileMenuOpen(false)}
                isMobile={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Top Progress Bar */}
        <div className="h-[3px] bg-gray-100 flex-shrink-0 relative">
          <div
            className="h-full bg-tac-yellow transition-all duration-500 ease-out"
            style={{ width: topBarWidth }}
          />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 flex-shrink-0 bg-white">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-8 h-8 rounded-lg bg-tac-dark flex items-center justify-center cursor-pointer"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-tac-cyan tracking-wider">COURSE 01</div>
            <div className="text-xs font-semibold text-tac-dark">The Mindset Shift</div>
          </div>
          <span className="text-[10px] font-bold text-tac-grey">{Math.round(progress * 100)}%</span>
        </div>

        {/* Reading Progress (lesson view only) */}
        {screen === "lesson" && (
          <div className="h-[2px] bg-transparent flex-shrink-0">
            <div
              className="h-full bg-tac-teal/40 reading-progress"
              style={{ width: `${readingProgress * 100}%` }}
            />
          </div>
        )}

        {/* Content Area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-white content-scroll">
          <AnimatePresence mode="wait">
            {screen === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <IntroScreen onStart={() => setScreen("lesson")} />
              </motion.div>
            )}
            {screen === "complete" && (
              <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <CompleteScreen onRestart={() => { setCompleted(new Set()); setLessonIdx(0); setScreen("intro"); }} />
              </motion.div>
            )}
            {screen === "lesson" && (
              <motion.div
                key={`lesson-${lessonIdx}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="max-w-[680px] mx-auto px-5 md:px-8 py-10 pb-20"
              >
                {/* Lesson header */}
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-tac-dark text-tac-yellow text-[11px] font-bold">
                    Lesson {lesson.num}
                  </span>
                  <span className="text-xs text-tac-grey">{lesson.dur}</span>
                  {completed.has(lessonIdx) && (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                      {"\u2713"} Completed
                    </span>
                  )}
                </div>

                <h1 className="text-[28px] md:text-[32px] font-extrabold text-tac-dark leading-[1.2] mb-2.5 font-serif">
                  {lesson.title}
                </h1>

                <div className="text-[13px] text-tac-grey mb-1.5">
                  By Nijma Yusuf, CRNA &middot; Course 01: The Mindset Shift
                </div>

                {/* Learning Objective */}
                <div className="py-3 px-4 rounded-md bg-tac-blue85/40 border-l-[3px] border-tac-teal mb-8">
                  <div className="text-[10px] font-bold text-tac-cyan tracking-widest mb-1">LEARNING OBJECTIVE</div>
                  <div className="text-sm text-tac-dark leading-relaxed">{lesson.obj}</div>
                </div>

                {/* Content blocks */}
                {lesson.blocks.map((block, i) => <Block key={i} block={block} />)}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => lessonIdx > 0 ? goLesson(lessonIdx - 1) : setScreen("intro")}
                    className="bg-transparent border border-gray-300 rounded-lg px-4 py-2.5 text-[13px] cursor-pointer text-tac-grey hover:bg-gray-50 transition-colors"
                  >
                    {"\u2190"} {lessonIdx > 0 ? "Previous" : "Overview"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={markComplete}
                    className="bg-tac-dark border-none rounded-lg px-5 py-2.5 text-[13px] font-bold cursor-pointer text-white flex items-center gap-2 hover:bg-tac-shade30 transition-colors shadow-md shadow-tac-dark/15"
                  >
                    {lessonIdx === LESSONS.length - 1 ? "Complete Course" : "Mark Complete & Continue"}
                    <span>{lessonIdx === LESSONS.length - 1 ? "\u2713" : "\u2192"}</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Completion Animation Overlay */}
      <AnimatePresence>
        {showCompletionAnim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-20 h-20 rounded-full bg-tac-yellow flex items-center justify-center shadow-2xl shadow-tac-yellow/30"
            >
              <span className="text-3xl text-tac-dark font-bold">{"\u2713"}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
