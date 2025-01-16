import { create } from "zustand";
import { persist } from "zustand/middleware";
import { topics } from "../utils/topics";
import Cookies from "js-cookie";

const API_URLS = {
  admin: process.env.NEXT_PUBLIC_ISSUER_SOCKET,
  verifier: process.env.NEXT_PUBLIC_VERIFIER_SOCKET,
  user: process.env.NEXT_PUBLIC_HOLDER_SOCKET,
};

const useWebSocketStore = create(
  persist(
    (set) => ({
      ws: null,
      messages: [],
      connections: {},
      recievedMessage: "",
      proofs: {},
      credentials: {},
      revocation: {},
      connected: false,
      notifications: {},
      newMessageNotification: false, // Store for new message notification state

      setConnected: (status) => set({ connected: status }),

      setMessages: (newMessages) => {
        set((state) => {
          // Append new messages to the existing ones
          const updatedMessages = [...state.messages, ...newMessages];
          const lastMessage = newMessages[0]; // Get the last message

          if (lastMessage) {
            // Trigger notification when a new message arrives
            set({ newMessageNotification: true });
          }

          return { messages: updatedMessages };
        });
      },
      clearNotification: (topic) =>
        set((state) => {
          const updatedNotifications = { ...state.notifications };
          delete updatedNotifications[topic];
          return { notifications: updatedNotifications };
        }),
      clearAllNotifications: () => set({ notifications: {} }),

      connect: () => {
        const userAccess = Cookies.get("userRole"); // Retrieve the user role from cookies
        const url = API_URLS[userAccess] || "";
        if (!url) {
          console.error("WebSocket URL not found for the user role");
          return;
        }
        console.log(url);
        const ws = new WebSocket(`${url}`);

        ws.onopen = () => {
          set({ connected: true });
          console.log("✅ WebSocket connected");
        };

        ws.onclose = () => {
          set({ connected: false });
          console.log("🔌 WebSocket disconnected");
        };

        ws.onmessage = (event) => {
          const { topic, payload } = JSON.parse(event.data); // Assuming event.data is JSON
          console.log("topic", topic);
          if (topic === "ping") return;
          console.log("topic after ping", topic);
          topics(topic, payload, set); // Pass data to the topics handler
        };

        set({ ws });
      },
      disconnect: () => {
        const ws = get().ws; // Retrieve the WebSocket from state
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close(); // Close the WebSocket connection
            console.log("🔌 WebSocket manually disconnected");
            set({ connected: false }); // Update state to reflect disconnection
        }
    },
      sendMessage: (topic, payload) => {
        const { ws } = set.getState();
        if (ws && ws.readyState === WebSocket.OPEN) {
          const message = { topic, payload };
          ws.send(JSON.stringify(message));
        }
      },
    }),
    {
      name: "socket-storage",
      storage: {
        getItem: (name) => {
          if (typeof window !== "undefined") {
            const item = localStorage.getItem(name);
            // console.log(`Fetching from localStorage: ${name}`, item);
            return item ? JSON.parse(item) : null;
          }
          return null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(name, JSON.stringify(value));
            console.log(`Saving to localStorage: ${name}`, value);
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name);
            console.log(`Removing from localStorage: ${name}`);
          }
        },
      },
    }
  )
);

export default useWebSocketStore;
