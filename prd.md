# PRD — Hôm Nay Ăn Gì?

> **Version:** 1.0 | **Date:** 2026-04-24 | **Status:** Draft

---

## 1. Problem Statement

Dân văn phòng và sinh viên Việt Nam ăn ngoài hàng ngày nhưng mỗi bữa đều phải tốn 5–15 phút để quyết định "ăn gì, đặt ở đâu". Vấn đề kép:

1. **Decision fatigue**: Quá nhiều lựa chọn → không chọn được.
2. **Friction cao**: Biết muốn ăn gì nhưng phải tự tìm quán, mở Shopee Food search, so sánh... mất thời gian.

App hiện tại đã giải quyết vế 1 (gợi ý món) nhưng chưa giải quyết vế 2 (tìm chỗ mua/đặt).

---

## 2. Product Vision

> **"Từ quyết định đến đặt hàng trong < 30 giây."**

"Hôm Nay Ăn Gì" là trợ lý ẩm thực cá nhân cho người Việt ăn ngoài — gợi ý món phù hợp tâm trạng/thời tiết/ngân sách, rồi kết nối thẳng đến Shopee Food để đặt hoặc Google Maps để tìm quán gần nhất.

---

## 3. Target Users

### Persona 1 — Sinh viên ăn ngoài
- Tuổi: 18–24, ngân sách 30–70k/bữa
- Hay ăn theo nhóm, quyết định tập thể tốn thời gian
- Dùng điện thoại là chính
- Pain: "Ăn gì ngon mà rẻ, gần trường?"

### Persona 2 — Dân văn phòng bữa trưa
- Tuổi: 24–35, ngân sách 50–120k/bữa
- Bận, cần quyết định nhanh trong giờ nghỉ trưa (30–45 phút)
- Hay đặt Shopee Food về văn phòng
- Pain: "Đặt gì mà không bị lặp lại từ hôm qua, không phải suy nghĩ nhiều?"

---

## 4. Feature Roadmap

### Phase 1 — Core (hiện tại, đã có)
| Feature | Status |
|---|---|
| Random dish suggestion | ✅ Done |
| AI suggestion (Gemini) với mood/weather/region | ✅ Done |
| Meal history (localStorage) | ✅ Done |
| Menu list view + search | ✅ Done |
| Google Calendar log | ✅ Done |
| Time-based filter (Sáng/Trưa/Tối/Khuya) | ✅ Done |

### Phase 2 — Find & Order (ưu tiên cao)
| Feature | Priority |
|---|---|
| Shopee Food deep link integration | 🔴 Critical |
| Google Maps deep link (tìm quán gần) | 🔴 Critical |
| Location detection (browser geolocation) | 🟠 High |
| Budget filter (< 50k / 50–100k / 100k+) | 🟠 High |
| Dietary preferences (chay, không ăn hải sản, v.v.) | 🟠 High |

### Phase 3 — Personalization & UX
| Feature | Priority |
|---|---|
| Onboarding flow (set preferences lần đầu) | 🟡 Medium |
| Dish database mở rộng (50+ món) | 🟡 Medium |
| "Chưa ăn lâu rồi" suggestion engine | 🟡 Medium |
| Share gợi ý với bạn bè (URL share) | 🟡 Medium |
| Group vote: "Cả nhóm ăn gì?" | 🟢 Low |

---

## 5. Feature Specs — Phase 2 (Priority)

### 5.1 Shopee Food Deep Link

**User flow:**
1. App gợi ý món (random hoặc AI)
2. Hiển thị nút **"Đặt qua Shopee Food 🛵"**
3. Tap → mở Shopee Food với search query = tên món

**URL pattern:**
```
https://shopeefood.vn/{city}/search?q={dish_name_encoded}
```

**City detection:**
- Dùng `navigator.geolocation` → reverse geocode → map sang Shopee Food city slug
- Fallback: user chọn thành phố trong settings (HCM / Hà Nội / Đà Nẵng / Khác)
- Supported slugs: `ho-chi-minh`, `ha-noi`, `da-nang`, `can-tho`, `hai-phong`

**Implementation note:**
- Không có Shopee Food public API → chỉ deep link, không nhúng kết quả
- URL fallback khi không detect được city: `https://shopeefood.vn/search?q={dish_name}`

---

### 5.2 Google Maps Deep Link (Tìm quán gần)

**User flow:**
1. App gợi ý món
2. Hiển thị nút **"Tìm quán gần đây 📍"**
3. Tap → mở Google Maps với search = "{dish_name} gần đây"

**URL pattern:**
```
https://www.google.com/maps/search/{dish_name}+gần+đây/@{lat},{lng},14z
```

- Dùng geolocation API để lấy lat/lng (nếu user cho phép)
- Fallback: `https://www.google.com/maps/search/{dish_name}` (Google Maps tự detect location)

---

### 5.3 Budget Filter

**Options:** Dưới 50k | 50–100k | Trên 100k | Bất kỳ (default)

**Logic:**
- Gán budget tag cho từng món trong DISHES array
- Filter pool trước khi random/AI suggest
- AI prompt bổ sung: `"Ngân sách: ${budget} mỗi bữa"`

---

### 5.4 Dietary Preferences

**Options (multi-select):**
- Ăn chay / Không thịt đỏ / Không hải sản / Không đồ cay / Halal

**Storage:** `localStorage` key `user_dietary_prefs`

**Logic:**
- Filter DISHES theo tags khi random
- Inject vào AI prompt khi dùng Gemini suggestion

---

## 6. Tech Stack

| Layer | Tech | Note |
|---|---|---|
| Framework | React 19 + Vite 6 | Giữ nguyên |
| Language | TypeScript | Giữ nguyên |
| Styling | Tailwind CSS v4 | Giữ nguyên |
| Animation | motion/react (Framer) | Giữ nguyên |
| AI | Google Gemini (gemini-2.0-flash) | Upgrade từ gemini-3-flash-preview |
| Storage | localStorage | Giữ nguyên, không cần backend |
| Maps | Google Maps deep link | Không cần Maps JS SDK |
| Delivery | Shopee Food deep link | Không cần API |
| Auth | Không cần (pure client-side) | Bỏ Google OAuth phức tạp |
| Location | Browser Geolocation API | Native, không cần thư viện |
| Deployment | Static hosting (Vercel/Netlify) | No backend needed |

**API Key security (client-side):**
- `VITE_GEMINI_API_KEY` trong `.env.local`
- Cần restrict key theo HTTP referrer trong Google Cloud Console
- Không expose key production trực tiếp trong code

---

## 7. UX Flow (Updated)

```
[Open App]
    ↓
[Chọn bữa: Sáng/Trưa/Tối/Khuya]
    ↓
[Set context (optional): Mood / Weather / Budget / Dietary]
    ↓
[Nhấn: Ngẫu nhiên 🎲 | AI Gợi ý ✨]
    ↓
[Hiển thị kết quả: Tên món + Mô tả]
    ↓
[Action buttons:]
  ├── 🛵 Đặt qua Shopee Food  → deep link Shopee Food
  ├── 📍 Tìm quán gần đây    → deep link Google Maps
  ├── 🔄 Chọn lại
  └── 📅 Lưu vào Calendar
```

---

## 8. Dish Database Enhancement

Hiện tại có 16 món. Cần mở rộng lên **50+ món** với metadata đầy đủ:

```typescript
interface Dish {
  id: number;
  name: string;
  description: string;
  category: string;
  time: ("Sáng" | "Trưa" | "Tối" | "Khuya")[];
  budget: "under-50k" | "50k-100k" | "over-100k";  // NEW
  dietary: string[];   // NEW: ["chay", "no-seafood", "no-spicy"]
  region: "Bắc" | "Trung" | "Nam" | "Mọi vùng";   // NEW
  shopeeFoodKeyword: string;  // NEW: optimized search keyword
}
```

---

## 9. Success Metrics

| Metric | Target (3 tháng) |
|---|---|
| Session engagement (suggest → action) | > 60% user click Shopee Food/Maps |
| Daily active usage | User quay lại ≥ 3 lần/tuần |
| Suggestion satisfaction | User không "chọn lại" quá 2 lần/session |
| Load time | < 2s first meaningful paint |
| Dish variety | ≥ 80% người dùng chưa thấy lặp trong 7 ngày |

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Shopee Food thay đổi URL pattern | High | Monitor định kỳ, design URL builder dễ update |
| Gemini API key bị lộ | High | Restrict API key theo HTTP referrer |
| Geolocation bị từ chối | Medium | Fallback: user chọn thành phố thủ công |
| Dish database quá nhỏ → lặp nhiều | Medium | Mở rộng lên 50+ món trong Phase 2 |
| AI gợi ý sai món (không phù hợp dietary) | Medium | Double-check filter trước khi hiển thị |

---

## 11. Out of Scope (v1.0)

- Backend / Database
- User authentication
- GrabFood / Baemin integration
- Native mobile app (iOS/Android)
- Restaurant reviews / ratings trong app
- Nutritional tracking

---

## 12. Next Steps

1. **[Phase 2 implementation]** Shopee Food + Google Maps deep links (est. 1–2 ngày)
2. **[Phase 2 implementation]** Budget filter + Dietary preferences (est. 1 ngày)
3. **[Phase 2 implementation]** Mở rộng dish database lên 50+ món (est. 0.5 ngày)
4. **[Phase 2 QA]** Test deep links trên mobile browser (iOS Safari + Android Chrome)
5. **[Phase 3 planning]** Onboarding flow + share feature
