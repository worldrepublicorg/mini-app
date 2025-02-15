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
        className="mx-auto mt-4 max-w-2xl text-gray-500"
      >
        {description}
      </Typography>
    </div>
  );
}
