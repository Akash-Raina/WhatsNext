  import { WebSocket, WebSocketServer } from "ws";
  import getUserFingerprint from "../utils/userFingerPrint";
  import {IncomingMessage} from 'http'
  import { authenticateWebSocket } from "../middlewares/authenticateWebsocket";
  import { Song } from "../types/customRequest";
  import { getUpdatedQueue } from "./user.service";
  import redisClient from "../config/redisClient";

  interface RoomData{
    client: Set<WebSocket>,
    queue: Song[]
  }

  export const rooms = new Map<string, RoomData>();

  export const handleWebSocketConnection = async(ws: WebSocket, req: IncomingMessage) => {

    const params = new URLSearchParams(req.url?.split("?")[1]);
    const roomCode = params.get("roomcode");
    const username = req.headers["username"] || "unknown";

    const {user, isJoined} = await authenticateWebSocket(req);
    
    if (!isJoined) {
      ws.close(1008, "Authentication failed");
      return;
    }

    if (!roomCode) {
      ws.close(1008,"Room code is required");
      return;
    }

    console.log(`User ${username} joined room: ${roomCode}`);

    if (!rooms.has(roomCode)) {
      rooms.set(roomCode, {queue: [], client: new Set()});
    }

    const room = rooms.get(roomCode);
    if(!room) return;

    room.client.add(ws);

    const updatedQueue = await getUpdatedQueue(roomCode)
    
    ws.send(JSON.stringify({type:"queueUpdate", queue: updatedQueue}));
    ws.send(JSON.stringify({type:"whoAmI", whoAmI: user}))

    broadcastUserCount(roomCode);

    ws.on("message", async(data)=>{
      try{
        const message = JSON.parse(data.toString());

        if(message.type === 'songEnded'){
          const { roomCode, songId } = message;
          const room = rooms.get(roomCode);
          if (!room) return;

          const queueKey = `queue:${roomCode}`;
          const roomQueueKey = `${queueKey}:${songId}`;
          const response = await redisClient.del(roomQueueKey);
          const queueResponse = await redisClient.lRem(queueKey, 0, songId)
          console.log('queueResponse', queueResponse)
          if(queueResponse){
            const updatedQueue = await getUpdatedQueue(roomCode)

            ws.send(JSON.stringify({type:"queueUpdate", queue: updatedQueue}));
          }
        }
      }
      catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    })

    ws.on("close", () => {

      console.log(`User ${username} left room: ${roomCode}`);

      room.client.delete(ws);

      broadcastUserCount(roomCode);

      if (room.client.size === 0) {
        rooms.delete(roomCode);
      }
    });

  };

  export function getUserCountInRoom(roomCode: string): number {
    const room = rooms.get(roomCode);
    return room ? room.client.size : 0;
  }

  export function broadcastQueueUpdate(roomCode: string, queue: Song[]) {

    const room = rooms.get(roomCode);
      if (!room) return;

    room.client.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "queueUpdate", queue }));
          }
      });
  }

  function broadcastUserCount(roomCode: string) {
    const room = rooms.get(roomCode);
    if (!room) return;

    const count = room.client.size;

    room.client.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "userCountUpdate", count }));
      }
    });
  }

