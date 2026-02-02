import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.png";
import { FaInstagram } from "react-icons/fa6";
import { SlSocialTwitter } from "react-icons/sl";
import { PiLinkedinLogoBold } from "react-icons/pi";
import { RiFacebookBoxLine } from "react-icons/ri";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <section className="bg-(--background_dark_base)">
      <div className="max-w-7xl w-full mx-auto px-4 py-14 text-white">
        {/* Links and forms  */}
        <div className="md:flex md:flex-row-reverse">
          <FooterLinks />
          <FooterForm />
        </div>
        {/* copyrigth and socials */}
        <SocailHandles />
        <HorizontalLine />
        <Copyright />
      </div>
    </section>
  );
}

function FooterForm() {
  return (
    <div className="my-2 flex-col md:flex flex-1">
      <Link href="/" className="items-center md:flex ">
        <div className="w-44 h-12 relative my-0 ">
          <Image
            src={logo}
            alt={"logo"}
            fill
            className="object-contain"
          ></Image>
        </div>
      </Link>
      <p className="py-4 text-gray-400 text-sm md:text-base max-w-xs ">
        Your Transactions, Our Priority: Unparalleled Security and Trust. We
        provide Your Transactions, Our Priority: Unparalleled Security and
        Trust.
      </p>
    </div>
  );
}

function FooterLinks() {
  return (
    <nav className="flex my-2 flex-1 justify-between">
      <div className="py-2 flex-1">
        <h3 className="py-3 font-bold text-black dark:text-white text-lg">About TDM</h3>
        <ul className="flex-col pt-2">
          <li className="pb-4 ">
            <Link className="text-gray-400" href={"#"}>
              {" "}
              About Us{" "}
            </Link>
          </li>
          <li className="pb-4 ">
            <Link className="text-gray-400" href={"#"}>
              Contact Us{" "}
            </Link>
          </li>
          <li className="pb-4 ">
            <Link className="text-gray-400" href={"#"}>
              {" "}
              FAQs
            </Link>
          </li>
          <li className="pb-4 ">
            <Link className="text-gray-400" href={"#"}>
              {" "}
              Blog
            </Link>
          </li>
        </ul>
      </div>
      <div className="py-2 flex-1">
        <h3 className="py-3 font-bold text-black dark:text-white text-lg">Our Services</h3>
        <ul className="flex-col pt-2">
          <li className="pb-4">
            <Link className="text-gray-400" href={"#"}>
              Listing Service
            </Link>
          </li>
          <li className="pb-4">
            <Link className="text-gray-400" href={"#"}>
              MarketPlace{" "}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

const HorizontalLine = () => {
  return <div className="w-full border-t border-(--primary_light) my-4"></div>;
};

function SocailHandles() {
  return (
    <div className="md:flex md:justify-between pt-6  md:items-center">
      <div className="">
        <small className="text-sm font-bold">Connect with us</small>
      </div>
      <ul className="flex py-2">
        {/* Sidebar content here */}
        <li className="font-medium">
          <Link href={"#"}>
            {" "}
            <FaInstagram className="text-xl md:text-2xl text-gray-400" />
          </Link>
        </li>
        <li className="ml-2  font-medium">
          <Link href={"#"}>
            <SlSocialTwitter className="text-xl md:text-2xl text-gray-400" />
          </Link>
        </li>

        <li className="ml-2 font-medium">
          <Link href={"#"}>
            {" "}
            <PiLinkedinLogoBold className="text-xl md:text-2xl text-gray-400" />
          </Link>
        </li>
        <li className="ml-2 font-medium">
          <Link href={"#"}>
            {" "}
            <RiFacebookBoxLine className="text-xl md:text-2xl text-gray-400" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
function Copyright() {
  return (
    <div className="flex pt-4 items-center flex-wrap md:justify-between">
      <div className="pt-2 mr-4">
        <small className="text-sm pt-2">
          &copy; {currentYear} Trustedpayer LLC. All Rights Reserved.{" "}
        </small>
      </div>
      <ul className="flex pt-2">
        <li className="md:px-2">
          <Link className="text-sm text-gray-400" href={"#"}>
            Cookies
          </Link>
        </li>
        <li className="pl-2">
          <Link className="text-sm text-gray-400" href={"#"}>
            Terms and Agreement{" "}
          </Link>
        </li>
      </ul>
    </div>
  );
}
