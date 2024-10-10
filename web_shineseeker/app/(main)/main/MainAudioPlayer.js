"use client";
import React, {useState, useRef, useCallback, useEffect} from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import MusicCD from "@/public/images/home/01_home_music_cd.png";
import MusicBGM from "@/public/images/home/01_home_music04_bgm.png";
import MusicTitle from "@/public/images/home/01_home_music03.png";
import MusicBtnNext from "@/public/images/home/01_home_music_button01.png";
import MusicBtnPlay from "@/public/images/home/01_home_music_button02.png";
import MusicBtnPrev from "@/public/images/home/01_home_music_button03.png";

// dynamic을 사용하여 YouTubeAudioPlayer 컴포넌트 lazy load
const YouTubeAudioPlayer = dynamic(() => import("@/_custom/components/_common/YoutubeAudioPlayer"), {
  ssr: false,
  loading: () => <p className="relative left-[160px] top-[91px]">Loading...</p>,
});

export default function Component() {
  const audioRef = useRef(null);
  const [videoTitle, setVideoTitle] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 관리

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        clearInterval(interval);
        setVideoTitle(audioRef.current.title);
        audioRef.current.setVolume(50);
        audioRef.current.setQuality("small");
        audioRef.current.play();
        setIsPlaying(true);
        console.log("MainAudioPlayer title interval exit");
      }
    }, 1000);
  }, []);
  // 재생/정지 토글 함수 (useCallback으로 메모이제이션하여 함수가 불필요하게 재생성되지 않도록 함)
  const handlePlayToggle = useCallback(() => {
    console.log("handlePlayToggle 실행 audioRef.current", audioRef.current, audioRef.current.title, audioRef.current.getTitle());
    if (audioRef.current) {
      setVideoTitle(audioRef.current.title);
      if ([-1, 0, 2, 5].includes(audioRef.current.status(true))) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  // MemoizedYouTubeAudioPlayer를 useRef를 사용해 메모이제이션 처리
  const MemoizedYouTubeAudioPlayer = useRef(<YouTubeAudioPlayer parentRef={audioRef} videoUrl={"https://www.youtube.com/watch?v=ehX7MAhc5iA"} css={"relative left-[540px] top-[20px]"} />);

  return (
    <div className="img-init img-music-bg w-full h-full relative">
      <Image className={isPlaying ? "rotating-right-5" : ""} src={MusicCD} alt="music cd" style={{position: "absolute", top: "30px", left: "70px"}} />
      <Image src={MusicBGM} alt="music bgm text" style={{position: "absolute", top: "40px", left: "160px"}} />
      <Image src={MusicTitle} alt="music bgm title" style={{position: "absolute", top: "70px", left: "160px", width: "195px"}} />
      <button style={{position: "absolute", top: "40px", left: "230px"}} onClick={() => audioRef.current?.next()}>
        <Image src={MusicBtnNext} alt="music next" />
      </button>
      <button style={{position: "absolute", top: "40px", left: "280px"}} onClick={handlePlayToggle}>
        <Image src={MusicBtnPlay} alt="music play" />
      </button>
      <button style={{position: "absolute", top: "40px", left: "330px"}} onClick={() => audioRef.current?.prev()}>
        <Image src={MusicBtnPrev} alt="music prev" />
      </button>
      {videoTitle ? (
        <p className="overflow-hidden text-ellipsis whitespace-nowrap" style={{position: "absolute", top: "76px", left: "173px", width: "190px"}}>
          {videoTitle}
        </p>
      ) : null}
      {MemoizedYouTubeAudioPlayer.current}
    </div>
  );
}
