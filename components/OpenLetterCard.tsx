import { Typography } from "@/components/ui/Typography";
import { BiLinkExternal } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";

interface OpenLetterCardProps {
  title: string;
  referenceTitle?: string;
  referenceUrl: string;
  voteUrl: string;
}

export function OpenLetterCard({
  title,
  referenceTitle = "Reference",
  referenceUrl,
  voteUrl,
}: OpenLetterCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(voteUrl)}
      className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 text-gray-900"
    >
      <div>
        <Typography
          as="h3"
          variant={{ variant: "subtitle", level: 2 }}
          className="mb-1.5 line-clamp-3"
        >
          {title}
        </Typography>
        <div className="w-max-24 flex items-center gap-1">
          <a
            className="w-max-24 flex items-center gap-1"
            href={referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              as="p"
              variant={{ variant: "body", level: 3 }}
              className="text-gray-500"
            >
              {referenceTitle}
            </Typography>
            <BiLinkExternal className="size-[14px] text-gray-400" />
          </a>
        </div>
      </div>
      <div className="rounded-full bg-gray-100 p-1.5">
        <IoIosArrowForward className="size-[14px] flex-shrink-0 text-gray-400" />
      </div>
    </div>
  );
}
