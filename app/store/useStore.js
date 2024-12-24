import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateCredentialPayload } from "../utils/helper";

const userAccess = Cookies.get("userRole"); // Retrieve the user role from cookies
console.log("User Role:", userAccess); // Log the user role for debugging

const API_URLS = {
  admin: process.env.NEXT_PUBLIC_ISSUER_ENDPOINT,
  verifier: process.env.NEXT_PUBLIC_VERIFIER_ENDPOINT,
  user: process.env.NEXT_PUBLIC_HOLDER_ENDPOINT,
};

const url = API_URLS[userAccess] || "";

const useStore = create(
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
      showNotification: false, // Flag to control showing notifications

      // addProofRequest: (request) => {
      //   set((state) => {
      //     const updatedRequests = [...state.proofRequests, request];
      //     // Show toast notification when a new proof request is added
      //     toast.info(`Proof Request Received: ${request.name}`, {
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //     });
      //     return { proofRequests: updatedRequests };
      //   });
      // },
      // fetchProofRequests: async () => {
      //   set({ loading: true, error: null }); // Start loading
      //   try {
      //     // Replace with your actual API endpoint
      //     const response = await axios.get("/api/proof-requests");

      //     if (response.data.requests) {
      //       set((state) => {
      //         // Adding the proof requests to the state
      //         const updatedRequests = [
      //           ...state.proofRequests,
      //           ...response.data.requests,
      //         ];
      //         return { proofRequests: updatedRequests };
      //       });

      //       // Show success notification for each request received
      //       response.data.requests.forEach((request) =>
      //         toast.info(`Proof Request Received: ${request.name}`, {
      //           position: "top-right",
      //           autoClose: 5000,
      //           hideProgressBar: false,
      //           closeOnClick: true,
      //           pauseOnHover: true,
      //           draggable: true,
      //         })
      //       );
      //     }
      //   } catch (error) {
      //     console.error("Error fetching proof requests:", error);
      //     set({ error: error.message });
      //     toast.error("Failed to fetch proof requests.", {
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //     });
      //   } finally {
      //     set({ loading: false }); // End loading
      //   }
      // },

      // Action to fetch data from an API
      fetchConnection: async () => {
        set({ loading: true, error: null }); // Set loading state
        try {
          const response = await axios.get(`${url}/connections`, {
            // Whether to auto-accept the connection request
            alias: sessionStorage.getItem("userName"), // Optional: Alias for the connection
          });
          console.log("connection response: " + response.data);

          const connect = response.data.results;
          console.log("Connections:", connect);

          const active = connect.filter((conn) => conn.state === "active");
          console.log("Active connections:", active);

          const pending = connect.filter((conn) => conn.state !== "active");
          console.log("Pending connections:", pending);

          set({
            connections: response.data,
            Active: active,
            Pending: pending,
            loading: false,
          });

          // Correct use of get to call setToast
          // toast.success("Connections fetched successfully!");
        } catch (error) {
          set({ error: error.message, loading: false });
          // toast.error("Failed to fetch connections.");
        }
      },

      // Delete Connection
      DeleteConnection: async (invi_msg_id) => {
        set({ loading: true, error: null }); // Set loading state
        try {
          const response = await axios.delete(
            `${url}/connections/${invi_msg_id}`
          );

          console.log("connection response: " + response.data);

          set({
            loading: false,
          });

          // Correct use of get to call setToast
          // toast.success("Connection deleted successfully");
        } catch (error) {
          set({ error: error.message, loading: false });
          // toast.error("Failed to delete connection.", error.message);
        }
      },

      // Create Invitation
      createInvitation: async () => {
        set({ loading: true, error: null });
        try {
          const Alias = sessionStorage.getItem("userName");
          const response = await axios.post(
            `${url}/out-of-band/create-invitation`,
            {
              Alias,
              handshake_protocols: ["https://didcomm.org/didexchange/1.0"],
            }
          );
          console.log("Invitation response:", response.data);

          set({
            Invitation: response.data,
            loading: false,
          });

          // Correct use of get to call setToast
          // toast.success("🔗 Invitation Link Generated Successfully", {
          //   position: "top-right",
          //   autoClose: 5000,
          // });
        } catch (error) {
          set({ error: error.message, loading: false });
          // toast("Failed to create invitation.", "error");
        }
      },

      RecieveInvitation: async (data) => {
        set({ loading: true, error: null });
        console.log("received Invitation" + url);
        try {
          const response = await axios.post(
            `${url}/out-of-band/receive-invitation`,

            data
          );
          console.log("data in store" + data);
          // const newInvitation = response.data;
          set({
            Invitation: response.data,
            loading: false,
          });

          // toast.success("Invitation Accepted Successfully");
          const router = useRouter();
          router.push("/connection/accept");
        } catch (error) {
          // toast.error("Error while Accepting Invitation");
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },
      // Create Schema
      createSchema: async (data) => {
        set({ loading: true, error: null });
        console.log("data in create schema", data);
        try {
          const response = await axios.post(`${url}/schemas`, data);
          const newSchema = response.data;
          // toast.success("Schema Created Successfully ");
          set({
            Schemas: newSchema,
            loading: false,
          });

          // Correct use of get to call setToast
        } catch (error) {
          // toast.error("Failed to Create Schema " + error?.message);
          set({ error: error.message, loading: false });
        }
      },
      // Get Schema
      getSchema: async () => {
        set({ loading: true, error: null });

        try {
          const response = await axios.get(`${url}/schemas/created`);
          const Schema_record = response.data;
          // toast.success("Schema Fetched Successfully");
          set({
            SchemaRecord: Schema_record,
            loading: false,
          });

          // Correct use of get to call setToast
        } catch (error) {
          // toast.error("Failed To Fetched Schema", error.message);
          set({ error: error.message, loading: false });
        }
      },
      getSchemaDetails: async (data) => {
        set({ loading: true, error: null });
        console.log(data);
        const schema_id = encodeURIComponent(data);
        console.log("schema_id", schema_id);
        try {
          const response = await axios.get(`${url}/schemas/${data}`);

          if (response && response.data) {
            const Schema_record = response.data;

            // Ensure the response is not empty before updating state
            if (Object.keys(Schema_record).length === 0) {
              toast.error("Received empty schema data");
              throw new Error("Received empty schema data");
            }
            set({
              SchemaDetails: Schema_record.schema,
              loading: false,
            });
          } else {
            toast.error("Received invalid or empty response");
            throw new Error("Received invalid or empty response");
          }
          toast.success("Schema Fetched Successfully");
          // Correct use of get to call setToast
        } catch (error) {
          toast.error("Failed to Fetch Schema");
          set({ error: error.message, loading: false });
        }
      },
      credentialDefination: async (issuer, get) => {
        set({ loading: true, error: null });
        console.log("credential Defination ", issuer);
        try {
          const response = await axios.post(
            `${url}/credential-definitions`,
            issuer
          );
          // toast.success("Credential Defination Created Successfully ");

          set({
            loading: false,
          }); // Update data and clear loading
        } catch (error) {
          // toast.success(
          //   "Failed to create Credential Defination " + error?.message
          // );

          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },
      getCredentialdefination: async (get) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(
            `${url}/credential-definitions/created`
          );
          const credentialDefinition = response.data;
          console.log(credentialDefinition);
          set({
            Defination: credentialDefinition,
            loading: false,
          }); // Update data and clear loading
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },
      getDefinationLedger: async (data) => {
        set({ loading: true, error: null });
        try {
          const encodedData = encodeURIComponent(data); // Ensure data is encoded properly
          const response = await axios.get(
            `${url}/credential-defination/${encodedData}`, // Correct query parameter format
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const credentialDefinition = response.data;
          console.log(credentialDefinition);
          set({
            credDefination: credentialDefinition,
            loading: false,
          }); // Update data and clear loading
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },

      issueingCredential: async (formData) => {
        set({ loading: true, error: null });
        console.log("issue cred in store ", formData);

        const payload = generateCredentialPayload(formData);
        console.log("Payload is", JSON.stringify(payload));

        try {
          const response = await axios.post(
            `${url}/issue-credential-2.0/send`,

            payload
          );
          toast.success("Credential Issued Successfully");
          const CurrentCredential = response.data;
          set({
            IssuedCredentials: CurrentCredential,
            loading: false,
          }); // Update data and clear loading
        } catch (error) {
          toast.error("Failed to Issue credential");
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },
      credentialRecords: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(` ${url}/credentials`);

          const CurrentCredential = response.data.results;
          console.log("CurrentCredential  is", CurrentCredential);
          // toast.success("Credenntial Fetched Successfully");
          set({
            IssuedCredentials: CurrentCredential,
            loading: false,
          }); // Update data and clear loading
        } catch (error) {
          // toast.error("Failed to Fetch Credential");

          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },
      message: async (content, param) => {
        set({ loading: true, error: null });
        console.log(content, param);
        if (!param || !content) {
          toast.error("Connection ID and message content are required.");
          throw new Error(
            { error: "Connection ID and message content are required." },
            { status: 400 }
          );
        }
        try {
          const response = await axios.post(
            `${url}/connections/${param}/send-message`, // ACA-Py Agent API URL
            { content }, // Message content payload
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const oldMessage = get().Message || [];
          const CurrentMessage = response.data;
          set({ Message: [...oldMessage, CurrentMessage], loading: false }); // Update data and clear loading
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },
      fetchProofRequest: async () => {
        set({ loading: true, error: null });
        const response = await axios.get(`${url}/present-proof-2.0/records`);

        console.log(response.data);

        const currentproof = response.data.results;
        const receiveProof = currentproof.filter(
          (proof) => proof.state === "presentation-received"
        );
        const presentationProof = currentproof.filter(
          (proof) => proof.state == "presentation-sent"
        );

        set({
          proofRequest: currentproof,
          ReceieveProof: receiveProof,
          Presentation: presentationProof,

          loading: false,
        }); // Update data and clear
      },
      fetchRequestedCred: async (param) => {
        set({ loading: true, error: null });
        const response = await axios.get(
          `${url}/present-proof-2.0/records/${param}/credentials`
        );

        const OldCredential = get().RequestedCred || [];
        const CurrentCredential = response.data;
        set({
          RequestedCred: CurrentCredential,
          loading: false,
        }); // Update data and clear
      },
      sendProofRequest: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${url}/present-proof-2.0/send-request`,
            data
          );
          console.log("Proof request sent: ", response.data);

          set({
            ProofRequests: response.data,
            loading: false,
          });
          toast.success("Proof request sent successfully");
        } catch (error) {
          set({ error: error.message, loading: false });
          toast.success("Failed to sent proof request", error.message);
        }
      },
      sendPresentation: async (data, id) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${url}/present-proof-2.0/records/${id}/send-presentation`,
            data
          );
          console.log("Proof request sent: ", response.data);

          set({
            Presentation: response.data,
            loading: false,
          });
          toast.success("Proof request sent successfully");
        } catch (error) {
          set({ error: error.message, loading: false });
          toast.success("Failed to sent proof request", error.message);
        }
      },
      fetchSinglePresentation: async (id) => {
        console.log("single id ", id);

        const cred = id.replace(/"/g, ""); // Remove all double quotes

        set({ loading: true, error: null });

        try {
          const response = await axios.get(
            `${url}/present-proof-2.0/records/${cred}`
          );

          set({
            singlePresentation: response.data,
            loading: false,
          });
          toast.success("Proof Fetched successfully");
        } catch (error) {
          set({ error: error.message, loading: false });
          toast.success("Failed to sent proof request", error.message);
        }
      },
      verifyPresentation: async (presentationId) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${url}/present-proof-2.0/records/${presentationId}/verify-presentation`
          );
          const CurrentVerified = response.data;
          const OldVerified = [...get().verifiedPresentation];
          console.log("Presentation verified: ", response.data);
          set({
            loading: false,
            verifiedPresentation: [OldVerified, CurrentVerified],
          });
          toast("✔ Presentation verified successfully");
        } catch (error) {
          set({ error: error.message, loading: false });
          toast.error(" Failed to verify Presentation");
        }
      },
    }),
    {
      name: "issuer storage",
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

const unpersistState = () => {
  useStore.setState((state) => {
    const { SchemaDetails, credDefination, ...otherState } = state; // Remove SchemaDetails
    useStore.persist.setStorage((storage) => {
      // Remove only 'SchemaDetails' from the persisted storage
      const persistedState = JSON.parse(
        storage.getItem("issuer storage") || "{}"
      );
      delete persistedState.SchemaDetails; // Remove SchemaDetails
      storage.setItem("issuer storage", JSON.stringify(persistedState));
      return storage;
    });
    return { ...otherState }; // Update state without SchemaDetails
  });
};

if (typeof window !== "undefined") {
  window.store = useStore; // Debugging aid
}

export default useStore;
