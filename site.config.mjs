// Site-wide settings for the build. Change SITE_URL when the production domain is known:
// every canonical, hreflang, Open Graph and sitemap URL is derived from it.
export const SITE_URL = process.env.SITE_URL || "https://www.thamar.world/";

export const SITE = {
  name: { ar: "ثَمَر", en: "THAMAR" },
  tagline: { ar: "من تحديات المدينة إلى ثمار مشتركة", en: "From city challenges to shared prosperity" },
  themeColor: "#0B4F4A",
  themeColorDark: "#0B1514",
  publisher: { ar: "سنديان للريادة والتطوير", en: "Sindyan for Entrepreneurship & Development" },
  locale: { ar: "ar_JO", en: "en_US" },
  twitter: "", // e.g. "@thamar_city" — leave empty until an account exists
};

// Indexable public pages. Each entry is pre-rendered in both languages:
//   ar → /<path>/   en → /en/<path>/
export const PAGES = [
  {
    route: "home",
    type: "WebPage",
    title: {
      ar: "ثَمَر — منصة تحويل تحديات المدن إلى أبحاث ومشاريع ووظائف",
      en: "THAMAR — Turning city challenges into ventures and jobs",
    },
    description: {
      ar: "منصة تشاركية من البنك الإسلامي للتنمية وسنديان تجمع البلدية والجامعة والقطاع الخاص والمجتمع لتحويل تحديات المدينة إلى أبحاث وشركات ناشئة ووظائف.",
      en: "An IsDB and Sindyan platform where municipality, universities, business and residents turn city challenges into research, startups and jobs every month.",
    },
  },
  {
    route: "about",
    type: "AboutPage",
    title: { ar: "من نحن — ثَمَر: ثمرة الجهد المشترك", en: "About THAMAR — the fruit of shared effort" },
    description: {
      ar: "ثَمَر برنامج ومنصة يطلقهما البنك الإسلامي للتنمية بالشراكة مع سنديان للريادة والتطوير لتحويل تحديات المدن إلى أبحاث ومشاريع ووظائف، بإشراف غرف التجارة.",
      en: "THAMAR is an Islamic Development Bank and Sindyan program and platform that turns city challenges into research, ventures and jobs.",
    },
  },
  {
    route: "how",
    type: "WebPage",
    title: { ar: "كيف تعمل ثَمَر — من الحاجة إلى الأثر", en: "How THAMAR works — from need to impact" },
    description: {
      ar: "سبع مراحل ودورة عمل شهرية في كل مدينة: رصد التحديات، التصويت المجتمعي، أفضل عشرة تحديات، الأبحاث الجامعية، الشركات الناشئة، التنفيذ، وقياس الأثر.",
      en: "Seven stages and a monthly cycle in every city: collect challenges, community vote, top ten, university research, startup ventures, delivery and impact measurement.",
    },
  },
  {
    route: "users",
    type: "WebPage",
    title: { ar: "أنواع المستخدمين والصلاحيات — ثَمَر", en: "User types, roles and permissions — THAMAR" },
    description: {
      ar: "تعرّف على أدوار المنصة: الشباب، الباحثون، الجامعات، الشركات الناشئة، الشركات، الجهات الحكومية، الخبراء والمستثمرون، وما يقدمه ويكسبه كل دور.",
      en: "Meet the platform's roles — youth, researchers, universities, startups, companies, government, experts and investors — what each contributes, gains and can access.",
    },
  },
  {
    route: "faq",
    type: "FAQPage",
    title: { ar: "الأسئلة الشائعة — ثَمَر", en: "Frequently asked questions — THAMAR" },
    description: {
      ar: "إجابات عن أسئلة المشاركة في ثَمَر: من يستطيع المشاركة، كيف يتم التصويت واختيار التحديات، الذكاء الاصطناعي، البيانات والخصوصية، والتمويل.",
      en: "Answers about taking part in THAMAR: who can join, how voting and challenge selection work, AI safeguards, data and privacy, and funding.",
    },
  },
  {
    route: "contact",
    type: "ContactPage",
    title: { ar: "تواصل معنا — ثَمَر", en: "Contact THAMAR — partners and cities" },
    description: {
      ar: "نرحب بالمدن والجامعات والشركات والجهات الحكومية الراغبة بالشراكة في برنامج ثَمَر لتنمية المدن.",
      en: "Cities, universities, companies and government bodies interested in partnering on the THAMAR city development program — get in touch.",
    },
  },
  {
    route: "privacy",
    type: "WebPage",
    title: { ar: "سياسة الخصوصية — ثَمَر", en: "Privacy policy — THAMAR" },
    description: {
      ar: "كيف تتعامل منصة ثَمَر مع بيانات المستخدمين وتحميها.",
      en: "How the THAMAR platform collects, uses and protects user data.",
    },
    priority: 0.3,
  },
  {
    route: "terms",
    type: "WebPage",
    title: { ar: "شروط الاستخدام — ثَمَر", en: "Terms of use — THAMAR" },
    description: {
      ar: "قواعد المشاركة وشروط استخدام منصة ثَمَر.",
      en: "Rules of participation and terms of use for the THAMAR platform.",
    },
    priority: 0.3,
  },
];
