import { ChecklistItem } from "./types";

export const defaultChecklist: ChecklistItem[] = [
  {
    id: "reg-check",
    label: "Verify your voter registration",
    description: "Check your registration status on your state's official website",
    category: "registration",
    completed: false,
    priority: "high",
    deadline: "2026-11-01",
  },
  {
    id: "reg-update",
    label: "Update your registration if you moved",
    description: "If you've changed address, update your voter registration",
    category: "registration",
    completed: false,
    priority: "high",
    deadline: "2026-10-15",
  },
  {
    id: "reg-party",
    label: "Check party affiliation (if needed)",
    description: "Some states require party registration for primaries",
    category: "registration",
    completed: false,
    priority: "medium",
  },
  {
    id: "doc-id",
    label: "Prepare valid photo ID",
    description: "Driver's license, passport, or state-issued ID",
    category: "documents",
    completed: false,
    priority: "high",
  },
  {
    id: "doc-proof",
    label: "Gather proof of address",
    description: "Utility bill, bank statement, or government mail",
    category: "documents",
    completed: false,
    priority: "medium",
  },
  {
    id: "doc-card",
    label: "Locate your voter registration card",
    description: "Not always required but helpful to have",
    category: "documents",
    completed: false,
    priority: "low",
  },
  {
    id: "prep-location",
    label: "Find your polling location",
    description: "Look up where you need to go on election day",
    category: "preparation",
    completed: false,
    priority: "high",
  },
  {
    id: "prep-hours",
    label: "Check polling hours",
    description: "Know when your polling place opens and closes",
    category: "preparation",
    completed: false,
    priority: "high",
  },
  {
    id: "prep-research",
    label: "Research candidates and measures",
    description: "Review what's on your ballot before voting day",
    category: "preparation",
    completed: false,
    priority: "medium",
  },
  {
    id: "prep-plan",
    label: "Plan your voting day schedule",
    description: "Decide when you'll go and how you'll get there",
    category: "preparation",
    completed: false,
    priority: "medium",
  },
];

export function getQuickChecklist(items: ChecklistItem[]): ChecklistItem[] {
  return items
    .filter((item) => item.priority === "high" && !item.completed)
    .slice(0, 3);
}

export function getDaysUntilDeadline(deadline?: string): number | null {
  if (!deadline) return null;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
