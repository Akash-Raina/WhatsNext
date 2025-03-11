import express, {Request, Response} from "express"
import cors from 'cors'
import {WebSocketServer, WebSocket} from 'ws'
import next from './routes/index'
import { handleWebSocketConnection } from "./services/ws.service";

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/v1', next)

const httpServer = app.listen(8080);

const wss = new WebSocketServer({server: httpServer});

wss.on("connection", handleWebSocketConnection)