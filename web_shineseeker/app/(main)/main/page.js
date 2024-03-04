"use client";
import Image from "next/image";
import {useState, useEffect} from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  let stopSlideFunc;

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 3000); // 3초마다 슬라이드 변경

    stopSlideFunc = () => {
      clearInterval(intervalId);
    };
    return () => {
      clearInterval(intervalId);
    };
  }, [currentSlide]);

  const slides = [
    {
      imageUrl: "https://via.placeholder.com/800x400?text=Slide%201",
      title: "첫 번째 슬라이드",
      description: "이것은 첫 번째 슬라이드입니다.",
    },
    {
      imageUrl: "https://via.placeholder.com/800x400?text=Slide%202",
      title: "두 번째 슬라이드",
      description: "이것은 두 번째 슬라이드입니다.",
    },
    {
      imageUrl: "https://via.placeholder.com/800x400?text=Slide%203",
      title: "세 번째 슬라이드",
      description: "이것은 세 번째 슬라이드입니다.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid grid-cols-6" style={{height: "400px"}}>
        <div className="login col-span-1 max-h-full mr-4" style={{height: "inherit"}}>
          <div className="bg-gray-100 max-h-full flex flex-col items-center">
            {/* 로고 */}
            <div className="relative bg-gray-800 text-white w-full h-96">
              <Image src="https://via.placeholder.com/300x300?text=login" alt="로고" fill={true} />
            </div>

            {/* 로그인 폼 */}
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">로그인</h2>
              <form>
                <div className="mb-1 flex">
                  <label htmlFor="username" className="block text-gray-700 w-1/3">
                    아이디
                  </label>
                  <input type="text" id="username" name="username" className="mt-1 p-2 block w-full border-gray-300 rounded-md" />
                </div>
                <div className="mb-1">
                  <label htmlFor="password" className="block text-gray-700">
                    비밀번호
                  </label>
                  <input type="password" id="password" name="password" className="mt-1 p-2 block w-full border-gray-300 rounded-md" />
                </div>
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                  로그인
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="slide-banner col-span-5 max-h-full" style={{height: "inherit"}}>
          <div className="relative w-full h-full">
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2" onClick={prevSlide}>
              이전
            </button>
            <img src={slides[currentSlide].imageUrl} alt={`Slide ${currentSlide + 1}`} className="w-full h-full object-cover" />
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2" onClick={nextSlide}>
              다음
            </button>
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
              <h3 className="text-lg font-bold">{slides[currentSlide].title}</h3>
              <p className="text-sm">{slides[currentSlide].description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-x-4 w-full" style={{height: "400px"}}>
        <div className="grid-cols-1 bg-slate-700"></div>
        <div className="grid-cols-1 bg-slate-700"></div>
        <div className="grid-cols-1 bg-slate-700"></div>
        <div className="grid-cols-1 bg-slate-700"></div>
      </div>
    </main>
  );
}
