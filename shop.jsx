/* global React, ReactDOM */
const { useState, useEffect } = React;

const CATS = [
  { slug: "all",       label: "Everything"  },
  { slug: "rings",     label: "Rings"       },
  { slug: "necklaces", label: "Necklaces"   },
  { slug: "earrings",  label: "Earrings"    },
  { slug: "bracelets", label: "Bracelets"   },
];

// ─── Single product card ────────────────────────────────────────
function CollectionItem({ p, index, featured }) {
  return (
    <a href={`product.html?id=${p.id}`} className={`ci${featured ? " ci-feat" : ""}`}>
      <div className="ci-frame">
        <img
          src={p.images?.[0]}
          alt={p.name}
          loading={index < 6 ? "eager" : "lazy"}
        />
        <div className="ci-overlay">
          <span className="ci-cta">View piece <window.Icon.Arrow size={11} /></span>
        </div>
        <div className="ci-num-tag">N°{String(index + 1).padStart(2, "0")}</div>
      </div>
      <div className="ci-meta">
        <div className="ci-meta-top">
          <span className="ci-name">{p.name}</span>
          {p.price && <span className="ci-price">€ {p.price}</span>}
        </div>
        {p.category && <span className="ci-cat">{p.category}</span>}
      </div>
    </a>
  );
}

// ─── Skeleton card ──────────────────────────────────────────────
function Skeleton({ featured }) {
  return <div className={`ci-skel${featured ? " ci-skel-feat" : ""}`} />;
}

// ─── App ────────────────────────────────────────────────────────
function CollectionApp() {
  window.useReveal();
  const [cat, setCat]       = useState(() => new URLSearchParams(location.search).get("cat") || "all");
  const [sort, setSort]     = useState("default");
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
          <div className="ch-inner">
            <div className="ch-left">
              <div className="ch-eyebrow">Maison · MMXXVI · Athens &amp; Kyoto</div>
              <h1 className="ch-title">The <em>Collection</em></h1>
            </div>
            <div className="ch-right">
              <span className="ch-count">
                {displayed ? `${String(displayed.length).padStart(2, "0")} pieces` : ""}
              </span>
              <span className="ch-sub">38.72°N · 9.13°W<br/>35.01°N · 135.76°E</span>
            </div>
          </div>
        </header>

        {/* ── Sticky filter / sort bar ── */}
        <div className="cf-bar">
          <div className="cf-bar-inner">
            <nav className="cf-cats" aria-label="Filter by category">
              {CATS.map((c, i) => (
                <button
                  key={c.slug}
                  className={cat === c.slug ? "active" : ""}
                  onClick={() => setCat(c.slug)}
                >
                  {i > 0 && <span className="cf-num">{String(i).padStart(2, "0")}</span>}
                  <span className="cf-label">{c.label}</span>
                </button>
              ))}
            </nav>
            <label className="cf-sort">
              <span>Sort</span>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="default">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
              </select>
            </label>
          </div>
        </div>

        {/* ── Product grid ── */}
        <section className="cg">
          {displayed === null
            ? Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} featured={i === 0} />)
            : displayed.length === 0
              ? <p className="cg-empty"><em>Nothing here just yet.</em></p>
              : displayed.map((p, i) => (
                  <CollectionItem
                    key={p.id}
                    p={p}
                    index={i}
                    featured={i === 0 && cat === "all"}
                  />
                ))
          }
        </section>

        {/* ── Closing mark ── */}
        <div className="cc">
          <div className="cc-stem" />
          <div className="cc-body">
            <div className="cc-mark">Jade<em>&amp; Olive</em></div>
            <p className="cc-promise">
              Every piece is <em>numbered,</em> signed inside,<br />
              and <em>repaired forever</em> — sent back to the<br />
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
