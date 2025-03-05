"use client";

import { Pill } from "@/components/ui/Pill";

interface TabSwiperProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabSwiper({ tabs, activeTab, onTabChange }: TabSwiperProps) {
  return (
    <div className="no-scrollbar -mx-6 overflow-x-auto pb-4 pt-2">
      <div className="flex gap-1 px-6">
        {tabs.map((tab) => (
          <div className="relative" key={tab}>
            <Pill checked={activeTab === tab} onClick={() => onTabChange(tab)}>
              <span className="whitespace-nowrap">{tab}</span>
            </Pill>
          </div>
        ))}
        <div className="w-5 flex-shrink-0" />
      </div>
    </div>
  );
}
