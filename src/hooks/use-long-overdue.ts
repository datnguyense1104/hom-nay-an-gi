import { useMemo } from "react";
import type { Dish } from "../types/dish-types";

interface MealEntry {
  timestamp: number;
  name: string;
}

const OVERDUE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useLongOverdue(history: MealEntry[], pool: Dish[]) {
  // Map dish name → most recent timestamp (first occurrence = most recent since history is newest-first)
  const lastEatenMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const entry of history) {
      if (!m.has(entry.name)) m.set(entry.name, entry.timestamp);
    }
    return m;
  }, [history]);

  const overduePool = useMemo(() => {
    const cutoff = Date.now() - OVERDUE_THRESHOLD_MS;
    return pool.filter(d => {
      const last = lastEatenMap.get(d.name);
      return last == null || last < cutoff;
    });
  }, [pool, lastEatenMap]);

  // Returns days since last eaten, or null if never eaten
  const daysSinceEaten = (name: string): number | null => {
    const last = lastEatenMap.get(name);
    if (!last) return null;
    return Math.floor((Date.now() - last) / 86_400_000);
  };

  return { overduePool, daysSinceEaten };
}
