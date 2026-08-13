export type MealCategory =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "supplement";

export type FoodCategory = "whole_food" | "supplement";

export type FoodSource = "barcode" | "manual" | "photo" | "custom";

export interface Household {
  id: string;
  name: string;
  created_at: string;
}

export interface UserProfile {
  id: string; // matches auth.users.id
  household_id: string;
  name: string;
  accent_color: string;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carb_goal: number | null;
  daily_fat_goal: number | null;
  created_at: string;
}

export interface FoodItem {
  id: string;
  name: string;
  brand: string | null;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number | null;
  fat_per_serving: number | null;
  serving_unit: string;
  category: FoodCategory;
  source: FoodSource;
  barcode: string | null;
  created_by: string | null;
  created_at: string;
}

export interface LogEntry {
  id: string;
  user_id: string;
  food_item_id: string;
  servings: number;
  meal_category: MealCategory;
  logged_at: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  food_item_id: string;
  created_at: string;
}

export interface Nudge {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  sent_at: string;
  read_at: string | null;
}
