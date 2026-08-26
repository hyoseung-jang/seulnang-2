import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "문의하기 | 슬기로운 낭만지기",
  description: "고민된다면 가볍게 문의부터 시작해보세요. 빠르게 도와드리겠습니다.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight md:text-[48px]">
          우리 업장 맞춤 상담받기
        </h1>
        <p className="mt-4 text-gold-text">*100% 무료 상담</p>
        <p className="mt-6 text-[18px] leading-7 text-muted">
          3일 이내에, 작성해주신 연락처로 연락드리겠습니다.
        </p>
      </div>
      <ContactForm />
    </main>
  );
}
