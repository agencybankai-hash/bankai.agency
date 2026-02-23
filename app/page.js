"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ───── design tokens ───── */
const V = {
  bg: "#06060B",
  card: "#0C0C14",
  cardHover: "#12121C",
  surface: "#0A0A12",
  text: "#C8C5D4",
  dim: "#6B6880",
  muted: "#4A4760",
  bright: "#FFFFFF",
  accent: "#6EE7B7",
  accent2: "#34D399",
  accentDim: "rgba(110,231,183,0.08)",
  accentGlow: "rgba(110,231,183,0.25)",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.12)",
  divider: "rgba(255,255,255,0.04)",
  radius: 20,
  radiusSm: 12,
  heading: "'Unbounded', cursive",
  body: "'Manrope', -apple-system, sans-serif",
};

/* ───── keyframes ───── */
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap');
@keyframes fadeInUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes pulse2 { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.6);opacity:0} }
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes drawLine { from{stroke-dashoffset:1000} to{stroke-dashoffset:0} }
@keyframes countUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
* { scrollbar-width: thin; scrollbar-color: rgba(110,231,183,0.15) transparent; box-sizing: border-box; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(110,231,183,0.15); border-radius: 3px; }
::selection { background: rgba(110,231,183,0.2); color: #fff; }
html { scroll-behavior: smooth; }
@media (max-width: 768px) {
  .grid-2 { grid-template-columns: 1fr !important; }
  .grid-4 { grid-template-columns: 1fr 1fr !important; }
  .hero-heading { font-size: 2.6rem !important; }
  .section-heading { font-size: 2rem !important; }
  .process-grid { grid-template-columns: 1fr !important; }
  .contact-grid { grid-template-columns: 1fr !important; }
  .stat-grid { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 480px) {
  .grid-4 { grid-template-columns: 1fr !important; }
  .stat-grid { grid-template-columns: 1fr !important; }
}
`;

/* ───── reveal ───── */
function Reveal({ children, style: extra, delay = 0, tag: Tag = "div", ...props }) {
  return (
    <Tag style={{ animation: `fadeInUp .9s cubic-bezier(.16,1,.3,1) ${delay}ms both`, ...extra }} {...props}>
      {children}
    </Tag>
  );
}

/* ───── container ───── */
const container = { maxWidth: 1200, margin: "0 auto", padding: "0 32px", position: "relative" };

/* ───── section divider ───── */
function Divider() {
  return <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}><div style={{ height: 1, background: V.divider }} /></div>;
}

/* ───── numbered label ───── */
function SectionLabel({ number, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
      <span style={{
        fontFamily: V.heading, fontSize: "0.7rem", fontWeight: 700,
        color: V.muted, letterSpacing: "0.05em",
      }}>{number}</span>
      <span style={{ width: 32, height: 1, background: V.accent, display: "block", opacity: 0.5 }} />
      <span style={{
        fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
        letterSpacing: "0.2em", textTransform: "uppercase", color: V.accent,
      }}>{text}</span>
    </div>
  );
}

/* ───── services data ───── */
const mainServices = [
  {
    title: "AI-Ядро бизнеса",
    subtitle: "Внедрение AI-систем для принятия решений",
    description: "Строим операционную систему вашего бизнеса на базе ИИ. AI-агенты берут на себя рутину, аналитику и часть решений — вы получаете масштабируемый бизнес без раздутого штата.",
    features: ["AI-агенты для автоматизации", "Система принятия решений", "Интеграция с CRM и рекламой", "Прогнозирование и алерты"],
    icon: "🧠",
    accent: true,
    link: "/ai-core",
  },
  {
    title: "Маркетинг полного цикла",
    subtitle: "С нуля или для действующего бизнеса",
    description: "Весь маркетинг под ключ: от стратегии и позиционирования до лидогенерации и аналитики. Строим систему, которая приносит выручку, а не просто трафик.",
    features: ["Стратегия и позиционирование", "Воронки продаж", "Контент и креативы", "Сквозная аналитика ROI"],
    icon: "🚀",
    accent: false,
    link: null,
  },
];

const otherServices = [
  { title: "Google Ads", desc: "Search, Performance Max, YouTube — настройка и масштабирование.", icon: "G" },
  { title: "Meta Ads", desc: "Facebook + Instagram с фокусом на конверсии.", icon: "M" },
  { title: "SEO", desc: "Технический SEO, контент-стратегия, линкбилдинг.", icon: "S" },
  { title: "Web Dev", desc: "Next.js, React — быстрые сайты и лендинги.", icon: "W" },
  { title: "CRM", desc: "HubSpot, Salesforce — настройка и автоматизация.", icon: "C" },
  { title: "Analytics", desc: "GA4, Looker Studio, сквозная аналитика.", icon: "A" },
  { title: "Content", desc: "Блоги, рассылки, SMM, видео — контент, что продаёт.", icon: "T" },
  { title: "Branding", desc: "Логотипы, UI/UX, фирменный стиль, креативы.", icon: "B" },
];

const processSteps = [
  { num: "01", title: "Аудит", desc: "Анализируем текущие процессы и находим точки роста." },
  { num: "02", title: "Стратегия", desc: "Проектируем систему под ваши цели и бюджет." },
  { num: "03", title: "Внедрение", desc: "Интегрируем решения в бизнес-процессы." },
  { num: "04", title: "Масштабирование", desc: "Оптимизируем и растим результаты." },
];

/* ═══════════════════════ INTERACTIVE GRADIENT ARC ═══════════════════════ */
function GradientArc() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const raf = useRef(null);
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const draw = () => {
      time.current += 0.003;
      const t = time.current;
      const sm = smoothMouse.current;
      const m = mouse.current;
      sm.x += (m.x - sm.x) * 0.04;
      sm.y += (m.y - sm.y) * 0.04;

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5 + (sm.x - 0.5) * w * 0.12;
      const cy = h * 0.55 + (sm.y - 0.5) * h * 0.08;
      const baseRadius = Math.min(w, h) * 0.75;
      const mouseInfluence = (sm.x - 0.5) * 0.15;

      const layers = [
        { radius: baseRadius * 1.1, width: 120, alpha: 0.1, hue: 160, speed: 0.7 },
        { radius: baseRadius * 0.95, width: 90, alpha: 0.18, hue: 155, speed: 1 },
        { radius: baseRadius * 0.82, width: 60, alpha: 0.25, hue: 150, speed: 1.3 },
        { radius: baseRadius * 0.72, width: 35, alpha: 0.15, hue: 165, speed: 0.9 },
        { radius: baseRadius * 0.6, width: 20, alpha: 0.1, hue: 170, speed: 1.5 },
      ];

      for (const layer of layers) {
        const r = layer.radius + Math.sin(t * layer.speed) * 15 + (sm.y - 0.5) * 30;
        const startAngle = -Math.PI * 0.85 + mouseInfluence + Math.sin(t * layer.speed * 0.5) * 0.08;
        const endAngle = -Math.PI * 0.15 + mouseInfluence + Math.cos(t * layer.speed * 0.7) * 0.08;

        const x1 = cx + Math.cos(startAngle) * r;
        const y1 = cy + Math.sin(startAngle) * r;
        const x2 = cx + Math.cos(endAngle) * r;
        const y2 = cy + Math.sin(endAngle) * r;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        const h1 = layer.hue + Math.sin(t + layer.speed) * 10;
        const h2 = layer.hue - 15 + Math.cos(t * 0.8) * 10;
        grad.addColorStop(0, `hsla(${h1}, 75%, 65%, 0)`);
        grad.addColorStop(0.2, `hsla(${h1}, 75%, 65%, ${layer.alpha * 0.7})`);
        grad.addColorStop(0.5, `hsla(${(h1 + h2) / 2}, 80%, 60%, ${layer.alpha})`);
        grad.addColorStop(0.8, `hsla(${h2}, 70%, 55%, ${layer.alpha * 0.7})`);
        grad.addColorStop(1, `hsla(${h2}, 70%, 55%, 0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.lineWidth = layer.width;
        ctx.lineCap = "round";
        ctx.strokeStyle = grad;
        ctx.filter = `blur(${layer.width * 0.4}px)`;
        ctx.stroke();
      }

      ctx.filter = "none";

      const coreR = baseRadius * 0.82 + Math.sin(t * 1.2) * 8 + (sm.y - 0.5) * 20;
      const coreStart = -Math.PI * 0.8 + mouseInfluence + Math.sin(t * 0.6) * 0.06;
      const coreEnd = -Math.PI * 0.2 + mouseInfluence + Math.cos(t * 0.8) * 0.06;

      const coreGrad = ctx.createLinearGradient(
        cx + Math.cos(coreStart) * coreR, cy + Math.sin(coreStart) * coreR,
        cx + Math.cos(coreEnd) * coreR, cy + Math.sin(coreEnd) * coreR
      );
      coreGrad.addColorStop(0, "hsla(160, 80%, 70%, 0)");
      coreGrad.addColorStop(0.15, "hsla(160, 80%, 75%, 0.12)");
      coreGrad.addColorStop(0.5, "hsla(155, 90%, 80%, 0.3)");
      coreGrad.addColorStop(0.85, "hsla(150, 80%, 70%, 0.12)");
      coreGrad.addColorStop(1, "hsla(150, 80%, 65%, 0)");

      ctx.beginPath();
      ctx.arc(cx, cy, coreR, coreStart, coreEnd);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = coreGrad;
      ctx.filter = "blur(1.5px)";
      ctx.stroke();
      ctx.filter = "none";

      const numParticles = 18;
      for (let i = 0; i < numParticles; i++) {
        const frac = i / numParticles;
        const angle = coreStart + (coreEnd - coreStart) * frac;
        const pr = coreR + Math.sin(t * 3 + i * 1.5) * 12;
        const px = cx + Math.cos(angle) * pr;
        const py = cy + Math.sin(angle) * pr;
        const pAlpha = (0.12 + Math.sin(t * 2 + i) * 0.08) * (1 - Math.abs(frac - 0.5) * 1.6);
        if (pAlpha <= 0) continue;
        const pSize = 2 + Math.sin(t * 4 + i * 2) * 1;

        const pg = ctx.createRadialGradient(px, py, 0, px, py, pSize * 4);
        pg.addColorStop(0, `hsla(158, 85%, 75%, ${pAlpha})`);
        pg.addColorStop(1, `hsla(158, 85%, 75%, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, pSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

/* ═══════════════════════ NAV ═══════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 38, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "14px 0" : "24px 0",
      background: scrolled ? "rgba(6,6,11,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
      borderBottom: scrolled ? `1px solid ${V.border}` : "1px solid transparent",
      transition: "all .5s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{ ...container, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 900, fontSize: "1.1rem", color: V.bright, letterSpacing: "-0.04em" }}>
          BANKAI<span style={{ color: V.accent, opacity: 0.8 }}>.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#services" style={{ color: V.dim, fontSize: "0.82rem", textDecoration: "none", fontWeight: 500, transition: "color .3s", letterSpacing: "-0.01em" }}>Услуги</a>
          <a href="#process" style={{ color: V.dim, fontSize: "0.82rem", textDecoration: "none", fontWeight: 500, transition: "color .3s", letterSpacing: "-0.01em" }}>Процесс</a>
          <a href="#contact" style={{
            background: V.bright, color: V.bg,
            padding: "9px 22px", borderRadius: 100,
            fontWeight: 700, fontSize: "0.78rem", textDecoration: "none",
            transition: "all .3s", letterSpacing: "0.02em",
          }}>СВЯЗАТЬСЯ</a>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════ COMING SOON BANNER ═══════════════════════ */
function ComingSoonBanner() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: `linear-gradient(90deg, ${V.accent}, ${V.accent2})`,
      padding: "10px 0", textAlign: "center",
    }}>
      <div style={{
        fontFamily: V.heading, fontSize: "0.72rem", fontWeight: 700,
        color: V.bg, letterSpacing: "0.1em", textTransform: "uppercase",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        <span style={{ width: 6, height: 6, background: V.bg, borderRadius: "50%", display: "inline-block", animation: "pulse2 1.5s ease-out infinite", position: "relative" }}>
          <span style={{ position: "absolute", inset: -3, borderRadius: "50%", border: `2px solid ${V.bg}`, animation: "pulse2 1.5s ease-out infinite" }} />
        </span>
        Сайт в разработке — это превью будущего сайта. Оставьте заявку ниже.
      </div>
    </div>
  );
}

/* ═══════════════════════ HERO ═══════════════════════ */
function Hero() {
  return (
    <section style={{ padding: "220px 0 100px", position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <GradientArc />
      <div style={{ ...container, zIndex: 1, position: "relative", width: "100%" }}>
        {/* prominent coming soon block */}
        <Reveal>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "12px 24px",
            background: "rgba(110,231,183,0.08)",
            border: "1px solid rgba(110,231,183,0.25)", borderRadius: V.radiusSm,
            marginBottom: 48,
          }}>
            <div style={{
              width: 8, height: 8, background: V.accent, borderRadius: "50%",
              boxShadow: `0 0 12px ${V.accent}`,
              animation: "pulse2 2s ease-out infinite", position: "relative",
            }} />
            <div>
              <div style={{ fontFamily: V.heading, fontSize: "0.78rem", fontWeight: 700, color: V.accent, letterSpacing: "0.05em" }}>
                COMING SOON
              </div>
              <div style={{ fontSize: "0.75rem", color: V.dim, marginTop: 2 }}>
                Это заглушка. Полная версия сайта скоро будет готова.
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="hero-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(2.8rem, 6vw, 5.2rem)",
            fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.05em",
            color: V.bright, maxWidth: 900, marginBottom: 32,
          }}>
            Строим системы,
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${V.accent}, ${V.accent2}, #A7F3D0)`,
              backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>которые приносят
            <br />выручку</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p style={{ fontSize: "1.1rem", color: V.dim, maxWidth: 520, lineHeight: 1.7, marginBottom: 56, fontWeight: 400, letterSpacing: "-0.01em" }}>
            AI-автоматизация и маркетинг полного цикла
            для бизнеса, который хочет расти быстрее.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <a href="#services" style={{
              background: V.bright, color: V.bg,
              padding: "16px 40px", borderRadius: 100,
              fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
              transition: "all .3s", letterSpacing: "-0.01em",
            }}>Смотреть услуги</a>
            <a href="#contact" style={{
              border: `1px solid rgba(255,255,255,0.12)`, color: V.text,
              padding: "16px 40px", borderRadius: 100, background: "rgba(255,255,255,0.03)",
              fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
              transition: "all .3s",
            }}>Обсудить проект</a>
          </div>
        </Reveal>

        {/* stats row */}
        <Reveal delay={450}>
          <div className="stat-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 48,
            marginTop: 80, paddingTop: 40, borderTop: `1px solid ${V.divider}`,
            maxWidth: 600,
          }}>
            {[
              { value: "50+", label: "проектов" },
              { value: "3x", label: "средний рост выручки" },
              { value: "24ч", label: "время ответа" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: V.heading, fontSize: "1.8rem", fontWeight: 800, color: V.bright, letterSpacing: "-0.04em", marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: "0.78rem", color: V.muted, letterSpacing: "0.02em" }}>{s.label}</div>
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
      fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
      letterSpacing: "0.2em", color: i % 2 === 0 ? "rgba(110,231,183,0.4)" : "rgba(255,255,255,0.12)",
      whiteSpace: "nowrap", padding: "0 40px",
    }}>{w}</span>
  ));
  return (
    <div style={{ overflow: "hidden", padding: "24px 0", borderTop: `1px solid ${V.divider}`, borderBottom: `1px solid ${V.divider}`, position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", animation: "marquee 35s linear infinite", width: "max-content" }}>
        {row}{row}
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN SERVICES ═══════════════════════ */
function MainServices() {
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  return (
    <section id="services" style={{ padding: "120px 0 80px", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal>
          <SectionLabel number="01" text="Ключевые направления" />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="section-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900,
            lineHeight: 1.05, letterSpacing: "-0.04em", color: V.bright, maxWidth: 800, marginBottom: 64,
          }}>
            Два ядра нашей
            <br />экспертизы
          </h2>
        </Reveal>

        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {mainServices.map((s, i) => (
            <Reveal key={i} delay={120 + i * 100}>
              <div
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
                style={{
                  background: hoveredIdx === i ? V.cardHover : V.card,
                  border: `1px solid ${hoveredIdx === i ? (s.accent ? "rgba(110,231,183,0.2)" : V.borderHover) : V.border}`,
                  borderRadius: V.radius,
                  padding: "48px 40px",
                  transition: "all .5s cubic-bezier(.16,1,.3,1)",
                  position: "relative", overflow: "hidden",
                  height: "100%", display: "flex", flexDirection: "column",
                  transform: hoveredIdx === i ? "translateY(-2px)" : "none",
                }}
              >
                {/* top line accent */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 1,
                  background: s.accent
                    ? `linear-gradient(90deg, transparent, ${V.accent}${hoveredIdx === i ? "40" : "15"}, transparent)`
                    : `linear-gradient(90deg, transparent, rgba(255,255,255,${hoveredIdx === i ? "0.06" : "0.02"}), transparent)`,
                  transition: "all .5s",
                }} />

                {/* number + badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                  <span style={{
                    fontFamily: V.heading, fontSize: "3rem", fontWeight: 900,
                    color: "rgba(255,255,255,0.03)", lineHeight: 1, letterSpacing: "-0.05em",
                  }}>0{i + 1}</span>
                  {s.accent && (
                    <span style={{
                      padding: "4px 10px", background: V.accentDim, borderRadius: 100,
                      fontSize: "0.6rem", fontWeight: 700, color: V.accent,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                    }}>FLAGSHIP</span>
                  )}
                </div>

                <h3 style={{
                  fontFamily: V.heading, fontSize: "1.5rem", fontWeight: 800,
                  color: V.bright, marginBottom: 8, letterSpacing: "-0.03em",
                }}>{s.title}</h3>
                <div style={{ fontSize: "0.8rem", color: s.accent ? V.accent : V.dim, fontWeight: 600, marginBottom: 20, letterSpacing: "0.01em" }}>{s.subtitle}</div>
                <p style={{ fontSize: "0.9rem", color: V.text, lineHeight: 1.7, marginBottom: 32, opacity: 0.7 }}>{s.description}</p>

                {/* features as minimal list */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", marginBottom: 36, marginTop: "auto" }}>
                  {s.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 4, height: 4, borderRadius: "50%",
                        background: s.accent ? V.accent : V.muted,
                        flexShrink: 0, opacity: 0.6,
                      }} />
                      <span style={{ fontSize: "0.8rem", color: V.dim }}>{f}</span>
                    </div>
                  ))}
                </div>

                {s.link ? (
                  <a href={s.link} style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    color: V.accent, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none",
                    transition: "all .3s", alignSelf: "flex-start",
                    letterSpacing: "0.02em",
                  }}>ПОДРОБНЕЕ <span style={{ fontSize: "1rem" }}>→</span></a>
                ) : (
                  <a href="#contact" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    color: V.dim, fontWeight: 600, fontSize: "0.82rem", textDecoration: "none",
                    transition: "all .3s", alignSelf: "flex-start",
                    letterSpacing: "0.02em",
                  }}>ОБСУДИТЬ ПРОЕКТ <span style={{ fontSize: "1rem" }}>→</span></a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ OTHER SERVICES GRID ═══════════════════════ */
function OtherServices() {
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  return (
    <section style={{ padding: "80px 0 120px", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal>
          <SectionLabel number="02" text="Все услуги" />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="section-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            lineHeight: 1.05, letterSpacing: "-0.04em", color: V.bright, maxWidth: 700, marginBottom: 56,
          }}>
            Каждый канал —
            <br />как отдельный продукт
          </h2>
        </Reveal>

        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {otherServices.map((s, i) => (
            <Reveal key={i} delay={100 + i * 40}>
              <div
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
                style={{
                  background: hoveredIdx === i ? V.cardHover : V.card,
                  border: `1px solid ${hoveredIdx === i ? V.borderHover : V.border}`,
                  borderRadius: V.radiusSm,
                  padding: "28px 24px",
                  transition: "all .4s cubic-bezier(.16,1,.3,1)",
                  cursor: "default",
                  transform: hoveredIdx === i ? "translateY(-2px)" : "none",
                }}
              >
                {/* monogram icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: hoveredIdx === i ? "rgba(110,231,183,0.08)" : "rgba(255,255,255,0.03)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: V.heading, fontSize: "0.75rem", fontWeight: 800,
                  color: hoveredIdx === i ? V.accent : V.muted,
                  marginBottom: 16, transition: "all .4s",
                  letterSpacing: "-0.02em",
                }}>{s.icon}</div>
                <h4 style={{
                  fontFamily: V.heading, fontSize: "0.88rem", fontWeight: 700,
                  color: V.bright, marginBottom: 8, letterSpacing: "-0.02em",
                }}>{s.title}</h4>
                <p style={{ fontSize: "0.78rem", color: V.dim, lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
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
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  return (
    <section id="process" style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal>
          <SectionLabel number="03" text="Процесс" />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="section-heading" style={{
            fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
            lineHeight: 1.05, letterSpacing: "-0.04em", color: V.bright, maxWidth: 700, marginBottom: 64,
          }}>
            Как мы работаем
          </h2>
        </Reveal>

        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {processSteps.map((step, i) => (
            <Reveal key={i} delay={120 + i * 80}>
              <div
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
                style={{
                  padding: "36px 28px", position: "relative",
                  borderLeft: `1px solid ${hoveredIdx === i ? V.accent : V.border}`,
                  transition: "all .4s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <div style={{
                  fontFamily: V.heading, fontSize: "2.4rem", fontWeight: 900,
                  color: hoveredIdx === i ? "rgba(110,231,183,0.15)" : "rgba(255,255,255,0.04)",
                  letterSpacing: "-0.05em", marginBottom: 20,
                  transition: "color .4s",
                }}>{step.num}</div>
                <h3 style={{
                  fontFamily: V.heading, fontSize: "1.1rem", fontWeight: 800,
                  color: V.bright, marginBottom: 10, letterSpacing: "-0.02em",
                }}>{step.title}</h3>
                <p style={{ fontSize: "0.82rem", color: V.dim, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ STATEMENT SECTION ═══════════════════════ */
function Statement() {
  return (
    <section style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal>
          <h2 style={{
            fontFamily: V.heading, fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
            fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.03em",
            color: V.dim, maxWidth: 900,
          }}>
            Мы не просто запускаем рекламу.{" "}
            <span style={{ color: V.bright }}>
              Мы строим системы, где AI, данные и маркетинг работают как единый механизм
            </span>{" "}
            — и приносят измеримый результат.
          </h2>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════ CONTACT ═══════════════════════ */
function ContactForm() {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const inputStyle = {
    width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.03)",
    border: `1px solid ${V.border}`, borderRadius: V.radiusSm, color: V.bright,
    fontSize: "0.9rem", outline: "none", transition: "border .3s",
    fontFamily: V.body,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.contact) return;
    setSending(true);
    try {
      await fetch("https://formsubmit.co/ajax/agency.bankai@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: form.name, contact: form.contact,
          message: form.message || "Без сообщения",
          _subject: `Новая заявка с Bankai.Agency от ${form.name}`,
        }),
      });
      setSent(true);
    } catch { setSent(true); }
    setSending(false);
  };

  return (
    <section id="contact" style={{ padding: "120px 0 140px", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          {/* Left */}
          <div>
            <Reveal>
              <SectionLabel number="04" text="Контакты" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="section-heading" style={{
                fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900,
                lineHeight: 1.05, letterSpacing: "-0.04em", color: V.bright, marginBottom: 24,
              }}>
                Обсудим
                <br />ваш проект?
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p style={{ fontSize: "1rem", color: V.dim, lineHeight: 1.7, marginBottom: 48, maxWidth: 400 }}>
                Оставьте заявку — мы свяжемся в течение 24 часов.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <a href="mailto:agency.bankai@gmail.com" style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${V.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: V.heading, fontSize: "0.7rem", fontWeight: 700, color: V.muted,
                  }}>@</div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: V.muted, marginBottom: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>Email</div>
                    <div style={{ color: V.bright, fontWeight: 600, fontSize: "0.9rem" }}>agency.bankai@gmail.com</div>
                  </div>
                </a>
                <a href="https://t.me/bankaiagency" target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${V.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: V.heading, fontSize: "0.7rem", fontWeight: 700, color: V.muted,
                  }}>TG</div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: V.muted, marginBottom: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>Telegram</div>
                    <div style={{ color: V.bright, fontWeight: 600, fontSize: "0.9rem" }}>@bankaiagency</div>
                  </div>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal delay={150}>
            <div style={{
              background: V.card, border: `1px solid ${V.border}`,
              borderRadius: V.radius, padding: "40px 36px",
            }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontFamily: V.heading, fontSize: "1.5rem", fontWeight: 800, color: V.bright, marginBottom: 12 }}>Заявка отправлена</div>
                  <p style={{ color: V.dim, fontSize: "0.9rem" }}>Мы свяжемся с вами в ближайшее время.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ fontSize: "0.85rem", color: V.dim, marginBottom: 28 }}>Заполните форму и мы вернёмся к вам.</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <label style={{ fontSize: "0.7rem", color: V.muted, marginBottom: 6, display: "block", letterSpacing: "0.05em", textTransform: "uppercase" }}>Имя</label>
                      <input style={inputStyle} placeholder="Как вас зовут" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.7rem", color: V.muted, marginBottom: 6, display: "block", letterSpacing: "0.05em", textTransform: "uppercase" }}>Контакт</label>
                      <input style={inputStyle} placeholder="Телефон или email" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.7rem", color: V.muted, marginBottom: 6, display: "block", letterSpacing: "0.05em", textTransform: "uppercase" }}>О проекте</label>
                      <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} placeholder="Расскажите кратко о задаче" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <button type="submit" disabled={sending} style={{
                      background: V.bright, color: V.bg,
                      padding: "14px 32px", borderRadius: 100, border: "none",
                      fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                      transition: "all .3s", fontFamily: V.body,
                      letterSpacing: "0.02em",
                      opacity: sending ? 0.6 : 1,
                    }}>{sending ? "Отправляем..." : "ОТПРАВИТЬ ЗАЯВКУ"}</button>
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
    <footer style={{ padding: "36px 0", borderTop: `1px solid ${V.divider}`, position: "relative", zIndex: 1 }}>
      <div style={{ ...container, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 900, fontSize: "0.85rem", color: V.dim, letterSpacing: "-0.03em" }}>
          BANKAI<span style={{ color: V.accent, opacity: 0.5 }}>.</span>
        </div>
        <div style={{ fontSize: "0.72rem", color: V.muted }}>
          © 2026 Bankai Agency
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      <div style={{
        background: V.bg, color: V.text, minHeight: "100vh",
        fontFamily: V.body, overflowX: "hidden",
      }}>
        <ComingSoonBanner />
        <Nav />
        <Hero />
        <Marquee />
        <MainServices />
        <Divider />
        <OtherServices />
        <Divider />
        <Process />
        <Divider />
        <Statement />
        <Divider />
        <ContactForm />
        <Footer />
      </div>
    </>
  );
}
