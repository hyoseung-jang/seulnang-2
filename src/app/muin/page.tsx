import type { Metadata } from "next";
import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";
import { IMG } from "@/lib/site";

export const metadata: Metadata = {
  title: "국내유일 즉각 선대응 무인관제 | 슬기로운 낭만지기",
  description: "밤샘 걱정 없는 사장님의 완벽한 자유를 위해. 슬낭이 사장님 업장에 꼭 맞춰드립니다.",
};

const scenarios = [
  {
    title: "01 상황별 할인",
    desc: "망설이는 손님도 놓치지 않도록. 유동적인 할인으로 고객의 발길을 붙잡아드려요.",
    guest: "\"7만원은 좀 비싼데.. 나갈까?\"",
    staff: "\"좋은 방이라 좀 비싸요! 사장님 특별 서비스로 6만원에 드릴게요\"",
  },
  {
    title: "02 업장별 맞춤 판매 설정",
    desc: "금연실부터 에어컨 상태, 우선 판매 객실까지. 업장 방식대로 모두 맞춰드려 운영을 도와요.",
    guest: "\"2층 방들은 작아서 마지막에 팔아주세요!\"",
    staff: "\"넵, 사장님께서 원하시는 방식대로 팔아드립니다!\"",
  },
  {
    title: "03 주차 안내/등록",
    desc: "주차 때문에 등 돌리는 손님 없게. 차 번호 수집부터 주차등록, 만차 안내까지 꼼꼼하게",
    guest: "\"주차장 자리가 하나도 없는데 어떡해요?\"",
    staff: "\"만차일 경우 X건물 옆에 주차해주시면 됩니다!\"",
  },
];

export default function MuinPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <h1 className="max-w-4xl text-[32px] font-semibold leading-snug tracking-tight md:text-[48px]">
          밤샘 걱정 없는 사장님의 완벽한 자유를 위해. 슬낭이 사장님 업장에 꼭 맞춰드릴게요.
        </h1>
        <p className="mt-4 text-sm text-muted">
          *4개 국어 가능, 5성급 호텔 출신자 포함. 전 인원 모두 호텔 관련 법규가 숙지됨.
        </p>
      </section>

      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[28px] font-semibold md:text-[36px]">
            슬기로운 낭만지기만의 &lsquo;즉각 선대응&rsquo;
          </h2>
          <p className="mt-4 max-w-2xl text-[18px] text-muted">
            무늬만 무인인 타사 솔루션, 정말 우리 매장을 지켜주고 있습니까?
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 md:p-8">
              <p className="text-sm text-muted">타사</p>
              <h3 className="mt-3 text-[24px] font-semibold">고객 신호 와야 대응</h3>
              <p className="my-3 text-muted">or</p>
              <h3 className="text-[24px] font-semibold">키오스크 단독</h3>
              <ul className="mt-6 space-y-2 text-muted">
                <li>미성년자 방어 X</li>
                <li>비품/사용문의 X</li>
                <li>장애 대응 X</li>
                <li>유동적인 대응 X</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-ink p-6 text-white md:p-8">
              <h3 className="text-[22px] font-semibold leading-snug">
                즉각 선대응 :
                <br />
                움직임 감지 신호가 오면 관제 요원이 즉시 고객 응대
              </h3>
              <ul className="mt-6 space-y-2 text-gold">
                <li>직접 신분증 검사</li>
                <li>사용법 즉시 안내</li>
                <li>즉시 원격 해결</li>
                <li>즉석 할인 적용</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-[28px] font-semibold leading-snug md:text-[36px]">
            pms에서 판매할 객실만 선택해주세요. 그 뒤 모든 여정은 저희에게 맡기세요.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {scenarios.map((item) => (
              <article key={item.title} className="rounded-2xl bg-cream p-6">
                <h3 className="text-[20px] font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.desc}</p>
                <p className="mt-5 text-[15px]">{item.guest}</p>
                <p className="mt-2 text-[15px] font-medium text-gold-text">{item.staff}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-semibold leading-snug md:text-[36px]">
              걱정 마세요. 밤새 일어난 모든 일, 보고서에 다 담았습니다.
            </h2>
            <h3 className="mt-6 text-[22px] font-semibold">업장 맞춤 운영 보고서</h3>
            <p className="mt-3 text-white/70">일일 매출, 특이사항, 컴플레인까지 모두.</p>
            <p className="mt-2">매일 아침 안심으로 시작하는 운영 리포트.</p>
          </div>
          <div className="relative h-[260px] w-full">
            <Image
              src={IMG.report}
              alt="업장 맞춤 운영 보고서"
              fill
              className="rounded-2xl object-cover"
              sizes="(min-width: 768px) 40vw, 90vw"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 text-center md:px-8 md:py-24">
        <CtaButton>무료로 문의하기</CtaButton>
        <p className="mt-6 text-muted">
          당장 내일, 단 하루면 설치 가능합니다.
          <br />
          지금 문의하고 무인 운영의 여유를 누려보세요.
        </p>
      </section>
    </main>
  );
}
