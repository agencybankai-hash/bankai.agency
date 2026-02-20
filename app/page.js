"use client";

import { useState, useEffect } from "react";

/*
  BANKAI.AGENCY — Premium minimalist site
  Philosophy: Typography is the design. Whitespace is the luxury. Every detail earns its place.
  References: reboot.studio × moonfire.com
*/

const T = {
  bg: "#FFFFFF",
  bg2: "#F8F8F8",
  dark: "#0A0A0A",
  text: "#0A0A0A",
  mid: "#555555",
  muted: "#999999",
  light: "#C8C8C8",
  line: "#E8E8E8",
  lineLight: "#F0F0F0",
  red: "#DF5440",
  redSoft: "#FBF0EE",
  font: "inherit",
};

// ─── LOGO ───
function Logo({ white }) {
  return (
    <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill={T.red} />
      </svg>
      <span style={{ fontSize: 15, fontWeight: 700, color: white ? "#fff" : T.dark, letterSpacing: 3 }}>BANKAI</span>
    </a>
  );
}

// ─── NAV ───
function Nav() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > 80);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: s ? "16px 0" : "24px 0",
      background: s ? "rgba(255,255,255,0.95)" : "transparent",
      backdropFilter: s ? "blur(24px)" : "none",
      borderBottom: s ? `1px solid ${T.line}` : "1px solid transparent",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo />
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Work", "Services", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              color: T.muted, textDecoration: "none", fontSize: 13, fontWeight: 500,
              letterSpacing: 0.5, transition: "color 0.3s",
            }}
            onMouseEnter={e => e.target.style.color = T.dark}
            onMouseLeave={e => e.target.style.color = T.muted}
            >{l}</a>
          ))}
          <a href="#contact" style={{
            color: T.dark, padding: "10px 28px", borderRadius: 100, textDecoration: "none",
            fontSize: 13, fontWeight: 600, border: `1.5px solid ${T.dark}`, transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.target.style.background = T.dark; e.target.style.color = "#fff"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = T.dark; }}
          >Get in touch</a>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ───
function Hero() {
  const [on, setOn] = useState(false);
  useEffect(() => { setTimeout(() => setOn(true), 100); }, []);
  const f = (d) => ({ opacity: on ? 1 : 0, transform: on ? "translateY(0)" : "translateY(30px)", transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${d}s` });
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "flex-end", padding: "0 0 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", width: "100%" }}>
        <h1 style={{
          fontSize: "clamp(3.5rem, 7.5vw, 6.5rem)", fontWeight: 800, lineHeight: 1.0,
          letterSpacing: "-0.04em", maxWidth: 900, ...f(0.15),
        }}>
          <span style={{ color: T.dark }}>Only for those who </span>
          <span style={{ color: T.light }}>refuse to blend in. </span>
          <span style={{ color: T.red }}>Play to win.</span>
        </h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 64, ...f(0.4) }}>
          <p style={{ fontSize: 17, color: T.mid, maxWidth: 440, lineHeight: 1.7 }}>
            Revenue-driven marketing for businesses that refuse to settle. We build systems that generate leads, close deals, and scale.
          </p>
          <a href="#contact" style={{
            background: T.dark, color: "#fff", padding: "16px 40px", borderRadius: 100,
            textDecoration: "none", fontSize: 14, fontWeight: 600, transition: "all 0.3s", flexShrink: 0,
          }}
          onMouseEnter={e => { e.target.style.background = T.red; }}
          onMouseLeave={e => { e.target.style.background = T.dark; }}
          >Start a project</a>
        </div>
      </div>
    </section>
  );
}

// ─── NUMBERS ───
function Numbers() {
  const data = [
    { val: "$14.6M", lab: "Revenue generated" },
    { val: "10,235", lab: "Jobs booked" },
    { val: "36.5x", lab: "Average ROAS" },
  ];
  return (
    <section style={{ borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {data.map((d, i) => (
          <div key={i} style={{ padding: "56px 0", borderLeft: i > 0 ? `1px solid ${T.line}` : "none", paddingLeft: i > 0 ? 48 : 0 }}>
            <div style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em", lineHeight: 1 }}>{d.val}</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 8 }}>{d.lab}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PLACEHOLDER ───
function Img({ label, ratio = "16/9" }) {
  return (
    <div style={{
      aspectRatio: ratio, borderRadius: 12, overflow: "hidden",
      background: T.bg2, display: "flex", alignItems: "center", justifyContent: "center",
      border: `1px solid ${T.lineLight}`,
    }}>
      <span style={{ fontSize: 11, color: T.light, fontWeight: 500, textAlign: "center", padding: "0 24px", lineHeight: 1.5 }}>{label}</span>
    </div>
  );
}

// ─── FUNNEL: How we impact revenue ───
function Funnel() {
  const stages = [
    {
      title: "Attract",
      desc: "Drive qualified traffic through every relevant channel.",
      items: ["Google Ads & LSA", "SEO & Content", "Meta Ads", "GBP Optimization"],
      impact: "+180%", impactLabel: "organic traffic growth",
    },
    {
      title: "Capture",
      desc: "Turn visitors into tracked, qualified leads.",
      items: ["High-converting pages", "Call tracking (CallRail)", "Multi-step forms", "Live chat & CTAs"],
      impact: "3\u00d7", impactLabel: "lead capture rate",
    },
    {
      title: "Nurture",
      desc: "Automate follow-up so no lead goes cold.",
      items: ["HubSpot CRM pipelines", "Email sequences", "Retargeting ads", "Lead scoring models"],
      impact: "60%", impactLabel: "follow-ups automated",
    },
    {
      title: "Convert",
      desc: "Close deals with data-driven pipeline management.",
      items: ["Pipeline visibility", "Automated follow-up", "Attribution modeling", "Revenue tracking"],
      impact: "36.5\u00d7", impactLabel: "average ROAS",
    },
    {
      title: "Scale",
      desc: "Increase budget confidently. Compound what works.",
      items: ["Channel expansion", "Budget optimization", "A/B testing at scale", "Real-time dashboards"],
      impact: "$14.6M", impactLabel: "revenue generated",
    },
  ];

  return (
    <section style={{ padding: "120px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80 }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em" }}>How we drive revenue</h2>
          <p style={{ fontSize: 15, color: T.muted, maxWidth: 380, textAlign: "right", lineHeight: 1.6 }}>From first impression to closed deal — we build and optimize every touchpoint.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 48, padding: "0 24px" }}>
          {stages.map((_, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{
                width: i === stages.length - 1 ? 14 : 10,
                height: i === stages.length - 1 ? 14 : 10,
                borderRadius: "50%",
                background: i === stages.length - 1 ? T.red : T.dark,
                flexShrink: 0,
              }} />
              {i < stages.length - 1 && (
                <div style={{ flex: 1, height: 1, background: T.line, position: "relative" }}>
                  <div style={{
                    position: "absolute", right: -1, top: -3,
                    width: 0, height: 0,
                    borderTop: "3.5px solid transparent",
                    borderBottom: "3.5px solid transparent",
                    borderLeft: `6px solid ${T.light}`,
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 32 }}>
          {stages.map((s, i) => (
            <div key={i}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: T.dark, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 20 }}>{s.desc}</p>
              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16, marginBottom: 20 }}>
                {s.items.map((item, j) => (
                  <p key={j} style={{ fontSize: 12, color: T.mid, lineHeight: 1.7 }}>{item}</p>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16 }}>
                <span style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 800, color: i === stages.length - 1 ? T.red : T.dark, letterSpacing: "-0.02em" }}>{s.impact}</span>
                <p style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{s.impactLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── RESULTS BAR (for case studies) ───
function ResultsBars({ bars, color }) {
  return (
    <div style={{ marginTop: 80, padding: "56px 0", borderTop: `1px solid ${T.line}` }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 40 }}>Impact at a glance</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 64px" }}>
        {bars.map((b, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: T.mid }}>{b.label}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: T.dark }}>{b.value}</span>
            </div>
            <div style={{ height: 3, background: T.lineLight, borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${b.pct}%`,
                background: color || T.red,
                borderRadius: 2,
                transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CASE STUDY ───
function Case({ color, num, name, tagline, intro, metrics, challenge, approach, phases, services, results, testimonial, images, bars }) {
  return (
    <article style={{ padding: "120px 0", borderTop: `1px solid ${T.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: T.muted, fontWeight: 500, letterSpacing: 1 }}>{num}</span>
        <span style={{ fontSize: 13, color: T.muted }}>{name}</span>
      </div>
      <h3 style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: 800 }}>
        {tagline}
      </h3>
      <p style={{ fontSize: 17, color: T.mid, lineHeight: 1.7, maxWidth: 640, marginTop: 28 }}>{intro}</p>

      <div style={{ marginTop: 64 }}>
        <Img label={images.hero} ratio="2.4/1" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${metrics.length}, 1fr)`, marginTop: 64, borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ padding: "40px 0", borderLeft: i > 0 ? `1px solid ${T.line}` : "none", paddingLeft: i > 0 ? 40 : 0 }}>
            <div style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color, letterSpacing: "-0.02em", lineHeight: 1 }}>{m.val}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 8 }}>{m.lab}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 80 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Challenge</span>
          <p style={{ fontSize: 15, color: T.dark, lineHeight: 1.8, marginTop: 16 }}>{challenge}</p>
        </div>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Approach</span>
          <p style={{ fontSize: 15, color: T.dark, lineHeight: 1.8, marginTop: 16 }}>{approach}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 64 }}>
        <Img label={images.screen1} ratio="4/3" />
        <Img label={images.screen2} ratio="4/3" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 80 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 40 }}>Execution</span>
          {phases.map((p, i) => (
            <div key={i} style={{ marginBottom: i < phases.length - 1 ? 36 : 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: T.light, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>0{i + 1}</span>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: T.dark }}>{p.title}</h4>
              </div>
              {p.items.map((item, j) => (
                <p key={j} style={{ fontSize: 13, color: T.mid, lineHeight: 1.65, paddingLeft: 28, marginBottom: 3 }}>{item}</p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Img label={images.detail} ratio="4/3" />
          <div style={{ padding: "32px 0", borderTop: `1px solid ${T.line}` }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 16 }}>Stack</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {services.map((s, i) => (
                <span key={i} style={{ padding: "6px 14px", borderRadius: 100, border: `1px solid ${T.line}`, fontSize: 12, color: T.mid }}>{s}</span>
              ))}
            </div>
          </div>
          {testimonial && (
            <div style={{ padding: "32px 0", borderTop: `1px solid ${T.line}` }}>
              <p style={{ fontSize: 15, color: T.dark, fontStyle: "italic", lineHeight: 1.75 }}>&ldquo;{testimonial.quote}&rdquo;</p>
              <p style={{ fontSize: 12, color: T.muted, marginTop: 12 }}>{testimonial.author}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 80, padding: "56px 0", borderTop: `1px solid ${T.line}` }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 40 }}>Results</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px 64px" }}>
          {results.map((r, i) => (
            <div key={i}>
              <h5 style={{ fontSize: 14, fontWeight: 700, color: T.dark, marginBottom: 6 }}>{r.title}</h5>
              <p style={{ fontSize: 13, color: T.mid, lineHeight: 1.6 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {bars && <ResultsBars bars={bars} color={color} />}

      <Img label={images.bottom} ratio="2.4/1" />
    </article>
  );
}

// ─── WORK ───
function Work() {
  return (
    <section id="work" style={{ padding: "0 0 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ padding: "100px 0 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em" }}>Selected work</h2>
          <p style={{ fontSize: 15, color: T.muted, maxWidth: 400, textAlign: "right", lineHeight: 1.6 }}>Complete marketing ecosystems. Every channel connected. Every dollar tracked.</p>
        </div>

        <Case
          color={T.red}
          num="01"
          name="SOS Moving"
          tagline="From a local mover to a $14.6M revenue machine."
          intro="We designed and built a complete marketing ecosystem from scratch — paid search, local ads, SEO, CRM, call tracking, email automation, and real-time dashboards. Every channel connected. Every dollar tracked."
          metrics={[
            { val: "$14.6M", lab: "Revenue generated" },
            { val: "10,235", lab: "Jobs booked" },
            { val: "$400K+", lab: "Ad budget managed" },
            { val: "36.5x", lab: "Average ROAS" },
          ]}
          challenge="SOS Moving was spending on Google Ads with no understanding of which campaigns generated actual revenue. No call tracking. No CRM. No attribution. Leads were handled on paper, follow-ups were inconsistent. SEO rankings sat around position 40. The business was growing blindly — no visibility into what worked and what bled money."
          approach="Full business transformation, not just a marketing retainer. Build tracking infrastructure first (CallRail, HubSpot, GA4). Restructure Google Ads with proper conversion tracking. Launch Local Services Ads and SEO. Automate the entire lead-to-close funnel. Every week — optimization. Every month — strategic review."
          phases={[
            { title: "Tracking & CRM", items: ["CallRail with dynamic number insertion across all landing pages", "HubSpot CRM — custom pipeline, deal stages, contact properties", "GA4 conversion events for forms, calls, and quote requests", "Full integration chain: CallRail \u2192 HubSpot \u2192 GA4 \u2192 Looker Studio"] },
            { title: "Paid Advertising", items: ["Restructured Google Ads: keyword research, negative keywords, SKAGs", "Local Services Ads for top-intent local searches", "Dedicated landing pages per service line (local, long-distance, commercial)", "Position-based attribution model across all channels"] },
            { title: "SEO & Local Presence", items: ["Technical SEO audit: meta, schema, speed, internal links", "20+ optimized service and location pages", "Google Business Profile: posts, photos, Q&A, review strategy", "Rankings improved from position 40 \u2192 26 for core terms"] },
            { title: "Automation & Scale", items: ["Email sequences for hot, warm, and cold leads in HubSpot", "Lead scoring model based on service type, budget, and timeline", "Meta Ads retargeting for non-converting visitors", "Looker Studio dashboards — live ROAS, CPL, revenue by channel"] },
          ]}
          services={["Google Ads", "Local Services Ads", "Meta Ads", "SEO", "Webflow", "HubSpot CRM", "CallRail", "Email Automation", "GBP", "Looker Studio", "A/B Testing", "CRO"]}
          testimonial={{ quote: "They didn't just run our ads — they built an entire marketing machine. We went from guessing to complete visibility into every lead, every call, every dollar.", author: "SOS Moving, Owner" }}
          results={[
            { title: "Full Attribution", desc: "Every dollar tracked from click to closed job. Position-based attribution across Google Ads, LSA, SEO, and Meta." },
            { title: "Cost Efficiency", desc: "36.5x ROAS. Cost per lead optimized 42% over 12 months through continuous A/B testing and bid refinement." },
            { title: "Zero Leads Lost", desc: "HubSpot captures every form, call, and chat — auto-routes to the right team member with context." },
            { title: "SEO Growth", desc: "20+ service pages ranking. Organic traffic increased 180% year-over-year." },
            { title: "Automated Follow-up", desc: "Email sequences handle 60% of follow-ups. Lead scoring prioritizes high-value jobs." },
            { title: "Scales With Budget", desc: "When ad spend increased 3x, lead quality maintained and ROAS stayed above 30x." },
          ]}
          bars={[
            { label: "Return on Ad Spend", value: "36.5\u00d7", pct: 92 },
            { label: "Cost per Lead Reduction", value: "\u221242%", pct: 58 },
            { label: "Organic Traffic Growth", value: "+180%", pct: 80 },
            { label: "Lead-to-Close Rate", value: "+67%", pct: 67 },
            { label: "Follow-ups Automated", value: "60%", pct: 60 },
            { label: "Revenue Generated", value: "$14.6M", pct: 95 },
          ]}
          images={{
            hero: "Website homepage + Looker Studio dashboard — laptop mockup",
            screen1: "Google Ads campaign performance — ROAS & conversion data",
            screen2: "HubSpot CRM pipeline — deal stages & lead flow",
            detail: "Looker Studio reporting dashboard — real-time metrics",
            bottom: "Marketing ecosystem: ads \u2192 landing page \u2192 CRM \u2192 automation \u2192 reporting",
          }}
        />

        <Case
          color="#22C55E"
          num="02"
          name="AK Cabinet Craft"
          tagline="Outsourced marketing department. Paid only on results."
          intro="Instead of a traditional retainer, we proposed a revenue share — 3% of every sale. Our incentives fully aligned. We built and manage the entire marketing operation: Google Ads, local SEO, CRM, and even offline postcards."
          metrics={[
            { val: "3%", lab: "Revenue share model" },
            { val: "Full Stack", lab: "All channels managed" },
            { val: "Chicago", lab: "Local market" },
            { val: "Ongoing", lab: "Active partnership" },
          ]}
          challenge="No digital marketing presence. No call tracking. No CRM. Customer inquiries came through untracked phone calls. Custom kitchens are $15K-80K projects with a long sales cycle requiring persistent follow-up that wasn't happening."
          approach="Zero upfront fees, 3% revenue share — we needed everything to work. Started with tracking (CallRail + HubSpot), launched Google Ads for high-intent keywords, optimized GBP for local authority. Built a CRM-powered follow-up system for the long sales cycle. Tested offline postcards to high-income zip codes."
          phases={[
            { title: "Tracking & CRM", items: ["CallRail with dynamic numbers for online/offline attribution", "HubSpot CRM configured for long sales cycles — custom pipeline stages", "Attribution model connecting marketing spend to closed deals"] },
            { title: "Paid Search", items: ["Google Ads targeting 'custom cabinets Chicago', 'kitchen remodel near me'", "Dedicated landing pages for kitchens, closets, bathrooms", "Geo-targeting to high-income Chicago suburbs"] },
            { title: "Local SEO & GBP", items: ["Full Google Business Profile optimization — photos, services, posts", "Review generation strategy with automated post-project requests", "Blog content targeting 'kitchen remodel cost Chicago' queries"] },
            { title: "Nurture & Offline", items: ["Email nurture sequences for the 4-8 week consideration phase", "Portfolio showcase emails with before/after photos", "Targeted postcards to homeowners in premium zip codes"] },
          ]}
          services={["Google Ads", "Local SEO", "GBP", "HubSpot CRM", "CallRail", "Content Marketing", "Landing Pages", "Email Automation", "Direct Mail", "Review Management"]}
          testimonial={null}
          results={[
            { title: "Aligned Incentives", desc: "Revenue share means every action is tied to revenue. No vanity metrics." },
            { title: "Full Visibility", desc: "First time seeing exactly which channels generate consultations, quotes, and closed deals." },
            { title: "Long-Cycle Nurture", desc: "Automation handles the 4-8 week consideration period — portfolio emails, follow-ups, reminders." },
            { title: "Local Authority", desc: "Top-rated cabinet shop in target suburbs through GBP optimization and review strategy." },
            { title: "Multi-Channel", desc: "Digital (Google Ads, SEO) combined with offline (postcards) across the customer journey." },
            { title: "True Partnership", desc: "As revenue grows, our incentive grows. Partnership, not a vendor relationship." },
          ]}
          bars={[
            { label: "Zero Upfront Cost", value: "Rev Share", pct: 100 },
            { label: "Lead Attribution Accuracy", value: "100%", pct: 100 },
            { label: "Nurture Sequence Coverage", value: "4-8 wk cycle", pct: 75 },
            { label: "Local Pack Visibility", value: "Top 3", pct: 88 },
            { label: "Channels Managed", value: "6+", pct: 72 },
            { label: "Review Growth", value: "+340%", pct: 85 },
          ]}
          images={{
            hero: "Kitchen project photography + website mockup",
            screen1: "Google Ads performance — cabinet-related keywords",
            screen2: "Google Business Profile — reviews, photos, local pack",
            detail: "HubSpot email nurture sequence — flow diagram",
            bottom: "Before/after kitchen projects + marketing funnel overview",
          }}
        />

        <Case
          color="#3B82F6"
          num="03"
          name="Object First"
          tagline="2+ year design partnership for a startup acquired by Veeam."
          intro="Long-term design and development partner for an enterprise data storage company. We shaped the public-facing brand — website, landing pages, collateral — that attracted enterprise customers and ultimately led to their acquisition."
          metrics={[
            { val: "2+ yrs", lab: "Partnership" },
            { val: "Acquired", lab: "By Veeam" },
            { val: "100+", lab: "Hours per month" },
          ]}
          challenge="Fast-moving startup in competitive data storage. Needed to communicate complex technical products to both technical and business audiences. Site needed to evolve rapidly — new features, campaigns, landing pages — without a full in-house design team."
          approach="Embedded as their external design and development team. Weekly sprints with product marketing. Component-based design system in Figma. Webflow for rapid iteration. New pages shipped in days, not weeks."
          phases={[
            { title: "Design System", items: ["Visual language — clean, technical, enterprise-grade", "Component library in Figma: buttons, cards, sections, layouts", "Typography hierarchy, color system, spacing tokens"] },
            { title: "Website Build", items: ["Full marketing site in Webflow — homepage, product, pricing, about", "Responsive design, SEO structure, schema markup", "Core Web Vitals optimized to green across all pages"] },
            { title: "Campaign Pages", items: ["Rapid-turnaround landing pages for product launches", "A/B variants for ad campaigns", "Gated content pages for whitepapers and technical docs"] },
            { title: "Ongoing Support", items: ["Weekly design sprints aligned with product roadmap", "Marketing collateral — one-pagers, decks, email templates", "Continuous iteration as product evolved"] },
          ]}
          services={["UI/UX Design", "Webflow", "Landing Pages", "Design System", "Collateral", "Responsive Design", "SEO", "Ongoing Support"]}
          testimonial={null}
          results={[
            { title: "Startup Speed", desc: "New pages shipped in 3-5 business days. Design system enabled rapid iteration without sacrificing quality." },
            { title: "Enterprise Quality", desc: "Positioned Object First as a mature, trustworthy enterprise product for IT decision-makers." },
            { title: "Acquisition-Ready", desc: "Brand presence contributed to market positioning that led to Veeam acquisition." },
            { title: "Consistency", desc: "Component-based system maintained brand consistency across 2+ years of output." },
            { title: "Cost Efficient", desc: "Full team output at a fraction of in-house cost with flexible hourly model." },
            { title: "Flexible Scale", desc: "Involvement scaled up or down based on campaign needs and product milestones." },
          ]}
          bars={[
            { label: "Page Turnaround", value: "3-5 days", pct: 90 },
            { label: "Core Web Vitals", value: "All Green", pct: 100 },
            { label: "Design System Components", value: "120+", pct: 78 },
            { label: "Cost vs In-house Team", value: "\u221265%", pct: 65 },
            { label: "Partnership Duration", value: "2+ years", pct: 95 },
            { label: "Outcome", value: "Acquired", pct: 100 },
          ]}
          images={{
            hero: "Website homepage on monitor + Figma design system",
            screen1: "Product page design — desktop & mobile",
            screen2: "Campaign landing page — product launch",
            detail: "Figma component library overview",
            bottom: "Website evolution: v1 \u2192 final version before acquisition",
          }}
        />
      </div>
    </section>
  );
}

// ─── SERVICES ───
function Services() {
  const items = [
    { title: "Performance Marketing", desc: "Google Ads, LSA, Meta Ads. Precision campaigns optimized for conversions, not clicks." },
    { title: "SEO & Local SEO", desc: "Technical SEO, content strategy, GBP optimization. Dominate organic search in your market." },
    { title: "Web Development", desc: "High-converting Webflow sites. Fast, responsive, built to turn visitors into leads." },
    { title: "CRM & Automation", desc: "HubSpot setup, lead scoring, email sequences. No lead falls through the cracks." },
    { title: "Analytics & Tracking", desc: "GA4, CallRail, Looker Studio dashboards. Know where every dollar goes." },
    { title: "UI/UX Design", desc: "Conversion-focused design in Figma. Branding, landing pages, marketing materials." },
  ];
  return (
    <section id="services" style={{ padding: "120px 0", background: T.bg2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72 }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em" }}>What we do</h2>
          <p style={{ fontSize: 15, color: T.muted, maxWidth: 380, textAlign: "right", lineHeight: 1.6 }}>Full-stack marketing. Every channel connected and optimized for revenue.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: T.line, borderRadius: 16, overflow: "hidden" }}>
          {items.map((s, i) => (
            <div key={i} style={{ padding: "44px 40px", background: T.bg, transition: "background 0.3s", cursor: "default" }}
              onMouseEnter={e => e.currentTarget.style.background = T.bg2}
              onMouseLeave={e => e.currentTarget.style.background = T.bg}
            >
              <h3 style={{ fontSize: 17, fontWeight: 700, color: T.dark, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROCESS ───
function Process() {
  const steps = [
    { n: "01", t: "Discovery", d: "We analyze your business, competitors, and current marketing. Every channel. Every number.", detail: ["Business & competitor audit", "Marketing channel analysis", "Tracking infrastructure review", "Opportunity mapping"] },
    { n: "02", t: "Strategy", d: "Custom roadmap. CRM configuration. Tracking setup. Campaign architecture.", detail: ["Custom channel strategy", "CRM & pipeline design", "Tracking & attribution setup", "Campaign architecture"] },
    { n: "03", t: "Launch", d: "Campaigns go live. Weekly optimization. Transparent reporting. Scale what works.", detail: ["Campaign launch & monitoring", "Weekly optimization cycles", "Real-time dashboards", "A/B testing framework"] },
    { n: "04", t: "Scale", d: "New channels. Higher budgets. Deeper automation. Compounding results.", detail: ["Channel expansion", "Budget scaling", "Advanced automation", "Compounding growth"] },
  ];
  return (
    <section style={{ padding: "120px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72 }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: T.dark, letterSpacing: "-0.03em" }}>How we work</h2>
          <p style={{ fontSize: 15, color: T.muted, maxWidth: 380, textAlign: "right", lineHeight: 1.6 }}>A proven 4-phase system. Each phase builds on the last.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 48, padding: "0 24px" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                border: `1.5px solid ${i === 0 ? T.red : T.line}`,
                background: i === 0 ? T.redSoft : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? T.red : T.muted }}>{s.n}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${i === 0 ? T.red : T.line}, ${T.line})` }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, borderTop: `1px solid ${T.line}`, paddingTop: 40 }}>
          {steps.map((s, i) => (
            <div key={i}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: T.dark, marginBottom: 10 }}>{s.t}</h3>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65, marginBottom: 20 }}>{s.d}</p>
              <div style={{ borderTop: `1px solid ${T.lineLight}`, paddingTop: 16 }}>
                {s.detail.map((d, j) => (
                  <p key={j} style={{ fontSize: 12, color: T.mid, lineHeight: 1.7 }}>{d}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ───
function CallToAction() {
  return (
    <section id="contact" style={{ padding: "140px 0", background: T.dark }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          Ready to stop guessing<br /><span style={{ color: T.red }}>and start growing?</span>
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", maxWidth: 440, margin: "28px auto 0", lineHeight: 1.7 }}>
          Book a free strategy call. We&apos;ll audit your marketing and show you where the opportunities are.
        </p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 48 }}>
          <a href="#" style={{
            background: T.red, color: "#fff", padding: "16px 44px", borderRadius: 100,
            textDecoration: "none", fontSize: 15, fontWeight: 600, transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.target.style.background = "#fff"; e.target.style.color = T.dark; }}
          onMouseLeave={e => { e.target.style.background = T.red; e.target.style.color = "#fff"; }}
          >Book a call</a>
          <a href="mailto:hello@bankai.agency" style={{
            color: "rgba(255,255,255,0.35)", padding: "16px 0",
            textDecoration: "none", fontSize: 15, transition: "color 0.3s",
          }}
          onMouseEnter={e => e.target.style.color = "#fff"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
          >hello@bankai.agency &rarr;</a>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───
function Footer() {
  return (
    <footer style={{ background: T.dark, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo white />
        <div style={{ display: "flex", gap: 32 }}>
          {["Work", "Services", "Contact", "LinkedIn"].map(l => (
            <a key={l} href={l === "LinkedIn" ? "#" : `#${l.toLowerCase()}`} style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
            >{l}</a>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.15)" }}>&copy; 2026 Bankai Agency</span>
      </div>
    </footer>
  );
}

// ─── MAIN ───
export default function Home() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.dark }}>
      <Nav />
      <Hero />
      <Numbers />
      <Funnel />
      <Work />
      <Services />
      <Process />
      <CallToAction />
      <Footer />
    </div>
  );
}
