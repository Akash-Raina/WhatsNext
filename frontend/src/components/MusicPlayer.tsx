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
  const [hasStarted, setHasStarted] = useState(false); // Prevent current song from being updated mid-play
  const currentSongRef = useRef(currentSong);
  const playerRef = useRef<YT.Player | null>(null);
  const { socket } = useWebSocket();

  // Keep currentSongRef in sync
  useEffect(() => {
    currentSongRef.current = currentSong;
    console.log("currentSongRef", currentSongRef.current);
  }, [currentSong]);

  // Update currentSong only if no song is playing yet or the song has ended
  useEffect(() => {
    console.log("songs", songs);
    if (!hasStarted && songs[0] && (!currentSong || currentSong?.id !== songs[0]?.id)) {
      console.log("Setting current song:", songs[0]);
      setCurrentSong(songs[0]);
    }
  }, [songs, hasStarted, currentSong]);

  // Load YouTube iframe API
  useEffect(() => {
    console.log("Loading YouTube Iframe API",songs[0]);
    if (!songs[0]) return;

    console.log("YouTube Iframe API loaded");
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

  // Load new video when currentSong changes
  useEffect(() => {
    console.log("Loading new video:", currentSong);
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
        onReady: (event) => {
          setHasStarted(true);
          event.target.playVideo();
        },
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

            setHasStarted(false); // Allow the next song to be picked
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
