import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Holder End
const url = "/api/holder";

const useHolder = create(
  persist(
    (set, get) => ({
      data: [], // Initial state for data
      loading: false, // Initial loading state
      error: null, // Initial error state
      connections: [],
      Active: [],
      Pending: [],
      Invitation: [],
      Invited: [],
      IssuedCredentials: [],
      Schemas: [],
      Defination: [],
      Message: [],

      // Action to fetch data from an API
      fetchConnection: async () => {
        set({ loading: true, error: null }); // Set loading state
        try {
          const response = await axios.get(`${url}/connection`);
          const connection = response.data;
          const active = connection.filter((conn) => conn.state === "active");
          const pending = connection.filter((conn) => conn.state != "active");
          console.log("response of fetching connection: " + response.data);
          console.log("fetch active " + active);
          console.log("fetch pending " + pending);

          set({
            connections: response.data,
            Active: active,
            Pending: pending,
            loading: false,
          }); // Update data and clear loading
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },

      createInvitation: async (Alias) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(` ${url}/create-invitation`, Alias);
          console.log("data in store" + data);
          // const newInvitation = response.data;
          set({
            Invitation: response.data,
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },
      RecieveInvitation: async (data) => {
        set({ loading: true, error: null });
        console.log("received Invitation " + data);
        try {
          const response = await axios.post(` ${url}/receive-invitation`, {
            invitation: data,
          });
          console.log("data in store" + data);
          // const newInvitation = response.data;
          set({
            Invitation: response.data,
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },

      createSchema: async (data, get) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${url}/create-schema`, data);
          const newSchema = response.data;
          const currentSchema = get().Schemas || [];
          set({ Schemas: [...currentSchema, newSchema], loading: false }); // Update data and clear loading
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },

      credentialDefination: async (data, get) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${url}/credential-defination`,
            data
          );
          const CredentialDefinations = get.Defination() || [];
          const CurrentDefination = response.data;
          set({
            Defination: [...CredentialDefinations, CurrentDefination],
            loading: false,
          }); // Update data and clear loading
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },

      issueCredential: async (issuer, get) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(` ${url}/credential-send`, issuer);

          const issuedCredential = get().IssueCredentials || [];
          const CurrentCredential = response.data;
          set({
            issueCredential: [...issuedCredential, CurrentCredential],
            loading: false,
          }); // Update data and clear loading
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },

      message: async (content, param) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${url}/message/:conn_id=${param}`,
            content
          );
          const oldMessage = get().Message || [];
          const CurrentMessage = response.data;
          set({ Message: [...oldMessage, CurrentMessage], loading: false }); // Update data and clear loading
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },

      // Action to reset the state
      reset: () => set({ data: [], loading: false, error: null }),
    }),
    {
      name: "Holder storage",
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
  window.store = useHolder; // Debugging aid
}

export default useHolder;
