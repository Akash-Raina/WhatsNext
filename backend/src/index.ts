import express, {Request, Response} from "express"
import cors from 'cors'
import {WebSocketServer, WebSocket} from 'ws'
import { createClient } from "redis";
import getUserFingerprint from "./utils/userFingerPrint";
import { generateRoomCode } from "./utils/generateRoomCode";

const app = express();
app.use(express.json());
app.use(cors());

const httpServer = app.listen(8080);

const wss = new WebSocketServer({server: httpServer});

const rooms = new Map<string, Set<WebSocket>>();

const redisClient = createClient();
redisClient.on("error", (err: Error) => console.error("Redis Error:", err));

(async () => {
    await redisClient.connect();
})();

app.post('/create-room', async(req: Request, res: Response)=>{
    try{
        const uniqueRoomCode = generateRoomCode();

        if(!uniqueRoomCode)
            throw new Error('Why would this even happen')

        const adminFingerPrintId = getUserFingerprint(req);

        if (!adminFingerPrintId) {
            throw new Error( "Failed to generate admin ID.");
        }

        const roomKey = `room:${uniqueRoomCode}`;
        await redisClient.hSet(roomKey, { adminFingerPrintId, createdAt: Date.now() });
        await redisClient.expire(roomKey, 7200); 

        res.status(201).json({
            uniqueRoomCode,
            message: "Room Created Successfully"
        })
    }
    catch(error:unknown){
        if(error instanceof Error){
            res.status(500).json({
                message: error.message
            })
        }
    }
})

app.post('/join-room', async(req: Request, res: Response)=>{

    try{

        const uniqueRoomCode = new URLSearchParams(req.url?.split("?")[1]);
            
        if (!uniqueRoomCode) {
            res.status(400).json({ message: "Room code is required!" });
            return;
        }

        const userFingerPrintId = getUserFingerprint(req);

        if (!userFingerPrintId) {
            res.status(400).json({ message: "Invalid user fingerprint!" });
            return;
        }

        const roomKey = `room:${uniqueRoomCode}`;

        const roomExists = await redisClient.exists(roomKey);
        
        if(!roomExists){
            throw new Error('Wrong Room Code')
        }
        
        const adminFingerPrint = await redisClient.hGet(roomKey, "adminFingerPrintId");

        if (userFingerPrintId === adminFingerPrint) {
            const adminExists = await redisClient.sIsMember(`${roomKey}:users`, adminFingerPrint);
            if (adminExists) {
                throw new Error('Admin is already in room')
            }
            await redisClient.sAdd(`${roomKey}:users`, adminFingerPrint);
            res.status(200).json({message: 'Admin Joined'});
            return
        }

        const userExists = await redisClient.sIsMember(`${roomKey}:users`, userFingerPrintId);
        if (userExists) {
            throw new Error('User is already in room')
        }

        await redisClient.sAdd(`${roomKey}:users`, userFingerPrintId);

        res.status(200).json({ message: "Joined successfully" });
    }
    catch (error:unknown){
        if(error instanceof Error)
        res.status(500).json({ message: error.message });
    }               
})

wss.on("connection", (ws, req: Request) => {
    const params = new URLSearchParams(req.url?.split("?")[1]);
    const roomCode = params.get("roomCode");
    const userFingerprint = getUserFingerprint(req);
  
    if (!roomCode || !userFingerprint) {
      ws.close();
      return;
    }
  
    console.log(`User ${userFingerprint} joined room: ${roomCode}`);
  
    if (!rooms.has(roomCode)) {
      rooms.set(roomCode, new Set());
    }
  
    rooms.get(roomCode)?.add(ws);
  
    ws.on("message", async (message) => {
      console.log(`Message from ${userFingerprint} in ${roomCode}:`, message.toString());
  
      // Broadcast to all users in the same room
      rooms.get(roomCode)?.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ user: userFingerprint, message: message.toString() }));
        }
      });
    });
  
    ws.on("close", () => {
      console.log(`User ${userFingerprint} left room: ${roomCode}`);
      rooms.get(roomCode)?.delete(ws);
    });
  });