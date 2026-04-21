"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  UserProfile,
  EligibilityResult,
  AppStep,
  ChecklistItem,
  ChatMessage,
  Contest,
} from "@/lib/types";
import { checkEligibility } from "@/lib/eligibility";
import { defaultChecklist } from "@/lib/checklist-data";

interface AppContextType {
  // Navigation
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  progress: number;

  // User Profile
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Eligibility
  eligibilityResult: EligibilityResult | null;
  runEligibilityCheck: () => void;

  // Ballot
  contests: Contest[];
  setContests: (contests: Contest[]) => void;

  // Checklist
  checklist: ChecklistItem[];
  toggleChecklistItem: (id: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STEP_ORDER: AppStep[] = ["welcome", "eligibility", "journey", "ballot", "practice", "checklist", "assistant"];

function getProgressForStep(step: AppStep): number {
  const index = STEP_ORDER.indexOf(step);
  if (index <= 0) return 0;
  return Math.round((index / (STEP_ORDER.length - 1)) * 100);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStepRaw] = useState<AppStep>("welcome");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    country: "",
    region: "",
    age: null,
    citizenship: "",
    registrationStatus: "",
  });
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load checklist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("votely-checklist");
      if (saved) {
        setChecklist(JSON.parse(saved));
      }
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, []);

  // Save checklist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("votely-checklist", JSON.stringify(checklist));
    } catch {
      // Silently fail
    }
  }, [checklist]);

  const progress = getProgressForStep(currentStep);

  const setCurrentStep = useCallback((step: AppStep) => {
    setCurrentStepRaw(step);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const runEligibilityCheck = useCallback(() => {
    const result = checkEligibility(userProfile);
    setEligibilityResult(result);
  }, [userProfile]);

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  const addChatMessage = useCallback((message: ChatMessage) => {
    setChatMessages((prev) => [...prev, message]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        progress,
        userProfile,
        updateProfile,
        eligibilityResult,
        runEligibilityCheck,
        contests,
        setContests,
        checklist,
        toggleChecklistItem,
        chatMessages,
        addChatMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
