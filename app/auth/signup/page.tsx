"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: "100%", background: "var(--bg-tertiary)",
    border: "1px solid var(--border-default)", borderRadius: 8,
    padding: "10px 14px", color: "var(--text-primary)", fontSize: 15,
    fontFamily: "inherit", outline: "none",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block", fontFamily: "Courier New, monospace",
    fontSize: 11, textTransform: "uppercase" as const,
    letterSpacing: "0.12em", color: "var(--text-tertiary)", marginBottom: 6,
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) { setError("Please select a goal."); return; }
    setError("");
    setStep(3);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience) { setError("Please select your experience level."); return; }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const joinedDate = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, goal, experience, lessonsCompleted: [], joinedDate },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const btnStyle = {
    width: "100%", background: "var(--accent-green)", color: "#fff",
    border: "none", borderRadius: 8, padding: "12px", fontSize: 15,
    fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
  } as React.CSSProperties;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/" style={{ color: "var(--text-tertiary)", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 32 }}>
          ← Back
        </Link>

        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: s <= step ? "var(--accent-green)" : "var(--bg-overlay)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Create your account</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32 }}>Free to join. No credit card needed.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={labelStyle}>Full name</label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Akinyi Wanjiru" />
              </div>
              <div>
                <label style={labelStyle}>Email address</label>
                <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" />
              </div>
            </div>
            {error && <p style={{ color: "var(--error)", fontSize: 13, marginTop: 12 }}>{error}</p>}
            <button type="submit" style={{ ...btnStyle, marginTop: 28 }}>Continue →</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>What is your main goal?</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32 }}>We will use this to focus your learning.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { value: "learn", label: "Learn to invest for the first time" },
                { value: "grow", label: "Grow long-term wealth" },
                { value: "income", label: "Generate passive income" },
                { value: "save", label: "Save for a big purchase" },
              ].map((opt) => (
                <button key={opt.value} type="button" onClick={() => setGoal(opt.value)}
                  style={{
                    textAlign: "left", padding: "14px 16px", borderRadius: 8,
                    background: goal === opt.value ? "var(--accent-green-dim)" : "var(--bg-secondary)",
                    border: `1px solid ${goal === opt.value ? "var(--accent-green)" : "var(--border-default)"}`,
                    color: goal === opt.value ? "#3fb950" : "var(--text-primary)",
                    fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {error && <p style={{ color: "var(--error)", fontSize: 13, marginTop: 12 }}>{error}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button type="button" onClick={() => setStep(1)}
                style={{ flex: 1, background: "none", border: "1px solid var(--border-default)", borderRadius: 8, padding: "12px", color: "var(--text-secondary)", fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
                ← Back
              </button>
              <button type="submit" style={{ ...btnStyle, flex: 2 }}>Continue →</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleFinish}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>How much do you know?</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32 }}>No wrong answers — this helps us pitch lessons at the right level.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { value: "none", label: "Complete beginner — I have never invested" },
                { value: "some", label: "I know the basics but need structure" },
                { value: "experienced", label: "I already invest and want to level up" },
              ].map((opt) => (
                <button key={opt.value} type="button" onClick={() => setExperience(opt.value)}
                  style={{
                    textAlign: "left", padding: "14px 16px", borderRadius: 8,
                    background: experience === opt.value ? "var(--accent-green-dim)" : "var(--bg-secondary)",
                    border: `1px solid ${experience === opt.value ? "var(--accent-green)" : "var(--border-default)"}`,
                    color: experience === opt.value ? "#3fb950" : "var(--text-primary)",
                    fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {error && <p style={{ color: "var(--error)", fontSize: 13, marginTop: 12 }}>{error}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button type="button" onClick={() => setStep(2)}
                style={{ flex: 1, background: "none", border: "1px solid var(--border-default)", borderRadius: 8, padding: "12px", color: "var(--text-secondary)", fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
                ← Back
              </button>
              <button type="submit" disabled={loading} style={{ ...btnStyle, flex: 2, opacity: loading ? 0.6 : 1 }}>
                {loading ? "Setting up..." : "Go to my dashboard →"}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-tertiary)", marginTop: 24 }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--accent-green)", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
