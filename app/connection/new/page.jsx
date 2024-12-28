"use client";

import React, { useState } from "react";
import useStore from "@/app/store/useStore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import LoadingScr from "@/app/components/LoadingScr"; // Custom loading spinner component

const Page = () => {
  const [did, setDid] = useState("");
  const { loading, createInvitation, Invitation, successStatus } = useStore();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    createInvitation();
    if (successStatus) {
      toast.success("Invitation Generated Successfully!");
    }
  };

  // Copy text to clipboard
  const copyText = (e) => {
    const text = e.target.innerText || e.target.textContent;
    navigator.clipboard.writeText(text);
    if (
      !text ||
      text === "Click Create New Invitation to generate an Invitation Object."
    ) {
      toast.error("No text is available for copying", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    toast.success("📋 Invitation Link Copied Successfully", {
      position: "top-right",
      autoClose: 5000,
    });
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-8 bg-gray-50 border border-gray-200 rounded-xl shadow-lg">
      {/* Button Section */}
      <div className="mb-8">
        <Button
          className="w-full text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-blue-300"
          onClick={handleSubmit}
          disabled={loading} // Disable button when loading
          aria-label="Create New Invitation"
        >
          {loading ? "Creating..." : "Create New Invitation"}
        </Button>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Copy and paste the Invitation Object into the agent to create a new
          relationship.
        </p>
      </div>

      {/* Invitation Section */}
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Invitation</h3>

        <div className="relative bg-gray-100 p-4 border border-gray-300 rounded-lg max-h-[20rem] overflow-y-auto">
          {/* Show loader when loading */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">
                Generating Invitation...
              </span>
            </div>
          ) : (
            <div
              className="text-sm font-mono text-gray-700 whitespace-pre-wrap cursor-pointer break-words"
              onClick={copyText}
              aria-label="Click to Copy Invitation Link"
            >
              {Invitation?.invitation ? (
                <pre>{JSON.stringify(Invitation?.invitation, null, 2)}</pre>
              ) : (
                <p className="text-gray-500">
                  Click Create New Invitation to generate an Invitation Object.
                </p>
              )}
            </div>
          )}

          {/* Copy Instruction */}
          <p className="absolute bottom-2 right-4 text-xs text-gray-500 italic">
            📋 Click to Copy Invitation Link
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
