"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCases, V } from "../data";
import { getDictionary } from "../../../i18n";

/* ── Fonts — Space Grotesk (headings) + DM Sans (body) ── */
const F = {
  head: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

/* ── Design tokens ── */
const T = {
  black: "#0a0a0a",
  dark: "#1a1a1a",
  body: "#333",
  secondary: "#555",
  muted: "#888",
  light: "#bbb",
  border: "#e5e5e5",
  bg: "#fff",
  bgSoft: "#f2f2f2",
  stepNum: "#e0e0e0",
  accent: V.accent,
  accentSoft: "rgba(160,28,45,0.07)",
  r: 16,
};

/* ── Image placeholder ── */
const ImgBlock = ({ text, aspect = "56.25%", bg = T.bgSoft }) => (
  <div style={{
    position: "relative", width: "100%", paddingBottom: aspect,
    background: bg, borderRadius: T.r, overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 10, padding: 40,
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.light} strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <div style={{ fontSize: 14, color: T.muted, textAlign: "center", lineHeight: 1.5, maxWidth: "60%", fontFamily: F.body }}>{text}</div>
    </div>
  </div>
);

/* ── CSS ── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}

.ch-back{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:rgba(255,255,255,0.6);text-decoration:none;transition:all .25s;letter-spacing:0.02em;font-family:${F.body}}
.ch-back:hover{color:#fff}
.ch-back:hover svg{transform:rotate(45deg)}

.ch-visit{display:inline-flex;align-items:center;gap:10px;padding:16px 28px;border-radius:12px;background:#fff;color:${T.black};font-size:14px;font-weight:700;text-decoration:none;font-family:${F.head};letter-spacing:0.01em;transition:all .3s;text-transform:uppercase}
.ch-visit:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.15)}

.ch-tag{padding:6px 16px;border-radius:8px;font-size:13px;font-weight:600;background:${T.black};color:#fff;font-family:${F.body};letter-spacing:0.03em}

/* content blocks */
.ch-content-block{max-width:880px;margin:0 auto;padding:0 32px}
.ch-full-block{width:100%;padding:0}

/* metric card */
.ch-mc{transition:all .3s}
.ch-mc:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,0.08)}

/* step */
.ch-step{margin-bottom:80px}
.ch-step-num{font-family:${F.head};font-size:64px;font-weight:700;color:${T.stepNum};line-height:1;margin-bottom:12px;letter-spacing:-0.04em}

/* scope tag */
.ch-scope{padding:8px 18px;border-radius:100px;font-size:13px;font-weight:500;background:${T.bgSoft};color:${T.secondary};font-family:${F.body};transition:all .2s;border:1px solid transparent}
.ch-scope:hover{background:${T.accentSoft};color:${T.accent};border-color:rgba(160,28,45,0.12)}

/* cta */
.ch-cta-btn{display:inline-flex;align-items:center;gap:10px;padding:18px 40px;border:none;border-radius:100px;background:#fff;color:${T.black};font-size:16px;font-weight:700;cursor:pointer;transition:all .3s;text-decoration:none;font-family:${F.head};letter-spacing:0.01em}
.ch-cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(255,255,255,0.2)}

/* other case */
.ch-oc{display:flex;align-items:center;gap:20px;padding:24px 28px;border-radius:${T.r}px;text-decoration:none;transition:all .3s;background:${T.bgSoft};border:1px solid transparent}
.ch-oc:hover{background:#fff;border-color:${T.border};box-shadow:0 4px 20px rgba(0,0,0,0.05)}

@media(max-width:768px){
  .ch-hero-title{font-size:2.5rem!important}
  .ch-two-col{grid-template-columns:1fr!important}
  .ch-results-grid{grid-template-columns:1fr 1fr!important}
  .ch-step-num{font-size:40px!important}
  .ch-content-block{padding:0 20px}
  .ch-meta-row{flex-direction:column!important;align-items:flex-start!important;gap:16px!important}
}
@media(max-width:480px){
  .ch-results-grid{grid-template-columns:1fr!important}
}
`;

export default function CasePage() {
  const { slug, locale } = useParams();
  const t = getDictionary(locale);
  const cases = getCases(locale);
  const c = cases.find(x => x.slug === slug);

  if (!c) return (
    <div style={{ padding: 80, textAlign: "center", fontFamily: F.body, color: T.muted }}>
      {t.caseDetail?.notFound || "Not found"}
    </div>
  );
  const d = c.detail;

  /* ── Section title — chipsa editorial ── */
  const SectionTitle = ({ children }) => (
    <h2 style={{
      fontFamily: F.head, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
      color: T.black, letterSpacing: "-0.035em", lineHeight: 1.1,
      margin: "0 0 24px", textTransform: "uppercase",
    }}>{children}</h2>
  );

  /* ── Spacer ── */
  const Space = ({ h = 120 }) => <div style={{ height: h }} />;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div style={{ minHeight: "100vh", fontFamily: F.body, color: T.body, background: T.bg }}>

        {/* ═══ HERO — full-screen, chipsa style ═══ */}
        <div className="case-hero" style={{
          width: "100%", minHeight: "100vh", position: "relative", overflow: "hidden",
          background: `linear-gradient(160deg, ${c.color1}, ${c.color2}, ${c.color3})`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          {/* Subtle ambient shapes */}
          <div style={{ position: "absolute", top: "5%", right: "10%", width: "50%", height: "50%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}20, transparent 60%)` }} />
          <div style={{ position: "absolute", bottom: "10%", left: "5%", width: "40%", height: "40%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}15, transparent 65%)` }} />
          <div style={{
            position: "absolute", inset: 0, opacity: 0.025,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />

          {/* Top bar — back link */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 5,
          }}>
            <Link href={`/${locale}/#cases`} className="ch-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transition: "transform .3s" }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              {t.caseDetail?.backLink?.toUpperCase() || "НАЗАД КО ВСЕМ КЕЙСАМ"}
            </Link>

            {/* Lang switcher — top right */}
            <div style={{ position: "absolute", right: 40, display: "flex", gap: 2 }}>
              {["ru", "en"].map(l => (
                <Link key={l} href={`/${l}/cases/${slug}`} style={{
                  fontSize: 12, fontWeight: 600, textDecoration: "none", padding: "5px 12px", borderRadius: 6,
                  background: locale === l ? "rgba(255,255,255,0.15)" : "transparent",
                  color: locale === l ? "#fff" : "rgba(255,255,255,0.4)",
                  transition: "all .2s", fontFamily: F.body,
                }}>{l.toUpperCase()}</Link>
              ))}
            </div>
          </div>

          {/* Giant centered title */}
          <h1 className="ch-hero-title" style={{
            fontFamily: F.head,
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 700, color: "#fff",
            letterSpacing: "-0.05em", lineHeight: 0.95,
            margin: 0, textAlign: "center", textTransform: "uppercase",
            position: "relative", zIndex: 2,
          }}>{c.client}</h1>

          {/* Bottom — visit site button */}
          <div style={{
            position: "absolute", bottom: 48, left: 0, right: 0,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 5,
          }}>
            <a href="#about" className="ch-visit" style={{ background: "#fff", color: T.black }}>
              {locale === "ru" ? "ПОДРОБНЕЕ" : "LEARN MORE"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </a>
          </div>
        </div>

        {/* ═══ О ПРОЕКТЕ — About section ═══ */}
        <div id="about" style={{ scrollMarginTop: 40 }}>
          <Space h={100} />

          <div className="ch-content-block">
            {/* Section header row */}
            <div className="ch-meta-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
              <SectionTitle>{locale === "ru" ? "О проекте" : "About"}</SectionTitle>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 8 }}>
                {c.tag.split(" · ").map((tag, i) => (
                  <span key={i} className="ch-tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Description — centered, large */}
            <p style={{
              fontFamily: F.body, fontSize: "clamp(18px, 2.2vw, 24px)",
              color: T.secondary, lineHeight: 1.7, textAlign: "center",
              maxWidth: 760, margin: "0 auto 48px",
            }}>{c.desc}</p>

            {/* Meta info */}
            {(d.timeline || d.model) && (
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
                {d.timeline && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted, marginBottom: 6, fontFamily: F.head }}>{locale === "ru" ? "Срок" : "Timeline"}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.accent, fontFamily: F.body }}>{d.timeline}</div>
                  </div>
                )}
                {d.model && (
                  <div style={{ textAlign: "center", maxWidth: 360 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted, marginBottom: 6, fontFamily: F.head }}>{locale === "ru" ? "Модель" : "Model"}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.secondary, fontFamily: F.body, lineHeight: 1.5 }}>{d.model}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Full-width image block */}
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
            <ImgBlock text="Скриншот главной страницы сайта клиента / hero-изображение проекта" aspect="52%" />
          </div>
        </div>

        {/* ═══ METRICS ═══ */}
        <Space h={100} />
        <div className="ch-content-block">
          <div className="ch-results-grid" style={{
            display: "grid", gridTemplateColumns: `repeat(${Math.min(c.metrics.length, 4)}, 1fr)`,
            gap: 16,
          }}>
            {c.metrics.map((m, i) => (
              <div key={i} className="ch-mc" style={{
                padding: "32px 24px", borderRadius: T.r, textAlign: "center",
                background: T.bgSoft,
              }}>
                <div style={{
                  fontFamily: F.head, fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700,
                  color: T.black, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8,
                }}>{m.v}</div>
                <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, lineHeight: 1.4 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ BEFORE / AFTER ═══ */}
        {c.beforeAfter && (
          <>
            <Space h={80} />
            <div className="ch-content-block">
              <SectionTitle>{locale === "ru" ? "Трансформация" : "Transformation"}</SectionTitle>
              <div className="ch-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 32 }}>
                <div style={{ padding: "32px 28px", borderRadius: T.r, background: T.bgSoft }}>
                  <div style={{
                    fontFamily: F.head, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: T.muted, marginBottom: 16,
                  }}>{t.caseDetail?.before || "ДО"}</div>
                  <p style={{ fontSize: 16, color: T.secondary, lineHeight: 1.75, margin: 0, fontFamily: F.body }}>{c.beforeAfter.before}</p>
                </div>
                <div style={{ padding: "32px 28px", borderRadius: T.r, background: T.black, color: "#fff" }}>
                  <div style={{
                    fontFamily: F.head, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 16,
                  }}>{t.caseDetail?.after || "ПОСЛЕ"}</div>
                  <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.75, margin: 0, fontFamily: F.body }}>{c.beforeAfter.after}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══ Full-width images row ═══ */}
        <Space h={80} />
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
          <div className="ch-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <ImgBlock text="Скриншот до начала работы" aspect="75%" bg="#e8e8e8" />
            <ImgBlock text="Скриншот после" aspect="75%" bg="#e0e0e0" />
          </div>
        </div>

        {/* ═══ CHALLENGE ═══ */}
        <Space h={80} />
        <div className="ch-content-block">
          <SectionTitle>{locale === "ru" ? "Задача" : "Challenge"}</SectionTitle>
          <p style={{
            fontFamily: F.body, fontSize: "clamp(17px, 2vw, 20px)",
            color: T.secondary, lineHeight: 1.8, textAlign: "left",
            maxWidth: 760, margin: "0 auto",
          }}>{d.challenge}</p>
        </div>

        {/* Full-width image */}
        <Space h={60} />
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
          <ImgBlock text="Схема маркетинговой воронки / структура проекта" aspect="42%" bg="#e8e8e8" />
        </div>

        {/* ═══ PROCESS ═══ */}
        <Space h={80} />
        <div className="ch-content-block">
          <SectionTitle>{locale === "ru" ? "Что мы сделали" : "What we did"}</SectionTitle>

          <Space h={48} />

          {d.solution.map((step, idx) => (
            <div key={idx} className="ch-step">
              <div className="ch-step-num">{String(idx + 1).padStart(2, "0")}</div>
              <h3 style={{
                fontFamily: F.head, fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700,
                color: T.black, margin: "0 0 14px", lineHeight: 1.2, letterSpacing: "-0.02em",
              }}>{step.title}</h3>
              <p style={{
                fontSize: 16, color: T.secondary, lineHeight: 1.8, margin: 0,
                maxWidth: 640, fontFamily: F.body,
              }}>{step.text}</p>

              <div style={{ marginTop: 32 }}>
                <ImgBlock text={`Визуализация: ${step.title}`} aspect="52%" bg="#ebebeb" />
              </div>
            </div>
          ))}
        </div>

        {/* ═══ SCOPE ═══ */}
        <Space h={40} />
        <div className="ch-content-block">
          <div style={{
            fontFamily: F.head, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: T.muted, marginBottom: 16,
          }}>{t.caseDetail?.scope || "Услуги и инструменты"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {c.scope.map((s, j) => (
              <span key={j} className="ch-scope">{s}</span>
            ))}
          </div>
        </div>

        {/* ═══ RESULTS ═══ */}
        <Space h={80} />
        <div className="ch-content-block">
          <SectionTitle>{locale === "ru" ? "Результаты" : "Results"}</SectionTitle>

          <div className="ch-results-grid" style={{
            display: "grid", gridTemplateColumns: `repeat(${Math.min(d.results.length, 3)}, 1fr)`,
            gap: 16, marginTop: 40, marginBottom: 48,
          }}>
            {d.results.map((r, i) => (
              <div key={i} className="ch-mc" style={{
                padding: "36px 20px", borderRadius: T.r, textAlign: "center", background: T.bgSoft,
              }}>
                <div style={{
                  fontFamily: F.head, fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700,
                  color: T.accent, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 10,
                  whiteSpace: "nowrap",
                }}>{r.v}</div>
                <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, lineHeight: 1.4, fontFamily: F.body }}>{r.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Full-width result images */}
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
          <ImgBlock text="График роста ключевых метрик по месяцам" aspect="48%" bg="#e8e8e8" />
          <Space h={16} />
          <div className="ch-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <ImgBlock text="Дашборд аналитики" aspect="72%" bg="#ebebeb" />
            <ImgBlock text="Распределение лидов по каналам" aspect="72%" bg="#e5e5e5" />
          </div>
        </div>

        {/* ═══ REVIEW ═══ */}
        <Space h={80} />
        <div className="ch-content-block">
          <SectionTitle>{locale === "ru" ? "Отзыв" : "Review"}</SectionTitle>

          <div style={{
            padding: "48px 40px", borderRadius: T.r, background: T.bgSoft,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 16, left: 32,
              fontFamily: "Georgia, serif", fontSize: 80, fontWeight: 900,
              color: T.accent, opacity: 0.08, lineHeight: 1,
            }}>&ldquo;</div>

            <blockquote style={{
              fontFamily: F.body, fontSize: "clamp(17px, 2vw, 20px)", fontWeight: 400,
              color: T.dark, lineHeight: 1.75, margin: "0 0 32px",
              fontStyle: "normal", position: "relative", zIndex: 1, textAlign: "left",
            }}>
              Placeholder для отзыва клиента. Здесь должна быть цитата о том, как сотрудничество с Bankai Agency помогло бизнесу выйти на новый уровень.
            </blockquote>

            <div style={{ height: 1, background: T.border, marginBottom: 24 }} />

            <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${c.color1}, ${c.color3})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: F.head, fontSize: 20, fontWeight: 700, color: "#fff",
              }}>{c.client[0]}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: F.head, fontSize: 16, fontWeight: 600, color: T.dark }}>Имя клиента</div>
                <div style={{ fontSize: 14, color: T.muted }}>CEO / Founder</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ CTA ═══ */}
        <Space h={80} />
        <div style={{
          margin: "0 32px", borderRadius: 24,
          background: T.black, textAlign: "center",
          padding: "80px 40px",
        }}>
          <h3 style={{
            fontFamily: F.head, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
            color: "#fff", letterSpacing: "-0.035em", lineHeight: 1.1,
            margin: "0 0 16px", textTransform: "uppercase",
          }}>{t.caseDetail?.ctaTitle || "Хотите так же?"}</h3>
          <p style={{
            fontFamily: F.body, fontSize: 17, color: "rgba(255,255,255,0.45)",
            lineHeight: 1.6, maxWidth: 440, margin: "0 auto 36px", fontWeight: 400,
          }}>{t.caseDetail?.ctaSub || "Расскажите о вашем бизнесе — обсудим стратегию"}</p>
          <Link href={`/${locale}/#contact`} className="ch-cta-btn">
            {t.caseDetail?.ctaButton || "ОБСУДИТЬ ПРОЕКТ →"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </Link>
        </div>

        {/* ═══ OTHER CASES ═══ */}
        <Space h={100} />
        <div className="ch-content-block" style={{ paddingBottom: 100 }}>
          <div style={{
            fontFamily: F.head, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: T.muted, marginBottom: 24,
          }}>{t.caseDetail?.otherCases || "Другие кейсы"}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cases.filter(x => x.slug !== slug).slice(0, 3).map((oc, i) => (
              <Link key={i} href={`/${locale}/cases/${oc.slug}`} className="ch-oc">
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${oc.color1}, ${oc.color3})`,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.head, fontSize: 17, fontWeight: 600, color: T.black }}>{oc.client}</div>
                  <div style={{ fontSize: 13, color: T.muted, marginTop: 2, fontFamily: F.body }}>{oc.tag}</div>
                </div>
                <div style={{ fontFamily: F.head, fontSize: 18, fontWeight: 700, color: T.black, flexShrink: 0 }}>{oc.result}</div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.light} strokeWidth="2" style={{ flexShrink: 0 }}><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
