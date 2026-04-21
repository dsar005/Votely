export interface UserProfile {
  country: string;
  region: string;
  age: number | null;
  citizenship: string;
  registrationStatus: "yes" | "no" | "not-sure" | "";
}

export type EligibilityVerdict = "eligible" | "not-eligible" | "maybe" | null;

export interface EligibilityResult {
  verdict: EligibilityVerdict;
  reasons: string[];
  nextSteps: string[];
}

export interface JourneyStage {
  id: number;
  key: string;
  title: string;
  description: string;
  timeEstimate: string;
  icon: string;
  completed: boolean;
}

export interface Candidate {
  name: string;
  party: string;
  office: string;
  photoUrl?: string;
}

export interface Contest {
  office: string;
  candidates: Candidate[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  category: "registration" | "documents" | "preparation";
  completed: boolean;
  priority: "high" | "medium" | "low";
  deadline?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export type AppStep = "welcome" | "eligibility" | "journey" | "ballot" | "practice" | "checklist" | "assistant";
