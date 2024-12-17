"use client";
import useStore from "@/app/store/useStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function Message({ open, onClose }) {
  const [relationship, setRelationship] = useState("");
  const [content, setMessage] = useState("");
  const { Active, message } = useStore();
  console.log(content);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Message</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Relationship Dropdown */}
          <div className="grid grid-cols-1 gap-2">
            <label
              htmlFor="relationship"
              className="text-sm font-medium text-gray-700"
            >
              Relationship
            </label>
            <select
              id="relationship"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            >
              <option value="" disabled selected>
                Select a Relationship
              </option>
              {Active.map((active, i) => (
                <option key={i} value={active.connection_id}>
                  {" "}
                  {active.alias}:{active.their_did}
                </option>
              ))}
            </select>
          </div>

          {/* Message Textarea */}
          <div className="grid grid-cols-1 gap-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your message here..."
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              // Add your "Send Message" logic here
              message(content, relationship);
              onClose(false);
            }}
          >
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
