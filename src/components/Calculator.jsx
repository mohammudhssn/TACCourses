import { useState } from "react";
import { C } from "../constants/brand";

export default function Calculator() {
  const [v, setV] = useState({
    salary: 220000, match: 4, health: 3600, pto: 4, cme: 3000, mal: 4000,
    taxrate: 32, hours: 40, target: 200, scorp: true, clawback: false, clawbackAmt: 30000
  });
  const set = (k) => (e) => setV(p => ({ ...p, [k]: +e.target.value }));
  const tog = (k) => () => setV(p => ({ ...p, [k]: !p[k] }));

  const fmt = n => "$" + Math.round(n).toLocaleString();
  const fhr = n => "$" + Math.round(n) + "/hr";

  const empHealth = v.health * 2.5;
  const matchVal = v.salary * v.match / 100;
  const fica = v.salary * 0.0765;
  const ptoVal = (v.salary / 52) * v.pto;
  const totalW2 = v.salary + matchVal + empHealth + v.mal + v.cme + ptoVal + fica;
  const workHrs = v.hours * (52 - v.pto);
  const se = totalW2 * (v.scorp ? 0.0765 : 0.153);
  const ded = (v.health + v.mal + v.cme) * 0.75;
  const beHr = (totalW2 + se - ded) / workHrs;
  const tgtAnnual = v.target * workHrs;
  const w2net = totalW2 * (1 - v.taxrate / 100);
  const loc1099 = Math.max(0, tgtAnnual - (v.scorp ? tgtAnnual * 0.08 : tgtAnnual * 0.153) - (v.health + v.mal + v.cme + (v.scorp ? tgtAnnual * 0.265 : 0))) * (1 - v.taxrate / 100);
  const gain = loc1099 - w2net - (v.clawback ? v.clawbackAmt / 3 : 0);
  const yr20 = gain * 20 * 1.04;

  let insight = "";
  if (v.target < beHr) insight = `Your target of ${fhr(v.target)} is below break-even (${fhr(beHr)}). You need at least ${fhr(Math.ceil(beHr))} to come out ahead.`;
  else if (gain > 50000) insight = `At ${fhr(v.target)} you clear ${fmt(gain)} more per year after tax \u2014 before accounting for the extra ${fmt(Math.min(69000, tgtAnnual * 0.18) - matchVal)} you can shelter in a Solo 401(k).`;
  else insight = `At ${fhr(v.target)} you are ${fmt(gain)} ahead of your W-2 after tax. ${v.scorp ? "S-Corp is on \u2014 well structured." : "Turn on S-Corp to capture more of that gap."}`;

  const Field = ({ label, k, step = 1000, min, max, hint }) => (
    <div className="mb-3">
      <label className="block text-[11px] font-semibold text-tac-grey mb-1">{label}</label>
      <input type="number" value={v[k]} onChange={set(k)} step={step} min={min} max={max}
        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md bg-[#fafcfd] text-gray-900 font-sans transition-all" />
      {hint && <div className="text-[11px] text-gray-400 mt-0.5">{hint}</div>}
    </div>
  );

  const Toggle = ({ k, label, sub, badge }) => (
    <div className="flex items-center gap-2.5 p-2.5 bg-[#fafcfd] rounded-md mb-2 border border-gray-100">
      <div className="flex-1">
        <div className="text-[13px] text-gray-900 font-medium">{label}</div>
        {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
      </div>
      {badge && <span className="text-[10px] px-1.5 py-0.5 rounded bg-tac-teal/20 text-tac-blue17 font-bold">{badge}</span>}
      <div onClick={tog(k)} className="relative w-9 h-5 cursor-pointer flex-shrink-0">
        <div className={`absolute inset-0 rounded-full transition-colors duration-200 ${v[k] ? 'bg-tac-dark' : 'bg-gray-300'}`} />
        <div className={`absolute h-3.5 w-3.5 top-[3px] bg-white rounded-full transition-all duration-200 shadow-sm ${v[k] ? 'left-[19px]' : 'left-[3px]'}`} />
      </div>
    </div>
  );

  const breakdownRows = [
    ["Base salary", v.salary], ["401(k) match", matchVal], ["Health (employer share est.)", empHealth],
    ["Malpractice", v.mal], ["CME + licensure", v.cme], ["PTO value", ptoVal], ["Employer FICA (7.65%)", fica]
  ];

  const resultCards = [
    { label: "Break-even rate", val: fhr(beHr), sub: "Min to match your W-2", bg: "bg-tac-dark", border: "border-tac-dark", lc: "text-tac-teal", vc: "text-tac-yellow", sc: "text-tac-teal/60" },
    { label: `Annual gain at ${fhr(v.target)}`, val: gain >= 0 ? fmt(gain) : "-" + fmt(Math.abs(gain)), sub: gain >= 0 ? "More/yr after tax" : "Below W-2 \u2014 raise target", bg: "bg-[#FFF8EC]", border: "border-tac-yellow", lc: "text-[#8B6500]", vc: gain >= 0 ? "text-tac-dark" : "text-tac-red", sc: "text-[#8B6500]/60" },
    { label: "20-year opportunity cost", val: yr20 >= 0 ? fmt(yr20) : "\u2014", sub: "If you stay W-2", bg: "bg-[#FFF0F0]", border: "border-tac-red/50", lc: "text-tac-red", vc: "text-tac-red", sc: "text-tac-red/50" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden my-6 shadow-sm">
      {/* Header */}
      <div className="bg-tac-dark px-5 py-3.5 flex justify-between items-center">
        <div>
          <div className="text-tac-teal text-[11px] font-bold tracking-wider">TAC — COURSE 01 TOOL</div>
          <div className="text-white text-[15px] font-bold mt-0.5">W-2 vs. 1099 Compensation Calculator</div>
        </div>
        <div className="text-tac-yellow text-[22px] font-extrabold">TAC</div>
      </div>
      <div className="bg-tac-blue17 border-b-[3px] border-tac-yellow">
        <div className="px-5 py-1.5 text-white text-[13px]">Adjust the inputs below to model your actual numbers in real time.</div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="text-[10px] font-bold text-tac-grey tracking-widest uppercase mb-2.5 pb-1.5 border-b border-gray-100">Your W-2 Details</div>
            <Field label="Annual base salary ($)" k="salary" step={5000} />
            <Field label="Employer 401(k) match (%)" k="match" step={0.5} min={0} max={10} hint="Typically 3\u20136% at hospital systems" />
            <Field label="Health insurance cost ($/yr, your share)" k="health" step={200} hint="After employer subsidy" />
            <Field label="PTO weeks (employer-paid)" k="pto" step={1} min={0} max={12} />
            <Field label="CME + license stipend ($/yr)" k="cme" step={500} />
            <Field label="Malpractice value ($/yr est.)" k="mal" step={500} hint="Estimated annual premium if you paid it" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-tac-grey tracking-widest uppercase mb-2.5 pb-1.5 border-b border-gray-100">Tax & Structure</div>
            <Field label="Federal effective tax bracket (%)" k="taxrate" step={1} min={22} max={37} hint="Most CRNAs file at 32\u201335%" />
            <Field label="Clinical hours per week" k="hours" step={2} min={20} max={60} />
            <Field label="Target locum hourly rate ($/hr)" k="target" step={5} hint="$150\u2013$200 is the typical market range" />
            <div className="text-[10px] font-bold text-tac-grey tracking-widest uppercase mt-3.5 mb-2 pt-2.5 border-t border-gray-100">1099 Structure</div>
            <Toggle k="scorp" label="S-Corp election" sub="Reduces SE tax via salary + distributions" badge="Recommended" />
            {v.scorp && <div className="py-1.5 px-2.5 rounded-md bg-tac-yellow/10 text-[11px] text-[#7a5800] mb-2">Sets ~40% as W-2 salary, 60% distributions. Saves ~$12K\u2013$18K/yr in SE tax.</div>}
            <Toggle k="clawback" label="Sign-on bonus clawback" sub="Factor in repayment if leaving early" />
            {v.clawback && <Field label="Clawback amount ($)" k="clawbackAmt" step={5000} />}
          </div>
        </div>

        <div className="h-px bg-gray-100 my-4" />
        <div className="text-[10px] font-bold text-tac-grey tracking-widest uppercase mb-2.5">Your Results</div>

        {/* Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3.5">
          {resultCards.map((card, i) => (
            <div key={i} className={`p-3 rounded-lg border ${card.bg} ${card.border} transition-all duration-300`}>
              <div className={`text-[10px] font-bold tracking-wide mb-1 ${card.lc}`}>{card.label}</div>
              <div className={`text-2xl font-extrabold leading-tight ${card.vc}`}>{card.val}</div>
              <div className={`text-[11px] mt-1 ${card.sc}`}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="bg-[#fafcfd] rounded-md p-3.5 border border-gray-100 mb-3">
          <div className="text-[11px] font-bold text-tac-grey mb-2">True W-2 Compensation Breakdown</div>
          <div className="grid grid-cols-[1fr_auto] gap-0">
            {breakdownRows.map(([label, val], i) => (
              <div key={i} className="contents">
                <span className="text-xs py-0.5 border-b border-gray-100 text-gray-400">{label}</span>
                <span className="text-xs py-0.5 border-b border-gray-100 text-right pl-3">{fmt(val)}</span>
              </div>
            ))}
            <span className="text-[13px] pt-1.5 font-bold text-gray-900">Total true compensation</span>
            <span className="text-[13px] pt-1.5 text-right pl-3 font-bold text-gray-900">{fmt(totalW2)}</span>
            <span className="text-[13px] font-bold text-tac-cyan">Break-even hourly</span>
            <span className="text-[13px] text-right pl-3 font-bold text-tac-cyan">{fhr(beHr)}</span>
          </div>
        </div>

        {/* Insight */}
        <div className="py-2.5 px-3.5 rounded-md border-l-[3px] border-tac-teal bg-tac-dark/[0.03] text-xs text-gray-600 leading-relaxed">
          {insight}
        </div>
      </div>
    </div>
  );
}
