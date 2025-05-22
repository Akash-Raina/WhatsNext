import { useEffect, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import SearchNavbar from "./SearchBar";
import { useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import ApiLimitWarning from "./ApiLimitWarning";

const RoomNavbar = () => {
  const { socket } = useWebSocket();
  const [liveUsers, setLiveUsers] = useState<number | null>(null);
  const { roomCode } = useParams();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "userCountUpdate") {
          setLiveUsers(message.count);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  return (
    <div className="w-full py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-[#8b5cf6]">What's Next</span>
      </div>

      <div className="hidden md:block w-full max-w-lg">
        <SearchNavbar visible={true} />
      </div>

      <div className="md:hidden">
        <FiSearch size={24} onClick={() => setShowSearch(prev => !prev)} className="text-gray-700 cursor-pointer" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">{liveUsers ?? 1} listening</span>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-md">
          <span className="text-xs font-mono">ROOM: {roomCode}</span>
        </div>
        <ApiLimitWarning/>
      </div>

      {showSearch && (
        <div className="w-full md:hidden">
          <SearchNavbar visible={true} onClose={() => setShowSearch(false)} />
        </div>
      )}
    </div>
  );
};

export default RoomNavbar;
