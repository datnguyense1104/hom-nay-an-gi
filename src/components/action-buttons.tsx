import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Sparkles, Clock } from "lucide-react";

interface ActionButtonsProps {
  onRandomize: () => void;
  onAiSuggest: () => void;
  onLongOverdue: () => void;
  isSpinning: boolean;
  isAiLoading: boolean;
}

export function ActionButtons({ onRandomize, onAiSuggest, onLongOverdue, isSpinning, isAiLoading }: ActionButtonsProps) {
  const disabled = isSpinning || isAiLoading;

  return (
    <div className="space-y-3">
      {/* Primary CTA — full width, tallest touch target */}
      <button onClick={onRandomize} disabled={disabled}
        className="w-full flex items-center justify-center gap-2.5 bg-[#FF6321] hover:bg-[#E5551A] disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-[#FF632133] text-base"
      >
        <RefreshCw className={`w-5 h-5 flex-shrink-0 ${isSpinning ? "animate-spin" : ""}`} />
        Ngẫu nhiên trong thực đơn
      </button>

      {/* Secondary row */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onAiSuggest} disabled={disabled}
          className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition-all active:scale-[0.98] text-sm"
        >
          <Sparkles className={`w-4 h-4 flex-shrink-0 ${isAiLoading ? "animate-pulse" : ""}`} />
          AI Gợi ý
        </button>
        <button onClick={onLongOverdue} disabled={disabled}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border-2 border-dashed border-[#FFD4BB] text-[#FF6321] hover:bg-[#FFF0E6] disabled:opacity-50 transition-all"
        >
          <Clock className="w-4 h-4 flex-shrink-0" />
          Lâu chưa ăn
        </button>
      </div>
    </div>
  );
}

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#1A1A1A] text-white text-sm font-semibold rounded-2xl shadow-xl whitespace-nowrap"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
