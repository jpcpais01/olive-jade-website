/* global React */
const { useEffect, useRef, useState } = React;

// Parallax: translate Y based on element's viewport position
function useParallax(speed = 0.2) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(max-width: 880px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, ticking = false;
    const update = () => {
      const r = el.getBoundingClientRect();
      const wh = window.innerHeight;
      const center = r.top + r.height / 2;
      const p = (center - wh / 2) / wh;
      el.style.transform = `translate3d(0, ${(-p * speed * 100).toFixed(2)}px, 0)`;
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { raf = requestAnimationFrame(update); ticking = true; } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", update); cancelAnimationFrame(raf); };
  }, [speed]);
  return ref;
}

// Mouse drift
function useMouseParallax(intensity = 12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(max-width: 880px)").matches) return;
    let raf = 0;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${(x * intensity).toFixed(2)}px, ${(y * intensity).toFixed(2)}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, [intensity]);
  return ref;
}

// Scroll progress 0-1 of element through viewport
function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const total = r.height + window.innerHeight;
      const traveled = window.innerHeight - r.top;
      setP(Math.min(1, Math.max(0, traveled / total)));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [ref]);
  return p;
}

// Split text into chars wrapped for staggered reveal
function SplitText({ children, className = "", delay = 0, stagger = 30, as = "span" }) {
  const ref = useRef(null);
  const Tag = as;
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(max-width: 880px)").matches) { el.classList.add("split-in"); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { el.classList.add("split-in"); io.unobserve(el); } });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={"split-text " + className}>
      {words.map((w, wi) => (
        <span className="st-word" key={wi}>
          {[...w].map((c, ci) => (
            <span className="st-char" key={ci} style={{ transitionDelay: `${delay + wi * 80 + ci * stagger}ms` }}>{c}</span>
          ))}
          {wi < words.length - 1 && <span className="st-space">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}

// Magnetic
function Magnetic({ children, strength = 0.3, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(max-width: 880px)").matches) return;
    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`; });
    };
    const onLeave = () => { cancelAnimationFrame(raf); el.style.transform = ""; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); cancelAnimationFrame(raf); };
  }, [strength]);
  return <span ref={ref} className={"magnetic " + className}>{children}</span>;
}

// Custom cursor — sea bubble
function SeaCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(max-width: 880px)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const dot = dotRef.current, ring = ringRef.current;
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my, dx = mx, dy = my;
    let raf;
    const tick = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dx += (mx - dx) * 0.6;  dy += (my - dy) * 0.6;
      if (ring) ring.style.transform = `translate3d(${rx-22}px, ${ry-22}px, 0)`;
      if (dot) dot.style.transform = `translate3d(${dx-3}px, ${dy-3}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const onEnter = (e) => { const t = e.target; if (t && t.matches && t.matches("a, button, .magnetic, .product-card, [data-cursor]")) ring && ring.classList.add("hover"); };
    const onLeave = (e) => { const t = e.target; if (t && t.matches && t.matches("a, button, .magnetic, .product-card, [data-cursor]")) ring && ring.classList.remove("hover"); };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    document.body.classList.add("sea-cursor-on");
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      document.body.classList.remove("sea-cursor-on");
      cancelAnimationFrame(raf);
    };
  }, []);
  return (<React.Fragment><div className="sea-cursor-ring" ref={ringRef} /><div className="sea-cursor-dot" ref={dotRef} /></React.Fragment>);
}

// Reveal on scroll (mask, fade, etc)
function useReveal2() {
  useEffect(() => {
    if (window.matchMedia("(max-width: 880px)").matches) {
      document.querySelectorAll(".rv, .rv-mask, .rv-up, .rv-stagger, .rv-img").forEach(el => el.classList.add("rv-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".rv, .rv-mask, .rv-up, .rv-stagger, .rv-img").forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

Object.assign(window, { useParallax, useMouseParallax, useScrollProgress, SplitText, Magnetic, SeaCursor, useReveal2 });
