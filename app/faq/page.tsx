"use client";

import { useState } from "react";
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
    question: "What is the purpose of the app?",
    answer:
      "The World Republic app serves as an open, democratic platform dedicated to solving humanity's most pressing global challenges. It provides infrastructure and tools for global democratic decision-making on issues like AI risks, climate change, and biosecurity that transcend national borders. The app utilizes its own digital currency (WDD) to support initiatives and enable democratic participation in global governance.",
  },
  {
    id: "basic-income",
    question: "What is Basic Income?",
    answer:
      "Basic Income is a daily subsidy of 10 WDD (world drachma) provided to all citizens of the World Republic. It accumulates in real-time and can be claimed at any moment through the app.",
  },
  {
    id: "basic-income-plus",
    question: "How do I activate Basic Income Plus?",
    answer:
      "Basic Income Plus provides an additional 1 WDD per day and is available exclusively to Orb-verified users. After activating Basic Income, you'll see an option to activate Basic Income Plus on the Earn page.",
  },
  {
    id: "savings",
    question: "How does the Savings Account work?",
    answer:
      "The Savings Account allows you to deposit WDD tokens and earn a 69% annual interest rate.",
  },
  {
    id: "top-wallets",
    question: "Who controls the biggest accounts?",
    answer:
      "The three largest accounts are currently controlled by the project's founder, with all rights to be transferred to the community after constitution ratification. Constituent Assembly elections will be held in Q2 2024.",
  },
  {
    id: "referral-codes",
    question: "When will referral codes be active?",
    answer:
      "Referral codes will be active by mid-March, likely this week. Existing users will be able to retroactively reward those who invited them. Watch for the official announcement with complete details.",
  },
  {
    id: "vote-requirements",
    question: "What will be the requirements to propose votes?",
    answer:
      "The current polls are just a showcase. Our community will collectively decide on governance requirements through the constitutional process led by the Constituent Assembly that will be elected in Q2 2024.",
  },
];

export default function FAQPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

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

      <div className="mt-2 space-y-0">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="overflow-hidden">
            <button
              className="flex w-full items-center justify-between p-4 text-left focus:outline-none"
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
              <div className="px-4 pb-4">
                <Typography
                  as="p"
                  variant={{ variant: "body", level: 2 }}
                  className="text-gray-600"
                >
                  {faq.answer}
                </Typography>
              </div>
            </div>

            {index < faqs.length - 1 && (
              <div className="mx-4 h-px bg-gray-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
