import { Typography } from "@/components/ui/Typography";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";

interface PollCardProps {
  description: string;
  url: string;
}

export function PollCard({ description, url }: PollCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(url)}
      className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 text-gray-900"
    >
      <Typography
        as="h3"
        variant={{ variant: "subtitle", level: 2 }}
        className="line-clamp-3"
      >
        {description}
      </Typography>
      <div className="ml-4 rounded-full bg-gray-100 p-1.5">
        <IoIosArrowForward className="size-[14px] flex-shrink-0 text-gray-400" />
      </div>
    </div>
  );
}
