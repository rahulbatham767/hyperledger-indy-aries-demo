"use client";
import ActiveCard from "@/app/components/ActiveCard";
import LoadingScr from "@/app/components/LoadingScr";
import useStore from "@/app/store/useStore";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ActivePage = () => {
  const { Active, fetchConnection } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchConnection().finally(() => setIsLoading(false));
  }, [fetchConnection]);

  if (isLoading) return <LoadingScr />;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Active Connections</h1>
            <p className="text-gray-500 mt-2">
              {Active?.length > 0 
                ? `${Active.length} active connection${Active.length !== 1 ? 's' : ''}` 
                : "Manage your secure connections"}
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              onClick={() => router.push("/connection/create")}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Create Invitation
            </Button>
            <Button 
              onClick={() => router.push("/connection/accept")}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Accept Invitation
            </Button>
          </div>
        </div>

        {/* Connections Grid */}
        {Active?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-x-4"> {/* Increased gap from gap-6 to gap-8 */}
            {Active.map((act, index) => (
              <div key={index} className="transition-all hover:scale-[1.02]"> {/* Added container div with hover effect */}
                <ActiveCard act={act} pending={false} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl grid grid-cols-3 shadow-sm border border-gray-200 overflow-hidden">
            <div className="text-center p-12 col-span-3"> {/* Made empty state take full width */}
              <div className="mx-auto h-24 w-24 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No active connections</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                You don't have any active connections yet. Create or accept an invitation to get started.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button 
                  onClick={() => router.push("/connection/create")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Create New
                </Button>
                <Button 
                  onClick={() => router.push("/connection/accept")}
                  variant="outline"
                >
                  Accept Invite
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivePage;