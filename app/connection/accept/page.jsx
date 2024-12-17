"use client";
import useHolder from "@/app/store/holderStore";
import useStore from "@/app/store/useStore";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingScr from "@/app/components/LoadingScr"; // Import the Loading component if it's not already imported

const page = () => {
  const [pastedLink, setPastedLink] = useState("");
  const { RecieveInvitation } = useStore();
  const { loading } = useStore();

  const handleAcceptInvitation = () => {
    if (!pastedLink) {
      toast.error("Please paste a valid invitation link");
      return;
    }
    // Process the invitation link here
    RecieveInvitation(pastedLink);
    toast.success("Invitation Accepted Successfully!");
    // You can further process the invitation (e.g., send it to an API)
  };

  const pasteText = async () => {
    try {
      const text = await navigator.clipboard.readText();

      setPastedLink(text);
      if (text.startsWith("{")) {
        toast("📋 Link Pasted Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast("Please Provide a valid JSON Object", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log(error);
      toast("Failed to paste from clipboard", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
