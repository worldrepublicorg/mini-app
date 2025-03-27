// This file is for client components
const dictionaries = {
  en: () =>
    import("@/app/[lang]/dictionaries/en.json").then(
      (module) => module.default
    ),
  es: () =>
    import("@/app/[lang]/dictionaries/es.json").then(
      (module) => module.default
    ),
};

export const getClientDictionary = async (locale: string) => {
  return dictionaries[locale as keyof typeof dictionaries]();
};
