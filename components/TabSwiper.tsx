"use client";

import { Pill } from "@/components/ui/Pill";

interface TabSwiperProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  showSavingsIndicator?: boolean;
}

export function TabSwiper({
  tabs,
  activeTab,
  onTabChange,
  showSavingsIndicator = false,
}: TabSwiperProps) {
  return (
    <div className="no-scrollbar -mx-6 overflow-x-auto pb-4 pt-2">
      <div className="flex gap-1 px-6">
        {tabs.map((tab) => (
          <div className="relative" key={tab}>
            <Pill checked={activeTab === tab} onClick={() => onTabChange(tab)}>
              <span className="whitespace-nowrap">{tab}</span>
            </Pill>
            {tab === "Savings" && showSavingsIndicator && (
              <span className="absolute right-[10px] top-[9px] block h-1.5 w-1.5 rounded-full bg-error-800 opacity-65" />
            )}
          </div>
        ))}
        <div className="w-5 flex-shrink-0" />
      </div>
    </div>
  );
}
