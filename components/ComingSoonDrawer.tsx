import { Typography } from "@/components/ui/Typography";
import { DrawerContent } from "@/components/ui/Drawer";
import { PiHourglassHighFill } from "react-icons/pi";

export const ComingSoonDrawer = () => {
  return (
    <DrawerContent>
      <div className="px-6 py-10 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-10">
          <PiHourglassHighFill className="w-10 h-10 text-gray-400" />
        </div>
        <Typography as="h2" variant={{ variant: "heading", level: 1 }}>
          Coming soon
        </Typography>
        <Typography
          variant={{ variant: "subtitle", level: 1 }}
          className="mt-4 text-gray-500 mx-auto text-center"
        >
          This feature is currently in development. Stay tuned!
        </Typography>
      </div>
    </DrawerContent>
  );
};
