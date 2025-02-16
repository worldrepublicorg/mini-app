"use client";

import { Pill } from "@/components/ui/Pill";
import { useEffect, useRef, useState } from "react";

interface TabSwiperProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabSwiper({ tabs, activeTab, onTabChange }: TabSwiperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Update scroll position state
      setScrollLeft(container.scrollLeft);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Touch/mouse handlers for dragging
  const startDrag = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const container = containerRef.current;
    if (!container) return;
    
    const x = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setStartX(x - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const onDrag = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;
    
    const x = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const walk = (x - container.offsetLeft - startX) * 2; // Adjust multiplier for sensitivity
    container.scrollLeft = scrollLeft - walk;
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  // Scroll to active tab logic
  useEffect(() => {
    const activeElement = document.querySelector(`[data-tab="${activeTab}"]`);
    const container = containerRef.current;
    
    if (activeElement && container && !isDragging) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      
      const scrollLeft =
        elementRect.left -
        containerRect.left +
        container.scrollLeft -
        containerRect.width / 2 +
        elementRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeTab, isDragging]);

  return (
    <div 
      ref={containerRef}
      className="no-scrollbar -mx-6 overflow-x-auto pb-4 pt-2 touch-pan-x select-none"
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
            onClick={() => !isDragging && onTabChange(tab)}
            data-tab={tab}
          >
            {tab}
          </Pill>
        ))}
      </div>
    </div>
  );
}
