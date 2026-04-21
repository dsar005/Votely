import { Contest, Candidate } from "./types";

const CIVIC_API_KEY = process.env.NEXT_PUBLIC_CIVIC_API_KEY || "";

interface CivicApiResponse {
  contests?: Array<{
    office: string;
    candidates?: Array<{
      name: string;
      party: string;
      photoUrl?: string;
    }>;
  }>;
  error?: { message: string };
}

export async function fetchBallotInfo(address: string): Promise<Contest[]> {
  try {
    const url = `https://www.googleapis.com/civicinfo/v2/voterinfo?key=${CIVIC_API_KEY}&address=${encodeURIComponent(address)}&electionId=2000`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Civic API responded with status ${response.status}`);
    }

    const data: CivicApiResponse = await response.json();

    if (data.error || !data.contests) {
      return getMockBallotData();
    }

    return data.contests.map((contest) => ({
      office: contest.office,
      candidates: (contest.candidates || []).map((c) => ({
        name: c.name,
        party: c.party || "Independent",
        office: contest.office,
        photoUrl: c.photoUrl,
      })),
    }));
  } catch (error) {
    console.error("Civic API error:", error);
    return getMockBallotData();
  }
}

export function getMockBallotData(): Contest[] {
  return [
    {
      office: "President of the United States",
      candidates: [
        { name: "Alex Johnson", party: "Democratic Party", office: "President of the United States" },
        { name: "Morgan Smith", party: "Republican Party", office: "President of the United States" },
        { name: "Casey Williams", party: "Independent", office: "President of the United States" },
      ],
    },
    {
      office: "U.S. Senator",
      candidates: [
        { name: "Jordan Lee", party: "Democratic Party", office: "U.S. Senator" },
        { name: "Taylor Brown", party: "Republican Party", office: "U.S. Senator" },
      ],
    },
    {
      office: "U.S. Representative - District 5",
      candidates: [
        { name: "Riley Garcia", party: "Democratic Party", office: "U.S. Representative - District 5" },
        { name: "Avery Martinez", party: "Republican Party", office: "U.S. Representative - District 5" },
        { name: "Quinn Davis", party: "Green Party", office: "U.S. Representative - District 5" },
      ],
    },
    {
      office: "State Governor",
      candidates: [
        { name: "Harper Wilson", party: "Democratic Party", office: "State Governor" },
        { name: "Drew Anderson", party: "Republican Party", office: "State Governor" },
      ],
    },
    {
      office: "Mayor",
      candidates: [
        { name: "Skyler Thomas", party: "Democratic Party", office: "Mayor" },
        { name: "Reese Jackson", party: "Republican Party", office: "Mayor" },
        { name: "Finley White", party: "Independent", office: "Mayor" },
      ],
    },
  ];
}
