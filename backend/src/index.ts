import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import next from "./routes/index";
import { handleWebSocketConnection } from "./services/ws.service";

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['https://whats-next-navy.vercel.app'], // your frontend domain
  credentials: true,
}));
app.use('/api/v1', next);

// 👇 Create a raw HTTP server
const server = createServer(app);

// 👇 Create WebSocket server
const wss = new WebSocketServer({ noServer: true });

// 👇 Handle upgrade requests on `/ws`
server.on("upgrade", (req, socket, head) => {
  const { url } = req;
  if (url?.startsWith("/ws")) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy(); // Reject other upgrade paths
  }
});

wss.on("connection", handleWebSocketConnection);

// 👇 Start listening
server.listen(8000, "0.0.0.0", () => {
  console.log("Server running on port 8080");
});
