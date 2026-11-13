# GeoKnow design system — microsoft.com / Fluent 2

The whole site follows the look and motion of **microsoft.com** (Fluent 2):
white canvas, Segoe UI, Microsoft blue `#0067b8`, generous whitespace,
full-bleed sections alternating white and `#f2f2f2`, rounded cards with soft
Fluent shadows for interactive cards, "Learn more ›" links, and purposeful,
brief motion. Real project photography takes priority over generated scenes.

References: [Microsoft 365](https://www.microsoft.com/en-us/microsoft-365),
[Fluent typography](https://fluent2.microsoft.design/typography),
[Fluent motion](https://fluent2.microsoft.design/motion), and
[Fluent elevation](https://fluent2.microsoft.design/elevation).

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
5. Elevation: resting cards `--shadow-2`, hovered `--shadow-8`, flyouts
   `--shadow-16`, modals `--shadow-64`. Tool panels use subtle borders without
   shadows. Hover changes elevation without moving or scaling content.
6. Colour: blue is the only accent for interactive things. Status colours only
   for status (`--ms-success`, `--ms-warning`, `--ms-danger` + `-bg`).

## Restraint rules — avoid the "AI generated" look

microsoft.com is calm and flat. Its polish comes from photography, type scale
and spacing, not from effects. These are banned unless noted:

- **No decorative glows**: no `radial-gradient` blobs/meshes, no glowing dots
  (`box-shadow: 0 0 8px <colour>`), no coloured drop shadows
  (`rgb(0 103 184 / x)` shadows). Use the neutral `--shadow-*` ramp only.
- **No neon cyan** (`#50e6ff`, `#8ce9ff`, `#a6ecff`, `#4cc2ff` as text/borders).
  On dark navy use white, `rgb(255 255 255 / 80%)` for muted text, and plain
  white underlined links. `--ms-blue-bright` is only
  allowed for focus/links on dark if contrast requires it.
- **No glassmorphism**: no `backdrop-filter` except the sticky navbar.
- **No decorative grids / noise / mesh backgrounds**. Section backgrounds are
  solid: `#fff`, `--ms-gray-30` (`#f2f2f2`), or solid `--ms-navy`.
- **Gradients** only as a functional photo scrim for text legibility
  (black/navy → transparent), a loading indicator, or the geological depth
  spectrum. Never on buttons, cards, borders or text.
- **Eyebrows are plain text**: sentence case, 14px, weight 600, no pill, no
  dot, no letter-spaced uppercase.
- **Pills** (`border-radius: 999px`) only for small status badges and filter
  chips. Not for eyebrows, captions or tag lists — use plain text separated by
  `·` or a thin vertical rule.
- **Buttons are flat**: solid fill, 4px radius, darker fill on hover. No shine
  sweep, no lift (`translateY`), no inset highlights, no coloured glow.
- **Cards**: white, `--shadow-2` (or 1px border), hover → `--shadow-8`. No
  scale, no cursor-follow spotlight, no gradient accent bars.
- **No emoji as icons**. Use the inline SVG line icons (1.5px stroke, 24px box).
- **Motion is quiet**: fade + ≤8px rise, no scale-in, no zoom-on-hover larger
  than `scale(1.03)` on photos.
- Coloured top borders (`border-top: 4px solid blue`) on every card read as
  template-y; use at most one accent per section, e.g. the selected item.

## Motion

| Use | Duration | Easing |
| --- | --- | --- |
| hover colour/background | `--motion-hover` (150ms) | `--ease-easy` |
| hover shadow | `--duration-normal` (200ms) | `--ease-easy` |
| page change (fade only) | `--motion-page` (200ms) | `--ease-decelerate-mid` |
| element enter (fade + ≤8px rise) | `--motion-enter` (300ms) | `--ease-decelerate-max` |
| element exit | 150–200ms | `--ease-accelerate-mid` |
| press | darker background, no transform | `--ease-easy` |

- Route changes already animate (`components/ms/PageTransition.js`).
- Use `<Reveal>` (`components/ms/Reveal.js`) for scroll-in of sections/cards.
  Stagger siblings with `delay={index * 60}` (automatically capped at 200ms).
  Above-the-fold content is immediately visible; only content below the viewport
  is deferred. All content remains readable without IntersectionObserver.
- Panels that appear (results, accordions, dialogs) should fade/slide in with a
  keyframe using the tokens above.
- All animation is disabled automatically under `prefers-reduced-motion`.
- The home carousel pauses on hover, keyboard focus, and hidden browser tabs.
  Reduced motion starts it paused. Both tab sets support arrows and Home/End.
- Sticky tools and anchor links use `--header-height`, measured by the navbar,
  to account for language, wrapping announcements, dismissal, and viewport changes.

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

