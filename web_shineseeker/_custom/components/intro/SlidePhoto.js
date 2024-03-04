"use client";
import {useState} from "react";

export default function Component() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {id: 1, imageUrl: "https://via.placeholder.com/600x300?text=Slide%201"},
    {id: 2, imageUrl: "https://via.placeholder.com/600x300?text=Slide%202"},
    {id: 3, imageUrl: "https://via.placeholder.com/600x300?text=Slide%203"},
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  };

  return (
    <div className="slide-banner relative h-96">
      <div className="slides relative h-full overflow-hidden">
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.imageUrl}
            alt={`Slide ${slide.id}`}
            className={
              currentSlide === index
                ? "slide absolute inset-0 w-full h-full opacity-100 transition-opacity duration-500"
                : "slide absolute inset-0 w-full h-full opacity-0 transition-opacity duration-500"
            }
          />
        ))}
        <div className="dots absolute bottom-4 left-0 w-full flex justify-center">
          {slides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`dot mx-1 w-4 h-4 rounded-full ${currentSlide === index ? "bg-black" : "bg-gray-300"}`}></button>
          ))}
        </div>
      </div>
      <button className="prev absolute top-1/2 left-0 transform -translate-y-1/2 bg-black text-white px-4 py-2 rounded-l-md" onClick={prevSlide}>
        Previous
      </button>
      <button className="next absolute top-1/2 right-0 transform -translate-y-1/2 bg-black text-white px-4 py-2 rounded-r-md" onClick={nextSlide}>
        Next
      </button>
    </div>
  );
}
