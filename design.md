---
name: Wines of Israel — Design System
version: 1.0.0
source: http://localhost:3000 + screenshots/fullpage-desktop.png
title: Wines of Israel — Design System
emphasis: design system + reconstruction
analysis_date: 2026-05-20
confidence: high
---

# Wines of Israel — Design System

A premium Light Mode cinematic wine catalogue site. Editorial luxury direction:
**warm ivory canvas, deep oxblood wine accent, italic Cormorant display, restrained
ornamentation**. The brand voice is "international wine campaign" — calm, expensive,
unhurried — not SaaS, not AI lab.

The **ONE brand thing**: the italic `<em>` element rendered in deep wine red against
the ivory canvas. Every display headline carries it (`Wines of Israel`, `for the world`,
`One country of wine`). It is set as a global CSS rule — the whole brand identity is
load-bearing on this single typographic gesture.

---

## 1. Identity

**Personality**: editorial, restrained, sensual. Wine-magazine pacing, not landing-page urgency.

**Mood / atmosphere**: warm afternoon light on stone and paper. The cream backdrop is the
"page" of a printed wine catalogue; the wine red is the seal pressed into it. Heavy
italics + serif drop the temperature into 'editorial'.

**Brand voice rules**:
- Use words from the wine world: *cellar, terroir, estate, vintage, pour, allocation*.
- Avoid SaaS verbs: *platform, dashboard, onboarding, optimize*.
- Italic Cormorant carries emphasis. Reserve UPPERCASE sans for tracked labels (meta tags only).

---

## 2. System (tokens)

### 2.1 Color tokens — ✅ high confidence (extracted from `:root` in `styles.css`)

| Token | Value | Intent |
|---|---|---|
| `--bg`        | `#f4ecd8` | Warm ivory canvas — page background |
| `--bg-2`      | `#ede2c4` | Deeper champagne — section breaks, scrollbar track |
| `--bg-3`      | `#fbf6e8` | Lightest cream — card surface |
| `--bg-4`      | `#faf3df` | Near-white warm — card hover surface |
| `--ink`       | `#2a1810` | Warm dark brown — primary text |
| `--ink-dim`   | `#6b5644` | Mid neutral — body text |
| `--ink-mute`  | `#9b8870` | Soft stone — captions, meta |
| `--wine`      | `#5a0e1f` | Deep oxblood — primary accent, italic `em`, CTAs |
| `--wine-2`    | `#7c1a2c` | Lifted wine — gradient stop, hover |
| `--wine-3`    | `#a52d3d` | Warm wine highlight — gradient stop, nested CTA icon |
| `--gold`      | `#b89456` | Warm gold — focus ring, scrollbar top stop, dividers |
| `--gold-dim`  | `#8a6b3a` | Darker gold — fine rules |
| `--stone`     | `#a8967a` | Warm stone — incidental |
| `--rule`      | `rgba(42, 24, 16, 0.14)` | Hairline rules |
| `--rule-soft` | `rgba(42, 24, 16, 0.07)` | Whisper rules |

Wine red is the only accent. Gold is a structural mid-tone, not a second accent.
There are no blues, greens, or purples in the palette.

### 2.2 Typography tokens — ✅ high confidence

| Token | Value |
|---|---|
| `--serif` | `"Cormorant Garamond", "Cormorant", "EB Garamond", serif` — display |
| `--sans`  | `"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` — UI labels, body |

**Type scale** (from typography utility classes):

| Class | Family | Weight | Size (clamp) | Line height | Tracking |
|---|---|---|---|---|---|
| `.display-xl` | Cormorant | 400 | `clamp(56px, 9vw, 152px)` | 0.92 | -0.02em |
| `.display-l`  | Cormorant | 400 | `clamp(40px, 5.6vw, 92px)` | 1.00 | -0.015em |
| `.lede`       | Cormorant *italic* | 300 | `clamp(17px, 1.4vw, 22px)` | 1.55 | normal |
| `.wine-eyebrow` | Cormorant *italic* | 400 | `clamp(15px, 1.1vw, 18px)` | normal | 0.02em |
| `.eyebrow` (legacy) | Outfit | 500 | 11px | 1.5 | 0.28em UPPERCASE |
| Body | Outfit | 300 | 16px | 1.5 | normal |
| Meta labels | Outfit | 500 | 10.5px | 1.5 | 0.32em UPPERCASE |

Weights actually used: **300** (body lede), **400** (display + most serif), **500** (sans labels). No 600/700 in production.

### 2.3 Spacing scale — ✅ high confidence

Vertical padding uses a **non-linear, generous scale** keyed to section weight:

- **Micro**: `4 / 8 / 12 / 14 px` — chip / inline rules
- **Small**: `18 / 22 / 28 / 36 px` — card internal padding, headline → lede gap
- **Medium**: `60 / 80 / 96 px` — section-rest dividers
- **Large**: `120 / 140 / 160 px` — between section-head and content
- **Macro**: `180 / 200 / 220 / 240 px` — top/bottom section padding on regions/wineries/trade

Horizontal containers: `padding: 0 6vw` is the global rhythm. Max widths: `1320 / 1480 px` depending on section.

### 2.4 Radii — ✅ high confidence

| Token | Use |
|---|---|
| `2px / 4px` | Card edges (calm + restrained) |
| `999px` (pill) | CTAs, chip filters, nested CTA icon, scrollbar thumb |
| `0` | Section bands, meta info underline |

No `16px / 24px / 32px` "rounded card" radii — the design prefers either sharp paper edges or full pills.

### 2.5 Motion grammar — ✅ high confidence

```
--ease-fluid:     cubic-bezier(0.32, 0.72, 0, 1)   — signature
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1) — tactile micro-overshoot
--ease-out-heavy: cubic-bezier(0.22, 0.61, 0.36, 1)
--ease-out-soft:  cubic-bezier(0.16, 1, 0.3, 1)

--dur-fast:       250ms
--dur-base:       500ms
--dur-slow:       900ms
--dur-cinematic:  1200ms
--dur-display:    1400ms

--stagger:        90ms
```

No `linear`. No `ease-in-out`. Hover lifts use `transform translateY` + `scale(1.012)`. Entry uses `translateY(60px) + blur(12px) → 0/0` over 1.2 s. **Reveal-on-scroll** via `IntersectionObserver` + `.is-visible` toggle.

### 2.6 Elevation / tinted shadows

- `--shadow-wine-sm`: `0 6px 18px -8px rgba(90, 14, 31, 0.18)` — small lift
- `--shadow-wine-md`: `0 18px 40px -14px rgba(90, 14, 31, 0.28), 0 4px 10px -4px rgba(42, 24, 16, 0.10)` — card hover
- `--shadow-gold-md`: `0 20px 44px -16px rgba(184, 148, 86, 0.32), …` — featured-maker card hover

**Rule**: shadows are always wine- or gold-tinted. No pure-black `rgba(0,0,0,*)`.

### 2.7 Decorative depth

- Global `.film-grain` fixed overlay — SVG turbulence at 0.04 opacity, multiply blend
- Global `.cinematic-grade` fixed overlay — barely-visible LUT, overlay blend
- Global `.paper-texture` fixed overlay — radial dot pattern, 0.04 opacity, multiply
- Per-section vignettes via `.cinema-vignette` (cinema + glass only)
- Custom warm scrollbar (gold→wine gradient)

---

## 3. Components

### 3.1 Generic components

| Component | Variants | Notes |
|---|---|---|
| **CTA** | `.cta-primary`, `.cta-outline`, `.cta-ghost` (+ `.cta-lg` modifier) | Pill (999px). Primary + outline carry a nested circular `::after` arrow that magnetically lifts on hover. Ghost is an italic serif text link with a "drip" underline animated via `background-size`. Custom cubic-bezier `(0.32, 0.72, 0, 1)` over 450 ms. Active state `scale(0.98)`. |
| **Chip / filter** | `.chip`, `.chip-active` | Italic serif, no caps. Wine border. Sliding wine fill on hover (`::before scaleX 0→1`). |
| **Eyebrow** | `.wine-eyebrow` (current), `.eyebrow` (legacy) | Italic serif phrase between two fleurons (`✦` glyph). Replaces tracked-uppercase sans label. |
| **Section rest** | `.section-rest-calm` | Editorial pause between sections. Tiny fleuron + italic phrase + thin centered vertical rule above. No vine sprigs (removed in calm pass). |

### 3.2 Signature components — the brand-unique ones

| Component | Description |
|---|---|
| **`CinemaStage`** | First section. Scroll-scrubbed `wine-pour.mp4` via `ScrollScrubVideo` (rAF lerp on `currentTime`). Soft cream gradient mask at the bottom hides the wine-impact zone + Veo watermark. Editorial caption strip at the bottom carries the section's italic display headline + lede. |
| **`GlassStage`** | Mid-page. Scroll-scrubbed `wine-glass-pour.mp4`. Same Galilee terroir backdrop continues. Vertical italic serif side-meta on the left edge. Italic serif `display-xl` headline on the right. Country-marquee scrolls export markets at the bottom. |
| **`RegionCard` (calm)** | Single clean cream card. Top: Roman numeral + 10 px color swatch (the **lot mark**). Centered motif SVG. Italic serif region name (40–52 px). Italic body description. Hairline + small-caps meta line. **Hover**: 2 px vertical wine rule scales up on the left edge. No bezel, no watermark, no inner radial. |
| **`WineryCard`** | Double-bezel architecture (outer shell + inner core via `::before` with concentric radii). Featured maker (`.winery-card-featured`) spans 2 columns, gets a wider 11 px bezel + warm-gold inner spotlight + tilted "Estate of the season" banderole. |
| **`WaxSeal`** | SVG monogram seal in footer — deep oxblood wax with ragged edges, drop shadow, inner highlight, "W·I" italic Cormorant glyph. |
| **`VineSprig` / `Fleuron`** | SVG ornaments used as section dividers. Fleuron is a small diamond; vine sprig is currently retired from section-rests after the calm pass — only the footer uses one. |
| **`PremiumFooter`** | Three-column "cellar" layout — *The Cellar*, *For Trade*, *Visit*. Brand block on the left with wax seal + italic tagline + cellar address. Italic French motto at the bottom: *Au verre, au cœur, à la terre*. |

### 3.3 Section inventory

`CinemaStage` → `SectionRest "From the land of sun, stone & vine"` → `RegionsSection` → `SectionRest "A glass is the smallest harvest"` → `GlassStage` → `SectionRest "The makers, and the bottles they ship"` → `WinerySection` → `SectionRest "Open the cellar door"` → `TradeCTA` → `PremiumFooter`.

---

## 4. Layout

### 4.1 Grid + containers

- Page container: full-width with `padding: 0 6vw` per section
- Inner max-widths: `880 / 1280 / 1320 / 1480 px`
- **Regions grid**: `grid-template-columns: repeat(3, 1fr)`; gap `36 px`; max-width `1320 px`
- **Wineries grid**: `repeat(3, 1fr)`; featured card spans 2; gap `28 px`
- **Footer**: `grid-template-columns: 1.3fr 2fr` on the outer split; inside the right side `repeat(3, 1fr)` for the cellar columns

### 4.2 Composition patterns

- **Centred editorial captions** at the bottom of pinned video sections (CinemaStage + GlassStage)
- **Vertical side-meta** on the left edge of GlassStage (`writing-mode: vertical-rl`)
- **Country marquee** scrolls at the bottom of GlassStage (32 s linear loop)
- **Section rests** are centered, single-fleuron, italic phrase between
- **No asymmetric bento**, no off-grid overlaps, no diagonal flow. The design favours **calm symmetry** over editorial drama at the layout level.

### 4.3 Responsive behaviour — ✅ high confidence

Breakpoints: `900 px`, `700 px`, `600 px`.

- Regions grid collapses 3 → 2 → 1 column
- Wineries `is-curated` grid collapses to single column with the featured card spanning `1`
- `.hero-side-meta` (vertical labels) hides below `900px` in some places
- `.export-marquee` and `.glass-side-meta` hide on mobile (`max-width: 900px`)
- Display headlines drop to `clamp(36–56 px)` on mobile
- Section padding shrinks: regions `200/220 px` → `120/140 px`
- Touch targets: CTAs 48+ px tall at mobile padding

### 4.4 Image behaviour

- **Two scroll-scrubbed video assets**: `videos/wine-pour.mp4` (5.3 MB, 8 s, keyframe every 4) + `videos/wine-glass-pour.mp4` (4.9 MB, 6 s, keyframe every 4)
- Both `<video muted playsInline preload="auto">`, `currentTime` driven by rAF lerp on section scroll progress
- `object-fit: cover` with `object-position: 35% 30%` (pour) / `50% 55%` (glass)
- Variant mask gradients hide wine-impact zones in cover-cropped overflow

---

## 5. Reconstruction

### Suggested stack

What's actually shipping:

- Vanilla HTML + React 18 via `unpkg` UMD
- JSX compiled in-browser by `@babel/standalone@7.29.0`
- Single `styles.css` (~3,810 lines) — no preprocessor
- Custom Element `image-slot.js` for user-droppable images
- No build step, no `package.json`
- Dev server is a custom Node static server with HTTP `Range` support (required for video scrubbing)

### Quick wins for reconstruction

1. **Copy the `:root` block** in `styles.css` — that's the entire token system.
2. **Reuse `ScrollScrubVideo`** in `bottle.jsx` — the rAF lerp + iOS Safari `play().then(pause)` prime + variant class hooks are the load-bearing logic for the cinematic identity.
3. **Reuse `.cta-primary` + `::after`** for the button-in-button pill — that's the most replicated motion pattern.
4. **Reuse `.region-card.region-card-rich` calm-pass rules** — clean cream + lot mark + vertical hover rule. Don't reintroduce double-bezel here.

### Tricky bits

- Cascade order matters: there are five passes of rules in `styles.css` — original, premium upgrade, wine-magazine, taste-pass, calm pass. The calm pass at the bottom wins via `!important` on a few structural properties. New rules must be appended at the end.
- `color-mix(in oklab, …)` is used in winery cards — browsers >94% support but older browsers fall through to the second gradient stop (graceful).
- Babel-in-browser adds ~600 ms FOUC on first load.

### Confidence map

| Layer | Confidence |
|---|---|
| Color tokens | ✅ extracted from `:root` |
| Typography | ✅ extracted from utility classes |
| Spacing scale | ✅ inspected directly |
| Motion grammar | ✅ extracted from `:root` |
| Component inventory | ✅ inspected JSX |
| Section rhythm | ✅ visual inspection of full-page screenshot |
| Layout responsive collapse | ✅ extracted media queries |

---

## 6. Brand Do's and Don'ts

### Do

- ✅ **Lead with italic Cormorant for display + emphasis.** Reserve sans for tracked uppercase meta only.
- ✅ **Wine red is the only accent.** Gold is a structural mid-tone (rules, focus ring). Don't introduce blue/green/purple.
- ✅ **Use tinted shadows** — `rgba(90, 14, 31, …)` for wine-tinted lift; `rgba(184, 148, 86, …)` for featured maker gold lift. Never pure black.
- ✅ **Generous section padding** (180–220 px top/bottom). The page is supposed to breathe.
- ✅ **Single editorial moment per scene.** Caption block + display headline + lede + one CTA pair. Don't crowd.
- ✅ **Custom cubic-bezier (0.32, 0.72, 0, 1) for everything.** Use the `--ease-fluid` variable.
- ✅ **Drive every video by `currentTime` from rAF lerp.** Never let a hero video autoplay.

### Don't

- ❌ **Don't reintroduce Roman-numeral chapter divider cards.** The previous pass tried it; reads as "essay structure" not wine.
- ❌ **Don't double-stack accents on cards.** One vertical hover rule on regions; one bottom stripe on wineries. Not both.
- ❌ **Don't add UPPERCASE titles** beyond the small-caps meta line. The brand's title voice is italic serif, not tracked sans.
- ❌ **No "Oops!" or "Elevate" copy.** Use wine-world verbs: *cellar, terroir, estate, allocation, pour*.
- ❌ **No `box-shadow: 0 4px 12px rgba(0,0,0,*)`.** Always tint shadows.
- ❌ **Don't animate `width/height/top/left`.** Only `transform` + `opacity` + `filter`.

---

## 7. Three observations about brand consistency / rhythm

1. **The italic `<em>` is the brand's load-bearing element.** A global rule sets `em { font-style: italic; font-family: var(--serif); color: var(--wine); }` — so every `<em>` in any markup automatically picks up the brand voice. This is elegant but risky: if a third-party component renders an `<em>` it will pull the wine red into unwanted contexts. Worth guarding with a more scoped rule on key sections.

2. **Section padding is consistent at 180–220 px but section-rest dividers are only 80 px**, creating a clear two-tier vertical rhythm: sections breathe, rests pulse. This is what makes the page feel calm rather than dense. **Maintain this 2.5× ratio** between section padding and rest padding in any future addition.

3. **Wine red appears at three saturations** (`#5a0e1f` / `#7c1a2c` / `#a52d3d`) and gold at two (`#b89456` / `#8a6b3a`) — the brand has a calibrated voltage map: wine is "voice", gold is "structure", and every component picks the appropriate level. The most common mistake in extending this design would be using `--wine-3` (the highlight) as a primary instead of `--wine` — keep the hierarchy.

---

## Open questions

- **Featured Maker rotation**: currently the first winery (`Domaine du Castel`) is hard-coded as featured. A CMS plug would be needed for rotation. Not in current build.
- **Real photography**: the regions section uses SVG motif illustrations + a small color swatch as the only per-region marker. Whether real estate photography should ever replace this is undecided — the calm pass deliberately stripped imagery to keep the page editorial. Confirm intent before adding back.
- **Mobile vintage tag**: hidden below 900 px because there's no room next to a centered eyebrow. If you want the year visible on mobile, inline it above the eyebrow.

---

## Lint status

To validate this design.md against the skill spec, run:
```
python "C:/Users/razg/Desktop/Wines of Israel/.claude/skills/anydesign/scripts/lint_design_md.py" "C:/Users/razg/Desktop/Wines of Israel/design.md"
```
