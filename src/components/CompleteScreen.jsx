import { motion } from "framer-motion";
import { C } from "../constants/brand";

export default function CompleteScreen({ onRestart }) {
  const lessons = [
    "Why W-2 is designed for your employer",
    "The real cost of your salary",
    "The three fear patterns",
    "Ownership vs. employment",
    "Why hospitals fear 1099",
    "The identity shift",
  ];

  const course02Topics = [
    "Locum vs. 1099 vs. agency models",
    "The hospital/MSO/recruiter chain",
    "IRS classification tests in depth",
    "How to read a market and position yourself",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-[620px] mx-auto px-8 py-11 pb-20 text-center"
    >
      {/* Completion Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="w-[72px] h-[72px] rounded-full bg-tac-dark mx-auto mb-6 flex items-center justify-center shadow-lg shadow-tac-dark/30"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl text-tac-yellow"
        >{"\u2713"}</motion.span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="text-[11px] font-bold text-tac-cyan tracking-[.08em] mb-2.5">COURSE 01 COMPLETE</div>
        <h2 className="text-[32px] font-extrabold text-tac-dark leading-[1.2] mb-3.5 font-serif">
          You've completed The Mindset Shift.
        </h2>
        <p className="text-base text-gray-500 leading-relaxed mb-7 font-serif">
          You now understand why the W-2 model is structured the way it is, what it actually costs you, and what the shift to independent practice requires — financially, clinically, and psychologically. That's the foundation everything else builds on.
        </p>
      </motion.div>

      <div className="h-px bg-gray-200 mb-6" />

      {/* What you covered */}
      <div className="text-[11px] font-bold text-tac-grey tracking-widest mb-3.5 text-left">WHAT YOU COVERED</div>
      <div className="grid grid-cols-3 gap-2 mb-7 text-left">
        {lessons.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="p-2.5 rounded-lg border border-gray-200 bg-[#fafcfd]"
          >
            <div className="text-[10px] font-bold text-tac-cyan">LESSON {String(i + 1).padStart(2, "0")}</div>
            <div className="text-xs font-semibold text-tac-dark mt-0.5">{t}</div>
          </motion.div>
        ))}
      </div>

      {/* Course 02 Teaser */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative p-5 rounded-xl overflow-hidden mb-6 text-left"
        style={{
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.shade30} 100%)`,
        }}
      >
        {/* Decorative border */}
        <div className="absolute inset-0 rounded-xl border-2 border-tac-teal/20 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tac-yellow via-tac-teal to-tac-yellow" />

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-tac-teal/60 tracking-wider">UP NEXT</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tac-yellow/20 text-tac-yellow">COURSE 02</span>
        </div>
        <div className="text-lg font-bold text-white mb-2">The 1099 Landscape</div>
        <p className="text-[13px] text-tac-teal/80 leading-relaxed mb-4">
          Maps the full ecosystem: locum vs. 1099 vs. agency, the hospital/MSO/recruiter chain, IRS classification in depth, and how to read a market.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {course02Topics.map((topic, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tac-yellow flex-shrink-0" />
              <span className="text-[12px] text-white/60">{topic}</span>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-tac-yellow text-tac-dark border-none rounded-lg px-5 py-2.5 text-sm font-bold cursor-pointer shadow-lg shadow-black/20 hover:bg-tac-yellow/90 transition-colors"
        >
          Continue to Course 02
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >{"\u2192"}</motion.span>
        </motion.button>
      </motion.div>

      <button
        onClick={onRestart}
        className="bg-transparent border-none text-tac-grey text-[13px] cursor-pointer hover:text-tac-dark transition-colors"
      >
        {"\u21A9"} Restart Course 01
      </button>
    </motion.div>
  );
}
