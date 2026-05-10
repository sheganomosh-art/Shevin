"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getLessonById, getNextLesson, LESSON_COMPLETE_MESSAGES } from "@/content/lessons";

type PageState = "reading" | "quiz" | "passed" | "failed";

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i}>{line.slice(4)}</h3>);
    } else if (line.startsWith("<warning>")) {
      const end = lines.findIndex((l, idx) => idx > i && l.includes("</warning>"));
      const text = lines.slice(i + 1, end).join(" ");
      elements.push(<div key={i} className="warning-block"><strong>⚠ Important:</strong> {text}</div>);
      i = end;
    } else if (line.startsWith("<kenya>")) {
      const end = lines.findIndex((l, idx) => idx > i && l.includes("</kenya>"));
      const text = lines.slice(i + 1, end).join(" ");
      elements.push(<div key={i} className="kenya-block"><strong>🇰🇪 Kenya context:</strong> {text}</div>);
      i = end;
    } else if (line.startsWith("<tip>")) {
      const end = lines.findIndex((l, idx) => idx > i && l.includes("</tip>"));
      const text = lines.slice(i + 1, end).join(" ");
      elements.push(<div key={i} className="tip-block"><strong>💡 Tip:</strong> {text}</div>);
      i = end;
    } else if (line.startsWith("- **")) {
      const boldMatch = line.match(/- \*\*(.+?)\*\* — (.+)/);
      if (boldMatch) {
        elements.push(
          <p key={i} style={{ margin: "8px 0", paddingLeft: 16, borderLeft: "2px solid var(--border-default)" }}>
            <strong style={{ color: "var(--text-primary)" }}>{boldMatch[1]}</strong>
            {" — "}{boldMatch[2]}
          </p>
        );
      }
    } else if (line.startsWith("- ")) {
      elements.push(
        <p key={i} style={{ margin: "6px 0", paddingLeft: 16, color: "var(--text-secondary)" }}>
          · {line.slice(2)}
        </p>
      );
    } else if (line.trim() && !line.startsWith("<")) {
      // Handle inline bold
      const parts = line.split(/\*\*(.+?)\*\*/g);
      const rendered = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j} style={{ color: "var(--text-primary)" }}>{part}</strong> : part
      );
      elements.push(<p key={i} style={{ margin: "0 0 1.4em" }}>{rendered}</p>);
    }
    i++;
  }
  return elements;
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;
  const lesson = getLessonById(lessonId);
  const nextLesson = getNextLesson(lessonId);

  const [pageState, setPageState] = useState<PageState>("reading");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [mwalimuOpen, setMwalimuOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("vuka_user")) router.push("/auth/login");
  }, [router]);

  // Scroll depth tracking — unlocks quiz at 80%
  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight;
      const scrolled = window.scrollY - el.offsetTop + window.innerHeight;
      if (scrolled / total > 0.75) setQuizUnlocked(true);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!lesson) return <div style={{ padding: 40, color: "var(--text-secondary)" }}>Lesson not found.</div>;

  const allAnswered = lesson.quiz.every(q => selectedAnswers[q.id]);

  const handleSubmitQuiz = () => {
    let correct = 0;
    lesson.quiz.forEach(q => { if (selectedAnswers[q.id] === q.correctId) correct++; });
    setScore(correct);
    setSubmitted(true);
    const passed = correct >= 4;
    setPageState(passed ? "passed" : "failed");

    if (passed) {
      const stored = sessionStorage.getItem("vuka_user");
      if (stored) {
        const user = JSON.parse(stored);
        const completed = user.lessonsCompleted ?? [];
        if (!completed.includes(lesson.id)) {
          user.lessonsCompleted = [...completed, lesson.id];
          sessionStorage.setItem("vuka_user", JSON.stringify(user));
        }
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setPageState("quiz");
    setScore(0);
  };

  const handleSendMwalimu = async () => {
    if (!input.trim() || aiLoading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setAiLoading(true);
    try {
      const res = await fetch("/api/mwalimu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, lessonId: lesson.id }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply ?? "Sorry, I could not get a response. Try again." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "No connection. Check your internet and try again." }]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(13,17,23,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
        height: 56, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px",
      }}>
        <Link href="/dashboard" style={{ color: "var(--text-secondary)", fontSize: 14, textDecoration: "none" }}>
          ← Dashboard
        </Link>
        <span className="mono-label">Lesson {lesson.orderIndex} of 6</span>
      </nav>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 120px" }}>

        {/* READING STATE */}
        {pageState === "reading" && (
          <>
            <p className="mono-label" style={{ marginBottom: 16 }}>
              NSE Foundations · Lesson {lesson.orderIndex} · ~{lesson.estimatedMins} min
            </p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 40 }}>
              {lesson.title}
            </h1>
            <div ref={contentRef} className="lesson-body">
              {renderContent(lesson.content)}
            </div>

            {/* Quiz unlock */}
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border-subtle)" }}>
              {quizUnlocked ? (
                <div>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 20 }}>
                    You have read through this lesson. Answer 5 questions to complete it.
                    You need 4 correct to continue.
                  </p>
                  <button onClick={() => setPageState("quiz")} style={{
                    background: "var(--accent-green)", color: "#fff", border: "none",
                    borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 500,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    Take the quiz →
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: 14, color: "var(--text-tertiary)", fontStyle: "italic" }}>
                  Keep reading — the quiz unlocks when you reach the end of the lesson.
                </p>
              )}
            </div>
          </>
        )}

        {/* QUIZ STATE */}
        {pageState === "quiz" && !submitted && (
          <>
            <p className="mono-label" style={{ marginBottom: 12 }}>{lesson.title} · Quiz</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 400, marginBottom: 8 }}>
              5 questions. 4 correct to pass.
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 36 }}>
              No time limit. Answer all five, then submit.
            </p>

            {lesson.quiz.map((q, qi) => (
              <div key={q.id} style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", marginBottom: 14, lineHeight: 1.5 }}>
                  <span className="mono-label" style={{ marginRight: 8 }}>{qi + 1}.</span>
                  {q.question}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map(opt => {
                    const selected = selectedAnswers[q.id] === opt.id;
                    return (
                      <button key={opt.id} onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                        style={{
                          textAlign: "left", padding: "12px 16px", borderRadius: 8,
                          background: selected ? "var(--accent-green-dim)" : "var(--bg-secondary)",
                          border: `1px solid ${selected ? "var(--accent-green)" : "var(--border-default)"}`,
                          color: selected ? "#3fb950" : "var(--text-secondary)",
                          fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                          display: "flex", gap: 10, alignItems: "flex-start",
                          minHeight: 48, transition: "all 0.15s",
                        }}>
                        <span className="mono-label" style={{ minWidth: 16, paddingTop: 2 }}>
                          {["A", "B", "C", "D"][q.options.indexOf(opt)]}
                        </span>
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button onClick={handleSubmitQuiz} disabled={!allAnswered}
              style={{
                background: allAnswered ? "var(--accent-green)" : "var(--bg-overlay)",
                color: allAnswered ? "#fff" : "var(--text-tertiary)",
                border: "none", borderRadius: 8, padding: "12px 28px",
                fontSize: 15, fontWeight: 500,
                cursor: allAnswered ? "pointer" : "not-allowed",
                fontFamily: "inherit", transition: "all 0.15s",
              }}>
              Submit answers
            </button>
          </>
        )}

        {/* PASSED STATE */}
        {pageState === "passed" && (
          <div>
            <p className="mono-label" style={{ marginBottom: 16, color: "var(--accent-green)" }}>Lesson complete</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 400, marginBottom: 16 }}>
              {score} of 5 correct.
            </h2>
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", borderLeft: "3px solid var(--accent-green)", borderRadius: "0 10px 10px 0", padding: "20px 24px", marginBottom: 32 }}>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                {LESSON_COMPLETE_MESSAGES[lesson.id]}
              </p>
            </div>

            {/* Answer review */}
            <div style={{ marginBottom: 36 }}>
              <p className="mono-label" style={{ marginBottom: 16 }}>Answer review</p>
              {lesson.quiz.map((q, qi) => {
                const chosen = selectedAnswers[q.id];
                const correct = chosen === q.correctId;
                return (
                  <div key={q.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: qi < lesson.quiz.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                    <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, color: "var(--text-primary)" }}>
                      {correct ? "✓" : "✗"} {q.question}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {nextLesson ? (
                <Link href={`/learn/${nextLesson.id}`} style={{
                  background: "var(--accent-green)", color: "#fff",
                  padding: "12px 28px", borderRadius: 8, textDecoration: "none",
                  fontSize: 15, fontWeight: 500,
                }}>
                  Continue to Lesson {nextLesson.orderIndex} →
                </Link>
              ) : (
                <Link href="/dashboard" style={{
                  background: "var(--accent-green)", color: "#fff",
                  padding: "12px 28px", borderRadius: 8, textDecoration: "none",
                  fontSize: 15, fontWeight: 500,
                }}>
                  Back to dashboard →
                </Link>
              )}
              <Link href="/dashboard" style={{
                background: "none", border: "1px solid var(--border-default)",
                color: "var(--text-secondary)", padding: "12px 24px",
                borderRadius: 8, textDecoration: "none", fontSize: 15,
              }}>
                Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* FAILED STATE */}
        {pageState === "failed" && (
          <div>
            <p className="mono-label" style={{ marginBottom: 16 }}>Not yet</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 400, marginBottom: 8 }}>
              {score} of 5 correct.
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.7 }}>
              You need 4 to pass. Review what you missed below, then try again.
              Lesson {lesson.orderIndex} has the content you need.
            </p>

            {/* Wrong answers */}
            <div style={{ marginBottom: 32 }}>
              <p className="mono-label" style={{ marginBottom: 16 }}>What to review</p>
              {lesson.quiz.filter(q => selectedAnswers[q.id] !== q.correctId).map((q) => (
                <div key={q.id} style={{
                  marginBottom: 16, padding: "16px 20px",
                  background: "var(--bg-secondary)", border: "1px solid var(--border-default)",
                  borderLeft: "3px solid var(--error)", borderRadius: "0 10px 10px 0",
                }}>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, color: "var(--text-primary)" }}>
                    {q.question}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    {q.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => { setPageState("reading"); window.scrollTo(0, 0); }}
                style={{
                  background: "var(--accent-green)", color: "#fff", border: "none",
                  borderRadius: 8, padding: "12px 24px", fontSize: 15, fontWeight: 500,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                Review lesson
              </button>
              <button onClick={handleRetry}
                style={{
                  background: "none", border: "1px solid var(--border-default)",
                  color: "var(--text-secondary)", borderRadius: 8,
                  padding: "12px 24px", fontSize: 15, cursor: "pointer", fontFamily: "inherit",
                }}>
                Retry quiz
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MWALIMU BUTTON */}
      {pageState === "reading" && (
        <button onClick={() => setMwalimuOpen(true)}
          style={{
            position: "fixed", bottom: 24, right: 24,
            background: "var(--accent-green)", color: "#fff",
            border: "none", borderRadius: "50%", width: 56, height: 56,
            fontSize: 22, cursor: "pointer", zIndex: 30,
            boxShadow: "0 4px 20px rgba(35,134,54,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }} title="Ask Mwalimu">
          🎓
        </button>
      )}

      {/* MWALIMU PANEL */}
      {mwalimuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          display: "flex", flexDirection: "column",
          background: "rgba(13,17,23,0.7)", backdropFilter: "blur(4px)",
        }} onClick={() => setMwalimuOpen(false)}>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "var(--bg-secondary)",
            borderTop: "1px solid var(--border-default)",
            borderRadius: "16px 16px 0 0",
            height: "70vh", display: "flex", flexDirection: "column",
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="mono-label">Mwalimu · Lesson {lesson.orderIndex} companion</span>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "2px 0 0" }}>
                  Ask anything about this lesson.
                </p>
              </div>
              <button onClick={() => setMwalimuOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-tertiary)", fontSize: 20, cursor: "pointer", padding: 4 }}>
                ✕
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.length === 0 && (
                <div style={{ background: "var(--bg-tertiary)", borderRadius: 10, padding: "12px 16px" }}>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                    You are studying <strong style={{ color: "var(--text-primary)" }}>{lesson.title}</strong>.
                    What would you like me to explain?
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {lesson.keyTerms.slice(0, 3).map(term => (
                      <button key={term} onClick={() => { setInput(`What is ${term}?`); }}
                        style={{
                          background: "var(--bg-overlay)", border: "1px solid var(--border-default)",
                          borderRadius: 20, padding: "4px 12px", fontSize: 12,
                          color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit",
                        }}>
                        What is {term}?
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    maxWidth: "80%", padding: "10px 14px", fontSize: 14, lineHeight: 1.6,
                    background: msg.role === "user" ? "var(--accent-green)" : "var(--bg-tertiary)",
                    color: msg.role === "user" ? "#fff" : "var(--text-secondary)",
                    borderRadius: msg.role === "user" ? "10px 10px 2px 10px" : "2px 10px 10px 10px",
                  } as React.CSSProperties}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display: "flex", gap: 6, padding: "8px 0" }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10 }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMwalimu(); } }}
                placeholder="Ask about this lesson..."
                rows={1}
                style={{
                  flex: 1, background: "var(--bg-tertiary)", border: "1px solid var(--border-default)",
                  borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)",
                  fontSize: 14, fontFamily: "inherit", outline: "none", resize: "none",
                }} />
              <button onClick={handleSendMwalimu} disabled={!input.trim() || aiLoading}
                style={{
                  background: input.trim() && !aiLoading ? "var(--accent-green)" : "var(--bg-overlay)",
                  color: input.trim() && !aiLoading ? "#fff" : "var(--text-tertiary)",
                  border: "none", borderRadius: 8, padding: "10px 16px",
                  fontSize: 14, cursor: input.trim() && !aiLoading ? "pointer" : "not-allowed",
                  fontFamily: "inherit", transition: "all 0.15s",
                }}>
                Send
              </button>
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-tertiary)", padding: "0 16px 12px" }}>
              Mwalimu explains concepts. For investment decisions, speak to a licensed broker.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
