import { useState } from "react";

const ONBOARDING_KEY = "onboarding_completed";

export function useOnboardingState() {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem(ONBOARDING_KEY) !== "true");
  const [step, setStep] = useState(0);

  const complete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsOpen(false);
  };

  const skip = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsOpen(false);
  };

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  // Called when a shared URL is detected — silently mark completed
  const forceClose = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsOpen(false);
  };

  // Allows re-opening preferences wizard from main UI
  const open = () => { setStep(0); setIsOpen(true); };

  return { isOpen, step, next, back, complete, skip, forceClose, open };
}
