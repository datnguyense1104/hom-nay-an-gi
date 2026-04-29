import { useState, useCallback, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import type { BudgetRange, DietaryTag } from "../types/dish-types";
import { BUDGET_LABELS, DIETARY_LABELS } from "../types/dish-types";

// Minimum ms between AI requests to avoid 429 rate-limit on free tier
const COOLDOWN_MS = 3000;

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
  const [aiError, setAiError] = useState<string | null>(null);
  const lastRequestAt = useRef<number>(0);

  const getSmartSuggestion = useCallback(async (ctx: AiContext) => {
    // Enforce cooldown to prevent 429 from rapid re-clicks
    const now = Date.now();
    if (now - lastRequestAt.current < COOLDOWN_MS) return;
    lastRequestAt.current = now;

    setIsAiLoading(true);
    setAiSuggestion(null);
    setAiError(null);
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
Chỉ trả lời đúng một dòng theo định dạng sau, không thêm bất kỳ nội dung nào khác, không dùng markdown hay ký tự đặc biệt:
Tên món: Lý do gợi ý ngắn gọn khoảng 15-20 từ nhấn mạnh tác dụng với tâm trạng hoặc thời tiết.
Hãy chọn món đặc sắc và mang tính "chữa lành" hoặc "kích thích vị giác" tùy bối cảnh.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "Phở Bò: Món ăn quốc dân luôn là lựa chọn hàng đầu.";
      setAiSuggestion(text);
    } catch (err) {
      console.error("[AI Suggestion] Gemini API error:", err);
      setAiError(err instanceof Error ? err.message : "Không thể kết nối AI. Thử lại sau.");
    } finally {
      setIsAiLoading(false);
    }
  }, []);

  const clearSuggestion = useCallback(() => {
    setAiSuggestion(null);
    setAiError(null);
  }, []);

  return { isAiLoading, aiSuggestion, aiError, getSmartSuggestion, clearSuggestion };
}
