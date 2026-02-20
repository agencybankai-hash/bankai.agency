"use client";

import { useState, useEffect, useRef } from "react";

/*
  BANKAI.AGENCY — Premium minimalist site v2
  Upgraded: case dividers, SVG icons, radial charts, inline infographics
*/

const T = {
  bg: "#FFFFFF",
  bg2: "#F8F8F8",
  dark: "#0A0A0A",
  text: "#0A0A0A",
  mid: "#555555",
  muted: "#999999",
  light: "#C8C8C8",
  line: "#E8E8E8",
  lineLight: "#F0F0F0",
  red: "#DF5440",
  redSoft: "#FBF0EE",
  font: "inherit",
};

// ─── SVG ICONS (inline, 20x20) ───
const icons = {
  ads: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="12" rx="2" stroke={c} strokeWidth="1.5"/><path d="M7 18h6M10 15v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="9" r="2" fill={c} opacity="0.3"/></svg>,
  seo: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke={c} strokeWidth="1.5"/><path d="M13.5 13.5L17 17" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><path d="M9 6v3l2 1" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  crm: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="14" height="16" rx="2" stroke={c} strokeWidth="1.5"/><path d="M7 6h6M7 9h6M7 12h4" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  chart: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 17V8l4 3 3-5 4 2 3-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 17h14" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  mail: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke={c} strokeWidth="1.5"/><path d="M2 6l8 5 8-5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  web: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke={c} strokeWidth="1.5"/><ellipse cx="10" cy="10" rx="3.5" ry="7.5" stroke={c} strokeWidth="1.2"/><path d="M3 10h14" stroke={c} strokeWidth="1.2"/></svg>,
  phone: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3h3l2 4-2.5 1.5a10 10 0 005 5L13 11l4 2v3a1 1 0 01-1 1C9 17 3 11 3 4a1 1 0 011-1z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  design: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke={c} strokeWidth="1.5"/><path d="M3 8h14M8 8v9" stroke={c} strokeWidth="1.2"/><circle cx="13" cy="5.5" r="0.75" fill={c}/></svg>,
  rocket: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2c0 0-6 4-6 11h12c0-7-6-11-6-11z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><circle cx="10" cy="9" r="1.5" stroke={c} strokeWidth="1.2"/><path d="M7 16l-2 2M13 16l2 2" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  target: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10" r="4" stroke={c} strokeWidth="1.2"/><circle cx="10" cy="10" r="1.2" fill={c}/></svg>,
  lightning: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M11 2L5 11h4l-1 7 7-10h-4.5L11 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  check: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  dollar: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.5"/><path d="M10 5v10M7.5 8c0-1.5 1.5-2 2.5-2s2.5.5 2.5 1.5-1 1.5-2.5 2-2.5 1-2.5 2 1.5 1.5 2.5 1.5 2.5-.5 2.5-2" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  gear: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  users: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8" cy="7" r="3" stroke={c} strokeWidth="1.5"/><path d="M2 17c0-3 2.5-5 6-5s6 2 6 5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><circle cx="14" cy="6" r="2" stroke={c} strokeWidth="1.2"/><path d="M16 17c0-2-1-3.5-3-4.3" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  arrowUp: (c = T.mid) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 16V4m0 0l-4 4m4-4l4 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// map service name → icon key
const serviceIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes("google ads") || n.includes("meta ads") || n.includes("local services") || n.includes("a/b")) return "ads";
  if (n.includes("seo") || n.includes("gbp") || n.includes("content")) return "seo";
  if (n.includes("hubspot") || n.includes("crm") || n.includes("review")) return "crm";
  if (n.includes("looker") || n.includes("analytics") || n.includes("cro")) return "chart";
  if (n.includes("email") || n.includes("mail") || n.includes("direct")) return "mail";
  if (n.includes("webflow") || n.includes("landing") || n.includes("web") || n.includes("responsive")) return "web";
  if (n.includes("callrail") || n.includes("call")) return "phone";
  if (n.includes("design") || n.includes("figma") || n.includes("ui") || n.includes("collateral")) return "design";
  if (n.includes("ongoing") || n.includes("support")) return "gear";
  return "check";
};

// ─── RADIAL CHART (SVG donut) ───
function Radial({ pct, size = 56, stroke = 4, color = T.red, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.lineLight} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
      </svg>
      {children && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>}
    </div>
  );
}

// ─── LOGO ───
function Logo({ white }) {
  return (
    <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill={T.red} />
      </svg>
      <span style={{ fontSize: 15, fontWeight: 700, color: white ? "#fff" : T.dark, letterSpacing: 3 }}>BANKAI</span>
    </a>
  );
}

// ─── NAV ───
function Nav() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > 80);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: s ? "16px 0" : "24px 0",
      background: s ? "rgba(255,255,255,0.95)" : "transparent",
      backdropFilter: s ? "blur(24px)" : "none",
      borderBottom: s ? `1px solid ${T.line}` : "1px solid transparent",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo />
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Work", "Services", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              color: T.muted, textDecoration: "none", fontSize: 13, fontWeight: 500,
              letterSpacing: 1, textTransform: "uppercase", transition: "color 0.3s",
            }}
            onMouseEnter={e => e.target.style.color = T.dark}
            onMouseLeave={e => e.target.style.color = T.muted}
            >{l}</a>
          ))}
          <a href="#contact" style={{
            color: "#fff", background: T.dark, padding: "10px 28px", borderRadius: 100, textDecoration: "none",
            fontSize: 13, fontWeight: 600, letterSpacing: 0.5, transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.target.style.background = T.red; }}
          onMouseLeave={e => { e.target.style.background = T.dark; }}
          >Get in touch</a>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO (CHIPSA-INSPIRED — WHITE, BOLD, DRAMATIC) ───
function Hero() {
  const [on, setOn] = useState(false);
  useEffect(() => { setTimeout(() => setOn(true), 150); }, []);

  const f = (d) => ({
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(50px)",
    transition: `all 1.2s cubic-bezier(0.16,1,0.3,1) ${d}s`,
  });

  const keyframes = `
    @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes heroReveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0% 0 0); } }
    @keyframes heroBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  `;

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center",
      background: T.bg, position: "relative", overflow: "hidden", cursor: "default",
      paddingTop: 100,
    }}>
      <style>{keyframes}</style>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", width: "100%", position: "relative", zIndex: 2 }}>

        <h1 style={{
          fontSize: "clamp(4rem, 10vw, 8.5rem)", fontWeight: 900, lineHeight: 0.92,
          letterSpacing: "-0.04em", textTransform: "uppercase",
        }}>
          <span style={{ display: "block", color: T.dark, ...f(0) }}>WE BUILD</span>
          <span style={{ display: "block", color: T.dark, ...f(0.1) }}>REVENUE</span>
          <span style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 3vw, 40px)", ...f(0.2) }}>
            <span style={{ color: T.red }}>MACHINES</span>
            {/* Inline animated accent element */}
            <span style={{
              display: "inline-block", width: "clamp(60px, 8vw, 120px)", height: "clamp(60px, 8vw, 120px)",
              borderRadius: "50%", background: T.red, flexShrink: 0,
              opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(0)",
              transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.4s",
            }}>
              <svg viewBox="0 0 60 60" width="100%" height="100%" style={{ padding: "30%" }}>
                <path d="M10,40 L20,25 L30,32 L40,15 L50,10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="80" strokeDashoffset={on ? "0" : "80"}
                  style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1) 0.8s" }}
                />
                <circle cx="50" cy="10" r="3" fill="#fff"
                  style={{ opacity: on ? 1 : 0, transition: "opacity 0.3s ease 2s" }}
                />
              </svg>
            </span>
          </span>
        </h1>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "clamp(48px, 6vw, 80px)", ...f(0.4) }}>
          <p style={{ fontSize: "clamp(16px, 1.8vw, 20px)", color: T.mid, maxWidth: 500, lineHeight: 1.7 }}>
            Full-stack performance marketing. Paid ads, SEO, CRM, analytics, and automation &mdash; every channel connected, every dollar tracked.
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
            <a href="#contact" style={{
              background: T.dark, color: "#fff", padding: "20px 48px", borderRadius: 100,
              textDecoration: "none", fontSize: 15, fontWeight: 700, letterSpacing: 0.5,
              transition: "all 0.4s",
            }}
            onMouseEnter={e => { e.target.style.background = T.red; e.target.style.transform = "scale(1.05)"; }}
            onMouseLeave={e => { e.target.style.background = T.dark; e.target.style.transform = "scale(1)"; }}
            >Start a project</a>
            <a href="#work" style={{
              color: T.muted, textDecoration: "none", fontSize: 14,
              display: "flex", alignItems: "center", gap: 8, transition: "color 0.3s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = T.dark}
            onMouseLeave={e => e.currentTarget.style.color = T.muted}
            >
              View work
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: on ? 1 : 0, transition: "opacity 1s ease 1.5s",
      }}>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${T.line}, transparent)` }} />
      </div>

      {/* Bottom ticker marquee — now on white bg */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        borderTop: `1px solid ${T.line}`,
        overflow: "hidden",
        opacity: on ? 1 : 0, transition: "opacity 1s ease 0.8s",
      }}>
        <div style={{
          display: "flex", whiteSpace: "nowrap", padding: "18px 0",
          animation: "tickerScroll 30s linear infinite",
        }}>
          {[...Array(2)].map((_, r) => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 48, paddingRight: 48 }}>
              {["$14.6M REVENUE", "10,235 JOBS BOOKED", "36.5\u00d7 ROAS", "42% LOWER CPL", "180% ORGANIC GROWTH", "60% AUTOMATED", "$14.6M REVENUE", "10,235 JOBS BOOKED", "36.5\u00d7 ROAS", "42% LOWER CPL", "180% ORGANIC GROWTH", "60% AUTOMATED"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: i % 3 === 0 ? T.red : T.light }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: i % 3 === 0 ? T.red : T.muted }}>{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── NUMBERS (DARK, DRAMATIC — CHIPSA STYLE) ───
function Numbers() {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const data = [
    { val: "$14.6M", lab: "Revenue generated for clients" },
    { val: "10,235", lab: "Jobs booked & tracked" },
    { val: "36.5\u00d7", lab: "Average return on ad spend" },
  ];
  return (
    <section ref={ref} style={{ background: T.dark, padding: "100px 0", position: "relative", overflow: "hidden" }}>
      {/* Giant background number */}
      <div style={{
        position: "absolute", right: -40, top: "50%", transform: "translateY(-50%)",
        fontSize: "clamp(14rem, 30vw, 28rem)", fontWeight: 900, color: "rgba(255,255,255,0.025)",
        lineHeight: 0.85, pointerEvents: "none", letterSpacing: "-0.05em",
      }}>36.5\u00d7</div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", position: "relative", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
        {data.map((d, i) => (
          <div key={i} style={{
            padding: "40px 0",
            borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
            paddingLeft: i > 0 ? 48 : 0,
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(30px)",
            transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s`,
          }}>
            <div style={{
              fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 900, color: i === 0 ? T.red : "#fff",
              letterSpacing: "-0.04em", lineHeight: 1,
            }}>{d.val}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 12, lineHeight: 1.5 }}>{d.lab}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PLACEHOLDER ───
function Img({ label, ratio = "16/9" }) {
  return (
    <div style={{
      aspectRatio: ratio, borderRadius: 12, overflow: "hidden",
      background: T.bg2, display: "flex", alignItems: "center", justifyContent: "center",
      border: `1px solid ${T.lineLight}`,
    }}>
      <span style={{ fontSize: 11, color: T.light, fontWeight: 500, textAlign: "center", padding: "0 24px", lineHeight: 1.5 }}>{label}</span>
    </div>
  );
}

// ─── FUNNEL ───
function Funnel() {
  const stages = [
    { title: "Attract", desc: "Drive qualified traffic through every relevant channel.", items: ["Google Ads & LSA", "SEO & Content", "Meta Ads", "GBP Optimization"], impact: "+180%", impactLabel: "organic traffic growth", icon: "target" },
    { title: "Capture", desc: "Turn visitors into tracked, qualified leads.", items: ["High-converting pages", "Call tracking (CallRail)", "Multi-step forms", "Live chat & CTAs"], impact: "3\u00d7", impactLabel: "lead capture rate", icon: "web" },
    { title: "Nurture", desc: "Automate follow-up so no lead goes cold.", items: ["HubSpot CRM pipelines", "Email sequences", "Retargeting ads", "Lead scoring models"], impact: "60%", impactLabel: "follow-ups automated", icon: "mail" },
    { title: "Convert", desc: "Close deals with data-driven pipeline management.", items: ["Pipeline visibility", "Automated follow-up", "Attribution modeling", "Revenue tracking"], impact: "36.5\u00d7", impactLabel: "average ROAS", icon: "chart" },
    { title: "Scale", desc: "Increase budget confidently. Compound what works.", items: ["Channel expansion", "Budget optimization", "A/B testing at scale", "Real-time dashboards"], impact: "$14.6M", impactLabel: "revenue generated", icon: "rocket" },
  ];

  return (
    <section style={{ padding: "120px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80 }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em" }}>How we drive revenue</h2>
          <p style={{ fontSize: 15, color: T.muted, maxWidth: 380, textAlign: "right", lineHeight: 1.6 }}>From first impression to closed deal &mdash; we build and optimize every touchpoint.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 48, padding: "0 24px" }}>
          {stages.map((_, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{
                width: i === stages.length - 1 ? 14 : 10,
                height: i === stages.length - 1 ? 14 : 10,
                borderRadius: "50%",
                background: i === stages.length - 1 ? T.red : T.dark,
                flexShrink: 0,
              }} />
              {i < stages.length - 1 && (
                <div style={{ flex: 1, height: 1, background: T.line, position: "relative" }}>
                  <div style={{
                    position: "absolute", right: -1, top: -3,
                    width: 0, height: 0,
                    borderTop: "3.5px solid transparent",
                    borderBottom: "3.5px solid transparent",
                    borderLeft: `6px solid ${T.light}`,
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 32 }}>
          {stages.map((s, i) => (
            <div key={i}>
              <div style={{ marginBottom: 16, opacity: 0.6 }}>{icons[s.icon](i === stages.length - 1 ? T.red : T.dark)}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: T.dark, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 20 }}>{s.desc}</p>
              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16, marginBottom: 20 }}>
                {s.items.map((item, j) => (
                  <p key={j} style={{ fontSize: 12, color: T.mid, lineHeight: 1.7 }}>{item}</p>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16 }}>
                <span style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 800, color: i === stages.length - 1 ? T.red : T.dark, letterSpacing: "-0.02em" }}>{s.impact}</span>
                <p style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{s.impactLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CASE DIVIDER ───
function CaseDivider({ nextNum, nextName, nextTagline, color }) {
  return (
    <div style={{
      background: T.dark,
      padding: "80px 0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Accent stripe */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: color,
      }} />
      {/* Subtle large number */}
      <div style={{
        position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)",
        fontSize: "clamp(8rem, 20vw, 14rem)", fontWeight: 900, color: "rgba(255,255,255,0.03)",
        lineHeight: 1, letterSpacing: "-0.05em", pointerEvents: "none",
      }}>{nextNum}</div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 48, height: 48, borderRadius: "50%", border: `2px solid ${color}`,
            fontSize: 16, fontWeight: 700, color: color, flexShrink: 0,
          }}>{nextNum}</span>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, ${color}40, transparent)` }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: color, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Next case study</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 8 }}>{nextName}</span>
        <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", maxWidth: 700, lineHeight: 1.15 }}>
          {nextTagline}
        </h3>
        {/* scroll hint */}
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 1, height: 24, background: `linear-gradient(to bottom, ${color}, transparent)` }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>SCROLL</span>
        </div>
      </div>
    </div>
  );
}

// ─── RESULTS BAR (enriched with radials) ───
function ResultsBars({ bars, color }) {
  return (
    <div style={{ marginTop: 80, padding: "56px 0", borderTop: `1px solid ${T.line}` }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 40 }}>Impact at a glance</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 64px" }}>
        {bars.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Radial pct={b.pct} size={48} stroke={3} color={color || T.red}>
              <span style={{ fontSize: 9, fontWeight: 700, color: color || T.red }}>{b.pct}%</span>
            </Radial>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: T.mid }}>{b.label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: T.dark }}>{b.value}</span>
              </div>
              <div style={{ height: 3, background: T.lineLight, borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${b.pct}%`,
                  background: color || T.red,
                  borderRadius: 2,
                  transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TECH FLOW (mini infographic showing integration chain) ───
function TechFlow({ items, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0, margin: "32px 0" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 8,
            background: i === 0 ? (color + "12") : T.bg2,
            border: `1px solid ${i === 0 ? color + "30" : T.lineLight}`,
          }}>
            <span style={{ opacity: 0.7 }}>{icons[serviceIcon(item)](i === 0 ? color : T.mid)}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? color : T.mid }}>{item}</span>
          </div>
          {i < items.length - 1 && (
            <svg width="24" height="12" viewBox="0 0 24 12" style={{ flexShrink: 0 }}>
              <path d="M2 6h16" stroke={T.light} strokeWidth="1.2" />
              <path d="M16 3l4 3-4 3" stroke={T.light} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── CASE STUDY (enriched) ───
function Case({ color, num, name, tagline, intro, metrics, challenge, approach, phases, services, results, testimonial, images, bars, techFlow }) {
  return (
    <article style={{ padding: "120px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "50%", background: color + "14",
            fontSize: 13, fontWeight: 700, color: color,
          }}>{num}</span>
          <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>Case Study</span>
        </div>
        <span style={{ fontSize: 13, color: T.muted }}>{name}</span>
      </div>
      <h3 style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: 800 }}>
        {tagline}
      </h3>
      <p style={{ fontSize: 17, color: T.mid, lineHeight: 1.7, maxWidth: 640, marginTop: 28 }}>{intro}</p>

      {/* Tech flow mini infographic */}
      {techFlow && <TechFlow items={techFlow} color={color} />}

      <div style={{ marginTop: 48 }}>
        <Img label={images.hero} ratio="2.4/1" />
      </div>

      {/* Metrics with radial charts */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${metrics.length}, 1fr)`, gap: 24, marginTop: 64 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            padding: "32px 24px", borderRadius: 12,
            background: i === 0 ? color + "08" : T.bg2,
            border: `1px solid ${i === 0 ? color + "20" : T.lineLight}`,
            textAlign: "center",
          }}>
            {m.pct !== undefined && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <Radial pct={m.pct} size={64} stroke={4} color={color}>
                  <span style={{ fontSize: 11, fontWeight: 700, color }}>{icons[m.icon || "chart"](color)}</span>
                </Radial>
              </div>
            )}
            <div style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: i === 0 ? color : T.dark, letterSpacing: "-0.02em", lineHeight: 1 }}>{m.val}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 8 }}>{m.lab}</div>
          </div>
        ))}
      </div>

      {/* Challenge / Approach with icons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 80 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            {icons.lightning(T.red)}
            <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Challenge</span>
          </div>
          <p style={{ fontSize: 15, color: T.dark, lineHeight: 1.8 }}>{challenge}</p>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            {icons.target(color)}
            <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Approach</span>
          </div>
          <p style={{ fontSize: 15, color: T.dark, lineHeight: 1.8 }}>{approach}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 64 }}>
        <Img label={images.screen1} ratio="4/3" />
        <Img label={images.screen2} ratio="4/3" />
      </div>

      {/* Execution with step cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 80 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            {icons.gear(color)}
            <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Execution</span>
          </div>
          {phases.map((p, i) => (
            <div key={i} style={{
              marginBottom: i < phases.length - 1 ? 28 : 0,
              paddingLeft: 32,
              position: "relative",
            }}>
              {/* Vertical connecting line */}
              {i < phases.length - 1 && (
                <div style={{
                  position: "absolute", left: 13, top: 28, bottom: -20,
                  width: 1, background: `linear-gradient(to bottom, ${i === 0 ? color : T.line}, ${T.lineLight})`,
                }} />
              )}
              {/* Step number circle */}
              <div style={{
                position: "absolute", left: 0, top: 2,
                width: 28, height: 28, borderRadius: "50%",
                border: `1.5px solid ${i === 0 ? color : T.line}`,
                background: i === 0 ? color + "12" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? color : T.muted }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: T.dark, marginBottom: 10 }}>{p.title}</h4>
              {p.items.map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginTop: 3, flexShrink: 0 }}>
                    <path d="M4 7l2 2 4-4" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                  </svg>
                  <span style={{ fontSize: 13, color: T.mid, lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Img label={images.detail} ratio="4/3" />
          {/* Stack with icons */}
          <div style={{ padding: "32px 0", borderTop: `1px solid ${T.line}` }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 16 }}>Stack</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {services.map((s, i) => (
                <span key={i} style={{
                  padding: "7px 14px 7px 10px", borderRadius: 100,
                  border: `1px solid ${T.line}`, fontSize: 12, color: T.mid,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.color = T.mid; }}
                >
                  <span style={{ display: "flex", width: 16, height: 16 }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ transform: "scale(0.8)" }}>
                      {icons[serviceIcon(s)](T.muted).props.children}
                    </svg>
                  </span>
                  {s}
                </span>
              ))}
            </div>
          </div>
          {testimonial && (
            <div style={{ padding: "32px", borderRadius: 12, background: color + "08", border: `1px solid ${color}20`, position: "relative" }}>
              <svg width="32" height="24" viewBox="0 0 32 24" style={{ position: "absolute", top: 20, left: 24, opacity: 0.15 }}>
                <path d="M0 24V14.4C0 5.6 5.6 0 14 0v5.6C9.8 6.4 7.6 9.2 7.2 12H14v12H0zm18 0V14.4C18 5.6 23.6 0 32 0v5.6c-4.2.8-6.4 3.6-6.8 6.4H32v12H18z" fill={color}/>
              </svg>
              <p style={{ fontSize: 15, color: T.dark, fontStyle: "italic", lineHeight: 1.75, position: "relative" }}>&ldquo;{testimonial.quote}&rdquo;</p>
              <p style={{ fontSize: 12, color: T.muted, marginTop: 12, position: "relative" }}>{testimonial.author}</p>
            </div>
          )}
        </div>
      </div>

      {/* Results grid with icons */}
      <div style={{ marginTop: 80, padding: "56px 0", borderTop: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          {icons.check(color)}
          <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Results</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px 64px" }}>
          {results.map((r, i) => (
            <div key={i} style={{ paddingLeft: 28, position: "relative" }}>
              <div style={{
                position: "absolute", left: 0, top: 2,
                width: 16, height: 16, borderRadius: "50%",
                background: color + "14",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
              </div>
              <h5 style={{ fontSize: 14, fontWeight: 700, color: T.dark, marginBottom: 6 }}>{r.title}</h5>
              <p style={{ fontSize: 13, color: T.mid, lineHeight: 1.6 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {bars && <ResultsBars bars={bars} color={color} />}

      <Img label={images.bottom} ratio="2.4/1" />
    </article>
  );
}

// ─── WORK ───
function Work() {
  const cases = [
    {
      color: T.red,
      num: "01",
      name: "SOS Moving",
      tagline: "From a local mover to a $14.6M revenue machine.",
      intro: "We designed and built a complete marketing ecosystem from scratch \u2014 paid search, local ads, SEO, CRM, call tracking, email automation, and real-time dashboards. Every channel connected. Every dollar tracked.",
      techFlow: ["Google Ads", "Landing Pages", "CallRail", "HubSpot CRM", "Looker Studio"],
      metrics: [
        { val: "$14.6M", lab: "Revenue generated", pct: 95, icon: "dollar" },
        { val: "10,235", lab: "Jobs booked", pct: 82, icon: "users" },
        { val: "$400K+", lab: "Ad budget managed", pct: 70, icon: "ads" },
        { val: "36.5x", lab: "Average ROAS", pct: 92, icon: "chart" },
      ],
      challenge: "SOS Moving was spending on Google Ads with no understanding of which campaigns generated actual revenue. No call tracking. No CRM. No attribution. Leads were handled on paper, follow-ups were inconsistent. SEO rankings sat around position 40. The business was growing blindly \u2014 no visibility into what worked and what bled money.",
      approach: "Full business transformation, not just a marketing retainer. Build tracking infrastructure first (CallRail, HubSpot, GA4). Restructure Google Ads with proper conversion tracking. Launch Local Services Ads and SEO. Automate the entire lead-to-close funnel. Every week \u2014 optimization. Every month \u2014 strategic review.",
      phases: [
        { title: "Tracking & CRM", items: ["CallRail with dynamic number insertion across all landing pages", "HubSpot CRM \u2014 custom pipeline, deal stages, contact properties", "GA4 conversion events for forms, calls, and quote requests", "Full integration chain: CallRail \u2192 HubSpot \u2192 GA4 \u2192 Looker Studio"] },
        { title: "Paid Advertising", items: ["Restructured Google Ads: keyword research, negative keywords, SKAGs", "Local Services Ads for top-intent local searches", "Dedicated landing pages per service line (local, long-distance, commercial)", "Position-based attribution model across all channels"] },
        { title: "SEO & Local Presence", items: ["Technical SEO audit: meta, schema, speed, internal links", "20+ optimized service and location pages", "Google Business Profile: posts, photos, Q&A, review strategy", "Rankings improved from position 40 \u2192 26 for core terms"] },
        { title: "Automation & Scale", items: ["Email sequences for hot, warm, and cold leads in HubSpot", "Lead scoring model based on service type, budget, and timeline", "Meta Ads retargeting for non-converting visitors", "Looker Studio dashboards \u2014 live ROAS, CPL, revenue by channel"] },
      ],
      services: ["Google Ads", "Local Services Ads", "Meta Ads", "SEO", "Webflow", "HubSpot CRM", "CallRail", "Email Automation", "GBP", "Looker Studio", "A/B Testing", "CRO"],
      testimonial: { quote: "They didn\u2019t just run our ads \u2014 they built an entire marketing machine. We went from guessing to complete visibility into every lead, every call, every dollar.", author: "SOS Moving, Owner" },
      results: [
        { title: "Full Attribution", desc: "Every dollar tracked from click to closed job. Position-based attribution across Google Ads, LSA, SEO, and Meta." },
        { title: "Cost Efficiency", desc: "36.5x ROAS. Cost per lead optimized 42% over 12 months through continuous A/B testing and bid refinement." },
        { title: "Zero Leads Lost", desc: "HubSpot captures every form, call, and chat \u2014 auto-routes to the right team member with context." },
        { title: "SEO Growth", desc: "20+ service pages ranking. Organic traffic increased 180% year-over-year." },
        { title: "Automated Follow-up", desc: "Email sequences handle 60% of follow-ups. Lead scoring prioritizes high-value jobs." },
        { title: "Scales With Budget", desc: "When ad spend increased 3x, lead quality maintained and ROAS stayed above 30x." },
      ],
      bars: [
        { label: "Return on Ad Spend", value: "36.5\u00d7", pct: 92 },
        { label: "Cost per Lead Reduction", value: "\u221242%", pct: 58 },
        { label: "Organic Traffic Growth", value: "+180%", pct: 80 },
        { label: "Lead-to-Close Rate", value: "+67%", pct: 67 },
        { label: "Follow-ups Automated", value: "60%", pct: 60 },
        { label: "Revenue Generated", value: "$14.6M", pct: 95 },
      ],
      images: {
        hero: "Website homepage + Looker Studio dashboard \u2014 laptop mockup",
        screen1: "Google Ads campaign performance \u2014 ROAS & conversion data",
        screen2: "HubSpot CRM pipeline \u2014 deal stages & lead flow",
        detail: "Looker Studio reporting dashboard \u2014 real-time metrics",
        bottom: "Marketing ecosystem: ads \u2192 landing page \u2192 CRM \u2192 automation \u2192 reporting",
      },
    },
    {
      color: "#22C55E",
      num: "02",
      name: "AK Cabinet Craft",
      tagline: "Outsourced marketing department. Paid only on results.",
      intro: "Instead of a traditional retainer, we proposed a revenue share \u2014 3% of every sale. Our incentives fully aligned. We built and manage the entire marketing operation: Google Ads, local SEO, CRM, and even offline postcards.",
      techFlow: ["Google Ads", "SEO", "HubSpot CRM", "CallRail", "Direct Mail"],
      metrics: [
        { val: "3%", lab: "Revenue share model", pct: 100, icon: "dollar" },
        { val: "Full Stack", lab: "All channels managed", pct: 85, icon: "gear" },
        { val: "Chicago", lab: "Local market", pct: 90, icon: "target" },
        { val: "Ongoing", lab: "Active partnership", pct: 75, icon: "users" },
      ],
      challenge: "No digital marketing presence. No call tracking. No CRM. Customer inquiries came through untracked phone calls. Custom kitchens are $15K-80K projects with a long sales cycle requiring persistent follow-up that wasn\u2019t happening.",
      approach: "Zero upfront fees, 3% revenue share \u2014 we needed everything to work. Started with tracking (CallRail + HubSpot), launched Google Ads for high-intent keywords, optimized GBP for local authority. Built a CRM-powered follow-up system for the long sales cycle. Tested offline postcards to high-income zip codes.",
      phases: [
        { title: "Tracking & CRM", items: ["CallRail with dynamic numbers for online/offline attribution", "HubSpot CRM configured for long sales cycles \u2014 custom pipeline stages", "Attribution model connecting marketing spend to closed deals"] },
        { title: "Paid Search", items: ["Google Ads targeting \u2018custom cabinets Chicago\u2019, \u2018kitchen remodel near me\u2019", "Dedicated landing pages for kitchens, closets, bathrooms", "Geo-targeting to high-income Chicago suburbs"] },
        { title: "Local SEO & GBP", items: ["Full Google Business Profile optimization \u2014 photos, services, posts", "Review generation strategy with automated post-project requests", "Blog content targeting \u2018kitchen remodel cost Chicago\u2019 queries"] },
        { title: "Nurture & Offline", items: ["Email nurture sequences for the 4-8 week consideration phase", "Portfolio showcase emails with before/after photos", "Targeted postcards to homeowners in premium zip codes"] },
      ],
      services: ["Google Ads", "Local SEO", "GBP", "HubSpot CRM", "CallRail", "Content Marketing", "Landing Pages", "Email Automation", "Direct Mail", "Review Management"],
      testimonial: null,
      results: [
        { title: "Aligned Incentives", desc: "Revenue share means every action is tied to revenue. No vanity metrics." },
        { title: "Full Visibility", desc: "First time seeing exactly which channels generate consultations, quotes, and closed deals." },
        { title: "Long-Cycle Nurture", desc: "Automation handles the 4-8 week consideration period \u2014 portfolio emails, follow-ups, reminders." },
        { title: "Local Authority", desc: "Top-rated cabinet shop in target suburbs through GBP optimization and review strategy." },
        { title: "Multi-Channel", desc: "Digital (Google Ads, SEO) combined with offline (postcards) across the customer journey." },
        { title: "True Partnership", desc: "As revenue grows, our incentive grows. Partnership, not a vendor relationship." },
      ],
      bars: [
        { label: "Zero Upfront Cost", value: "Rev Share", pct: 100 },
        { label: "Lead Attribution Accuracy", value: "100%", pct: 100 },
        { label: "Nurture Sequence Coverage", value: "4-8 wk cycle", pct: 75 },
        { label: "Local Pack Visibility", value: "Top 3", pct: 88 },
        { label: "Channels Managed", value: "6+", pct: 72 },
        { label: "Review Growth", value: "+340%", pct: 85 },
      ],
      images: {
        hero: "Kitchen project photography + website mockup",
        screen1: "Google Ads performance \u2014 cabinet-related keywords",
        screen2: "Google Business Profile \u2014 reviews, photos, local pack",
        detail: "HubSpot email nurture sequence \u2014 flow diagram",
        bottom: "Before/after kitchen projects + marketing funnel overview",
      },
    },
    {
      color: "#3B82F6",
      num: "03",
      name: "Object First",
      tagline: "2+ year design partnership for a startup acquired by Veeam.",
      intro: "Long-term design and development partner for an enterprise data storage company. We shaped the public-facing brand \u2014 website, landing pages, collateral \u2014 that attracted enterprise customers and ultimately led to their acquisition.",
      techFlow: ["Figma", "Webflow", "Landing Pages", "SEO", "Collateral"],
      metrics: [
        { val: "2+ yrs", lab: "Partnership", pct: 95, icon: "gear" },
        { val: "Acquired", lab: "By Veeam", pct: 100, icon: "rocket" },
        { val: "100+", lab: "Hours per month", pct: 80, icon: "design" },
      ],
      challenge: "Fast-moving startup in competitive data storage. Needed to communicate complex technical products to both technical and business audiences. Site needed to evolve rapidly \u2014 new features, campaigns, landing pages \u2014 without a full in-house design team.",
      approach: "Embedded as their external design and development team. Weekly sprints with product marketing. Component-based design system in Figma. Webflow for rapid iteration. New pages shipped in days, not weeks.",
      phases: [
        { title: "Design System", items: ["Visual language \u2014 clean, technical, enterprise-grade", "Component library in Figma: buttons, cards, sections, layouts", "Typography hierarchy, color system, spacing tokens"] },
        { title: "Website Build", items: ["Full marketing site in Webflow \u2014 homepage, product, pricing, about", "Responsive design, SEO structure, schema markup", "Core Web Vitals optimized to green across all pages"] },
        { title: "Campaign Pages", items: ["Rapid-turnaround landing pages for product launches", "A/B variants for ad campaigns", "Gated content pages for whitepapers and technical docs"] },
        { title: "Ongoing Support", items: ["Weekly design sprints aligned with product roadmap", "Marketing collateral \u2014 one-pagers, decks, email templates", "Continuous iteration as product evolved"] },
      ],
      services: ["UI/UX Design", "Webflow", "Landing Pages", "Design System", "Collateral", "Responsive Design", "SEO", "Ongoing Support"],
      testimonial: null,
      results: [
        { title: "Startup Speed", desc: "New pages shipped in 3-5 business days. Design system enabled rapid iteration without sacrificing quality." },
        { title: "Enterprise Quality", desc: "Positioned Object First as a mature, trustworthy enterprise product for IT decision-makers." },
        { title: "Acquisition-Ready", desc: "Brand presence contributed to market positioning that led to Veeam acquisition." },
        { title: "Consistency", desc: "Component-based system maintained brand consistency across 2+ years of output." },
        { title: "Cost Efficient", desc: "Full team output at a fraction of in-house cost with flexible hourly model." },
        { title: "Flexible Scale", desc: "Involvement scaled up or down based on campaign needs and product milestones." },
      ],
      bars: [
        { label: "Page Turnaround", value: "3-5 days", pct: 90 },
        { label: "Core Web Vitals", value: "All Green", pct: 100 },
        { label: "Design System Components", value: "120+", pct: 78 },
        { label: "Cost vs In-house Team", value: "\u221265%", pct: 65 },
        { label: "Partnership Duration", value: "2+ years", pct: 95 },
        { label: "Outcome", value: "Acquired", pct: 100 },
      ],
      images: {
        hero: "Website homepage on monitor + Figma design system",
        screen1: "Product page design \u2014 desktop & mobile",
        screen2: "Campaign landing page \u2014 product launch",
        detail: "Figma component library overview",
        bottom: "Website evolution: v1 \u2192 final version before acquisition",
      },
    },
  ];

  return (
    <section id="work" style={{ padding: "0 0 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ padding: "100px 0 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em" }}>Selected work</h2>
          <p style={{ fontSize: 15, color: T.muted, maxWidth: 400, textAlign: "right", lineHeight: 1.6 }}>Complete marketing ecosystems. Every channel connected. Every dollar tracked.</p>
        </div>

        <Case {...cases[0]} />
      </div>

      {/* DIVIDER between case 1 and 2 */}
      <CaseDivider nextNum="02" nextName="AK Cabinet Craft" nextTagline="Outsourced marketing department. Paid only on results." color="#22C55E" />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <Case {...cases[1]} />
      </div>

      {/* DIVIDER between case 2 and 3 */}
      <CaseDivider nextNum="03" nextName="Object First" nextTagline="2+ year design partnership for a startup acquired by Veeam." color="#3B82F6" />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <Case {...cases[2]} />
      </div>
    </section>
  );
}

// ─── SERVICES ───
function Services() {
  const items = [
    { title: "Performance Marketing", desc: "Google Ads, LSA, Meta Ads. Precision campaigns optimized for conversions, not clicks.", icon: "ads" },
    { title: "SEO & Local SEO", desc: "Technical SEO, content strategy, GBP optimization. Dominate organic search in your market.", icon: "seo" },
    { title: "Web Development", desc: "High-converting Webflow sites. Fast, responsive, built to turn visitors into leads.", icon: "web" },
    { title: "CRM & Automation", desc: "HubSpot setup, lead scoring, email sequences. No lead falls through the cracks.", icon: "crm" },
    { title: "Analytics & Tracking", desc: "GA4, CallRail, Looker Studio dashboards. Know where every dollar goes.", icon: "chart" },
    { title: "UI/UX Design", desc: "Conversion-focused design in Figma. Branding, landing pages, marketing materials.", icon: "design" },
  ];
  return (
    <section id="services" style={{ padding: "120px 0", background: T.bg2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72 }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em" }}>What we do</h2>
          <p style={{ fontSize: 15, color: T.muted, maxWidth: 380, textAlign: "right", lineHeight: 1.6 }}>Full-stack marketing. Every channel connected and optimized for revenue.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: T.line, borderRadius: 16, overflow: "hidden" }}>
          {items.map((s, i) => (
            <div key={i} style={{ padding: "44px 40px", background: T.bg, transition: "background 0.3s", cursor: "default" }}
              onMouseEnter={e => e.currentTarget.style.background = T.bg2}
              onMouseLeave={e => e.currentTarget.style.background = T.bg}
            >
              <div style={{ marginBottom: 16, opacity: 0.7 }}>{icons[s.icon](T.dark)}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: T.dark, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROCESS ───
function Process() {
  const steps = [
    { n: "01", t: "Discovery", d: "We analyze your business, competitors, and current marketing. Every channel. Every number.", detail: ["Business & competitor audit", "Marketing channel analysis", "Tracking infrastructure review", "Opportunity mapping"], icon: "seo" },
    { n: "02", t: "Strategy", d: "Custom roadmap. CRM configuration. Tracking setup. Campaign architecture.", detail: ["Custom channel strategy", "CRM & pipeline design", "Tracking & attribution setup", "Campaign architecture"], icon: "target" },
    { n: "03", t: "Launch", d: "Campaigns go live. Weekly optimization. Transparent reporting. Scale what works.", detail: ["Campaign launch & monitoring", "Weekly optimization cycles", "Real-time dashboards", "A/B testing framework"], icon: "rocket" },
    { n: "04", t: "Scale", d: "New channels. Higher budgets. Deeper automation. Compounding results.", detail: ["Channel expansion", "Budget scaling", "Advanced automation", "Compounding growth"], icon: "arrowUp" },
  ];
  return (
    <section style={{ padding: "120px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72 }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em" }}>How we work</h2>
          <p style={{ fontSize: 15, color: T.muted, maxWidth: 380, textAlign: "right", lineHeight: 1.6 }}>A proven 4-phase system. Each phase builds on the last.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 48, padding: "0 24px" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                border: `1.5px solid ${i === 0 ? T.red : T.line}`,
                background: i === 0 ? T.redSoft : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? T.red : T.muted }}>{s.n}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${i === 0 ? T.red : T.line}, ${T.line})` }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, borderTop: `1px solid ${T.line}`, paddingTop: 40 }}>
          {steps.map((s, i) => (
            <div key={i}>
              <div style={{ marginBottom: 14, opacity: 0.6 }}>{icons[s.icon](i === 0 ? T.red : T.dark)}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: T.dark, marginBottom: 10 }}>{s.t}</h3>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65, marginBottom: 20 }}>{s.d}</p>
              <div style={{ borderTop: `1px solid ${T.lineLight}`, paddingTop: 16 }}>
                {s.detail.map((d, j) => (
                  <p key={j} style={{ fontSize: 12, color: T.mid, lineHeight: 1.7 }}>{d}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA (BRIGHT ACCENT — CHIPSA STYLE) ───
function CallToAction() {
  const [hovered, setHovered] = useState(false);
  const [vis, setVis] = useState(false);
  const ctaRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 });
    if (ctaRef.current) obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, []);

  const ctaKf = `
    @keyframes ctaSlideUp { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ctaMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes ctaPulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.8); opacity: 0; } }
    @keyframes ctaFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  `;

  const marquee = "LET\u2019S TALK \u00b7 START GROWING \u00b7 BOOK A CALL \u00b7 FREE AUDIT \u00b7 ";

  return (
    <section ref={ctaRef} id="contact" style={{
      background: T.red, position: "relative", overflow: "hidden",
    }}>
      <style>{ctaKf}</style>

      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

      {/* Top marquee */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", overflow: "hidden", padding: "20px 0" }}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ctaMarquee 15s linear infinite" }}>
          {[...Array(4)].map((_, r) => (
            <span key={r} style={{
              fontSize: 13, fontWeight: 700, letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
            }}>{marquee}</span>
          ))}
        </div>
      </div>

      {/* Main CTA content */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "120px 48px 100px",
        position: "relative", zIndex: 2, textAlign: "center",
      }}>

        {/* Big headline */}
        <h2 style={{
          fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: 900, letterSpacing: "-0.04em",
          lineHeight: 0.95, color: "#fff", textTransform: "uppercase", marginBottom: 32,
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(60px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
        }}>
          Ready to<br />grow?
        </h2>

        <p style={{
          fontSize: 18, color: "rgba(255,255,255,0.7)", maxWidth: 480,
          margin: "0 auto 56px", lineHeight: 1.7,
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.15s",
        }}>
          Book a free strategy call. We&apos;ll audit your marketing and show you exactly where the money is.
        </p>

        {/* CTA Button — white on red */}
        <div style={{
          display: "flex", gap: 32, justifyContent: "center", alignItems: "center",
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
        }}>
          <a
            href="#"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              position: "relative",
              background: "#fff", color: T.dark,
              padding: "22px 64px", borderRadius: 100,
              textDecoration: "none", fontSize: 16, fontWeight: 800,
              letterSpacing: 1, textTransform: "uppercase",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.2)" : "0 8px 30px rgba(0,0,0,0.1)",
            }}
          >
            Book a call
            <span style={{
              position: "absolute", inset: -4, borderRadius: 100,
              border: "2px solid rgba(255,255,255,0.4)",
              animation: hovered ? "ctaPulse 1.5s ease-in-out infinite" : "none",
              pointerEvents: "none",
            }} />
          </a>
        </div>

        {/* Email below */}
        <a href="mailto:hello@bankai.agency" style={{
          display: "inline-block", marginTop: 32,
          color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14,
          letterSpacing: 1, transition: "all 0.3s",
        }}
        onMouseEnter={e => { e.target.style.color = "#fff"; }}
        onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.5)"; }}
        >hello@bankai.agency</a>

      </div>

      {/* Big BANKAI watermark */}
      <div style={{
        fontSize: "clamp(5rem, 16vw, 14rem)", fontWeight: 900, letterSpacing: "0.1em",
        color: "transparent", textAlign: "center",
        WebkitTextStroke: "1px rgba(255,255,255,0.12)",
        lineHeight: 0.85, padding: "20px 0 60px", pointerEvents: "none",
        textTransform: "uppercase",
      }}>BANKAI</div>
    </section>
  );
}

// ─── FOOTER (CLEAN DARK — CHIPSA STYLE) ───
function Footer() {
  return (
    <footer style={{ background: T.dark, position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 48px" }}>
        {/* Top row: logo + nav + social */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
          <Logo white />
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {["Work", "Services", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 13,
                fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", transition: "color 0.3s",
              }}
              onMouseEnter={e => { e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.3)"; }}
              >{l}</a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 32 }} />

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.15)" }}>&copy; 2026 Bankai Agency. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            {["LinkedIn", "Instagram", "Twitter"].map(s => (
              <a key={s} href="#" style={{
                color: "rgba(255,255,255,0.2)", textDecoration: "none", fontSize: 12,
                letterSpacing: 0.5, transition: "color 0.3s",
              }}
              onMouseEnter={e => { e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.2)"; }}
              >{s}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div style={{
        height: 3,
        background: `linear-gradient(to right, transparent, ${T.red}, transparent)`,
        opacity: 0.5,
      }} />
    </footer>
  );
}

// ─── MAIN ───
export default function Home() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.dark }}>
      <Nav />
      <Hero />
      <Numbers />
      <Funnel />
      <Work />
      <Services />
      <Process />
      <CallToAction />
      <Footer />
    </div>
  );
}
