/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

const TIMELINE = [
  { yr: "MMXXII", place: "Naoshima, Japan",      text: "Eleni and Mio meet at a craft residency. The first letters begin in November — about light, about cloth." },
  { yr: "MMXXIII", place: "First drop",           text: "Six pieces, made between Eleni's family kitchen and Mio's grandfather's workshop. Sold to friends, mostly." },
  { yr: "MMXXIV", place: "Athens atelier opens",  text: "A studio above a bakery in Plaka. Two benches, three apprentices, one cat called Olea." },
  { yr: "MMXXVI", place: "Spring Edition",        text: "Twelve new pieces — the largest collection so far, and the first to travel by train rather than plane." },
];

const ATELIERS = [
  { city: "Athens",  role: "Stone-setting · Rings · Silver",  coord: "37.9755°N · 23.7348°E", body: "Three flights above a bakery in Plaka. Most necklaces and rings begin here, where the smell of bread and hot metal are indistinguishable by noon.", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85" },
  { city: "Kyoto",   role: "Knotwork · Linen · Pearl setting", coord: "35.0116°N · 135.7681°E", body: "A two-bench workshop near the Kamo river. Quiet, precise, unhurried. Mio's bench faces north, toward the water.", img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85" },
  { city: "Lisbon",  role: "River silver · Hand finishing",    coord: "38.7223°N · 9.1393°W",  body: "A trusted partner workshop along the Tagus, where our river-tumbled silver is hand-finished before it travels.", img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=85" },
];

// ─── App ─────────────────────────────────────────────────���───────
function AboutApp() {
  window.useReveal();
  const [cartOpen, setCartOpen] = useState(false);
  const heroRef = useRef(null);

  // Nav white while dark hero is in view
  useEffect(() => {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    nav.classList.add("on-dark");
    const check = () => {
      const r = heroRef.current?.getBoundingClientRect();
      if (!r) return;
      r.bottom < 80 ? nav.classList.remove("on-dark") : nav.classList.add("on-dark");
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => { window.removeEventListener("scroll", check); nav.classList.remove("on-dark"); };
  }, []);

  return (
    <React.Fragment>
      <window.Nav current="story" onOpenCart={() => setCartOpen(true)} />
      <main>

        {/* ══ I · HERO ═══════════════════════════════��══════════════ */}
        <section className="ab-hero" ref={heroRef}>
          <div className="ab-hero-bg">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=85" alt="" />
            <div className="ab-hero-veil" />
          </div>
          <div className="ab-hero-body">
            <p className="ab-eyebrow">About the house · Est. MMXXII</p>
            <h1 className="ab-hero-title">
              A house<br/>between<br/><em>two seas.</em>
            </h1>
            <p className="ab-hero-lede">
              Jade &amp; Olive began as a correspondence between Eleni, in Athens, and Mio, in Kyoto — about light, about cloth, about the way their grandmothers polished silver. The pieces came later.
            </p>
          </div>
          <div className="ab-hero-foot">
            <span>Athens · 37.98°N · 23.73°E</span>
            <span className="ab-hero-foot-rule" />
            <span>Kyoto · 35.01°N · 135.76°E</span>
          </div>
        </section>

        {/* ══ II · PULL QUOTE ═══════════════════════════════════════ */}
        <section className="ab-pull reveal">
          <div className="ab-pull-inner">
            <blockquote className="ab-pull-text">
              "Small enough to be forgotten<br/>on the body. <em>Steady enough<br/>to outlast the season.</em>"
            </blockquote>
            <div className="ab-pull-attr">— Eleni &amp; Mio, MMXXII</div>
          </div>
        </section>

        {/* ══ III · FOUNDERS ════════════════════════════════════════ */}
        <section className="ab-founders">
          <div className="ab-founders-label reveal">
            <span className="ab-section-num">I</span>
            <span className="ab-section-title">The two behind the house</span>
          </div>

          <div className="ab-founder reveal">
            <div className="ab-founder-img">
              <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85" alt="Athens atelier" loading="lazy" />
            </div>
            <div className="ab-founder-text">
              <div className="ab-founder-ident">
                <span className="ab-founder-name">Eleni</span>
                <span className="ab-founder-place">Athens, Greece</span>
              </div>
              <p>Trained as a silversmith in Thessaloniki, Eleni had been making jewellery for friends for six years before Jade &amp; Olive. She runs the Athens atelier from a room above a bakery in Plaka, where the smell of bread and hot metal are indistinguishable by noon.</p>
              <p>She is responsible for most of the stone-setting, and all of the rings.</p>
            </div>
          </div>

          <div className="ab-founder ab-founder--flip reveal">
            <div className="ab-founder-img">
              <img src="https://images.unsplash.com/photo-1545569310-1f9e0f95b6da?auto=format&fit=crop&w=900&q=85" alt="Kyoto atelier" loading="lazy" />
            </div>
            <div className="ab-founder-text">
              <div className="ab-founder-ident">
                <span className="ab-founder-name">Mio</span>
                <span className="ab-founder-place">Kyoto, Japan</span>
              </div>
              <p>Mio learned textile dyeing from her grandmother and metalwork from a retired shipbuilder near the Kamo river. Her work carries a different quiet — the precision of something that has been considered for a long time before it is made.</p>
              <p>She handles knotwork, linen, and all pieces that pass through water.</p>
            </div>
          </div>
        </section>

        {/* ══ IV · PHILOSOPHY (dark band) ═══════════════════════════ */}
        <section className="ab-phil">
          <div className="ab-phil-inner">
            <div className="ab-phil-stats reveal">
              {[
                { n: "XII–XX", l: "Pieces per season" },
                { n: "II",     l: "Ateliers"          },
                { n: "∞",      l: "Repaired, always"  },
                { n: "0",      l: "Pieces ever rushed" },
              ].map(s => (
                <div key={s.l} className="ab-stat">
                  <div className="ab-stat-n">{s.n}</div>
                  <div className="ab-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="ab-phil-divider" />
            <div className="ab-phil-body reveal">
              <div className="ab-phil-left">
                <span className="ab-section-num ab-section-num--light">II</span>
                <h2 className="ab-phil-title">A <em>slow</em> house.</h2>
              </div>
              <div className="ab-phil-right">
                <p>Nothing is rushed. A pendant might pass through six pairs of hands before it is sent. We use recycled metals where we can, and stones from sources we have visited.</p>
                <p>If a piece is sold out, we wait until the next season to remake it. We would rather you wait than that we hurry.</p>
                <p>Every piece is numbered, signed inside, and repaired forever — returned to the hand that made it, at no cost, for as long as it is worn.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ V · TIMELINE ══════════════════════════════════════════ */}
        <section className="ab-timeline reveal">
          <div className="ab-timeline-inner">
            <div className="ab-timeline-head">
              <span className="ab-section-num">III</span>
              <span className="ab-section-title">A short history</span>
            </div>
            <div className="ab-tl-list">
              {TIMELINE.map((e, i) => (
                <div key={e.yr} className="ab-tl-item">
                  <div className="ab-tl-num">N°{String(i+1).padStart(2,"0")}</div>
                  <div className="ab-tl-yr">{e.yr}</div>
                  <div className="ab-tl-place">{e.place}</div>
                  <p className="ab-tl-text">{e.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ VI · ATELIERS ═════════════════════════════════════════ */}
        <section className="ab-ateliers">
          <div className="ab-ateliers-head reveal">
            <span className="ab-section-num">IV</span>
            <h2 className="ab-ateliers-title">Three <em>places.</em></h2>
          </div>
          <div className="ab-atelier-grid">
            {ATELIERS.map(a => (
              <div key={a.city} className="ab-atelier reveal">
                <div className="ab-atelier-img">
                  <img src={a.img} alt={a.city} loading="lazy" />
                  <div className="ab-atelier-overlay">
                    <span className="ab-atelier-city">{a.city}</span>
                    <span className="ab-atelier-coord">{a.coord}</span>
                  </div>
                </div>
                <div className="ab-atelier-meta">
                  <span className="ab-atelier-role">{a.role}</span>
                  <p className="ab-atelier-body">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ VII · CLOSING ═════════════════════════════════════════ */}
        <section className="ab-closing reveal">
          <div className="ab-closing-inner">
            <p className="ab-closing-quote">
              The pieces came later.<br/><em>They still come slowly.</em>
            </p>
            <div className="ab-signs">
              <div className="ab-sign">
                <span className="ab-sign-name">Eleni</span>
                <span className="ab-sign-city">Athens</span>
              </div>
              <span className="ab-sign-amp">&amp;</span>
              <div className="ab-sign">
                <span className="ab-sign-name">Mio</span>
                <span className="ab-sign-city">Kyoto</span>
              </div>
            </div>
            <a href="shop.html" className="btn-sand">The Collection <window.Icon.Arrow /></a>
          </div>
        </section>

      </main>
      <window.Footer />
      <window.CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AboutApp />);
