import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import next from "./routes/index";
import { handleWebSocketConnection } from "./services/ws.service";

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['https://whats-next-navy.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));
app.use('/api/v1', next);

const port: number = process.env.PORT && !isNaN(parseInt(process.env.PORT, 10))
  ? parseInt(process.env.PORT, 10)
  : 8000;
const httpServer = app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", handleWebSocketConnection);
