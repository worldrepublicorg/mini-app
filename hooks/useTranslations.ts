"use client";

import { getClientDictionary } from "../lib/dictionary";
import { useEffect, useState } from "react";

export function useTranslations(lang: string) {
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    getClientDictionary(lang).then(setDictionary);
  }, [lang]);

  return dictionary;
}
