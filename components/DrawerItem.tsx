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
          className={`flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 opacity-50 ${
            isAddNew && "border-2 border-dashed"
          }`}
        >
          <div className="flex items-center gap-2">
            <Typography
              as="h3"
              variant={{ variant: "subtitle", level: 2 }}
              className={`line-clamp-2 ${isAddNew ? "text-gray-400" : "text-gray-900"}`}
            >
              {title}
            </Typography>
          </div>
          {isAddNew ? (
            <BiPlus className="text-gray-300" />
          ) : (
            <div className="ml-4 rounded-full bg-gray-100 p-1.5">
              <IoIosArrowForward className="size-[14px] flex-shrink-0 text-gray-400" />
            </div>
          )}
        </div>
      </DrawerTrigger>
      <ComingSoonDrawer />
    </Drawer>
  );
}
