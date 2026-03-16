import { motion } from "framer-motion";
import { C } from "../constants/brand";

export default function IntroScreen({ onStart }) {
  const outcomes = [
    "Why the W-2 model is structured to benefit your employer, not you",
    "The real cost of your salary when you account for what you're not being paid",
    "The three fear patterns that keep CRNAs in arrangements they've outgrown",
    "What ownership of your practice looks like beyond just the financial",
    "Why hospital resistance to 1099 is a signal of your leverage",
    "The identity shift that separates contractors who thrive from those who don't",
  ];

  const assets = [
    { icon: "\uD83D\uDCC4", label: "1-PAGER", title: "The W-2 Tax" },
    { icon: "\uD83E\uDDEE", label: "CALCULATOR", title: "W-2 vs. 1099 Compensation" },
    { icon: "\u2705", label: "CHECKLIST", title: "Am I Ready for 1099?" },
    { icon: "\uD83D\uDCCB", label: "WORKSHEET", title: "Values & Priorities" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-[660px] mx-auto px-8 py-11 pb-20"
    >
      <div className="text-[11px] font-bold text-tac-cyan tracking-[.08em] mb-3.5">
        COURSE 01 OF 6 &nbsp;&middot;&nbsp; THE ANESTHESIA COLLECTIVE
      </div>

      <h1 className="text-[40px] font-extrabold text-tac-dark leading-[1.15] mb-3.5 font-serif">
        The Mindset Shift
      </h1>

      <p className="text-lg text-gray-500 leading-relaxed mb-7 font-serif">
        From Employee to Independent Practitioner. Everything you need to stop seeing the W-2 model as security — and start seeing it for what it actually is.
      </p>

      <div className="flex gap-2.5 mb-7 flex-wrap">
        {["6 lessons", "~75 minutes", "Self-guided", "4 interactive tools"].map((t, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="px-3.5 py-1.5 rounded-full bg-tac-blue85/40 text-xs font-semibold text-tac-dark"
          >
            {t}
          </motion.span>
        ))}
      </div>

      <div className="h-px bg-gray-200 mb-7" />

      <div className="text-[11px] font-bold text-tac-grey tracking-widest mb-4">
        WHAT YOU'LL UNDERSTAND AFTER THIS COURSE
      </div>

      {outcomes.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.06 }}
          className="flex gap-3 mb-3 items-start"
        >
          <div className="w-[22px] h-[22px] rounded-full bg-tac-dark text-tac-yellow text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {i + 1}
          </div>
          <span className="text-[15px] text-gray-600 leading-snug">{t}</span>
        </motion.div>
      ))}

      <div className="h-7" />

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2.5 bg-tac-dark text-white border-none rounded-lg px-7 py-3.5 text-[15px] font-bold cursor-pointer mb-9 shadow-lg shadow-tac-dark/20 hover:bg-tac-shade30 transition-colors"
      >
        Start Course <span className="text-lg">{"\u2192"}</span>
      </motion.button>

      <div className="text-[11px] font-bold text-tac-grey tracking-widest mb-3.5">INCLUDED TOOLS & ASSETS</div>
      <div className="grid grid-cols-2 gap-2.5">
        {assets.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="p-3 rounded-lg border border-gray-200 bg-[#fafcfd] flex gap-2.5 items-center hover:border-tac-teal/50 transition-colors"
          >
            <span className="text-xl">{a.icon}</span>
            <div>
              <div className="text-[10px] font-bold text-tac-cyan tracking-wide">{a.label}</div>
              <div className="text-[13px] font-semibold text-tac-dark">{a.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
