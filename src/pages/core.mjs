const homeFaq = [
  ["What does Beyond Clicks do?", "We run paid growth for marketing-led brands, source and screen marketing talent for agencies abroad, and build free tools for recruiters and marketers."],
  ["Where are you based?", "Our team is in Mohali, India. We work with clients in the US, UK, Canada and India, and plan our hours around your time zone."],
  ["Are the tools really free?", "Yes. The CV Screener is free for batches of up to 10 CVs and the UTM Builder is free with no limit. Screener Pro adds bigger batches and exports."],
  ["Do the tools upload my files?", "No. The CV Screener reads files inside your browser. Nothing you drop in is sent to our servers."],
];

const home = {
  path: "/",
  section: "home",
  title: "Beyond Clicks | Growth, staffing and tools for marketing-led teams",
  nav: "Home",
  description:
    "Beyond Clicks grows marketing-led brands, sources vetted marketing talent for agencies in the US, UK and Canada, and builds free tools for recruiters and marketers.",
  faq: homeFaq,
  body: ({ u, icon, faqBlock }) => `
<section class="hero">
  <div class="hero-orb" aria-hidden="true"></div>
  <div class="container hero-grid">
    <div>
      <span class="eyebrow">Marketing, staffing and tools</span>
      <h1 style="margin-top:18px">We grow brands and find the <span class="hl">marketers</span> who run them.</h1>
      <p class="lead">Our marketing team fixes measurement and scales paid growth. Our staffing team sources and screens marketing talent for agencies in the US, UK and Canada. Our free tools help recruiters and marketers do the busy work faster.</p>
      <div class="btn-row">
        <a class="btn" href="${u("/marketing/")}">I need growth <span class="arrow">&rarr;</span></a>
        <a class="btn btn-ghost" href="${u("/staffing/")}">I need marketers</a>
      </div>
    </div>
    <div class="card reveal" aria-label="Example screener result">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
        <span class="badge badge-wine">CV Screener</span><span class="small muted">Example batch</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:6px">
        <div><div class="card-num">24</div><p class="small">CVs screened</p></div>
        <div><div class="card-num">9</div><p class="small">meet every must-have</p></div>
        <div><div class="card-num hl">3</div><p class="small">flags to check</p></div>
      </div>
      <p class="small">Two summaries are near copies of each other. One candidate lists overlapping full-time roles in 2022.</p>
      <a class="btn btn-sm" href="${u("/tools/cv-screener/")}">Try it with sample CVs <span class="arrow">&rarr;</span></a>
    </div>
  </div>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee-track">
  ${["Meta ads", "Google ads", "Tracking audits", "Conversions API", "Performance marketers", "Paid social specialists", "SEO leads", "Marketing ops", "CV screening", "UTM tracking"]
    .concat(["Meta ads", "Google ads", "Tracking audits", "Conversions API", "Performance marketers", "Paid social specialists", "SEO leads", "Marketing ops", "CV screening", "UTM tracking"])
    .map((t) => `<span>${t}</span>`).join("")}
</div></div>

<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Pick your door</span>
      <h2>One team. Three ways in.</h2>
    </div>
    <div class="doors">
      <a class="card door door-featured reveal" href="${u("/marketing/")}">
        <div><span class="door-tag">01 / Marketing</span></div>
        <div style="display:grid;gap:12px">
          <h3>Grow on data you can trust</h3>
          <p>We audit your tracking first, then scale Meta and Google spend on numbers that hold up.</p>
          <span class="card-foot">See marketing ${icon("arrow")}</span>
        </div>
      </a>
      <a class="card door reveal" href="${u("/staffing/")}">
        <div><span class="door-tag">02 / Staffing</span></div>
        <div style="display:grid;gap:12px">
          <h3>Marketers, vetted</h3>
          <p>Screened shortlists of performance, paid social and SEO talent in 5 business days.</p>
          <span class="card-foot">See staffing ${icon("arrow")}</span>
        </div>
      </a>
      <a class="card door reveal" href="${u("/tools/")}">
        <div><span class="door-tag">03 / Tools</span></div>
        <div style="display:grid;gap:12px">
          <h3>Free tools</h3>
          <p>Screen CVs in your browser and build clean UTM links. No signup to start.</p>
          <span class="card-foot">See tools ${icon("arrow")}</span>
        </div>
      </a>
    </div>
  </div>
</section>

<section class="section section-light">
  <div class="container split">
    <div class="split-sticky section-head">
      <span class="eyebrow">How we work</span>
      <h2>Find the problem before spending more.</h2>
      <p class="lead">Most wasted budgets and bad hires share a cause: someone acted on numbers or claims nobody checked. Checking comes first in everything we do.</p>
    </div>
    <ol class="steps steps-1" style="grid-template-columns:1fr">
      <li><div class="card"><h3>Check</h3><p>Audit the tracking, the account or the candidate's claims before anything else.</p></div></li>
      <li><div class="card"><h3>Decide</h3><p>Put findings in writing with a short fix list, so you can see what we saw.</p></div></li>
      <li><div class="card"><h3>Do the work</h3><p>Run the campaigns or deliver the shortlist, with weekly reporting you can read in two minutes.</p></div></li>
      <li><div class="card"><h3>Prove it</h3><p>Report against the numbers we agreed at the start, not new ones picked afterwards.</p></div></li>
    </ol>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Why hiring needs a second look</span>
      <h2>Recruiters are reading more polished CVs than ever.</h2>
    </div>
    <div class="stats">
      <div class="stat reveal"><b class="hl">33%</b><p>of recruiters named AI-polished CVs as their biggest stressor, a first in the survey's 19 years.</p><a href="https://www.hrdive.com/news/ai-is-the-root-of-recruiters-biggest-stressors-survey-says/833223/" rel="noopener">HR Dive</a></div>
      <div class="stat reveal"><b>6 in 10</b><p>recruiters see fake or AI-generated applications regularly.</p><a href="https://www.pin.com/blog/deepfake-candidate-report/" rel="noopener">Pin, 2026 survey</a></div>
      <div class="stat reveal"><b>1 in 4</b><p>candidate profiles worldwide could be fake by 2028, according to a Gartner forecast.</p><a href="https://www.refontelearning.com/blog/ai-fake-candidate-fraud" rel="noopener">Gartner, via Refonte</a></div>
      <div class="stat reveal"><b>0</b><p>CVs uploaded to our servers when you use the CV Screener. It runs in your browser.</p><a href="${u("/tools/cv-screener/")}">How it works</a></div>
    </div>
  </div>
</section>

<section class="section-tight">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Frequently asked</span><h2>Questions we hear first</h2></div>
    ${faqBlock(homeFaq)}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="card section-wine cta-band" style="padding:clamp(28px,5vw,56px)">
      <div style="display:grid;gap:14px">
        <h2>Tell us what's stuck. We'll tell you where to start.</h2>
        <p style="color:rgba(255,255,255,.82)">A short call, a straight answer, and a written next step either way.</p>
      </div>
      <div class="btn-row"><a class="btn btn-light" href="${u("/contact/")}">Talk to us <span class="arrow">&rarr;</span></a></div>
    </div>
  </div>
</section>`,
};

const about = {
  path: "/about/",
  section: "about",
  title: "About",
  group: "Company",
  description: "Beyond Clicks is a marketing, staffing and tools company based in Mohali, India, working with clients in the US, UK, Canada and India.",
  crumbs: [{ name: "About", path: "/about/" }],
  body: ({ u }) => `
<section class="page-hero">
  <div class="hero-orb" aria-hidden="true"></div>
  <div class="container">
    <span class="eyebrow">About Beyond Clicks</span>
    <h1 style="margin-top:16px">Built by people who <span class="hl">run</span> ad accounts.</h1>
    <p class="lead">Beyond Clicks started as hands-on paid media and tracking work for brands in India, the UK, the US and Canada. The same habit kept paying off: check the data before acting on it. Staffing and tools grew out of that habit.</p>
  </div>
</section>
<section class="section-tight">
  <div class="container grid grid-2">
    <div class="card reveal">
      <span class="badge">Founder</span>
      <h3>Ritish Verma</h3>
      <p>Paid media, SEO, social and analytics across four markets, with a focus on finding broken measurement before budgets scale. Leads marketing and sets the vetting standard for staffing.</p>
    </div>
    <div class="card reveal">
      <span class="badge badge-placeholder">Placeholder</span>
      <h3>Team</h3>
      <p>Add the specialist team and the first screener here, with real photos and one line each on what they do.</p>
    </div>
  </div>
</section>
<section class="section section-light">
  <div class="container">
    <div class="section-head"><span class="eyebrow">What we hold to</span><h2>How we work with you</h2></div>
    <div class="grid grid-2">
      <div class="card"><h3>Written findings, every time</h3><p>Every audit, shortlist and report comes in writing, so you can check our work and share it.</p></div>
      <div class="card"><h3>Your time zone</h3><p>We plan calls and delivery around US, UK and Canadian working hours.</p></div>
      <div class="card"><h3>Your data stays yours</h3><p>Our tools process files in your browser. Candidate data in staffing is handled with written consent.</p></div>
      <div class="card"><h3>Fixed prices where we can</h3><p>Audits, sprints and shortlists have fixed prices, so you know the cost before we start.</p></div>
    </div>
  </div>
</section>
<section class="section-tight">
  <div class="container">
    <div class="card" style="gap:8px">
      <span class="badge badge-placeholder">To add before launch</span>
      <p>Registered company name, address, phone number and registration number. Clients abroad look for these before signing.</p>
    </div>
  </div>
</section>`,
};

const contact = {
  path: "/contact/",
  section: "contact",
  title: "Contact",
  group: "Company",
  description: "Contact Beyond Clicks about marketing, staffing or our tools. We reply within one business day.",
  crumbs: [{ name: "Contact", path: "/contact/" }],
  body: ({ u }) => `
<section class="page-hero">
  <div class="hero-orb" aria-hidden="true"></div>
  <div class="container split">
    <div class="section-head">
      <span class="eyebrow">Contact</span>
      <h1>Let's talk.</h1>
      <p class="lead">Tell us what you need and we'll reply within one business day with a straight answer and a suggested next step.</p>
      <p class="muted">Email: hello@your-domain.com<br>Based in Mohali, India. Calls in US, UK and Canadian hours.</p>
    </div>
    <form class="card form" data-proto novalidate>
      <div class="form-row">
        <div class="field"><label for="c-name">Your name</label><input id="c-name" name="name" required autocomplete="name"></div>
        <div class="field"><label for="c-email">Work email</label><input id="c-email" name="email" type="email" required autocomplete="email"></div>
      </div>
      <div class="field"><label for="c-topic">What's this about?</label>
        <select id="c-topic" name="topic"><option>Marketing</option><option>Staffing</option><option>Tools</option><option>Something else</option></select>
      </div>
      <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" required placeholder="A few lines on what you need and by when"></textarea></div>
      <button class="btn btn-block" type="submit">Send message <span class="arrow">&rarr;</span></button>
      <p class="form-note" tabindex="-1">This is a prototype, so nothing was sent. In the live site this form will email the team.</p>
    </form>
  </div>
</section>`,
};

const legal = (path, title, intro, items) => ({
  path,
  section: "legal",
  title,
  group: "Legal",
  description: `${title} for Beyond Clicks. Draft for review.`,
  crumbs: [{ name: title, path }],
  noindex: true,
  body: () => `
<section class="page-hero"><div class="container">
  <span class="badge badge-placeholder">Draft for legal review</span>
  <h1 style="margin-top:16px">${title}</h1>
  <p class="lead">${intro}</p>
</div></section>
<section class="section-tight"><div class="container prose">
  ${items.map(([h, p]) => `<h2>${h}</h2><p>${p}</p>`).join("")}
</div></section>`,
});

const privacy = legal("/privacy/", "Privacy policy", "How Beyond Clicks handles personal data on this website. This is an outline to be completed by a lawyer before launch.", [
  ["What we collect", "Details you send through our forms, and anonymous page analytics. Our analytics record page views and tool events, never the content of files you use in our tools."],
  ["Our tools", "The CV Screener and UTM Builder run in your browser. Files and text you put in them are not sent to our servers."],
  ["Candidate data", "If you join our talent pool, we keep your details to match you with roles and only share your CV with a client after you agree to that specific role. See the candidate privacy notice."],
  ["Payments", "Paid plans are sold through a merchant of record, who processes payment details. We never see your card number."],
  ["Your rights", "You can ask us to show, correct or delete your data. Contact details will be listed here."],
]);

const terms = legal("/terms/", "Terms of use", "Terms for using this website and our free tools. This is an outline to be completed by a lawyer before launch.", [
  ["Using the tools", "The tools give information to help you work. You make every hiring and marketing decision yourself."],
  ["No guarantee on flags", "CV Screener flags are prompts to check something, not judgments about a person. They can be wrong."],
  ["Paid plans", "Pro and Agency plans renew monthly or yearly until cancelled. Refund terms will be listed here."],
  ["Liability", "Liability limits, with the usual exceptions for fraud and wilful misconduct, will be set out here."],
]);

const notFound = {
  path: "/404.html",
  section: "home",
  title: "Page not found",
  hidden: true,
  noindex: true,
  description: "This page doesn't exist.",
  body: ({ u }) => `
<section class="page-hero"><div class="hero-orb" aria-hidden="true"></div><div class="container">
  <span class="eyebrow">Error 404</span>
  <h1 style="margin-top:16px">This page took a <span class="hl">wrong turn</span>.</h1>
  <p class="lead">The link may be old or mistyped. Try one of these, or press Ctrl K to jump to any page.</p>
  <div class="btn-row"><a class="btn" href="${u("/")}">Go home</a><a class="btn btn-ghost" href="${u("/tools/")}">See the tools</a></div>
</div></section>`,
};

export default [home, about, contact, privacy, terms, notFound];
