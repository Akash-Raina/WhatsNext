import express from "express"
import {WebSocketServer, WebSocket} from 'ws'

const app = express();

app.use(express.json());

const httpServer = app.listen(8080);

const wss = new WebSocketServer({server: httpServer});

wss.on('connection', function connection(socket){
    socket.on('error', (error)=>console.error(error));

    socket.on('message', function message(data, isBinary){
        wss.clients.forEach(function each(client){
            if(client.readyState === WebSocket.OPEN){
                client.send(data, {binary: isBinary})
            }
        })
    })

    socket.send('Hello! Message From Server');
})