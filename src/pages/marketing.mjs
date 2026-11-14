const mFaq = [
  ["Why start with a diagnosis?", "Scaling spend on broken tracking scales the waste too. The diagnosis shows what the numbers can and can't be trusted for before you spend more."],
  ["Which channels do you run?", "Meta and Google ads day to day, with SEO and organic social where they support the paid plan."],
  ["Do you work with brands outside India?", "Yes. We work with brands in the US, UK, Canada and India and plan calls around your hours."],
  ["How long until results?", "Tracking fixes show up in reporting within days. Campaign changes usually need two to four weeks of data before we judge them."],
];

const marketing = {
  path: "/marketing/",
  section: "marketing",
  title: "Marketing | Paid growth on data you can trust",
  nav: "Marketing",
  group: "Marketing",
  description: "Beyond Clicks audits your tracking first, then runs Meta and Google ads on numbers you can trust. Fixed-price Growth Diagnosis to start.",
  crumbs: [{ name: "Marketing", path: "/marketing/" }],
  faq: mFaq,
  schema: { "@type": "Service", name: "Paid growth and tracking audits", provider: { "@id": "https://beyondclicks.example/#org" }, areaServed: ["US", "GB", "CA", "IN"] },
  body: ({ u, icon, faqBlock }) => `
<section class="page-hero">
  <div class="hero-orb" aria-hidden="true"></div>
  <div class="container">
    <span class="eyebrow">Marketing</span>
    <h1 style="margin-top:16px">Find what's broken <span class="hl">before</span> you spend more.</h1>
    <p class="lead">Most ad accounts we open report conversions that never happened or miss ones that did. We fix the measurement first, then scale what's actually working.</p>
    <div class="btn-row">
      <a class="btn" href="${u("/marketing/diagnosis/")}">See the Growth Diagnosis <span class="arrow">&rarr;</span></a>
      <a class="btn btn-ghost" href="${u("/marketing/work/")}">Our work</a>
    </div>
  </div>
</section>

<section class="section-tight">
  <div class="container">
    <div class="section-head"><span class="eyebrow">What we do</span><h2>Services</h2></div>
    <div class="grid grid-2">
      <div class="card card-split reveal"><div class="card-icon">${icon("target")}</div><h3>Paid media</h3><p>Meta and Google campaigns built around a clear cost per result, with weekly reporting.</p></div>
      <div class="card card-split reveal"><div class="card-icon">${icon("chart")}</div><h3>Tracking and analytics</h3><p>Pixel, Conversions API and GA4 set up so every reported sale matches a real one.</p></div>
      <div class="card card-split reveal"><div class="card-icon">${icon("search")}</div><h3>SEO</h3><p>Technical fixes and content plans for pages that already have buyers searching for them.</p></div>
      <div class="card card-split reveal"><div class="card-icon">${icon("layers")}</div><h3>Social content</h3><p>Organic social that feeds the paid plan with tested hooks and creative.</p></div>
    </div>
  </div>
</section>

<section class="section section-light">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">How you start</span>
      <h2>Small first step, then scale.</h2>
      <p class="lead">Each step stands on its own. You can stop after any of them and still keep everything we found.</p>
    </div>
    <ol class="steps">
      <li><div class="card"><span class="badge" style="background:#f3eef0;border-color:#e8e2e4;color:#520015">Free</span><h3>Tracking checklist</h3><p>Check your own pixel, conversions setup and analytics in 15 minutes.</p></div></li>
      <li><div class="card"><span class="badge" style="background:#520015;color:#fff;border-color:#520015">$750</span><h3>Growth Diagnosis</h3><p>A full audit with written findings and a 90-day fix list.</p></div></li>
      <li><div class="card"><span class="badge" style="background:#f3eef0;border-color:#e8e2e4;color:#520015">Fixed price</span><h3>Fix sprint</h3><p>We fix the tracking and account structure the diagnosis found.</p></div></li>
      <li><div class="card"><span class="badge" style="background:#f3eef0;border-color:#e8e2e4;color:#520015">Monthly</span><h3>Growth retainer</h3><p>Campaign management, reporting and a monthly review.</p></div></li>
    </ol>
  </div>
</section>

<section class="section-tight">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Questions</span><h2>Before you book</h2></div>
    ${faqBlock(mFaq)}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="card section-wine cta-band" style="padding:clamp(28px,5vw,56px)">
      <h2>Know what your numbers can be trusted for.</h2>
      <div class="btn-row"><a class="btn btn-light" href="${u("/marketing/diagnosis/#book")}">Book a diagnosis <span class="arrow">&rarr;</span></a></div>
    </div>
  </div>
</section>`,
};

const diagnosis = {
  path: "/marketing/diagnosis/",
  section: "marketing",
  title: "Growth Diagnosis | Fixed-price tracking and ad account audit",
  nav: "Growth Diagnosis",
  group: "Marketing",
  description: "A fixed-price audit of your tracking and ad accounts with written findings, a walkthrough call and a 90-day fix list. $750, credited against a fix sprint.",
  crumbs: [{ name: "Marketing", path: "/marketing/" }, { name: "Growth Diagnosis", path: "/marketing/diagnosis/" }],
  schema: { "@type": "Offer", name: "Growth Diagnosis", price: "750", priceCurrency: "USD" },
  body: ({ u, icon }) => `
<section class="page-hero">
  <div class="hero-orb" aria-hidden="true"></div>
  <div class="container hero-grid">
    <div>
      <span class="eyebrow">Growth Diagnosis</span>
      <h1 style="margin-top:16px">One audit. Every <span class="hl">leak</span> found.</h1>
      <p class="lead">We check your tracking, ad accounts and analytics, then hand you written findings and a 90-day fix list. You keep it whether or not you hire us for the fixes.</p>
    </div>
    <div class="card price-card featured reveal">
      <span class="badge">Fixed price</span>
      <div class="price">$750</div>
      <ul>
        <li>Delivered in 5 business days</li>
        <li>60-minute walkthrough call</li>
        <li>Fee credited if you book a fix sprint within 30 days</li>
      </ul>
      <a class="btn btn-light btn-block" href="#book">Book your diagnosis</a>
    </div>
  </div>
</section>

<section class="section-tight">
  <div class="container">
    <div class="section-head"><span class="eyebrow">What we check</span><h2>The audit covers</h2></div>
    <div class="grid grid-3">
      <div class="card reveal"><div class="card-icon">${icon("chart")}</div><h3>Measurement</h3><p>Pixel and Conversions API events, deduplication, match quality and GA4 conversions against your real orders or leads.</p></div>
      <div class="card reveal"><div class="card-icon">${icon("target")}</div><h3>Account structure</h3><p>Campaign and ad set setup, budget splits, audience overlap and whether the learning phase ever ends.</p></div>
      <div class="card reveal"><div class="card-icon">${icon("layers")}</div><h3>Creative and landing pages</h3><p>Which ads are tired, which pages lose the click, and what to test first.</p></div>
    </div>
  </div>
</section>

<section class="section section-light" id="book">
  <div class="container split">
    <div class="section-head split-sticky">
      <span class="eyebrow">Book</span>
      <h2>Tell us about your accounts.</h2>
      <p class="lead">We reply within one business day with a start date and the access we'll need.</p>
    </div>
    <form class="card form" data-proto novalidate style="background:#0b0909;color:#fff;border-color:#1f1a1b">
      <div class="form-row">
        <div class="field"><label for="d-name">Your name</label><input id="d-name" required autocomplete="name"></div>
        <div class="field"><label for="d-email">Work email</label><input id="d-email" type="email" required autocomplete="email"></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="d-site">Website</label><input id="d-site" type="url" placeholder="https://" required></div>
        <div class="field"><label for="d-spend">Monthly ad spend</label>
          <select id="d-spend"><option>Under $5,000</option><option>$5,000 to $20,000</option><option>$20,000 to $50,000</option><option>Over $50,000</option></select></div>
      </div>
      <div class="field"><label for="d-goal">What feels off right now?</label><textarea id="d-goal" placeholder="For example: Meta reports twice the sales our store shows"></textarea></div>
      <button class="btn btn-block" type="submit">Request the diagnosis <span class="arrow">&rarr;</span></button>
      <p class="form-note" tabindex="-1">Prototype: nothing was sent. The live form will create a booking and send a payment link.</p>
    </form>
  </div>
</section>`,
};

const work = {
  path: "/marketing/work/",
  section: "marketing",
  title: "Our work | Marketing case studies",
  nav: "Our work",
  group: "Marketing",
  description: "Marketing case studies from Beyond Clicks: tracking rebuilds and paid growth for brands in the US, UK, Canada and India.",
  crumbs: [{ name: "Marketing", path: "/marketing/" }, { name: "Our work", path: "/marketing/work/" }],
  body: ({ u }) => `
<section class="page-hero">
  <div class="container">
    <span class="eyebrow">Our work</span>
    <h1 style="margin-top:16px">Proof, in numbers.</h1>
    <p class="lead">Each case study shows the problem we found, what we changed and what moved. Client names appear only with permission.</p>
  </div>
</section>
<section class="section-tight">
  <div class="container grid grid-3">
    ${[
      ["US bespoke menswear", "Tracking rebuild before scaling Meta spend"],
      ["India travel agency", "Lead campaigns rebuilt around qualified enquiries"],
      ["UK service business", "Search and paid social on one reporting view"],
    ]
      .map(
        ([who, what]) => `<article class="card reveal">
      <span class="badge badge-placeholder">Placeholder</span>
      <h3>${who}</h3>
      <p>${what}.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px">
        <div><div class="card-num">--</div><p class="small">Add the result</p></div>
        <div><div class="card-num">--</div><p class="small">Add the time frame</p></div>
      </div>
    </article>`
      )
      .join("")}
  </div>
</section>
<section class="section-tight">
  <div class="container">
    <div class="card" style="gap:8px"><span class="badge badge-placeholder">Note for review</span><p>Replace these cards with real results and get written permission before naming any client.</p></div>
  </div>
</section>`,
};

export default [marketing, diagnosis, work];
