"use client";
import {useEffect} from "react";

const YouTubeAudioPlayer = ({videoId}) => {
  useEffect(() => {
    // YouTube IFrame API를 로드
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const player = new YT.Player("player", {
        height: "0",
        width: "0",
        videoId: videoId,
        events: {
          onReady: (event) => event.target.playVideo(),
        },
      });
    };
  }, [videoId]);

  return (
    <div>
      <div id="player" />
      <p>Now playing audio from YouTube...</p>
    </div>
  );
};

export default YouTubeAudioPlayer;
