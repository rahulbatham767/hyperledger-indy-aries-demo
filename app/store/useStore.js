import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const userAccess = Cookies.get("userRole"); // Retrieve the user role from cookies
console.log("User Role:", userAccess); // Log the user role for debugging

let url;
if (userAccess === "admin") {
  console.log("Issuer End");
  url = "/api/issuer";
} else if (userAccess === "verifier") {
  console.log("Verifier End:", userAccess);
  url = "http://localhost:8031/out-of-band";
} else if (userAccess === "user") {
  console.log("Holder End:", userAccess);
  url = "/api/holder";
} else {
  console.log("Unknown user access type:", userAccess);
  // Handle unknown userAccess case if needed
}

// Log the selected URL for debugging
console.log("Selected URL:", url);

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
      proofRequest: [], // Holds the proof request data
      RequestedCred: [],
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
          const response = await axios.get(`${url}/connection`);
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
          get().setToast("Connections fetched successfully!", "success");
        } catch (error) {
          set({ error: error.message, loading: false });
          get().setToast("Failed to fetch connections.", "error");
        }
      },

      // Delete Connection
      DeleteConnection: async (invi_msg_id) => {
        set({ loading: true, error: null }); // Set loading state
        try {
          const response = await axios.delete(
            `${holderEnd}/connections/${invi_msg_id}`
          );

          console.log("connection response: " + response.data);

          set({
            loading: false,
          });

          // Correct use of get to call setToast
          get().setToast("Connection deleted successfully", "success");
        } catch (error) {
          set({ error: error.message, loading: false });
          get().setToast("Failed to delete connection.", "error");
        }
      },

      // Create Invitation
      createInvitation: async () => {
        set({ loading: true, error: null });
        try {
          const Alias = "Faber";
          const response = await axios.post(`${url}/create-invitation`, {
            Alias,
          });
          console.log("Invitation response:", response.data);

          set({
            Invitation: response.data,
            loading: false,
          });

          // Correct use of get to call setToast
          toast.success("🔗 Invitation Link Generated Successfully", {
            position: "top-right",
            autoClose: 5000,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
          toast("Failed to create invitation.", "error");
        }
      },

      RecieveInvitation: async (data) => {
        set({ loading: true, error: null });
        console.log("received Invitation" + url);
        try {
          const response = await axios.post(`${url}/receive-invitation`, {
            invitation: data,
          });
          console.log("data in store" + data);
          // const newInvitation = response.data;
          set({
            Invitation: response.data,
            loading: false,
          });

          toast.success("Invitation Accepted Successfully");
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
          const response = await axios.post(`${url}/create-schema`, { data });
          const newSchema = response.data;
          toast.success("Schema Created Successfully ");
          const currentSchema = get().Schemas || [];
          set({
            Schemas: [...currentSchema, newSchema],
            loading: false,
          });

          // Correct use of get to call setToast
        } catch (error) {
          toast.error("Failed to Create Schema " + error?.message);
          set({ error: error.message, loading: false });
        }
      },
      // Get Schema
      getSchema: async (data) => {
        set({ loading: true, error: null });
        console.log(data);

        try {
          const response = await axios.get(`${url}/create-schema`);
          const Schema_record = response.data;

          set({
            SchemaRecord: Schema_record,
            loading: false,
          });

          // Correct use of get to call setToast
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      getSchemaDetails: async (data) => {
        set({ loading: true, error: null });
        console.log(data);
        const schema_id = encodeURIComponent(data);
        console.log("schema_id", schema_id);
        try {
          const response = await axios.get(`${url}/create-schema`, {
            params: { schema_id: schema_id }, // Use params to pass query parameters
          });

          if (response && response.data) {
            const Schema_record = response.data;

            // Ensure the response is not empty before updating state
            if (Object.keys(Schema_record).length === 0) {
              throw new Error("Received empty schema data");
            }
            set({
              SchemaDetails: Schema_record.schema,
              loading: false,
            });
          } else {
            throw new Error("Received invalid or empty response");
          }
          // Correct use of get to call setToast
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      credentialDefination: async (issuer, get) => {
        set({ loading: true, error: null });
        console.log("zukeeper " + issuer);
        try {
          const response = await axios.post(`${url}/credential-defination`, {
            issuer,
          });
          toast.success("Credential Defination Created Successfully ");

          const CredentialDefinations = get.Defination() || [];
          const CurrentDefination = response.data;
          set({
            Defination: [...CredentialDefinations, CurrentDefination],
            loading: false,
          }); // Update data and clear loading
        } catch (error) {
          toast.success(
            "Failed to create Credential Defination" + error?.message
          );

          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },
      getCredentialdefination: async (get) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${url}/credential-defination`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          const credentialDefinition = response.data;
          console.log(credentialDefinition);
          set({
            Defination: [credentialDefinition],
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
            `${url}/credential-defination?cred_def_id=${encodedData}`, // Correct query parameter format
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

      issueCredential: async (formData, get) => {
        set({ loading: true, error: null });
        console.log("issue cred in store " + formData);
        try {
          const response = await axios.post(`${url}/credential-send`, {
            formData,
          });
          toast.success("Credenntial Issued Successfully");
          const issuedCredential = get().IssueCredentials || [];
          const CurrentCredential = response.data;
          set({
            issueCredential: [...issuedCredential, CurrentCredential],
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
          const response = await axios.get(` ${url}/credential`);

          const CurrentCredential = response.data.results;
          console.log("CurrentCredential  is", CurrentCredential);
          set({
            IssuedCredentials: CurrentCredential,
            loading: false,
          }); // Update data and clear loading
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },
      message: async (content, param) => {
        set({ loading: true, error: null });
        console.log(content, param);
        try {
          const response = await axios.post(`${url}/message`, {
            content,
            param,
          });
          const oldMessage = get().Message || [];
          const CurrentMessage = response.data;
          set({ Message: [...oldMessage, CurrentMessage], loading: false }); // Update data and clear loading
        } catch (error) {
          set({ error: error.message, loading: false }); // Update error state and clear loading
        }
      },
      fetchProofRequest: async () => {
        set({ loading: true, error: null });
        const response = await axios.get(
          "http://localhost:8001/present-proof-2.0/records"
        );

        console.log(response.data);

        const currentproof = response.data.results;
        set({
          proofRequest: currentproof,
          loading: false,
        }); // Update data and clear
      },
      fetchRequestedCred: async (param) => {
        set({ loading: true, error: null });
        const response = await axios.get(
          `http://localhost:8001/present-proof-2.0/records/${param}/credentials`
        );

        const OldCredential = get().RequestedCred || [];
        const CurrentCredential = response.data;
        set({
          RequestedCred: CurrentCredential,
          loading: false,
        }); // Update data and clear
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
