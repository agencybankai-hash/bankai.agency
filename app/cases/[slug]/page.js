"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cases, V } from "../data";

export default function CasePage() {
  const { slug } = useParams();
  const c = cases.find(x => x.slug === slug);
  if (!c) return <div style={{ padding: 80, textAlign: "center", fontFamily: V.body, color: V.dim }}>Кейс не найден</div>;
  const d = c.detail;

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
        .scope-tag:hover{background:rgba(160,28,45,0.06)!important;border-color:rgba(160,28,45,0.15)!important;color:${V.accent}!important}
        .cta-btn{border:none;padding:16px 40px;border-radius:100px;background:${V.accent};color:#fff;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all .35s cubic-bezier(.16,1,.3,1);text-decoration:none;display:inline-block;font-family:${V.body}}
        .cta-btn:hover{background:${V.accentLit};transform:translateY(-2px);box-shadow:0 8px 32px rgba(160,28,45,0.25)}
        @media(max-width:768px){.metrics-row{flex-direction:column!important;gap:20px!important}.sol-grid{grid-template-columns:1fr!important}}
      `}} />

      <div style={{ minHeight: "100vh", fontFamily: V.body, color: V.text }}>
        {/* hero image area */}
        <div style={{
          width: "100%", minHeight: 480, position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, ${c.color1}, ${c.color2}, ${c.color3})`,
        }}>
          {/* decorative elements */}
          <div style={{
            position: "absolute", top: "15%", right: "10%", width: 300, height: 300, borderRadius: "50%",
            background: `radial-gradient(circle, ${c.accent}22, transparent 70%)`,
          }} />
          <div style={{
            position: "absolute", bottom: "10%", left: "5%", width: 200, height: 200, borderRadius: "50%",
            background: `radial-gradient(circle, ${c.accent}15, transparent 70%)`,
          }} />
          {/* grid pattern overlay */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />
          {/* client name on hero */}
          <div style={{
            position: "absolute", bottom: 60, left: 0, right: 0,
            padding: "0 max(24px, calc((100% - 1100px)/2))",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              {c.tag.split(" · ").map((t, i) => (
                <span key={i} style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: "0.58rem", fontWeight: 700,
                  background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)",
                  letterSpacing: "0.1em", backdropFilter: "blur(8px)",
                }}>{t}</span>
              ))}
            </div>
            <h1 style={{
              fontFamily: V.heading, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900,
              color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0,
              textShadow: "0 2px 40px rgba(0,0,0,0.3)",
            }}>{c.client}</h1>
          </div>
          {/* back button */}
          <div style={{
            position: "absolute", top: 28, left: 0, right: 0,
            padding: "0 max(24px, calc((100% - 1100px)/2))",
          }}>
            <Link href="/#cases" className="case-back" style={{ color: "rgba(255,255,255,0.7)" }}>
              <span>←</span> Назад к кейсам
            </Link>
          </div>
          {/* result badge */}
          <div style={{
            position: "absolute", top: 28, right: 0,
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

        {/* content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 120px" }}>
          {/* description */}
          <p style={{ fontSize: "1.1rem", color: V.text, lineHeight: 1.75, maxWidth: 720, marginBottom: 48 }}>{c.desc}</p>

          {/* metrics row */}
          <div className="metrics-row" style={{
            display: "flex", gap: 0, marginBottom: 64, padding: "32px 0",
            borderTop: `1px solid ${V.divider}`, borderBottom: `1px solid ${V.divider}`,
          }}>
            {d.results.map((r, i) => (
              <div key={i} style={{
                flex: 1, textAlign: "center",
                borderLeft: i > 0 ? `1px solid ${V.divider}` : "none",
                padding: "0 24px",
              }}>
                <div style={{ fontFamily: V.heading, fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 900, color: V.bright, letterSpacing: "-0.03em", marginBottom: 6 }}>{r.v}</div>
                <div style={{ fontSize: "0.72rem", color: V.muted, fontWeight: 500 }}>{r.l}</div>
              </div>
            ))}
          </div>

          {/* challenge */}
          <div style={{ marginBottom: 56 }}>
            <div style={{
              fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 16,
            }}>ЗАДАЧА</div>
            <p style={{ fontSize: "0.95rem", color: V.text, lineHeight: 1.8, maxWidth: 720 }}>{d.challenge}</p>
          </div>

          {/* solution */}
          <div style={{ marginBottom: 56 }}>
            <div style={{
              fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 24,
            }}>ЧТО МЫ СДЕЛАЛИ</div>
            <div className="sol-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {d.solution.map((s, i) => (
                <div key={i} className="sol-card" style={{
                  padding: "28px 28px", background: V.card,
                  border: `1px solid ${V.border}`, borderRadius: V.radius,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{
                      fontFamily: V.heading, fontSize: "1.6rem", fontWeight: 900,
                      color: "rgba(0,0,0,0.06)", lineHeight: 1,
                    }}>0{i + 1}</span>
                    <h4 style={{
                      fontFamily: V.heading, fontSize: "0.9rem", fontWeight: 800,
                      color: V.bright, letterSpacing: "-0.02em", margin: 0,
                    }}>{s.title}</h4>
                  </div>
                  <p style={{ fontSize: "0.84rem", color: V.dim, lineHeight: 1.7, margin: 0 }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* scope tags */}
          <div style={{ marginBottom: 56 }}>
            <div style={{
              fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 16,
            }}>УСЛУГИ И ИНСТРУМЕНТЫ</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {c.scope.map((s, j) => (
                <span key={j} className="scope-tag" style={{
                  padding: "7px 16px", borderRadius: 100, background: "rgba(0,0,0,0.03)",
                  border: `1px solid ${V.border}`, fontSize: "0.76rem", color: V.dim, fontWeight: 500,
                }}>{s}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            marginTop: 64, padding: "48px 40px", borderRadius: V.radius,
            background: `linear-gradient(135deg, ${c.color1}, ${c.color2})`,
            textAlign: "center",
          }}>
            <h3 style={{
              fontFamily: V.heading, fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 800,
              color: "#fff", letterSpacing: "-0.03em", marginBottom: 12,
            }}>Хотите похожий результат?</h3>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", marginBottom: 28, lineHeight: 1.6 }}>
              Расскажите о вашем проекте — обсудим, как мы можем помочь
            </p>
            <Link href="/#contact" className="cta-btn">
              Обсудить проект →
            </Link>
          </div>

          {/* other cases */}
          <div style={{ marginTop: 80 }}>
            <div style={{
              fontFamily: V.heading, fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.16em", textTransform: "uppercase", color: V.muted, marginBottom: 24,
            }}>ДРУГИЕ КЕЙСЫ</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cases.filter(x => x.slug !== slug).slice(0, 3).map((oc, i) => (
                <Link key={i} href={`/cases/${oc.slug}`} style={{
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
