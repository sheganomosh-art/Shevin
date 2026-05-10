"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

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

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(13,17,23,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
        height: 56,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "var(--text-primary)" }}>
          Vuka
        </span>
        <Link href="/auth/login" style={{
          color: "var(--text-secondary)", fontSize: 14, textDecoration: "none",
        }}>
          Sign in
        </Link>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px 64px" }}>
        <motion.p custom={0} initial="hidden" animate="visible" variants={fadeUp}
          className="mono-label" style={{ marginBottom: 24 }}>
          NSE Investing Education · Nairobi, Kenya
        </motion.p>

        <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp}
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 400, lineHeight: 1.1, marginBottom: 24, color: "var(--text-primary)" }}>
          Learn to invest on the<br />Nairobi Stock Exchange.
        </motion.h1>

        <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp}
          style={{ fontSize: 18, lineHeight: 1.75, color: "var(--text-secondary)", marginBottom: 16 }}>
          A free, structured course for Kenyan beginners.
          Six lessons. No jargon. No broker commissions.
          No financial products sold.
        </motion.p>

        <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}
          style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <Link href="/auth/signup" style={{
            background: "var(--accent-green)", color: "#fff",
            padding: "12px 28px", borderRadius: 8, textDecoration: "none",
            fontSize: 15, fontWeight: 500, display: "inline-block",
          }}>
            Begin the course
          </Link>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: 0 }}>
            Free to start. No credit card. No broker account needed.
          </p>
        </motion.div>
      </section>

      {/* TRUST BAR */}
      <section style={{
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "28px 24px",
      }}>
        <div style={{
          maxWidth: 860, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
        }}>
          {[
            { icon: "🛡", text: "No financial products sold" },
            { icon: "📖", text: "Content reviewed for accuracy" },
            { icon: "✂", text: "No affiliate broker links" },
            { icon: "👁", text: "Investment risks explained honestly" },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM PATH */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "72px 24px" }}>
        <p className="mono-label" style={{ marginBottom: 16 }}>The course</p>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 400, marginBottom: 12 }}>
          Six lessons. One clear path.
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 48, lineHeight: 1.7 }}>
          Each lesson builds on the last. Most learners finish in 2–3 weeks.
          Go at your own pace.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { num: "01", title: "What is the NSE?", desc: "What the Nairobi Securities Exchange is, who regulates it, and what investing on it actually means.", time: "~15 min" },
            { num: "02", title: "CDS Accounts & Licensed Brokers", desc: "How to open a CDS account, what the CDSC is, and — critically — how to recognise a legitimate broker versus an investment scam.", time: "~20 min" },
            { num: "03", title: "Reading a Stock Listing", desc: "How to read the information published for any NSE-listed company. What matters. What doesn't.", time: "~20 min" },
            { num: "04", title: "Understanding Price Movements", desc: "Why prices move, what charts actually show, and why short-term movements are mostly noise for a long-term investor.", time: "~20 min" },
            { num: "05", title: "Your First Buy Order", desc: "The exact process of placing an order through a licensed broker. What to expect. What it costs.", time: "~25 min" },
            { num: "06", title: "After You Invest", desc: "Reading your CDS statement, understanding dividends, and what to do when prices fall.", time: "~20 min" },
          ].map((lesson, i) => (
            <div key={lesson.num} style={{
              display: "flex", gap: 20, padding: "20px 0",
              borderBottom: i < 5 ? "1px solid var(--border-subtle)" : "none",
            }}>
              <span className="mono-label" style={{ minWidth: 24, paddingTop: 3 }}>{lesson.num}</span>
              <div>
                <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 4px" }}>
                  {lesson.title}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 6px", lineHeight: 1.6 }}>
                  {lesson.desc}
                </p>
                <span className="mono-label">{lesson.time}</span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 32, fontSize: 14, color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.7 }}>
          After completing these six lessons, you will understand the NSE well enough to make an informed first investment. Not a guaranteed one. An informed one.
        </p>
      </section>

      {/* WHAT VUKA IS NOT */}
      <section style={{ background: "var(--bg-secondary)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p className="mono-label" style={{ marginBottom: 16 }}>Important</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 400, marginBottom: 16 }}>
            What this is not
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 40, lineHeight: 1.7 }}>
            Investment scams are common in Kenya. You should know exactly what Vuka is and is not before spending any time here.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              {
                title: "Not a broker",
                body: "Vuka does not sell shares, earn commissions, or have any financial interest in what you invest in. We make nothing whether you invest or not.",
              },
              {
                title: "Not a signal service",
                body: "We will never tell you what to buy. Anyone who tells you which stock to buy and claims it will definitely rise is not educating you.",
              },
              {
                title: "Not a get-rich scheme",
                body: "Investing takes time. Years. We show you what realistic long-term NSE returns have looked like — not the best year. The average year.",
              },
            ].map((card) => (
              <div key={card.title} style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-default)",
                borderRadius: 10, padding: 24,
              }}>
                <p style={{ color: "var(--error)", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>✗ {card.title}</p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{card.body}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 32, padding: "20px 24px",
            borderTop: "1px solid var(--border-subtle)",
          }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>
              If you have seen WhatsApp groups promising 30% monthly returns, forex trading bots, or crypto investment packages from a friend — this course explains why those are dangerous and what real investing actually looks like.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "72px 24px" }}>
        <p className="mono-label" style={{ marginBottom: 16 }}>Questions</p>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 400, marginBottom: 40 }}>
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
              <span style={{ color: "var(--text-tertiary)", fontSize: 18, flexShrink: 0 }}>
                {openFaq === i ? "−" : "+"}
              </span>
            </button>
            {openFaq === i && (
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, paddingBottom: 20, margin: 0 }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* FINAL CTA */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 400, marginBottom: 16 }}>
          The course takes about three weeks.
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 32, lineHeight: 1.7 }}>
          20–30 minutes per lesson. No deadline. No streak pressure.<br />
          Just the information you need.
        </p>
        <Link href="/auth/signup" style={{
          background: "var(--accent-green)", color: "#fff",
          padding: "12px 32px", borderRadius: 8, textDecoration: "none",
          fontSize: 15, fontWeight: 500, display: "inline-block",
        }}>
          Begin the course
        </Link>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 12 }}>
          Free. No credit card. No broker account needed to start.
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: 0 }}>
          © 2025 Vuka · NSE Investing Education · No financial products sold
        </p>
      </footer>
    </div>
  );
}
