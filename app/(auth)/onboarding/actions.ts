"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const LIME = "#baff29";
const CORAL = "#ff5c7a";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const mode = String(formData.get("mode") ?? "create"); // "create" | "join"
  const inviteCode = String(formData.get("inviteCode") ?? "").trim();
  const dailyCalorieGoal = Number(formData.get("dailyCalorieGoal") ?? 2000);
  const dailyProteinGoal = Number(formData.get("dailyProteinGoal") ?? 150);

  if (!name) return { error: "Enter your name." };

  let householdId: string;
  let accentColor = LIME;

  if (mode === "join") {
    if (!inviteCode) return { error: "Enter your mate's household code." };

    const { data: household, error: householdError } = await supabase
      .from("households")
      .select("id")
      .eq("id", inviteCode)
      .single();

    if (householdError || !household) {
      return { error: "Couldn't find a household with that code." };
    }
    householdId = household.id;

    const { data: existingProfiles } = await supabase
      .from("user_profiles")
      .select("accent_color")
      .eq("household_id", householdId);

    const limeTaken = existingProfiles?.some((p) => p.accent_color === LIME);
    accentColor = limeTaken ? CORAL : LIME;
  } else {
    const { data: household, error: householdError } = await supabase
      .from("households")
      .insert({ name: `${name}'s household` })
      .select("id")
      .single();

    if (householdError || !household) {
      return { error: "Couldn't create a household. Try again." };
    }
    householdId = household.id;
  }

  const { error: profileError } = await supabase.from("user_profiles").insert({
    id: user.id,
    household_id: householdId,
    name,
    accent_color: accentColor,
    daily_calorie_goal: dailyCalorieGoal,
    daily_protein_goal: dailyProteinGoal,
  });

  if (profileError) {
    return { error: "Couldn't save your profile. Try again." };
  }

  redirect("/dashboard");
}
