"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import {
  about,
  badgeStyles,
  contactCopy,
  credentials,
  experience,
  eyebrows,
  filters,
  type Filter,
  PREVIEW_COUNT,
  projects,
  projectDetails,
  type Project,
  proofStats,
  site,
  skills,
  terminalLines,
  ticker,
} from "@/data/content";

const mono = "'JetBrains Mono', monospace";
const display = "'Space Grotesk', sans-serif";

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function matchesFilter(p: Project, filter: Filter) {
  if (filter === "All") return true;
  if (filter === "Live") return p.badge === "LIVE";
  if (filter === "Client work") return p.badge === "CLIENT WORK";
  if (filter === "AI & Automation")
    return (
      p.name === "Automation bots" ||
      p.tags.some((t) => /Whisper|ML|Playwright|FastAPI/.test(t))
    );
  return true;
}

const NAV_IDS = ["projects", "skills", "experience", "contact"] as const;

export default function Portfolio() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(terminalLines.length);
  const [filter, setFilter] = useState<Filter>("All");
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Typed terminal reveal.
  useEffect(() => {
    if (prefersReduced()) return;
    setCount(0);
    let n = 0;
    const timer = setInterval(() => {
      n += 1;
      setCount(n);
      if (n >= terminalLines.length) clearInterval(timer);
    }, 340);
    return () => clearInterval(timer);
  }, []);

  // Keep the case study sheet modal-friendly and keyboard accessible.
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedProject]);

  // Scroll progress bar + scroll-spy.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width =
          (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      }
      let current: string | null = null;
      for (const id of NAV_IDS) {
        const sec = document.getElementById(id);
        if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = id;
        }
      }
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 80) {
        current = NAV_IDS[NAV_IDS.length - 1];
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal-on-scroll. Skips elements that carry their own animation (cards, hero).
  useEffect(() => {
    if (prefersReduced()) return;
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const delay = (Number(el.dataset.revealIndex) || 0) * 40;
          el.style.transitionDelay = delay + "ms";
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.filter = "none";
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    let i = 0;
    root.querySelectorAll<HTMLElement>("section > *, article").forEach((el) => {
      if (
        el.dataset.noReveal ||
        el.closest("nav") ||
        el.style.animationName ||
        el.querySelector("[data-no-reveal]")
      ) {
        return;
      }
      el.dataset.revealIndex = String(i % 5);
      i += 1;
      el.style.opacity = "0";
      el.style.transform = "translateY(26px) scale(0.985)";
      el.style.filter = "blur(6px)";
      el.style.transition =
        "opacity 0.4s cubic-bezier(0.22,0.61,0.36,1), transform 0.4s cubic-bezier(0.22,0.61,0.36,1), filter 0.35s ease";
      el.style.willChange = "opacity, transform";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Count-up stats.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReduced()) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          const to = Number(el.dataset.count);
          const from = Number(el.dataset.from || 0);
          const suffix = el.dataset.suffix || "";
          const dur = 1100;
          const t0 = performance.now();
          const step = (t: number) => {
            const k = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - k, 3);
            el.textContent = Math.round(from + (to - from) * eased) + suffix;
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 },
    );
    root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Interactive dot-grid canvas backdrop.
  useEffect(() => {
    const cv = gridRef.current;
    if (!cv || prefersReduced()) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const mouse = { x: -999, y: -999 };
    let w = 0;
    let h = 0;
    let raf = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const onResize = () => resize();
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    const gap = 36;
    const R = 170;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const near = d < R ? 1 - d / R : 0;
          const shimmer = 0.5 + 0.5 * Math.sin(t / 1400 + (x + y) / 260);
          const a = 0.05 + shimmer * 0.04 + near * 0.5;
          const r = 1 + near * 1.6;
          ctx.beginPath();
          ctx.fillStyle =
            "rgba(" +
            Math.round(110 + near * 30) +
            "," +
            Math.round(150 + near * 40) +
            ",246," +
            a.toFixed(3) +
            ")";
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Scroll-driven experience timeline: fill line grows and dots light up as it passes.
  useEffect(() => {
    const wrap = timelineRef.current;
    if (!wrap) return;
    const fill = wrap.querySelector<HTMLElement>("[data-tl-fill]");
    const dots = Array.from(wrap.querySelectorAll<HTMLElement>("[data-tl-dot]"));
    const paint = () => {
      const r = wrap.getBoundingClientRect();
      const focus = window.innerHeight * 0.65;
      const progress = Math.max(0, Math.min(1, (focus - r.top) / r.height));
      if (fill) fill.style.height = progress * 100 + "%";
      const fillY = r.top + 10 + progress * (r.height - 20);
      dots.forEach((d) => {
        const on = d.getBoundingClientRect().top <= fillY;
        d.style.borderColor = on ? "#4c8df6" : "#2a3245";
        d.style.boxShadow = on ? "0 0 14px rgba(76,141,246,0.7)" : "none";
        d.style.transform = on ? "scale(1.12)" : "scale(1)";
      });
    };
    window.addEventListener("scroll", paint, { passive: true });
    paint();
    return () => window.removeEventListener("scroll", paint);
  }, []);

  const all = projects.filter((p) => matchesFilter(p, filter));
  const shown = expanded ? all : all.slice(0, PREVIEW_COUNT);
  const hasMore = all.length > PREVIEW_COUNT;
  const nextLineNo = count + 1;
  const selectedDetail = selectedProject ? projectDetails[selectedProject.name] : null;

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setExpanded(false);
  };

  const navLinkStyle = (id: string): CSSProperties =>
    active === id ? { color: "#e7ecf5", borderBottom: "1px solid #4c8df6" } : {};

  const onCardMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReduced()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.background =
      "radial-gradient(420px circle at " + x + "px " + y + "px, rgba(76,141,246,0.11), rgba(13,17,26,0) 60%), #0d111a";
    const rx = ((y / r.height) - 0.5) * -5;
    const ry = ((x / r.width) - 0.5) * 5;
    el.style.transform =
      "perspective(900px) translateY(-4px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
  };
  const onCardLeave = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.background = "#0d111a";
    el.style.transform = "";
  };

  return (
    <div ref={rootRef}>
      <div
        ref={progressRef}
        aria-hidden="true"
        style={{ position: "fixed", top: 0, left: 0, height: 2, width: "0%", background: "linear-gradient(90deg,#4c8df6,#8fb8fb)", zIndex: 60, transition: "width 0.1s linear", pointerEvents: "none" }}
      />

      <a href="#projects" className="skip-link" style={skipStyle}>
        Skip to projects
      </a>

      <div style={{ minHeight: "100vh", background: "#07090f", padding: "0 clamp(18px, 5vw, 64px)" }}>
        {/* animated backdrop */}
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-18vh", left: "-10vw", width: "62vw", height: "62vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(76,141,246,0.16), rgba(76,141,246,0) 68%)", filter: "blur(30px)", animation: "drift1 26s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-22vh", right: "-14vw", width: "54vw", height: "54vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.10), rgba(52,211,153,0) 68%)", filter: "blur(34px)", animation: "drift2 34s ease-in-out infinite" }} />
        </div>
        <canvas ref={gridRef} aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* NAV */}
          <nav aria-label="Primary" className="portfolio-nav" style={{ display: "flex", alignItems: "center", padding: "20px 0", position: "sticky", top: 0, background: "rgba(11,10,15,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", zIndex: 20, borderBottom: "1px solid #161c28" }}>
            <a href="#top" className="portfolio-brand" style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", color: "#e7ecf5" }}>
              {site.name}
            </a>
            <div className={`portfolio-nav-links${mobileNavOpen ? " is-open" : ""}`}>
              {NAV_IDS.map((id) => (
                <a key={id} href={`#${id}`} className="nav-link" onClick={() => setMobileNavOpen(false)} style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.04em", ...navLinkStyle(id) }}>
                  {id}
                </a>
              ))}
            </div>
            <button type="button" className="portfolio-menu" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((open) => !open)}>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </nav>

          {/* HERO */}
          <section id="top" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "clamp(28px, 5vw, 56px)", alignItems: "center", padding: "clamp(44px, 8vw, 100px) 0 clamp(36px, 6vw, 68px)" }}>
            <div data-no-reveal="1" style={{ animation: "riseIn 0.5s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
                <picture>
                  <source srcSet={site.photoWebp} type="image/webp" />
                  <img src={site.photo} alt={site.photoAlt} width={84} height={84} style={{ width: 84, height: 84, flex: "none", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "1px solid #232b3b" }} />
                </picture>
                <p style={{ fontFamily: mono, fontSize: 12, color: "#4c8df6", letterSpacing: "0.14em", textTransform: "uppercase", margin: 0, lineHeight: 1.6 }}>
                  {site.locationLine1}
                  <br />
                  {site.locationLine2}
                </p>
              </div>

              <h1 style={{ fontFamily: display, fontWeight: 700, fontSize: "clamp(38px, 6.6vw, 66px)", lineHeight: 0.98, letterSpacing: "-0.035em", margin: "0 0 14px", background: "linear-gradient(100deg, #e7ecf5 32%, #8fb8fb 46%, #e7ecf5 60%)", backgroundSize: "240% 100%", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", animation: "sheen 8s linear infinite" }}>
                {site.name}
              </h1>

              <p style={{ fontFamily: display, fontSize: "clamp(17px, 2.2vw, 21px)", color: "#b3bdcd", margin: "0 0 18px", lineHeight: 1.3 }}>{site.title}</p>
              <p style={{ fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.6, color: "#949eb0", maxWidth: "46ch", margin: "0 0 10px", textWrap: "pretty" }}>{site.heroOneLiner}</p>
              <p style={{ fontFamily: mono, fontSize: 12.5, lineHeight: 1.6, color: "#6c7688", margin: "0 0 30px" }}>{site.relocation}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <a href="#projects" className="btn-primary" style={ctaPrimary}>
                  View projects
                </a>
                <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title={`github.com/${site.githubHandle}`} className="icon-btn" style={iconBtn}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
                  </svg>
                </a>
                <a href={`mailto:${site.email}`} aria-label="Email" title={site.email} className="icon-btn" style={iconBtn}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                    <path d="M3 6.5l9 6.5 9-6.5" />
                  </svg>
                </a>
              </div>

              <p style={{ margin: "18px 0 0" }}>
                <a href={site.resume} target="_blank" rel="noopener noreferrer" className="res-link" style={{ fontFamily: mono, fontSize: 12.5, color: "#8b95a7", borderBottom: "1px solid #232b3b", paddingBottom: 2 }}>
                  Download resume (PDF)
                </a>
              </p>
            </div>

            {/* Terminal — VS Code editor look */}
            <div data-no-reveal="1" style={{ border: "1px solid #1a1a1a", borderRadius: 8, background: "#1e1e1e", overflow: "hidden", boxShadow: "0 24px 60px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", alignItems: "stretch", background: "#252526", borderBottom: "1px solid #191919" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", height: 35, background: "#1e1e1e", borderTop: "1px solid #0078d4", borderRight: "1px solid #191919", color: "#ffffff" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e2c08d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 17l6-5-6-5" />
                    <path d="M12 19h8" />
                  </svg>
                  <span style={{ fontFamily: mono, fontSize: 11.5 }}>status.sh</span>
                  <span style={{ fontFamily: mono, fontSize: 13, color: "#8a8a8a", marginLeft: 4 }}>×</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "0 14px", height: 35, color: "#8a8a8a" }}>
                  <span style={{ fontFamily: mono, fontSize: 11.5 }}>deploy.log</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "#1e1e1e", borderBottom: "1px solid #2b2b2b" }}>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: "#8a8a8a" }}>portfolio</span>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: "#5a5a5a" }}>›</span>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: "#8a8a8a" }}>scripts</span>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: "#5a5a5a" }}>›</span>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: "#cccccc" }}>status.sh</span>
              </div>

              <div style={{ padding: "12px 0 18px", fontFamily: mono, fontSize: 12.5, lineHeight: 1.85, minHeight: 252, background: "#1e1e1e" }}>
                {terminalLines.slice(0, count).map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "0 14px 0 0", whiteSpace: "nowrap", overflow: "hidden" }}>
                    <span style={{ width: 34, textAlign: "right", color: "#6e7681", flex: "none" }}>{i + 1}</span>
                    <span style={{ color: line.tone, flex: "none" }}>{line.mark}</span>
                    <span style={{ color: "#d4d4d4", overflow: "hidden", textOverflow: "ellipsis" }}>{line.text}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ width: 34, textAlign: "right", color: "#c6c6c6", flex: "none" }}>{nextLineNo}</span>
                  <span style={{ color: "#569cd6" }}>$</span>
                  <span style={{ width: 7, height: 15, background: "#aeafad", display: "inline-block", animation: "blink 1.05s step-end infinite" }} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 12px", height: 24, background: "#0078d4", color: "#ffffff", fontFamily: mono, fontSize: 10.5 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 3v12" />
                    <circle cx="6" cy="18" r="2.5" />
                    <circle cx="18" cy="6" r="2.5" />
                    <path d="M18 8.5v2a4 4 0 0 1-4 4H8" />
                  </svg>
                  main
                </span>
                <span>bash</span>
                <span style={{ marginLeft: "auto" }}>Ln {nextLineNo}, Col 1</span>
                <span>UTF-8</span>
              </div>
            </div>
          </section>

          {/* PROOF STRIP */}
          <section aria-label="Track record" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px, 4vw, 52px)", padding: "clamp(28px, 5vw, 40px) 0 clamp(52px, 8vw, 88px)", borderTop: "1px solid #161c28", borderBottom: "1px solid #161c28", marginBottom: "clamp(52px, 8vw, 88px)" }}>
            {proofStats.map((s) => (
              <div key={s.label}>
                <p data-count={s.count} data-from={s.from || undefined} data-suffix={s.suffix || undefined} style={{ fontFamily: display, fontWeight: 700, fontSize: "clamp(26px, 3.4vw, 34px)", margin: 0, letterSpacing: "-0.02em" }}>
                  {s.display}
                </p>
                <p style={{ fontFamily: mono, fontSize: 11.5, color: "#798395", margin: "4px 0 0", letterSpacing: "0.05em" }}>{s.label}</p>
              </div>
            ))}
          </section>

          {/* TICKER */}
          <div aria-hidden="true" style={{ overflow: "hidden", margin: "0 0 clamp(44px, 7vw, 76px)", maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}>
            <div style={{ display: "flex", width: "max-content", gap: 34, animation: "marquee 32s linear infinite" }}>
              {ticker.concat(ticker).map((t, i) => (
                <span key={i} style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.08em", color: "#5d6778", whiteSpace: "nowrap" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* PROJECTS */}
          <section id="projects" style={{ paddingBottom: "clamp(52px, 8vw, 88px)" }}>
            <p style={eyebrowStyle}>{eyebrows.projects}</p>
            <h2 style={h2Style}>Projects</h2>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, margin: "-6px 0 20px" }}>
              {filters.map((f) => {
                const on = f === filter;
                return (
                  <button key={f} type="button" onClick={() => changeFilter(f)} aria-pressed={on} className="filter-btn" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: "0.04em", padding: "9px 14px", borderRadius: 999, cursor: "pointer", color: on ? "#07090f" : "#8b95a7", background: on ? "#4c8df6" : "transparent", border: `1px solid ${on ? "#6ba0f8" : "#1e2534"}` }}>
                    {f}
                  </button>
                );
              })}
              <span style={{ fontFamily: mono, fontSize: 11, color: "#6c7688", marginLeft: "auto" }}>
                {shown.length} / {all.length}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(288px, 1fr))", gap: 16 }}>
              {shown.map((p, i) => {
                const bs = p.badge ? badgeStyles[p.badge] : null;
                return (
                  <article key={p.name} onClick={() => setSelectedProject(p)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedProject(p); } }} role="button" tabIndex={0} aria-label={`Open case study for ${p.name}`} onPointerMove={onCardMove} onPointerLeave={onCardLeave} className="card project-card" style={{ border: "1px solid #1b2130", borderRadius: 12, background: "#0d111a", padding: 20, display: "flex", flexDirection: "column", gap: 12, transformStyle: "preserve-3d", animation: "cardIn 0.35s cubic-bezier(0.22,0.61,0.36,1) both", animationDelay: `${i * 35}ms` }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                      <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 17.5, margin: 0, letterSpacing: "-0.015em" }}>{p.name}</h3>
                      {bs ? (
                        <span style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: "0.1em", padding: "4px 7px", borderRadius: 4, whiteSpace: "nowrap", flex: "none", color: bs.fg, background: bs.bg, border: `1px solid ${bs.bd}` }}>
                          {p.badge}
                        </span>
                      ) : null}
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "#939daf", margin: 0, textWrap: "pretty" }}>{p.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
                      {p.tags.map((t) => (
                        <span key={t} style={{ fontFamily: mono, fontSize: 10.5, color: "#878fa1", border: "1px solid #1e2534", borderRadius: 4, padding: "3px 7px" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 4 }}>
                      <span className="case-study-hint" style={{ fontFamily: mono, fontSize: 11.5, color: "#8fb8fb" }}>read case study <span aria-hidden="true">↗</span></span>
                      <span style={{ fontFamily: mono, fontSize: 10.5, color: "#5d6778" }}>click to open</span>
                    </div>
                  </article>
                );
              })}
            </div>

            {hasMore && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
                <button type="button" onClick={() => setExpanded((v) => !v)} className="more-btn" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: mono, fontSize: 12, letterSpacing: "0.06em", padding: "13px 22px", borderRadius: 999, cursor: "pointer", color: "#e7ecf5", background: "#11161f", border: "1px solid #1e2534", minHeight: 44 }}>
                  <span>{expanded ? "Show less" : `View all ${all.length} projects`}</span>
                  <span style={{ display: "inline-flex", transition: "transform 0.28s cubic-bezier(0.22,0.61,0.36,1)", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 9l7 7 7-7" />
                    </svg>
                  </span>
                </button>
              </div>
            )}
          </section>

          {/* SKILLS */}
          <section id="skills" style={{ paddingBottom: "clamp(52px, 8vw, 88px)" }}>
            <p style={eyebrowStyle}>{eyebrows.skills}</p>
            <h2 style={h2Style}>Skills</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
              {skills.map((g, i) => (
                <div key={g.group} className="skill-card" style={{ border: "1px solid #1b2130", borderRadius: 12, background: "linear-gradient(180deg, #0f141e, #0c1018)", padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(76,141,246,0.12)", border: "1px solid rgba(76,141,246,0.28)", color: "#8fb8fb", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 10.5, flex: "none" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ fontFamily: display, fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", color: "#e7ecf5", margin: 0 }}>{g.group}</p>
                    <span style={{ fontFamily: mono, fontSize: 10.5, color: "#5d6778", marginLeft: "auto" }}>{g.items.length} items</span>
                  </div>
                  <div style={{ height: 1, background: "linear-gradient(90deg, rgba(76,141,246,0.4), rgba(76,141,246,0))" }} />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {g.items.map((s) => (
                      <span key={s} className="skill-chip" style={{ fontFamily: mono, fontSize: 11.5, color: "#b3bdcd", background: "#11161f", border: "1px solid #1e2534", borderRadius: 6, padding: "6px 10px", cursor: "default" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EXPERIENCE — timeline */}
          <section id="experience" style={{ paddingBottom: "clamp(52px, 8vw, 88px)" }}>
            <p style={eyebrowStyle}>{eyebrows.experience}</p>
            <h2 style={h2Style}>Experience</h2>
            <div ref={timelineRef} style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
              <div aria-hidden="true" style={{ position: "absolute", left: 8, top: 10, bottom: 10, width: 1, background: "#1b2130" }} />
              <div data-tl-fill aria-hidden="true" style={{ position: "absolute", left: 8, top: 10, width: 1, height: "0%", maxHeight: "calc(100% - 20px)", background: "linear-gradient(180deg, #4c8df6, #8fb8fb)", boxShadow: "0 0 12px rgba(76,141,246,0.6)", transition: "height 0.15s linear" }} />
              {experience.map((job, idx) => {
                const badge =
                  job.periodTone === "live"
                    ? { color: "#34d399", background: "rgba(52,211,153,0.09)", border: "1px solid rgba(52,211,153,0.32)" }
                    : { color: "#8fb8fb", background: "rgba(76,141,246,0.1)", border: "1px solid rgba(76,141,246,0.32)" };
                return (
                  <div key={job.role} style={{ display: "flex", gap: 22, padding: idx < experience.length - 1 ? "0 0 30px" : "0" }}>
                    <span data-tl-dot aria-hidden="true" style={{ width: 17, height: 17, borderRadius: "50%", background: "#0d111a", border: "2px solid #2a3245", boxSizing: "border-box", flex: "none", marginTop: 4, position: "relative", zIndex: 1, transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease", animation: job.pulse ? "pulseDot 2.4s ease-in-out infinite" : undefined }} />
                    <div className="exp-card" style={{ flex: 1, border: "1px solid #1b2130", borderRadius: 12, background: "#0d111a", padding: "20px 22px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 12px", marginBottom: 10 }}>
                        <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 17.5, margin: 0, letterSpacing: "-0.015em" }}>{job.role}</h3>
                        <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", padding: "4px 8px", borderRadius: 4, ...badge }}>{job.period}</span>
                      </div>
                      <p style={{ fontFamily: mono, fontSize: 11.5, color: "#798395", margin: "0 0 12px" }}>{job.meta}</p>
                      {job.desc ? (
                        <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#939daf", margin: "0 0 14px", textWrap: "pretty" }}>{job.desc}</p>
                      ) : null}
                      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: job.tags.length ? 14 : 0 }}>
                        {job.bullets.map((b) => (
                          <div key={b} style={{ display: "flex", gap: 9, alignItems: "baseline" }}>
                            <span style={{ color: "#4c8df6", fontFamily: mono, fontSize: 11, flex: "none" }}>▸</span>
                            <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "#abb5c6" }}>{b}</span>
                          </div>
                        ))}
                      </div>
                      {job.tags.length ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {job.tags.map((t) => (
                            <span key={t} style={{ fontFamily: mono, fontSize: 10.5, color: "#878fa1", border: "1px solid #1e2534", borderRadius: 4, padding: "3px 7px" }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ABOUT */}
          <section style={{ paddingBottom: "clamp(52px, 8vw, 88px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(288px, 1fr))", gap: "20px 40px", borderTop: "1px solid #161c28", paddingTop: "clamp(28px, 5vw, 40px)" }}>
            <div>
              <p style={eyebrowStyle}>{eyebrows.about}</p>
              <h2 style={{ ...h2Style, margin: 0 }}>About</h2>
            </div>
            <div>
              <p style={{ fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.7, color: "#abb5c6", margin: "0 0 14px", textWrap: "pretty" }}>{about}</p>
              <p style={{ fontFamily: mono, fontSize: 11.5, lineHeight: 1.7, color: "#6c7688", margin: 0 }}>{credentials}</p>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" style={{ paddingBottom: "clamp(48px, 7vw, 72px)", borderTop: "1px solid #161c28", paddingTop: "clamp(28px, 5vw, 44px)" }}>
            <p style={eyebrowStyle}>{eyebrows.contact}</p>
            <h2 style={{ ...h2Style, fontSize: "clamp(26px, 3.4vw, 36px)", margin: "0 0 12px" }}>Contact</h2>
            <p style={{ fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.6, color: "#939daf", margin: "0 0 24px", maxWidth: "52ch" }}>{contactCopy}</p>
            <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
              <ContactCard href={`mailto:${site.email}`} primary label="EMAIL" value={site.email} icon={<><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="M3 6.5l9 6.5 9-6.5" /></>} />
              <ContactCard href={site.github} external label="GITHUB" value={site.githubHandle} icon={<><path d="M9 7l-5 5 5 5" /><path d="M15 7l5 5-5 5" /></>} />
              <ContactCard href={site.instagram} external label="INSTAGRAM" value={`@${site.instagramHandle}`} icon={<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>} />
            </div>
          </section>

          {/* FOOTER */}
          <footer className="site-footer">
            <a href="#top" className="site-footer-brand">wyna.dev</a>
            <div className="site-footer-links" aria-label="Social links">
              <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" /></svg>
              </a>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>
              </a>
              <a href={`mailto:${site.email}`} aria-label="Email" title={site.email}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="M3 6.5l9 6.5 9-6.5" /></svg>
              </a>
            </div>
          </footer>
        </div>
      </div>

      {selectedProject && selectedDetail ? (
        <div className="case-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProject(null); }}>
          <section className="case-modal" role="dialog" aria-modal="true" aria-labelledby="case-modal-title">
            <button className="case-modal-close" type="button" onClick={() => setSelectedProject(null)} aria-label="Close case study">×</button>
            <div className="case-modal-topline">
              <span>{selectedDetail.eyebrow}</span>
              <span>{selectedProject.badge || "selected work"}</span>
            </div>
            <h2 id="case-modal-title">{selectedProject.name}</h2>
            <p className="case-modal-overview">{selectedDetail.overview}</p>
            <div className="case-modal-grid">
              <div>
                <p className="case-modal-label">the brief</p>
                <p className="case-modal-copy">{selectedDetail.problem}</p>
              </div>
              <div>
                <p className="case-modal-label">my role</p>
                <p className="case-modal-copy">{selectedDetail.role}</p>
              </div>
            </div>
            <div className="case-modal-shipped">
              <p className="case-modal-label">what shipped</p>
              <ul>
                {selectedDetail.shipped.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="case-modal-actions">
              {selectedProject.live ? <a className="case-modal-primary" href={selectedProject.live} target="_blank" rel="noopener noreferrer">open live ↗</a> : null}
              {selectedProject.repo ? <a className="case-modal-secondary" href={selectedProject.repo} target="_blank" rel="noopener noreferrer">view source ↗</a> : null}
              {!selectedProject.live && !selectedProject.repo ? <span className="case-modal-note">private or exploratory work</span> : null}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

const skipStyle: CSSProperties = { position: "absolute", left: -9999, top: 0, zIndex: 100 };

const ctaPrimary: CSSProperties = { display: "inline-flex", alignItems: "center", padding: "13px 22px", borderRadius: 8, background: "#4c8df6", color: "#fff", fontWeight: 600, fontSize: 14.5, border: "1px solid #6ba0f8", minHeight: 44 };

const iconBtn: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 8, background: "#11161f", color: "#e7ecf5", border: "1px solid #1e2534" };

const eyebrowStyle: CSSProperties = { fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", color: "#4c8df6", margin: "0 0 10px" };

const h2Style: CSSProperties = { fontFamily: display, fontWeight: 700, fontSize: "clamp(24px, 3vw, 32px)", letterSpacing: "-0.025em", margin: "0 0 26px" };

function ContactCard({
  href,
  icon,
  label,
  value,
  primary,
  external,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  primary?: boolean;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`contact-card ${primary ? "contact-primary" : "contact-ghost"}`}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 10, background: primary ? "#4c8df6" : "#11161f", color: primary ? "#fff" : "#e7ecf5", border: `1px solid ${primary ? "#6ba0f8" : "#1e2534"}`, minHeight: 44 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }} aria-hidden="true">
        {icon}
      </svg>
      <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", color: primary ? undefined : "#6c7688", opacity: primary ? 0.8 : 1 }}>{label}</span>
        <span style={{ fontWeight: 600, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
      </span>
    </a>
  );
}
