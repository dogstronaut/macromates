import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { todayRange } from "@/lib/macros";
import type { FoodItem, LogEntry, MealCategory } from "@/types/database";
import { QuickAddForm } from "./QuickAddForm";
import { RecentItemButton } from "./RecentItemButton";

const MEAL_SECTIONS: { key: MealCategory; label: string }[] = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "snack", label: "Snacks" },
  { key: "supplement", label: "Supplements" },
];

export default async function LogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { start, end } = todayRange();

  const { data: entries } = await supabase
    .from("log_entries")
    .select("*")
    .eq("user_id", user.id)
    .gte("logged_at", start)
    .lte("logged_at", end)
    .order("logged_at", { ascending: false });

  const logEntries = (entries ?? []) as LogEntry[];
  const foodItemIds = [...new Set(logEntries.map((e) => e.food_item_id))];

  const { data: foodItems } = foodItemIds.length
    ? await supabase.from("food_items").select("*").in("id", foodItemIds)
    : { data: [] as FoodItem[] };

  const foodItemsById = Object.fromEntries(
    ((foodItems ?? []) as FoodItem[]).map((f) => [f.id, f])
  );

  const { data: recentEntries } = await supabase
    .from("log_entries")
    .select("food_item_id")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(30);

  const recentFoodItemIds = [
    ...new Set((recentEntries ?? []).map((e) => e.food_item_id)),
  ].slice(0, 6);

  const { data: recentFoodItems } = recentFoodItemIds.length
    ? await supabase.from("food_items").select("*").in("id", recentFoodItemIds)
    : { data: [] as FoodItem[] };

  return (
    <div className="flex flex-col gap-8">
      <QuickAddForm />

      {recentFoodItems && recentFoodItems.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted">
            Quick-add recents
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {(recentFoodItems as FoodItem[]).map((item) => (
              <RecentItemButton
                key={item.id}
                foodItemId={item.id}
                name={item.name}
                protein={item.protein_per_serving}
                calories={item.calories_per_serving}
                mealCategory={
                  item.category === "supplement" ? "supplement" : "snack"
                }
              />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-6">
        {MEAL_SECTIONS.map((section) => {
          const sectionEntries = logEntries.filter(
            (e) => e.meal_category === section.key
          );
          if (sectionEntries.length === 0) return null;

          const sectionTotals = sectionEntries.reduce(
            (acc, e) => {
              const food = foodItemsById[e.food_item_id];
              if (!food) return acc;
              return {
                calories: acc.calories + food.calories_per_serving * e.servings,
                protein: acc.protein + food.protein_per_serving * e.servings,
              };
            },
            { calories: 0, protein: 0 }
          );

          return (
            <div key={section.key}>
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="font-semibold">{section.label}</h3>
                <span className="text-xs text-muted">
                  {Math.round(sectionTotals.calories)} kcal ·{" "}
                  {Math.round(sectionTotals.protein)}g protein
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {sectionEntries.map((entry) => {
                  const food = foodItemsById[entry.food_item_id];
                  if (!food) return null;
                  return (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm"
                    >
                      <span>
                        {food.name}{" "}
                        <span className="text-muted">
                          × {entry.servings} {food.serving_unit}
                        </span>
                      </span>
                      <span className="text-muted">
                        {Math.round(food.protein_per_serving * entry.servings)}g
                        protein
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {logEntries.length === 0 && (
          <p className="text-center text-sm text-muted">
            Nothing logged yet today — add your first item above.
          </p>
        )}
      </section>
    </div>
  );
}
