/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

// ─── HERO: Video carousel ───────────────────────────────────────────
// Drop hero_1.mp4, hero_2.mp4, hero_3.mp4 into /videos and they auto-load below.
const VIDEO_SLOTS = [
  { src: "videos/hero_1.mp4", poster: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1800&q=85", caption: "N°01 — The Atelier, Athens" },
  { src: "videos/hero_2.mp4", poster: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1800&q=85", caption: "N°02 — Hand-cut jade, Mandalay" },
  { src: "videos/hero_3.mp4", poster: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=85", caption: "N°03 — Olive grove, Crete" },
];

function HeroSlide({ slot, i, active, onReady }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      try { v.currentTime = 0; } catch (e) {}
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  const handleReady = () => {
    if (i === 0) {
      window.__joHeroReady = true;
      if (onReady) onReady();
    }
  };

  return (
    <div className={"hero-slide" + (active ? " active" : "")}>
      <video
        ref={videoRef}
        src={slot.src}
        autoPlay={active}
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={handleReady}
        onCanPlay={handleReady}
      />
    </div>
  );
}

function HeroVideoCarousel({ variant = "editorial" }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [firstReady, setFirstReady] = useState(false);
  const isMobile = window.useIsMobile();
  const DURATION = 6500;

  // Carousel timer — only starts once the first video is decoded
  useEffect(() => {
    if (!firstReady) return;
    let start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION);
      setProgress(p);
      if (p >= 1) { start = t; setActive(a => (a + 1) % VIDEO_SLOTS.length); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [firstReady]);

  useEffect(() => {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    nav.classList.add("on-dark");
    const onScroll = () => {
      const rect = document.querySelector(".hero")?.getBoundingClientRect();
      if (!rect) return;
      if (rect.bottom < 80) nav.classList.remove("on-dark");
      else nav.classList.add("on-dark");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); nav.classList.remove("on-dark"); };
  }, []);

  const goTo = (i) => { setActive(i); setProgress(0); };

  return (
    <section className="hero hero-video editorial">
      <div className="hero-stage">
        {VIDEO_SLOTS.map((slot, i) => (
          <HeroSlide key={i} slot={slot} i={i} active={i === active} onReady={() => setFirstReady(true)} />
        ))}
        <div className="hero-veil" />
      </div>

      <div className="hero-overlay hero-layout-compact-left">
        <div className="hero-content hero-content-editorial">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            <span>Spring Edition · MMXXVI</span>
          </div>
          <h1 className="serif hero-headline">
            <span className="mask-reveal"><span>Worn for</span></span>
            <span className="mask-reveal" style={{ display: "block" }}><span>the <em>long</em> while.</span></span>
          </h1>
          <div className="hero-actions reveal" style={{ transitionDelay: "300ms" }}>
            <a href="shop.html" className="btn btn-light">New Arrivals <window.Icon.Arrow /></a>
            <a href="about.html" className="hero-link">About us <window.Icon.Arrow /></a>
          </div>
        </div>

        {!isMobile && (
          <div className="hero-rail">
            <div className="hero-rail-cap mono">{String(active+1).padStart(2,"0")} / {String(VIDEO_SLOTS.length).padStart(2,"0")}</div>
            <div className="hero-rail-list">
              {VIDEO_SLOTS.map((s, i) => (
                <button key={i} className={"hero-rail-item" + (i === active ? " active" : "")} onClick={() => goTo(i)}>
                  <span className="hero-rail-bar"><span className="hero-rail-fill" style={{ height: i === active ? `${progress*100}%` : i < active ? "100%" : "0%" }} /></span>
                  <span className="hero-rail-label">{s.caption}</span>
                </button>
              ))}
            </div>
            <div className="hero-rail-cap mono">Scroll ↓</div>
          </div>
        )}

        <div className="hero-foot">
          <span className="mono">{VIDEO_SLOTS[active].caption}</span>
          <span className="hero-foot-sep" />
          <span className="mono">37.97°N · 23.73°E ⟷ 35.01°N · 135.76°E</span>
        </div>
      </div>
    </section>
  );
}

// ─── Featured: editorial split, large numbered showcase ─────────────
function FeaturedSpotlight() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(0);
  useEffect(() => { window.ZendropAPI.listProducts({ featured: true }).then(p => setProducts(p.slice(0, 4))); }, []);
  if (products.length === 0) return null;
  const p = products[active];

  return (
    <section className="spotlight reveal">
      <div className="spotlight-inner">
        <div className="spotlight-rail">
          <div className="mono">N°001 — N°004</div>
          <div className="spotlight-rail-bar" />
          <div className="mono">Spring · Selected</div>
        </div>
        <div className="spotlight-grid">
          <div className="spotlight-img">
            {products.map((pr, i) => (
              <img key={pr.id} src={pr.images[0]} alt={pr.name}
                   className={i === active ? "active" : ""} />
            ))}
            <div className="spotlight-num mono">N°{String(active+1).padStart(3,"0")}</div>
          </div>
          <div className="spotlight-info">
            <div className="mono spotlight-cat">{p.category} · {p.material}</div>
            <h2 className="serif spotlight-name">{p.name}</h2>
            <p className="spotlight-desc">{p.description}</p>
            <div className="spotlight-meta">
              <div><span className="mono lbl">Origin</span><span>{p.origin}</span></div>
              <div><span className="mono lbl">Edition</span><span>{p.stock > 5 ? "In stock" : `${p.stock} remaining`}</span></div>
              <div><span className="mono lbl">Price</span><span>${p.price} {p.currency}</span></div>
            </div>
            <div className="spotlight-actions">
              <a href={`product.html?id=${p.id}`} className="btn">View piece <window.Icon.Arrow /></a>
              <a href="shop.html" className="hero-link" style={{ color: "var(--ink)", borderColor: "var(--hairline)" }}>The full collection <window.Icon.Arrow /></a>
            </div>
            <div className="spotlight-tabs">
              {products.map((pr, i) => (
                <button key={pr.id} className={"spotlight-tab" + (i === active ? " active" : "")} onClick={() => setActive(i)}>
                  <span className="num">N°{String(i+1).padStart(3,"0")}</span>
                  <span className="nm">{pr.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── New arrivals grid ─────────────────────────────────────────────
function NewArrivals() {
  const [products, setProducts] = useState([]);
  useEffect(() => { window.ZendropAPI.listProducts({ featured: true }).then(setProducts); }, []);
  return (
    <section className="container new-arrivals">
      <div className="section-head reveal">
        <div>
          <span className="sh-num">I · New Arrivals</span>
          <h2 className="serif">Quietly, <em>made.</em></h2>
        </div>
        <div className="sh-side">Twelve pieces this season, between Athens and Kyoto. Numbered, signed inside.</div>
      </div>
      <div className="featured-grid reveal-stagger">
        {products.map((p, i) => (
          <div key={p.id} className="featured-cell">
            <window.ProductCard product={p} num={i+1} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
        <a href="shop.html" className="btn btn-ghost">The full collection <window.Icon.Arrow /></a>
      </div>
    </section>
  );
}

// ─── Editorial diptych: house statement ─────────────────────────────
function HouseStatement() {
  return (
    <section className="house-stmt-elite">
      <div className="house-stmt-elite-img">
        <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=85" alt="" />
        <div className="house-num mono">II</div>
      </div>
      <div className="house-stmt-elite-body">
        <span className="sh-num reveal">II · The House</span>
        <h2 className="serif reveal">
          Made <em>slowly,</em><br/>
          between <em>two seas.</em>
        </h2>
        <div className="house-stmt-row">
          <div className="reveal">
            <div className="mono house-num-sm">01</div>
            <p>Twelve to twenty pieces a season — no more. Each numbered, each made by hand.</p>
          </div>
          <div className="reveal">
            <div className="mono house-num-sm">02</div>
            <p>Recycled gold and silver. Stones from sources we have visited.</p>
          </div>
          <div className="reveal">
            <div className="mono house-num-sm">03</div>
            <p>Repaired forever. Returned, polished, re-set — never finished.</p>
          </div>
        </div>
        <div className="reveal" style={{ marginTop: 48 }}>
          <a href="about.html" className="hero-link" style={{ color: "var(--ink)", borderColor: "var(--hairline)" }}>About us <window.Icon.Arrow /></a>
        </div>
      </div>
    </section>
  );
}

// ─── Materials feature ───────────────────────────────────────────────
function MaterialsBand() {
  const items = [
    { name: "Recycled Gold", origin: "Crete · Florence", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80" },
    { name: "Burmese Jade",  origin: "Mandalay",         img: "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?auto=format&fit=crop&w=900&q=80" },
    { name: "Linen & Silk",  origin: "Kyoto",            img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80" },
    { name: "River Silver",  origin: "Lisbon",           img: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80" },
  ];
  return (
    <section className="container" style={{ marginTop: 200 }}>
      <div className="section-head reveal">
        <div>
          <span className="sh-num">III · Materials</span>
          <h2 className="serif">Of <em>place,</em> not just<br/>provenance.</h2>
        </div>
        <div className="sh-side">Each metal and stone carries a place name — and most, a person's name too. We travel to source.</div>
      </div>
      <div className="materials-row reveal-stagger">
        {items.map((it, i) => (
          <div key={i} className="material-card">
            <div className="material-img"><img src={it.img} alt={it.name} /></div>
            <div className="material-num mono">N°{String(i+1).padStart(2,"0")}</div>
            <div className="material-name serif">{it.name}</div>
            <div className="material-origin mono">{it.origin}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Pull quote ────────────────────────────────────────────────────
function PullQuote() {
  return (
    <section className="pull-quote container">
      <div className="reveal">
        <span className="sh-num" style={{ display: "block", textAlign: "center", marginBottom: 28 }}>IV · A note</span>
        <p className="serif pq-text">
          Small enough to be<br/>
          <em>forgotten</em> on the body.<br/>
          Steady enough to outlast<br/>
          the season.
        </p>
        <div className="pq-attr mono">Eleni &amp; Mio · Founders</div>
      </div>
    </section>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────
function MarqueeStrip() {
  const words = ["Jade & Olive", "Athens", "Kyoto", "Lisbon", "Florence", "Mandalay", "Hand finished", "Numbered editions", "Repaired forever"];
  const track = [...words, ...words];
  return (
    <div className="marquee" style={{ marginTop: 200 }}>
      <div className="marquee-track">
        {track.map((w, i) => (
          <React.Fragment key={i}><span className="word">{w}</span><span className="marquee-dot" /></React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Lookbook ─────────────────────────────────────────────────────────
function LookbookGrid() {
  const imgs = [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1100&q=85",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85",
  ];
  return (
    <section className="container" style={{ marginTop: 200 }}>
      <div className="section-head reveal">
        <div>
          <span className="sh-num">V · The Lookbook</span>
          <h2 className="serif">Worn, <em>not</em> styled.</h2>
        </div>
        <div className="sh-side">Photographed by friends, on people who already wear the house. No stylists.</div>
      </div>
      <div className="lookbook-grid reveal-stagger">
        <div className="lb-1"><img src={imgs[0]} alt="" /></div>
        <div className="lb-2"><img src={imgs[1]} alt="" /></div>
        <div className="lb-3"><img src={imgs[2]} alt="" /></div>
        <div className="lb-4"><img src={imgs[3]} alt="" /></div>
      </div>
    </section>
  );
}

// ─── App ─────────────────────────────────────────────────────────────
function HomeApp() {
  window.useReveal();
  const [cartOpen, setCartOpen] = useState(false);


  return (
    <React.Fragment>
      <window.Nav current="home" onOpenCart={() => setCartOpen(true)} />
      <main>
        <HeroVideoCarousel />
        <NewArrivals />
        <HouseStatement />
        <MaterialsBand />
        <PullQuote />
        <LookbookGrid />
        <MarqueeStrip />
      </main>
      <window.Footer />
      <window.CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<HomeApp />);
