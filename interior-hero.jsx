/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

// Hero band shared across interior pages — uses a single poster (drop a video URL into HEAD_VIDEO if/when wanted)
function InteriorHero({ num, kicker, title, lede, posterImg, headVideoSrc }) {
  // Make the global Nav render in light/on-dark mode while the band is visible
  const ref = useRef(null);
  useEffect(() => {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    nav.classList.add("on-dark");
    const onScroll = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      if (rect.bottom < 80) nav.classList.remove("on-dark");
      else nav.classList.add("on-dark");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); nav.classList.remove("on-dark"); };
  }, []);

  return (
    <section className="ihero" ref={ref}>
      <div className="ihero-stage">
        {headVideoSrc ? (
          <video src={headVideoSrc} poster={posterImg} autoPlay muted loop playsInline />
        ) : (
          <div className="ihero-poster" style={{ backgroundImage: `url(${posterImg})` }}>
            <div className="ihero-poster-tag mono">PLACEHOLDER · VIDEO</div>
          </div>
        )}
        <div className="ihero-veil" />
      </div>
      <div className="ihero-overlay">
        <div className="ihero-rail">
          <span className="mono">{num}</span>
          <span className="ihero-rail-bar" />
          <span className="mono">{kicker}</span>
        </div>
        <div className="ihero-content">
          <h1 className="serif ihero-h">{title}</h1>
          {lede && <p className="ihero-lede">{lede}</p>}
        </div>
        <div className="ihero-foot">
          <span className="mono">Athens · Kyoto · Lisbon</span>
          <span className="ihero-foot-sep" />
          <span className="mono">Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}

window.InteriorHero = InteriorHero;
