import Image, { ImageProps } from "next/image";

export const Icons = {
  logo: () => (
    <Image
      className="h-10 w-100"
      src="/logo.png"
      width={100}
      height={100}
      alt="Picture of the author"
    />
  ),
};
