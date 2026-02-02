"use client";

import Image from "next/image";
import hero1 from "../../../../public/images/hero-1.png";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main>
      <section className="my-8 md:my-16">
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col-reverse md:flex-row gap-8 my-4 md:my-8 justify-stretch">
            <div className="sm:max-w-md md:max-w-lg mx-auto flex-1">
              <h1 className="capitalize text-center text-3xl my-2 font-medium  md:leading-[1.35] lg:leading-[1.35]">
                <span className="text-primary">
                  Safeguard Your Transactions,{" "}
                </span>
                Every Step of the Way
              </h1>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Image
                  alt="Hero Image"
                  // Importing an image will
                  // automatically set the width and height
                  src={hero1}
                  sizes="100vw"
                  // Make the image display full width
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>
            </div>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
