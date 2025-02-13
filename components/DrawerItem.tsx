"use client";

import { BiLinkExternal, BiPlus } from "react-icons/bi";
import { Drawer, DrawerTrigger } from "@/components/ui/Drawer/Drawer";
import { Typography } from "@/components/ui/Typography";
import { ComingSoonDrawer } from "@/components/ComingSoonDrawer";

interface DrawerItemProps {
  title: string;
  isAddNew?: boolean;
}

export function DrawerItem({ title, isAddNew = false }: DrawerItemProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div
          className={`flex items-center justify-between p-6 mt-4 ${
            isAddNew ? "border-dashed border-2" : "bg-gray-50"
          } rounded-lg cursor-pointer`}
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
            <BiPlus className="text-xl text-gray-300" />
          ) : (
            <BiLinkExternal className="text-xl text-gray-300" />
          )}
        </div>
      </DrawerTrigger>
      <ComingSoonDrawer />
    </Drawer>
  );
}
