import { useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/WhoJoinedContext";
import { useWebSocket } from "../context/WebSocketContext";

const Hero = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { connectWebSocket } = useWebSocket();

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
        setUser(response.data.whoJoined.user);
        connectWebSocket(roomCode);
        navigate(`/${roomCode}`);
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f5f0ff] px-4 sm:px-8 py-10">
      <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-center leading-tight">
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Collaborative Music
        </p>
        <p className="text-gray-800">That Hits the Right Note</p>
      </h1>

      <p className="w-11/12 sm:w-4/5 md:w-1/2 text-center text-base sm:text-lg font-medium text-gray-600 mb-6">
        Create a room, invite friends, and let everyone queue their favorite songs. The most upvoted tracks play first, giving everyone a voice.
      </p>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
        <Button
          value="Create Room"
          onclick={handleCreateRoom}
          classname="h-14 w-40 bg-violet-500 hover:bg-violet-600 rounded-2xl text-white font-semibold text-lg cursor-pointer"
        />
        <Button
          value="Join Room"
          onclick={handleJoinRoom}
          classname="h-14 w-40 bg-pink-500 hover:bg-pink-600 rounded-2xl text-white font-semibold text-lg cursor-pointer"
        />
      </div>

      <div className="mt-6 text-sm text-gray-600 text-center px-4">
        No account required <span className="mx-1">•</span> Free to use <span className="mx-1">•</span> Instant setup
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4">
          <div className="w-full max-w-xs sm:max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
            <input
              type="text"
              className="w-full mb-4 p-2 bg-black text-amber-400 rounded outline-none"
              value={roomCode}
              onChange={(e) => !isRoomCreated && setRoomCode(e.target.value)}
              readOnly={isRoomCreated}
              placeholder={isRoomCreated ? "Your Room Code" : "Enter Room Code"}
            />
            <div className="flex justify-center gap-4">
              <Button
                value="Cancel"
                onclick={handleCancel}
                classname="h-10 w-24 bg-red-400 hover:bg-red-500 rounded-2xl text-white font-semibold cursor-pointer"
              />
              <Button
                value="Join"
                onclick={handleJoin}
                classname="h-10 w-24 bg-pink-400 hover:bg-pink-500 rounded-2xl text-white font-semibold cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
