"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { BiChevronLeft } from "react-icons/bi";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useSearchParams } from "next/navigation";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    id: "app-purpose",
    question: "What is the World Republic?",
    answer:
      "The World Republic is an open, democratic organization dedicated to solving humanity's most pressing global challenges. It provides a framework for collective decision-making on issues that can only be effectively addressed at a global scale, like AI risks, climate change, or biosecurity.",
  },
  {
    id: "basic-income",
    question: "What is Basic Income?",
    answer:
      "Our Basic Income is a daily subsidy of 1 WDD (world drachma) that is provided to all citizens of the World Republic. It accumulates in real-time and can be claimed at any moment through the app.",
  },
  {
    id: "basic-income-plus",
    question: "How do I activate Basic Income Plus?",
    answer:
      "Basic Income Plus provides an additional 10 WDD per day and is available exclusively to Orb-verified users. After activating Basic Income, you'll see an option to activate Basic Income Plus on the Earn page.",
  },
  {
    id: "savings",
    question: "How does the Savings Account work?",
    answer:
      "The Savings Account allows you to deposit WDD tokens and earn a 69% annual interest. Through constant reinvestment of earned interest, users can achieve effective returns close to 100% annually, maximizing their WDD growth over time. Interest accumulates continuously and can be withdrawn or reinvested at any time.",
  },
  {
    id: "referral-codes",
    question: "How do referral codes work?",
    answer:
      "As a World Republic citizen, you can earn rewards through our referral program. Share your unique referral link with friends, and you'll receive 50 WDD for each person who joins and activates Basic Income Plus. Haven't received your reward? Your friend may need to manually trigger it by selecting the 'Reward Referrer' option in their referral section.",
  },
  {
    id: "drachma-value",
    question: "Where does the drachma get its value?",
    answer:
      "The drachma derives its value from being the official currency of the World Republic. As our democratic global governance platform grows, WDD has the potential to become a significant medium of exchange in the world economy, and could eventually play a role in the equitable distribution of benefits from technological advancements and global resources.",
  },
  {
    id: "top-wallets",
    question: "Who controls the biggest accounts?",
    answer:
      "The three largest accounts are the <a href='https://worldscan.org/address/0xa3C2c8CE6Be1C55401b5F1EfB6112A86F6374429' target='_blank' rel='noopener noreferrer' class='underline'>World Republic Treasury</a>, the <a href='https://worldscan.org/address/0x02c3B99D986ef1612bAC63d4004fa79714D00012' target='_blank' rel='noopener noreferrer' class='underline'>Basic Income Fund</a>, and the <a href='https://worldscan.org/address/0x52DFEe61180A0BCEBe007E5a9Cfd466948aCCA46' target='_blank' rel='noopener noreferrer' class='underline'>Basic Income Plus Fund</a>. Currently, these are controlled by the project's founder, but control will be transferred to the community after our constitution is ratified. Other key addresses include the <a href='https://worldscan.org/address/0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7' target='_blank' rel='noopener noreferrer' class='underline'>Savings Account contract</a>, the <a href='https://worldscan.org/address/0x372dCA057682994568be074E75a03Ced3dD9E60d' target='_blank' rel='noopener noreferrer' class='underline'>Referral Rewards distributor</a>, and liquidity pools: <a href='https://worldscan.org/address/0xaaEF72194E42aF8f641e90c3e48a7F01e9547097' target='_blank' rel='noopener noreferrer' class='underline'>WLD/WDD</a>, <a href='https://worldscan.org/address/0x24Cda46262Ee6b777416997c52FE140A0B3f6FeA' target='_blank' rel='noopener noreferrer' class='underline'>USDC/WDD</a>, and <a href='https://worldscan.org/address/0x3226d525Bb0EA2346D512215ca8df7d81801786E' target='_blank' rel='noopener noreferrer' class='underline'>ETH/WDD</a>.",
  },
  {
    id: "vote-requirements",
    question: "What are the requirements to propose votes?",
    answer:
      "The current polls and open letters are just a showcase. Our community will collectively decide our system of governance through the constitutional design process led by the Constituent Assembly elected in Q2 2025.",
  },
];

export default function FAQPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const questionId = searchParams.get("q");
    if (questionId) {
      setOpenAccordion(questionId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("faqVisited", "true");
    }
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="flex min-h-screen flex-col px-6 pb-20">
      <div className="relative flex items-center justify-center py-6">
        <Link
          href="/menu"
          className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
        >
          <BiChevronLeft className="size-6 text-gray-500" />
        </Link>
        <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
          FAQ
        </Typography>
      </div>

      <div className="mt-2">
        {faqs.map((faq, index) => (
          <div key={faq.id}>
            <button
              className="flex w-full items-center justify-between py-5 text-left focus:outline-none"
              onClick={() => toggleAccordion(faq.id)}
            >
              <Typography
                as="span"
                variant={{ variant: "subtitle", level: 2 }}
                className="text-gray-900"
              >
                {faq.question}
              </Typography>
              <div className="flex size-6 items-center justify-center rounded-full bg-gray-100">
                {openAccordion === faq.id ? (
                  <BiChevronUp className="size-5 text-gray-500 transition-transform duration-200" />
                ) : (
                  <BiChevronDown className="size-5 text-gray-500 transition-transform duration-200" />
                )}
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                openAccordion === faq.id ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="pb-4">
                <Typography
                  as="p"
                  variant={{ variant: "body", level: 2 }}
                  className="text-gray-600"
                >
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </Typography>
              </div>
            </div>

            {index < faqs.length - 1 && <div className="h-px bg-gray-100" />}
          </div>
        ))}
      </div>
    </div>
  );
}
