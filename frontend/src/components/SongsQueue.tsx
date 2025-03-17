import { useEffect, useState } from "react";

const SongsQueue = ()=>{
    const [messages, setMessages] = useState<string[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const WS_URL = import.meta.env.VITE_WS_URL;
    const roomCode = 'O3NV4JJ9'
  
    useEffect(() => {

      const socket = new WebSocket(`${WS_URL}?roomcode=${roomCode}`);
  
      socket.onopen = () => {
        console.log("Connected to WebSocket server");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message received:", data);
  
        if (data.type === "queueUpdate") {
          setMessages(data.queue);
        }
      };
  
      socket.onclose = () => {
        console.log("Disconnected from WebSocket");
      };
  
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      setWs(socket);
  
      return () => {
        socket.close();
      };
    }, []);

    return <div>
        All List of Songs
    </div>
}

export default SongsQueue