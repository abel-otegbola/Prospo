export const FAQ_CATEGORIES = ["General", "Pricing", "API"] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-prospo",
    category: "General",
    question: "What is Prospo and how does it help me get clients?",
    answer:
      "Prospo helps you turn your past work into high-converting case studies and combine them with targeted lead outreach. Instead of just applying for jobs, you show proof of results and reach out to the right clients directly.",
  },
  {
    id: "free-plan",
    category: "General",
    question: "Can I use Prospo for free?",
    answer:
      "Yes. The free plan lets you create one case study and access a limited number of leads so you can test how Prospo helps you attract and convert clients.",
  },
  {
    id: "how-leads-work",
    category: "General",
    question: "What kind of leads do I get on Prospo?",
    answer:
      "Prospo provides curated lead opportunities based on real businesses and potential clients. You can use these leads to reach out directly with your case studies and pitch your services.",
  },
  {
    id: "case-studies",
    category: "General",
    question: "Why are case studies important on Prospo?",
    answer:
      "Case studies act as proof of your work. Instead of telling clients what you can do, you show them real problems you’ve solved and the results you achieved, which increases your chances of getting hired.",
  },
  {
    id: "upgrade-benefits",
    category: "Pricing",
    question: "What do I get when I upgrade?",
    answer:
      "Upgrading gives you more leads, more case studies, and better visibility. This means more outreach opportunities and a higher chance of landing clients consistently.",
  },
  {
    id: "change-plan",
    category: "Pricing",
    question: "Can I upgrade or downgrade my plan anytime?",
    answer:
      "Yes. You can switch plans at any time. Your access updates immediately, and billing is adjusted based on your current subscription.",
  },
  {
    id: "cancel",
    category: "Pricing",
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. You can cancel at any time from your dashboard. Your plan will remain active until the end of your billing cycle, and you won’t be charged again.",
  },
  {
    id: "lifetime",
    category: "Pricing",
    question: "What does the lifetime plan include?",
    answer:
      "The lifetime plan is a one-time payment that gives you long-term access to Prospo features, including lead access and case study creation, without recurring monthly charges.",
  },
  {
    id: "results",
    category: "General",
    question: "Will Prospo guarantee me clients?",
    answer:
      "No platform can guarantee clients. Prospo provides the tools, leads, and structure to improve your chances by helping you present your work better and reach out to the right people consistently.",
  },
  {
    id: "who-is-it-for",
    category: "General",
    question: "Who is Prospo best suited for?",
    answer:
      "Prospo is built for freelancers, developers, designers, and agencies who want to move away from crowded job platforms and start getting clients through direct outreach and proven work.",
  },
  {
    id: "support",
    category: "General",
    question: "What kind of support do you offer?",
    answer:
      "We offer email support for all users. Paid plans receive faster response times and priority assistance when needed.",
  },
  {
    id: "api-access",
    category: "API",
    question: "Do you provide API access?",
    answer:
      "Yes. API access is available on the Enterprise plan, allowing you to integrate Prospo data and workflows into your own systems.",
  },
];
