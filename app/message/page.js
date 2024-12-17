"use client";

import React, { useEffect, useState } from "react";
import useStore from "../store/useStore";

const Page = () => {
  const [messages, setMessages] = useState([]); // Store messages
  const [inputMessage, setInputMessage] = useState(""); // Current input message
  const [relationship, setRelationship] = useState(""); // Selected relationship
  const { Active, fetchConnection } = useStore();

  // Simulate receiving a message
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "receiver", text: "Hello from the receiver!" },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch connections when the component mounts
  useEffect(() => {
    fetchConnection();
  }, []);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setMessages((prev) => [
        ...prev,
        { sender: "sender", text: inputMessage },
      ]);
      setInputMessage(""); // Clear input field
    }
  };

  return (
    <div className="p-6 space-y-6 w-[45rem] mx-auto">
      {/* Message Container */}
      <div className="shadow-lg border border-gray-200 rounded-lg p-4 h-80 overflow-y-auto bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 max-w-xs w-fit rounded-md ${
              msg.sender === "sender"
                ? "bg-blue-100 text-left"
                : "bg-green-100 text-right ml-auto"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="flex items-center space-x-4">
        {/* Relationship Dropdown */}
        <div className="w-64">
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full border border-gray-300 bg-slate-50 rounded-md p-2"
          >
            <option value="" disabled>
              Select Relationship
            </option>
            {Active && Active.length > 0 ? (
              Active.map((active, i) => (
                <option key={i} value={active.connection_id}>
                  {active.alias}: {active.their_did}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No Connections Found
              </option>
            )}
          </select>
        </div>

        {/* Textarea for Message */}
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-grow resize-none border border-gray-300 bg-slate-50 rounded-md p-2"
        />

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={!relationship || !inputMessage.trim()}
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            (!relationship || !inputMessage.trim()) &&
            "opacity-50 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Page;
