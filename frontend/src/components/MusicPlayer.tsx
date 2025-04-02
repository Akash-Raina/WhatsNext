import { useEffect, useState } from "react";
import { useSongs } from "../context/SongsListContext";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: typeof YT;
  }
}

const YouTubePlayer = () => {
  const { songs } = useSongs();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [player, setPlayer] = useState<YT.Player | null>(null);

  useEffect(() => {
    if (songs.length === 0) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player("youtube-player", {
        videoId: songs[currentSongIndex].id,
        playerVars: {
          playsinline: 1, // Important for mobile playback
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            setPlayer(event.target);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playNextSong();
            }
          },
        },
      });
    };

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [songs]);

  useEffect(() => {
    if (player && songs[currentSongIndex]) {
      player.loadVideoById(songs[currentSongIndex].id);
    }
  }, [currentSongIndex, player]); 

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1 < songs.length ? prevIndex + 1 : 0));
  };

  return <div id="youtube-player"></div>;
};

export default YouTubePlayer;
