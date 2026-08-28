import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "문의하기 | 슬기로운 낭만지기",
  description: "고민된다면 가볍게 문의부터 시작해보세요. 빠르게 도와드리겠습니다.",
};

export default function ContactPage() {
  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-[560px] px-5 py-16 md:px-8 md:py-24">
        <h1 className="text-center text-[28px] font-bold tracking-[-0.02em] md:text-[32px]">
          우리 업장 맞춤 상담받기
        </h1>
        <p className="mt-3 text-center text-[15px] text-[#e11d2e]">*100% 무료 상담</p>
        <p className="mt-3 text-center text-[15px] leading-6 text-muted">
          3일 이내에, 작성해주신 연락처로 연락드리겠습니다.
        </p>
        <ContactForm />
      </div>
    </main>
  );
}
