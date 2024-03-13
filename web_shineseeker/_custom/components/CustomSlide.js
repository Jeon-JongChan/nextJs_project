"use client";
import {useState, useEffect} from "react";
import {sleep} from "/_custom/utils.js";

export default function Component(props) {
  const slides = props.slides;
  const [currentSlide, setCurrentSlide] = useState(1);
  const [slideAnimation, setSlideAnimation] = useState(true);
  const slideCount = slides.length + 1; // 반복되는 슬라이드를 위해 1개를 추가 (마지막 슬라이드(첫번째위치)를 추가)
  const nextSlide = () => {
    if (!slideAnimation) setSlideAnimation(true);
    const nextIndex = (currentSlide + 1) % slideCount;
    setCurrentSlide(nextIndex);
    if (nextIndex === 3) teleportSlide((nextIndex + 1) % slideCount);
  };

  const prevSlide = () => {
    if (!slideAnimation) setSlideAnimation(true);
    const prevIndex = (currentSlide - 1 + slideCount) % slideCount;
    setCurrentSlide(prevIndex);
    if (prevIndex === 0) teleportSlide((prevIndex - 1 + slideCount) % slideCount);
  };

  const teleportSlide = (index) => {
    let timer;
    timer = new Promise(() => {
      clearTimeout(timer);
      setTimeout(() => {
        console.log("teleportSlide", index);
        setSlideAnimation(false);
        setCurrentSlide(index);
      }, 600);
    });
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 100000); // 3초마다 다음 슬라이드로 이동
    return () => clearInterval(intervalId);
  }, [currentSlide]);

  function createSlide(slideInfo, index) {
    const hoverStyle = "opacity-0 group-hover:opacity-100 transition-opacity duration-300 ";
    return (
      <div key={index} className="relative w-full h-full group">
        <button className={hoverStyle + "absolute left-0 top-1/2 transform -translate-y-1/2"} onClick={prevSlide}>
          이전
        </button>
        <img src={slideInfo.imageUrl} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
        <button className={hoverStyle + "absolute right-0 top-1/2 transform -translate-y-1/2"} onClick={nextSlide}>
          다음
        </button>
        <div className={hoverStyle + "absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2"}>
          <h3 className="text-lg font-bold">{slideInfo.title}</h3>
          <p className="text-sm">{slideInfo.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`slide-banner w-full max-h-full overflow-hidden`} style={{height: "inherit"}}>
      <div
        className="flex flex-row h-full"
        style={{width: `${slideCount * 100}%`, transform: `translateX(-${currentSlide * (100 / slideCount)}%)`, transition: `${slideAnimation ? "transform 0.5s ease" : ""}`}}
      >
        {createSlide(slides[slides.length - 1], 1)}
        {slides.map((slide, index) => createSlide(slide, index + 1))}
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
