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
    { code: "ar", label: "العربية" },
    { code: "bn", label: "বাংলা" },
    { code: "zh", label: "中文" },
    { code: "en", label: "English" },
    { code: "fil", label: "Filipino" },
    { code: "hi", label: "हिन्दी" },
    { code: "hr", label: "Hrvatski" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
    { code: "ms", label: "Bahasa Melayu" },
    { code: "pt", label: "Português" },
    { code: "ru", label: "Русский" },
    { code: "es", label: "Español" },
  ].sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
  );

  return (
    <div className="flex flex-col px-6 pb-20">
      <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-center bg-gray-0 px-6 py-6">
        <Link
          href={`/${lang}/menu`}
          className="absolute left-6 flex size-10 items-center justify-center rounded-full bg-gray-100"
        >
          <BiChevronLeft className="size-6 text-gray-500" />
        </Link>
        <Typography as="h2" variant={{ variant: "heading", level: 3 }}>
          {dictionary?.pages?.language?.title ?? "Language"}
        </Typography>
      </div>

      <div className="mt-[88px]">
        {languages.map((language) => (
          <Link
            key={language.code}
            href={`/${language.code}/language`}
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
