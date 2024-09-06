"use client";
import {useEffect, useState, useRef} from "react";

const YouTubeAudioPlayer = ({videoUrl, onPlay, onNext, getTitle}) => {
  const playerRef = useRef(null);
  const [videoId, setVideoId] = useState(null);
  const [playerState, setPlayerState] = useState(null);

  // videoId를 추출하는 함수
  const extractVideoId = (url) => {
    if (!url || typeof url !== "string") return null;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const id = extractVideoId(videoUrl);
    if (!id) {
      console.error("Invalid YouTube URL");
      return;
    }
    setVideoId(id);

    // YouTube IFrame API를 로드
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    if (document.querySelector("script[src='https://www.youtube.com/iframe_api']") == null) {
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // YouTube API 준비 완료 후 플레이어 생성
      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new YT.Player("player", {
          videoId: id,
          width: 0, //"640",
          height: 0, //"360",
          playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            loop: 1,
            playlist: id,
          },
          events: {
            onReady: (event) => {
              event.target.setPlaybackQuality("144p");
            },
            onStateChange: (event) => {
              event.target.setPlaybackQuality("144p");
              setPlayerState(event.data);
            },
            onPlaybackQualityChange: (event) => {
              console.log("onPlaybackQualityChange", event.data);
            },
          },
        });
      };
    }
  }, [videoUrl]);

  useEffect(() => {
    if (onPlay) {
      onPlay((status = 0) => {
        if (playerRef.current) {
          if (status) playerRef.current.playVideo();
          else playerRef.current.stopVideo();
        }
      });
    }
    if (onNext) {
      onNext((status = 0) => {
        if (playerRef.current) {
          if (status) playerRef.current.nextVideo();
          else playerRef.current.previousVideo();
        }
      });
    }
    if (getTitle) {
      getTitle(() => {
        return getVideoTitle();
      });
    }
  }, [onPlay, onNext, getTitle]);

  // 해상도 변경 함수
  const setVideoQuality = (quality) => {
    if (playerRef.current) {
      const availableQualities = playerRef.current.getAvailableQualityLevels();
      if (availableQualities.includes(quality)) {
        playerRef.current.setPlaybackQuality(quality);
        console.log(`해상도가 ${quality}로 설정되었습니다.`);
      } else {
        console.log(`해상도 ${quality}는 사용할 수 없습니다.`);
      }
    }
  };

  // 현재 재생 중인 노래(영상)의 제목을 반환하는 함수
  const getVideoTitle = () => {
    if (playerRef.current) {
      const videoData = playerRef.current.getVideoData();
      return videoData.title;
    }
    return "";
  };

  // 음량 조절 함수
  const setVolume = (volume) => {
    if (playerRef.current) {
      if (volume >= 0 && volume <= 100) {
        playerRef.current.setVolume(volume);
        console.log(`음량이 ${volume}으로 설정되었습니다.`);
      } else {
        console.log("음량은 0에서 100 사이의 값이어야 합니다.");
      }
    }
  };

  return (
    <div style={{position: "relative"}}>
      <div id="player" style={{display: "visible"}} />
    </div>
  );
};

export default YouTubeAudioPlayer;
