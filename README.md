# ثَمَر THAMAR

**From city challenges to shared prosperity.** A bilingual (Arabic/English) demonstration of the THAMAR city-development platform. The platform brings the municipality, universities, business and residents into one monthly cycle that turns city challenges into research, ventures and jobs.

Plain static site with no framework and no runtime dependencies.

## Structure

| Path | What it is |
| --- | --- |
| `app.js`, `app.css` | The whole app: public pages plus the signed-in role dashboards (demo data) |
| `assets/` | Logos, favicons, app icons, Open Graph images (`og-ar.jpg`, `og-en.jpg`) |
| `index.html`, `about/`, `how/`, `users/`, `faq/`, `contact/`, `privacy/`, `terms/` | Arabic public pages (**generated**) |
| `en/…` | English versions of the same pages (**generated**) |
| `sitemap.xml`, `robots.txt`, `site.webmanifest`, `404.html` | **Generated** |
| `site.config.mjs` | Site URL and each page's title and description, in both languages |
| `scripts/page.html` | HTML template every page is generated from |
| `scripts/pages.mjs` | Page generator (Node, zero dependencies) |

## Routing

- **Public pages** have real URLs: `/`, `/about/`, `/faq/`, `/en/`, `/en/faq/` and so on. Each one has its own title, description, canonical URL, `hreflang` alternates, Open Graph and Twitter tags, and JSON-LD (Organization, WebSite, and the page type; the FAQ page carries `FAQPage` Q&A). It also contains a static summary that crawlers can read before `app.js` takes over.
- **App screens** (dashboards, voting, challenges…) stay on hash routes such as `#dash` and `#vote`.

## Working on it

```bash
npm run pages   # regenerate pages, sitemap, robots, manifest after editing app.js, site.config.mjs or the template
npm run serve   # preview at http://localhost:4173/
```

Edit `app.js` or `app.css` directly for app changes. Edit `site.config.mjs` for page titles and descriptions. Commit the regenerated files.

## Deploying

Live at **https://www.thamar.world/**, hosted on Vercel. Each push to `main` deploys automatically, and there is no build step: the committed files are served as-is.

- `vercel.json` adds trailing slashes (`/about` → `/about/`, so each page has one URL), caching for `assets/`, and basic security headers.
- `.vercelignore` keeps the generator scripts out of the deployment.
- If the domain changes, update `SITE_URL` in `site.config.mjs`, run `npm run pages`, and push, so the canonical, Open Graph and sitemap URLs follow.
- Submit `https://www.thamar.world/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
