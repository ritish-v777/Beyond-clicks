const toolFaq = [
  ["Is my data uploaded anywhere?", "No. Files are read inside your browser tab. Close the tab and they're gone. You can check this in your browser's network panel while a batch runs."],
  ["Which files work?", "PDF, DOCX and plain text. You can also paste a CV straight in."],
  ["Does the screener reject candidates?", "No. It shows which criteria each CV meets and what's worth checking. You make every decision."],
  ["What does Pro add?", "Batches of up to 300 CVs, a check for near-identical CVs across a batch, saved job profiles, CSV export and a client-ready shortlist report."],
];

const hub = {
  path: "/tools/",
  section: "tools",
  title: "Free tools for recruiters and marketers",
  nav: "All tools",
  group: "Tools",
  description: "Free browser-based tools from Beyond Hive: a private CV Screener for recruiters and a UTM Builder for marketers. No signup to start.",
  crumbs: [{ name: "Tools", path: "/tools/" }],
  body: ({ u, icon }) => `
<section class="page-hero">
  <div class="hero-orb" aria-hidden="true"></div>
  <div class="container">
    <span class="eyebrow">Tools</span>
    <h1 style="margin-top:16px">Tools that run in <span class="hl">your</span> browser.</h1>
    <p class="lead">Free to start, no signup, and nothing you put in them leaves your device.</p>
  </div>
</section>
<section class="section-tight">
  <div class="container grid grid-2">
    <a class="card reveal" href="${u("/tools/cv-screener/")}" data-tilt="4" data-cursor="Try">
      <div class="tool-card-shot" style="background-image:url(${u("/assets/img/shot-screener.webp")})" role="img" aria-label="CV Screener results screen"></div>
      <div style="display:flex;justify-content:space-between;gap:10px"><div class="card-icon">${icon("file")}</div><span class="badge badge-wine">For recruiters</span></div>
      <h2 style="font-size:var(--step-2)">CV Screener</h2>
      <p>Drop in a batch of CVs and a job description. See which criteria each CV meets, what's worth checking, and the questions to ask in the interview.</p>
      <span class="card-foot">Open the screener ${icon("arrow")}</span>
    </a>
    <a class="card reveal" href="${u("/tools/utm-builder/")}" data-tilt="4" data-cursor="Try">
      <div class="tool-card-shot" style="background-image:url(${u("/assets/img/shot-utm.webp")})" role="img" aria-label="UTM Builder with a finished link and naming checks"></div>
      <div style="display:flex;justify-content:space-between;gap:10px"><div class="card-icon">${icon("link")}</div><span class="badge">For marketers</span></div>
      <h2 style="font-size:var(--step-2)">UTM Builder</h2>
      <p>Build tagged campaign links with channel presets and a naming check that catches the mistakes that split your reports.</p>
      <span class="card-foot">Open the builder ${icon("arrow")}</span>
    </a>
  </div>
</section>
<section class="section section-light">
  <div class="container split">
    <div class="section-head split-sticky"><span class="eyebrow">Privacy by design</span><h2>Why browser-only?</h2></div>
    <div class="grid" style="gap:14px">
      <div class="card"><h3>Candidate data stays with you</h3><p>CVs hold personal data. Our screener reads them on your device, so you never have to explain to a client where their candidates' CVs went.</p></div>
      <div class="card"><h3>Fast, even on big batches</h3><p>There's no upload queue. The work happens on your machine as soon as you drop the files.</p></div>
      <div class="card"><h3>You can check it</h3><p>Open your browser's network panel while a batch runs. No CV content is sent anywhere.</p></div>
    </div>
  </div>
</section>`,
};

const screener = {
  path: "/tools/cv-screener/",
  section: "tools",
  title: "CV Screener | Free private CV screening in your browser",
  nav: "CV Screener",
  group: "Tools",
  description: "Screen a batch of CVs against a job description in your browser. See criteria met, red flags worth checking and interview questions. Free for up to 10 CVs.",
  crumbs: [{ name: "Tools", path: "/tools/" }, { name: "CV Screener", path: "/tools/cv-screener/" }],
  faq: toolFaq,
  styles: "/assets/css/tools.css",
  scripts: ["/assets/js/cv-samples.js", "/assets/js/cv-screener.js"],
  schema: {
    "@type": "SoftwareApplication", name: "Beyond Hive CV Screener", applicationCategory: "BusinessApplication", operatingSystem: "Web browser",
    offers: [{ "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" }, { "@type": "Offer", price: "19", priceCurrency: "USD", name: "Pro, monthly" }],
  },
  body: ({ u, icon, faqBlock }) => `
<section class="tool-hero">
  <div class="container">
    <div class="tool-title">
      <div>
        <span class="eyebrow">CV Screener</span>
        <h1 class="tool-h1">Screen CVs <span class="hl">privately</span>.</h1>
      </div>
      <div class="tool-pills">
        <span class="pill">${icon("lock")} Runs in your browser</span>
        <span class="pill">Free up to 10 CVs per batch</span>
      </div>
    </div>
  </div>
</section>

<section class="tool-app container" id="app">
  <aside class="panel panel-job">
    <div class="panel-head"><h2>1. The role</h2><button class="link-btn" type="button" id="reset-job">Clear</button></div>
    <div class="field"><label for="job-title">Role title</label><input id="job-title" value="Performance Marketing Manager"></div>
    <div class="field">
      <label for="must-input">Must-have skills</label>
      <div class="chip-input" data-chips="must"><input id="must-input" placeholder="Type a skill, press Enter"></div>
    </div>
    <div class="field">
      <label for="nice-input">Nice to have</label>
      <div class="chip-input" data-chips="nice"><input id="nice-input" placeholder="Type a skill, press Enter"></div>
    </div>
    <div class="field"><label for="min-years">Minimum years of experience</label><input id="min-years" type="number" min="0" max="40" value="4" inputmode="numeric"></div>
    <details class="jd-box"><summary>Job description (optional)</summary>
      <div class="field"><label class="sr-only" for="jd">Job description</label><textarea id="jd" placeholder="Paste the job description. Used to spot keyword stuffing."></textarea></div>
    </details>
  </aside>

  <div class="panel panel-cvs">
    <div class="panel-head"><h2>2. The CVs</h2><span class="count-pill" id="cv-count">0 / 10</span></div>
    <label class="dropzone" id="dropzone" for="file-input">
      <span class="dz-icon">${icon("upload")}</span>
      <span><strong>Drop CVs here</strong> or tap to choose files</span>
      <span class="small muted">PDF, DOCX or TXT. Read on your device only.</span>
      <input id="file-input" type="file" multiple accept=".pdf,.docx,.txt,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
    </label>
    <div class="cv-actions">
      <button class="btn btn-ghost btn-sm" type="button" id="paste-toggle">${icon("pen")} Paste a CV</button>
      <button class="btn btn-ghost btn-sm" type="button" id="load-sample">Load sample batch</button>
      <button class="link-btn" type="button" id="clear-cvs">Remove all</button>
    </div>
    <div class="paste-box" id="paste-box" hidden>
      <label for="paste-text" class="small muted">Paste the full CV text</label>
      <textarea id="paste-text" placeholder="Name on the first line, then the rest of the CV"></textarea>
      <button class="btn btn-sm" type="button" id="paste-add">Add this CV</button>
    </div>
    <ul class="cv-list" id="cv-list" aria-live="polite"></ul>
    <button class="btn btn-block run-btn" type="button" id="run">Screen CVs <span class="arrow">&rarr;</span></button>
  </div>

  <div class="results" id="results" aria-live="polite">
    <div class="results-head">
      <div><h2>3. Results</h2><p class="small muted" id="results-note">Load CVs and press Screen.</p></div>
      <div class="results-tools">
        <div class="seg" role="group" aria-label="Filter results">
          <button type="button" data-filter="all" aria-pressed="true">All</button>
          <button type="button" data-filter="flagged" aria-pressed="false">To check</button>
          <button type="button" data-filter="meets" aria-pressed="false">Meets all</button>
        </div>
        <label class="switch"><input type="checkbox" id="sort-toggle"><span></span> Sort by criteria met</label>
      </div>
    </div>
    <div class="tiles" id="tiles"></div>
    <div id="similar"></div>
    <div class="cand-grid" id="cand-grid"></div>
    <div class="results-foot">
      <button class="btn btn-ghost btn-sm" type="button" id="copy-summary">${icon("copy")} Copy shortlist summary <span class="badge badge-wine">Pro</span></button>
      <p class="small muted">Flags are prompts to verify, not judgments. You make the hiring decision.</p>
    </div>
  </div>
</section>

<dialog class="dialog" id="upgrade">
  <form method="dialog" class="dialog-body">
    <span class="badge badge-wine">Free limit reached</span>
    <h2 id="upgrade-title">Your batch has more than 10 CVs.</h2>
    <p id="upgrade-text">The free plan screens 10 CVs at a time.</p>
    <ul class="small" style="margin:0;padding-left:1.1em;display:grid;gap:6px;color:var(--white-dim)">
      <li>Batches of up to 300 CVs</li>
      <li>Near-identical CV check across the batch</li>
      <li>Saved job profiles, CSV export and client-ready reports</li>
    </ul>
    <div class="btn-row">
      <a class="btn" href="${u("/tools/cv-screener/pricing/")}">See Pro, $19 a month</a>
      <button class="btn btn-ghost" value="close">Keep the first 10</button>
    </div>
  </form>
</dialog>

<section class="section-tight">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Questions</span><h2>About the screener</h2></div>
    ${faqBlock(toolFaq)}
  </div>
</section>`,
};

const toolPricing = {
  path: "/tools/cv-screener/pricing/",
  section: "tools",
  title: "CV Screener pricing | Free, Pro and Agency plans",
  nav: "Screener pricing",
  group: "Tools",
  description: "CV Screener is free for batches of 10 CVs. Pro is $19 a month for batches of 300 with a near-duplicate check and exports. Agency is $49 a month for 5 seats.",
  crumbs: [{ name: "Tools", path: "/tools/" }, { name: "CV Screener", path: "/tools/cv-screener/" }, { name: "Pricing", path: "/tools/cv-screener/pricing/" }],
  body: ({ u }) => `
<section class="page-hero">
  <div class="container">
    <span class="eyebrow">Screener pricing</span>
    <h1 style="margin-top:16px">Less than one <span class="hl">ATS</span> seat.</h1>
    <p class="lead">Small-agency applicant tracking plans start around <a href="https://www.hiretruffle.com/blog/candidate-screening-software-pricing" rel="noopener">$70 a month per seat</a>, and Bullhorn's starts at <a href="https://www.bullhorn.com/uk/small-agency-software/pricing/" rel="noopener">&pound;80 per user per month</a>. The screener works next to whatever you already use.</p>
  </div>
</section>
<section class="section-tight">
  <div class="container">
    <div class="billing-toggle" data-billing role="group" aria-label="Billing period">
      <button type="button" data-mode="year" aria-pressed="true">Yearly, 2 months free</button>
      <button type="button" data-mode="month" aria-pressed="false">Monthly</button>
    </div>
    <div class="pricing">
      <div class="card price-card reveal">
        <span class="badge">Free</span>
        <div class="price">$0</div>
        <p>For a quick check on a small batch.</p>
        <ul><li>10 CVs per batch</li><li>Criteria checklist with reasons</li><li>Basic red flags</li><li>1 verification question per CV</li></ul>
        <a class="btn btn-ghost btn-block" href="${u("/tools/cv-screener/")}">Use it free</a>
      </div>
      <div class="card price-card featured reveal">
        <span class="badge">Pro</span>
        <div class="price" data-price-year="$190 <small>/ year</small>" data-price-month="$19 <small>/ month</small>">$190 <small>/ year</small></div>
        <p>For recruiters screening every week.</p>
        <ul><li>300 CVs per batch</li><li>Near-identical CV check across the batch</li><li>Full set of verification questions</li><li>Saved job profiles and CSV export</li><li>Shortlist report with your logo</li></ul>
        <a class="btn btn-light btn-block" href="#" aria-disabled="true">Go Pro</a>
      </div>
      <div class="card price-card reveal">
        <span class="badge">Agency</span>
        <div class="price" data-price-year="$490 <small>/ year</small>" data-price-month="$49 <small>/ month</small>">$490 <small>/ year</small></div>
        <p>For small teams sharing one account.</p>
        <ul><li>Everything in Pro</li><li>5 seats</li><li>White-label shortlist reports</li></ul>
        <a class="btn btn-ghost btn-block" href="#" aria-disabled="true">Start Agency</a>
      </div>
    </div>
    <p class="small muted" style="margin-top:16px">Prototype: checkout is not connected yet.</p>
  </div>
</section>`,
};

const utm = {
  path: "/tools/utm-builder/",
  section: "tools",
  title: "UTM Builder | Free campaign link builder with naming checks",
  nav: "UTM Builder",
  group: "Tools",
  description: "Build UTM-tagged campaign links with presets for Meta, Google, LinkedIn and email, plus a naming check that keeps your analytics reports clean. Free.",
  crumbs: [{ name: "Tools", path: "/tools/" }, { name: "UTM Builder", path: "/tools/utm-builder/" }],
  styles: "/assets/css/tools.css",
  scripts: ["/assets/js/utm-builder.js"],
  schema: { "@type": "SoftwareApplication", name: "Beyond Hive UTM Builder", applicationCategory: "BusinessApplication", operatingSystem: "Web browser", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  body: ({ icon }) => `
<section class="tool-hero">
  <div class="container">
    <div class="tool-title">
      <div><span class="eyebrow">UTM Builder</span><h1 class="tool-h1">Clean links, <span class="hl">clean</span> reports.</h1></div>
      <div class="tool-pills"><span class="pill">${icon("bolt")} Free, no limit</span></div>
    </div>
  </div>
</section>
<section class="container utm-app">
  <form class="panel" id="utm-form" novalidate>
    <div class="panel-head"><h2>Link details</h2><button class="link-btn" type="reset">Clear</button></div>
    <div class="presets" role="group" aria-label="Channel presets">
      <button type="button" class="chip-btn" data-preset="meta">Meta ads</button>
      <button type="button" class="chip-btn" data-preset="google">Google ads</button>
      <button type="button" class="chip-btn" data-preset="linkedin">LinkedIn</button>
      <button type="button" class="chip-btn" data-preset="email">Newsletter</button>
    </div>
    <div class="field"><label for="u-url">Page URL</label><input id="u-url" type="url" value="https://example.com/spring-sale" placeholder="https://"></div>
    <div class="form-row">
      <div class="field"><label for="u-source">Source <span class="muted small">utm_source</span></label><input id="u-source" value="facebook"></div>
      <div class="field"><label for="u-medium">Medium <span class="muted small">utm_medium</span></label><input id="u-medium" value="paid_social"></div>
    </div>
    <div class="field"><label for="u-campaign">Campaign <span class="muted small">utm_campaign</span></label><input id="u-campaign" value="Spring Sale 2027"></div>
    <div class="form-row">
      <div class="field"><label for="u-content">Content <span class="muted small">utm_content</span></label><input id="u-content" placeholder="video_a"></div>
      <div class="field"><label for="u-term">Term <span class="muted small">utm_term</span></label><input id="u-term" placeholder="Search keyword"></div>
    </div>
    <label class="switch"><input type="checkbox" id="u-clean" checked><span></span> Auto-clean names (lowercase, underscores)</label>
  </form>
  <div class="utm-side">
    <div class="panel output">
      <div class="panel-head"><h2>Your link</h2></div>
      <output id="u-output" class="url-out" for="u-url u-source u-medium u-campaign"></output>
      <div class="btn-row"><button class="btn" type="button" id="u-copy">${icon("copy")} Copy link</button><button class="btn btn-ghost" type="button" id="u-save">Save to recent</button></div>
    </div>
    <div class="panel">
      <div class="panel-head"><h2>Naming check</h2></div>
      <ul class="checks" id="u-checks"></ul>
    </div>
    <div class="panel">
      <div class="panel-head"><h2>Recent links</h2><button class="link-btn" type="button" id="u-clear-recent">Clear</button></div>
      <ul class="recent" id="u-recent"><li class="muted small">Links you save appear here, on this device only.</li></ul>
    </div>
  </div>
</section>`,
};

export default [hub, screener, toolPricing, utm];
