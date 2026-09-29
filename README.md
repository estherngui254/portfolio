# Esther Syombua — Portfolio

A minimalist, responsive portfolio site built from Esther Syombua's CV
(BSc. Horticulture, JKUAT).

## Design

Follows a minimalist design system:

- **Neutral palette** — black, white and soft cream (`#f4f1ec`)
- **Two-column hero** — greeting on the left, professional intro + CTAs on the right
- **Pill UI** — navigation, buttons and chips use soft rounded shapes
- **Card system** — experience, education, skills and focus-area cards share one component style
- **Image-led work cards** — large illustration above title, category, date, description and CTA
- **Floating social rail** — fixed contact icons on the right (desktop only)
- **Responsive** — two-column layouts collapse to a single column; mobile gets a hamburger menu
- **No profile picture**, per request

## Structure

```
Portfolio/
├── index.html      All sections (semantic markup + inline SVG illustrations)
├── css/styles.css  Design system, components, responsive + print styles
├── js/main.js      Mobile menu, live clock, scroll-spy, reveal-on-scroll
└── README.md
```

## Run

No build step. Open `index.html` directly in a browser, or serve it:

```powershell
# PowerShell (Python 3)
python -m http.server 8080
# then visit http://localhost:8080
```

## Interactions

- **Live clock** in the nav, formatted for `Africa/Nairobi`
- **Hamburger menu** below 900px, closes on link click or `Escape`
- **Scroll-spy** highlights the section currently in view
- **Reveal-on-scroll** animations, disabled under `prefers-reduced-motion`
- **Print styles** that hide nav chrome and expand all cards

## Contact

- Email: [esther.ngui254@gmail.com](mailto:esther.ngui254@gmail.com)
