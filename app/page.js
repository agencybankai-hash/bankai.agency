"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { cases } from "./cases/data";

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
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap');

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
.btn-submit{border:1px solid rgba(0,0,0,0.12);color:#1A1714;padding:13px 28px;border-radius:100px;background:rgba(0,0,0,0.03);font-weight:600;font-size:0.82rem;cursor:pointer;letter-spacing:0.03em;transition:all .35s cubic-bezier(.16,1,.3,1);width:100%}
.btn-submit:hover:not(:disabled){background:#A01C2D;border-color:#A01C2D;color:#fff;transform:translateY(-1px);box-shadow:0 6px 24px rgba(160,28,45,0.2)}
.btn-submit:disabled{opacity:0.5;cursor:not-allowed}

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

/* responsive */
@media(max-width:768px){
  .grid-2{grid-template-columns:1fr!important}
  .grid-4{grid-template-columns:1fr 1fr!important}
  .hero-heading{font-size:2.4rem!important}
  .section-heading{font-size:1.8rem!important}
  .process-grid{grid-template-columns:1fr 1fr!important}
  .contact-grid{grid-template-columns:1fr!important}
  .cases-grid{grid-template-columns:1fr!important}
  .case-card-new{height:360px!important}
  .stat-grid{grid-template-columns:1fr 1fr!important}
  .services-split{grid-template-columns:1fr!important}
  .hero-grid{grid-template-columns:1fr!important;gap:40px!important}
}
@media(max-width:480px){
  .grid-4{grid-template-columns:1fr!important}
  .process-grid{grid-template-columns:1fr!important}
  .stat-grid{grid-template-columns:1fr!important}
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

/* ───── data ───── */
/* full-cycle partner block + 4 directions */
const directions = [
  {
    icon: "📈", title: "Маркетинг",
    desc: "Google Ads, SEO, Meta, контент, email-маркетинг, аналитика. Полная воронка от первого касания до повторной продажи.",
    tags: ["Google Ads", "SEO", "Meta Ads", "Email", "Контент", "Аналитика"],
  },
  {
    icon: "⚡", title: "Автоматизация",
    desc: "AI-агенты, CRM-системы, чат-боты, автоматические воронки. Убираем ручной труд — ускоряем рост.",
    tags: ["AI-агенты", "HubSpot", "CRM", "Чат-боты", "Воронки"],
  },
  {
    icon: "🎨", title: "Дизайн и разработка",
    desc: "UI/UX, сайты, лендинги, фирменный стиль, упаковка. От Figma до продакшена на любом стеке.",
    tags: ["UI/UX", "Next.js", "Figma", "Брендинг", "Упаковка"],
  },
  {
    icon: "🧠", title: "Консалтинг",
    desc: "Аудит маркетинга, стратегия роста, финансовое моделирование, unit-экономика. Видим картину целиком.",
    tags: ["Аудит", "Стратегия", "Unit-экономика", "Масштабирование"],
  },
];

function SvcIcon({ name, size = 28 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  const c = V.accentLit;
  const icons = {
    google: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>,
    meta: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7 3 13 6 13s6-6 6-13z"/><path d="M6 8c0 7-3 13-3 13M18 8c0 7 3 13 3 13"/></svg>,
    seo: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6M11 8v6"/></svg>,
    web: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    crm: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    analytics: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    content: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    branding: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  };
  return icons[name] || null;
}

const services = [
  { t: "Google Ads", d: "Search, Performance Max, YouTube — настройка и масштабирование.", icon: "google" },
  { t: "Meta Ads", d: "Facebook + Instagram с фокусом на конверсии.", icon: "meta" },
  { t: "SEO", d: "Технический SEO, контент-стратегия, линкбилдинг.", icon: "seo" },
  { t: "Web Dev", d: "Next.js, React — быстрые сайты и лендинги.", icon: "web" },
  { t: "CRM", d: "HubSpot, Salesforce — настройка и автоматизация.", icon: "crm" },
  { t: "Analytics", d: "GA4, Looker Studio, сквозная аналитика.", icon: "analytics" },
  { t: "Content", d: "Блоги, рассылки, SMM, видео — контент, что продаёт.", icon: "content" },
  { t: "Branding", d: "Логотипы, UI/UX, фирменный стиль, креативы.", icon: "branding" },
];

const steps = [
  { n: "01", t: "Аудит", d: "Анализируем текущие процессы и находим точки роста." },
  { n: "02", t: "Стратегия", d: "Проектируем систему под ваши цели и бюджет." },
  { n: "03", t: "Внедрение", d: "Интегрируем решения в бизнес-процессы." },
  { n: "04", t: "Масштаб", d: "Оптимизируем и растим результаты." },
];

/* ═══════════════════════ GRADIENT ARC (light theme) ═══════════════════════ */
function GradientArc() {
  const ref = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const sm = useRef({ x: 0.5, y: 0.5 });
  const raf = useRef(null);
  const t = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, dpr;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const r = c.parentElement.getBoundingClientRect();
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      c.style.width = w + "px"; c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); addEventListener("resize", resize);
    const onMove = (e) => {
      const r = c.parentElement.getBoundingClientRect();
      mouse.current.x = (e.clientX - r.left) / r.width;
      mouse.current.y = (e.clientY - r.top) / r.height;
    };
    addEventListener("mousemove", onMove, { passive: true });
    const draw = () => {
      t.current += 0.002; const T = t.current;
      const s = sm.current, m = mouse.current;
      s.x += (m.x - s.x) * 0.03; s.y += (m.y - s.y) * 0.03;
      ctx.clearRect(0, 0, w, h);
      const cxp = w * 0.52 + (s.x - 0.5) * w * 0.1;
      const cyp = h * 0.92 + (s.y - 0.5) * h * 0.06;
      const R = Math.min(w, h) * 0.78;
      const mi = (s.x - 0.5) * 0.12;
      const layers = [
        { r: R * 1.15, w: 140, a: 0.04, sat: 40, light: 75, sp: 0.6 },
        { r: R * 0.98, w: 100, a: 0.06, sat: 45, light: 72, sp: 0.9 },
        { r: R * 0.84, w: 65,  a: 0.08, sat: 50, light: 68, sp: 1.2 },
        { r: R * 0.72, w: 35,  a: 0.05, sat: 35, light: 78, sp: 0.8 },
        { r: R * 0.62, w: 18,  a: 0.03, sat: 30, light: 80, sp: 1.4 },
      ];
      for (const l of layers) {
        const lr = l.r + Math.sin(T * l.sp) * 12 + (s.y - 0.5) * 25;
        const sa = -Math.PI * 0.82 + mi + Math.sin(T * l.sp * 0.5) * 0.06;
        const ea = -Math.PI * 0.18 + mi + Math.cos(T * l.sp * 0.7) * 0.06;
        const g = ctx.createLinearGradient(cxp + Math.cos(sa) * lr, cyp + Math.sin(sa) * lr, cxp + Math.cos(ea) * lr, cyp + Math.sin(ea) * lr);
        const hue = 355 + Math.sin(T + l.sp) * 8;
        g.addColorStop(0, `hsla(${hue},${l.sat}%,${l.light}%,0)`);
        g.addColorStop(0.25, `hsla(${hue},${l.sat}%,${l.light}%,${l.a * 0.6})`);
        g.addColorStop(0.5, `hsla(${hue},${l.sat + 5}%,${l.light - 3}%,${l.a})`);
        g.addColorStop(0.75, `hsla(${hue - 5},${l.sat}%,${l.light}%,${l.a * 0.6})`);
        g.addColorStop(1, `hsla(${hue - 5},${l.sat}%,${l.light}%,0)`);
        ctx.beginPath(); ctx.arc(cxp, cyp, lr, sa, ea);
        ctx.lineWidth = l.w; ctx.lineCap = "round"; ctx.strokeStyle = g;
        ctx.filter = `blur(${l.w * 0.45}px)`; ctx.stroke();
      }
      ctx.filter = "none";
      const cr = R * 0.84 + Math.sin(T * 1.1) * 6 + (s.y - 0.5) * 16;
      const cs = -Math.PI * 0.78 + mi + Math.sin(T * 0.5) * 0.05;
      const ce = -Math.PI * 0.22 + mi + Math.cos(T * 0.7) * 0.05;
      const cg = ctx.createLinearGradient(cxp + Math.cos(cs) * cr, cyp + Math.sin(cs) * cr, cxp + Math.cos(ce) * cr, cyp + Math.sin(ce) * cr);
      cg.addColorStop(0, "hsla(355,50%,65%,0)"); cg.addColorStop(0.2, "hsla(355,55%,60%,0.06)");
      cg.addColorStop(0.5, "hsla(0,60%,55%,0.12)"); cg.addColorStop(0.8, "hsla(5,55%,60%,0.06)");
      cg.addColorStop(1, "hsla(5,50%,65%,0)");
      ctx.beginPath(); ctx.arc(cxp, cyp, cr, cs, ce);
      ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = cg;
      ctx.filter = "blur(1px)"; ctx.stroke(); ctx.filter = "none";
      for (let i = 0; i < 12; i++) {
        const f = i / 12; const a = cs + (ce - cs) * f;
        const pr = cr + Math.sin(T * 2.5 + i * 1.8) * 10;
        const px = cxp + Math.cos(a) * pr, py = cyp + Math.sin(a) * pr;
        const pa = (0.06 + Math.sin(T * 1.5 + i) * 0.03) * (1 - Math.abs(f - 0.5) * 1.8);
        if (pa <= 0) continue;
        const ps = 1.5 + Math.sin(T * 3 + i * 2) * 0.8;
        const pg = ctx.createRadialGradient(px, py, 0, px, py, ps * 4);
        pg.addColorStop(0, `hsla(0,50%,55%,${pa})`); pg.addColorStop(1, `hsla(0,50%,55%,0)`);
        ctx.beginPath(); ctx.arc(px, py, ps * 4, 0, Math.PI * 2); ctx.fillStyle = pg; ctx.fill();
      }
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf.current); removeEventListener("resize", resize); removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <canvas ref={ref} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

/* ═══════════════════════ NAV ═══════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(scrollY > 60);
    addEventListener("scroll", h, { passive: true });
    return () => removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 64, display: "flex", alignItems: "center",
      background: scrolled ? "rgba(250,248,245,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${V.border}` : "1px solid transparent",
      transition: "background .5s cubic-bezier(.16,1,.3,1), backdrop-filter .5s, border-bottom .5s",
    }}>
      <div style={{ ...cx, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 900, fontSize: "1.05rem", color: V.bright, letterSpacing: "-0.04em", flexShrink: 0 }}>
          BANKAI<span style={{ color: V.accent }}>.</span>AGENCY
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontFamily: V.body }}>
          <a href="#services" className="nav-link">Услуги</a>
          <a href="#process" className="nav-link">Процесс</a>
          <a href="#cases" className="nav-link">Кейсы</a>
          <a href="#contact" className="nav-cta" style={{ fontFamily: V.heading }}>СВЯЗАТЬСЯ</a>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════ NETWORK ANIMATION (hero background) ═══════════════════════ */
function NetworkCanvas() {
  const canvasRef = useRef(null);
  const raf = useRef(null);
  const t = useRef(0);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, dpr;

    // Node definitions with labels
    const nodeLabels = ["AI", "CRM", "SEO", "ADS", "EMAIL", "DATA", "BOT", "API", "FUNNEL", "LEAD", "GA4", "AUTO"];
    const nodes = nodeLabels.map((label, i) => ({
      label,
      x: 0.1 + Math.random() * 0.8,
      y: 0.1 + Math.random() * 0.8,
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      phase: Math.random() * Math.PI * 2,
      size: 3 + Math.random() * 2,
    }));

    // Particles that flow between nodes
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const fromIdx = Math.floor(Math.random() * nodes.length);
      let toIdx = Math.floor(Math.random() * nodes.length);
      if (toIdx === fromIdx) toIdx = (toIdx + 1) % nodes.length;
      particles.push({ from: fromIdx, to: toIdx, progress: Math.random(), speed: 0.002 + Math.random() * 0.003 });
    }

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const r = c.parentElement.getBoundingClientRect();
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      c.style.width = w + "px"; c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const draw = () => {
      t.current += 0.008;
      const T = t.current;
      ctx.clearRect(0, 0, w, h);

      // Update node positions (gentle drift)
      for (const n of nodes) {
        n.x += n.vx + Math.sin(T * 0.5 + n.phase) * 0.0001;
        n.y += n.vy + Math.cos(T * 0.4 + n.phase) * 0.0001;
        // Bounce off edges
        if (n.x < 0.05 || n.x > 0.95) n.vx *= -1;
        if (n.y < 0.05 || n.y > 0.95) n.vy *= -1;
        n.x = Math.max(0.05, Math.min(0.95, n.x));
        n.y = Math.max(0.05, Math.min(0.95, n.y));
      }

      // Draw connections
      const maxDist = 0.35;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.strokeStyle = `rgba(160,28,45,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const px = n.x * w;
        const py = n.y * h;
        const pulse = 1 + Math.sin(T * 2 + n.phase) * 0.15;
        const r = n.size * pulse;

        // Outer glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
        grd.addColorStop(0, "rgba(160,28,45,0.08)");
        grd.addColorStop(1, "rgba(160,28,45,0)");
        ctx.beginPath();
        ctx.arc(px, py, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(160,28,45,0.2)";
        ctx.fill();

        // Label
        ctx.font = `600 ${Math.max(7, 8)}px 'Manrope', sans-serif`;
        ctx.fillStyle = "rgba(160,28,45,0.18)";
        ctx.textAlign = "center";
        ctx.fillText(n.label, px, py + r + 12);
      }

      // Draw flowing particles
      for (const p of particles) {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.from = p.to;
          p.to = Math.floor(Math.random() * nodes.length);
          if (p.to === p.from) p.to = (p.to + 1) % nodes.length;
        }
        const fromN = nodes[p.from];
        const toN = nodes[p.to];
        const px = (fromN.x + (toN.x - fromN.x) * p.progress) * w;
        const py = (fromN.y + (toN.y - fromN.y) * p.progress) * h;
        const alpha = Math.sin(p.progress * Math.PI) * 0.4;

        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,53,74,${alpha})`;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.7 }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

/* ═══════════════════════ HERO ═══════════════════════ */
function RotatingWord() {
  const words = ["выручку", "клиентов", "систему", "результат"];
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % words.length), 2800); return () => clearInterval(t); }, []);
  // Find the longest word to set container width
  const longest = words.reduce((a, b) => a.length > b.length ? a : b);
  return (
    <span style={{ display: "inline-block", position: "relative", height: "1.1em", overflow: "hidden", verticalAlign: "bottom" }}>
      {/* invisible spacer — widest word sets the width */}
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

function Hero() {
  return (
    <section style={{ padding: "0", position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <GradientArc />
      <div style={{ ...cx, zIndex: 1, position: "relative", width: "100%", paddingTop: 120, paddingBottom: 60 }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 0.8fr", gap: 48, alignItems: "center" }}>
          {/* LEFT — text */}
          <div>
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
                  Digital-партнёр на процент от выручки
                </span>
              </div>
            </Reveal>

            <Reveal delay={150} duration={1}>
              <h1 className="hero-heading" style={{
                fontFamily: V.heading, fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.05em",
                color: V.bright, marginBottom: 28,
              }}>
                Строим системы,<br />которые приносят<br /><RotatingWord />
              </h1>
            </Reveal>

            <Reveal delay={300} type="fade" duration={1}>
              <p style={{ fontSize: "1.02rem", color: V.dim, maxWidth: 440, lineHeight: 1.75, marginBottom: 40 }}>
                Маркетинг, автоматизация, дизайн и разработка — единая digital-команда для вашего бизнеса. На проценте от оборота.
              </p>
            </Reveal>

            <Reveal delay={450} type="up">
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 56 }}>
                <a href="#contact" className="btn-primary" style={{ fontFamily: V.body }}>Обсудить проект</a>
                <a href="#cases" className="btn-ghost" style={{ fontFamily: V.body }}>Кейсы <span className="arrow">→</span></a>
              </div>
            </Reveal>

            <Reveal delay={600} type="fade" duration={1.2}>
              <div className="stat-grid" style={{
                display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 48,
                paddingTop: 28, borderTop: `1px solid ${V.divider}`, maxWidth: 420,
              }}>
                {[
                  { v: "50", s: "+", l: "проектов" },
                  { v: "14.6", s: "M", l: "в продажах клиентов" },
                  { v: "4", s: "", l: "направления" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: V.heading, fontSize: "1.5rem", fontWeight: 800, color: V.bright, letterSpacing: "-0.04em", marginBottom: 2 }}>
                      {stat.s === "M" ? <><span style={{ fontSize: "0.85em" }}>$</span><Counter value="14" suffix=".6M" /></> : <Counter value={stat.v} suffix={stat.s} />}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: V.muted }}>{stat.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — visual cards */}
          <div style={{ position: "relative", minHeight: 480, paddingTop: 60 }}>
            {/* network/automation animation background */}
            <NetworkCanvas />
            {/* floating case cards */}
            <Reveal delay={400} type="scale" duration={1}>
              <div className="hero-float-1 hero-visual-card" style={{
                position: "absolute", top: 20, right: 0, width: 280, zIndex: 1,
                background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
                borderRadius: 16, padding: "28px 24px", boxShadow: "0 12px 40px rgba(15,52,96,0.3)",
                cursor: "default",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ padding: "3px 8px", background: "rgba(233,69,96,0.15)", borderRadius: 4, fontSize: "0.5rem", fontWeight: 700, color: "#e94560", letterSpacing: "0.1em" }}>EXIT</span>
                  <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>SaaS · Data Protection</span>
                </div>
                <div style={{ fontFamily: V.heading, fontSize: "0.95rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>Object First → Veeam</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 16 }}>Единственная внешняя дизайн-команда. 2+ года → приобретена Veeam.</div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1.2rem", fontWeight: 900, color: "#e94560" }}>EXIT</div><div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>acquired</div></div>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1.2rem", fontWeight: 900, color: "#fff" }}>2+</div><div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>лет</div></div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={550} type="scale" duration={1}>
              <div className="hero-float-2 hero-visual-card" style={{
                position: "absolute", top: 200, left: 10, width: 260, zIndex: 1,
                background: "linear-gradient(135deg, #0a1628, #243b63)",
                borderRadius: 16, padding: "24px 22px", boxShadow: "0 12px 40px rgba(36,59,99,0.3)",
                cursor: "default",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ padding: "3px 8px", background: "rgba(79,172,254,0.12)", borderRadius: 4, fontSize: "0.5rem", fontWeight: 700, color: "#4facfe", letterSpacing: "0.1em" }}>$14.6M</span>
                  <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>Performance + AI</span>
                </div>
                <div style={{ fontFamily: V.heading, fontSize: "0.9rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>SOS Moving → AI Moving</div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: 14 }}>$14.6M продаж, 10K+ заказов. Потом — свой AI SaaS.</div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[{ v: "10,235", l: "заказов" },{ v: "$400K+", l: "бюджет" }].map((m, j) => (
                    <div key={j}><div style={{ fontFamily: V.heading, fontSize: "0.85rem", fontWeight: 800, color: "#4facfe" }}>{m.v}</div><div style={{ fontSize: "0.48rem", color: "rgba(255,255,255,0.3)" }}>{m.l}</div></div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={700} type="scale" duration={1}>
              <div className="hero-float-3 hero-visual-card" style={{
                position: "absolute", bottom: 10, right: 30, width: 240, zIndex: 1,
                background: V.card,
                border: `1px solid ${V.border}`,
                borderRadius: 16, padding: "22px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                cursor: "default",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ padding: "3px 8px", background: "rgba(160,28,45,0.06)", borderRadius: 4, fontSize: "0.5rem", fontWeight: 700, color: V.accent, letterSpacing: "0.1em" }}>REVENUE SHARE</span>
                </div>
                <div style={{ fontFamily: V.heading, fontSize: "0.85rem", fontWeight: 800, color: V.bright, marginBottom: 4 }}>AK Cabinet Craft</div>
                <div style={{ fontSize: "0.68rem", color: V.dim, lineHeight: 1.5, marginBottom: 12 }}>Full-cycle маркетинг за 3% от выручки. Чикаго.</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 900, color: V.accent }}>3%</div><div style={{ fontSize: "0.48rem", color: V.muted }}>rev share</div></div>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 900, color: V.bright }}>Full</div><div style={{ fontSize: "0.48rem", color: V.muted }}>cycle</div></div>
                </div>
              </div>
            </Reveal>

            {/* decorative accent dots */}
            <div style={{ position: "absolute", top: 160, right: 280, width: 8, height: 8, borderRadius: "50%", background: V.accentLit, opacity: 0.3, animation: "float1 4s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: 100, left: 0, width: 6, height: 6, borderRadius: "50%", background: V.accent, opacity: 0.2, animation: "float2 5s ease-in-out infinite" }} />
            <div style={{ position: "absolute", top: 60, left: 100, width: 4, height: 4, borderRadius: "50%", background: V.muted, opacity: 0.3, animation: "float3 6s ease-in-out infinite" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ MARQUEE ═══════════════════════ */
function Marquee() {
  const [ref, visible] = useInView({ threshold: 0.3 });
  const words = ["AI-АВТОМАТИЗАЦИЯ", "GOOGLE ADS", "SEO", "CRM", "АНАЛИТИКА", "PERFORMANCE", "ЛИДОГЕНЕРАЦИЯ", "КОНТЕНТ", "BRANDING", "WEB DEV"];
  const row = words.map((w, i) => (
    <span key={i} style={{
      fontFamily: V.heading, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em",
      color: i % 2 === 0 ? "rgba(160,28,45,0.35)" : "rgba(0,0,0,0.12)",
      whiteSpace: "nowrap", padding: "0 36px",
    }}>{w}</span>
  ));
  return (
    <div ref={ref} style={{
      overflow: "hidden", padding: "22px 0", position: "relative", zIndex: 1,
      borderTop: `1px solid ${V.divider}`, borderBottom: `1px solid ${V.divider}`,
      opacity: visible ? 1 : 0, transition: "opacity 1s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(90deg, ${V.bg}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(270deg, ${V.bg}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ display: "flex", animation: "marquee 40s linear infinite", width: "max-content" }}>{row}{row}</div>
    </div>
  );
}

/* ═══════════════════════ MAIN SERVICES ═══════════════════════ */
function MainServices() {
  return (
    <section id="services" style={{ padding: "120px 0 80px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal type="fade"><Label num="01" text="Как мы работаем" /></Reveal>
        <RevealHeading delay={100} className="section-heading" style={{
          fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 800, marginBottom: 56,
        }}>Полный цикл или точечные решения</RevealHeading>

        <div className="services-split" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20, alignItems: "stretch" }}>
          {/* LEFT — Full-cycle partner */}
          <Reveal delay={180} type="left" duration={0.9}>
            <div className="main-card" style={{
              background: V.card,
              border: `1px solid rgba(160,28,45,0.1)`,
              borderRadius: V.radius, padding: "48px 40px",
              position: "relative", overflow: "hidden",
              height: "100%", display: "flex", flexDirection: "column",
              boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            }}>
              {/* accent top line */}
              <div style={{
                position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
                background: `linear-gradient(90deg, transparent, rgba(160,28,45,0.2), transparent)`,
              }} />

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                <span style={{
                  padding: "5px 12px", background: V.accentDim, borderRadius: 6,
                  fontSize: "0.6rem", fontWeight: 700, color: V.accent, letterSpacing: "0.1em",
                }}>ПАРТНЁР</span>
                <span style={{
                  padding: "5px 12px", background: "rgba(0,0,0,0.03)", borderRadius: 6,
                  fontSize: "0.6rem", fontWeight: 600, color: V.dim, letterSpacing: "0.06em",
                }}>REVENUE SHARE</span>
              </div>

              <h3 style={{ fontFamily: V.heading, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 900, color: V.bright, marginBottom: 10, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Полный цикл<br/>под ключ
              </h3>
              <div style={{ fontSize: "0.8rem", color: V.accent, fontWeight: 700, marginBottom: 20, letterSpacing: "0.02em" }}>
                Цель — рост вашей выручки. Мы на проценте.
              </div>
              <p style={{ fontSize: "0.88rem", color: V.text, lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
                Подключаемся как внешний digital-партнёр и берём на себя весь маркетинг, автоматизацию, дизайн и разработку. Работаем на процент от оборота — зарабатываем только когда растёте вы. Прокачиваем бизнес по всем фронтам: от лидогенерации до AI-автоматизации.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36, marginTop: "auto" }}>
                {[
                  "Единая стратегия роста оборота",
                  "Маркетинг + автоматизация + дизайн + разработка",
                  "Revenue share — наши интересы совпадают",
                  "Полное погружение в ваш бизнес",
                  "Прозрачная аналитика и отчётность",
                ].map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: V.accent, flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: "0.82rem", color: V.dim, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              <a href="#contact" className="card-link accent" style={{ fontSize: "0.82rem" }}>
                ОБСУДИТЬ ПАРТНЁРСТВО <span>→</span>
              </a>
            </div>
          </Reveal>

          {/* RIGHT — 4 directions grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {directions.map((d, i) => (
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

        {/* sub-text */}
        <Reveal delay={500} type="fade">
          <div style={{
            display: "flex", alignItems: "center", gap: 20, marginTop: 40, padding: "20px 28px",
            background: "rgba(0,0,0,0.015)", borderRadius: V.radiusSm, border: `1px solid ${V.divider}`,
          }}>
            <div style={{ width: 3, height: 40, borderRadius: 2, background: V.accent, flexShrink: 0 }} />
            <p style={{ fontSize: "0.82rem", color: V.dim, lineHeight: 1.65, margin: 0 }}>
              <strong style={{ color: V.bright, fontWeight: 700 }}>Полный цикл</strong> — когда нужен сильный digital-партнёр на долгосрок. <strong style={{ color: V.bright, fontWeight: 700 }}>Отдельное направление</strong> — когда нужна конкретная экспертиза: запустить рекламу, построить CRM, обновить сайт или провести аудит.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════ SERVICES GRID ═══════════════════════ */
function ServicesGrid() {
  return (
    <section style={{ padding: "80px 0 120px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal type="fade"><Label num="02" text="Все услуги" /></Reveal>
        <RevealHeading delay={80} className="section-heading" style={{
          fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 600, marginBottom: 48,
        }}>Каждый канал — как отдельный продукт</RevealHeading>

        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {services.map((s, i) => (
            <Reveal key={i} delay={100 + i * 60} type="scale" duration={0.7}>
              <div className="svc-card">
                <div className="svc-icon" style={{ marginBottom: 14 }}>
                  <SvcIcon name={s.icon} />
                </div>
                <h4 style={{ fontFamily: V.heading, fontSize: "0.82rem", fontWeight: 700, color: V.bright, marginBottom: 6, letterSpacing: "-0.02em" }}>{s.t}</h4>
                <p style={{ fontSize: "0.74rem", color: V.dim, lineHeight: 1.5, margin: 0 }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ PROCESS ═══════════════════════ */
function Process() {
  return (
    <section id="process" style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal type="fade"><Label num="03" text="Процесс" /></Reveal>
        <RevealHeading delay={80} className="section-heading" style={{
          fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 600, marginBottom: 56,
        }}>Как мы работаем</RevealHeading>

        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {steps.map((s, i) => (
            <Reveal key={i} delay={120 + i * 100} type="left" duration={0.85}>
              <div className="process-step" style={{ borderLeft: i === 0 ? "none" : `1px solid ${V.divider}` }}>
                <div className="step-num" style={{
                  fontFamily: V.heading, fontSize: "2rem", fontWeight: 900,
                  color: "rgba(0,0,0,0.06)", letterSpacing: "-0.05em", marginBottom: 16,
                }}>{s.n}</div>
                <h3 className="step-title" style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 800, color: V.bright, marginBottom: 8 }}>{s.t}</h3>
                <p style={{ fontSize: "0.78rem", color: V.dim, lineHeight: 1.55, margin: 0 }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ CASES (image-only, overlay on hover) ═══════════════════════ */
function Cases() {
  return (
    <section id="cases" style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal type="fade"><Label num="04" text="Кейсы" /></Reveal>
        <RevealHeading delay={80} className="section-heading" style={{
          fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
          lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 700, marginBottom: 56,
        }}>Результаты говорят за нас</RevealHeading>

        <div className="cases-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {cases.map((c, i) => (
            <Reveal key={i} delay={120 + i * 80} type="scale" duration={0.8} style={i === 0 ? { gridColumn: "1 / -1" } : {}}>
              <Link href={`/cases/${c.slug}`} className="case-card-link">
                <div className="case-card-new" style={{ height: i === 0 ? 480 : 380, borderRadius: V.radius }}>
                  {/* full-bleed image background (zoomable) */}
                  <div className="case-img-inner" style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(135deg, ${c.color1}, ${c.color2}, ${c.color3})`,
                    borderRadius: "inherit",
                  }}>
                    <div style={{
                      position: "absolute", top: "10%", right: "8%", width: "50%", height: "50%", borderRadius: "50%",
                      background: `radial-gradient(circle, ${c.accent}25, transparent 65%)`,
                    }} />
                    <div style={{
                      position: "absolute", bottom: "12%", left: "5%", width: "35%", height: "35%", borderRadius: "50%",
                      background: `radial-gradient(circle, ${c.accent}18, transparent 70%)`,
                    }} />
                    <div style={{
                      position: "absolute", inset: 0, opacity: 0.04,
                      backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
                      backgroundSize: "50px 50px",
                    }} />
                  </div>

                  {/* always-visible labels — outside img-inner so they don't zoom */}
                  <div style={{ position: "absolute", top: 24, left: 28, zIndex: 2 }}>
                    <div style={{ fontFamily: V.heading, fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.02em" }}>{c.client}</div>
                  </div>
                  <div style={{
                    position: "absolute", top: 20, right: 24, zIndex: 2,
                    background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
                    borderRadius: 8, padding: "8px 14px", textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>
                    <div style={{ fontFamily: V.heading, fontSize: "1.1rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{c.result}</div>
                    <div style={{ fontSize: "0.48rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginTop: 2 }}>{c.resultLabel}</div>
                  </div>

                  {/* hover overlay with content */}
                  <div className="case-overlay-content">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {c.tag.split(" · ").map((t, j) => (
                        <span key={j} style={{
                          padding: "4px 10px", borderRadius: 4, fontSize: "0.52rem", fontWeight: 700,
                          background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)",
                          letterSpacing: "0.08em", backdropFilter: "blur(4px)",
                        }}>{t}</span>
                      ))}
                    </div>

                    <h3 style={{
                      fontFamily: V.heading, fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 900,
                      color: "#fff", letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1.15,
                    }}>{c.client}</h3>

                    <p style={{
                      fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65,
                      marginBottom: 20, maxWidth: 400,
                      display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{c.desc}</p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 24 }}>
                        {c.metrics.map((m, j) => (
                          <div key={j}>
                            <div style={{ fontFamily: V.heading, fontSize: "0.82rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 1 }}>{m.v}</div>
                            <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>{m.l}</div>
                          </div>
                        ))}
                      </div>

                      <div className="case-arrow-btn" style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "1rem", flexShrink: 0,
                      }}>→</div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ SCROLL-PROGRESS TEXT REVEAL ═══════════════════════ */
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

/* ═══════════════════════ STATEMENT ═══════════════════════ */
function Statement() {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef, 0.2);
  const dimText = "Мы не просто запускаем рекламу. ";
  const brightText = "Мы строим системы, где AI, данные и маркетинг работают как единый механизм";
  const endText = " — и приносят измеримый результат.";
  const allWords = [
    ...dimText.split(" ").map(w => ({ word: w, color: V.muted })),
    ...brightText.split(" ").map(w => ({ word: w, color: V.bright })),
    ...endText.split(" ").filter(Boolean).map(w => ({ word: w, color: V.muted })),
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

/* ═══════════════════════ CONTACT ═══════════════════════ */
function Contact() {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.contact) return;
    setSending(true);
    try {
      await fetch("https://formsubmit.co/ajax/agency.bankai@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: form.name, contact: form.contact, message: form.message || "—", _subject: `Заявка от ${form.name}` }),
      });
      setSent(true);
    } catch { setSent(true); }
    setSending(false);
  };

  return (
    <section id="contact" style={{ padding: "120px 0 140px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
          <div>
            <Reveal type="fade"><Label num="05" text="Контакты" /></Reveal>
            <RevealHeading delay={80} className="section-heading" style={{
              fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
              lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, marginBottom: 20,
            }}>Обсудим ваш проект?</RevealHeading>
            <RevealParagraph delay={160} style={{ fontSize: "0.95rem", color: V.dim, lineHeight: 1.7, marginBottom: 44, maxWidth: 380 }}>
              Оставьте заявку — мы свяжемся в течение 24 часов.
            </RevealParagraph>
            <Reveal delay={240} type="left">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Email", value: "agency.bankai@gmail.com", href: "mailto:agency.bankai@gmail.com" },
                  { label: "Telegram", value: "@may_work", href: "https://t.me/may_work" },
                ].map((c, i) => (
                  <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="contact-link">
                    <div className="contact-icon" style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "rgba(0,0,0,0.02)", border: `1px solid ${V.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.6rem", fontFamily: V.heading, fontWeight: 700, color: V.muted,
                    }}>{c.label[0]}</div>
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
            <div style={{ background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radius, padding: "36px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "44px 0" }}>
                  <div style={{ fontFamily: V.heading, fontSize: "1.3rem", fontWeight: 800, color: V.bright, marginBottom: 10 }}>Заявка отправлена</div>
                  <p style={{ color: V.dim, fontSize: "0.88rem" }}>Мы свяжемся с вами в ближайшее время.</p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div style={{ fontSize: "0.82rem", color: V.dim, marginBottom: 24 }}>Заполните форму — мы вернёмся к вам.</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: "0.65rem", color: V.muted, marginBottom: 5, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }}>Имя</label>
                      <input className="form-input" style={{ fontFamily: V.body }} placeholder="Как вас зовут" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", color: V.muted, marginBottom: 5, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }}>Контакт</label>
                      <input className="form-input" style={{ fontFamily: V.body }} placeholder="Телефон или email" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", color: V.muted, marginBottom: 5, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }}>О проекте</label>
                      <textarea className="form-input" style={{ fontFamily: V.body, minHeight: 80, resize: "vertical" }} placeholder="Расскажите кратко" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <button type="submit" disabled={sending} className="btn-submit" style={{ fontFamily: V.body }}>
                      {sending ? "Отправляем..." : "Отправить заявку →"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ FOOTER ═══════════════════════ */
function Footer() {
  return (
    <Reveal type="fade" duration={1}>
      <footer style={{ padding: "32px 0", borderTop: `1px solid ${V.divider}`, position: "relative", zIndex: 1 }}>
        <div style={{ ...cx, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="footer-logo" style={{ fontFamily: V.heading, fontWeight: 900, fontSize: "0.8rem", color: V.muted, cursor: "default" }}>
            BANKAI<span className="footer-dot" style={{ color: V.accent, opacity: 0.5 }}>.</span>AGENCY
          </div>
          <div style={{ fontSize: "0.68rem", color: V.muted }}>© 2026</div>
        </div>
      </footer>
    </Reveal>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      <div style={{ background: V.bg, color: V.text, minHeight: "100vh", fontFamily: V.body, overflowX: "hidden" }}>
        {/* Dev banner — static, scrolls away */}
        <div style={{
          position: "relative", zIndex: 101,
          background: V.accent, color: "#fff", textAlign: "center",
          padding: "10px 20px", fontSize: "0.78rem", fontWeight: 600,
          fontFamily: V.body, letterSpacing: "0.02em",
        }}>
          Сайт в разработке — информация представлена для ознакомления
        </div>
        <Nav />
        <Hero />
        <Marquee />
        <MainServices />
        <Divider />
        <ServicesGrid />
        <Divider />
        <Process />
        <Divider />
        <Cases />
        <Divider />
        <Statement />
        <Divider />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
