"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getDictionary } from "../i18n";
import { getCases } from "./cases/data";

/* ───── design tokens (clean white, Inter-based, vc.ru editorial) ───── */
const V = {
  bg: "#ffffff",
  card: "#ffffff",
  cardHover: "#fafafa",
  text: "#333333",
  dim: "#666666",
  muted: "#999999",
  bright: "#111111",
  accent: "#A01C2D",
  accentLit: "#C8354A",
  accentDim: "rgba(160,28,45,0.06)",
  accentGlow: "rgba(160,28,45,0.12)",
  border: "#e8e8e8",
  borderHover: "#d0d0d0",
  divider: "#eeeeee",
  radius: 12,
  radiusSm: 8,
  heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
@keyframes typingDot{0%,60%,100%{opacity:0.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}
.chat-chip:hover{background:rgba(160,28,45,0.06)!important;border-color:rgba(160,28,45,0.15)!important;color:#A01C2D!important}
.chat-input-wrap:focus-within{border-color:rgba(160,28,45,0.25)!important;background:rgba(255,255,255,0.8)!important;box-shadow:0 0 0 3px rgba(160,28,45,0.06)}
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
::selection{background:rgba(160,28,45,0.15);color:#111111}
html{scroll-behavior:smooth}

/* ═══ HOVER & FOCUS CLASSES ═══ */

/* nav links */
.nav-link{color:#666666;font-size:0.8rem;text-decoration:none;font-weight:500;letter-spacing:0.02em;transition:color .3s}
.nav-link:hover{color:#111111}

/* nav cta */
.nav-cta{border:1px solid rgba(0,0,0,0.14);color:#111111;padding:8px 20px;border-radius:100px;font-weight:600;font-size:0.75rem;text-decoration:none;letter-spacing:0.04em;transition:all .3s;cursor:pointer;background:transparent}
.nav-cta:hover{background:#A01C2D;border-color:#A01C2D;color:#fff}

/* primary cta (hero) */
.btn-primary{border:1px solid rgba(0,0,0,0.12);color:#111111;padding:14px 36px;border-radius:100px;background:rgba(0,0,0,0.03);font-weight:600;font-size:0.85rem;text-decoration:none;cursor:pointer;transition:all .35s cubic-bezier(.16,1,.3,1)}
.btn-primary:hover{background:#A01C2D;border-color:#A01C2D;color:#fff;transform:translateY(-2px);box-shadow:0 8px 32px rgba(160,28,45,0.2)}

/* ghost cta */
.btn-ghost{color:#666666;padding:14px 36px;border-radius:100px;font-weight:500;font-size:0.85rem;text-decoration:none;cursor:pointer;transition:all .3s;border:none;background:none}
.btn-ghost:hover{color:#A01C2D}
.btn-ghost:hover .arrow{transform:translateX(4px)}
.btn-ghost .arrow{display:inline-block;transition:transform .3s}

/* card link */
.card-link{display:inline-flex;align-items:center;gap:6px;font-weight:600;font-size:0.78rem;text-decoration:none;letter-spacing:0.03em;transition:all .3s;cursor:pointer}
.card-link:hover{gap:10px}
.card-link.accent{color:#C8354A}
.card-link.accent:hover{color:#A01C2D}
.card-link.dim{color:#666666}
.card-link.dim:hover{color:#111111}

/* service grid card */
.svc-card{background:#fff;border:1px solid #e8e8e8;border-radius:12px;padding:28px 24px;transition:all .3s cubic-bezier(.16,1,.3,1);cursor:default}
.svc-card:hover{background:#fafafa;border-color:#d0d0d0;transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.06)}
.svc-card:hover .svc-icon{opacity:1;transform:scale(1.08)}
.svc-icon{opacity:0.85;transition:all .3s;transform:scale(1)}

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
.footer-nav-link:hover{color:rgba(255,255,255,0.9)!important}
.footer-nav-link:hover .footer-link-line{width:16px!important}
.footer-nav-link:hover .footer-icon-box{background:rgba(255,255,255,0.1)!important;border-color:rgba(255,255,255,0.15)!important}
.footer-cta-btn:hover{transform:translateY(-3px)!important;box-shadow:0 8px 48px rgba(160,28,45,0.5),0 0 120px rgba(160,28,45,0.2)!important}
.footer-cta-btn:hover .footer-cta-arrow{transform:translateX(4px)}
.footer-tag:hover{background:rgba(200,53,74,0.1)!important;border-color:rgba(200,53,74,0.2)!important;color:rgba(200,53,74,0.7)!important}

/* input focus */
.form-input{width:100%;padding:13px 16px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.08);border-radius:10px;color:#111111;font-size:0.88rem;outline:none;transition:all .3s}
.form-input:focus{border-color:rgba(160,28,45,0.3);background:#fff;box-shadow:0 0 0 3px rgba(160,28,45,0.06)}
.form-input::placeholder{color:#999999}

/* case card — chipsa style */
.case-card-ch{position:relative;overflow:hidden;border-radius:20px;cursor:pointer;transition:all .6s cubic-bezier(.16,1,.3,1)}
.case-card-ch:hover{transform:scale(0.985);box-shadow:0 32px 80px rgba(0,0,0,0.15)}
.case-card-ch .case-bg-ch{transition:transform .8s cubic-bezier(.16,1,.3,1)}
.case-card-ch:hover .case-bg-ch{transform:scale(1.04)}
.case-card-ch .case-btn-ch{transform:translateY(8px);opacity:0;transition:all .4s cubic-bezier(.16,1,.3,1) .1s}
.case-card-ch:hover .case-btn-ch{transform:translateY(0);opacity:1}
.case-card-link{display:block;text-decoration:none!important}
.case-card-ch .case-tags-ch{transition:all .4s cubic-bezier(.16,1,.3,1)}
.case-card-ch:hover .case-tags-ch{transform:translateY(-4px)}

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
  .footer-top{grid-template-columns:1fr 1fr!important;gap:32px!important}
  .footer-bottom{flex-direction:column!important;gap:16px!important;align-items:flex-start!important}
  .cases-masonry{grid-template-columns:1fr!important}
  .cases-masonry>div:last-child{padding-top:0!important}
  .case-card-ch{height:360px!important}
  .case-hero-ch{height:420px!important}
  .cases-heading-ch{font-size:3rem!important}
  .stat-grid{grid-template-columns:repeat(3,1fr)!important;gap:16px!important}
  .services-split{grid-template-columns:1fr!important}
  .hero-grid{grid-template-columns:1fr!important;gap:32px!important}
  .hero-right{min-height:auto!important;padding-top:0!important}
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

function SvcIcon({ name, size = 32 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  const svgProps = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" };

  const icons = {
    google: (
      <svg {...svgProps} viewBox="0 0 24 24">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#4285F4" fillOpacity="0.1" stroke="#4285F4"/>
        <path d="M17.5 12.3h-5.3v1.8h3c-.3 1.5-1.6 2.5-3 2.5-1.8 0-3.3-1.5-3.3-3.3S10.4 10 12.2 10c.8 0 1.5.3 2.1.8l1.3-1.3C14.6 8.6 13.5 8.2 12.2 8.2 9.4 8.2 7 10.5 7 13.3s2.4 5.2 5.2 5.2c2.7 0 5.2-1.9 5.2-5.2 0-.4 0-.7-.1-1z" fill="#4285F4"/>
      </svg>
    ),
    meta: (
      <svg {...svgProps} viewBox="0 0 24 24">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#0081FB" fillOpacity="0.1" stroke="#0081FB"/>
        <path d="M7.5 15.5c0-1.2.5-2.7 1.2-4 .9-1.6 2-2.7 3-2.7.7 0 1.2.5 1.8 1.5l.5.9.5-.9c.6-1 1.1-1.5 1.8-1.5 1 0 2.1 1.1 3 2.7.7 1.3 1.2 2.8 1.2 4 0 1.4-.8 2.2-2 2.2-.9 0-1.4-.3-2.3-1.3l-.7-.8c-.3-.3-.5-.5-.8-.5s-.5.2-.8.5l-.7.8c-.9 1-1.4 1.3-2.3 1.3-1.2 0-2-.8-2-2.2z" fill="#0081FB"/>
      </svg>
    ),
    seo: (
      <svg {...svgProps} stroke="#16a34a">
        <circle cx="11" cy="11" r="7" fill="#16a34a" fillOpacity="0.1"/>
        <path d="m21 21-4.35-4.35"/>
        <path d="M11 8v6M8 11h6"/>
      </svg>
    ),
    web: (
      <svg {...svgProps} stroke="#7c3aed">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#7c3aed" fillOpacity="0.1"/>
        <path d="M3 9h18M9 9v12"/>
        <circle cx="6" cy="6" r="0.8" fill="#7c3aed" stroke="none"/>
        <circle cx="8.5" cy="6" r="0.8" fill="#7c3aed" stroke="none"/>
      </svg>
    ),
    crm: (
      <svg {...svgProps} stroke="#f97316">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="#f97316" fillOpacity="0.1"/>
        <circle cx="9" cy="7" r="4" fill="#f97316" fillOpacity="0.1"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    analytics: (
      <svg {...svgProps} stroke="#0ea5e9">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#0ea5e9" fillOpacity="0.1"/>
        <path d="M7 17V13M12 17V7M17 17v-4"/>
      </svg>
    ),
    content: (
      <svg {...svgProps} stroke="#ec4899">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" fill="#ec4899" fillOpacity="0.1"/>
      </svg>
    ),
    branding: (
      <svg {...svgProps} stroke="#a855f7">
        <circle cx="13.5" cy="6.5" r="2.5" fill="#a855f7" fillOpacity="0.1"/>
        <circle cx="6.5" cy="13.5" r="2.5" fill="#a855f7" fillOpacity="0.15"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    ),
    hubspot: (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#ff7a59" fillOpacity="0.1" stroke="#ff7a59"/>
        <circle cx="12" cy="10.5" r="3" fill="none" stroke="#ff7a59" strokeWidth="1.8"/>
        <path d="M12 13.5v3M15.5 18l-2-1.5M8.5 18l2-1.5M12 7.5V6" stroke="#ff7a59" strokeWidth="1.5"/>
        <circle cx="12" cy="5" r="1" fill="#ff7a59" stroke="none"/>
      </svg>
    ),
    figma: (
      <svg {...svgProps} viewBox="0 0 24 24">
        <rect x="8" y="2" width="4" height="6" rx="2" fill="#F24E1E" stroke="none"/>
        <rect x="12" y="2" width="4" height="6" rx="2" fill="#FF7262" stroke="none"/>
        <rect x="8" y="8" width="4" height="6" rx="2" fill="#A259FF" stroke="none"/>
        <rect x="12" y="8" width="4" height="6" rx="2" fill="#1ABCFE" stroke="none"/>
        <rect x="8" y="14" width="4" height="6" rx="2" fill="#0ACF83" stroke="none"/>
      </svg>
    ),
  };

  return <div style={s} className="svc-icon">{icons[name] || <span style={{ fontSize: size * 0.8, display: "block", lineHeight: 1 }}>{name}</span>}</div>;
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
      ctx.fillStyle = "#ffffff";
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
        background: scrolled || mobileOpen ? "rgba(255,255,255,0.96)" : "transparent",
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
          background: "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)",
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

/* ═══════════════════════ AI CHAT ═══════════════════════ */
function AiChat({ t, locale }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const chips = t.chat?.chips || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setExpanded(true);

    const userMsg = { role: "user", content: msg };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, locale }),
      });
      const data = await res.json();
      if (data.text) {
        setMessages([...next, { role: "assistant", content: data.text }]);
      } else {
        setMessages([...next, { role: "assistant", content: t.chat?.errorMsg || "Произошла ошибка. Попробуйте ещё раз." }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: t.chat?.errorMsg || "Произошла ошибка. Попробуйте ещё раз." }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      border: `1px solid ${V.border}`,
      borderRadius: 20,
      boxShadow: "0 8px 48px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
      height: expanded ? 520 : "auto",
      maxHeight: 520,
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: `1px solid ${V.divider}`,
        display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: `linear-gradient(135deg, ${V.accent}, #C8354A)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 0 1 7 7c0 3-2 5.5-4 7.5L12 20l-3-3.5C7 14.5 5 12 5 9a7 7 0 0 1 7-7z" fill="rgba(255,255,255,0.2)" />
            <circle cx="12" cy="9" r="2" fill="#fff" stroke="none" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: V.heading, fontSize: "0.82rem", fontWeight: 800, color: V.bright, letterSpacing: "-0.02em" }}>
            {t.chat?.title || "Bankai AI"}
          </div>
          <div style={{ fontSize: "0.62rem", color: V.muted }}>
            {t.chat?.subtitle || "Спросите о наших услугах"}
          </div>
        </div>
        {expanded && messages.length > 0 && (
          <button onClick={() => { setMessages([]); setExpanded(false); }} style={{
            marginLeft: "auto", background: "none", border: "none", cursor: "pointer",
            fontSize: "0.65rem", color: V.muted, padding: "4px 8px", borderRadius: 6,
            transition: "all .2s",
          }}
            onMouseEnter={e => e.target.style.color = V.accent}
            onMouseLeave={e => e.target.style.color = V.muted}
          >
            {t.chat?.clear || "Очистить"}
          </button>
        )}
      </div>

      {/* Messages */}
      {expanded && (
        <div ref={scrollRef} style={{
          flex: 1, overflow: "auto", padding: "16px 20px",
          display: "flex", flexDirection: "column", gap: 12,
          scrollBehavior: "smooth",
        }}>
          {messages.length === 0 && (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              <div style={{ fontSize: "0.78rem", color: V.dim, lineHeight: 1.6 }}>
                {t.chat?.welcome || "Расскажите о вашем бизнесе или задайте вопрос — я помогу подобрать решение."}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}>
              <div style={{
                maxWidth: "82%",
                padding: "10px 14px",
                borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: m.role === "user"
                  ? `linear-gradient(135deg, ${V.accent}, #C8354A)`
                  : "rgba(0,0,0,0.04)",
                color: m.role === "user" ? "#fff" : V.bright,
                fontSize: "0.82rem", lineHeight: 1.55,
                fontFamily: V.body,
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
                background: "rgba(0,0,0,0.04)",
              }}>
                <div className="typing-dots" style={{ display: "flex", gap: 4, alignItems: "center", height: 20 }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: "50%", background: V.muted,
                      animation: `typingDot 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestion chips (shown when not expanded) */}
      {!expanded && chips.length > 0 && (
        <div style={{ padding: "12px 20px 4px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {chips.map((chip, i) => (
            <button key={i} onClick={() => send(chip)} style={{
              padding: "6px 12px", borderRadius: 8, fontSize: "0.7rem", fontWeight: 500,
              fontFamily: V.body, cursor: "pointer", transition: "all .25s cubic-bezier(.16,1,.3,1)",
              background: "rgba(0,0,0,0.03)", color: V.dim,
              border: `1px solid ${V.divider}`,
              whiteSpace: "nowrap",
            }}
              className="chat-chip"
            >{chip}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: expanded ? "12px 16px 16px" : "8px 16px 16px",
        flexShrink: 0,
      }}>
        <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{
          display: "flex", gap: 8, alignItems: "center",
          background: "rgba(0,0,0,0.03)",
          border: `1px solid ${V.divider}`,
          borderRadius: 12, padding: "4px 4px 4px 14px",
          transition: "all .3s",
        }}
          className="chat-input-wrap"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chat?.placeholder || "Опишите ваш бизнес или задайте вопрос..."}
            disabled={loading}
            style={{
              flex: 1, border: "none", background: "none", outline: "none",
              fontSize: "0.82rem", color: V.bright, fontFamily: V.body,
              padding: "8px 0",
            }}
          />
          <button type="submit" disabled={loading || !input.trim()} style={{
            width: 36, height: 36, borderRadius: 10, border: "none",
            background: input.trim() ? `linear-gradient(135deg, ${V.accent}, #C8354A)` : "rgba(0,0,0,0.06)",
            cursor: input.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .3s cubic-bezier(.16,1,.3,1)",
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? "#fff" : V.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
        {!expanded && (
          <div style={{ fontSize: "0.58rem", color: V.muted, textAlign: "center", marginTop: 8, opacity: 0.7 }}>
            {t.chat?.hint || "AI-ассистент · отвечает за 5 сек · знает всё о наших услугах"}
          </div>
        )}
      </div>
    </div>
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

          {/* AI Chat — right side with floating metric cards behind */}
          <div className="hero-right" style={{
            transform: `translateY(-${cardsY}px)`,
            opacity: cardsOpacity,
            willChange: "transform, opacity",
            position: "relative", zIndex: 2,
            minHeight: 480,
          }}>
            {/* ── Floating metric cards (background layer) ── */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
              {/* Card: top-right — project count */}
              <div className="hero-float-1 hero-visual-card" style={{
                position: "absolute", top: -16, right: -20,
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                border: `1px solid ${V.border}`, borderRadius: 14,
                padding: "14px 18px", minWidth: 120,
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: V.muted, letterSpacing: "0.04em", marginBottom: 4 }}>Projects</div>
                <div style={{ fontFamily: V.heading, fontSize: 28, fontWeight: 800, color: V.bright, letterSpacing: "-0.03em", lineHeight: 1 }}>50+</div>
              </div>

              {/* Card: top-left — revenue */}
              <div className="hero-float-2 hero-visual-card" style={{
                position: "absolute", top: 24, left: -32,
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                border: `1px solid ${V.border}`, borderRadius: 14,
                padding: "14px 18px", minWidth: 130,
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: V.muted, letterSpacing: "0.04em", marginBottom: 4 }}>{t.hero.card2?.budget || "Revenue"}</div>
                <div style={{ fontFamily: V.heading, fontSize: 28, fontWeight: 800, color: V.accent, letterSpacing: "-0.03em", lineHeight: 1 }}>$14.6M</div>
              </div>

              {/* Card: bottom-right — CPA */}
              <div className="hero-float-3 hero-visual-card" style={{
                position: "absolute", bottom: 24, right: -28,
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                border: `1px solid ${V.border}`, borderRadius: 14,
                padding: "14px 18px", minWidth: 110,
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: V.muted, letterSpacing: "0.04em", marginBottom: 4 }}>CPA</div>
                <div style={{ fontFamily: V.heading, fontSize: 28, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.03em", lineHeight: 1 }}>−40%</div>
              </div>

              {/* Card: bottom-left — orders */}
              <div className="hero-float-1 hero-visual-card" style={{
                position: "absolute", bottom: -8, left: -16,
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                border: `1px solid ${V.border}`, borderRadius: 14,
                padding: "14px 18px", minWidth: 115,
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                animationDelay: "1.5s",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: V.muted, letterSpacing: "0.04em", marginBottom: 4 }}>{t.hero.card2?.orders || "Orders"}</div>
                <div style={{ fontFamily: V.heading, fontSize: 28, fontWeight: 800, color: V.bright, letterSpacing: "-0.03em", lineHeight: 1 }}>10K+</div>
              </div>

              {/* Card: mid-right — conversion */}
              <div className="hero-float-2 hero-visual-card" style={{
                position: "absolute", top: "50%", right: -36, marginTop: -20,
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                border: `1px solid ${V.border}`, borderRadius: 14,
                padding: "12px 16px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                animationDelay: "0.8s",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: V.muted, letterSpacing: "0.04em", marginBottom: 4 }}>ROAS</div>
                <div style={{ fontFamily: V.heading, fontSize: 22, fontWeight: 800, color: V.accent, letterSpacing: "-0.03em", lineHeight: 1 }}>5.2×</div>
              </div>
            </div>

            {/* AI Chat (foreground) */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <Reveal delay={400} type="scale" duration={1}>
                <AiChat t={t} locale={locale} />
              </Reveal>
            </div>
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
        setOffset(progress * 200);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = t.marquee;
  const renderItem = (w, i) => {
    const isOutline = i % 3 === 1;
    return (
      <React.Fragment key={`${i}-${w}`}>
        <span style={{
          display: "inline-flex", alignItems: "center", whiteSpace: "nowrap",
          fontFamily: V.heading, fontSize: "clamp(0.85rem, 2vw, 1.6rem)",
          fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
          color: isOutline ? "transparent" : V.bright,
          WebkitTextStroke: isOutline ? `1.2px ${V.bright}` : "none",
          opacity: isOutline ? 0.45 : 0.85,
          transition: "opacity 0.5s ease",
        }}>
          {w}
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", margin: "0 36px",
          flexShrink: 0,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: V.accent, opacity: 0.3,
          }} />
        </span>
      </React.Fragment>
    );
  };
  const row = words.map(renderItem);
  return (
    <section ref={sectionRef} style={{ padding: "48px 0", overflow: "hidden", background: V.bg, position: "relative", zIndex: 1 }}>
      {/* Edge fade overlays */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to right, ${V.bg}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to left, ${V.bg}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      {/* Top subtle line */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${V.divider}, transparent)` }} />
      {/* Bottom subtle line */}
      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${V.divider}, transparent)` }} />
      <div ref={ref} style={{
        display: "flex", alignItems: "center",
        opacity: visible ? 1 : 0.3, transition: "opacity 1.2s ease",
        transform: `translateX(-${offset}px)`,
        willChange: "transform",
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
                <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 12, background: "#fafafa" }}>
                  <SvcIcon name={item.icon} size={28} />
                </div>
                <h4 style={{ fontFamily: V.heading, fontSize: 16, fontWeight: 700, color: V.bright, marginBottom: 8, letterSpacing: "-0.01em" }}>{item.t}</h4>
                <p style={{ fontSize: 14, color: V.dim, lineHeight: 1.65 }}>{item.d}</p>
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

function CaseCardChipsa({ c, locale, delay, isHero }) {
  const h = isHero ? 560 : 440;
  return (
    <Reveal delay={delay} type="up" duration={0.8}>
      <Link href={`/${locale}/cases/${c.slug}`} className="case-card-link">
        <div className={`case-card-ch ${isHero ? "case-hero-ch" : ""}`} style={{ height: h, borderRadius: 20, position: "relative", overflow: "hidden" }}>
          {/* gradient bg */}
          <div className="case-bg-ch" style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${c.color1}, ${c.color2}, ${c.color3})`,
          }}>
            <div style={{ position: "absolute", top: "8%", right: "6%", width: "55%", height: "55%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}30, transparent 60%)` }} />
            <div style={{ position: "absolute", bottom: "10%", left: "4%", width: "40%", height: "40%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}20, transparent 65%)` }} />
            {isHero && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "70%", height: "70%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}15, transparent 50%)` }} />}
            <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
          </div>

          {/* top: client name */}
          <div style={{ position: "absolute", top: isHero ? 36 : 28, left: isHero ? 40 : 28, zIndex: 3 }}>
            <h3 style={{
              fontFamily: V.heading,
              fontSize: isHero ? "clamp(2rem, 4vw, 3.2rem)" : "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0,
            }}>{c.client}</h3>
          </div>

          {/* top-right: status badge */}
          <div style={{
            position: "absolute", top: isHero ? 36 : 28, right: isHero ? 40 : 28, zIndex: 3,
            background: V.accent, borderRadius: 6, padding: "6px 14px",
          }}>
            <span style={{ fontFamily: V.heading, fontSize: "0.7rem", fontWeight: 800, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>{c.result}</span>
          </div>

          {/* bottom: tags + metrics */}
          <div className="case-tags-ch" style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3,
            padding: isHero ? "0 40px 36px" : "0 28px 28px",
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
            paddingTop: 80,
          }}>
            {isHero && (
              <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 20, maxWidth: 600 }}>{c.desc}</p>
            )}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {c.tag.split(" · ").map((tg, j) => (
                  <span key={j} style={{
                    padding: "5px 14px", borderRadius: 6, fontSize: "0.65rem", fontWeight: 700,
                    background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)",
                    letterSpacing: "0.05em", backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>{tg}</span>
                ))}
              </div>
              <div className="case-btn-ch" style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "1.1rem", flexShrink: 0,
              }}>↗</div>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

function Cases({ t, locale, cases }) {
  const heroCase = cases[0];
  const restCases = cases.slice(1);

  return (
    <section id="cases" style={{ padding: "120px 0 140px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        {/* Giant heading — chipsa style */}
        <Reveal type="up" duration={0.7}>
          <h2 className="cases-heading-ch" style={{
            fontFamily: V.heading,
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            fontWeight: 900, color: V.bright, letterSpacing: "-0.05em",
            lineHeight: 0.95, margin: 0, marginBottom: 56,
          }}>{t.cases.label}</h2>
        </Reveal>

        {/* Hero case — full width */}
        <div style={{ marginBottom: 20 }}>
          <CaseCardChipsa c={heroCase} locale={locale} delay={100} isHero={true} />
        </div>

        {/* 2-col asymmetric grid */}
        <div className="cases-masonry" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 20, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {restCases.filter((_, i) => i % 2 === 0).map((c, i) => (
              <CaseCardChipsa key={c.slug} c={c} locale={locale} delay={180 + i * 120} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 60 }}>
            {restCases.filter((_, i) => i % 2 === 1).map((c, i) => (
              <CaseCardChipsa key={c.slug} c={c} locale={locale} delay={240 + i * 120} />
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
                      { label: "EMAIL", value: "agency.bankai@gmail.com", href: "mailto:agency.bankai@gmail.com", icon: "https://cdn.simpleicons.org/gmail/EA4335" },
                      { label: "TELEGRAM", value: "@may_work", href: "https://t.me/may_work", icon: "https://cdn.simpleicons.org/telegram/26A5E4" },
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
                      <p style={{ color: V.dim, fontSize: "0.85rem", lineHeight: 1.6 }}>{t.contact.successText}</p>
                    </div>
                  ) : (
                    <form onSubmit={submit}>
                      <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>{t.contact.labelInterest}</label>
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
                          <label htmlFor="cfg-name" style={labelStyle}>{t.contact.labelName}</label>
                          <input id="cfg-name" className="form-input" style={{ fontFamily: V.body }} placeholder={t.contact.placeholderName} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div>
                          <label htmlFor="cfg-contact" style={labelStyle}>{t.contact.labelContact}</label>
                          <input id="cfg-contact" className="form-input" style={{ fontFamily: V.body }} placeholder={t.contact.placeholderContact} value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div>
                          <label htmlFor="cfg-niche" style={labelStyle}>{t.contact.labelNiche}</label>
                          <input id="cfg-niche" className="form-input" style={{ fontFamily: V.body }} placeholder={t.contact.placeholderNiche} value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })} />
                        </div>
                        <div>
                          <label htmlFor="cfg-revenue" style={labelStyle}>{t.contact.labelRevenue}</label>
                          <select id="cfg-revenue" className="form-input" style={{ fontFamily: V.body, cursor: "pointer", color: form.revenue ? V.bright : V.muted }} value={form.revenue} onChange={e => setForm({ ...form, revenue: e.target.value })}>
                            <option value="" disabled>{t.contact.placeholderRevenue}</option>
                            {revenueOptions.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label htmlFor="cfg-link" style={labelStyle}>{t.contact.labelLink}</label>
                        <input id="cfg-link" className="form-input" style={{ fontFamily: V.body }} placeholder={t.contact.placeholderLink} value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <label htmlFor="cfg-message" style={labelStyle}>{t.contact.labelMessage}</label>
                        <textarea id="cfg-message" className="form-input" style={{ fontFamily: V.body, minHeight: 80, resize: "vertical" }} placeholder={t.contact.placeholderMessage} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                      </div>

                      <button type="submit" className="btn-submit" disabled={sending}>
                        {sending ? t.contact.sending : t.contact.submit}
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

function FooterCanvas() {
  const ref = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, dpr, T = 0;

    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      r: Math.random() * 1.5 + 0.5,
      phase: Math.random() * Math.PI * 2,
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
      T += 0.003;
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d, i) => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > 1) d.vx *= -1;
        if (d.y < 0 || d.y > 1) d.vy *= -1;
        const px = d.x * w, py = d.y * h;
        const alpha = 0.12 + Math.sin(T * 2 + d.phase) * 0.06;
        ctx.fillStyle = `rgba(200,53,74,${alpha})`;
        ctx.beginPath(); ctx.arc(px, py, d.r, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const dx = (d2.x - d.x) * w, dy = (d2.y - d.y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(200,53,74,${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(d2.x * w, d2.y * h); ctx.stroke();
          }
        }
      });
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf.current); removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

function Footer({ t, locale }) {
  const footerRef = useRef(null);
  const progress = useScrollProgress(footerRef, 0.1);
  const marqueeWords = "BANKAI";

  return (
    <footer ref={footerRef} style={{
      background: "#0A0A0A", color: "#fff", position: "relative", zIndex: 1, overflow: "hidden",
    }}>
      <FooterCanvas />

      {/* Giant typography marquee background */}
      <div style={{
        overflow: "hidden", padding: "80px 0 0", position: "relative",
      }}>
        <div style={{
          fontFamily: V.heading, fontSize: "clamp(5rem, 14vw, 12rem)",
          fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.85,
          color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.06)",
          whiteSpace: "nowrap", userSelect: "none",
          transform: `translateX(${-progress * 120}px)`,
          transition: "transform 0.1s linear",
        }}>
          {Array(5).fill(null).map((_, i) => (
            <span key={i} style={{ marginRight: "0.3em" }}>
              {marqueeWords}<span style={{ WebkitTextStroke: "1px rgba(200,53,74,0.12)" }}>.</span>AGENCY{" "}
            </span>
          ))}
        </div>
      </div>

      {/* Main CTA area */}
      <div style={{ ...cx, position: "relative", zIndex: 2 }}>
        <div style={{
          textAlign: "center", padding: "40px 0 80px",
        }}>
          <Reveal type="fade" duration={1}>
            <div style={{
              fontFamily: V.heading, fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1,
              color: "#fff", marginBottom: 20,
            }}>
              {t.footer.ctaHeading || "Готовы расти?"}
            </div>
          </Reveal>
          <Reveal delay={100} type="fade">
            <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.65 }}>
              {t.footer.tagline}
            </p>
          </Reveal>
          <Reveal delay={200} type="up">
            <a href="#contact" className="footer-cta-btn" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 40px", borderRadius: 100,
              background: "linear-gradient(135deg, #A01C2D, #C8354A)",
              color: "#fff", fontFamily: V.heading, fontWeight: 700, fontSize: "0.9rem",
              letterSpacing: "0.02em", textDecoration: "none",
              boxShadow: "0 4px 32px rgba(160,28,45,0.4), 0 0 80px rgba(160,28,45,0.15)",
              transition: "all .4s cubic-bezier(.16,1,.3,1)",
            }}>
              {t.footer.ctaButton || "Обсудить проект"} <span style={{ fontSize: "1.1em", transition: "transform .3s" }} className="footer-cta-arrow">→</span>
            </a>
          </Reveal>
        </div>

        {/* Shimmer divider */}
        <div style={{
          height: 1, margin: "0 0 56px",
          background: "linear-gradient(90deg, transparent 0%, rgba(200,53,74,0.3) 30%, rgba(200,53,74,0.5) 50%, rgba(200,53,74,0.3) 70%, transparent 100%)",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: -1, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, transparent, rgba(200,53,74,0.6), transparent)",
            filter: "blur(3px)",
          }} />
        </div>

        {/* Info columns */}
        <div className="footer-top" style={{
          display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40, marginBottom: 56,
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: V.heading, fontWeight: 900, fontSize: "1.15rem", marginBottom: 16,
              letterSpacing: "-0.04em", display: "flex", alignItems: "center", gap: 8,
            }}>
              <svg width="28" height="28" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <rect width="256" height="256" rx="42.6667" fill="#DF5440"/>
                <path d="M87.0069 78.4321L172.234 53.5611L172.234 53.5611C196.129 46.5881 208.077 43.1017 210.843 48.0941C213.609 53.0866 204.317 61.367 185.734 77.9279L153.845 106.347C146.512 112.882 142.846 116.15 143.738 119.537C144.63 122.925 149.443 123.966 159.07 126.049C170.467 128.514 176.165 129.747 177.353 133.831C178.542 137.916 174.405 142.001 166.132 150.173L128.971 186.878C114.297 201.372 106.96 208.619 102.485 206.586C101.963 206.348 101.47 206.048 101.02 205.693C97.1598 202.65 100.234 192.806 106.382 173.118C108.3 166.976 109.259 163.905 107.908 161.695C107.739 161.418 107.546 161.156 107.333 160.912C105.626 158.963 102.409 158.963 95.9739 158.963H91.6315C76.3852 158.963 68.7621 158.963 64.4942 154.069C60.2262 149.174 61.2642 141.622 63.34 126.518L66.7154 101.958C67.9389 93.0553 68.5507 88.604 71.309 85.4061C74.0673 82.2081 78.3805 80.9494 87.0069 78.4321Z" fill="white"/>
              </svg>
              BANKAI<span style={{ color: "#E94560" }}>.</span>AGENCY
            </div>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.65, maxWidth: 280 }}>
              {t.footer.tagline}
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 style={{
              fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase",
              marginBottom: 20, color: "rgba(255,255,255,0.25)",
            }}>{t.footer.navTitle}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {t.footer.navItems.map((item) => (
                <a key={item.href} href={item.href} className="footer-nav-link" style={{
                  color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", textDecoration: "none",
                  transition: "all .3s", display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{
                    width: 0, height: 1, background: V.accent,
                    display: "inline-block", transition: "width .3s cubic-bezier(.16,1,.3,1)",
                  }} className="footer-link-line" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase",
              marginBottom: 20, color: "rgba(255,255,255,0.25)",
            }}>{t.footer.contactTitle}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <a href="mailto:agency.bankai@gmail.com" className="footer-nav-link" style={{
                color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none",
                transition: "all .3s", display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .3s", flexShrink: 0,
                }} className="footer-icon-box">
                  <img src="https://cdn.simpleicons.org/gmail/EA4335" alt="Gmail" width="14" height="14" loading="lazy" />
                </div>
                agency.bankai@gmail.com
              </a>
              <a href="https://t.me/may_work" target="_blank" rel="noopener" className="footer-nav-link" style={{
                color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none",
                transition: "all .3s", display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .3s", flexShrink: 0,
                }} className="footer-icon-box">
                  <img src="https://cdn.simpleicons.org/telegram/26A5E4" alt="Telegram" width="14" height="14" loading="lazy" />
                </div>
                @may_work
              </a>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 style={{
              fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase",
              marginBottom: 20, color: "rgba(255,255,255,0.25)",
            }}>{t.footer.stackTitle || "Stack"}</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["AI", "Google Ads", "SEO", "CRM", "Meta Ads", "Analytics", "Web Dev", "Branding"].map((tag, i) => (
                <span key={i} className="footer-tag" style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: "0.62rem", fontWeight: 600,
                  background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  letterSpacing: "0.04em",
                  transition: "all .3s",
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 24 }} />

        <div className="footer-bottom" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingBottom: 32,
        }}>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.02em" }}>
            © {new Date().getFullYear()} Bankai Agency. {t.footer.copyright}
          </div>
          <div style={{
            fontSize: "0.6rem", color: "rgba(255,255,255,0.12)", letterSpacing: "0.04em",
          }}>
            {locale === "ru" ? "Сделано с" : "Built with"} <span style={{ color: "#C8354A", fontSize: "0.7rem" }}>♥</span> {locale === "ru" ? "и AI" : "& AI"}
          </div>
        </div>
      </div>
    </footer>
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
        <Footer t={t} locale={locale} />
      </div>
    </>
  );
}
