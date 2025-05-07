import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { WebSocketProvider } from "./context/WebSocketContext";
import { WhoJoinedProvider } from "./context/WhoJoinedContext";
import { SongsListProvider } from "./context/SongsListContext";

function App() {

  return (
    <WebSocketProvider>
      <WhoJoinedProvider>
        <SongsListProvider>
          <Router>
            <Routes> 
                <Route path="/" element= {<Home/>}/>
                <Route path="/:roomCode" element ={<Room/>}/>
            </Routes>
          </Router>
        </SongsListProvider>
      </WhoJoinedProvider>
    </WebSocketProvider>
  )
}

export default App
