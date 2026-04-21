import { UserProfile, EligibilityResult } from "./types";

export function checkEligibility(profile: UserProfile): EligibilityResult {
  const reasons: string[] = [];
  const nextSteps: string[] = [];

  // Check age
  if (profile.age !== null && profile.age < 18) {
    reasons.push("You must be at least 18 years old to vote in most elections");
    if (profile.age >= 16) {
      nextSteps.push("You may be able to pre-register now in some states");
    }
    return { verdict: "not-eligible", reasons, nextSteps };
  }

  // Check citizenship
  if (profile.citizenship === "non-citizen") {
    reasons.push("Only citizens can vote in federal elections");
    nextSteps.push("Check if your area allows non-citizen voting in local elections");
    return { verdict: "not-eligible", reasons, nextSteps };
  }

  // Check registration
  if (profile.registrationStatus === "no") {
    reasons.push("You appear to meet the basic requirements but need to register");
    nextSteps.push("Register to vote at your state's official website");
    nextSteps.push("Check registration deadlines for upcoming elections");
    return { verdict: "maybe", reasons, nextSteps };
  }

  if (profile.registrationStatus === "not-sure") {
    reasons.push("You may be eligible — let's confirm your registration");
    nextSteps.push("Check your registration status online");
    nextSteps.push("Contact your local election office if unsure");
    return { verdict: "maybe", reasons, nextSteps };
  }

  // All checks passed
  if (profile.registrationStatus === "yes" && profile.age !== null && profile.age >= 18 && profile.citizenship === "citizen") {
    reasons.push("You meet all the basic eligibility requirements!");
    nextSteps.push("Review what's on your ballot");
    nextSteps.push("Check your polling location and hours");
    return { verdict: "eligible", reasons, nextSteps };
  }

  // Default fallback
  reasons.push("We need a bit more information to determine your eligibility");
  nextSteps.push("Complete all the questions above");
  return { verdict: "maybe", reasons, nextSteps };
}
