// Wines of Israel — cinematic landing page.
// Sticky-pinned scroll stages, editorial sections, atmospheric overlays.

const { useRef, useEffect, useState, useMemo, useCallback } = React;

/* --- helpers --- */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const mapRange = (v, inA, inB, outA, outB) => {
  const t = clamp((v - inA) / (inB - inA), 0, 1);
  return outA + (outB - outA) * t;
};
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/* Reactive global scroll Y */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/* Smoothed per-section progress with lerp damping.
   raw progress is computed every frame from offsetTop / height;
   the rendered value lags slightly to absorb scroll-wheel jitter
   while keeping the perception of immediate response. */
function useSectionProgress(ref, smoothing = 0.22) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let smoothed = 0;
    let lastP = -1;
    let raf = 0;
    const compute = () => {
      const el = ref.current;
      if (!el) return null;
      const top = el.offsetTop;
      const height = el.offsetHeight;
      const innerH = window.innerHeight;
      const total = height - innerH;
      const scrolled = window.scrollY - top;
      if (total <= 0) return scrolled > 0 ? 1 : 0;
      return scrolled <= 0 ? 0 : scrolled >= total ? 1 : scrolled / total;
    };
    const tick = () => {
      const target = compute();
      if (target !== null) {
        smoothed = smoothed + (target - smoothed) * smoothing;
        if (Math.abs(smoothed - lastP) > 0.0004) {
          lastP = smoothed;
          setP(smoothed);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return p;
}

/* IntersectionObserver-based reveal. Adds .is-visible when in view.
   Also cascades the class to descendants that have .reveal-up (so a single
   ref on a container can stagger many children via --i transition delays). */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const markVisible = (node) => {
      node.classList.add("is-visible");
      node.querySelectorAll(".reveal-up, .reveal-text-mask").forEach((c) => c.classList.add("is-visible"));
    };
    if (typeof IntersectionObserver === "undefined") {
      markVisible(el);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            markVisible(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ============================================================ */
/* GLOBAL ATMOSPHERE — film grain + color grade, always-on       */
/* ============================================================ */
function GlobalAtmosphere() {
  return (
    <>
      <div className="cinematic-grade" aria-hidden />
      <div className="film-grain" aria-hidden />
    </>
  );
}

/* ============================================================ */
/* NAV                                                          */
/* ============================================================ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="nav-mark">W·I</span>
          <span className="nav-name">WINES OF ISRAEL</span>
        </div>
        <ul className="nav-links">
          <li><a href="#story">Story</a></li>
          <li><a href="#regions">Regions</a></li>
          <li><a href="#wineries">Wineries</a></li>
          <li><a href="#trade">Trade</a></li>
        </ul>
        <a href="#trade" className="nav-cta">Trade Access</a>
      </div>
    </nav>
  );
}

/* ============================================================ */
/* CINEMA STAGE — sticky pinned hero + bottle + pour            */
/*  Phase map (progress 0..1) — packed into 380vh of scroll      */
/*    0.00-0.20  HERO   bottle upright, headline visible         */
/*    0.18-0.42  TILT   bottle tilts gracefully to ~72°          */
/*    0.32-0.68  POUR   stream extends, story headline reveals   */
/*    0.62-1.00  FLOW   stream eases out, regions intro          */
/* ============================================================ */
function CinemaStage() {
  const stageRef = useRef(null);
  const progress = useSectionProgress(stageRef, 0.22);

  // Phase math — text overlays only; the video itself drives the bottle/pour.
  const heroFade = 1 - clamp((progress - 0.10) / 0.12, 0, 1);
  const storyFade = clamp((progress - 0.44) / 0.08, 0, 1) *
    (1 - clamp((progress - 0.68) / 0.08, 0, 1));
  const flowFade = clamp((progress - 0.80) / 0.10, 0, 1);

  return (
    <section ref={stageRef} className="cinema-section">
      <div className="cinema-sticky" style={{ "--scroll-p": progress }}>
        {/* Scroll-scrubbed cinematic video — the central visual asset.
            The video carries its own vineyard backdrop, lighting, and bottle. */}
        <ScrollScrubVideo
          progress={progress}
          src="videos/wine-pour.mp4"
          smoothing={0.2}
        />

        {/* Atmospheric layers tuned to layer over the video without
            competing with its lighting. Lens flare and dust motes removed
            here — the video already has its own atmosphere. */}
        <div className="god-rays scrub-overlay" aria-hidden />
        <div className="bg-grain" />
        <div className="cinema-vignette scrub-overlay" aria-hidden />

        {/* Scroll progress hint */}
        <div className="scroll-pin-hint" aria-hidden />

        {/* HERO TEXT */}
        <div
          className="cinema-text hero-text"
          style={{
            opacity: heroFade,
            pointerEvents: heroFade > 0.4 ? "auto" : "none",
            transform: `translateY(${(1 - heroFade) * -24}px)`,
          }}
        >
          <div className="hero-side-meta left">Volume I &nbsp;·&nbsp; Estate Collection</div>
          <div className="hero-side-meta right">Vines since the 4th millennium BCE</div>
          <div className="vintage-tag">
            <span className="vintage-tag-word">Vintage</span>
            <span className="vintage-tag-year">MMXXVI</span>
          </div>
          <div className="hero-top">
            <div className="hero-eyebrow"><em>an invitation</em> to taste a country</div>
            <h1 className="display-xl text-light-shaft">
              Wines <em>of</em> Israel
            </h1>
          </div>
          <div className="hero-bottom">
            <p className="lede">
              Ancient terroir. Modern craft.<br />
              A story poured from the land.
            </p>
            <div className="cta-row">
              <a href="#story" className="cta-primary"><span>Explore the Story</span></a>
              <a href="#wineries" className="cta-ghost">Discover Wineries</a>
            </div>
            <div className="hero-scroll">
              <span>Scroll</span>
              <div className="scroll-line" />
            </div>
          </div>
        </div>

        {/* STORY HEADLINE (during pour) */}
        <div
          className="cinema-text story-text"
          style={{
            opacity: storyFade,
            transform: `translateY(${(1 - storyFade) * 24}px)`,
          }}
        >
          <div className="eyebrow eyebrow-light">Chapter I</div>
          <h2 className="display-l">
            From the land of <em>sun,</em><br />
            stone, and altitude.
          </h2>
          <p className="lede">
            Israel's wine story is shaped by dramatic landscapes, ancient roots,<br />
            and a new generation of winemakers reaching toward the global stage.
          </p>
        </div>

        {/* FLOW INTRO */}
        <div
          className="cinema-text flow-text"
          style={{
            opacity: flowFade,
            transform: `translateY(${(1 - flowFade) * 24}px)`,
          }}
        >
          <div className="eyebrow eyebrow-light">Six terroirs</div>
          <h2 className="display-l">
            Every region<br />
            <em>pours a different story.</em>
          </h2>
        </div>

        {/* Phase progress dots */}
        <div className="phase-dots" aria-hidden>
          <span className={progress < 0.18 ? "active" : ""} />
          <span className={progress >= 0.18 && progress < 0.44 ? "active" : ""} />
          <span className={progress >= 0.44 && progress < 0.78 ? "active" : ""} />
          <span className={progress >= 0.78 ? "active" : ""} />
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* REGIONS                                                       */
/* ============================================================ */
const REGIONS = [
  { name: "Galilee", desc: "Mountain freshness and expressive aromatics.",
    meta: "400–900 m · cool nights · limestone", motif: "mountain", accent: "#7a8d6b" },
  { name: "Golan Heights", desc: "Volcanic soils and high-altitude structure.",
    meta: "600–1200 m · basalt · long ripening", motif: "volcano", accent: "#8a4a2a" },
  { name: "Judean Hills", desc: "Ancient terraces and elegant balance.",
    meta: "300–900 m · terra rossa · chalk", motif: "terrace", accent: "#a8853d" },
  { name: "Shomron", desc: "Rolling hills and Mediterranean breadth.",
    meta: "150–500 m · marl · sun-laden", motif: "hills", accent: "#9a7d4a" },
  { name: "Negev", desc: "Desert innovation and bold character.",
    meta: "300–900 m · loess · radical light", motif: "desert", accent: "#c9a961" },
  { name: "Coastal Plain", desc: "Mediterranean warmth and accessibility.",
    meta: "0–150 m · alluvial · saline air", motif: "sea", accent: "#6a8a9a" },
];

function RegionMotif({ motif, color }) {
  const c = color || "#c9a961";
  switch (motif) {
    case "mountain":
      return (
        <svg viewBox="0 0 120 80" className="region-motif">
          <path d="M 6 70 L 38 22 L 56 50 L 76 14 L 114 70 Z" fill="none" stroke={c} strokeWidth="1.2" />
          <circle cx="92" cy="20" r="6" fill="none" stroke={c} strokeWidth="0.8" opacity="0.6" />
        </svg>
      );
    case "volcano":
      return (
        <svg viewBox="0 0 120 80" className="region-motif">
          <path d="M 14 70 L 50 14 L 70 14 L 106 70 Z" fill="none" stroke={c} strokeWidth="1.2" />
          <path d="M 50 14 Q 56 6 60 6 Q 64 6 70 14" fill="none" stroke={c} strokeWidth="1" />
          <path d="M 48 30 L 72 30" stroke={c} strokeWidth="0.6" opacity="0.5" />
        </svg>
      );
    case "terrace":
      return (
        <svg viewBox="0 0 120 80" className="region-motif">
          {[0,1,2,3].map(i => (
            <path key={i} d={`M ${10 + i*4} ${68 - i*12} L ${110 - i*4} ${68 - i*12}`} stroke={c} strokeWidth="1" fill="none" />
          ))}
          <circle cx="92" cy="14" r="5" fill="none" stroke={c} strokeWidth="0.8" />
        </svg>
      );
    case "hills":
      return (
        <svg viewBox="0 0 120 80" className="region-motif">
          <path d="M 4 64 Q 30 36 56 56 Q 86 30 116 60" fill="none" stroke={c} strokeWidth="1.2" />
          <path d="M 4 72 Q 36 50 64 66 Q 92 50 116 70" fill="none" stroke={c} strokeWidth="0.8" opacity="0.6" />
        </svg>
      );
    case "desert":
      return (
        <svg viewBox="0 0 120 80" className="region-motif">
          <circle cx="60" cy="34" r="14" fill="none" stroke={c} strokeWidth="1.2" />
          <path d="M 4 60 Q 40 44 60 56 Q 84 44 116 62" fill="none" stroke={c} strokeWidth="1" />
          <path d="M 4 72 L 116 72" stroke={c} strokeWidth="0.6" opacity="0.5" />
        </svg>
      );
    case "sea":
      return (
        <svg viewBox="0 0 120 80" className="region-motif">
          <path d="M 6 36 Q 22 28 38 36 Q 54 44 70 36 Q 86 28 114 36" fill="none" stroke={c} strokeWidth="1" />
          <path d="M 6 50 Q 22 42 38 50 Q 54 58 70 50 Q 86 42 114 50" fill="none" stroke={c} strokeWidth="1" />
          <path d="M 6 64 Q 22 56 38 64 Q 54 72 70 64 Q 86 56 114 64" fill="none" stroke={c} strokeWidth="0.8" opacity="0.6" />
        </svg>
      );
    default:
      return null;
  }
}

function RegionCard({ region, index }) {
  const ref = useReveal();
  const romans = ["I", "II", "III", "IV", "V", "VI"];
  return (
    <article
      ref={ref}
      className="region-card region-card-rich reveal-up"
      style={{ "--accent": region.accent, "--i": index }}
    >
      <div className="region-lot">
        <span className="region-roman">{romans[index] || index + 1}</span>
        <span className="region-swatch" aria-hidden style={{ background: region.accent }} />
      </div>
      <div className="region-motif-wrap">
        <RegionMotif motif={region.motif} color={region.accent} />
      </div>
      <h3 className="region-name">{region.name}</h3>
      <p className="region-desc">{region.desc}</p>
      <div className="region-meta">{region.meta}</div>
    </article>
  );
}

/* ============================================================ */
/* ORNAMENTS — wax seal, vine sprig, grape cluster, fleurons     */
/* Used throughout the site as organic section anchors           */
/* ============================================================ */
function WaxSeal({ size = 84, label }) {
  // Embossed wine-red seal on cream — small estate stamp
  return (
    <div className="wax-seal" style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <radialGradient id="seal-body" cx="35%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#8a1a32" />
            <stop offset="50%" stopColor="#6a0e22" />
            <stop offset="100%" stopColor="#3a0810" />
          </radialGradient>
          <radialGradient id="seal-highlight" cx="35%" cy="30%" r="40%">
            <stop offset="0%" stopColor="rgba(255,180,140,0.65)" />
            <stop offset="100%" stopColor="rgba(255,180,140,0)" />
          </radialGradient>
          <filter id="seal-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" />
            <feOffset dx="0.5" dy="2" result="off" />
            <feComponentTransfer><feFuncA type="linear" slope="0.6" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g filter="url(#seal-shadow)">
          {/* Ragged wax edge — irregular polygon */}
          <path
            d="M 50 4 L 64 8 L 76 6 L 86 16 L 92 28 L 96 42 L 94 56 L 94 70 L 86 82 L 76 92 L 62 94 L 50 96 L 36 92 L 24 92 L 14 80 L 8 68 L 4 54 L 6 40 L 12 26 L 22 14 L 34 8 Z"
            fill="url(#seal-body)"
          />
          {/* Inner impression ring */}
          <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,180,140,0.18)" strokeWidth="0.6" />
          {/* Highlight */}
          <ellipse cx="38" cy="34" rx="18" ry="14" fill="url(#seal-highlight)" />
          {/* Monogram */}
          <text x="50" y="58" textAnchor="middle"
            style={{ font: "italic 700 30px 'Cormorant Garamond', serif", letterSpacing: "-0.04em" }}
            fill="#f5dcae">W·I</text>
        </g>
      </svg>
      {label && <span className="wax-seal-label">{label}</span>}
    </div>
  );
}

function VineSprig({ width = 240, color = "#7a1a2c" }) {
  // Hand-drawn vine branch with leaves and a small grape cluster
  return (
    <svg viewBox="0 0 280 64" width={width} height={(width * 64) / 280}
      className="vine-sprig" aria-hidden>
      {/* Main stem */}
      <path d="M 8 32 C 60 12, 140 50, 220 26 L 268 22"
        stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M 80 22 C 86 12, 96 12, 96 22 C 96 32, 86 32, 80 22 Z" fill={color} opacity="0.78" />
      <path d="M 96 22 L 100 14" stroke={color} strokeWidth="0.7" fill="none" />
      <path d="M 150 36 C 156 28, 166 28, 166 36 C 166 46, 156 46, 150 36 Z" fill={color} opacity="0.78" />
      <path d="M 166 36 L 170 30" stroke={color} strokeWidth="0.7" fill="none" />
      <path d="M 200 30 C 207 22, 217 24, 215 32 C 213 41, 203 40, 200 30 Z" fill={color} opacity="0.78" />
      {/* Tiny grape cluster */}
      <g transform="translate(50, 30)">
        <circle cx="0" cy="0" r="2.4" fill={color} />
        <circle cx="4" cy="2" r="2.4" fill={color} />
        <circle cx="-3" cy="3" r="2.4" fill={color} />
        <circle cx="1" cy="5" r="2.2" fill={color} />
        <circle cx="-1" cy="8" r="2" fill={color} />
      </g>
      {/* Tendril curl on the right */}
      <path d="M 268 22 Q 274 18, 274 12 Q 274 6, 270 6" stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Fleuron({ color = "#7a1a2c", size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="fleuron" aria-hidden>
      <path d="M 12 2 C 16 6, 20 10, 22 12 C 20 14, 16 18, 12 22 C 8 18, 4 14, 2 12 C 4 10, 8 6, 12 2 Z"
        fill={color} opacity="0.85" />
      <circle cx="12" cy="12" r="1.5" fill="#f4ecd8" />
    </svg>
  );
}

/* Section "rest" — soft organic divider between major sections.
   Replaces the abstract Roman numeral cards with a wine-magazine
   page-turn moment: vine sprig + a single italic phrase. */
function SectionRest({ phrase, sealLabel }) {
  const ref = useReveal();
  return (
    <div className="section-rest section-rest-calm" ref={ref}>
      <div className="reveal-up section-rest-inner">
        <Fleuron color="#7a1a2c" size={11} />
        <p className="section-rest-phrase">{phrase}</p>
      </div>
    </div>
  );
}

function TerroirStrip() {
  const items = ["Galilee", "Golan Heights", "Judean Hills", "Shomron", "Negev", "Coastal Plain"];
  // Duplicate the list so the marquee loops seamlessly
  return (
    <div className="terroir-strip" aria-hidden>
      <div className="terroir-strip-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="item">
            {items.map((n) => <span key={n + dup} className="item">{n}</span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionsSection() {
  const headRef = useReveal();
  return (
    <section id="regions" className="regions scene-fade-edge">
      <div className="depth-haze-top" aria-hidden />
      <div ref={headRef} className="regions-head reveal-up">
        <div className="wine-eyebrow">
          <Fleuron color="#7a1a2c" size={12} />
          <em>The Terroirs</em>
          <Fleuron color="#7a1a2c" size={12} />
        </div>
        <h2 className="display-l" style={{ marginTop: 28 }}>
          Six landscapes.<br />
          <em>One country of wine.</em>
        </h2>
        <p className="lede">
          From sunlit hills to volcanic heights, from desert innovation to
          Mediterranean warmth — every bottle carries a landscape.
        </p>
      </div>
      <div className="regions-grid">
        {REGIONS.map((r, i) => <RegionCard key={r.name} region={r} index={i} />)}
      </div>
    </section>
  );
}

/* ============================================================ */
/* GLASS STAGE — pinned, wine pours into a Bordeaux glass        */
/*  260vh runway; phase map below                                */
/* ============================================================ */
function GlassStage() {
  const ref = useRef(null);
  const progress = useSectionProgress(ref, 0.22);

  // Text overlay timing — appears after the pour establishes (~30%),
  // stays full through the middle, fades before the section exits.
  const textFade = clamp((progress - 0.30) / 0.15, 0, 1) *
    (1 - clamp((progress - 0.85) / 0.10, 0, 1));

  return (
    <section ref={ref} className="glass-section scene-fade-edge">
      <div className="glass-sticky" style={{ "--scroll-p": progress }}>
        {/* Scroll-scrubbed wine-glass video — replaces the SVG WineGlass.
            Same Galilee vineyard backdrop as the hero, but now showing the
            glass filling with wine as the user scrolls through the section. */}
        <ScrollScrubVideo
          progress={progress}
          src="videos/wine-glass-pour.mp4"
          smoothing={0.2}
          variant="glass-scrub"
        />

        {/* Atmosphere layered over the video — softer than the hero since
            the glass section is the meditative second-act, not the opening. */}
        <div className="cinema-vignette scrub-overlay" aria-hidden />
        <div className="depth-haze-top" aria-hidden />
        <div className="glass-side-meta"><em>Poured for the world &nbsp;·&nbsp; the international cellar</em></div>

        <div className="glass-text" style={{ opacity: textFade, transform: `translateY(calc(-50% + ${(1 - textFade) * 18}px))` }}>
          <div className="wine-eyebrow">
            <Fleuron color="#7a1a2c" size={11} />
            <em>The International Cellar</em>
          </div>
          <h2 className="display-xl text-light-shaft" style={{ marginTop: 22 }}>
            Poured<br />
            <em>for the world.</em>
          </h2>
          <p className="lede">
            Wines of Israel connects international buyers, importers, sommeliers
            and hospitality leaders with the people, places and bottles shaping
            Israel's modern wine scene.
          </p>
        </div>

        {/* Export markets marquee — premium scrolling country band */}
        <div className="export-marquee" style={{ opacity: textFade }}>
          <div className="export-marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} className="item">
                {["United States", "United Kingdom", "France", "Germany",
                  "Switzerland", "Japan", "Singapore", "Australia",
                  "Canada", "Hong Kong", "South Korea", "Netherlands"]
                  .map((n) => <span key={n + dup} className="item">{n}</span>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* WINERIES                                                      */
/* ============================================================ */
const WINERIES = [
  { name: "Domaine du Castel", region: "Judean Hills", style: "Bordeaux blends · Chardonnay", export: "Available — EU · UK · US · APAC", note: "Family estate, single-block parcels" },
  { name: "Tulip Winery", region: "Lower Galilee", style: "Mediterranean reds · Syrah", export: "Available — EU · NA · APAC", note: "Social winery, organic vineyards" },
  { name: "Yatir", region: "Negev — Yatir Forest", style: "Reserve reds · Petit Verdot", export: "Available — EU · US", note: "Desert-edge altitude vineyards" },
  { name: "Recanati", region: "Upper Galilee", style: "Marawi · Carignan · Bittuni", export: "Available — Global", note: "Indigenous-grape pioneers" },
  { name: "Tabor", region: "Lower Galilee", style: "Cabernet · Roussanne", export: "Available — Global", note: "Sustainability-certified estate" },
  { name: "Sphera", region: "Judean Hills", style: "Whites · single-vineyard", export: "Allocation — EU · US · APAC", note: "White-only, terroir-driven" },
];

function WineryCard({ w, index, featured }) {
  const ref = useReveal();
  return (
    <article
      ref={ref}
      className={`winery-card reveal-up ${featured ? "winery-card-featured" : ""}`}
      style={{ "--i": index }}
    >
      <div className="winery-mark">
        <svg viewBox="0 0 40 40" width="36" height="36">
          <circle cx="20" cy="20" r="18" fill="none" stroke="#c9a961" strokeWidth="0.8" />
          <path d="M 20 8 L 22 16 L 30 16 L 23 21 L 26 30 L 20 24 L 14 30 L 17 21 L 10 16 L 18 16 Z"
            fill="none" stroke="#c9a961" strokeWidth="0.6" opacity="0.7" />
        </svg>
      </div>
      <h3 className="winery-name">{w.name}</h3>
      <div className="winery-region">{w.region}</div>
      <dl className="winery-meta">
        <div><dt>Style</dt><dd>{w.style}</dd></div>
        <div><dt>Export</dt><dd>{w.export}</dd></div>
        <div><dt>Note</dt><dd>{w.note}</dd></div>
      </dl>
      <a className="winery-link" href="#">View winery →</a>
    </article>
  );
}

function WinerySection() {
  const headRef = useReveal();
  return (
    <section id="wineries" className="wineries scene-fade-edge">
      <div ref={headRef} className="section-head reveal-up">
        <div className="wine-eyebrow">
          <Fleuron color="#7a1a2c" size={12} />
          <em>The Estates</em>
          <Fleuron color="#7a1a2c" size={12} />
        </div>
        <h2 className="display-l" style={{ marginTop: 28 }}>
          The makers,<br />
          <em>and the bottles they ship.</em>
        </h2>
        <p className="lede">
          A working cellar for trade. Browse by region, varietal, and export
          allocation — then request samples or visit the estate.
        </p>
        <div className="winery-filters">
          <button className="chip chip-active">All regions</button>
          <button className="chip">Galilee</button>
          <button className="chip">Judean Hills</button>
          <button className="chip">Negev</button>
          <button className="chip">Coastal</button>
          <span className="chip-divider" />
          <button className="chip">Indigenous grapes</button>
          <button className="chip">Organic / Bio</button>
          <button className="chip">Allocation only</button>
        </div>
      </div>
      <div className="winery-grid is-curated">
        {WINERIES.map((w, i) => (
          <WineryCard key={w.name} w={w} index={i} featured={i === 0} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================ */
/* STAT COUNTER — animates when the stat enters view             */
/* ============================================================ */
function StatCounter({ value, label, index = 0 }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(null);
  // Parse numeric portion + suffix (handles "280+", "2k+", "45", "6")
  const parsed = useMemo(() => {
    const m = String(value).match(/^(\d+(?:\.\d+)?)([a-zA-Z+]*)$/);
    if (!m) return { num: 0, suffix: "", display: value };
    const isK = m[2].toLowerCase().includes("k");
    return { num: parseFloat(m[1]), suffix: m[2], isK };
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const target = parsed.num;
          const duration = 1800;
          const startT = performance.now();
          const easeOut = (t) => 1 - Math.pow(1 - t, 3);
          const tick = (now) => {
            const t = Math.min(1, (now - startT) / duration);
            const v = target * easeOut(t);
            let str;
            if (parsed.isK) {
              str = v < 10 ? v.toFixed(1).replace(/\.0$/, "") + parsed.suffix : Math.round(v) + parsed.suffix;
            } else {
              str = Math.round(v) + parsed.suffix;
            }
            setDisplay(str);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, parsed]);

  return (
    <li ref={ref} style={{ "--i": index }}>
      <span className="stat-num">{display}</span>
      <span className="stat-lbl">{label}</span>
    </li>
  );
}

/* ============================================================ */
/* TRADE CTA                                                     */
/* ============================================================ */
function TradeCTA() {
  const headRef = useReveal();
  return (
    <section id="trade" className="trade scene-fade-edge">
      <div className="trade-inner" ref={headRef}>
        <div className="wine-eyebrow reveal-up">
          <Fleuron color="#7a1a2c" size={12} />
          <em>An Invitation</em>
          <Fleuron color="#7a1a2c" size={12} />
        </div>
        <h2 className="display-xl reveal-up text-light-shaft" style={{ "--i": 1, marginTop: 28 }}>
          Discover Israeli wine.<br />
          Meet the makers.<br />
          <em>Open the cellar door.</em>
        </h2>
        <div className="trade-ctas reveal-up" style={{ "--i": 2 }}>
          <a href="#wineries" className="cta-primary cta-lg"><span>Browse the Cellar</span></a>
          <a href="#" className="cta-outline cta-lg">Request Samples</a>
          <a href="#" className="cta-ghost cta-lg">Visit a Vineyard</a>
        </div>
        <ul className="trade-stats reveal-up vintage-stats" style={{ "--i": 3 }}>
          <StatCounter value="280+" label="estates" index={0} />
          <StatCounter value="6" label="terroirs" index={1} />
          <StatCounter value="45" label="markets" index={2} />
          <StatCounter value="2k+" label="years of vine" index={3} />
        </ul>
      </div>
      <PremiumFooter />
    </section>
  );
}

/* ============================================================ */
/* PREMIUM FOOTER                                                */
/* ============================================================ */
function PremiumFooter() {
  return (
    <footer className="footer cellar-footer">
      <div className="cellar-footer-top">
        <VineSprig width={320} color="#9b3a4a" />
      </div>
      <div className="cellar-footer-grid">
        <div className="cellar-brand">
          <WaxSeal size={96} />
          <h3 className="cellar-brand-name">Wines <em>of</em> Israel</h3>
          <p className="cellar-brand-tagline">
            A working cellar &amp; field guide to the vineyards, makers and
            vintages of the modern Israeli wine country — from the Galilee
            heights to the Negev floor.
          </p>
          <p className="cellar-brand-address">
            Cellar address &nbsp;·&nbsp; Tel Aviv &middot; Paris &middot; London<br />
            <a href="#" className="cellar-brand-email">cellar@winesofisrael.com</a>
          </p>
        </div>

        <div className="cellar-columns">
          <div className="cellar-col">
            <div className="cellar-col-title"><em>The Cellar</em></div>
            <a href="#regions">The terroirs</a>
            <a href="#wineries">The estates</a>
            <a href="#">Varietals &amp; blends</a>
            <a href="#">Vintage notes</a>
          </div>
          <div className="cellar-col">
            <div className="cellar-col-title"><em>For Trade</em></div>
            <a href="#trade">Open an account</a>
            <a href="#">Request samples</a>
            <a href="#">Allocations</a>
            <a href="#">Press &amp; editorial</a>
          </div>
          <div className="cellar-col">
            <div className="cellar-col-title"><em>Visit</em></div>
            <a href="#">Vineyard tours</a>
            <a href="#">Tasting weekends</a>
            <a href="#">Harvest calendar</a>
            <a href="#">The estates map</a>
          </div>
        </div>
      </div>

      <div className="cellar-fine">
        <span className="cellar-fine-left">
          <span className="cellar-grape" aria-hidden>
            <svg viewBox="0 0 16 16" width="14" height="14"><circle cx="3" cy="6" r="2" fill="#7a1a2c" /><circle cx="8" cy="6" r="2" fill="#7a1a2c" /><circle cx="13" cy="6" r="2" fill="#7a1a2c" /><circle cx="5.5" cy="10" r="2" fill="#7a1a2c" /><circle cx="10.5" cy="10" r="2" fill="#7a1a2c" /><circle cx="8" cy="13" r="1.8" fill="#7a1a2c" /></svg>
          </span>
          &copy; MMXXVI &nbsp;Wines of Israel &nbsp;·&nbsp; <em>For trade &amp; adult audiences (21+)</em>
        </span>
        <span className="cellar-fine-right">
          <em>Au verre, au cœur, à la terre.</em>
        </span>
      </div>
    </footer>
  );
}

/* ============================================================ */
/* APP                                                           */
/* ============================================================ */
function App() {
  return (
    <>
      <GlobalAtmosphere />
      <div className="paper-texture" aria-hidden />
      <Nav />
      <CinemaStage />
      <SectionRest phrase="From the land of sun, stone &amp; vine" />
      <RegionsSection />
      <SectionRest phrase="A glass is the smallest harvest" />
      <GlassStage />
      <SectionRest phrase="The makers, and the bottles they ship" />
      <WinerySection />
      <SectionRest phrase="Open the cellar door" />
      <TradeCTA />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
