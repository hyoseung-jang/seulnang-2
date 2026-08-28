import type { Metadata } from "next";
import Image from "next/image";
import { IMG } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/aboutus" },
  title: "회사 소개 | 슬기로운 낭만지기",
  description: "사장님의 낭만을 위해, 우리는 지기가 되기로 했습니다.",
};

export default function AboutPage() {
  return (
    <main>
      <div className="relative h-[240px] w-full md:h-[380px]">
        <Image
          src={IMG.aboutHero}
          alt="야간 호텔 로비"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <h1 className="text-[32px] font-semibold leading-snug tracking-tight md:text-[44px]">
          사장님의 낭만을 위해, 우리는 &lsquo;지기&rsquo;가 되기로 했습니다.
        </h1>
        <div className="mt-10 space-y-6 text-[18px] leading-8 text-muted">
          <p>
            인건비 상승과 구인난 시대, 숙박업 무인화는 이제 효율을 넘어 생존을 위한
            필수 전략입니다.
          </p>
          <p>
            매장에 매여 있지 않아도 수익은 흐르고 일상은 자유로운 상태, 우리는 그것이
            가장 현실적이고 슬기로운 낭만이라 믿습니다.
          </p>
          <p>
            빈틈없는 24시간 무인 운영으로 사장님의 가장 든든한 파트너가
            되어드리겠습니다.
          </p>
        </div>
      </div>
    </main>
  );
}
