// Wines of Israel — v2 "Cinematic Magazine"
// Bone-dominant editorial. Cinematic dark moments held only in the
// scroll-scrubbed video stages and the closing trade panel.
// Scroll/video math + section heights are unchanged from v1.

const { useRef, useEffect, useState, useMemo } = React;

/* ---------- helpers ---------- */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

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

/* Smoothed per-section progress — preserved verbatim from v1 because
   ScrollScrubVideo timing is keyed to this damping. */
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

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mark = (node) => {
      node.classList.add("is-visible");
      node.querySelectorAll(".reveal-up").forEach((c) => c.classList.add("is-visible"));
    };
    if (typeof IntersectionObserver === "undefined") {
      mark(el);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            mark(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ============================================================ */
/* NAV — floating pill, restrained                              */
/* ============================================================ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="nav-mark"><em>W·I</em></span>
          <span className="nav-name">Wines of Israel</span>
        </div>
        <ul className="nav-links">
          <li><a href="#regions">Terroirs</a></li>
          <li><a href="#wineries">Wineries</a></li>
          <li><a href="#trade">Trade</a></li>
        </ul>
        <a href="#trade" className="nav-cta">Open the cellar</a>
      </div>
    </nav>
  );
}

/* ============================================================ */
/* CINEMA STAGE — 500vh sticky pour, preserved                  */
/* Phase map (unchanged): 0–0.20 hero · 0.18–0.42 tilt          */
/*                       0.32–0.68 pour · 0.62–1.00 flow         */
/* ============================================================ */
function CinemaStage() {
  const stageRef = useRef(null);
  const progress = useSectionProgress(stageRef, 0.22);

  const heroFade  = 1 - clamp((progress - 0.12) / 0.10, 0, 1);
  const storyFade = clamp((progress - 0.44) / 0.08, 0, 1)
                  * (1 - clamp((progress - 0.68) / 0.08, 0, 1));
  const flowFade  = clamp((progress - 0.80) / 0.08, 0, 1)
                  * (1 - clamp((progress - 0.98) / 0.02, 0, 1));

  return (
    <section ref={stageRef} className="cinema-section" aria-label="Wines of Israel — opening">
      <div className="cinema-sticky" style={{ "--scroll-p": progress }}>
        <ScrollScrubVideo
          progress={progress}
          src="videos/wine-pour.mp4"
          smoothing={0.2}
        />

        {/* Right vertical metadata column — film credit strip */}
        <div className="cinema-right-col">MMXXVI · Six Terroirs · A Working Cellar</div>

        {/* HERO */}
        <div
          className="cinema-text hero-text"
          style={{
            opacity: heroFade,
            transform: `translateY(${(1 - heroFade) * -12}px)`,
          }}
        >
          <div className="hero-block">
            <div className="eyebrow"><span className="eyebrow-num">I</span> Volume — Estate Edition</div>
            <h1 className="display-xl">Wines <em>of</em> Israel</h1>
            <p className="lede">
              Ancient terroir. Modern craft.<br />
              A story poured from the land.
            </p>
          </div>
        </div>

        {/* STORY headline (during pour) */}
        <div
          className="cinema-text story-text"
          style={{
            opacity: storyFade,
            transform: `translateY(${(1 - storyFade) * 14}px)`,
          }}
        >
          <div className="story-block">
            <div className="eyebrow">Chapter I</div>
            <h2 className="display-l">
              From the land of <em>sun,</em><br />
              stone, and altitude.
            </h2>
            <p className="lede">
              Israel's wine story is shaped by dramatic landscapes,
              ancient roots, and a new generation of winemakers reaching
              toward the global stage.
            </p>
          </div>
        </div>

        {/* FLOW intro */}
        <div
          className="cinema-text flow-text"
          style={{
            opacity: flowFade,
            transform: `translateY(${(1 - flowFade) * 14}px)`,
          }}
        >
          <div className="flow-block">
            <div className="eyebrow">Six terroirs</div>
            <h2 className="display-l">
              Every region<br />
              <em>pours a different story.</em>
            </h2>
          </div>
        </div>

        {/* Scroll cue — only visible while hero is */}
        <div className="scroll-cue" style={{ opacity: heroFade * 0.8 }}>Scroll</div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* INTERTITLE — film cut between scroll stages                  */
/* ============================================================ */
function Intertitle({ chapter, line }) {
  const ref = useReveal();
  return (
    <section className="intertitle" ref={ref} aria-hidden>
      {chapter && <div className="eyebrow reveal-up">{chapter}</div>}
      <p className="intertitle-line reveal-up" style={{ "--i": 1 }}>{line}</p>
    </section>
  );
}

/* ============================================================ */
/* REGIONS — editorial 2×3 grid, photo-led, Apple anatomy        */
/* ============================================================ */
const REGIONS = [
  { name: "Galilee",       desc: "Mountain freshness and expressive aromatics.",
    meta: "400–900 m · limestone · cool nights",   motif: "mountain" },
  { name: "Golan Heights", desc: "Volcanic soils and high-altitude structure.",
    meta: "600–1200 m · basalt · long ripening",   motif: "volcano" },
  { name: "Judean Hills",  desc: "Ancient terraces and elegant balance.",
    meta: "300–900 m · terra rossa · chalk",        motif: "terrace" },
  { name: "Shomron",       desc: "Rolling hills and Mediterranean breadth.",
    meta: "150–500 m · marl · sun-laden",           motif: "hills" },
  { name: "Negev",         desc: "Desert innovation and bold character.",
    meta: "300–900 m · loess · radical light",      motif: "desert" },
  { name: "Coastal Plain", desc: "Mediterranean warmth and accessibility.",
    meta: "0–150 m · alluvial · saline air",        motif: "sea" },
];
const ROMANS = ["I", "II", "III", "IV", "V", "VI"];

function RegionArt({ motif }) {
  // Single line drawing per terroir — feels like a wine atlas plate.
  // Inks: gold strokes on bone-2 panel.
  const stroke = "#9c7a3e";
  switch (motif) {
    case "mountain":
      return (
        <svg viewBox="0 0 240 200" fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 8 168 L 64 60 L 96 116 L 134 36 L 176 116 L 232 168 Z" />
          <circle cx="170" cy="50" r="9" />
          <path d="M 24 184 L 216 184" strokeWidth="0.6" opacity="0.55" />
        </svg>
      );
    case "volcano":
      return (
        <svg viewBox="0 0 240 200" fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 28 168 L 96 32 L 144 32 L 212 168 Z" />
          <path d="M 96 32 Q 108 14 120 14 Q 132 14 144 32" />
          <path d="M 90 80 L 150 80" strokeWidth="0.6" opacity="0.55" />
          <path d="M 76 122 L 164 122" strokeWidth="0.6" opacity="0.55" />
        </svg>
      );
    case "terrace":
      return (
        <svg viewBox="0 0 240 200" fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          {[0,1,2,3,4].map(i => (
            <path key={i} d={`M ${16 + i*6} ${168 - i*22} L ${224 - i*6} ${168 - i*22}`} />
          ))}
          <circle cx="184" cy="36" r="8" />
        </svg>
      );
    case "hills":
      return (
        <svg viewBox="0 0 240 200" fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 8 130 Q 60 72 112 112 Q 172 56 232 122" />
          <path d="M 8 158 Q 70 108 128 138 Q 184 96 232 144" opacity="0.6" />
          <path d="M 8 184 L 232 184" strokeWidth="0.6" opacity="0.55" />
        </svg>
      );
    case "desert":
      return (
        <svg viewBox="0 0 240 200" fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="120" cy="78" r="28" />
          <path d="M 8 140 Q 80 110 120 130 Q 168 110 232 142" />
          <path d="M 8 168 L 232 168" strokeWidth="0.6" opacity="0.55" />
        </svg>
      );
    case "sea":
      return (
        <svg viewBox="0 0 240 200" fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 8 80 Q 44 64 80 80 Q 116 96 152 80 Q 188 64 232 80" />
          <path d="M 8 110 Q 44 94 80 110 Q 116 126 152 110 Q 188 94 232 110" />
          <path d="M 8 140 Q 44 124 80 140 Q 116 156 152 140 Q 188 124 232 140" opacity="0.55" />
        </svg>
      );
    default: return null;
  }
}

function RegionTile({ region, index }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="region-tile reveal-up" style={{ "--i": index % 2 }}>
      <div className="region-art">
        <div className="region-art-eyebrow">
          <span className="region-art-num">{ROMANS[index]}</span>
          <span>Terroir</span>
        </div>
        <RegionArt motif={region.motif} />
      </div>
      <div className="region-info">
        <h3 className="region-name">{region.name}</h3>
        <p className="region-desc">{region.desc}</p>
        <div className="region-meta">{region.meta}</div>
      </div>
    </article>
  );
}

function RegionsSection() {
  const headRef = useReveal();
  return (
    <section id="regions" className="section regions">
      <div className="container">
        <div className="section-head" ref={headRef}>
          <div className="eyebrow reveal-up no-rule">The Terroirs</div>
          <h2 className="display-l reveal-up" style={{ "--i": 1 }}>
            Six landscapes.<br />
            <em>One country of wine.</em>
          </h2>
          <p className="lede reveal-up" style={{ "--i": 2 }}>
            From sunlit hills to volcanic heights, from desert innovation
            to Mediterranean warmth — every bottle carries a landscape.
          </p>
        </div>
        <div className="regions-grid">
          {REGIONS.map((r, i) => <RegionTile key={r.name} region={r} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* GLASS STAGE — 320vh sticky pour into glass, preserved        */
/* ============================================================ */
function GlassStage() {
  const ref = useRef(null);
  const progress = useSectionProgress(ref, 0.22);
  const textFade = clamp((progress - 0.28) / 0.14, 0, 1)
                 * (1 - clamp((progress - 0.86) / 0.10, 0, 1));

  const markets = ["United States", "United Kingdom", "France", "Germany",
    "Switzerland", "Japan", "Singapore", "Australia"];

  return (
    <section ref={ref} className="glass-section" aria-label="The international cellar">
      <div className="glass-sticky" style={{ "--scroll-p": progress }}>
        <ScrollScrubVideo
          progress={progress}
          src="videos/wine-glass-pour.mp4"
          smoothing={0.2}
          variant="glass-scrub"
        />

        <div className="glass-right-col">The International Cellar</div>

        <div
          className="glass-text"
          style={{
            opacity: textFade,
            transform: `translateY(${(1 - textFade) * 14}px)`,
          }}
        >
          <div className="glass-block">
            <div className="eyebrow">Chapter II</div>
            <h2 className="display-l">
              Poured<br />
              <em>for the world.</em>
            </h2>
            <p className="lede">
              Wines of Israel connects international buyers, sommeliers
              and hospitality leaders to the people, places and bottles
              shaping Israel's modern wine country.
            </p>
            <div className="export-line">
              <span className="dot">·</span> Shipping today to
              {markets.map((m, i) => (
                <span key={m}>{i > 0 && <span className="dot">·</span>}{m}</span>
              ))}
              <span className="dot">·</span> 45 markets total
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* WINERIES — Apple-anatomy + Airbnb host-card                  */
/* ============================================================ */
const WINERIES = [
  { name: "Domaine du Castel", region: "Judean Hills", since: "Est. 1988",
    note: "Family estate, Bordeaux-style blends from single-block parcels.",
    export: "Available — EU · UK · US · APAC", mark: "C" },
  { name: "Tulip Winery", region: "Lower Galilee", since: "Est. 2003",
    note: "Social winery with organic vineyards; Mediterranean reds, Syrah.",
    export: "Available — EU · NA · APAC", mark: "T" },
  { name: "Yatir", region: "Negev — Yatir Forest", since: "Est. 2000",
    note: "Desert-edge altitude vineyards; reserve reds, Petit Verdot.",
    export: "Available — EU · US", mark: "Y" },
  { name: "Recanati", region: "Upper Galilee", since: "Est. 2000",
    note: "Indigenous-grape pioneers — Marawi, Carignan, Bittuni.",
    export: "Available — Global", mark: "R" },
  { name: "Tabor", region: "Lower Galilee", since: "Est. 1999",
    note: "Sustainability-certified estate; Cabernet, Roussanne.",
    export: "Available — Global", mark: "T" },
  { name: "Sphera", region: "Judean Hills", since: "Est. 2012",
    note: "White-only, single-vineyard, terroir-driven cellar.",
    export: "Allocation — EU · US · APAC", mark: "S" },
];

function WineryCard({ w, index }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="winery-card reveal-up" style={{ "--i": index % 2 }}>
      <div className="winery-mark">{w.mark}</div>
      <h3 className="winery-name">{w.name}</h3>
      <div className="winery-region">
        {w.region}<span className="dot">·</span>{w.since}
      </div>
      <p className="winery-note">{w.note}</p>
      <div className="winery-export">
        <span>{w.export}</span>
        <span className="winery-export-arrow">→</span>
      </div>
    </article>
  );
}

function WinerySection() {
  const headRef = useReveal();
  return (
    <section id="wineries" className="section wineries">
      <div className="container">
        <div className="section-head" ref={headRef}>
          <div className="eyebrow reveal-up no-rule">The Estates</div>
          <h2 className="display-l reveal-up" style={{ "--i": 1 }}>
            The makers, and the<br />
            <em>bottles they ship.</em>
          </h2>
          <p className="lede reveal-up" style={{ "--i": 2 }}>
            A working cellar for international trade. Browse by region,
            varietal, and export allocation — then request samples or
            visit the estate.
          </p>
          <div className="winery-filters reveal-up" style={{ "--i": 3 }}>
            <button className="chip is-active">All regions</button>
            <button className="chip">Galilee</button>
            <button className="chip">Judean Hills</button>
            <button className="chip">Negev</button>
            <button className="chip">Coastal</button>
            <button className="chip">Indigenous grapes</button>
            <button className="chip">Organic</button>
            <button className="chip">Allocation only</button>
          </div>
        </div>
        <div className="winery-grid">
          {WINERIES.map((w, i) => <WineryCard key={w.name} w={w} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* TRADE CTA — single onyx dramatic close                       */
/* ============================================================ */
function TradeCTA() {
  const ref = useReveal();
  return (
    <section id="trade" className="section trade" ref={ref}>
      <div className="container">
        <div className="eyebrow reveal-up">An invitation</div>
        <h2 className="trade-headline reveal-up" style={{ "--i": 1 }}>
          Discover Israeli wine.<br />
          Meet the makers.<br />
          <em>Open the cellar door.</em>
        </h2>
        <p className="trade-manifesto reveal-up" style={{ "--i": 2 }}>
          For buyers, sommeliers, hospitality leaders, and the
          press — a working cellar and field guide to the modern
          Israeli wine country.
        </p>
        <a href="#" className="trade-link reveal-up" style={{ "--i": 3 }}>
          Request access
          <span className="trade-link-arrow" aria-hidden>
            <svg viewBox="0 0 16 12" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M 1 6 L 14 6 M 9 1 L 14 6 L 9 11" /></svg>
          </span>
        </a>
        <div className="trade-numbers reveal-up" style={{ "--i": 4 }}>
          <div className="trade-number">
            <span className="trade-number-value">280+</span>
            <span className="trade-number-label">Estates</span>
          </div>
          <div className="trade-number">
            <span className="trade-number-value">VI</span>
            <span className="trade-number-label">Terroirs</span>
          </div>
          <div className="trade-number">
            <span className="trade-number-value">45</span>
            <span className="trade-number-label">Markets</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* WAX MARK — single ornament, footer use only                  */
/* ============================================================ */
function WaxMark({ size = 64 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="wax-mark" aria-hidden>
      <defs>
        <radialGradient id="wax-body" cx="38%" cy="34%" r="70%">
          <stop offset="0%"   stopColor="#8a1a32" />
          <stop offset="55%"  stopColor="#6a0e22" />
          <stop offset="100%" stopColor="#3a0810" />
        </radialGradient>
        <radialGradient id="wax-light" cx="34%" cy="30%" r="38%">
          <stop offset="0%"   stopColor="rgba(255,205,170,0.55)" />
          <stop offset="100%" stopColor="rgba(255,205,170,0)" />
        </radialGradient>
      </defs>
      {/* Restrained octagonal seal silhouette */}
      <path
        d="M 50 6 L 70 11 L 86 22 L 94 40 L 94 60 L 86 78 L 70 89 L 50 94 L 30 89 L 14 78 L 6 60 L 6 40 L 14 22 L 30 11 Z"
        fill="url(#wax-body)"
      />
      <ellipse cx="38" cy="30" rx="20" ry="14" fill="url(#wax-light)" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(245,220,180,0.20)" strokeWidth="0.5" />
      <text x="50" y="58" textAnchor="middle"
        style={{ font: "italic 500 30px 'Cormorant Garamond', serif", letterSpacing: "-0.04em" }}
        fill="#f5dcae">W·I</text>
    </svg>
  );
}

/* ============================================================ */
/* FOOTER — bone canvas (Airbnb principle: no dark slab)         */
/* ============================================================ */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-mark">
              <WaxMark size={64} />
              <h3 className="footer-brand-name">Wines <em>of</em> Israel</h3>
            </div>
            <p className="footer-tagline">
              A working cellar and field guide to the vineyards,
              makers and vintages of the modern Israeli wine country.
            </p>
            <p className="footer-address">
              Tel Aviv · Paris · London<br />
              <a href="mailto:cellar@winesofisrael.com">cellar@winesofisrael.com</a>
            </p>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">The Cellar</h4>
            <a href="#regions">The terroirs</a>
            <a href="#wineries">The estates</a>
            <a href="#">Varietals &amp; blends</a>
            <a href="#">Vintage notes</a>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">For Trade</h4>
            <a href="#trade">Open an account</a>
            <a href="#">Request samples</a>
            <a href="#">Allocations</a>
            <a href="#">Press &amp; editorial</a>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Visit</h4>
            <a href="#">Vineyard tours</a>
            <a href="#">Tasting weekends</a>
            <a href="#">Harvest calendar</a>
            <a href="#">The estates map</a>
          </div>
        </div>
        <div className="footer-fine">
          <span>© MMXXVI Wines of Israel · For trade &amp; adult audiences (21+)</span>
          <em>Au verre, au cœur, à la terre.</em>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================ */
/* APP                                                          */
/* ============================================================ */
function App() {
  return (
    <>
      <div className="film-grain" aria-hidden />
      <Nav />
      <CinemaStage />
      <Intertitle chapter="Interlude" line={<>From the land of <span className="accent">sun, stone</span>, and altitude.</>} />
      <RegionsSection />
      <Intertitle chapter="Interlude" line={<>A glass is the <span className="accent">smallest harvest</span>.</>} />
      <GlassStage />
      <Intertitle chapter="Interlude" line={<>The makers, and the <span className="accent">bottles they ship</span>.</>} />
      <WinerySection />
      <TradeCTA />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
