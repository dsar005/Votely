import { UserProfile, EligibilityResult } from "./types";

export function checkEligibility(profile: UserProfile): EligibilityResult {
  const reasons: string[] = [];
  const nextSteps: string[] = [];

  if (profile.age !== null && profile.age < 18) {
    reasons.push("You must be at least 18 years old to vote.");
    return { verdict: "not-eligible", reasons, nextSteps };
  }

  if (profile.age !== null && profile.age >= 18 && profile.citizenship === "citizen") {
    reasons.push("You are eligible to vote based on age and citizenship!");
    nextSteps.push("Register to vote");
    nextSteps.push("Review your ballot");
    return { verdict: "eligible", reasons, nextSteps };
  }

  reasons.push("We need more information or you might have special requirements to be eligible.");
  nextSteps.push("Check your local election office for details");
  return { verdict: "maybe", reasons, nextSteps };
}
