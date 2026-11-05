// Generates the public pages, one small HTML file per route and language, from scripts/page.html:
//
//   index.html, about/index.html, … (Arabic)      en/index.html, en/about/index.html, … (English)
//
// Each page carries its own <head> (title, description, canonical, hreflang, Open Graph, Twitter,
// JSON-LD) plus a static summary of the page that search engines can read before app.js takes over.
// Also writes 404.html, sitemap.xml, robots.txt and site.webmanifest. No dependencies.
//
// Usage: npm run pages            (SITE_URL=https://example.org/ npm run pages to override)
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES, SITE, SITE_URL } from "../site.config.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const LANGS = ["ar", "en"];

const site = new URL(SITE_URL.endsWith("/") ? SITE_URL : SITE_URL + "/");
const abs = (p) => new URL(p, site).href;
const pagePath = (route, lang) => (lang === "en" ? "en/" : "") + (route === "home" ? "" : route + "/");
const pageUrl = (route, lang) => abs(pagePath(route, lang));
const baseFor = (route, lang) => "../".repeat(pagePath(route, lang).split("/").length - 1);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const UI = {
  skip: { ar: "تخطَّ إلى المحتوى", en: "Skip to content" },
  noscript: {
    ar: "تعمل لوحات المنصة التفاعلية بتفعيل JavaScript.",
    en: "The platform's interactive boards need JavaScript.",
  },
  nav: {
    home: { ar: "الرئيسية", en: "Home" },
    about: { ar: "من نحن", en: "About us" },
    how: { ar: "كيف تعمل المنصة", en: "How it works" },
    users: { ar: "أنواع المستخدمين", en: "User types" },
    faq: { ar: "الأسئلة الشائعة", en: "FAQ" },
    contact: { ar: "تواصل معنا", en: "Contact us" },
    privacy: { ar: "سياسة الخصوصية", en: "Privacy policy" },
    terms: { ar: "شروط الاستخدام", en: "Terms of use" },
  },
  otherLang: { ar: "English", en: "العربية" },
};

// The FAQ lives in app.js as `const FAQ=[[[q_ar,q_en],[a_ar,a_en]], …];` — reuse it rather than duplicate it.
async function loadFaq(js) {
  const m = js.match(/const FAQ=(\[[\s\S]*?\]\]\]);/);
  if (!m) throw new Error("FAQ array not found in app.js");
  return Function(`"use strict";return (${m[1]})`)();
}

// ---------------------------------------------------------------- head
function head(page, lang, faq) {
  const url = pageUrl(page.route, lang);
  const other = lang === "ar" ? "en" : "ar";
  const base = baseFor(page.route, lang);
  const title = page.title[lang];
  const desc = page.description[lang];
  const img = abs(`assets/og-${lang}.jpg`);
  const imgAlt = `${SITE.name[lang]} — ${SITE.tagline[lang]}`;
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta name="robots" content="index,follow,max-image-preview:large">`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${pageUrl(page.route, l)}">`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl(page.route, "ar")}">`,
    `<meta name="theme-color" content="${SITE.themeColor}">`,
    `<meta name="application-name" content="${esc(SITE.name[lang])}">`,
    `<link rel="icon" href="${base}assets/favicon-32.png" sizes="32x32" type="image/png">`,
    `<link rel="icon" href="${base}assets/icon-192.png" sizes="192x192" type="image/png">`,
    `<link rel="apple-touch-icon" href="${base}assets/apple-touch-icon.png">`,
    `<link rel="manifest" href="${base}site.webmanifest">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(SITE.name[lang])}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:locale" content="${SITE.locale[lang]}">`,
    `<meta property="og:locale:alternate" content="${SITE.locale[other]}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:type" content="image/jpeg">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(imgAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${img}">`,
    `<meta name="twitter:image:alt" content="${esc(imgAlt)}">`,
    ...(SITE.twitter ? [`<meta name="twitter:site" content="${SITE.twitter}">`] : []),
    jsonld(structuredData(page, lang, faq)),
  ].join("\n");
}

// ---------------------------------------------------------------- JSON-LD
function structuredData(page, lang, faq) {
  const url = pageUrl(page.route, lang);
  const home = pageUrl("home", lang);
  const orgId = abs("#organization");
  const siteId = abs("#website");
  const webPage = {
    "@type": page.type,
    "@id": url + "#webpage",
    url,
    name: page.title[lang],
    description: page.description[lang],
    inLanguage: lang,
    isPartOf: { "@id": siteId },
    about: { "@id": orgId },
    primaryImageOfPage: { "@type": "ImageObject", url: abs(`assets/og-${lang}.jpg`), width: 1200, height: 630 },
  };
  if (page.route !== "home")
    webPage.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name[lang], item: home },
        { "@type": "ListItem", position: 2, name: UI.nav[page.route][lang], item: url },
      ],
    };
  if (page.type === "FAQPage")
    webPage.mainEntity = faq.map(([q, a]) => ({
      "@type": "Question",
      name: q[lang === "ar" ? 0 : 1],
      acceptedAnswer: { "@type": "Answer", text: a[lang === "ar" ? 0 : 1] },
    }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: "THAMAR",
        alternateName: "ثَمَر",
        url: abs(""),
        logo: { "@type": "ImageObject", url: abs("assets/icon-512.png"), width: 512, height: 512 },
        slogan: SITE.tagline[lang],
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        name: SITE.name[lang],
        alternateName: SITE.name[lang === "ar" ? "en" : "ar"],
        url: home,
        inLanguage: lang,
        publisher: { "@id": orgId },
      },
      webPage,
    ],
  };
}

// ---------------------------------------------------------------- static summary (replaced by app.js on load)
function summary(page, lang, faq) {
  const base = baseFor(page.route, lang);
  const link = (r, l = lang) => `${base || "./"}${pagePath(r, l)}`;
  const i = lang === "ar" ? 0 : 1;
  const faqHtml =
    page.type === "FAQPage"
      ? faq.map(([q, a]) => `<details class="faq"><summary><b>${esc(q[i])}</b></summary><p class="small muted">${esc(a[i])}</p></details>`).join("")
      : "";
  return `<div id="pub"><main class="pmain" id="main"><section class="lsec pin stack">
<span class="eyebrow">${esc(SITE.name[lang])} · ${esc(SITE.tagline[lang])}</span>
<h1>${esc(page.title[lang].split(" — ")[page.route === "home" ? 1 : 0] || page.title[lang])}</h1>
<p>${esc(page.description[lang])}</p>${faqHtml}
<nav class="row small" aria-label="${lang === "ar" ? "صفحات الموقع" : "Site pages"}">${PAGES.map((p) => `<a href="${link(p.route)}">${UI.nav[p.route][lang]}</a>`).join(" · ")} · <a href="${link(page.route, lang === "ar" ? "en" : "ar")}" hreflang="${lang === "ar" ? "en" : "ar"}">${UI.otherLang[lang]}</a></nav>
</section></main></div>`;
}

// ---------------------------------------------------------------- write
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : ""));

async function main() {
  const [tpl, css, js] = await Promise.all(
    ["scripts/page.html", "app.css", "app.js"].map((f) => readFile(path.join(ROOT, f), "utf8")),
  );
  const faq = await loadFaq(js);
  const VER = createHash("sha256").update(css + js).digest("hex").slice(0, 10);
  const write = async (rel, content) => {
    await mkdir(path.dirname(path.join(ROOT, rel)), { recursive: true });
    await writeFile(path.join(ROOT, rel), content);
  };
  const render = (lang, base, headHtml, pub, cfg) =>
    fill(tpl, {
      LANG: lang,
      DIR: lang === "ar" ? "rtl" : "ltr",
      HEAD: headHtml,
      BASE: base,
      VER,
      SKIP: UI.skip[lang],
      NOSCRIPT: UI.noscript[lang],
      PUB: pub,
      CFG: JSON.stringify(cfg),
    });

  for (const page of PAGES)
    for (const lang of LANGS) {
      const base = baseFor(page.route, lang);
      await write(
        pagePath(page.route, lang) + "index.html",
        render(lang, base, head(page, lang, faq), summary(page, lang, faq), { base, route: page.route, lang }),
      );
    }

  // 404: GitHub Pages serves it from any depth, so it uses absolute asset paths. Not indexed.
  const absBase = site.pathname;
  await write(
    "404.html",
    render(
      "ar",
      absBase,
      [
        `<title>${esc(SITE.name.ar)} — الصفحة غير موجودة</title>`,
        `<meta name="robots" content="noindex">`,
        `<link rel="icon" href="${absBase}assets/favicon-32.png" type="image/png">`,
      ].join("\n"),
      `<div id="pub" hidden></div>`,
      { base: absBase },
    ),
  );

  await write(
    "site.webmanifest",
    JSON.stringify(
      {
        name: `${SITE.name.ar} THAMAR`,
        short_name: SITE.name.ar,
        description: PAGES[0].description.ar,
        lang: "ar",
        dir: "rtl",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#F3F7F6",
        theme_color: SITE.themeColor,
        icons: [
          { src: "assets/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "assets/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "assets/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      null,
      2,
    ) + "\n",
  );

  const today = new Date().toISOString().slice(0, 10);
  const entries = PAGES.flatMap((page) =>
    LANGS.map(
      (lang) => `  <url>
    <loc>${pageUrl(page.route, lang)}</loc>
${LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(page.route, l)}"/>`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(page.route, "ar")}"/>
    <lastmod>${today}</lastmod>
    <priority>${(page.priority ?? (page.route === "home" ? 1 : 0.7)).toFixed(1)}</priority>
  </url>`,
    ),
  );
  await write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`,
  );
  // Crawlers only read robots.txt at a domain root; on a project sub-path, also submit the sitemap in Search Console.
  await write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${abs("sitemap.xml")}\n`);

  console.log(`Generated ${PAGES.length * LANGS.length} pages, 404.html, sitemap.xml, robots.txt, site.webmanifest for ${site.href}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
