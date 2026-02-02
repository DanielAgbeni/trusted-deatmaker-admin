"use client";
import { HeroImgSlider, TitleSlider } from "./HeroSlider";
import hero1 from "../../../../public/images/hero-1.png";
import hero2 from "../../../../public/images/hero-2.png";
import hero3 from "../../../../public/images/hero-3.png";
import { useState } from "react";
import { GoShieldCheck } from "react-icons/go";

const heroContent = [
  {
    title: (
      <h1 className="capitalize text-left text-3xl my-2 font-medium md:text-5xl lg:text-6xl md:leading-[1.35] lg:leading-[1.35]">
        <span className="text-primary">Safeguard Your Transactions, </span>
        Every Step of the Way
      </h1>
    ),
  },
  {
    title: (
      <h1 className="capitalize text-left text-3xl my-2 font-medium md:text-5xl lg:text-6xl md:leading-[1.35] lg:leading-[1.35]">
        Now you can buy
        <span className="text-primary"> what you really want </span> without
        being
        <span className="text-primary"> scammed</span>
      </h1>
    ),
  },
  {
    title: (
      <h1 className="capitalize text-left text-3xl my-2 font-medium md:text-5xl lg:text-6xl md:leading-[1.35] lg:leading-[1.35]">
        <span className="text-primary">Overcome Distance barriers</span>, and
        buy products across boundaries{" "}
      </h1>
    ),
  },
];
const heroImgs = [hero1, hero2, hero3];

export default function HeroSection() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <section>
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <article className="my-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <div className="lg:py-2">
              <span className="inline-flex items-center sm:text-lg font-medium capitalize text-primary my-2">
                SECURE TRADING
                <GoShieldCheck className="text-xl sm:text-3xl text-primary mx-2" />
              </span>
              {/* Heading 1 carousel */}
              <TitleSlider
                heroContent={heroContent}
                setThumbsSwiper={setThumbsSwiper}
              />
            </div>
            <div className={"overflow-hidden lg:h-full"}>
              <HeroImgSlider thumbsSwiper={thumbsSwiper} heroImgs={heroImgs} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
