import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "./ui/Typography";

interface Poll {
  description: string;
  url: string;
}

const polls: Poll[] = [
  {
    description:
      "Given recent shifts in major power policies, do you believe the international community will become more cooperative or more competitive?",
    url: "https://vote.one/UCXWIhm5",
  },
  {
    description:
      "Should high-income countries be required to fund climate adaptation efforts in low-income nations most affected by extreme weather?",
    url: "https://vote.one/jurFwZTv",
  },
  {
    description:
      "Should countries be required to share real-time data during disease outbreaks to prevent global health crises?",
    url: "https://vote.one/OZ2T4A53",
  },
  {
    description:
      "Should governments prioritize regulating artificial intelligence (AI) development to prevent misuse, even if it slows innovation?",
    url: "https://vote.one/6xsTYiEV",
  },
  {
    description:
      "Should countries with advanced military capabilities intervene to de-escalate conflicts in regions experiencing sudden outbreaks of war?",
    url: "https://vote.one/GrS25I8Y",
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
            Vote now
          </Button>
        </a>
      </div>
    </div>
  );
}
