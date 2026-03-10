"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ───── design tokens ───── */
const V = {
  bg: "#FAF8F5",
  text: "#1A1714",
  accent: "#A01C2D",
  accentLit: "#C8354A",
  heading: "'Unbounded', sans-serif",
  body: "'Manrope', -apple-system, sans-serif",
  dark: "#0A0A0A",
  darkBg: "#0F0F0F",
};

/* ───── global CSS with animations ───── */
const globalCSS = `
/* ════ KEYFRAME ANIMATIONS ════ */
@keyframes revealUp {
  from { opacity: 0; filter: blur(12px); transform: translateY(80px); }
  to { opacity: 1; filter: blur(0); transform: translateY(0); }
}

@keyframes revealLeft {
  from { opacity: 0; filter: blur(12px); transform: translateX(-60px); }
  to { opacity: 1; filter: blur(0); transform: translateX(0); }
}

@keyframes revealRight {
  from { opacity: 0; filter: blur(12px); transform: translateX(60px); }
  to { opacity: 1; filter: blur(0); transform: translateX(0); }
}

@keyframes revealScale {
  from { opacity: 0; filter: blur(12px); transform: scale(0.85); }
  to { opacity: 1; filter: blur(0); transform: scale(1); }
}

@keyframes slideWord {
  0% { opacity: 0; transform: translateY(100%); }
  10% { opacity: 1; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(0); }
  40% { opacity: 0; transform: translateY(-100%); }
  100% { opacity: 0; transform: translateY(-100%); }
}

@keyframes marqueeLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes marqueeRight {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes borderGlow {
  0%, 100% { border-color: rgba(160, 28, 45, 0.3); box-shadow: 0 0 0 2px rgba(160, 28, 45, 0.1); }
  50% { border-color: rgba(160, 28, 45, 0.6); box-shadow: 0 0 20px rgba(160, 28, 45, 0.2); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes scrollReveal {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

/* ════ BASE STYLES ════ */
* {
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

*::selection {
  background: rgba(160, 28, 45, 0.25);
  color: #1A1714;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: ${V.body};
  color: ${V.text};
  background: ${V.bg};
}

/* ════ GRAIN TEXTURE ════ */
.grain-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.02) 0px,
      rgba(0, 0, 0, 0.02) 1px,
      transparent 1px,
      transparent 2px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.02) 0px,
      rgba(0, 0, 0, 0.02) 1px,
      transparent 1px,
      transparent 2px
    );
  z-index: 10000;
  mix-blend-mode: overlay;
}

/* ════ COMPONENT STYLES ════ */

/* Buttons */
.btn-primary {
  display: inline-block;
  padding: 16px 40px;
  background: ${V.accent};
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  border: 2px solid ${V.accent};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(160, 28, 45, 0.3);
  background: #8B1722;
  border-color: #8B1722;
}

.btn-outline {
  display: inline-block;
  padding: 16px 40px;
  background: transparent;
  color: ${V.text};
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 2px solid ${V.text};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.btn-outline:hover {
  transform: translateY(-4px);
  background: ${V.text};
  color: white;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

/* Badge */
.badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(160, 28, 45, 0.1);
  color: ${V.accent};
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border: 1px solid rgba(160, 28, 45, 0.2);
  text-transform: uppercase;
}

/* Marquee */
.marquee-container {
  display: flex;
  overflow: hidden;
  background: ${V.dark};
  color: white;
}

.marquee-content {
  display: flex;
  gap: 60px;
  animation: marqueeLeft 30s linear infinite;
  white-space: nowrap;
  padding: 40px 0;
  font-family: ${V.heading};
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.marquee-content.reverse {
  animation: marqueeRight 30s linear infinite;
}

.marquee-item {
  flex-shrink: 0;
  padding: 0 30px;
}

.marquee-item.fill {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.marquee-item.stroke {
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 2px white;
  text-stroke: 2px white;
}

/* Service Card */
.service-card {
  flex-shrink: 0;
  width: 60vw;
  background: white;
  border-radius: 20px;
  padding: 60px 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.service-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 40px 80px rgba(160, 28, 45, 0.15);
}

.service-number {
  font-size: 180px;
  font-weight: 900;
  color: rgba(160, 28, 45, 0.08);
  position: absolute;
  top: -30px;
  left: 20px;
  line-height: 1;
  z-index: 1;
}

.service-title {
  font-family: ${V.heading};
  font-size: 2.5rem;
  font-weight: 800;
  color: ${V.text};
  margin: 0 0 20px 0;
  position: relative;
  z-index: 2;
}

.service-desc {
  color: #8A857F;
  font-size: 1.1rem;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

/* Process Step */
.process-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.process-step-number {
  font-size: 200px;
  font-weight: 900;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 2px ${V.text};
  text-stroke: 2px ${V.text};
  line-height: 0.8;
  margin: -40px 0 20px -20px;
}

.process-step-title {
  font-family: ${V.heading};
  font-size: 3.5rem;
  font-weight: 900;
  color: ${V.text};
  margin: 0 0 30px 0;
}

.process-step-desc {
  font-size: 1.2rem;
  color: #8A857F;
  line-height: 1.7;
  max-width: 600px;
}

/* Case Card */
.case-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.case-card:hover {
  transform: translateY(-20px) scale(1.02);
  box-shadow: 0 40px 80px rgba(160, 28, 45, 0.2);
}

.case-card-image {
  width: 100%;
  height: 480px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 900;
}

.case-card-content {
  padding: 40px 30px;
}

.case-card-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${V.accent};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.case-card-title {
  font-family: ${V.heading};
  font-size: 1.6rem;
  font-weight: 800;
  color: ${V.text};
  margin: 0 0 15px 0;
}

.case-card-desc {
  color: #8A857F;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Statement Section */
.statement-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 40px;
  background: ${V.bg};
}

.statement-text {
  font-family: ${V.heading};
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: ${V.text};
  line-height: 1.2;
  max-width: 1000px;
  letter-spacing: -0.02em;
}

.statement-highlight {
  color: ${V.accent};
}

/* Contact Section */
.contact-section {
  background: ${V.darkBg};
  color: white;
  padding: 100px 60px;
  border-radius: 0;
}

.contact-heading {
  font-family: ${V.heading};
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  color: white;
  margin: 0 0 80px 0;
  text-align: center;
  letter-spacing: -0.02em;
}

.contact-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 12px;
  letter-spacing: 0.01em;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-family: ${V.body};
  font-size: 0.95rem;
  transition: all 0.3s;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  border-color: ${V.accent};
  box-shadow: 0 0 0 2px rgba(160, 28, 45, 0.2);
}

/* Footer */
.footer {
  background: ${V.dark};
  color: white;
  padding: 60px;
  text-align: center;
  font-size: 0.9rem;
}

/* Utility Classes */
.section-container {
  max-width: 1400px;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}

.mt-lg {
  margin-top: 120px;
}

.mb-lg {
  margin-bottom: 120px;
}

.opacity-60 {
  opacity: 0.6;
}

/* Scroll Animation Classes */
.reveal-on-scroll {
  opacity: 0;
  animation: scrollReveal 0.8s ease-out forwards;
}

.reveal-delay-1 { animation-delay: 0.1s; }
.reveal-delay-2 { animation-delay: 0.2s; }
.reveal-delay-3 { animation-delay: 0.3s; }
.reveal-delay-4 { animation-delay: 0.4s; }
`;

/* ═══════════════════════════════════════════════════════════════ */
/* COMPONENT: Hero Section                                         */
/* ═══════════════════════════════════════════════════════════════ */
const HeroSection = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "60px",
        background: V.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Left Content */}
        <div>
          <div
            className="badge"
            style={{
              animation: inView ? `popIn 0.6s ease-out` : "none",
              display: "inline-block",
              marginBottom: "40px",
            }}
          >
            Принимаем клиентов
          </div>

          <h1
            style={{
              fontFamily: V.heading,
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              margin: "0 0 30px 0",
              letterSpacing: "-0.02em",
              background: `linear-gradient(135deg, ${V.text} 0%, ${V.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: inView
                ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards`
                : "none",
              opacity: inView ? 1 : 0,
            }}
          >
            Мы не просто агентство
          </h1>

          <p
            style={{
              fontSize: "1.25rem",
              color: "#8A857F",
              lineHeight: 1.7,
              marginBottom: "50px",
              maxWidth: "500px",
              animation: inView
                ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s forwards`
                : "none",
              opacity: inView ? 1 : 0,
            }}
          >
            Стратегия, маркетинг, технологии — под одной крышей. Работаем на результат, а не на отчёты.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              animation: inView
                ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s forwards`
                : "none",
              opacity: inView ? 1 : 0,
            }}
          >
            <button className="btn-primary">Обсудить проект</button>
            <button className="btn-outline">Наши кейсы</button>
          </div>
        </div>

        {/* Right Content - Chat Placeholder */}
        <div
          style={{
            animation: inView
              ? `revealRight 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s forwards`
              : "none",
            opacity: inView ? 1 : 0,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "40px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ marginBottom: "30px" }}>
              <div
                style={{
                  background: "rgba(160,28,45,0.1)",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  color: V.accent,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                Привет! 👋 Я AI-помощник агентства
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div
                style={{
                  background: "rgba(0,0,0,0.06)",
                  padding: "10px 16px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                Услуги
              </div>
              <div
                style={{
                  background: "rgba(0,0,0,0.06)",
                  padding: "10px 16px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                Кейсы
              </div>
              <div
                style={{
                  background: "rgba(0,0,0,0.06)",
                  padding: "10px 16px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                Цены
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* COMPONENT: Stats Section                                        */
/* ═══════════════════════════════════════════════════════════════ */
const StatsSection = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: "$14.6M", label: "продаж" },
    { value: "10K+", label: "заказов" },
    { value: "7+", label: "лет опыта" },
  ];

  return (
    <section
      ref={ref}
      style={{
        padding: "100px 60px",
        background: V.bg,
        borderTop: "1px solid rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "60px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              animation: inView
                ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s forwards`
                : "none",
              opacity: inView ? 1 : 0,
            }}
          >
            <div
              style={{
                fontFamily: V.heading,
                fontSize: "3.5rem",
                fontWeight: 900,
                color: V.accent,
                lineHeight: 1,
                marginBottom: "15px",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                color: "#8A857F",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* COMPONENT: Marquee Section                                      */
/* ═══════════════════════════════════════════════════════════════ */
const MarqueeSection = () => {
  const marqueeItems = [
    "GOOGLE ADS",
    "SEO",
    "META ADS",
    "CRM",
    "AI AGENTS",
    "WEB DEV",
    "BRANDING",
    "ANALYTICS",
  ];

  return (
    <section style={{ overflow: "hidden" }}>
      {/* Row 1 - Left */}
      <div className="marquee-container">
        <div className="marquee-content">
          {marqueeItems.map((item, i) => (
            <div key={i} className="marquee-item fill">
              {item}
            </div>
          ))}
          {marqueeItems.map((item, i) => (
            <div key={`dup-${i}`} className="marquee-item fill">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Right (stroke) */}
      <div className="marquee-container" style={{ background: V.accent, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
        <div className="marquee-content reverse">
          {marqueeItems.map((item, i) => (
            <div key={i} className="marquee-item stroke">
              {item}
            </div>
          ))}
          {marqueeItems.map((item, i) => (
            <div key={`dup-${i}`} className="marquee-item stroke">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* COMPONENT: Services Section - Horizontal Scroll                 */
/* ═══════════════════════════════════════════════════════════════ */
const ServicesSection = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const services = [
    { num: "01", title: "Google Ads", desc: "Настройка и оптимизация рекламных кампаний Google Ads для максимального ROI." },
    { num: "02", title: "SEO", desc: "Комплексная оптимизация сайта для поисковых систем и органического трафика." },
    { num: "03", title: "Meta Ads", desc: "Точно таргетированные кампании в Facebook, Instagram и Threads." },
    { num: "04", title: "CRM & Автоматизация", desc: "Интеграция CRM-систем и автоматизация бизнес-процессов." },
    { num: "05", title: "Дизайн & Разработка", desc: "Создание современных, функциональных веб-сайтов и приложений." },
    { num: "06", title: "AI-агенты", desc: "Разработка умных автоматизированных систем на основе ИИ." },
  ];

  return (
    <section
      ref={ref}
      style={{
        padding: "100px 60px",
        background: V.bg,
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          marginBottom: "80px",
          animation: inView
            ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards`
            : "none",
          opacity: inView ? 1 : 0,
        }}
      >
        <h2
          style={{
            fontFamily: V.heading,
            fontSize: "3.5rem",
            fontWeight: 900,
            color: V.text,
            margin: "0 0 20px 0",
            letterSpacing: "-0.02em",
          }}
        >
          Наши услуги
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#8A857F",
          }}
        >
          Полный спектр решений для вашего бизнеса
        </p>
      </div>

      <div
        ref={scrollContainer}
        style={{
          display: "flex",
          gap: "40px",
          overflowX: "auto",
          paddingBottom: "20px",
          scrollBehavior: "smooth",
        }}
      >
        {services.map((service, i) => (
          <div
            key={i}
            className="service-card"
            style={{
              animation: inView
                ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s forwards`
                : "none",
              opacity: inView ? 1 : 0,
              position: "relative",
            }}
          >
            <div className="service-number">{service.num}</div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-desc">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* COMPONENT: Process Section                                      */
/* ═══════════════════════════════════════════════════════════════ */
const ProcessSection = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      num: "01",
      title: "Аудит",
      desc: "Анализируем текущее состояние вашего маркетинга, конкурентов и определяем точки роста.",
    },
    {
      num: "02",
      title: "Стратегия",
      desc: "Разрабатываем персональную стратегию развития, основанную на данных и insights.",
    },
    {
      num: "03",
      title: "Запуск",
      desc: "Внедряем стратегию, запускаем кампании и начинаем видеть первые результаты.",
    },
    {
      num: "04",
      title: "Масштабирование",
      desc: "Оптимизируем, тестируем и масштабируем успешные каналы для экспоненциального роста.",
    },
  ];

  return (
    <section ref={ref} style={{ background: V.bg }}>
      <div
        style={{
          padding: "100px 60px 0",
          maxWidth: "1400px",
          margin: "0 auto",
          marginBottom: "60px",
        }}
      >
        <h2
          style={{
            fontFamily: V.heading,
            fontSize: "3.5rem",
            fontWeight: 900,
            color: V.text,
            margin: "0 0 20px 0",
            letterSpacing: "-0.02em",
            animation: inView
              ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards`
              : "none",
            opacity: inView ? 1 : 0,
          }}
        >
          Наш процесс
        </h2>
      </div>

      {steps.map((step, i) => (
        <div
          key={i}
          className="process-section"
          style={{
            animation: inView
              ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s forwards`
              : "none",
            opacity: inView ? 1 : 0,
          }}
        >
          <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
            <div className="process-step-number">{step.num}</div>
            <h3 className="process-step-title">{step.title}</h3>
            <p className="process-step-desc">{step.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* COMPONENT: Cases Section                                        */
/* ═══════════════════════════════════════════════════════════════ */
const CasesSection = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cases = [
    { title: "E-commerce Boom", tag: "SEO & Google Ads", emoji: "🛍️" },
    { title: "SaaS Growth", tag: "Meta Ads & CRM", emoji: "📊" },
    { title: "Brand Revolution", tag: "Design & Branding", emoji: "🎨" },
    { title: "AI Integration", tag: "AI Agents", emoji: "🤖" },
    { title: "Performance Marketing", tag: "Analytics", emoji: "📈" },
    { title: "Mobile First", tag: "App Development", emoji: "📱" },
  ];

  return (
    <section
      ref={ref}
      style={{
        padding: "100px 60px",
        background: V.bg,
        borderTop: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          marginBottom: "80px",
          animation: inView
            ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards`
            : "none",
          opacity: inView ? 1 : 0,
        }}
      >
        <h2
          style={{
            fontFamily: V.heading,
            fontSize: "3.5rem",
            fontWeight: 900,
            color: V.text,
            margin: "0 0 20px 0",
            letterSpacing: "-0.02em",
          }}
        >
          Наши кейсы
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#8A857F",
          }}
        >
          Проекты, которые привели к реальному росту
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "30px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {cases.map((caseItem, i) => (
          <div
            key={i}
            className="case-card"
            style={{
              animation: inView
                ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s forwards`
                : "none",
              opacity: inView ? 1 : 0,
            }}
          >
            <div
              className="case-card-image"
              style={{
                background: `linear-gradient(135deg, hsl(${Math.random() * 360}, 70%, 60%) 0%, hsl(${Math.random() * 360}, 70%, 50%) 100%)`,
              }}
            >
              {caseItem.emoji}
            </div>
            <div className="case-card-content">
              <div className="case-card-tag">{caseItem.tag}</div>
              <h3 className="case-card-title">{caseItem.title}</h3>
              <p className="case-card-desc">Увеличили выручку на 340% за 6 месяцев благодаря комплексному подходу.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* COMPONENT: Statement Section                                    */
/* ═══════════════════════════════════════════════════════════════ */
const StatementSection = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="statement-section">
      <div
        className="statement-text"
        style={{
          animation: inView
            ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s forwards`
            : "none",
          opacity: inView ? 1 : 0,
        }}
      >
        Мы не продаём <span className="statement-highlight">часы работы</span> — мы создаём{" "}
        <span className="statement-highlight">системы</span>, которые генерируют выручку. Каждый проект — это партнёрство, где наш успех измеряется вашим ростом.
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* COMPONENT: Contact Section                                      */
/* ═══════════════════════════════════════════════════════════════ */
const ContactSection = () => {
  const [inView, setInView] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section ref={ref} className="contact-section">
      <h2
        className="contact-heading"
        style={{
          animation: inView
            ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards`
            : "none",
          opacity: inView ? 1 : 0,
        }}
      >
        Давайте создадим что-то великое
      </h2>

      <form
        className="contact-form"
        onSubmit={handleSubmit}
        style={{
          animation: inView
            ? `revealUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s forwards`
            : "none",
          opacity: inView ? 1 : 0,
        }}
      >
        <div className="form-group">
          <label className="form-label">Ваше имя</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Как вас зовут?"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Проект (кратко)</label>
          <input
            type="text"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-input"
            placeholder="Расскажите о вашей идее..."
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "16px 40px",
            background: V.accent,
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-4px)";
            e.target.style.boxShadow = "0 20px 50px rgba(160,28,45,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Отправить
        </button>
      </form>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* COMPONENT: Footer                                               */
/* ═══════════════════════════════════════════════════════════════ */
const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ marginBottom: "40px" }}>
        <h3
          style={{
            fontFamily: V.heading,
            fontSize: "1.8rem",
            fontWeight: 900,
            margin: "0 0 10px 0",
          }}
        >
          Bankai Agency
        </h3>
        <p style={{ opacity: 0.7, margin: "0" }}>Стратегия. Маркетинг. Результат.</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "40px" }}>
        <a href="#" style={{ color: "white", textDecoration: "none", opacity: 0.7, transition: "opacity 0.3s" }}>
          Услуги
        </a>
        <a href="#" style={{ color: "white", textDecoration: "none", opacity: 0.7, transition: "opacity 0.3s" }}>
          Кейсы
        </a>
        <a href="#" style={{ color: "white", textDecoration: "none", opacity: 0.7, transition: "opacity 0.3s" }}>
          О нас
        </a>
        <a href="#" style={{ color: "white", textDecoration: "none", opacity: 0.7, transition: "opacity 0.3s" }}>
          Контакты
        </a>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px", opacity: 0.6 }}>
        © 2024 Bankai Agency. Все права защищены.
      </div>
    </footer>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* MAIN PAGE COMPONENT                                             */
/* ═══════════════════════════════════════════════════════════════ */
export default function PreviewPage() {
  return (
    <>
      <style>{globalCSS}</style>
      <div style={{ background: V.bg, color: V.text }}>
        <HeroSection />
        <StatsSection />
        <MarqueeSection />
        <ServicesSection />
        <ProcessSection />
        <CasesSection />
        <StatementSection />
        <ContactSection />
        <Footer />
      </div>
      <div className="grain-overlay" />
    </>
  );
}
