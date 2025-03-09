"use client";

import { Pill } from "@/components/ui/Pill";

interface TabSwiperProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabIndicators?: Record<string, boolean>;
}

export function TabSwiper({
  tabs,
  activeTab,
  onTabChange,
  tabIndicators = {},
}: TabSwiperProps) {
  return (
    <div className="no-scrollbar -mx-6 overflow-x-auto bg-gray-0 py-2">
      <div className="flex gap-1 px-6">
        {tabs.map((tab) => (
          <div className="relative" key={tab}>
            <Pill checked={activeTab === tab} onClick={() => onTabChange(tab)}>
              <span className="whitespace-nowrap">{tab}</span>
            </Pill>
            {tabIndicators[tab] && (
              <div className="absolute right-[9px] top-[9px] h-1.5 w-1.5 rounded-full bg-error-800 opacity-65"></div>
            )}
          </div>
        ))}
        <div className="w-5 flex-shrink-0" />
      </div>
    </div>
  );
}
