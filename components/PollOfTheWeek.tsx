import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "./ui/Typography";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

interface Poll {
  key: string;
  url: string;
}

const polls: Poll[] = [
  {
    key: "digitalGovernance",
    url: "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/6OV7dcto",
  },
  {
    key: "nuclearDisarmamentTalks",
    url: "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/gV4RQAsj",
  },
  {
    key: "cyberResilienceProtocol",
    url: "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/2QOSYgip",
  },
  {
    key: "middleEastEscalation",
    url: "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/RKrASNCV",
  },
  {
    key: "nuclearEscalationRisk",
    url: "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/jRxpCulS",
  },
];

interface PollOfTheWeekProps {
  lang: string;
}

export function PollOfTheWeek({ lang }: PollOfTheWeekProps) {
  const dictionary = useTranslations(lang);

  const getPollIndex = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const referenceDate = new Date(2023, 0, 1); // Local midnight Jan 1, 2023
    const dayDiff = Math.floor(
      (today.getTime() - referenceDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    const weekDiff = Math.floor(dayDiff / 7);
    return Math.abs(weekDiff % polls.length);
  };

  const [pollIndex, setPollIndex] = useState(getPollIndex());

  useEffect(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysUntilNextMonday = currentDay === 0 ? 1 : 8 - currentDay;
    const nextMonday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilNextMonday
    );
    nextMonday.setHours(0, 0, 0, 0);
    const msUntilNextWeek = nextMonday.getTime() - now.getTime();

    setPollIndex(getPollIndex());

    const timer = setTimeout(() => {
      setPollIndex(getPollIndex());
    }, msUntilNextWeek);

    return () => clearTimeout(timer);
  }, []);

  if (!dictionary) {
    return null;
  }

  const currentPoll = polls[pollIndex];

  return (
    <div className="flex w-full flex-col justify-center">
      <div className="w-full">
        <Typography
          as="h3"
          variant={{ variant: "heading", level: 2 }}
          className="mb-10 text-center"
        >
          {
            dictionary?.pages?.govern?.sections?.polls?.previous?.polls?.[
              currentPoll.key
            ]
          }
        </Typography>
        <a href={currentPoll.url} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" fullWidth>
            {dictionary?.components?.pollOfTheWeek?.vote}
          </Button>
        </a>
        <Link
          href={`/${lang}/previous-polls`}
          className="mt-2 block h-10 w-full"
        >
          <Button variant="ghost" fullWidth>
            {dictionary?.components?.pollOfTheWeek?.previousPolls}
          </Button>
        </Link>
      </div>
    </div>
  );
}
