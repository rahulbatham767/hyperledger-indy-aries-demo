"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TabsNavigation = () => {
  const pathname = usePathname();
  const tabs = [
    { name: "Active", href: "/connection/active" },
    { name: "Pending", href: "/connection/pending" },
    { name: "Create", href: "/connection/create" },
    { name: "Accept", href: "/connection/accept" },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "py-4 flex-1 text-center font-medium text-sm border-b-2",
              pathname === tab.href
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default TabsNavigation;