import Image, { StaticImageData } from "next/image";
// import { RecognizedBy } from "../(home)/page";
import aboutHero from "../../../../public/images/aboutHero.png";
import tinyLogo from "../../../../public/images/tiny_logo.png";
import aboutus from "../../../../public/images/about_us.png";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import TeamMembers from "@/components/website/about/TeamMembers";
import GetApp from "@/components/website/GetApp";
import FAQs from "@/components/website/FAQS";

const featurelist = [
  "We provide 24/7 service",
  "Qualified Escrow",
  "Fast Customer Support",
  "Seamless Experience",
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      <Commitments />

      {/* RecognizedBy */}
      {/* <RecognizedBy /> */}

      <TeamMembers />

      {/* GetApp */}
      <GetApp />

      {/* FAQs */}
      <FAQs />
    </main>
  );
}

function Hero() {
  return (
    <section className={"relative w-full h-[520px] "}>
      <Image
        alt="Mountains"
        src={aboutHero}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      <div
        className={
          "flex flex-col bg-black/50 h-[520px] p-4 md:p-20  text-white justify-center items-start"
        }
      >
        <div className="mt-8 max-w-3xl mx-auto">
          <h1 className="my-4 text-2xl lg:text-6xl font-bold leading-snug text-center">
            About Us
          </h1>
          <p className="my-4 text-center max-w-xl">
            Trusteddealmaker is a trading marketplace owned by
            TrustedPayer LLC, which aims to provide trust for trades in markets
            lacking structures for secure transactions between parties.
          </p>
        </div>
      </div>
    </section>
  );
}

function Commitments() {
  return (
    <section className="my-16">
      <div className="w-full max-w-7xl mx-auto px-4  py-8">
        <article className="my-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-16 ">
            <div className={"lg:order-last"}>
              <div
                className={
                  "flex flex-col sm:max-w-md md:max-w-lg lg:w-auto mx-auto"
                }
              >
                <Image
                  alt="Hero Image"
                  // Importing an image will
                  // automatically set the width and height
                  src={aboutus}
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
              <div className="bg-gray-100 p-2 w-max inline-flex ">
                {/* tinyLogo */}
                <Image src={tinyLogo} alt="Picture of the author" />
                <span className="font-medium text-(--foreground_dark_blue) ml-2">
                  Welcome to Trusted Payer
                </span>
              </div>
              <h3 className="text-3xl my-2 font-bold md:text-5xl lg:text-6xl md:leading-[1.35] lg:leading-[1.35]">
                {" "}
                We’re Commited to Quality
              </h3>
              <p className=" my-2 text-(--foreground_neutral_base) md:text-lg lg:text-xl lg:leading-relaxed">
                Your Transactions, Our Priority: Unparalleled Security and
                Trust. We provide Your Transactions, Our Priority: Unparalleled
                Security and Trust.
              </p>

              <ul className="my-4 grid md:grid-cols-2 gap-4">
                {featurelist.map((el, i) => (
                  <li key={i} className="inline-flex items-start my-2">
                    <span className="mr-2 pt-1">
                      <IoCheckmarkCircleSharp className="text-primary md:text-2xl" />
                    </span>
                    <span className="md:text-lg lg:leading-relaxed font-light">
                      {el}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
