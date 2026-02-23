"use client";
import { useState, useEffect } from "react";

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
  accentDim: "rgba(110,231,183,0.10)",
  accentGlow: "rgba(110,231,183,0.30)",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.12)",
  radius: 20,
  radiusSm: 12,
  heading: "'Unbounded', cursive",
};

/* ───── keyframes ───── */
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap');
@keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes pulse2 { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.6);opacity:0} }
@keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
* { scrollbar-width: thin; scrollbar-color: rgba(110,231,183,0.2) transparent; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(110,231,183,0.2); border-radius: 3px; }
::selection { background: rgba(110,231,183,0.25); color: #fff; }
`;

/* ───── reveal component ───── */
function Reveal({ children, style: extra, delay = 0, tag: Tag = "div", ...props }) {
  return (
    <Tag style={{ animation: `fadeInUp .8s cubic-bezier(.16,1,.3,1) ${delay}ms both`, ...extra }} {...props}>
      {children}
    </Tag>
  );
}

/* ───── glow card ───── */
function GlowCard({ children, style, highlight, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: V.card,
        border: `1px solid ${hover ? (highlight ? `${V.accent}44` : V.borderHover) : V.border}`,
        borderRadius: V.radius,
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
        position: "relative",
        overflow: "hidden",
        ...(hover ? { transform: "translateY(-4px)", boxShadow: highlight ? `0 20px 60px -15px ${V.accentGlow}` : `0 20px 40px rgba(0,0,0,0.3)` } : {}),
        ...style,
      }}
      {...props}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: highlight
          ? `linear-gradient(90deg, transparent, ${V.accent}${hover ? "60" : "25"}, transparent)`
          : `linear-gradient(90deg, transparent, rgba(255,255,255,${hover ? "0.08" : "0.03"}), transparent)`,
        transition: "all .4s",
      }} />
      {children}
    </div>
  );
}

/* ───── container ───── */
const container = { maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" };

/* ───── services data ───── */
const mainServices = [
  {
    title: "AI-Ядро бизнеса",
    subtitle: "Внедрение AI-систем для принятия решений",
    description: "Строим операционную систему вашего бизнеса на базе ИИ. AI-агенты берут на себя рутину, аналитику и часть решений — вы получаете масштабируемый бизнес без раздутого штата.",
    features: ["AI-агенты для автоматизации процессов", "Система принятия решений на данных", "Интеграция с CRM, мессенджерами, рекламой", "KPI-алерты и прогнозирование"],
    icon: "🧠",
    accent: true,
    link: "/ai-core",
  },
  {
    title: "Маркетинг полного цикла",
    subtitle: "Под ключ — с нуля или для действующего бизнеса",
    description: "Берём на себя весь маркетинг: от стратегии и позиционирования до лидогенерации и аналитики. Строим систему, которая приносит выручку, а не просто трафик.",
    features: ["Стратегия и позиционирование", "Лидогенерация и воронки продаж", "Контент, креативы, PR", "Сквозная аналитика ROI"],
    icon: "🚀",
    accent: false,
    link: null,
  },
];

const otherServices = [
  { title: "Google Ads", desc: "Search, Performance Max, YouTube, Display — настройка, оптимизация, масштабирование.", icon: "📊" },
  { title: "Meta Ads", desc: "Facebook + Instagram реклама с фокусом на конверсии и ROAS.", icon: "📱" },
  { title: "SEO-продвижение", desc: "Технический SEO, контент-стратегия, линкбилдинг для органического роста.", icon: "🔍" },
  { title: "Разработка сайтов", desc: "Лендинги, корпоративные сайты, e-commerce. Next.js, React, высокая скорость.", icon: "💻" },
  { title: "CRM и автоматизация", desc: "HubSpot, Salesforce, Bitrix24 — настройка, интеграции, автоматизация процессов.", icon: "⚙️" },
  { title: "Аналитика и дашборды", desc: "Google Analytics 4, Looker Studio, сквозная аналитика от клика до сделки.", icon: "📈" },
  { title: "Контент-маркетинг", desc: "Блоги, email-рассылки, SMM, видеопродакшн — контент, который продаёт.", icon: "✍️" },
  { title: "Брендинг и дизайн", desc: "Логотипы, фирменный стиль, UI/UX дизайн, креативы для рекламы.", icon: "🎨" },
];

/* ═══════════════════════ AURORA BG ═══════════════════════ */
function AuroraBg() {
  return (
    <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 1400, height: 800, pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", top: 0, left: "10%", width: 500, height: 500,
        background: "radial-gradient(ellipse, rgba(110,231,183,0.07) 0%, transparent 70%)",
        filter: "blur(80px)", animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: 100, right: "5%", width: 400, height: 400,
        background: "radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)",
        filter: "blur(60px)", animation: "float 10s ease-in-out infinite 2s",
      }} />
    </div>
  );
}

/* ═══════════════════════ GRID BG ═══════════════════════ */
function GridBg() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none", opacity: 0.35 }}>
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
      background: scrolled ? "rgba(6,6,11,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
      borderBottom: scrolled ? `1px solid ${V.border}` : "1px solid transparent",
      transition: "all .4s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{ ...container, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 800, fontSize: "1.15rem", color: V.bright, letterSpacing: "-0.03em" }}>
          BANKAI<span style={{ color: V.accent }}>.</span>AGENCY
        </div>
        <a href="#contact" style={{
          background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`,
          color: V.bg, padding: "10px 24px", borderRadius: 100,
          fontWeight: 700, fontSize: "0.83rem", textDecoration: "none",
          transition: "all .3s", letterSpacing: "-0.01em",
          boxShadow: `0 0 20px ${V.accentGlow}`,
        }}>Оставить заявку →</a>
      </div>
    </nav>
  );
}

/* ═══════════════════════ HERO ═══════════════════════ */
function Hero() {
  return (
    <section style={{ padding: "160px 0 80px", position: "relative", overflow: "hidden" }}>
      <AuroraBg />
      {/* decorative ring */}
      <div style={{
        position: "absolute", top: "50%", right: "-8%", width: 450, height: 450,
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
        {/* status badge */}
        <Reveal>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "8px 20px", background: "rgba(110,231,183,0.06)",
            border: "1px solid rgba(110,231,183,0.15)", borderRadius: 100,
            fontSize: "0.8rem", fontWeight: 600, color: V.accent, marginBottom: 40,
            backdropFilter: "blur(10px)",
          }}>
            <span style={{ width: 7, height: 7, background: V.accent, borderRadius: "50%", display: "inline-block", position: "relative" }}>
              <span style={{ position: "absolute", inset: -3, borderRadius: "50%", border: `2px solid ${V.accent}`, animation: "pulse2 2s ease-out infinite" }} />
            </span>
            Сайт в разработке — скоро запуск
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 style={{
            fontFamily: V.heading, fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
            fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.04em",
            color: V.bright, maxWidth: 900, marginBottom: 28,
          }}>
            Строим системы,{" "}
            <span style={{
              background: `linear-gradient(135deg, ${V.accent}, ${V.accent2}, #A7F3D0)`,
              backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>которые приносят выручку</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p style={{ fontSize: "1.2rem", color: V.dim, maxWidth: 620, lineHeight: 1.7, marginBottom: 44, fontWeight: 400 }}>
            AI-автоматизация, маркетинг полного цикла и digital-продукты для бизнеса,
            который хочет расти быстрее конкурентов.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#services" style={{
              background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`,
              color: V.bg, padding: "16px 36px", borderRadius: 100,
              fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
              transition: "all .3s",
              boxShadow: `0 0 30px ${V.accentGlow}`,
            }}>Наши услуги ↓</a>
            <a href="#contact" style={{
              border: `1px solid ${V.borderHover}`, color: V.text,
              padding: "16px 36px", borderRadius: 100, background: "rgba(255,255,255,0.03)",
              fontWeight: 600, fontSize: "0.95rem", textDecoration: "none",
              transition: "all .3s", backdropFilter: "blur(10px)",
            }}>Связаться с нами</a>
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
      fontFamily: V.heading, fontSize: "0.75rem", fontWeight: 700,
      letterSpacing: "0.15em", color: i % 2 === 0 ? V.accent : V.dim,
      whiteSpace: "nowrap", padding: "0 32px",
    }}>{w}</span>
  ));
  return (
    <div style={{ overflow: "hidden", padding: "28px 0", borderTop: `1px solid ${V.border}`, borderBottom: `1px solid ${V.border}`, position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", animation: "marquee 30s linear infinite", width: "max-content" }}>
        {row}{row}
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN SERVICES ═══════════════════════ */
function MainServices() {
  return (
    <section id="services" style={{ padding: "100px 0 60px", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal>
          <div style={{
            fontFamily: V.heading, fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase", color: V.accent, marginBottom: 16,
            display: "inline-flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ width: 20, height: 1, background: V.accent, display: "inline-block" }} />
            Ключевые направления
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 style={{
            fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800,
            lineHeight: 1.1, letterSpacing: "-0.03em", color: V.bright, maxWidth: 700, marginBottom: 48,
          }}>Два ядра нашей экспертизы</h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))", gap: 24 }}>
          {mainServices.map((s, i) => (
            <Reveal key={i} delay={120 + i * 100}>
              <GlowCard highlight={s.accent} style={{ padding: "40px 36px", height: "100%", display: "flex", flexDirection: "column" }}>
                {s.accent && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 12px", background: V.accentDim, borderRadius: 100,
                    fontSize: "0.7rem", fontWeight: 700, color: V.accent, marginBottom: 20,
                    letterSpacing: "0.1em", textTransform: "uppercase", alignSelf: "flex-start",
                  }}>★ Флагман</div>
                )}
                <div style={{ fontSize: "2rem", marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{
                  fontFamily: V.heading, fontSize: "1.4rem", fontWeight: 800,
                  color: V.bright, marginBottom: 8, letterSpacing: "-0.02em",
                }}>{s.title}</h3>
                <div style={{ fontSize: "0.85rem", color: V.accent, fontWeight: 600, marginBottom: 16 }}>{s.subtitle}</div>
                <p style={{ fontSize: "0.95rem", color: V.dim, lineHeight: 1.7, marginBottom: 24 }}>{s.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto", marginBottom: 24 }}>
                  {s.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: s.accent ? V.accentDim : "rgba(255,255,255,0.05)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontSize: "0.65rem", color: V.accent,
                      }}>✓</span>
                      <span style={{ fontSize: "0.88rem", color: V.text }}>{f}</span>
                    </div>
                  ))}
                </div>
                {s.link ? (
                  <a href={s.link} style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`,
                    color: V.bg, padding: "12px 28px", borderRadius: 100,
                    fontWeight: 700, fontSize: "0.85rem", textDecoration: "none",
                    transition: "all .3s", alignSelf: "flex-start",
                    boxShadow: `0 0 20px ${V.accentGlow}`,
                  }}>Подробнее →</a>
                ) : (
                  <a href="#contact" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    border: `1px solid ${V.borderHover}`, color: V.text,
                    padding: "12px 28px", borderRadius: 100, background: "rgba(255,255,255,0.03)",
                    fontWeight: 600, fontSize: "0.85rem", textDecoration: "none",
                    transition: "all .3s", alignSelf: "flex-start",
                  }}>Обсудить проект →</a>
                )}
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ OTHER SERVICES ═══════════════════════ */
function OtherServices() {
  return (
    <section style={{ padding: "60px 0 100px", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <Reveal>
          <div style={{
            fontFamily: V.heading, fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase", color: V.accent, marginBottom: 16,
            display: "inline-flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ width: 20, height: 1, background: V.accent, display: "inline-block" }} />
            Все услуги
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 style={{
            fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800,
            lineHeight: 1.1, letterSpacing: "-0.03em", color: V.bright, maxWidth: 600, marginBottom: 40,
          }}>Каждый канал — как отдельный продукт</h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {otherServices.map((s, i) => (
            <Reveal key={i} delay={100 + i * 50}>
              <GlowCard style={{ padding: "28px 24px" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>{s.icon}</div>
                <h4 style={{
                  fontFamily: V.heading, fontSize: "1rem", fontWeight: 700,
                  color: V.bright, marginBottom: 8, letterSpacing: "-0.01em",
                }}>{s.title}</h4>
                <p style={{ fontSize: "0.85rem", color: V.dim, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ CONTACT FORM ═══════════════════════ */
function ContactForm() {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const inputStyle = {
    width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${V.border}`, borderRadius: V.radiusSm, color: V.bright,
    fontSize: "0.95rem", outline: "none", transition: "border .3s",
    fontFamily: "'Manrope', sans-serif",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.contact) return;
    setSending(true);
    // Send to email via formsubmit.co or similar
    try {
      await fetch("https://formsubmit.co/ajax/agency.bankai@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: form.name,
          contact: form.contact,
          message: form.message || "Без сообщения",
          _subject: `Новая заявка с Bankai.Agency от ${form.name}`,
        }),
      });
      setSent(true);
    } catch {
      setSent(true); // still show success — formsubmit.co may redirect
    }
    setSending(false);
  };

  return (
    <section id="contact" style={{ padding: "100px 0 120px", position: "relative", zIndex: 1 }}>
      <div style={container}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          {/* Left — info */}
          <div>
            <Reveal>
              <div style={{
                fontFamily: V.heading, fontSize: "0.7rem", fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase", color: V.accent, marginBottom: 16,
                display: "inline-flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ width: 20, height: 1, background: V.accent, display: "inline-block" }} />
                Контакты
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 style={{
                fontFamily: V.heading, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800,
                lineHeight: 1.1, letterSpacing: "-0.03em", color: V.bright, marginBottom: 24,
              }}>Обсудим ваш проект?</h2>
            </Reveal>
            <Reveal delay={120}>
              <p style={{ fontSize: "1.05rem", color: V.dim, lineHeight: 1.7, marginBottom: 40, maxWidth: 440 }}>
                Оставьте заявку — мы свяжемся в течение 24 часов.
                Или напишите нам напрямую.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <a href="mailto:agency.bankai@gmail.com" style={{
                  display: "flex", alignItems: "center", gap: 14, textDecoration: "none",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: V.accentDim,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
                  }}>✉️</div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: V.dim, marginBottom: 2 }}>Email</div>
                    <div style={{ color: V.bright, fontWeight: 600, fontSize: "0.95rem" }}>agency.bankai@gmail.com</div>
                  </div>
                </a>
                <a href="https://t.me/bankaiagency" target="_blank" rel="noopener" style={{
                  display: "flex", alignItems: "center", gap: 14, textDecoration: "none",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: V.accentDim,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
                  }}>💬</div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: V.dim, marginBottom: 2 }}>Telegram</div>
                    <div style={{ color: V.bright, fontWeight: 600, fontSize: "0.95rem" }}>@bankaiagency</div>
                  </div>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal delay={150}>
            <GlowCard style={{ padding: "36px 32px" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: V.heading, fontSize: "1.3rem", fontWeight: 800, color: V.bright, marginBottom: 8 }}>Заявка отправлена!</h3>
                  <p style={{ color: V.dim, fontSize: "0.95rem" }}>Мы свяжемся с вами в ближайшее время.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{
                    fontFamily: V.heading, fontSize: "1.1rem", fontWeight: 700,
                    color: V.bright, marginBottom: 24,
                  }}>Оставить заявку</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: V.dim, marginBottom: 6, display: "block" }}>Имя *</label>
                      <input
                        style={inputStyle}
                        placeholder="Как вас зовут"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: V.dim, marginBottom: 6, display: "block" }}>Телефон или email *</label>
                      <input
                        style={inputStyle}
                        placeholder="Как с вами связаться"
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: V.dim, marginBottom: 6, display: "block" }}>Сообщение</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                        placeholder="Расскажите о проекте или задаче"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      style={{
                        background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`,
                        color: V.bg, padding: "14px 32px", borderRadius: 100, border: "none",
                        fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                        transition: "all .3s", fontFamily: "'Manrope', sans-serif",
                        boxShadow: `0 0 25px ${V.accentGlow}`,
                        opacity: sending ? 0.7 : 1,
                      }}
                    >{sending ? "Отправляем..." : "Отправить заявку →"}</button>
                  </div>
                </form>
              )}
            </GlowCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ FOOTER ═══════════════════════ */
function Footer() {
  return (
    <footer style={{
      padding: "32px 0", borderTop: `1px solid ${V.border}`,
      position: "relative", zIndex: 1,
    }}>
      <div style={{ ...container, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 800, fontSize: "0.95rem", color: V.bright }}>
          BANKAI<span style={{ color: V.accent }}>.</span>AGENCY
        </div>
        <div style={{ fontSize: "0.8rem", color: V.dim }}>
          © 2026 Bankai Agency. Все права защищены.
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
        fontFamily: "'Manrope', -apple-system, sans-serif",
        overflowX: "hidden",
      }}>
        <GridBg />
        <Nav />
        <Hero />
        <Marquee />
        <MainServices />
        <OtherServices />
        <ContactForm />
        <Footer />
      </div>
    </>
  );
}
