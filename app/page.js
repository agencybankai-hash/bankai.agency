"use client";
import { useState, useEffect, useRef, useCallback } from "react";

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
@keyframes revealUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes revealDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
@keyframes revealLeft{from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}}
@keyframes revealRight{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}}
@keyframes revealScale{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
@keyframes revealFade{from{opacity:0}to{opacity:1}}
@keyframes pulse2{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.5);opacity:0}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

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

/* case card */
.case-card{transition:all .45s cubic-bezier(.16,1,.3,1);cursor:pointer}
.case-card:hover{border-color:rgba(0,0,0,0.12)!important;box-shadow:0 16px 48px rgba(0,0,0,0.06)}
.case-card:hover .case-cta{opacity:1;transform:translateX(0)}

/* case modal */
.case-overlay{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
.case-overlay-bg{position:absolute;inset:0;background:rgba(250,248,245,0.8);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.case-modal{position:relative;width:100%;max-width:780px;max-height:85vh;overflow-y:auto;background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;box-shadow:0 32px 80px rgba(0,0,0,0.1);scrollbar-width:thin;scrollbar-color:rgba(0,0,0,0.08) transparent}
.case-modal::-webkit-scrollbar{width:4px}
.case-modal::-webkit-scrollbar-track{background:transparent}
.case-modal::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.08);border-radius:2px}
.case-close{position:sticky;top:0;right:0;z-index:10;display:flex;justify-content:flex-end;padding:16px 20px 0}
.case-close-btn{width:36px;height:36px;border-radius:50%;border:1px solid rgba(0,0,0,0.08);background:rgba(255,255,255,0.9);color:#8A857F;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s;font-size:1.1rem;backdrop-filter:blur(8px)}
.case-close-btn:hover{color:#1A1714;border-color:rgba(0,0,0,0.18);background:#fff}
@media(max-width:768px){.case-modal{max-height:90vh;margin:8px}.case-modal-metrics{flex-direction:column!important;gap:20px!important}}

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
  .case-inner{grid-template-columns:1fr!important}
  .stat-grid{grid-template-columns:1fr 1fr!important}
  .services-split{grid-template-columns:1fr!important}
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
      padding: scrolled ? "14px 0" : "28px 0",
      background: scrolled ? "rgba(250,248,245,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${V.border}` : "1px solid transparent",
      transition: "all .5s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{ ...cx, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 900, fontSize: "1.05rem", color: V.bright, letterSpacing: "-0.04em" }}>
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

/* ═══════════════════════ HERO ═══════════════════════ */
function Hero() {
  return (
    <section style={{ padding: "0", position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <GradientArc />
      <div style={{ ...cx, zIndex: 1, position: "relative", width: "100%", paddingTop: 140, paddingBottom: 80 }}>
        <Reveal type="fade" duration={1.2}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px",
            background: V.accentDim, border: `1px solid rgba(160,28,45,0.1)`,
            borderRadius: 100, marginBottom: 48,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: V.accentLit, position: "relative", display: "block" }}>
              <span style={{ position: "absolute", inset: -3, borderRadius: "50%", border: `1.5px solid ${V.accentLit}`, animation: "pulse2 2.5s ease-out infinite" }} />
            </span>
            <span style={{ fontSize: "0.68rem", fontWeight: 600, color: V.text, letterSpacing: "0.04em" }}>
              Сайт в разработке — это превью. Полная версия скоро.
            </span>
          </div>
        </Reveal>

        <Reveal delay={150} duration={1}>
          <h1 className="hero-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)",
            fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.05em",
            color: V.bright, maxWidth: 850, marginBottom: 28,
          }}>
            Строим системы,<br />которые приносят<br /><span style={{ color: V.dim }}>выручку</span>
          </h1>
        </Reveal>

        <Reveal delay={300} type="fade" duration={1}>
          <p style={{ fontSize: "1.05rem", color: V.dim, maxWidth: 480, lineHeight: 1.7, marginBottom: 48 }}>
            AI-автоматизация и маркетинг полного цикла для бизнеса, который хочет расти быстрее.
          </p>
        </Reveal>

        <Reveal delay={450} type="up">
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <a href="#services" className="btn-primary" style={{ fontFamily: V.body }}>Смотреть услуги</a>
            <a href="#contact" className="btn-ghost" style={{ fontFamily: V.body }}>Связаться <span className="arrow">→</span></a>
          </div>
        </Reveal>

        <Reveal delay={600} type="fade" duration={1.2}>
          <div className="stat-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 56,
            marginTop: 80, paddingTop: 36, borderTop: `1px solid ${V.divider}`, maxWidth: 520,
          }}>
            {[
              { v: "50", s: "+", l: "проектов" },
              { v: "3", s: "x", l: "средний рост" },
              { v: "24", s: "ч", l: "время ответа" },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontFamily: V.heading, fontSize: "1.6rem", fontWeight: 800, color: V.bright, letterSpacing: "-0.04em", marginBottom: 2 }}>
                  <Counter value={stat.v} suffix={stat.s} />
                </div>
                <div style={{ fontSize: "0.72rem", color: V.muted }}>{stat.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
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
        <Reveal delay={100}>
          <h2 className="section-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 800, marginBottom: 56,
          }}>Полный цикл или точечные решения</h2>
        </Reveal>

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
        <Reveal delay={80}>
          <h2 className="section-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 600, marginBottom: 48,
          }}>Каждый канал — как отдельный продукт</h2>
        </Reveal>

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
        <Reveal delay={80}>
          <h2 className="section-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 600, marginBottom: 56,
          }}>Как мы работаем</h2>
        </Reveal>

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

/* ═══════════════════════ CASES ═══════════════════════ */
const cases = [
  {
    client: "Object First → Veeam", tag: "SaaS · DATA PROTECTION · EXIT", result: "EXIT", resultLabel: "acquired by Veeam",
    metrics: [{ v: "2+ года", l: "контракт" },{ v: "$100K+", l: "бюджет проекта" },{ v: "Veeam", l: "приобретена" }],
    desc: "Стартап в сфере ransomware-proof backup storage. Мы были единственной внешней командой на дизайне и разработке на протяжении 2+ лет. Компания была приобретена Veeam — мировым лидером рынка data protection.",
    scope: ["UI/UX Design", "Figma", "HubSpot CMS", "Веб-разработка", "Landing Pages", "Investor Decks", "One-Pagers", "Marketing Materials"],
    detail: {
      challenge: "Object First — стартап из Бостона, создающий ransomware-proof backup storage appliance (Ootbi). Продукт на стыке cybersecurity и data protection. Внутренней дизайн-команды нет, но нужна была полная дизайн- и веб-инфраструктура: брендинг, маркетинговый сайт, продуктовые страницы, материалы для инвесторов и партнёров. Мы стали единственным внешним партнёром по дизайну и фронтенд-разработке.",
      solution: [
        { title: "UI/UX дизайн и бренд-система", text: "Разработали полную дизайн-систему в Figma: компоненты, типографика, цветовая палитра, иконки. Создавали продуктовые лендинги, feature pages, сравнительные таблицы с конкурентами, презентации для инвесторов, partner one-pagers, case study templates и все маркетинговые материалы." },
        { title: "Веб-разработка на HubSpot CMS", text: "Построили маркетинговый сайт с нуля на HubSpot CMS: кастомные модули, blog templates, gated content pages, интеграция с HubSpot CRM для lead capture. Регулярные обновления под каждый продуктовый релиз, A/B тесты лендингов, оптимизация Core Web Vitals." },
        { title: "Embedded-команда на 2+ года", text: "Работали как выделенная команда: 100–120 часов в месяц, ежедневные стендапы, полное погружение в продукт и roadmap. Часовая модель ($50/час) при стабильной загрузке позволила масштабироваться под задачи — от тихих недель до интенсивных спринтов перед launch events." },
        { title: "Результат: EXIT → Veeam", text: "Object First была приобретена Veeam — мировым лидером в сфере backup и data protection с оценкой $15B+. Качество дизайна, маркетинговых материалов и веб-присутствия сыграло прямую роль в позиционировании компании перед сделкой." },
      ],
      results: [{ v: "EXIT", l: "приобретена Veeam ($15B+)" },{ v: "2+ лет", l: "непрерывный контракт" },{ v: "100–120ч/мес", l: "стабильная загрузка" },{ v: "$100K+", l: "общий бюджет проекта" }],
    },
  },
  {
    client: "AK Cabinet Craft", tag: "MANUFACTURING · B2C · REVENUE SHARE", result: "3%", resultLabel: "revenue share",
    metrics: [{ v: "Чикаго", l: "рынок" },{ v: "3%", l: "от выручки" },{ v: "Full-cycle", l: "с нуля" }],
    desc: "Revenue-share партнёрство с производителем кастомных кухонь и шкафов в Чикаго. Построили весь маркетинг с нуля — от Google Ads и SEO до офлайн-каналов и CRM. Работаем за 3% от выручки вместо фиксированного ретейнера.",
    scope: ["Google Ads", "Local Services Ads", "SEO", "Google Business Profile", "HubSpot CRM", "Email Sequences", "Контент-маркетинг", "Postcards", "Партнёрства с дизайнерами"],
    detail: {
      challenge: "AK Cabinet Craft — семейный производитель кастомных кухонь и шкафов в Чикаго. Средний чек $15K–$40K. До нас клиенты приходили только по сарафану и рефералам от подрядчиков. Онлайн-присутствия ноль: нет рекламы, нет SEO, нет CRM. Нужна была полная маркетинговая инфраструктура — но бюджета на крупный ретейнер не было. Мы предложили revenue share модель.",
      solution: [
        { title: "Revenue Share модель (3%)", text: "Вместо фиксированного ретейнера — 3% от закрытых сделок. Мы инвестируем своё время, экспертизу и рекламный бюджет; зарабатываем только когда клиент зарабатывает. Полное совпадение интересов — мы заинтересованы не в лидах, а в закрытых продажах." },
        { title: "Google Ads + Local Services Ads", text: "Запустили Search-кампании и LSA, нацеленные на homeowners в Чикаго и пригородах с высоким доходом. Ключевые запросы: custom kitchen cabinets, cabinet refacing, kitchen remodel Chicago. Постоянная оптимизация по стоимости лида и квалификации заявок — отсекаем нецелевые обращения." },
        { title: "SEO + Google Business Profile", text: "Полная оптимизация GBP: регулярные посты, ответы на отзывы, фотографии реальных проектов до/после. SEO: технический аудит, оптимизация мета-тегов, создание location pages под Chicago suburbs, блог с kitchen renovation guides. Цель — доминировать в Local Pack." },
        { title: "HubSpot CRM + Email + Offline", text: "Внедрили HubSpot: pipeline по этапам (lead → estimate → signed → completed), автоматические follow-up sequences, lead scoring. Email-маркетинг: nurture-серия для тех, кто запросил estimate но не подписал. Offline: direct mail postcards по целевым zip-кодам, партнёрства с interior designers и general contractors." },
      ],
      results: [{ v: "3%", l: "revenue share вместо ретейнера" },{ v: "Full-cycle", l: "маркетинг полного цикла с нуля" },{ v: "HubSpot", l: "CRM + pipeline + автоматизация" },{ v: "Online + Offline", l: "Ads + SEO + GBP + Email + Direct Mail" }],
    },
  },
  {
    client: "SOS Moving → AI Moving", tag: "LOGISTICS · AI SaaS · PERFORMANCE", result: "$14.6M", resultLabel: "в продажах",
    metrics: [{ v: "10,235", l: "заказов" },{ v: "$400K+", l: "рекламный бюджет" },{ v: "AI SaaS", l: "продукт" }],
    desc: "Два этапа: performance-маркетинг, который принёс $14.6M в продажах и 10,235 заказов для мувинговой компании. Затем — трансформация накопленной экспертизы в AI SaaS-продукт для всей индустрии переездов.",
    scope: ["Google Ads", "Performance Max", "SEO", "Schema Markup", "GA4", "CallRail", "HubSpot CRM", "Lead Scoring", "AI Development", "SaaS"],
    detail: {
      challenge: "SOS Moving — мувинговая компания в конкурентном рынке. Проблемы: нет маркетинговой системы, высокая стоимость лида, нет трекинга звонков, CRM ведётся в таблицах. Цель первого этапа — построить прибыльную машину лидогенерации. Цель второго — превратить накопленный опыт и данные в отдельный AI SaaS-продукт для всей индустрии.",
      solution: [
        { title: "Google Ads: Search + PMax", text: "Запустили и масштабировали Search и Performance Max кампании. $400K+ рекламного бюджета под управлением. Разделение по типам переезда (local, long-distance, commercial), гео-таргетинг, негативные ключевые слова. Постоянная оптимизация ставок и креативов — снижение CPA при росте объёма заказов." },
        { title: "SEO + контент-стратегия", text: "Полный технический аудит: исправление crawl errors, canonical tags, page speed. Новая архитектура сайта: service pages по типам переезда, location pages по городам. Schema markup (LocalBusiness, FAQ, Review). Контент-стратегия: moving guides, cost calculators, checklists — контент на каждый этап воронки." },
        { title: "Сквозная аналитика и CRM", text: "Интеграция GA4 + CallRail + HubSpot в единую систему. Каждый звонок записывается, привязывается к keyword и campaign. HubSpot: кастомный pipeline, автоматические follow-up sequences, lead scoring по размеру переезда и срочности. Клиент видит реальный ROI по каждому каналу в реальном времени." },
        { title: "AI Moving — SaaS-продукт", text: "На основе 10K+ обработанных заказов и накопленных данных создали AI Moving — AI-платформу для мувинговых компаний. Автоматическая оценка стоимости по фото, оптимизация маршрутов, AI-чатбот для квалификации лидов, predictive analytics по загрузке. Из клиентского проекта — в самостоятельный продукт." },
      ],
      results: [{ v: "$14.6M", l: "общий объём продаж клиента" },{ v: "10,235", l: "выполненных заказов" },{ v: "$400K+", l: "рекламный бюджет под управлением" },{ v: "AI SaaS", l: "собственный продукт из экспертизы" }],
    },
  },
  {
    client: "R.O.C.S.", tag: "FMCG · ENTERPRISE · BRAND DESIGN", result: "2+ года", resultLabel: "партнёрство",
    metrics: [{ v: "Enterprise", l: "масштаб" },{ v: "3 бренда", l: "R.O.C.S. / Splat / BioMio" },{ v: "360°", l: "дизайн" }],
    desc: "Дизайн-партнёрство с одним из крупнейших FMCG-холдингов России (Splat Global). Поддержка трёх брендов с разным позиционированием: R.O.C.S., Splat, BioMio — от упаковки и key visuals до digital-кампаний и ритейл-материалов.",
    scope: ["Brand Design", "Key Visual", "Упаковка", "POS-материалы", "Digital-кампании", "SMM-контент", "Промо-лендинги", "Ритейл-оформление"],
    detail: {
      challenge: "R.O.C.S. — часть группы компаний Splat Global, один из крупнейших FMCG-холдингов России. Три бренда с принципиально разным позиционированием: R.O.C.S. (премиум oral care, высокая наценка), Splat (масс-маркет, широкая дистрибуция), BioMio (эко-сегмент, осознанное потребление). Нужна была внешняя дизайн-команда, способная работать на enterprise-уровне: быстрые сроки, корпоративные согласования, множество стейкхолдеров, работа по brand guidelines каждого бренда.",
      solution: [
        { title: "Brand Design для 3 брендов", text: "Работали параллельно с R.O.C.S., Splat и BioMio. Разрабатывали key visuals для сезонных кампаний, адаптации под разные каналы и форматы. Каждый бренд — свой tone of voice, своя цветовая палитра, свои правила. Переключение между брендами в рамках одного дня." },
        { title: "Упаковка и ритейл", text: "Дизайн упаковки для новых SKU, обновление существующих линеек. POS-материалы: шелфтокеры, воблеры, стенды. Оформление полок для федеральных сетей (Магнит, Пятёрочка, Перекрёсток). Адаптация под требования международных рынков — разные языки, разные регуляции." },
        { title: "Digital-кампании и контент", text: "Креативы для performance-рекламы (ВК, Яндекс, Google), SMM-контент для трёх аккаунтов параллельно, промо-лендинги под акции и новинки. Быстрый цикл: от брифа до финального материала за 2–5 дней. Баннеры, сторис, reels, email-шаблоны." },
        { title: "Enterprise-процессы", text: "Встроились в корпоративную структуру: регулярные созвоны, работа через корпоративный таск-трекер, согласования с brand-менеджерами и product-менеджерами. Строгое следование brand guidelines каждого бренда. Стабильное партнёрство 2+ года без перерывов." },
      ],
      results: [{ v: "3 бренда", l: "R.O.C.S. / Splat / BioMio" },{ v: "2+ лет", l: "непрерывное партнёрство" },{ v: "360°", l: "от упаковки до digital" },{ v: "Enterprise", l: "корпоративный масштаб и процессы" }],
    },
  },
];

/* ───── case modal ───── */
function CaseModal({ data, onClose }) {
  const overlayRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 350);
  };

  if (!data) return null;
  const d = data.detail;

  return (
    <div className="case-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current || e.target.classList.contains("case-overlay-bg")) handleClose(); }}>
      <div className="case-overlay-bg" style={{
        opacity: show ? 1 : 0, transition: "opacity .35s ease",
      }} />
      <div className="case-modal" style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
      }}>
        <div className="case-close">
          <button className="case-close-btn" onClick={handleClose} aria-label="Закрыть">✕</button>
        </div>

        <div style={{ padding: "8px 40px 48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ padding: "4px 10px", background: V.accentDim, borderRadius: 4, fontSize: "0.55rem", fontWeight: 700, color: V.accent, letterSpacing: "0.1em" }}>{data.tag}</span>
          </div>

          <h2 style={{ fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: V.bright, letterSpacing: "-0.03em", marginBottom: 8 }}>{data.client}</h2>
          <p style={{ fontSize: "0.88rem", color: V.dim, lineHeight: 1.65, marginBottom: 36, maxWidth: 600 }}>{data.desc}</p>

          <div className="case-modal-metrics" style={{
            display: "flex", gap: 32, marginBottom: 40, padding: "24px 28px",
            background: "rgba(0,0,0,0.015)", border: `1px solid ${V.border}`, borderRadius: V.radiusSm,
          }}>
            {d.results.map((r, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ fontFamily: V.heading, fontSize: "1.1rem", fontWeight: 900, color: V.bright, letterSpacing: "-0.03em", marginBottom: 3 }}>{r.v}</div>
                <div style={{ fontSize: "0.65rem", color: V.muted }}>{r.l}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: V.heading, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 12 }}>ЗАДАЧА</div>
            <p style={{ fontSize: "0.88rem", color: V.text, lineHeight: 1.7, maxWidth: 640 }}>{d.challenge}</p>
          </div>

          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: V.heading, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 20 }}>ЧТО МЫ СДЕЛАЛИ</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {d.solution.map((s, i) => (
                <div key={i} style={{ padding: "20px 24px", background: "rgba(0,0,0,0.015)", border: `1px solid ${V.border}`, borderRadius: V.radiusSm }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 800, color: "rgba(160,28,45,0.35)", minWidth: 20 }}>0{i + 1}</span>
                    <h4 style={{ fontFamily: V.heading, fontSize: "0.85rem", fontWeight: 800, color: V.bright, letterSpacing: "-0.02em", margin: 0 }}>{s.title}</h4>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: V.dim, lineHeight: 1.6, margin: 0, paddingLeft: 32 }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: V.heading, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 12 }}>УСЛУГИ</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.scope.map((s, j) => (
                <span key={j} style={{ padding: "5px 12px", borderRadius: 100, background: "rgba(0,0,0,0.03)", border: `1px solid ${V.border}`, fontSize: "0.7rem", color: V.dim, fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${V.divider}` }}>
            <a href="#contact" onClick={handleClose} className="btn-primary" style={{ fontFamily: V.body, display: "inline-block" }}>
              Обсудить похожий проект →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cases() {
  const [activeCase, setActiveCase] = useState(null);

  return (
    <section id="cases" style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal type="fade"><Label num="04" text="Кейсы" /></Reveal>
        <Reveal delay={80}>
          <h2 className="section-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 700, marginBottom: 56,
          }}>Результаты говорят за нас</h2>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {cases.map((c, i) => (
            <Reveal key={i} delay={120 + i * 100} type="up" duration={0.85}>
              <div className="case-card" onClick={() => setActiveCase(c)} style={{
                background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radius,
                padding: "40px 36px", position: "relative", overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
              }}>
                {i === 0 && <div style={{
                  position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
                  background: `linear-gradient(90deg, transparent, rgba(160,28,45,0.12), transparent)`,
                }} />}

                <div className="case-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                      <span style={{ padding: "4px 10px", background: V.accentDim, borderRadius: 4, fontSize: "0.55rem", fontWeight: 700, color: V.accent, letterSpacing: "0.1em" }}>{c.tag}</span>
                    </div>
                    <h3 style={{ fontFamily: V.heading, fontSize: "1.5rem", fontWeight: 900, color: V.bright, letterSpacing: "-0.03em", marginBottom: 12 }}>{c.client}</h3>
                    <p style={{ fontSize: "0.85rem", color: V.dim, lineHeight: 1.65, marginBottom: 20, maxWidth: 420 }}>{c.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {c.scope.map((s, j) => (
                        <span key={j} style={{ padding: "4px 10px", borderRadius: 100, background: "rgba(0,0,0,0.03)", border: `1px solid ${V.border}`, fontSize: "0.65rem", color: V.dim, fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                    <span className="case-cta" style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontWeight: 600, fontSize: "0.75rem", color: V.accentLit,
                      letterSpacing: "0.03em", opacity: 0.6,
                      transform: "translateX(-4px)", transition: "all .35s cubic-bezier(.16,1,.3,1)",
                    }}>ПОДРОБНЕЕ <span>→</span></span>
                  </div>

                  <div>
                    <div style={{ marginBottom: 28 }}>
                      <div style={{ fontFamily: V.heading, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: V.bright, letterSpacing: "-0.04em", lineHeight: 1 }}>{c.result}</div>
                      <div style={{ fontSize: "0.75rem", color: V.muted, fontWeight: 600, marginTop: 4 }}>{c.resultLabel}</div>
                    </div>
                    <div style={{ display: "flex", gap: 28 }}>
                      {c.metrics.map((m, j) => (
                        <div key={j} style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: V.heading, fontSize: "0.9rem", fontWeight: 800, color: V.text, letterSpacing: "-0.02em", marginBottom: 2 }}>{m.v}</div>
                          <div style={{ fontSize: "0.65rem", color: V.muted }}>{m.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {activeCase && <CaseModal data={activeCase} onClose={() => setActiveCase(null)} />}
    </section>
  );
}

/* ═══════════════════════ STATEMENT ═══════════════════════ */
function Statement() {
  const [ref, visible] = useInView({ threshold: 0.3 });
  const dimText = "Мы не просто запускаем рекламу. ";
  const brightText = "Мы строим системы, где AI, данные и маркетинг работают как единый механизм";
  const endText = " — и приносят измеримый результат.";
  return (
    <section style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <h2 ref={ref} style={{
          fontFamily: V.heading, fontSize: "clamp(1.5rem, 3vw, 2.3rem)",
          fontWeight: 800, lineHeight: 1.35, letterSpacing: "-0.03em", maxWidth: 850,
        }}>
          {dimText.split(" ").map((word, i) => (
            <span key={`d${i}`} style={{
              color: V.muted, display: "inline-block", marginRight: "0.3em",
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: `all 0.5s cubic-bezier(.16,1,.3,1) ${i * 50}ms`,
            }}>{word}</span>
          ))}
          {brightText.split(" ").map((word, i) => (
            <span key={`b${i}`} style={{
              color: V.bright, display: "inline-block", marginRight: "0.3em",
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: `all 0.5s cubic-bezier(.16,1,.3,1) ${(dimText.split(" ").length + i) * 50}ms`,
            }}>{word}</span>
          ))}
          {endText.split(" ").filter(Boolean).map((word, i) => (
            <span key={`e${i}`} style={{
              color: V.muted, display: "inline-block", marginRight: "0.3em",
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: `all 0.5s cubic-bezier(.16,1,.3,1) ${(dimText.split(" ").length + brightText.split(" ").length + i) * 50}ms`,
            }}>{word}</span>
          ))}
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
            <Reveal delay={80} type="left">
              <h2 className="section-heading" style={{
                fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
                lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, marginBottom: 20,
              }}>Обсудим ваш проект?</h2>
            </Reveal>
            <Reveal delay={160} type="fade">
              <p style={{ fontSize: "0.95rem", color: V.dim, lineHeight: 1.7, marginBottom: 44, maxWidth: 380 }}>
                Оставьте заявку — мы свяжемся в течение 24 часов.
              </p>
            </Reveal>
            <Reveal delay={240} type="left">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Email", value: "agency.bankai@gmail.com", href: "mailto:agency.bankai@gmail.com" },
                  { label: "Telegram", value: "@bankaiagency", href: "https://t.me/bankaiagency" },
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
