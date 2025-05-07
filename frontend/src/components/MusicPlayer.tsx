import { useEffect, useState, useRef } from "react";
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
  console.log('rerender', songs)
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const playerRef = useRef<YT.Player | null>(null);
  const {socket} = useWebSocket();
  

  useEffect(() => {
    console.log('first got called')
    if (!currentSong && songs[0]) {
      setCurrentSong(songs[0]);
    } else if (currentSong?.id !== songs[0]?.id) {
      setCurrentSong(songs[0]);
    }
  }, [songs]);
  
  
  useEffect(() => {
    if (!songs[0]) return;
    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement("script");
      tag.id = 'youtube-iframe-api';
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.body.appendChild(tag);
    }
    console.log("currentSong", currentSong)
    window.onYouTubeIframeAPIReady = initializePlayer;

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [currentSong]);

  useEffect(() => {
    console.log("inside main")
    if (currentSong && playerRef.current) {
      playerRef.current.loadVideoById(currentSong.id);
    }
  }, [currentSong]);

  const initializePlayer = () => {
    if (!document.getElementById('youtube-player')) return;

    playerRef.current = new window.YT.Player("youtube-player", {
      height: '360',
      width: '640',
      videoId: currentSong?.id,
      playerVars: {
        playsinline: 1,
        autoplay: 1,
        controls: 1,
      },
      events: {
        onReady: (event) => {
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            const roomCode = localStorage.getItem("roomCode");
            if (!roomCode) {
              console.error("No room code found");
              return;
            }
            socket?.send(
              JSON.stringify({
                type: "songEnded",
                songId: currentSong?.id,
                roomCode,
              })
            );
            console.log("message received")
          }
        },
        onError: (event) => {
          console.error("YouTube Player Error:", event.data);
        },
      },
    });
  };

  // useEffect(() => {
  //   if (currentSong === null) return;

  //   const tag = document.createElement("script");
  //   tag.src = "https://www.youtube.com/iframe_api";
  //   tag.async = true;
  //   document.body.appendChild(tag);

  //   window.onYouTubeIframeAPIReady = () => {
  //     new window.YT.Player("youtube-player", {
  //       videoId: songs[0].id,
  //       playerVars: {
  //         playsinline: 1,
  //       },
  //       events: {
  //         onReady: (event) => {
  //           console.log('ready')
  //           event.target.playVideo();
  //         },
  //         onStateChange: (event) => {
  //           if (event.data === window.YT.PlayerState.ENDED) {
  //             socket?.send(JSON.stringify({
  //               type: 'songEnded',
  //               songId: songs[0].id,
  //               roomCode: localStorage.getItem("roomCode")
  //             }))
  //           }
  //         },
  //       },
  //     });
  //   };

  //   return () => {
  //     window.onYouTubeIframeAPIReady = undefined;
  //   };
  // }, [songs]);


  return (
    <div className="relative aspect-video w-full max-w-[640px] mx-auto">
      <div id="youtube-player"></div>
    </div>
  );
};

export default YouTubePlayer;
