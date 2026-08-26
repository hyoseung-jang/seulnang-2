import type { Metadata } from "next";
import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";
import { IMG } from "@/lib/site";

export const metadata: Metadata = {
  title: "PMS | 슬기로운 낭만지기",
  description: "객실 현황 관리, OTA 재고 관리 그리고 모든 것. 한 곳에서 더 쉽게 관리하세요.",
};

const features = [
  {
    title: "객실 현황",
    body: "정말 필요한 기능으로 쉽게 구성되어 새로 온 직원도 쉽게 숙지",
    image: IMG.pmsRoom,
  },
  {
    title: "OTA 재고 관리",
    body: "PMS와 CMS를 한곳에서 통합적으로 관리. 버튼 한번으로 손쉽게 OTA 수량 조정",
    image: IMG.pmsInventory,
  },
  {
    title: "예약자 시간별 다이어그램",
    body: "수익을 책임지는 대실 운영을 더 효율적으로. 빈틈없는 시간 활용",
    image: IMG.pmsReservation,
  },
  {
    title: "하우스키핑 작업 관리",
    body: "24시간 운영에서 빠질 수 없는 청소 관리. 관제실에서 청소직원에게 업무 지령",
    image: IMG.pmsHousekeeping,
  },
];

const extras = ["요일별 가격 관리", "비품/차키 보관함 관리", "고객 요청 관리", "포인트 관리"];

export default function PmsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-sm text-gold-text">PMS</p>
      <h1 className="mt-3 max-w-3xl text-[32px] font-semibold leading-snug tracking-tight md:text-[48px]">
        객실 현황 관리, OTA 재고 관리 그리고 모든 것.
        <br />
        한 곳에서 더 쉽게 관리하세요.
      </h1>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {features.map((item) => (
          <article key={item.title} className="overflow-hidden rounded-2xl bg-cream">
            <div className="relative aspect-[16/10] bg-white">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-top"
                sizes="(min-width: 768px) 40vw, 90vw"
              />
            </div>
            <div className="p-6 md:p-8">
              <h2 className="text-[22px] font-semibold">{item.title}</h2>
              <p className="mt-3 leading-7 text-muted">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-[22px] font-semibold">그외 기능</h2>
        <ul className="mt-4 grid gap-2 text-muted md:grid-cols-2">
          {extras.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </section>
      <div className="mt-12">
        <CtaButton>무료로 문의하기</CtaButton>
      </div>
    </main>
  );
}
