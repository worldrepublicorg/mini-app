"use client";

import Link from "next/link";
import { BiChevronLeft } from "react-icons/bi";
import { Typography } from "@/components/ui/Typography";
import { PollCard } from "@/components/PollCard";

const historicalPolls = [
  {
    description:
      "Should countries experiencing extreme weather disasters (e.g., wildfires, floods) receive prioritized financial aid from a global climate fund?",
    url: "https://vote.one/MTHSApYb",
  },
  {
    description:
      "Should global AI developers be required to pause training models more powerful than current systems until international safety agreements are established?",
    url: "https://vote.one/HUuPPFOS",
  },
  {
    description:
      "Should corporations operating in multiple countries be subject to a unified global minimum tax rate to reduce inequality?",
    url: "https://vote.one/3FhzXHRG",
  },
];

export default function PreviousPollsPage() {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-20">
      <div className="relative flex items-center justify-center py-6">
        <Link
          href="/govern"
          className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
        >
          <BiChevronLeft className="size-6 text-gray-500" />
        </Link>
        <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
          Previous Polls
        </Typography>
      </div>

      <div className="mt-4">
        <div>
          {historicalPolls.map((poll, index) => (
            <PollCard
              key={`all-${index}`}
              description={poll.description}
              voteUrl={poll.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
