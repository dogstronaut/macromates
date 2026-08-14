"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "./actions";

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await updatePassword(formData);
          if (result?.error) setError(result.error);
        });
      }}
    >
      <label className="flex flex-col gap-2 text-sm text-muted">
        New password
        <input
          type="password"
          name="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="btn-glow btn-glow-lime rounded-xl bg-accent-lime px-4 py-3 font-bold text-background transition disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Update password"}
      </button>
      {error && <p className="text-sm text-accent-coral">{error}</p>}
    </form>
  );
}
