import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingScr() {
  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>

      <div className="p-4"></div>
    </div>
  );
}
