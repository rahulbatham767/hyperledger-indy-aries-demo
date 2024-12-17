"use client";
import useStore from "@/app/store/useStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Copy, CopyPlusIcon, LucideClipboardPlus } from "lucide-react";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";

export function Relationship() {
  const [did, setDid] = useState("");
  const { createInvitation, Invitation } = useStore();
  const [isOpen, setIsOpen] = useState(false); // Track dialog open/close state

  console.log(Invitation?.invite?.invitation);
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    createInvitation(did);
    // Submit logic goes here
    console.log("DID Submitted:", did);

    setIsOpen(true);
  };
  const copyText = (e) => {
    const text = e.target.innerText || e.target.textContent;
    navigator.clipboard.writeText(text);
    if (!text) {
      toast(" No text is available for copying", {
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

    toast(`📋 Invitation Link Copied Successfully`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} className="w-[30rem]">
      <DialogTrigger asChild>
        <Button
          className="hover:bg-slate-300 text-white hover:text-black bg-slate-500"
          onClick={handleSubmit}
        >
          Create a New Connection
        </Button>
      </DialogTrigger>
      <DialogContent className=" flex flex-wrap w-full">
        <DialogHeader>
          <DialogTitle>Create a new Relationship</DialogTitle>
          <DialogDescription>
            Copy and paste the Invitation Object into the agent to create a new
            Relationship.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap w-full">
          <h1 className="text-xl font-bold">Invitation:</h1>
          <div
            className="text-xs break-words w-full overflow-y-auto max-h-40 p-2 border border-slate-300 rounded-md bg-slate-100"
            onClick={copyText}
          >
            {JSON.stringify(Invitation?.invite?.invitation, null, 2)}
          </div>
        </div>

        <DialogFooter className="mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
            }}
            className="bg-slate-500 text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
