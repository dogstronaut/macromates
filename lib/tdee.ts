export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "extra_active";

export type Goal = "cut" | "maintain" | "bulk";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extra_active: 1.9,
};

const GOAL_CALORIE_ADJUSTMENTS: Record<Goal, number> = {
  cut: -500,
  maintain: 0,
  bulk: 300,
};

// Grams of protein per kg of bodyweight — higher on a cut to preserve muscle.
const GOAL_PROTEIN_PER_KG: Record<Goal, number> = {
  cut: 2.2,
  maintain: 2.0,
  bulk: 1.8,
};

export interface TdeeInput {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface TdeeResult {
  bmr: number;
  tdee: number;
  calorieGoal: number;
  proteinGoal: number;
}

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

export function poundsToKg(pounds: number): number {
  return pounds * 0.45359237;
}

/**
 * Mifflin-St Jeor BMR + activity-scaled TDEE, with a goal-based calorie
 * adjustment and a bodyweight-scaled protein target.
 */
export function calculateTdee(input: TdeeInput): TdeeResult {
  const { sex, age, heightCm, weightKg, activityLevel, goal } = input;

  const bmr =
    10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const calorieGoal = Math.round(tdee + GOAL_CALORIE_ADJUSTMENTS[goal]);
  const proteinGoal = Math.round(weightKg * GOAL_PROTEIN_PER_KG[goal]);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieGoal,
    proteinGoal,
  };
}
