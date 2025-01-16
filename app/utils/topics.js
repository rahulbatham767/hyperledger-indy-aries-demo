export function topics(topic, payload, set) {
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

      case "proofs":
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
