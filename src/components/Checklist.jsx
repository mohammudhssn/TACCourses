import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C } from "../constants/brand";
import { checklistSections } from "../data/checklistData";

export default function Checklist() {
  const [checked, setChecked] = useState({});
  const [expandedSections, setExpandedSections] = useState({ financial: true, clinical: true, lifestyle: true });
  const [expandedItems, setExpandedItems] = useState({});
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleCheck = (sectionId, itemIdx) => {
    const key = `${sectionId}-${itemIdx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
    if (!hasInteracted) setHasInteracted(true);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const toggleItemDetail = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const stats = useMemo(() => {
    let total = 0;
    let mustHaveTotal = 0;
    let mustHaveChecked = 0;
    const sectionStats = {};

    checklistSections.forEach(section => {
      let sectionChecked = 0;
      section.items.forEach((item, idx) => {
        const key = `${section.id}-${idx}`;
        if (checked[key]) {
          total++;
          sectionChecked++;
        }
        if (item.mustHave) {
          mustHaveTotal++;
          if (checked[key]) mustHaveChecked++;
        }
      });
      sectionStats[section.id] = { checked: sectionChecked, total: section.items.length };
    });

    return { total, mustHaveTotal, mustHaveChecked, sectionStats };
  }, [checked]);

  const allMustHavesChecked = stats.mustHaveChecked === stats.mustHaveTotal;

  const getVerdict = () => {
    if (!hasInteracted) return null;
    if (!allMustHavesChecked) {
      const uncheckedMustHaves = [];
      checklistSections.forEach(section => {
        section.items.forEach((item, idx) => {
          if (item.mustHave && !checked[`${section.id}-${idx}`]) {
            uncheckedMustHaves.push(item.text.substring(0, 60) + "...");
          }
        });
      });
      return { type: "notyet", label: "Not yet.", desc: "You have unchecked MUST-HAVE items. That is the work. The checklist just gave you your roadmap.", gaps: uncheckedMustHaves };
    }
    if (stats.total >= 22) return { type: "ready", label: "Ready to move.", desc: "Your foundation is solid. Start talking to agencies this month." };
    if (stats.total >= 16) return { type: "soon", label: "Ready in 3\u20136 months.", desc: "Identify the gaps, build a plan, put a date on it." };
    return { type: "notyet", label: "Not yet.", desc: "Keep building your foundation. The checklist just gave you your roadmap.", gaps: [] };
  };

  const verdict = getVerdict();

  return (
    <div className="my-8">
      {/* Header */}
      <div className="bg-tac-dark rounded-t-xl px-5 py-4 flex justify-between items-center">
        <div>
          <div className="text-tac-teal/70 text-[10px] font-bold tracking-wider">COURSE 01 INTERACTIVE TOOL</div>
          <div className="text-white text-lg font-bold mt-0.5">Am I Ready for 1099?</div>
          <div className="text-tac-teal text-[13px] mt-0.5">Self-Assessment Checklist</div>
        </div>
        <div className="text-tac-yellow text-[22px] font-extrabold">TAC</div>
      </div>
      <div className="bg-tac-blue17 border-b-[3px] border-tac-yellow">
        <div className="px-5 py-1.5 text-white/80 text-[13px]">Go through each item honestly. If you cannot check it, that is the information you need.</div>
      </div>

      <div className="border border-t-0 border-gray-200 rounded-b-xl bg-white">
        {/* Progress Bar */}
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-tac-grey tracking-wider">{stats.total} / 24 CHECKED</span>
            <span className="text-[11px] font-bold text-tac-grey">
              MUST-HAVES: <span className={allMustHavesChecked ? "text-green-600" : "text-tac-red"}>{stats.mustHaveChecked} / {stats.mustHaveTotal}</span>
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-tac-yellow rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.total / 24) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Sections */}
        {checklistSections.map((section) => {
          const sectionStat = stats.sectionStats[section.id];
          const isExpanded = expandedSections[section.id];

          return (
            <div key={section.id} className="border-t border-gray-100">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-tac-dark flex items-center justify-center text-tac-yellow font-bold text-sm flex-shrink-0">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-tac-grey tracking-wider">{section.num}</span>
                    <span className="text-sm font-bold text-tac-dark">{section.title}</span>
                  </div>
                  <div className="text-[12px] text-gray-400 mt-0.5">{section.subtitle}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sectionStat.checked === sectionStat.total ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {sectionStat.checked}/{sectionStat.total}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Section Items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-3">
                      {section.items.map((item, idx) => {
                        const key = `${section.id}-${idx}`;
                        const isChecked = !!checked[key];
                        const showDetail = expandedItems[key] && item.description;

                        return (
                          <div key={idx} className="mb-1.5">
                            <div
                              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${isChecked ? 'bg-tac-dark/[0.04]' : 'hover:bg-gray-50'}`}
                              onClick={() => toggleCheck(section.id, idx)}
                            >
                              {/* Checkbox */}
                              <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                                isChecked
                                  ? item.mustHave ? 'bg-tac-yellow text-tac-dark' : 'bg-tac-dark text-white'
                                  : 'border-2 border-gray-300'
                              } ${isChecked ? 'check-pop' : ''}`}>
                                {isChecked && (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>

                              {/* Text */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[13px] leading-snug ${isChecked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                    {item.text}
                                  </span>
                                  {item.mustHave && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-tac-red/10 text-tac-red tracking-wide flex-shrink-0">
                                      MUST-HAVE
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Info toggle */}
                              {item.description && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleItemDetail(key); }}
                                  className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                                >
                                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              )}
                            </div>

                            {/* Description */}
                            <AnimatePresence>
                              {showDetail && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="ml-8 mr-3 mb-2 py-2 px-3 bg-tac-blue85/30 rounded text-[12px] text-gray-500 leading-relaxed border-l-2 border-tac-teal/50">
                                    {item.description}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}

                      {/* Section Warning */}
                      {section.warning && sectionStat.checked < (section.warningThreshold || 0) && hasInteracted && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 p-3 rounded-lg bg-tac-red/5 border border-tac-red/20 text-[12px] text-tac-red leading-relaxed"
                        >
                          <span className="font-bold">!! </span>{section.warning}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Verdict */}
        <AnimatePresence>
          {verdict && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mx-5 mb-5 mt-2"
            >
              <div className={`p-5 rounded-xl border-2 ${
                verdict.type === "ready" ? "border-green-300 bg-green-50" :
                verdict.type === "soon" ? "border-tac-yellow bg-tac-yellow/10" :
                "border-tac-red/40 bg-tac-red/5"
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    verdict.type === "ready" ? "bg-green-200 text-green-700" :
                    verdict.type === "soon" ? "bg-tac-yellow/30 text-tac-dark" :
                    "bg-tac-red/10 text-tac-red"
                  }`}>
                    {verdict.type === "ready" ? "\u2714" : verdict.type === "soon" ? "\u23F3" : "\u2718"}
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${
                      verdict.type === "ready" ? "text-green-700" :
                      verdict.type === "soon" ? "text-tac-dark" :
                      "text-tac-red"
                    }`}>{verdict.label}</div>
                    <div className="text-[13px] text-gray-500">{stats.total}/24 items checked \u00B7 {stats.mustHaveChecked}/{stats.mustHaveTotal} must-haves</div>
                  </div>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed">{verdict.desc}</p>
                {verdict.gaps && verdict.gaps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-[11px] font-bold text-tac-red tracking-wider mb-1.5">UNCHECKED MUST-HAVES:</div>
                    {verdict.gaps.map((gap, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12px] text-gray-500 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tac-red flex-shrink-0" />
                        {gap}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scoring Guide */}
        <div className="px-5 pb-5">
          <div className="text-[10px] font-bold text-tac-grey tracking-widest uppercase mb-2">Scoring Guide</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-center">
              <div className="text-sm font-bold text-green-700">22\u201324</div>
              <div className="text-[11px] text-green-600 mt-0.5">Ready to move</div>
            </div>
            <div className="p-2.5 rounded-lg bg-tac-yellow/10 border border-tac-yellow/40 text-center">
              <div className="text-sm font-bold text-tac-dark">16\u201321</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Ready in 3\u20136 months</div>
            </div>
            <div className="p-2.5 rounded-lg bg-tac-red/5 border border-tac-red/20 text-center">
              <div className="text-sm font-bold text-tac-red">MUST-HAVE gap</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Not yet</div>
            </div>
          </div>
        </div>

        {/* Download fallback */}
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          <a href="/assets/TAC_C01_ReadyChecklist.docx" download
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-gray-200 text-tac-grey text-xs font-medium hover:bg-gray-50 transition-colors">
            <span>&#x2B07;</span> Download printable checklist
          </a>
        </div>
      </div>
    </div>
  );
}
