const articles = [
  {
    slug: "spot-fake-candidates",
    title: "How to spot fake candidates before the interview",
    tag: "Hiring",
    date: "2026-11-14",
    read: "6 min read",
    description: "Six checks recruiters can run on a CV before booking an interview, from overlapping dates to near-identical applications in the same batch.",
    body: ({ u }) => `
<p>Fake and heavily AI-written applications are now part of normal recruiting. For the first time in the survey's 19-year history, <a href="https://www.hrdive.com/news/ai-is-the-root-of-recruiters-biggest-stressors-survey-says/833223/">a third of recruiters named AI-polished CVs as their main stressor</a>. Gartner goes further and forecasts that <a href="https://www.refontelearning.com/blog/ai-fake-candidate-fraud">one in four candidate profiles worldwide will be fake by 2028</a>.</p>
<p>No single signal proves a candidate is fake. Treat each check below as a reason to ask a better question, never as a verdict.</p>
<h2>1. Overlapping full-time roles</h2>
<p>Two full-time jobs that overlap for months can be honest (a notice period, a freelance contract) or a sign that dates were stretched. Ask which role was full-time and request a reference from the second employer.</p>
<h2>2. Gaps nobody mentions</h2>
<p>A gap of six months or more is common and usually fine. The useful signal is a gap the CV hides, for example by listing years only. Ask what the candidate was doing during that time.</p>
<h2>3. A run of very short roles</h2>
<p>Three or more roles under a year each can mean contract work or a rough patch. It can also mean a CV built to look busy. Ask why they moved on each time and listen for specifics.</p>
<h2>4. Results without a method</h2>
<p>"Scaled ROAS to 4x" means little without the period, the budget and the candidate's own part. Ask how it was measured. People who did the work answer quickly and in detail.</p>
<h2>5. Contact details that don't line up</h2>
<p>No LinkedIn profile, or an email address that shares nothing with the candidate's name, is not proof of anything. It is a reason to verify identity on a video call before the interview stage.</p>
<h2>6. Near-identical CVs in the same batch</h2>
<p>Fraud investigators note that coordinated fake applications often share <a href="https://www.pulse.bot/human-resources/news/candidate-fraud-the-warning-signs-hr-should-watch-out-for-b7e4bb30-2fdf-467e-8115-eaff9ee82b04/">timing, devices and similar language</a>. Comparing each CV against the rest of the batch catches templates a one-by-one read misses.</p>
<blockquote><p>You can run the first five checks on up to 10 CVs for free with our <a href="${u("/tools/cv-screener/")}">CV Screener</a>. It runs in your browser, so no CV is uploaded anywhere.</p></blockquote>
<h2>What to do with a flag</h2>
<p>Write the question down and ask it in the screen. Most flags clear in a minute with a straight answer. The ones that don't are the ones worth your attention.</p>`,
  },
  {
    slug: "tracking-audit-checklist",
    title: "The 15-minute tracking audit for paid social",
    tag: "Marketing",
    date: "2026-11-14",
    read: "5 min read",
    description: "A quick self-check of your pixel, Conversions API and analytics setup before you raise ad spend. Find the leaks that make reported results unreliable.",
    body: ({ u }) => `
<p>Before you raise ad spend, check that the numbers you're scaling on are real. These checks take about 15 minutes and need only access to your ad account, your analytics and your store or CRM.</p>
<h2>1. Compare one week of sales</h2>
<p>Pick last week. Write down purchases in your store or CRM, purchases your ad platform reports, and purchases your analytics reports. Big gaps between the three are your first lead.</p>
<h2>2. Check for double counting</h2>
<p>If you send events from both the browser pixel and the Conversions API, each event needs a shared event ID so the platform counts it once. Without it, reported sales can run well above real ones.</p>
<h2>3. Look at match quality</h2>
<p>Your ad platform scores how well it can match events to people. Low scores usually mean email or phone data isn't being passed with the event.</p>
<h2>4. Read your UTM sources</h2>
<p>Open your analytics source report and look for the same channel spelled several ways, like "facebook", "Facebook" and "fb". Each spelling becomes its own row and splits your results. Our <a href="${u("/tools/utm-builder/")}">UTM Builder</a> flags these before you publish a link.</p>
<h2>5. Confirm your conversion window</h2>
<p>Know which attribution setting your account reports on. Comparing a 7-day click number to a 1-day click number is how good campaigns get turned off.</p>
<blockquote><p>Found more than one issue? Our <a href="${u("/marketing/diagnosis/")}">Growth Diagnosis</a> checks all of this in depth and hands you a written fix list.</p></blockquote>`,
  },
];

const index = {
  path: "/resources/",
  section: "resources",
  title: "Resources | Guides for recruiters and marketers",
  nav: "Resources",
  group: "Company",
  description: "Practical guides from Beyond Clicks on screening candidates, spotting fake applications and keeping ad tracking honest.",
  crumbs: [{ name: "Resources", path: "/resources/" }],
  body: ({ u, icon }) => `
<section class="page-hero">
  <div class="container">
    <span class="eyebrow">Resources</span>
    <h1 style="margin-top:16px">Guides you can use <span class="hl">today</span>.</h1>
    <p class="lead">Short, practical guides for recruiters and marketers. No gated PDFs.</p>
  </div>
</section>
<section class="section-tight">
  <div class="container grid grid-2">
    ${articles
      .map(
        (a) => `<a class="card reveal" href="${u(`/resources/${a.slug}/`)}">
      <div style="display:flex;gap:8px;flex-wrap:wrap"><span class="badge ${a.tag === "Hiring" ? "badge-wine" : ""}">${a.tag}</span><span class="small muted">${a.read}</span></div>
      <h2 style="font-size:var(--step-2)">${a.title}</h2>
      <p>${a.description}</p>
      <span class="card-foot">Read the guide ${icon("arrow")}</span>
    </a>`
      )
      .join("")}
  </div>
</section>`,
};

const articlePages = articles.map((a) => ({
  path: `/resources/${a.slug}/`,
  section: "resources",
  title: a.title,
  group: `Resources, ${a.tag}`,
  description: a.description,
  ogType: "article",
  crumbs: [{ name: "Resources", path: "/resources/" }, { name: a.title, path: `/resources/${a.slug}/` }],
  schema: { "@type": "Article", headline: a.title, datePublished: a.date, author: { "@type": "Organization", name: "Beyond Clicks" }, publisher: { "@id": "https://beyondclicks.example/#org" } },
  body: (h) => `
<article>
  <header class="page-hero"><div class="container">
    <span class="eyebrow">${a.tag}</span>
    <h1 style="margin-top:16px;font-size:var(--step-3);text-transform:none;max-width:22ch">${a.title}</h1>
    <div class="article-meta"><span>Beyond Clicks</span><time datetime="${a.date}">14 November 2026</time><span>${a.read}</span></div>
  </div></header>
  <div class="section-tight" style="padding-top:0"><div class="container prose">${a.body(h)}</div></div>
</article>`,
}));

export default [index, ...articlePages];
