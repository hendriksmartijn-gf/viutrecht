import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

type Props = {
  image: (SanityImageSource & { alt?: string | null; lqip?: string | null }) | null | undefined;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function SanityImage({ image, width, height, priority, sizes, className }: Props) {
  if (!image || !("asset" in image) || !image.asset) return null;
  return (
    <Image
      src={urlFor(image).width(width).height(height).fit("crop").auto("format").url()}
      alt={image.alt ?? ""}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes ?? "100vw"}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip ?? undefined}
      className={className}
    />
  );
}
