"use client";
import { useState, useEffect, useRef } from "react";

/* ───── design tokens ─────
   Premium black/crimson: red is a whisper, not a scream.
   White text carries the hierarchy; deep crimson adds warmth. */
const V = {
  bg: "#0A0A0A",
  card: "#111111",
  cardHover: "#161616",
  text: "#A8A8A8",
  dim: "#666666",
  muted: "#444444",
  bright: "#FFFFFF",
  accent: "#A01C2D",       // deep wine — subtle
  accentLit: "#C8354A",    // lit crimson — rare highlights
  accentDim: "rgba(160,28,45,0.07)",
  accentGlow: "rgba(160,28,45,0.15)",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.10)",
  divider: "rgba(255,255,255,0.04)",
  radius: 16,
  radiusSm: 10,
  heading: "'Unbounded', sans-serif",
  body: "'Manrope', -apple-system, sans-serif",
};

/* ───── css ───── */
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes pulse2{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.5);opacity:0}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
*{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.08) transparent;box-sizing:border-box}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px}
::selection{background:rgba(160,28,45,0.3);color:#fff}
html{scroll-behavior:smooth}
@media(max-width:768px){
  .grid-2{grid-template-columns:1fr!important}
  .grid-4{grid-template-columns:1fr 1fr!important}
  .hero-heading{font-size:2.4rem!important}
  .section-heading{font-size:1.8rem!important}
  .process-grid{grid-template-columns:1fr 1fr!important}
  .contact-grid{grid-template-columns:1fr!important}
  .stat-grid{grid-template-columns:1fr 1fr!important}
}
@media(max-width:480px){
  .grid-4{grid-template-columns:1fr!important}
  .process-grid{grid-template-columns:1fr!important}
  .stat-grid{grid-template-columns:1fr!important}
}
`;

/* ───── reveal ───── */
function Reveal({ children, style: extra, delay = 0, tag: Tag = "div", ...props }) {
  return <Tag style={{ animation: `fadeInUp .85s cubic-bezier(.16,1,.3,1) ${delay}ms both`, ...extra }} {...props}>{children}</Tag>;
}

/* ───── container ───── */
const cx = { maxWidth: 1140, margin: "0 auto", padding: "0 32px", position: "relative" };

/* ───── divider ───── */
function Divider() {
  return <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}><div style={{ height: 1, background: V.divider }} /></div>;
}

/* ───── section label ───── */
function Label({ num, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
      <span style={{ fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700, color: V.muted }}>{num}</span>
      <span style={{ width: 24, height: 1, background: V.accent, opacity: 0.4 }} />
      <span style={{ fontFamily: V.heading, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: V.dim }}>{text}</span>
    </div>
  );
}

/* ───── data ───── */
const mainServices = [
  {
    title: "AI-Ядро бизнеса",
    sub: "Внедрение AI-систем для принятия решений",
    desc: "Строим операционную систему вашего бизнеса на базе ИИ. AI-агенты берут на себя рутину, аналитику и часть решений — вы получаете масштабируемый бизнес без раздутого штата.",
    feats: ["AI-агенты для автоматизации", "Система принятия решений", "Интеграция с CRM и рекламой", "Прогнозирование и алерты"],
    flagship: true, link: "/ai-core",
  },
  {
    title: "Маркетинг полного цикла",
    sub: "С нуля или для действующего бизнеса",
    desc: "Весь маркетинг под ключ: от стратегии и позиционирования до лидогенерации и аналитики. Строим систему, которая приносит выручку, а не просто трафик.",
    feats: ["Стратегия и позиционирование", "Воронки продаж", "Контент и креативы", "Сквозная аналитика ROI"],
    flagship: false, link: null,
  },
];

const services = [
  { t: "Google Ads", d: "Search, Performance Max, YouTube — настройка и масштабирование." },
  { t: "Meta Ads", d: "Facebook + Instagram с фокусом на конверсии." },
  { t: "SEO", d: "Технический SEO, контент-стратегия, линкбилдинг." },
  { t: "Web Dev", d: "Next.js, React — быстрые сайты и лендинги." },
  { t: "CRM", d: "HubSpot, Salesforce — настройка и автоматизация." },
  { t: "Analytics", d: "GA4, Looker Studio, сквозная аналитика." },
  { t: "Content", d: "Блоги, рассылки, SMM, видео — контент, что продаёт." },
  { t: "Branding", d: "Логотипы, UI/UX, фирменный стиль, креативы." },
];

const steps = [
  { n: "01", t: "Аудит", d: "Анализируем текущие процессы и находим точки роста." },
  { n: "02", t: "Стратегия", d: "Проектируем систему под ваши цели и бюджет." },
  { n: "03", t: "Внедрение", d: "Интегрируем решения в бизнес-процессы." },
  { n: "04", t: "Масштаб", d: "Оптимизируем и растим результаты." },
];

/* ═══════════════════════ GRADIENT ARC ═══════════════════════ */
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
      t.current += 0.002;
      const T = t.current;
      const s = sm.current, m = mouse.current;
      s.x += (m.x - s.x) * 0.03; s.y += (m.y - s.y) * 0.03;
      ctx.clearRect(0, 0, w, h);

      const cxp = w * 0.52 + (s.x - 0.5) * w * 0.1;
      const cyp = h * 0.92 + (s.y - 0.5) * h * 0.06;
      const R = Math.min(w, h) * 0.78;
      const mi = (s.x - 0.5) * 0.12;

      // Deep atmospheric layers — very low saturation, low alpha
      const layers = [
        { r: R * 1.15, w: 140, a: 0.06, sat: 50, light: 25, sp: 0.6 },
        { r: R * 0.98, w: 100, a: 0.10, sat: 55, light: 28, sp: 0.9 },
        { r: R * 0.84, w: 65,  a: 0.14, sat: 60, light: 30, sp: 1.2 },
        { r: R * 0.72, w: 35,  a: 0.08, sat: 45, light: 22, sp: 0.8 },
        { r: R * 0.62, w: 18,  a: 0.05, sat: 40, light: 20, sp: 1.4 },
      ];

      for (const l of layers) {
        const lr = l.r + Math.sin(T * l.sp) * 12 + (s.y - 0.5) * 25;
        const sa = -Math.PI * 0.82 + mi + Math.sin(T * l.sp * 0.5) * 0.06;
        const ea = -Math.PI * 0.18 + mi + Math.cos(T * l.sp * 0.7) * 0.06;
        const x1 = cxp + Math.cos(sa) * lr, y1 = cyp + Math.sin(sa) * lr;
        const x2 = cxp + Math.cos(ea) * lr, y2 = cyp + Math.sin(ea) * lr;
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        const hue = 355 + Math.sin(T + l.sp) * 8;
        g.addColorStop(0, `hsla(${hue},${l.sat}%,${l.light}%,0)`);
        g.addColorStop(0.25, `hsla(${hue},${l.sat}%,${l.light}%,${l.a * 0.6})`);
        g.addColorStop(0.5, `hsla(${hue},${l.sat + 5}%,${l.light + 3}%,${l.a})`);
        g.addColorStop(0.75, `hsla(${hue - 5},${l.sat}%,${l.light}%,${l.a * 0.6})`);
        g.addColorStop(1, `hsla(${hue - 5},${l.sat}%,${l.light}%,0)`);
        ctx.beginPath();
        ctx.arc(cxp, cyp, lr, sa, ea);
        ctx.lineWidth = l.w; ctx.lineCap = "round"; ctx.strokeStyle = g;
        ctx.filter = `blur(${l.w * 0.45}px)`;
        ctx.stroke();
      }
      ctx.filter = "none";

      // Thin bright core
      const cr = R * 0.84 + Math.sin(T * 1.1) * 6 + (s.y - 0.5) * 16;
      const cs = -Math.PI * 0.78 + mi + Math.sin(T * 0.5) * 0.05;
      const ce = -Math.PI * 0.22 + mi + Math.cos(T * 0.7) * 0.05;
      const cg = ctx.createLinearGradient(
        cxp + Math.cos(cs) * cr, cyp + Math.sin(cs) * cr,
        cxp + Math.cos(ce) * cr, cyp + Math.sin(ce) * cr
      );
      cg.addColorStop(0, "hsla(355,60%,40%,0)");
      cg.addColorStop(0.2, "hsla(355,65%,45%,0.08)");
      cg.addColorStop(0.5, "hsla(0,70%,50%,0.18)");
      cg.addColorStop(0.8, "hsla(5,65%,45%,0.08)");
      cg.addColorStop(1, "hsla(5,60%,40%,0)");
      ctx.beginPath(); ctx.arc(cxp, cyp, cr, cs, ce);
      ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = cg;
      ctx.filter = "blur(1px)"; ctx.stroke(); ctx.filter = "none";

      // Sparse glow particles
      for (let i = 0; i < 12; i++) {
        const f = i / 12;
        const a = cs + (ce - cs) * f;
        const pr = cr + Math.sin(T * 2.5 + i * 1.8) * 10;
        const px = cxp + Math.cos(a) * pr, py = cyp + Math.sin(a) * pr;
        const pa = (0.08 + Math.sin(T * 1.5 + i) * 0.05) * (1 - Math.abs(f - 0.5) * 1.8);
        if (pa <= 0) continue;
        const ps = 1.5 + Math.sin(T * 3 + i * 2) * 0.8;
        const pg = ctx.createRadialGradient(px, py, 0, px, py, ps * 4);
        pg.addColorStop(0, `hsla(0,60%,55%,${pa})`);
        pg.addColorStop(1, `hsla(0,60%,55%,0)`);
        ctx.beginPath(); ctx.arc(px, py, ps * 4, 0, Math.PI * 2);
        ctx.fillStyle = pg; ctx.fill();
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
      background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${V.border}` : "1px solid transparent",
      transition: "all .5s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{ ...cx, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 900, fontSize: "1.05rem", color: V.bright, letterSpacing: "-0.04em" }}>
          BANKAI<span style={{ color: V.accent }}>.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#services" style={{ color: V.dim, fontSize: "0.8rem", textDecoration: "none", fontWeight: 500, letterSpacing: "0.02em" }}>Услуги</a>
          <a href="#process" style={{ color: V.dim, fontSize: "0.8rem", textDecoration: "none", fontWeight: 500, letterSpacing: "0.02em" }}>Процесс</a>
          <a href="#contact" style={{
            border: `1px solid ${V.borderHover}`, color: V.bright,
            padding: "8px 20px", borderRadius: 100,
            fontWeight: 600, fontSize: "0.75rem", textDecoration: "none", letterSpacing: "0.04em",
          }}>СВЯЗАТЬСЯ</a>
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
        {/* Under construction — minimal, not screaming */}
        <Reveal>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "8px 18px",
            background: V.accentDim,
            border: `1px solid rgba(160,28,45,0.15)`,
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

        <Reveal delay={80}>
          <h1 className="hero-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)",
            fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.05em",
            color: V.bright, maxWidth: 850, marginBottom: 28,
          }}>
            Строим системы,
            <br />которые приносят
            <br /><span style={{ color: V.text }}>выручку</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p style={{ fontSize: "1.05rem", color: V.dim, maxWidth: 480, lineHeight: 1.7, marginBottom: 48 }}>
            AI-автоматизация и маркетинг полного цикла
            для бизнеса, который хочет расти быстрее.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#services" style={{
              border: `1px solid ${V.borderHover}`, color: V.bright,
              padding: "14px 36px", borderRadius: 100, background: "rgba(255,255,255,0.04)",
              fontWeight: 600, fontSize: "0.85rem", textDecoration: "none",
            }}>Смотреть услуги</a>
            <a href="#contact" style={{
              color: V.dim, padding: "14px 36px", borderRadius: 100,
              fontWeight: 500, fontSize: "0.85rem", textDecoration: "none",
            }}>Связаться →</a>
          </div>
        </Reveal>

        <Reveal delay={380}>
          <div className="stat-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 56,
            marginTop: 80, paddingTop: 36, borderTop: `1px solid ${V.divider}`, maxWidth: 520,
          }}>
            {[
              { v: "50+", l: "проектов" },
              { v: "3x", l: "средний рост" },
              { v: "24ч", l: "время ответа" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: V.heading, fontSize: "1.6rem", fontWeight: 800, color: V.bright, letterSpacing: "-0.04em", marginBottom: 2 }}>{s.v}</div>
                <div style={{ fontSize: "0.72rem", color: V.muted }}>{s.l}</div>
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
  const words = ["AI-АВТОМАТИЗАЦИЯ", "GOOGLE ADS", "SEO", "CRM", "АНАЛИТИКА", "PERFORMANCE", "ЛИДОГЕНЕРАЦИЯ", "КОНТЕНТ", "BRANDING", "WEB DEV"];
  const row = words.map((w, i) => (
    <span key={i} style={{
      fontFamily: V.heading, fontSize: "0.6rem", fontWeight: 700,
      letterSpacing: "0.2em",
      color: i % 2 === 0 ? "rgba(160,28,45,0.3)" : "rgba(255,255,255,0.08)",
      whiteSpace: "nowrap", padding: "0 36px",
    }}>{w}</span>
  ));
  return (
    <div style={{ overflow: "hidden", padding: "22px 0", borderTop: `1px solid ${V.divider}`, borderBottom: `1px solid ${V.divider}`, position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", animation: "marquee 40s linear infinite", width: "max-content" }}>{row}{row}</div>
    </div>
  );
}

/* ═══════════════════════ MAIN SERVICES ═══════════════════════ */
function MainServices() {
  const [hi, setHi] = useState(-1);
  return (
    <section id="services" style={{ padding: "120px 0 80px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal><Label num="01" text="Ключевые направления" /></Reveal>
        <Reveal delay={60}>
          <h2 className="section-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 700, marginBottom: 56,
          }}>Два ядра нашей экспертизы</h2>
        </Reveal>

        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {mainServices.map((s, i) => (
            <Reveal key={i} delay={100 + i * 80}>
              <div
                onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(-1)}
                style={{
                  background: hi === i ? V.cardHover : V.card,
                  border: `1px solid ${hi === i ? (s.flagship ? "rgba(160,28,45,0.18)" : V.borderHover) : V.border}`,
                  borderRadius: V.radius, padding: "44px 36px",
                  transition: "all .45s cubic-bezier(.16,1,.3,1)",
                  position: "relative", overflow: "hidden",
                  height: "100%", display: "flex", flexDirection: "column",
                }}
              >
                {/* subtle top accent */}
                {s.flagship && <div style={{
                  position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
                  background: `linear-gradient(90deg, transparent, rgba(160,28,45,${hi === 0 ? 0.3 : 0.12}), transparent)`,
                  transition: "all .5s",
                }} />}

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                  <span style={{ fontFamily: V.heading, fontSize: "2.4rem", fontWeight: 900, color: "rgba(255,255,255,0.025)", lineHeight: 1 }}>0{i + 1}</span>
                  {s.flagship && (
                    <span style={{
                      padding: "3px 8px", background: V.accentDim, borderRadius: 4,
                      fontSize: "0.55rem", fontWeight: 700, color: V.accent, letterSpacing: "0.12em",
                    }}>FLAGSHIP</span>
                  )}
                </div>

                <h3 style={{ fontFamily: V.heading, fontSize: "1.35rem", fontWeight: 800, color: V.bright, marginBottom: 6, letterSpacing: "-0.03em" }}>{s.title}</h3>
                <div style={{ fontSize: "0.75rem", color: V.dim, fontWeight: 600, marginBottom: 18 }}>{s.sub}</div>
                <p style={{ fontSize: "0.88rem", color: V.text, lineHeight: 1.7, marginBottom: 28, opacity: 0.65 }}>{s.desc}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 32, marginTop: "auto" }}>
                  {s.feats.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: s.flagship ? V.accent : V.muted, opacity: 0.5, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.76rem", color: V.dim }}>{f}</span>
                    </div>
                  ))}
                </div>

                <a href={s.link || "#contact"} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  color: s.flagship ? V.accentLit : V.dim,
                  fontWeight: 600, fontSize: "0.78rem", textDecoration: "none", alignSelf: "flex-start", letterSpacing: "0.03em",
                }}>{s.link ? "ПОДРОБНЕЕ" : "ОБСУДИТЬ"} →</a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ SERVICES GRID ═══════════════════════ */
function ServicesGrid() {
  const [hi, setHi] = useState(-1);
  return (
    <section style={{ padding: "80px 0 120px", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal><Label num="02" text="Все услуги" /></Reveal>
        <Reveal delay={60}>
          <h2 className="section-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 600, marginBottom: 48,
          }}>Каждый канал — как отдельный продукт</h2>
        </Reveal>

        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {services.map((s, i) => (
            <Reveal key={i} delay={80 + i * 35}>
              <div
                onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(-1)}
                style={{
                  background: hi === i ? V.cardHover : V.card,
                  border: `1px solid ${hi === i ? V.borderHover : V.border}`,
                  borderRadius: V.radiusSm, padding: "24px 20px",
                  transition: "all .35s cubic-bezier(.16,1,.3,1)",
                }}
              >
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
  const [hi, setHi] = useState(-1);
  return (
    <section id="process" style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal><Label num="03" text="Процесс" /></Reveal>
        <Reveal delay={60}>
          <h2 className="section-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, maxWidth: 600, marginBottom: 56,
          }}>Как мы работаем</h2>
        </Reveal>

        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {steps.map((s, i) => (
            <Reveal key={i} delay={100 + i * 70}>
              <div
                onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(-1)}
                style={{
                  padding: "32px 24px", position: "relative",
                  borderLeft: i === 0 ? "none" : `1px solid ${V.divider}`,
                  transition: "all .35s",
                }}
              >
                <div style={{
                  fontFamily: V.heading, fontSize: "2rem", fontWeight: 900,
                  color: hi === i ? "rgba(160,28,45,0.12)" : "rgba(255,255,255,0.03)",
                  letterSpacing: "-0.05em", marginBottom: 16, transition: "color .35s",
                }}>{s.n}</div>
                <h3 style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 800, color: V.bright, marginBottom: 8 }}>{s.t}</h3>
                <p style={{ fontSize: "0.78rem", color: V.dim, lineHeight: 1.55, margin: 0 }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ STATEMENT ═══════════════════════ */
function Statement() {
  return (
    <section style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={cx}>
        <Reveal>
          <h2 style={{
            fontFamily: V.heading, fontSize: "clamp(1.5rem, 3vw, 2.3rem)",
            fontWeight: 800, lineHeight: 1.35, letterSpacing: "-0.03em",
            color: V.muted, maxWidth: 850,
          }}>
            Мы не просто запускаем рекламу.{" "}
            <span style={{ color: V.bright }}>Мы строим системы, где AI, данные и маркетинг работают как единый механизм</span>
            {" "}— и приносят измеримый результат.
          </h2>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════ CONTACT ═══════════════════════ */
function Contact() {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const inp = {
    width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.03)",
    border: `1px solid ${V.border}`, borderRadius: V.radiusSm, color: V.bright,
    fontSize: "0.88rem", outline: "none", transition: "border .3s", fontFamily: V.body,
  };

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
            <Reveal><Label num="04" text="Контакты" /></Reveal>
            <Reveal delay={60}>
              <h2 className="section-heading" style={{
                fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
                lineHeight: 1.06, letterSpacing: "-0.04em", color: V.bright, marginBottom: 20,
              }}>Обсудим ваш проект?</h2>
            </Reveal>
            <Reveal delay={100}>
              <p style={{ fontSize: "0.95rem", color: V.dim, lineHeight: 1.7, marginBottom: 44, maxWidth: 380 }}>
                Оставьте заявку — мы свяжемся в течение 24 часов.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Email", value: "agency.bankai@gmail.com", href: "mailto:agency.bankai@gmail.com" },
                  { label: "Telegram", value: "@bankaiagency", href: "https://t.me/bankaiagency" },
                ].map((c, i) => (
                  <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "rgba(255,255,255,0.03)", border: `1px solid ${V.border}`,
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

          <Reveal delay={120}>
            <div style={{ background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radius, padding: "36px 32px" }}>
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
                      <input style={inp} placeholder="Как вас зовут" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", color: V.muted, marginBottom: 5, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }}>Контакт</label>
                      <input style={inp} placeholder="Телефон или email" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.65rem", color: V.muted, marginBottom: 5, display: "block", letterSpacing: "0.06em", textTransform: "uppercase" }}>О проекте</label>
                      <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} placeholder="Расскажите кратко" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <button type="submit" disabled={sending} style={{
                      border: `1px solid ${V.borderHover}`, color: V.bright,
                      padding: "13px 28px", borderRadius: 100, background: "rgba(255,255,255,0.04)",
                      fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
                      fontFamily: V.body, letterSpacing: "0.03em",
                      opacity: sending ? 0.5 : 1, transition: "all .3s",
                    }}>{sending ? "Отправляем..." : "Отправить заявку →"}</button>
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
    <footer style={{ padding: "32px 0", borderTop: `1px solid ${V.divider}`, position: "relative", zIndex: 1 }}>
      <div style={{ ...cx, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 900, fontSize: "0.8rem", color: V.muted }}>BANKAI<span style={{ color: V.accent, opacity: 0.5 }}>.</span></div>
        <div style={{ fontSize: "0.68rem", color: V.muted }}>© 2026</div>
      </div>
    </footer>
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
        <Statement />
        <Divider />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
