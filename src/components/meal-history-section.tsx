import { AnimatePresence, motion } from "motion/react";
import { History } from "lucide-react";

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
        className="w-full flex items-center justify-center gap-2 py-3 text-[#A6998F] hover:text-[#FF6321] transition-colors text-[10px] font-black uppercase tracking-widest"
      >
        <History className="w-3 h-3" />
        Lịch sử tìm kiếm
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
                <span key={i} className="px-3 py-1 bg-[#F5F5F0] text-[#8C7A6B] rounded-full text-[10px] font-bold">
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
