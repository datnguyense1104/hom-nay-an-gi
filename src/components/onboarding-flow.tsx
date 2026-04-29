import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { BudgetRange, DietaryTag } from "../types/dish-types";
import { BUDGET_LABELS, DIETARY_LABELS, CITY_OPTIONS, MOOD_OPTIONS } from "../types/dish-types";

type BudgetOption = BudgetRange | "any";

interface OnboardingFlowProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  onSkip: () => void;
  budget: BudgetOption;
  setBudget: (b: BudgetOption) => void;
  dietaryPrefs: DietaryTag[];
  toggleDietary: (t: DietaryTag) => void;
  city: string;
  setCity: (c: string) => void;
  defaultMood: string;
  setDefaultMood: (m: string) => void;
}

const STEP_TITLES = ["Ngân sách thường ngày?", "Bạn ăn kiêng không?", "Bạn ở thành phố nào?", "Tâm trạng hôm nay?"];
const STEP_HINTS = ["Giúp lọc món phù hợp", "Chọn nhiều nếu cần", "Để tìm quán gần bạn", "Tuỳ chọn, có thể bỏ qua"];

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
        selected
          ? "border-[#FF6321] bg-[#FF632111] text-[#FF6321]"
          : "border-[#F5F5F0] bg-[#F5F5F0] text-[#5C4D3F] hover:border-[#FF6321]"
      }`}
    >
      {children}
    </button>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === step ? "w-6 bg-[#FF6321]" : i < step ? "w-4 bg-[#FF632166]" : "w-4 bg-[#F5F5F0]"
          }`}
        />
      ))}
    </div>
  );
}

export function OnboardingFlow({
  step, onNext, onBack, onComplete, onSkip,
  budget, setBudget, dietaryPrefs, toggleDietary,
  city, setCity, defaultMood, setDefaultMood,
}: OnboardingFlowProps) {
  const isLast = step === 3;

  const stepContent = [
    <div key="budget" className="flex flex-wrap gap-2 justify-center">
      {(["any", "under-50k", "50k-100k", "over-100k"] as BudgetOption[]).map(b => (
        <Chip key={b} selected={budget === b} onClick={() => setBudget(b)}>{BUDGET_LABELS[b]}</Chip>
      ))}
    </div>,
    <div key="dietary" className="space-y-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {(Object.keys(DIETARY_LABELS) as DietaryTag[]).map(tag => (
          <Chip key={tag} selected={dietaryPrefs.includes(tag)} onClick={() => toggleDietary(tag)}>
            {DIETARY_LABELS[tag]}
          </Chip>
        ))}
      </div>
    </div>,
    <div key="city" className="flex flex-wrap gap-2 justify-center">
      {CITY_OPTIONS.map(({ label, value }) => (
        <Chip key={value} selected={city === value} onClick={() => setCity(city === value ? "" : value)}>
          {label}
        </Chip>
      ))}
    </div>,
    <div key="mood" className="flex flex-wrap gap-2 justify-center">
      {MOOD_OPTIONS.map(({ value, label }) => (
        <Chip key={value} selected={defaultMood === value} onClick={() => setDefaultMood(defaultMood === value ? "" : value)}>
          {label}
        </Chip>
      ))}
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl relative"
      >
        <button onClick={onSkip} className="absolute top-5 right-5 p-1 text-[#A6998F] hover:text-[#5C4D3F] transition-colors">
          <X className="w-4 h-4" />
        </button>

        <ProgressBar step={step} total={4} />

        <div className="text-center mb-6">
          <h2 className="text-lg font-black text-[#1A1A1A]">{STEP_TITLES[step]}</h2>
          <p className="text-xs text-[#A6998F] mt-1">{STEP_HINTS[step]}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="mb-8 min-h-[80px] flex items-center justify-center"
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={onBack}
              className="flex-1 py-3 rounded-2xl text-sm font-bold border-2 border-[#F5F5F0] text-[#A6998F] hover:border-[#FF6321] hover:text-[#FF6321] transition-all"
            >
              Quay lại
            </button>
          )}
          <button onClick={isLast ? onComplete : onNext}
            className="flex-1 py-3 rounded-2xl text-sm font-bold bg-[#FF6321] hover:bg-[#E5551A] text-white transition-all shadow-lg shadow-[#FF632122]"
          >
            {isLast ? "Hoàn tất 🎉" : "Tiếp theo"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
