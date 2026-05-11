import { AnimatePresence, motion } from "motion/react";
import { History, ChevronDown } from "lucide-react";

interface Props {
  history: string[];
  show: boolean;
  onToggle: () => void;
}

export function MealHistorySection({ history, show, onToggle }: Props) {
  return (
    <div className="pt-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[#A6998F] hover:text-[#FF6321] hover:bg-[#FFF0E6] transition-all text-xs font-black uppercase tracking-widest"
      >
        <History className="w-3.5 h-3.5" />
        Lịch sử{history.length > 0 && ` (${history.length})`}
        <motion.span animate={{ rotate: show ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {show && history.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 justify-center py-4 border-t border-[#FFE7D6] mt-2">
              {history.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-[#F5F5F0] text-[#8C7A6B] rounded-full text-xs font-bold">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
