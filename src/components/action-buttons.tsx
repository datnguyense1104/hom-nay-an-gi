import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Sparkles, Clock } from "lucide-react";

interface ActionButtonsProps {
  onRandomize: () => void;
  onAiSuggest: () => void;
  onLongOverdue: () => void;
  isSpinning: boolean;
  isAiLoading: boolean;
  toast: string | null;
}

export function ActionButtons({ onRandomize, onAiSuggest, onLongOverdue, isSpinning, isAiLoading, toast }: ActionButtonsProps) {
  const disabled = isSpinning || isAiLoading;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onRandomize} disabled={disabled}
          className="flex flex-col items-center justify-center gap-1 bg-[#FF6321] hover:bg-[#E5551A] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-[#FF632122]"
        >
          <RefreshCw className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
          <span className="text-xs">Ngẫu nhiên</span>
        </button>
        <button onClick={onAiSuggest} disabled={disabled}
          className="flex flex-col items-center justify-center gap-1 bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
        >
          <Sparkles className={`w-5 h-5 ${isAiLoading ? "animate-pulse" : ""}`} />
          <span className="text-xs">AI Gợi ý</span>
        </button>
      </div>

      <button onClick={onLongOverdue} disabled={disabled}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border-2 border-dashed border-[#FFD4BB] text-[#FF6321] hover:bg-[#FFF0E6] disabled:opacity-50 transition-all"
      >
        <Clock className="w-4 h-4" />
        Lâu rồi không ăn gì
      </button>

      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-xs text-[#A6998F]"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
