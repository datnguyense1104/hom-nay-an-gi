import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import type { BudgetRange, DietaryTag } from "../types/dish-types";
import { BUDGET_LABELS, DIETARY_LABELS, CITY_OPTIONS } from "../types/dish-types";

type BudgetOption = BudgetRange | "any";

interface Props {
  show: boolean;
  onToggle: () => void;
  mood: string;
  weather: string;
  region: string;
  budget: BudgetOption;
  dietaryPrefs: DietaryTag[];
  city: string;
  onMoodChange: (v: string) => void;
  onWeatherChange: (v: string) => void;
  onRegionChange: (v: string) => void;
  onBudgetChange: (v: BudgetOption) => void;
  onDietaryToggle: (tag: DietaryTag) => void;
  onCityChange: (v: string) => void;
}

const MOODS = ["Vui vẻ", "Mệt mỏi", "Căng thẳng", "Đang yêu", "Bình thường"];
const WEATHERS = ["Nóng nực", "Lạnh", "Mưa", "Mát mẻ"];
const REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam"];
const BUDGETS: BudgetOption[] = ["any", "under-50k", "50k-100k", "over-100k"];
const DIETARY_TAGS: DietaryTag[] = ["chay", "no-red-meat", "no-seafood", "no-spicy", "halal"];

const pillCls = (active: boolean) =>
  `px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
    active ? "bg-[#FF6321] text-white" : "bg-white text-[#8C7A6B] border border-[#FFE7D6]"
  }`;

function FilterSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-bold text-[#A6998F] uppercase tracking-tighter">{label}</label>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function FilterPanel({
  show, onToggle,
  mood, weather, region, budget, dietaryPrefs, city,
  onMoodChange, onWeatherChange, onRegionChange,
  onBudgetChange, onDietaryToggle, onCityChange,
}: Props) {
  return (
    <div className="bg-[#FFF9F5] border border-[#FFE7D6] rounded-2xl p-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#8C7A6B] hover:text-[#FF6321] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Cá nhân hóa gợi ý
        </div>
        <motion.div animate={{ rotate: show ? 45 : 0 }}>
          <X className="w-3 h-3" />
        </motion.div>
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4 pt-4"
          >
            <FilterSection label="Tâm trạng">
              {MOODS.map(m => (
                <button key={m} onClick={() => onMoodChange(m === mood ? "" : m)} className={pillCls(mood === m)}>{m}</button>
              ))}
            </FilterSection>

            <FilterSection label="Thời tiết">
              {WEATHERS.map(w => (
                <button key={w} onClick={() => onWeatherChange(w === weather ? "" : w)} className={pillCls(weather === w)}>{w}</button>
              ))}
            </FilterSection>

            <FilterSection label="Vùng miền">
              {REGIONS.map(r => (
                <button key={r} onClick={() => onRegionChange(r === region ? "" : r)} className={pillCls(region === r)}>{r}</button>
              ))}
            </FilterSection>

            <FilterSection label="Ngân sách">
              {BUDGETS.map(b => (
                <button key={b} onClick={() => onBudgetChange(b)} className={pillCls(budget === b)}>{BUDGET_LABELS[b]}</button>
              ))}
            </FilterSection>

            <FilterSection label="Sở thích ăn uống">
              {DIETARY_TAGS.map(tag => (
                <button key={tag} onClick={() => onDietaryToggle(tag)} className={pillCls(dietaryPrefs.includes(tag))}>{DIETARY_LABELS[tag]}</button>
              ))}
            </FilterSection>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-[#A6998F] uppercase tracking-tighter">Khu vực giao hàng</label>
              <select
                value={city}
                onChange={e => onCityChange(e.target.value)}
                className="w-full bg-white border border-[#FFE7D6] rounded-xl px-3 py-2 text-[11px] text-[#5C4D3F] focus:ring-2 focus:ring-[#FF632122] focus:outline-none"
              >
                <option value="">Tự động nhận diện</option>
                {CITY_OPTIONS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
