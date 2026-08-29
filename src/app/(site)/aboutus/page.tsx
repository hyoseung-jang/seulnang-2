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
      <section className="relative min-h-[540px] overflow-hidden bg-night text-white md:min-h-[620px]">
        <Image
          src={IMG.aboutHero}
          alt="호텔 현장을 실시간으로 확인하고 고객을 응대하는 슬낭 관제 요원"
          fill
          className="object-cover object-center"
          sizes="100vw"
          preload
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,12,23,0.94)_0%,rgba(7,12,23,0.74)_43%,rgba(7,12,23,0.18)_76%)]" />
        <div className="relative mx-auto flex min-h-[540px] max-w-6xl items-center px-5 py-20 md:min-h-[620px] md:px-8">
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold tracking-[0.08em] text-gold">회사 소개</p>
            <h1 className="mt-5 text-[38px] font-black leading-[1.22] tracking-[-0.04em] md:text-[58px]">
              기계를 파는 회사가 아니라,
              <br />
              밤을 대신 운영하는 팀입니다.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.8] text-white/70 md:text-[19px]">
              키오스크와 관제, 운영 시스템을 따로 보지 않습니다. 현장에서 고객이
              겪는 마지막 불편까지 해결해야 진짜 무인 운영이 완성됩니다.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
        <h2 className="text-[31px] font-black leading-snug tracking-[-0.04em] md:text-[44px]">
          사장님의 낭만을 위해,
          <br />
          우리는 &lsquo;지기&rsquo;가 되기로 했습니다.
        </h2>
        <div className="mt-10 space-y-6 text-[18px] leading-8 text-muted">
          <p>
            인건비 상승과 구인난 시대, 숙박업 무인화는 효율을 넘어 생존을 위한
            필수 전략이 되었습니다.
          </p>
          <p>
            하지만 기계만 놓는다고 고객 응대까지 사라지지는 않습니다. 고객이
            막히는 순간 대신 답하고, 사건과 장애가 생기면 즉시 움직이는 운영팀이
            필요합니다.
          </p>
          <p className="font-semibold text-ink">
            키오스크, 관제, PMS를 하나의 운영 경험으로 연결해 사장님은 현장을
            비우고도 안심할 수 있게 하겠습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
