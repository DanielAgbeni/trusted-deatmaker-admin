import VIlagos from "../../../../public/images/vi.png";
import { FaInstagram } from "react-icons/fa6";
import { SlSocialTwitter } from "react-icons/sl";
import { PiLinkedinLogoBold } from "react-icons/pi";
import { RiFacebookBoxLine } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/website/beta/ContactForm";

function BetaPage() {
  return (
    <main>
      <section className="my-16">
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-4xl w-full mx-auto shadow-md rounded-sm p-4 md:p-8">
            <h1 className="text-primary text-center font-bold text-2xl">
              Get Latest update on our BETA version
            </h1>
            <HorizontalLine />
            <div className="flex flex-col md:flex-row gap-8 my-8 justify-stretch">
              <ContactForm />
              <ContactDetails />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HorizontalLine() {
  return <div className="w-36 border-t border-2 border-primary mx-auto"></div>;
}

function ContactDetails() {
  return (
    <div className="flex-1 font-medium">
      <p className="mb-2">
        <span className="block">TrustedDealMaker</span>
        <span className="block">Victoria Island, Lagos, Nigeria.</span>
      </p>

      <p className="my-2">
        <a href="tel:+2348112364568">+234 081-1236-4568</a>
      </p>
      <p className="my-2">
        <a href="mailto:services@trustedpayer.co"> services@trustedpayer.co </a>
      </p>
      <SocailHandles />
      <div className="relative h-48 rounded-sm">
        <Image
          alt="Mountains"
          src={VIlagos}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          className="object-cover rounded-sm"
        />
      </div>
    </div>
  );
}

function SocailHandles() {
  return (
    <div className="md:flex md:justify-between my-4  md:items-center">
      <div className="">
        <small className="text-sm font-bold">Connect with us</small>
      </div>
      <ul className="flex py-2">
        {/* Sidebar content here */}
        <li className="font-medium hover:scale-105">
          <Link href={"#"}>
            {" "}
            <FaInstagram className="text-xl md:text-2xl text-black" />
          </Link>
        </li>
        <li className="ml-2  font-medium hover:scale-105">
          <Link href={"#"}>
            <SlSocialTwitter className="text-xl md:text-2xl text-black" />
          </Link>
        </li>

        <li className="ml-2 font-medium hover:scale-105">
          <Link href={"#"}>
            {" "}
            <PiLinkedinLogoBold className="text-xl md:text-2xl text-black" />
          </Link>
        </li>
        <li className="ml-2 font-medium hover:scale-105">
          <Link href={"#"}>
            {" "}
            <RiFacebookBoxLine className="text-xl md:text-2xl text-black" />
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default BetaPage;
