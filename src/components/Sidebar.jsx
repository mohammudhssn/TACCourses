import { C } from "../constants/brand";
import { LESSONS } from "../data/lessons";

export default function Sidebar({ screen, lessonIdx, completed, progress, onLessonClick, onClose, isMobile }) {
  return (
    <div className={`${isMobile ? 'w-full' : 'w-[252px]'} bg-tac-dark flex flex-col flex-shrink-0 overflow-hidden h-full`}>
      <div className="px-4 pt-4">
        {/* Close button on mobile */}
        {isMobile && (
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors cursor-pointer z-10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-md bg-tac-yellow flex items-center justify-center text-[13px] font-extrabold text-tac-dark">A</div>
          <span className="text-tac-teal text-xs font-bold">The Anesthesia Collective</span>
        </div>

        {/* Course badge */}
        <div className="text-[10px] font-bold text-tac-teal/50 tracking-widest mb-1.5">COURSE 01 OF 6</div>
        <div className="text-[13px] font-bold text-white leading-snug mb-3.5">The Mindset Shift</div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] text-tac-teal/60">Progress</span>
            <span className="text-[10px] text-tac-teal/60">{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-tac-yellow rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lesson list */}
      <div className="flex-1 overflow-y-auto sidebar-scroll px-2 pb-5">
        {LESSONS.map((l, i) => {
          const active = screen === "lesson" && i === lessonIdx;
          const done = completed.has(i);
          return (
            <button
              key={i}
              onClick={() => onLessonClick(i)}
              className={`flex items-center gap-2 w-full p-2 rounded-lg mb-0.5 text-left transition-all duration-200 cursor-pointer group ${
                active ? 'bg-white/10' : 'hover:bg-white/[0.06]'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                done ? 'bg-tac-yellow text-tac-dark' : active ? 'bg-white text-tac-dark' : 'border border-tac-teal/25 text-tac-teal/50'
              } ${done ? 'check-pop' : ''}`}>
                {done ? "\u2713" : l.num}
              </div>
              <span className={`text-[11px] leading-snug flex-1 transition-colors ${
                active ? 'text-white font-semibold' : done ? 'text-tac-teal font-medium' : 'text-white/40 group-hover:text-white/60'
              }`}>{l.title}</span>
              {!done && <span className="text-[10px] text-white/20 flex-shrink-0">{l.dur}</span>}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="text-[10px] text-tac-teal/40 tracking-wider">theanesthesiacollective.com</div>
      </div>
    </div>
  );
}
