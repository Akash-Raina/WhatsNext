import { useEffect, useRef, useState } from "react";
import { useSongs } from "../context/SongsListContext";
import { useWebSocket } from "../context/WebSocketContext";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: typeof YT;
  }
}

const YouTubePlayer = () => {
  const { songs } = useSongs();
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const currentSongRef = useRef(currentSong);
  const playerRef = useRef<YT.Player | null>(null);
  const { socket } = useWebSocket();

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong && songs[0]) setCurrentSong(songs[0]);
    else if (currentSong?.id !== songs[0]?.id) setCurrentSong(songs[0]);
  }, [songs]);

  useEffect(() => {
    if (!songs[0]) return;

    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = initializePlayer;
    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [currentSong]);

  useEffect(() => {
    if (currentSong && playerRef.current) {
      playerRef.current.loadVideoById(currentSong.id);
    }
  }, [currentSong]);

  const initializePlayer = () => {
    if (!document.getElementById("youtube-player")) return;

    playerRef.current = new window.YT.Player("youtube-player", {
      height: "360",
      width: "640",
      videoId: currentSong?.id,
      playerVars: { playsinline: 1, autoplay: 1, controls: 1 },
      events: {
        onReady: (event) => event.target.playVideo(),
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            const roomCode = localStorage.getItem("roomCode");
            if (!roomCode) return;

            socket?.send(
              JSON.stringify({
                type: "songEnded",
                songId: currentSongRef.current?.id,
                roomCode,
              })
            );
          }
        },
        onError: (event) => console.error("YouTube Player Error:", event.data),
      },
    });
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl font-bold mb-3 text-center">Now Playing</h2>
      <div className="w-full aspect-video bg-white rounded-xl shadow-md flex items-center justify-center">
        <div id="youtube-player" className="w-full h-full" />
      </div>
    </div>
  );
};

export default YouTubePlayer;
