import { C } from "../constants/brand";

export default function OnePager() {
  const comparisonRows = [
    { label: "Base Pay", w2: "$220,000/yr  ($105/hr eff.)", loc: "$150\u2013$200/hr  ($312K\u2013$416K/yr)" },
    { label: "Retirement", w2: "401(k) match: ~$8,800/yr (4%)", loc: "Solo 401(k): up to $69,000/yr" },
    { label: "Health Insurance", w2: "Employer-subsidized premium", loc: "Private plan (fully deductible)" },
    { label: "Malpractice", w2: "Claims-made \u2014 tail on you", loc: "Occurrence-based (deductible)" },
    { label: "Paid Time Off", w2: "4 wks \u2014 earned via lower rate", loc: "Self-funded at higher hourly rate" },
    { label: "Tax Structure", w2: "Employer pays half FICA (7.65%)", loc: "S-Corp distributions cut SE tax" },
    { label: "CME / Licensure", w2: "$2,000\u2013$5,000 stipend", loc: "100% deductible business expense" },
    { label: "Schedule", w2: "Assigned by administration", loc: "Designed by you" },
  ];

  const breakdownLeft = [
    { label: "Base salary:", val: "$220,000" },
    { label: "401(k) match (4%):", val: "+$8,800" },
    { label: "Health premium (employer):", val: "+$7,200" },
    { label: "Malpractice:", val: "+$4,000" },
    { label: "CME + license:", val: "+$3,000" },
    { label: "PTO value (4 wks):", val: "+$16,923" },
    { label: "Total True Comp:", val: "$259,923", bold: true },
  ];

  const breakdownRight = [
    { label: "True W-2 comp:", val: "$259,923" },
    { label: "Add SE tax burden:", val: "+$14,400" },
    { label: "Less S-Corp deductions:", val: "-$8,200" },
    { label: "Working hours (1,880/yr):", val: "\u00F7" },
    { label: "Break-even target:", val: "$138.36/hr", bold: true },
    { label: "At $200/hr you net:", val: "+$115K/yr", bold: true, highlight: true },
  ];

  const highlights = [
    { label: "BREAK-EVEN RATE", value: "$138/hr", sub: "Minimum to match your W-2 after benefits and taxes", bg: "bg-tac-dark", vc: "text-tac-yellow", lc: "text-tac-teal", sc: "text-tac-teal/70" },
    { label: "MARKET RATE", value: "$200/hr", sub: "What top-market CRNAs actually earn as locums", bg: "bg-[#FFF8EC]", vc: "text-tac-dark", lc: "text-[#8B6500]", sc: "text-[#8B6500]/70" },
    { label: "20-YEAR GAP", value: "$3.7M", sub: "Lifetime earnings left on the table at W-2", bg: "bg-[#FFF0F0]", vc: "text-tac-red", lc: "text-tac-red", sc: "text-tac-red/60" },
  ];

  return (
    <div className="my-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-tac-dark px-5 py-3.5 flex justify-between items-center">
        <div>
          <div className="text-tac-teal/70 text-[10px] font-bold tracking-wider">COURSE 01 ASSET</div>
          <div className="text-white text-lg font-bold mt-0.5">The W-2 Tax</div>
          <div className="text-tac-teal text-[13px] mt-0.5">What a $220K Salary Actually Costs You</div>
        </div>
        <div className="text-tac-yellow text-[22px] font-extrabold">TAC</div>
      </div>
      <div className="bg-tac-blue17 border-b-[3px] border-tac-yellow">
        <div className="px-5 py-1.5 text-white/80 text-[13px]">You think you're earning $220,000. You're not. Here's the real number.</div>
      </div>

      <div className="p-5">
        {/* Comparison Table */}
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2.5 bg-tac-dark text-white font-bold text-xs"></th>
                <th className="text-left p-2.5 bg-tac-dark text-white font-bold text-xs">W-2 Position</th>
                <th className="text-left p-2.5 bg-tac-yellow text-tac-dark font-bold text-xs">1099 / Locum (S-Corp)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} className={i % 2 !== 0 ? "bg-tac-blue85/30" : "bg-white"}>
                  <td className="p-2.5 font-semibold text-tac-dark text-[13px] border-b border-gray-100">{row.label}</td>
                  <td className="p-2.5 text-gray-600 text-[13px] border-b border-gray-100">{row.w2}</td>
                  <td className="p-2.5 text-tac-cyan font-medium text-[13px] border-b border-gray-100">{row.loc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
          {highlights.map((h, i) => (
            <div key={i} className={`p-3.5 rounded-lg ${h.bg} border ${i === 0 ? 'border-tac-dark' : i === 1 ? 'border-tac-yellow' : 'border-tac-red/50'}`}>
              <div className={`text-[10px] font-bold tracking-wider mb-1 ${h.lc}`}>{h.label}</div>
              <div className={`text-3xl font-extrabold leading-tight ${h.vc}`}>{h.value}</div>
              <div className={`text-[11px] mt-1.5 leading-snug ${h.sc}`}>{h.sub}</div>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="text-[10px] font-bold text-tac-grey tracking-widest uppercase mb-3">How the Break-Even Is Calculated</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-[#fafcfd] rounded-md p-3.5 border border-gray-100">
            <div className="text-[11px] font-bold text-tac-dark mb-2">W-2 Total Compensation</div>
            {breakdownLeft.map((row, i) => (
              <div key={i} className={`flex justify-between py-0.5 ${row.bold ? 'pt-1.5 border-t border-gray-200 mt-1' : ''}`}>
                <span className={`text-xs ${row.bold ? 'font-bold text-tac-dark' : 'text-gray-500'}`}>{row.label}</span>
                <span className={`text-xs ${row.bold ? 'font-bold text-tac-dark' : 'text-gray-700'}`}>{row.val}</span>
              </div>
            ))}
          </div>
          <div className="bg-[#fafcfd] rounded-md p-3.5 border border-gray-100">
            <div className="text-[11px] font-bold text-tac-dark mb-2">1099 Break-Even Math</div>
            {breakdownRight.map((row, i) => (
              <div key={i} className={`flex justify-between py-0.5 ${row.bold ? 'pt-1.5 border-t border-gray-200 mt-1' : ''}`}>
                <span className={`text-xs ${row.bold ? 'font-bold text-tac-dark' : 'text-gray-500'}`}>{row.label}</span>
                <span className={`text-xs font-medium ${row.highlight ? 'text-tac-cyan font-bold' : row.bold ? 'font-bold text-tac-dark' : 'text-gray-700'}`}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer insight */}
        <div className="py-2.5 px-3.5 rounded-md border-l-[3px] border-tac-yellow bg-tac-yellow/5 text-[13px] text-gray-600 leading-relaxed">
          The W-2 isn't a salary. It's a negotiated arrangement designed to benefit your employer.
          Use the TAC Compensation Calculator to model your exact numbers.
        </div>

        {/* Download button */}
        <div className="mt-4 flex items-center gap-3">
          <a href="/assets/TAC_C01_W2Tax_1Pager.docx" download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-tac-dark text-tac-dark text-sm font-semibold hover:bg-tac-dark hover:text-white transition-colors duration-200 cursor-pointer">
            <span>&#x2B07;</span> Download 1-Pager
          </a>
          <span className="text-xs text-gray-400">Word document for print or sharing</span>
        </div>
      </div>
    </div>
  );
}
