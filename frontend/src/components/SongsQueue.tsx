import { useEffect } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { BiUpvote } from "react-icons/bi";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSongs } from "../context/SongsListContext";


const SongsQueue = () => {
  const { socket } = useWebSocket();
  const {songs, setSongs} = useSongs();
  const {roomCode} = useParams();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data); 
        console.log("New message received:", message);

        if (message.type === "queueUpdate" && Array.isArray(message.queue)) {
          setSongs(message.queue); 
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onmessage = handleMessage;

    return () => {
      socket.onmessage = null; 
    };
  }, [socket]);

  const upvoteSong = async(songId: string)=>{
    try{
      const response = await axios.put(`${BASE_URL}/upvote-song`, {
        roomCode, songId
      });
      console.log(response.data.message);
    }
    catch(error:unknown){
      console.error("Error joining room:", error);
    }
    
  }

  return (
    <div>
      <h2>Song Queue</h2>
      {songs.length === 0 ? (
        <p>No songs in queue yet.</p>
      ) : (
        <ul className="space-y-4">
          {songs.map((song) => (
            <li
              key={song.id}
              className="flex items-center gap-4 p-2 border rounded-lg"
            >
              {song.thumbnail && (
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="border">
                <p className="font-medium">{song.title || "Unknown Title"}</p>
                <p className="text-sm text-gray-600">
                  {song.channel || "Unknown Channel"}
                </p>
                <p className="text-sm">Upvotes: {song.upvotes}</p>
              </div>
              <BiUpvote size={25} onClick={()=>upvoteSong(song.id)}/>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongsQueue;