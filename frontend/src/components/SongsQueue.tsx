import { useEffect, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { MdDelete } from "react-icons/md";
import { BiUpvote, BiSolidUpvote } from "react-icons/bi";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSongs } from "../context/SongsListContext";
import { useUser } from "../context/WhoJoinedContext";

const SongsQueue = () => {
  const { socket } = useWebSocket();
  const { user, setUser } = useUser();
  const { songs, setSongs } = useSongs();
  const { roomCode } = useParams();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [upvotedSongs, setUpvotedSongs] = useState<string[]>([]); // track upvoted song IDs

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "queueUpdate" && Array.isArray(message.queue)) {
          setSongs(message.queue);
        }
        if (message.type === "whoAmI") {
          setUser(message.whoAmI);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  const upvoteSong = async (songId: string) => {
    const uid = localStorage.getItem("uid");
    try {
      await axios.put(`${BASE_URL}/upvote-song`, { roomCode, songId }, {
        headers: {
          "x-uid": uid,
        },
      });

      setUpvotedSongs((prev) =>
        prev.includes(songId)
          ? prev.filter((id) => id !== songId)
          : [...prev, songId]
      );
    } catch (error) {
      console.error("Error upvoting song:", error);
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-md">
      <h2 className="font-bold text-2xl mb-4">Up Next</h2>
      {songs.length === 0 ? (
        <p className="text-gray-500">No songs in queue yet.</p>
      ) : (
        <ul className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {songs.map((song) => {
            const isUpvoted = upvotedSongs.includes(song.id);
            return (
              <li
                key={song.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:shadow transition"
              >
                {song.thumbnail && (
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-14 h-14 object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col overflow-hidden">
                  <p className="font-semibold truncate">{song.title || "Unknown Title"}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {song.channel || "Unknown Channel"}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <span className="text-sm text-gray-700">+{song.upvotes}</span>
                  <button onClick={() => upvoteSong(song.id)} title="Upvote">
                    {isUpvoted ? (
                      <BiSolidUpvote className="text-blue-600" size={24} />
                    ) : (
                      <BiUpvote className="text-blue-600" size={24} />
                    )}
                  </button>
                  {user === "Admin" && (
                    <button
                      title="Delete"
                      onClick={() => {
                        socket?.send(
                          JSON.stringify({
                            type: "songEnded",
                            songId: song.id,
                            roomCode,
                          })
                        );
                      }}
                    >
                      <MdDelete className="text-red-500 hover:text-red-700" size={24} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SongsQueue;
