/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, LayoutList, RefreshCw, Sparkles, Utensils } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import type { Dish, MealTime } from "./types/dish-types";
import { DISHES } from "./data/dishes-data";
import { useMealHistory } from "./hooks/use-meal-history";
import { usePreferences } from "./hooks/use-preferences";
import { useGeolocation } from "./hooks/use-geolocation";
import { useCalendar } from "./hooks/use-calendar";
import { useAiSuggestion } from "./hooks/use-ai-suggestion";
import { FilterPanel } from "./components/filter-panel";
import { SuggestionDisplay } from "./components/suggestion-display";
import { MealHistorySection } from "./components/meal-history-section";
import { MenuListView } from "./components/menu-list-view";

function detectMealTime(): MealTime {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "Sáng";
  if (h >= 11 && h < 16) return "Trưa";
  if (h >= 16 && h < 22) return "Tối";
  return "Khuya";
}

export default function App() {
  const [view, setView] = useState<"random" | "menu">("random");
  const [activeTab, setActiveTab] = useState<MealTime>(detectMealTime);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [emptyPool, setEmptyPool] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mood, setMood] = useState("");
  const [weather, setWeather] = useState("");
  const [region, setRegion] = useState("");

  const { addToHistory, getRecentlyEaten, recentDisplayHistory } = useMealHistory();
  const { budget, setBudget, dietaryPrefs, toggleDietary, city, setCity } = usePreferences();
  const { location, requestLocation } = useGeolocation();
  const { isLogged, calendarStatus, logToCalendar, resetCalendar } = useCalendar();
  const { isAiLoading, aiSuggestion, getSmartSuggestion, clearSuggestion } = useAiSuggestion();

  const basePool = useMemo(() =>
    DISHES
      .filter(d => d.time.includes(activeTab))
      .filter(d => budget === "any" || d.budget === budget)
      .filter(d => dietaryPrefs.length === 0 || dietaryPrefs.every(p => d.dietary.includes(p))),
    [activeTab, budget, dietaryPrefs]
  );

  const randomize = useCallback(() => {
    if (isSpinning || isAiLoading) return;
    resetCalendar();
    clearSuggestion();
    setSelectedDish(null);
    setEmptyPool(false);

    if (basePool.length === 0) {
      setEmptyPool(true);
      return;
    }

    const recentlyEaten = getRecentlyEaten();
    const deduped = basePool.filter(d => !recentlyEaten.has(d.name));
    const pool = deduped.length > 0 ? deduped : basePool;

    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setSelectedDish(pool[Math.floor(Math.random() * pool.length)]);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setIsSpinning(false);
        const final = pool[Math.floor(Math.random() * pool.length)];
        setSelectedDish(final);
        addToHistory(final.name);
      }
    }, 80);
  }, [isSpinning, isAiLoading, basePool, getRecentlyEaten, resetCalendar, clearSuggestion, addToHistory]);

  const handleAiSuggest = useCallback(() => {
    if (isSpinning || isAiLoading) return;
    resetCalendar();
    setSelectedDish(null);
    setEmptyPool(false);
    getSmartSuggestion({ mealTime: activeTab, mood, weather, region, budget, dietaryPrefs });
  }, [isSpinning, isAiLoading, activeTab, mood, weather, region, budget, dietaryPrefs, resetCalendar, getSmartSuggestion]);

  const handleLogCalendar = useCallback(() => {
    const name = selectedDish?.name ?? aiSuggestion?.split(":")[0].trim() ?? "Bữa ăn";
    logToCalendar(name, activeTab);
  }, [selectedDish, aiSuggestion, activeTab, logToCalendar]);

  const switchTab = (tab: MealTime) => {
    setActiveTab(tab);
    setSelectedDish(null);
    clearSuggestion();
    setEmptyPool(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col items-center justify-center p-4 font-sans text-[#2D1B08] selection:bg-[#FF6321] selection:text-white">
      <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(255,99,33,0.15)] border border-[#FFE7D6] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF6321] to-[#FFB347]" />

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          {view === "menu" ? (
            <button onClick={() => setView("random")} className="p-2 hover:bg-[#F5F5F0] rounded-xl transition-colors">
              <ArrowLeft className="w-6 h-6 text-[#A6998F]" />
            </button>
          ) : (
            <div className="w-10 h-10 bg-[#FF6321] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF632133]">
              <Utensils className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setView(v => v === "random" ? "menu" : "random")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              view === "menu" ? "bg-[#FF6321] text-white" : "bg-[#F5F5F0] text-[#A6998F] hover:text-[#FF6321]"
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Thực đơn
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === "random" ? (
            <motion.div key="randomizer" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 pt-0">
              <header className="text-center mb-6">
                <h1 className="text-2xl font-black text-[#1A1A1A] mb-4">Hôm nay ăn gì?</h1>
                <div className="flex bg-[#F5F5F0] p-1 rounded-xl">
                  {(["Sáng", "Trưa", "Tối", "Khuya"] as MealTime[]).map(meal => (
                    <button key={meal} onClick={() => switchTab(meal)}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                        activeTab === meal ? "bg-white text-[#FF6321] shadow-sm" : "text-[#A6998F] hover:text-[#5C4D3F]"
                      }`}
                    >{meal}</button>
                  ))}
                </div>
              </header>

              <main className="space-y-6">
                <FilterPanel
                  show={showFilters} onToggle={() => setShowFilters(v => !v)}
                  mood={mood} weather={weather} region={region} budget={budget}
                  dietaryPrefs={dietaryPrefs} city={city}
                  onMoodChange={setMood} onWeatherChange={setWeather} onRegionChange={setRegion}
                  onBudgetChange={setBudget} onDietaryToggle={toggleDietary} onCityChange={setCity}
                />

                <SuggestionDisplay
                  selectedDish={selectedDish} aiSuggestion={aiSuggestion}
                  emptyPool={emptyPool} isLogged={isLogged} calendarStatus={calendarStatus}
                  location={location} preferredCity={city} activeTab={activeTab}
                  onLogCalendar={handleLogCalendar} onRequestLocation={requestLocation}
                />

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={randomize} disabled={isSpinning || isAiLoading}
                    className="flex flex-col items-center justify-center gap-1 bg-[#FF6321] hover:bg-[#E5551A] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-[#FF632122]"
                  >
                    <RefreshCw className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
                    <span className="text-xs">Ngẫu nhiên</span>
                  </button>
                  <button onClick={handleAiSuggest} disabled={isSpinning || isAiLoading}
                    className="flex flex-col items-center justify-center gap-1 bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
                  >
                    <Sparkles className={`w-5 h-5 ${isAiLoading ? "animate-pulse" : ""}`} />
                    <span className="text-xs">AI Gợi ý</span>
                  </button>
                </div>

                <MealHistorySection
                  history={recentDisplayHistory}
                  show={showHistory}
                  onToggle={() => setShowHistory(v => !v)}
                />
              </main>
            </motion.div>
          ) : (
            <motion.div key="menu-list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <MenuListView dishes={DISHES} />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="px-8 pb-8 text-center border-t border-[#FFF0E6] pt-6 mt-auto">
          <p className="text-[10px] text-[#A6998F] uppercase tracking-[0.2em] font-black">
            Vietnam Cuisine • {new Date().getFullYear()}
          </p>
        </footer>
      </motion.div>

      <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-[#FF6321] opacity-5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -top-20 -right-20 w-64 h-64 bg-[#FF6321] opacity-5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
