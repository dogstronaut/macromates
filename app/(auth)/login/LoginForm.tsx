"use client";

import { useState, useTransition } from "react";
import { signInWithMagicLink } from "./actions";

export function LoginForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      action={(formData) => {
        startTransition(async () => {
          const result = await signInWithMagicLink(formData);
          if (result.error) {
            setStatus("error");
            setMessage(result.error);
          } else {
            setStatus("sent");
            setMessage("Check your email for a magic link.");
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
      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-accent-lime px-4 py-3 font-semibold text-background transition hover:brightness-110 disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send magic link"}
      </button>
      {message && (
        <p
          className={
            status === "error" ? "text-sm text-accent-coral" : "text-sm text-accent-lime"
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
