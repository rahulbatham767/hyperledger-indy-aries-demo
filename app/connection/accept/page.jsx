"use client";
import { Button } from "@/components/ui/button";
import useStore from "@/app/store/useStore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingScr from "@/app/components/LoadingScr";

const AcceptPage = () => {
  const [pastedLink, setPastedLink] = useState("");
  const { RecieveInvitation, successStatus, fetchConnection } = useStore();
  const { loading, deleteInvitation } = useStore();
  const router = useRouter();

  const handleAccept = () => {
    if (!pastedLink) {
      toast.error("Please paste a valid invitation link");
      return;
    }
    
    try {
      JSON.parse(pastedLink);
      RecieveInvitation(JSON.parse(pastedLink))
        .then(() => {
          if (successStatus) {
            toast.success("🎉 Connection established successfully!");
            deleteInvitation();
            setPastedLink("");
            fetchConnection().then(() => router.push("/connection/active"));
          }
        })
        .catch(() => {
          toast.error("⚠️ Failed to accept invitation. Please check the link and try again.");
        });
    } catch (e) {
      toast.error("❌ Invalid JSON format. Please check your invitation.");
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPastedLink(text);
      try {
        JSON.parse(text);
        toast.success("📋 Invitation pasted successfully!");
      } catch {
        toast.warning("⚠️ Clipboard contains text, but it's not valid JSON");
      }
    } catch (error) {
      toast.error("🔒 Failed to access clipboard. Check browser permissions.");
    }
  };

  if (loading) return <LoadingScr />;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Instructions */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 lg:col-span-1">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h2 className="text-xl font-bold">Connection Guide</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">How to connect</h3>
                <p className="text-sm text-gray-600 mt-1">Paste the invitation JSON you received from another agent</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Security</h3>
                <p className="text-sm text-gray-600 mt-1">All connections are end-to-end encrypted</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Troubleshooting</h3>
                <p className="text-sm text-gray-600 mt-1">Ensure the invitation hasn't expired before accepting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Column */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 lg:col-span-2">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold text-center">
              Accept Connection Invitation
            </h1>
            <p className="mt-2 text-green-100 text-center text-sm">
              Paste an invitation to establish a secure connection
            </p>
          </div>
          
          <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Paste Invitation
              </h2>
              
              <div
                onClick={pasteFromClipboard}
                className={`relative rounded-xl border-2 transition-all duration-300 min-h-48 max-h-96 overflow-hidden ${
                  pastedLink
                    ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 cursor-text"
                    : "border-dashed border-gray-300 bg-gray-50 hover:border-green-400 cursor-copy"
                }`}
              >
                {pastedLink ? (
                  <>
                    <pre className="p-4 overflow-auto h-full text-xs sm:text-sm font-mono text-gray-800">
                      {pastedLink}
                    </pre>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-green-600 border border-green-200 shadow-sm flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Click to change
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-gray-400 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-center font-medium">Click to paste invitation</p>
                    <p className="text-sm mt-1 text-center">Or drag and drop a JSON invitation file</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={handleAccept}
                disabled={!pastedLink}
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md transition-all transform hover:scale-105 disabled:opacity-70 disabled:transform-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Accept Invitation
              </Button>
              
              <Button
                onClick={() => setPastedLink("")}
                disabled={!pastedLink}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg border-gray-300 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptPage;