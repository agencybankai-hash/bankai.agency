"use client";
import { useEffect, useRef } from "react";

/* ───── design tokens ───── */
const V = {
  bg: "#0A0A0F",
  card: "#12121A",
  cardHover: "#1A1A25",
  text: "#E8E6F0",
  dim: "#8A879A",
  bright: "#FFFFFF",
  accent: "#6EE7B7",
  accentDim: "rgba(110,231,183,0.15)",
  accentGlow: "rgba(110,231,183,0.3)",
  orange: "#F59E0B",
  orangeDim: "rgba(245,158,11,0.15)",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.12)",
  radius: 16,
  radiusSm: 10,
  heading: "'Unbounded', cursive",
  body: "var(--font-manrope), 'Manrope', sans-serif",
};

/* ───── scroll reveal hook ───── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.style.opacity = 1; el.style.transform = "translateY(0)"; } },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, style: { opacity: 0, transform: "translateY(32px)", transition: "all .7s cubic-bezier(.16,1,.3,1)" } };
}

function Reveal({ children, style: extra, ...props }) {
  const r = useReveal();
  return <div ref={r.ref} style={{ ...r.style, ...extra }} {...props}>{children}</div>;
}

/* ───── shared styles ───── */
const container = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
const sectionLabel = {
  fontFamily: V.heading, fontSize: "0.72rem", fontWeight: 600,
  letterSpacing: "0.15em", textTransform: "uppercase", color: V.accent, marginBottom: 20,
};
const sectionTitle = {
  fontFamily: V.heading, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700,
  lineHeight: 1.15, letterSpacing: "-0.02em", color: V.bright, maxWidth: 700, marginBottom: 56,
};

/* ═══════════════════════ NAV ═══════════════════════ */
function Nav() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "20px 0",
      background: "rgba(10,10,15,0.8)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${V.border}`,
    }}>
      <div style={{ ...container, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 700, fontSize: "1.15rem", color: V.bright, letterSpacing: "-0.02em" }}>
          AI<span style={{ color: V.accent }}>.</span>ЯДРО
        </div>
        <a href="#pricing" style={{
          background: V.accent, color: V.bg, padding: "10px 24px", borderRadius: 100,
          fontWeight: 700, fontSize: "0.85rem", textDecoration: "none",
          transition: "all .3s", letterSpacing: "-0.01em",
        }}>Получить аудит →</a>
      </div>
    </nav>
  );
}

/* ═══════════════════════ HERO ═══════════════════════ */
function Hero() {
  return (
    <section style={{ padding: "180px 0 120px", position: "relative" }}>
      {/* radial glow */}
      <div style={{
        position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 800,
        background: "radial-gradient(circle, rgba(110,231,183,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={container}>
        {/* badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 18px", background: V.accentDim,
          border: "1px solid rgba(110,231,183,0.2)", borderRadius: 100,
          fontSize: "0.82rem", fontWeight: 600, color: V.accent, marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, background: V.accent, borderRadius: "50%", display: "inline-block" }} />
          Внедрение AI-систем для бизнеса
        </div>

        {/* heading */}
        <h1 style={{
          fontFamily: V.heading, fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)",
          fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em",
          color: V.bright, maxWidth: 900, marginBottom: 28,
        }}>
          Операционная система{" "}
          <span style={{
            background: "linear-gradient(135deg, #6EE7B7, #34D399)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>вашего бизнеса</span>{" "}
          на базе ИИ
        </h1>

        <p style={{ fontSize: "1.2rem", color: V.dim, maxWidth: 620, lineHeight: 1.7, marginBottom: 48 }}>
          Внедряем AI-агентов, которые берут на себя рутину, аналитику и часть решений.
          Вы получаете управляемый бизнес без раздутого штата.
        </p>

        {/* buttons */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a href="#pricing" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: V.accent, color: V.bg, padding: "16px 36px", borderRadius: 100,
            fontWeight: 700, fontSize: "1rem", textDecoration: "none", transition: "all .3s",
          }}>Заказать аудит — $2 500 →</a>
          <a href="#solution" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "transparent", color: V.text, padding: "16px 36px", borderRadius: 100,
            fontWeight: 600, fontSize: "1rem", textDecoration: "none",
            border: `1px solid ${V.borderHover}`, transition: "all .3s",
          }}>Как это работает</a>
        </div>

        {/* stats */}
        <div style={{
          display: "flex", gap: 48, marginTop: 72, paddingTop: 48,
          borderTop: `1px solid ${V.border}`, flexWrap: "wrap",
        }}>
          {[
            { val: "20–40", unit: "ч/нед", label: "экономия времени команды" },
            { val: "3–6", unit: "мес", label: "окупаемость внедрения" },
            { val: "2–3", unit: "FTE", label: "замена штатных единиц" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: V.heading, fontSize: "2rem", fontWeight: 700, color: V.bright }}>
                {s.val} <span style={{ color: V.accent }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: V.dim, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ PROBLEM ═══════════════════════ */
function Problem() {
  const cards = [
    { icon: "⏱", title: "Всё завязано на вас", text: "Вы вручную контролируете каждый процесс. Без вашего участия ничего не движется. Масштабирование невозможно, пока вы — узкое горлышко." },
    { icon: "📊", title: "Нет прозрачности", text: "Данные разбросаны между CRM, таблицами и головами сотрудников. Вы принимаете решения на ощущениях, а не на цифрах." },
    { icon: "💸", title: "Дорогие сотрудники, медленные процессы", text: "Нанять operations director — $150K/год. Нанять аналитика — ещё $100K. А рутина по-прежнему отнимает половину рабочего дня." },
  ];
  return (
    <section style={{ padding: "120px 0" }}>
      <div style={container}>
        <Reveal><div style={sectionLabel}>Проблема</div></Reveal>
        <Reveal><h2 style={sectionTitle}>Ваш бизнес растёт, но операционка тянет вас назад</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {cards.map((c, i) => (
            <Reveal key={i}>
              <div style={{
                background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radius,
                padding: 36, transition: "all .4s", position: "relative", overflow: "hidden", height: "100%",
              }}>
                <div style={{
                  width: 48, height: 48, background: "rgba(239,68,68,0.1)", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", marginBottom: 20,
                }}>{c.icon}</div>
                <h3 style={{ fontFamily: V.heading, fontSize: "1.05rem", fontWeight: 600, color: V.bright, marginBottom: 12 }}>{c.title}</h3>
                <p style={{ fontSize: "0.92rem", color: V.dim, lineHeight: 1.7 }}>{c.text}</p>
              </div>
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
      num: "Слой 01 — Операционный", title: "AI делает рутину за команду",
      desc: "Агенты, которые работают 24/7 и не ошибаются. Они обрабатывают входящие, квалифицируют лиды, создают задачи и генерируют отчёты без вашего участия.",
      features: [
        { bold: "Автообработка заявок", text: " — лид приходит, AI квалифицирует и маршрутизирует менеджеру за секунды" },
        { bold: "Транскрибация → задачи", text: " — каждый звонок и встреча превращаются в чёткий action-plan" },
        { bold: "Авто-отчёты", text: " — еженедельные отчёты по KPI генерируются сами и приходят вам в мессенджер" },
      ],
    },
    {
      num: "Слой 02 — Тактический", title: "AI анализирует и рекомендует",
      desc: "Система непрерывно следит за метриками, рекламными кампаниями и конкурентами. Вы получаете не данные, а готовые рекомендации к действию.",
      features: [
        { bold: "KPI-алерты", text: " — мгновенные уведомления при отклонении от нормы с объяснением причин" },
        { bold: "Анализ рекламы", text: " — AI смотрит ваши кампании и говорит что масштабировать, а что остановить" },
        { bold: "Конкурентная разведка", text: " — автоматический мониторинг конкурентов и их стратегий" },
      ],
    },
    {
      num: "Слой 03 — Стратегический", title: "AI как ваш цифровой советник",
      desc: "Полная картина бизнеса в одном дашборде. Прогнозы, сценарии, рекомендации — всё, что нужно для взвешенных решений.",
      features: [
        { bold: "Живой дашборд", text: " — все ключевые метрики бизнеса в реальном времени" },
        { bold: "Прогнозирование", text: " — AI строит модели на основе ваших исторических данных" },
        { bold: "Сценарное моделирование", text: " — «что если» анализ перед каждым крупным решением" },
      ],
    },
  ];
  return (
    <section id="solution" style={{ padding: "120px 0", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(180deg, transparent, rgba(110,231,183,0.02), transparent)",
        pointerEvents: "none",
      }} />
      <div style={container}>
        <Reveal><div style={sectionLabel}>Решение</div></Reveal>
        <Reveal><h2 style={sectionTitle}>Три слоя AI-ядра, которые закрывают операционку</h2></Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {layers.map((l, i) => (
            <Reveal key={i}>
              <div style={{
                background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radius,
                padding: "44px 48px", display: "grid", gridTemplateColumns: "1fr 1.4fr",
                gap: 48, alignItems: "center", transition: "all .4s", position: "relative", overflow: "hidden",
              }}>
                <div>
                  <div style={{ fontFamily: V.heading, fontSize: "0.7rem", fontWeight: 700, color: V.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{l.num}</div>
                  <h3 style={{ fontFamily: V.heading, fontSize: "1.4rem", fontWeight: 700, color: V.bright, marginBottom: 14, letterSpacing: "-0.02em" }}>{l.title}</h3>
                  <p style={{ fontSize: "0.95rem", color: V.dim, lineHeight: 1.7 }}>{l.desc}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {l.features.map((f, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "16px 20px", background: "rgba(255,255,255,0.02)",
                      borderRadius: V.radiusSm, border: `1px solid ${V.border}`, transition: "all .3s",
                    }}>
                      <div style={{
                        width: 32, height: 32, minWidth: 32, background: V.accentDim,
                        borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                        color: V.accent, fontSize: "0.85rem", fontWeight: 700,
                      }}>→</div>
                      <div style={{ fontSize: "0.88rem", color: V.text, lineHeight: 1.5 }}>
                        <strong style={{ color: V.bright, fontWeight: 600 }}>{f.bold}</strong>{f.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
    { val: "–40%", label: "времени на рутинные операции" },
    { val: "×3", label: "скорость обработки заявок" },
    { val: "–$150K", label: "экономия на штате в год" },
    { val: "24/7", label: "система работает без выходных" },
  ];
  return (
    <section style={{ padding: "120px 0" }}>
      <div style={container}>
        <Reveal><div style={sectionLabel}>Результаты</div></Reveal>
        <Reveal><h2 style={sectionTitle}>Что получает бизнес после внедрения</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {items.map((r, i) => (
            <Reveal key={i}>
              <div style={{
                background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radius,
                padding: "36px 32px", textAlign: "center", transition: "all .4s", height: "100%",
              }}>
                <div style={{ fontFamily: V.heading, fontSize: "2.4rem", fontWeight: 800, color: V.accent, lineHeight: 1, marginBottom: 12 }}>{r.val}</div>
                <div style={{ fontSize: "0.88rem", color: V.dim, lineHeight: 1.5 }}>{r.label}</div>
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
  const steps = [
    { num: "01", dur: "1–2 недели", title: "Аудит и стратегия", text: "Изучаем процессы, находим узкие места, проектируем архитектуру AI-системы. Вы получаете детальный план с ROI-прогнозом." },
    { num: "02", dur: "3–4 недели", title: "Разработка и настройка", text: "Создаём и обучаем AI-агентов под ваши задачи. Интегрируем с CRM, мессенджерами, рекламными кабинетами." },
    { num: "03", dur: "1–2 недели", title: "Запуск и калибровка", text: "Запускаем систему в работу, тестируем на реальных данных, калибруем точность и скорость агентов." },
    { num: "04", dur: "Постоянно", title: "Поддержка и развитие", text: "Мониторим работу, добавляем новых агентов, масштабируем систему вместе с ростом вашего бизнеса." },
  ];
  return (
    <section style={{ padding: "120px 0" }}>
      <div style={container}>
        <Reveal><div style={sectionLabel}>Процесс</div></Reveal>
        <Reveal><h2 style={sectionTitle}>Как мы внедряем AI-ядро</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {steps.map((s, i) => (
            <Reveal key={i}>
              <div style={{
                background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radius,
                padding: 36, position: "relative", transition: "all .4s", height: "100%",
              }}>
                <div style={{
                  fontFamily: V.heading, fontSize: "3rem", fontWeight: 900,
                  color: "rgba(110,231,183,0.08)", position: "absolute", top: 20, right: 24, lineHeight: 1,
                }}>{s.num}</div>
                <div style={{
                  display: "inline-block", fontSize: "0.75rem", fontWeight: 600, color: V.accent,
                  background: V.accentDim, padding: "4px 12px", borderRadius: 100, marginBottom: 14,
                }}>{s.dur}</div>
                <h3 style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 600, color: V.bright, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: "0.88rem", color: V.dim, lineHeight: 1.7 }}>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ CASE STUDY ═══════════════════════ */
function CaseStudy() {
  return (
    <section style={{ padding: "120px 0" }}>
      <div style={container}>
        <Reveal><div style={sectionLabel}>Кейс</div></Reveal>
        <Reveal><h2 style={sectionTitle}>Результаты, которые говорят за нас</h2></Reveal>
        <Reveal>
          <div style={{
            background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radius,
            padding: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center",
          }}>
            <div>
              <div style={{
                fontSize: "0.75rem", fontWeight: 700, color: V.orange, background: V.orangeDim,
                display: "inline-block", padding: "4px 14px", borderRadius: 100, marginBottom: 20,
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>Мувинговая компания • США</div>
              <h3 style={{ fontFamily: V.heading, fontSize: "1.6rem", fontWeight: 700, color: V.bright, marginBottom: 16, letterSpacing: "-0.02em" }}>
                От ручного хаоса к системе, генерирующей $14.6M
              </h3>
              <p style={{ fontSize: "0.95rem", color: V.dim, lineHeight: 1.7, marginBottom: 32 }}>
                Комплексное внедрение: сайт, перформанс-маркетинг, CRM, автоматизация обработки заявок и аналитики. Из локального бизнеса — в компанию с 10,000+ заказов.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { val: "$14.6M", label: "выручка" },
                  { val: "10,235", label: "заказов" },
                  { val: "$400K", label: "рекламный бюджет" },
                  { val: "40→26", label: "позиция в SEO" },
                ].map((m, i) => (
                  <div key={i} style={{
                    padding: 20, background: "rgba(255,255,255,0.02)",
                    borderRadius: V.radiusSm, border: `1px solid ${V.border}`,
                  }}>
                    <div style={{ fontFamily: V.heading, fontSize: "1.6rem", fontWeight: 700, color: V.accent }}>{m.val}</div>
                    <div style={{ fontSize: "0.8rem", color: V.dim, marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "relative", paddingLeft: 28 }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                background: V.accent, borderRadius: 2,
              }} />
              <p style={{ fontSize: "1.15rem", color: V.text, lineHeight: 1.7, fontStyle: "italic", marginBottom: 20 }}>
                «Мы передали рутину системе и наконец сфокусировались на росте. Раньше я тратил 4 часа в день на проверку заявок — сейчас это делает AI, а я смотрю дашборд раз в день.»
              </p>
              <div style={{ fontSize: "0.88rem", color: V.dim }}>
                <strong style={{ color: V.bright }}>Основатель компании</strong><br />SOS Moving, New York
              </div>
            </div>
          </div>
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
      badge: null, title: "Полная система + поддержка", price: "$25–50K", note: "+ $2–5K/мес поддержка",
      features: ["Все три слоя: операционный, тактический, стратегический", "Кастомные дашборды и прогнозы", "Постоянная калибровка и оптимизация", "Приоритетная поддержка", "Масштабирование по мере роста"],
      cta: "Обсудить проект →", featured: false,
    },
  ];
  return (
    <section id="pricing" style={{ padding: "120px 0", position: "relative" }}>
      <div style={{
        position: "absolute", bottom: -200, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(110,231,183,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={container}>
        <Reveal><div style={sectionLabel}>Тарифы</div></Reveal>
        <Reveal><h2 style={sectionTitle}>Выберите точку входа</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {plans.map((p, i) => (
            <Reveal key={i}>
              <div style={{
                background: p.featured
                  ? `linear-gradient(180deg, rgba(110,231,183,0.04), ${V.card})`
                  : V.card,
                border: `1px solid ${p.featured ? "rgba(110,231,183,0.25)" : V.border}`,
                borderRadius: V.radius, padding: 44, transition: "all .4s", position: "relative", height: "100%",
                display: "flex", flexDirection: "column",
              }}>
                {p.featured && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: "linear-gradient(90deg, transparent, #6EE7B7, transparent)",
                  }} />
                )}
                {p.badge && (
                  <div style={{
                    display: "inline-block", fontSize: "0.72rem", fontWeight: 700, color: V.bg,
                    background: V.accent, padding: "4px 14px", borderRadius: 100, marginBottom: 20,
                    letterSpacing: "0.05em", textTransform: "uppercase", alignSelf: "flex-start",
                  }}>{p.badge}</div>
                )}
                <h3 style={{ fontFamily: V.heading, fontSize: "1.2rem", fontWeight: 700, color: V.bright, marginBottom: 10 }}>{p.title}</h3>
                <div style={{ fontFamily: V.heading, fontSize: "2.2rem", fontWeight: 800, color: V.bright, marginBottom: 8 }}>{p.price}</div>
                <div style={{ fontSize: "0.82rem", color: V.dim, marginBottom: 28 }}>{p.note}</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, marginBottom: 32, flex: 1 }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: "0.9rem", color: V.text, lineHeight: 1.5 }}>
                      <span style={{ color: V.accent, fontWeight: 700, minWidth: 18 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" style={{
                  display: "block", textAlign: "center", padding: "14px 28px", borderRadius: 100,
                  fontWeight: 700, fontSize: "0.92rem", textDecoration: "none", transition: "all .3s",
                  ...(p.featured
                    ? { background: V.accent, color: V.bg }
                    : { background: "transparent", border: `1px solid ${V.borderHover}`, color: V.text }),
                }}>{p.cta}</a>
              </div>
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
    { q: "Какие системы вы интегрируете?", a: "HubSpot, Salesforce, Google Ads, Meta Ads, CallRail, Slack, Telegram, WhatsApp и любые системы с API. На этапе аудита мы определяем ваш стек и проектируем интеграции." },
    { q: "Сколько времени занимает внедрение?", a: "Аудит — 1–2 недели. Внедрение операционного ядра — 6–8 недель. Полная система — 8–12 недель. Первые результаты вы увидите уже на 3-й неделе после начала работ." },
    { q: "Что если AI ошибётся?", a: "Для критичных процессов мы используем human-in-the-loop: AI делает предложение, а человек подтверждает. Плюс мы калибруем систему на ваших реальных данных перед запуском." },
    { q: "Можно ли начать с одного агента?", a: "Да. Аудит покажет, какой агент даст максимальный ROI для вашего бизнеса. Можно начать с него и масштабировать по мере роста." },
    { q: "Нужен ли мне технический специалист в штате?", a: "Нет. Мы полностью берём на себя разработку, настройку и поддержку. Ваша команда работает с системой через привычные интерфейсы: мессенджеры, CRM, дашборды." },
    { q: "Какая гарантия?", a: "Если после аудита вы не увидите конкретного ROI и плана — мы вернём деньги. На этапе внедрения мы фиксируем скоуп и KPI до начала работ." },
  ];
  return (
    <section style={{ padding: "120px 0" }}>
      <div style={container}>
        <Reveal><div style={sectionLabel}>Частые вопросы</div></Reveal>
        <Reveal><h2 style={sectionTitle}>Ответы на главные вопросы</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
          {items.map((f, i) => (
            <Reveal key={i}>
              <div style={{
                background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radius,
                padding: 32, transition: "all .3s", height: "100%",
              }}>
                <h3 style={{ fontFamily: V.heading, fontSize: "0.9rem", fontWeight: 600, color: V.bright, marginBottom: 12 }}>{f.q}</h3>
                <p style={{ fontSize: "0.88rem", color: V.dim, lineHeight: 1.7 }}>{f.a}</p>
              </div>
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
    <section id="contact" style={{ padding: "120px 0 160px", textAlign: "center", position: "relative" }}>
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: 900, height: 500,
        background: "radial-gradient(ellipse, rgba(110,231,183,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={container}>
        <h2 style={{
          fontFamily: V.heading, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800,
          color: V.bright, maxWidth: 700, margin: "0 auto 20px", letterSpacing: "-0.03em", lineHeight: 1.15,
        }}>
          Готовы перестать быть узким горлышком своего бизнеса?
        </h2>
        <p style={{ fontSize: "1.1rem", color: V.dim, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Начните с аудита за $2,500 и получите конкретный план с цифрами ROI. Без обязательств.
        </p>
        <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: V.accent, color: V.bg, padding: "18px 44px", borderRadius: 100,
          fontWeight: 700, fontSize: "1.1rem", textDecoration: "none", transition: "all .3s",
        }}>
          Записаться на discovery-звонок →
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════ FOOTER ═══════════════════════ */
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${V.border}`, padding: "40px 0" }}>
      <div style={{ ...container, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: V.heading, fontWeight: 700, fontSize: "1.15rem", color: V.bright }}>
          AI<span style={{ color: V.accent }}>.</span>ЯДРО
        </div>
        <p style={{ fontSize: "0.82rem", color: V.dim }}>© 2026 Bankai.Agency. Все права защищены.</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function Home() {
  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          /* solution layer cards → single column */
        }
        @media (max-width: 600px) {
          /* results grid → single column handled by auto-fit */
        }
      `}</style>
      <Nav />
      <Hero />
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
