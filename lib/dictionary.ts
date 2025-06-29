// This file is for client components
const dictionaries = {
  ar: () =>
    import("@/app/[lang]/dictionaries/ar.json").then(
      (module) => module.default
    ),
  bn: () =>
    import("@/app/[lang]/dictionaries/bn.json").then(
      (module) => module.default
    ),
  zh: () =>
    import("@/app/[lang]/dictionaries/zh.json").then(
      (module) => module.default
    ),
  en: () =>
    import("@/app/[lang]/dictionaries/en.json").then(
      (module) => module.default
    ),
  es: () =>
    import("@/app/[lang]/dictionaries/es.json").then(
      (module) => module.default
    ),
  fil: () =>
    import("@/app/[lang]/dictionaries/fil.json").then(
      (module) => module.default
    ),
  hi: () =>
    import("@/app/[lang]/dictionaries/hi.json").then(
      (module) => module.default
    ),
  hr: () =>
    import("@/app/[lang]/dictionaries/hr.json").then(
      (module) => module.default
    ),
  ja: () =>
    import("@/app/[lang]/dictionaries/ja.json").then(
      (module) => module.default
    ),
  ko: () =>
    import("@/app/[lang]/dictionaries/ko.json").then(
      (module) => module.default
    ),
  ms: () =>
    import("@/app/[lang]/dictionaries/ms.json").then(
      (module) => module.default
    ),
  pt: () =>
    import("@/app/[lang]/dictionaries/pt.json").then(
      (module) => module.default
    ),
  ru: () =>
    import("@/app/[lang]/dictionaries/ru.json").then(
      (module) => module.default
    ),
  id: () =>
    import("@/app/[lang]/dictionaries/id.json").then(
      (module) => module.default
    ),
  fr: () =>
    import("@/app/[lang]/dictionaries/fr.json").then(
      (module) => module.default
    ),
  de: () =>
    import("@/app/[lang]/dictionaries/de.json").then(
      (module) => module.default
    ),
  pl: () =>
    import("@/app/[lang]/dictionaries/pl.json").then(
      (module) => module.default
    ),
  ur: () =>
    import("@/app/[lang]/dictionaries/ur.json").then(
      (module) => module.default
    ),
  sw: () =>
    import("@/app/[lang]/dictionaries/sw.json").then(
      (module) => module.default
    ),
  pcm: () =>
    import("@/app/[lang]/dictionaries/pcm.json").then(
      (module) => module.default
    ),
  tl: () =>
    import("@/app/[lang]/dictionaries/tl.json").then(
      (module) => module.default
    ),
  tr: () =>
    import("@/app/[lang]/dictionaries/tr.json").then(
      (module) => module.default
    ),
  th: () =>
    import("@/app/[lang]/dictionaries/th.json").then(
      (module) => module.default
    ),
};
export const getClientDictionary = async (locale: string) => {
  return dictionaries[locale as keyof typeof dictionaries]();
};
