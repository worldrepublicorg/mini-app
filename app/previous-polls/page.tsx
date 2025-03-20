"use client";

import Link from "next/link";
import { BiChevronLeft } from "react-icons/bi";
import { Typography } from "@/components/ui/Typography";
import { PollCard } from "@/components/PollCard";

const historicalPolls = [
  {
    description:
      "Do you think the current global economic trends signal a risk of a synchronized recession among major economies?",
    url: "https://vote.one/VvJjBSkY",
  },
  {
    description:
      "Should all conflict zones with civilian humanitarian crises automatically trigger internationally coordinated aid corridors?",
    url: "https://vote.one/l3Yu6hMi",
  },
  {
    description:
      "Do you support global policy frameworks that balance national sovereignty with coordinated responses to shared challenges?",
    url: "https://vote.one/67a0Lnei",
  },
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
  {
    description:
      "Do you agree that space-faring nations and corporations should be legally required to remove defunct satellites to reduce orbital debris?",
    url: "https://vote.one/4pPCTP6p",
  },
  {
    description:
      "Do you think that creating universal digital privacy standards is crucial for protecting individual rights in an increasingly interconnected world?",
    url: "https://vote.one/adRv9hK6",
  },
  {
    description:
      "Do you believe that existing global measures effectively reduce the risk of nuclear proliferation?",
    url: "https://vote.one/TKV1ow4O",
  },
  {
    description:
      "Are current international cybersecurity measures sufficient to protect critical global infrastructures from escalating cyber threats?",
    url: "https://vote.one/trFBHaNi",
  },
  {
    description:
      "Do you think rapid realignments in global alliances will lead to a more secure international order?",
    url: "https://vote.one/yhYoEjF3",
  },
  {
    description:
      "Is the current global approach to climate resilience sufficient to cope with the increasing frequency of extreme weather events?",
    url: "https://vote.one/cg9zZaKR",
  },
  {
    description:
      "Do you think the growing trend of imposing tariffs among major economies will significantly disrupt global trade stability?",
    url: "https://vote.one/HitgAQBM",
  },
  {
    description:
      "Are you confident in the world's ability to prevent and manage emerging infectious diseases?",
    url: "https://vote.one/tbCLGUgE",
  },
  {
    description:
      "Should binding international regulations be established to govern the ethical development of artificial intelligence?",
    url: "https://vote.one/4PjcWqwV",
  },
  {
    description:
      "Should there be mandatory international agreements to limit space debris from satellites and rockets?",
    url: "https://vote.one/Eh0iIrW5",
  },
  {
    description:
      "Do you believe sustained diplomatic dialogue among world leaders can help reduce global tensions?",
    url: "https://vote.one/179i7c78",
  },
  {
    description:
      "Should wealthy countries accept more migrants fleeing conflict or climate disasters?",
    url: "https://vote.one/SJSETLZp",
  },
  {
    description:
      "Should international collaboration on rare earth minerals be prioritized to enhance global resource security?",
    url: "https://vote.one/5StpP7UU",
  },
  {
    description:
      "Should global authorities establish uniform standards to regulate cryptocurrencies and curb financial crimes?",
    url: "https://vote.one/0bTVLGAB",
  },
  {
    description:
      "Do you think global measures should be implemented to counter the spread of disinformation online?",
    url: "https://vote.one/rw4L36NM",
  },
  {
    description:
      "Should countries be required to share real-time data during disease outbreaks to prevent global health crises?",
    url: "https://vote.one/OZ2T4A53",
  },
  {
    description:
      "Should countries with advanced military capabilities intervene to de-escalate conflicts in regions experiencing sudden outbreaks of war?",
    url: "https://vote.one/GrS25I8Y",
  },
  {
    description:
      "Should governments prioritize regulating artificial intelligence (AI) development to prevent misuse, even if it slows innovation?",
    url: "https://vote.one/6xsTYiEV",
  },
  {
    description:
      "Do you believe that governments worldwide should increase funding for space monitoring and asteroid deflection research?",
    url: "https://vote.one/IS9azLpr",
  },
  {
    description:
      "Should major powers negotiating peace agreements be required to include countries directly affected by the conflict?",
    url: "https://vote.one/1mK1Ko1v",
  },
  {
    description:
      "Should the United States maintain its 'strategic ambiguity' policy on Taiwan to avoid escalating tensions with China?",
    url: "https://vote.one/ZbuHndkQ",
  },
];

export default function PreviousPollsPage() {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-20">
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6">
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
      </div>

      <div className="mt-24">
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
