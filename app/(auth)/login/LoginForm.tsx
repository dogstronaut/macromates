"use client";

import { useState, useTransition } from "react";
import {
  requestPasswordReset,
  signInWithPassword,
  signUpWithPassword,
} from "./actions";

type Mode = "login" | "signup" | "forgot";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {mode !== "forgot" && (
        <div className="flex rounded-xl bg-surface p-1 text-sm">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 rounded-lg py-2 font-medium transition ${
                mode === m ? "bg-accent-lime text-background" : "text-muted"
              }`}
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex flex-col gap-4"
        action={(formData) => {
          setError(null);
          setNotice(null);
          startTransition(async () => {
            if (mode === "signup") {
              const result = await signUpWithPassword(formData);
              if (result?.error) setError(result.error);
            } else if (mode === "forgot") {
              const result = await requestPasswordReset(formData);
              if (result?.error) setError(result.error);
              else setNotice("Check your email for a reset link.");
            } else {
              const result = await signInWithPassword(formData);
              if (result?.error) setError(result.error);
            }
          });
        }}
      >
        <label className="flex flex-col gap-2 text-sm text-muted">
          Email
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
          />
        </label>

        {mode !== "forgot" && (
          <label className="flex flex-col gap-2 text-sm text-muted">
            Password
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
              className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
            />
          </label>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="btn-glow btn-glow-lime rounded-xl bg-accent-lime px-4 py-3 font-bold text-background transition disabled:opacity-60"
        >
          {isPending
            ? "Working..."
            : mode === "signup"
              ? "Create account 🚀"
              : mode === "forgot"
                ? "Send reset link"
                : "Log in →"}
        </button>

        {mode === "login" && (
          <button
            type="button"
            onClick={() => switchMode("forgot")}
            className="text-left text-xs text-muted underline decoration-dotted underline-offset-4 hover:text-foreground"
          >
            Forgot password?
          </button>
        )}
        {mode === "forgot" && (
          <button
            type="button"
            onClick={() => switchMode("login")}
            className="text-left text-xs text-muted underline decoration-dotted underline-offset-4 hover:text-foreground"
          >
            ← Back to login
          </button>
        )}

        {error && <p className="text-sm text-accent-coral">{error}</p>}
        {notice && <p className="text-sm text-accent-lime">{notice}</p>}
      </form>
    </div>
  );
}
