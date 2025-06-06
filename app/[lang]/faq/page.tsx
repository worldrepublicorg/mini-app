"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { BiChevronLeft, BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import { useRouter } from "next/navigation";
import type { FAQItem } from "@/lib/types";

export default function FAQPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const dictionary = useTranslations(lang);
  const router = useRouter();
  const faqs: FAQItem[] = [
    {
      id: "app-purpose",
      question: dictionary?.pages?.faq?.items?.appPurpose?.question,
      answer: dictionary?.pages?.faq?.items?.appPurpose?.answer,
    },
    {
      id: "basic-income",
      question: dictionary?.pages?.faq?.items?.basicIncome?.question,
      answer: dictionary?.pages?.faq?.items?.basicIncome?.answer,
    },
    {
      id: "basic-income-plus",
      question: dictionary?.pages?.faq?.items?.basicIncomePlus?.question,
      answer: dictionary?.pages?.faq?.items?.basicIncomePlus?.answer,
    },
    {
      id: "savings",
      question: dictionary?.pages?.faq?.items?.savings?.question,
      answer: dictionary?.pages?.faq?.items?.savings?.answer,
    },
    {
      id: "referral-codes",
      question: dictionary?.pages?.faq?.items?.referralCodes?.question,
      answer: dictionary?.pages?.faq?.items?.referralCodes?.answer,
    },
    {
      id: "drachma-value",
      question: dictionary?.pages?.faq?.items?.drachmaValue?.question,
      answer: dictionary?.pages?.faq?.items?.drachmaValue?.answer,
    },
    {
      id: "top-wallets",
      question: dictionary?.pages?.faq?.items?.topWallets?.question,
      answer: dictionary?.pages?.faq?.items?.topWallets?.answer,
    },
    {
      id: "vote-requirements",
      question: dictionary?.pages?.faq?.items?.voteRequirements?.question,
      answer: dictionary?.pages?.faq?.items?.voteRequirements?.answer,
    },
  ];

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
        <button
          onClick={() => router.back()}
          className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
          aria-label="Back"
        >
          <BiChevronLeft className="size-6 text-gray-500" />
        </button>
        <Typography
          as="h2"
          variant={{ variant: "heading", level: 3 }}
          className="mx-12 text-center"
        >
          {dictionary?.pages?.faq?.title}
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
