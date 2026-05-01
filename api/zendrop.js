/**
 * Jade & Olive — Storefront API adapter
 * ----------------------------------------------------------------------
 * This module exposes a small, stable surface that the rest of the site
 * uses to fetch products, look up a single product, and submit orders.
 *
 * It is currently backed by an in-memory MOCK dataset, but is designed
 * so that switching to the real Zendrop API requires only swapping the
 * implementation of `_request()` below — every public function (listProducts,
 * getProduct, createOrder, etc.) maps 1:1 to a Zendrop REST endpoint:
 *
 *   GET    /products              -> listProducts()
 *   GET    /products/:id          -> getProduct(id)
 *   POST   /orders                -> createOrder(payload)
 *   GET    /orders/:id            -> getOrder(id)
 *
 * To go live:
 *   1. Set ZENDROP_API_KEY (server-side env, not in client bundle).
 *   2. Replace `_request()` body with a real `fetch()` to
 *      `https://api.zendrop.com/v1/...` with `Authorization: Bearer <key>`.
 *   3. Add a thin Node/edge proxy if you don't want the key in the browser.
 *   4. The shape returned by each function below is what UI code expects;
 *      reshape Zendrop responses to match (a tiny `_normalize()` helper
 *      is the right place for this).
 */

const ZendropAPI = (() => {
  const USE_MOCK = true; // flip to false once the real adapter is wired

  // ---- Mock catalog ----------------------------------------------------
  // Image URLs are Unsplash placeholders; they're safe to swap for real
  // product photography later.
  const MOCK_PRODUCTS = [
    {
      id: "jo-001",
      slug: "olive-branch-pendant",
      name: "Olive Branch Pendant",
      category: "necklaces",
      price: 248,
      currency: "USD",
      material: "14k recycled gold",
      origin: "Crafted in Jaipur",
      description: "A whisper of an olive branch, hand-traced from a tree in our family grove on the Aegean coast. Worn long, the leaves move quietly against the collarbone.",
      details: ["14k recycled gold", "0.4mm cable chain, 18\" with 2\" extender", "Pendant: 22 × 9mm", "Lobster clasp"],
      images: [
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=80"
      ],
      stock: 12,
      featured: true,
    },
    {
      id: "jo-002",
      slug: "jade-droplet-earrings",
      name: "Jade Droplet Earrings",
      category: "earrings",
      price: 186,
      currency: "USD",
      material: "Burmese jade, sterling silver",
      origin: "Stones sourced in Mandalay",
      description: "Two small tears of jade, lit from within. Each stone is hand-cut by a third-generation lapidary; no two pairs are identical.",
      details: ["Sterling silver posts", "Drop length 18mm", "Hypoallergenic backings", "Cleansed with rice paper"],
      images: [
        "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80"
      ],
      stock: 7,
      featured: true,
    },
    {
      id: "jo-003",
      slug: "tide-band-ring",
      name: "Tide Band Ring",
      category: "rings",
      price: 312,
      currency: "USD",
      material: "Brushed sterling silver",
      origin: "Hand-finished in Lisbon",
      description: "A band textured like the line a wave leaves on wet sand. Worn flat, it catches morning light along the ridge.",
      details: ["Sterling silver, 925", "Width 4mm, comfort-fit", "Available in sizes 4–10", "Recycled metal"],
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80"
      ],
      stock: 22,
      featured: false,
    },
    {
      id: "jo-004",
      slug: "mediterranean-coil-bracelet",
      name: "Mediterranean Coil Bracelet",
      category: "bracelets",
      price: 224,
      currency: "USD",
      material: "14k gold vermeil",
      origin: "Crafted in Athens",
      description: "An open coil that wraps the wrist twice, ending in two tiny olives. It moves with you and sits flat under a sleeve.",
      details: ["14k gold vermeil over silver", "Adjustable, fits 6–7.5\"", "Polished finish", "Stamped with our mark"],
      images: [
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?auto=format&fit=crop&w=900&q=80"
      ],
      stock: 9,
      featured: true,
    },
    {
      id: "jo-005",
      slug: "linen-knot-necklace",
      name: "Linen Knot Necklace",
      category: "necklaces",
      price: 168,
      currency: "USD",
      material: "Sterling silver, raw linen",
      origin: "Spun in Kyoto",
      description: "Inspired by the obi-jime knot. A clean silver bar passes through linen cord dyed three times in indigo and milk.",
      details: ["Sterling silver bar 32mm", "Hand-dyed linen cord", "Adjustable 16–22\"", "Each knot is unique"],
      images: [
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80"
      ],
      stock: 14,
      featured: false,
    },
    {
      id: "jo-006",
      slug: "stone-fruit-studs",
      name: "Stone Fruit Studs",
      category: "earrings",
      price: 142,
      currency: "USD",
      material: "Recycled gold, freshwater pearl",
      origin: "Set in Bangkok",
      description: "Small as a peach pit, warm as one too. A single freshwater pearl hangs from a hammered gold disc.",
      details: ["14k recycled gold", "5mm freshwater pearl", "Drop 12mm", "Butterfly back"],
      images: [
        "https://images.unsplash.com/photo-1620656798932-902dc1cb1c63?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1635767582909-345f4ce0e3aa?auto=format&fit=crop&w=900&q=80"
      ],
      stock: 18,
      featured: false,
    },
    {
      id: "jo-007",
      slug: "atelier-signet-ring",
      name: "Atelier Signet Ring",
      category: "rings",
      price: 384,
      currency: "USD",
      material: "Solid 14k gold",
      origin: "Cast in Florence",
      description: "An unembellished signet, faceted gently along the shoulders. We engrave it by hand on request — initials, a date, a coordinate.",
      details: ["Solid 14k gold", "Face: 11 × 9mm", "Engraving included (3 letters)", "Made to order in 3 weeks"],
      images: [
        "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=900&q=80"
      ],
      stock: 4,
      featured: true,
    },
    {
      id: "jo-008",
      slug: "salt-bead-bracelet",
      name: "Salt Bead Bracelet",
      category: "bracelets",
      price: 98,
      currency: "USD",
      material: "Carved white onyx",
      origin: "Beaded in Kyoto",
      description: "Tiny matte beads strung on silk, fastened with a silver bar. Light enough to wear three at a time.",
      details: ["Matte white onyx, 4mm", "Pure silk thread", "Sterling silver clasp", "Wrist 6.5–7.5\""],
      images: [
        "https://images.unsplash.com/photo-1573408301819-cd9f9b4ca31f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80"
      ],
      stock: 31,
      featured: false,
    },
  ];

  // ---- Real-API hook (currently a no-op) ------------------------------
  async function _request(/* method, path, body */) {
    // Real implementation:
    //   const r = await fetch(`https://api.zendrop.com/v1${path}`, {
    //     method, body: body ? JSON.stringify(body) : undefined,
    //     headers: {
    //       'Authorization': `Bearer ${ZENDROP_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   if (!r.ok) throw new Error(await r.text());
    //   return _normalize(await r.json());
    throw new Error("Not implemented — set USE_MOCK=false only when the real adapter is wired");
  }

  // small artificial latency so loading states are honest
  const _delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

  // ---- Public API -----------------------------------------------------
  async function listProducts({ category, featured } = {}) {
    if (!USE_MOCK) return _request("GET", "/products");
    await _delay(200);
    let out = MOCK_PRODUCTS.slice();
    if (category && category !== "all") out = out.filter(p => p.category === category);
    if (featured) out = out.filter(p => p.featured);
    return out;
  }

  async function getProduct(idOrSlug) {
    if (!USE_MOCK) return _request("GET", `/products/${idOrSlug}`);
    await _delay(120);
    return MOCK_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  }

  async function listCategories() {
    return [
      { slug: "all", name: "All Pieces" },
      { slug: "necklaces", name: "Necklaces" },
      { slug: "earrings", name: "Earrings" },
      { slug: "rings", name: "Rings" },
      { slug: "bracelets", name: "Bracelets" },
    ];
  }

  async function createOrder(payload) {
    if (!USE_MOCK) return _request("POST", "/orders", payload);
    await _delay(600);
    return { id: "ord_" + Math.random().toString(36).slice(2, 10), status: "received", ...payload };
  }

  // Cart lives in localStorage; cart items are { productId, qty }
  const CART_KEY = "jo_cart_v1";
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("jo:cart-changed", { detail: items }));
  }
  function addToCart(productId, qty = 1) {
    const items = getCart();
    const existing = items.find(i => i.productId === productId);
    if (existing) existing.qty += qty;
    else items.push({ productId, qty });
    setCart(items);
  }
  function removeFromCart(productId) {
    setCart(getCart().filter(i => i.productId !== productId));
  }
  function updateQty(productId, qty) {
    const items = getCart().map(i => i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i);
    setCart(items);
  }
  async function getCartWithProducts() {
    const items = getCart();
    const products = await Promise.all(items.map(i => getProduct(i.productId)));
    return items.map((i, idx) => ({ ...i, product: products[idx] })).filter(i => i.product);
  }

  return {
    listProducts, getProduct, listCategories, createOrder,
    getCart, addToCart, removeFromCart, updateQty, getCartWithProducts,
  };
})();

window.ZendropAPI = ZendropAPI;
