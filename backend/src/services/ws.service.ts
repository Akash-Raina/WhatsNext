import { WebSocket, WebSocketServer } from "ws";
import getUserFingerprint from "../utils/userFingerPrint";
import {IncomingMessage} from 'http'
import { authenticateWebSocket } from "../middlewares/authenticateWebsocket";

export const rooms = new Map<string, Set<WebSocket>>();

export const handleWebSocketConnection = async(ws: WebSocket, req: IncomingMessage) => {

  const params = new URLSearchParams(req.url?.split("?")[1]);
  const roomCode = params.get("roomcode");
  const username = req.headers["username"] || "unknown";
  const authenticated = await authenticateWebSocket(req);
  if (!authenticated) {
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

  ws.on("close", () => {
    console.log(`User ${username} left room: ${roomCode}`);
    rooms.get(roomCode)?.delete(ws);
    if (rooms.get(roomCode)?.size === 0) {
      rooms.delete(roomCode);
    }
  });
};
