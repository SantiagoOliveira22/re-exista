import Image from "next/image";

import { isCategoryIconDataUrl } from "@/lib/category-icons";

interface CategoryIconImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function CategoryIconImage({
  src,
  alt,
  className,
  width = 40,
  height = 40,
}: CategoryIconImageProps) {
  if (isCategoryIconDataUrl(src)) {
    return (
      // Data URLs não passam pelo otimizador do Next.js Image.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} width={width} height={height} className={className} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
