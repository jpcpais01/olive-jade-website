/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

const SORT_OPTIONS = [
  { value: "default",    label: "Featured"        },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SORT_OPTIONS.find(o => o.value === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="cf-sort-custom" ref={ref}>
      <button className="cf-sort-btn" onClick={() => setOpen(o => !o)}>
        <span className="cf-sort-label">Sort</span>
        <span className="cf-sort-value">{current.label}</span>
        <svg className={"cf-sort-chevron" + (open ? " open" : "")} width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div className="cf-sort-menu">
          {SORT_OPTIONS.map(o => (
            <button
              key={o.value}
              className={"cf-sort-opt" + (o.value === value ? " active" : "")}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const CATS = [
  { slug: "all",       label: "All"       },
  { slug: "rings",     label: "Rings"     },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "earrings",  label: "Earrings"  },
  { slug: "bracelets", label: "Bracelets" },
];

const CAT_META = {
  all:       { title: "The", em: "Collection", sub: "All pieces, all seasons",   img: "images/collection-banner.png" },
  rings:     { title: "",    em: "Rings",       sub: "Worn on the hand",          img: "images/cat-rings.png"         },
  necklaces: { title: "",    em: "Necklaces",   sub: "Close to the skin",         img: "images/cat-necklaces.png"     },
  earrings:  { title: "",    em: "Earrings",    sub: "Light and considered",      img: "images/cat-earrings.png"      },
  bracelets: { title: "",    em: "Bracelets",   sub: "Worn with ease",            img: "images/cat-bracelets.png"     },
};

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

  const meta = CAT_META[cat] || CAT_META.all;

  return (
    <React.Fragment>
      <window.Nav current="shop" onOpenCart={() => setCartOpen(true)} />
      <main>

        {/* ── Cinematic hero header ── */}
        <header className="ch">
          <div className="ch-hero">
            <img src={meta.img} alt="" className="ch-hero-img" />
            <div className="ch-hero-veil" />
            <div className="ch-hero-fade" />
            <div className="ch-hero-content">
              <div className="ch-hero-inner">
                <p className="ch-hero-sub">{meta.sub}</p>
                <h1 className="ch-title">
                  {meta.title && <span>{meta.title} </span>}
                  <em>{meta.em}</em>
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* ── Sort bar ── */}
        <div className="cf-bar">
          <div className="cf-bar-inner cf-bar-inner--sort">
            {displayed && <span className="cf-count">{String(displayed.length).padStart(2,"0")} pieces</span>}
            <SortDropdown value={sort} onChange={setSort} />
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
