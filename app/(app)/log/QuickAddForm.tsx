"use client";

import { useState, useTransition } from "react";
import { logNewFoodItem } from "./actions";

const MEAL_OPTIONS = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "supplement", label: "Supplement" },
] as const;

export function QuickAddForm() {
  const [foodCategory, setFoodCategory] = useState<"whole_food" | "supplement">(
    "whole_food"
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3 rounded-2xl bg-surface p-4"
      action={(formData) => {
        startTransition(async () => {
          const result = await logNewFoodItem(formData);
          setError(result.error);
        });
      }}
    >
      <div className="flex gap-2">
        <input
          type="text"
          name="name"
          required
          placeholder="What'd you eat?"
          className="flex-1 rounded-xl border border-white/10 bg-surface-raised px-3 py-2 text-sm outline-none focus:border-accent-lime"
        />
        <input
          type="number"
          name="servings"
          defaultValue={1}
          step="0.25"
          min="0.25"
          className="w-20 rounded-xl border border-white/10 bg-surface-raised px-3 py-2 text-sm outline-none focus:border-accent-lime"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <input
          type="number"
          name="calories"
          placeholder="kcal"
          required
          className="rounded-xl border border-white/10 bg-surface-raised px-3 py-2 text-sm outline-none focus:border-accent-lime"
        />
        <input
          type="number"
          name="protein"
          placeholder="protein g"
          required
          className="rounded-xl border border-white/10 bg-surface-raised px-3 py-2 text-sm outline-none focus:border-accent-lime"
        />
        <input
          type="number"
          name="carbs"
          placeholder="carbs g"
          className="rounded-xl border border-white/10 bg-surface-raised px-3 py-2 text-sm outline-none focus:border-accent-lime"
        />
        <input
          type="number"
          name="fat"
          placeholder="fat g"
          className="rounded-xl border border-white/10 bg-surface-raised px-3 py-2 text-sm outline-none focus:border-accent-lime"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          name="mealCategory"
          defaultValue="snack"
          className="rounded-xl border border-white/10 bg-surface-raised px-3 py-2 text-sm outline-none focus:border-accent-lime"
        >
          {MEAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex rounded-xl bg-surface-raised p-1 text-xs">
          {(["whole_food", "supplement"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFoodCategory(cat)}
              className={`rounded-lg px-3 py-1.5 font-medium transition ${
                foodCategory === cat
                  ? "bg-accent-gold text-background"
                  : "text-muted"
              }`}
            >
              {cat === "whole_food" ? "Food" : "Supplement"}
            </button>
          ))}
        </div>
        <input type="hidden" name="foodCategory" value={foodCategory} />

        <button
          type="submit"
          disabled={isPending}
          className="btn-glow btn-glow-lime ml-auto rounded-xl bg-accent-lime px-4 py-2 text-sm font-bold text-background transition disabled:opacity-60"
        >
          {isPending ? "Logging..." : "Log it 💪"}
        </button>
      </div>
      {error && <p className="text-sm text-accent-coral">{error}</p>}
    </form>
  );
}
