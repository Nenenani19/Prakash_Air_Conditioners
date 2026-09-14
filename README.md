# Prakash Air Conditioners — Website

A cinematic, scroll-driven product showcase for **Prakash Air Conditioners**, an LG
system air-conditioning specialist across Andhra Pradesh & Telangana. The site pairs
real product 3D models, product/service photography, and content from the LG Salang
catalogue with an editorial, motion-first interface animated typography, scroll-triggered
reveals, a cursor-reactive layout, and a full light/dark theme system.

---

## Highlights at a glance

| Area | What it does |
|---|---|
| **Typography** | 4-font editorial system signature serif display, grotesk body, monospace technical accents |
| **Motion** | Scroll-triggered reveals, text-scramble/decode effects, count-up numbers, animated bar chart, cursor parallax, ripple clicks |
| **3D** | 9 real product models (`.glb`), lazy-loaded via `<model-viewer>` as each section enters view |
| **Icons** | Custom hand-drawn SVG icon set no icon font, no external icon library |
| **Theme** | Full light/dark mode, persisted across visits |
| **Responsive** | Tuned breakpoints for small phones → ultra-wide monitors |
| **Accessibility** | `prefers-reduced-motion` support, semantic markup, ARIA labels on interactive controls |
| **Performance** | WebP imagery, lazy 3D loading, hidden-but-functional scrollbar, GPU-friendly transforms |

---

## How to actually view this site

Browsers block 3D model loading (and some fonts/scripts) when you open `index.html`
directly by double-clicking it (the `file://` protocol). **You must serve the folder
over HTTP.**

**Option A - quickest, for local preview:**
```bash
cd this-folder
python3 -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

**Option B - for the live site:** upload the whole folder (as-is, keeping the folder
structure) to any static host Netlify, Vercel, GitHub Pages, cPanel/shared hosting,
or a subfolder on your existing domain. No build step is required; it's plain
HTML/CSS/JS.

---

## File structure

```
index.html              → all page markup, content and section order
css/style.css            → the entire visual system (typography, color, layout, motion)
js/main.js               → preloader, theme toggle, scroll reveals, text-decode effect,
                            lazy 3D model loading, cursor + parallax, count-up numbers,
                            chart bar animation, contact-form mailto handler, ripple fx
assets/models/*.glb       → 9 product 3D models (see mapping below)
assets/images/*.webp     → product + service photography, compressed for the web
```

---

## Typography the "creative fonts" system

The interface deliberately mixes three type families to create an editorial, high-end
feel rather than a generic sans-serif template:

| Role | Font | Used for |
|---|---|---|
| **Display** | [Fraunces](https://fonts.google.com/specimen/Fraunces) (variable, optical-size aware) | The hero signature wordmark, section headlines warm, slightly quirky serif with editorial weight |
| **Accent serif** | [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) | Italic accent moments in copy |
| **Modern / body** | [Manrope](https://fonts.google.com/specimen/Manrope) (300–800 weights) | Body copy, navigation, buttons clean geometric grotesk for legibility |
| **Technical** | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | Eyebrow labels, stats, technical specs gives a precision-engineering feel |

Fonts load via Google Fonts with `preconnect` hints for fast first paint, and the hero
signature (`Prakash Air Conditioners`) animates in as two stacked lines that slide up
from below their own line height a "curtain reveal" rather than a simple fade.

---

## Animation & motion system

Everything below runs on native CSS transitions/`transform`s plus small vanilla-JS
controllers in `main.js` no animation library, so there's nothing extra to load.

### On page load
- **Preloader** animated "P·A·C" mark with a progress bar that fills as assets load
- **Hero intro sequence** eyebrow label fades up word-by-word, the two-line signature
  headline slides up from a full line-height offset, tagline and CTA fade/rise in
  afterward, each staggered a fraction of a second apart
- **Atmospheric particle canvas** a `<canvas>`-based airflow effect drifts translucent
  particles across the hero background (auto-disabled under reduced motion)
- **Slow-rotating decorative rings + floating service icons** in the hero background

### Scroll-triggered effects (`IntersectionObserver`-based)
- **Section reveals** cards, feature tiles, and service photos fade + rise into view
  the moment they cross the viewport threshold, staggered in sequence
- **Product showcase stages** each of the 9 product sections alternates left/right
  layout; on scroll-into-view: the 3D model visual and copy panel fade/rise in on
  independent timings, the airflow diagram animates in, and the **product name
  scrambles/decodes** letter-by-letter from random characters into the real name
  (a "terminal decode" effect)
- **Lazy 3D loading** each `<model-viewer>` only starts downloading its `.glb` file
  the instant its section approaches the viewport, keeping initial page weight low
- **Word-by-word opacity wash** on the mid-page statement line
- **Count-up numbers** hero stats (9 System Types, 2 Cities, ₹22Cr+ Turnover) and
  the turnover figures animate from 0 up to their final value with an eased curve
- **Animated bar chart** the Annual Turnover bars grow from 0 to their target height
  once scrolled into view
- **Final headline** words rise in individually, staggered, as the closing CTA
  section appears

### Interaction feedback
- **Custom cursor** a smoothed, lagging dot cursor (desktop/pointer devices only)
  that enlarges over links, buttons, and product visuals
- **Cursor-driven parallax tilt** on each product visual the 3D model subtly tilts
  toward the pointer
- **Ripple/press animation** on all primary buttons via `[data-ripple]`
- **Scroll progress rail** a thin fixed bar across the top fills as the user scrolls
  down the page
- **Smooth in-page scrolling** for all anchor navigation (`scroll-behavior: smooth`)

### Respecting the user
- Every animation above checks `prefers-reduced-motion` and either skips or
  short-circuits straight to the final state — nobody is forced to watch effects they've
  asked their OS to minimize.

---

## Icons

All icons are **hand-built inline SVG** no icon font (e.g. Font Awesome) and no
external icon package, which keeps the page fast and lets every icon inherit the
theme's `currentColor` for automatic light/dark adaptation. Current set includes:

- Navigation: sun / moon (theme toggle), hamburger menu
- Hero: snowflake, airflow vanes, thermometer, water droplet (floating background icons)
- Product sections: per-product **airflow visualisation** icons tuned to each system
  type (wall-mounted, cassette, ducted, multi-V, etc.)
- Product catalogue: line-icon placeholders for the two products without photography
  (Window AC, Floor Standing)
- Contact / footer: phone, email, Instagram, location markers

**To add more icons:** drop a new inline `<svg>` block anywhere in `index.html` using
`stroke="currentColor"` (or `fill="currentColor"`) so it automatically follows the
active theme's ink color, then style/position it in `css/style.css`.

---

## 3D model → product mapping (9 systems, in on-page order)

| # | Section (on site) | File in `assets/models/` | Notes |
|---|---|---|---|
| 01 | Window AC | `01-window-ac.glb` | |
| 02 | Wall Mounted | `02-wall-mounted.glb` | Split / high-wall unit |
| 03 | Floor Standing | `03-floor-stand.glb` | |
| 04 | 1-Way Cassette | `04-cassette-1way.glb` | |
| 05 | 4-Way Cassette | `05-cassette-4way.glb` | |
| 06 | Low Static Duct | `06-duct-low-static.glb` | |
| 07 | High Static Duct | `07-duct-high-static.glb` | |
| 08 | LG Multi V S | `08-multi-v-s.glb` | |
| 09 | LG Multi V 5 | `09-multi-v-5.glb` | |

Round Cassette and 2-Way Cassette are not part of the line-up.

**To swap any model later:** replace the file at the path above (keep the filename),
or update the `data-src="assets/models/..."` attribute on the matching
`<model-viewer>` tag in `index.html`.

**Window AC / Floor Standing catalogue cards:** since no product photography was
supplied for these two, their cards in the Product Catalogue grid use a line-icon
graphic instead of a photo. Swap in a real photo any time by replacing the
`.product-card-img.is-icon` block with an `<img>` tag, same as the other seven cards.

---

## Visual / interface system

- **Color system** CSS custom properties drive two full palettes (dark default,
  light on toggle): warm brass accent (`--accent`, engineering/precision) and cool
  mist accent (`--mist`, air/cooling), both computed from CSS variables so every
  themed element updates instantly on toggle
- **Motion tokens** shared easing curves (`--ease-out`, `--ease-in-out`) and
  durations (`--dur-s/m/l`) keep every animation in the site feeling consistent
- **Grain/noise overlay** for a subtle filmic texture over flat backgrounds
- **Fully hidden scrollbar** (still scrollable) across Chrome/Firefox/Safari, for a
  cleaner full-bleed look
- **Responsive breakpoints** tuned for small phones, phones, tablets, laptops, and
  ultra-wide screens

---

## Page sections (in order)

1. **Hero** cinematic dark intro, animated signature wordmark, particle canvas,
   floating icons, stat counters, scroll cue
2. **3D Showcase** 9-part scroll journey through the full product range
3. **Product Catalogue** grid of all products with photos/icons
4. **Engineered Details** feature grid
5. **Services** photo strip (installation, servicing, maintenance, cleaning, filter,
   complaint support)
6. **Annual Turnover** animated growing bar chart with count-up values (FY22-23
   through FY25-26, FY25-26 marked "Projected")
7. **Awards & Achievements** Outstanding Service, Highest Product Sale AP & Non metro cities
8. **About** company story + client marquee
9. **Final CTA + Contact** email, phone numbers for both cities, Instagram, service
   area, and a contact form

---

## Contact form behavior

There is no backend on a static site, so "submit" builds a pre-filled `mailto:` link
(subject, name, phone, request type, reply-to email, message) and hands off to the
visitor's own mail app the most reliable zero-infrastructure option. For a true
server-side submission that doesn't depend on the visitor having a mail client
configured, a small backend or a form service like Formspree would need to be wired
in.

---

## Things to double-check before going live

- **Award copy** titles and 2025 year are exactly as supplied
- **Turnover figures** FY22-23 through FY25-26 exactly as supplied; FY25-26 marked
  "Projected"
- **Phone numbers** Vijayawada 098665 55281 / 99661 24984, Hyderabad 99488 15104 /
  85238 79212 — verify these render/dial correctly
- **3D model framing** this build was tested without live access to the
  `model-viewer` CDN script, so camera framing on first real load should be checked;
  nudge `camera-orbit` / `field-of-view` on the relevant `<model-viewer>` tag in
  `index.html` if a model looks off-center, too close, or too far

---

## Tech stack

Plain HTML5 / CSS3 / vanilla JavaScript (ES6+) no framework, no build step, no
bundler. Only external dependencies are Google Fonts and the `model-viewer` web
component (loaded via CDN) for glTF/GLB rendering.