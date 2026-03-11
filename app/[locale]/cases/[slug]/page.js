"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCases, V } from "../data";
import { getDictionary } from "../../../i18n";

/* ── Local design tokens — Inter-based, vc.ru editorial ── */
const T = {
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  black: "#111",
  dark: "#1a1a1a",
  body: "#333",
  secondary: "#666",
  muted: "#999",
  light: "#ccc",
  border: "#e8e8e8",
  borderLight: "#f0f0f0",
  bg: "#fff",
  bgSoft: "#fafafa",
  accent: V.accent,
  accentSoft: "rgba(160,28,45,0.07)",
  r: 12,
};

/* ── Placeholder ── */
const Placeholder = ({ text, ratio = "16/9" }) => {
  const [a, b] = ratio.split("/").map(Number);
  return (
    <div style={{
      position: "relative", width: "100%", paddingBottom: `${(b / a) * 100}%`,
      marginBottom: 32,
    }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: T.r,
        border: `1.5px dashed ${T.border}`, background: T.bgSoft,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8, padding: 32,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.light} strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <div style={{ fontSize: 13, color: T.muted, textAlign: "center", lineHeight: 1.5, maxWidth: "75%" }}>{text}</div>
      </div>
    </div>
  );
};

/* ── CSS ── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box}html{scroll-behavior:smooth}

.case-back{display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:500;color:${T.muted};text-decoration:none;transition:color .2s}
.case-back:hover{color:${T.accent}}
.case-back svg{transition:transform .2s}
.case-back:hover svg{transform:translateX(-3px)}

/* sidebar */
.side-nav{position:relative;align-self:start}
.side-nav.stuck{position:sticky;top:32px}
.side-nav-item{display:flex;align-items:center;gap:12px;padding:8px 0;cursor:pointer;border:none;background:none;text-align:left;width:100%;transition:all .2s;font-family:${T.font}}
.side-nav-item:hover .snav-label{color:${T.dark}}
.snav-dot{width:5px;height:5px;border-radius:50%;background:${T.border};transition:all .3s;flex-shrink:0}
.snav-dot.active{width:6px;height:6px;background:${T.accent};box-shadow:0 0 0 3px ${T.accentSoft}}
.snav-label{font-size:14px;font-weight:500;color:${T.muted};transition:all .2s;line-height:1.3}
.snav-label.active{color:${T.dark};font-weight:600}
.snav-line-wrap{padding-left:2px}

/* sections */
.case-section{margin-bottom:80px;scroll-margin-top:80px}
.case-section:last-child{margin-bottom:32px}

/* metric card */
.mc{transition:box-shadow .2s}
.mc:hover{box-shadow:0 4px 24px rgba(0,0,0,0.06)}

/* step */
.step-row{position:relative;margin-bottom:56px}
.step-num{font-size:13px;font-weight:700;color:${T.muted};font-variant-numeric:tabular-nums;margin-bottom:8px}
.step-images{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px}

/* scope tag */
.stag{transition:all .2s}
.stag:hover{background:${T.accentSoft}!important;color:${T.accent}!important;border-color:rgba(160,28,45,0.15)!important}

/* other cases */
.oc-link{display:flex;align-items:center;gap:16px;padding:16px 20px;border:1px solid ${T.border};border-radius:${T.r}px;text-decoration:none;transition:all .2s;background:#fff}
.oc-link:hover{border-color:${T.light};box-shadow:0 2px 12px rgba(0,0,0,0.04)}

/* cta button */
.cta-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;border:none;border-radius:8px;background:${T.dark};color:#fff;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;font-family:${T.font}}
.cta-btn:hover{background:${T.black};transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.15)}

@media(max-width:1024px){
  .case-layout{grid-template-columns:1fr!important}
  .side-nav{position:sticky!important;top:0;z-index:20;display:flex;flex-wrap:wrap;gap:6px;
    padding:14px 0;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);
    border-bottom:1px solid ${T.border};margin-bottom:32px}
  .side-nav-item{padding:6px 14px;border-radius:100px;border:1px solid ${T.border};width:auto;gap:6px}
  .side-nav-item:has(.snav-dot.active){border-color:${T.accent};background:${T.accentSoft}}
  .snav-line-wrap{display:none}
  .step-images{grid-template-columns:1fr!important}
}
@media(max-width:768px){
  .case-hero-inner{padding:0 20px!important}
  .case-hero h1{font-size:28px!important}
  .two-col{grid-template-columns:1fr!important}
}
@media(max-width:480px){
  .results-grid{grid-template-columns:1fr!important}
}
`;

/* ── Main component ── */
export default function CasePage() {
  const { slug, locale } = useParams();
  const t = getDictionary(locale);
  const cases = getCases(locale);
  const c = cases.find(x => x.slug === slug);

  if (!c) return (
    <div style={{ padding: 80, textAlign: "center", fontFamily: T.font, color: T.muted }}>
      {t.caseDetail?.notFound || "Not found"}
    </div>
  );
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
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
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

  const stepPlaceholders = [
    ["Скриншот структуры рекламных кампаний в Google Ads", "Дашборд с ключевыми метриками: CTR, CPC, CPA, Conversions"],
    ["Скриншот Google Business Profile с отзывами и постами", "Позиции в Google Maps / Local Pack по целевым запросам"],
    ["Скриншот HubSpot CRM Pipeline с этапами сделок", "Пример email-последовательности для follow-up"],
    ["Дизайн direct mail открытки для целевых районов", "Схема партнёрской программы с дизайнерами интерьеров"],
  ];

  /* ── Section heading — editorial style ── */
  const SectionHead = ({ num, title, sub }) => (
    <div style={{ marginBottom: 40 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: sub ? 12 : 0,
      }}>
        <span style={{
          fontSize: 12, fontWeight: 600, color: T.accent,
          letterSpacing: "0.06em", fontVariantNumeric: "tabular-nums",
        }}>{num}</span>
        <span style={{
          width: 24, height: 1, background: T.accent, opacity: 0.3, display: "inline-block",
        }} />
        <span style={{
          fontSize: 12, fontWeight: 600, color: T.secondary,
          letterSpacing: "0.04em", textTransform: "uppercase",
        }}>{title}</span>
      </div>
      {sub && (
        <h2 style={{
          fontFamily: T.font, fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800,
          color: T.dark, letterSpacing: "-0.025em", lineHeight: 1.15, margin: 0,
        }}>{sub}</h2>
      )}
    </div>
  );

  /* ── Divider ── */
  const Divider = () => (
    <div style={{ height: 1, background: T.border, margin: "48px 0" }} />
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div style={{ minHeight: "100vh", fontFamily: T.font, color: T.body, background: T.bg }}>

        {/* ═══ HERO ═══ */}
        <div ref={heroRef} className="case-hero" style={{
          width: "100%", position: "relative", overflow: "hidden",
          background: `linear-gradient(160deg, ${c.color1}, ${c.color2}, ${c.color3})`,
        }}>
          {/* Subtle grain */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />

          <div className="case-hero-inner" style={{
            maxWidth: 1200, margin: "0 auto", padding: "0 32px",
            position: "relative", minHeight: 440,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            paddingBottom: 56, paddingTop: 28,
          }}>
            {/* Top bar */}
            <div style={{ position: "absolute", top: 28, left: 32, right: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link href={`/${locale}/#cases`} className="case-back" style={{ color: "rgba(255,255,255,0.65)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                {t.caseDetail?.backLink || "Все кейсы"}
              </Link>
              <div style={{ display: "flex", gap: 2 }}>
                {["ru", "en"].map(l => (
                  <Link key={l} href={`/${l}/cases/${slug}`} style={{
                    fontSize: 12, fontWeight: 600, textDecoration: "none", padding: "4px 10px", borderRadius: 6,
                    background: locale === l ? "rgba(255,255,255,0.18)" : "transparent",
                    color: locale === l ? "#fff" : "rgba(255,255,255,0.45)",
                    transition: "all .2s",
                  }}>{l.toUpperCase()}</Link>
                ))}
              </div>
            </div>

            {/* Result badge — top right */}
            <div style={{ position: "absolute", top: 72, right: 32 }}>
              <div style={{
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(16px)",
                borderRadius: 10, padding: "14px 22px", textAlign: "center",
                border: "1px solid rgba(255,255,255,0.12)",
              }}>
                <div style={{ fontFamily: T.font, fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{c.result}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500, marginTop: 4 }}>{c.resultLabel}</div>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {c.tag.split(" · ").map((tag, i) => (
                <span key={i} style={{
                  padding: "4px 10px", borderRadius: 5, fontSize: 11, fontWeight: 600,
                  background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)",
                  letterSpacing: "0.04em",
                }}>{tag}</span>
              ))}
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: T.font, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900,
              color: "#fff", letterSpacing: "-0.035em", lineHeight: 1.08, margin: 0,
            }}>{c.client}</h1>

            {c.headline && (
              <p style={{
                fontSize: "clamp(16px, 1.8vw, 19px)", color: "rgba(255,255,255,0.55)",
                marginTop: 14, maxWidth: 600, lineHeight: 1.6, fontWeight: 400,
              }}>{c.headline}</p>
            )}
          </div>
        </div>

        {/* ═══ LAYOUT ═══ */}
        <div className="case-layout" style={{
          maxWidth: 1200, margin: "0 auto", padding: "48px 32px 100px",
          display: "grid", gridTemplateColumns: "180px 1fr", gap: 56,
        }}>

          {/* ── Sidebar ── */}
          <nav className={`side-nav${heroGone ? " stuck" : ""}`}>
            {sections.map((s, i) => (
              <div key={s.id}>
                <button className="side-nav-item" onClick={() => scrollTo(s.id)}>
                  <span className={`snav-dot${activeSection === s.id ? " active" : ""}`} />
                  <span className={`snav-label${activeSection === s.id ? " active" : ""}`}>{s.label}</span>
                </button>
                {i < sections.length - 1 && (
                  <div className="snav-line-wrap" style={{ display: "flex", paddingLeft: 2 }}>
                    <div style={{
                      width: 1, height: 16,
                      background: sections.findIndex(x => x.id === activeSection) > i ? T.accent : T.border,
                      transition: "background .3s",
                      opacity: sections.findIndex(x => x.id === activeSection) > i ? 0.4 : 1,
                    }} />
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── Content ── */}
          <div>

            {/* ═══ OVERVIEW ═══ */}
            <section ref={setRef("overview")} className="case-section" id="overview">
              <SectionHead num="01" title="Обзор" sub={c.headline} />

              <p style={{ fontSize: 17, color: T.body, lineHeight: 1.8, maxWidth: 680, marginBottom: 36 }}>{c.desc}</p>

              {/* Meta badges */}
              {(d.timeline || d.model) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
                  {d.timeline && (
                    <span style={{
                      padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                      background: T.accentSoft, color: T.accent,
                    }}>{d.timeline}</span>
                  )}
                  {d.model && (
                    <span style={{
                      padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
                      background: T.bgSoft, border: `1px solid ${T.border}`, color: T.secondary,
                    }}>{d.model}</span>
                  )}
                </div>
              )}

              {/* Metrics */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12, marginBottom: 40,
              }}>
                {c.metrics.map((m, i) => (
                  <div key={i} className="mc" style={{
                    padding: "24px", background: T.bgSoft, borderRadius: T.r,
                    border: `1px solid ${T.borderLight}`,
                  }}>
                    <div style={{
                      fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800,
                      color: T.dark, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6,
                    }}>{m.v}</div>
                    <div style={{ fontSize: 13, color: T.secondary, fontWeight: 500, lineHeight: 1.4 }}>{m.l}</div>
                  </div>
                ))}
              </div>

              {/* Scope */}
              <div style={{ marginBottom: 36 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: "0.05em",
                  textTransform: "uppercase", marginBottom: 10,
                }}>{t.caseDetail?.scope || "Скоуп"}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.scope.map((s, j) => (
                    <span key={j} className="stag" style={{
                      padding: "5px 12px", borderRadius: 6, fontSize: 13, fontWeight: 500,
                      background: T.bgSoft, border: `1px solid ${T.border}`, color: T.secondary,
                    }}>{s}</span>
                  ))}
                </div>
              </div>

              <Placeholder text="Фото реализованного проекта или скриншот сайта клиента" />
            </section>

            {/* ═══ BEFORE / AFTER ═══ */}
            {c.beforeAfter && (
              <section ref={setRef("before-after")} className="case-section" id="before-after">
                <SectionHead num="02" title="Трансформация" sub="До и после" />

                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                  <div style={{
                    padding: "28px 24px", borderRadius: T.r,
                    background: T.bgSoft, border: `1px solid ${T.borderLight}`,
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                      textTransform: "uppercase", color: T.muted, marginBottom: 14,
                    }}>{t.caseDetail?.before || "До"}</div>
                    <p style={{ fontSize: 15, color: T.secondary, lineHeight: 1.75, margin: 0 }}>{c.beforeAfter.before}</p>
                  </div>

                  <div style={{
                    padding: "28px 24px", borderRadius: T.r,
                    background: T.accentSoft, borderLeft: `3px solid ${T.accent}`,
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                      textTransform: "uppercase", color: T.accent, marginBottom: 14,
                    }}>{t.caseDetail?.after || "После"}</div>
                    <p style={{ fontSize: 15, color: T.body, lineHeight: 1.75, margin: 0 }}>{c.beforeAfter.after}</p>
                  </div>
                </div>

                <Placeholder text="Сравнительный скриншот: состояние до начала работы vs текущие показатели" ratio="21/9" />
              </section>
            )}

            {/* ═══ CHALLENGE ═══ */}
            <section ref={setRef("challenge")} className="case-section" id="challenge">
              <SectionHead num="03" title="Задача" sub="С чем пришёл клиент" />

              <p style={{ fontSize: 17, color: T.body, lineHeight: 1.8, maxWidth: 680 }}>{d.challenge}</p>

              <div style={{ marginTop: 32 }}>
                <Placeholder text="Общая схема маркетинговой воронки: трафик → сайт → заявка → CRM → follow-up → сделка" ratio="21/9" />
              </div>
            </section>

            {/* ═══ PROCESS ═══ */}
            <section ref={setRef("process")} className="case-section" id="process">
              <SectionHead num="04" title="Процесс" sub="Что мы сделали" />

              {d.solution.map((step, idx) => (
                <div key={idx} className="step-row">
                  <div className="step-num">{String(idx + 1).padStart(2, "0")}</div>

                  <h3 style={{
                    fontFamily: T.font, fontSize: 20, fontWeight: 700,
                    color: T.dark, margin: "0 0 10px", lineHeight: 1.3,
                  }}>{step.title}</h3>

                  <p style={{ fontSize: 15, color: T.body, lineHeight: 1.75, margin: 0, maxWidth: 620 }}>{step.text}</p>

                  <div className="step-images">
                    {(stepPlaceholders[idx] || ["Скриншот результата", "Визуализация процесса"]).map((ph, pIdx) => (
                      <Placeholder key={pIdx} text={ph} />
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* ═══ RESULTS ═══ */}
            <section ref={setRef("results")} className="case-section" id="results">
              <SectionHead num="05" title="Результаты" sub="Цифры говорят сами" />

              <div className="results-grid" style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12, marginBottom: 48,
              }}>
                {d.results.map((r, i) => (
                  <div key={i} className="mc" style={{
                    padding: "28px 24px", borderRadius: T.r, textAlign: "center",
                    background: T.bgSoft, border: `1px solid ${T.borderLight}`,
                  }}>
                    <div style={{
                      fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800,
                      color: T.accent, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8,
                    }}>{r.v}</div>
                    <div style={{ fontSize: 13, color: T.secondary, fontWeight: 500, lineHeight: 1.4 }}>{r.l}</div>
                  </div>
                ))}
              </div>

              <Placeholder text="График роста ключевых метрик по месяцам (заявки, выручка, конверсия)" ratio="16/9" />
              <Placeholder text="Диаграмма распределения лидов по каналам: Google Ads, SEO, GBP, Direct Mail, Рефералы" />
              <Placeholder text="Скриншот дашборда аналитики: Looker Studio / Google Analytics с воронкой конверсий" ratio="16/9" />
            </section>

            {/* ═══ REVIEW ═══ */}
            <section ref={setRef("review")} className="case-section" id="review">
              <SectionHead num="06" title="Отзыв" sub="Что говорит клиент" />

              <div style={{
                padding: "40px 36px", borderRadius: T.r,
                background: T.bgSoft, border: `1px solid ${T.borderLight}`,
                marginBottom: 36, position: "relative",
              }}>
                {/* Quote mark */}
                <div style={{
                  position: "absolute", top: 20, left: 28,
                  fontSize: 64, fontWeight: 900, color: T.accent, opacity: 0.08, lineHeight: 1,
                  fontFamily: "Georgia, serif",
                }}>"</div>

                <blockquote style={{
                  fontFamily: T.font, fontSize: "clamp(17px, 2vw, 20px)", fontWeight: 400,
                  color: T.dark, lineHeight: 1.7, margin: "0 0 28px",
                  fontStyle: "normal", position: "relative", zIndex: 1,
                }}>
                  Placeholder для отзыва клиента. Здесь должна быть цитата о том, как сотрудничество с Bankai Agency помогло бизнесу выйти на новый уровень — конкретные результаты, качество коммуникации, скорость работы.
                </blockquote>

                <Divider />

                <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg, ${c.color1}, ${c.color3})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: "#fff",
                  }}>A</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.dark }}>Имя клиента</div>
                    <div style={{ fontSize: 13, color: T.muted }}>CEO / Founder</div>
                  </div>
                </div>
              </div>

              <Placeholder text="Видео-отзыв клиента (YouTube embed или MP4)" ratio="16/9" />
            </section>

            {/* ═══ CTA ═══ */}
            <div style={{
              marginTop: 32, padding: "52px 44px", borderRadius: T.r,
              background: T.dark, textAlign: "center",
            }}>
              <h3 style={{
                fontFamily: T.font, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800,
                color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.15, margin: "0 0 12px",
              }}>{t.caseDetail?.ctaTitle || "Хотите так же?"}</h3>
              <p style={{
                fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.6,
                maxWidth: 420, margin: "0 auto 28px", fontWeight: 400,
              }}>{t.caseDetail?.ctaSub || "Расскажите о вашем бизнесе — обсудим стратегию"}</p>
              <Link href={`/${locale}/#contact`} className="cta-btn" style={{
                background: "#fff", color: T.dark,
              }}>
                {t.caseDetail?.ctaButton || "Обсудить проект"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {/* ═══ OTHER CASES ═══ */}
            <div style={{ marginTop: 72 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: T.muted,
                letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20,
              }}>{t.caseDetail?.otherCases || "Другие кейсы"}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cases.filter(x => x.slug !== slug).slice(0, 3).map((oc, i) => (
                  <Link key={i} href={`/${locale}/cases/${oc.slug}`} className="oc-link">
                    <div style={{
                      width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                      background: `linear-gradient(135deg, ${oc.color1}, ${oc.color3})`,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: T.dark }}>{oc.client}</div>
                      <div style={{ fontSize: 13, color: T.muted, marginTop: 1 }}>{oc.tag}</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: T.dark, flexShrink: 0 }}>{oc.result}</div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
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
