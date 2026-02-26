"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getDictionary } from "../i18n";
import { getCases } from "./cases/data";

/* ───── design tokens (creamy-white light theme) ───── */
const V = {
  bg: "#FAF8F5",
  card: "#FFFFFF",
  cardHover: "#F5F2EE",
  text: "#6B6560",
  dim: "#8A857F",
  muted: "#B0AAA3",
  bright: "#1A1714",
  accent: "#A01C2D",
  accentLit: "#C8354A",
  accentDim: "rgba(160,28,45,0.06)",
  accentGlow: "rgba(160,28,45,0.12)",
  border: "rgba(0,0,0,0.07)",
  borderHover: "rgba(0,0,0,0.14)",
  divider: "rgba(0,0,0,0.06)",
  radius: 16,
  radiusSm: 10,
  heading: "'Unbounded', sans-serif",
  body: "'Manrope', -apple-system, sans-serif",
};

/* ───── global CSS with hover/focus classes ───── */
const globalCSS = `
/* scroll animations */
@keyframes revealUp{from{opacity:0;filter:blur(8px);transform:translateY(60px)}to{opacity:1;filter:blur(0);transform:translateY(0)}}
@keyframes revealDown{from{opacity:0;filter:blur(6px);transform:translateY(-40px)}to{opacity:1;filter:blur(0);transform:translateY(0)}}
@keyframes revealLeft{from{opacity:0;filter:blur(6px);transform:translateX(-60px)}to{opacity:1;filter:blur(0);transform:translateX(0)}}
@keyframes revealRight{from{opacity:0;filter:blur(6px);transform:translateX(60px)}to{opacity:1;filter:blur(0);transform:translateX(0)}}
@keyframes revealScale{from{opacity:0;filter:blur(8px);transform:scale(0.88)}to{opacity:1;filter:blur(0);transform:scale(1)}}
@keyframes revealFade{from{opacity:0;filter:blur(6px)}to{opacity:1;filter:blur(0)}}
@keyframes revealChar{from{opacity:0;filter:blur(12px);transform:translateY(20px) scale(0.9)}to{opacity:1;filter:blur(0);transform:translateY(0) scale(1)}}
@keyframes pulse2{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.5);opacity:0}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes float1{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-14px) rotate(1deg)}}
@keyframes float2{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-10px) rotate(-1.5deg)}}
@keyframes float3{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes scrollLine{0%{transform:translateY(-100%)}50%{transform:translateY(100%)}100%{transform:translateY(-100%)}}
@keyframes slideWord{0%{opacity:0;transform:translateY(100%)}10%{opacity:1;transform:translateY(0)}30%{opacity:1;transform:translateY(0)}40%{opacity:0;transform:translateY(-100%)}100%{opacity:0;transform:translateY(-100%)}}
.hero-float-1{animation:float1 6s ease-in-out infinite}
.hero-float-2{animation:float2 7s ease-in-out infinite .5s}
.hero-float-3{animation:float3 5s ease-in-out infinite 1s}
.hero-visual-card{transition:all .4s cubic-bezier(.16,1,.3,1)}
.hero-visual-card:hover{transform:translateY(-6px) scale(1.02)!important;box-shadow:0 20px 50px rgba(0,0,0,0.1)!important}

/* base */
*{scrollbar-width:thin;scrollbar-color:rgba(0,0,0,0.08) transparent;box-sizing:border-box}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.08);border-radius:2px}
::selection{background:rgba(160,28,45,0.15);color:#1A1714}
html{scroll-behavior:smooth}

/* ═══ HOVER & FOCUS CLASSES ═══ */

/* nav links */
.nav-link{color:#8A857F;font-size:0.8rem;text-decoration:none;font-weight:500;letter-spacing:0.02em;transition:color .3s}
.nav-link:hover{color:#1A1714}

/* nav cta */
.nav-cta{border:1px solid rgba(0,0,0,0.14);color:#1A1714;padding:8px 20px;border-radius:100px;font-weight:600;font-size:0.75rem;text-decoration:none;letter-spacing:0.04em;transition:all .3s;cursor:pointer;background:transparent}
.nav-cta:hover{background:#A01C2D;border-color:#A01C2D;color:#fff}

/* primary cta (hero) */
.btn-primary{border:1px solid rgba(0,0,0,0.12);color:#1A1714;padding:14px 36px;border-radius:100px;background:rgba(0,0,0,0.03);font-weight:600;font-size:0.85rem;text-decoration:none;cursor:pointer;transition:all .35s cubic-bezier(.16,1,.3,1)}
.btn-primary:hover{background:#A01C2D;border-color:#A01C2D;color:#fff;transform:translateY(-2px);box-shadow:0 8px 32px rgba(160,28,45,0.2)}

/* ghost cta */
.btn-ghost{color:#8A857F;padding:14px 36px;border-radius:100px;font-weight:500;font-size:0.85rem;text-decoration:none;cursor:pointer;transition:all .3s;border:none;background:none}
.btn-ghost:hover{color:#A01C2D}
.btn-ghost:hover .arrow{transform:translateX(4px)}
.btn-ghost .arrow{display:inline-block;transition:transform .3s}

/* card link */
.card-link{display:inline-flex;align-items:center;gap:6px;font-weight:600;font-size:0.78rem;text-decoration:none;letter-spacing:0.03em;transition:all .3s;cursor:pointer}
.card-link:hover{gap:10px}
.card-link.accent{color:#C8354A}
.card-link.accent:hover{color:#A01C2D}
.card-link.dim{color:#8A857F}
.card-link.dim:hover{color:#1A1714}

/* service grid card */
.svc-card{background:#fff;border:1px solid rgba(0,0,0,0.07);border-radius:10px;padding:24px 20px;transition:all .35s cubic-bezier(.16,1,.3,1);cursor:default}
.svc-card:hover{background:#FDFCFA;border-color:rgba(0,0,0,0.12);transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.06)}
.svc-card:hover .svc-icon{opacity:1;transform:scale(1.1)}
.svc-icon{opacity:0.6;transition:all .35s;transform:scale(1)}

/* process step */
.process-step{padding:32px 24px;position:relative;transition:all .4s cubic-bezier(.16,1,.3,1);cursor:default;border-radius:8px}
.process-step:hover{background:rgba(0,0,0,0.015)}
.process-step:hover .step-num{color:rgba(200,53,74,0.3)!important}
.process-step:hover .step-title{color:#A01C2D!important}
.step-num{transition:color .35s}
.step-title{transition:color .35s}

/* main service card */
.main-card{transition:all .45s cubic-bezier(.16,1,.3,1);cursor:default}
.main-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.08)}

/* direction cards */
.dir-card{transition:all .35s cubic-bezier(.16,1,.3,1)!important}
.dir-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.06);border-color:rgba(0,0,0,0.12)!important}

/* contact links */
.contact-link{display:flex;align-items:center;gap:14px;text-decoration:none;transition:all .3s;cursor:pointer}
.contact-link:hover{transform:translateX(6px)}
.contact-link:hover .contact-icon{border-color:rgba(160,28,45,0.2);background:rgba(160,28,45,0.05)}
.contact-icon{transition:all .3s}

/* submit button */
.btn-submit{border:none;color:#fff;padding:16px 32px;border-radius:100px;background:linear-gradient(135deg,#A01C2D,#C8354A);font-weight:700;font-size:0.88rem;cursor:pointer;letter-spacing:0.04em;transition:all .4s cubic-bezier(.16,1,.3,1);width:100%;box-shadow:0 4px 20px rgba(160,28,45,0.35)}
.btn-submit:hover:not(:disabled){background:linear-gradient(135deg,#8a1725,#B02A3E);transform:translateY(-2px);box-shadow:0 10px 36px rgba(160,28,45,0.5)}
.btn-submit:disabled{opacity:0.5;cursor:not-allowed}

/* configurator chips */
.cfg-chip:hover{transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,0.06)}

/* footer */
.footer-nav-link:hover{color:rgba(255,255,255,0.85)!important}

/* input focus */
.form-input{width:100%;padding:13px 16px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.08);border-radius:10px;color:#1A1714;font-size:0.88rem;outline:none;transition:all .3s}
.form-input:focus{border-color:rgba(160,28,45,0.3);background:#fff;box-shadow:0 0 0 3px rgba(160,28,45,0.06)}
.form-input::placeholder{color:#B0AAA3}

/* case card — image-only, overlay on hover */
.case-card-new{position:relative;overflow:hidden;border-radius:16px;cursor:pointer;transition:all .5s cubic-bezier(.16,1,.3,1)}
.case-card-new:hover{transform:translateY(-6px);box-shadow:0 24px 64px rgba(0,0,0,0.12)}
.case-card-new .case-overlay-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:36px;opacity:0;transition:all .45s cubic-bezier(.16,1,.3,1);background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.4) 50%,rgba(0,0,0,0.05) 100%)}
.case-card-new:hover .case-overlay-content{opacity:1}
.case-card-new .case-img-inner{transition:transform .6s cubic-bezier(.16,1,.3,1)}
.case-card-new:hover .case-img-inner{transform:scale(1.05)}
.case-card-new .case-arrow-btn{transform:translateY(12px);opacity:0;transition:all .4s cubic-bezier(.16,1,.3,1) .1s}
.case-card-new:hover .case-arrow-btn{transform:translateY(0);opacity:1}
.case-card-link{display:block;text-decoration:none!important}

/* footer */
.footer-logo:hover .footer-dot{opacity:1!important;color:#C8354A!important}
.footer-dot{transition:opacity .3s}

/* reduced motion */
@media(prefers-reduced-motion:reduce){
  *{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}
  .hero-float-1,.hero-float-2,.hero-float-3{animation:none!important}
}
/* tablet breakpoint */
@media(max-width:1024px){
  .hero-grid{gridTemplateColumns:1fr!important;gap:40px!important}
  .services-split{grid-template-columns:1fr!important}
  .process-grid{grid-template-columns:1fr 1fr!important}
  .nav-links{gap:16px!important}
}
/* responsive */
@media(max-width:768px){
  .grid-2{grid-template-columns:1fr!important}
  .grid-4{grid-template-columns:1fr 1fr!important}
  .hero-heading{font-size:2rem!important}
  .section-heading{font-size:1.5rem!important}
  .process-grid{grid-template-columns:1fr 1fr!important}
  .contact-grid{grid-template-columns:1fr!important}
  .contact-card-wrap{padding:36px 24px!important}
  .footer-top{grid-template-columns:1fr!important;gap:32px!important}
  .footer-bottom{flex-direction:column!important;gap:16px!important;align-items:flex-start!important}
  .cases-masonry{grid-template-columns:1fr!important}
  .cases-masonry>div:last-child{padding-top:0!important}
  .case-card-new{height:300px!important}
  .stat-grid{grid-template-columns:repeat(3,1fr)!important;gap:16px!important}
  .services-split{grid-template-columns:1fr!important}
  .hero-grid{grid-template-columns:1fr!important;gap:32px!important}
  .hero-right{min-height:320px!important;padding-top:20px!important}
  .hero-right .hero-visual-card{position:relative!important;top:auto!important;bottom:auto!important;left:auto!important;right:auto!important;width:100%!important;max-width:320px!important;margin-bottom:12px!important}
  .dir-inner-grid{grid-template-columns:1fr!important}
  .nav-links{display:none!important}
  .nav-burger{display:flex!important}
  .nav-mobile-menu{display:flex!important}
  .dev-banner{font-size:0.68rem!important;padding:8px 12px!important}
}
@media(max-width:480px){
  .grid-4{grid-template-columns:1fr!important}
  .process-grid{grid-template-columns:1fr!important}
  .stat-grid{grid-template-columns:1fr!important;gap:12px!important}
  .hero-heading{font-size:1.7rem!important}
}
`;

/* ═══════════════════════ SCROLL ANIMATION SYSTEM ═══════════════════════ */
function useInView(opts = {}) {
  const { threshold = 0.08, rootMargin = "0px 0px -40px 0px" } = opts;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);
  return [ref, visible];
}

function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return scrollY;
}

function Reveal({ children, style: extra, delay = 0, type = "up", duration = 0.8, tag: Tag = "div", ...props }) {
  const [ref, visible] = useInView();
  const animMap = { up: "revealUp", down: "revealDown", left: "revealLeft", right: "revealRight", scale: "revealScale", fade: "revealFade" };
  return (
    <Tag ref={ref} style={{
      opacity: visible ? 1 : 0,
      animation: visible ? `${animMap[type] || "revealUp"} ${duration}s cubic-bezier(.16,1,.3,1) ${delay}ms both` : "none",
      ...extra,
    }} {...props}>{children}</Tag>
  );
}

/* ───── heading with word-by-word reveal ───── */
function RevealHeading({ children, delay = 0, style: extra, className, tag: Tag = "h2" }) {
  const [ref, visible] = useInView({ threshold: 0.15 });
  const text = typeof children === "string" ? children : "";
  if (!text) return <Tag ref={ref} className={className} style={extra}>{children}</Tag>;
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} style={extra}>
      {words.map((word, i) => (
        <span key={i} style={{
          display: "inline-block", marginRight: "0.25em",
          opacity: visible ? 1 : 0,
          filter: visible ? "blur(0)" : "blur(10px)",
          transform: visible ? "translateY(0)" : "translateY(25px)",
          transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${delay + i * 60}ms`,
        }}>{word}</span>
      ))}
    </Tag>
  );
}

/* ───── paragraph with line reveal ───── */
function RevealParagraph({ children, delay = 0, style: extra }) {
  const [ref, visible] = useInView({ threshold: 0.15 });
  return (
    <p ref={ref} style={{
      ...extra,
      opacity: visible ? 1 : 0,
      filter: visible ? "blur(0)" : "blur(6px)",
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>{children}</p>
  );
}

/* ───── container ───── */
const cx = { maxWidth: 1140, margin: "0 auto", padding: "0 32px", position: "relative" };

/* ───── animated divider ───── */
function Divider() {
  const [ref, visible] = useInView({ threshold: 0.5 });
  return (
    <div ref={ref} style={{ maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
      <div style={{
        height: 1, background: V.divider,
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 1.2s cubic-bezier(.16,1,.3,1)",
      }} />
    </div>
  );
}

/* ───── animated section label ───── */
function Label({ num, text }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
      <span style={{
        fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700, color: V.muted,
        opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-10px)",
        transition: "all 0.6s cubic-bezier(.16,1,.3,1)",
      }}>{num}</span>
      <span style={{
        height: 1, background: V.accent, opacity: 0.35,
        width: visible ? 24 : 0,
        transition: "width 0.8s cubic-bezier(.16,1,.3,1) 0.15s",
      }} />
      <span style={{
        fontFamily: V.heading, fontSize: "0.6rem", fontWeight: 700,
        letterSpacing: "0.18em", textTransform: "uppercase", color: V.dim,
        opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(15px)",
        transition: "all 0.7s cubic-bezier(.16,1,.3,1) 0.3s",
      }}>{text}</span>
    </div>
  );
}

/* ───── counter ───── */
function Counter({ value, suffix = "", duration = 1800 }) {
  const [ref, visible] = useInView();
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!visible) return;
    const num = parseInt(value);
    if (isNaN(num)) { setDisplay(value); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(num * ease).toString());
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, value, duration]);
  return <span ref={ref}>{display}{suffix}</span>;
}

function SvcIcon({ name, size = 28 }) {
  const s = { width: size, height: size, flexShrink: 0, objectFit: "contain" };
  const logos = {
    google: "https://cdn.simpleicons.org/googleads",
    meta: "https://cdn.simpleicons.org/meta",
    hubspot: "https://cdn.simpleicons.org/hubspot",
    figma: "https://cdn.simpleicons.org/figma",
  };
  return logos[name] ? <img src={logos[name]} alt={name} style={s} loading="lazy" /> : <span style={s}>{name}</span>;
}

function DigitalGrid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => {
      c.width = c.offsetWidth * devicePixelRatio;
      c.height = c.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    const cellSize = 32;
    const color1 = "rgba(160,28,45,0.08)";
    const color2 = "rgba(160,28,45,0.04)";
    const draw = () => {
      ctx.fillStyle = "#FAF8F5";
      ctx.fillRect(0, 0, c.offsetWidth, c.offsetHeight);
      const cols = Math.ceil(c.offsetWidth / cellSize);
      const rows = Math.ceil(c.offsetHeight / cellSize);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const isEven = (i + j) % 2 === 0;
          ctx.strokeStyle = isEven ? color1 : color2;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    };
    draw();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.5 }} />;
}

function Nav({ t, locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const otherLocale = locale === "en" ? "ru" : "en";
  useEffect(() => {
    const h = () => setScrolled(scrollY > 38);
    addEventListener("scroll", h, { passive: true });
    return () => removeEventListener("scroll", h);
  }, []);
  return (
    <>
      <nav role="navigation" aria-label="Main navigation" style={{
        position: "fixed", top: scrolled ? 0 : 38, left: 0, right: 0, zIndex: 100,
        height: 64, display: "flex", alignItems: "center",
        background: scrolled || mobileOpen ? "rgba(250,248,245,0.96)" : "transparent",
        backdropFilter: scrolled || mobileOpen ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${V.border}` : "1px solid transparent",
        transition: "all .5s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ ...cx, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: V.heading, fontWeight: 900, fontSize: "1.05rem", color: V.bright, letterSpacing: "-0.04em", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="24" height="24" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <rect width="256" height="256" rx="42.6667" fill="#DF5440"/>
              <path d="M87.0069 78.4321L172.234 53.5611L172.234 53.5611C196.129 46.5881 208.077 43.1017 210.843 48.0941C213.609 53.0866 204.317 61.367 185.734 77.9279L153.845 106.347C146.512 112.882 142.846 116.15 143.738 119.537C144.63 122.925 149.443 123.966 159.07 126.049C170.467 128.514 176.165 129.747 177.353 133.831C178.542 137.916 174.405 142.001 166.132 150.173L128.971 186.878C114.297 201.372 106.96 208.619 102.485 206.586C101.963 206.348 101.47 206.048 101.02 205.693C97.1598 202.65 100.234 192.806 106.382 173.118C108.3 166.976 109.259 163.905 107.908 161.695C107.739 161.418 107.546 161.156 107.333 160.912C105.626 158.963 102.409 158.963 95.9739 158.963H91.6315C76.3852 158.963 68.7621 158.963 64.4942 154.069C60.2262 149.174 61.2642 141.622 63.34 126.518L66.7154 101.958C67.9389 93.0553 68.5507 88.604 71.309 85.4061C74.0673 82.2081 78.3805 80.9494 87.0069 78.4321Z" fill="white"/>
            </svg>
            <span>BANKAI<span style={{ color: V.accent, margin: "0 0.01em" }}>.</span>AGENCY</span>
          </div>
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28, fontFamily: V.body }}>
            <a href="#services" className="nav-link">{t.nav.services}</a>
            <a href="#process" className="nav-link">{t.nav.process}</a>
            <a href="#cases" className="nav-link">{t.nav.cases}</a>
            <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Link href="/ru" className="nav-link" style={{ fontWeight: 700, fontSize: "0.7rem", padding: "4px 6px", borderRadius: 4, color: locale === "ru" ? V.bright : V.muted, background: locale === "ru" ? "rgba(0,0,0,0.04)" : "transparent" }}>RU</Link>
              <span style={{ width: 1, height: 14, background: V.border }} />
              <Link href="/en" className="nav-link" style={{ fontWeight: 700, fontSize: "0.7rem", padding: "4px 6px", borderRadius: 4, color: locale === "en" ? V.bright : V.muted, background: locale === "en" ? "rgba(0,0,0,0.04)" : "transparent" }}>EN</Link>
            </div>
            <a href="#contact" className="nav-cta" style={{ fontFamily: V.heading }}>{t.nav.contact}</a>
          </div>
          <button className="nav-burger" aria-label={t.nav.openMenu} onClick={() => setMobileOpen(!mobileOpen)} style={{
            display: "none", background: "none", border: "none", cursor: "pointer", padding: 8,
            flexDirection: "column", gap: 5, alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ display: "block", width: 22, height: 2, background: V.bright, borderRadius: 1, transition: "all .3s", transform: mobileOpen ? "rotate(45deg) translateY(3.5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: V.bright, borderRadius: 1, transition: "all .3s", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: V.bright, borderRadius: 1, transition: "all .3s", transform: mobileOpen ? "rotate(-45deg) translateY(-3.5px)" : "none" }} />
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div style={{
          position: "fixed", top: scrolled ? 64 : 102, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: "rgba(250,248,245,0.98)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
          fontFamily: V.body,
        }}>
          {[
            { href: "#services", label: t.nav.services },
            { href: "#process", label: t.nav.process },
            { href: "#cases", label: t.nav.cases },
            { href: "#contact", label: t.nav.contactMobile },
          ].map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
              fontFamily: V.heading, fontSize: "1.4rem", fontWeight: 700,
              color: V.bright, textDecoration: "none", letterSpacing: "-0.02em",
              transition: "color .3s",
            }}>{item.label}</a>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Link href="/ru" onClick={() => setMobileOpen(false)} style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 700, color: locale === "ru" ? V.accent : V.muted, textDecoration: "none" }}>RU</Link>
            <span style={{ width: 1, background: V.border }} />
            <Link href="/en" onClick={() => setMobileOpen(false)} style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 700, color: locale === "en" ? V.accent : V.muted, textDecoration: "none" }}>EN</Link>
          </div>
        </div>
      )}
    </>
  );
}

function NetworkCanvas() {
  const canvasRef = useRef(null);
  const raf = useRef(null);
  const tRef = useRef(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, dpr;

    const handleScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const resize = () => {
      dpr = devicePixelRatio;
      w = c.offsetWidth;
      h = c.offsetHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const particles = [];
    for (let i = 0; i < 14; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      tRef.current += 0.004;
      const T = tRef.current;
      const scrollFactor = Math.min(scrollRef.current / 600, 1);

      particles.forEach((p, i) => {
        // Add scroll-driven drift
        p.x += p.vx + Math.sin(T + p.phase) * 0.15;
        p.y += p.vy + scrollFactor * 0.3;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const alpha = (0.2 + Math.sin(T + i) * 0.1) * (1 - scrollFactor * 0.5);
        ctx.fillStyle = `rgba(160,28,45,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180 - scrollFactor * 60;
          if (d < maxDist) {
            ctx.strokeStyle = `rgba(160,28,45,${0.08 * (1 - d / maxDist) * (1 - scrollFactor * 0.5)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

function RotatingWord({ words }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % words.length), 2800); return () => clearInterval(t); }, [words.length]);
  const longest = words.reduce((a, b) => a.length > b.length ? a : b);
  return (
    <span style={{ display: "inline-block", position: "relative", height: "1.1em", overflow: "hidden", verticalAlign: "bottom" }}>
      <span style={{ display: "block", visibility: "hidden", height: 0, overflow: "hidden" }}>{longest}</span>
      {words.map((w, i) => (
        <span key={w} style={{
          display: "block", position: "absolute", top: 0, left: 0, whiteSpace: "nowrap",
          color: V.accent,
          transition: "all .5s cubic-bezier(.16,1,.3,1)",
          transform: i === idx ? "translateY(0)" : i === (idx - 1 + words.length) % words.length ? "translateY(-110%)" : "translateY(110%)",
          opacity: i === idx ? 1 : 0,
        }}>{w}</span>
      ))}
    </span>
  );
}

function Hero({ t, locale }) {
  const scrollY = useScrollY();
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const scrollRatio = Math.min(scrollY / vh, 1);

  // Parallax speeds for different layers
  const textY = scrollY * 0.4;
  const textOpacity = Math.max(0, 1 - scrollRatio * 1.5);
  const cardsY = scrollY * 0.15;
  const cardsOpacity = Math.max(0, 1 - scrollRatio * 1.2);
  const bgScale = 1 + scrollRatio * 0.1;
  const statsOpacity = Math.max(0, 1 - scrollRatio * 2);

  return (
    <section style={{ padding: "0", position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${bgScale})`, transformOrigin: "center center", transition: "none" }}>
        <DigitalGrid />
      </div>

      {/* Large ambient gradient orb */}
      <div style={{
        position: "absolute", top: "10%", right: "-5%", width: "60vw", height: "60vw", maxWidth: 800, maxHeight: 800,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(160,28,45,0.06) 0%, rgba(160,28,45,0.02) 40%, transparent 70%)",
        filter: "blur(40px)",
        transform: `translateY(${scrollY * 0.08}px) scale(${1 + Math.sin(Date.now() * 0.001) * 0.02})`,
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ ...cx, zIndex: 1, position: "relative", width: "100%", paddingTop: 120, paddingBottom: 60 }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 0.8fr", gap: 48, alignItems: "center" }}>
          {/* Text layer - moves faster on scroll */}
          <div style={{
            transform: `translateY(-${textY}px)`,
            opacity: textOpacity,
            willChange: "transform, opacity",
          }}>
            <Reveal type="fade" duration={1.2}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px",
                background: V.accentDim, border: `1px solid rgba(160,28,45,0.1)`,
                borderRadius: 100, marginBottom: 40,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: V.accentLit, position: "relative", display: "block" }}>
                  <span style={{ position: "absolute", inset: -3, borderRadius: "50%", border: `1.5px solid ${V.accentLit}`, animation: "pulse2 2.5s ease-out infinite" }} />
                </span>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: V.text, letterSpacing: "0.04em" }}>
                  {t.hero.badge}
                </span>
              </div>
            </Reveal>

            <Reveal delay={150} duration={1}>
              <h1 className="hero-heading" style={{
                fontFamily: V.heading, fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)",
                fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.05em",
                color: V.bright, marginBottom: 28,
              }}>
                {t.hero.heading[0]}<br />{t.hero.heading[1]}<br /><RotatingWord words={t.hero.rotatingWords} />
              </h1>
            </Reveal>

            <Reveal delay={300} type="fade" duration={1}>
              <p style={{ fontSize: "1.02rem", color: V.dim, maxWidth: 440, lineHeight: 1.75, marginBottom: 40 }}>
                {t.hero.sub}
              </p>
            </Reveal>

            <Reveal delay={450} type="up">
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 56 }}>
                <a href="#contact" className="btn-primary" style={{ fontFamily: V.body }}>{t.hero.cta}</a>
                <a href="#cases" className="btn-ghost" style={{ fontFamily: V.body }}>{t.hero.casesLink} <span className="arrow">→</span></a>
              </div>
            </Reveal>

            <Reveal delay={600} type="fade" duration={1.2}>
              <div className="stat-grid" style={{
                display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 48,
                paddingTop: 28, borderTop: `1px solid ${V.divider}`, maxWidth: 420,
                opacity: statsOpacity,
              }}>
                {t.hero.stats.map((stat, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: V.heading, fontSize: "1.5rem", fontWeight: 800, color: V.bright, letterSpacing: "-0.04em", marginBottom: 2 }}>
                      {stat.isMoney ? <><span style={{ fontSize: "0.85em" }}>$</span><Counter value={stat.v} suffix={stat.s} /></> : <Counter value={stat.v} suffix={stat.s} />}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: V.dim, fontWeight: 500 }}>{stat.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Cards layer - moves slower on scroll, creating depth */}
          <div className="hero-right" style={{
            position: "relative", minHeight: 480, paddingTop: 60,
            transform: `translateY(-${cardsY}px)`,
            opacity: cardsOpacity,
            willChange: "transform, opacity",
          }}>
            <NetworkCanvas />
            <Reveal delay={400} type="scale" duration={1}>
              <div className="hero-float-1 hero-visual-card" style={{
                position: "absolute", top: 20, right: 0, width: 280, zIndex: 1,
                background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
                borderRadius: 16, padding: "28px 24px", boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                cursor: "default",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ padding: "3px 8px", background: "rgba(233,69,96,0.15)", borderRadius: 4, fontSize: "0.5rem", fontWeight: 700, color: "#e94560", letterSpacing: "0.1em" }}>{t.hero.card1.tag}</span>
                  <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>SaaS · Data Protection</span>
                </div>
                <div style={{ fontFamily: V.heading, fontSize: "0.95rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>Object First → Veeam</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 16 }}>{t.hero.card1.desc}</div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1.2rem", fontWeight: 900, color: "#e94560" }}>EXIT</div><div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>acquired</div></div>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1.2rem", fontWeight: 900, color: "#fff" }}>2+</div><div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>{t.hero.card1.years}</div></div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={550} type="scale" duration={1}>
              <div className="hero-float-2 hero-visual-card" style={{
                position: "absolute", top: 200, left: 10, width: 260, zIndex: 1,
                background: "linear-gradient(135deg, #111111, #262626)",
                borderRadius: 16, padding: "24px 22px", boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                cursor: "default",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ padding: "3px 8px", background: "rgba(79,172,254,0.12)", borderRadius: 4, fontSize: "0.5rem", fontWeight: 700, color: "#4facfe", letterSpacing: "0.1em" }}>$14.6M</span>
                  <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>Performance + AI</span>
                </div>
                <div style={{ fontFamily: V.heading, fontSize: "0.9rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>SOS Moving → AI Moving</div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: 14 }}>{t.hero.card2.desc}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[{ v: t.hero.card2.orders, l: t.hero.card2.orders },{ v: t.hero.card2.budget, l: t.hero.card2.budget }].map((m, j) => (
                    <div key={j}><div style={{ fontFamily: V.heading, fontSize: "0.85rem", fontWeight: 800, color: "#4facfe" }}>{m.v}</div><div style={{ fontSize: "0.48rem", color: "rgba(255,255,255,0.3)" }}>{m.l}</div></div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={700} type="scale" duration={1}>
              <div className="hero-float-3 hero-visual-card" style={{
                position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", width: 240, zIndex: 1,
                background: V.card,
                border: `1px solid ${V.border}`,
                borderRadius: 16, padding: "22px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                cursor: "default",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ padding: "3px 8px", background: "rgba(160,28,45,0.06)", borderRadius: 4, fontSize: "0.5rem", fontWeight: 700, color: V.accent, letterSpacing: "0.1em" }}>REVENUE SHARE</span>
                </div>
                <div style={{ fontFamily: V.heading, fontSize: "0.85rem", fontWeight: 800, color: V.bright, marginBottom: 4 }}>AK Cabinet Craft</div>
                <div style={{ fontSize: "0.68rem", color: V.dim, lineHeight: 1.5, marginBottom: 12 }}>{t.hero.card3.desc}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 900, color: V.accent }}>3%</div><div style={{ fontSize: "0.48rem", color: V.muted }}>{t.hero.card3.revenue}</div></div>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 900, color: V.bright }}>Full</div><div style={{ fontSize: "0.48rem", color: V.muted }}>{t.hero.card3.cycle}</div></div>
                </div>
              </div>
            </Reveal>

            <div style={{ position: "absolute", top: 160, right: 280, width: 8, height: 8, borderRadius: "50%", background: V.accentLit, opacity: 0.3, animation: "float1 4s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: 100, left: 0, width: 6, height: 6, borderRadius: "50%", background: V.accent, opacity: 0.2, animation: "float2 5s ease-in-out infinite" }} />
            <div style={{ position: "absolute", top: 60, left: 100, width: 4, height: 4, borderRadius: "50%", background: V.muted, opacity: 0.3, animation: "float3 6s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: Math.max(0, 1 - scrollRatio * 4),
        transition: "opacity 0.3s",
      }}>
        <div style={{ fontSize: "0.6rem", color: V.muted, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase" }}>scroll</div>
        <div style={{
          width: 1, height: 28, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            background: `linear-gradient(to bottom, ${V.accent}, transparent)`,
            animation: "scrollLine 2s ease-in-out infinite",
          }} />
        </div>
      </div>
    </section>
  );
}

function Marquee({ t }) {
  const [ref, visible] = useInView({ threshold: 0.3 });
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = (vh - rect.top) / (vh + rect.height);
        setOffset(progress * 300);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = t.marquee;
  const row = words.map((w, i) => (
    <span key={i} style={{
      display: "inline-block", whiteSpace: "nowrap", marginRight: 60,
      fontFamily: V.heading, fontSize: "clamp(1rem, 2.5vw, 2.2rem)",
      fontWeight: 900, letterSpacing: "-0.03em", color: V.bright,
    }}>
      {w}
    </span>
  ));
  return (
    <section ref={sectionRef} style={{ padding: "60px 0", overflow: "hidden", background: V.bg, position: "relative", zIndex: 1 }}>
      <div ref={ref} style={{
        display: "flex", opacity: visible ? 1 : 0.4, transition: "opacity 1s ease",
        transform: `translateX(-${offset}px)`,
      }}>
        {row}
        {row}
      </div>
    </section>
  );
}

function MainServices({ t }) {
  return (
    <section id="services" style={{ padding: "120px 0 80px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal type="fade"><Label num="01" text={t.mainServices.label} /></Reveal>
        <RevealHeading delay={100} className="section-heading" style={{
          fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 800, marginBottom: 56,
        }}>{t.mainServices.heading}</RevealHeading>

        <div className="services-split" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20, alignItems: "stretch" }}>
          <Reveal delay={180} type="left" duration={0.9}>
            <div className="main-card" style={{
              background: V.card,
              border: `1px solid rgba(160,28,45,0.1)`,
              borderRadius: V.radius, padding: "48px 40px",
              position: "relative", overflow: "hidden",
              height: "100%", display: "flex", flexDirection: "column",
              boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
                background: `linear-gradient(90deg, transparent, rgba(160,28,45,0.2), transparent)`,
              }} />

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                <span style={{
                  padding: "5px 12px", background: V.accentDim, borderRadius: 6,
                  fontSize: "0.6rem", fontWeight: 700, color: V.accent, letterSpacing: "0.1em",
                }}>{t.mainServices.partnerBadge}</span>
                <span style={{
                  padding: "5px 12px", background: "rgba(0,0,0,0.03)", borderRadius: 6,
                  fontSize: "0.6rem", fontWeight: 600, color: V.dim, letterSpacing: "0.06em",
                }}>{t.mainServices.revShareBadge}</span>
              </div>

              <h3 style={{ fontFamily: V.heading, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 900, color: V.bright, marginBottom: 10, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {t.mainServices.fullCycleTitle.split("\n").map((line, i) => (
                  <span key={i}>{line}{i === 0 ? <br /> : ""}</span>
                ))}
              </h3>
              <div style={{ fontSize: "0.8rem", color: V.accent, fontWeight: 700, marginBottom: 20, letterSpacing: "0.02em" }}>
                {t.mainServices.fullCycleSub}
              </div>
              <p style={{ fontSize: "0.88rem", color: V.text, lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
                {t.mainServices.fullCycleDesc}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36, marginTop: "auto" }}>
                {t.mainServices.fullCycleFeatures.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: V.accent, flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: "0.82rem", color: V.dim, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              <a href="#contact" className="card-link accent" style={{ fontSize: "0.82rem" }}>
                {t.mainServices.partnershipCta} <span>→</span>
              </a>
            </div>
          </Reveal>

          <div className="dir-inner-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {t.directions.map((d, i) => (
              <Reveal key={i} delay={250 + i * 80} type="scale" duration={0.7}>
                <div className="dir-card" style={{
                  background: V.card,
                  border: `1px solid ${V.border}`,
                  borderRadius: V.radius, padding: "28px 24px",
                  height: "100%", display: "flex", flexDirection: "column",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                  transition: "all .35s cubic-bezier(.16,1,.3,1)",
                  cursor: "default",
                }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: 16, lineHeight: 1 }}>{d.icon}</div>
                  <h4 style={{ fontFamily: V.heading, fontSize: "0.95rem", fontWeight: 800, color: V.bright, marginBottom: 8, letterSpacing: "-0.02em" }}>{d.title}</h4>
                  <p style={{ fontSize: "0.78rem", color: V.text, lineHeight: 1.65, marginBottom: 16, flex: 1 }}>{d.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {d.tags.map((tag, j) => (
                      <span key={j} style={{
                        padding: "3px 8px", borderRadius: 4, fontSize: "0.58rem", fontWeight: 600,
                        background: "rgba(0,0,0,0.03)", color: V.dim, letterSpacing: "0.02em",
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={500} type="fade">
          <div style={{
            display: "flex", alignItems: "center", gap: 20, marginTop: 40, padding: "20px 28px",
            background: "rgba(0,0,0,0.015)", borderRadius: V.radiusSm, border: `1px solid ${V.divider}`,
          }}>
            <div style={{ width: 3, height: 40, borderRadius: 2, background: V.accent, flexShrink: 0 }} />
            <p style={{ fontSize: "0.82rem", color: V.dim, lineHeight: 1.65, margin: 0 }}>
              <strong style={{ color: V.bright, fontWeight: 700 }}>{t.mainServices.subTextFull}</strong> — {t.mainServices.subTextFullDesc}<br/><strong style={{ color: V.bright, fontWeight: 700 }}>{t.mainServices.subTextSingle}</strong> — {t.mainServices.subTextSingleDesc}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesGrid({ t }) {
  return (
    <section style={{ padding: "80px 0 120px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal type="fade"><Label num="02" text={t.servicesGrid.label} /></Reveal>
        <RevealHeading delay={100} className="section-heading" style={{
          fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 900, marginBottom: 56,
        }}>{t.servicesGrid.heading}</RevealHeading>

        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {t.servicesGrid.items.map((item, i) => (
            <Reveal key={i} delay={150 + i * 60} type="up" duration={0.7}>
              <div className="svc-card">
                <div style={{ marginBottom: 16 }}>
                  <SvcIcon name={item.icon} size={32} />
                </div>
                <h4 style={{ fontFamily: V.heading, fontSize: "0.9rem", fontWeight: 800, color: V.bright, marginBottom: 8, letterSpacing: "-0.02em" }}>{item.t}</h4>
                <p style={{ fontSize: "0.78rem", color: V.dim, lineHeight: 1.65 }}>{item.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ t }) {
  return (
    <section id="process" style={{ padding: "100px 0 120px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal type="fade"><Label num="03" text={t.process.label} /></Reveal>
        <RevealHeading delay={100} className="section-heading" style={{
          fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, marginBottom: 56,
        }}>{t.process.heading}</RevealHeading>

        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {t.process.steps.map((step, i) => (
            <Reveal key={i} delay={180 + i * 80} type="up" duration={0.7}>
              <div className="process-step">
                <div className="step-num" style={{ fontFamily: V.heading, fontSize: "2.2rem", fontWeight: 900, color: V.accent, marginBottom: 12, lineHeight: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="step-title" style={{ fontFamily: V.heading, fontSize: "0.95rem", fontWeight: 800, color: V.bright, marginBottom: 12 }}>{step.t}</h4>
                <p style={{ fontSize: "0.78rem", color: V.dim, lineHeight: 1.65 }}>{step.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseCard({ c, locale, delay }) {
  return (
    <Reveal delay={delay} type="scale" duration={0.8}>
      <Link href={`/${locale}/cases/${c.slug}`} className="case-card-link">
        <div className="case-card-new" style={{ height: 380, borderRadius: V.radius }}>
          <div className="case-img-inner" style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${c.color1}, ${c.color2}, ${c.color3})`,
            borderRadius: "inherit",
          }}>
            <div style={{ position: "absolute", top: "10%", right: "8%", width: "50%", height: "50%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}25, transparent 65%)` }} />
            <div style={{ position: "absolute", bottom: "12%", left: "5%", width: "35%", height: "35%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}18, transparent 70%)` }} />
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
          </div>
          <div style={{ position: "absolute", top: 24, left: 28, zIndex: 2 }}>
            <div style={{ fontFamily: V.heading, fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.02em" }}>{c.client}</div>
          </div>
          <div style={{ position: "absolute", top: 20, right: 24, zIndex: 2, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "8px 14px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontFamily: V.heading, fontSize: "1.1rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{c.result}</div>
            <div style={{ fontSize: "0.48rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginTop: 2 }}>{c.resultLabel}</div>
          </div>
          <div className="case-overlay-content">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {c.tag.split(" · ").map((tg, j) => (
                <span key={j} style={{ padding: "4px 10px", borderRadius: 4, fontSize: "0.52rem", fontWeight: 700, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em", backdropFilter: "blur(4px)" }}>{tg}</span>
              ))}
            </div>
            <h3 style={{ fontFamily: V.heading, fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1.15 }}>{c.client}</h3>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: 20, maxWidth: 400, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.desc}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 24 }}>
                {c.metrics.map((m, j) => (
                  <div key={j}>
                    <div style={{ fontFamily: V.heading, fontSize: "0.82rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 1 }}>{m.v}</div>
                    <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>{m.l}</div>
                  </div>
                ))}
              </div>
              <div className="case-arrow-btn" style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem", flexShrink: 0 }}>→</div>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

function Cases({ t, locale, cases }) {
  return (
    <section id="cases" style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal type="fade"><Label num="04" text={t.cases.label} /></Reveal>
        <RevealHeading delay={80} className="section-heading" style={{
          fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 700, marginBottom: 56,
        }}>{t.cases.heading}</RevealHeading>

        <div className="cases-masonry" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {cases.filter((_, i) => i % 2 === 0).map((c, i) => (
              <CaseCard key={c.slug} c={c} locale={locale} delay={120 + i * 160} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 80 }}>
            {cases.filter((_, i) => i % 2 === 1).map((c, i) => (
              <CaseCard key={c.slug} c={c} locale={locale} delay={200 + i * 160} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function useScrollProgress(ref, offset = 0.15) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * (1 - offset);
      const end = vh * offset;
      const raw = 1 - (rect.top - end) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [ref, offset]);
  return progress;
}

function Statement({ t }) {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef, 0.2);
  const allWords = [
    ...t.statement.dim1.split(" ").filter(Boolean).map(w => ({ word: w, color: V.muted })),
    ...t.statement.bright.split(" ").filter(Boolean).map(w => ({ word: w, color: V.bright })),
    ...t.statement.dim2.split(" ").filter(Boolean).map(w => ({ word: w, color: V.muted })),
  ];
  const totalWords = allWords.length;

  return (
    <section ref={sectionRef} style={{ padding: "140px 0", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <h2 style={{
          fontFamily: V.heading, fontSize: "clamp(1.5rem, 3vw, 2.3rem)",
          fontWeight: 800, lineHeight: 1.4, letterSpacing: "-0.03em", maxWidth: 850,
        }}>
          {allWords.map((item, i) => {
            const wordProgress = Math.max(0, Math.min(1, (progress * totalWords - i * 0.65) / 1));
            const opacity = Math.max(0.08, wordProgress);
            const blur = Math.max(0, (1 - wordProgress) * 10);
            const y = Math.max(0, (1 - wordProgress) * 18);
            return (
              <span key={i} style={{
                color: item.color,
                display: "inline-block", marginRight: "0.3em",
                opacity,
                filter: `blur(${blur}px)`,
                transform: `translateY(${y}px)`,
                transition: "all 0.15s ease-out",
              }}>{item.word}</span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}

function ContactBg() {
  const ref = useRef(null);
  const raf = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, dpr;

    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: 0.15 + Math.random() * 0.7,
      y: 0.15 + Math.random() * 0.7,
      r: 120 + Math.random() * 180,
      phase: (Math.PI * 2 / 6) * i,
      speed: 0.15 + Math.random() * 0.2,
      hue: 355 + Math.random() * 12,
      sat: 35 + Math.random() * 20,
      light: 75 + Math.random() * 15,
      alpha: 0.04 + Math.random() * 0.04,
    }));

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const rect = c.parentElement.getBoundingClientRect();
      w = rect.width; h = rect.height;
      c.width = w * dpr; c.height = h * dpr;
      c.style.width = w + "px"; c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); addEventListener("resize", resize);

    const draw = () => {
      tRef.current += 0.003;
      const T = tRef.current;
      ctx.clearRect(0, 0, w, h);

      for (const o of orbs) {
        const cx2 = (o.x + Math.sin(T * o.speed + o.phase) * 0.08) * w;
        const cy2 = (o.y + Math.cos(T * o.speed * 0.7 + o.phase) * 0.06) * h;
        const r = o.r + Math.sin(T * 0.5 + o.phase) * 30;
        const grd = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r);
        grd.addColorStop(0, `hsla(${o.hue}, ${o.sat}%, ${o.light}%, ${o.alpha})`);
        grd.addColorStop(0.5, `hsla(${o.hue}, ${o.sat - 10}%, ${o.light + 5}%, ${o.alpha * 0.5})`);
        grd.addColorStop(1, `hsla(${o.hue}, ${o.sat}%, ${o.light}%, 0)`);
        ctx.beginPath();
        ctx.arc(cx2, cy2, r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf.current); removeEventListener("resize", resize); };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", borderRadius: 24 }}>
      <canvas ref={ref} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

function Contact({ t }) {
  const serviceOptions = t.contact.serviceOptions;
  const revenueOptions = t.contact.revenueOptions;

  const [form, setForm] = useState({
    name: "", contact: "", niche: "", revenue: "", link: "", message: "", services: [],
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const toggleService = (s) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter(x => x !== s)
        : [...prev.services, s],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.contact) return;
    setSending(true);
    try {
      await fetch("https://formsubmit.co/ajax/agency.bankai@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          contact: form.contact,
          niche: form.niche || "—",
          revenue: form.revenue || "—",
          services: form.services.join(", ") || "—",
          link: form.link || "—",
          message: form.message || "—",
          _subject: `${t.contact.emailSubject} ${form.name} | ${form.niche || t.contact.emailSubjectSuffix}`,
        }),
      });
      setSent(true);
    } catch { setSent(true); }
    setSending(false);
  };

  const labelStyle = { fontSize: "0.62rem", color: V.muted, marginBottom: 6, display: "block", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 };

  return (
    <section id="contact" style={{ padding: "120px 0 140px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <div style={{ position: "relative", borderRadius: 24, padding: "64px 56px", overflow: "hidden", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", border: `1px solid ${V.border}`, boxShadow: "0 8px 48px rgba(0,0,0,0.06)" }} className="contact-card-wrap">
          <ContactBg />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56, alignItems: "start" }}>
              <div>
                <Reveal type="fade"><Label num="05" text={t.contact.label} /></Reveal>
                <RevealHeading delay={80} className="section-heading" style={{
                  fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
                  lineHeight: 1.1, letterSpacing: "-0.04em", color: V.bright, marginBottom: 16,
                }}>{t.contact.heading}</RevealHeading>
                <RevealParagraph delay={160} style={{ fontSize: "0.92rem", color: V.dim, lineHeight: 1.7, marginBottom: 44, maxWidth: 380 }}>
                  {t.contact.sub}
                </RevealParagraph>
                <Reveal delay={240} type="left">
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {[
                      { label: t.contact.emailLabel, value: "agency.bankai@gmail.com", href: "mailto:agency.bankai@gmail.com", icon: "https://cdn.simpleicons.org/gmail/EA4335" },
                      { label: t.contact.telegramLabel, value: "@may_work", href: "https://t.me/may_work", icon: "https://cdn.simpleicons.org/telegram/26A5E4" },
                    ].map((c, i) => (
                      <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="contact-link">
                        <div className="contact-icon" style={{
                          width: 36, height: 36, borderRadius: 8,
                          background: "rgba(0,0,0,0.02)", border: `1px solid ${V.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <img src={c.icon} alt={c.label} width="18" height="18" style={{ objectFit: "contain" }} loading="lazy" />
                        </div>
                        <div>
                          <div style={{ fontSize: "0.65rem", color: V.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 1 }}>{c.label}</div>
                          <div style={{ color: V.bright, fontWeight: 600, fontSize: "0.85rem" }}>{c.value}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </Reveal>
              </div>

              <Reveal delay={150} type="right" duration={0.9}>
                <div style={{ background: "rgba(255,255,255,0.85)", border: `1px solid ${V.border}`, borderRadius: V.radius, padding: "32px 28px", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
                  {sent ? (
                    <div style={{ textAlign: "center", padding: "44px 0" }}>
                      <div style={{ fontSize: "2rem", marginBottom: 12 }}>🚀</div>
                      <div style={{ fontFamily: V.heading, fontSize: "1.2rem", fontWeight: 800, color: V.bright, marginBottom: 8 }}>{t.contact.successTitle}</div>
                      <p style={{ color: V.dim, fontSize: "0.85rem", lineHeight: 1.6 }}>{t.contact.successMessage}</p>
                    </div>
                  ) : (
                    <form onSubmit={submit}>
                      <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>{t.contact.whatInterests}</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {serviceOptions.map((s) => {
                            const active = form.services.includes(s);
                            return (
                              <button key={s} type="button" onClick={() => toggleService(s)} className="cfg-chip" style={{
                                padding: "7px 14px", borderRadius: 8, fontSize: "0.74rem", fontWeight: 600,
                                fontFamily: V.body, cursor: "pointer", transition: "all .25s cubic-bezier(.16,1,.3,1)",
                                background: active ? V.accent : "rgba(0,0,0,0.03)",
                                color: active ? "#fff" : V.text,
                                border: `1px solid ${active ? V.accent : "rgba(0,0,0,0.08)"}`,
                              }}>{s}</button>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div>
                          <label htmlFor="cfg-name" style={labelStyle}>{t.contact.nameLabel}</label>
                          <input id="cfg-name" className="form-input" style={{ fontFamily: V.body }} placeholder={t.contact.namePlaceholder} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div>
                          <label htmlFor="cfg-contact" style={labelStyle}>{t.contact.contactLabel}</label>
                          <input id="cfg-contact" className="form-input" style={{ fontFamily: V.body }} placeholder={t.contact.contactPlaceholder} value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div>
                          <label htmlFor="cfg-niche" style={labelStyle}>{t.contact.nicheLabel}</label>
                          <input id="cfg-niche" className="form-input" style={{ fontFamily: V.body }} placeholder={t.contact.nichePlaceholder} value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })} />
                        </div>
                        <div>
                          <label htmlFor="cfg-revenue" style={labelStyle}>{t.contact.revenueLabel}</label>
                          <select id="cfg-revenue" className="form-input" style={{ fontFamily: V.body, cursor: "pointer", color: form.revenue ? V.bright : V.muted }} value={form.revenue} onChange={e => setForm({ ...form, revenue: e.target.value })}>
                            <option value="" disabled>{t.contact.revenueSelect}</option>
                            {revenueOptions.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label htmlFor="cfg-link" style={labelStyle}>{t.contact.linkLabel}</label>
                        <input id="cfg-link" className="form-input" style={{ fontFamily: V.body }} placeholder={t.contact.linkPlaceholder} value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <label htmlFor="cfg-message" style={labelStyle}>{t.contact.messageLabel}</label>
                        <textarea id="cfg-message" className="form-input" style={{ fontFamily: V.body, minHeight: 80, resize: "vertical" }} placeholder={t.contact.messagePlaceholder} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                      </div>

                      <button type="submit" className="btn-submit" disabled={sending}>
                        {sending ? t.contact.sendingButton : t.contact.sendButton}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <Reveal tag="footer" type="up" duration={1.2} style={{ background: V.bright, color: "#fff", padding: "80px 0 40px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <div className="footer-top" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 56, marginBottom: 60 }}>
          <div>
            <div style={{ fontFamily: V.heading, fontWeight: 900, fontSize: "1.05rem", marginBottom: 24, letterSpacing: "-0.04em", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="24" height="24" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <rect width="256" height="256" rx="42.6667" fill="#DF5440"/>
                <path d="M87.0069 78.4321L172.234 53.5611L172.234 53.5611C196.129 46.5881 208.077 43.1017 210.843 48.0941C213.609 53.0866 204.317 61.367 185.734 77.9279L153.845 106.347C146.512 112.882 142.846 116.15 143.738 119.537C144.63 122.925 149.443 123.966 159.07 126.049C170.467 128.514 176.165 129.747 177.353 133.831C178.542 137.916 174.405 142.001 166.132 150.173L128.971 186.878C114.297 201.372 106.96 208.619 102.485 206.586C101.963 206.348 101.47 206.048 101.02 205.693C97.1598 202.65 100.234 192.806 106.382 173.118C108.3 166.976 109.259 163.905 107.908 161.695C107.739 161.418 107.546 161.156 107.333 160.912C105.626 158.963 102.409 158.963 95.9739 158.963H91.6315C76.3852 158.963 68.7621 158.963 64.4942 154.069C60.2262 149.174 61.2642 141.622 63.34 126.518L66.7154 101.958C67.9389 93.0553 68.5507 88.604 71.309 85.4061C74.0673 82.2081 78.3805 80.9494 87.0069 78.4321Z" fill="white"/>
              </svg>
              BANKAI<span style={{ color: "#E94560", margin: "0 0.01em" }}>.</span>AGENCY
            </div>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 20 }}>
              {t.footer.about}
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: V.heading, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, color: "rgba(255,255,255,0.6)" }}>{t.footer.menuTitle}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "#services", label: t.footer.services },
                { href: "#process", label: t.footer.process },
                { href: "#cases", label: t.footer.cases },
              ].map((item) => (
                <a key={item.href} href={item.href} className="footer-nav-link" style={{
                  color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", textDecoration: "none", transition: "color .3s",
                }}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: V.heading, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, color: "rgba(255,255,255,0.6)" }}>{t.footer.connectTitle}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="mailto:agency.bankai@gmail.com" className="footer-nav-link" style={{
                color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", textDecoration: "none", transition: "color .3s",
              }}>
                agency.bankai@gmail.com
              </a>
              <a href="https://t.me/may_work" target="_blank" rel="noopener" className="footer-nav-link" style={{
                color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none", transition: "color .3s", fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
              }}>
                <img src="https://cdn.simpleicons.org/telegram/26A5E4" alt="Telegram" width="16" height="16" style={{ objectFit: "contain", opacity: 0.7 }} loading="lazy" />
                @may_work
              </a>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 28 }} />

        <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} Bankai Agency. {t.footer.rights}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["AI", "ADS", "CRM", "SEO"].map((tag, i) => (
              <span key={i} style={{
                padding: "3px 8px", borderRadius: 4, fontSize: "0.5rem", fontWeight: 700,
                background: "rgba(160,28,45,0.1)", color: "rgba(200,53,74,0.5)",
                letterSpacing: "0.1em",
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function Page() {
  const params = useParams();
  const locale = params.locale || "ru";
  const t = getDictionary(locale);
  const cases = getCases(locale);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      <div style={{ background: V.bg, color: V.text, minHeight: "100vh", fontFamily: V.body, overflowX: "hidden", position: "relative" }}>
        <div className="dev-banner" style={{
          position: "relative", zIndex: 101,
          background: V.accent, color: "#fff", textAlign: "center",
          padding: "10px 20px", fontSize: "0.78rem", fontWeight: 600,
          fontFamily: V.body, letterSpacing: "0.02em",
        }}>
          {t.devBanner}
        </div>
        <Nav t={t} locale={locale} />
        <Hero t={t} locale={locale} />
        <Marquee t={t} />
        <MainServices t={t} />
        <Divider />
        <ServicesGrid t={t} />
        <Divider />
        <Process t={t} />
        <Divider />
        <Cases t={t} locale={locale} cases={cases} />
        <Divider />
        <Statement t={t} />
        <Divider />
        <Contact t={t} />
        <Footer t={t} />
      </div>
    </>
  );
}
