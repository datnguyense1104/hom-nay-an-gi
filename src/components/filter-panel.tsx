import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
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
    <div className={`bg-[#FFF9F5] border rounded-2xl p-4 transition-colors ${activeCount > 0 ? "border-[#FF632144]" : "border-[#FFE7D6]"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-[#8C7A6B] hover:text-[#FF6321] transition-colors"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Cá nhân hóa gợi ý
          {activeCount > 0 && !show && (
            <span className="inline-flex items-center justify-center w-4 h-4 bg-[#FF6321] text-white text-[9px] font-black rounded-full leading-none">
              {activeCount}
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: show ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
