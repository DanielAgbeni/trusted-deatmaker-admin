"use client";
import { CiSearch } from "react-icons/ci";

export default function SearchBarFIlter() {
  return (
    <div className="w-full mb-2">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md lg:max-w-full ">
          <label htmlFor="Search" className="sr-only">
            {" "}
            Search{" "}
          </label>

          <input
            type="text"
            id="Search"
            placeholder="Search for..."
            className="w-full rounded-xs border-gray-200 py-2.5 pe-10 shadow-xs sm:text-sm"
          />

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-700 "
            >
              <span className="sr-only">Search</span>
              <CiSearch className="text-xl" />
            </button>
          </span>
        </div>
        <label
          htmlFor="productFilter"
          className="drawer-button btn btn-ghost btn-circle  lg:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 14C11.3063 14 12.4175 14.8349 12.8293 16.0001L19 16C19.5523 16 20 16.4477 20 17C20 17.5523 19.5523 18 19 18L12.829 18.0009C12.4169 19.1656 11.3059 20 10 20C8.69412 20 7.58312 19.1656 7.17102 18.0009L1 18C0.447715 18 0 17.5523 0 17C0 16.4477 0.447715 16 1 16L7.17067 16.0001C7.58249 14.8349 8.69375 14 10 14ZM10 16C9.44771 16 9 16.4477 9 17C9 17.5523 9.44771 18 10 18C10.5523 18 11 17.5523 11 17C11 16.4477 10.5523 16 10 16ZM17 7C18.6569 7 20 8.34315 20 10C20 11.6569 18.6569 13 17 13C15.6941 13 14.5831 12.1656 14.171 11.0009L1 11C0.447715 11 0 10.5523 0 10C0 9.44771 0.447715 9 1 9L14.1707 9.00009C14.5825 7.83485 15.6937 7 17 7ZM17 9C16.4477 9 16 9.44771 16 10C16 10.5523 16.4477 11 17 11C17.5523 11 18 10.5523 18 10C18 9.44771 17.5523 9 17 9ZM3 0C4.3118 0 5.42695 0.841956 5.83453 2.01495C5.88799 2.00469 5.94344 2 6 2H19C19.5523 2 20 2.44772 20 3C20 3.55228 19.5523 4 19 4H6C5.94344 4 5.88799 3.99531 5.83399 3.98628C5.42695 5.15804 4.3118 6 3 6C1.34315 6 0 4.65685 0 3C0 1.34315 1.34315 0 3 0ZM3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4C3.55228 4 4 3.55228 4 3C4 2.44772 3.55228 2 3 2Z"
              fill="#0097C7"
            />
          </svg>
        </label>
      </div>
    </div>
  );
}
