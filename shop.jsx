/* global React, ReactDOM */
const { useState, useEffect } = React;

const CATS = [
  { slug: "all",       label: "All"       },
  { slug: "rings",     label: "Rings"     },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "earrings",  label: "Earrings"  },
  { slug: "bracelets", label: "Bracelets" },
];

// ─── Product card ───────────────────────────────────────────────
function ProductItem({ p, index }) {
  return (
    <a href={`product.html?id=${p.id}`} className="ci">
      <div className="ci-img">
        <img
          src={p.images?.[0]}
          alt={p.name}
          loading={index < 8 ? "eager" : "lazy"}
        />
        {p.images?.[1] && (
          <img className="ci-img-alt" src={p.images[1]} alt="" aria-hidden="true" />
        )}
      </div>
      <div className="ci-info">
        {p.category && <span className="ci-cat">{p.category}</span>}
        <div className="ci-row">
          <span className="ci-name">{p.name}</span>
          {p.price && <span className="ci-price">€{p.price}</span>}
        </div>
      </div>
    </a>
  );
}

// ─── App ────────────────────────────────────────────────────────
function CollectionApp() {
  window.useReveal();
  const [cat, setCat]   = useState(() => new URLSearchParams(location.search).get("cat") || "all");
  const [sort, setSort] = useState("default");
  const [products, setProducts] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setProducts(null);
    window.ZendropAPI.listProducts({ category: cat === "all" ? undefined : cat }).then(setProducts);
  }, [cat]);

  const displayed = products
    ? [...products].sort((a, b) => {
        if (sort === "price-asc")  return (a.price || 0) - (b.price || 0);
        if (sort === "price-desc") return (b.price || 0) - (a.price || 0);
        return 0;
      })
    : null;

  return (
    <React.Fragment>
      <window.Nav current="shop" onOpenCart={() => setCartOpen(true)} />
      <main>

        {/* ── Page header ── */}
        <header className="ch">
          <div className="ch-banner"><img src="images/collection-banner.png" alt="" /></div>
          <div className="ch-inner">
            <h1 className="ch-title">The <em>Collection</em></h1>
          </div>
        </header>

        {/* ── Filter / sort bar ── */}
        <div className="cf-bar">
          <div className="cf-bar-inner">
            <nav className="cf-cats" aria-label="Filter by category">
              {CATS.map(c => (
                <button
                  key={c.slug}
                  className={cat === c.slug ? "active" : ""}
                  onClick={() => setCat(c.slug)}
                >
                  {c.label}
                </button>
              ))}
            </nav>
            <label className="cf-sort">
              <span className="cf-sort-label">Sort by</span>
              <div className="cf-sort-wrap">
                <select value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </label>
          </div>
        </div>

        {/* ── Grid ── */}
        <section className="cg">
          {displayed === null
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="ci-skel" />)
            : displayed.length === 0
              ? <p className="cg-empty"><em>Nothing here just yet.</em></p>
              : displayed.map((p, i) => <ProductItem key={p.id} p={p} index={i} />)
          }
        </section>

        {/* ── Closing ── */}
        <div className="cc">
          <div className="cc-stem" />
          <div className="cc-body">
            <div className="cc-mark">Jade<em>&amp; Olive</em></div>
            <p className="cc-promise">
              Every piece is <em>numbered,</em> signed inside,<br />
              and <em>repaired forever</em> — returned to the<br />
              hand that made it, for as long as it is worn.
            </p>
            <a href="about.html" className="btn-sand">The House <window.Icon.Arrow /></a>
          </div>
          <div className="cc-stem" />
        </div>

      </main>
      <window.Footer />
      <window.CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CollectionApp />);
