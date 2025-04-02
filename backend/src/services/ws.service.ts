import { WebSocket, WebSocketServer } from "ws";
import getUserFingerprint from "../utils/userFingerPrint";
import {IncomingMessage} from 'http'
import { authenticateWebSocket } from "../middlewares/authenticateWebsocket";
import { Song } from "../types/customRequest";
import { getUpdatedQueue } from "./user.service";

interface RoomData{
  client: Set<WebSocket>,
  queue: Song[]
}

export const rooms = new Map<string, RoomData>();

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
    rooms.set(roomCode, {queue: [], client: new Set()});
  }

  const room = rooms.get(roomCode);
  console.log(room);
  if(!room) return;

  room.client.add(ws);

  const updatedQueue = await getUpdatedQueue(roomCode)
  
  ws.send(JSON.stringify({type:"queueUpdate", queue: updatedQueue}));

//   ws.on("message", async (data) => {
//     try {
//       const message = JSON.parse(data.toString());
  
//       if (message.type === "requestQueue") {
//         const roomCode = message.roomCode;
//         const queue = await getUpdatedQueue(roomCode);
  
//         ws.send(JSON.stringify({ type: "queueUpdate", queue }));
//       }
//     }
//     catch (error) {
//       console.error("Error processing WebSocket message:", error);
//     }
// });

  ws.on("close", () => {

    console.log(`User ${username} left room: ${roomCode}`);

    room.client.delete(ws);

    if (room.client.size === 0) {
      rooms.delete(roomCode);
    }
  });

};

export function broadcastQueueUpdate(roomCode: string, queue: Song[]) {

  const room = rooms.get(roomCode);
    if (!room) return;

   room.client.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "queueUpdate", queue }));
        }
    });
}

