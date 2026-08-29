import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { IMG } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/kiosk" },
  title: "관제까지 하나로 연결된 호텔 키오스크 | 슬기로운 낭만지기",
  description:
    "키오스크만 설치하고 끝내지 않습니다. 고객 응대 관제까지 하나로 연결한 중소형 호텔 맞춤 무인 운영 시스템.",
};

const appFeatures = [
  {
    no: "01",
    title: "관제 직원과 바로 소통",
    body: "일일 특이사항, 서비스 궁금증, 관제 직원의 현장 보고까지. 앱에서 바로 묻고 바로 확인합니다.",
    image: IMG.appInquiry,
    alt: "문의 내역 앱 화면",
  },
  {
    no: "02",
    title: "외출 중에도 프런트 그대로",
    body: "폰으로 손님을 맞이하고, 필요하면 바로 통화까지. 현장에 없어도 응대는 끊기지 않습니다.",
    image: IMG.appLive,
    alt: "관제 앱 화면 — 로비 라이브 영상과 체크인 진행 단계",
  },
];

export default function KioskPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm font-medium tracking-[0.04em] text-gold-text">
          키오스크 및 시스템
        </p>
        <h1 className="mt-4 max-w-4xl text-[32px] font-semibold leading-[1.35] tracking-[-0.03em] md:text-[48px]">
          키오스크만 두고,
          <br />
          직원이 사라지길 바라셨나요?
        </h1>
        <p className="mt-6 max-w-3xl text-[18px] leading-8 text-muted">
          기계는 정해진 화면만 처리합니다. 슬낭은 고객이 막히는 순간 관제 요원이
          직접 답하도록 키오스크와 관제를 처음부터 함께 설계합니다.
        </p>
        <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
          <div className="relative h-[380px]">
            <Image
              src={IMG.kioskDevice}
              alt="키오스크 시스템"
              fill
              className="object-contain"
              sizes="(min-width: 768px) 40vw, 90vw"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gold-text">기계는 작게, 응대는 끝까지</p>
            <h2 className="mt-3 text-[28px] font-semibold leading-snug md:text-[36px]">
              기계값 거품을 뺀, 단 30cm의 키오스크 시스템.
            </h2>
            <p className="mt-3 text-sm text-muted">
              *태블릿 270x220, 카드 키 발급기 300x350x400(mm)
            </p>
            <p className="mt-6 leading-7">
              예약 연동과 키 발급은 기계가, 고객의 질문과 돌발 상황은 관제가.
              <br />
              하나의 팀처럼 이어져 진짜 무인 운영을 만듭니다.
            </p>
            <ol className="mt-8 space-y-3 font-semibold">
              <li>01. 기존 인테리어를 해치지 않는 작은 크기</li>
              <li>02. 고객 호출 전 움직임 감지 선대응</li>
              <li>03. 설치부터 관제 운영까지 한 번에</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-4xl text-[26px] font-semibold leading-[1.35] tracking-[-0.03em] md:text-[36px]">
            프론트는 기본, 엘리베이터와 계단 앞까지.
            <br />
            외부인과 미성년자의 무단 출입을 빈틈없이 차단합니다.
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
            <Image
              src={IMG.elevatorKiosk}
              alt="엘리베이터 앞 출입 통제 키오스크"
              width={1600}
              height={770}
              className="h-auto w-full"
              sizes="(min-width: 768px) 72rem, 100vw"
            />
          </div>
          <article className="mt-8 grid items-center gap-8 md:grid-cols-2 md:gap-14">
            <div>
              <p className="text-sm text-muted">비품도 걱정 없어요.</p>
              <h3 className="mt-2 text-[22px] font-semibold">고객 전용 비품함</h3>
              <p className="mt-3 leading-7 text-muted">
                클릭 한번이면 끝, 비품도 이제 원격으로
              </p>
              <p className="mt-4 text-sm text-muted">
                *하드웨어 및 제공 품목 : 키오스크 태블릿 + 키발급기, 카메라, 비품
                보관함, 현금함
              </p>
            </div>
            <div className="mx-auto w-[140px] md:w-[160px]">
              <Image
                src={IMG.supplyLocker}
                alt="고객 전용 비품함"
                width={368}
                height={922}
                className="h-auto w-full"
                sizes="160px"
                unoptimized
              />
            </div>
          </article>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium tracking-[0.04em] text-gold-text">
            사장님 전용 관제 앱
          </p>
          <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-[1.35] tracking-[-0.03em] md:text-[40px]">
            멀리 외출 중에도 매장은 사장님 손안에.
          </h2>
          <div className="mt-14 space-y-16 md:space-y-20">
            {appFeatures.map((item, index) => (
              <Reveal key={item.no}>
                <div
                  className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${
                    index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-gold-text">{item.no}</p>
                    <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.02em] md:text-[30px]">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-[17px] leading-7 text-muted">{item.body}</p>
                  </div>
                  <div className="mx-auto w-full max-w-[320px]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={473}
                      height={1024}
                      className="h-auto w-full rounded-[28px] shadow-[0_18px_50px_rgba(18,18,43,0.12)] ring-1 ring-black/5"
                      sizes="320px"
                    />
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal>
              <div className="grid items-start gap-10 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gold-text">03</p>
                  <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.02em] md:text-[30px]">
                    체크인·주차·결제까지 기록
                  </h3>
                  <p className="mt-4 text-[17px] leading-7 text-muted">
                    관제 일지에서 체크인 기록, 주차 등록, 일일 결제 요약을 바로
                    확인합니다.
                  </p>
                  <div className="mx-auto mt-8 w-full max-w-[320px]">
                    <Image
                      src={IMG.appLog1}
                      alt="관제 일지 체크인·주차·결제 화면"
                      width={473}
                      height={1024}
                      className="h-auto w-full rounded-[28px] shadow-[0_18px_50px_rgba(18,18,43,0.12)] ring-1 ring-black/5"
                      sizes="320px"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gold-text">04</p>
                  <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.02em] md:text-[30px]">
                    점검 필요 항목도 바로 확인
                  </h3>
                  <p className="mt-4 text-[17px] leading-7 text-muted">
                    현장에서 올라온 점검 필요 보고를 앱에서 바로 보고, 조치
                    내용까지 남깁니다.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
                    <Image
                      src={IMG.appLog3}
                      alt="관제 일지 점검 리스트 화면"
                      width={473}
                      height={1024}
                      className="h-auto w-full rounded-[28px] shadow-[0_18px_50px_rgba(18,18,43,0.12)] ring-1 ring-black/5"
                      sizes="(min-width: 768px) 280px, 45vw"
                    />
                    <Image
                      src={IMG.appLog2}
                      alt="관제 일지 점검 필요 화면"
                      width={473}
                      height={1024}
                      className="h-auto w-full rounded-[28px] shadow-[0_18px_50px_rgba(18,18,43,0.12)] ring-1 ring-black/5"
                      sizes="(min-width: 768px) 280px, 45vw"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
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
