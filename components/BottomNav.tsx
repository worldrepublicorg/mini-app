"use client";
import { usePathname, useRouter } from "next/navigation";
import { FaLandmark, FaDollarSign, FaBars } from "react-icons/fa";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const lang = pathname.split("/")[1]; // Get language from URL

  const navItems = [
    { path: "/earn", label: "earn", icon: FaDollarSign },
    { path: "/govern", label: "govern", icon: FaLandmark },
    { path: "/menu", label: "menu", icon: FaBars },
  ];

  const isActive = (path: string) => {
    // Get the current route after the language code
    const currentPath = pathname.split("/")[2] || "";
    // Remove leading slash for comparison
    const targetPath = path.slice(1);
    return currentPath === targetPath;
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    MiniKit.commands.sendHapticFeedback({
      hapticsType: "impact",
      style: "light",
    });

    // Navigate directly to the correct path: /{language}/{route}
    const targetPath = `/${lang}${path}`;
    if (pathname !== targetPath) {
      router.push(targetPath);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-0">
      <div className="flex h-14 items-center justify-around">
        {navItems.map(({ path, icon: Icon }) => (
          <a
            key={path}
            href={`/${lang}${path}`}
            onClick={(e) => handleNavClick(e, path)}
            className={`flex w-full flex-col items-center justify-center space-y-[2px] ${
              isActive(path) ? "text-foreground" : "text-gray-400"
            }`}
            tabIndex={0}
          >
            <div className="relative">
              <Icon className="h-6 w-6" />
            </div>
          </a>
        ))}
      </div>
      <div className="safe-area-spacer"></div>
    </nav>
  );
};

export default BottomNav;
