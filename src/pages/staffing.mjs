const sFaq = [
  ["Which roles do you fill?", "Marketing roles only: performance marketers, paid social specialists, SEO leads and marketing ops. Staying narrow is how we vet properly."],
  ["Where are the candidates?", "Wherever your role needs them. We source for the location and work setup you specify, including remote."],
  ["How do you check candidates?", "Every candidate gets a 15-minute screening call and a verification report covering their claims, dates, pay expectations and notice period."],
  ["What if a candidate isn't right?", "Each sprint includes two free replacements for that role."],
  ["Do candidates agree to be submitted?", "Yes. We only send a CV after the candidate agrees in writing to that specific role and company."],
];

const staffing = {
  path: "/staffing/",
  section: "staffing",
  title: "Staffing | Vetted marketing talent in 5 business days",
  nav: "Staffing",
  group: "Staffing",
  description: "Screened shortlists of performance marketers, paid social and SEO talent for recruiting and marketing agencies in the US, UK and Canada.",
  crumbs: [{ name: "Staffing", path: "/staffing/" }],
  faq: sFaq,
  schema: { "@type": "Service", name: "Marketing talent sourcing and screening", provider: { "@id": "https://beyondclicks.example/#org" }, areaServed: ["US", "GB", "CA"] },
  body: ({ u, icon, faqBlock }) => `
<section class="page-hero">
  <div class="hero-orb" aria-hidden="true"></div>
  <div class="container hero-grid">
    <div>
      <span class="eyebrow">Staffing</span>
      <h1 style="margin-top:16px">Marketers, <span class="hl">vetted</span> by people who run ads.</h1>
      <p class="lead">We source and screen marketing talent for recruiting agencies and marketing teams in the US, UK and Canada. You get 5 checked candidates in 5 business days.</p>
      <div class="btn-row">
        <a class="btn" href="${u("/staffing/free-shortlist/")}">Get 3 free candidates <span class="arrow">&rarr;</span></a>
        <a class="btn btn-ghost" href="${u("/staffing/sample-shortlist/")}">See a sample shortlist</a>
      </div>
    </div>
    <div class="card reveal">
      <span class="badge badge-wine">Every shortlist includes</span>
      <ul class="small" style="margin:0;padding-left:1.1em;display:grid;gap:8px;color:var(--white-dim)">
        <li>Call notes from a 15-minute screen</li>
        <li>A verification report on dates and claims</li>
        <li>Pay expectations and notice period</li>
        <li>Written consent to submit for your role</li>
      </ul>
    </div>
  </div>
</section>

<section class="section-tight">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Roles we fill</span><h2>Marketing roles only</h2></div>
    <div class="grid grid-4">
      <div class="card reveal"><div class="card-icon">${icon("target")}</div><h3>Performance marketers</h3><p>Meta and Google specialists who own a cost-per-result number.</p></div>
      <div class="card reveal"><div class="card-icon">${icon("users")}</div><h3>Paid social</h3><p>Media buyers and creative strategists for Meta, TikTok and LinkedIn.</p></div>
      <div class="card reveal"><div class="card-icon">${icon("search")}</div><h3>SEO</h3><p>Technical and content SEO leads with ranking results they can show.</p></div>
      <div class="card reveal"><div class="card-icon">${icon("layers")}</div><h3>Marketing ops</h3><p>Tracking, CRM and automation people who keep the data clean.</p></div>
    </div>
  </div>
</section>

<section class="section section-light">
  <div class="container">
    <div class="section-head"><span class="eyebrow">How it works</span><h2>From brief to shortlist in 5 days</h2></div>
    <ol class="steps">
      <li><div class="card"><h3>Brief</h3><p>A 20-minute call on the role, must-haves, pay range and deal breakers.</p></div></li>
      <li><div class="card"><h3>Source</h3><p>We search LinkedIn, job boards and our talent pool for people who fit.</p></div></li>
      <li><div class="card"><h3>Screen</h3><p>Every candidate gets a call and a check of the claims on their CV.</p></div></li>
      <li><div class="card"><h3>Deliver</h3><p>You get 5 candidates with notes, a verification report and consent to submit.</p></div></li>
    </ol>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Why verification matters</span><h2>Polished CVs are harder to trust.</h2></div>
    <div class="stats">
      <div class="stat"><b class="hl">33%</b><p>of recruiters say AI-polished CVs are their biggest stressor.</p><a href="https://www.hrdive.com/news/ai-is-the-root-of-recruiters-biggest-stressors-survey-says/833223/" rel="noopener">HR Dive</a></div>
      <div class="stat"><b>40%</b><p>of US managers have interviewed a candidate later found to be using a fake identity.</p><a href="https://www.pin.com/blog/deepfake-candidate-report/" rel="noopener">Checkr, via Pin</a></div>
      <div class="stat"><b>6 in 10</b><p>recruiters see fake or AI-generated applications regularly.</p><a href="https://www.pin.com/blog/deepfake-candidate-report/" rel="noopener">Pin, 2026 survey</a></div>
      <div class="stat"><b>5 days</b><p>from brief to a checked shortlist with every sprint.</p><a href="${u("/staffing/pricing/")}">See pricing</a></div>
    </div>
  </div>
</section>

<section class="section-tight">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Questions</span><h2>Before you send a role</h2></div>
    ${faqBlock(sFaq)}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="card section-wine cta-band" style="padding:clamp(28px,5vw,56px)">
      <div style="display:grid;gap:12px"><h2>Try us on a role you're stuck on.</h2><p style="color:rgba(255,255,255,.82)">3 screened candidates, free, once per company.</p></div>
      <div class="btn-row"><a class="btn btn-light" href="${u("/staffing/free-shortlist/")}">Get 3 free candidates <span class="arrow">&rarr;</span></a></div>
    </div>
  </div>
</section>`,
};

const pricing = {
  path: "/staffing/pricing/",
  section: "staffing",
  title: "Staffing pricing | Shortlist sprints and monthly retainers",
  nav: "Staffing pricing",
  group: "Staffing",
  description: "Staffing pricing from Beyond Clicks: a free 3-candidate shortlist, a $450 shortlist sprint per role, or a $1,400 monthly retainer for up to 4 roles.",
  crumbs: [{ name: "Staffing", path: "/staffing/" }, { name: "Pricing", path: "/staffing/pricing/" }],
  body: ({ u }) => `
<section class="page-hero">
  <div class="container">
    <span class="eyebrow">Pricing</span>
    <h1 style="margin-top:16px">Fixed prices. <span class="hl">No</span> placement fees.</h1>
    <p class="lead">An in-house recruiter costs about <a href="https://hiretruffle.com/blog/recruiter-vs-screening-software-cost" rel="noopener">$69,655 a year in base salary</a> in the US. Our retainer covers up to 4 marketing roles at a time for a fixed monthly fee.</p>
  </div>
</section>
<section class="section-tight">
  <div class="container pricing">
    <div class="card price-card reveal">
      <span class="badge">Try us</span>
      <h3>Free shortlist</h3>
      <div class="price">$0</div>
      <p>For one role you're struggling to fill. Once per company.</p>
      <ul><li>3 screened candidates</li><li>Call notes for each</li><li>Verification report</li></ul>
      <a class="btn btn-ghost btn-block" href="${u("/staffing/free-shortlist/")}">Request free shortlist</a>
    </div>
    <div class="card price-card featured reveal">
      <span class="badge">Most agencies pick this</span>
      <h3>Monthly retainer</h3>
      <div class="price">$1,400 <small>/ month</small></div>
      <p>For agencies with marketing roles open every month.</p>
      <ul><li>Up to 4 active roles</li><li>Weekly shortlists</li><li>A dedicated screener</li><li>Cancel with 30 days' notice</li></ul>
      <a class="btn btn-light btn-block" href="${u("/contact/")}">Start a retainer</a>
    </div>
    <div class="card price-card reveal">
      <span class="badge">One role</span>
      <h3>Shortlist sprint</h3>
      <div class="price">$450 <small>/ role</small></div>
      <p>For a single role you need filled now.</p>
      <ul><li>5 screened candidates in 5 business days</li><li>Verification report</li><li>2 free replacements</li></ul>
      <a class="btn btn-ghost btn-block" href="${u("/contact/")}">Start a sprint</a>
    </div>
  </div>
</section>
<section class="section-tight">
  <div class="container">
    <div class="section-head"><h2>Compare</h2></div>
    <div class="table-wrap"><table>
      <thead><tr><th scope="col">What you get</th><th scope="col">Free shortlist</th><th scope="col">Sprint</th><th scope="col">Retainer</th></tr></thead>
      <tbody>
        <tr><td>Candidates per role</td><td>3</td><td>5</td><td>5 a week</td></tr>
        <tr><td>Roles at once</td><td>1</td><td>1</td><td>Up to 4</td></tr>
        <tr><td>Verification report</td><td class="yes">Yes</td><td class="yes">Yes</td><td class="yes">Yes</td></tr>
        <tr><td>Free replacements</td><td class="no">No</td><td>2</td><td>Ongoing</td></tr>
        <tr><td>Dedicated screener</td><td class="no">No</td><td class="no">No</td><td class="yes">Yes</td></tr>
      </tbody>
    </table></div>
  </div>
</section>`,
};

const sample = {
  path: "/staffing/sample-shortlist/",
  section: "staffing",
  title: "Sample shortlist",
  group: "Staffing",
  description: "See exactly what a Beyond Clicks shortlist looks like: call notes, verification checks and pay expectations for each candidate.",
  crumbs: [{ name: "Staffing", path: "/staffing/" }, { name: "Sample shortlist", path: "/staffing/sample-shortlist/" }],
  body: ({ u }) => {
    const cands = [
      ["Candidate A", "Performance Marketing Manager", "7 years", "Meta, Google, GA4, Shopify", "$85k to $95k", "4 weeks", "Dates and employers match LinkedIn. Walked through a 2024 account rebuild in detail.", "Clear"],
      ["Candidate B", "Senior Paid Social Specialist", "5 years", "Meta, TikTok, creative testing", "$70k to $78k", "2 weeks", "Claimed ROAS figure explained with method and period. One 7-month gap, explained as a career break.", "Clear"],
      ["Candidate C", "Paid Media Lead", "9 years", "Google, Meta, Looker Studio", "$100k to $110k", "6 weeks", "Two roles overlap for 5 months in 2022. Candidate says one was freelance. Ask for a reference from the second employer.", "Check one item"],
    ];
    return `
<section class="page-hero">
  <div class="container">
    <span class="badge badge-placeholder">Example with fictional candidates</span>
    <h1 style="margin-top:16px">What lands in your inbox.</h1>
    <p class="lead">Role: Performance Marketing Manager, remote, US Eastern hours. This is the format every shortlist follows.</p>
  </div>
</section>
<section class="section-tight">
  <div class="container grid" style="gap:14px">
    ${cands
      .map(
        ([n, t, y, s, pay, notice, check, status]) => `<article class="card reveal">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;align-items:center">
        <h3>${n} <span class="muted small" style="font-family:var(--font-body);font-weight:600">${t}</span></h3>
        <span class="badge ${status === "Clear" ? "" : "badge-wine"}">${status}</span>
      </div>
      <div class="grid grid-4" style="gap:10px">
        <div><p class="small muted">Experience</p><p>${y}</p></div>
        <div><p class="small muted">Core skills</p><p>${s}</p></div>
        <div><p class="small muted">Pay expectation</p><p>${pay}</p></div>
        <div><p class="small muted">Notice period</p><p>${notice}</p></div>
      </div>
      <p><strong>Verification:</strong> ${check}</p>
      <p class="small muted">Consent to submit for this role: recorded</p>
    </article>`
      )
      .join("")}
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="card section-wine cta-band" style="padding:clamp(28px,5vw,56px)">
      <h2>Want one of these for your role?</h2>
      <div class="btn-row"><a class="btn btn-light" href="${u("/staffing/free-shortlist/")}">Get 3 free candidates <span class="arrow">&rarr;</span></a></div>
    </div>
  </div>
</section>`;
  },
};

const freeShortlist = {
  path: "/staffing/free-shortlist/",
  section: "staffing",
  title: "Get 3 free candidates",
  group: "Staffing",
  description: "Send us one marketing role you're struggling to fill. We'll send 3 screened candidates with call notes and a verification report, free.",
  crumbs: [{ name: "Staffing", path: "/staffing/" }, { name: "Free shortlist", path: "/staffing/free-shortlist/" }],
  body: () => `
<section class="page-hero">
  <div class="hero-orb" aria-hidden="true"></div>
  <div class="container split">
    <div class="section-head">
      <span class="eyebrow">Free shortlist</span>
      <h1>3 candidates. <span class="hl">Free.</span></h1>
      <p class="lead">Send one marketing role you're struggling to fill. Within 5 business days you get 3 screened candidates with call notes and a verification report.</p>
      <p class="muted small">Once per company. No contract, no card.</p>
    </div>
    <form class="card form" data-proto novalidate>
      <div class="form-row">
        <div class="field"><label for="f-name">Your name</label><input id="f-name" required autocomplete="name"></div>
        <div class="field"><label for="f-email">Work email</label><input id="f-email" type="email" required autocomplete="email"></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="f-company">Company</label><input id="f-company" required autocomplete="organization"></div>
        <div class="field"><label for="f-role">Role title</label><input id="f-role" required placeholder="Performance Marketing Manager"></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="f-loc">Location and setup</label><input id="f-loc" placeholder="Remote, US Eastern hours"></div>
        <div class="field"><label for="f-pay">Pay range</label><input id="f-pay" placeholder="$80k to $95k"></div>
      </div>
      <div class="field"><label for="f-jd">Job description or link</label><textarea id="f-jd" required></textarea></div>
      <button class="btn btn-block" type="submit">Request my free shortlist <span class="arrow">&rarr;</span></button>
      <p class="form-note" tabindex="-1">Prototype: nothing was sent. The live form will create the request and confirm by email.</p>
    </form>
  </div>
</section>`,
};

const candidates = {
  path: "/staffing/candidates/",
  section: "staffing",
  title: "For candidates | Join the marketing talent pool",
  nav: "For candidates",
  group: "Staffing",
  description: "Marketers: join the Beyond Clicks talent pool. We match you with performance, paid social, SEO and marketing ops roles and never share your CV without your consent.",
  crumbs: [{ name: "Staffing", path: "/staffing/" }, { name: "For candidates", path: "/staffing/candidates/" }],
  body: () => `
<section class="page-hero">
  <div class="container split">
    <div class="section-head">
      <span class="eyebrow">For marketers</span>
      <h1>Roles picked by <span class="hl">marketers</span>.</h1>
      <p class="lead">Join our talent pool and hear about marketing roles with agencies and brands in the US, UK and Canada.</p>
      <ul class="small" style="margin:0;padding-left:1.1em;display:grid;gap:8px;color:var(--white-dim)">
        <li>We never send your CV without your yes for that specific role.</li>
        <li>You can ask us to delete your details at any time.</li>
        <li>We re-confirm your details every 12 months or delete them.</li>
      </ul>
    </div>
    <form class="card form" data-proto novalidate>
      <div class="form-row">
        <div class="field"><label for="k-name">Full name</label><input id="k-name" required autocomplete="name"></div>
        <div class="field"><label for="k-email">Email</label><input id="k-email" type="email" required autocomplete="email"></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="k-role">Your role</label>
          <select id="k-role"><option>Performance marketer</option><option>Paid social</option><option>SEO</option><option>Marketing ops</option><option>Other marketing role</option></select></div>
        <div class="field"><label for="k-years">Years of experience</label><input id="k-years" type="number" min="0" max="40" inputmode="numeric"></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="k-loc">Location</label><input id="k-loc" autocomplete="country-name"></div>
        <div class="field"><label for="k-li">LinkedIn URL</label><input id="k-li" type="url" placeholder="https://linkedin.com/in/"></div>
      </div>
      <label style="display:flex;gap:10px;align-items:flex-start;font-size:.92rem">
        <input type="checkbox" required style="width:20px;min-height:20px;margin-top:3px"> I agree that Beyond Clicks may keep my details to match me with roles. My CV will only be shared after I agree to a specific role.
      </label>
      <button class="btn btn-block" type="submit">Join the talent pool <span class="arrow">&rarr;</span></button>
      <p class="form-note" tabindex="-1">Prototype: nothing was sent or stored.</p>
    </form>
  </div>
</section>`,
};

export default [staffing, pricing, sample, freeShortlist, candidates];
