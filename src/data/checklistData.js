export const checklistSections = [
  {
    id: "financial",
    icon: "$",
    num: "01",
    title: "Financial Readiness",
    subtitle: "If the money isn't structured right, nothing else matters.",
    warning: "Fewer than 4 of 8 checked in this section — stay W-2, build the financial foundation, and revisit in 3-6 months. Going 1099 without a financial buffer means taking bad contracts out of desperation.",
    warningThreshold: 4,
    items: [
      {
        text: "I have 3-6 months of living expenses in liquid savings.",
        description: "This is your gap insurance. Assignments can be delayed. Credentialing takes time. You need a buffer.",
        mustHave: true,
      },
      {
        text: "I know my current W-2 effective hourly rate including all benefits.",
        description: "Run the W-2 Tax calculator before you negotiate any 1099 rate. Know your actual number.",
        mustHave: true,
      },
      {
        text: "I have researched market rates for my specialty, region, and case type.",
        description: "Do not accept the first number an agency gives you. Know what the market pays.",
        mustHave: true,
      },
      {
        text: "I have identified a CPA who works with 1099 healthcare providers.",
        description: "Not just any CPA — one who understands S-Corp elections, Solo 401(k)s, and business deductions for clinical providers.",
        mustHave: true,
      },
      {
        text: "I understand the basics of S-Corp vs. LLC and why it matters at my income level.",
        description: null,
        mustHave: false,
      },
      {
        text: "I have a plan for health insurance: private marketplace, spouse's plan, or HDHP with HSA.",
        description: null,
        mustHave: false,
      },
      {
        text: "I have accounted for self-employment tax and quarterly estimated tax payments in my budget.",
        description: null,
        mustHave: false,
      },
      {
        text: "I have identified any sign-on bonus repayment obligations and have a plan to address them.",
        description: null,
        mustHave: false,
      },
    ],
  },
  {
    id: "clinical",
    icon: "+",
    num: "02",
    title: "Clinical Readiness",
    subtitle: "You will be in unfamiliar rooms, alone, from day one.",
    warning: "If you have been in one room, one machine, one case type for years — spend 6 more months diversifying your clinical exposure before you go independent.",
    warningThreshold: 4,
    items: [
      {
        text: "I have at least 1-2 years of hands-on independent CRNA practice post-graduation.",
        description: "Nijma's hard floor. You need enough independent experience to function confidently in a new environment without an established team around you.",
        mustHave: true,
      },
      {
        text: "I am comfortable handling the full range of general anesthesia cases independently.",
        description: "Locum facilities will not adjust their caseload for your learning curve.",
        mustHave: true,
      },
      {
        text: "I can adapt to different EHR systems, anesthesia machines, and institutional protocols.",
        description: null,
        mustHave: false,
      },
      {
        text: "I have experience managing at least one high-acuity case type without direct attending supervision.",
        description: null,
        mustHave: false,
      },
      {
        text: "I have not been in a preceptor-heavy role so long that my hands-on skills have atrophied.",
        description: "Honest answer only. A provider who has been sitting on a stool running maintenance cases gets found out fast.",
        mustHave: false,
      },
      {
        text: "I am comfortable speaking up in an unfamiliar environment when I have a clinical concern.",
        description: null,
        mustHave: false,
      },
      {
        text: "I hold or am actively pursuing multi-state licensure (IMLCC compact or individual state licenses).",
        description: null,
        mustHave: false,
      },
      {
        text: "My DEA registration, ACLS/PALS, and professional certifications are current for 12+ months.",
        description: null,
        mustHave: false,
      },
    ],
  },
  {
    id: "lifestyle",
    icon: "*",
    num: "03",
    title: "Lifestyle & Mindset Readiness",
    subtitle: "The practical and psychological requirements are real.",
    warning: null,
    warningThreshold: null,
    items: [
      {
        text: "I have thought through housing logistics for travel assignments: per diem, extended-stay, family impact.",
        description: null,
        mustHave: false,
      },
      {
        text: "I have had an honest conversation with my partner or family about what this lifestyle change means.",
        description: "Assignment gaps, travel weeks, income variability — these affect your household, not just you.",
        mustHave: false,
      },
      {
        text: "I am comfortable with income variability and have a plan for slower periods.",
        description: null,
        mustHave: false,
      },
      {
        text: "I can operate without the social and institutional structure of a permanent employer.",
        description: "No built-in colleagues. No department culture. No HR to call. Some people miss this more than they expect. Know yourself.",
        mustHave: false,
      },
      {
        text: "I am willing to manage the administrative work the W-2 model handled: credentialing, invoicing, tax filings.",
        description: null,
        mustHave: false,
      },
      {
        text: "I have mentally shifted from thinking of myself as an employee to thinking of myself as a business entity.",
        description: "You do not need to be fully there yet. But you need to be moving in that direction.",
        mustHave: true,
      },
      {
        text: "I understand that my reliability, flexibility, and behavior affect my rate and contract longevity.",
        description: null,
        mustHave: false,
      },
      {
        text: "I am moving toward something, not running away from a bad job.",
        description: "Locums does not fix a toxic culture you are escaping. It replaces structure with self-direction. Be ready for that.",
        mustHave: false,
      },
    ],
  },
];

export const scoringGuide = [
  { range: "22-24", label: "Ready to move.", desc: "Your foundation is solid. Start talking to agencies this month." },
  { range: "16-21", label: "Ready in 3-6 months.", desc: "Identify the gaps, build a plan, put a date on it." },
  { range: "Any MUST-HAVE unchecked", label: "Not yet.", desc: "That is the work. The checklist just gave you your roadmap." },
];
