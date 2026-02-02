"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.png";
import { usePathname } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="navbar bg-(--nav-bg) py-4 md:py-6 border-b border-gray-300">
      <div className="max-w-7xl w-full mx-auto  flex flex-row-reverse md:flex-row items-center">
        <div className="flex basis-1 justify-end md:justify-start">
          <label
            htmlFor="my-drawer-3"
            aria-label="open sidebar"
            className="btn btn-circle btn-ghost md:hidden"
          >
            <div tabIndex={0} role="button" className="btn btn-ghost px-0 mx-0">
              <svg
                width="37"
                height="37"
                viewBox="0 0 37 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32.375 27.75H13.875V24.6667H32.375V27.75ZM32.375 20.0417H4.625V16.9583H32.375V20.0417ZM32.375 12.3333H13.875V9.25H32.375V12.3333Z"
                  fill="#0097C7"
                />
              </svg>
            </div>
          </label>
          <Link href="/" className="items-center hidden md:flex">
            <div className="w-40 h-12 relative my-0 ">
              <Image
                src={logo}
                alt={"logo"}
                fill
                className="object-contain"
              ></Image>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 md:flex-3 justify-start">
          <Link href="/" className="flex md:hidden">
            <div className="w-36 h-12 relative my-0 flex md:hidden ">
              <Image
                src={logo}
                alt={"logo"}
                fill
                className="object-contain"
              ></Image>
            </div>
          </Link>
          {/* <ul className="hidden md:menu md:menu-horizontal px-1 w-full justify-center ">
            <li
              className={`tracking-wider	antialiased font-semibold  active:*:bg-transparent  ${
                pathname === "/"
                  ? "text-(--foreground_dark_blue)"
                  : "text-gray-400 "
              }`}
            >
              <Link
                className="active:bg-transparent hover:bg-transparent hover:text-(--foreground_dark_blue)"
                href={"/"}
              >
                Home
              </Link>
            </li>
            <li
              className={`tracking-wider	antialiased font-semibold  active:*:bg-transparent ${
                pathname === "/about"
                  ? "text-(--foreground_dark_blue)"
                  : "text-gray-400 "
              }`}
            >
              <Link
                className="active:bg-transparent hover:bg-transparent hover:text-(--foreground_dark_blue)"
                href={"/about"}
              >
                About Us
              </Link>
            </li>

            <li
              className={`tracking-wider	antialiased font-semibold  active:*:bg-transparent ${
                pathname === "/beta"
                  ? "text-(--foreground_dark_blue)"
                  : "text-gray-400 "
              }`}
            >
              <Link
                className="active:bg-transparent hover:bg-transparent hover:text-(--foreground_dark_blue)"
                href={"/beta"}
              >
                Join Beta
              </Link>
            </li>
            <li
              className={`tracking-wider	antialiased font-semibold  active:*:bg-transparent ${
                pathname === "/explore"
                  ? "text-(--foreground_dark_blue)"
                  : "text-gray-400 "
              }`}
            >
              <Link
                className="active:bg-transparent hover:bg-transparent hover:text-(--foreground_dark_blue)"
                href={"/explore"}
              >
                Explore
              </Link>
            </li>
          </ul> */}
        </div>
        <div className="hidden max-md:flex-1 basis-56 md:flex justify-between items-center">
          {/* <Link
            href={"/#home-download-banner"}
            className="btn w-fit btn-primary shadow-md rounded-md text-white"
          >
            Download App
          </Link> */}
          <Link
            href={"/signin"}
            className="bg-primary  w-fit no-underline text-white hover:text-white px-4 py-2 rounded-md"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
export function SideDrawer() {
  const pathname = usePathname();

  return (
    <div className="drawer-side z-10">
      <label
        htmlFor="my-drawer-3"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu p-4 w-60 min-h-full bg-white">
        {/* Sidebar content here */}
        <li
          className={`tracking-wider	antialiased font-semibold  active:*:bg-transparent  ${
            pathname === "/"
              ? "text-(--foreground_dark_blue)"
              : "text-gray-400 "
          }`}
        >
          <Link
            className="active:bg-transparent hover:bg-transparent hover:text-(--foreground_dark_blue)"
            href={"/"}
          >
            Home
          </Link>
        </li>
        <li
          className={`tracking-wider	antialiased font-semibold  active:*:bg-transparent ${
            pathname === "/about"
              ? "text-(--foreground_dark_blue)"
              : "text-gray-400 "
          }`}
        >
          <Link
            className="active:bg-transparent hover:bg-transparent hover:text-(--foreground_dark_blue)"
            href={"/about"}
          >
            About Us
          </Link>
        </li>

        <li
          className={`tracking-wider	antialiased font-semibold  active:*:bg-transparent ${
            pathname === "/beta"
              ? "text-(--foreground_dark_blue)"
              : "text-gray-400 "
          }`}
        >
          <Link
            className="active:bg-transparent hover:bg-transparent hover:text-(--foreground_dark_blue)"
            href={"/beta"}
          >
            Join Beta
          </Link>
        </li>
        <li
          className={`tracking-wider	antialiased font-semibold  active:*:bg-transparent ${
            pathname === "/explore"
              ? "text-(--foreground_dark_blue)"
              : "text-gray-400 "
          }`}
        >
          <Link
            className="active:bg-transparent hover:bg-transparent hover:text-(--foreground_dark_blue)"
            href={"/explore"}
          >
            Explore
          </Link>
        </li>
        <li>
          {/* <Link
            href={"/#home-download-banner"}
            className="btn w-fit btn-primary shadow-md rounded-md text-white"
          >
            Download App
          </Link> */}
          <Link
            href={"/signin"}
            className="btn btn-link px-3 w-fit no-underline text-primary/65 hover:text-primary hover:no-underline "
          >
            Sign up
          </Link>
        </li>
        <li>
          <HoverCard>
            <HoverCardTrigger className="btn px-3 btn-link w-fit no-underline text-primary/65 hover:text-primary hover:no-underline ">
              Sign In
            </HoverCardTrigger>
            <HoverCardContent>
              <Link
                href={"/signup"}
                className="btn btn-link w-fit no-underline text-primary/65 hover:text-primary hover:no-underline "
              >
                As marketplace user
              </Link>
              <Link
                href={"/signup"}
                className="btn btn-link w-fit no-underline text-primary/65 hover:text-primary hover:no-underline "
              >
                As buyer/seller user
              </Link>
            </HoverCardContent>
          </HoverCard>
        </li>
      </ul>
    </div>
  );
}
