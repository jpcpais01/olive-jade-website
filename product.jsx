/* global React, ReactDOM */
const { useState, useEffect } = React;

function ProductPage() {
  window.useReveal();
  const [cartOpen, setCartOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id") || "jo-001";
    window.ZendropAPI.getProduct(id).then(p => {
      setProduct(p);
      if (p) window.ZendropAPI.listProducts({ category: p.category }).then(list => {
        setRelated(list.filter(x => x.id !== p.id).slice(0, 3));
      });
    });
  }, []);

  if (!product) return (
    <React.Fragment>
      <window.Nav onOpenCart={() => setCartOpen(true)} />
      <div style={{ padding: "260px 0", textAlign: "center", color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" }}>Loading…</div>
    </React.Fragment>
  );

  const onAdd = () => {
    window.ZendropAPI.addToCart(product.id, qty);
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  const num = `N°${product.id.split("-")[1]}`;

  return (
    <React.Fragment>
      <window.Nav onOpenCart={() => setCartOpen(true)} />
      <main>
        <section className="pdp">
          <div className="pdp-crumb">
            <a href="index.html">Maison</a> &nbsp;·&nbsp; <a href="shop.html">Collection</a> &nbsp;·&nbsp; <a href={`shop.html?cat=${product.category}`}>{product.category}</a> &nbsp;·&nbsp; <span style={{ color: "var(--ink)" }}>{product.name}</span>
          </div>
          <div className="pdp-grid">
            <div className="pdp-images reveal-stagger">
              {product.images.map((src, i) => (
                <div key={i} className="pdp-img">
                  <img src={src} alt={product.name} />
                  <div className="pdp-img-num mono">{num}/{String(i+1).padStart(2,"0")}</div>
                </div>
              ))}
            </div>
            <div className="pdp-info">
              <div className="pdp-rail reveal">
                <span className="mono">{num}</span>
                <span className="pdp-rail-bar" />
                <span className="mono">{product.category}</span>
              </div>
              <h1 className="serif pdp-name reveal">{product.name}</h1>
              <div className="pdp-price reveal">${product.price} <span style={{ color: "var(--muted)" }}>{product.currency}</span></div>
              <p className="pdp-desc reveal">{product.description}</p>
              <div className="pdp-meta-row reveal">
                <div><span className="m-k">Material</span><span className="m-v">{product.material}</span></div>
                <div><span className="m-k">Origin</span><span className="m-v">{product.origin}</span></div>
                <div><span className="m-k">Edition</span><span className="m-v">{product.stock > 5 ? "In stock" : product.stock > 0 ? `${product.stock} remaining` : "Made to order"}</span></div>
              </div>
              <div className="pdp-add reveal">
                <div className="qty-pick">
                  <button onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                  <span>{String(qty).padStart(2,"0")}</span>
                  <button onClick={() => setQty(q => q+1)}>+</button>
                </div>
                <button className="btn btn-fill" onClick={onAdd}>Add to Bag <window.Icon.Arrow /></button>
              </div>
              <div className="pdp-details reveal">
                <h4>Details</h4>
                <ul>{product.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
              <div className="pdp-care reveal">
                <h4>House Care</h4>
                <p>Polished and re-set, freely, for the lifetime of the wearer. Returns are accepted within thirty days; repairs, indefinitely.</p>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="pdp-related">
              <div className="section-head reveal">
                <div>
                  <span className="sh-num">Adjacent pieces</span>
                  <h2 className="serif">From the same <em>family.</em></h2>
                </div>
              </div>
              <div className="featured-grid reveal-stagger">
                {related.map((p, i) => <window.ProductCard key={p.id} product={p} num={i+1} />)}
              </div>
            </div>
          )}
        </section>
      </main>
      <window.Footer />
      <window.CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <window.JoTweaks defaults={{ palette: "sage-ivory", heroVariant: "editorial" }} showHero={false} />
      <div className={"pdp-toast" + (toast ? " show" : "")}>Added to bag · {product.name}</div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProductPage />);
