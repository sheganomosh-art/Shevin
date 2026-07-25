"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LESSONS } from "@/content/lessons";

interface VukaUser {
  name: string; email: string; goal: string;
  experience: string; lessonsCompleted: string[]; joinedDate: string;
}

const MILESTONES = [
  { id: "what-is-nse", label: "You understand what the NSE is", desc: "Completed Lesson 1" },
  { id: "cds-accounts", label: "Scam-aware investor", desc: "You can recognise a licensed broker and a scam" },
  { id: "reading-listings", label: "Can read a stock listing", desc: "You know what the numbers actually mean" },
  { id: "price-movements", label: "Understands price movements", desc: "You know why short-term movements mostly don't matter" },
  { id: "first-order", label: "Ready to place a buy order", desc: "You know the exact process and costs" },
  { id: "after-investing", label: "NSE Foundations complete", desc: "You are prepared to make an informed first investment" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<VukaUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("vuka_user");
    if (!stored) { router.push("/auth/login"); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  if (!user) return null;

  const completed = user.lessonsCompleted ?? [];
  const initials = user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(13,17,23,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
        height: 56, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px",
      }}>
        <Link href="/dashboard" style={{ color: "var(--text-secondary)", fontSize: 14, textDecoration: "none" }}>← Dashboard</Link>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "var(--text-primary)", textDecoration: "none" }}>Vuka</Link>
      </nav>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--accent-green)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Georgia, serif", fontSize: 22, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 400, margin: "0 0 4px" }}>{user.name}</h1>
            <p className="mono-label">Member since {user.joinedDate}</p>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>NSE Foundations</p>
            <span className="mono-label">{completed.length} of 6</span>
          </div>
          <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: "var(--accent-green)",
              width: `${(completed.length / 6) * 100}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
          {completed.length === 6 && (
            <p style={{ fontSize: 13, color: "var(--accent-green)", marginTop: 12, fontWeight: 500 }}>
              Course complete. You are prepared to invest.
            </p>
          )}
        </div>

        {/* Milestones */}
        <div style={{ marginBottom: 24 }}>
          <p className="mono-label" style={{ marginBottom: 16 }}>Milestones</p>
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", borderRadius: 10, overflow: "hidden" }}>
            {MILESTONES.map((m, i) => {
              const achieved = completed.includes(m.id);
              return (
                <div key={m.id} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
                  borderBottom: i < MILESTONES.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  opacity: achieved ? 1 : 0.45,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: achieved ? "var(--accent-green)" : "var(--bg-overlay)",
                    border: achieved ? "none" : "1px solid var(--border-default)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13,
                  }}>
                    {achieved ? <span style={{ color: "#fff" }}>✓</span> : null}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 2px", color: "var(--text-primary)" }}>{m.label}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lesson list */}
        <div>
          <p className="mono-label" style={{ marginBottom: 16 }}>Lessons</p>
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", borderRadius: 10, overflow: "hidden" }}>
            {LESSONS.map((lesson, i) => {
              const done = completed.includes(lesson.id);
              return (
                <Link key={lesson.id} href={`/learn/${lesson.id}`} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                  textDecoration: "none",
                  borderBottom: i < LESSONS.length - 1 ? "1px solid var(--border-subtle)" : "none",
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: done ? "var(--accent-green)" : "transparent",
                    border: done ? "none" : "1px solid var(--border-emphasis)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                  }}>
                    {done ? <span style={{ color: "#fff" }}>✓</span> : <span className="mono-label" style={{ fontSize: 9 }}>{lesson.orderIndex}</span>}
                  </div>
                  <span style={{ fontSize: 14, color: done ? "var(--text-secondary)" : "var(--text-primary)" }}>
                    {lesson.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
