// Site-wide settings. Change SITE.url once the domain is bought.
export const SITE = {
  name: "Beyond Hive",
  url: "https://beyondhive.example",
  description:
    "Beyond Hive grows marketing-led brands, sources vetted marketing talent for agencies in the US, UK and Canada, and builds free tools for recruiters and marketers.",
  email: "hello@your-domain.com",
};

export const NAV = [
  { key: "marketing", label: "Marketing", path: "/marketing/", blurb: "Grow with clean data" },
  { key: "staffing", label: "Staffing", path: "/staffing/", blurb: "Vetted marketing talent" },
  { key: "tools", label: "Tools", path: "/tools/", blurb: "Free screener and builders" },
  { key: "resources", label: "Resources", path: "/resources/", blurb: "Guides and checklists" },
  { key: "about", label: "About", path: "/about/", blurb: "Who we are" },
];

export const SUBNAV = {
  marketing: [
    { label: "Marketing", path: "/marketing/" },
    { label: "Growth Diagnosis", path: "/marketing/diagnosis/" },
    { label: "Our work", path: "/marketing/work/" },
  ],
  staffing: [
    { label: "Staffing", path: "/staffing/" },
    { label: "Pricing", path: "/staffing/pricing/" },
    { label: "Sample shortlist", path: "/staffing/sample-shortlist/" },
    { label: "Free shortlist", path: "/staffing/free-shortlist/" },
    { label: "For candidates", path: "/staffing/candidates/" },
  ],
  tools: [
    { label: "All tools", path: "/tools/" },
    { label: "CV Screener", path: "/tools/cv-screener/" },
    { label: "Screener pricing", path: "/tools/cv-screener/pricing/" },
    { label: "UTM Builder", path: "/tools/utm-builder/" },
  ],
};

export const CTA = {
  marketing: { label: "Book a diagnosis", path: "/marketing/diagnosis/#book" },
  staffing: { label: "Get 3 free candidates", path: "/staffing/free-shortlist/" },
  tools: { label: "Open the screener", path: "/tools/cv-screener/" },
  default: { label: "Talk to us", path: "/contact/" },
};
