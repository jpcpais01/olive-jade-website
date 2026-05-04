/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

const HERO_SLOTS = [
  { src: "videos/hero_3.mp4", caption: "N°01 — White Stone, Cyclades" },
  { src: "videos/hero_2.mp4", caption: "N°02 — Olive Grove, Crete" },
  { src: "videos/hero_1.mp4", caption: "N°03 — Aegean Light, Naxos" },
];

// ─── HERO ───────────────────────────────────────────────────────
function SeaHeroSlide({ slot, i, active, onReady }) {
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    if (active) { try { v.currentTime = 0; } catch(e){} }
    const p = v.play(); if (p && p.catch) p.catch(() => {});
  }, [active]);
  const handleReady = () => { if (i === 0) { window.__joHeroReady = true; if (onReady) onReady(); } };
  return (
    <div className={"sea-hero-slide" + (active ? " active" : "")}>
      <video ref={videoRef} src={slot.src} autoPlay muted loop playsInline preload="auto" onLoadedData={handleReady} onCanPlay={handleReady} />
    </div>
  );
}

function SeaHero() {
  const [active, setActive] = useState(0);
  const [firstReady, setFirstReady] = useState(false);
  const DURATION = 7500;

  useEffect(() => {
    if (!firstReady) return;
    let start = performance.now(); let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION);
      if (p >= 1) { start = t; setActive(a => (a + 1) % HERO_SLOTS.length); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [firstReady]);

  useEffect(() => {
    const nav = document.querySelector(".nav"); if (!nav) return;
    nav.classList.add("on-dark");
    const onScroll = () => {
      const rect = document.querySelector(".sea-hero")?.getBoundingClientRect();
      if (!rect) return;
      if (rect.bottom < 80) nav.classList.remove("on-dark"); else nav.classList.add("on-dark");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); nav.classList.remove("on-dark"); };
  }, []);

  const heroRef = useRef(null);
  useEffect(() => {
    const el = heroRef.current; if (!el) return;
    const t = setTimeout(() => {
      el.querySelectorAll(".sea-hero-headline .rv-mask").forEach(m => m.classList.add("rv-in"));
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const orn1 = window.useMouseParallax(20);
  const orn2 = window.useMouseParallax(35);
  const orn3 = window.useMouseParallax(15);
  const orn4 = window.useMouseParallax(28);

  return (
    <section className="sea-hero" ref={heroRef}>
      <div className="sea-hero-stage">
        {HERO_SLOTS.map((s, i) => (
          <SeaHeroSlide key={i} slot={s} i={i} active={i === active} onReady={() => setFirstReady(true)} />
        ))}
        <div className="sea-hero-caustic" />
        <div className="sea-hero-veil" />
        <div className="sea-hero-grain" />
      </div>

      <div ref={orn1} className="sea-orn sea-orn-1" aria-hidden="true">
        <svg viewBox="0 0 200 360" preserveAspectRatio="none">
          <path d="M100 10 C 30 100, 30 240, 100 350 C 170 240, 170 100, 100 10 Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.7"/>
          <path d="M100 10 L 100 350" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
          <path d="M100 60 L 60 110 M100 60 L 140 110 M100 130 L 50 190 M100 130 L 150 190 M100 200 L 60 250 M100 200 L 140 250 M100 270 L 75 310 M100 270 L 125 310" stroke="currentColor" strokeWidth="0.4" opacity="0.5"/>
        </svg>
      </div>
      <div ref={orn2} className="sea-orn sea-orn-2" aria-hidden="true"><svg viewBox="0 0 60 60"><path d="M30 4 L 30 56 M4 30 L 56 30" stroke="currentColor" strokeWidth="0.8"/></svg></div>
      <div ref={orn3} className="sea-orn sea-orn-3" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.6"/>
          <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 4"/>
          <circle cx="100" cy="100" r="48" fill="none" stroke="currentColor" strokeWidth="0.4"/>
        </svg>
      </div>
      <div ref={orn4} className="sea-orn sea-orn-4" aria-hidden="true"><svg viewBox="0 0 400 80" preserveAspectRatio="none"><path d="M0 40 Q 100 0 200 40 T 400 40" fill="none" stroke="currentColor" strokeWidth="0.6"/></svg></div>

      <div className="sea-hero-overlay">
        <div className="sea-hero-content">
          <h1 className="sea-hero-headline">
            <span className="rv-mask"><span>Worn for</span></span>
            <span className="rv-mask"><span>the <em>long</em> while.</span></span>
          </h1>
<div className="sea-hero-actions">
            <window.Magnetic strength={0.25}><a href="shop.html" className="btn-sand">Spring Edition <window.Icon.Arrow /></a></window.Magnetic>
          </div>
        </div>
      </div>

      <div className="sea-scroll-cue"><span>Scroll</span><span className="ssc-line" /></div>
    </section>
  );
}

// ─── Tide marquee ───────────────────────────────────────────────
function TideMarquee() {
  const words = ["Drawn from the sea", "Atlantic light", "Aegean stone", "Sea of Japan", "Numbered editions", "Repaired forever", "Hand finished"];
  const all = [...words, ...words];
  return (
    <div className="tide-marquee">
      <div className="tide-marquee-track">
        {all.map((w, i) => (<span className="tm-w" key={i}>{w}<span className="tm-g" /></span>))}
      </div>
    </div>
  );
}

// ─── Section I — Four-up vertical strip ──────────────────────────
function CollectionShowcase() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    window.ZendropAPI.listProducts({ featured: true }).then(p => setProducts(p.slice(0, 4)));
  }, []);

  return (
    <section className="strip-i">
      <div className="strip-i-head">
        <div className="strip-i-eyebrow rv"><span className="strip-i-line" /><span>I · The Spring Edition</span></div>
        <h2 className="strip-i-title rv-up">Four pieces, this season.</h2>
      </div>

      <div className="strip-i-grid">
        {products.map((p, i) => (
          <a key={p.id} href={`product.html?id=${p.id}`} className="strip-i-cell">
            <div className="strip-i-frame">
              <img src={p.images && p.images[0]} alt={p.name} loading="lazy" />
              <div className="strip-i-meta">
                <span className="strip-i-num">N°{String(i+1).padStart(2,"0")}</span>
                <span className="strip-i-name">{p.name}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="strip-i-foot">
        <window.Magnetic>
          <a href="shop.html" className="btn-sand">See all Collection <window.Icon.Arrow /></a>
        </window.Magnetic>
      </div>
    </section>
  );
}

// ─── Four Seas — sticky-stack cinematic tableau ──────────────────
const SEAS = [
  { n: "I",  name: "Mediterranean", place: "Naxos · 37.10°N",    line: "White stone & olive",     body: "The white quiet of a Cycladic noon. Limewashed walls, sun-warmed marble, gold the colour of dry grass.",       video: "videos/sea_med.mp4", accent: "#C9B68F" },
  { n: "II", name: "Sea of Japan",  place: "Kyoto · 35.01°N",    line: "Linen, silk & restraint", body: "A coast of mist and pine. Jewellery worn the way a kimono is folded — quietly, precisely, without occasion.", video: "videos/sea_japan.mp4", accent: "#8C6F5C" },
];

function TwoSeas() {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = wrap.getBoundingClientRect();
        const total = wrap.offsetHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / total));
        setProgress(p);
        const idx = Math.min(SEAS.length - 1, Math.max(0, Math.floor(p * SEAS.length * 0.9999)));
        setActive(idx);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Auto-advance: 5 s after section enters view, scroll to next sea
  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    let timer = null;
    let interval = null;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        timer = setTimeout(() => {
          // Start cycling every 5 s
          let idx = 0;
          interval = setInterval(() => {
            idx = (idx + 1) % SEAS.length;
            const total = wrap.offsetHeight - window.innerHeight;
            const docTop = wrap.getBoundingClientRect().top + window.scrollY;
            const p = idx === 0 ? 0.05 : (idx / SEAS.length) + 0.05;
            window.scrollTo({ top: docTop + p * total, behavior: 'smooth' });
          }, 5000);
        }, 5000);
      } else {
        clearTimeout(timer);
        clearInterval(interval);
      }
    }, { threshold: 0.6 });
    io.observe(wrap);
    return () => { io.disconnect(); clearTimeout(timer); clearInterval(interval); };
  }, []);

  return (
    <section className="four-seas" ref={wrapRef} style={{ height: `${SEAS.length * 100}vh` }}>
      <div className="fs-stick">
        <div className="fs-stage">
          {SEAS.map((s, i) => (
            <div key={s.name} className={"fs-bg" + (i === active ? " active" : "")}>
              {s.video
                ? <video src={s.video} autoPlay muted loop playsInline />
                : <img src={s.img} alt="" loading="lazy" />}
            </div>
          ))}
          <div className="fs-bg-veil" />
          <div className="fs-grain" />
        </div>

        <div className="fs-head">
          <div className="fs-eyebrow"><span className="fs-line" /><span>II · Drawn from two seas</span></div>
          <div className="fs-prog">
            {SEAS.map((s, i) => (
              <div key={i} className={"fs-prog-dot" + (i === active ? " active" : i < active ? " past" : "")} />
            ))}
          </div>
        </div>

        <div className="fs-content">
          {SEAS.map((s, i) => (
            <div key={s.name} className={"fs-panel" + (i === active ? " active" : "")} style={{ "--accent": s.accent }}>
              <div className="fs-panel-num">N° {s.n}</div>
              <div className="fs-panel-place">{s.place}</div>
              <h2 className="fs-panel-name"><span>{s.name}</span></h2>
              <div className="fs-panel-line">{s.line}</div>
              <p className="fs-panel-body">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="fs-watermark" aria-hidden="true">
          {SEAS.map((s, i) => (
            <span key={i} className={i === active ? "active" : ""}>{s.name}</span>
          ))}
        </div>

        <div className="fs-foot">
          <span className="fs-foot-num">{String(active + 1).padStart(2,"0")} / {String(SEAS.length).padStart(2,"0")}</span>
          <div className="fs-foot-bar"><div className="fs-foot-fill" style={{ width: `${progress*100}%` }} /></div>
          <span className="fs-foot-label">The seas the house draws from</span>
        </div>
      </div>
    </section>
  );
}

// ─── Summer Edition — asymmetric editorial spread ────────────────
const SUMMER_PIECES = [
  { id: "su-1",  name: "Solstice Hoop",       cat: "Earrings",  img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-2",  name: "Naxos Cuff",          cat: "Bracelet",  img: "https://images.unsplash.com/photo-1535556261540-cdce80e76b73?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-3",  name: "Salt Pearl Drop",     cat: "Earring",   img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-4",  name: "Olive Stone Ring",    cat: "Ring",      img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-5",  name: "Andaman Pendant",     cat: "Necklace",  img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-6",  name: "Linen Chain",         cat: "Necklace",  img: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-7",  name: "Cycladic Hoop",       cat: "Earring",   img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-8",  name: "Tide-light Band",     cat: "Ring",      img: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-9",  name: "Kanazawa Pendant",    cat: "Necklace",  img: "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-10", name: "Aegean Tear",         cat: "Earring",   img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-11", name: "River Silver Cuff",   cat: "Bracelet",  img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1100&q=85" },
  { id: "su-12", name: "Quiet Hand Signet",   cat: "Ring",      img: "https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?auto=format&fit=crop&w=1100&q=85" },
];

// Hand-tuned mosaic — each cell defines column-span × row-span on a 12-col grid
// with grid-auto-flow: dense filling holes. Sizes are picked so the 12 pieces
// vary (wide / tall / square) without overlapping or leaving gaps.
const SUMMER_LAYOUT = [
  { c: 4, r: 5 }, // 1  tall      → col1
  { c: 4, r: 3 }, // 2  wide      → col2
  { c: 4, r: 6 }, // 3  tall      → col3
  { c: 4, r: 2 }, // 4  wide-short→ col2
  { c: 4, r: 3 }, // 5  square-ish→ col1
  { c: 4, r: 4 }, // 6  square    → col2
  { c: 4, r: 4 }, // 7  square    → col3
  { c: 4, r: 4 }, // 8  square    → col1
  { c: 4, r: 6 }, // 9  tall      → col3
  { c: 4, r: 3 }, // 10 wide      → col2
  { c: 4, r: 4 }, // 11 square    → col1
  { c: 4, r: 4 }, // 12 wide      → col2
];
// Column sums (with dense flow, 3 cols of 4 spans each):
// col1: 5+3+4+4 = 16  ✓
// col2: 3+2+4+3+4 = 16 ✓
// col3: 6+4+6 = 16    ✓

function SummerCollection() {
  return (
    <section className="summer">
      <div className="summer-head">
        <div className="summer-eyebrow rv"><span className="summer-line" /><span>III · The Summer Edition · MMXXVI</span></div>
        <h2 className="summer-title rv-up">
          <span>Worn under</span><br/>
          <span><em>longer light.</em></span>
        </h2>
        <p className="summer-sub rv">Twelve pieces for the season the sea grows warm — longer days, lighter hand, gold worn against bare skin.</p>
      </div>

      <div className="summer-grid">
        {SUMMER_PIECES.map((p, i) => {
          const l = SUMMER_LAYOUT[i];
          return (
            <a
              key={p.id}
              href="shop.html"
              className={`summer-cell summer-cell-${i+1}`}
              style={{ gridColumn: `span ${l.c}`, gridRow: `span ${l.r}` }}
            >
              <div className="summer-frame">
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>
              <div className="summer-meta">
                <span className="summer-num">N°{String(i+1).padStart(2,"0")}</span>
                <span className="summer-name">{p.name}</span>
              </div>
            </a>
          );
        })}
      </div>

      <div className="summer-foot">
        <div className="summer-foot-note rv">
          <span className="summer-foot-mark">¶</span>
          <span>Twelve pieces, made between two seas.<br/>Released at the solstice.</span>
        </div>
        <window.Magnetic>
          <a href="shop.html" className="btn-sand">See Summer Collection <window.Icon.Arrow /></a>
        </window.Magnetic>
      </div>
    </section>
  );
}

// ─── IV · Inspirations ──────────────────────────────────────────
const INSPIRATIONS = [
  {
    city: "Lisbon", country: "Portugal", coords: "38.72°N · 9.14°W",
    headline: "Atlantic Gold", sub: "Where the Tagus meets the open sea",
    body: "River silver worked cold in Alfama workshops. Sun-worn gold the colour of late afternoon on limestone — the house keeps its Lisbon studio small.",
    note: "N°01", sea: "Atlantic", material: "River Silver · Hammered Gold",
    x: 75, y: 132,
  },
  {
    city: "Valencia", country: "Spain", coords: "39.47°N · 0.37°W",
    headline: "Levantine Sun", sub: "Orange light on warm stone",
    body: "A city that faces the sea and the plain in equal measure. Gold worn loose, hammered flat, warm as saffron at midday.",
    note: "N°02", sea: "Levantine", material: "Hammered Gold · Carnelian",
    x: 305, y: 94,
  },
  {
    city: "Positano", country: "Italy", coords: "40.63°N · 14.49°E",
    headline: "Amalfi Terrace", sub: "Lemon groves above the sea",
    body: "Cliffside colour, vertical gardens, the sound of boats below. A jewel from here is worn the way a scarf is tied — once, effortlessly.",
    note: "N°03", sea: "Tyrrhenian", material: "Gold Leaf · Coral",
    x: 570, y: 72,
  },
  {
    city: "Mykonos", country: "Greece", coords: "37.45°N · 25.33°E",
    headline: "Aegean Stone", sub: "White stone under a vertical sun",
    body: "Cycladic noon: limewashed walls, heat on marble, a hum that is almost silence. Gold thin as light, worn to the harbour.",
    note: "N°04", sea: "Aegean", material: "Cycladic Stone · Yellow Gold",
    x: 830, y: 82,
  },
  {
    city: "Antalya", country: "Turkey", coords: "36.87°N · 30.71°E",
    headline: "Taurus Light", sub: "Ancient harbour on the Levant coast",
    body: "Bronze and beaten gold — the weight of caravan roads and deep harbours. Worn with intention, then left alone to be heard.",
    note: "N°05", sea: "Levant", material: "Bronze · Beaten Gold",
    x: 1090, y: 100,
  },
];

function Inspirations() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const loc = INSPIRATIONS[active];
  // Smooth bezier through all 5 cities west → east
  const curve = "M 75,132 C 165,128 238,90 305,94 C 385,99 482,65 570,72 C 652,79 752,81 830,82 C 918,84 1022,97 1090,100";

  return (
    <section className={`inspo${visible ? " in" : ""}`} ref={sectionRef}>
      <div className="inspo-hd">
        <div className="inspo-eyebrow"><span className="inspo-eb-line" /><span>IV · Inspirations</span></div>
        <h2 className="inspo-title">Drawn from <em>five coasts.</em></h2>
      </div>

      {/* ── Route SVG ── */}
      <div className="inspo-route-wrap">
        <svg className="inspo-route" viewBox="0 0 1200 175" preserveAspectRatio="xMidYMid meet">
          {/* The single curved path */}
          <path d={curve} fill="none" stroke="var(--hairline)" strokeWidth="1" />

          {/* City markers */}
          {INSPIRATIONS.map((l, i) => {
            const on = i === active;
            return (
              <g key={l.city} className="inspo-pin" onClick={() => setActive(i)} style={{ cursor: "pointer" }}>
                {/* City name above dot */}
                <text x={l.x} y={l.y - 28} textAnchor="middle"
                  fill={on ? "var(--ink)" : "var(--muted)"}
                  fontSize="12" fontFamily="Cormorant Garamond,Georgia,serif"
                  fontStyle="italic" letterSpacing="-0.2"
                  style={{ transition: "fill .35s ease" }}
                >{l.city}</text>
                {/* Country */}
                <text x={l.x} y={l.y - 15} textAnchor="middle"
                  fill={on ? "var(--muted)" : "var(--hairline)"}
                  fontSize="7.5" fontFamily="JetBrains Mono,monospace"
                  letterSpacing="2" style={{ transition: "fill .35s ease" }}
                >{l.country.toUpperCase()}</text>

                {/* Ring — active only */}
                <circle cx={l.x} cy={l.y} r="9" fill="none"
                  stroke={on ? "var(--jade)" : "transparent"}
                  strokeWidth="0.7" opacity="0.38"
                />
                {/* Dot */}
                <circle cx={l.x} cy={l.y} r={on ? 3.5 : 2.5}
                  fill={on ? "var(--jade)" : "var(--hairline)"}
                  style={{ transition: "fill .35s ease" }}
                />

                {/* Coords below — fade in when active */}
                <text x={l.x} y={l.y + 17} textAnchor="middle"
                  fill={on ? "var(--muted)" : "transparent"}
                  fontSize="7.5" fontFamily="JetBrains Mono,monospace"
                  letterSpacing="0.8" style={{ transition: "fill .35s ease" }}
                >{l.coords}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Editorial text ── */}
      <div className="inspo-body" key={active}>
        <div className="inspo-left">
          <div className="inspo-note">{loc.note} · {loc.sea}</div>
          <h3 className="inspo-headline"><em>{loc.headline}</em></h3>
          <div className="inspo-material">{loc.material}</div>
        </div>
        <div className="inspo-right">
          <p className="inspo-sub">{loc.sub}</p>
          <p className="inspo-bodytext">{loc.body}</p>
        </div>
      </div>
    </section>
  );
}

// ─── App ─────────────────────────────────────────────────────────
function HomeApp() {
  window.useReveal2();
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => { document.body.classList.add("med-home"); return () => document.body.classList.remove("med-home"); }, []);

  return (
    <React.Fragment>
      <window.SeaCursor />
      <window.Nav current="home" onOpenCart={() => setCartOpen(true)} />
      <main>
        <SeaHero />
        <TideMarquee />
        <CollectionShowcase />
        <TwoSeas />
        <SummerCollection />
        <Inspirations />
      </main>
      <window.Footer />
      <window.CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<HomeApp />);
