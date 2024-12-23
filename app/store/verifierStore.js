import axios from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Verifier End

const userAccess = Cookies.get("userRole"); // Retrieve the user role from cookies
console.log("User Role:", userAccess); // Log the user role for debugging
let url;

if (userAccess === "verifier") {
  url = "http://localhost:8031";
}

const verifierStore = create(
  persist(
    (set, get) => ({
      verifiedData: [], // Initial state for data
      loading: false, // Initial loading state
      error: null, // Initial error state
      connections: [],
      Active: [],
      Pending: [],
      ProofRequests: [],
      Presentations: [],
      Messages: [],

      // Action to fetch connections
      fetchConnection: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${url}/connections`);
          const connections = response.data.results;
          console.log(" connections are ", connections);
          const active = connections.filter((conn) => conn.state === "active");
          const pending = connections.filter((conn) => conn.state !== "active");
          console.log("Connections fetched: ", connections);

          set({
            connections: connections,
            Active: active,
            Pending: pending,
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // Action to send a proof request
      sendProofRequest: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${url}/present-proof-2.0/send-request`,
            data
          );
          console.log("Proof request sent: ", response.data);
          const currentProofRequests = get().ProofRequests || [];
          set({
            ProofRequests: [...currentProofRequests, response.data],
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // Action to receive a presentation
      receivePresentation: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${url}/receive-presentation`,
            data
          );
          console.log("Presentation received: ", response.data);
          const currentPresentations = get().Presentations || [];
          set({
            Presentations: [...currentPresentations, response.data],
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // Action to verify a presentation
      verifyPresentation: async (presentationId) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${url}/verify-presentation`, {
            presentationId,
          });
          console.log("Presentation verified: ", response.data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // Messaging action (optional for verifier communications)
      sendMessage: async (content, connId) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${url}/message/${connId}`,
            content
          );
          const oldMessages = get().Messages || [];
          const newMessage = response.data;
          set({
            Messages: [...oldMessages, newMessage],
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // Reset state
      reset: () => set({ data: [], loading: false, error: null }),
    }),
    {
      name: "Verifier storage",
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

if (typeof window !== "undefined") {
  window.store = verifierStore; // Debugging aid
}

export default verifierStore;
