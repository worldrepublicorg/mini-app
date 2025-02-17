"use client";

import { Pill } from "@/components/ui/Pill";
import { useEffect, useRef, useState } from "react";

interface TabSwiperProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Custom easing function (easeInOutQuad)
function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Custom smooth scroll function that animates to the target position
function smoothScrollTo(
  element: HTMLElement,
  target: number,
  duration: number
) {
  const start = element.scrollLeft;
  const distance = target - start;
  let startTime: number | null = null;

  const step = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutQuad(progress);
    element.scrollLeft = start + distance * ease;

    if (elapsed < duration) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

export function TabSwiper({ tabs, activeTab, onTabChange }: TabSwiperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [userSwiped, setUserSwiped] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Update scroll position state
      setScrollLeft(container.scrollLeft);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Touch/mouse handlers for dragging
  const startDrag = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const container = containerRef.current;
    if (!container) return;

    const x = "touches" in e ? e.touches[0].pageX : e.pageX;
    setStartX(x - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const onDrag = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;

    const x = "touches" in e ? e.touches[0].pageX : e.pageX;
    const walk = (x - container.offsetLeft - startX) * 2; // Adjust multiplier for sensitivity
    container.scrollLeft = scrollLeft - walk;

    if (!userSwiped && Math.abs(walk) > 5) {
      setUserSwiped(true);
    }
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  // Auto-scroll to center the active element only if the user hasn't manually swiped.
  useEffect(() => {
    const activeElement = document.querySelector(`[data-tab="${activeTab}"]`);
    const container = containerRef.current;

    if (activeElement && container && !isDragging && !userSwiped) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();

      const calculatedScrollLeft =
        elementRect.left -
        containerRect.left +
        container.scrollLeft -
        containerRect.width / 2 +
        elementRect.width / 2;

      smoothScrollTo(container, calculatedScrollLeft, 300);
    }
  }, [activeTab, isDragging, userSwiped]);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar -mx-6 touch-pan-x select-none overflow-x-auto pb-4 pt-2"
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={startDrag}
      onTouchMove={onDrag}
      onTouchEnd={endDrag}
    >
      <div className="flex w-max gap-2 px-6">
        {tabs.map((tab) => (
          <Pill
            key={tab}
            checked={activeTab === tab}
            onClick={() => {
              if (!isDragging) {
                setUserSwiped(false);
                onTabChange(tab);
              }
            }}
            data-tab={tab}
          >
            {tab}
          </Pill>
        ))}
      </div>
    </div>
  );
}
