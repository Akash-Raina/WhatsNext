import { WebSocket, WebSocketServer } from "ws";
import getUserFingerprint from "../utils/userFingerPrint";
import {IncomingMessage} from 'http'
import { authenticateWebSocket } from "../middlewares/authenticateWebsocket";

const rooms = new Map<string, Set<WebSocket>>();

export const handleWebSocketConnection = async(ws: WebSocket, req: IncomingMessage) => {

  const params = new URLSearchParams(req.url?.split("?")[1]);
  const roomCode = params.get("roomcode");
  const username = req.headers["username"] || "unknown";
  const check = await authenticateWebSocket(req);
  if (!check) {
    ws.close(1008, "Authentication failed");
    return;
}

  if (!roomCode) {
    ws.close();
    return;
  }

  console.log(`User ${username} joined room: ${roomCode}`);

  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, new Set());
  }

  rooms.get(roomCode)?.add(ws);

  ws.on("message", (message) => {
    rooms.get(roomCode)?.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ user: username, message: message.toString() }));
      }
    });
  });

  ws.on("close", () => {
    console.log(`User ${username} left room: ${roomCode}`);
    rooms.get(roomCode)?.delete(ws);
  });
};
