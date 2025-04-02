import { useState, useEffect } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { BiUpvote } from "react-icons/bi";

interface Song {
  id: string;
  title: string;
  thumbnail: string | null;
  channel: string;
  upvotes: number;
  upvotedBy: string;
}

const SongsQueue = () => {
  const { socket } = useWebSocket();
  const [songs, setSongs] = useState<Song[]>([]);

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
              <BiUpvote size={25}/>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongsQueue;