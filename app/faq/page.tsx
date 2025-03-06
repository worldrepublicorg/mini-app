"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { BiChevronLeft } from "react-icons/bi";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

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
      "The World Republic is an open, democratic organization dedicated to solving humanity's most pressing global challenges. It provides infrastructure and tools for democratic global decision-making on issues that transcend national borders, like AI risks, climate change, or biosecurity. This mini app serves as the World Republic's main online platform, using its digital currency (WDD) to support initiatives and enable democratic participation in global governance.",
  },
  {
    id: "basic-income",
    question: "What is Basic Income?",
    answer:
      "Our Basic Income is a daily subsidy of 8 WDD (world drachma) that is provided to all citizens of the World Republic. It accumulates in real-time and can be claimed at any moment through the app.",
  },
  {
    id: "basic-income-plus",
    question: "How do I activate Basic Income Plus?",
    answer:
      "Basic Income Plus provides an additional 3 WDD per day and is available exclusively to Orb-verified users. After activating Basic Income, you'll see an option to activate Basic Income Plus on the Earn page.",
  },
  {
    id: "savings",
    question: "How does the Savings Account work?",
    answer:
      "The Savings Account allows you to deposit WDD tokens and earn a 69% annual interest. Through constant reinvestment of earned interest, users can achieve effective returns close to 100% annually, maximizing their WDD growth over time. Interest accumulates continuously and can be withdrawn or reinvested at any time.",
  },
  {
    id: "drachma-value",
    question: "Where does the drachma get its value?",
    answer:
      "The drachma derives its value from being the official currency of the World Republic. As our democratic global governance platform grows, WDD has the potential to become a significant medium of exchange for international cooperation, and could eventually play a role in the equitable distribution of benefits from technological advancements and global resources.",
  },
  {
    id: "top-wallets",
    question: "Who controls the biggest accounts?",
    answer:
      "The three largest accounts are the World Republic Treasury, the Basic Income Fund, and the Basic Income Plus Fund. Currently, these are controlled by the project's founder, but control will be transferred to the community after our constitution is ratified. Elections for the Constituent Assembly, which will oversee this process, will take place in Q2 2025.",
  },
  {
    id: "referral-codes",
    question: "When will referral codes be active?",
    answer:
      "Referral codes will likely be active this week, and no later than mid-March. Existing users will be able to retroactively reward those who invited them. Watch for the official announcement with complete details.",
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
  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("faqVisited", "true");
    }
  }, []);

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
                  {faq.answer}
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
