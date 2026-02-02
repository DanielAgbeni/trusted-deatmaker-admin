import React from "react";

interface TitleProps {
  title: string;
  subHeading?: string;
  pill?: string;
}

function Title({ title, subHeading, pill }: TitleProps) {
  return (
    <div
      className="
      my-4
    flex
    flex-col
    justify-center
    items-center
    "
    >
      {pill && (
        <p
          className="
            py-1
            text-sm
            text-primary
            font-black
            text-center

            "
        >
          {pill}
        </p>
      )}
      <>
        <h2
          className="
            py-2
            text-2xl
            sm:text-4xl
            sm:max-w-[750px]
            text-(--foreground_dark_blue)
            text-center
            font-bold 
            capitalize
        "
        >
          {title}
        </h2>
        {subHeading && (
          <p
            className="
            py-2
            sm:max-w-[500px]
            md:text-center
            md:text-lg
            font-normal
            md:leading-loose
            text-(--foreground_neutral_base)
        "
          >
            {subHeading}
          </p>
        )}
      </>
    </div>
  );
}

export default Title;
