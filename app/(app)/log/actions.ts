"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FoodCategory, MealCategory } from "@/types/database";

export async function logNewFoodItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const name = String(formData.get("name") ?? "").trim();
  const servings = Number(formData.get("servings") ?? 1);
  const mealCategory = String(formData.get("mealCategory") ?? "snack") as MealCategory;
  const foodCategory = String(formData.get("foodCategory") ?? "whole_food") as FoodCategory;
  const calories = Number(formData.get("calories") ?? 0);
  const protein = Number(formData.get("protein") ?? 0);
  const carbs = formData.get("carbs") ? Number(formData.get("carbs")) : null;
  const fat = formData.get("fat") ? Number(formData.get("fat")) : null;
  const servingUnit = String(formData.get("servingUnit") ?? "serving").trim() || "serving";

  if (!name) return { error: "Name your food." };

  const { data: foodItem, error: foodError } = await supabase
    .from("food_items")
    .insert({
      name,
      calories_per_serving: calories,
      protein_per_serving: protein,
      carbs_per_serving: carbs,
      fat_per_serving: fat,
      serving_unit: servingUnit,
      category: foodCategory,
      source: "manual",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (foodError || !foodItem) return { error: "Couldn't save that food." };

  const { error: logError } = await supabase.from("log_entries").insert({
    user_id: user.id,
    food_item_id: foodItem.id,
    servings,
    meal_category: mealCategory,
  });

  if (logError) return { error: "Couldn't log that entry." };

  revalidatePath("/dashboard");
  revalidatePath("/log");
  return { error: null };
}

export async function logExistingFoodItem(
  foodItemId: string,
  servings: number,
  mealCategory: MealCategory
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.from("log_entries").insert({
    user_id: user.id,
    food_item_id: foodItemId,
    servings,
    meal_category: mealCategory,
  });

  if (error) return { error: "Couldn't log that entry." };

  revalidatePath("/dashboard");
  revalidatePath("/log");
  return { error: null };
}

export async function deleteLogEntry(entryId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("log_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) return { error: "Couldn't remove that entry." };

  revalidatePath("/dashboard");
  revalidatePath("/log");
  return { error: null };
}
