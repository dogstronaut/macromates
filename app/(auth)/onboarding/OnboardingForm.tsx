"use client";

import { useState, useTransition } from "react";
import { completeOnboarding } from "./actions";
import { GoalCalculator } from "@/components/calculator/GoalCalculator";

export function OnboardingForm() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(150);

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-5"
      action={(formData) => {
        startTransition(async () => {
          const result = await completeOnboarding(formData);
          if (result?.error) setError(result.error);
        });
      }}
    >
      <div className="flex rounded-xl bg-surface p-1 text-sm">
        {(["create", "join"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg py-2 font-medium transition ${
              mode === m ? "bg-accent-lime text-background" : "text-muted"
            }`}
          >
            {m === "create" ? "Start a household" : "Join my mate"}
          </button>
        ))}
      </div>
      <input type="hidden" name="mode" value={mode} />

      <label className="flex flex-col gap-2 text-sm text-muted">
        Your name
        <input
          type="text"
          name="name"
          required
          placeholder="Daniel"
          className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
        />
      </label>

      {mode === "join" && (
        <label className="flex flex-col gap-2 text-sm text-muted">
          Household code (ask your mate)
          <input
            type="text"
            name="inviteCode"
            required
            placeholder="paste code here"
            className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
          />
        </label>
      )}

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-sm text-muted">
          Daily calories
          <input
            type="number"
            name="dailyCalorieGoal"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(Number(e.target.value))}
            required
            className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-muted">
          Daily protein (g)
          <input
            type="number"
            name="dailyProteinGoal"
            value={proteinGoal}
            onChange={(e) => setProteinGoal(Number(e.target.value))}
            required
            className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground outline-none focus:border-accent-lime"
          />
        </label>
      </div>

      <GoalCalculator
        onApply={(calories, protein) => {
          setCalorieGoal(calories);
          setProteinGoal(protein);
        }}
      />

      <button
        type="submit"
        disabled={isPending}
        className="btn-glow btn-glow-lime rounded-xl bg-accent-lime px-4 py-3 font-bold text-background transition disabled:opacity-60"
      >
        {isPending ? "Setting things up..." : "Let's go! 🚀"}
      </button>
      {error && <p className="text-sm text-accent-coral">{error}</p>}
    </form>
  );
}
