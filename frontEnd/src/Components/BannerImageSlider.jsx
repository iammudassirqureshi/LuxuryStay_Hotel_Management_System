import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const BannerImageSlider = ({ slides, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const autoChange = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, interval);
    return () => clearInterval(autoChange);
  }, [slides, interval]);

  const slideStyle = {
    width: "100%",
    height: "100%",
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <div className="slider flex justify-center items-center h-full relative">
        <div
          onClick={goToPrevious}
          className="left-arrow absolute top-1/2 left-0 px-10  z-10 cursor-pointer text-4xl text-white opacity-70"
        >
          <FaAngleLeft />
        </div>
        <div className="slide h-full w-full relative">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              style={slideStyle}
            >
              <img
                src={slide.url}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div
          onClick={goToNext}
          className="right-arrow absolute top-1/2 z-10 px-10 right-0 cursor-pointer text-4xl text-white opacity-70"
        >
          <FaAngleRight />
        </div>
      </div>
    </>
  );
};

export default BannerImageSlider;
