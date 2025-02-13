"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaLandmark, FaDollarSign, FaBars } from "react-icons/fa";

const navItems = [
  { href: "/earn", icon: FaDollarSign },
  { href: "/vote", icon: FaLandmark },
  { href: "/menu", icon: FaBars },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-0">
      <div className="flex justify-around items-center h-24">
        {navItems.map(({ href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`w-full flex flex-col items-center justify-center space-y-[2px] 
              ${pathname === href ? "text-foreground" : "text-gray-400"}`}
            tabIndex={0}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Icon className="w-6 h-6" />
          </Link>
        ))}
      </div>
      <div className="safe-area-spacer"></div>
    </nav>
  );
};

export default BottomNav;
