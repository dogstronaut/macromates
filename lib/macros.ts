import type { FoodItem, LogEntry } from "@/types/database";

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function sumDailyTotals(
  entries: LogEntry[],
  foodItemsById: Record<string, FoodItem>
): DailyTotals {
  return entries.reduce<DailyTotals>(
    (totals, entry) => {
      const food = foodItemsById[entry.food_item_id];
      if (!food) return totals;
      return {
        calories: totals.calories + food.calories_per_serving * entry.servings,
        protein: totals.protein + food.protein_per_serving * entry.servings,
        carbs: totals.carbs + (food.carbs_per_serving ?? 0) * entry.servings,
        fat: totals.fat + (food.fat_per_serving ?? 0) * entry.servings,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function proteinProgress(totalProtein: number, goal: number): number {
  if (goal <= 0) return 0;
  return totalProtein / goal;
}

export function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}
