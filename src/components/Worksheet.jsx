import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C } from "../constants/brand";
import { worksheetSteps } from "../data/worksheetData";

export default function Worksheet() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [priorities, setPriorities] = useState(
    worksheetSteps[1].priorities.map((p, i) => ({ ...p, rank: i + 1, score: 5 }))
  );
  const [conclusion, setConclusion] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const step = worksheetSteps[currentStep];
  const totalSteps = worksheetSteps.length;

  const setField = (fieldId, value) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  };

  const updatePriorityRank = (idx, newRank) => {
    const rank = Math.max(1, Math.min(8, parseInt(newRank) || 1));
    setPriorities(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], rank };
      return updated;
    });
  };

  const updatePriorityScore = (idx, score) => {
    setPriorities(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], score: parseInt(score) || 5 };
      return updated;
    });
  };

  const gapAnalysis = useMemo(() => {
    const sorted = [...priorities].sort((a, b) => a.rank - b.rank);
    return sorted.map(p => ({
      ...p,
      gap: (9 - p.rank) - p.score,
      importance: 9 - p.rank,
    }));
  }, [priorities]);

  const filledCount = useMemo(() => {
    let count = 0;
    worksheetSteps.forEach(s => {
      if (s.fields) {
        s.fields.forEach(f => { if (responses[f.id]?.trim()) count++; });
      }
      if (s.extraFields) {
        s.extraFields.forEach(f => { if (responses[f.id]?.trim()) count++; });
      }
    });
    if (conclusion) count++;
    return count;
  }, [responses, conclusion]);

  const totalFields = useMemo(() => {
    let count = 0;
    worksheetSteps.forEach(s => {
      if (s.fields) count += s.fields.length;
      if (s.extraFields) count += s.extraFields.length;
      if (s.conclusionOptions) count += 1;
    });
    return count;
  }, []);

  const next = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(c => c + 1);
    else setShowSummary(true);
  };
  const prev = () => { if (currentStep > 0) setCurrentStep(c => c - 1); };

  const renderTextField = (field) => (
    <div key={field.id} className="mb-4">
      <label className="block text-[13px] font-semibold text-tac-dark mb-1.5">{field.label}</label>
      {field.hint && <p className="text-[12px] text-gray-400 mb-2 leading-relaxed">{field.hint}</p>}
      {field.type === "textarea" ? (
        <textarea
          value={responses[field.id] || ""}
          onChange={(e) => setField(field.id, e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-800 leading-relaxed resize-none font-serif min-h-[80px]"
          rows={3}
          placeholder="Write your thoughts here..."
        />
      ) : (
        <input
          type="text"
          value={responses[field.id] || ""}
          onChange={(e) => setField(field.id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-800 font-sans"
          placeholder="Your answer..."
        />
      )}
    </div>
  );

  const renderPriorities = () => (
    <div>
      <div className="space-y-2.5 mb-5">
        {priorities.map((p, idx) => (
          <div key={p.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-tac-teal/50 transition-colors">
            {/* Rank input */}
            <div className="flex-shrink-0">
              <input
                type="number"
                min={1} max={8}
                value={p.rank}
                onChange={(e) => updatePriorityRank(idx, e.target.value)}
                className="w-10 h-10 text-center border border-gray-200 rounded-lg text-sm font-bold text-tac-dark bg-gray-50"
              />
            </div>
            {/* Label */}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-tac-dark">{p.label}</div>
              <div className="text-[11px] text-gray-400">{p.desc}</div>
            </div>
            {/* Score slider */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-gray-400">Current:</span>
              <input
                type="range"
                min={1} max={10}
                value={p.score}
                onChange={(e) => updatePriorityScore(idx, e.target.value)}
                className="w-20"
              />
              <span className={`text-sm font-bold w-5 text-center ${p.score <= 4 ? 'text-tac-red' : p.score <= 6 ? 'text-tac-yellow' : 'text-green-600'}`}>
                {p.score}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Gap Analysis */}
      <div className="bg-[#fafcfd] rounded-lg border border-gray-100 p-4">
        <div className="text-[11px] font-bold text-tac-grey tracking-wider mb-3">GAP ANALYSIS</div>
        <div className="text-[12px] text-gray-400 mb-3">Where the largest gap exists between what you value most and what your current role delivers.</div>
        <div className="space-y-2">
          {gapAnalysis.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-[12px] text-gray-500 w-28 flex-shrink-0 truncate">{p.label}</span>
              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-full bg-tac-teal/30 rounded-full"
                  style={{ width: `${(p.importance / 8) * 100}%` }}
                />
                <div
                  className={`absolute top-0 left-0 h-full rounded-full ${p.gap > 2 ? 'bg-tac-red/60' : p.gap > 0 ? 'bg-tac-yellow/60' : 'bg-green-400/60'}`}
                  style={{ width: `${(p.score / 10) * 100}%` }}
                />
              </div>
              {p.gap > 2 && <span className="text-[10px] font-bold text-tac-red flex-shrink-0">GAP</span>}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-tac-teal/30" /> Importance</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-400/60" /> Current score</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-tac-red/60" /> Significant gap</span>
        </div>
      </div>
    </div>
  );

  const renderComparison = () => (
    <div>
      <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">Use the TAC W-2 vs. 1099 Calculator to fill in the 1099 column. This is not a scare tactic. It is information.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2.5 bg-tac-dark text-white font-bold text-xs rounded-tl-lg">Factor</th>
              <th className="text-left p-2.5 bg-tac-dark text-white font-bold text-xs">W-2 Value</th>
              <th className="text-left p-2.5 bg-tac-yellow text-tac-dark font-bold text-xs rounded-tr-lg">1099 Equivalent</th>
            </tr>
          </thead>
          <tbody>
            {worksheetSteps[3].comparisonRows.map((row, i) => (
              <tr key={i} className={i % 2 !== 0 ? "bg-tac-blue85/20" : "bg-white"}>
                <td className="p-2.5 text-[13px] font-medium text-tac-dark border-b border-gray-100">{row.label}</td>
                <td className="p-1.5 border-b border-gray-100">
                  {row.w2 === "Baseline" ? (
                    <span className="text-[13px] text-gray-500 px-1">Baseline</span>
                  ) : (
                    <input
                      type="text"
                      value={responses[`w2_${i}`] || ""}
                      onChange={(e) => setField(`w2_${i}`, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-[13px] bg-white"
                      placeholder="$"
                    />
                  )}
                </td>
                <td className="p-1.5 border-b border-gray-100">
                  {row.loc.startsWith("+") ? (
                    <span className="text-[13px] font-bold text-tac-red px-1">{row.loc}</span>
                  ) : (
                    <input
                      type="text"
                      value={responses[`loc_${i}`] || ""}
                      onChange={(e) => setField(`loc_${i}`, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-[13px] bg-white"
                      placeholder="$"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-3 bg-tac-dark/[0.03] border-l-[3px] border-tac-teal rounded-r-md">
        <label className="block text-[13px] font-semibold text-tac-dark mb-1.5">Knowing this gap — does staying in your current role feel like a deliberate choice, or a habit you haven't examined?</label>
        <textarea
          value={responses["costReflection"] || ""}
          onChange={(e) => setField("costReflection", e.target.value)}
          className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm text-gray-800 font-serif resize-none"
          rows={2}
          placeholder="Reflect honestly..."
        />
      </div>
    </div>
  );

  const renderConclusion = () => (
    <div>
      {step.fields.map(f => renderTextField(f))}

      <div className="my-5 p-4 bg-tac-dark rounded-xl">
        <div className="text-[10px] font-bold text-tac-yellow tracking-wider mb-3">MY CONCLUSION</div>
        <p className="text-[13px] text-tac-teal mb-3">Based on this worksheet, the arrangement that best serves my priorities is:</p>
        <div className="space-y-2">
          {step.conclusionOptions.map(opt => (
            <label key={opt.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                conclusion === opt.id ? 'bg-tac-yellow/20 border border-tac-yellow/50' : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                conclusion === opt.id ? 'border-tac-yellow bg-tac-yellow' : 'border-white/30'
              }`}>
                {conclusion === opt.id && <div className="w-2 h-2 rounded-full bg-tac-dark" />}
              </div>
              <span className={`text-[14px] font-medium ${conclusion === opt.id ? 'text-white' : 'text-white/60'}`}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {step.extraFields.map(f => (
        <div key={f.id} className="mb-3">
          <label className="block text-[13px] font-semibold text-tac-dark mb-1">{f.label}</label>
          <input
            type={f.type === "date" ? "date" : "text"}
            value={responses[f.id] || ""}
            onChange={(e) => setField(f.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-800 font-sans"
            placeholder="Your answer..."
          />
        </div>
      ))}
    </div>
  );

  const renderSummary = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5"
    >
      <div className="text-center mb-5">
        <div className="w-14 h-14 rounded-full bg-tac-dark mx-auto mb-3 flex items-center justify-center">
          <span className="text-2xl text-tac-yellow">{"\u2714"}</span>
        </div>
        <div className="text-lg font-bold text-tac-dark">Worksheet Complete</div>
        <p className="text-[13px] text-gray-500 mt-1">Your responses are saved for this session. Review them below.</p>
      </div>

      {conclusion && (
        <div className="p-4 bg-tac-dark rounded-xl mb-4 text-center">
          <div className="text-[10px] text-tac-teal tracking-wider font-bold mb-1">YOUR CHOSEN PATH</div>
          <div className="text-lg font-bold text-white">
            {worksheetSteps[4].conclusionOptions.find(o => o.id === conclusion)?.label || ""}
          </div>
        </div>
      )}

      {/* Show filled responses */}
      <div className="space-y-3">
        {Object.entries(responses).filter(([,v]) => v?.trim()).map(([key, val]) => {
          const allFields = worksheetSteps.flatMap(s => [...(s.fields || []), ...(s.extraFields || [])]);
          const field = allFields.find(f => f.id === key);
          if (!field) return null;
          return (
            <div key={key} className="p-3 bg-gray-50 rounded-lg">
              <div className="text-[11px] font-bold text-tac-grey mb-1">{field.label}</div>
              <div className="text-[13px] text-gray-700 font-serif leading-relaxed">{val}</div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => { setShowSummary(false); setCurrentStep(0); }}
        className="mt-4 text-sm text-tac-cyan font-medium hover:underline cursor-pointer"
      >
        {"\u21A9"} Edit responses
      </button>
    </motion.div>
  );

  return (
    <div className="my-8">
      {/* Header */}
      <div className="bg-tac-dark rounded-t-xl px-5 py-4 flex justify-between items-center">
        <div>
          <div className="text-tac-teal/70 text-[10px] font-bold tracking-wider">COURSE 01 INTERACTIVE TOOL</div>
          <div className="text-white text-lg font-bold mt-0.5">Values & Priorities Worksheet</div>
          <div className="text-tac-teal text-[13px] mt-0.5">What do you actually want from your practice?</div>
        </div>
        <div className="text-tac-yellow text-[22px] font-extrabold">TAC</div>
      </div>
      <div className="bg-tac-blue17 border-b-[3px] border-tac-yellow">
        <div className="px-5 py-1.5 text-white/80 text-[13px]">Most CRNAs make the 1099 decision under pressure. This helps you make it deliberately.</div>
      </div>

      <div className="border border-t-0 border-gray-200 rounded-b-xl bg-white overflow-hidden">
        {showSummary ? renderSummary() : (
          <>
            {/* Step Indicator */}
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-center gap-1">
                {worksheetSteps.map((s, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <button
                      onClick={() => setCurrentStep(i)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all duration-200 cursor-pointer ${
                        i === currentStep
                          ? 'bg-tac-dark text-white scale-110'
                          : i < currentStep
                          ? 'bg-tac-yellow text-tac-dark'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {i < currentStep ? "\u2713" : s.num}
                    </button>
                    {i < totalSteps - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 rounded ${i < currentStep ? 'bg-tac-yellow' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-tac-grey font-bold tracking-wider">STEP {step.num} OF {totalSteps}</span>
                <span className="text-[10px] text-gray-400">{filledCount}/{totalFields} fields completed</span>
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="px-5 pb-4"
              >
                <div className="mb-4">
                  <h3 className="text-base font-bold text-tac-dark">{step.title}</h3>
                  <p className="text-[13px] text-gray-400 mt-0.5">{step.subtitle}</p>
                </div>

                {step.id === "priorities" && renderPriorities()}
                {step.id === "cost" && renderComparison()}
                {step.id === "conclusion" && renderConclusion()}
                {step.fields && step.id !== "conclusion" && step.fields.map(f => renderTextField(f))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100">
              <button
                onClick={prev}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  currentStep === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                {"\u2190"} Back
              </button>
              <button
                onClick={next}
                className="px-5 py-2 rounded-lg bg-tac-dark text-white text-sm font-bold hover:bg-tac-shade30 transition-colors cursor-pointer flex items-center gap-2"
              >
                {currentStep === totalSteps - 1 ? "Complete Worksheet" : "Continue"} {"\u2192"}
              </button>
            </div>
          </>
        )}

        {/* Download fallback */}
        <div className="px-5 pb-4 border-t border-gray-100 pt-3">
          <a href="/assets/TAC_C01_ValuesPriorities_Worksheet.docx" download
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-gray-200 text-tac-grey text-xs font-medium hover:bg-gray-50 transition-colors">
            <span>{"\u2B07"}</span> Download printable worksheet
          </a>
        </div>
      </div>
    </div>
  );
}
