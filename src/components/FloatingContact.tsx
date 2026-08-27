import { LINKS } from "@/lib/site";

export function FloatingContact() {
  return (
    <a
      href={LINKS.kakao}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-50 inline-flex items-center rounded-full bg-kakao px-3.5 py-2.5 text-[13px] font-semibold text-[#392020] shadow-lg md:bottom-8 md:right-8 md:px-4 md:py-3 md:text-sm"
    >
      간편 문의
    </a>
  );
}
