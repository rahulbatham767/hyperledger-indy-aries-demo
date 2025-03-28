import { toast } from "react-toastify";
import { getCredentialID, getRequestCredential } from "./helper";

export async function topics(topic, payload, set, agentType) {
  try {
    // Route to appropriate handler based on agent type
    console.log(
      `[${agentType.toUpperCase()}] 📩 New Message Received for topic: ${topic}`,
      payload
    );
  } catch (error) {
    console.error(
      `[${agentType.toUpperCase()}] ❌ Error processing ${topic}:`,
      error
    );
    toast.error(`Error processing ${topic}`);
  }
}

// Issuer-specific topic handlers
export async function handleIssuerTopics(topic, payload, set) {
  switch (topic) {
    case "connections":
      set((state) => ({
        connections: {
          ...state.connections,
          [topic]: [...(state.connections[topic] || []), payload],
        },
        notifications: {
          ...state.notifications,
          [`issuer_${topic}`]: `New issuer connection: ${payload.connection_id}`,
        },
      }));
      toast.success(`New connection established as issuer`);
      break;

    case "credentials":
      if (payload.state === "credential_issued") {
        set((state) => ({
          credentials: {
            ...state.credentials,
            [payload.credential_id]: payload,
          },
          notifications: {
            ...state.notifications,
            [`issuer_credential_issued`]: `Credential issued: ${payload.credential_id}`,
          },
        }));
        toast.success(
          `Credential ${payload.credential_id} issued successfully`
        );
      }
      break;

    case "revocation":
      set((state) => ({
        revocation: {
          ...state.revocation,
          [payload.revocation_id]: payload,
        },
        notifications: {
          ...state.notifications,
          [`issuer_revocation`]: `Revocation processed: ${payload.revocation_id}`,
        },
      }));
      toast.warning(`Credential revoked: ${payload.revocation_id}`);
      break;

    default:
      console.log(`[ISSUER] Unhandled topic: ${topic}`);
      break;
  }
}

// Verifier-specific topic handlers
export async function handleVerifierTopics(topic, payload, set) {
  switch (topic) {
    case "present_proof_v2_0":
      if (payload.state === "request-sent") {
        set((state) => ({
          proofs: {
            ...state.proofs,
            [payload.presentation_exchange_id]: payload,
          },
          notifications: {
            ...state.notifications,
            [`verifier_proof_requested`]: `Proof request sent: ${payload.presentation_exchange_id}`,
          },
        }));
        toast.info(`Proof request ${payload.presentation_exchange_id} sent`);
      } else if (payload.state === "verified") {
        set((state) => ({
          proofs: {
            ...state.proofs,
            [payload.presentation_exchange_id]: payload,
          },
          notifications: {
            ...state.notifications,
            [`verifier_proof_verified`]: `Proof verified: ${payload.presentation_exchange_id}`,
          },
        }));
        toast.success(`Proof ${payload.presentation_exchange_id} verified`);
      }
      break;

    case "connections":
      set((state) => ({
        connections: {
          ...state.connections,
          [topic]: [...(state.connections[topic] || []), payload],
        },
        notifications: {
          ...state.notifications,
          [`verifier_connection`]: `New verifier connection: ${payload.connection_id}`,
        },
      }));
      break;

    default:
      console.log(`[VERIFIER] Unhandled topic: ${topic}`);
      break;
  }
}

// Holder-specific topic handlers
export async function handleHolderTopics(topic, payload, set) {
  switch (topic) {
    case "present_proof_v2_0":
      if (payload?.state === "request-received") {
        try {
          const id = await getCredentialID();
          const extractCred = await getRequestCredential(id);

          if (!extractCred) {
            console.error("❌ Failed to extract credentials");
            toast.error("Failed to extract credentials.");
            return;
          }

          toast(
            ({ id: toastId }) => (
              <ProofRequestToast
                extractCred={extractCred}
                toastId={toastId}
                onApprove={() => handleProofApprove(toastId, extractCred)}
                onReject={() => handleProofReject(toastId, id)}
              />
            ),
            { position: "top-center", autoClose: false, closeOnClick: false }
          );

          set((state) => ({
            proofs: {
              ...state.proofs,
              [payload.presentation_exchange_id]: payload,
            },
            notifications: {
              ...state.notifications,
              [`holder_proof_request`]: `New proof request received`,
            },
          }));
        } catch (error) {
          console.error("Error handling proof request:", error);
          toast.error("Error processing proof request.");
        }
      }
      break;

    case "credentials":
      if (payload.state === "credential_received") {
        set((state) => ({
          credentials: {
            ...state.credentials,
            [payload.credential_id]: payload,
          },
          notifications: {
            ...state.notifications,
            [`holder_credential`]: `New credential received: ${payload.credential_id}`,
          },
        }));
        toast.success(`New credential ${payload.credential_id} received`);
      }
      break;

    case "basicmessages":
      set((state) => ({
        receivedMessage: payload.content,
        notifications: {
          ...state.notifications,
          [`holder_message`]: `New message received`,
        },
      }));
      break;

    default:
      console.log(`[HOLDER] Unhandled topic: ${topic}`);
      break;
  }
}

// Helper components and functions
function ProofRequestToast({ extractCred, toastId, onApprove, onReject }) {
  return (
    <div>
      <h3>Proof Request Approval</h3>
      <p>This website requested these fields from your credential:</p>
      <div className="credential-display">
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
          <strong>Credential Number:</strong> {extractCred.credentialNo}
        </p>
      </div>
      <div className="button-group">
        <button className="approve-btn" onClick={onApprove}>
          Approve
        </button>
        <button className="reject-btn" onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
}

async function handleProofApprove(toastId, extractCred) {
  console.log("Approved:", extractCred);
  toast.dismiss(toastId);
  toast.success("✅ Proof Approved");
  // Additional approval logic here
}

async function handleProofReject(toastId, credentialId) {
  console.log("Rejected:", credentialId);
  await deleteCredentialRequest(credentialId);
  toast.dismiss(toastId);
  toast.error("❌ Proof Rejected");
}
