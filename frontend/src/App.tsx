import { useEffect, useState } from "react"

function App() {

  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [latestMessage, setLatestMessage] = useState("");
  // const [message, setMessage] = useState("");

  useEffect(()=>{
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () =>{
      setSocket(socket);
    }
    socket.onmessage = (message)=>{
      setLatestMessage(message.data)
    }

    return ()=>{
      socket.close();
    }
  }, [])

  if(!socket){
    return <div>
       Connecting to the socket server...
    </div>
  }

  return (
    <>
    <h1 className="border">{latestMessage}</h1>
    </>
  )
}

export default App
