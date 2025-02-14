import { Typography } from "@/components/ui/Typography";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";

interface PollCardProps {
  title: string;
  description: string;
  url: string;
}

export function PollCard({ title, description, url }: PollCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(url)}
      className="mb-4 flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-gray-900"
    >
      <div>
        <Typography
          as="h3"
          variant={{ variant: "subtitle", level: 2 }}
          className="mb-2 line-clamp-3"
        >
          {title}
        </Typography>
        <Typography
          as="p"
          variant={{ variant: "body", level: 3 }}
          className="line-clamp-3 text-gray-500"
        >
          {description}
        </Typography>
      </div>
      <div className="rounded-full bg-gray-100 p-1.5 ml-2">
        <IoIosArrowForward className="size-[14px] flex-shrink-0 text-gray-400" />
      </div>
    </div>
  );
}
