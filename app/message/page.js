"use client";
import React, { useEffect, useState, useRef } from "react";
import useStore from "../store/useStore";
import useWebSocketStore from "../store/useWebSocketStore";
import { Button } from "@/components/ui/button";
import { Send, MessagesSquare, User } from "lucide-react";

const Page = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [relationship, setRelationship] = useState("");
  const { Active, fetchConnection, sendMessage } = useStore();
  const { recievedMessage, setMessages, messages } = useWebSocketStore();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchConnection();
  }, []);

  useEffect(() => {
    if (recievedMessage) {
      setMessages([
        ...messages,
        {
          sender: "receiver",
          message: recievedMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [recievedMessage, setMessages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "" && relationship) {
      const newMessage = {
        sender: "sender",
        message: inputMessage,
        timestamp: new Date().toISOString(),
      };
      sendMessage(relationship, inputMessage).then(() => {
        setMessages([...messages, newMessage]);
        setInputMessage("");
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl w-[30rem] mx-auto lg:p-6 h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessagesSquare className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Secure Messages</h1>
        </div>
        <div className="relative w-56">
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 appearance-none"
          >
            <option value="" disabled>
              Select Connection
            </option>
            {Active.map((item) => (
              <option key={item.connection_id} value={item.connection_id}>
                {item.their_label ||
                  `Connection ${item.connection_id.slice(0, 6)}`}
              </option>
            ))}
          </select>
          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Message Container */}
      <div className="flex-1 border border-gray-200 rounded-xl shadow-inner bg-white p-4 overflow-y-auto flex flex-col gap-3 transition-all duration-300">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 transition-opacity duration-300">
            <div className="w-20 h-20 mb-4 opacity-70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm mt-1">
              Select a connection to start chatting
            </p>
          </div>
        ) : (
          messages.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.sender === "sender" ? "justify-end" : "justify-start"
              } transition-all duration-200 transform hover:scale-[1.01]`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 shadow-sm transition-all duration-300 ${
                  item.sender === "sender"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
                    : "bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {item.message}
                </p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="mt-4 flex items-end gap-2 transition-all duration-300">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            relationship
              ? "Type your message..."
              : "Select a connection to message"
          }
          className={`flex-1 border rounded-xl p-3 resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 min-h-[4rem] max-h-32 transition-all duration-300 ${
            relationship
              ? "border-gray-200 bg-white shadow-sm"
              : "border-gray-100 bg-gray-50"
          }`}
          rows={3}
          disabled={!relationship}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!relationship || !inputMessage.trim()}
          size="lg"
          className={`h-12 w-12 p-0 transition-all duration-300 ${
            !relationship || !inputMessage.trim()
              ? "bg-gray-200 text-gray-400"
              : "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md"
          }`}
        >
          <Send className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default Page;
