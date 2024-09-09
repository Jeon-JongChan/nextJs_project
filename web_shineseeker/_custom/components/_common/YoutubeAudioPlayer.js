"use client";
import React, {useEffect, useState, useRef} from "react";

const YouTubeAudioPlayer = ({css, videoUrl, istitle = false, parentRef}) => {
  const playerRef = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false); // 플레이어 준비 상태를 추적
  css = css || null;
  videoUrl = videoUrl || "https://www.youtube.com/watch?v=ehX7MAhc5iA";

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

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else if (window.YT && window.YT.Player) {
      // 이미 YouTube API가 로드된 경우 바로 플레이어 생성
      createPlayer(id);
    }

    window.onYouTubeIframeAPIReady = () => {
      createPlayer(id);
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy(); // 컴포넌트 언마운트 시 제거
      }
    };
  }, []);

  const createPlayer = (id) => {
    playerRef.current = new YT.Player("player", {
      videoId: id,
      width: 0, //"640",
      height: 0, //"360",
      playerVars: {
        autoplay: 1,
        controls: 1,
        loop: 1,
        playlist: id,
      },
      events: {
        onReady: (event) => {
          playerRef.current.setPlaybackQuality("144p");
          setIsPlayerReady(true); // 플레이어가 준비되었음을 표시
        },
        onStateChange: (event) => {
          playerRef.current.setPlaybackQuality("144p");
        },
      },
    });
  };

  useEffect(() => {
    if (playerRef.current && isPlayerReady) {
      console.log("Player is ready and PlayerRef is set", parentRef.current);
      // parentRef에 함수들을 할당
      parentRef.current = {
        status: (isnumber = false) => {
          if (isnumber) return playerRef.current.getPlayerState();
          else return getPlayerState();
        },
        play: () => playerRef.current.playVideo(),
        pause: () => playerRef.current.pauseVideo(),
        stop: () => playerRef.current.stopVideo(),
        next: () => nextVideo(),
        prev: () => nextVideo(true),
        setVolume: (volume) => setVolume(volume),
        getTitle: () => playerRef.current.getVideoData().title,
        title: playerRef.current.getVideoData().title,
      };
    }
  }, [isPlayerReady]);

  const nextVideo = (prev = false) => {
    if (playerRef.current) {
      parentRef.title = playerRef.current.getVideoData().title;
      if (prev) playerRef.current.previousVideo();
      else playerRef.current.nextVideo();
    }
  };

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

  /** 현재 재생 상태를 반환하는 함수
   * -1 –시작되지 않음, 0 – 종료, 1 – 재생 중, 2 – 일시중지, 3 – 버퍼링, 5 – 동영상 신호
   * @returns {Number} playerState
   */
  const getPlayerState = () => {
    if (!playerRef.current) return null;
    const playerState = {"-1": "NONE", 0: "ENDED", 1: "PLAYING", 2: "PAUSED", 3: "BUFFERING", 5: "VIDEO_CUED"};
    return playerState[playerRef.current.getPlayerState()];
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
    <div className={css} style={css ? {} : {position: "fixed"}}>
      <div id="player" style={{display: "none"}} />
    </div>
  );
};

export default YouTubeAudioPlayer;
