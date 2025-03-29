"use client";

import { useEffect } from "react";

export function ClientPreference() {
  useEffect(() => {
    const preferredLanguage = localStorage.getItem("preferredLanguage");
    if (preferredLanguage) {
      // Add the preference to subsequent requests
      const meta = document.createElement("meta");
      meta.name = "x-preferred-language";
      meta.content = preferredLanguage;
      document.head.appendChild(meta);
    }
  }, []);

  return null;
}
