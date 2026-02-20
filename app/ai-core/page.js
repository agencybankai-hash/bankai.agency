"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ───── design tokens ───── */
const V = {
  bg: "#06060B",
  card: "#0E0E16",
  cardHover: "#14141E",
  text: "#E8E6F0",
  dim: "#7A7790",
  bright: "#FFFFFF",
  accent: "#6EE7B7",
  accent2: "#34D399",
  accentDim: "rgba(110,231,183,0.12)",
  accentGlow: "rgba(110,231,183,0.35)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.12)",
  orange: "#F59E0B",
  orangeDim: "rgba(245,158,11,0.12)",
  border: "rgba(255,255,255,0.05)",
  borderHover: "rgba(255,255,255,0.1)",
  radius: 20,
  radiusSm: 12,
  heading: "'Unbounded', cursive",
};

/* ───── global CSS keyframes ───── */
const globalCSS = `
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes pulseGlow { 0%,100%{opacity:.6} 50%{opacity:1} }
@keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes borderGlow { 0%,100%{border-color:rgba(110,231,183,0.08)} 50%{border-color:rgba(110,231,183,0.2)} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes pulse2 { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.5);opacity:0} }
* { scrollbar-width: thin; scrollbar-color: rgba(110,231,183,0.2) transparent; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(110,231,183,0.2); border-radius: 3px; }
`;

/* ───── scroll reveal hook ───── */
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setVisible(true), delay);
          } else {
            setVisible(true);
          }
          obs.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: "all .7s cubic-bezier(.16,1,.3,1)",
    },
  };
}

function Reveal({ children, style: extra, delay = 0, tag: Tag = "div", ...props }) {
  const r = useReveal(delay);
  return <Tag ref={r.ref} style={{ ...r.style, ...extra }} {...props}>{children}</Tag>;
}

/* ───── animated counter ───── */
function AnimCounter({ text }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const match = text.match(/[\d,.]+/);
        if (match) {
          const target = parseFloat(match[0].replace(/,/g, ""));
          const prefix = text.slice(0, text.indexOf(match[0]));
          const suffix = text.slice(text.indexOf(match[0]) + match[0].length);
          const hasComma = match[0].includes(",");
          let start = 0;
          const dur = 1500;
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min((now - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            const val = start + (target - start) * ease;
            const formatted = hasComma ? Math.round(val).toLocaleString("en-US") : match[0].includes(".") ? val.toFixed(1) : Math.round(val).toString();
            setDisplay(prefix + formatted + suffix);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [text]);
  return <span ref={ref}>{display}</span>;
}

/* ───── card with glow border ───── */
function GlowCard({ children, style, glowColor = V.accent, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: V.card,
        border: `1px solid ${hover ? `${glowColor}33` : V.border}`,
        borderRadius: V.radius,
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
        position: "relative",
        overflow: "hidden",
        ...(hover ? { transform: "translateY(-4px)", boxShadow: `0 20px 60px -15px ${glowColor}15` } : {}),
        ...style,
      }}
      {...props}
    >
      {/* top glow line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${glowColor}${hover ? "60" : "15"}, transparent)`,
        transition: "all .4s",
      }} />
      {children}
    </div>
  );
}

/* ───── shared styles ───── */
const container = { maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" };
const sectionLabel = {
  fontFamily: V.heading, fontSize: "0.7rem", fontWeight: 700,
  letterSpacing: "0.2em", textTransform: "uppercase", color: V.accent, marginBottom: 16,
  display: "inline-flex", alignItems: "center", gap: 10,
};
const sectionTitle = {
  fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800,
  lineHeight: 1.1, letterSpacing: "-0.03em", color: V.bright, maxWidth: 750, marginBottom: 40,
};

/* ═══════════════════════ GRID BACKGROUND ═══════════════════════ */
function GridBg() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none", opacity: 0.4,
    }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════ AURORA BG ═══════════════════════ */
function AuroraBg() {
  return (
    <div style={{ position: "absolute", top: -300, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 1400, height: 900, pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", top: 0, left: "10%", width: 500, height: 500,
        background: "radial-gradient(ellipse, rgba(110,231,183,0.08) 0%, transparent 70%)",
        filter: "blur(80px)", animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: 100, right: "5%", width: 400, height: 400,
        background: "radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)",
        filter: "blur(60px)", animation: "float 10s ease-in-out infinite 2s",
      }} />
      <div style={{
        position: "absolute", top: 200, left: "40%", width: 300, height: 300,
        background: "radial-gradient(ellipse, rgba(110,231,183,0.04) 0%, transparent 70%)",
        filter: "blur(50px)", animation: "float 12s ease-in-out infinite 4s",
      }} />
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
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "14px 0" : "22px 0",
      background: scrolled ? "rgba(6,6,11,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
      borderBottom: scrolled ? `1px solid ${V.border}` : "1px solid transparent",
      transition: "all .4s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{ ...container, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 800, fontSize: "1.2rem", color: V.bright, letterSpacing: "-0.03em" }}>
          AI<span style={{ color: V.accent }}>.</span>ЯДРО
        </div>
        <a href="#pricing" style={{
          background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`,
          color: V.bg, padding: "10px 26px", borderRadius: 100,
          fontWeight: 700, fontSize: "0.85rem", textDecoration: "none",
          transition: "all .3s", letterSpacing: "-0.01em",
          boxShadow: `0 0 20px ${V.accentGlow}`,
        }}>Получить аудит →</a>
      </div>
    </nav>
  );
}

/* ═══════════════════════ HERO ═══════════════════════ */
function Hero() {
  return (
    <section style={{ padding: "160px 0 100px", position: "relative", overflow: "hidden" }}>
      <AuroraBg />
      {/* decorative ring */}
      <div style={{
        position: "absolute", top: "50%", right: "-10%", width: 500, height: 500,
        border: `1px solid ${V.border}`, borderRadius: "50%",
        transform: "translateY(-50%)", opacity: 0.3,
        animation: "spinSlow 120s linear infinite",
      }}>
        <div style={{
          position: "absolute", top: -4, left: "50%", width: 8, height: 8,
          background: V.accent, borderRadius: "50%",
          boxShadow: `0 0 20px ${V.accentGlow}`,
        }} />
      </div>
      <div style={{ ...container, zIndex: 1, position: "relative" }}>
        {/* badge */}
        <Reveal>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "8px 20px", background: "rgba(110,231,183,0.06)",
            border: "1px solid rgba(110,231,183,0.15)", borderRadius: 100,
            fontSize: "0.8rem", fontWeight: 600, color: V.accent, marginBottom: 40,
            backdropFilter: "blur(10px)",
          }}>
            <span style={{
              width: 7, height: 7, background: V.accent, borderRadius: "50%",
              display: "inline-block", position: "relative",
            }}>
              <span style={{
                position: "absolute", inset: -3, borderRadius: "50%",
                border: `2px solid ${V.accent}`, animation: "pulse2 2s ease-out infinite",
              }} />
            </span>
            Внедрение AI-систем для бизнеса
          </div>
        </Reveal>

        {/* heading */}
        <Reveal delay={100}>
          <h1 style={{
            fontFamily: V.heading, fontSize: "clamp(2.8rem, 6vw, 4.8rem)",
            fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em",
            color: V.bright, maxWidth: 950, marginBottom: 32,
          }}>
            Операционная система{" "}
            <span style={{
              background: `linear-gradient(135deg, ${V.accent}, ${V.accent2}, #A7F3D0)`,
              backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>вашего бизнеса</span>{" "}
            на базе ИИ
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p style={{ fontSize: "1.25rem", color: V.dim, maxWidth: 640, lineHeight: 1.7, marginBottom: 52, fontWeight: 400 }}>
            Внедряем AI-агентов, которые берут на себя рутину, аналитику и часть решений.
            Вы получаете управляемый бизнес без раздутого штата.
          </p>
        </Reveal>

        {/* buttons */}
        <Reveal delay={300}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#pricing" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`,
              color: V.bg, padding: "18px 40px", borderRadius: 100,
              fontWeight: 700, fontSize: "1.05rem", textDecoration: "none", transition: "all .3s",
              boxShadow: `0 0 40px ${V.accentGlow}, 0 8px 32px rgba(0,0,0,0.3)`,
            }}>Заказать аудит — $2 500 →</a>
            <a href="#solution" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.03)", color: V.text, padding: "18px 40px", borderRadius: 100,
              fontWeight: 600, fontSize: "1.05rem", textDecoration: "none",
              border: `1px solid ${V.borderHover}`, transition: "all .3s",
              backdropFilter: "blur(10px)",
            }}>Как это работает</a>
          </div>
        </Reveal>

        {/* stats */}
        <Reveal delay={400}>
          <div style={{
            display: "flex", gap: 56, marginTop: 80, paddingTop: 48,
            borderTop: `1px solid ${V.border}`, flexWrap: "wrap",
          }}>
            {[
              { val: "20–40", unit: "ч/нед", label: "экономия времени команды" },
              { val: "3–6", unit: "мес", label: "окупаемость внедрения" },
              { val: "2–3", unit: "FTE", label: "замена штатных единиц" },
            ].map((s, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div style={{ fontFamily: V.heading, fontSize: "2.2rem", fontWeight: 800, color: V.bright, letterSpacing: "-0.03em" }}>
                  {s.val} <span style={{ color: V.accent, fontSize: "1.2rem" }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: V.dim, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════ MARQUEE DIVIDER ═══════════════════════ */
function Marquee() {
  const items = ["AI-АВТОМАТИЗАЦИЯ", "ОПЕРАЦИОННОЕ УПРАВЛЕНИЕ", "MACHINE LEARNING", "AI-АГЕНТЫ", "БИЗНЕС-АНАЛИТИКА", "CRM-ИНТЕГРАЦИЯ", "ПРОГНОЗИРОВАНИЕ"];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${V.border}`, borderBottom: `1px solid ${V.border}`, padding: "18px 0", position: "relative", zIndex: 1 }}>
      <div style={{
        display: "flex", gap: 48, animation: "shimmer 20s linear infinite",
        whiteSpace: "nowrap", width: "max-content",
      }}>
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} style={{
            fontFamily: V.heading, fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: i % 2 === 0 ? V.dim : V.accent, opacity: 0.5,
          }}>{t}</span>
        ))}
      </div>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(0)} 100%{transform:translateX(-33.33%)} }
      `}</style>
    </div>
  );
}

/* ═══════════════════════ PROBLEM ═══════════════════════ */
function Problem() {
  const cards = [
    { icon: "⏱", num: "01", title: "Всё завязано на вас", text: "Вы вручную контролируете каждый процесс. Без вашего участия ничего не движется. Масштабирование невозможно, пока вы — узкое горлышко." },
    { icon: "📊", num: "02", title: "Нет прозрачности", text: "Данные разбросаны между CRM, таблицами и головами сотрудников. Вы принимаете решения на ощущениях, а не на цифрах." },
    { icon: "💸", num: "03", title: "Дорогие сотрудники, медленные процессы", text: "Нанять operations director — $150K/год. Нанять аналитика — ещё $100K. А рутина по-прежнему отнимает половину рабочего дня." },
  ];
  return (
    <section style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal><div style={sectionLabel}><span style={{ width: 20, height: 1, background: V.accent, display: "inline-block" }} /> Проблема</div></Reveal>
        <Reveal delay={80}><h2 style={sectionTitle}>Ваш бизнес растёт, но операционка тянет вас назад</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {cards.map((c, i) => (
            <Reveal key={i} delay={i * 100}>
              <GlowCard glowColor={V.red} style={{ padding: "40px 36px", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div style={{
                    width: 52, height: 52, background: V.redDim, borderRadius: 14,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem",
                  }}>{c.icon}</div>
                  <span style={{ fontFamily: V.heading, fontSize: "2.5rem", fontWeight: 900, color: "rgba(239,68,68,0.06)", lineHeight: 1 }}>{c.num}</span>
                </div>
                <h3 style={{ fontFamily: V.heading, fontSize: "1.1rem", fontWeight: 700, color: V.bright, marginBottom: 14, letterSpacing: "-0.02em" }}>{c.title}</h3>
                <p style={{ fontSize: "0.9rem", color: V.dim, lineHeight: 1.75 }}>{c.text}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ SOLUTION ═══════════════════════ */
function Solution() {
  const layers = [
    {
      num: "01", label: "Операционный", title: "AI делает рутину за команду",
      desc: "Агенты, которые работают 24/7 и не ошибаются. Они обрабатывают входящие, квалифицируют лиды, создают задачи и генерируют отчёты.",
      features: [
        { bold: "Автообработка заявок", text: " — AI квалифицирует и маршрутизирует лиды за секунды" },
        { bold: "Транскрибация → задачи", text: " — звонки и встречи превращаются в action-plan" },
        { bold: "Авто-отчёты", text: " — KPI-отчёты генерируются и приходят в мессенджер" },
      ],
    },
    {
      num: "02", label: "Тактический", title: "AI анализирует и рекомендует",
      desc: "Система следит за метриками, рекламой и конкурентами. Вы получаете готовые рекомендации к действию.",
      features: [
        { bold: "KPI-алерты", text: " — уведомления при отклонении от нормы с объяснением" },
        { bold: "Анализ рекламы", text: " — AI говорит что масштабировать, а что остановить" },
        { bold: "Конкурентная разведка", text: " — мониторинг конкурентов и их стратегий" },
      ],
    },
    {
      num: "03", label: "Стратегический", title: "AI как ваш цифровой советник",
      desc: "Полная картина бизнеса в одном дашборде. Прогнозы, сценарии, рекомендации для решений.",
      features: [
        { bold: "Живой дашборд", text: " — ключевые метрики в реальном времени" },
        { bold: "Прогнозирование", text: " — модели на основе исторических данных" },
        { bold: "Сценарное моделирование", text: " — «что если» анализ перед решением" },
      ],
    },
  ];
  return (
    <section id="solution" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      {/* subtle bg glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, background: "radial-gradient(circle, rgba(110,231,183,0.025) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={container}>
        <Reveal><div style={sectionLabel}><span style={{ width: 20, height: 1, background: V.accent, display: "inline-block" }} /> Решение</div></Reveal>
        <Reveal delay={80}><h2 style={sectionTitle}>Три слоя AI-ядра, которые закрывают операционку</h2></Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {layers.map((l, i) => (
            <Reveal key={i} delay={i * 120}>
              <GlowCard style={{
                padding: "48px 52px", display: "grid", gridTemplateColumns: "1fr 1.5fr",
                gap: 52, alignItems: "center",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <span style={{
                      fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 800,
                      color: V.bg, background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`,
                      padding: "4px 12px", borderRadius: 100, letterSpacing: "0.08em",
                    }}>СЛОЙ {l.num}</span>
                    <span style={{ fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 600, color: V.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l.label}</span>
                  </div>
                  <h3 style={{ fontFamily: V.heading, fontSize: "1.5rem", fontWeight: 800, color: V.bright, marginBottom: 16, letterSpacing: "-0.03em", lineHeight: 1.2 }}>{l.title}</h3>
                  <p style={{ fontSize: "0.93rem", color: V.dim, lineHeight: 1.75 }}>{l.desc}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {l.features.map((f, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "18px 22px", background: "rgba(255,255,255,0.02)",
                      borderRadius: V.radiusSm, border: `1px solid ${V.border}`, transition: "all .3s",
                    }}>
                      <div style={{
                        width: 28, height: 28, minWidth: 28, background: V.accentDim,
                        borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                        color: V.accent, fontSize: "0.75rem", fontWeight: 800,
                      }}>→</div>
                      <div style={{ fontSize: "0.87rem", color: V.text, lineHeight: 1.55 }}>
                        <strong style={{ color: V.bright, fontWeight: 700 }}>{f.bold}</strong>{f.text}
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ RESULTS ═══════════════════════ */
function Results() {
  const items = [
    { val: "–40%", label: "времени на рутинные операции", color: V.accent },
    { val: "×3", label: "скорость обработки заявок", color: V.accent2 },
    { val: "–$150K", label: "экономия на штате в год", color: V.accent },
    { val: "24/7", label: "система работает без выходных", color: V.accent2 },
  ];
  return (
    <section style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal><div style={sectionLabel}><span style={{ width: 20, height: 1, background: V.accent, display: "inline-block" }} /> Результаты</div></Reveal>
        <Reveal delay={80}><h2 style={sectionTitle}>Что получает бизнес после внедрения</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {items.map((r, i) => (
            <Reveal key={i} delay={i * 80}>
              <GlowCard style={{ padding: "44px 28px", textAlign: "center", height: "100%" }}>
                <div style={{
                  fontFamily: V.heading, fontSize: "2.8rem", fontWeight: 900, color: r.color,
                  lineHeight: 1, marginBottom: 16, letterSpacing: "-0.03em",
                }}><AnimCounter text={r.val} /></div>
                <div style={{ fontSize: "0.88rem", color: V.dim, lineHeight: 1.5 }}>{r.label}</div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ PROCESS ═══════════════════════ */
function Process() {
  const steps = [
    { num: "01", dur: "1–2 недели", title: "Аудит и стратегия", text: "Изучаем процессы, находим узкие места, проектируем архитектуру AI-системы с ROI-прогнозом." },
    { num: "02", dur: "3–4 недели", title: "Разработка и настройка", text: "Создаём AI-агентов под ваши задачи. Интегрируем с CRM, мессенджерами, рекламными кабинетами." },
    { num: "03", dur: "1–2 недели", title: "Запуск и калибровка", text: "Запускаем систему в работу, тестируем на реальных данных, калибруем точность агентов." },
    { num: "04", dur: "Постоянно", title: "Поддержка и развитие", text: "Мониторим, добавляем новых агентов, масштабируем систему с ростом бизнеса." },
  ];
  return (
    <section style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal><div style={sectionLabel}><span style={{ width: 20, height: 1, background: V.accent, display: "inline-block" }} /> Процесс</div></Reveal>
        <Reveal delay={80}><h2 style={sectionTitle}>Как мы внедряем AI-ядро</h2></Reveal>
        {/* horizontal timeline */}
        <div style={{ position: "relative" }}>
          {/* connector line */}
          <div style={{ position: "absolute", top: 30, left: "6%", right: "6%", height: 2, background: `linear-gradient(90deg, ${V.accent}40, ${V.accent}20)`, zIndex: 0 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, position: "relative", zIndex: 1 }}>
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 120}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  {/* timeline dot */}
                  <div style={{
                    width: 60, height: 60, borderRadius: "50%",
                    background: V.card, border: `2px solid ${V.accent}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: V.heading, fontSize: "0.85rem", fontWeight: 800, color: V.accent,
                    marginBottom: 24, position: "relative",
                    boxShadow: `0 0 30px ${V.accentGlow}`,
                  }}>
                    {s.num}
                  </div>
                  <GlowCard style={{ padding: "32px 24px", width: "100%", textAlign: "center" }}>
                    <div style={{
                      display: "inline-block", fontSize: "0.72rem", fontWeight: 700, color: V.accent,
                      background: V.accentDim, padding: "4px 14px", borderRadius: 100, marginBottom: 16,
                    }}>{s.dur}</div>
                    <h3 style={{ fontFamily: V.heading, fontSize: "0.95rem", fontWeight: 700, color: V.bright, marginBottom: 12, letterSpacing: "-0.02em" }}>{s.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: V.dim, lineHeight: 1.7 }}>{s.text}</p>
                  </GlowCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ CASE STUDY ═══════════════════════ */
function CaseStudy() {
  return (
    <section style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal><div style={sectionLabel}><span style={{ width: 20, height: 1, background: V.orange, display: "inline-block" }} /> Кейс</div></Reveal>
        <Reveal delay={80}><h2 style={sectionTitle}>Результаты, которые говорят за нас</h2></Reveal>
        <Reveal delay={160}>
          <GlowCard glowColor={V.orange} style={{
            padding: "60px 56px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 60, alignItems: "center",
          }}>
            <div>
              <div style={{
                fontSize: "0.72rem", fontWeight: 800, color: V.orange, background: V.orangeDim,
                display: "inline-block", padding: "5px 16px", borderRadius: 100, marginBottom: 24,
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>Мувинговая компания • США</div>
              <h3 style={{ fontFamily: V.heading, fontSize: "1.7rem", fontWeight: 800, color: V.bright, marginBottom: 18, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                От ручного хаоса к системе, генерирующей $14.6M
              </h3>
              <p style={{ fontSize: "0.93rem", color: V.dim, lineHeight: 1.75, marginBottom: 36 }}>
                Комплексное внедрение: сайт, перформанс-маркетинг, CRM, автоматизация обработки заявок и аналитики.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { val: "$14.6M", label: "выручка" },
                  { val: "10,235", label: "заказов" },
                  { val: "$400K", label: "рекламный бюджет" },
                  { val: "40→26", label: "позиция в SEO" },
                ].map((m, i) => (
                  <div key={i} style={{
                    padding: "18px 20px", background: "rgba(255,255,255,0.02)",
                    borderRadius: V.radiusSm, border: `1px solid ${V.border}`,
                  }}>
                    <div style={{ fontFamily: V.heading, fontSize: "1.5rem", fontWeight: 800, color: V.accent, letterSpacing: "-0.02em" }}>
                      <AnimCounter text={m.val} />
                    </div>
                    <div style={{ fontSize: "0.78rem", color: V.dim, marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "relative", paddingLeft: 32 }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                background: `linear-gradient(180deg, ${V.accent}, ${V.accent2})`, borderRadius: 2,
              }} />
              <div style={{
                fontFamily: V.heading, fontSize: "4rem", lineHeight: 1, color: "rgba(110,231,183,0.06)",
                position: "absolute", top: -10, right: 0, fontWeight: 900,
              }}>"</div>
              <p style={{ fontSize: "1.15rem", color: V.text, lineHeight: 1.75, fontStyle: "italic", marginBottom: 24, marginTop: 8 }}>
                Мы передали рутину системе и наконец сфокусировались на росте. Раньше я тратил 4 часа в день на проверку заявок — сейчас это делает AI, а я смотрю дашборд раз в день.
              </p>
              <div style={{ fontSize: "0.88rem", color: V.dim }}>
                <strong style={{ color: V.bright, fontWeight: 700 }}>Основатель компании</strong><br />SOS Moving, New York
              </div>
            </div>
          </GlowCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════ PRICING ═══════════════════════ */
function Pricing() {
  const plans = [
    {
      badge: null, title: "Аудит + стратегия", price: "$2 500", note: "разовый платёж • 1–2 недели",
      features: ["Полный аудит текущих процессов", "Карта узких мест и потерь", "Архитектура AI-системы под ваш бизнес", "ROI-прогноз с конкретными цифрами", "Пошаговый план внедрения"],
      cta: "Заказать аудит →", featured: false,
    },
    {
      badge: "Популярный выбор", title: "Внедрение AI-ядра", price: "$15–25K", note: "зависит от масштаба • 6–8 недель",
      features: ["Всё из аудита включено", "Разработка и настройка AI-агентов", "Интеграция с вашими системами", "Обучение команды", "30 дней поддержки после запуска"],
      cta: "Обсудить проект →", featured: true,
    },
    {
      badge: null, title: "Полная система", price: "$25–50K", note: "+ $2–5K/мес поддержка",
      features: ["Все три слоя системы", "Кастомные дашборды и прогнозы", "Постоянная калибровка и оптимизация", "Приоритетная поддержка", "Масштабирование по мере роста"],
      cta: "Обсудить проект →", featured: false,
    },
  ];
  return (
    <section id="pricing" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div style={{ position: "absolute", bottom: -200, left: "50%", transform: "translateX(-50%)", width: 700, height: 700, background: "radial-gradient(circle, rgba(110,231,183,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={container}>
        <Reveal><div style={sectionLabel}><span style={{ width: 20, height: 1, background: V.accent, display: "inline-block" }} /> Тарифы</div></Reveal>
        <Reveal delay={80}><h2 style={sectionTitle}>Выберите точку входа</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {plans.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <GlowCard style={{
                padding: 44, height: "100%", display: "flex", flexDirection: "column",
                ...(p.featured ? {
                  background: `linear-gradient(180deg, rgba(110,231,183,0.04), ${V.card})`,
                  border: `1px solid rgba(110,231,183,0.2)`,
                  boxShadow: `0 0 60px rgba(110,231,183,0.08)`,
                } : {}),
              }}>
                {p.badge && (
                  <div style={{
                    display: "inline-block", fontSize: "0.68rem", fontWeight: 800, color: V.bg,
                    background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`,
                    padding: "5px 16px", borderRadius: 100, marginBottom: 20,
                    letterSpacing: "0.06em", textTransform: "uppercase", alignSelf: "flex-start",
                  }}>{p.badge}</div>
                )}
                <h3 style={{ fontFamily: V.heading, fontSize: "1.15rem", fontWeight: 700, color: V.bright, marginBottom: 12 }}>{p.title}</h3>
                <div style={{ fontFamily: V.heading, fontSize: "2.4rem", fontWeight: 900, color: V.bright, marginBottom: 8, letterSpacing: "-0.03em" }}>{p.price}</div>
                <div style={{ fontSize: "0.82rem", color: V.dim, marginBottom: 32 }}>{p.note}</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, marginBottom: 36, flex: 1 }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: "0.88rem", color: V.text, lineHeight: 1.5 }}>
                      <span style={{ color: V.accent, fontWeight: 800, minWidth: 18, fontSize: "0.8rem" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" style={{
                  display: "block", textAlign: "center", padding: "15px 28px", borderRadius: 100,
                  fontWeight: 700, fontSize: "0.92rem", textDecoration: "none", transition: "all .3s",
                  ...(p.featured
                    ? { background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`, color: V.bg, boxShadow: `0 0 30px ${V.accentGlow}` }
                    : { background: "transparent", border: `1px solid ${V.borderHover}`, color: V.text }),
                }}>{p.cta}</a>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ FAQ ═══════════════════════ */
function FAQ() {
  const items = [
    { q: "Какие системы вы интегрируете?", a: "HubSpot, Salesforce, Google Ads, Meta Ads, CallRail, Slack, Telegram, WhatsApp и любые системы с API." },
    { q: "Сколько времени занимает внедрение?", a: "Аудит — 1–2 недели. Внедрение ядра — 6–8 недель. Полная система — 8–12 недель. Первые результаты на 3-й неделе." },
    { q: "Что если AI ошибётся?", a: "Human-in-the-loop для критичных процессов: AI предлагает, человек подтверждает. Калибруем на реальных данных." },
    { q: "Можно ли начать с одного агента?", a: "Да. Аудит покажет, какой агент даст максимальный ROI. Масштабируйте по мере роста." },
    { q: "Нужен ли технический специалист?", a: "Нет. Мы берём всё на себя. Ваша команда работает через привычные интерфейсы." },
    { q: "Какая гарантия?", a: "Если после аудита нет конкретного ROI и плана — вернём деньги. Скоуп и KPI фиксируем до начала." },
  ];
  return (
    <section style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal><div style={sectionLabel}><span style={{ width: 20, height: 1, background: V.accent, display: "inline-block" }} /> FAQ</div></Reveal>
        <Reveal delay={80}><h2 style={sectionTitle}>Ответы на главные вопросы</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {items.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <GlowCard style={{ padding: "32px 36px", height: "100%" }}>
                <h3 style={{ fontFamily: V.heading, fontSize: "0.88rem", fontWeight: 700, color: V.bright, marginBottom: 12, letterSpacing: "-0.01em" }}>{f.q}</h3>
                <p style={{ fontSize: "0.87rem", color: V.dim, lineHeight: 1.75 }}>{f.a}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ FINAL CTA ═══════════════════════ */
function FinalCTA() {
  return (
    <section id="contact" style={{ padding: "100px 0 140px", textAlign: "center", position: "relative", zIndex: 1 }}>
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: 1000, height: 600,
        background: "radial-gradient(ellipse, rgba(110,231,183,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={container}>
        <Reveal>
          <h2 style={{
            fontFamily: V.heading, fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", fontWeight: 900,
            color: V.bright, maxWidth: 750, margin: "0 auto 24px", letterSpacing: "-0.04em", lineHeight: 1.1,
          }}>
            Готовы перестать быть{" "}
            <span style={{
              background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>узким горлышком</span>{" "}
            своего бизнеса?
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p style={{ fontSize: "1.15rem", color: V.dim, maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Начните с аудита за $2,500 и получите конкретный план с цифрами ROI. Без обязательств.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`,
            color: V.bg, padding: "20px 52px", borderRadius: 100,
            fontWeight: 800, fontSize: "1.15rem", textDecoration: "none", transition: "all .3s",
            boxShadow: `0 0 50px ${V.accentGlow}, 0 12px 40px rgba(0,0,0,0.4)`,
            letterSpacing: "-0.01em",
          }}>
            Записаться на discovery-звонок →
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════ FOOTER ═══════════════════════ */
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${V.border}`, padding: "44px 0", position: "relative", zIndex: 1 }}>
      <div style={{ ...container, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 800, fontSize: "1.2rem", color: V.bright }}>
          AI<span style={{ color: V.accent }}>.</span>ЯДРО
        </div>
        <p style={{ fontSize: "0.8rem", color: V.dim }}>© 2026 Bankai.Agency. Все права защищены.</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function Home() {
  return (
    <>
      <style>{globalCSS}</style>
      <GridBg />
      <Nav />
      <Hero />
      <Marquee />
      <Problem />
      <Solution />
      <Results />
      <Process />
      <CaseStudy />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
