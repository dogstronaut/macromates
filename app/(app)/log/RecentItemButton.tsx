"use client";

import { useTransition } from "react";
import { logExistingFoodItem } from "./actions";
import type { MealCategory } from "@/types/database";

export function RecentItemButton({
  foodItemId,
  name,
  protein,
  calories,
  mealCategory,
}: {
  foodItemId: string;
  name: string;
  protein: number;
  calories: number;
  mealCategory: MealCategory;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          logExistingFoodItem(foodItemId, 1, mealCategory);
        })
      }
      className="flex flex-col items-start gap-1 rounded-xl border border-white/10 bg-surface-raised px-4 py-3 text-left text-sm transition hover:-translate-y-0.5 hover:border-accent-lime disabled:opacity-60"
    >
      <span className="font-medium">{name}</span>
      <span className="text-xs text-muted">
        {Math.round(calories)} kcal · {Math.round(protein)}g protein
      </span>
    </button>
  );
}
