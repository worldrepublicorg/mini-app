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
    key: "quakeCodes",
    url: "https://vote.one/soAE4aHn",
  },
  {
    key: "foodSecurity",
    url: "https://vote.one/GRi1NYOX",
  },
  {
    key: "aiWatermarking",
    url: "https://vote.one/Jbra7uUp",
  },
  {
    key: "disasterRelief",
    url: "https://vote.one/kKlY77pD",
  },
  {
    key: "techTransparency",
    url: "https://vote.one/aOXsaVpq",
  },
];

interface PollOfTheDayProps {
  lang: string;
}

export function PollOfTheDay({ lang }: PollOfTheDayProps) {
  const dictionary = useTranslations(lang);

  const getPollIndex = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const referenceDate = new Date(2023, 0, 1); // Local midnight Jan 1, 2023
    const dayDiff = Math.floor(
      (today.getTime() - referenceDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.abs(dayDiff % polls.length);
  };

  const [pollIndex, setPollIndex] = useState(getPollIndex());

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const msUntilTomorrow = tomorrow.getTime() - now.getTime();

    setPollIndex(getPollIndex());

    const timer = setTimeout(() => {
      setPollIndex(getPollIndex());
    }, msUntilTomorrow);

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
            {dictionary?.components?.pollOfTheDay?.vote}
          </Button>
        </a>
        <Link
          href={`/${lang}/previous-polls`}
          className="mt-2 block h-10 w-full"
        >
          <Button variant="ghost" fullWidth>
            {dictionary?.components?.pollOfTheDay?.previousPolls}
          </Button>
        </Link>
      </div>
    </div>
  );
}
