import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import type { DietaryTag } from "../types/dish-types";
import { DIETARY_LABELS, CITY_OPTIONS } from "../types/dish-types";

interface Props {
  show: boolean;
  onToggle: () => void;
  mood: string;
  weather: string;
  region: string;
  dietaryPrefs: DietaryTag[];
  city: string;
  onMoodChange: (v: string) => void;
  onWeatherChange: (v: string) => void;
  onRegionChange: (v: string) => void;
  onDietaryToggle: (tag: DietaryTag) => void;
  onCityChange: (v: string) => void;
}

const MOODS = ["Vui vẻ", "Mệt mỏi", "Căng thẳng", "Đang yêu", "Bình thường"];
const WEATHERS = ["Nóng nực", "Lạnh", "Mưa", "Mát mẻ"];
const REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam"];
const DIETARY_TAGS: DietaryTag[] = ["chay", "no-red-meat", "no-seafood", "no-spicy", "halal"];

const pillCls = (active: boolean) =>
  `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
    active ? "bg-[#FF6321] text-white" : "bg-white text-[#8C7A6B] border border-[#FFE7D6]"
  }`;

function FilterSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-[#A6998F] uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function FilterPanel({
  show, onToggle,
  mood, weather, region, dietaryPrefs, city,
  onMoodChange, onWeatherChange, onRegionChange,
  onDietaryToggle, onCityChange,
}: Props) {
  const activeCount = [mood, weather, region, city].filter(Boolean).length + dietaryPrefs.length;

  return (
    <>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
          activeCount > 0
            ? "border-[#FF632144] bg-[#FFF9F5] text-[#FF6321]"
            : "border-[#FFE7D6] bg-[#FFF9F5] text-[#8C7A6B] hover:text-[#FF6321]"
        }`}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Cá nhân hóa gợi ý cho AI
        </div>
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 bg-[#FF6321] text-white text-[9px] font-black rounded-full leading-none">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            key="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40"
            onClick={onToggle}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="w-full max-w-sm bg-white rounded-[2rem] p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-[#1A1A1A] uppercase tracking-widest">Cá nhân hóa</span>
                <button onClick={onToggle} className="p-1 text-[#A6998F] hover:text-[#FF6321] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

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

              <FilterSection label="Sở thích ăn uống">
                {DIETARY_TAGS.map(tag => (
                  <button key={tag} onClick={() => onDietaryToggle(tag)} className={pillCls(dietaryPrefs.includes(tag))}>{DIETARY_LABELS[tag]}</button>
                ))}
              </FilterSection>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#A6998F] uppercase tracking-wide">Khu vực giao hàng</label>
                <select
                  value={city}
                  onChange={e => onCityChange(e.target.value)}
                  className="w-full bg-white border border-[#FFE7D6] rounded-xl px-3 py-2.5 text-xs text-[#5C4D3F] focus:ring-2 focus:ring-[#FF632122] focus:outline-none"
                >
                  <option value="">Tự động nhận diện</option>
                  {CITY_OPTIONS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={onToggle}
                className="w-full py-3 rounded-2xl bg-[#FF6321] hover:bg-[#E5551A] text-white text-xs font-black uppercase tracking-widest transition-all"
              >
                Xong
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
