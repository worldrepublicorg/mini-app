import { Typography } from "@/components/ui/Typography";
import { BiLinkExternal } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import type { OpenLetterCardProps } from "@/lib/types";

export function OpenLetterCard({
  title,
  referenceTitle = "Reference",
  referenceUrl,
  voteUrl,
  isExternal = false,
}: OpenLetterCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isExternal) {
      window.open(voteUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push(voteUrl);
    }
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
          className="mb-1.5 line-clamp-3"
        >
          {title}
        </Typography>
        <div className="flex items-center gap-1">
          <div
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card's click handler
              if (referenceUrl) {
                window.open(referenceUrl, "_blank", "noopener,noreferrer");
              }
            }}
            className={`flex items-center gap-1 ${referenceUrl ? "cursor-pointer" : ""}`}
          >
            <Typography
              as="p"
              variant={{ variant: "body", level: 3 }}
              className="text-gray-500"
            >
              {referenceTitle}
            </Typography>
            {referenceUrl && (
              <BiLinkExternal className="size-[14px] text-gray-400" />
            )}
          </div>
        </div>
      </div>
      <div className="rounded-full bg-gray-100 p-1.5">
        {isExternal ? (
          <BiLinkExternal className="size-[14px] flex-shrink-0 text-gray-400" />
        ) : (
          <IoIosArrowForward className="size-[14px] flex-shrink-0 text-gray-400" />
        )}
      </div>
    </div>
  );
}
