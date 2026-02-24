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
.btn-submit{border:none;color:#fff;padding:16px 32px;border-radius:100px;background:linear-gradient(135deg,#A01C2D,#C8354A);font-weight:700;font-size:0.88rem;cursor:pointer;letter-spacing:0.04em;transition:all .4s cubic-bezier(.16,1,.3,1);width:100%;box-shadow:0 4px 20px rgba(160,28,45,0.35)}
.btn-submit:hover:not(:disabled){background:linear-gradient(135deg,#8a1725,#B02A3E);transform:translateY(-2px);box-shadow:0 10px 36px rgba(160,28,45,0.5)}
.btn-submit:disabled{opacity:0.5;cursor:not-allowed}

/* configurator chips */
.cfg-chip:hover{transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,0.06)}

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
    desc: "Снижаем CPA, растим конверсии, строим воронку от первого клика до повторной покупки. Управляли бюджетами $400K+ и приносили $14.6M в продажах.",
    tags: ["Google Ads", "SEO", "Meta Ads", "Email", "Контент", "Аналитика"],
  },
  {
    icon: "⚡", title: "Автоматизация",
    desc: "AI-агенты отвечают за 2 минуты вместо 2 часов. CRM ведёт лид от заявки до сделки без потерь. Чат-боты конвертируют 35% ночных обращений.",
    tags: ["AI-агенты", "HubSpot", "CRM", "Чат-боты", "Воронки"],
  },
  {
    icon: "🎨", title: "Дизайн и разработка",
    desc: "200+ компонентов в дизайн-системах, 50+ страниц сайтов на HubSpot и Next.js. Делали материалы для стартапа, который купил Veeam за $15B+.",
    tags: ["UI/UX", "Next.js", "Figma", "Брендинг", "Упаковка"],
  },
  {
    icon: "🧠", title: "Консалтинг",
    desc: "Находим, где бизнес теряет деньги: аудит воронки, unit-экономика, стратегия роста. Считаем цифры — не рисуем слайды.",
    tags: ["Аудит", "Стратегия", "Unit-экономика", "Масштабирование"],
  },
];

function SvcIcon({ name, size = 28 }) {
  const s = { width: size, height: size, flexShrink: 0, objectFit: "contain" };
  const logos = {
    google: "https://cdn.simpleicons.org/googleads",
    meta: "https://cdn.simpleicons.org/meta/0081FB",
    seo: "https://cdn.simpleicons.org/google",
    web: "https://cdn.simpleicons.org/react/61DAFB",
    crm: "https://cdn.simpleicons.org/hubspot/FF7A59",
    analytics: "https://cdn.simpleicons.org/googleanalytics/E37400",
    content: "https://cdn.simpleicons.org/wordpress/21759B",
    branding: "https://cdn.simpleicons.org/figma",
  };
  const url = logos[name];
  if (!url) return null;
  /* eslint-disable-next-line @next/next/no-img-element */
  return <img src={url} alt={name} style={s} loading="lazy" />;
}

const services = [
  { t: "Google Ads", d: "Search, PMax, YouTube — от запуска до снижения CPA на 40%.", icon: "google" },
  { t: "Meta Ads", d: "Facebook + Instagram: таргетинг, ретаргетинг, Lookalike-аудитории.", icon: "meta" },
  { t: "SEO", d: "Технический аудит, контент-стратегия, линкбилдинг, рост органики.", icon: "seo" },
  { t: "Web Dev", d: "Next.js, React — сайты с конверсией выше среднего по рынку.", icon: "web" },
  { t: "CRM", d: "HubSpot, Salesforce — воронки, scoring, автоматические follow-up.", icon: "crm" },
  { t: "Analytics", d: "GA4, Looker Studio — сквозная аналитика от клика до сделки.", icon: "analytics" },
  { t: "Content", d: "Блоги, рассылки, SMM, видео — контент, который генерирует лиды.", icon: "content" },
  { t: "Branding", d: "Логотипы, UI/UX, фирменный стиль, дизайн-системы.", icon: "branding" },
];

const steps = [
  { n: "01", t: "Аудит", d: "Разбираем воронку, рекламу, CRM, сайт. Считаем unit-экономику и находим, где утекают деньги." },
  { n: "02", t: "Стратегия", d: "Строим дорожную карту: какие каналы запускать первыми, какой бюджет нужен, какой ROI ожидать." },
  { n: "03", t: "Внедрение", d: "Запускаем рекламу, настраиваем CRM, подключаем аналитику. Первые лиды — в течение 2 недель." },
  { n: "04", t: "Масштаб", d: "A/B тесты, оптимизация ставок, новые каналы. Масштабируем то, что приносит деньги." },
];

/* ═══════════════════════ GRADIENT ARC (light theme) ═══════════════════════ */
/* ═══════════════════════ DIGITAL GRID BG (hero) ═══════════════════════ */
function DigitalGrid() {
  const ref = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const sm = useRef({ x: 0.5, y: 0.5 });
  const raf = useRef(null);
  const t = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, dpr;

    /* grid config */
    const CELL = 52;
    const accentR = 160, accentG = 28, accentB = 45;

    /* data streams — horizontal flowing pulses */
    const streams = [];
    for (let i = 0; i < 18; i++) {
      streams.push({
        row: Math.floor(Math.random() * 30),
        x: Math.random(),
        speed: 0.0008 + Math.random() * 0.0018,
        len: 0.06 + Math.random() * 0.14,
        alpha: 0.12 + Math.random() * 0.18,
        dir: Math.random() > 0.5 ? 1 : -1,
        isVertical: Math.random() > 0.6,
      });
    }

    /* floating binary snippets */
    const bits = [];
    for (let i = 0; i < 10; i++) {
      bits.push({
        x: 0.05 + Math.random() * 0.9,
        y: 0.05 + Math.random() * 0.9,
        text: Array.from({ length: 6 + Math.floor(Math.random() * 8) }, () => Math.random() > 0.5 ? "1" : "0").join(""),
        alpha: 0.04 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
      });
    }

    /* circuit nodes — bright accent dots at intersections */
    const circuitNodes = [];
    for (let i = 0; i < 14; i++) {
      circuitNodes.push({
        gx: 2 + Math.floor(Math.random() * 18),
        gy: 1 + Math.floor(Math.random() * 14),
        pulse: Math.random() * Math.PI * 2,
        size: 2 + Math.random() * 2,
      });
    }

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
      t.current += 0.006;
      const T = t.current;
      const s = sm.current, m = mouse.current;
      s.x += (m.x - s.x) * 0.04;
      s.y += (m.y - s.y) * 0.04;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / CELL) + 1;
      const rows = Math.ceil(h / CELL) + 1;

      /* ── 1. dot grid ── */
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const px = col * CELL;
          const py = row * CELL;
          /* mouse proximity highlight */
          const dx = px / w - s.x;
          const dy = py / h - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / 0.35);
          const dotAlpha = 0.06 + proximity * 0.14;
          const dotSize = 1 + proximity * 1.5;

          ctx.beginPath();
          ctx.arc(px, py, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentR},${accentG},${accentB},${dotAlpha})`;
          ctx.fill();
        }
      }

      /* ── 2. grid lines (very subtle) ── */
      ctx.lineWidth = 0.5;
      for (let row = 0; row < rows; row++) {
        const py = row * CELL;
        const dy = py / h - s.y;
        const dist = Math.abs(dy);
        const alpha = 0.02 + Math.max(0, 1 - dist / 0.3) * 0.04;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
        ctx.strokeStyle = `rgba(${accentR},${accentG},${accentB},${alpha})`;
        ctx.stroke();
      }
      for (let col = 0; col < cols; col++) {
        const px = col * CELL;
        const dx = px / w - s.x;
        const dist = Math.abs(dx);
        const alpha = 0.02 + Math.max(0, 1 - dist / 0.3) * 0.04;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
        ctx.strokeStyle = `rgba(${accentR},${accentG},${accentB},${alpha})`;
        ctx.stroke();
      }

      /* ── 3. data streams (flowing pulses along grid) ── */
      for (const st of streams) {
        st.x += st.speed * st.dir;
        if (st.x > 1.2) st.x = -0.2;
        if (st.x < -0.2) st.x = 1.2;

        const isV = st.isVertical;
        const linePos = st.row * CELL;
        const headPos = st.x * (isV ? h : w);
        const tailLen = st.len * (isV ? h : w);

        const grad = isV
          ? ctx.createLinearGradient(linePos, headPos - tailLen * st.dir, linePos, headPos)
          : ctx.createLinearGradient(headPos - tailLen * st.dir, linePos, headPos, linePos);

        grad.addColorStop(0, `rgba(${accentR},${accentG},${accentB},0)`);
        grad.addColorStop(0.7, `rgba(${accentR},${accentG},${accentB},${st.alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${accentR},${accentG},${accentB},${st.alpha})`);

        ctx.beginPath();
        if (isV) {
          ctx.moveTo(linePos, headPos - tailLen * st.dir);
          ctx.lineTo(linePos, headPos);
        } else {
          ctx.moveTo(headPos - tailLen * st.dir, linePos);
          ctx.lineTo(headPos, linePos);
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        /* head glow */
        const hx = isV ? linePos : headPos;
        const hy = isV ? headPos : linePos;
        const grd = ctx.createRadialGradient(hx, hy, 0, hx, hy, 8);
        grd.addColorStop(0, `rgba(${accentR},${accentG},${accentB},${st.alpha * 0.6})`);
        grd.addColorStop(1, `rgba(${accentR},${accentG},${accentB},0)`);
        ctx.beginPath();
        ctx.arc(hx, hy, 8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      /* ── 4. circuit nodes (pulsing dots at intersections) ── */
      for (const cn of circuitNodes) {
        const px = cn.gx * CELL;
        const py = cn.gy * CELL;
        const pulse = 0.6 + Math.sin(T * 1.8 + cn.pulse) * 0.4;
        const r = cn.size * pulse;

        /* outer glow */
        const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 6);
        grd.addColorStop(0, `rgba(${accentR},${accentG},${accentB},${0.1 * pulse})`);
        grd.addColorStop(1, `rgba(${accentR},${accentG},${accentB},0)`);
        ctx.beginPath();
        ctx.arc(px, py, r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        /* core */
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentR},${accentG},${accentB},${0.25 * pulse})`;
        ctx.fill();
      }

      /* ── 5. floating binary snippets ── */
      ctx.font = "500 9px 'Manrope', monospace";
      ctx.textAlign = "left";
      for (const b of bits) {
        const floatY = Math.sin(T * b.speed + b.phase) * 8;
        const px = b.x * w;
        const py = b.y * h + floatY;
        const fadePulse = 0.5 + Math.sin(T * 0.8 + b.phase) * 0.5;
        ctx.fillStyle = `rgba(${accentR},${accentG},${accentB},${b.alpha * fadePulse})`;
        ctx.fillText(b.text, px, py);
      }

      /* ── 6. mouse interaction ring ── */
      const mx = s.x * w;
      const my = s.y * h;
      const ringR = 80 + Math.sin(T * 1.2) * 10;
      const ringGrd = ctx.createRadialGradient(mx, my, ringR * 0.4, mx, my, ringR);
      ringGrd.addColorStop(0, `rgba(${accentR},${accentG},${accentB},0)`);
      ringGrd.addColorStop(0.7, `rgba(${accentR},${accentG},${accentB},0.03)`);
      ringGrd.addColorStop(1, `rgba(${accentR},${accentG},${accentB},0)`);
      ctx.beginPath();
      ctx.arc(mx, my, ringR, 0, Math.PI * 2);
      ctx.fillStyle = ringGrd;
      ctx.fill();

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      removeEventListener("resize", resize);
      removeEventListener("mousemove", onMove);
    };
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
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(scrollY > 38);
    addEventListener("scroll", h, { passive: true });
    return () => removeEventListener("scroll", h);
  }, []);
  return (
    <>
      <nav role="navigation" aria-label="Основная навигация" style={{
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
            <a href="#services" className="nav-link">Услуги</a>
            <a href="#process" className="nav-link">Процесс</a>
            <a href="#cases" className="nav-link">Кейсы</a>
            <a href="#contact" className="nav-cta" style={{ fontFamily: V.heading }}>СВЯЗАТЬСЯ</a>
          </div>
          {/* hamburger — hidden on desktop via CSS */}
          <button className="nav-burger" aria-label="Открыть меню" onClick={() => setMobileOpen(!mobileOpen)} style={{
            display: "none", background: "none", border: "none", cursor: "pointer", padding: 8,
            flexDirection: "column", gap: 5, alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ display: "block", width: 22, height: 2, background: V.bright, borderRadius: 1, transition: "all .3s", transform: mobileOpen ? "rotate(45deg) translateY(3.5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: V.bright, borderRadius: 1, transition: "all .3s", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: V.bright, borderRadius: 1, transition: "all .3s", transform: mobileOpen ? "rotate(-45deg) translateY(-3.5px)" : "none" }} />
          </button>
        </div>
      </nav>
      {/* mobile menu overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: scrolled ? 64 : 102, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: "rgba(250,248,245,0.98)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
          fontFamily: V.body,
        }}>
          {[
            { href: "#services", label: "Услуги" },
            { href: "#process", label: "Процесс" },
            { href: "#cases", label: "Кейсы" },
            { href: "#contact", label: "Связаться" },
          ].map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
              fontFamily: V.heading, fontSize: "1.4rem", fontWeight: 700,
              color: V.bright, textDecoration: "none", letterSpacing: "-0.02em",
              transition: "color .3s",
            }}>{item.label}</a>
          ))}
        </div>
      )}
    </>
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
  const words = ["выручку", "клиентов", "стабильность", "результат"];
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
      <DigitalGrid />
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
                fontFamily: V.heading, fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)",
                fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.05em",
                color: V.bright, marginBottom: 28,
              }}>
                Строим системы,<br />которые приносят<br /><RotatingWord />
              </h1>
            </Reveal>

            <Reveal delay={300} type="fade" duration={1}>
              <p style={{ fontSize: "1.02rem", color: V.dim, maxWidth: 440, lineHeight: 1.75, marginBottom: 40 }}>
                Маркетинг, автоматизация, дизайн и разработка — единая digital-команда, которая растёт вместе с вашим бизнесом.
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
                    <div style={{ fontSize: "0.72rem", color: V.dim, fontWeight: 500 }}>{stat.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — visual cards */}
          <div className="hero-right" style={{ position: "relative", minHeight: 480, paddingTop: 60 }}>
            {/* network/automation animation background */}
            <NetworkCanvas />
            {/* floating case cards */}
            <Reveal delay={400} type="scale" duration={1}>
              <div className="hero-float-1 hero-visual-card" style={{
                position: "absolute", top: 20, right: 0, width: 280, zIndex: 1,
                background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
                borderRadius: 16, padding: "28px 24px", boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                cursor: "default",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ padding: "3px 8px", background: "rgba(233,69,96,0.15)", borderRadius: 4, fontSize: "0.5rem", fontWeight: 700, color: "#e94560", letterSpacing: "0.1em" }}>EXIT</span>
                  <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>SaaS · Data Protection</span>
                </div>
                <div style={{ fontFamily: V.heading, fontSize: "0.95rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>Object First → Veeam</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 16 }}>Единственная внешняя дизайн-команда. 2+ года → клиент приобретён Veeam.</div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1.2rem", fontWeight: 900, color: "#e94560" }}>EXIT</div><div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>acquired</div></div>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1.2rem", fontWeight: 900, color: "#fff" }}>2+</div><div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>лет</div></div>
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
                <div style={{ fontSize: "0.68rem", color: V.dim, lineHeight: 1.5, marginBottom: 12 }}>Full-cycle маркетинг за 3% от выручки. Чикаго.</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 900, color: V.accent }}>3%</div><div style={{ fontSize: "0.48rem", color: V.muted }}>от выручки</div></div>
                  <div><div style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 900, color: V.bright }}>Full</div><div style={{ fontSize: "0.48rem", color: V.muted }}>цикл</div></div>
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
        <Reveal type="fade"><Label num="01" text="Направления" /></Reveal>
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
                Берём на себя весь digital: от рекламы и SEO до CRM, AI-автоматизации и разработки. Работаем за процент от выручки — если вы не зарабатываете, мы тоже. Один партнёр вместо пяти подрядчиков.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36, marginTop: "auto" }}>
                {[
                  "Одна команда на маркетинг, автоматизацию, дизайн и разработку",
                  "Revenue share — платите только когда растёт выручка",
                  "Еженедельные отчёты с прозрачной unit-экономикой",
                  "Полное погружение: стендапы, доступ к данным, общие KPI",
                  "Быстрый старт — первые результаты за 2–4 недели",
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
          <div className="dir-inner-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
              <strong style={{ color: V.bright, fontWeight: 700 }}>Полный цикл</strong> — когда нужен сильный digital-партнёр на долгосрок.<br/><strong style={{ color: V.bright, fontWeight: 700 }}>Отдельное направление</strong> — когда нужна конкретная экспертиза: запустить рекламу, построить CRM, обновить сайт или провести аудит.
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
        }}>Инструменты, которыми мы приносим деньги</RevealHeading>

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
        }}>От аудита до масштаба за 4 шага</RevealHeading>

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
        }}>Не обещания — а цифры из реальных проектов</RevealHeading>

        <div className="cases-masonry" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {cases.filter((_, i) => i % 2 === 0).map((c, i) => (
            <Reveal key={c.slug} delay={120 + i * 160} type="scale" duration={0.8}>
              <Link href={`/cases/${c.slug}`} className="case-card-link">
                <div className="case-card-new" style={{ height: 380, borderRadius: V.radius }}>
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
          {/* Right column — offset down for Pinterest feel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 80 }}>
            {cases.filter((_, i) => i % 2 === 1).map((c, i) => (
            <Reveal key={c.slug} delay={200 + i * 160} type="scale" duration={0.8}>
              <Link href={`/cases/${c.slug}`} className="case-card-link">
                <div className="case-card-new" style={{ height: 380, borderRadius: V.radius }}>
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
  const brightText = "Мы создаём экосистему, где AI, данные и маркетинг работают как единый механизм";
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

/* ═══════════════════════ CONTACT BG ANIMATION ═══════════════════════ */
function ContactBg() {
  const ref = useRef(null);
  const raf = useRef(null);
  const t = useRef(0);

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
      t.current += 0.003;
      const T = t.current;
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

/* ═══════════════════════ CONTACT ═══════════════════════ */
function Contact() {
  const serviceOptions = [
    "Google Ads / PPC", "SEO", "Meta / Instagram Ads", "CRM и автоматизация",
    "Дизайн и разработка сайта", "AI-агенты / Чат-боты", "Контент и SMM", "Аудит маркетинга",
  ];
  const revenueOptions = ["До $10K/мес", "$10K–$50K/мес", "$50K–$200K/мес", "$200K+/мес", "Стартап / Пока нет выручки"];

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
          _subject: `Заявка от ${form.name} | ${form.niche || "без ниши"}`,
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
        {/* animated card wrapper */}
        <div style={{ position: "relative", borderRadius: 24, padding: "64px 56px", overflow: "hidden", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", border: `1px solid ${V.border}`, boxShadow: "0 8px 48px rgba(0,0,0,0.06)" }} className="contact-card-wrap">
          <ContactBg />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56, alignItems: "start" }}>
              {/* LEFT — info */}
              <div>
                <Reveal type="fade"><Label num="05" text="Контакты" /></Reveal>
                <RevealHeading delay={80} className="section-heading" style={{
                  fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
                  lineHeight: 1.1, letterSpacing: "-0.04em", color: V.bright, marginBottom: 16,
                }}>Расскажите о вашем проекте</RevealHeading>
                <RevealParagraph delay={160} style={{ fontSize: "0.92rem", color: V.dim, lineHeight: 1.7, marginBottom: 44, maxWidth: 380 }}>
                  Заполните бриф — мы изучим ваш бизнес и предложим решение в течение 48 часов.
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

              {/* RIGHT — configurator form */}
              <Reveal delay={150} type="right" duration={0.9}>
                <div style={{ background: "rgba(255,255,255,0.85)", border: `1px solid ${V.border}`, borderRadius: V.radius, padding: "32px 28px", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
                  {sent ? (
                    <div style={{ textAlign: "center", padding: "44px 0" }}>
                      <div style={{ fontSize: "2rem", marginBottom: 12 }}>🚀</div>
                      <div style={{ fontFamily: V.heading, fontSize: "1.2rem", fontWeight: 800, color: V.bright, marginBottom: 8 }}>Бриф получен!</div>
                      <p style={{ color: V.dim, fontSize: "0.85rem", lineHeight: 1.6 }}>Мы изучим ваш проект и свяжемся<br />в течение 48 часов.</p>
                    </div>
                  ) : (
                    <form onSubmit={submit}>
                      {/* Step 1: What do you need? */}
                      <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>Что вас интересует?</label>
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

                      {/* Step 2: Name + Contact */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div>
                          <label htmlFor="cfg-name" style={labelStyle}>Имя</label>
                          <input id="cfg-name" className="form-input" style={{ fontFamily: V.body }} placeholder="Как вас зовут" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div>
                          <label htmlFor="cfg-contact" style={labelStyle}>Телефон или email</label>
                          <input id="cfg-contact" className="form-input" style={{ fontFamily: V.body }} placeholder="Как связаться" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required />
                        </div>
                      </div>

                      {/* Step 3: Niche + Revenue */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div>
                          <label htmlFor="cfg-niche" style={labelStyle}>Ниша / индустрия</label>
                          <input id="cfg-niche" className="form-input" style={{ fontFamily: V.body }} placeholder="Напр: e-commerce, SaaS" value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })} />
                        </div>
                        <div>
                          <label htmlFor="cfg-revenue" style={labelStyle}>Текущий оборот</label>
                          <select id="cfg-revenue" className="form-input" style={{ fontFamily: V.body, cursor: "pointer", color: form.revenue ? V.bright : V.muted }} value={form.revenue} onChange={e => setForm({ ...form, revenue: e.target.value })}>
                            <option value="" disabled>Выберите</option>
                            {revenueOptions.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Step 4: Link */}
                      <div style={{ marginBottom: 16 }}>
                        <label htmlFor="cfg-link" style={labelStyle}>Ссылка на сайт или соцсети</label>
                        <input id="cfg-link" className="form-input" style={{ fontFamily: V.body }} placeholder="https://..." value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                      </div>

                      {/* Step 5: Message */}
                      <div style={{ marginBottom: 20 }}>
                        <label htmlFor="cfg-msg" style={labelStyle}>Что хотите рассказать ещё?</label>
                        <textarea id="cfg-msg" className="form-input" style={{ fontFamily: V.body, minHeight: 70, resize: "vertical" }} placeholder="Задачи, сроки, бюджет, ожидания..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                      </div>

                      <button type="submit" disabled={sending} className="btn-submit" style={{ fontFamily: V.body }}>
                        {sending ? "Отправляем..." : "Отправить бриф →"}
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

/* ═══════════════════════ FOOTER ═══════════════════════ */
function Footer() {
  return (
    <Reveal type="fade" duration={1}>
      <footer style={{ padding: "32px 0", borderTop: `1px solid ${V.divider}`, position: "relative", zIndex: 1 }}>
        <div style={{ ...cx, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="footer-logo" style={{ fontFamily: V.heading, fontWeight: 900, fontSize: "0.8rem", color: V.muted, cursor: "default", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="18" height="18" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, opacity: 0.5 }}>
              <rect width="256" height="256" rx="42.6667" fill="#DF5440"/>
              <path d="M87.0069 78.4321L172.234 53.5611L172.234 53.5611C196.129 46.5881 208.077 43.1017 210.843 48.0941C213.609 53.0866 204.317 61.367 185.734 77.9279L153.845 106.347C146.512 112.882 142.846 116.15 143.738 119.537C144.63 122.925 149.443 123.966 159.07 126.049C170.467 128.514 176.165 129.747 177.353 133.831C178.542 137.916 174.405 142.001 166.132 150.173L128.971 186.878C114.297 201.372 106.96 208.619 102.485 206.586C101.963 206.348 101.47 206.048 101.02 205.693C97.1598 202.65 100.234 192.806 106.382 173.118C108.3 166.976 109.259 163.905 107.908 161.695C107.739 161.418 107.546 161.156 107.333 160.912C105.626 158.963 102.409 158.963 95.9739 158.963H91.6315C76.3852 158.963 68.7621 158.963 64.4942 154.069C60.2262 149.174 61.2642 141.622 63.34 126.518L66.7154 101.958C67.9389 93.0553 68.5507 88.604 71.309 85.4061C74.0673 82.2081 78.3805 80.9494 87.0069 78.4321Z" fill="white"/>
            </svg>
            <span>BANKAI<span className="footer-dot" style={{ color: V.accent, opacity: 0.5, margin: "0 0.01em" }}>.</span>AGENCY</span>
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
        <div className="dev-banner" style={{
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
