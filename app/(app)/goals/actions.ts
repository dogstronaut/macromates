"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateGoals(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const dailyCalorieGoal = Number(formData.get("dailyCalorieGoal"));
  const dailyProteinGoal = Number(formData.get("dailyProteinGoal"));
  const dailyCarbGoal = formData.get("dailyCarbGoal")
    ? Number(formData.get("dailyCarbGoal"))
    : null;
  const dailyFatGoal = formData.get("dailyFatGoal")
    ? Number(formData.get("dailyFatGoal"))
    : null;

  const { error } = await supabase
    .from("user_profiles")
    .update({
      daily_calorie_goal: dailyCalorieGoal,
      daily_protein_goal: dailyProteinGoal,
      daily_carb_goal: dailyCarbGoal,
      daily_fat_goal: dailyFatGoal,
    })
    .eq("id", user.id);

  if (error) return { error: "Couldn't save your goals." };

  revalidatePath("/goals");
  revalidatePath("/dashboard");
  return { error: null };
}
