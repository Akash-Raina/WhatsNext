import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WebSocketContextType {
  socket: WebSocket | null;
  connectWebSocket: (roomCode: string) => WebSocket;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const BASE_WS_URL = import.meta.env.VITE_WEBSOCKET_URL as string; 

  useEffect(()=>{
    const storedRoomCode = localStorage.getItem("roomCode");
    
    if(storedRoomCode)
        connectWebSocket(storedRoomCode);

    return ()=>{
      if(socket){
        socket.close();
      }
    }
  }, [])

  const connectWebSocket = (roomCode: string): WebSocket => {

    localStorage.setItem('roomCode', roomCode);
    if (socket) {
      socket.close();
    }
    const newSocket = new WebSocket(`${BASE_WS_URL}?roomcode=${roomCode}`);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connection established");

      newSocket.send(JSON.stringify({ type: "requestQueue", roomCode }));
    };
    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    newSocket.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    return newSocket;
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const value: WebSocketContextType = { socket, connectWebSocket };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};