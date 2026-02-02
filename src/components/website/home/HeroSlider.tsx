"use client";
import { Autoplay, A11y, EffectFade, Thumbs } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export function HeroImgSlider({
  heroImgs,
  thumbsSwiper,
}: {
  heroImgs: StaticImageData[];
  thumbsSwiper: any;
}) {
  return (
    <div className="sm:max-w-md md:max-w-lg mx-auto">
      <Swiper
        grabCursor={true}
        effect={"fade"}
        thumbs={{ swiper: thumbsSwiper }}
        // install Swiper modules Autoplay,
        modules={[A11y, Autoplay, Thumbs, EffectFade]}
        spaceBetween={50}
        slidesPerView={1}
        speed={500}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={true}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        {heroImgs.map((el, i) => (
          <SwiperSlide key={i}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Image
                alt="Hero Image"
                // Importing an image will
                // automatically set the width and height
                src={el}
                sizes="100vw"
                // Make the image display full width
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export function TitleSlider({
  heroContent,
  setThumbsSwiper,
}: {
  setThumbsSwiper: any;
  heroContent: {
    title: JSX.Element;
  }[];
}) {
  return (
    <div className="w-full">
      <Swiper
        grabCursor={true}
        effect={"fade"}
        // install Swiper modules Autoplay,
        modules={[A11y, Autoplay, Thumbs, EffectFade]}
        slidesPerView={1}
        speed={500}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={true}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        onSlideChange={() => console.log("slide change")}
      >
        {heroContent.map((el, i) => (
          <SwiperSlide key={i} className="h-auto! justify-stretch">
            <div className=" bg-[url('../../public/images/Hero_bg_1.png')] bg-[length:200px_100px] md:bg-auto  bg-no-repeat bg-right-top">
              {el.title}
            </div>
            <p className="text-left my-4 text-(--foreground_neutral_base) md:text-lg lg:text-xl lg:leading-relaxed">
              Ready to experience hassle-free transactions? Download Trusted
              Deal Maker now and take the first step towards secure deals. Your
              peace of mind is just a click away!
            </p>
            <div className="flex items-center justify-start my-6 gap-6">
              <Link
                href={"#"}
                className="btn btn-primary shadow-md rounded-md justify-end text-white"
              >
                Get Started
              </Link>
              <Link
                href={"#"}
                className="btn btn-primary btn-outline shadow-md rounded-md justify-end"
              >
                Learn More
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
