"use client";
import {useState, useEffect} from "react";
import {sleep} from "/_custom/utils.js";

export default function Component(props) {
  const slides = props.slides;
  // const thumbnail = props.thumbnail || false;
  const description = props.description || true;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideAnimation, setSlideAnimation] = useState(true);
  const slideCount = slides.length;
  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slideCount;
    setCurrentSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + slideCount) % slideCount;
    setCurrentSlide(prevIndex);
  };

  const teleportSlide = (index, isPrev) => {
    isPrev;
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 100000); // 3초마다 다음 슬라이드로 이동
    return () => clearInterval(intervalId);
  }, [currentSlide]);

  function createSlide(slideInfo, index) {
    const hoverStyle = "opacity-0 group-hover:opacity-100 transition-opacity duration-300 ";
    return (
      <div key={index} className="relative w-full h-full group">
        <img src={slideInfo.imageUrl} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
        <div className={hoverStyle + "absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-50 text-white p-2"}></div>
        {currentSlide !== 0 && (
          <button className={hoverStyle + "absolute left-0 top-1/2 transform -translate-y-1/2"} onClick={prevSlide}>
            이전
          </button>
        )}
        {currentSlide !== slideCount - 1 && (
          <button className={hoverStyle + "absolute right-0 top-1/2 transform -translate-y-1/2"} onClick={nextSlide}>
            다음
          </button>
        )}
      </div>
    );
  }

  function createThumbnail(slideInfo, index) {
    return (
      <div key={index} className="relative w-full h-full group">
        <img src={slideInfo.imageUrl} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`slide-banner w-full max-h-full overflow-hidden`} style={{height: "inherit"}}>
      <div
        className="flex flex-row h-full"
        style={{width: `${slideCount * 100}%`, transform: `translateX(-${currentSlide * (100 / slideCount)}%)`, transition: `${slideAnimation ? "transform 0.5s ease" : ""}`}}
      >
        {slides.map((slide, index) => createSlide(slide, index))}
      </div>
      <div
        className="flex flex-row h-full mt-4 gap-2"
        style={{
          width: `${(slideCount / 3) * 100}%`,
          height: "120px",
          transform: `translateX(-${currentSlide * (100 / slideCount)}%)`,
          transition: `${slideAnimation ? "transform 0.5s ease" : ""}`,
        }}
      >
        {slides.map((slide, index) => createThumbnail(slide, index))}
      </div>
    </div>
  );
}

Component.defaultProps = {
  slides: [
    {
      imageUrl: "https://via.placeholder.com/800x400?text=Slide%201",
      title: "첫번째 슬라이드",
      description: "첫번째 슬라이드 설명",
    },
    {
      imageUrl: "https://via.placeholder.com/800x400?text=Slide%202",
      title: "두번째 슬라이드",
      description: "두번째 슬라이드 설명",
    },
    {
      imageUrl: "https://via.placeholder.com/800x400?text=Slide%203",
      title: "세번째 슬라이드",
      description: "세번째 슬라이드 설명",
    },
    {
      imageUrl: "https://via.placeholder.com/800x400?text=Slide%204",
      title: "4번째 슬라이드",
      description: "세번째 슬라이드 설명",
    },
    {
      imageUrl: "https://via.placeholder.com/800x400?text=Slide%205",
      title: "5번째 슬라이드",
      description: "세번째 슬라이드 설명",
    },
  ],
};
