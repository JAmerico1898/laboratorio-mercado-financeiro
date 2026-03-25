import Image from "next/image";

interface HeroImageProps {
  src: string;
  alt: string;
}

export default function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <div className="hidden lg:block relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-outline-variant/10">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 50vw, 0px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent" />
    </div>
  );
}
