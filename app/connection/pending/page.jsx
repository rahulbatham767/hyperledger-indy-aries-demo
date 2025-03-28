"use client";
import ActiveCard from "@/app/components/ActiveCard";
import LoadingScr from "@/app/components/LoadingScr";
import useStore from "@/app/store/useStore";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PendingPage = () => {
  const { Pending, fetchConnection } = useStore();
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Pending Connections</h1>
            <p className="text-gray-500 mt-2">
              {Pending?.length > 0 
                ? `${Pending.length} pending connection${Pending.length !== 1 ? 's' : ''}` 
                : "Awaiting connection requests"}
            </p>
          </div>
          <Button 
            onClick={() => router.push("/connection/accept")}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Accept New Invitation
          </Button>
        </div>

        {/* Connections Grid */}
        {Pending?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Pending.map((act, index) => (
              <div key={index} className="transition-all hover:scale-[1.02]">
                <ActiveCard act={act} pending={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="text-center p-12">
              <div className="mx-auto h-24 w-24 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No pending connections</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                All your connections are active or you haven't received any invitations yet.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => router.push("/connection/accept")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Accept Invitation
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPage;