import { useEffect } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: typeof YT;
  }
}

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player("youtube-player", {
        videoId,
        events: {
          onReady: (event: { target: YT.Player }) => {
            event.target.playVideo();
          },
        },
      });
    };

    return () => {
      window.onYouTubeIframeAPIReady = undefined; // Cleanup
    };
  }, [videoId]);

  return <div id="youtube-player"></div>;
};

export default YouTubePlayer;
