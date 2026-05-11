import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import type { Dish } from "../types/dish-types";

interface Props {
  dishes: Dish[];
}

export function MenuListView({ dishes }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() =>
    dishes.filter(d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [dishes, searchQuery]
  );

  return (
    <div className="p-8 pt-0 flex flex-col" style={{ height: "min(500px, 60vh)" }}>
      <h1 className="text-2xl font-black text-[#1A1A1A] mb-4 text-center">Thực đơn quốc dân</h1>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A6998F]" />
        <input
          type="text"
          placeholder="Tìm món ngon..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#F5F5F0] border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#FF632122] transition-all placeholder:text-[#A6998F]"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
        {filtered.length > 0 ? (
          filtered.map(dish => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[#FEFCFA] border border-[#FFE7D6] rounded-2xl hover:border-[#FF632144] transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-[#1A1A1A] group-hover:text-[#FF6321] transition-colors">{dish.name}</h3>
                  <span className="text-xs font-black text-[#FF632188] uppercase tracking-tight">{dish.category}</span>
                </div>
                <div className="flex gap-1 flex-wrap justify-end max-w-[100px]">
                  {dish.time.map(t => (
                    <span key={t} className="text-[10px] bg-[#F5F5F0] px-1.5 py-0.5 rounded uppercase font-bold text-[#A6998F]">{t}</span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#8C7A6B] leading-relaxed italic line-clamp-2">"{dish.description}"</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 opacity-30">
            <p className="text-sm">Không tìm thấy món này...</p>
          </div>
        )}
      </div>
    </div>
  );
}
