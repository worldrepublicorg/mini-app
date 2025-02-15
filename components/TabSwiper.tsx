"use client";

import { useEffect, useRef, useState } from "react";
import { Pill } from "@/components/ui/Pill";

interface TabSwiperProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabSwiper({ tabs, activeTab, onTabChange }: TabSwiperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isScrollingRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && containerRef.current && tabRefs.current[activeTab]) {
      const container = containerRef.current;
      const activeTabElement = tabRefs.current[activeTab];

      if (activeTabElement && !isScrollingRef.current) {
        isScrollingRef.current = true;

        const containerWidth = container.offsetWidth;
        const tabOffset = activeTabElement.offsetLeft;
        const tabWidth = activeTabElement.offsetWidth;
        const currentScroll = container.scrollLeft;

        // Calculate the target scroll position
        const targetScroll = tabOffset - containerWidth / 2 + tabWidth / 2;

        // Ensure we don't scroll past the bounds
        const maxScroll = container.scrollWidth - containerWidth;
        const boundedTarget = Math.max(0, Math.min(targetScroll, maxScroll));

        // Smooth scroll with better easing
        const startTime = performance.now();
        const duration = 100; // milliseconds

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function (easeOutCubic)
          const easing =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          const currentPosition =
            currentScroll + (boundedTarget - currentScroll) * easing;
          container.scrollLeft = currentPosition;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            isScrollingRef.current = false;
          }
        };

        requestAnimationFrame(animate);
      }
    }
  }, [activeTab, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="-mx-6">
      <div
        ref={containerRef}
        className="no-scrollbar w-full overflow-x-auto scroll-smooth"
      >
        <div className="flex gap-2 whitespace-nowrap px-6 py-1">
          {tabs.map((tab) => (
            <div
              key={tab}
              ref={(el) => {
                tabRefs.current[tab] = el;
              }}
              className="mb-4 mt-2 flex-shrink-0"
            >
              <Pill
                checked={activeTab === tab}
                onClick={() => onTabChange(tab)}
              >
                {tab}
              </Pill>
            </div>
          ))}
          <div className="pr-6" />
        </div>
      </div>
    </div>
  );
}
