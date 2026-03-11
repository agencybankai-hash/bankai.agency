"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCases, V } from "../data";
import { getDictionary } from "../../../i18n";

/* ── Placeholder component ── */
const Placeholder = ({ text, ratio = "16/9" }) => {
  const [a, b] = ratio.split("/").map(Number);
  const pb = (b / a) * 100;
  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: `${pb}%`, marginBottom: 24 }}>
      <div style={{
        position: "absolute", inset: 0,
        border: `2px dashed rgba(0,0,0,0.10)`, borderRadius: V.radiusSm,
        background: "rgba(0,0,0,0.015)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 10, padding: 24,
      }}>
        <div style={{ fontSize: "2rem", opacity: 0.4 }}>📷</div>
        <div style={{ fontSize: "0.78rem", color: V.dim, textAlign: "center", lineHeight: 1.55, maxWidth: "80%" }}>{text}</div>
      </div>
    </div>
  );
};

/* ── Section heading with large number accent ── */
const SectionHeading = ({ num, title, sub }) => (
  <div style={{ marginBottom: 48, position: "relative" }}>
    {/* Giant background number */}
    <div style={{
      fontFamily: V.heading, fontSize: "clamp(5rem, 12vw, 8rem)", fontWeight: 900,
      color: "rgba(0,0,0,0.025)", lineHeight: 0.8, position: "absolute",
      top: -20, left: -8, pointerEvents: "none", userSelect: "none",
    }}>{num}</div>
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{
        fontFamily: V.heading, fontSize: "0.6rem", fontWeight: 700,
        letterSpacing: "0.18em", textTransform: "uppercase", color: V.accent, marginBottom: 12,
      }}>{num} — {title}</div>
      {sub && (
        <h2 style={{
          fontFamily: V.heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
          color: V.bright, letterSpacing: "-0.04em", lineHeight: 1.1, margin: 0,
        }}>{sub}</h2>
      )}
    </div>
  </div>
);

/* ── CSS ── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap');
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:${V.bg}}
.case-back{display:inline-flex;align-items:center;gap:8px;font-size:0.8rem;font-weight:600;color:${V.dim};text-decoration:none;transition:all .3s;letter-spacing:0.02em}
.case-back:hover{color:${V.accent};gap:12px}
.cta-btn{border:none;padding:16px 40px;border-radius:100px;background:${V.accent};color:#fff;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all .35s cubic-bezier(.16,1,.3,1);text-decoration:none;display:inline-block;font-family:${V.body}}
.cta-btn:hover{background:${V.accentLit};transform:translateY(-2px);box-shadow:0 8px 32px rgba(160,28,45,0.25)}
.scope-tag{transition:all .3s}
.scope-tag:hover{background:${V.accentDim}!important;border-color:rgba(160,28,45,0.15)!important;color:${V.accent}!important}
.metric-card{transition:all .3s cubic-bezier(.16,1,.3,1)}
.metric-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,0.06)}

/* sidebar nav */
.side-nav{position:relative;align-self:start}
.side-nav.stuck{position:sticky;top:40px}
.side-nav-item{display:flex;align-items:center;gap:12px;padding:10px 0;cursor:pointer;border:none;background:none;text-align:left;width:100%;transition:all .3s;font-family:${V.body}}
.side-nav-item:hover .snav-label{color:${V.bright}}
.snav-dot{width:6px;height:6px;border-radius:50%;background:${V.divider};transition:all .4s cubic-bezier(.16,1,.3,1);flex-shrink:0}
.snav-dot.active{width:8px;height:8px;background:${V.accent};box-shadow:0 0 12px rgba(160,28,45,0.3)}
.snav-label{font-size:0.8rem;font-weight:600;color:${V.muted};transition:all .3s;line-height:1.3;letter-spacing:0.01em}
.snav-label.active{color:${V.bright};font-weight:800}
.snav-line{width:1px;height:100%;background:${V.divider};margin-left:3px}

/* content sections */
.case-section{margin-bottom:100px;scroll-margin-top:80px}
.case-section:last-child{margin-bottom:40px}

/* step card */
.step-card{transition:all .35s cubic-bezier(.16,1,.3,1);cursor:default}
.step-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.05);border-color:rgba(0,0,0,0.12)!important}

/* other case link */
.oc-link{transition:all .3s}
.oc-link:hover{border-color:rgba(0,0,0,0.14)!important;transform:translateX(4px)}

@media(max-width:1024px){
  .case-layout{grid-template-columns:1fr!important}
  .side-nav{position:relative;top:0;display:flex;flex-wrap:wrap;gap:8px;margin-bottom:40px;
    position:sticky;top:0;z-index:20;background:rgba(250,248,245,0.95);backdrop-filter:blur(8px);
    padding:16px 0;border-bottom:1px solid ${V.divider}}
  .side-nav-item{padding:6px 14px;border-radius:100px;border:1px solid ${V.divider};width:auto;gap:8px}
  .side-nav-item:has(.snav-dot.active){border-color:${V.accent};background:${V.accentDim}}
  .snav-line-wrap{display:none}
}
@media(max-width:768px){
  .case-hero{min-height:360px!important}
  .case-hero h1{font-size:1.8rem!important}
  .two-col{grid-template-columns:1fr!important}
  .step-images{grid-template-columns:1fr!important}
}
@media(max-width:480px){
  .case-hero{min-height:280px!important}
  .case-hero h1{font-size:1.4rem!important}
  .results-big{grid-template-columns:1fr!important}
}
`;

/* ── Main component ── */
export default function CasePage() {
  const { slug, locale } = useParams();
  const t = getDictionary(locale);
  const cases = getCases(locale);
  const c = cases.find(x => x.slug === slug);

  if (!c) return <div style={{ padding: 80, textAlign: "center", fontFamily: V.body, color: V.dim }}>{t.caseDetail?.notFound || "Not found"}</div>;
  const d = c.detail;

  /* ── Scroll spy ── */
  const sections = [
    { id: "overview", label: "Обзор" },
    { id: "before-after", label: "До / После" },
    { id: "challenge", label: "Задача" },
    { id: "process", label: "Процесс" },
    { id: "results", label: "Результаты" },
    { id: "review", label: "Отзыв" },
  ];

  const sectionRefs = useRef({});
  const heroRef = useRef(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [heroGone, setHeroGone] = useState(false);

  /* Hero observer — detect when hero leaves viewport */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHeroGone(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const observers = [];
    sections.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [slug]);

  const scrollTo = useCallback((id) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const setRef = useCallback((id) => (el) => { sectionRefs.current[id] = el; }, []);

  /* ── Placeholder maps per step ── */
  const stepPlaceholders = [
    ["Скриншот структуры рекламных кампаний в Google Ads", "Дашборд с ключевыми метриками: CTR, CPC, CPA, Conversions"],
    ["Скриншот Google Business Profile с отзывами и постами", "Позиции в Google Maps / Local Pack по целевым запросам"],
    ["Скриншот HubSpot CRM Pipeline с этапами сделок", "Пример email-последовательности для follow-up"],
    ["Дизайн direct mail открытки для целевых районов", "Схема партнёрской программы с дизайнерами интерьеров"],
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div style={{ minHeight: "100vh", fontFamily: V.body, color: V.text }}>
        {/* ═══ HERO ═══ */}
        <div ref={heroRef} className="case-hero" style={{
          width: "100%", minHeight: 480, position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, ${c.color1}, ${c.color2}, ${c.color3})`,
        }}>
          <div style={{ position: "absolute", top: "15%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}22, transparent 70%)` }} />
          <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}15, transparent 70%)` }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

          {/* Back */}
          <div style={{ position: "absolute", top: 28, left: 0, right: 0, padding: "0 max(24px, calc((100% - 1200px)/2))" }}>
            <Link href={`/${locale}/#cases`} className="case-back" style={{ color: "rgba(255,255,255,0.7)" }}>
              <span>←</span> {t.caseDetail?.backLink || "Назад"}
            </Link>
          </div>

          {/* Lang */}
          <div style={{ position: "absolute", top: 28, right: 0, padding: "0 max(24px, calc((100% - 1200px)/2))", display: "flex", gap: 4 }}>
            {["ru", "en"].map(l => (
              <Link key={l} href={`/${l}/cases/${slug}`} style={{
                fontSize: "0.7rem", fontWeight: 700, textDecoration: "none", padding: "4px 8px", borderRadius: 4,
                background: locale === l ? "rgba(255,255,255,0.2)" : "transparent",
                color: locale === l ? "#fff" : "rgba(255,255,255,0.5)",
              }}>{l.toUpperCase()}</Link>
            ))}
          </div>

          {/* Result badge */}
          <div style={{ position: "absolute", top: 68, right: 0, padding: "0 max(24px, calc((100% - 1200px)/2))" }}>
            <div style={{
              background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
              borderRadius: 12, padding: "16px 24px", textAlign: "center",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              <div style={{ fontFamily: V.heading, fontSize: "1.8rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{c.result}</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", fontWeight: 600, marginTop: 4 }}>{c.resultLabel}</div>
            </div>
          </div>

          {/* Hero content */}
          <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, padding: "0 max(24px, calc((100% - 1200px)/2))" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {c.tag.split(" · ").map((tag, i) => (
                <span key={i} style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: "0.58rem", fontWeight: 700,
                  background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)",
                  letterSpacing: "0.1em", backdropFilter: "blur(8px)",
                }}>{tag}</span>
              ))}
            </div>
            <h1 style={{
              fontFamily: V.heading, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900,
              color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0,
              textShadow: "0 2px 40px rgba(0,0,0,0.3)",
            }}>{c.client}</h1>
            {c.headline && (
              <p style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)", color: "rgba(255,255,255,0.6)", marginTop: 16, maxWidth: 650, lineHeight: 1.6 }}>
                {c.headline}
              </p>
            )}
          </div>
        </div>

        {/* ═══ MAIN LAYOUT: sidebar + content ═══ */}
        <div className="case-layout" style={{
          maxWidth: 1200, margin: "0 auto", padding: "60px 24px 120px",
          display: "grid", gridTemplateColumns: "200px 1fr", gap: 64,
        }}>
          {/* ── Left sidebar nav ── */}
          <nav className={`side-nav${heroGone ? " stuck" : ""}`}>
            {sections.map((s, i) => (
              <div key={s.id}>
                <button className="side-nav-item" onClick={() => scrollTo(s.id)}>
                  <span className={`snav-dot${activeSection === s.id ? " active" : ""}`} />
                  <span className={`snav-label${activeSection === s.id ? " active" : ""}`}>{s.label}</span>
                </button>
                {i < sections.length - 1 && (
                  <div className="snav-line-wrap" style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 3 }}>
                    <div style={{
                      width: 1, height: 20,
                      background: activeSection === sections[i + 1]?.id || sections.findIndex(x => x.id === activeSection) > i
                        ? V.accent : V.divider,
                      transition: "background .4s",
                    }} />
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── Right: continuous content ── */}
          <div>

            {/* ═══ SECTION: OVERVIEW ═══ */}
            <section ref={setRef("overview")} className="case-section" id="overview">
              <SectionHeading num="01" title="ОБЗОР" sub={c.headline} />

              <p style={{ fontSize: "1.05rem", color: V.text, lineHeight: 1.9, maxWidth: 720, marginBottom: 44 }}>{c.desc}</p>

              {/* Timeline & Model badges */}
              {(d.timeline || d.model) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
                  {d.timeline && (
                    <span style={{ padding: "8px 16px", borderRadius: 8, background: V.accentDim, border: `1px solid rgba(160,28,45,0.1)`, fontSize: "0.75rem", fontWeight: 600, color: V.accent }}>{d.timeline}</span>
                  )}
                  {d.model && (
                    <span style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(0,0,0,0.03)", border: `1px solid ${V.border}`, fontSize: "0.75rem", fontWeight: 500, color: V.dim }}>{d.model}</span>
                  )}
                </div>
              )}

              {/* Key metrics — bold cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 48 }}>
                {c.metrics.map((m, i) => (
                  <div key={i} className="metric-card" style={{
                    padding: "28px 28px", background: V.card, border: `1px solid ${V.divider}`, borderRadius: V.radius,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: `linear-gradient(90deg, ${V.accent}, transparent)`, opacity: 0.4,
                    }} />
                    <div style={{ fontFamily: V.heading, fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 900, color: V.bright, marginBottom: 8, letterSpacing: "-0.04em" }}>{m.v}</div>
                    <div style={{ fontSize: "0.76rem", color: V.dim, fontWeight: 500, lineHeight: 1.5 }}>{m.l}</div>
                  </div>
                ))}
              </div>

              {/* Scope */}
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontFamily: V.heading, fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: V.muted, marginBottom: 12 }}>
                  {t.caseDetail?.scope || "Скоуп"}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.scope.map((s, j) => (
                    <span key={j} className="scope-tag" style={{
                      padding: "6px 14px", borderRadius: 100, background: "rgba(0,0,0,0.03)",
                      border: `1px solid ${V.border}`, fontSize: "0.72rem", color: V.dim, fontWeight: 500,
                    }}>{s}</span>
                  ))}
                </div>
              </div>

              <Placeholder text="Фото реализованного проекта или скриншот сайта клиента" />
            </section>

            {/* ═══ SECTION: BEFORE / AFTER ═══ */}
            {c.beforeAfter && (
              <section ref={setRef("before-after")} className="case-section" id="before-after">
                <SectionHeading num="02" title="ТРАНСФОРМАЦИЯ" sub="До и после нашей работы" />

                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 36 }}>
                  <div style={{ padding: "36px 32px", borderRadius: V.radius, background: "rgba(0,0,0,0.02)", border: `1px solid ${V.divider}` }}>
                    <div style={{ fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 18 }}>
                      {t.caseDetail?.before || "До"}
                    </div>
                    <p style={{ fontSize: "0.95rem", color: V.dim, lineHeight: 1.85, margin: 0 }}>{c.beforeAfter.before}</p>
                  </div>
                  <div style={{ padding: "36px 32px", borderRadius: V.radius, background: V.accentDim, border: `1px solid rgba(160,28,45,0.12)`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${V.accent}, transparent)`, opacity: 0.4 }} />
                    <div style={{ fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: V.accent, marginBottom: 18 }}>
                      {t.caseDetail?.after || "После"}
                    </div>
                    <p style={{ fontSize: "0.95rem", color: V.text, lineHeight: 1.85, margin: 0 }}>{c.beforeAfter.after}</p>
                  </div>
                </div>

                <Placeholder text="Сравнительный скриншот: состояние ДО начала работы vs текущие показатели" ratio="21/9" />
              </section>
            )}

            {/* ═══ SECTION: CHALLENGE ═══ */}
            <section ref={setRef("challenge")} className="case-section" id="challenge">
              <SectionHeading num="03" title="ЗАДАЧА" sub="С чем пришёл клиент" />
              <p style={{ fontSize: "1.08rem", color: V.text, lineHeight: 1.9, maxWidth: 720 }}>{d.challenge}</p>

              <div style={{ marginTop: 32 }}>
                <Placeholder text="Общая схема маркетинговой воронки: трафик → сайт → заявка → CRM → follow-up → сделка" ratio="21/9" />
              </div>
            </section>

            {/* ═══ SECTION: PROCESS ═══ */}
            <section ref={setRef("process")} className="case-section" id="process">
              <SectionHeading num="04" title="ПРОЦЕСС" sub="Что мы сделали" />

              {d.solution.map((step, idx) => (
                <div key={idx} style={{ marginBottom: 72 }}>
                  {/* Step header */}
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
                    <div style={{
                      fontFamily: V.heading, fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900,
                      color: V.accentDim, lineHeight: 0.9, flexShrink: 0, minWidth: 72,
                    }}>
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div style={{ flex: 1, paddingTop: 6 }}>
                      <h3 style={{
                        fontFamily: V.heading, fontSize: "clamp(1rem, 2vw, 1.35rem)", fontWeight: 800,
                        color: V.bright, letterSpacing: "-0.02em", margin: "0 0 14px", lineHeight: 1.25,
                      }}>{step.title}</h3>
                      <p style={{ fontSize: "0.92rem", color: V.text, lineHeight: 1.85, margin: 0, maxWidth: 650 }}>{step.text}</p>
                    </div>
                  </div>

                  {/* Step placeholders */}
                  <div className="step-images" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginLeft: 92 }}>
                    {(stepPlaceholders[idx] || ["Скриншот результата", "Визуализация процесса"]).map((ph, pIdx) => (
                      <Placeholder key={pIdx} text={ph} />
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* ═══ SECTION: RESULTS ═══ */}
            <section ref={setRef("results")} className="case-section" id="results">
              <SectionHeading num="05" title="РЕЗУЛЬТАТЫ" sub="Цифры говорят сами за себя" />

              {/* Big numbers */}
              <div className="results-big" style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 48,
              }}>
                {d.results.map((r, i) => (
                  <div key={i} className="metric-card" style={{
                    padding: "32px 28px", background: V.card, border: `1px solid ${V.divider}`,
                    borderRadius: V.radius, textAlign: "center", position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: `linear-gradient(90deg, ${V.accent}, transparent)`, opacity: 0.5,
                    }} />
                    <div style={{ fontFamily: V.heading, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: V.accent, letterSpacing: "-0.04em", marginBottom: 10, lineHeight: 1 }}>{r.v}</div>
                    <div style={{ fontSize: "0.8rem", color: V.muted, fontWeight: 600, lineHeight: 1.5 }}>{r.l}</div>
                  </div>
                ))}
              </div>

              <Placeholder text="График роста ключевых метрик по месяцам (заявки, выручка, конверсия)" ratio="16/9" />
              <Placeholder text="Диаграмма распределения лидов по каналам: Google Ads, SEO, GBP, Direct Mail, Рефералы" />
              <Placeholder text="Скриншот дашборда аналитики: Looker Studio / Google Analytics с воронкой конверсий" ratio="16/9" />
            </section>

            {/* ═══ SECTION: REVIEW ═══ */}
            <section ref={setRef("review")} className="case-section" id="review">
              <SectionHeading num="06" title="ОТЗЫВ" sub="Что говорит клиент" />

              {/* Quote */}
              <div style={{
                padding: "56px 48px", background: V.accentDim, border: `1px solid rgba(160,28,45,0.08)`,
                borderRadius: V.radius, marginBottom: 40, position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: 16, left: 36,
                  fontFamily: V.heading, fontSize: "6rem", fontWeight: 900, color: V.accent, opacity: 0.10, lineHeight: 1,
                }}>❝</div>
                <blockquote style={{
                  fontFamily: V.body, fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 500,
                  color: V.bright, lineHeight: 1.75, margin: 0, marginBottom: 32,
                  fontStyle: "italic", position: "relative", zIndex: 1,
                }}>
                  Placeholder для отзыва клиента. Здесь должна быть цитата о том, как сотрудничество с Bankai Agency помогло бизнесу выйти на новый уровень — конкретные результаты, качество коммуникации, скорость работы.
                </blockquote>
                <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: `linear-gradient(135deg, ${c.color1}, ${c.color3})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.4rem",
                  }}>👤</div>
                  <div>
                    <div style={{ fontFamily: V.heading, fontSize: "0.95rem", fontWeight: 800, color: V.bright }}>Имя клиента</div>
                    <div style={{ fontSize: "0.78rem", color: V.dim, fontWeight: 500 }}>CEO / Founder</div>
                  </div>
                  <div style={{
                    marginLeft: "auto",
                    padding: "6px 16px", background: "rgba(160,28,45,0.08)", border: `1px solid rgba(160,28,45,0.12)`,
                    borderRadius: 100, fontSize: "0.72rem", color: V.accent, fontWeight: 700,
                  }}>✓ Рекомендует</div>
                </div>
              </div>

              <Placeholder text="Видео-отзыв клиента (YouTube embed или MP4)" ratio="16/9" />
            </section>

            {/* ═══ CTA ═══ */}
            <div style={{
              marginTop: 60, padding: "64px 52px", borderRadius: V.radius,
              background: `linear-gradient(135deg, ${c.color1}, ${c.color2})`,
              textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3 style={{
                  fontFamily: V.heading, fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 900,
                  color: "#fff", letterSpacing: "-0.04em", marginBottom: 16, lineHeight: 1.1,
                }}>{t.caseDetail?.ctaTitle || "Хотите так же?"}</h3>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", marginBottom: 36, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 36px" }}>
                  {t.caseDetail?.ctaSub || "Расскажите о вашем бизнесе — обсудим стратегию"}
                </p>
                <Link href={`/${locale}/#contact`} className="cta-btn" style={{ fontSize: "0.95rem", padding: "18px 48px" }}>
                  {t.caseDetail?.ctaButton || "Обсудить проект"}
                </Link>
              </div>
            </div>

            {/* ═══ OTHER CASES ═══ */}
            <div style={{ marginTop: 100 }}>
              <div style={{
                fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 800,
                letterSpacing: "0.18em", textTransform: "uppercase", color: V.muted, marginBottom: 28,
              }}>{t.caseDetail?.otherCases || "Другие кейсы"}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cases.filter(x => x.slug !== slug).slice(0, 3).map((oc, i) => (
                  <Link key={i} href={`/${locale}/cases/${oc.slug}`} className="oc-link" style={{
                    display: "flex", alignItems: "center", gap: 20, padding: "20px 24px",
                    background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radiusSm,
                    textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg, ${oc.color1}, ${oc.color3})` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: V.heading, fontSize: "0.85rem", fontWeight: 800, color: V.bright, letterSpacing: "-0.02em" }}>{oc.client}</div>
                      <div style={{ fontSize: "0.72rem", color: V.muted, marginTop: 2 }}>{oc.tag}</div>
                    </div>
                    <div style={{ fontFamily: V.heading, fontSize: "1rem", fontWeight: 900, color: V.bright, flexShrink: 0 }}>{oc.result}</div>
                    <span style={{ color: V.muted, fontSize: "0.85rem" }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
