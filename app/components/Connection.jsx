"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useStore from "../store/useStore";

export default function TabsNavigation() {
  const [activeTab, setActiveTab] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const { fetchConnection } = useStore();
  const tabs = [
    { id: "active", label: "Active", href: "/connection/active" },
    { id: "pending", label: "Pending", href: "/connection/pending" },
    { id: "new", label: "New", href: "/connection/new" },
    { id: "accept", label: "Accept", href: "/connection/accept" },
  ];

  // Sync activeTab with the current pathname
  useEffect(() => {
    const currentTab = tabs.find((tab) => pathname.includes(tab.href))?.id;
    setActiveTab(currentTab || "active");
  }, [pathname]);

  const handleTabClick = (id, href) => {
    setActiveTab(id);
    router.push(href);
    fetchConnection();
  };

  return (
    <div className="tabs-container w-full">
      <div className="tabs-list grid mt-3 grid-cols-4 w-full rounded-t-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.href)}
            className={`tab-item py-2 text-sm border m-1 rounded text-center ${
              activeTab === tab.id
                ? "bg-slate-500 text-white font-semibold"
                : "bg-gray-200 text-gray-700"
            } hover:bg-slate-300`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
