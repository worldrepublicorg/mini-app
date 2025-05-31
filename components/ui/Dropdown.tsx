import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  trigger: React.ReactNode;
  menuItems: {
    label: string;
    onClick: () => void;
    className?: string;
  }[];
  align?: "left" | "right";
}

export function Dropdown({
  trigger,
  menuItems,
  align = "left",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((open) => !open);
  const closeDropdown = () => setIsOpen(false);

  // Calculate menu position when opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      let left: number | undefined = rect.left + scrollX;
      let right: number | undefined = undefined;
      if (align === "right") {
        right = window.innerWidth - rect.right - scrollX;
        left = undefined;
      }
      const style: React.CSSProperties = {
        position: "absolute",
        top: rect.bottom + scrollY + 4, // 4px gap
        minWidth: rect.width,
        zIndex: 1000,
      };
      if (typeof left === "number") style.left = left;
      if (typeof right === "number") style.right = right;
      setMenuStyles(style);
    }
  }, [isOpen, align]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Clean up on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => closeDropdown();
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={toggleDropdown}
        style={{ display: "inline-block" }}
      >
        {trigger}
      </div>
      {isOpen && typeof window !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              style={menuStyles}
              className={`dropdown-portal absolute min-w-[180px] overflow-hidden rounded-[0.875rem] border border-gray-200 bg-gray-0 shadow-lg focus:outline-none`}
            >
              <div className="py-1">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${item.className || ""} ${
                      item.className?.includes("text-") ? "" : "text-gray-700"
                    }`}
                    onClick={() => {
                      item.onClick();
                      closeDropdown();
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
