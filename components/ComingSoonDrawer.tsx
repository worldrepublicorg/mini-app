import { Typography } from "@/components/ui/Typography";
import { DrawerContent } from "@/components/ui/Drawer";
import { PiHourglassHighFill } from "react-icons/pi";
import { useTranslations } from "@/hooks/useTranslations";

export const ComingSoonDrawer = ({ lang }: { lang: string }) => {
  const dictionary = useTranslations(lang);

  return (
    <DrawerContent>
      <div className="flex flex-col items-center px-6 pb-14 pt-10">
        <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <PiHourglassHighFill className="h-10 w-10 text-gray-400" />
        </div>
        <Typography as="h2" variant={{ variant: "heading", level: 1 }}>
          {dictionary?.components?.comingSoonDrawer?.title || "Coming soon"}
        </Typography>
        <Typography
          variant={{ variant: "subtitle", level: 1 }}
          className="mx-auto mt-4 text-center text-gray-500"
        >
          {dictionary?.components?.comingSoonDrawer?.description ||
            "This feature is currently in development. Stay tuned!"}
        </Typography>
      </div>
    </DrawerContent>
  );
};
