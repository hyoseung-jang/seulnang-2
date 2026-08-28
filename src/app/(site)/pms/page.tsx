import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { IMG } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/pms" },
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

const extras = [
  { no: "05", title: "요일별 가격 관리" },
  { no: "06", title: "비품/차키 보관함 관리" },
  { no: "07", title: "고객 요청 관리" },
  { no: "08", title: "포인트 관리" },
];

export default function PmsPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm font-medium tracking-[0.04em] text-gold-text">PMS</p>
        <h1 className="mt-4 max-w-3xl text-[32px] font-semibold leading-[1.35] tracking-[-0.03em] md:text-[48px]">
          객실 현황 관리, OTA 재고 관리 그리고 모든 것.
          <br />
          한 곳에서 더 쉽게 관리하세요.
        </h1>
      </section>

      <div>
        {features.map((item, index) => (
          <section
            key={item.title}
            className={index % 2 === 0 ? "bg-cream" : "bg-white"}
          >
            <Reveal>
              <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
                <p className="text-sm font-medium text-gold-text">
                  0{index + 1}
                </p>
                <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] md:text-[34px]">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-2xl text-[17px] leading-7 text-muted">
                  {item.body}
                </p>
                <div className="mt-8 overflow-hidden rounded-2xl bg-[#ececef] ring-1 ring-black/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={1600}
                    height={1000}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 72rem, 100vw"
                  />
                </div>
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-[26px] font-semibold tracking-[-0.03em] md:text-[34px]">
          그외 기능
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {extras.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-line bg-cream px-6 py-6"
            >
              <p className="text-sm font-medium text-gold-text">{item.no}</p>
              <p className="mt-2 text-[20px] font-semibold tracking-[-0.02em] md:text-[22px]">
                {item.title}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
