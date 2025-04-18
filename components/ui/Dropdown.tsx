import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  menuItems: {
    label: string;
    onClick: () => void;
  }[];
  align?: "left" | "right";
}

export function Dropdown({
  trigger,
  menuItems,
  align = "left",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute z-10 mt-1 ${
            align === "right" ? "right-0" : "left-0"
          } bg-white ring-black min-w-[160px] rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none`}
        >
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  item.onClick();
                  closeDropdown();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
