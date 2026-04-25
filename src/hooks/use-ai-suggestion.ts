import { useState, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import type { BudgetRange, DietaryTag } from "../types/dish-types";
import { BUDGET_LABELS, DIETARY_LABELS } from "../types/dish-types";

interface AiContext {
  mealTime: string;
  mood: string;
  weather: string;
  region: string;
  budget: BudgetRange | "any";
  dietaryPrefs: DietaryTag[];
}

export function useAiSuggestion() {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const getSmartSuggestion = useCallback(async (ctx: AiContext) => {
    setIsAiLoading(true);
    setAiSuggestion(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const dietaryText = ctx.dietaryPrefs.length > 0
        ? ctx.dietaryPrefs.map(d => DIETARY_LABELS[d]).join(", ")
        : "Không có yêu cầu đặc biệt";
      const prompt = `Bạn là một chuyên gia ẩm thực Việt Nam. Tôi đang tìm món cho bữa ${ctx.mealTime}.
Thông tin bối cảnh:
- Tâm trạng: ${ctx.mood || "Bình thường"}
- Thời tiết: ${ctx.weather || "Không xác định"}
- Vùng miền: ${ctx.region || "Bất kỳ"}
- Ngân sách: ${BUDGET_LABELS[ctx.budget]} mỗi bữa
- Sở thích ăn uống: ${dietaryText}

Dựa trên bối cảnh này, hãy gợi ý 1 món ăn Việt Nam cực kỳ hấp dẫn, phù hợp với tâm trạng và thời tiết hiện tại.
Trả lời theo cấu trúc: [Tên món]: [Lý do gợi ý - nhấn mạnh vào việc nó giúp ích gì cho tâm trạng/thời tiết đó, khoảng 15-20 từ].
Hãy chọn món đặc sắc và mang tính "chữa lành" hoặc "kích thích vị giác" tùy bối cảnh.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const text = response.text || "Phở Bò: Món ăn quốc dân luôn là lựa chọn hàng đầu.";
      setAiSuggestion(text);
    } catch {
      setAiSuggestion("Bún Chả: Thịt nướng thơm lừng cho ngày mới năng động!");
    } finally {
      setIsAiLoading(false);
    }
  }, []);

  const clearSuggestion = useCallback(() => setAiSuggestion(null), []);

  return { isAiLoading, aiSuggestion, getSmartSuggestion, clearSuggestion };
}
