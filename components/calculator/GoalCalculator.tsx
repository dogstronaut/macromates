"use client";

import { useState } from "react";
import {
  calculateTdee,
  feetInchesToCm,
  poundsToKg,
  type ActivityLevel,
  type Goal,
  type Sex,
  type TdeeResult,
} from "@/lib/tdee";

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary — little to no exercise" },
  { value: "light", label: "Light — active 1-3 days/week" },
  { value: "moderate", label: "Moderate — active 3-5 days/week" },
  { value: "active", label: "Active — active 6-7 days/week" },
  { value: "extra_active", label: "Extra active — training + physical job" },
];

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "cut", label: "Lose fat" },
  { value: "maintain", label: "Maintain" },
  { value: "bulk", label: "Build muscle" },
];

export function GoalCalculator({
  onApply,
}: {
  onApply: (calories: number, protein: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(30);
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(9);
  const [weightLb, setWeightLb] = useState(165);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [result, setResult] = useState<TdeeResult | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-left text-sm font-semibold text-accent-lime underline decoration-dotted underline-offset-4 transition hover:text-accent-lime/80"
      >
        Not sure what your numbers should be? Let&apos;s figure it out →
      </button>
    );
  }

  return (
    <div className="pop-in flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface-raised p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-extrabold">🧮 Quick goal calculator</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-muted hover:text-foreground"
        >
          Close
        </button>
      </div>

      <div className="flex rounded-xl bg-surface p-1 text-xs">
        {(["male", "female"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSex(s)}
            className={`flex-1 rounded-lg py-2 font-medium capitalize transition ${
              sex === s ? "bg-accent-gold text-background" : "text-muted"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Age
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-surface px-2 py-2 text-sm text-foreground outline-none focus:border-accent-lime"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Weight (lb)
          <input
            type="number"
            value={weightLb}
            onChange={(e) => setWeightLb(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-surface px-2 py-2 text-sm text-foreground outline-none focus:border-accent-lime"
          />
        </label>
      </div>

      <div className="flex flex-col gap-1 text-xs text-muted">
        Height
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={heightFeet}
              onChange={(e) => setHeightFeet(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-surface px-2 py-2 text-sm text-foreground outline-none focus:border-accent-lime"
            />
            <span>ft</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={heightInches}
              onChange={(e) => setHeightInches(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-surface px-2 py-2 text-sm text-foreground outline-none focus:border-accent-lime"
            />
            <span>in</span>
          </div>
        </div>
      </div>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Activity level
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
          className="rounded-lg border border-white/10 bg-surface px-2 py-2 text-sm text-foreground outline-none focus:border-accent-lime"
        >
          {ACTIVITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex rounded-xl bg-surface p-1 text-xs">
        {GOAL_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setGoal(opt.value)}
            className={`flex-1 rounded-lg py-2 font-medium transition ${
              goal === opt.value ? "bg-accent-coral text-background" : "text-muted"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          setResult(
            calculateTdee({
              sex,
              age,
              heightCm: feetInchesToCm(heightFeet, heightInches),
              weightKg: poundsToKg(weightLb),
              activityLevel,
              goal,
            })
          )
        }
        className="btn-glow btn-glow-lime rounded-xl bg-accent-lime px-4 py-2.5 text-sm font-bold text-background"
      >
        Crunch the numbers
      </button>

      {result && (
        <div className="pop-in flex flex-col gap-3 rounded-xl bg-surface p-3 text-sm">
          <p>
            Your estimate:{" "}
            <span className="font-bold text-accent-lime">
              {result.calorieGoal} kcal
            </span>{" "}
            ·{" "}
            <span className="font-bold text-accent-coral">
              {result.proteinGoal}g protein
            </span>
          </p>
          <button
            type="button"
            onClick={() => {
              onApply(result.calorieGoal, result.proteinGoal);
              setOpen(false);
            }}
            className="btn-glow btn-glow-coral rounded-xl bg-accent-coral px-4 py-2.5 text-sm font-bold text-background"
          >
            Use these numbers
          </button>
        </div>
      )}
    </div>
  );
}
