"use client";
import useHolder from "@/app/store/holderStore";
import useStore from "@/app/store/useStore";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingScr from "@/app/components/LoadingScr"; // Import the Loading component if it's not already imported
import { useRouter } from "next/navigation";

const page = () => {
  const [pastedLink, setPastedLink] = useState("");
  const { RecieveInvitation, successStatus, Invitation, fetchConnection } =
    useStore();
  const { loading } = useStore();
  const route = useRouter();
  const handleAcceptInvitation = () => {
    if (!pastedLink) {
      toast.error("Please paste a valid invitation link");
      return;
    }
    // Process the invitation link here
    RecieveInvitation(JSON.parse(pastedLink)).then(() => {
      console.log("success status outside ", successStatus);
      if (successStatus) {
        console.log("success status inside ", successStatus);
        setPastedLink("");
        fetchConnection();
        toast.success(
          `Connection established Successfully with ${
            Invitation?.invitation?.label?.charAt(0).toUpperCase() +
            Invitation?.invitation?.label?.slice(1)
          }`
        );

        route.push("/connection/active");
      }
    });
  };

  const pasteText = async () => {
    try {
      const text = await navigator.clipboard.readText();

      setPastedLink(text);
      if (text.startsWith("{")) {
        toast.success("📋 Link Pasted Successfully");
      } else {
        toast.error("Please Provide a valid JSON Object");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to paste from clipboard", error.message);
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingScr />
      ) : (
        <div className="flex flex-col w-full p-4 border border-gray-300 rounded-lg bg-white shadow-md">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Accept Invitation
          </h2>

          <div className="mb-4">
            <textarea
              value={pastedLink}
              placeholder="Click on Blank Textarea to paste Invitation "
              className="w-full h-40 p-2 border border-slate-300 rounded-md bg-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              readOnly
              onClick={pasteText}
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleAcceptInvitation}
              className="px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600"
            >
              Accept Invitation
            </button>
            <button
              onClick={() => setPastedLink("")}
              className="ml-3 px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
