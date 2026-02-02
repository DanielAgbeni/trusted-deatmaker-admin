import Image from "next/image";
import Link from "next/link";
import appStore from "../../../public/images/app_store.png";
import getApp from "../../../public/images/getApp.png";
import playStore from "../../../public/images/play_store.png";
import { FaRegCircleCheck } from "react-icons/fa6";

const GetAppItem = {
  heading: "What are you waiting for, get the app now!",
  featurelist: [
    "Suitable for use on any device",
    "A simple and intuitive interface for a stress free experience.",
  ],
  img: "https://picsum.photos/650/350",
};

export default function GetApp() {
  return (
    <section
      id="home-download-banner"
      className="bg-(--background_light_blue) mb-16"
    >
      <div className="w-full max-w-7xl mx-auto px-4 pt-8">
        <article className="my-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-16 ">
            <div className={"lg:order-last"}>
              <div className={"flex flex-col sm:max-w-md mx-auto"}>
                <Image
                  alt="Hero Image"
                  // Importing an image will
                  // automatically set the width and height
                  src={getApp}
                  sizes="100vw"
                  // Make the image display full width
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>
            </div>

            <div className="">
              <h3 className="text-3xl my-2 font-medium md:text-5xl lg:text-6xl md:leading-[1.35] lg:leading-[1.35]">
                {" "}
                {GetAppItem.heading}
              </h3>
              <p className=" my-2 text-(--foreground_neutral_base) md:text-lg lg:text-xl lg:leading-relaxed">
                Ready to experience hassle-free transactions? Download Trusted
                Deal Maker now and take the first step towards secure deals.
                Your peace of mind is just a click away!
              </p>

              <ul className="my-4">
                {GetAppItem.featurelist.map((el, i) => (
                  <li key={i} className="inline-flex items-start my-2 ">
                    <span className="mr-2 pt-1">
                      <FaRegCircleCheck className="text-primary md:text-xl" />
                    </span>
                    <span className="md:text-lg lg:text-xl lg:leading-relaxed font-semibold">
                      {el}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex">
                <Link href={"#"} className="">
                  <Image alt="app store" src={appStore} quality={100} />
                </Link>
                <Link href={"#"} className="mx-2">
                  <Image alt="app store" src={playStore} quality={100} />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
