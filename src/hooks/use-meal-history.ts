import { useState, useEffect, useCallback } from "react";

interface MealEntry {
  timestamp: number;
  name: string;
}

const STORAGE_KEY = "meal_history_detailed";
const MAX_ENTRIES = 50;
const DEDUPE_WINDOW_MS = 48 * 60 * 60 * 1000; // 48 hours
const CONSECUTIVE_BLOCK = 2; // block if in last N meals

export function useMealHistory() {
  const [mealHistory, setMealHistory] = useState<MealEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mealHistory));
  }, [mealHistory]);

  const addToHistory = useCallback((name: string) => {
    setMealHistory(prev =>
      [{ timestamp: Date.now(), name }, ...prev].slice(0, MAX_ENTRIES)
    );
  }, []);

  // Returns set of dish names to exclude from next suggestion
  const getRecentlyEaten = useCallback((): Set<string> => {
    const now = Date.now();
    const cutoff = now - DEDUPE_WINDOW_MS;
    const recentNames = mealHistory
      .filter(m => m.timestamp > cutoff)
      .map(m => m.name);
    const consecutiveNames = mealHistory
      .slice(0, CONSECUTIVE_BLOCK)
      .map(m => m.name);
    return new Set([...recentNames, ...consecutiveNames]);
  }, [mealHistory]);

  // Last 5 for in-session history display
  const recentDisplayHistory = mealHistory.slice(0, 5).map(m => m.name);

  return { mealHistory, addToHistory, getRecentlyEaten, recentDisplayHistory };
}
