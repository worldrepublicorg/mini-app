import { Typography } from "@/components/ui/Typography";
import { ListItem } from "@/components/ui/ListItem/ListItem";
import { BiLinkExternal } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";

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
  return (
    <a href={voteUrl}>
      <ListItem variant="outline">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <Typography
              as="h3"
              variant={{ variant: "subtitle", level: 2 }}
              className="line-clamp-3"
            >
              {title}
            </Typography>
            <div className="flex items-center gap-1 w-max-24">
              <a
                className="flex items-center gap-1 w-max-24"
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
                <BiLinkExternal className="size-[14px] mb-0.5 text-gray-400" />
              </a>
            </div>
          </div>
          <div className="rounded-full bg-gray-100 p-1.5">
            <IoIosArrowForward className="size-[14px] text-gray-400 flex-shrink-0" />
          </div>
        </div>
      </ListItem>
    </a>
  );
}
