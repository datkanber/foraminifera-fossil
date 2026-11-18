# GeoKnow design system

The existing React application uses a dark-first interface inspired by the Strapi reference. No CMS or animation dependencies are added. The `ms-*` class names are retained for compatibility with existing pages.

## Tokens and scope

- `variables.css`: semantic colors, typography, spacing, radii and motion, plus legacy token aliases.
- `global.css`: shared layout, controls, cards and forms.
- `premium.css`: shared hero gradients, edge dots, tags and motion treatments.
- Page styles remain in `pages/`; shared navigation, footer and search styles in `components/`.
- Main canvas `#040711`, cards `#0c0f1b`, borders `#292d42`, primary buttons `#4945ff`, accessible text accent `#b9b3ff`, secondary text `#b3b8ca`.
- Poppins weights 400/500/600/700 load from local Latin/Latin-ext WOFF2 files with `font-display: swap` and system fallbacks. The SIL license is in `assets/fonts/OFL.txt`. Heading sizes use `clamp()`.
- Corners: 10px controls, 20px cards, 24px large media. Space follows an 8px base.
- The footer defines local light tokens; navbar tokens switch between dark and white. Search is a sibling of the header so it retains the application's dark theme in both states.

## Layout and motion

- Header observes a top-of-page sentinel with IntersectionObserver; its height is measured with ResizeObserver for sticky tools and anchor offsets.
- The existing dismissible STONE announcement sits above navigation and retains its session dismissal state.
- Hero decoration uses non-interactive CSS radial gradients and masked edge dots. Contained scientific plates and taxon thumbnails keep white backgrounds.
- Existing Reveal uses a shared observer, a 20px rise and 500ms fade, with 60?80ms sibling delays capped at 200ms. Above-the-fold content stays visible.
- Interactive cards use a 3px hover lift and subtle border changes. Images scale at most 1.03. Static panels do not lift.
- Menus fade and translate 8px in 300ms; header colors transition in 300ms. Reduced motion disables nonessential animation and card movement.
- Existing slideshow pause, keyboard tabs, forms, filtering, API requests and 3D canvas lifecycles are preserved.
- Mobile navigation below 1280px exposes every active page. Layouts stack at their existing tablet/mobile breakpoints; quick links use two columns on small screens.

## Retired interfaces

The evaluation workspace and user guide are removed from routes, navigation, search, UI modules and hosting proxy rules. Their API router and coordinator bootstrap are no longer mounted by the application. Offline research/analysis modules and historical study data remain available to the research scripts; no database records are deleted.

## Shared React components

```jsx
import PageHero from "../components/ms/PageHero";
import Reveal from "../components/ms/Reveal";

<PageHero
  eyebrow={lang === "tr" ? "Karar destek" : "Decision support"}
  title="…"
  text="…"
  tone="gray"            // gray (default) | light | brand | dark
  image={photo}          // optional – shows a rounded image on the right
  actions={<a className="ms-btn" href="#start">…</a>}
/>

<section className="ms-section ms-section--gray">
  <div className="ms-container">
    <Reveal className="ms-section-header">
      <div><h2>Title</h2><p>Lead text</p></div>
      <Link className="ms-link" to="/x">See all</Link>
    </Reveal>
    <div className="ms-grid ms-grid--3">
      {items.map((item, i) => (
        <Reveal as="article" className="ms-card ms-card--interactive" delay={i * 80} key={item.id}>
          <div className="ms-card-media"><img src={item.img} alt="" /></div>
          <div className="ms-card-body">
            <h3 className="ms-card-title">…</h3>
            <p className="ms-card-text">…</p>
            <div className="ms-card-footer"><Link className="ms-link" to="…">Learn more</Link></div>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
</section>
```

## Shared CSS classes (global.css)

- Layout: `ms-container`, `ms-container--wide`, `ms-section`, `ms-section--gray`,
  `ms-section--dark`, `ms-section-header`, `ms-section-title`, `ms-section-lead`,
  `ms-eyebrow`, `ms-grid` + `ms-grid--2|3|4|auto`.
- Buttons: `ms-btn` (primary purple), `ms-btn--secondary` (subtle border),
  `ms-btn--outline` (purple outline), `ms-btn--light` (secondary surface),
  `ms-btn--ghost-light` (outline on dark), `ms-btn--subtle`, sizes `ms-btn--sm|lg`,
  `ms-btn--block`.
- Links: `ms-link` ("Learn more ›" with animated chevron), `ms-link--plain`,
  `ms-text-link` (inline underlined body link).
- Cards: `ms-card`, `ms-card--interactive`, `ms-card--flat`, `ms-card--gray`,
  `ms-card-media`, `ms-card-body`, `ms-card-title`, `ms-card-text`, `ms-card-footer`.
- Tool UI: `ms-panel`, `ms-panel-header`, `ms-panel-body`, `ms-badge`
  (+ `--neutral|success|warning|danger`), `ms-input`, `ms-select`, `ms-textarea`,
  `ms-message` (+ `--warning|error|success`), `ms-pivot` + `ms-pivot-item`
  (tabs with sliding underline; mark selected with `aria-selected="true"` or
  `is-active`), `ms-skeleton`, `ms-spinner`, `ms-divider`, `ms-sr-only`.

## Rules for page work

- Keep all existing behaviour, data, state, API calls and TR/EN text. This is a
  visual redesign — only restructure JSX where needed for layout.
- Keep page-specific styles in the page's own CSS file, prefixed with the page
  name (e.g. `.fossils-…`). Remove obsolete rules you replace.
- Responsive down to 360px wide. Touch targets ≥ 40px.
- Accessibility: keep labels/aria, visible focus (`:focus-visible`), contrast.
- Verify syntax: from `client/` run
  `node scripts/check-syntax.cjs src/pages/X.js src/components/Y.js`.
  Production check: `npm run build`; verify representative pages and interactions in a browser.

