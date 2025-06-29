"use client";

import { Typography } from "@/components/ui/Typography";
import { BiChevronLeft } from "react-icons/bi";
import Link from "next/link";
import ListItem from "@/components/ui/ListItem/ListItem";
import { useTranslations } from "@/hooks/useTranslations";
import { PiCheckCircleFill } from "react-icons/pi";

export default function LanguagePage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);

  const languages = [
    { code: "ar", label: "العربية - Arabic" },
    { code: "bn", label: "বাংলা - Bengali" },
    { code: "zh", label: "中文 - Chinese" },
    { code: "en", label: "English" },
    { code: "fil", label: "Filipino" },
    { code: "hi", label: "हिन्दी - Hindi" },
    { code: "hr", label: "Hrvatski - Croatian" },
    { code: "ja", label: "日本語 - Japanese" },
    { code: "ko", label: "한국어 - Korean" },
    { code: "ms", label: "Bahasa Melayu - Malay" },
    { code: "pt", label: "Português - Portuguese" },
    { code: "ru", label: "Русский - Russian" },
    { code: "es", label: "Español - Spanish" },
    { code: "id", label: "Bahasa Indonesia - Indonesian" },
    { code: "fr", label: "Français - French" },
    { code: "de", label: "Deutsch - German" },
    { code: "pl", label: "Polski - Polish" },
    { code: "ur", label: "اردو - Urdu" },
    { code: "sw", label: "Kiswahili - Swahili" },
    { code: "pcm", label: "Pidgin English - Pidgin English" },
    { code: "tl", label: "Tagalog - Tagalog" },
    { code: "tr", label: "Türkçe - Turkish" },
    { code: "th", label: "ภาษาไทย - Thai" },
  ].sort((a, b) => {
    // Extract the English name after the hyphen, or use the full label if no hyphen exists
    const aName = a.label.split(" - ")[1] || a.label;
    const bName = b.label.split(" - ")[1] || b.label;
    return aName.localeCompare(bName);
  });

  return (
    <div className="flex flex-col px-6 pb-20">
      <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-center bg-gray-0 px-6 py-6">
        <Link
          href={`/${lang}/menu`}
          className="absolute left-6 flex size-10 items-center justify-center rounded-full bg-gray-100"
        >
          <BiChevronLeft className="size-6 text-gray-500" />
        </Link>
        <Typography
          as="h2"
          variant={{ variant: "heading", level: 3 }}
          className="mx-12 text-center"
        >
          {dictionary?.pages?.language?.title}
        </Typography>
      </div>

      <div className="mt-[88px]">
        {languages.map((language) => (
          <Link
            key={language.code}
            href={`/${language.code}/menu`}
            onClick={() => {
              localStorage.setItem("preferredLanguage", language.code);
              document.cookie = `preferredLanguage=${language.code};path=/;max-age=${365 * 24 * 60 * 60}`;
            }}
            className="w-full"
          >
            <ListItem>
              <div className="flex h-8 w-full items-center justify-between">
                <Typography
                  as="span"
                  variant={{ variant: "subtitle", level: 2 }}
                  className={`${
                    lang === language.code ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {language.label}
                </Typography>
                {lang === language.code && (
                  <PiCheckCircleFill className="text-gray-600 size-5" />
                )}
              </div>
            </ListItem>
          </Link>
        ))}
      </div>
    </div>
  );
}
