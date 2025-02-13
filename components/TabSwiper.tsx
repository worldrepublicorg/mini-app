"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { useEffect, useState } from "react";
import { Pill } from "@/components/ui/Pill";

interface TabSwiperProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabSwiper({ tabs, activeTab, onTabChange }: TabSwiperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="-mx-6">
      <div className="w-full overflow-hidden">
        <Swiper
          spaceBetween={6}
          slidesPerView="auto"
          freeMode={true}
          watchOverflow={true}
          slidesOffsetBefore={24}
          slidesOffsetAfter={24}
          modules={[FreeMode]}
          className="my-2"
        >
          {tabs.map((tab) => (
            <SwiperSlide
              key={tab}
              style={{ width: "fit-content" }}
              className="mt-2 mb-4"
            >
              <Pill
                checked={activeTab === tab}
                onClick={() => onTabChange(tab)}
              >
                {tab}
              </Pill>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
