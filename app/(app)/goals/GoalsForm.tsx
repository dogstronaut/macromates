"use client";

import { useState, useTransition } from "react";
import { updateGoals } from "./actions";
import type { UserProfile } from "@/types/database";

export function GoalsForm({ profile }: { profile: UserProfile }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      action={(formData) => {
        startTransition(async () => {
          const result = await updateGoals(formData);
          setError(result.error);
          setSaved(!result.error);
        });
      }}
    >
      <label className="flex flex-col gap-2 text-sm text-muted">
        Daily calories
        <input
          type="number"
          name="dailyCalorieGoal"
          defaultValue={profile.daily_calorie_goal}
          required
          className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-muted">
        Daily protein (g)
        <input
          type="number"
          name="dailyProteinGoal"
          defaultValue={profile.daily_protein_goal}
          required
          className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-muted">
        Daily carbs (g) — optional
        <input
          type="number"
          name="dailyCarbGoal"
          defaultValue={profile.daily_carb_goal ?? ""}
          className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-muted">
        Daily fat (g) — optional
        <input
          type="number"
          name="dailyFatGoal"
          defaultValue={profile.daily_fat_goal ?? ""}
          className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-accent-lime px-4 py-3 font-semibold text-background transition hover:brightness-110 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save goals"}
      </button>
      {error && <p className="text-sm text-accent-coral">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-accent-lime">Goals updated.</p>
      )}
    </form>
  );
}
