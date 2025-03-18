import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { WebSocketProvider } from "./context/WebSocketContext";

function App() {

  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element= {<Home/>}/>
          <Route path="/:roomCode" element ={<Room/>}/>
        </Routes>
      </Router>
    </WebSocketProvider>
  )
}

export default App
