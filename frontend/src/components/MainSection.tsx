import { useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/WhoJoinedContext";
import { useWebSocket } from "../context/WebSocketContext";

const MainSection = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const navigate = useNavigate();
  const {setUser} = useUser();
  const {connectWebSocket} = useWebSocket();

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/create-room`);
      setRoomCode(response?.data.roomCode);
      setIsRoomCreated(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleJoinRoom = () => {
    setRoomCode("");
    setIsRoomCreated(false);
    setIsModalOpen(true);
  };

  const handleCancel = async () => {
    if (isRoomCreated) {
      try {
        await axios.delete(`${BASE_URL}/cancel-room`, {
          data: { roomCode: roomCode },
        });
      } catch (error) {
        console.error("Error cancelling room:", error);
      }
    }
    setIsModalOpen(false);
    setRoomCode("");
    setIsRoomCreated(false);
  };

  const handleJoin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/join-room`, {
        roomCode,
      });
      setIsModalOpen(false);
      if (response) {
        setUser(response.data.whoJoined.user)
        connectWebSocket(roomCode)
        navigate(`/${roomCode}`);
      }
      console.log("Join response:", response.data);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <div className="flex h-[90%] w-screen flex-col items-center justify-center border">
      <h1 className="h-36 text-4xl font-bold">
        Basic UI for v1 - Will Update Later
      </h1>
      <div className="flex gap-3">
        <Button value="Create Room" onclick={handleCreateRoom} />
        <Button value="Join Room" onclick={handleJoinRoom} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="w-80 transform rounded-lg bg-white p-6 text-center shadow-lg transition-all scale-100">
            <input
              type="text"
              className="bg-black text-amber-400 w-full mb-4 p-2 rounded"
              value={roomCode}
              onChange={(e) => !isRoomCreated && setRoomCode(e.target.value)}
              readOnly={isRoomCreated}
              placeholder={isRoomCreated ? "Your Room Code" : "Enter Room Code"}
            />
            <div className="flex justify-center gap-3">
              <Button value="Cancel" onclick={handleCancel} />
              <Button value="Join" onclick={handleJoin} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSection;