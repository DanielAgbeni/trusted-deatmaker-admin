"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdCloseCircle } from "react-icons/io";

export default function FilterMenu() {
  const pathname = usePathname();

  return (
    <ul className="menu p-4 pt-12 lg:p-0 w-full min-h-full bg-white text-base-content relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="my-2.5 font-bold text-xl text-(--foreground_dark_blue) px-4">
          Filters
        </h3>
        <label
          htmlFor="productFilter"
          className="drawer-[--background_dark_base] p-0.5 lg:hidden"
        >
          <IoMdCloseCircle className="text-primary text-4xl font-black" />
        </label>
      </div>
      <nav>
        <ul className="flex">
          <li
            className={`tracking-wider antialiased font-semibold  active:*:bg-transparent border-b-4 flex-1 p-2 px-4 text-center active:!bg-inherit ${
              pathname === "/explore"
                ? "text-(--foreground_dark_blue) border-primary"
                : "text-gray-400 border-gray-400"
            }`}
          >
            <Link
              className="px-0 active:bg-inherit! hover:bg-transparent hover:text-(--foreground_dark_blue)"
              href={"#"}
            >
              Products
            </Link>
          </li>
          <li
            className={`tracking-wider antialiased font-semibold  active:*:bg-transparent border-b-2 flex-1 p-2 px-4 text-center active:!bg-inherit ${
              pathname === "/explore/service"
                ? "text-(--foreground_dark_blue) border-primary"
                : "text-gray-400 border-gray-400"
            }`}
          >
            <Link
              className="px-0 active:bg-inherit! hover:bg-transparent hover:text-(--foreground_dark_blue)"
              href={"#"}
            >
              Services
            </Link>
          </li>
        </ul>
      </nav>
      <form action="">
        <div className="space-y-2 divide-y divide-(--foreground_neutral_base) flex flex-col">
          <details
            open
            className=" group overflow-hidden [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
              <span className="text-sm font-medium"> Category </span>

              <span className="transition group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </summary>

            <div className="border-t border-gray-200 bg-white">
              <ul className="space-y-1 border-t border-gray-200 p-4">
                <li>
                  <label
                    htmlFor="FilterCategory"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterCategory"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Commercial equipments
                    </span>
                  </label>
                </li>

                <li>
                  <label
                    htmlFor="FilterCategory1"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterCategory1"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Fashion
                    </span>
                  </label>
                </li>

                <li>
                  <label
                    htmlFor="FilterCategory2"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterCategory2"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Home Appliances
                    </span>
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="FilterCategory3"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterCategory3"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Mobile Phones
                    </span>
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="FilterCategory3"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterCategory3"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Vehicles
                    </span>
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="FilterCategory4"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterCategory4"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      Furnitures
                    </span>
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="FilterCategory5"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterCategory5"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Electronics
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </details>
          <details
            open
            className=" group overflow-hidden [&_summary::-webkit-details-marker]:hidden lg:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
              <span className="text-sm font-medium"> Sort By </span>

              <span className="transition group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </summary>

            <div className="border-t border-gray-200 bg-white">
              <ul className="space-y-1 border-t border-gray-200 p-4">
                <li>
                  <label
                    htmlFor="FilterSort0"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="radio"
                      id="FilterSort0"
                      className="radio radio-primary checked:bg-primary focus:checked:bg-primary"
                      name="sortControl"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Featured{" "}
                    </span>
                  </label>
                </li>

                <li>
                  <label
                    htmlFor="FilterSort1"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="radio"
                      id="FilterSort1"
                      className="radio radio-primary checked:bg-primary focus:checked:bg-primary"
                      name="sortControl"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Newest{" "}
                    </span>
                  </label>
                </li>

                <li>
                  <label
                    htmlFor="FilterSort2"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="radio"
                      id="FilterSort2"
                      className="radio radio-primary checked:bg-primary focus:checked:bg-primary"
                      name="sortControl"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Price: High-Low{" "}
                    </span>
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="FilterSort3"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="radio"
                      id="FilterSort3"
                      className="radio radio-primary checked:bg-primary focus:checked:bg-primary"
                      name="sortControl"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Price: Low-High{" "}
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </details>
          <details
            open
            className=" group overflow-hidden [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
              <span className="text-sm font-medium"> Price</span>

              <span className="transition group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </summary>

            <div className="border-t border-gray-200 bg-white">
              <ul className="space-y-1 border-t border-gray-200 p-4">
                <li>
                  <label
                    htmlFor="FilterPrice0"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="radio"
                      id="FilterPrice0"
                      className="radio radio-primary checked:bg-primary focus:checked:bg-primary"
                      name="priceControl"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Price: ₦5,000 - 15,000
                    </span>
                  </label>
                </li>

                <li>
                  <label
                    htmlFor="FilterPrice1"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="radio"
                      id="FilterPrice1"
                      className="radio radio-primary checked:bg-primary focus:checked:bg-primary"
                      name="priceControl"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Price: ₦15,000 - 40,000
                    </span>
                  </label>
                </li>

                <li>
                  <label
                    htmlFor="FilterPrice2"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="radio"
                      id="FilterPrice2"
                      className="radio radio-primary checked:bg-primary focus:checked:bg-primary"
                      name="priceControl"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Price: ₦45,000 - 80,000
                    </span>
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="FilterPrice3"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="radio"
                      id="FilterPrice3"
                      className="radio radio-primary checked:bg-primary focus:checked:bg-primary"
                      name="priceControl"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Price: ₦80,000 - 150,000
                    </span>
                  </label>
                </li>
              </ul>
              <div className="border-t border-gray-200 p-4">
                <div className="flex justify-between gap-4">
                  <label
                    htmlFor="FilterPriceFrom"
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm text-gray-600">₦</span>

                    <input
                      type="number"
                      id="FilterPriceFrom"
                      placeholder="From"
                      className="w-full rounded-md border-gray-200 shadow-xs sm:text-sm"
                    />
                  </label>

                  <label
                    htmlFor="FilterPriceTo"
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm text-gray-600">₦</span>

                    <input
                      type="number"
                      id="FilterPriceTo"
                      placeholder="To"
                      className="w-full rounded-md border-gray-200 shadow-xs sm:text-sm"
                    />
                  </label>
                </div>
              </div>
            </div>
          </details>
          <details
            open
            className=" group overflow-hidden [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
              <span className="text-sm font-medium"> Brand </span>

              <span className="transition group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </summary>

            <div className="border-t border-gray-200 bg-white">
              <ul className="space-y-1 border-t border-gray-200 p-4">
                <li>
                  <label
                    htmlFor="FilterCategory"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterBrand0"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Dell
                    </span>
                  </label>
                </li>

                <li>
                  <label
                    htmlFor="FilterBrand1"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterBrand1"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Toshiba
                    </span>
                  </label>
                </li>

                <li>
                  <label
                    htmlFor="FilterBrand2"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterBrand2"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Samsung
                    </span>
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="FilterBrand3"
                    className="inline-flex items-center gap-2 active:bg-inherit!"
                  >
                    <input
                      type="checkbox"
                      id="FilterBrand3"
                      className="checkbox checkbox-primary rounded-xs [--chkfg:white] checkbox-sm"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Hp
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </details>
        </div>
      </form>
    </ul>
  );
}
