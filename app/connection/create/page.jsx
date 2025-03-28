"use client";
import { Button } from "@/components/ui/button";
import useStore from "@/app/store/useStore";
import React from "react";
import { toast } from "react-toastify";

const CreatePage = () => {
  const { loading, createInvitation, Invitation, successStatus } = useStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    createInvitation();
    if (successStatus) {
      toast.success("🎉 Invitation generated successfully!");
    } else {
      toast.error("⚠️ Failed to generate invitation. Please try again.");
    }
  };

  const copyToClipboard = () => {
    if (!Invitation?.invitation) {
      toast.error("Generate an invitation first!");
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(Invitation.invitation, null, 2));
    toast.success("📋 Copied to clipboard!");
  };

  return (
    <div className="w-full min-h-screen grid-cols-3 bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto"> {/* Increased width to max-w-4xl */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold text-center">
              Create New Connection Invitation
            </h1>
            <p className="mt-2 text-blue-100 text-center text-sm">
              Generate and share secure agent connection invitations
            </p>
          </div>
          
          {/* Content */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Generate Button */}
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                size="lg"
                className="w-full md:w-auto px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md transition-all transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Invitation
                  </span>
                )}
              </Button>
              <p className="mt-3 text-sm text-gray-500 text-center">
                {loading ? "Creating secure invitation..." : "Click to generate a new connection invitation"}
              </p>
            </div>

            {/* Invitation Display */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 text-center flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                </svg>
                Invitation Details
              </h2>
              
              <div
                onClick={copyToClipboard}
                className={`relative rounded-xl border-2 transition-all duration-300 min-h-48 max-h-96 overflow-hidden ${
                  Invitation?.invitation
                    ? "border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 cursor-copy hover:shadow-md hover:border-blue-400"
                    : "border-dashed border-gray-300 bg-gray-50"
                } ${loading ? "animate-pulse" : ""}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-full gap-3 p-6">
                    <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full" />
                    <span className="text-gray-600">Creating secure invitation...</span>
                  </div>
                ) : Invitation?.invitation ? (
                  <>
                    <pre className="p-4 overflow-auto h-full text-xs sm:text-sm font-mono text-gray-800">
                      {JSON.stringify(Invitation.invitation, null, 2)}
                    </pre>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-blue-600 border border-blue-200 shadow-sm flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Click to copy
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-center font-medium">No invitation generated yet</p>
                    <p className="text-sm mt-1 text-center">Create an invitation to see the details here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center text-xs text-gray-500">
            Secure agent-to-agent connection protocol
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;