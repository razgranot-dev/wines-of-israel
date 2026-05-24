# Wines of Israel — v2 Design Direction
**"Cinematic Magazine"** · Runway × Apple × Airbnb · 2026-05-24
*Branch: `design-experiment-awesome-md` · Local only · Production untouched*

---

## The anchor metaphor

A hardcover wine atlas crossed with a Criterion Collection film essay.
- Editorial restraint (Apple)
- The gravity of a cinema title sequence (Runway)
- Warmed by the human voice of a travel journal (Airbnb)

It is *not* a tech-startup landing page. It is not a SaaS dashboard. It does not have glassmorphism, badges, scarcity copy, gradients, or a "join the waitlist" hero CTA.

---

## What stays (locked, do not change)

- **`ScrollScrubVideo` component** — the rAF + lerp + `currentTime` write loop in `bottle.jsx`. It works on the live deploy and is the spine of the experience.
- **Sticky-stage heights:** `CinemaStage` 500vh, `GlassStage` 320vh. The video phase math is keyed to these.
- **The two `videos/*.mp4` files.** No re-encoding, no replacement.
- **React + Babel-in-browser** (no build step), `serve.py` local dev workflow.
- **Section narrative order** — Hero/Cinema → Regions → Glass → Wineries → Trade/CTA → Footer.
- **Content** — copy, region names, winery names, the "Ancient terroir. Modern craft." line. Edit only when an Apple-style line can replace a SaaS-style one.

## What gets rebuilt (the visual language)

| Today | v2 |
|---|---|
| Cream `#f4ecd8` background dominates | **Onyx `#0E0B08` dominates**; cream becomes a 1-2 section RELIEF panel |
| 6-card 3-column grid for Regions | Per-region **editorial pages**, scroll-snapped, Apple anatomy |
| `WaxSeal`, `VineSprig`, `Fleuron` ornaments everywhere | Removed. Type does the ornamental work. |
| `god-rays`, `lens-flare`, `dust-motes`, `cinematic-grade` overlays | Removed. Film grain reduced from 0.07 → 0.02. |
| 3-column winery grid with `dt/dd` metadata | **2-column listing tiles**, Airbnb spacing, single italic descriptor |
| Animated stat counter (`280+ / 6 / 45 / 2k+`) | Removed. Replaced with 5-line manifesto. |
| Hero text centered with two CTAs and "Scroll" indicator | **Bottom-left title block**, vertical right metadata column, no in-hero CTA |

---

## Palette

```
--onyx        #0E0B08   /* dominant background — was: cream */
--onyx-2      #161210   /* card / panel one step up */
--bone        #F4ECDC   /* RELIEF section background (used sparingly) */
--ink-on-dark #F5F0E6   /* primary text on onyx */
--mid         #8C8378   /* secondary text, captions */
--rule-dark   rgba(245,240,230,0.10)
--rule-light  rgba(14,11,8,0.10)

--vinous      #5A0E1F   /* kept — used only in italic accents */
--sunlit-gold #C8A86A   /* kept — refined; small caps numerals, rules */
--lede-mid    #B8AE9F   /* lede paragraphs on dark */
```

Kept the wine and gold from v1 because the brand IS wine. But they're now whisper-quiet — used in italics and 1px rules, not in cards and overlays.

---

## Type system (Apple's restraint, with Cormorant for italic drama)

Two families, two roles:

- **Söhne / Inter Tight** *(free fallback: Inter Tight, weights 300/400/500/600)* — all structural type. Eyebrows, body, lede, sans headlines.
- **Cormorant Garamond Italic** — kept from v1, but only for **italic drama moments** ("of", "poured", chapter titles). Like Criterion Collection subtitles.

Scale (Apple ratios):

| Token | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| `eyebrow` | 11px | 500 | 0.36em | "Volume I", "Region II", small caps labels |
| `body` | 17px | 400 | 0 | Paragraphs |
| `lede` | 22px | 300 | 0 | Section ledes |
| `h2` | 56px | 500 | -0.01em | Section heads |
| `h1` | 120px | 500 | -0.02em | Major chapter titles |
| `display` | 160px | 500 | -0.025em | Hero only |

`em { font: italic 1em/1 'Cormorant Garamond', serif; }` becomes the cinematic moment within sans-headings. (Apple does this in their MacBook Pro page; Runway does it for film titles.)

---

## Spacing rhythm

- Section vertical padding: **160px** (down from 180-200)
- Horizontal: **7vw**, max-width **1320px** centered
- Section head → content gap: **120px**
- Card / tile internal padding: **40px**

Whitespace is *active*, not leftover. Apple-style.

---

## Motion

- **Removed:** dust-motes drift, lens-flare pulse, god-rays sweep, cinematic-grade overlay, depth-haze animation, every section's "atmosphere" stack.
- **Kept:** `ScrollScrubVideo` rAF lerp (the heart). `useSectionProgress` lerp damping.
- **Added:** "Intertitle" chapter cards — single full-bleed sentence on onyx, 80vh, fades in/out across its scroll range. Like a film cut between two scenes.
- **Reveals:** single principle. `opacity 0 → 1` and `translateY(12px → 0)`, 600ms, `cubic-bezier(0.16, 1, 0.3, 1)`. No 0.08s stagger conga line.

---

## Section-by-section

### 1. Nav
Floating pill stays but redesigned: onyx/60 with `backdrop-filter: blur(20px)`, single `1px solid rgba(245,240,230,0.10)` rule. Logo as small caps Söhne `W·I` + brand name. Right CTA becomes a **link** (`Trade access →`), not a button. No background-color shift on scroll — only opacity 0→0.7 of the pill background.

### 2. Hero / CinemaStage (500vh preserved)
Dark by default. Video plays full-bleed with a 4:3 letterbox on tall viewports.
- **Bottom-left** title block: eyebrow `VOLUME I · ESTATE EDITION` (Söhne small caps), then display headline `Wines / of Israel` with `of` in Cormorant italic, then 22px lede in `--lede-mid`.
- **Right vertical column** (rotated 90°): `MMXXVI · SIX TERROIRS · A WORKING CELLAR`.
- **No CTA in hero.** No "Scroll" indicator. The video moving as you scroll IS the indicator.
- Phase text crossfades stay (hero → tilt → pour → flow) but in the new type system.

### 3. Intertitle (new) — between Hero and Regions
80vh on onyx. Single Cormorant italic sentence centered: *"From the land of sun, stone, and altitude."* Fades in 0→0.6 then out 0.6→1.0 of its scroll range. The film cut.

### 4. Regions
Replace the 6-card SaaS grid with an **editorial page-per-region** flow, scroll-snapped.

Each region page (one per scroll-screen):
```
                             [Region I]   <- 11px small caps, sunlit-gold
                                  
                              Galilee     <- 120px Söhne medium
                          
              Mountain freshness and       <- 22px lede, lede-mid
              expressive aromatics.
                            
              ─────────────────────────
              400–900 m   limestone   cool nights
              ─────────────────────────
              
              [editorial photo placeholder — 4:5, onyx-2 panel
               with sunlit-gold abstract topography svg as
               stand-in until real photography is supplied]
```

Six of these stacked, snap-scroll between them (one CSS `scroll-snap-type: y mandatory` container). Mobile collapses snap and stacks normally.

### 5. Intertitle — between Regions and Glass
*"A glass is the smallest harvest."*

### 6. GlassStage (320vh preserved)
Same video, scrub preserved. Stripped of all atmospheric overlays. Replace:
- Country-marquee → static line, *"Poured in 45 markets — US · UK · France · Japan · Singapore · Australia · …"* (single line, ellipsis, no scroll animation).
- Text block moves to bottom-left (matching Hero).
- Vertical right column: `THE INTERNATIONAL CELLAR`.

### 7. Intertitle — between Glass and Wineries
*"The makers, and the bottles they ship."*

### 8. Wineries
2-column listing (was 3). Each tile:
```
[4:5 image panel — placeholder onyx-2 for now]

Domaine du Castel              ← 32px Söhne medium
JUDEAN HILLS  ·  EST. 1988    ← 11px small caps
Family estate, single-block    ← 17px italic Cormorant
parcels.

→  Available — EU · UK · US · APAC
```
No `dt/dd` metadata defs. No "View winery →" link spam. The whole tile becomes the link.

### 9. Trade CTA
Kill the 4-stat counter (SaaS metric brag). Replace with a 5-line manifesto on onyx:

```
We connect international buyers,
sommeliers, and hospitality leaders
to the people and places shaping
Israel's modern wine country.

→  Open the cellar door
```

That `→ Open the cellar door` is a single outlined link, not a button row.

### 10. Footer
Editorial 3-column on onyx. No wax seal, no vine sprig. Just type.
- Left: brand name in Cormorant italic 64px, tagline 17px lede-mid, address.
- Middle two: small-caps section headers (`THE CELLAR`, `FOR TRADE`, `VISIT`) + link lists.
- Bottom: thin sunlit-gold rule + copyright + the French motto (kept — it's the one ornament that works).

---

## Mobile (< 768px)

- All sections single column, 92vw max width
- Vertical padding scales 160px → 96px
- Hero display 160px → 64px; chapter title 120px → 48px
- Region scroll-snap disabled — stacks like a magazine
- Footer 3-column collapses to 1-column with rule dividers between blocks
- Videos: same source, same scrub, smaller poster, identical experience

---

## What this is *not* (anti-pattern checklist from the brief)

- ❌ Linear / Vercel / Anthropic / Stripe — none of their gradients, none of their geometric accent shapes
- ❌ Generic SaaS landing — no feature cards in a 3-up, no "trusted by" logo strip, no animated stats counter
- ❌ Glassmorphism — no frosted panels except the single nav pill
- ❌ Random gradients — every gradient is functional (letterbox fade, video vignette)
- ❌ Floating dashboard cards — no.
- ❌ Cluttered decoration — every removed overlay is a deliberate choice
- ❌ Tech startup template — the page reads like a magazine and a film, not a product

---

## Implementation plan (high level — full plan after approval)

1. Add a small `tokens.css` that introduces the v2 token set alongside v1 (so a single `body[data-theme="v2"]` switch can flip the world). Original tokens preserved.
2. Author a new `styles-v2.css` that's loaded *after* `styles.css` and overrides the visual layer only — JS / scroll math untouched.
3. Edits to `app.jsx` are limited to:
   - Replacing the three ornament components (`WaxSeal`, `VineSprig`, `Fleuron`) with type-based equivalents
   - Replacing the `RegionsSection` 3-column grid with the new per-region scroll-page component
   - Replacing the 4-stat counter in `TradeCTA` with the manifesto
   - Adding `<Intertitle>` between sections
   - **`CinemaStage`, `GlassStage`, `ScrollScrubVideo`: untouched**
4. Load Söhne (fallback Inter Tight from Google Fonts) and keep Cormorant Garamond + Outfit (transitional, can be removed once Söhne ships).
5. QA on `127.0.0.1:8765` via Playwright at 1440×900 and 390×844. Re-verify scroll-scrub. Full-page screenshots into `screenshots/v2-*.png`.

No deploy. No GitHub push. Branch stays local until you approve.
