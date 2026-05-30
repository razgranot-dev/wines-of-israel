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

/* Like useReveal, but returns the in-view state so the consumer can render the
   `is-visible` class itself. Required for components that ALSO re-render on
   interaction (e.g. the expandable winery card) — otherwise React rewrites
   className on re-render and clobbers an imperatively-added class. */
function useInView(threshold = 0.12, rootMargin = "0px 0px -6% 0px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { setInView(true); io.unobserve(e.target); }
      }),
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
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
      <span className="intertitle-rule intertitle-rule--in" />
      {chapter && <div className="eyebrow eyebrow--flanked reveal-up">{chapter}</div>}
      <p className="intertitle-line reveal-up" style={{ "--i": 1 }}>{line}</p>
      <span className="intertitle-seal reveal-up" style={{ "--i": 2 }}>
        <span className="intertitle-diamond" />
        <span className="intertitle-rule intertitle-rule--out" />
      </span>
    </section>
  );
}

/* ============================================================ */
/* REGIONS — editorial 2×3 grid, photo-led, Apple anatomy        */
/* ============================================================ */
const REGIONS = [
  { name: "Galilee",       desc: "Mountain freshness and expressive aromatics.",
    meta: "400–900 m · limestone · cool nights",   motif: "mountain", slug: "galilee" },
  { name: "Golan Heights", desc: "Volcanic soils and high-altitude structure.",
    meta: "600–1200 m · basalt · long ripening",   motif: "volcano",  slug: "golan-heights" },
  { name: "Judean Hills",  desc: "Ancient terraces and elegant balance.",
    meta: "300–900 m · terra rossa · chalk",        motif: "terrace", slug: "judean-hills" },
  { name: "Shomron",       desc: "Rolling hills and Mediterranean breadth.",
    meta: "150–500 m · marl · sun-laden",           motif: "hills",   slug: "shomron" },
  { name: "Negev",         desc: "Desert innovation and bold character.",
    meta: "300–900 m · loess · radical light",      motif: "desert",  slug: "negev" },
  { name: "Coastal Plain", desc: "Mediterranean warmth and accessibility.",
    meta: "0–150 m · alluvial · saline air",        motif: "sea",     slug: "coastal-plain" },
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
      <div className="region-art region-art-photo">
        <img
          className="region-photo"
          src={`assets/generated/v2/terroir-${region.slug}.png`}
          alt={`${region.name} — vineyards`}
          loading="lazy"
          decoding="async"
        />
        <div className="region-art-eyebrow">
          <span className="region-art-num">{ROMANS[index]}</span>
          <span>Terroir</span>
        </div>
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
/* Verified by the winery-researcher agent (founding years, sites, winemakers,
   regions). Trade-desk emails / contact names are representative placeholders. */
const WINERIES = [
  { name: "Domaine du Castel", mark: "C", logo: "assets/wineries/logos/castel-logo.png", region: "Judean Hills", subRegion: "Ramat Raziel",
    location: "Yad HaShmona, Judean Hills, Israel", founded: "1988",
    website: "castel.co.il", email: "export@castel.co.il", phone: "+972 2-535-0098",
    contact: "Ariel Ben Zaken, Export Manager",
    socials: { instagram: "castelwinery", facebook: "DomaineDuCastel", linkedin: "company/domaine-du-castel" },
    shortStory: "The estate that pioneered the modern Judean Hills and reset Israel's fine-wine ambition.",
    winemaker: "Eli Ben Zaken", vineyards: "Estate plots across the Judean Hills, roughly 600-900 m",
    varietals: ["Cabernet Sauvignon", "Merlot", "Petit Verdot", "Chardonnay", "Malbec"],
    certifications: "Kosher", exportMarkets: "EU · UK · US · APAC", allocation: "Allocation only",
    longStory: "Founded by Eli Ben Zaken, who planted the first modern vineyard in the Judean Hills in 1988, Castel grew from a backyard experiment into the region's benchmark estate. Its Bordeaux-style Grand Vin and Chardonnay are built for cellaring, and the family farms its own plots around Yad HaShmona. The house remains family-run and fully kosher, sought after across the world's fine-wine markets." },

  { name: "Tulip Winery", mark: "T", logo: "assets/wineries/logos/tulip-logo.png", region: "Galilee", subRegion: "Kfar Tikva, Mount Carmel",
    location: "Kfar Tikva, Kiryat Tivon, Israel", founded: "2003",
    website: "tulip-winery.co.il", email: "export@tulip-winery.co.il", phone: "+972 4-993-0573",
    contact: "Roy Itzhaki, Export Manager",
    socials: { instagram: "tulipwinery", facebook: "TulipWinery", linkedin: "company/tulip-winery" },
    shortStory: "A quality-driven winery built within a supportive community for people with special needs.",
    winemaker: "David Bar-Ilan", vineyards: "Sourced from the Upper Galilee and Judean Hills",
    varietals: ["Cabernet Sauvignon", "Syrah", "Merlot", "Cabernet Franc", "Chardonnay"],
    certifications: "Kosher · Social enterprise", exportMarkets: "EU · UK · US · APAC", allocation: "Available",
    longStory: "Established by the Itzhaki family in 2003 on a hillside in Kfar Tikva, a community for adults with special needs, Tulip pairs serious winemaking with a rare social mission. Members of the village work throughout the winery, and the wines are now exported worldwide. Production centers on Mediterranean reds under winemaker David Bar-Ilan." },

  { name: "Yatir", mark: "Y", logo: "assets/wineries/logos/yatir-logo.png", region: "Judean Hills", subRegion: "Yatir Forest, northeastern Negev",
    location: "Tel Arad, Yatir Forest, Israel", founded: "2000",
    website: "yatirwinery.com", email: "export@yatirwinery.com", phone: "+972 8-959-9090",
    contact: "Yael Gabbai, Export Manager",
    socials: { instagram: "yatirwinery", facebook: "YatirWinery", linkedin: "company/yatir-winery" },
    shortStory: "High-desert vineyards on the southern edge of the Judean Hills, at the Yatir Forest.",
    winemaker: "Eran Goldwasser", vineyards: "Vineyards around the Yatir Forest, roughly 600-900 m on the desert fringe",
    varietals: ["Cabernet Sauvignon", "Petit Verdot", "Syrah", "Merlot", "Viognier"],
    certifications: "Kosher", exportMarkets: "EU · UK · US · APAC", allocation: "Allocation only",
    longStory: "Founded in 2000 as a venture with Carmel Winery, Yatir draws its fruit from high-altitude vineyards near the Yatir Forest, at the southern tip of the Judean Hills on the edge of the Negev. Cool nights and poor soils give structured, age-worthy reds led by the flagship Yatir Forest blend. Winemaker Eran Goldwasser has guided the house to recognition as one of Israel's leading estates." },

  { name: "Recanati", mark: "R", logo: "assets/wineries/logos/recanati-logo.png", region: "Upper Galilee", subRegion: "Manara Cliff, Galilee",
    location: "Ramat Dalton, Upper Galilee, Israel", founded: "2000",
    website: "recanati-winery.com", email: "export@recanati-winery.com", phone: "+972 4-699-2828",
    contact: "Noa Shaked, Export Manager",
    socials: { instagram: "recanatiwinery", facebook: "RecanatiWinery", linkedin: "company/recanati-winery" },
    shortStory: "A leader in Mediterranean varieties and the revival of Israel's ancient native grapes.",
    winemaker: "Gil Shatsberg", vineyards: "High-altitude Manara vineyards in the Upper Galilee and Jezreel Valley plots",
    varietals: ["Carignan", "Marselan", "Syrah", "Cabernet Sauvignon", "Marawi", "Bittuni"],
    certifications: "Kosher", exportMarkets: "EU · UK · US · APAC", allocation: "Available",
    longStory: "Founded in 2000 by Lenny Recanati, the winery champions Mediterranean varieties suited to Israel's climate and famously revived the indigenous Marawi and Bittuni grapes. Most fruit comes from the high Manara vineyards in the Upper Galilee, with the winery now based at Ramat Dalton. Under winemaker Gil Shatsberg it has become one of Israel's most widely exported quality producers." },

  { name: "Tabor", mark: "T", logo: "assets/wineries/logos/tabor-logo.png", region: "Lower Galilee", subRegion: "Kfar Tavor, Mount Tabor",
    location: "Kfar Tavor, Lower Galilee, Israel", founded: "1999",
    website: "taborwinery.co.il", email: "export@twc.co.il", phone: "+972 4-676-0444",
    contact: "Oren Sela, Export Manager",
    socials: { instagram: "taborwinery", facebook: "TaborWinery", linkedin: "company/tabor-winery" },
    shortStory: "Galilee grower-winery with a strong focus on terroir, nature and varietal range.",
    winemaker: "Arieh Nesher", vineyards: "Estate vineyards in the foothills of Mount Tabor and across the Galilee",
    varietals: ["Cabernet Sauvignon", "Merlot", "Shiraz", "Barbera", "Sauvignon Blanc", "Chardonnay"],
    certifications: "Kosher · Sustainable", exportMarkets: "EU · UK · US · APAC", allocation: "Available",
    longStory: "Founded in 1999 by winegrowing families from Kfar Tavor, Tabor farms estate vineyards in the foothills of Mount Tabor across a wide range of varieties. The winery places strong emphasis on terroir, biodiversity and sustainable farming, and produces an extensive portfolio under long-serving winemaker Arieh Nesher. It is regarded as one of Israel's leading value-driven quality wineries." },

  { name: "Sphera", mark: "S", logo: "assets/wineries/logos/sphera-logo.png", region: "Judean Hills", subRegion: "Givat Yeshayahu",
    location: "Givat Yeshayahu, Judean Hills, Israel", founded: "2012",
    website: "spherawinery.com", email: "export@spherawinery.com", phone: "+972 2-993-8577",
    contact: "Sima Rav Hon, Export Manager",
    socials: { instagram: "spherawinery", facebook: "spherawinery", linkedin: "company/sphera-winery" },
    shortStory: "Israel's white-wine specialist, crafting precise, mineral wines from the Judean Hills.",
    winemaker: "Doron Rav Hon", vineyards: "Estate vineyards across the Judean Hills around Givat Yeshayahu",
    varietals: ["Chardonnay", "Riesling", "Sauvignon Blanc", "Chenin Blanc", "Semillon"],
    certifications: "Kosher", exportMarkets: "EU · UK · US · APAC", allocation: "Allocation only",
    longStory: "Founded in 2012 by Doron and Sima Rav Hon, Sphera is the only Israeli winery devoted exclusively to white wine. Burgundy-trained Doron Rav Hon farms vineyards across the Judean Hills near Givat Yeshayahu, crafting taut, mineral whites led by the First Page, Chardonnay and Riesling bottlings. The boutique, family-run house is regarded as Israel's reference point for serious white wine." },
];

/* Minimal inline icon set (no icon library available in this no-build site). */
function Ico({ name }) {
  const p = { className: "ico", viewBox: "0 0 24 24", width: 16, height: 16, fill: "none",
    stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  switch (name) {
    case "pin":      return <svg {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.3" /></svg>;
    case "globe":    return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" /></svg>;
    case "mail":     return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2.2" /><path d="m3.6 6.6 8.4 6 8.4-6" /></svg>;
    case "phone":    return <svg {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>;
    case "user":     return <svg {...p}><circle cx="12" cy="8" r="3.3" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>;
    case "chevron":  return <svg {...p}><path d="m6 9 6 6 6-6" /></svg>;
    case "arrow":    return <svg {...p}><path d="M4 12h15M13 6l6 6-6 6" /></svg>;
    case "instagram":return <svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.2" cy="6.8" r="0.7" fill="currentColor" stroke="none" /></svg>;
    case "facebook": return <svg {...p}><path d="M14 8.5h2.3V5.4H14c-2.1 0-3.4 1.3-3.4 3.5v1.6H8.4v3.1h2.2V20h3.1v-6.4h2.2l.5-3.1h-2.7V9.1c0-.4.3-.6.7-.6Z" /></svg>;
    case "linkedin": return <svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="3.2" /><path d="M8 10.6V16.8M8 7.7v.1M12 16.8v-3.3c0-1.7 2.5-1.7 2.5 0v3.3M12 13.5v-2.9" /></svg>;
    default: return null;
  }
}

function WineryCard({ w, index }) {
  const [ref, inView] = useInView();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);
  const stop = (e) => e.stopPropagation();
  const panelId = `wc-panel-${index}`;
  const socials = [
    ["instagram", w.socials.instagram && `https://instagram.com/${w.socials.instagram}`],
    ["facebook",  w.socials.facebook  && `https://facebook.com/${w.socials.facebook}`],
    ["linkedin",  w.socials.linkedin  && `https://linkedin.com/${w.socials.linkedin}`],
  ].filter((s) => s[1]);

  return (
    <article
      ref={ref}
      className={`winery-card reveal-up ${inView ? "is-visible" : ""} ${open ? "is-open" : ""}`}
      style={{ "--i": index % 2 }}
      onClick={toggle}
    >
      <div className="wc-top">
        <span className={`wc-logo ${w.logo ? "" : "wc-logo--mono"}`}>
          {w.logo
            ? <img className="wc-logo-img" src={w.logo} alt={`${w.name} logo`} loading="lazy" decoding="async" />
            : <span className="wc-logo-mono" aria-hidden>{w.mark}</span>}
        </span>
        <span className="wc-est">Est. {w.founded}</span>
      </div>

      <h3 className="wc-name">{w.name}</h3>
      <div className="wc-region">
        <Ico name="pin" />{w.region}<span className="dot">·</span>{w.subRegion}
      </div>
      <div className="wc-loc">{w.location}</div>

      <p className="wc-story">{w.shortStory}</p>

      <div className="wc-contacts" onClick={stop}>
        <a className="wc-line" href={`https://${w.website}`} target="_blank" rel="noopener noreferrer">
          <Ico name="globe" /><span>{w.website}</span>
        </a>
        <a className="wc-line" href={`mailto:${w.email}`}>
          <Ico name="mail" /><span>{w.email}</span>
        </a>
        <a className="wc-line" href={`tel:${w.phone.replace(/[^\d+]/g, "")}`}>
          <Ico name="phone" /><span>{w.phone}</span>
        </a>
        <div className="wc-line wc-line--static">
          <Ico name="user" /><span>{w.contact}</span>
        </div>
      </div>

      <div className="wc-foot">
        <div className="wc-socials" onClick={stop}>
          {socials.map(([net, url]) => (
            <a key={net} className="wc-social" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${w.name} on ${net}`}>
              <Ico name={net} />
            </a>
          ))}
        </div>
        <button
          className="wc-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={(e) => { stop(e); toggle(); }}
        >
          <span>{open ? "Close profile" : "View full profile"}</span>
          <span className="wc-toggle-chev"><Ico name="chevron" /></span>
        </button>
      </div>

      <div className="wc-panel" id={panelId} onClick={stop} {...(open ? {} : { inert: "" })}>
        <div className="wc-panel-inner">
          <div className="wc-dossier-label">The dossier</div>
          <dl className="wc-specs">
            <div className="wc-spec"><dt>Winemaker</dt><dd>{w.winemaker}</dd></div>
            <div className="wc-spec"><dt>Vineyards</dt><dd>{w.vineyards}</dd></div>
            <div className="wc-spec"><dt>Certification</dt><dd>{w.certifications}</dd></div>
            <div className="wc-spec"><dt>Export</dt><dd>{w.exportMarkets}</dd></div>
            <div className="wc-spec"><dt>Allocation</dt><dd>{w.allocation}</dd></div>
          </dl>
          <div className="wc-varietals">
            {w.varietals.map((v) => <span key={v} className="wc-grape">{v}</span>)}
          </div>
          <p className="wc-longstory">{w.longStory}</p>
          <div className="wc-actions">
            <a className="wc-cta wc-cta--primary" href="#trade"><span>Request samples</span><Ico name="arrow" /></a>
            <a className="wc-cta" href={`https://${w.website}`} target="_blank" rel="noopener noreferrer">Estate website</a>
          </div>
        </div>
      </div>
    </article>
  );
}

function WinerySection() {
  const headRef = useReveal();
  return (
    <section id="wineries" className="section wineries">
      <div className="container">
        <div className="section-head wineries-head" ref={headRef}>
          <div className="section-open reveal-up" aria-hidden>
            <img className="crest-swag" src="assets/generated/v2/crest-swag.png" alt="" />
            <span className="section-open-mark"><WaxMark size={42} /></span>
          </div>
          <div className="eyebrow reveal-up no-rule" style={{ "--i": 1 }}>The Estates</div>
          <h2 className="display-l reveal-up" style={{ "--i": 2 }}>
            The makers, and the<br />
            <em>bottles they ship.</em>
          </h2>
          <span className="head-rule reveal-up" style={{ "--i": 3 }} aria-hidden />
          <p className="lede reveal-up" style={{ "--i": 4 }}>
            A working cellar for international trade. Browse by region,
            varietal, and export allocation, then request samples or
            visit the estate.
          </p>
          <div className="winery-filters reveal-up" style={{ "--i": 5 }}>
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
/* ESTATES SPREAD — Interlude + The Estates as one premium        */
/* sequence: a warm lit alcove with a vine-laurel estate crest.   */
/* ============================================================ */
function EstatesSpread() {
  return (
    <div className="estates-spread">
      <Intertitle chapter="Interlude" line={<>The makers, and the <span className="accent">bottles they ship</span>.</>} />
      <WinerySection />
    </div>
  );
}

/* ============================================================ */
/* APP                                                          */
/* ============================================================ */
function App() {
  /* Idle "you can open me" hint: after 2s without scrolling, softly cue the
     first visible un-opened winery card. Any scroll/click resets it; it
     re-arms on the next idle. Fully skipped under reduced-motion. */
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let idleTimer = 0, clearTimer = 0;
    const clearInvite = () => {
      window.clearTimeout(clearTimer);
      document.querySelectorAll(".winery-card.invite").forEach((c) => c.classList.remove("invite"));
    };
    const fire = () => {
      clearInvite();
      const vh = window.innerHeight;
      const card = [...document.querySelectorAll(".winery-card")].find((c) => {
        if (c.classList.contains("is-open")) return false;
        const r = c.getBoundingClientRect();
        return r.top < vh * 0.82 && r.bottom > 90;   // genuinely in view
      });
      if (card) {
        card.classList.add("invite");
        clearTimer = window.setTimeout(() => card.classList.remove("invite"), 3600);
      }
    };
    const reset = () => {
      clearInvite();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(fire, 2000);
    };
    reset();
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("pointerdown", reset, { passive: true });
    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(clearTimer);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("pointerdown", reset);
      clearInvite();
    };
  }, []);

  return (
    <>
      <div className="film-grain" aria-hidden />
      <Nav />
      <CinemaStage />
      <Intertitle chapter="Interlude" line={<>From the land of <span className="accent">sun, stone</span>, and altitude.</>} />
      <RegionsSection />
      <Intertitle chapter="Interlude" line={<>A glass is the <span className="accent">smallest harvest</span>.</>} />
      <GlassStage />
      <EstatesSpread />
      <TradeCTA />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
