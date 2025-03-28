import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  handleHolderTopics,
  handleIssuerTopics,
  handleVerifierTopics,
} from "../utils/topics";

const useWebSocketStore = create(
  persist(
    (set, get) => ({
      // Separate WebSocket connections for each agent type
      wsConnections: {
        issuer: null,
        verifier: null,
        holder: null,
      },
      connectedRoles: [], // Track which roles are connected
      messages: [],
      proofs: {},
      credentials: {},
      revocation: {},
      notifications: {},
      token: null,

      // Set authentication token
      setToken: (token) => set({ token }),

      // Connect WebSocket for a specific agent type
      connectWebSocket: (url, type) => {
        if (!url || (!url.startsWith("ws://") && !url.startsWith("wss://"))) {
          console.error(`[${type.toUpperCase()}] Invalid WebSocket URL:`, url);
          toast.error(`Invalid ${type} WebSocket URL`);
          return;
        }

        if (get().wsConnections[type]) {
          console.warn(`[${type.toUpperCase()}] WebSocket already connected.`);
          return;
        }

        console.log(`[${type.toUpperCase()}] Connecting WebSocket to:`, url);
        const ws = new WebSocket(url);

        ws.onopen = () => {
          console.log(`[${type.toUpperCase()}] WebSocket connected.`);
          set((state) => ({
            wsConnections: { ...state.wsConnections, [type]: ws },
            connectedRoles: [...new Set([...state.connectedRoles, type])],
          }));
          toast.success(
            `${type.charAt(0).toUpperCase() + type.slice(1)} connected`
          );
        };

        ws.onclose = () => {
          console.log(`[${type.toUpperCase()}] WebSocket disconnected.`);
          set((state) => ({
            wsConnections: { ...state.wsConnections, [type]: null },
            connectedRoles: state.connectedRoles.filter(
              (role) => role !== type
            ),
          }));

          // Attempt reconnection after delay
          setTimeout(() => {
            if (!get().wsConnections[type]) {
              get().connectWebSocket(url, type);
            }
          }, 5000);
        };

        ws.onerror = (err) => {
          console.error(`[${type.toUpperCase()}] WebSocket Error:`, err);
          toast.error(`${type} connection error`);
        };

        ws.onmessage = async (event) => {
          try {
            const message = JSON.parse(event.data);
            const { topic, payload } = message;

            if (topic !== "ping") {
              console.log(
                `[${type.toUpperCase()}] [${new Date().toISOString()}] Message:`,
                topic,
                payload
              );

              // Add to messages store
              set((state) => ({
                messages: [
                  ...state.messages,
                  { type, topic, payload, timestamp: new Date().toISOString() },
                ],
              }));

              // Handle message based on agent type
              if (type === "verifier") {
                handleVerifierTopics(topic, payload);
              } else if (type === "holder") {
                handleHolderTopics(topic, payload);
              } else if (type === "issuer") {
                handleIssuerTopics(topic, payload, get().token);
              }

              // Create notification
              set((state) => ({
                notifications: {
                  ...state.notifications,
                  [topic]: {
                    type,
                    message: `New ${topic} message from ${type}`,
                    payload,
                    timestamp: new Date().toISOString(),
                    read: false,
                  },
                },
              }));
            }
          } catch (error) {
            console.error(
              `[${type.toUpperCase()}] Error processing message:`,
              error
            );
            toast.error("Error processing WebSocket message");
          }
        };

        set((state) => ({
          wsConnections: { ...state.wsConnections, [type]: ws },
        }));
      },

      // Disconnect specific WebSocket
      disconnectWebSocket: (type) => {
        const ws = get().wsConnections[type];
        if (ws) {
          ws.close();
          set((state) => ({
            wsConnections: { ...state.wsConnections, [type]: null },
            connectedRoles: state.connectedRoles.filter(
              (role) => role !== type
            ),
          }));
          console.log(
            `[${type.toUpperCase()}] WebSocket manually disconnected.`
          );
        }
      },

      // Disconnect all WebSockets
      disconnectAll: () => {
        Object.entries(get().wsConnections).forEach(([type, ws]) => {
          if (ws) ws.close();
        });
        set({
          wsConnections: {
            issuer: null,
            verifier: null,
            holder: null,
          },
          connectedRoles: [],
        });
      },

      // Send message through specific WebSocket
      sendMessage: (type, topic, payload) => {
        const ws = get().wsConnections[type];
        if (!ws) {
          console.error(`[${type.toUpperCase()}] WebSocket not connected`);
          toast.error(`${type} connection not established`);
          return;
        }

        if (ws.readyState === WebSocket.OPEN) {
          const message = { topic, payload };
          ws.send(JSON.stringify(message));
          console.log(`[${type.toUpperCase()}] Sent message:`, topic, payload);
        } else {
          console.error(`[${type.toUpperCase()}] WebSocket not ready`);
          toast.error(`${type} connection not ready`);
        }
      },
      // Clear notifications
      clearNotification: (topic) => {
        set((state) => {
          const newNotifications = { ...state.notifications };
          delete newNotifications[topic];
          return { notifications: newNotifications };
        });
      },

      // Clear all state
      reset: () => {
        get().disconnectAll();
        set({
          messages: [],
          proofs: {},
          credentials: {},
          revocation: {},
          notifications: {},
          token: null,
        });
      },
    }),
    {
      name: "websocket-store",
      partialize: (state) => ({
        // Only persist these states
        messages: state.messages,
        proofs: state.proofs,
        credentials: state.credentials,
        revocation: state.revocation,
        notifications: state.notifications,
        token: state.token,
      }),
      storage: {
        getItem: (name) => {
          if (typeof window !== "undefined") {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          }
          return null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);

export default useWebSocketStore;
