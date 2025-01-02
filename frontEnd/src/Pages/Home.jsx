import BannerImageSlider from "../Components/BannerImageSlider";

const TestingSlider = () => {
  const slides = [
    {
      url: "/public/1-1.webp",
      alt: "sliderImage1",
    },
    {
      url: "/public/Slider_image_2 1.png",
      alt: "sliderImage5",
    },
    {
      url: "/public/Slider_Image_3 1.png",
      alt: "sliderImage2",
    },
    {
      url: "/public/Slider_Image_4 1.png",
      alt: "sliderImage3",
    },

    {
      url: "/public/Slider_Image_5 1.png",
      alt: "sliderImage4",
    },
  ];

  return (
    <>
      <div>
        {/* <h1>Welcome to testing</h1> */}
        <div className="w-full h-[100vh] bg-no-repeat bg-center">
          <BannerImageSlider slides={slides} />
        </div>
      </div>
    </>
  );
};

export default TestingSlider;
