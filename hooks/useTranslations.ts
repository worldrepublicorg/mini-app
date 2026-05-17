"use client";

import { useEffect, useState } from "react";
import { getClientDictionary } from "../lib/dictionary";

export function useTranslations(lang: string) {
	const [dictionary, setDictionary] = useState<any>(null);

	useEffect(() => {
		getClientDictionary(lang).then(setDictionary);
	}, [lang]);

	return dictionary;
}
