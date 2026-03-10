"use client";

import { Pill } from "@/components/ui/Pill";
import type { TabSwiperProps } from "@/lib/types";

export function TabSwiper<T extends string>({
  tabs,
  activeTab,
  onTabChange,
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
          </div>
        ))}
        <div className="w-5 flex-shrink-0" />
      </div>
    </div>
  );
}
