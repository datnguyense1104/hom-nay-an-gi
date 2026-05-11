/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, LayoutList, Utensils } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import type { Dish, MealTime } from "./types/dish-types";
import { DISHES } from "./data/dishes-data";
import { useMealHistory } from "./hooks/use-meal-history";
import { usePreferences } from "./hooks/use-preferences";
import { useGeolocation } from "./hooks/use-geolocation";
import { useAiSuggestion } from "./hooks/use-ai-suggestion";
import { useOnboardingState } from "./hooks/use-onboarding-state";
import { useShareState } from "./hooks/use-share-state";
import { useLongOverdue } from "./hooks/use-long-overdue";
import { FilterPanel } from "./components/filter-panel";
import { SuggestionDisplay } from "./components/suggestion-display";
import { MealHistorySection } from "./components/meal-history-section";
import { MenuListView } from "./components/menu-list-view";
import { OnboardingFlow } from "./components/onboarding-flow";
import { ActionButtons, Toast } from "./components/action-buttons";
import { buildShareUrl } from "./utils/share-utils";

function detectMealTime(): MealTime {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "Sáng";
  if (h >= 11 && h < 16) return "Trưa";
  if (h >= 16 && h < 22) return "Tối";
  return "Khuya";
}

// Shared spinning animation used by randomize and long-overdue pick
function runSpinningPick(pool: Dish[], setIsSpinning: (v: boolean) => void, setSelectedDish: (d: Dish | null) => void, onDone: (d: Dish) => void) {
  setIsSpinning(true);
  let count = 0;
  const interval = setInterval(() => {
    setSelectedDish(pool[Math.floor(Math.random() * pool.length)]);
    if (++count > 12) {
      clearInterval(interval);
      setIsSpinning(false);
      const final = pool[Math.floor(Math.random() * pool.length)];
      setSelectedDish(final);
      onDone(final);
    }
  }, 80);
}

export default function App() {
  const [view, setView] = useState<"random" | "menu">("random");
  const [activeTab, setActiveTab] = useState<MealTime>(detectMealTime);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [emptyPool, setEmptyPool] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mood, setMood] = useState(() => localStorage.getItem("default_mood") ?? "");
  const [weather, setWeather] = useState("");
  const [region, setRegion] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const { addToHistory, getRecentlyEaten, recentDisplayHistory, mealHistory } = useMealHistory();
  const { budget, setBudget, dietaryPrefs, toggleDietary, city, setCity } = usePreferences();
  const { location, requestLocation } = useGeolocation();
  const { isAiLoading, aiSuggestion, aiError, getSmartSuggestion, clearSuggestion } = useAiSuggestion();
  const onboarding = useOnboardingState();
  const shareState = useShareState();

  const basePool = useMemo(() =>
    DISHES
      .filter(d => d.time.includes(activeTab))
      .filter(d => budget === "any" || d.budget === budget)
      .filter(d => dietaryPrefs.length === 0 || dietaryPrefs.every(p => d.dietary.includes(p))),
    [activeTab, budget, dietaryPrefs]
  );

  const { overduePool } = useLongOverdue(mealHistory, basePool);

  // Apply shared-URL state on first mount: pre-fill dish + filters, skip onboarding
  useEffect(() => {
    if (!shareState.hasShare) return;
    onboarding.forceClose();
    setSelectedDish(shareState.dish);
    if (shareState.budget) setBudget(shareState.budget);
    if (shareState.dietary) shareState.dietary.forEach(t => { if (!dietaryPrefs.includes(t)) toggleDietary(t); });
    if (shareState.region) setRegion(shareState.region);
    if (shareState.meal) setActiveTab(shareState.meal);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const randomize = useCallback(() => {
    if (isSpinning || isAiLoading) return;
    clearSuggestion(); setSelectedDish(null); setEmptyPool(false);
    if (basePool.length === 0) { setEmptyPool(true); return; }
    const recent = getRecentlyEaten();
    const pool = basePool.filter(d => !recent.has(d.name));
    runSpinningPick(pool.length > 0 ? pool : basePool, setIsSpinning, setSelectedDish, d => addToHistory(d.name));
  }, [isSpinning, isAiLoading, basePool, getRecentlyEaten, clearSuggestion, addToHistory]);

  const pickLongOverdue = useCallback(() => {
    if (isSpinning || isAiLoading) return;
    clearSuggestion(); setSelectedDish(null); setEmptyPool(false);
    const pool = overduePool.length > 0 ? overduePool : basePool;
    if (pool.length === 0) { setEmptyPool(true); return; }
    if (overduePool.length === 0) showToast("Chưa có món nào lâu chưa ăn 😊");
    runSpinningPick(pool, setIsSpinning, setSelectedDish, d => addToHistory(d.name));
  }, [isSpinning, isAiLoading, overduePool, basePool, clearSuggestion, addToHistory]);

  const handleAiSuggest = useCallback(() => {
    if (isSpinning || isAiLoading) return;
    setSelectedDish(null); setEmptyPool(false);
    getSmartSuggestion({ mealTime: activeTab, mood, weather, region, budget, dietaryPrefs });
  }, [isSpinning, isAiLoading, activeTab, mood, weather, region, budget, dietaryPrefs, getSmartSuggestion]);

  // Add AI-suggested dish name to history when suggestion arrives
  useEffect(() => {
    if (!aiSuggestion) return;
    const name = aiSuggestion.split(":")[0].trim();
    if (name) addToHistory(name);
  }, [aiSuggestion]); // eslint-disable-line react-hooks/exhaustive-deps

  const setDefaultMood = (m: string) => { setMood(m); localStorage.setItem("default_mood", m); };
  const switchTab = (tab: MealTime) => { setActiveTab(tab); setSelectedDish(null); clearSuggestion(); setEmptyPool(false); };
  const getShareUrl = () => buildShareUrl({ dish: selectedDish!, budget, dietary: dietaryPrefs, region, meal: activeTab });

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col items-center justify-center p-4 font-sans text-[#2D1B08] selection:bg-[#FF6321] selection:text-white">
      {onboarding.isOpen && (
        <OnboardingFlow
          step={onboarding.step} onNext={onboarding.next} onBack={onboarding.back}
          onComplete={onboarding.complete} onSkip={onboarding.skip}
          dietaryPrefs={dietaryPrefs} toggleDietary={toggleDietary}
          city={city} setCity={setCity}
          defaultMood={mood} setDefaultMood={setDefaultMood}
        />
      )}

      <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(255,99,33,0.15)] border border-[#FFE7D6] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF6321] to-[#FFB347]" />

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
          <button onClick={() => setView(v => v === "random" ? "menu" : "random")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
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
                      className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                        activeTab === meal ? "bg-white text-[#FF6321] shadow-sm" : "text-[#A6998F] hover:text-[#5C4D3F]"
                      }`}
                    >{meal}</button>
                  ))}
                </div>
              </header>

              <main className="space-y-6">
                <FilterPanel
                  show={showFilters} onToggle={() => setShowFilters(v => !v)}
                  mood={mood} weather={weather} region={region}
                  dietaryPrefs={dietaryPrefs} city={city}
                  onMoodChange={setMood} onWeatherChange={setWeather} onRegionChange={setRegion}
                  onDietaryToggle={toggleDietary} onCityChange={setCity}
                />
                <SuggestionDisplay
                  selectedDish={selectedDish} aiSuggestion={aiSuggestion} aiError={aiError}
                  emptyPool={emptyPool} location={location} preferredCity={city} activeTab={activeTab}
                  onRequestLocation={requestLocation}
                  onGetShareUrl={selectedDish ? getShareUrl : undefined}
                />
                <ActionButtons
                  onRandomize={randomize} onAiSuggest={handleAiSuggest} onLongOverdue={pickLongOverdue}
                  isSpinning={isSpinning} isAiLoading={isAiLoading}
                />
                <MealHistorySection history={recentDisplayHistory} show={showHistory} onToggle={() => setShowHistory(v => !v)} />
              </main>
            </motion.div>
          ) : (
            <motion.div key="menu-list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <MenuListView dishes={DISHES} />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="px-8 pb-8 text-center border-t border-[#FFF0E6] pt-6 mt-auto">
          <p className="text-xs text-[#A6998F] uppercase tracking-[0.2em] font-black">
            Vietnam Cuisine • {new Date().getFullYear()}
          </p>
        </footer>
      </motion.div>

      <Toast message={toast} />

      <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-[#FF6321] opacity-5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -top-20 -right-20 w-64 h-64 bg-[#FF6321] opacity-5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
