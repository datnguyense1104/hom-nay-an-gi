import { AnimatePresence, motion } from "motion/react";
import { ChefHat, Sparkles, Calendar, CheckCircle2, AlertCircle, RefreshCw, MapPin, ShoppingBag } from "lucide-react";
import type { Dish } from "../types/dish-types";
import type { CalendarStatus } from "../hooks/use-calendar";
import type { GeolocationState } from "../hooks/use-geolocation";
import { buildShopeeFoodUrl, buildGoogleMapsUrl, resolveCitySlug } from "../utils/deep-links";
import { ShareButton } from "./share-button";

// Re-export so consumers don't need to import from hooks directly
export type { GeolocationState };

interface Props {
  selectedDish: Dish | null;
  aiSuggestion: string | null;
  aiError: string | null;
  emptyPool: boolean;
  isLogged: boolean;
  calendarStatus: CalendarStatus;
  location: GeolocationState;
  preferredCity: string;
  activeTab: string;
  onLogCalendar: () => void;
  onRequestLocation: () => void;
  onGetShareUrl?: () => string;
}

function DeepLinkButtons({
  keyword, dishName, location, preferredCity, onRequestLocation,
}: {
  keyword: string; dishName: string;
  location: GeolocationState; preferredCity: string;
  onRequestLocation: () => void;
}) {
  const handleShopee = () => {
    // Request location if not yet available, then open immediately
    if (!location.lat && !location.error) onRequestLocation();
    const citySlug = resolveCitySlug(location.lat, location.lng, preferredCity);
    window.open(buildShopeeFoodUrl(keyword, citySlug), "_blank", "noopener,noreferrer");
  };

  const handleMaps = () => {
    if (!location.lat && !location.error) onRequestLocation();
    window.open(buildGoogleMapsUrl(dishName, location.lat, location.lng), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex gap-2 justify-center mt-3">
      <button
        onClick={handleShopee}
        disabled={location.loading}
        className="flex items-center gap-1.5 px-4 py-2 bg-[#EE4D2D] hover:bg-[#D73B1F] disabled:opacity-50 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all"
      >
        {location.loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ShoppingBag className="w-3 h-3" />}
        Shopee Food
      </button>
      <button
        onClick={handleMaps}
        disabled={location.loading}
        className="flex items-center gap-1.5 px-4 py-2 bg-[#4285F4] hover:bg-[#3270D8] disabled:opacity-50 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all"
      >
        {location.loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
        Gần đây
      </button>
    </div>
  );
}

function CalendarButton({ isLogged, calendarStatus, onLogCalendar }: Pick<Props, "isLogged" | "calendarStatus" | "onLogCalendar">) {
  if (isLogged) {
    return (
      <div className="flex items-center gap-2 px-6 py-2 bg-[#34A85311] text-[#34A853] rounded-full text-xs font-black uppercase tracking-widest">
        <CheckCircle2 className="w-3 h-3" />
        Đã lưu thành công
      </div>
    );
  }
  return (
    <button
      onClick={onLogCalendar}
      disabled={calendarStatus === "loading"}
      className="group flex items-center gap-2 px-6 py-2 bg-[#F5F5F0] hover:bg-[#FF632111] text-[#A6998F] hover:text-[#FF6321] rounded-full text-xs font-black uppercase tracking-widest transition-all"
    >
      {calendarStatus === "loading" ? (
        <RefreshCw className="w-3 h-3 animate-spin" />
      ) : calendarStatus === "error" ? (
        <AlertCircle className="w-3 h-3 text-red-400" />
      ) : (
        <Calendar className="w-3 h-3 transition-transform group-hover:scale-110" />
      )}
      {calendarStatus === "loading" ? "Đang đồng bộ..." : calendarStatus === "error" ? "Lỗi (Thử lại)" : "Lưu vào Calendar"}
    </button>
  );
}

export function SuggestionDisplay({
  selectedDish, aiSuggestion, aiError, emptyPool,
  isLogged, calendarStatus, location, preferredCity,
  activeTab, onLogCalendar, onRequestLocation, onGetShareUrl,
}: Props) {
  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center border border-[#FFE7D6] rounded-[2rem] p-6 bg-gradient-to-b from-[#FEFCFA] to-white relative shadow-inner">
      <AnimatePresence mode="wait">
        {emptyPool ? (
          <motion.div key="empty-pool" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className="text-sm text-[#A6998F] font-medium mb-1">Không tìm thấy món phù hợp</p>
            <p className="text-xs text-[#C4B8AD]">Thử điều chỉnh ngân sách hoặc sở thích ăn uống</p>
          </motion.div>
        ) : aiError ? (
          <motion.div key="ai-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <p className="text-sm text-[#A6998F] font-medium mb-1">AI không phản hồi</p>
            <p className="text-xs text-[#C4B8AD] max-w-[220px] mx-auto">{aiError}</p>
          </motion.div>
        ) : selectedDish ? (
          <motion.div key={selectedDish.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center w-full">
            <span className="inline-block px-3 py-1 bg-[#FFF0E6] text-[#FF6321] text-xs font-extrabold uppercase tracking-widest rounded-lg mb-3">
              {selectedDish.category}
            </span>
            <h2 className="text-3xl font-black text-[#1A1A1A] mb-3 leading-tight">{selectedDish.name}</h2>
            <p className="text-sm text-[#8C7A6B] leading-relaxed max-w-[280px] mx-auto line-clamp-3">{selectedDish.description}</p>
            <DeepLinkButtons
              keyword={selectedDish.shopeeFoodKeyword}
              dishName={selectedDish.name}
              location={location}
              preferredCity={preferredCity}
              onRequestLocation={onRequestLocation}
            />
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <CalendarButton isLogged={isLogged} calendarStatus={calendarStatus} onLogCalendar={onLogCalendar} />
              {onGetShareUrl && <ShareButton onGetUrl={onGetShareUrl} dishName={selectedDish.name} />}
            </div>
          </motion.div>
        ) : aiSuggestion ? (
          <motion.div key="ai-suggestion" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#FF6321]" />
              <span className="text-xs font-black text-[#FF6321] uppercase tracking-tight">AI Gợi ý</span>
            </div>
            <h2 className="text-2xl font-black text-[#FF6321] mb-2">{aiSuggestion.slice(0, aiSuggestion.indexOf(":")).trim()}</h2>
            <p className="text-sm text-[#5C4D3F] leading-7 px-4">{aiSuggestion.slice(aiSuggestion.indexOf(":") + 1).trim()}</p>
            <DeepLinkButtons
              keyword={aiSuggestion.slice(0, aiSuggestion.indexOf(":")).trim()}
              dishName={aiSuggestion.slice(0, aiSuggestion.indexOf(":")).trim()}
              location={location}
              preferredCity={preferredCity}
              onRequestLocation={onRequestLocation}
            />
            <div className="mt-3 flex justify-center">
              <CalendarButton isLogged={isLogged} calendarStatus={calendarStatus} onLogCalendar={onLogCalendar} />
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="w-16 h-16 bg-[#FFF0E6] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-[#FF6321]" />
            </div>
            <p className="text-sm font-bold text-[#8C7A6B]">Bấm để tìm món ngon</p>
            <p className="text-xs text-[#C4B8AD] mt-1">Chọn bữa ăn và nhấn ngẫu nhiên</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
