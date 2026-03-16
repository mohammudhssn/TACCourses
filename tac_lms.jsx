import { useState, useRef, useCallback } from "react";

const C = {
  dark: "#044C60", teal: "#A7D7DA", cream: "#F7DBAD",
  yellow: "#EFB023", red: "#C93A3A", cyan: "#18787F",
  light: "#F5F5F5", blue17: "#2F6A7B", blue85: "#D9E4E7",
  grey: "#626262", white: "#ffffff",
};

/* ── CALCULATOR ─────────────────────────────────────────────── */
function Calculator() {
  const [v, setV] = useState({
    salary:220000, match:4, health:3600, pto:4, cme:3000, mal:4000,
    taxrate:32, hours:40, target:200, scorp:true, clawback:false, clawbackAmt:30000
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
  else if (gain > 50000) insight = `At ${fhr(v.target)} you clear ${fmt(gain)} more per year after tax — before accounting for the extra ${fmt(Math.min(69000, tgtAnnual * 0.18) - matchVal)} you can shelter in a Solo 401(k).`;
  else insight = `At ${fhr(v.target)} you are ${fmt(gain)} ahead of your W-2 after tax. ${v.scorp ? "S-Corp is on — well structured." : "Turn on S-Corp to capture more of that gap."}`;

  const Field = ({ label, k, step = 1000, min, max, hint }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, color: C.grey, marginBottom: 3, fontWeight: 600 }}>{label}</label>
      <input type="number" value={v[k]} onChange={set(k)} step={step} min={min} max={max}
        style={{ width: "100%", padding: "7px 10px", fontSize: 14, border: "1px solid #dde3ea", borderRadius: 6, background: "#fafcfd", color: "#111", fontFamily: "inherit" }} />
      {hint && <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{hint}</div>}
    </div>
  );

  const Tog = ({ k, label, sub, badge }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#fafcfd", borderRadius: 6, marginBottom: 8, border: "1px solid #eef1f3" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "#111", fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{sub}</div>}
      </div>
      {badge && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: C.teal + "30", color: C.blue17, fontWeight: 700 }}>{badge}</span>}
      <div onClick={tog(k)} style={{ position: "relative", width: 36, height: 20, cursor: "pointer", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: v[k] ? C.dark : "#ccc", borderRadius: 20, transition: ".2s" }} />
        <div style={{ position: "absolute", height: 14, width: 14, top: 3, left: v[k] ? 19 : 3, background: "#fff", borderRadius: "50%", transition: ".2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", border: "1px solid #dde3ea", borderRadius: 12, overflow: "hidden", margin: "24px 0" }}>
      <div style={{ background: C.dark, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, letterSpacing: ".05em" }}>TAC — COURSE 01 TOOL</div>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginTop: 2 }}>W-2 vs. 1099 Compensation Calculator</div>
        </div>
        <div style={{ color: C.yellow, fontSize: 22, fontWeight: 800 }}>TAC</div>
      </div>
      <div style={{ borderBottom: `3px solid ${C.yellow}`, background: C.blue17 }}>
        <div style={{ padding: "7px 20px", color: "#fff", fontSize: 13 }}>Adjust the inputs below to model your actual numbers in real time.</div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.grey, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #eee" }}>Your W-2 Details</div>
            <Field label="Annual base salary ($)" k="salary" step={5000} />
            <Field label="Employer 401(k) match (%)" k="match" step={0.5} min={0} max={10} hint="Typically 3–6% at hospital systems" />
            <Field label="Health insurance cost ($/yr, your share)" k="health" step={200} hint="After employer subsidy" />
            <Field label="PTO weeks (employer-paid)" k="pto" step={1} min={0} max={12} />
            <Field label="CME + license stipend ($/yr)" k="cme" step={500} />
            <Field label="Malpractice value ($/yr est.)" k="mal" step={500} hint="Estimated annual premium if you paid it" />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.grey, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #eee" }}>Tax & Structure</div>
            <Field label="Federal effective tax bracket (%)" k="taxrate" step={1} min={22} max={37} hint="Most CRNAs file at 32–35%" />
            <Field label="Clinical hours per week" k="hours" step={2} min={20} max={60} />
            <Field label="Target locum hourly rate ($/hr)" k="target" step={5} hint="$150–$200 is the typical market range" />
            <div style={{ fontSize: 10, fontWeight: 700, color: C.grey, letterSpacing: ".06em", textTransform: "uppercase", margin: "14px 0 8px", paddingTop: 10, borderTop: "1px solid #eee" }}>1099 Structure</div>
            <Tog k="scorp" label="S-Corp election" sub="Reduces SE tax via salary + distributions" badge="Recommended" />
            {v.scorp && <div style={{ padding: "7px 10px", borderRadius: 6, background: "#EFB02312", fontSize: 11, color: "#7a5800", marginBottom: 8 }}>Sets ~40% as W-2 salary, 60% distributions. Saves ~$12K–$18K/yr in SE tax.</div>}
            <Tog k="clawback" label="Sign-on bonus clawback" sub="Factor in repayment if leaving early" />
            {v.clawback && <Field label="Clawback amount ($)" k="clawbackAmt" step={5000} />}
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "16px 0" }} />
        <div style={{ fontSize: 10, fontWeight: 700, color: C.grey, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>Your Results</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            { label: "Break-even rate", val: fhr(beHr), sub: "Min to match your W-2", bg: C.dark, lc: C.teal, vc: C.yellow, sc: C.teal + "80" },
            { label: `Annual gain at ${fhr(v.target)}`, val: gain >= 0 ? fmt(gain) : "-" + fmt(Math.abs(gain)), sub: gain >= 0 ? "More/yr after tax" : "Below W-2 — raise target", bg: "#FFF8EC", lc: "#8B6500", vc: gain >= 0 ? C.dark : C.red, sc: "#8B650099" },
            { label: "20-year opportunity cost", val: yr20 >= 0 ? fmt(yr20) : "—", sub: "If you stay W-2", bg: "#FFF0F0", lc: C.red, vc: C.red, sc: C.red + "80" },
          ].map((card, i) => (
            <div key={i} style={{ padding: "12px 14px", borderRadius: 8, background: card.bg, border: `1px solid ${i === 0 ? C.dark : i === 1 ? C.yellow : C.red + "80"}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: card.lc, letterSpacing: ".04em", marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: card.vc, lineHeight: 1.1 }}>{card.val}</div>
              <div style={{ fontSize: 11, color: card.sc, marginTop: 4 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fafcfd", borderRadius: 6, padding: 14, border: "1px solid #eef1f3", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.grey, marginBottom: 8 }}>True W-2 Compensation Breakdown</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 0 }}>
            {[["Base salary", v.salary], ["401(k) match", matchVal], ["Health (employer share est.)", empHealth], ["Malpractice", v.mal], ["CME + licensure", v.cme], ["PTO value", ptoVal], ["Employer FICA (7.65%)", fica]].map(([k, val]) => (
              <>
                <span style={{ fontSize: 12, padding: "3px 0", borderBottom: "1px solid #f0f0f0", color: "#888" }}>{k}</span>
                <span style={{ fontSize: 12, padding: "3px 0", borderBottom: "1px solid #f0f0f0", textAlign: "right", paddingLeft: 12 }}>{fmt(val)}</span>
              </>
            ))}
            <span style={{ fontSize: 13, padding: "7px 0 3px", fontWeight: 700, color: "#111" }}>Total true compensation</span>
            <span style={{ fontSize: 13, padding: "7px 0 3px", textAlign: "right", paddingLeft: 12, fontWeight: 700, color: "#111" }}>{fmt(totalW2)}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.cyan }}>Break-even hourly</span>
            <span style={{ fontSize: 13, textAlign: "right", paddingLeft: 12, fontWeight: 700, color: C.cyan }}>{fhr(beHr)}</span>
          </div>
        </div>

        <div style={{ padding: "10px 14px", borderRadius: 6, borderLeft: `3px solid ${C.teal}`, background: "#044C6008", fontSize: 12, color: "#444", lineHeight: 1.7 }}>{insight}</div>
      </div>
    </div>
  );
}

/* ── BLOCK RENDERER ─────────────────────────────────────────── */
function Block({ block }) {
  if (block.type === "p") return <p style={{ fontSize: 17, lineHeight: 1.85, color: "#2d2d2d", marginBottom: 20, fontFamily: "'Georgia', serif" }}>{block.text}</p>;
  if (block.type === "h2") return <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 12, marginTop: 36, paddingBottom: 10, borderBottom: `2px solid ${C.teal}`, fontFamily: "'Georgia', serif" }}>{block.text}</h2>;
  if (block.type === "h3") return <h3 style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: 8, marginTop: 22 }}>{block.text}</h3>;

  if (block.type === "pull") return (
    <div style={{ margin: "28px 0", padding: "18px 24px", borderLeft: `5px solid ${C.teal}`, background: C.teal + "15", borderRadius: "0 10px 10px 0" }}>
      <p style={{ fontSize: 20, fontStyle: "italic", color: C.dark, lineHeight: 1.6, margin: 0, fontFamily: "'Georgia', serif" }}>"{block.text}"</p>
    </div>
  );

  if (block.type === "nijma") return (
    <div style={{ margin: "28px 0", border: `1px solid ${C.teal}`, borderLeft: `5px solid ${C.teal}`, borderRadius: "0 10px 10px 0", overflow: "hidden" }}>
      <div style={{ background: C.teal + "22", padding: "9px 18px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 15 }}>💬</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.cyan, letterSpacing: ".06em" }}>NIJMA'S VOICE — From practice</span>
      </div>
      <div style={{ padding: "16px 20px", background: "#fff" }}>
        <p style={{ fontSize: 15, lineHeight: 1.85, color: "#333", fontStyle: "italic", margin: 0, fontFamily: "'Georgia', serif" }}>{block.text}</p>
      </div>
    </div>
  );

  if (block.type === "takeaway") return (
    <div style={{ margin: "32px 0", background: C.dark, borderRadius: 10, padding: "20px 24px", borderLeft: `5px solid ${C.yellow}` }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: C.yellow, letterSpacing: ".08em", marginBottom: 8 }}>THE TAKEAWAY</div>
      <p style={{ fontSize: 16, color: "#fff", lineHeight: 1.75, margin: 0, fontFamily: "'Georgia', serif" }}>{block.text}</p>
    </div>
  );

  if (block.type === "bullets") return (
    <div style={{ margin: "12px 0 24px" }}>
      {block.items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.cyan, flexShrink: 0, marginTop: 9 }} />
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#2d2d2d", flex: 1, margin: 0, fontFamily: "'Georgia', serif" }}>
            {item.bold ? <><strong style={{ color: C.dark }}>{item.bold}</strong>{item.rest}</> : item.text}
          </p>
        </div>
      ))}
    </div>
  );

  if (block.type === "table") return (
    <div style={{ overflowX: "auto", margin: "20px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr>{block.headers.map((h, i) => <th key={i} style={{ padding: "10px 14px", background: i === 2 ? C.yellow : C.dark, color: i === 2 ? C.dark : "#fff", fontWeight: 700, textAlign: "left" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j} style={{ padding: "9px 14px", borderBottom: "1px solid #eee", color: "#333", background: i % 2 !== 0 ? C.blue85 + "40" : "#fff" }}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (block.type === "calculator") return <Calculator />;

  if (block.type === "asset" || block.type === "assetcard") return (
    <div style={{ display: "flex", gap: 14, padding: "14px 16px", border: "1px solid #dde3ea", borderLeft: `4px solid ${C.cyan}`, borderRadius: 8, background: "#fafcfd", marginBottom: 10, alignItems: "flex-start" }}>
      <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{block.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: C.teal + "30", color: C.blue17, letterSpacing: ".04em" }}>{block.assetType}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{block.title}</span>
        </div>
        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, margin: 0 }}>{block.desc}</p>
      </div>
      <div style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.dark}`, color: C.dark, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Download</div>
    </div>
  );

  if (block.type === "assets") return <div style={{ marginTop: 20 }}>{block.items.map((a, i) => <Block key={i} block={{ ...a, type: "assetcard" }} />)}</div>;

  return null;
}

/* ── LESSON DATA ─────────────────────────────────────────────── */
const LESSONS = [
  {
    id: 1, num: "01", title: "Why the W-2 Model Was Designed to Keep You Dependent", dur: "15 min",
    obj: "Understand the structural and financial incentives that make hospitals prefer employed staff — and recognize the difference between genuine security and manufactured dependency.",
    blocks: [
      { type: "p", text: "Before you can make a clear decision about independent practice, you need to understand the system you're deciding to leave. The W-2 model is not neutral. It is structured, deliberately, around a set of incentives that benefit the institution — and the benefits it offers providers are designed to make that arrangement feel like security." },
      { type: "p", text: "That's not a cynical read. It's the mechanics." },
      { type: "h2", text: "The Bundled Benefits System" },
      { type: "p", text: "Hospital employment packages are built around bundled benefits: health insurance, a 401(k) with employer matching, paid time off, malpractice coverage, CME allowances. These are real and have real value. But the way they're structured creates a specific psychological effect — they make total compensation feel larger than it is, and they make the idea of losing them feel like a financial catastrophe." },
      { type: "bullets", items: [
        { bold: "The health insurance isn't free. ", rest: "The employer-subsidized premium is part of your compensation package. In a 1099 arrangement, that same amount becomes a tax-deductible business expense. The cost doesn't disappear — it moves to a column where you control it." },
        { bold: "The 401(k) match has a ceiling. ", rest: "A standard 3–5% match looks generous until you compare it to what you can shelter as an independent contractor. A Solo 401(k) allows up to $69,000 in annual contributions. The W-2 match isn't protecting your retirement — it's capping it." },
        { bold: "Paid time off is not free time. ", rest: "It's time you've already earned by accepting a lower effective hourly rate. The locums provider with no 'PTO' takes the same break — they fund it from a rate that's 30–50% higher." },
        { bold: "Malpractice may have a hidden exit fee. ", rest: "Many W-2 facilities provide claims-made policies, not occurrence-based coverage. If you leave, tail coverage is your problem — and that can cost $20,000+ out of pocket. The 'free' malpractice you've been relying on may come with an exit fee nobody mentioned." },
      ]},
      { type: "pull", text: "The security isn't fake. But the price tag is hidden. When you see it, the equation changes." },
      { type: "h2", text: "Why Hospitals Prefer W-2" },
      { type: "p", text: "Hospitals want employed providers for the same reason any organization wants employees: control, predictability, and cost management. An employed CRNA can be scheduled, reassigned, asked to take call, required to precept trainees, and managed operationally in ways that a 1099 provider cannot. The institution can dictate caseload, hours, location, and to a significant degree, culture." },
      { type: "bullets", items: [
        { bold: "Sign-on bonuses ($20,000–$90,000) ", rest: "look like compensation. They're 2–3 year handcuffs. Leave early, pay it back." },
        { bold: "Seniority and totem-pole culture ", rest: "condition newer providers to 'put in their time' before earning desirable schedules or cases. The reward is years away. The investment starts now." },
        { bold: "The preceptor dynamic ", rest: "at large academic centers pulls newer CRNAs into teaching roles right when their clinical skills should be growing fastest." },
      ]},
      { type: "nijma", text: "I graduated in 2020, right into COVID, into a large academic center across five hospitals. And I realized pretty quickly that I wasn't actually doing anesthesia — I was precepting. I had just finished years of training, spent all that money on a doctorate, and I was sitting there watching residents do the cases I had just learned to do. That was the moment I knew the system wasn't designed around my growth. It was designed around their staffing needs." },
      { type: "h2", text: "The Stool Sitter Problem" },
      { type: "p", text: "There is a specific clinical consequence to staying in a restrictive W-2 role too long: skill atrophy. CRNAs who spend years in systems where complex cases go to attendings — where regional blocks go to fellowship-trained providers — will find after a few years that their practical skill set has narrowed considerably." },
      { type: "p", text: "This matters for independent practice because your rate is tied to your versatility. The CRNA who can do anything commands a premium. The one who has been sitting on a stool running general maintenance cases for five years may technically have the experience on paper, but not in their hands." },
      { type: "takeaway", text: "The W-2 model is a trade. You give up earning potential, schedule autonomy, and in many settings, clinical variety. In exchange, you get predictability and a benefits package that is less valuable than it appears. That trade may have made sense at one point. The question is whether it still does." },
    ]
  },
  {
    id: 2, num: "02", title: "The Real Cost of Your W-2 Salary", dur: "12 min",
    obj: "Calculate the true value of your W-2 compensation package and identify the gap between what you're paid and what you could earn — with the same skills, in the same market.",
    blocks: [
      { type: "p", text: "Most CRNAs don't know what they actually earn. They know their base salary, and they have a vague sense that the benefits add something on top. What they rarely see is the full picture: effective hourly rate after taxes, the real value of each benefit line, and what the 1099 equivalent would look like with the same take-home." },
      { type: "p", text: "This lesson is about running that math. Use the calculator embedded below to model your own numbers as you read." },
      { type: "h2", text: "The W-2 CRNA Compensation Stack" },
      { type: "table", headers: ["Benefit", "W-2 Version", "1099 Counterpoint"], rows: [
        ["Base Pay", "$220,000/yr  ($105/hr eff.)", "$150–$200/hr  ($312K–$416K/yr)"],
        ["Retirement", "401(k) match ~$8,800/yr (4%)", "Solo 401(k): up to $69,000/yr"],
        ["Health Insurance", "Employer-subsidized premium", "Private plan — fully deductible"],
        ["Malpractice", "Claims-made — tail on you", "Occurrence-based (deductible)"],
        ["Paid Time Off", "4 wks — built into lower rate", "Self-funded at higher hourly rate"],
        ["Tax Structure", "Employer pays half FICA (7.65%)", "S-Corp distributions cut SE tax"],
        ["CME / Licensure", "$2,000–$5,000 stipend", "100% deductible business expense"],
        ["Schedule", "Assigned by administration", "Designed by you"],
      ]},
      { type: "h2", text: "The Hidden Tax on W-2 Income" },
      { type: "p", text: "The part of the equation most CRNAs miss is FICA — the Social Security and Medicare payroll tax. As a W-2 employee, you pay 7.65% and your employer pays a matching 7.65%. You don't see the employer's share because it never appears on your pay stub. But it's money your labor generates — money that goes to the government instead of to you." },
      { type: "p", text: "As a 1099 provider, you pay both halves: the full 15.3% self-employment tax. This sounds worse until you understand that the 1099 structure gives you access to deductions that dramatically reduce your taxable income — deductions that W-2 employees simply cannot take." },
      { type: "h2", text: "Run Your Numbers" },
      { type: "p", text: "Adjust the inputs below to your actual situation. The break-even rate is the minimum hourly you need to come out ahead of your W-2 after accounting for all benefits and tax differences." },
      { type: "calculator" },
      { type: "h2", text: "The Lifetime Earnings Gap" },
      { type: "p", text: "Run the numbers over a 20-year career and the gap becomes a different conversation entirely. Conservative estimates put the lifetime earnings differential at approximately $3.7 million in favor of the independent practitioner, when accounting for higher gross income, tax optimization, and compounded retirement contributions over that period." },
      { type: "h2", text: "The Sign-On Bonus Trap" },
      { type: "p", text: "A $50,000 sign-on bonus with a 3-year repayment window means you are committing, financially, to staying for 3 years. Leave at month 18, you owe a pro-rated portion back. If you are currently inside a repayment window: wait it out, negotiate a buyout, or determine whether the earnings differential justifies early repayment. The calculator accounts for this — toggle on the clawback field." },
      { type: "takeaway", text: "Your W-2 salary is not your compensation. It's a line item in a package designed to maximize your loyalty to your employer. When you add up what you actually earn — effective hourly rate, after taxes, net of what you're giving up — the number is usually smaller than you thought, and the 1099 equivalent is usually larger." },
      { type: "assetcard", icon: "📄", assetType: "1-PAGER", title: "The W-2 Tax", desc: "Visual one-page breakdown of what a $220K salary actually costs vs. 1099 equivalent. Designed for print or sharing." },
    ]
  },
  {
    id: 3, num: "03", title: "The Psychology of Financial Independence", dur: "14 min",
    obj: "Recognize the specific fear patterns that keep CRNAs in W-2 arrangements longer than the numbers justify — and replace them with a framework for clear, evidence-based decision-making.",
    blocks: [
      { type: "p", text: "The math is not the problem. Most CRNAs, when they actually run the numbers, can see that independent practice creates a better financial outcome. The problem is that the math doesn't make the decision. Fear does." },
      { type: "h2", text: "Fear #1: The Benefits Fear" },
      { type: "p", text: "'I'll lose my safety net.' This is the most common and most rational-sounding fear. What this fear misses is that the safety net was never free. It was purchased with a lower effective hourly rate, reduced earning potential, and constraints on how you work. You've been paying for it the whole time without seeing the transaction." },
      { type: "pull", text: "The reframe: these are replaceable costs, not irreplaceable gifts. The question isn't 'can I afford to lose these benefits' — it's 'can I afford to keep buying them at the price I'm currently paying.'" },
      { type: "h2", text: "Fear #2: The Stability Fear" },
      { type: "p", text: "W-2 employment feels stable. But W-2 stability is institutionally controlled. Your schedule is set by administrators. Your income is capped. The 'stability' you're protecting is the stability to do what someone else decides, at the rate someone else sets." },
      { type: "bullets", items: [
        { bold: "W-2 stability = ", rest: "predictable constraints" },
        { bold: "1099 stability = ", rest: "diversified control. A CRNA with two or three active contracts has more real income stability than a single-employer W-2 employee who can be furloughed or restructured." },
      ]},
      { type: "h2", text: "Fear #3: The Identity Fear" },
      { type: "p", text: "This is the root issue. The provider identity is conditioned around being an employee — someone who takes care of patients, not someone who runs a business. The idea of forming an LLC, invoicing a facility, managing quarterly taxes feels like it belongs to a different kind of person. It doesn't. It belongs to any provider who chooses it." },
      { type: "nijma", text: "I hear this all the time: 'I'm not a business person.' And I always say: you just spent three years getting a doctorate, learning to manage a human body under general anesthesia, and keep someone alive through a twelve-hour cardiac case. You are telling me you can't figure out an LLC? The business side is the easy part. The hard part is deciding you're worth the investment." },
      { type: "h2", text: "The Golden Handcuffs Pattern" },
      { type: "p", text: "The combination of these three fears — bundled with sign-on bonuses, seniority systems, and benefit dependency — creates what we call the Golden Handcuffs dynamic. Providers who are financially comfortable, institutionally secure, and professionally settled find it genuinely difficult to give up what they have, even when what they could have is clearly better." },
      { type: "pull", text: "Tolerable is the enemy of optimal." },
      { type: "h2", text: "A Framework for Clear Decision-Making" },
      { type: "bullets", items: [
        { text: "Is my hesitation based on evidence, or on unfamiliarity?" },
        { text: "If someone showed me exactly how to replicate every benefit I currently have — at the same or lower cost — would I still stay?" },
        { text: "What would I do if I knew it was going to work?" },
      ]},
      { type: "takeaway", text: "Most CRNAs who stay in W-2 roles they've outgrown are not staying because the math is right. They're staying because the fear is loud and the alternative is unfamiliar. Naming the fear precisely — benefits, stability, identity — is the first step to evaluating it clearly." },
    ]
  },
  {
    id: 4, num: "04", title: "Ownership vs. Employment", dur: "11 min",
    obj: "Reframe what schedule autonomy, clinical variety, and professional control actually look like in practice — and understand what you're trading when you give them up.",
    blocks: [
      { type: "p", text: "Independence is not just a financial concept. It changes your relationship to your work in ways that compound over time — schedule, caseload, professional development, and ultimately, the kind of practitioner you become." },
      { type: "h2", text: "The Schedule Dimension" },
      { type: "p", text: "As a W-2 employee, your schedule is managed by the institution. As an independent contractor, you define your availability. You can work five eights, three tens, two twelves, weekends only, or seasonal blocks. You can take three weeks off without requesting PTO. You can design a schedule around school pick-up, a second contract, or simply what you prefer." },
      { type: "h2", text: "The Caseload Dimension" },
      { type: "p", text: "In most W-2 environments, your caseload is assigned. Independent contractors negotiate their scope. You can specify the cases you will and won't cover. You can build a reputation around a particular skill set — regional, pediatric, cardiac, OB — and be sought for those cases specifically. Your caseload becomes a reflection of your choices rather than your employer's staffing model." },
      { type: "h2", text: "The Professional Development Dimension" },
      { type: "p", text: "When you're working across multiple facilities, you're exposed to different equipment, different surgeon preferences, different protocols, and different approaches to the same clinical problems. That breadth of exposure accelerates your development in a way that a single-facility W-2 role simply cannot replicate." },
      { type: "nijma", text: "One of the things nobody tells you about locums is that you get really good, really fast. When you're in a new room every few months with different surgeons, different equipment, different cultures — you stop relying on the routine. You can't. You have to actually know your stuff. And the providers I know who have been doing locums for a few years are just better clinicians than when they started." },
      { type: "h2", text: "What You Give Up — Honestly" },
      { type: "bullets", items: [
        { bold: "Community. ", rest: "W-2 providers build relationships with colleagues, surgeons, and staff over years. Independent contractors cycle in and out. This can be isolating, especially early." },
        { bold: "Predictability. ", rest: "Your income fluctuates with market demand and your own choices. Budgeting requires more discipline." },
        { bold: "Administrative shelter. ", rest: "Someone else manages your scheduling conflicts, credentialing paperwork, and HR issues. As an independent contractor, that's on you — or on systems you build." },
        { bold: "Institutional identity. ", rest: "For some providers, the affiliation with a specific hospital or health system matters. Independent practice means letting that go." },
      ]},
      { type: "takeaway", text: "Ownership changes your relationship to your work at every level — not just financially. The question isn't whether you want control. Most CRNAs do. The question is whether you're prepared to exercise it." },
    ]
  },
  {
    id: 5, num: "05", title: "Why Hospitals Fear the 1099 Provider", dur: "10 min",
    obj: "Understand the institutional and regulatory reasons facilities resist independent contractor classification — and recognize why that resistance is a signal of your leverage.",
    blocks: [
      { type: "p", text: "If independent contracting is such a better deal for the provider, why do so many facilities resist it? The answer is partly financial, partly regulatory, and partly about control. Understanding it changes how you read resistance — and how you respond to it." },
      { type: "h2", text: "The IRS Classification Problem" },
      { type: "p", text: "The IRS has specific criteria for distinguishing employees from independent contractors. The test centers on behavioral control (does the facility direct how, when, and where you work?), financial control (does the facility control how you're paid?), and the type of relationship. Facilities that misclassify employees as independent contractors face significant penalties — back payroll taxes, interest, and fines." },
      { type: "p", text: "This risk makes hospitals conservative. They default to W-2 classification not because it's better for providers, but because it's lower risk for the institution. The key point: the resistance isn't personal and it isn't permanent. It's institutional risk management. We go deeper on IRS classification tests in Course 2." },
      { type: "h2", text: "The Control Motive" },
      { type: "p", text: "Beyond the IRS question, hospitals want operational control. An independent contractor sets their own schedule, can work for other facilities simultaneously, and cannot be directed in the same way an employee can. The staffing agency model exists partly to solve this problem — it creates a layer between the facility and the 1099 provider that handles classification, scheduling, and liability." },
      { type: "h2", text: "Resistance as a Leverage Signal" },
      { type: "p", text: "Here is the reframe that matters most: if hospitals didn't need you, they wouldn't need to make staying attractive. The sign-on bonuses, the benefits packages, the seniority systems — these are retention tools. They exist because CRNA shortages are real, anesthesia is expensive to staff, and a provider who leaves is costly to replace." },
      { type: "pull", text: "They're not trying to keep you from leaving because leaving is bad for you. They're trying to keep you because leaving is bad for them." },
      { type: "takeaway", text: "Hospitals resist 1099 classification because of financial liability and operational control — not because independent practice is worse for providers. Understanding why they push back gives you a cleaner read on when resistance is negotiable and when it isn't." },
    ]
  },
  {
    id: 6, num: "06", title: "The Identity Shift: Thinking Like a Contractor", dur: "13 min",
    obj: "Internalize the practical and psychological frameworks that separate providers who thrive as independent contractors from those who bring a W-2 mindset to a 1099 arrangement.",
    blocks: [
      { type: "p", text: "You can have the entity set up, the contracts signed, the bank account open, and the first assignment booked — and still be operating with a W-2 mindset. The identity shift is not automatic. It requires intentional reorientation." },
      { type: "h2", text: "The Employee Mindset vs. The Owner Mindset" },
      { type: "table", headers: ["Employee Mindset", "Owner Mindset"], rows: [
        ["My rate is what they offer me", "My rate is what the market will support"],
        ["I show up and do my cases", "I deliver value and protect the relationship"],
        ["Stability means a steady employer", "Stability means diversified contracts"],
        ["Benefits are compensation", "Benefits are deductible business expenses"],
        ["Seniority earns me better cases", "My brand earns me requested cases"],
        ["HR solves my problems", "I solve my problems — or hire someone who does"],
        ["I wait to be assigned", "I design my schedule"],
      ]},
      { type: "h2", text: "What the Identity Shift Looks Like on Assignment" },
      { type: "p", text: "The providers who struggle in locums are usually not struggling because of clinical skill. They're struggling because they brought employee expectations into a contractor arrangement. They expect the facility to accommodate them. They push back on room assignments rather than demonstrating flexibility." },
      { type: "p", text: "The contractor mindset is different. You understand that you're there to solve a staffing problem. Your value is not just your clinical skill — it's your reliability, your adaptability, and your willingness to do what the facility actually needs. That's the brand." },
      { type: "nijma", text: "I tell people: figure out what the facility needs that nobody else wants to give them. Maybe it's 12-hour shifts. Maybe it's Fridays. Maybe it's being the person who'll take the GI rooms without complaining. Find that thing and offer it. Not forever — just until you've built enough goodwill that you're the last person they cut when they get permanent staff. I've been at two places now for four years doing 13-week contracts. That's not luck. That's knowing what they need and showing up and doing it." },
      { type: "h2", text: "Building Your Professional Brand" },
      { type: "bullets", items: [
        { bold: "Be easy to credential. ", rest: "Turn in paperwork on time, every time. This sounds trivial. It is consistently the differentiator." },
        { bold: "Be flexible with what they actually need. ", rest: "Not what's convenient for you — what they need. Then negotiate from that position of value." },
        { bold: "Build relationships with the people who matter. ", rest: "The scheduler, the charge nurse, the anesthesia group lead. Not just the surgeons." },
        { bold: "Don't be the rate-chaser. ", rest: "The CRNA who haggles every renewal and always has a better offer somewhere else is the first one cut when volume drops." },
      ]},
      { type: "h2", text: "Starting the Shift Before You Leave" },
      { type: "bullets", items: [
        { text: "Start tracking your effective hourly rate against what the market pays. Know the gap." },
        { text: "Identify which benefits you could replicate independently — and what they would actually cost." },
        { text: "Think about your clinical skill set as a portfolio. What are you good at? What have you let atrophy? What would command a premium?" },
        { text: "Have a rate in mind before you need one. Don't walk into your first contract conversation without an anchor." },
      ]},
      { type: "takeaway", text: "The providers who thrive in independent practice are not the ones with the most experience or the best clinical record. They're the ones who made the identity shift — from employee waiting to be assigned to contractor delivering value on their terms. That shift is available to you. It starts with how you see yourself." },
      { type: "assets", items: [
        { icon: "✅", assetType: "CHECKLIST", title: "Am I Ready for 1099?", desc: "Self-assessment across financial, clinical, and lifestyle readiness. 24 items, 6 must-haves, scoring guide." },
        { icon: "📋", assetType: "WORKSHEET", title: "Values & Priorities Worksheet", desc: "Clarify what you actually want from independent practice — designed to help you decide deliberately, not under pressure." },
      ]},
    ]
  },
];

/* ── INTRO SCREEN ────────────────────────────────────────────── */
function IntroScreen({ onStart }) {
  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "44px 32px 80px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.cyan, letterSpacing: ".08em", marginBottom: 14 }}>COURSE 01 OF 6  ·  THE ANESTHESIA COLLECTIVE</div>
      <h1 style={{ fontSize: 40, fontWeight: 800, color: C.dark, lineHeight: 1.15, marginBottom: 14, fontFamily: "'Georgia', serif" }}>The Mindset Shift</h1>
      <p style={{ fontSize: 18, color: "#555", lineHeight: 1.65, marginBottom: 28, fontFamily: "'Georgia', serif" }}>From Employee to Independent Practitioner. Everything you need to stop seeing the W-2 model as security — and start seeing it for what it actually is.</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        {["6 lessons", "~75 minutes", "Self-guided", "4 downloadable assets"].map((t, i) => (
          <span key={i} style={{ padding: "6px 14px", borderRadius: 20, background: "#eef2f4", fontSize: 12, fontWeight: 600, color: C.dark }}>{t}</span>
        ))}
      </div>
      <div style={{ height: 1, background: "#eee", marginBottom: 28 }} />
      <div style={{ fontSize: 11, fontWeight: 700, color: C.grey, letterSpacing: ".06em", marginBottom: 16 }}>WHAT YOU'LL UNDERSTAND AFTER THIS COURSE</div>
      {["Why the W-2 model is structured to benefit your employer, not you", "The real cost of your salary when you account for what you're not being paid", "The three fear patterns that keep CRNAs in arrangements they've outgrown", "What ownership of your practice looks like beyond just the financial", "Why hospital resistance to 1099 is a signal of your leverage", "The identity shift that separates contractors who thrive from those who don't"].map((t, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.dark, color: C.yellow, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
          <span style={{ fontSize: 15, color: "#333", lineHeight: 1.55 }}>{t}</span>
        </div>
      ))}
      <div style={{ height: 28 }} />
      <button onClick={onStart} style={{ display: "flex", alignItems: "center", gap: 10, background: C.dark, color: "#fff", border: "none", borderRadius: 8, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 36 }}>
        Start Course <span style={{ fontSize: 18 }}>→</span>
      </button>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.grey, letterSpacing: ".06em", marginBottom: 14 }}>INCLUDED ASSETS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[{ icon: "📄", label: "1-PAGER", title: "The W-2 Tax" }, { icon: "🧮", label: "CALCULATOR", title: "W-2 vs. 1099 Compensation" }, { icon: "✅", label: "CHECKLIST", title: "Am I Ready for 1099?" }, { icon: "📋", label: "WORKSHEET", title: "Values & Priorities" }].map((a, i) => (
          <div key={i} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #dde3ea", background: "#fafcfd", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 20 }}>{a.icon}</span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.cyan, letterSpacing: ".04em" }}>{a.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{a.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── COMPLETE SCREEN ─────────────────────────────────────────── */
function CompleteScreen({ onRestart }) {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "44px 32px 80px", textAlign: "center" }}>
      <div style={{ width: 68, height: 68, borderRadius: "50%", background: C.dark, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✓</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.cyan, letterSpacing: ".08em", marginBottom: 10 }}>COURSE 01 COMPLETE</div>
      <h2 style={{ fontSize: 32, fontWeight: 800, color: C.dark, lineHeight: 1.2, marginBottom: 14, fontFamily: "'Georgia', serif" }}>You've completed The Mindset Shift.</h2>
      <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7, marginBottom: 28, fontFamily: "'Georgia', serif" }}>You now understand why the W-2 model is structured the way it is, what it actually costs you, and what the shift to independent practice requires — financially, clinically, and psychologically. That's the foundation everything else builds on.</p>
      <div style={{ height: 1, background: "#eee", margin: "0 0 24px" }} />
      <div style={{ fontSize: 11, fontWeight: 700, color: C.grey, letterSpacing: ".06em", marginBottom: 14, textAlign: "left" }}>WHAT YOU COVERED</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 28, textAlign: "left" }}>
        {["Why W-2 is designed for your employer", "The real cost of your salary", "The three fear patterns", "Ownership vs. employment", "Why hospitals fear 1099", "The identity shift"].map((t, i) => (
          <div key={i} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #dde3ea", background: "#fafcfd" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.cyan }}>LESSON {String(i + 1).padStart(2, "0")}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginTop: 3 }}>{t}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 20px", background: C.teal + "20", border: `1px solid ${C.teal}`, borderRadius: 8, marginBottom: 24, textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 6 }}>Up next: Course 02 — The 1099 Landscape</div>
        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>Maps the full ecosystem: locum vs. 1099 vs. agency, the hospital/MSO/recruiter chain, IRS classification in depth, and how to read a market.</div>
      </div>
      <button style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.dark, color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
        Continue to Course 02 →
      </button>
      <br />
      <button onClick={onRestart} style={{ background: "none", border: "none", color: C.grey, fontSize: 13, cursor: "pointer" }}>↩ Restart Course 01</button>
    </div>
  );
}

/* ── MAIN APP ────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("intro");
  const [lessonIdx, setLessonIdx] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const contentRef = useRef(null);
  const lesson = LESSONS[lessonIdx];
  const progress = completed.size / LESSONS.length;

  const goLesson = useCallback((idx) => {
    setLessonIdx(idx);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, []);

  const markComplete = useCallback(() => {
    const next = new Set(completed);
    next.add(lessonIdx);
    setCompleted(next);
    if (lessonIdx < LESSONS.length - 1) {
      setLessonIdx(lessonIdx + 1);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    } else {
      setScreen("complete");
    }
  }, [completed, lessonIdx]);

  const Sidebar = () => (
    <div style={{ width: 252, background: C.dark, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: C.dark }}>A</div>
          <span style={{ color: C.teal, fontSize: 12, fontWeight: 700 }}>The Anesthesia Collective</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.teal + "70", letterSpacing: ".06em", marginBottom: 6 }}>COURSE 01 OF 6</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: 14 }}>The Mindset Shift</div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: C.teal + "80" }}>Progress</span>
            <span style={{ fontSize: 10, color: C.teal + "80" }}>{Math.round(progress * 100)}%</span>
          </div>
          <div style={{ height: 4, background: "#ffffff20", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", background: C.yellow, borderRadius: 4, width: `${progress * 100}%`, transition: "width .4s ease" }} />
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 20px" }}>
        {LESSONS.map((l, i) => {
          const active = screen === "lesson" && i === lessonIdx;
          const done = completed.has(i);
          return (
            <div key={i} onClick={() => { setScreen("lesson"); goLesson(i); }}
              style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 10px", borderRadius: 7, background: active ? "#ffffff15" : "transparent", cursor: "pointer", marginBottom: 2 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: done ? C.yellow : active ? "#fff" : "transparent", color: done ? C.dark : active ? C.dark : C.teal + "80", border: done || active ? "none" : `1px solid ${C.teal}30` }}>
                {done ? "✓" : l.num}
              </div>
              <span style={{ fontSize: 11, lineHeight: 1.4, color: active ? "#fff" : done ? C.teal : "#ffffff60", fontWeight: active || done ? 600 : 400, flex: 1 }}>{l.title}</span>
              {!done && <span style={{ fontSize: 10, color: "#ffffff35", flexShrink: 0 }}>{l.dur}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );

  const topBarWidth = screen === "complete" ? "100%" : screen === "intro" ? "0%" : `${(lessonIdx / LESSONS.length) * 100}%`;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fff", overflow: "hidden", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 3, background: "#f0f0f0", flexShrink: 0 }}>
          <div style={{ height: "100%", background: C.yellow, width: topBarWidth, transition: "width .4s ease" }} />
        </div>
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
          {screen === "intro" && <IntroScreen onStart={() => setScreen("lesson")} />}
          {screen === "complete" && <CompleteScreen onRestart={() => { setCompleted(new Set()); setLessonIdx(0); setScreen("intro"); }} />}
          {screen === "lesson" && (
            <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 32px 80px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ padding: "3px 10px", borderRadius: 20, background: C.dark, color: C.yellow, fontSize: 11, fontWeight: 700 }}>Lesson {lesson.num}</span>
                <span style={{ fontSize: 12, color: C.grey }}>{lesson.dur}</span>
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: C.dark, lineHeight: 1.2, marginBottom: 10, fontFamily: "'Georgia', serif" }}>{lesson.title}</h1>
              <div style={{ fontSize: 13, color: C.grey, marginBottom: 6 }}>By Nijma Yusuf, CRNA · Course 01: The Mindset Shift</div>
              <div style={{ padding: "12px 16px", borderRadius: 6, background: C.blue85 + "50", borderLeft: `3px solid ${C.teal}`, marginBottom: 32 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.cyan, letterSpacing: ".06em", marginBottom: 4 }}>LEARNING OBJECTIVE</div>
                <div style={{ fontSize: 14, color: C.dark, lineHeight: 1.6 }}>{lesson.obj}</div>
              </div>
              {lesson.blocks.map((block, i) => <Block key={i} block={block} />)}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingTop: 24, borderTop: "1px solid #eee" }}>
                <button onClick={() => lessonIdx > 0 ? goLesson(lessonIdx - 1) : setScreen("intro")}
                  style={{ background: "none", border: "1px solid #ddd", borderRadius: 7, padding: "10px 18px", fontSize: 13, cursor: "pointer", color: C.grey }}>
                  ← {lessonIdx > 0 ? "Previous" : "Overview"}
                </button>
                <button onClick={markComplete}
                  style={{ background: C.dark, border: "none", borderRadius: 7, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                  {lessonIdx === LESSONS.length - 1 ? "Complete Course ✓" : "Mark Complete & Continue →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
