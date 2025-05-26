"use client";

import { Pill } from "@/components/ui/Pill";
import type { TabSwiperProps } from "@/lib/types";

export function TabSwiper<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  tabIndicators = {} as Record<T, boolean>,
}: TabSwiperProps<T>) {
  const handleTabChange = (tab: T) => {
    onTabChange(tab);
  };

  return (
    <div className="no-scrollbar -mx-6 overflow-x-auto bg-gray-0 py-2">
      <div className="flex gap-1 px-6">
        {tabs.map((tab) => (
          <div className="relative" key={tab.key}>
            <Pill
              checked={activeTab === tab.key}
              onClick={() => handleTabChange(tab.key as T)}
            >
              <span className="whitespace-nowrap">{tab.label}</span>
            </Pill>
            {tabIndicators[tab.key as T] && (
              <div className="absolute right-[9px] top-[9px] h-1.5 w-1.5 rounded-full bg-error-600"></div>
            )}
          </div>
        ))}
        <div className="w-5 flex-shrink-0" />
      </div>
    </div>
  );
}
