"use client";

import { BiLinkExternal, BiPlus } from "react-icons/bi";
import { Drawer, DrawerTrigger } from "@/components/ui/Drawer/Drawer";
import { Typography } from "@/components/ui/Typography";
import { ComingSoonDrawer } from "@/components/ComingSoonDrawer";
import { IoIosArrowForward } from "react-icons/io";

interface DrawerItemProps {
  title: string;
  isAddNew?: boolean;
}

export function DrawerItem({ title, isAddNew = false }: DrawerItemProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div
          className={`flex items-center justify-between p-4 mt-4 min-h-16 ${
            isAddNew ? "border-dashed border" : "bg-gray-50"
          } rounded-xl cursor-pointer`}
        >
          <div className="flex items-center gap-2">
            <Typography
              as="h3"
              variant={{ variant: "subtitle", level: 2 }}
              className="line-clamp-2 text-gray-400"
            >
              {title}
            </Typography>
          </div>
          {isAddNew ? (
            <BiPlus className="text-gray-300" />
          ) : (
            <IoIosArrowForward className="text-gray-300 flex-shrink-0" />
          )}
        </div>
      </DrawerTrigger>
      <ComingSoonDrawer />
    </Drawer>
  );
}
