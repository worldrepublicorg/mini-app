"use client";

import { Typography } from "@/components/ui/Typography";

interface SectionHeaderProps {
  title: string;
  description: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-10 mt-4 text-center">
      <Typography as="h1" variant={{ variant: "heading", level: 1 }}>
        {title}
      </Typography>
      <Typography
        variant={{ variant: "subtitle", level: 1 }}
        className="text-gray-500 max-w-2xl mx-auto mt-4"
      >
        {description}
      </Typography>
    </div>
  );
}
