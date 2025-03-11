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
      "Do you believe that existing global measures effectively reduce the risk of nuclear proliferation?",
    url: "https://vote.one/TKV1ow4O",
  },
  {
    description:
      "Do you think that creating universal digital privacy standards is crucial for protecting individual rights in an increasingly interconnected world?",
    url: "https://vote.one/adRv9hK6",
  },
  {
    description:
      "Is the current global approach to climate resilience sufficient to cope with the increasing frequency of extreme weather events?",
    url: "https://vote.one/cg9zZaKR",
  },
  {
    description:
      "Do you think rapid realignments in global alliances will lead to a more secure international order?",
    url: "https://vote.one/yhYoEjF3",
  },
  {
    description:
      "Are current international cybersecurity measures sufficient to protect critical global infrastructures from escalating cyber threats?",
    url: "https://vote.one/trFBHaNi",
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
      </div>
    </div>
  );
}
