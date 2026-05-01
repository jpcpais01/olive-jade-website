/* global React, ReactDOM */
const { useState, useEffect } = React;

function ShopApp() {
  window.useReveal();
  const [cartOpen, setCartOpen] = useState(false);
  const [cat, setCat] = useState(() => new URLSearchParams(location.search).get("cat") || "all");
  const [products, setProducts] = useState(null);
  const [cats, setCats] = useState([]);

  useEffect(() => { window.ZendropAPI.listCategories().then(setCats); }, []);
  useEffect(() => {
    setProducts(null);
    window.ZendropAPI.listProducts({ category: cat }).then(setProducts);
  }, [cat]);

  return (
    <React.Fragment>
      <window.Nav current="shop" onOpenCart={() => setCartOpen(true)} />
      <main>
        <window.InteriorHero
          num="I / III"
          kicker="The Collection · Spring MMXXVI"
          title={<>
            <span className="mask-reveal"><span>The full</span></span>
            <span className="mask-reveal" style={{ display: "block" }}><span><em>collection.</em></span></span>
          </>}
          lede="Eight pieces from the spring drop. Each numbered, each made by hand between Athens and Kyoto. When a piece is gone, it returns the following season — never the same."
          posterImg="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1800&q=85"
        />

        <div className="col-bar">
          <div className="col-bar-inner">
            <div className="col-cats">
              {cats.map((c, i) => (
                <button key={c.slug} className={cat === c.slug ? "active" : ""} onClick={() => setCat(c.slug)}>
                  <span className="mono col-cat-num">{String(i + 1).padStart(2,"0")}</span>
                  <span className="col-cat-label">{c.name}</span>
                </button>
              ))}
            </div>
            <div className="col-count mono">{products ? `${String(products.length).padStart(2,"0")} pieces · Spring · MMXXVI` : "Loading…"}</div>
          </div>
        </div>

        <section className="col-grid container reveal-stagger">
          {products === null
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="col-skeleton" />)
            : products.length === 0
              ? <div style={{ gridColumn: "1 / -1", padding: 80, textAlign: "center", color: "var(--muted)", fontFamily: "var(--serif)", fontSize: 28, fontStyle: "italic" }}>Nothing here just yet.</div>
              : products.map((p, i) => <window.ProductCard key={p.id} product={p} num={i+1} />)
          }
        </section>

        <section className="col-care reveal">
          <div className="col-care-inner">
            <span className="sh-num">A note on the house</span>
            <p className="serif col-care-text">
              Every piece is <em>numbered,</em> signed inside,<br/>
              and <em>repaired forever</em> — sent back to the<br/>
              hand that made it, for as long as it is worn.
            </p>
            <div style={{ marginTop: 48, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="about.html" className="btn btn-ghost">About us <window.Icon.Arrow /></a>
              <a href="#" className="hero-link" style={{ color: "var(--ink)", borderColor: "var(--hairline)" }}>Care &amp; repair <window.Icon.Arrow /></a>
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

ReactDOM.createRoot(document.getElementById("root")).render(<ShopApp />);
