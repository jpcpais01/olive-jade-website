/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ---- Hooks ----------------------------------------------------------
function useScrolled(threshold = 30) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useReveal() {
  // attaches IntersectionObserver to all .reveal / .reveal-stagger / .mask-reveal elements
  useEffect(() => {
    if (window.matchMedia("(max-width: 880px)").matches) {
      // mobile: skip animation, just show
      document.querySelectorAll(".reveal, .reveal-stagger, .mask-reveal").forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal, .reveal-stagger, .mask-reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function useCart() {
  const [items, setItems] = useState(() => window.ZendropAPI.getCart());
  useEffect(() => {
    const onChange = (e) => setItems(e.detail);
    window.addEventListener("jo:cart-changed", onChange);
    return () => window.removeEventListener("jo:cart-changed", onChange);
  }, []);
  return items;
}

function useIsMobile(bp = 880) {
  const [m, setM] = useState(() => window.matchMedia(`(max-width: ${bp}px)`).matches);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp}px)`);
    const onChange = () => setM(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [bp]);
  return m;
}

// ---- Icons ----------------------------------------------------------
const Icon = {
  Arrow: ({ size = 14 }) => (
    <svg className="arrow" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Bag: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M5 7h14l-1 13H6L5 7zM9 7V5a3 3 0 016 0v2" />
    </svg>
  ),
  Search: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>
    </svg>
  ),
  Close: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
};

// ---- Logo / wordmark -------------------------------------------------
function Wordmark({ size = 22 }) {
  return (
    <span className="nav-logo" style={{ fontSize: size }}>
      Jade <em>&amp;</em> Olive
    </span>
  );
}

// stylized wordmark — used for splash/empty states
function WordmarkLarge() {
  return (
    <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(80px, 12vw, 200px)", lineHeight: 0.9, letterSpacing: "-0.025em" }}>
      Jade<br/><em style={{ fontStyle: "italic", color: "var(--jade)" }}>&amp; Olive</em>
    </div>
  );
}

// ---- Nav ------------------------------------------------------------
function Nav({ current = "home", onNav, onOpenCart }) {
  const scrolled = useScrolled(30);
  const cart = useCart();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "shop", label: "Collection", href: "shop.html" },
    { id: "story", label: "About us", href: "about.html" },
  ];

  const handleNav = (e, link) => {
    if (onNav) {
      e.preventDefault();
      onNav(link);
    }
    setMobileOpen(false);
  };

  return (
    <React.Fragment>
      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <a href="index.html" onClick={(e) => handleNav(e, links[0])}><Wordmark /></a>
        <div className="nav-links">
          {links.map(l => (
            <a key={l.id} href={l.href} className={current === l.id ? "active" : ""} onClick={(e) => handleNav(e, l)}>{l.label}</a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="cart" onClick={onOpenCart} aria-label="Open bag">
            <Icon.Bag />
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em" }}>BAG</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>
      <div className={"mobile-panel" + (mobileOpen ? " open" : "")}>
        <button className="close" onClick={() => setMobileOpen(false)}>Close</button>
        {links.map(l => (
          <a key={l.id} href={l.href} onClick={(e) => handleNav(e, l)}>{l.label}</a>
        ))}
      </div>
    </React.Fragment>
  );
}

// ---- Footer ---------------------------------------------------------
function Footer() {
  return (
    <footer className="footer">

      {/* ── Brand band ── */}
      <div className="footer-brand">
        <div className="footer-mark">
          <span>Jade</span>
          <em>&amp; Olive</em>
        </div>
        <div className="footer-brand-right">
          <div className="footer-coords">
            <span>Athens · 37.98°N · 23.73°E</span>
            <span className="footer-coords-sep">⟷</span>
            <span>Kyoto · 35.01°N · 135.76°E</span>
          </div>
          <p className="footer-tag">A quiet house. Made between two seas in numbered editions — worn for the long while.</p>
        </div>
      </div>

      <div className="footer-rule" />

      {/* ── Nav grid ── */}
      <div className="footer-nav">

        <div className="footer-col">
          <h4 className="footer-col-hd">Collections</h4>
          <ul>
            <li><a href="shop.html">Shop All</a></li>
            <li><a href="shop.html?cat=necklaces">Necklaces</a></li>
            <li><a href="shop.html?cat=earrings">Earrings</a></li>
            <li><a href="shop.html?cat=rings">Rings</a></li>
            <li><a href="shop.html?cat=bracelets">Bracelets</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-hd">The House</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="about.html">Our Story</a></li>
            <li><a href="about.html">The Ateliers</a></li>
          </ul>
        </div>

        <div className="footer-col footer-col-news">
          <h4 className="footer-col-hd">Correspondence</h4>
          <p className="footer-news-body">A letter, four times a year. New pieces, where they came from, and how they were made.</p>
          <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Your email address" type="email" required />
            <button type="submit" aria-label="Subscribe"><Icon.Arrow /></button>
          </form>
          <div className="footer-socials">
            <a href="#">Instagram</a>
            <span className="footer-soc-sep">·</span>
            <a href="#">Pinterest</a>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <span>© MMXXVI · Maison Jade &amp; Olive</span>
        <div className="footer-cities">
          <span>Athens</span><span className="footer-city-dot"/>
          <span>Kyoto</span><span className="footer-city-dot"/>
          <span>Lisbon</span><span className="footer-city-dot"/>
          <span>Florence</span>
        </div>
        <span>Quietly made.</span>
      </div>

    </footer>
  );
}

// ---- Cart drawer ----------------------------------------------------
function CartDrawer({ open, onClose }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (!open) return;
    window.ZendropAPI.getCartWithProducts().then(setRows);
  }, [open]);
  useEffect(() => {
    const refresh = () => window.ZendropAPI.getCartWithProducts().then(setRows);
    window.addEventListener("jo:cart-changed", refresh);
    return () => window.removeEventListener("jo:cart-changed", refresh);
  }, []);

  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);

  return (
    <React.Fragment>
      <div className={"drawer-backdrop" + (open ? " open" : "")} onClick={onClose} />
      <aside className={"drawer" + (open ? " open" : "")}>
        <div className="drawer-head">
          <h3 className="serif">Your Bag</h3>
          <button onClick={onClose} aria-label="Close"><Icon.Close /></button>
        </div>
        <div className="drawer-body">
          {rows.length === 0 ? (
            <div className="empty">Your bag is quiet.</div>
          ) : rows.map(r => (
            <div className="cart-row" key={r.productId}>
              <img src={r.product.images[0]} alt={r.product.name} />
              <div>
                <div className="name">{r.product.name}</div>
                <div className="meta">{r.product.material}</div>
                <div className="qty">
                  <button onClick={() => window.ZendropAPI.updateQty(r.productId, r.qty - 1)}>−</button>
                  <span>{r.qty}</span>
                  <button onClick={() => window.ZendropAPI.updateQty(r.productId, r.qty + 1)}>+</button>
                  <button style={{ marginLeft: 12, textTransform: "uppercase", letterSpacing: "0.1em", border: "none" }} onClick={() => window.ZendropAPI.removeFromCart(r.productId)}>Remove</button>
                </div>
              </div>
              <div className="price">${r.product.price * r.qty}</div>
            </div>
          ))}
        </div>
        <div className="drawer-foot">
          <div className="totals">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <button className="btn btn-fill" style={{ width: "100%", justifyContent: "center" }} disabled={rows.length === 0} onClick={async () => {
            const order = await window.ZendropAPI.createOrder({ items: rows.map(r => ({ productId: r.productId, qty: r.qty })) });
            alert("Order placed (demo): " + order.id);
          }}>
            Checkout <Icon.Arrow />
          </button>
        </div>
      </aside>
    </React.Fragment>
  );
}

// ---- Product card --------------------------------------------------
function ProductCard({ product, onClick, num }) {
  const numStr = num != null ? `N°${String(num).padStart(3,"0")}` : `N°${product.id.split("-")[1]}`;
  return (
    <a href={`product.html?id=${product.id}`} className="product-card" onClick={(e) => { if (onClick) { e.preventDefault(); onClick(product); }}}>
      <div className="pc-img">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        {product.images[1] && <img className="pc-img-alt" src={product.images[1]} alt="" loading="lazy" />}
        <div className="pc-num">{numStr}</div>
      </div>
      <div className="pc-meta">
        <div className="pc-cat">{product.category}</div>
        <div className="pc-meta-row">
          <div className="pc-name">{product.name}</div>
          <div className="pc-price">${product.price}</div>
        </div>
      </div>
    </a>
  );
}

// ---- Section heading ----------------------------------------------
function SectionHead({ eyebrow, title, side, align = "row" }) {
  return (
    <div className="section-head reveal">
      <div>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</div>}
        <h2 className="serif">{title}</h2>
      </div>
      {side && <div className="sh-side">{side}</div>}
    </div>
  );
}

// ---- Palette themes (for Tweaks) -----------------------------------
const PALETTES = {
  "sage-ivory": {
    label: "Sage & Ivory",
    vars: { "--bg": "#F2EFE8", "--bg-warm": "#FAF7F0", "--bg-stone": "#E8E2D3", "--jade": "#5C7A6B", "--jade-deep": "#3F5749", "--olive": "#E6D5B8", "--ink": "#1A1A1A", "--hairline": "#D9D3C7", "--muted": "#8A867D" }
  },
  "linen-ink": {
    label: "Linen & Ink",
    vars: { "--bg": "#F6F2EA", "--bg-warm": "#FFFCF5", "--bg-stone": "#EAE3D2", "--jade": "#2C4A3E", "--jade-deep": "#1F3328", "--olive": "#D4B896", "--ink": "#15110C", "--hairline": "#D6CFBE", "--muted": "#7A766C" }
  },
  "ocean-shell": {
    label: "Ocean & Shell",
    vars: { "--bg": "#F3F4F1", "--bg-warm": "#FAFAF7", "--bg-stone": "#E1E5E1", "--jade": "#3D6B7C", "--jade-deep": "#264653", "--olive": "#E2D5BB", "--ink": "#0F1F26", "--hairline": "#CFD3CF", "--muted": "#7C8388" }
  },
  "warm-clay": {
    label: "Warm Clay",
    vars: { "--bg": "#F4EDE3", "--bg-warm": "#FBF6EC", "--bg-stone": "#E9DDC9", "--jade": "#7A5C3F", "--jade-deep": "#4F3A24", "--olive": "#D9BD96", "--ink": "#22150A", "--hairline": "#D9CDB7", "--muted": "#8A7965" }
  }
};
function applyPalette(key) {
  const p = PALETTES[key]; if (!p) return;
  const root = document.documentElement;
  Object.entries(p.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

// ---- Tweaks (no-op) -----------------------------------------------
function JoTweaks() { return null; }

// expose
Object.assign(window, {
  useScrolled, useReveal, useCart, useIsMobile,
  Icon, Wordmark, Nav, Footer, CartDrawer, ProductCard, SectionHead,
  applyPalette, PALETTES, JoTweaks,
});
