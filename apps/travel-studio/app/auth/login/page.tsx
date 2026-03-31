"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from "../../../lib/supabase/client";
import { color, fontFamily, radius, shadow } from "../../../config/tokens";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontFamily: fontFamily.system,
        }}
      >
        <h2>Authentication Not Configured</h2>
        <p style={{ color: color.text.muted }}>
          Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          enable login.
        </p>
        <a href="/" style={{ color: color.accent.blue }}>
          Back to Dashboard
        </a>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const client = getSupabaseClient();
      if (!client) {
        setError("Authentication is not configured");
        return;
      }
      const { error: authError } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Travel Studio</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span style={styles.errorIcon}>!</span>
            {error}
          </div>
        )}

        <label style={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            style={styles.input}
          />
        </label>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Signing in..." : "Sign in with Supabase"}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    background: color.bg.page,
    fontFamily: fontFamily.system,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    padding: "2rem",
    background: color.bg.card,
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.xl,
    boxShadow: shadow.lg,
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "0.5rem",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 700,
    color: color.text.primary,
  },
  subtitle: {
    margin: "0.25rem 0 0",
    fontSize: "0.875rem",
    color: color.text.muted,
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    color: color.accent.red,
    background: color.bg.redLight,
    borderRadius: radius.md,
  },
  errorIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    fontSize: "0.75rem",
    fontWeight: 700,
    borderRadius: "50%",
    background: color.accent.red,
    color: color.text.inverse,
    flexShrink: 0,
  },
  label: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: color.text.secondary,
  },
  input: {
    padding: "0.625rem 0.75rem",
    fontSize: "0.875rem",
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.md,
    background: color.bg.card,
    color: color.text.primary,
    outline: "none",
    transition: "border-color 0.15s",
  },
  button: {
    padding: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: color.text.inverse,
    background: color.accent.blue,
    border: "none",
    borderRadius: radius.md,
    cursor: "pointer",
    transition: "background 0.15s",
    marginTop: "0.25rem",
  },
};
