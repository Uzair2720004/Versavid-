"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Input, Field, Spinner } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { AuthDemo } from "./AuthDemo";
import { useApp } from "@/lib/store";
import { passwordStrength } from "@/lib/utils";

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { signup, login, loginWithGoogle } = useApp();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";
  const strength = passwordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isSignup) {
        await signup({ fullName: `${first} ${last}`.trim() || "Creator", email, password });
      } else {
        await login({ email, password });
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      await loginWithGoogle();
      // With Supabase the browser redirects to Google and returns via
      // /auth/callback; in local-demo mode we navigate ourselves.
      router.push("/dashboard");
    } catch {
      setError("Could not start Google sign-in. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — animated product demo */}
      <div className="relative hidden border-r border-edge bg-panel/40 lg:block">
        <div className="absolute left-8 top-8 z-10">
          <Logo />
        </div>
        <AuthDemo />
      </div>

      {/* Right — form */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-6 py-6 lg:hidden">
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md animate-fade-up">
            {isSignup && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-sm font-medium text-accent-soft">
                <Icon name="gift" size={15} />
                3 free videos every month
              </div>
            )}

            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {isSignup
                ? "Start turning ideas into videos in minutes."
                : "Log in to pick up where you left off."}
            </p>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-[10px] border border-edge bg-canvas px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-edge-strong hover:bg-panel-2 disabled:opacity-50"
            >
              <GoogleGlyph />
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-edge" />
              <span className="text-xs uppercase tracking-wider text-muted">or</span>
              <span className="h-px flex-1 bg-edge" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name">
                    <Input
                      value={first}
                      onChange={(e) => setFirst(e.target.value)}
                      placeholder="Alex"
                      autoComplete="given-name"
                      required
                    />
                  </Field>
                  <Field label="Last name">
                    <Input
                      value={last}
                      onChange={(e) => setLast(e.target.value)}
                      placeholder="Rivera"
                      autoComplete="family-name"
                      required
                    />
                  </Field>
                </div>
              )}

              <Field label="Email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@channel.com"
                  autoComplete="email"
                  required
                />
              </Field>

              <Field label="Password">
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    required
                    minLength={6}
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    <Icon name={showPw ? "eye-off" : "eye"} size={18} />
                  </button>
                </div>
              </Field>

              {isSignup && password.length > 0 && (
                <div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-colors"
                        style={{ background: i < strength.score ? strength.color : "#21262d" }}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs" style={{ color: strength.color }}>
                    Password strength: {strength.label}
                  </p>
                </div>
              )}

              {!isSignup && (
                <div className="flex justify-end">
                  <Link href="#" className="text-sm text-accent-soft hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              {error && <p className="text-sm text-pink">{error}</p>}

              <Button type="submit" size="lg" fullWidth disabled={busy}>
                {busy ? <Spinner size={18} /> : isSignup ? "Create account" : "Log in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              {isSignup ? "Already have an account?" : "New to VersaVid?"}{" "}
              <Link
                href={isSignup ? "/auth/login" : "/auth/signup"}
                className="font-medium text-accent-soft hover:underline"
              >
                {isSignup ? "Log in" : "Create one free"}
              </Link>
            </p>

            {isSignup && (
              <p className="mt-4 text-center text-xs text-muted">
                By signing up you agree to our Terms & Privacy Policy.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
