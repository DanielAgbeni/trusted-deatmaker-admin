"use client";
export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  classes?: string;
}

export default function Cbutton(props: ButtonProps) {
  const { classes, ...rest } = props;

  return (
    <button
      {...rest}
      className={`btn  py-2 capitalize text-white ${classes}`}
    />
  );
}
