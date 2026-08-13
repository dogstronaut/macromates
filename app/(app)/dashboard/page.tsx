import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgressRings } from "@/components/rings/ProgressRings";
import { sumDailyTotals, proteinProgress, todayRange } from "@/lib/macros";
import type { FoodItem, LogEntry } from "@/types/database";

async function loadTotalsForUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  start: string,
  end: string
) {
  const { data: entries } = await supabase
    .from("log_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("logged_at", start)
    .lte("logged_at", end);

  const logEntries = (entries ?? []) as LogEntry[];
  if (logEntries.length === 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  const foodItemIds = [...new Set(logEntries.map((e) => e.food_item_id))];
  const { data: foodItems } = await supabase
    .from("food_items")
    .select("*")
    .in("id", foodItemIds);

  const foodItemsById = Object.fromEntries(
    ((foodItems ?? []) as FoodItem[]).map((f) => [f.id, f])
  );

  return sumDailyTotals(logEntries, foodItemsById);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/onboarding");

  const { data: householdMembers } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("household_id", profile.household_id);

  const mate = (householdMembers ?? []).find((m) => m.id !== profile.id);
  const { start, end } = todayRange();

  const myTotals = await loadTotalsForUser(supabase, profile.id, start, end);
  const mateTotals = mate
    ? await loadTotalsForUser(supabase, mate.id, start, end)
    : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const myProgress = proteinProgress(myTotals.protein, profile.daily_protein_goal);
  const mateProgress = mate
    ? proteinProgress(mateTotals.protein, mate.daily_protein_goal)
    : 0;

  const proteinRemaining = Math.max(profile.daily_protein_goal - myTotals.protein, 0);
  const caloriesRemaining = Math.max(profile.daily_calorie_goal - myTotals.calories, 0);

  const proteinGap = mate ? myTotals.protein - mateTotals.protein : 0;

  return (
    <div className="flex flex-col items-center gap-10">
      <ProgressRings
        left={{ label: profile.name, color: profile.accent_color, progress: myProgress }}
        right={{
          label: mate?.name ?? "Invite your mate",
          color: mate?.accent_color ?? "#5c584f",
          progress: mateProgress,
        }}
      />

      {mate && (
        <p className="text-center text-sm text-muted">
          {proteinGap === 0
            ? "You're tied with " + mate.name + " today 🤝"
            : proteinGap > 0
              ? `You're ${Math.round(proteinGap)}g ahead of ${mate.name} today 🔥`
              : `You're ${Math.round(Math.abs(proteinGap))}g behind ${mate.name} today 👀`}
        </p>
      )}

      <section className="w-full max-w-sm rounded-2xl bg-surface p-5">
        <h2 className="mb-4 font-semibold">What&apos;s left today</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted">Protein remaining</p>
            <p className="text-xl font-bold" style={{ color: profile.accent_color }}>
              {Math.round(proteinRemaining)}g
            </p>
          </div>
          <div>
            <p className="text-muted">Calories remaining</p>
            <p className="text-xl font-bold">{Math.round(caloriesRemaining)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
