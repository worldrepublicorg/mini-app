import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "./ui/Typography";
import Link from "next/link";

interface Poll {
  description: string;
  url: string;
}

const polls: Poll[] = [
  {
    description:
      "Should international guidelines be implemented to protect data generated worldwide under a unified framework for digital sovereignty?",
    url: "https://vote.one/r4VmX0XN",
  },
  {
    description:
      "Should there be a global regulatory framework for emerging biotechnologies to ensure ethical use and safety?",
    url: "https://vote.one/pNqgoSmf",
  },
  {
    description:
      "Should global leaders agree on protocols to prevent the militarization of space and secure it for peaceful purposes?",
    url: "https://vote.one/vBztzW2P",
  },
  {
    description:
      "Should global regulations require mandatory watermarking of AI-generated content to combat misinformation in elections and media?",
    url: "https://vote.one/Jbra7uUp",
  },
  {
    description:
      "Should a global rapid-response fund be established to provide immediate relief for devastating natural disasters like major earthquakes?",
    url: "https://vote.one/kKlY77pD",
  },
];

export function PollOfTheDay() {
  const getPollIndex = () => {
    // Use local midnight for consistency
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const referenceDate = new Date(2023, 0, 1); // Local midnight Jan 1, 2023
    const dayDiff = Math.floor(
      (today.getTime() - referenceDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.abs(dayDiff % polls.length); // Add Math.abs for safety
  };

  const [pollIndex, setPollIndex] = useState(getPollIndex());

  useEffect(() => {
    // Update at next midnight
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const msUntilTomorrow = tomorrow.getTime() - now.getTime();

    // Immediate check in case we're slightly past midnight
    setPollIndex(getPollIndex());

    const timer = setTimeout(() => {
      setPollIndex(getPollIndex());
    }, msUntilTomorrow);

    return () => clearTimeout(timer);
  }, []); // Remove pollIndex dependency

  const currentPoll = polls[pollIndex];

  return (
    <div className="flex flex-col justify-center">
      <div className="w-full">
        <Typography
          as="h3"
          variant={{ variant: "heading", level: 2 }}
          className="mb-10 text-center"
        >
          {currentPoll.description}
        </Typography>
        <a href={currentPoll.url} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" fullWidth>
            Vote Now
          </Button>
        </a>
        <Link href="/previous-polls" className="mt-2 block h-10">
          <Button variant="ghost" fullWidth>
            Previous Polls
          </Button>
        </Link>
      </div>
    </div>
  );
}
