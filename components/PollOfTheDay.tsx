import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/Button";

interface Poll {
  description: string;
  url: string;
}

const polls: Poll[] = [
  {
    description: "Should global AI ethics standards be established?",
    url: "https://vote.one/cK8p3cXG",
  },
  {
    description: "Will current Ukraine peace talks result in a ceasefire?",
    url: "https://vote.one/V0mOiHvs",
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
