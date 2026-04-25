import { useState, useEffect } from "react";
import type { BudgetRange, DietaryTag } from "../types/dish-types";

type BudgetOption = BudgetRange | "any";

const ALLOWED_BUDGETS = new Set(["any", "under-50k", "50k-100k", "over-100k"]);
const ALLOWED_DIETARY = new Set<DietaryTag>(["chay", "no-red-meat", "no-seafood", "no-spicy", "halal"]);

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

  useEffect(() => { localStorage.setItem("user_budget_pref", JSON.stringify(budget)); }, [budget]);
  useEffect(() => { localStorage.setItem("user_dietary_prefs", JSON.stringify(dietaryPrefs)); }, [dietaryPrefs]);
  useEffect(() => { localStorage.setItem("user_city", city); }, [city]);

  const toggleDietary = (tag: DietaryTag) => {
    setDietaryPrefs(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return { budget, setBudget, dietaryPrefs, toggleDietary, city, setCity };
}
