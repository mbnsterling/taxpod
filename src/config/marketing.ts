// Static marketing content for homepage and features page.

export const heroContent = {
  badge: "NIGERIA TAX ACT 2025 READY",
  headline: "File taxes",
  headlineAccent: "without stress.",
  subtext:
    "Join 10,000+ Nigerian entrepreneurs who automated their tax compliance. No jargon, no hidden fees, just pure peace of mind.",
  primaryCta: { label: "Start Filing Free", href: "/login" },
  secondaryCta: { label: "Watch Demo", href: "#demo" },
  widget: {
    label: "Your estimated tax liability",
    amount: "₦56,500.00",
    note: "After all eligible deductions",
    badge: "✓ Verified 100% Secure",
  },
};

export const statsItems = [
  { value: "10k+", label: "Taxpayers Served" },
  { value: "₦40K", label: "Avg. Refund Captured" },
  { value: "98%", label: "Filing Accuracy" },
  { value: "4.8/5", label: "User Rating" },
];

export const homepageFeatures = [
  {
    id: "calculator",
    title: "Smart Tax Calculator",
    description:
      "Automatically computes your PIT or CIT with all eligible deductions, reliefs, and the latest 2025 bands applied.",
    iconColor: "blue" as const,
    link: "/features#calculator",
  },
  {
    id: "wizard",
    title: "Guided Filing Wizard",
    description:
      "Step-by-step prompts walk you through every schedule — no tax expertise required.",
    iconColor: "orange" as const,
    link: "/features#wizard",
  },
  {
    id: "reminders",
    title: "Deadline Reminders",
    description:
      "Automated SMS and email alerts ensure you never miss a FIRS or state revenue service deadline.",
    iconColor: "pink" as const,
    link: "/features#reminders",
  },
  {
    id: "reports",
    title: "Instant PDF Reports",
    description:
      "Generate submission-ready tax returns and assessment reports in a single click.",
    iconColor: "purple" as const,
    link: "/features#reports",
  },
];

export const enterpriseCard = {
  eyebrow: "ENTERPRISE",
  headline: "Scale with confidence.",
  description:
    "Dedicated onboarding, multi-entity filing, bulk TIN validation, and a direct line to a certified tax advisor.",
  cta: { label: "Talk to Sales", href: "/contact" },
};

export const processSteps = [
  {
    number: "01",
    title: "Tell us about yourself",
    description:
      "Enter your business type, TIN, and set up your profile in under 2 minutes.",
  },
  {
    number: "02",
    title: "Add your numbers",
    description:
      "Import payslips, upload receipts, or key in income and expense figures — our wizard guides every step.",
  },
  {
    number: "03",
    title: "File with confidence",
    description:
      "Review your computed liability, generate your return, and submit directly to FIRS — all from one dashboard.",
  },
];

export const testimonials = [
  {
    id: "t1",
    name: "Chioma A.",
    role: "Fashion Designer",
    location: "Lagos",
    initials: "CA",
    quote:
      "TaxEase made it so simple — I filed my return in 20 minutes! I always dreaded tax season but now it&rsquo;s almost effortless.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Emeka O.",
    role: "Software Engineer",
    location: "Abuja",
    initials: "EO",
    quote:
      "The calculator picked up deductions I had been missing for years. Saved me a significant amount on my annual PIT. Highly recommend.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Fatima B.",
    role: "Small Business Owner",
    location: "Kano",
    initials: "FB",
    quote:
      "As a first-time filer, the guided wizard took all the confusion away. I knew exactly what I owed and why. Brilliant product.",
    rating: 5,
  },
];

export const ctaBanner = {
  headline: "Join the future of\nNigerian tax filing.",
  subtext:
    "Takes less than 5 minutes to set up your profile. No credit card required.",
  cta: { label: "Get Started Now", href: "/login" },
  trustItems: ["✓ No credit card", "✓ Cancel anytime", "✓ FIRS compliant"],
};

// ── Features page content ───────────────────────────────────────────────────

export const featuresHero = {
  badge: "BUILT FOR EVERY NIGERIAN",
  headline: "Powerful tools,",
  headlineAccent: "for every taxpayer.",
  subtext:
    "Whether you&rsquo;re an employee, a founder scaling a startup, or an accountant managing multiple clients — TaxEase has a dedicated workflow for you. All fully compliant with the Nigeria Tax Act 2025.",
  primaryCta: { label: "Start Filing Free", href: "/login" },
  anchorLinks: [
    { label: "Employees", href: "#employees" },
    { label: "Founders & SMEs", href: "#founders" },
    { label: "Accountants", href: "#accountants" },
  ],
};

export const personaGroups = [
  {
    id: "employees",
    persona: "Employees",
    eyebrow: "FOR SALARIED WORKERS",
    headline: "File your personal\nincome tax in minutes.",
    description:
      "If you earn a salary or freelance income in Nigeria, TaxEase automates every step — from computing your consolidated relief allowance to generating your e-TCC.",
    iconColor: "blue" as const,
    features: [
      "Automatic PIT computation with 2025 tax bands and CRA",
      "Payslip import and income reconciliation",
      "Pension, NHF, and NHIS relief deductions",
      "e-TCC generation for loan and visa applications",
      "Deadline alerts for April 30 annual filing",
    ],
    cta: { label: "Get started free", href: "/login" },
  },
  {
    id: "founders",
    persona: "Founders & SMEs",
    eyebrow: "FOR BUSINESSES",
    headline: "CIT filing designed\nfor growing businesses.",
    description:
      "From small shops to fast-scaling tech startups — TaxEase handles Companies Income Tax, VAT returns, and development levy in one unified dashboard.",
    iconColor: "orange" as const,
    features: [
      "Companies Income Tax (CIT) filing",
      "VAT computation and return filing",
      "Development Levy management",
      "Multi-year tax history and audit trail",
      "Small-business relief and incentive tracking",
    ],
    cta: { label: "See business plans", href: "/pricing" },
  },
  {
    id: "accountants",
    persona: "Accountants & Tax Pros",
    eyebrow: "FOR TAX PROFESSIONALS",
    headline: "Manage all your\nclients in one place.",
    description:
      "A professional portal that lets you onboard clients, run bulk filings, and produce FIRS-ready reports — all without switching tools.",
    iconColor: "purple" as const,
    features: [
      "Multi-client dashboard with TIN bulk validation",
      "Collaborative review and approval workflows",
      "White-label PDF reports for client delivery",
      "API access for practice management integration",
      "Priority support and dedicated account manager",
    ],
    cta: { label: "Talk to sales", href: "/contact" },
  },
];

export const crossCuttingFeatures = [
  {
    id: "compliance",
    title: "Nigeria Tax Act 2025 Ready",
    description:
      "Every calculation, band, relief, and deadline is automatically updated to reflect the 2025 Tax Act and all supporting reform legislation.",
    iconColor: "green" as const,
  },
  {
    id: "security",
    title: "Bank-Grade Security",
    description:
      "AES-256 encryption at rest and in transit. Your tax data is stored on Nigerian soil and never shared with third parties.",
    iconColor: "blue" as const,
  },
  {
    id: "reminders",
    title: "Multi-Channel Reminders",
    description:
      "SMS, email, and in-app push notifications keep you ahead of every FIRS and state revenue service deadline.",
    iconColor: "pink" as const,
  },
  {
    id: "reports",
    title: "Instant Submission-Ready Reports",
    description:
      "One-click PDF generation produces FIRS-compliant tax returns and assessment summaries in seconds.",
    iconColor: "orange" as const,
  },
  {
    id: "history",
    title: "Tax History & Audit Trail",
    description:
      "Every filing, amendment, and payment is logged with full timestamps — ready for any FIRS review or self-audit.",
    iconColor: "purple" as const,
  },
  {
    id: "support",
    title: "Human Support When You Need It",
    description:
      "Live chat, email support, and access to certified Nigerian tax advisors — because sometimes you just need to talk to a person.",
    iconColor: "green" as const,
  },
];
