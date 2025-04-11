import { useEffect, useState } from "react";
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
  // const [currentSong, setCurrentSong] = useState(songs[0]);
  const {socket} = useWebSocket();

  console.log("songs", songs);

  useEffect(() => {
    if (songs.length === 0) return;
    console.log('rerendered')

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player("youtube-player", {
        videoId: songs[0].id,
        playerVars: {
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              socket?.send(JSON.stringify({
                type: 'songEnded',
                songId: songs[0].id,
                roomCode: localStorage.getItem("roomCode")
              }))
            }
          },
        },
      });
    };

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [songs]);



  return <div id="youtube-player"></div>;
};

export default YouTubePlayer;
