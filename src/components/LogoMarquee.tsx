import Image from "next/image";
import { HOTEL_LOGOS } from "@/lib/site";

export function LogoMarquee() {
  const items = [...HOTEL_LOGOS, ...HOTEL_LOGOS];

  return (
    <div className="overflow-hidden border-y border-line bg-white py-6">
      <div className="animate-marquee flex w-max items-center gap-12 pr-12">
        {items.map((logo, index) => (
          <div key={`${logo.name}-${index}`} className="relative h-10 w-28 shrink-0">
            <Image
              src={logo.src}
              alt={logo.name}
              fill
              className="object-contain"
              sizes="112px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
