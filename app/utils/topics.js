import { toast } from "react-toastify";
import { getCredentialID, getRequestCredential } from "./helper";

export async function topics(topic, payload, set) {
  try {
    // Handling each Hyperledger Aries topic
    switch (topic) {
      case "connections":
        set((state) => {
          const updatedConnections = {
            ...state.connections,
            [topic]: [...(state.connections[topic] || []), payload],
          };
          const updatedNotifications = {
            ...state.notifications,
            [topic]: `New connection event: ${payload}`,
          };

          return {
            connections: updatedConnections,
            notifications: updatedNotifications,
          };
        });
        break;

      case "basicmessages":
        console.log("basicmessages", payload);
        set((state) => {
          // const updatedMessages = [
          //   ...state.messages,
          //   payload, // Only push the payload for the 'messages' topic
          // ];
          const newmsg = payload.content;
          const updatedNotifications = {
            ...state.notifications,
            [topic]: `New message:${payload}`,
          };

          return {
            recievedMessage: newmsg, // Messages handled separately
            notifications: updatedNotifications,
          };
        });
        break;

      case "present_proof_v2_0":
        toast.success("Proof Request Received", payload);
        if (payload?.state === "request-received") {
          try {
            const id = await getCredentialID();
            console.log("Credential ID:", id);

            const extractCred = await getRequestCredential(id);
            console.log("Extracted Credential:", extractCred);

            if (!extractCred) {
              console.error("❌ Failed to extract credentials");
              toast.error("Failed to extract credentials.");
              return;
            }

            const handleApprove = (t) => {
              console.log("Approved:", extractCred);
              console.log("Verifier: Proof verification successful", payload);
              toast.dismiss(t.id);
              toast.success("✅ Proof Approved");
            };

            const handleReject = (t) => {
              console.log("Rejected:", extractCred);
              deleteCredentialRequest(id);
              toast.dismiss(t.id);
              toast.error("❌ Proof Rejected");
            };

            toast(
              (t) => (
                <div>
                  <h3>Proof Request Approval</h3>
                  <p>
                    This website requested these fields from your credential:
                  </p>
                  <div
                    style={{
                      background: "#f4f4f4",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <p>
                      <strong>Name:</strong> {extractCred.name}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong> {extractCred.dob}
                    </p>
                    <p>
                      <strong>Email:</strong> {extractCred.email}
                    </p>
                    <p>
                      <strong>Credential Number:</strong>{" "}
                      {extractCred.credentialNo}
                    </p>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => handleApprove(t)}
                      style={{
                        marginRight: "10px",
                        backgroundColor: "green",
                        color: "white",
                        borderRadius: "5px",
                        padding: "8px 16px",
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(t)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "5px",
                        padding: "8px 16px",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ),
              { position: "top-center", autoClose: false, closeOnClick: false }
            );
          } catch (error) {
            console.error("Error handling proof request:", error);
            toast.error("Error processing proof request.");
          }
        }

        set((state) => {
          const updatedProofs = {
            ...state.proofs,
            [topic]: [...(state.proofs[topic] || []), payload],
          };
          const updatedNotifications = {
            ...state.notifications,
            [topic]: `Proof event: ${payload}`,
          };

          return {
            proofs: updatedProofs,
            notifications: updatedNotifications,
          };
        });
        break;

      case "credentials":
        set((state) => {
          const updatedCredentials = {
            ...state.credentials,
            [topic]: [...(state.credentials[topic] || []), payload],
          };
          const updatedNotifications = {
            ...state.notifications,
            [topic]: `Credential event: ${payload}`,
          };

          return {
            credentials: updatedCredentials,
            notifications: updatedNotifications,
          };
        });
        break;

      case "revocation":
        set((state) => {
          const updatedRevocation = {
            ...state.revocation,
            [topic]: [...(state.revocation[topic] || []), payload],
          };
          const updatedNotifications = {
            ...state.notifications,
            [topic]: `Revocation event: ${payload}`,
          };

          return {
            revocation: updatedRevocation,
            notifications: updatedNotifications,
          };
        });
        break;

      default:
        console.log("Unknown topic received:", topic);
        break;
    }

    console.log(`📩 New Message Received for topic: ${topic}`, payload);
  } catch (error) {
    console.error("❌ Error parsing message:", error);
  }
}
