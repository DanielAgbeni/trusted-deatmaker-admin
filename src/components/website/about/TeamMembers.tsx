import Image, { StaticImageData } from "next/image";
import Title from "../Title";
import COO from "../../../../public/images/blank-profile-image-1.png";
import CTO from "../../../../public/images/Chiso-COO.jpg";
import CEO from "../../../../public/images/iyke-CTO.png";

const TeamMembersItems = [
  {
    title: "Founder",
    name: "Iyke Idukpaye",
    description: "Seller releases product to buyer and notifies the escrow.",
    img: CEO,
  },
  {
    title: "CTO",
    name: "Chiso Onyeso",
    description:
      "The buyer and seller on the Price of the product, mode of delivery, time of delivery and other terms.",
    img: CTO,
  },
  {
    title: "COO",
    name: "David Ig",
    description:
      "The buyer then releases the agreed price to the escrow for delivery to commence.",
    img: COO,
  },
];

interface ITeamMembers {
  title: string;
  description: string;
  name: string;
  img: StaticImageData | string;
}
export default function TeamMembers() {
  return (
    <section className="">
      <div className="w-full max-w-4xl mx-auto px-4  py-8">
        <Title
          pill="Our Team"
          title="Meet Our Experts"
          subHeading=" Discover the faces driving reliability and transparency in every deal."
        />
        <ul className=" my-2 md:my-4 auto-rows-fr justify-items-center grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  gap-4">
          {TeamMembersItems.map((el, i) => (
            <TeamMember item={el} key={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
function TeamMember({ item }: { item: ITeamMembers }) {
  return (
    <li className="rounded-xs border border-gray-600  pb-2 p-4 md:pb-4">
      <div style={{ position: "relative", height: "200px", width: "200px" }}>
        <Image
          alt="Mountains"
          src={item.img}
          sizes="100vw"
          fill
          style={{
            objectFit: "cover", // cover, contain, none
          }}
        />
      </div>
      <div className="flex flex-col">
        <h3 className="text-center capitalize text-base font-bold my-1 text-(--foreground_dark_blue)">
          {item.name}
        </h3>
        <div className="w-16 bg-primary h-0.5 rounded-full mx-auto"></div>
        <p className="text-sm text-center mt-1 text-black"> {item.title}</p>
        {/* <p className="text-sm text-gray-600">{item.description}</p> */}
      </div>
    </li>
  );
}
