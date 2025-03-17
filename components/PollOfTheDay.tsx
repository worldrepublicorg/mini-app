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
      "Should countries experiencing extreme weather disasters (e.g., wildfires, floods) receive prioritized financial aid from a global climate fund?",
    url: "https://vote.one/MTHSApYb",
  },
  {
    description:
      "Do you support global policy frameworks that balance national sovereignty with coordinated responses to shared challenges?",
    url: "https://vote.one/67a0Lnei",
  },
  {
    description:
      "Should all conflict zones with civilian humanitarian crises automatically trigger internationally coordinated aid corridors?",
    url: "https://vote.one/l3Yu6hMi",
  },
  {
    description:
      "Should corporations operating in multiple countries be subject to a unified global minimum tax rate to reduce inequality?",
    url: "https://vote.one/3FhzXHRG",
  },
  {
    description:
      "Should global AI developers be required to pause training models more powerful than current systems until international safety agreements are established?",
    url: "https://vote.one/HUuPPFOS",
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
            Vote Now
          </Button>
        </a>
        <Link href="/previous-polls" className="mt-4 block">
          <Button variant="ghost" fullWidth>
            Previous Polls
          </Button>
        </Link>
      </div>
    </div>
  );
}
