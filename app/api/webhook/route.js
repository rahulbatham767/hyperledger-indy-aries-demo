// app/api/webhook/route.js

import WebSocket from "ws";

const ACA_PY_WS_URL = "ws://127.0.0.1:8001/ws";

let ws;

export async function GET(req) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    ws = new WebSocket(ACA_PY_WS_URL);

    ws.on("open", () => {
      console.log("✅ Connected to ACA-Py WebSocket");
    });

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data);
        const { topic, payload } = message;
        console.log("📩 New Message Received:", topic, payload);
      } catch (error) {
        console.error("❌ Error parsing message:", error);
      }
    });

    ws.on("close", () => {
      console.log("🔌 WebSocket Connection Closed");
    });

    ws.on("error", (error) => {
      console.error("❌ WebSocket Error:", error);
    });
  }

  return Response.json({
    message: "WebSocket connection established and listening for messages.",
  });
}
