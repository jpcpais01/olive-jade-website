/* global React, ReactDOM */
const { useState } = React;

function AboutApp() {
  window.useReveal();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <React.Fragment>
      <window.Nav current="story" onOpenCart={() => setCartOpen(true)} />
      <main>
        <window.InteriorHero
          num="II / III"
          kicker="The House · Est. MMXXII"
          title={<>
            <span className="mask-reveal"><span>A house</span></span>
            <span className="mask-reveal" style={{ display: "block" }}><span>between <em>two</em></span></span>
            <span className="mask-reveal" style={{ display: "block" }}><span>seas.</span></span>
          </>}
          lede="Jade & Olive began as a correspondence between Eleni, in Athens, and Mio, in Kyoto — about light, about cloth, about the way their grandmothers polished silver. The pieces came later."
          posterImg="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=85"
        />

        <section className="about-twocol">
          <div>
            <span className="sh-num reveal">I · The way we make</span>
            <h2 className="serif reveal">A <em>slow</em> house.</h2>
            <div className="reveal" style={{ marginTop: 32 }}>
              <p>Twelve to twenty pieces a season. Most are produced in our two ateliers, in Athens and Kyoto, with smaller batches finished by trusted partners in Lisbon, Florence, and Bangkok.</p>
              <p>Nothing is rushed. A pendant might pass through six pairs of hands before it is sent. We use recycled metals where we can, and stones from sources we have visited.</p>
              <p>If a piece is sold out, we wait until the next season to remake it. We would rather you wait than that we hurry.</p>
            </div>
          </div>
          <div className="col-image reveal">
            <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80" alt="" />
          </div>
        </section>

        <section className="timeline">
          <div className="section-head reveal">
            <div>
              <span className="sh-num">II · A short timeline</span>
              <h2 className="serif">How we <em>began.</em></h2>
            </div>
          </div>
          <div className="timeline-list reveal-stagger">
            <div className="timeline-item">
              <div className="yr">MMXXII</div>
              <div className="place">Athens · Kyoto</div>
              <p>Eleni and Mio meet at a craft residency in Naoshima. The first letters begin in November.</p>
            </div>
            <div className="timeline-item">
              <div className="yr">MMXXIII</div>
              <div className="place">First Drop</div>
              <p>Six pieces, made between Eleni's family kitchen and Mio's grandfather's workshop. Sold to friends, mostly.</p>
            </div>
            <div className="timeline-item">
              <div className="yr">MMXXIV</div>
              <div className="place">First Atelier</div>
              <p>A studio opens above a bakery in Plaka. Two benches, three apprentices, one cat called Olea.</p>
            </div>
            <div className="timeline-item">
              <div className="yr">MMXXVI</div>
              <div className="place">Spring Edition</div>
              <p>Twelve new pieces — the largest collection so far, and the first to travel by train rather than plane.</p>
            </div>
          </div>
        </section>

        <section className="atelier">
          {[
            { city: "Athens", body: "Our home atelier, three flights above a bakery in Plaka. Most necklaces and rings begin here.", coord: "37.9755° N · 23.7348° E", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80" },
            { city: "Kyoto", body: "A two-bench workshop near the Kamo river. Knot-work, pearl setting, and our linen pieces are finished here.", coord: "35.0116° N · 135.7681° E", img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80" },
            { city: "Lisbon", body: "A trusted partner workshop along the Tagus, where our river-tumbled silver is hand-finished.", coord: "38.7223° N · 9.1393° W", img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80" },
          ].map((a, i) => (
            <div key={a.city} className="atelier-card reveal">
              <div className="img"><img src={a.img} alt={a.city} /><div className="atelier-num mono">N°{String(i+1).padStart(2,"0")}</div></div>
              <div className="city serif">{a.city}</div>
              <div className="body">{a.body}</div>
              <div className="coord">{a.coord}</div>
            </div>
          ))}
        </section>

        <section className="signature">
          <div className="reveal">
            <p className="quote">"Small enough to be <em>forgotten</em> on the body. Steady enough to outlast the season."</p>
            <div className="signs">
              <div className="sign">Eleni<small>Athens</small></div>
              <div className="sign">Mio<small>Kyoto</small></div>
            </div>
          </div>
        </section>
      </main>
      <window.Footer />
      <window.CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <window.JoTweaks defaults={{ palette: "sage-ivory", heroVariant: "editorial" }} showHero={false} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AboutApp />);
