import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { IMG } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/muin" },
  title: "국내유일 즉각 선대응 무인관제 | 슬기로운 낭만지기",
  description: "밤샘 걱정 없는 사장님의 완벽한 자유를 위해. 슬낭이 사장님 업장에 꼭 맞춰드립니다.",
};

const scenarios = [
  {
    no: "01",
    title: "상황별 할인",
    desc: "망설이는 손님도 놓치지 않도록. 유동적인 할인으로 고객의 발길을 붙잡아드려요.",
    leftLabel: "손님",
    left: "7만원은 좀 비싼데.. 나갈까?",
    rightLabel: "낭만지기",
    right: "좋은 방이라 좀 비싸요! 사장님 특별 서비스로 6만원에 드릴게요",
    tone: "light" as const,
  },
  {
    no: "02",
    title: "업장별 맞춤 판매 설정",
    desc: "금연실부터 에어컨 상태, 우선 판매 객실까지. 업장 방식대로 모두 맞춰드려 운영을 도와요.",
    leftLabel: "사장님",
    left: "2층 방들은 작아서 마지막에 팔아주세요!",
    rightLabel: "낭만지기",
    right: "넵, 사장님께서 원하시는 방식대로 팔아드립니다!",
    tone: "dark" as const,
  },
  {
    no: "03",
    title: "주차 안내/등록",
    desc: "주차 때문에 등 돌리는 손님 없게. 차 번호 수집부터 주차등록, 만차 안내까지 꼼꼼하게",
    leftLabel: "손님",
    left: "주차장 자리가 하나도 없는데 어떡해요?",
    rightLabel: "낭만지기",
    right: "만차일 경우 X건물 옆에 주차해주시면 됩니다!",
    tone: "cream" as const,
  },
];

export default function MuinPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm font-medium tracking-[0.04em] text-gold-text">
          무인관제
        </p>
        <h1 className="mt-4 max-w-4xl text-[32px] font-semibold leading-[1.35] tracking-[-0.03em] md:text-[48px]">
          고객이 먼저 부르기 전에,
          <br />
          관제가 먼저 답합니다.
        </h1>
        <p className="mt-6 max-w-3xl text-[18px] leading-8 text-muted">
          키오스크 화면 밖에서 생기는 질문과 돌발 상황까지. 움직임을 감지하면
          숙련된 관제 요원이 즉시 고객 응대를 시작합니다.
        </p>
        <p className="mt-3 text-sm leading-6 text-muted">
          *4개 국어 가능, 5성급 호텔 출신자 포함. 전 인원 호텔 관련 법규 숙지.
        </p>
        <div className="relative mt-12 aspect-[16/8] overflow-hidden rounded-[28px] bg-night">
          <Image
            src={IMG.controlCenter}
            alt="호텔 로비 상황을 실시간으로 확인하고 고객을 응대하는 관제 요원"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 72rem, 100vw"
            preload
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,12,23,0.62),transparent_58%)]" />
          <p className="absolute bottom-6 left-6 text-[14px] font-semibold text-white md:bottom-8 md:left-8">
            슬낭 실시간 선대응 관제센터
          </p>
        </div>
      </section>

      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[28px] font-semibold tracking-[-0.03em] md:text-[36px]">
            슬기로운 낭만지기만의 &lsquo;즉각 선대응&rsquo;
          </h2>
          <p className="mt-4 max-w-2xl text-[18px] leading-7 text-muted">
            무늬만 무인인 타사 솔루션, 정말 우리 매장을 지켜주고 있습니까?
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 md:items-center">
            <div className="rounded-2xl bg-white p-6 md:p-8">
              <p className="text-sm text-muted">타사</p>
              <h3 className="mt-3 text-[22px] font-medium text-[#5a5a5a] md:text-[24px]">
                고객 신호 와야 대응
              </h3>
              <p className="my-3 text-muted">or</p>
              <h3 className="text-[22px] font-medium text-[#5a5a5a] md:text-[24px]">
                키오스크 단독
              </h3>
              <ul className="mt-6 space-y-2 text-muted">
                <li>미성년자 방어 X</li>
                <li>비품/사용문의 X</li>
                <li>장애 대응 X</li>
                <li>유동적인 대응 X</li>
              </ul>
            </div>
            <div className="relative">
              <div className="gold-glow absolute -inset-3 rounded-[32px] bg-gold blur-xl" />
              <div className="relative rounded-[24px] bg-gold p-6 text-ink md:p-8">
                <p className="text-sm font-semibold">슬기로운 낭만지기</p>
                <h3 className="mt-3 text-[22px] font-extrabold leading-snug md:text-[26px]">
                  즉각 선대응 :
                  <br />
                  움직임 감지 신호가 오면 관제 요원이 즉시 고객 응대
                </h3>
                <ul className="mt-6 space-y-2 font-bold">
                  <li>직접 신분증 검사</li>
                  <li>사용법 즉시 안내</li>
                  <li>즉시 원격 해결</li>
                  <li>즉석 할인 적용</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-[28px] font-semibold leading-[1.35] tracking-[-0.03em] md:text-[36px]">
            pms에서 판매할 객실만 선택해주세요. 그 뒤 모든 여정은 저희에게
            맡기세요.
          </h2>
          <div className="mt-14 space-y-6">
            {scenarios.map((item) => (
              <Reveal key={item.no}>
                <article
                  className={`grid gap-8 rounded-[28px] p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10 ${
                    item.tone === "dark"
                      ? "bg-ink text-white"
                      : item.tone === "cream"
                        ? "bg-cream"
                        : "bg-[#f6f6f8]"
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm font-semibold tracking-[0.08em] ${
                        item.tone === "dark" ? "text-gold" : "text-gold-text"
                      }`}
                    >
                      {item.no}
                    </p>
                    <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.02em] md:text-[28px]">
                      {item.title}
                    </h3>
                    <p
                      className={`mt-3 text-[16px] leading-7 ${
                        item.tone === "dark" ? "text-white/65" : "text-muted"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p
                        className={`mb-2 text-xs ${
                          item.tone === "dark" ? "text-white/45" : "text-muted"
                        }`}
                      >
                        {item.leftLabel}
                      </p>
                      <div
                        className={`max-w-[92%] rounded-2xl rounded-tl-md px-5 py-4 text-[15px] leading-6 md:text-[16px] ${
                          item.tone === "dark"
                            ? "bg-white/10 text-white"
                            : "bg-white text-ink shadow-sm"
                        }`}
                      >
                        {item.left}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p
                        className={`mb-2 text-xs font-medium ${
                          item.tone === "dark" ? "text-gold" : "text-gold-text"
                        }`}
                      >
                        {item.rightLabel}
                      </p>
                      <div className="max-w-[92%] rounded-2xl rounded-tr-md bg-gold px-5 py-4 text-left text-[15px] font-semibold leading-6 text-ink md:text-[16px]">
                        {item.right}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-semibold leading-[1.35] tracking-[-0.03em] md:text-[36px]">
              걱정 마세요. 밤새 일어난 모든 일, 보고서에 다 담았습니다.
            </h2>
            <h3 className="mt-6 text-[22px] font-semibold">업장 맞춤 운영 보고서</h3>
            <p className="mt-3 text-white/70">일일 매출, 특이사항, 컴플레인까지 모두.</p>
            <p className="mt-2">매일 아침 안심으로 시작하는 운영 리포트.</p>
            {/* 리포트에 실제로 담기는 내역 — 키오스크 페이지의 관제 리포트 항목과 동일 */}
            <ul data-motion="stagger" data-motion-x="" className="mt-6 space-y-2.5 text-[15px] text-white/75">
              {[
                "비품 판매·인원 추가 등 추가 결제 내역",
                "CCTV 녹화 영상과 함께 남는 진상 고객 응대 내역",
                "아침에 바로 조치할 객실 점검 요청",
                "체크인 이후 추가 인원 신분증 확인 내역",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
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

      <section className="px-5 py-20 text-center md:px-8 md:py-28">
        <p className="text-sm font-medium tracking-[0.08em] text-gold-text">
          설치
        </p>
        <p className="mt-4 text-[28px] font-semibold leading-[1.4] tracking-[-0.03em] md:text-[40px]">
          당장 내일, 단 하루면 설치 가능합니다.
        </p>
        <p className="mt-4 text-[18px] leading-7 text-muted md:text-[20px]">
          지금 문의하고 무인 운영의 여유를 누려보세요.
        </p>
      </section>
    </main>
  );
}
