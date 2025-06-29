import "server-only";

const dictionaries = {
  ar: () => import("./ar.json").then((module) => module.default),
  bn: () => import("./bn.json").then((module) => module.default),
  zh: () => import("./zh.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
  es: () => import("./es.json").then((module) => module.default),
  fil: () => import("./fil.json").then((module) => module.default),
  hi: () => import("./hi.json").then((module) => module.default),
  hr: () => import("./hr.json").then((module) => module.default),
  ja: () => import("./ja.json").then((module) => module.default),
  ko: () => import("./ko.json").then((module) => module.default),
  ms: () => import("./ms.json").then((module) => module.default),
  pt: () => import("./pt.json").then((module) => module.default),
  ru: () => import("./ru.json").then((module) => module.default),
  id: () => import("./id.json").then((module) => module.default),
  fr: () => import("./fr.json").then((module) => module.default),
  de: () => import("./de.json").then((module) => module.default),
  ur: () => import("./ur.json").then((module) => module.default),
  sw: () => import("./sw.json").then((module) => module.default),
  pcm: () => import("./pcm.json").then((module) => module.default),
  tl: () => import("./tl.json").then((module) => module.default),
  th: () => import("./th.json").then((module) => module.default),
  tr: () => import("./tr.json").then((module) => module.default),
  pl: () => import("./pl.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale as keyof typeof dictionaries]();
};
