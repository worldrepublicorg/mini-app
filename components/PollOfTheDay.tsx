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
      "Should a dedicated global healthcare aid reserve be established to protect maternal and child health during international aid freezes?",
    url: "https://vote.one/eTKCLYEa",
  },
  {
    description:
      "Should nations create a cooperative framework to manage shared water resources amid rising global water scarcity?",
    url: "https://vote.one/onq2P57s",
  },
  {
    description:
      "Is the international aviation infrastructure resilient enough to handle unexpected large-scale disruptions?",
    url: "https://vote.one/32Nn7JaS",
  },
  {
    description:
      "Should binding international agreements be established to secure nuclear facilities in conflict zones?",
    url: "https://vote.one/aW6o5p2u",
  },
  {
    description:
      "Do you support nations collaborating on a joint deep space mission to Mars?",
    url: "https://vote.one/KP9pMsfy",
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
        <Link href="/previous-polls" className="mt-2 block h-10">
          <Button variant="ghost" fullWidth>
            Previous Polls
          </Button>
        </Link>
      </div>
    </div>
  );
}
