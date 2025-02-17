import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/Button";

interface Poll {
  description: string;
  url: string;
}

const polls: Poll[] = [
  {
    description:
      "Do you believe reciprocal tariffs are an effective tool for balancing international trade?",
    url: "https://vote.one/1BQZ2v3a",
  },
  {
    description:
      "Do you think recent severe weather events indicate a significant change in our climate?",
    url: "https://vote.one/GVnbTAbR",
  },
  {
    description:
      "Should international agreements set binding standards for the treatment of migrants and refugees?",
    url: "https://vote.one/vLoWhqjh",
  },
  {
    description:
      "Would expanding the representation of emerging economies and civil society in global decision-making improve international outcomes?",
    url: "https://vote.one/I6gUFLJa",
  },
  {
    description:
      "Are diplomatic solutions generally more effective than military approaches for resolving international conflicts?",
    url: "https://vote.one/f3Dm4GS6",
  },
];

export function PollOfTheDay() {
  // Calculate poll index based on the number of days since a fixed reference date.
  const getPollIndex = () => {
    const referenceDate = new Date("2023-01-01T00:00:00Z");
    const now = new Date();
    const dayDiff = Math.floor(
      (now.getTime() - referenceDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    return dayDiff % polls.length;
  };

  const [pollIndex, setPollIndex] = useState(getPollIndex());

  useEffect(() => {
    // Calculate how many milliseconds remain until the next day (change at midnight local time)
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const msUntilTomorrow = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      setPollIndex(getPollIndex());
    }, msUntilTomorrow);

    return () => clearTimeout(timer);
  }, [pollIndex]);

  const currentPoll = polls[pollIndex];

  return (
    <div className="flex min-h-[calc(100dvh-200px)] flex-col items-center justify-center">
      <SectionHeader
        title="Poll of the Day"
        description={currentPoll.description}
      />
      <div className="w-full">
        <a href={currentPoll.url} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" fullWidth>
            Vote now
          </Button>
        </a>
      </div>
    </div>
  );
}
