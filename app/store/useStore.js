import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateCredentialPayload } from "../utils/helper";

const userAccess = Cookies.get("userRole"); // Retrieve the user role from cookies
// const userAccess = localStorage.getItem("userRole"); // Retrieve the user role from cookies

const API_URLS = {
  admin: process.env.NEXT_PUBLIC_ISSUER_ENDPOINT,
  verifier: process.env.NEXT_PUBLIC_VERIFIER_ENDPOINT,
  user: process.env.NEXT_PUBLIC_HOLDER_ENDPOINT,
};

const url = API_URLS[userAccess] || "";

const apiCall = async (method, url, data = null) => {
  try {
    const response = await axios[method](url, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Something went wrong");
  }
};

const useStore = create(
  persist(
    (set, get) => ({
      data: [],
      loading: false,
      error: null,
      connections: [],
      Active: [],
      Pending: [],
      Invitation: [],
      Invited: [],
      SchemaDetails: [],
      IssuedCredentials: [],
      credDefination: [],
      newSchema: [],
      Schemas: [],
      SchemaRecord: [],
      Defination: [],
      Message: [],
      ProofRequests: [],
      Presentations: [],
      ReceieveProof: [],
      RequestedCred: [],
      singlePresentation: [],
      verifiedPresentation: [],
      showNotification: false,

      fetchConnection: async () => {
        set({ loading: true, error: null, successStatus: null });
        try {
          const data = await apiCall("get", `${url}/connections`);
          const active = data.results.filter((conn) => conn.state === "active");
          const pending = data.results.filter(
            (conn) => conn.state !== "active"
          );

          set({
            connections: data,
            Active: active,
            Pending: pending,
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },
      reset: (set) => {
        set({
          data: [],
          loading: false,
          error: null,
          connections: [],
          Active: [],
          Pending: [],
          Invitation: [],
          Invited: [],
          SchemaDetails: [],
          IssuedCredentials: [],
          credDefination: [],
          newSchema: [],
          Schemas: [],
          SchemaRecord: [],
          Defination: [],
          Message: [],
          ProofRequests: [],
          Presentations: [],
          ReceieveProof: [],
          RequestedCred: [],
          singlePresentation: [],
          verifiedPresentation: [],
          showNotification: false,
        });
      },

      DeleteConnection: async (invi_msg_id) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          await apiCall("delete", `${url}/connections/${invi_msg_id}`);
          set({ loading: false, successStatus: true });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      createInvitation: async () => {
        set({ loading: true, error: null, successStatus: null });
        try {
          console.log(url);
          const Alias = sessionStorage.getItem("userName");
          const data = await apiCall(
            "post",
            `${url}/out-of-band/create-invitation`,
            {
              Alias,
              handshake_protocols: ["https://didcomm.org/didexchange/1.0"],
            }
          );
          set({
            Invitation: data,
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      RecieveInvitation: async (data) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          const response = await apiCall(
            "post",
            `${url}/out-of-band/receive-invitation`,
            data
          );
          set({
            Invitation: response,
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          console.log("error message in receive", error.message);
          set({ error: error.message, loading: false, successStatus: false });
        }
      },
      DidInviter: async (id) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          const Alias = sessionStorage.getItem("userName");
          const data = await apiCall(
            "post",
            `${url}/didexchange/create-request`,
            {
              Alias,
            }
          );
          set({
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      DidReciever: async (id) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          const response = await apiCall(
            "post",
            `${url}/didexchange/${id}/accept-request`,
            id
          );
          set({
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          console.log("error message in receive", error.message);
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      createSchema: async (data) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          const response = await apiCall("post", `${url}/schemas`, data);
          set({
            Schemas: response,
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      getSchema: async () => {
        set({ loading: true, error: null, successStatus: null });
        try {
          const response = await apiCall("get", `${url}/schemas/created`);
          set({
            SchemaRecord: response,
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      getSchemaDetails: async (data) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          const response = await apiCall("get", `${url}/schemas/${data}`);
          set({
            SchemaDetails: response.schema,
            loading: false,
            successStatus: true,
          });
          toast.success("Schema Fetched Successfully");
        } catch (error) {
          toast.error("Failed to Fetch Schema");
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      credentialDefination: async (issuer) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          await apiCall("post", `${url}/credential-definitions`, issuer);
          set({ loading: false, successStatus: true });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      getCredentialdefination: async (id) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          let data;
          if (id) {
            data = await apiCall(
              "get",
              `${url}/credential-definitions/created`,
              { schema_id: id }
            );
          } else {
            data = await apiCall(
              "get",
              `${url}/credential-definitions/created`
            );
          }
          set({
            Defination: data,
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      getDefinationLedger: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(
            `${url}/credential-definitions/${encodeURIComponent(data)}`
          );
          set({
            credDefination: response.data,
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      issueingCredential: async (formData) => {
        set({ loading: true, error: null, successStatus: null });
        const payload = generateCredentialPayload(formData);
        try {
          const response = await apiCall(
            "post",
            `${url}/issue-credential-2.0/send`,
            payload
          );
          toast.success("Credential Issued Successfully");
          set({
            IssuedCredentials: response,
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          toast.error("Failed to Issue credential");
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      credentialRecords: async () => {
        set({ loading: true, error: null, successStatus: null });
        try {
          const data = await apiCall("get", `${url}/credentials`);
          set({
            IssuedCredentials: data.results,
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      message: async (content, param) => {
        set({ loading: true, error: null, successStatus: null });
        if (!param || !content) {
          toast.error("Connection ID and message content are required.");
          throw new Error("Connection ID and message content are required.");
        }
        try {
          const response = await apiCall(
            "post",
            `${url}/connections/${param}/send-message`,
            { content }
          );
          set({
            Message: [...get().Message, response],
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },
      fetchRequestedCred: async (param) => {
        set({ loading: true, error: null });
        const response = await axios.get(
          `${url}/present-proof-2.0/records/${param}/credentials`
        );

        const CurrentCredential = response.data;
        set({
          RequestedCred: CurrentCredential,
          loading: false,
        }); // Update data and clear
      },
      fetchProofRequest: async (value) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          let data;
          if (value !== "") {
            data = await apiCall(
              "get",
              `${url}/present-proof-2.0/records?limit=100&offset=0&state=${value}`
            );
            set({
              ProofRequests: data.results,
              loading: false,
              successStatus: true,
            });
          } else {
            set({
              ProofRequests: [],
              singlePresentation: [],
              loading: false,
              successStatus: true,
            });
          }
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },
      sendProofRequest: async (data) => {
        try {
          const response = await apiCall(
            "post",
            `${url}/present-proof-2.0/send-request`,
            data
          );
          console.log(response);
          set({
            loading: false,
          });
          toast.success("Proof request sent successfully");
        } catch (error) {
          set({ loading: false });
          toast.error("Failed to send proof request");
        }
      },

      // Send presentation
      sendPresentation: async (data, id) => {
        try {
          const response = await apiCall(
            "post",
            `${url}/present-proof-2.0/records/${id}/send-presentation`,
            data
          );
          set({
            Presentation: response,
            loading: false,
          });
          toast.success("Presentation request sent successfully");
        } catch (error) {
          set({ loading: false });
          toast.error("Failed to send Presentation request");
        }
      },

      // Fetch single presentation
      fetchSinglePresentation: async (id) => {
        const cred = id.replace(/"/g, ""); // Remove all double quotes
        try {
          const response = await apiCall(
            "get",
            `${url}/present-proof-2.0/records/${cred}`
          );
          set({
            singlePresentation: response,
            loading: false,
          });
          toast.success("Proof fetched successfully");
        } catch (error) {
          set({ loading: false });
          toast.error("Failed to fetch proof");
        }
      },

      // Verify presentation
      verifyPresentation: async (presentationId) => {
        try {
          const response = await apiCall(
            "post",
            `${url}/present-proof-2.0/records/${presentationId}/verify-presentation`
          );
          const CurrentVerified = response;
          const OldVerified = [...get().verifiedPresentation];
          set({
            loading: false,
            verifiedPresentation: [OldVerified, CurrentVerified],
          });
          toast.success("✔ Presentation verified successfully");
        } catch (error) {
          set({ loading: false });
          toast.error("Failed to verify presentation");
        }
      },
    }),
    {
      name: "issuer-storage",
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
      onRehydrateStorage: (state) => {
        console.log("State has been hydrated from storage!");
        if (state) {
          state.singlePresentation = []; // Reset the `user` state to null on refresh
          state.Invited = [];
          state.SchemaDetails = [];
          state.Invitation = [];
        }
      },
    }
  )
);

if (typeof window !== "undefined") {
  window.store = useStore; // Debugging aid
}

export default useStore;
