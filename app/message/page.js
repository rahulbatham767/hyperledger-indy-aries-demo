"use client";

import React, { useEffect, useState } from "react";
import useStore from "../store/useStore";
import useWebSocketStore from "../store/useWebSocketStore";

const Page = () => {
  const [inputMessage, setInputMessage] = useState(""); // Message input
  const [relationship, setRelationship] = useState(""); // Selected relationship
  const { Active, fetchConnection, sendMessage } = useStore();
  const {  recievedMessage, setMessages, messages } =
    useWebSocketStore();
  // const [messages, setMessages] = useState([]); // Store both sent and received messages

  useEffect(() => {
    fetchConnection(); // Fetch initial connections
    // Establish WebSocket connection
  }, []);

  useEffect(() => {
    if (recievedMessage) {
      // When a message is received, add it to the message list
      setMessages([{ sender: "receiver", message: recievedMessage }]);
    }
  }, [recievedMessage, setMessages]); // Update received messages when a new one arrives

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      const newMessage = { sender: "sender", message: inputMessage };
      // Send the message via WebSocket and update Zustand store
      sendMessage(relationship, newMessage).then(() => {
        setMessages([{ sender: "sender", message: inputMessage }]);
      });
      setInputMessage(""); // Clear input after sending the message
    }
  };

  return (
    <div className="p-6 space-y-6 w-[45rem] mx-auto">
      {/* Message Container */}
      <div className="shadow-lg border h-[32rem] border-gray-200 rounded-lg p-4 overflow-y-auto scroll-smooth bg-white flex flex-col gap-2">
        {/* All Messages (Sent and Received) */}
        {messages.map((item, index) => (
          <div
            key={index}
            className={`w-fit p-2 rounded-md max-w-xs ${
              item.sender === "sender"
                ? "bg-blue-500 text-white ml-auto" // Sent message on the right
                : "bg-green-500 text-white mr-auto" // Received message on the left
            }`}
          >
            <p> {item.message}</p>
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
            {Active.map((item, index) => (
              <option key={index} value={item.connection_id}>
                {item.their_label}
              </option>
            ))}
          </select>
        </div>

        {/* Textarea */}
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
