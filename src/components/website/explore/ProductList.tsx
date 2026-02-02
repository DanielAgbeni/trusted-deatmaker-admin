"use client";

import { LiaStarSolid } from "react-icons/lia";
import p1Shoe from "../../../../public/images/p1_shoe.png";
import p2VehicleRepair from "../../../../public/images/p2_vehicle_repair.png";
import p1Laptop from "../../../../public/images/p3-laptop.png";
import p1LeatherShoe from "../../../../public/images/p4-leather_shoe.png";
import p1Haircut from "../../../../public/images/p5_haircut.png";
import p1Iphone from "../../../../public/images/p6_iphone.png";
import Image, { StaticImageData } from "next/image";
import { formatNumberWithCommas } from "@/utils/InvoiceForm";
import { IoIosHeart } from "react-icons/io";
import clsx from "clsx";
import { toast } from "react-toastify";
interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  type: string;
  new: boolean;
  deal: boolean;
  thumbnail: StaticImageData;
}

const productList: IProduct[] = [
  {
    id: 1,
    title: "Nike Airforce",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 50000,
    rating: 4,
    brand: "Nike",
    category: "shoe",
    type: "product",
    new: true,
    deal: false,
    thumbnail: p1Shoe,
  },
  {
    id: 2,
    title: "Vehicle Repair",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 35000,
    rating: 5,
    brand: "Nike",
    category: "shoe",
    type: "service",
    new: true,
    deal: false,
    thumbnail: p2VehicleRepair,
  },
  {
    id: 3,
    title: "Laptop",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 350000,
    rating: 5,
    brand: "macbook",
    category: "apple",
    type: "product",
    new: false,
    deal: true,
    thumbnail: p1Laptop,
  },
  {
    id: 4,
    title: "Leather Shoe",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 20000,
    rating: 3,
    brand: "persian",
    category: "shoe",
    type: "product",
    new: false,
    deal: false,
    thumbnail: p1LeatherShoe,
  },
  {
    id: 5,
    title: "Haircut",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 5000,
    rating: 4,
    brand: "Nike",
    category: "shoe",
    type: "service",
    new: false,
    deal: false,
    thumbnail: p1Haircut,
  },
  {
    id: 6,
    title: "Iphone 11",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 500000,
    rating: 5,
    brand: "apple",
    category: "phone",
    type: "product",
    new: true,
    deal: false,
    thumbnail: p1Iphone,
  },

  {
    id: 7,
    title: "Vehicle Repair",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 35000,
    rating: 5,
    brand: "Nike",
    category: "shoe",
    type: "service",
    new: true,
    deal: false,
    thumbnail: p2VehicleRepair,
  },
  {
    id: 8,
    title: "Nike Airforce",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 50000,
    rating: 4,
    brand: "Nike",
    category: "shoe",
    type: "product",
    new: true,
    deal: false,
    thumbnail: p1Shoe,
  },

  {
    id: 9,
    title: "Laptop",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 350000,
    rating: 5,
    brand: "macbook",
    category: "apple",
    type: "product",
    new: false,
    deal: true,
    thumbnail: p1Laptop,
  },
  {
    id: 10,
    title: "Haircut",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 5000,
    rating: 4,
    brand: "Nike",
    category: "shoe",
    type: "service",
    new: false,
    deal: false,
    thumbnail: p1Haircut,
  },
  {
    id: 11,
    title: "Iphone 11",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 500000,
    rating: 5,
    brand: "apple",
    category: "phone",
    type: "product",
    new: true,
    deal: false,
    thumbnail: p1Iphone,
  },
  {
    id: 12,
    title: "Leather Shoe",
    description:
      "Ratttan Outdoor furniture Set Waterproof  Rattan Sofa for Coffe Cafe",
    price: 20000,
    rating: 3,
    brand: "persian",
    category: "shoe",
    type: "product",
    new: false,
    deal: false,
    thumbnail: p1LeatherShoe,
  },
];

const notify = () => {
  toast.info("Coming Soon", {});
};

export default function ProductList() {
  return (
    <div className="pb-8 ">
      <ProductListHeading />

      <ul className="auto-rows-fr justify-items-center grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        {productList.map((el) => {
          return <ProductItem key={el.id} product={el} />;
        })}
      </ul>
    </div>
  );
}

function ProductListHeading() {
  return (
    <div className="my-6 mb-2 text-sm flex flex-col lg:flex-row justify-between items-center">
      <h1 className="font-bold text-(--foreground_dark_blue) text-xl  w-full lg:max-w-max ">
        Explore Products and Services
      </h1>
      <div className="flex lg:*:ml-2 lg:items-center w-full lg:max-w-max">
        <span>Showing 1-10 of 100 Products</span>
        <SortDropdown />
      </div>
    </div>
  );
}

function SortDropdown() {
  return (
    <details className="dropdown dropdown-end hidden lg:block">
      <summary className="btn btn-ghost rounded-btn btn-sm">Sort By</summary>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-1 p-2 shadow-sm bg-base-100 rounded-sm w-52 mt-4"
      >
        <ul className="space-y-1 ">
          <li>
            <label
              htmlFor="FilterSort0"
              className="inline-flex items-center gap-2 active:bg-inherit!"
            >
              <input
                type="radio"
                id="FilterSort0"
                className="radio radio-primary radio-sm checked:bg-primary focus:checked:bg-primary"
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
                className="radio radio-primary radio-sm checked:bg-primary focus:checked:bg-primary"
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
                className="radio radio-primary radio-sm checked:bg-primary focus:checked:bg-primary"
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
                className="radio radio-primary radio-sm checked:bg-primary focus:checked:bg-primary"
                name="sortControl"
              />

              <span className="text-sm font-medium text-gray-700">
                {" "}
                Price: Low-High{" "}
              </span>
            </label>
          </li>
        </ul>
      </ul>
    </details>
  );
}

function ProductItem({ product }: { product: IProduct }) {
  return (
    <li
      onClick={notify}
      className="shadow-xs rounded-xs border border-gray-300 w-full relative hover:cursor-pointer"
    >
      <span
        className={clsx(
          "rounded-e p-1 absolute left-0 top-0 z-10 font-semibold text-xs text-white",
          product.deal && "bg-green-500",
          product.new && "bg-red-500"
        )}
      >
        {" "}
        {(product.deal && "Deal") || (product.new && "New")}
      </span>
      {product.type === "product" ? (
        <div
          className={clsx(
            "relative w-full h-40 sm:h-52 flex justify-center items-center"
          )}
        >
          <Image
            alt="Hero Image"
            src={product.thumbnail}
            sizes="100vw"
            style={{
              width: "auto",
              height: "90%",
            }}
          />
        </div>
      ) : (
        <div className={clsx("relative w-full h-40 sm:h-52 ")}>
          <Image
            alt="Mountains"
            src={product.thumbnail}
            placeholder="blur"
            quality={100}
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      )}
      <div className="flex flex-col border-t border-gray-300 p-3">
        <h3 className="text-xs font-medium my-1 text-(--foreground_dark_blue)">
          {" "}
          {product.title}
        </h3>
        <p className="text font-bold">
          ₦{formatNumberWithCommas(product.price)}
        </p>
        <div className="flex justify-between">
          <div className="flex items-center">
            <RatingComponent amount={product.rating} />
            <span className="text-xs mx-2 text-gray-500"> 1020</span>
          </div>
          <IoIosHeart className="text-gray-300" />
        </div>
      </div>
    </li>
  );
}

function RatingComponent({ amount }: { amount: number }) {
  const stars = [...new Array(5)].map((el, i) => (
    <LiaStarSolid key={i} className="text-gray-300 text-xs" />
  ));

  return (
    <div className="flex *:ml-0.5">
      {[...stars].map((el, i) => {
        if (i < amount) {
          return <LiaStarSolid key={i} className="text-yellow-400 text-xs" />;
        } else {
          return el;
        }
      })}
    </div>
  );
}
