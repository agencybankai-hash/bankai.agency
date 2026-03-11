"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCases, V } from "../data";
import { getDictionary } from "../../../i18n";

const Placeholder = ({ text, ratio = "16/9" }) => {
  const aspectRatio = ratio.split("/");
  const paddingBottom = (parseInt(aspectRatio[1]) / parseInt(aspectRatio[0])) * 100;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      paddingBottom: `${paddingBottom}%`,
      marginBottom: 24,
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        border: `2px dashed ${V.border}`,
        borderRadius: V.radiusSm,
        background: "rgba(0,0,0,0.01)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
      }}>
        <div style={{ fontSize: "2.5rem" }}>🖼️</div>
        <div style={{
          fontSize: "0.8rem",
          color: V.dim,
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: "80%",
        }}>{text}</div>
      </div>
    </div>
  );
};

const TabNav = ({ tabs, active, setActive }) => {
  const tabRefs = useRef([]);

  useEffect(() => {
    if (tabRefs.current[active]) {
      tabRefs.current[active].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [active]);

  return (
    <div style={{
      display: "flex",
      gap: 4,
      borderBottom: `1px solid ${V.divider}`,
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      scrollBehavior: "smooth",
    }}>
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          ref={el => tabRefs.current[idx] = el}
          onClick={() => setActive(idx)}
          style={{
            padding: "12px 20px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: V.body,
            fontSize: "0.85rem",
            fontWeight: 600,
            color: active === idx ? V.bright : V.dim,
            borderBottom: active === idx ? `2px solid ${V.accent}` : "2px solid transparent",
            transition: "all 0.3s",
            whiteSpace: "nowrap",
            position: "relative",
          }}
          onMouseEnter={e => {
            if (active !== idx) e.target.style.color = V.text;
          }}
          onMouseLeave={e => {
            if (active !== idx) e.target.style.color = V.dim;
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default function CasePage() {
  const { slug, locale } = useParams();
  const t = getDictionary(locale);
  const cases = getCases(locale);
  const c = cases.find(x => x.slug === slug);
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef(null);

  if (!c) return <div style={{ padding: 80, textAlign: "center", fontFamily: V.body, color: V.dim }}>{t.caseDetail.notFound}</div>;
  const d = c.detail;

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeTab]);

  const tabs = ["Обзор", "Процесс", "Результаты", "Отзыв"];

  const solutionPlaceholders = [
    [
      "Скриншот структуры рекламных кампаний в Google Ads",
      "Скриншот дашборда с ключевыми метриками: CTR, CPC, CPA, Conversions"
    ],
    [
      "Скриншот Google Business Profile с отзывами и постами",
      "Скриншот позиций в Google Maps по целевым запросам"
    ],
    [
      "Скриншот HubSpot CRM Pipeline с этапами сделок",
      "Пример email-последовательности для follow-up клиентов"
    ],
    [
      "Дизайн direct mail открытки для целевых районов",
      "Скриншот партнёрской программы с дизайнерами интерьеров"
    ],
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box}html{scroll-behavior:smooth}
        body{margin:0;background:${V.bg}}
        .case-back{display:inline-flex;align-items:center;gap:8px;font-size:0.8rem;font-weight:600;color:${V.dim};text-decoration:none;transition:all .3s;letter-spacing:0.02em}
        .case-back:hover{color:${V.accent};gap:12px}
        .sol-card{transition:all .35s cubic-bezier(.16,1,.3,1)}
        .sol-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.06);border-color:rgba(0,0,0,0.12)!important}
        .scope-tag{transition:all .3s}
        .scope-tag:hover{background:${V.accentDim}!important;border-color:rgba(160,28,45,0.15)!important;color:${V.accent}!important}
        .cta-btn{border:none;padding:16px 40px;border-radius:100px;background:${V.accent};color:#fff;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all .35s cubic-bezier(.16,1,.3,1);text-decoration:none;display:inline-block;font-family:${V.body}}
        .cta-btn:hover{background:${V.accentLit};transform:translateY(-2px);box-shadow:0 8px 32px rgba(160,28,45,0.25)}
        .lang-switch{display:inline-flex;gap:4px;position:absolute;top:28px;right:120px;z-index:10}
        .lang-switch a{font-size:0.7rem;font-weight:700;text-decoration:none;padding:4px 8px;border-radius:4px;transition:all .3s}
        .tab-sticky{position:sticky;top:0;background:${V.bg};z-index:20;backdrop-filter:blur(8px);background:rgba(250,248,245,0.95)}
        .step-number{font-family:${V.heading};font-size:clamp(3rem,8vw,6rem);font-weight:900;color:${V.accentDim};line-height:1;margin:0}
        .step-content{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;margin-bottom:80px}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeInUp 0.6s ease-out forwards;opacity:0}
        .metric-card{transition:all .3s}
        .metric-card:hover{transform:translateY(-2px)}
        @media(max-width:768px){
          .metrics-row{flex-direction:column!important;gap:16px!important;grid-template-columns:1fr!important}
          .sol-grid{grid-template-columns:1fr!important}
          .results-grid{grid-template-columns:1fr 1fr!important}
          .case-hero{min-height:360px!important}
          .case-hero h1{font-size:1.8rem!important}
          .case-tags{flex-wrap:wrap!important}
          .case-badge{padding:10px 16px!important}
          .case-badge .badge-val{font-size:1.2rem!important}
          .timeline-badges{flex-direction:column!important}
          .timeline-badges span{font-size:0.65rem!important}
          .lang-switch{right:60px}
          .step-content{grid-template-columns:1fr!important;gap:24px!important}
          .step-number{font-size:clamp(2rem,5vw,3rem)!important}
        }
        @media(max-width:480px){
          .results-grid{grid-template-columns:1fr!important}
          .case-hero{min-height:280px!important}
          .case-hero h1{font-size:1.4rem!important}
        }
      `}} />

      <div style={{ minHeight: "100vh", fontFamily: V.body, color: V.text }}>
        {/* hero image area */}
        <div className="case-hero" style={{
          width: "100%", minHeight: 480, position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, ${c.color1}, ${c.color2}, ${c.color3})`,
        }}>
          <div style={{
            position: "absolute", top: "15%", right: "10%", width: 300, height: 300, borderRadius: "50%",
            background: `radial-gradient(circle, ${c.accent}22, transparent 70%)`,
          }} />
          <div style={{
            position: "absolute", bottom: "10%", left: "5%", width: 200, height: 200, borderRadius: "50%",
            background: `radial-gradient(circle, ${c.accent}15, transparent 70%)`,
          }} />
          <div style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />
          <div style={{
            position: "absolute", bottom: 60, left: 0, right: 0,
            padding: "0 max(24px, calc((100% - 1100px)/2))",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
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
          </div>
          <div style={{
            position: "absolute", top: 28, left: 0, right: 0,
            padding: "0 max(24px, calc((100% - 1100px)/2))",
          }}>
            <Link href={`/${locale}/#cases`} className="case-back" style={{ color: "rgba(255,255,255,0.7)" }}>
              <span>←</span> {t.caseDetail.backLink}
            </Link>
          </div>
          <div className="lang-switch" style={{
            position: "absolute", top: 28, right: 0,
            padding: "0 max(24px, calc((100% - 1100px)/2))",
            display: "flex", gap: 4,
          }}>
            <Link href={`/ru/cases/${slug}`} style={{
              fontSize: "0.7rem", fontWeight: 700, textDecoration: "none",
              padding: "4px 8px", borderRadius: 4,
              background: locale === "ru" ? "rgba(255,255,255,0.2)" : "transparent",
              color: locale === "ru" ? "#fff" : "rgba(255,255,255,0.5)",
            }}>RU</Link>
            <Link href={`/en/cases/${slug}`} style={{
              fontSize: "0.7rem", fontWeight: 700, textDecoration: "none",
              padding: "4px 8px", borderRadius: 4,
              background: locale === "en" ? "rgba(255,255,255,0.2)" : "transparent",
              color: locale === "en" ? "#fff" : "rgba(255,255,255,0.5)",
            }}>EN</Link>
          </div>
          <div style={{
            position: "absolute", top: 68, right: 0,
            padding: "0 max(24px, calc((100% - 1100px)/2))",
          }}>
            <div style={{
              background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
              borderRadius: 12, padding: "16px 24px", textAlign: "center",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              <div style={{ fontFamily: V.heading, fontSize: "1.8rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{c.result}</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", fontWeight: 600, marginTop: 4 }}>{c.resultLabel}</div>
            </div>
          </div>
        </div>

        {/* content wrapper */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          {/* sticky tab nav */}
          <div className="tab-sticky">
            <TabNav tabs={tabs} active={activeTab} setActive={setActiveTab} />
          </div>

          {/* tab content */}
          <div ref={contentRef} style={{ padding: "40px 0 120px" }}>
            {/* TAB 0: OVERVIEW */}
            {activeTab === 0 && (
              <div>
                {/* Key metrics */}
                <div style={{ marginBottom: 56 }}>
                  <div style={{
                    fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
                    letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 24,
                  }}>Ключевые показатели</div>
                  <div style={{
                    display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: 16,
                  }}>
                    {d.results.map((r, i) => (
                      <div key={i} className="metric-card" style={{
                        padding: "20px 24px", background: V.card, border: `1px solid ${V.divider}`,
                        borderRadius: V.radiusSm,
                      }}>
                        <div style={{ fontFamily: V.heading, fontSize: "1.8rem", fontWeight: 900, color: V.bright, marginBottom: 8 }}>{r.v}</div>
                        <div style={{ fontSize: "0.75rem", color: V.muted, fontWeight: 500 }}>{r.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Before/After */}
                {c.beforeAfter && (
                  <div style={{ marginBottom: 56 }}>
                    <div style={{
                      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
                    }} className="metrics-row">
                      <div style={{
                        padding: "32px 28px", borderRadius: V.radius, background: "rgba(0,0,0,0.02)",
                        border: `1px solid ${V.divider}`,
                      }}>
                        <div style={{
                          fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
                          letterSpacing: "0.14em", textTransform: "uppercase", color: V.muted, marginBottom: 16,
                        }}>{t.caseDetail.before}</div>
                        <p style={{ fontSize: "0.88rem", color: V.dim, lineHeight: 1.8, margin: 0 }}>{c.beforeAfter.before}</p>
                      </div>
                      <div style={{
                        padding: "32px 28px", borderRadius: V.radius,
                        background: V.accentDim, border: `1px solid rgba(160,28,45,0.1)`,
                      }}>
                        <div style={{
                          fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
                          letterSpacing: "0.14em", textTransform: "uppercase", color: V.accent, marginBottom: 16,
                        }}>{t.caseDetail.after}</div>
                        <p style={{ fontSize: "0.88rem", color: V.text, lineHeight: 1.8, margin: 0 }}>{c.beforeAfter.after}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Headline & Description */}
                {c.headline && (
                  <div style={{ marginBottom: 40 }}>
                    <h2 style={{
                      fontFamily: V.heading, fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 800,
                      color: V.bright, letterSpacing: "-0.03em", lineHeight: 1.3, marginBottom: 16, maxWidth: 720,
                    }}>{c.headline}</h2>
                    <p style={{ fontSize: "0.95rem", color: V.text, lineHeight: 1.8, maxWidth: 720 }}>{c.desc}</p>
                  </div>
                )}

                {/* Timeline & Model */}
                {(d.timeline || d.model) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 56 }}>
                    {d.timeline && (
                      <span style={{
                        padding: "8px 16px", borderRadius: 8, background: V.accentDim,
                        border: `1px solid rgba(160,28,45,0.1)`,
                        fontSize: "0.75rem", fontWeight: 600, color: V.accent,
                      }}>{d.timeline}</span>
                    )}
                    {d.model && (
                      <span style={{
                        padding: "8px 16px", borderRadius: 8, background: "rgba(0,0,0,0.03)",
                        border: `1px solid ${V.border}`,
                        fontSize: "0.75rem", fontWeight: 500, color: V.dim,
                      }}>{d.model}</span>
                    )}
                  </div>
                )}

                {/* Scope tags */}
                <div style={{ marginBottom: 56 }}>
                  <div style={{
                    fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
                    letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 16,
                  }}>{t.caseDetail.scope}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {c.scope.map((s, j) => (
                      <span key={j} className="scope-tag" style={{
                        padding: "8px 16px", borderRadius: 100, background: "rgba(0,0,0,0.03)",
                        border: `1px solid ${V.border}`, fontSize: "0.75rem", color: V.dim, fontWeight: 500,
                      }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Placeholders */}
                <Placeholder text="Фото реализованного проекта клиента — кастомная кухня в премиум-доме" />
                <Placeholder text="Скриншот главной страницы сайта клиента" />
              </div>
            )}

            {/* TAB 1: PROCESS */}
            {activeTab === 1 && (
              <div>
                {/* Workflow diagram */}
                <Placeholder text="Общая схема маркетинговой воронки: Google Ads → Сайт → Форма/Звонок → CRM → Follow-up → Сделка" ratio="21/9" />

                {/* Challenge */}
                <div style={{ marginBottom: 56 }}>
                  <div style={{
                    fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
                    letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 16,
                  }}>{t.caseDetail.challenge}</div>
                  <p style={{ fontSize: "0.95rem", color: V.text, lineHeight: 1.8, maxWidth: 800 }}>{d.challenge}</p>
                </div>

                {/* Solution steps */}
                <div style={{
                  fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
                  letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 48,
                }}>{t.caseDetail.solution}</div>

                {d.solution.map((step, idx) => (
                  <div key={idx} style={{ marginBottom: 80 }}>
                    <div style={{ display: "flex", gap: 20, marginBottom: 32, alignItems: "flex-start" }}>
                      <div className="step-number">0{idx + 1}</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontFamily: V.heading, fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 800,
                          color: V.bright, letterSpacing: "-0.02em", marginBottom: 16, margin: 0,
                        }}>{step.title}</h3>
                        <p style={{
                          fontSize: "0.95rem", color: V.text, lineHeight: 1.8, maxWidth: 700,
                        }}>{step.text}</p>
                      </div>
                    </div>

                    {/* Step placeholders */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginLeft: "calc(clamp(3rem, 8vw, 6rem) + 20px)" }} className="metrics-row">
                      {solutionPlaceholders[idx] && solutionPlaceholders[idx].map((placeholder, pIdx) => (
                        <Placeholder key={pIdx} text={placeholder} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: RESULTS */}
            {activeTab === 2 && (
              <div>
                {/* Big numbers */}
                <div style={{
                  display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`, gap: 24, marginBottom: 56,
                }}>
                  {d.results.map((r, i) => (
                    <div key={i} style={{
                      padding: "32px 28px", background: V.card, border: `1px solid ${V.divider}`,
                      borderRadius: V.radius, textAlign: "center",
                    }}>
                      <div style={{ fontFamily: V.heading, fontSize: "clamp(2rem, 3vw, 3rem)", fontWeight: 900, color: V.accent, marginBottom: 12 }}>{r.v}</div>
                      <div style={{ fontSize: "0.8rem", color: V.muted, fontWeight: 500 }}>{r.l}</div>
                    </div>
                  ))}
                </div>

                {/* Growth chart */}
                <Placeholder text="График роста количества заявок по месяцам" ratio="16/9" />

                {/* Channel distribution */}
                <Placeholder text="Диаграмма распределения лидов по каналам: Google Ads, SEO, GBP, Direct Mail" ratio="16/9" />

                {/* Analytics dashboard */}
                <Placeholder text="Скриншот Looker Studio / Google Analytics дашборда с воронкой конверсий" ratio="16/9" />

                {/* Comparison table */}
                <Placeholder text="Таблица сравнения метрик: до начала работы vs текущие показатели" ratio="21/9" />
              </div>
            )}

            {/* TAB 3: REVIEW */}
            {activeTab === 3 && (
              <div>
                {/* Large quote */}
                <div style={{
                  padding: "48px 40px", background: V.accentDim, border: `2px dashed ${V.muted}`,
                  borderRadius: V.radius, marginBottom: 48, textAlign: "center",
                }}>
                  <div style={{
                    fontSize: "2.5rem", marginBottom: 20, opacity: 0.6,
                  }}>❝</div>
                  <blockquote style={{
                    fontFamily: V.heading, fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 700,
                    color: V.bright, lineHeight: 1.5, margin: 0, marginBottom: 24,
                    letterSpacing: "-0.02em",
                  }}>Placeholder для отзыва клиента. Здесь должна быть цитата о том, как наша работа помогла их бизнесу достичь результатов.</blockquote>
                  <div style={{ fontSize: "0.85rem", color: V.dim, fontWeight: 600 }}>— Имя клиента, должность</div>
                </div>

                {/* Video testimonial */}
                <Placeholder text="Видео-отзыв клиента (YouTube embed или MP4)" ratio="16/9" />

                {/* Client info */}
                <div style={{ marginBottom: 56 }}>
                  <div style={{
                    display: "flex", gap: 24, padding: "32px", background: V.card,
                    border: `1px solid ${V.divider}`, borderRadius: V.radius, alignItems: "center",
                  }}>
                    <div style={{
                      width: 100, height: 100, borderRadius: V.radius, flexShrink: 0,
                      background: `linear-gradient(135deg, ${c.color1}, ${c.color3})`,
                      border: `2px dashed ${V.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "2.5rem",
                    }}>👤</div>
                    <div>
                      <div style={{ fontFamily: V.heading, fontSize: "1.1rem", fontWeight: 700, color: V.bright, marginBottom: 4 }}>Имя клиента</div>
                      <div style={{ fontSize: "0.85rem", color: V.dim, marginBottom: 12 }}>CEO / Founder</div>
                      <div style={{
                        display: "inline-flex", gap: 8, padding: "6px 12px", background: V.accentDim,
                        border: `1px solid rgba(160,28,45,0.1)`, borderRadius: 100, fontSize: "0.75rem",
                        color: V.accent, fontWeight: 600,
                      }}>✓ Рекомендует нас</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA section */}
          <div style={{
            marginTop: 64, padding: "48px 40px", borderRadius: V.radius,
            background: `linear-gradient(135deg, ${c.color1}, ${c.color2})`,
            textAlign: "center",
          }}>
            <h3 style={{
              fontFamily: V.heading, fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 800,
              color: "#fff", letterSpacing: "-0.03em", marginBottom: 12,
            }}>{t.caseDetail.ctaTitle}</h3>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", marginBottom: 28, lineHeight: 1.6 }}>
              {t.caseDetail.ctaSub}
            </p>
            <Link href={`/${locale}/#contact`} className="cta-btn">
              {t.caseDetail.ctaButton}
            </Link>
          </div>

          {/* Other cases */}
          <div style={{ marginTop: 80, marginBottom: 40 }}>
            <div style={{
              fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 24,
            }}>{t.caseDetail.otherCases}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cases.filter(x => x.slug !== slug).slice(0, 3).map((oc, i) => (
                <Link key={i} href={`/${locale}/cases/${oc.slug}`} style={{
                  display: "flex", alignItems: "center", gap: 20, padding: "20px 24px",
                  background: V.card, border: `1px solid ${V.border}`, borderRadius: V.radiusSm,
                  textDecoration: "none", transition: "all .3s", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.14)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = V.border; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                    background: `linear-gradient(135deg, ${oc.color1}, ${oc.color3})`,
                  }} />
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
    </>
  );
}
