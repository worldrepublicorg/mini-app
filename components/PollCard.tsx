import { Typography } from "@/components/ui/Typography";
import { BiLinkExternal } from "react-icons/bi";
import { useTranslations } from "@/hooks/useTranslations";

interface PollCardProps {
  lang: string;
  description: string;
  voteUrl: string;
}

export function PollCard({ lang, description, voteUrl }: PollCardProps) {
  const dictionary = useTranslations(lang);

  const handleCardClick = () => {
    window.open(voteUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleCardClick}
      className="mb-4 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 text-gray-900"
    >
      <div>
        <Typography
          as="h3"
          variant={{ variant: "subtitle", level: 2 }}
          className="line-clamp-3"
        >
          {description}
        </Typography>
      </div>
      <div className="rounded-full bg-gray-100 p-1.5">
        <BiLinkExternal className="size-[14px] flex-shrink-0 text-gray-400" />
      </div>
    </div>
  );
}
