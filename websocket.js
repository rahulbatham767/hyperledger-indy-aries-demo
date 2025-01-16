// websocket.js (ES Module)
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8002 });

wss.on("connection", (ws) => {
  console.log("Client connected!");

  ws.on("message", (message) => {
    console.log("Received:", message.toString()); // Convert Buffer to String
    ws.send(`Echo from server: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("✅ WebSocket server running on ws://localhost:8002");
