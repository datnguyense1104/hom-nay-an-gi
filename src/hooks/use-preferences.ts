import { useState, useEffect } from "react";
import type { BudgetRange, DietaryTag } from "../types/dish-types";

type BudgetOption = BudgetRange | "any";

const ALLOWED_BUDGETS = new Set(["any", "under-50k", "50k-100k", "over-100k"]);
const ALLOWED_DIETARY = new Set<DietaryTag>(["chay", "no-red-meat", "no-seafood", "no-spicy", "halal"]);

// Maps city slug to cultural region string used in AI suggestion prompt
const CITY_TO_REGION: Record<string, string> = {
  "ha-noi": "Miền Bắc",
  "hai-phong": "Miền Bắc",
  "da-nang": "Miền Trung",
  "ho-chi-minh": "Miền Nam",
  "can-tho": "Miền Nam",
};

function readStorage<T>(key: string, fallback: T, validate?: (v: unknown) => boolean): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return validate && !validate(parsed) ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}

export function usePreferences() {
  const [budget, setBudget] = useState<BudgetOption>(() =>
    readStorage<BudgetOption>("user_budget_pref", "any", v => ALLOWED_BUDGETS.has(v as string))
  );

  const [dietaryPrefs, setDietaryPrefs] = useState<DietaryTag[]>(() =>
    readStorage<DietaryTag[]>("user_dietary_prefs", [], v =>
      Array.isArray(v) && (v as unknown[]).every(t => ALLOWED_DIETARY.has(t as DietaryTag))
    )
  );

  const [city, setCity] = useState<string>(() =>
    localStorage.getItem("user_city") ?? ""
  );

  // Mood stored as raw string (not JSON) — preserves pre-existing default_mood key behavior
  const [mood, setMood] = useState<string>(() =>
    localStorage.getItem("default_mood") ?? ""
  );

  useEffect(() => { localStorage.setItem("user_budget_pref", JSON.stringify(budget)); }, [budget]);
  useEffect(() => { localStorage.setItem("user_dietary_prefs", JSON.stringify(dietaryPrefs)); }, [dietaryPrefs]);
  useEffect(() => { localStorage.setItem("user_city", city); }, [city]);
  useEffect(() => { localStorage.setItem("default_mood", mood); }, [mood]);

  const toggleDietary = (tag: DietaryTag) => {
    setDietaryPrefs(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Derived from city; provides a default AI suggestion region — user can override in FilterPanel
  const defaultRegion = CITY_TO_REGION[city] ?? "";

  return { budget, setBudget, dietaryPrefs, toggleDietary, city, setCity, mood, setMood, defaultRegion };
}
