import { LINKS } from "@/lib/site";

export function FloatingContact() {
  return (
    <a
      href={LINKS.kakao}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-kakao px-4 py-3 text-sm font-semibold text-[#392020] shadow-lg md:bottom-8 md:right-8"
    >
      간편 문의
    </a>
  );
}
