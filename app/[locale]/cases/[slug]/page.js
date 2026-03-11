"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCases, V } from "../data";
import { getDictionary } from "../../../i18n";

/* ── Fonts ── */
const F = {
  head: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

/* ── Tokens ── */
const T = {
  black: "#0a0a0a",
  dark: "#1a1a1a",
  body: "#333",
  secondary: "#555",
  muted: "#888",
  light: "#bbb",
  border: "#e5e5e5",
  bg: "#fff",
  bgSoft: "#f5f5f5",
  accent: V.accent,
  accentSoft: "rgba(160,28,45,0.06)",
  r: 16,
};

/* ── Wrap — единый контейнер для всей страницы ── */
const W = ({ children, style, className }) => (
  <div className={className} style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px", ...style }}>{children}</div>
);

/* ── Image placeholder ── */
const ImgBlock = ({ text, aspect = "56.25%", bg = T.bgSoft }) => (
  <div style={{
    position: "relative", width: "100%", paddingBottom: aspect,
    background: bg, borderRadius: T.r, overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 8, padding: 40,
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.light} strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <div style={{ fontSize: 13, color: T.muted, textAlign: "center", lineHeight: 1.5, maxWidth: "55%", fontFamily: F.body }}>{text}</div>
    </div>
  </div>
);

/* ── CSS ── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}

.ch-back{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.55);text-decoration:none;transition:all .25s;letter-spacing:0.04em;font-family:${F.body};text-transform:uppercase}
.ch-back:hover{color:#fff}

.ch-visit{display:inline-flex;align-items:center;gap:10px;padding:14px 28px;border-radius:100px;background:rgba(255,255,255,0.12);backdrop-filter:blur(12px);color:#fff;font-size:13px;font-weight:600;text-decoration:none;font-family:${F.head};letter-spacing:0.04em;transition:all .3s;text-transform:uppercase;border:1px solid rgba(255,255,255,0.15)}
.ch-visit:hover{background:rgba(255,255,255,0.2);transform:translateY(-2px)}

.ch-tag{padding:5px 14px;border-radius:6px;font-size:12px;font-weight:600;background:${T.bgSoft};color:${T.secondary};font-family:${F.body};letter-spacing:0.03em;text-transform:uppercase}

/* metric card */
.ch-mc{transition:all .3s}
.ch-mc:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.06)}

/* step */
.ch-step{margin-bottom:64px}
.ch-step:last-child{margin-bottom:0}

/* scope tag */
.ch-scope{padding:7px 16px;border-radius:100px;font-size:13px;font-weight:500;background:${T.bgSoft};color:${T.secondary};font-family:${F.body};transition:all .2s;border:1px solid transparent}
.ch-scope:hover{background:${T.accentSoft};color:${T.accent};border-color:rgba(160,28,45,0.1)}

/* cta */
.ch-cta-btn{display:inline-flex;align-items:center;gap:10px;padding:16px 36px;border:none;border-radius:100px;background:#fff;color:${T.black};font-size:15px;font-weight:700;cursor:pointer;transition:all .3s;text-decoration:none;font-family:${F.head};letter-spacing:0.01em}
.ch-cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(255,255,255,0.2)}

/* other case */
.ch-oc{display:flex;align-items:center;gap:16px;padding:20px 24px;border-radius:${T.r}px;text-decoration:none;transition:all .3s;background:${T.bgSoft};border:1px solid transparent}
.ch-oc:hover{background:#fff;border-color:${T.border};box-shadow:0 4px 20px rgba(0,0,0,0.04)}

/* two-col grid */
.ch-two{display:grid;grid-template-columns:1fr 1fr;gap:16px}

@media(max-width:768px){
  .ch-hero-title{font-size:2.2rem!important}
  .ch-two{grid-template-columns:1fr!important}
  .ch-results-grid{grid-template-columns:1fr 1fr!important}
  .ch-meta-row{flex-direction:column!important;align-items:flex-start!important;gap:12px!important}
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

  /* ── Reusable section label (small uppercase) ── */
  const Label = ({ children }) => (
    <div style={{
      fontFamily: F.head, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: T.muted, marginBottom: 20,
    }}>{children}</div>
  );

  /* ── Section title ── */
  const Title = ({ children, center }) => (
    <h2 style={{
      fontFamily: F.head, fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700,
      color: T.black, letterSpacing: "-0.03em", lineHeight: 1.15,
      margin: "0 0 20px", textTransform: "uppercase",
      textAlign: center ? "center" : "left",
    }}>{children}</h2>
  );

  /* ── Spacing ── */
  const S = ({ h = 80 }) => <div style={{ height: h }} />;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div style={{ minHeight: "100vh", fontFamily: F.body, color: T.body, background: T.bg }}>

        {/* ═══ HERO ═══ */}
        <div style={{
          width: "100%", minHeight: "100vh", position: "relative", overflow: "hidden",
          background: `linear-gradient(160deg, ${c.color1}, ${c.color2}, ${c.color3})`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ position: "absolute", top: "5%", right: "10%", width: "50%", height: "50%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}18, transparent 60%)` }} />
          <div style={{ position: "absolute", bottom: "10%", left: "5%", width: "40%", height: "40%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}12, transparent 65%)` }} />

          {/* Top nav */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 5 }}>
            <Link href={`/${locale}/#cases`} className="ch-back">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              {t.caseDetail?.backLink?.toUpperCase() || "НАЗАД К КЕЙСАМ"}
            </Link>
            <div style={{ position: "absolute", right: 40, display: "flex", gap: 2 }}>
              {["ru", "en"].map(l => (
                <Link key={l} href={`/${l}/cases/${slug}`} style={{
                  fontSize: 12, fontWeight: 600, textDecoration: "none", padding: "5px 12px", borderRadius: 6,
                  background: locale === l ? "rgba(255,255,255,0.15)" : "transparent",
                  color: locale === l ? "#fff" : "rgba(255,255,255,0.35)",
                  transition: "all .2s", fontFamily: F.body,
                }}>{l.toUpperCase()}</Link>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className="ch-hero-title" style={{
            fontFamily: F.head, fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)",
            fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 0.95,
            margin: 0, textAlign: "center", textTransform: "uppercase",
            position: "relative", zIndex: 2, padding: "0 40px",
          }}>{c.client}</h1>

          {/* Bottom CTA */}
          <div style={{ position: "absolute", bottom: 48, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 5 }}>
            <a href="#about" className="ch-visit">
              {locale === "ru" ? "ПОДРОБНЕЕ" : "LEARN MORE"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </a>
          </div>
        </div>

        {/* ═══ CONTENT — всё в одном контейнере ═══ */}
        <div id="about" style={{ scrollMarginTop: 40 }}>

          {/* ── О ПРОЕКТЕ ── */}
          <S h={80} />
          <W>
            <div className="ch-meta-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <Label>{locale === "ru" ? "О проекте" : "About"}</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {c.tag.split(" · ").map((tag, i) => (
                  <span key={i} className="ch-tag">{tag}</span>
                ))}
              </div>
            </div>

            <p style={{
              fontFamily: F.body, fontSize: "clamp(17px, 2vw, 22px)",
              color: T.body, lineHeight: 1.75, margin: "0 0 40px",
              maxWidth: 720,
            }}>{c.desc}</p>

            {/* Timeline + Model */}
            {(d.timeline || d.model) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 32, marginBottom: 48, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
                {d.timeline && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 6, fontFamily: F.head }}>{locale === "ru" ? "Срок" : "Timeline"}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.black, fontFamily: F.body }}>{d.timeline}</div>
                  </div>
                )}
                {d.model && (
                  <div style={{ maxWidth: 400 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 6, fontFamily: F.head }}>{locale === "ru" ? "Модель" : "Model"}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.secondary, fontFamily: F.body, lineHeight: 1.5 }}>{d.model}</div>
                  </div>
                )}
              </div>
            )}

            <ImgBlock text="Скриншот главной страницы сайта клиента / hero-изображение проекта" aspect="52%" />
          </W>

          {/* ── МЕТРИКИ ── */}
          <S h={80} />
          <W>
            <div className="ch-results-grid" style={{
              display: "grid", gridTemplateColumns: `repeat(${Math.min(c.metrics.length, 4)}, 1fr)`, gap: 12,
            }}>
              {c.metrics.map((m, i) => (
                <div key={i} className="ch-mc" style={{
                  padding: "28px 16px", borderRadius: T.r, textAlign: "center", background: T.bgSoft,
                }}>
                  <div style={{ fontFamily: F.head, fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 700, color: T.black, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>{m.v}</div>
                  <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, lineHeight: 1.4, fontFamily: F.body }}>{m.l}</div>
                </div>
              ))}
            </div>
          </W>

          {/* ── ДО / ПОСЛЕ ── */}
          {c.beforeAfter && (
            <>
              <S h={80} />
              <W>
                <Label>{locale === "ru" ? "Трансформация" : "Transformation"}</Label>
                <div className="ch-two" style={{ marginTop: 16 }}>
                  <div style={{ padding: "28px 24px", borderRadius: T.r, background: T.bgSoft }}>
                    <div style={{ fontFamily: F.head, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 14 }}>{t.caseDetail?.before || "ДО"}</div>
                    <p style={{ fontSize: 15, color: T.secondary, lineHeight: 1.75, margin: 0, fontFamily: F.body }}>{c.beforeAfter.before}</p>
                  </div>
                  <div style={{ padding: "28px 24px", borderRadius: T.r, background: T.black }}>
                    <div style={{ fontFamily: F.head, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>{t.caseDetail?.after || "ПОСЛЕ"}</div>
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: 0, fontFamily: F.body }}>{c.beforeAfter.after}</p>
                  </div>
                </div>

                <S h={24} />
                <div className="ch-two">
                  <ImgBlock text="Скриншот до начала работы" aspect="72%" bg="#eaeaea" />
                  <ImgBlock text="Скриншот после" aspect="72%" bg="#e2e2e2" />
                </div>
              </W>
            </>
          )}

          {/* ── ЗАДАЧА ── */}
          <S h={80} />
          <W>
            <Label>{locale === "ru" ? "Задача" : "Challenge"}</Label>
            <p style={{
              fontFamily: F.body, fontSize: "clamp(16px, 1.8vw, 19px)",
              color: T.secondary, lineHeight: 1.8, margin: "0 0 40px",
              maxWidth: 720,
            }}>{d.challenge}</p>
            <ImgBlock text="Схема маркетинговой воронки / структура проекта" aspect="44%" bg="#eaeaea" />
          </W>

          {/* ── ЧТО МЫ СДЕЛАЛИ ── */}
          <S h={80} />
          <W>
            <Label>{locale === "ru" ? "Что мы сделали" : "What we did"}</Label>
            <S h={16} />
            {d.solution.map((step, idx) => (
              <div key={idx} className="ch-step">
                <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 }}>
                  <span style={{ fontFamily: F.head, fontSize: 48, fontWeight: 700, color: T.border, lineHeight: 1, letterSpacing: "-0.04em", flexShrink: 0 }}>{String(idx + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontFamily: F.head, fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: 700, color: T.black, margin: 0, lineHeight: 1.25, letterSpacing: "-0.02em" }}>{step.title}</h3>
                </div>
                <p style={{ fontSize: 15, color: T.secondary, lineHeight: 1.8, margin: "0 0 24px", maxWidth: 640, fontFamily: F.body, paddingLeft: 0 }}>{step.text}</p>
                <ImgBlock text={`Визуализация: ${step.title}`} aspect="52%" bg="#ebebeb" />
              </div>
            ))}
          </W>

          {/* ── УСЛУГИ ── */}
          <S h={48} />
          <W>
            <Label>{t.caseDetail?.scope || "Услуги и инструменты"}</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {c.scope.map((s, j) => (
                <span key={j} className="ch-scope">{s}</span>
              ))}
            </div>
          </W>

          {/* ── РЕЗУЛЬТАТЫ ── */}
          <S h={80} />
          <W>
            <Title>{locale === "ru" ? "Результаты" : "Results"}</Title>

            <div className="ch-results-grid" style={{
              display: "grid", gridTemplateColumns: `repeat(${Math.min(d.results.length, 3)}, 1fr)`,
              gap: 12, marginTop: 24, marginBottom: 40,
            }}>
              {d.results.map((r, i) => (
                <div key={i} className="ch-mc" style={{
                  padding: "32px 16px", borderRadius: T.r, textAlign: "center", background: T.bgSoft,
                }}>
                  <div style={{ fontFamily: F.head, fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: T.accent, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 8, whiteSpace: "nowrap" }}>{r.v}</div>
                  <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, lineHeight: 1.4, fontFamily: F.body }}>{r.l}</div>
                </div>
              ))}
            </div>

            <ImgBlock text="График роста ключевых метрик по месяцам" aspect="48%" bg="#eaeaea" />
            <S h={16} />
            <div className="ch-two">
              <ImgBlock text="Дашборд аналитики" aspect="72%" bg="#ebebeb" />
              <ImgBlock text="Распределение лидов по каналам" aspect="72%" bg="#e5e5e5" />
            </div>
          </W>

          {/* ── ОТЗЫВ ── */}
          <S h={80} />
          <W>
            <Label>{locale === "ru" ? "Отзыв клиента" : "Client review"}</Label>
            <div style={{ padding: "40px 36px", borderRadius: T.r, background: T.bgSoft, position: "relative" }}>
              <div style={{ position: "absolute", top: 12, left: 28, fontFamily: "Georgia, serif", fontSize: 72, fontWeight: 900, color: T.accent, opacity: 0.06, lineHeight: 1 }}>&ldquo;</div>
              <blockquote style={{
                fontFamily: F.body, fontSize: "clamp(16px, 1.8vw, 19px)", fontWeight: 400,
                color: T.dark, lineHeight: 1.75, margin: "0 0 28px",
                fontStyle: "normal", position: "relative", zIndex: 1,
              }}>
                Placeholder для отзыва клиента. Здесь должна быть цитата о том, как сотрудничество с Bankai Agency помогло бизнесу выйти на новый уровень.
              </blockquote>
              <div style={{ height: 1, background: T.border, marginBottom: 20 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${c.color1}, ${c.color3})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: F.head, fontSize: 18, fontWeight: 700, color: "#fff",
                }}>{c.client[0]}</div>
                <div>
                  <div style={{ fontFamily: F.head, fontSize: 15, fontWeight: 600, color: T.dark }}>Имя клиента</div>
                  <div style={{ fontSize: 13, color: T.muted }}>CEO / Founder</div>
                </div>
              </div>
            </div>
          </W>

          {/* ── CTA ── */}
          <S h={80} />
          <W>
            <div style={{
              borderRadius: 20, background: T.black, textAlign: "center",
              padding: "64px 40px",
            }}>
              <h3 style={{
                fontFamily: F.head, fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700,
                color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15,
                margin: "0 0 12px", textTransform: "uppercase",
              }}>{t.caseDetail?.ctaTitle || "Хотите похожий результат?"}</h3>
              <p style={{
                fontFamily: F.body, fontSize: 15, color: "rgba(255,255,255,0.4)",
                lineHeight: 1.6, maxWidth: 400, margin: "0 auto 28px",
              }}>{t.caseDetail?.ctaSub || "Расскажите о вашем проекте — обсудим, как мы можем помочь"}</p>
              <Link href={`/${locale}/#contact`} className="ch-cta-btn">
                {t.caseDetail?.ctaButton || "ОБСУДИТЬ ПРОЕКТ →"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </Link>
            </div>
          </W>

          {/* ── ДРУГИЕ КЕЙСЫ ── */}
          <S h={80} />
          <W style={{ paddingBottom: 100 }}>
            <Label>{t.caseDetail?.otherCases || "Другие кейсы"}</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cases.filter(x => x.slug !== slug).slice(0, 3).map((oc, i) => (
                <Link key={i} href={`/${locale}/cases/${oc.slug}`} className="ch-oc">
                  <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg, ${oc.color1}, ${oc.color3})` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F.head, fontSize: 16, fontWeight: 600, color: T.black }}>{oc.client}</div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2, fontFamily: F.body }}>{oc.tag}</div>
                  </div>
                  <div style={{ fontFamily: F.head, fontSize: 16, fontWeight: 700, color: T.black, flexShrink: 0 }}>{oc.result}</div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.light} strokeWidth="2" style={{ flexShrink: 0 }}><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </Link>
              ))}
            </div>
          </W>

        </div>
      </div>
    </>
  );
}
