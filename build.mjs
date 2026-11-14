// Static site builder for Beyond Clicks. No dependencies.
// Usage: node build.mjs                 -> dist/ with folder links (GitHub Pages, Netlify, Vercel)
//        node build.mjs --target=preview -> preview/ with explicit index.html links (claude.ai preview)
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { SITE, NAV, SUBNAV, CTA } from "./src/site.mjs";
import { icon } from "./src/icons.mjs";
import corePages from "./src/pages/core.mjs";
import marketingPages from "./src/pages/marketing.mjs";
import staffingPages from "./src/pages/staffing.mjs";
import toolPages from "./src/pages/tools.mjs";
import resourcePages from "./src/pages/resources.mjs";

const target = (process.argv.find((a) => a.startsWith("--target=")) || "--target=dist").split("=")[1];
const OUT = target === "preview" ? "preview" : "dist";
const explicitIndex = target === "preview";

const pages = [...corePages, ...marketingPages, ...staffingPages, ...toolPages, ...resourcePages];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function fileFor(path) {
  if (path.endsWith(".html")) return path.replace(/^\//, "");
  return (path.replace(/^\//, "") + "index.html").replace(/^\/?/, "");
}

function makeUrl(fromPath) {
  const depth = fileFor(fromPath).split("/").length - 1;
  const up = depth === 0 ? "./" : "../".repeat(depth);
  return (to) => {
    if (/^(https?:|mailto:|tel:|#)/.test(to)) return to;
    const [p, hash] = to.split("#");
    let rel = p.replace(/^\//, "");
    if (explicitIndex && (rel === "" || rel.endsWith("/"))) rel += "index.html";
    return (up + rel).replace(/^\.\/$/, "./") + (hash ? "#" + hash : "");
  };
}

function absUrl(path) {
  return SITE.url + (path === "/" ? "/" : path);
}

function jsonLd(page) {
  const graph = [
    {
      "@type": "Organization",
      "@id": SITE.url + "/#org",
      name: SITE.name,
      url: SITE.url + "/",
      description: SITE.description,
      address: { "@type": "PostalAddress", addressLocality: "Mohali", addressRegion: "Punjab", addressCountry: "IN" },
      areaServed: ["US", "GB", "CA", "IN"],
    },
  ];
  if (page.crumbs && page.crumbs.length) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [{ name: "Home", path: "/" }, ...page.crumbs].map((c, i) => ({
        "@type": "ListItem", position: i + 1, name: c.name, item: absUrl(c.path || page.path),
      })),
    });
  }
  if (page.schema) graph.push(...[].concat(page.schema));
  if (page.faq) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: page.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

export function faqBlock(items) {
  return `<div class="faq">${items
    .map(([q, a]) => `<details><summary>${esc(q)}</summary><div class="faq-body"><p>${esc(a)}</p></div></details>`)
    .join("")}</div>`;
}

function header(page, u) {
  const navItems = NAV.map((n) => {
    const current = page.path === n.path ? ' aria-current="page"' : page.section === n.key ? ' class="is-section"' : "";
    return `<li><a href="${u(n.path)}"${current}>${n.label}</a></li>`;
  }).join("");
  const cta = CTA[page.section] || CTA.default;
  const drawer = NAV.map((n) => `<a href="${u(n.path)}">${n.label}<small>${n.blurb}</small></a>`).join("");
  return `
<header class="site-header">
  <div class="container header-row">
    <a class="logo" href="${u("/")}" aria-label="${SITE.name} home">
      <span class="logo-dot" aria-hidden="true"></span>
      <span class="logo-mark">Beyond<br>Clicks</span>
    </a>
    <nav class="nav" aria-label="Main"><ul>${navItems}</ul></nav>
    <div class="header-actions">
      <button class="kbd-hint" type="button" data-open-palette aria-label="Search pages"><span>Jump to</span><kbd>Ctrl K</kbd></button>
      <a class="btn btn-sm btn-header" href="${u(cta.path)}">${cta.label}</a>
      <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer">${drawer}<a class="btn btn-block" href="${u(cta.path)}">${cta.label}</a></div>`;
}

function subnav(page, u) {
  const items = SUBNAV[page.section];
  if (!items) return "";
  return `<nav class="subnav" aria-label="${page.section} pages"><div class="container"><ul>${items
    .map((s) => `<li><a href="${u(s.path)}"${s.path === page.path ? ' aria-current="page"' : ""}>${s.label}</a></li>`)
    .join("")}</ul></div></nav>`;
}

function crumbs(page, u) {
  if (!page.crumbs || !page.crumbs.length) return "";
  const all = [{ name: "Home", path: "/" }, ...page.crumbs];
  return `<nav class="crumbs container" aria-label="Breadcrumb"><ol>${all
    .map((c, i) => (i === all.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${u(c.path)}">${esc(c.name)}</a></li>`))
    .join("")}</ol></nav>`;
}

function footer(u) {
  const col = (title, links) =>
    `<div class="footer-col"><h4>${title}</h4><ul>${links.map(([l, p]) => `<li><a href="${u(p)}">${l}</a></li>`).join("")}</ul></div>`;
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="logo" href="${u("/")}"><span class="logo-dot" aria-hidden="true"></span><span class="logo-mark">Beyond<br>Clicks</span></a>
        <p class="muted small">Marketing, staffing and tools for marketing-led teams. Based in Mohali, India. Working with clients in the US, UK, Canada and India.</p>
      </div>
      ${col("Marketing", [["Overview", "/marketing/"], ["Growth Diagnosis", "/marketing/diagnosis/"], ["Our work", "/marketing/work/"]])}
      ${col("Staffing", [["Overview", "/staffing/"], ["Pricing", "/staffing/pricing/"], ["Sample shortlist", "/staffing/sample-shortlist/"], ["For candidates", "/staffing/candidates/"]])}
      ${col("Tools", [["All tools", "/tools/"], ["CV Screener", "/tools/cv-screener/"], ["UTM Builder", "/tools/utm-builder/"], ["Screener pricing", "/tools/cv-screener/pricing/"]])}
      ${col("Company", [["About", "/about/"], ["Resources", "/resources/"], ["Contact", "/contact/"], ["Privacy", "/privacy/"], ["Terms", "/terms/"]])}
    </div>
    <div class="footer-giant" aria-hidden="true">Beyond Clicks</div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${SITE.name}. Registered entity details to be added.</span>
      <span>Prototype for internal review</span>
    </div>
  </div>
</footer>`;
}

function palette(u) {
  const items = pages
    .filter((p) => !p.hidden)
    .map((p) => `<li><a href="${u(p.path)}">${esc(p.nav || p.title.split(" | ")[0])}<small>${esc(p.group || "")}</small></a></li>`)
    .join("");
  return `<div class="palette" role="dialog" aria-modal="true" aria-label="Jump to a page"><div class="palette-box">
<label class="skip" for="palette-input">Search pages</label>
<input id="palette-input" type="search" placeholder="Type a page name, like pricing or screener" autocomplete="off">
<ul class="palette-list">${items}</ul></div></div>`;
}

function layout(page) {
  const u = makeUrl(page.path);
  const title = page.title.includes(SITE.name) ? page.title : `${page.title} | ${SITE.name}`;
  const canonical = absUrl(page.path);
  const scripts = ["/assets/js/main.js", ...(page.scripts || [])].map((s) => `<script src="${u(s)}" defer></script>`).join("\n");
  const body = page.body({ u, icon, faqBlock, esc });
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
${page.noindex ? '<meta name="robots" content="noindex">' : ""}
<meta name="theme-color" content="#050505">
<meta property="og:type" content="${page.ogType || "website"}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.url}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${u("/assets/img/favicon.svg")}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,700..900&family=Manrope:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="${u("/assets/css/style.css")}">
${page.styles ? `<link rel="stylesheet" href="${u(page.styles)}">` : ""}
<script type="application/ld+json">${jsonLd(page)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"></div>
${header(page, u)}
${subnav(page, u)}
<main id="main">
${crumbs(page, u)}
${body}
</main>
${footer(u)}
${palette(u)}
${scripts}
</body>
</html>`;
}

// Build
if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });
cpSync("src/assets", join(OUT, "assets"), { recursive: true });

for (const page of pages) {
  const file = join(OUT, fileFor(page.path));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, layout(page));
}

const indexable = pages.filter((p) => !p.noindex);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((p) => `  <url><loc>${absUrl(p.path)}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);
writeFileSync(join(OUT, ".nojekyll"), "");
console.log(`Built ${pages.length} pages into ${OUT}/`);
