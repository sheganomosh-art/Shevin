"use client";
import { useState } from "react";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "Do I need a lot of money to start?",
    a: "No. You can start with as little as KES 10,000–20,000 through most licensed brokers. Very small amounts (under KES 5,000) are technically possible but inefficient because broker fees eat into small investments.",
  },
  {
    q: "Is the NSE safe? What happened in 2008?",
    a: "The NSE dropped significantly in 2008 due to the global financial crisis and post-election instability. Some investors lost money. We cover this directly in the course — because understanding how markets fall is as important as understanding how they rise. The NSE is a regulated exchange. It is legitimate. It is not risk-free.",
  },
  {
    q: "Can I lose all my money?",
    a: "Yes — if you invest everything in a single company that fails. That is why diversification matters. Invest only what you can afford to leave alone for years, and spread it across multiple companies. We explain this in Lesson 6.",
  },
  {
    q: "What is the difference between this and forex trading?",
    a: "Forex trading involves speculating on currency exchange rates, often with borrowed money. Most retail forex traders lose money. This course is about buying shares in real Kenyan companies on a regulated exchange. Very different in risk profile and legitimacy.",
  },
  {
    q: "Is Vuka connected to any broker or investment company?",
    a: "No. Vuka has no financial relationship with any broker or investment firm. We earn nothing if you invest or don't. We show you what licensed brokers look like — the choice of which to use is entirely yours.",
  },
];

const LESSONS_PREVIEW = [
  { num: "01", title: "What is the NSE?", desc: "What the Nairobi Securities Exchange is, who regulates it, and what investing on it actually means.", time: "~15 min" },
  { num: "02", title: "CDS Accounts & Licensed Brokers", desc: "How to open a CDS account, what the CDSC is, and how to recognise a legitimate broker versus a scam.", time: "~20 min" },
  { num: "03", title: "Reading a Stock Listing", desc: "How to read the information published for any NSE-listed company. What matters. What doesn't.", time: "~20 min" },
  { num: "04", title: "Understanding Price Movements", desc: "Why prices move, what charts actually show, and why short-term movements are mostly noise.", time: "~20 min" },
  { num: "05", title: "Your First Buy Order", desc: "The exact process of placing an order through a licensed broker. What to expect. What it costs.", time: "~25 min" },
  { num: "06", title: "After You Invest", desc: "Reading your CDS statement, understanding dividends, and what to do when prices fall.", time: "~20 min" },
];

/* African geometric SVG pattern — kente-inspired diamonds */
function AfricanPattern({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="kente" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Outer diamond */}
          <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="#C4572A" strokeWidth="1" opacity="0.6" />
          {/* Inner diamond */}
          <polygon points="40,20 60,40 40,60 20,40" fill="none" stroke="#F5B731" strokeWidth="0.8" opacity="0.5" />
          {/* Corner triangles */}
          <polygon points="0,0 12,0 0,12" fill="#C4572A" opacity="0.15" />
          <polygon points="80,0 80,12 68,0" fill="#C4572A" opacity="0.15" />
          <polygon points="0,80 12,80 0,68" fill="#C4572A" opacity="0.15" />
          <polygon points="80,80 68,80 80,68" fill="#C4572A" opacity="0.15" />
          {/* Centre dot */}
          <circle cx="40" cy="40" r="2.5" fill="#F5B731" opacity="0.4" />
          {/* Cross lines */}
          <line x1="40" y1="0" x2="40" y2="16" stroke="#F5B731" strokeWidth="0.6" opacity="0.3" />
          <line x1="40" y1="64" x2="40" y2="80" stroke="#F5B731" strokeWidth="0.6" opacity="0.3" />
          <line x1="0" y1="40" x2="16" y2="40" stroke="#F5B731" strokeWidth="0.6" opacity="0.3" />
          <line x1="64" y1="40" x2="80" y2="40" stroke="#F5B731" strokeWidth="0.6" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kente)" opacity={opacity} />
    </svg>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 40px;
        }
        .hero-image-col {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 860px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
            padding: 64px 24px;
          }
          .hero-image-col {
            display: none;
          }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(15,10,6,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(196,87,42,0.2)",
        height: 68, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 28px",
      }}>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 32, fontWeight: 900,
          letterSpacing: "-0.01em",
          background: "linear-gradient(135deg, #C4572A, #F5B731)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Vuka
        </span>
        <Link href="/auth/login" style={{
          color: "var(--text-secondary)", fontSize: 14,
          textDecoration: "none", padding: "6px 16px",
          border: "1px solid rgba(196,87,42,0.3)", borderRadius: 6,
          transition: "border-color 0.2s",
        }}>
          Sign in
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "92vh", display: "flex", alignItems: "center" }}>

        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, rgba(15,10,6,0.99) 40%, rgba(26,16,8,0.92) 100%)",
        }} />

        {/* African geometric pattern */}
        <AfricanPattern opacity={0.09} />

        {/* Glow orb — terracotta top-right */}
        <div style={{
          position: "absolute", top: "5%", right: "2%",
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,87,42,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Glow orb — gold bottom */}
        <div style={{
          position: "absolute", bottom: "5%", left: "30%",
          width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,183,49,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Two-column content grid */}
        <div className="hero-grid" style={{ position: "relative", zIndex: 1, width: "100%" }}>

          {/* Left — text */}
          <div>
            <p className="mono-label" style={{ marginBottom: 20, color: "var(--accent-amber)", letterSpacing: "0.16em" }}>
              NSE Investing Education · Nairobi, Kenya
            </p>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(38px, 5.5vw, 68px)",
              fontWeight: 900, lineHeight: 1.06, marginBottom: 28,
              background: "linear-gradient(135deg, #F5ECD8 30%, #F5B731 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Learn to invest on the<br />Nairobi Stock Exchange.
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 12, maxWidth: 520 }}>
              A free, structured course for Kenyan beginners.
              Six lessons. No jargon. No broker commissions.
              No financial products sold.
            </p>

            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
              <Link href="/auth/signup" style={{
                background: "linear-gradient(135deg, #C4572A 0%, #F5B731 100%)",
                color: "#0F0A06",
                padding: "14px 36px", borderRadius: 8, textDecoration: "none",
                fontSize: 16, fontWeight: 700, display: "inline-block",
                boxShadow: "0 4px 24px rgba(196,87,42,0.35)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}>
                Begin the course →
              </Link>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: 0 }}>
                Free to start. No credit card. No broker account needed.
              </p>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="hero-image-col">
            <div style={{ position: "relative", width: "100%", maxWidth: 520 }}>
              {/* Glow behind image */}
              <div style={{
                position: "absolute", inset: -24,
                background: "radial-gradient(ellipse at center, rgba(196,87,42,0.22) 0%, transparent 70%)",
                borderRadius: 24, pointerEvents: "none",
              }} />
              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=85"
                alt="Laptop displaying financial market charts"
                style={{
                  width: "100%",
                  borderRadius: 20,
                  display: "block",
                  border: "1px solid rgba(196,87,42,0.25)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,183,49,0.08)",
                  objectFit: "cover",
                  aspectRatio: "4 / 5",
                }}
              />
              {/* Floating stat badge */}
              <div style={{
                position: "absolute", bottom: 24, left: -28,
                background: "rgba(26,16,8,0.92)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(196,87,42,0.35)",
                borderRadius: 12, padding: "14px 20px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}>
                <p style={{ margin: 0, fontSize: 11, color: "var(--accent-amber)", letterSpacing: "0.12em", fontFamily: "Courier New, monospace" }}>NSE 20 SHARE INDEX</p>
                <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Playfair Display', serif" }}>1,847 <span style={{ color: "#4ade80", fontSize: 13, fontWeight: 500 }}>↑ 2.4%</span></p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid rgba(196,87,42,0.2)",
        borderBottom: "1px solid rgba(196,87,42,0.2)",
        padding: "28px 28px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { icon: "🛡", text: "No financial products sold" },
            { icon: "📖", text: "Content reviewed for accuracy" },
            { icon: "✂", text: "No affiliate broker links" },
            { icon: "👁", text: "Investment risks explained honestly" },
          ].map(item => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 28px" }}>
        <p className="mono-label" style={{ marginBottom: 16, color: "var(--accent-amber)" }}>The course</p>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, marginBottom: 12,
        }}>
          Six lessons. One clear path.
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 52, lineHeight: 1.7 }}>
          Each lesson builds on the last. Most learners finish in 2–3 weeks. Go at your own pace.
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {LESSONS_PREVIEW.map((lesson, i) => (
            <div key={lesson.num} style={{
              display: "flex", gap: 24, padding: "22px 0",
              borderBottom: i < 5 ? "1px solid var(--border-subtle)" : "none",
            }}>
              <span style={{
                fontFamily: "Courier New, monospace", fontSize: 12,
                color: "var(--accent-amber)", minWidth: 24, paddingTop: 3,
                letterSpacing: "0.08em",
              }}>
                {lesson.num}
              </span>
              <div>
                <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 4px" }}>{lesson.title}</p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 6px", lineHeight: 1.6 }}>{lesson.desc}</p>
                <span className="mono-label">{lesson.time}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 36, fontSize: 14, color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.7 }}>
          After completing these six lessons, you will understand the NSE well enough to make an informed first investment. Not a guaranteed one. An informed one.
        </p>
      </section>

      {/* ── WHAT VUKA IS NOT ── */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "var(--bg-secondary)",
        padding: "80px 28px",
        borderTop: "1px solid var(--border-subtle)",
      }}>
        <AfricanPattern opacity={0.04} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
          <p className="mono-label" style={{ marginBottom: 16, color: "var(--accent-amber)" }}>Important</p>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, marginBottom: 16,
          }}>
            What this is not
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 44, lineHeight: 1.7 }}>
            Investment scams are common in Kenya. You should know exactly what Vuka is and is not before spending any time here.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { title: "Not a broker", body: "Vuka does not sell shares, earn commissions, or have any financial interest in what you invest in. We make nothing whether you invest or not." },
              { title: "Not a signal service", body: "We will never tell you what to buy. Anyone who tells you which stock to buy and claims it will definitely rise is not educating you." },
              { title: "Not a get-rich scheme", body: "Investing takes time. Years. We show you what realistic long-term NSE returns have looked like — not the best year. The average year." },
            ].map(card => (
              <div key={card.title} style={{
                background: "var(--bg-primary)",
                border: "1px solid rgba(196,87,42,0.2)",
                borderRadius: 12, padding: 24,
              }}>
                <p style={{ color: "var(--accent-green)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>✗ {card.title}</p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{card.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, padding: "20px 0", borderTop: "1px solid var(--border-subtle)" }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>
              If you have seen WhatsApp groups promising 30% monthly returns, forex trading bots, or crypto investment packages from a friend — this course explains why those are dangerous and what real investing actually looks like.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 28px" }}>
        <p className="mono-label" style={{ marginBottom: 16, color: "var(--accent-amber)" }}>Questions</p>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, marginBottom: 44,
        }}>
          Questions we get asked
        </h2>
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                width: "100%", textAlign: "left", padding: "20px 0",
                background: "none", border: "none", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.5 }}>
                {item.q}
              </span>
              <span style={{ color: "var(--accent-amber)", fontSize: 20, flexShrink: 0, fontWeight: 300 }}>
                {openFaq === i ? "−" : "+"}
              </span>
            </button>
            {openFaq === i && (
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, paddingBottom: 20, margin: 0 }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "var(--bg-secondary)",
        padding: "80px 28px",
        borderTop: "1px solid var(--border-subtle)",
        textAlign: "center",
      }}>
        <AfricanPattern opacity={0.05} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, marginBottom: 16,
            background: "linear-gradient(135deg, #F5ECD8 30%, #F5B731 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            The course takes about three weeks.
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 40, lineHeight: 1.8 }}>
            20–30 minutes per lesson. No deadline. No streak pressure.<br />
            Just the information you need.
          </p>
          <Link href="/auth/signup" style={{
            background: "linear-gradient(135deg, #C4572A 0%, #F5B731 100%)",
            color: "#0F0A06",
            padding: "15px 44px", borderRadius: 8, textDecoration: "none",
            fontSize: 16, fontWeight: 700, display: "inline-block",
            boxShadow: "0 4px 28px rgba(196,87,42,0.4)",
          }}>
            Begin the course →
          </Link>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 14 }}>
            Free. No credit card. No broker account needed to start.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(196,87,42,0.2)",
        padding: "28px",
        textAlign: "center",
        background: "var(--bg-primary)",
      }}>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: 0 }}>
          © 2025 Vuka · NSE Investing Education · No financial products sold
        </p>
      </footer>
    </div>
  );
}
