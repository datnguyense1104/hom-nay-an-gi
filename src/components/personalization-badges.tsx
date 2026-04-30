import type { BudgetRange, DietaryTag } from "../types/dish-types";
import { BUDGET_LABELS, DIETARY_LABELS, MOOD_OPTIONS } from "../types/dish-types";

type BudgetOption = BudgetRange | "any";

interface Props {
  mood: string;
  budget: BudgetOption;
  dietaryPrefs: DietaryTag[];
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#FFF0E6] text-[#FF6321] text-[10px] font-bold">
      {children}
    </span>
  );
}

// Converts stored mood (value key or display string) to its label for display
function resolveMoodLabel(mood: string): string {
  return MOOD_OPTIONS.find(o => o.value === mood)?.label ?? mood;
}

export function PersonalizationBadges({ mood, budget, dietaryPrefs }: Props) {
  const badges: string[] = [];

  if (mood) badges.push(`Tâm trạng: ${resolveMoodLabel(mood)}`);
  if (budget !== "any") badges.push(`Ngân sách: ${BUDGET_LABELS[budget]}`);
  if (dietaryPrefs.length > 0) badges.push(`Ăn kiêng: ${dietaryPrefs.map(t => DIETARY_LABELS[t]).join(", ")}`);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 justify-center mt-3">
      {badges.map(b => <Badge key={b}>{b}</Badge>)}
    </div>
  );
}
