import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  generateCredentialPayload,
  ProposalforCredential,
} from "../utils/helper";
const apiCall = async (method, endpoint, data = null) => {
  const userAccess = Cookies.get("userRole"); // Dynamically fetch role
  console.log(userAccess);
  const API_URLS = {
    admin: process.env.NEXT_PUBLIC_ISSUER_ENDPOINT,
    verifier: process.env.NEXT_PUBLIC_VERIFIER_ENDPOINT,
    user: process.env.NEXT_PUBLIC_HOLDER_ENDPOINT,
  };
  const baseUrl = API_URLS[userAccess] || "";
  console.log(baseUrl);
  try {
    const response = await axios[method](`${baseUrl}${endpoint}`, data);
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
      sendedMessage: [],
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
      Credential_state: [],
      singlePresentation: [],
      verifiedPresentation: [],
      showNotification: false,

      fetchConnection: async () => {
        set({ loading: true, error: null, successStatus: null });
        console.log("inside fetch connections");
        try {
          const data = await apiCall("get", `/connections`);
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
      sendMessage: async (id, content) => {
        set({ loading: true, error: null, successStatus: null });

        // Defensive check: Ensure sendedMessage is available and initialized
        const state = get().state;

        const newMessage = [...get().sendedMessage, content];
        try {
          // Simulate API call
          await apiCall("post", `/connections/${id}/send-message`, {
            content: content.message,
          });

          set({
            sendedMessage: newMessage, // Update the state with the new message
            loading: false,
            successStatus: true,
          });

          // Optionally show a success notification
          toast.success("Message sent successfully!");
        } catch (error) {
          set({
            error: error.message || "An error occurred.",
            loading: false,
            successStatus: false,
          });

          // Optionally show an error notification
          toast.error(
            error.message || "An error occurred while sending the message."
          );
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
          SingleCredential: [],
          showNotification: false,
        });
      },

      DeleteConnection: async (invi_msg_id) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          await apiCall("delete", `/connections/${invi_msg_id}`);
          set({ loading: false, successStatus: true });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      createInvitation: async () => {
        set({ loading: true, error: null, successStatus: null });
        try {
          console.log("inside create invitation");
          const Alias = sessionStorage.getItem("userName");
          const data = await apiCall("post", `/out-of-band/create-invitation`, {
            Alias,
            handshake_protocols: ["https://didcomm.org/didexchange/1.0"],
          });
          console.log("create invitation ", data);
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
            `/out-of-band/receive-invitation`,
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
          const data = await apiCall("post", `/didexchange/create-request`, {
            Alias,
          });
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
            `/didexchange/${id}/accept-request`,
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
          const response = await apiCall("post", `/schemas`, data);
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
          const response = await apiCall("get", `/schemas/created`);
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
          const response = await apiCall("get", `/schemas/${data}`);
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
          const response = await apiCall(
            "post",
            `/credential-definitions`,
            issuer
          );
          console.log(response);
          set({ loading: false, data: response, successStatus: true });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      getCredentialdefination: async (id) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          let data;
          if (id) {
            data = await apiCall("get", `/credential-definitions/created`, {
              schema_id: id,
            });
          } else {
            data = await apiCall("get", `/credential-definitions/created`);
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
            `/credential-definitions/${encodeURIComponent(data)}`
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
            `/issue-credential-2.0/send`,
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
      credentialProposal: async (formData) => {
        set({ loading: true, error: null, successStatus: null });
        const payload = ProposalforCredential(formData);
        console.log("payload is ", payload);
        try {
          const response = await apiCall(
            "post",
            `/issue-credential-2.0/send-proposal`,
            payload
          );

          console.log("response received", response);

          toast.success("Proposal sended Successfully");
          set({
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          toast.error("Failed to send proposal");
          set({ error: error.message, loading: false, successStatus: false });
        }
      },
      credentialRecords: async () => {
        set({ loading: true, error: null, successStatus: null });
        try {
          const data = await apiCall("get", `/credentials`);
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
            `/connections/${param}/send-message`,
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
          `/present-proof-2.0/records/${param}/credentials`
        );

        const CurrentCredential = response.data;
        set({
          RequestedCred: CurrentCredential,
          loading: false,
        }); // Update data and clear
      },
      fetchProofRequest: async (value) => {
        set({ loading: true, error: null, successStatus: null });

        // Prevent API call if state is not provided
        if (!value) {
          set({
            ProofRequests: [],
            singlePresentation: [],
            loading: false,
            successStatus: true,
          });
          return; // Exit early if value is not provided
        }

        try {
          const data = await apiCall(
            "get",
            `/present-proof-2.0/records?limit=100&offset=0&state=${value}`
          );
          set({
            ProofRequests: data.results,
            loading: false,
            successStatus: true,
          });
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },

      // fetching credential Request
      fetchCredRequest: async (value) => {
        set({ loading: true, error: null, successStatus: null });
        try {
          let data;
          if (value !== "") {
            data = await apiCall(
              "get",
              `/issue-credential-2.0/records?limit=100&offset=0&state=${value}`
            );
            set({
              Credential_state: data.results,
              loading: false,
              successStatus: true,
            });
          } else {
            set({
              Credential_state: [],

              loading: false,
              successStatus: true,
            });
          }
        } catch (error) {
          set({ error: error.message, loading: false, successStatus: false });
        }
      },
      fetchRequestedCredential: async (param) => {
        set({ loading: true, error: null });

        try {
          if (param !== "") {
            const response = await axios.get(
              `/issue-credential-2.0/records/${param}`
            );
            const CurrentCredential = response.data;
            set({
              SingleCredential: CurrentCredential,
              loading: false,
            });
          } else {
            set({ SingleCredential: [], loading: false });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      sendProofRequest: async (data) => {
        try {
          const response = await apiCall(
            "post",
            `/present-proof-2.0/send-request`,
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
            `/present-proof-2.0/records/${id}/send-presentation`,
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
            `/present-proof-2.0/records/${cred}`
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
            `/present-proof-2.0/records/${presentationId}/verify-presentation`
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

export default useStore;
