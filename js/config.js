/* =============================================================================
   PENTIUM CHAMBERS — config.js
   Single source of truth for firm data, endpoints & the client search index.
   -----------------------------------------------------------------------------
   BACKEND-READY NOTE
   Everything a future backend needs to override lives on window.PENTIUM.
   • Point PENTIUM.api.* at real endpoints and set PENTIUM.api.enabled = true.
   • forms.js will POST JSON there instead of running the local demo handler.
   • Search data can later be fetched from an API and merged into
     PENTIUM.searchIndex without touching search.js.
   ========================================================================== */
window.PENTIUM = (function () {
  "use strict";

  /* --- Firm facts (sourced from the official company profile) ------------- */
  const firm = {
    name: "Pentium Chambers",
    legalName: "Pentium Chambers — Legal Practitioners & Consultants",
    established: 2001,
    tagline: "Enduring Counsel. Modern Practice.",
    // Contact details taken from the company profile:
    email: "pentiumchambers@gmail.com",
    phone: ["+234 9 273 2568", "+234 803 332 7676"],
    address: {
      line1: "7B Suez Crescent, Ibrahim Abacha Estate",
      line2: "(Behind Sheraton Hotel), Zone 4, Wuse",
      city: "Abuja",
      country: "Nigeria"
    },
    // Placeholders — clearly marked for the firm to confirm:
    whatsapp: "2348033327676",           // [PLACEHOLDER — confirm WhatsApp line]
    hours: "Mon–Fri, 8:30am – 5:30pm (WAT)", // [PLACEHOLDER — confirm office hours]
    emergency: "+234 803 332 7676"       // [PLACEHOLDER — confirm emergency line]
  };

  /* --- API endpoints (disabled until a backend is connected) -------------- */
  const api = {
    enabled: false,                       // flip to true when endpoints are live
    base: "/api",
    contact: "/api/contact",
    consultation: "/api/consultation",
    careers: "/api/careers",
    newsletter: "/api/newsletter"
  };

  /* --- Animated statistics ------------------------------------------------ */
  const stats = {
    yearsFounded: firm.established,
    // computed live so the site never goes stale:
    get years() { return new Date().getFullYear() - firm.established; }
  };

  /* --- Client-side search index ------------------------------------------
     Kept flat & lightweight. A backend can later replace/extend this array. */
  const searchIndex = [
    { title: "Commercial Litigation", kind: "Practice", url: "practice-areas.html#commercial-litigation", text: "Disputes, contracts, debt recovery, injunctions, appellate advocacy for corporate bodies." },
    { title: "Corporate Law & Advisory", kind: "Practice", url: "practice-areas.html#corporate-law", text: "Company formation, governance, mergers, restructuring, shareholder agreements." },
    { title: "Banking & Finance Law", kind: "Practice", url: "practice-areas.html#banking-law", text: "Lending, security, receivership, regulatory compliance for banks and lenders." },
    { title: "Civil Litigation", kind: "Practice", url: "practice-areas.html#civil-litigation", text: "Property, tort, contract and general civil disputes across all courts." },
    { title: "Criminal Litigation", kind: "Practice", url: "practice-areas.html#criminal-litigation", text: "White-collar defence, economic crime, criminal advocacy and representation." },
    { title: "Constitutional Law", kind: "Practice", url: "practice-areas.html#constitutional-law", text: "Fundamental rights, judicial review, public and administrative law." },
    { title: "Oil & Gas", kind: "Practice", url: "practice-areas.html#oil-gas", text: "Energy transactions, licensing, joint ventures and sector disputes." },
    { title: "Arbitration & ADR", kind: "Practice", url: "practice-areas.html#arbitration", text: "Institutional and ad-hoc arbitration, mediation and arbitral settlement." },
    { title: "Information Technology Law", kind: "Practice", url: "practice-areas.html#it-law", text: "Data protection, AI governance, fintech, technology contracts and IP." },
    { title: "Capital Markets", kind: "Practice", url: "practice-areas.html#capital-markets", text: "Securities, issuances, market operations and regulatory filings." },
    { title: "Corporate Advisory", kind: "Practice", url: "practice-areas.html#corporate-advisory", text: "Board advisory, transactions, risk and strategic legal counsel." },
    { title: "Legal Consultancy", kind: "Practice", url: "practice-areas.html#legal-consultancy", text: "Policy formulation, drafting, research and specialist consultancy." },

    { title: "Okwudili Christopher Anozie", kind: "People", url: "team.html#principal-partner", text: "Principal Partner. Banking, corporate practice, litigation, oil & gas, capital markets and IT law." },

    { title: "Banking & Financial Institutions", kind: "Industry", url: "industries.html#banking", text: "Counsel to banks and lenders including GTBank, Polaris Bank and the CIBN." },
    { title: "Technology & Fintech", kind: "Industry", url: "industries.html#technology", text: "Advising technology, AI and fintech businesses on regulation and risk." },
    { title: "Energy & Natural Resources", kind: "Industry", url: "industries.html#energy", text: "Oil, gas and power sector transactions and disputes." },
    { title: "Government & Public Sector", kind: "Industry", url: "industries.html#government", text: "Statutory corporations, public policy and administrative law." },

    { title: "Corporate Governance in Nigeria", kind: "Insight", url: "insights.html#corporate-governance", text: "Board duties, compliance and the modern governance framework." },
    { title: "Artificial Intelligence & Nigerian Law", kind: "Insight", url: "insights.html#ai-law", text: "How emerging AI regulation is shaping commercial practice." },
    { title: "The Nigeria Data Protection Act", kind: "Insight", url: "insights.html#data-protection", text: "What the NDPA means for businesses handling personal data." },
    { title: "Company Registration: A Practical Guide", kind: "Insight", url: "insights.html#company-registration", text: "Incorporating at the CAC — structure, steps and pitfalls." },

    { title: "About Pentium Chambers", kind: "Page", url: "about.html", text: "Our history since 2001, mission, values and legal philosophy." },
    { title: "Careers & Internships", kind: "Page", url: "careers.html", text: "Opportunities, internships, culture and professional development." },
    { title: "Resources & Downloads", kind: "Page", url: "resources.html", text: "Company profile, legal guides, brochures and FAQs." },
    { title: "Contact & Consultation", kind: "Page", url: "contact.html", text: "Book a consultation, office location and contact details." }
  ];

  return { firm, api, stats, searchIndex };
})();
