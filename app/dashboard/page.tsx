"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LESSONS } from "@/content/lessons";

interface VukaUser {
  name: string;
  email: string;
  goal: string;
  experience: string;
  lessonsCompleted: string[];
  joinedDate: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<VukaUser | null>(null);
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const stored = sessionStorage.getItem("vuka_user");
    if (!stored) { router.push("/auth/login"); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
  }, []);

  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const completed = user.lessonsCompleted ?? [];
  const nextLesson = LESSONS.find(l => !completed.includes(l.id));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(13,17,23,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
        height: 56, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px",
      }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "var(--text-primary)", textDecoration: "none" }}>Vuka</Link>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/profile" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Profile</Link>
          <button onClick={() => { sessionStorage.removeItem("vuka_user"); router.push("/"); }}
            style={{ fontSize: 14, color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Sign out
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        {/* Greeting */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>
            {greeting}, {firstName}.
          </h1>
          <p className="mono-label">NSE Foundations course</p>
        </div>

        {/* Next action card */}
        {nextLesson ? (
          <div style={{
            background: "var(--bg-secondary)", border: "1px solid var(--border-default)",
            borderRadius: 10, padding: 24, marginBottom: 32,
          }}>
            <p className="mono-label" style={{ marginBottom: 12, color: "var(--accent-green)" }}>
              {completed.length === 0 ? "Start here" : "Continue"}
            </p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 400, marginBottom: 6 }}>
              Lesson {nextLesson.orderIndex}: {nextLesson.title}
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
              ~{nextLesson.estimatedMins} min · {6 - completed.length} lesson{6 - completed.length !== 1 ? "s" : ""} remaining
            </p>
            <Link href={`/learn/${nextLesson.id}`} style={{
              display: "inline-block", background: "var(--accent-green)", color: "#fff",
              padding: "10px 24px", borderRadius: 8, textDecoration: "none",
              fontSize: 14, fontWeight: 500,
            }}>
              {completed.length === 0 ? "Start Lesson 1" : "Continue →"}
            </Link>
          </div>
        ) : (
          <div style={{
            background: "var(--bg-secondary)", border: "1px solid var(--border-default)",
            borderRadius: 10, padding: 24, marginBottom: 32,
          }}>
            <p className="mono-label" style={{ marginBottom: 12, color: "var(--accent-green)" }}>Complete</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 400, marginBottom: 8 }}>
              NSE Foundations — Done.
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              You have completed all six lessons. You are prepared to make an informed first investment.
              The next step is yours.
            </p>
          </div>
        )}

        {/* Lesson list */}
        <div style={{ marginBottom: 32 }}>
          <p className="mono-label" style={{ marginBottom: 16 }}>All lessons</p>
          <div style={{
            background: "var(--bg-secondary)", border: "1px solid var(--border-default)",
            borderRadius: 10, overflow: "hidden",
          }}>
            {LESSONS.map((lesson, i) => {
              const isDone = completed.includes(lesson.id);
              const isCurrent = lesson.id === nextLesson?.id;
              return (
                <Link key={lesson.id} href={`/learn/${lesson.id}`} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "16px 20px", textDecoration: "none",
                  borderBottom: i < LESSONS.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  background: isCurrent ? "rgba(35,134,54,0.06)" : "transparent",
                  transition: "background 0.15s",
                }}>
                  {/* Status icon */}
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isDone ? "var(--accent-green)" : "transparent",
                    border: isDone ? "none" : isCurrent ? "1.5px solid var(--accent-green)" : "1.5px solid var(--border-emphasis)",
                    fontSize: 11,
                  }}>
                    {isDone ? (
                      <span style={{ color: "#fff" }}>✓</span>
                    ) : (
                      <span className="mono-label" style={{ fontSize: 10 }}>{lesson.orderIndex}</span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: 14, fontWeight: 500, margin: "0 0 2px",
                      color: isDone ? "var(--text-secondary)" : "var(--text-primary)",
                    }}>
                      {lesson.title}
                    </p>
                    <p className="mono-label">~{lesson.estimatedMins} min</p>
                  </div>

                  {isDone && (
                    <span style={{ fontSize: 12, color: "var(--accent-green)", fontWeight: 500 }}>Done</span>
                  )}
                  {isCurrent && (
                    <span style={{ fontSize: 12, color: "var(--accent-green)", fontWeight: 500 }}>→</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Progress summary */}
        <div style={{
          background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
          borderRadius: 10, padding: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>NSE Foundations</span>
            <span className="mono-label">{completed.length} of 6 lessons</span>
          </div>
          <div style={{ height: 4, background: "var(--bg-overlay)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2, background: "var(--accent-green)",
              width: `${(completed.length / 6) * 100}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      </main>
    </div>
  );
}
