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
  loading: () => <p className="relative left-[95px] top-[42px] text-[12px]">Loading...</p>,
});
export default function Component() {
  const initRef = useRef(false);
  const audioRef = useRef(null);
  const [videoTitle, setVideoTitle] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 관리

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && !initRef.current) {
        clearInterval(interval);
        setVideoTitle(audioRef.current.title);
        audioRef.current.setVolume(50);
        audioRef.current.setQuality("tiny");
        // audioRef.current.play();
        initRef.current = true;
        setTimeout(() => {
          console.log("MainAudioPlayer traffic check", audioRef.current.status(true));
          if (audioRef.current.status(true) == 1) {
            setIsPlaying(true);
          }
        }, 1000);
      }
    }, 1000);
  }, []);

  // MemoizedYouTubeAudioPlayer를 useRef를 사용해 메모이제이션 처리
  const MemoizedYouTubeAudioPlayer = useRef(<YouTubeAudioPlayer parentRef={audioRef} videoUrl={"https://www.youtube.com/watch?v=ehX7MAhc5iA"} css={"relative left-[540px] top-[20px]"} />);

  return (
    <div className="img-init img-music-bg relative" style={{maxWidth: "245px", height: "80px"}}>
      <Image className={isPlaying ? "rotating-right-5" : ""} src={MusicCD} alt="music cd" width={50} height={50} style={{position: "absolute", top: "15px", left: "30px"}} />
      <Image src={MusicBGM} alt="music bgm text" width={35} height={20} style={{position: "absolute", top: "16px", left: "90px"}} />
      <Image src={MusicTitle} alt="music bgm title" width={120} height={24} style={{position: "absolute", top: "40px", left: "90px"}} />
      <button style={{position: "absolute", top: "16px", left: "140px"}} onClick={() => audioRef.current?.next()}>
        <Image width={12} height={12} src={MusicBtnNext} alt="music next" />
      </button>
      <button style={{position: "absolute", top: "17px", left: "170px"}} onClick={handlePlayToggle}>
        <Image width={12} height={12} src={MusicBtnPlay} alt="music play" />
      </button>
      <button style={{position: "absolute", top: "16px", left: "200px"}} onClick={() => audioRef.current?.prev()}>
        <Image width={12} height={12} src={MusicBtnPrev} alt="music prev" />
      </button>
      {videoTitle ? (
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px]" style={{position: "absolute", top: "42px", left: "95px", width: "115px"}}>
          {videoTitle}
        </p>
      ) : null}
      {MemoizedYouTubeAudioPlayer.current}
    </div>
  );
}
