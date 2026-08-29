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
        className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-gold px-5 py-3 text-[14px] font-bold text-ink shadow-[0_16px_44px_rgba(18,18,43,0.3)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:bg-gold-bright active:translate-y-0 md:gap-3 md:px-6 md:py-3.5 md:text-[15px]"
      >
        우리 업장 맞춤 상담받기
        <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-sm text-gold-bright">
          ↗
        </span>
      </Link>
    </div>
  );
}
