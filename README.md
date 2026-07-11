# Pentium Chambers — Website

A bespoke, high-end marketing website for **Pentium Chambers — Legal
Practitioners & Consultants**, an Abuja-based commercial law firm established
in 2001.

Built with hand-written **HTML5, CSS3 and vanilla JavaScript** — no frameworks,
no build dependencies, no preloader. Designed to be **GitHub Pages compatible**
and structured so a backend can be added later with minimal effort.

> **Brand line:** *Enduring Counsel. Modern Practice.*

---

## Quick start

It's a static site — just open `index.html`, or serve the folder:

```bash
# Python
python3 -m http.server 8080
# then visit http://localhost:8080
```

Deploy by copying the folder to any static host (GitHub Pages, Netlify, Nginx,
S3, etc.). A `.nojekyll` file is included for GitHub Pages.

---

## Project structure

```
/
├── index.html            Home
├── about.html            The firm — history, mission, values, timeline
├── practice-areas.html   12 practice areas (deep-linkable accordions)
├── team.html             Principal Partner profile + modal
├── industries.html       11 industries served
├── insights.html         9 legal-insight articles
├── resources.html        Downloads, guides, FAQ, forms
├── careers.html          Opportunities, internships, application form
├── contact.html          Contact + consultation booking + map placeholder
├── privacy.html · terms.html · disclaimer.html   Legal
├── 404.html              Custom not-found page
│
├── css/
│   ├── theme.css         Design tokens, reset, base, typography (light + dark)
│   └── styles.css        Components, layout, sections, animation, responsive, print
├── js/
│   ├── config.js         Single source of truth: firm data, API endpoints, search index
│   ├── main.js           Nav, theme, scroll progress, reveals, counters, timeline, modal, cookies
│   ├── forms.js          Accessible validation + submission layer (backend-ready)
│   └── search.js         Client-side site search (Ctrl/⌘K)
├── images/               favicon.svg, og-cover.svg, hero-architecture.svg (placeholder art)
├── icons/                Standalone SVG icons + notes
├── documents/            Downloadable company profile + placeholder guides
├── _build/               Page partials + assembly script (see “Maintaining” below)
├── robots.txt · sitemap.xml · site.webmanifest
└── README.md
```

---

## Design system

| Token group | Notes |
|---|---|
| **Colour** | Deep Navy `#0a1e33`, Off-White `#f6f3ec`, Charcoal `#14181d`, Muted Gold `#c2a25c`, Slate greys; professional red/green for feedback. All defined as CSS custom properties in `theme.css`. |
| **Type** | Cormorant Garamond (display serif), Manrope (UI/body), IBM Plex Mono (labels, stats, indices). Loaded from Google Fonts. |
| **Dark mode** | `:root[data-theme="dark"]` overrides; toggled in the header and remembered in `localStorage`. |
| **Motion** | Subtle IntersectionObserver reveals, counters and timeline. Fully respects `prefers-reduced-motion`. |

Everything is driven by variables, so re-skinning (colours, spacing, radii, type
scale) means editing tokens in `theme.css` only.

---

## Features

- Sticky navigation that condenses on scroll and hides/reveals with direction
- Scroll-progress indicator, back-to-top, floating WhatsApp & consultation buttons
- Animated statistics, animated timeline, on-scroll reveals
- Attorney profile **modal** (focus-trapped, keyboard-accessible)
- **Search** overlay (`Ctrl`/`⌘` + `K`) over a lightweight client-side index
- Dark / light **theme toggle** (persisted)
- **Cookie consent** banner (persisted)
- Newsletter + contact + consultation + careers **forms** with inline validation,
  success/error toasts and status messages
- Print-friendly styles

---

## Accessibility

- Semantic HTML5 landmarks, skip-link, visible focus states
- ARIA on menus, dialogs, accordions, live regions
- Colour contrast targeted at **WCAG 2.2 AA**
- Full keyboard operability; `prefers-reduced-motion` honoured

---

## SEO

- Unique `<title>` / meta description per page, canonical URLs
- Open Graph + Twitter Card tags, social image (`images/og-cover.svg`)
- **Schema.org** JSON-LD: `LegalService`, `Person`, `AboutPage`, `CollectionPage`
- `robots.txt` + `sitemap.xml`

> Update the domain: the metadata uses `https://www.pentiumchambers.com/`.
> Find-and-replace this if the production domain differs.

---

## Backend-ready by design

The site is static but wired for a future backend:

1. Open `js/config.js`.
2. Set real endpoints on `PENTIUM.api` and flip `PENTIUM.api.enabled = true`.
3. `forms.js` will then `POST` form data as JSON to the endpoint named in each
   form's `data-endpoint` attribute (`contact`, `consultation`, `careers`,
   `newsletter`). Until then, a safe local demo handler runs (no network calls).

Firm details (address, phone, email, hours) also live in `config.js` and are
injected into the DOM, so there is one place to update them.

---

## Maintaining the shared header/footer

To keep the navigation and footer identical across every page, the 12 interior
pages are assembled from partials in `_build/`:

- `_build/header.html`, `_build/footer.html`, `_build/scripts.html` — shared
- `_build/<page>.meta.html` + `_build/<page>.main.html` — per-page
- `_build/head-top.html`, `_build/head-assets.html` — shared `<head>` pieces

Rebuild after editing a partial:

```bash
bash _build/build.sh about practice-areas team industries insights \
     resources careers contact privacy terms disclaimer 404
```

`index.html` is authored directly (its header/footer are the source the partials
were extracted from). The `_build/` folder is not required at runtime and is
excluded via `robots.txt`.

---

## Content review — items marked for the firm

Placeholders are clearly labelled in the markup (`[PLACEHOLDER …]`). Please
confirm before launch:

- WhatsApp number, office hours and emergency line (currently best-effort)
- Professional portrait of the Principal Partner (`images/`)
- Called-to-Bar year, professional memberships and languages (Team page)
- Partner/associate profiles, current job openings
- Real photography to replace the placeholder hero illustration
- Legal pages (Privacy, Terms, Disclaimer) — templates to be reviewed by the firm
- Corporate brochure and legal-form templates (Resources)

---

© Pentium Chambers. Duly registered at the Corporate Affairs Commission, Abuja.
