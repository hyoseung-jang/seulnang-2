"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LINKS } from "@/lib/site";

export function StickyCta() {
  const pathname = usePathname();

  if (pathname === "/contact") return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-5 md:pb-7">
      <Link
        href={LINKS.contact}
        className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-gold px-5 py-3 text-[14px] font-semibold text-ink shadow-[0_12px_36px_rgba(18,18,43,0.22)] transition duration-200 hover:bg-gold-bright md:gap-3 md:px-6 md:py-3.5 md:text-[15px]"
      >
        우리 업장 맞춤 상담받기
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-sm">
          ↗
        </span>
      </Link>
    </div>
  );
}
