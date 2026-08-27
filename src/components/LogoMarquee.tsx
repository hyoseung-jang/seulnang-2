import Image from "next/image";
import { HOTEL_LOGOS } from "@/lib/site";

export function LogoMarquee() {
  const items = [...HOTEL_LOGOS, ...HOTEL_LOGOS];

  return (
    <div className="overflow-hidden border-y border-line bg-[#faf8f3] py-10 md:py-14">
      <div className="animate-marquee flex w-max items-center gap-16 pr-16 md:gap-20 md:pr-20">
        {items.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="relative h-16 w-40 shrink-0 md:h-20 md:w-52"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              fill
              className="object-contain"
              sizes="208px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
