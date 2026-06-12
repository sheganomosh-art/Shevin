"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const labelStyle = {
  display: "block",
  fontFamily: "Courier New, monospace",
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  color: "var(--text-tertiary)",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  background: "var(--bg-tertiary)",
  border: "1px solid var(--border-default)",
  borderRadius: 8,
  padding: "10px 14px",
  color: "var(--text-primary)",
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
} as React.CSSProperties;

const GOALS = [
  { value: "learn",  label: "Learn to invest for the first time" },
  { value: "grow",   label: "Grow long-term wealth" },
  { value: "income", label: "Generate passive income" },
  { value: "save",   label: "Save for a big purchase" },
];

const EXPERIENCE_LEVELS = [
  { value: "none",         label: "Complete beginner — I have never invested" },
  { value: "some",         label: "I know the basics but need structure" },
  { value: "experienced",  label: "I already invest and want to level up" },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const btnPrimary = {
    width: "100%", background: "var(--accent-green)", color: "#fff",
    border: "none", borderRadius: 8, padding: "12px", fontSize: 15,
    fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
    transition: "opacity 0.15s",
  } as React.CSSProperties;

  const btnSecondary = {
    flex: 1, background: "none",
    border: "1px solid var(--border-default)", borderRadius: 8,
    padding: "12px", color: "var(--text-secondary)", fontSize: 15,
    cursor: "pointer", fontFamily: "inherit",
  } as React.CSSProperties;

  const optionBtn = (active: boolean) => ({
    textAlign: "left" as const, padding: "14px 16px", borderRadius: 8,
    background: active ? "var(--accent-green-dim)" : "var(--bg-secondary)",
    border: `1px solid ${active ? "var(--accent-green)" : "var(--border-default)"}`,
    color: active ? "#3fb950" : "var(--text-primary)",
    fontSize: 14, cursor: "pointer", fontFamily: "inherit",
    transition: "all 0.15s", width: "100%",
  } as React.CSSProperties);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) { setError("Please choose a goal."); return; }
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
        data: { name, full_name: name, goal, experience, lessonsCompleted: [], joinedDate },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/dashboard");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-primary)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/" style={{ color: "var(--text-tertiary)", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 32 }}>
          ← Back
        </Link>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 36 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: s <= step ? "var(--accent-green)" : "var(--bg-overlay)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* Step 1 — Account */}
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>
              Create your account
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32 }}>
              Free to join. No credit card needed.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={labelStyle}>Full name</label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Akinyi Wanjiru" autoComplete="name" />
              </div>
              <div>
                <label style={labelStyle}>Email address</label>
                <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
              </div>
            </div>
            {error && <p style={{ color: "var(--error)", fontSize: 13, marginTop: 12 }}>{error}</p>}
            <button type="submit" style={{ ...btnPrimary, marginTop: 28 }}>Continue →</button>
          </form>
        )}

        {/* Step 2 — Goal */}
        {step === 2 && (
          <form onSubmit={handleStep2}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>
              What is your main goal?
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32 }}>
              We will use this to focus your learning.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {GOALS.map(opt => (
                <button key={opt.value} type="button" onClick={() => setGoal(opt.value)} style={optionBtn(goal === opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
            {error && <p style={{ color: "var(--error)", fontSize: 13, marginTop: 12 }}>{error}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button type="button" onClick={() => setStep(1)} style={btnSecondary}>← Back</button>
              <button type="submit" style={{ ...btnPrimary, flex: 2 }}>Continue →</button>
            </div>
          </form>
        )}

        {/* Step 3 — Experience */}
        {step === 3 && (
          <form onSubmit={handleFinish}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>
              How much do you know?
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32 }}>
              No wrong answers — this helps us pitch lessons at the right level.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {EXPERIENCE_LEVELS.map(opt => (
                <button key={opt.value} type="button" onClick={() => setExperience(opt.value)} style={optionBtn(experience === opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
            {error && <p style={{ color: "var(--error)", fontSize: 13, marginTop: 12 }}>{error}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button type="button" onClick={() => setStep(2)} style={btnSecondary}>← Back</button>
              <button type="submit" disabled={loading} style={{ ...btnPrimary, flex: 2, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Setting up…" : "Go to my dashboard →"}
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
