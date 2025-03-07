import express, {Request, Response} from "express"
import cors from 'cors'
import {WebSocketServer, WebSocket} from 'ws'
import redisClient from "./redisClient";
import getUserFingerprint from "./userFingerPrint";

const app = express();

app.use(express.json());
app.use(cors());

function generateRoomCode(){
   return Math.random().toString(36).substring(2, 10).toUpperCase();
}

let adminId;

app.get('/create-room', async(req: Request, res: Response)=>{
    try{
        const uniqueRoomCode = generateRoomCode();

        if(!uniqueRoomCode)
            throw new Error('Why would this even happen')

        const userId = getUserFingerprint(req);
        const userKey = `room:${uniqueRoomCode}:user:${userId}`;

        res.status(200).json({
            uniqueRoomCode,
            role: 'admin'
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

        const { uniqueRoomCode } = req.body;
            
        if (!uniqueRoomCode) {
        res.status(400).json({ message: "Room code is required!" });
        return;
        }

        const userId = getUserFingerprint(req);
        const userKey = `room:${uniqueRoomCode}:user:${userId}`;

        const existingUser = await redisClient.get(userKey);
        if (existingUser) {
        res.status(400).json({ message: "You are already in this room!" });
        return;
        }

        await redisClient.set(userKey, "active", { EX: 7200 });

        res.json({ message: "Joined successfully", userId });
    }
    catch (error){
        console.error("Error joining room:", error);
        res.status(500).json({ message: "Internal server error" });
    }               
})

const httpServer = app.listen(8080);

// const wss = new WebSocketServer({server: httpServer});


// interface JoinRoomRequest extends Request {
//     body: {
//       roomCode: string;
//     };
// }

// wss.on('connection', function connection(socket){
//     socket.on('error', (error)=>console.error(error));

//     socket.on('message', function message(data, isBinary){
//         wss.clients.forEach(function each(client){
//             if(client.readyState === WebSocket.OPEN){
//                 client.send(data, {binary: isBinary})
//             }
//         })
//     })

//     socket.send('Hello! Message From Server backend');
// })