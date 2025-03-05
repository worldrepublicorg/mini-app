"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaLandmark, FaDollarSign, FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/earn", icon: FaDollarSign },
  { href: "/govern", icon: FaLandmark },
  { href: "/menu", icon: FaBars },
];

const BottomNav = () => {
  const pathname = usePathname();
  const [hasMenuBeenVisited, setHasMenuBeenVisited] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const menuVisited = localStorage.getItem("menuVisited") === "true";
      setHasMenuBeenVisited(menuVisited);
    }
  }, []);

  useEffect(() => {
    if (pathname === "/menu" && typeof window !== "undefined") {
      localStorage.setItem("menuVisited", "true");
      setHasMenuBeenVisited(true);
    }
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-0">
      <div className="flex h-14 items-center justify-around">
        {navItems.map(({ href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex w-full flex-col items-center justify-center space-y-[2px] ${pathname === href ? "text-foreground" : "text-gray-400"}`}
            tabIndex={0}
            onTouchStart={(e) => {
              e.currentTarget.click();
            }}
          >
            <div className="relative">
              <Icon className="h-6 w-6" />
              {href === "/menu" && !hasMenuBeenVisited && (
                <div className="absolute -right-[5px] -top-1 h-2 w-2 rounded-full bg-error-800 opacity-65"></div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="safe-area-spacer"></div>
    </nav>
  );
};

export default BottomNav;
