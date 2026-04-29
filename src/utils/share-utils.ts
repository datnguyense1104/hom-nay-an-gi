import type { Dish, MealTime, BudgetRange, DietaryTag } from "../types/dish-types";
import { DISHES } from "../data/dishes-data";

type BudgetOption = BudgetRange | "any";

const ALLOWED_BUDGETS = new Set(["any", "under-50k", "50k-100k", "over-100k"]);
const ALLOWED_DIETARY = new Set(["chay", "no-red-meat", "no-seafood", "no-spicy", "halal"]);
const ALLOWED_MEAL_TIMES = new Set(["Sáng", "Trưa", "Tối", "Khuya"]);
const ALLOWED_REGIONS = new Set(["Bắc", "Trung", "Nam", "Mọi vùng"]);

export interface ParsedShare {
  dish: Dish;
  budget?: BudgetOption;
  dietary?: DietaryTag[];
  region?: string;
  meal?: MealTime;
}

interface ShareUrlOpts {
  dish: Dish;
  budget: BudgetOption;
  dietary: DietaryTag[];
  region: string;
  meal: MealTime;
}

export function buildShareUrl({ dish, budget, dietary, region, meal }: ShareUrlOpts): string {
  const params = new URLSearchParams();
  params.set("dish", String(dish.id));
  if (budget && budget !== "any") params.set("budget", budget);
  if (dietary.length > 0) params.set("dietary", dietary.join(","));
  if (region && region !== "Mọi vùng") params.set("region", region);
  if (meal) params.set("meal", meal);
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

export function parseShareUrl(search: string): ParsedShare | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const dishIdRaw = params.get("dish");
  if (!dishIdRaw) return null;

  const dishId = parseInt(dishIdRaw, 10);
  if (isNaN(dishId)) return null;

  const dish = DISHES.find(d => d.id === dishId);
  if (!dish) return null;

  const budgetRaw = params.get("budget");
  const budget = budgetRaw && ALLOWED_BUDGETS.has(budgetRaw) ? (budgetRaw as BudgetOption) : undefined;

  const dietaryRaw = params.get("dietary");
  const dietary = dietaryRaw
    ? (dietaryRaw.split(",").filter(t => ALLOWED_DIETARY.has(t)) as DietaryTag[])
    : undefined;

  const regionRaw = params.get("region");
  const region = regionRaw && ALLOWED_REGIONS.has(regionRaw) ? regionRaw : undefined;

  const mealRaw = params.get("meal");
  const meal = mealRaw && ALLOWED_MEAL_TIMES.has(mealRaw) ? (mealRaw as MealTime) : undefined;

  return { dish, budget, dietary, region, meal };
}
