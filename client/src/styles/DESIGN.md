# GeoKnow design system — microsoft.com / Fluent 2

The whole site follows the look and motion of **microsoft.com** (Fluent 2):
white canvas, Segoe UI, Microsoft blue `#0067b8`, generous whitespace,
full-bleed sections alternating white and `#f2f2f2`, rounded cards with soft
Fluent shadows that lift on hover, "Learn more ›" links, and fast-out/slow-in
motion.

Tokens live in `styles/variables.css`; shared classes in `styles/global.css`.
**Always reuse tokens/classes — do not hard-code colours, shadows, easings.**

## Principles

1. **No boxed pages.** Do not wrap a whole page in one bordered white card on a
   grey background. Pages are full width: a `PageHero` banner at top, then
   `ms-section`s with content inside `ms-container`.
2. Alternate section backgrounds: white → `ms-section--gray` → white. Dark navy
   (`ms-section--dark`) for one high-impact band at most per page.
3. Typography: headings weight 600 (not 700), `letter-spacing: -0.01em`.
   Body 16px / 1.5, muted text `var(--color-text-muted)`.
4. Corners: buttons/inputs `--radius-md` (4px), cards/panels/images
   `--radius-lg` (8px). Never fully pill-shaped except badges.
5. Elevation: resting cards `--shadow-4`, hovered `--shadow-16`, flyouts /
   dialogs `--shadow-28`, modals `--shadow-64`. Prefer shadow over borders;
   use `1px solid var(--color-border-subtle)` for quiet separation.
6. Colour: blue is the only accent for interactive things. Status colours only
   for status (`--ms-success`, `--ms-warning`, `--ms-danger` + `-bg`).

## Motion

| Use | Duration | Easing |
| --- | --- | --- |
| hover colour/background | `--duration-faster` (100ms) | `--ease-easy` |
| hover lift / shadow | `--duration-slow` (300ms) | `--ease-decelerate-max` |
| element enter (fade + 16–28px rise) | 400–700ms | `--ease-decelerate-max` |
| element exit | 150–200ms | `--ease-accelerate-mid` |
| press | 100ms, `transform: scale(0.98)` | `--ease-easy` |

- Route changes already animate (`components/ms/PageTransition.js`).
- Use `<Reveal>` (`components/ms/Reveal.js`) for scroll-in of sections/cards.
  Stagger siblings with `delay={index * 80}` (keep ≤ 320ms).
- Panels that appear (results, accordions, dialogs) should fade/slide in with a
  keyframe using the tokens above.
- All animation is disabled automatically under `prefers-reduced-motion`.

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
- Buttons: `ms-btn` (primary blue), `ms-btn--secondary` (white/grey border),
  `ms-btn--outline` (blue outline), `ms-btn--light` (white on dark),
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
  Do **not** run `npm run build` / `npm start` (the coordinator does that).

