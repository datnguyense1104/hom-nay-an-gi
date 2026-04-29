export type MealTime = "Sáng" | "Trưa" | "Tối" | "Khuya";
export type BudgetRange = "under-50k" | "50k-100k" | "over-100k";
export type DietaryTag = "chay" | "no-red-meat" | "no-seafood" | "no-spicy" | "halal";
export type Region = "Bắc" | "Trung" | "Nam" | "Mọi vùng";

export interface Dish {
  id: number;
  name: string;
  description: string;
  category: string;
  time: MealTime[];
  budget: BudgetRange;
  dietary: DietaryTag[];
  region: Region;
  shopeeFoodKeyword: string;
}

export const BUDGET_LABELS: Record<BudgetRange | "any", string> = {
  "any": "Bất kỳ",
  "under-50k": "< 50k",
  "50k-100k": "50–100k",
  "over-100k": "> 100k",
};

export const DIETARY_LABELS: Record<DietaryTag, string> = {
  "chay": "Ăn chay",
  "no-red-meat": "Không thịt đỏ",
  "no-seafood": "Không hải sản",
  "no-spicy": "Không cay",
  "halal": "Halal",
};

export const CITY_OPTIONS = [
  { label: "TP. Hồ Chí Minh", value: "ho-chi-minh" },
  { label: "Hà Nội", value: "ha-noi" },
  { label: "Đà Nẵng", value: "da-nang" },
  { label: "Cần Thơ", value: "can-tho" },
  { label: "Hải Phòng", value: "hai-phong" },
];

export const MOOD_OPTIONS = [
  { value: "vui", label: "Vui vẻ 😄" },
  { value: "buon", label: "Buồn bã 😔" },
  { value: "met", label: "Mệt mỏi 😴" },
  { value: "ban", label: "Bận rộn ⚡" },
  { value: "thu-gian", label: "Thư giãn 😌" },
];
