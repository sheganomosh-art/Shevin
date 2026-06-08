"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: "100%", background: "var(--bg-tertiary)",
    border: "1px solid var(--border-default)", borderRadius: 8,
    padding: "10px 14px", color: "var(--text-primary)", fontSize: 15,
    fontFamily: "inherit", outline: "none",
  } as React.CSSProperties;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/" style={{ color: "var(--text-tertiary)", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 32 }}>← Back</Link>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Welcome back</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32 }}>Sign in to continue your course.</p>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontFamily: "Courier New, monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-tertiary)", marginBottom: 6 }}>
              Email address
            </label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "Courier New, monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-tertiary)", marginBottom: 6 }}>
              Password
            </label>
            <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p style={{ color: "var(--error)", fontSize: 13 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            background: "var(--accent-green)", color: "#fff", border: "none", borderRadius: 8,
            padding: "12px", fontSize: 15, fontWeight: 500, cursor: "pointer",
            fontFamily: "inherit", marginTop: 8, opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-tertiary)", marginTop: 24 }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" style={{ color: "var(--accent-green)", textDecoration: "none" }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}
