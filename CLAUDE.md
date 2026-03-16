# TAC — The Anesthesia Collective
## Claude Code Project Context

> Read this file fully before doing anything. It contains the complete context for this project — brand, content, assets built, design decisions, and the primary task. Everything here was built in a prior Claude conversation and is being handed off to Claude Code for production.

---

## 1. PROJECT OVERVIEW

**The Anesthesia Collective (TAC)** is a specialized educational and career platform for CRNAs (Certified Registered Nurse Anesthetists). Its sister entity, **Direct to Locums (DTL)**, places anesthesia providers in locum/1099 positions.

The current build task is a **self-guided LMS course experience** for Course 01 of a 6-course series on 1099 and independent practice. The MVP is a React + Vite single-page app that feels like a polished product — think Substack reading experience meets Linear sidebar navigation.

**Key people:**
- **Omar** — decision-maker, business/strategy
- **Nijma Yusuf, CRNA** — subject matter expert, content voice, practicing anesthesiologist. Her first-person stories are the content differentiator.
- **Mo** — production / curriculum

---

## 2. BRAND SPEC

### Official Colors (from brand guidelines v1.0, November 2025)

```
DARK BLUE:   #044C60   (primary — headers, sidebar, dark surfaces)
TAC BLUE:    #A7D7DA   (accent — used on dark backgrounds)
CREAM:       #F7DBAD   (warm accent, callout backgrounds)
YELLOW:      #EFB023   (primary accent — CTAs, highlights, progress)
RED:         #C93A3A   (alerts, danger, opportunity cost)
DARK CYAN:   #18787F   (text highlight on light backgrounds)
LIGHT:       #F5F5F5   (background)
GREY:        #EAEAEA   (borders)
DARK GREY:   #626262   (muted text)

BLUE TINTS:
  85% tint:  #D9E4E7
  59% tint:  #98B6BE
  42% tint:  #6D97A3
  17% tint:  #2F6A7B  (blue17 — used for subheaders on dark)
  30% shade: #033543
  40% shade: #022E3A
```

### Typography
- **Primary:** Poppins (Regular, Medium, Bold) — headings, UI, body
- **Accent:** Poltawski Nowy (Bold Italic) — used sparingly for hero/display text
- **Fallback stack:** Georgia, serif for long-form reading content

### Brand Voice
- "Older sibling" — not lecturer. Peer-to-peer.
- Direct, no hedging, takes positions
- Specific to anesthesia — never generic
- Nijma's first-person stories are the content moat

### Accepted Color Combinations (per brand guidelines)
- Dark Blue + TAC Blue
- Dark Blue + Cream
- Dark Blue + Light
- Yellow Accent + Dark Blue
- Dark Cyan + Light

---

## 3. THE PRIMARY TASK: COURSE 01 LMS APP

### What to Build
A React + Vite single-page application that delivers Course 01 ("The Mindset Shift") as a polished self-guided learning experience.

### Stack
- **React 18 + Vite** (or Next.js if you prefer)
- **Tailwind CSS** for styling — or inline styles matching the brand spec above
- No backend required — all state in memory (this is a demo/stakeholder version)
- The app should be fully runnable with `npm run dev`

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  YELLOW progress bar (3px, full width top)              │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   SIDEBAR    │         READING PANE                     │
│   (#044C60)  │         (white, max-width 680px,         │
│   252px      │          centered, scrollable)           │
│   fixed      │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### Screens (4 states)
1. **Intro screen** — Course overview, outcome list, asset cards, Start button
2. **Lesson view** — Full lesson content with all block types
3. **Complete screen** — Summary grid, Course 02 teaser, restart option
4. (Sidebar is always visible across all screens)

### Sidebar Contents
- TAC logo mark (yellow "A" on dark blue square, 28px)
- Brand name: "The Anesthesia Collective"
- Course badge: "COURSE 01 OF 6"
- Course title: "The Mindset Shift"
- Progress bar (yellow fill, shows % complete)
- Lesson list — each item shows: lesson number circle, title, duration
  - Active: white highlight background, white text, filled circle
  - Completed: yellow circle with ✓, TAC blue text
  - Default: transparent, muted text, outlined circle

### Content Block Types (render these in the reading pane)

```
p          — body paragraph, Georgia serif, 17px, 1.85 line height
h2         — section header, 22px bold, bottom border in TAC blue
h3         — sub-header, 17px bold
pull       — pull quote, left border 5px teal, teal-tinted bg, italic Georgia
nijma      — "Nijma's Voice" callout: teal header bar with 💬 icon, italic body
takeaway   — dark blue box, yellow left border, "THE TAKEAWAY" label, white text
bullets    — bullet list with small cyan dots; items can have bold prefix
table      — standard data table; first column headers = dark blue bg; 
             if 3 columns, third header = yellow bg with dark text
calculator — inline embed of the W-2 vs. 1099 Calculator component
assetcard  — download card with icon, type badge, title, desc, Download button
assets     — renders multiple assetcard items
```

---

## 4. THE CALCULATOR COMPONENT

This is embedded inline inside Lesson 02. It is fully self-contained — all logic in React state.

**Inputs:**
- Annual base salary ($) — default 220000
- Employer 401(k) match (%) — default 4
- Health insurance cost ($/yr, user's share) — default 3600
- PTO weeks — default 4
- CME + license stipend ($/yr) — default 3000
- Malpractice value ($/yr est.) — default 4000
- Federal effective tax bracket (%) — default 32
- Clinical hours per week — default 40
- Target locum hourly rate ($/hr) — default 200
- S-Corp election toggle — default ON
- Sign-on bonus clawback toggle — default OFF (shows amount field when ON)

**Calculations:**
```js
const empHealth = health * 2.5;          // employer share estimate
const matchVal = salary * match / 100;
const fica = salary * 0.0765;            // employer FICA half
const ptoVal = (salary / 52) * pto;      // PTO baked into rate
const totalW2 = salary + matchVal + empHealth + mal + cme + ptoVal + fica;
const workHrs = hours * (52 - pto);
const se = totalW2 * (scorp ? 0.0765 : 0.153);  // SE tax burden
const ded = (health + mal + cme) * 0.75;          // deduction savings
const beHr = (totalW2 + se - ded) / workHrs;      // break-even hourly rate

const tgtAnnual = target * workHrs;
const w2net = totalW2 * (1 - taxrate / 100);
const loc1099 = Math.max(0,
  tgtAnnual 
  - (scorp ? tgtAnnual * 0.08 : tgtAnnual * 0.153)
  - (health + mal + cme + (scorp ? tgtAnnual * 0.265 : 0))
) * (1 - taxrate / 100);
const gain = loc1099 - w2net - (clawback ? clawbackAmt / 3 : 0);
const yr20 = gain * 20 * 1.04;           // 20-year opportunity cost (4% growth)
```

**Output cards (3):**
1. **Break-even rate** — dark blue bg, yellow value (`$XXX/hr`)
2. **Annual gain at $[target]/hr** — cream/yellow bg, shows +/- vs W-2
3. **20-year opportunity cost** — red-tinted bg, red value

**Breakdown table:** Shows each W-2 component itemized + total + break-even hourly

**Insight line:** Dynamic text based on whether target > break-even, and by how much

**Visual design:**
- Dark blue header bar with "TAC" wordmark in yellow
- Blue17 sub-header with yellow bottom border (3px)
- Two-column input grid
- Toggle switches (custom, not checkbox): dark blue when ON

---

## 5. LESSON DATA (COMPLETE)

All 6 lessons are fully written. The complete lesson data array is in the file:
`/home/claude/tac_lms.jsx`

Copy that file's `LESSONS` constant directly — do not rewrite the content.

### Lesson Summary
```
L01 — Why the W-2 Model Was Designed to Keep You Dependent (15 min)
L02 — The Real Cost of Your W-2 Salary (12 min) [Calculator embedded here]
L03 — The Psychology of Financial Independence (14 min)
L04 — Ownership vs. Employment (11 min)
L05 — Why Hospitals Fear the 1099 Provider (10 min)
L06 — The Identity Shift: Thinking Like a Contractor (13 min)
```

### Assets Embedded Per Lesson
- **End of L02:** 1-Pager asset card ("The W-2 Tax")
- **End of L06:** Two asset cards — Checklist + Worksheet

---

## 6. ASSETS ALREADY BUILT

All files are in `/home/claude/` and `/mnt/user-data/outputs/`:

| File | Type | Description |
|------|------|-------------|
| `TAC_C01_MindsetShift_DRAFT.docx` | Word | Full course content doc, 6 lessons, all blocks |
| `TAC_C01_W2Tax_1Pager.docx` | Word | The W-2 Tax 1-pager |
| `TAC_C01_ReadyChecklist.docx` | Word | "Am I Ready for 1099?" 24-item checklist |
| `TAC_C01_ValuesPriorities_Worksheet.docx` | Word | Values & priorities self-assessment |
| `TAC_C01_W2vs1099_Calculator.html` | HTML | Standalone calculator (same logic as React component) |
| `TAC_1099_Course_Curriculum.docx` | Word | Full 6-course curriculum with all LMS assets mapped |
| `tac_lms.jsx` | React | Complete LMS app — use this as the starting point |

---

## 7. DESIGN DECISIONS ALREADY MADE

These are finalized. Do not revisit unless asked.

- **Sidebar color:** `#044C60` dark blue — fixed, not collapsible in v1
- **Progress bar:** Yellow (`#EFB023`), 3px, full width at very top of viewport
- **Reading pane:** White background, max-width 680px, centered
- **Lesson titles:** Georgia serif, 32px, 800 weight
- **Byline:** "By Nijma Yusuf, CRNA · Course 01: The Mindset Shift" — appears under every lesson title
- **Learning objective block:** Teal left border, blue85 background, "LEARNING OBJECTIVE" label in dark cyan
- **Navigation:** Previous button (outlined) left, "Mark Complete & Continue →" right (dark blue)
- **Completion state:** Checkmark circle (yellow bg, dark check), lesson title goes teal in sidebar
- **No localStorage** — progress is session-only in v1. This is intentional for the demo.
- **"Download" buttons on asset cards** are visual in v1 — wire up to actual file paths when assets are served statically

---

## 8. THINGS TO IMPROVE IN CLAUDE CODE (vs. the artifact attempt)

The `tac_lms.jsx` file is the complete working implementation. In Claude Code, improve:

1. **Smooth scroll to top** on lesson change — `behavior: 'smooth'` 
2. **Lesson completion animation** — brief checkmark animation when marking complete
3. **Mobile responsive sidebar** — collapse to hamburger on screens < 768px
4. **Keyboard navigation** — left/right arrow keys for lesson nav
5. **Reading progress indicator** — subtle scroll progress within a single lesson (optional secondary bar inside reading pane)
6. **Asset download wiring** — when static files are served, wire the Download buttons to actual file URLs
7. **Transition between lessons** — subtle fade or slide when navigating
8. **"Course 02 teaser" on complete screen** — currently a static block; make it feel more like a real upsell/next step

---

## 9. FILE STRUCTURE RECOMMENDATION

```
tac-lms/
├── public/
│   └── assets/
│       ├── TAC_C01_W2Tax_1Pager.docx
│       ├── TAC_C01_ReadyChecklist.docx
│       ├── TAC_C01_ValuesPriorities_Worksheet.docx
│       └── TAC_C01_W2vs1099_Calculator.html
├── src/
│   ├── App.jsx              (main app shell — sidebar + routing)
│   ├── components/
│   │   ├── Calculator.jsx   (W-2 vs 1099 calculator)
│   │   ├── Block.jsx        (content block renderer)
│   │   ├── Sidebar.jsx      (lesson nav sidebar)
│   │   ├── IntroScreen.jsx  (course overview)
│   │   └── CompleteScreen.jsx
│   ├── data/
│   │   └── lessons.js       (LESSONS array — copy from tac_lms.jsx)
│   └── constants/
│       └── brand.js         (color constants C = {...})
├── index.html
├── package.json
└── vite.config.js
```

---

## 10. COURSE SERIES CONTEXT (for future courses)

This is Course 01 of 6. The series covers:

| # | Title | Key Topics |
|---|-------|-----------|
| 01 | The Mindset Shift | W-2 identity, fear patterns, employer dependency |
| 02 | The 1099 Landscape | Locum vs 1099 vs agency, IRS rules, markets, staffing ecosystem |
| 03 | Building Your Business | LLC vs S-Corp, entity setup, banking, payroll |
| 04 | Taxes & Wealth Strategy | Deductions, Solo 401k, backdoor Roth, S-Corp optimization |
| 05 | Insurance & Risk Management | Malpractice, disability, tail coverage, umbrella |
| 06 | Contracts, Negotiation & Income Maximization | Rate strategy, non-competes, personal brand, stacking contracts |

The LMS architecture should accommodate all 6 courses — the sidebar "Course 01 of 6" badge and "Continue to Course 02 →" CTA on the complete screen are already wired for this.

---

## 11. CONTENT GAPS (flagged in the course doc)

The course Word doc (`TAC_C01_MindsetShift_DRAFT.docx`) contains yellow "CONTENT GAP" boxes marking 5 spots where Nijma's specific first-person input is still needed:

1. **L01** — Specific case types she wasn't doing during the preceptor trap
2. **L02** — Her actual W-2 vs. first locum rate comparison (she's confirmed ~$160-200/hr range)
3. **L03** — Her personal identity shift moment
4. **L05** — A facility that pushed back on 1099 classification
5. **L06** — A relationship that worked + one that went wrong with an agency

These are placeholders in the LMS content too. Leave them as written — they're still good content; the gaps are for additional specificity Nijma will provide.

---

## 12. QUICK START

```bash
# Clone / create project
npm create vite@latest tac-lms -- --template react
cd tac-lms
npm install

# Copy tac_lms.jsx contents into src/ per the file structure above
# Run
npm run dev
```

The complete working implementation is in `/home/claude/tac_lms.jsx`.
Start there. Refactor into components per the file structure in Section 9.
Then apply the improvements listed in Section 8.

---

*This document was generated from a Claude.ai project conversation. All content, brand specs, and code were produced in that session. Last updated: March 2025.*
