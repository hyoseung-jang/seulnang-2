import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconFlex, IconRest, IconSave } from "@/components/BenefitIcons";
import { CountUp } from "@/components/CountUp";
import { CtaButton } from "@/components/CtaButton";
import { FaqList } from "@/components/FaqList";
import { HeroVideo } from "@/components/HeroVideo";
import { LogoMarquee } from "@/components/LogoMarquee";
import { OneClickDemo } from "@/components/OneClickDemo";
import { PmsShowcase } from "@/components/PmsShowcase";
import { Reveal } from "@/components/Reveal";
import { ReviewMarquee } from "@/components/ReviewMarquee";
import { jsonLdString } from "@/lib/jsonld";
import { COMPANY, FAQS, IMG, LINKS, VIDEOS } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* FAQ JSON-LD — 화면에 렌더되는 FAQS 상수를 그대로 직렬화한다 (가시 텍스트와 100% 동일 보장) */
const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const cases = [
  {
    title: "미성년자 무단 출입이 잦은 업장",
    note: "*엘리베이터나 계단으로 무단침입 시 즉시 차단 및 신고 접수",
    result: (
      <>
        1년 간 <span className="font-semibold text-gold-bright">12건</span>의
        미성년자 출입 시도 모두 차단.
      </>
    ),
    extra: (
      <>
        슬낭이 관리하는 전 숙박업소 미성년자 이슈{" "}
        <span className="font-semibold text-gold-bright">&lsquo;0건&rsquo;</span>
      </>
    ),
  },
  {
    title: "노년층이 주요 고객인 업장",
    note: "*손님이 오면 이름만 물어보고 바로 객실 키 제공으로 빠른 응대",
    result: (
      <>
        평균 고객 연령{" "}
        <span className="font-semibold text-gold-bright">60대</span>인 업장도
        문제 없이 이용 중
      </>
    ),
  },
  {
    title: "취객/사건 사고가 끊이질 않는 업장",
    note: "*사건 사고 발생 녹음 or 녹화 or 서명, 경찰 출동 시에도 즉시 대응 / 상급 취객 응대 / 사각지대 응대",
    result: (
      <>
        금연방에서 흡연한 인원도 관제 사용 후{" "}
        <span className="font-semibold text-gold-bright">100% 검거</span> 및
        과태료 부과
      </>
    ),
  },
  {
    title: "이미 키오스크를 사용 중인 업장",
    note: "*기존 키오스크는 미성년자 판별 불가, 컴플레인 대응 불가, 전화 대응 불가, 직원 + 키오스크 비용 동시 지출",
    result: (
      <>
        키오스크를 쓰면서도 사람이 근무하던 업장에서, 이제는{" "}
        <span className="font-semibold text-gold-bright">완전 퇴근</span>으로
        인건비 절감
      </>
    ),
  },
];

/* 실제 PMS 화면 쇼케이스 — 첨부된 운영 화면 스크린샷을 그대로 사용 */
const PMS_SCREENS = [
  {
    key: "rooms",
    title: "객실 관리",
    desc: "층별 객실 상태와 배정 요청을 한눈에",
    src: IMG.pmsRoom,
  },
  {
    key: "sales",
    title: "운영 관리",
    desc: "일 매출과 결제 현황을 바로 확인",
    src: IMG.pmsSales,
  },
  {
    key: "ota",
    title: "OTA 인벤토리",
    desc: "버튼 한번으로 손쉽게 OTA 수량 조정",
    src: IMG.pmsInventory,
  },
  {
    key: "housekeeping",
    title: "하우스키핑",
    desc: "청소 업무 배정과 진행 현황 관리",
    src: IMG.pmsHousekeeping,
  },
];

const zeroFees = [
  "렌탈비",
  "장비비",
  "초기 세팅비",
  "가입비",
  "보증금",
  "관리비",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0" aria-hidden>
      <circle cx="10" cy="10" r="10" className="fill-ink/10" />
      <path
        d="m5.8 10.4 2.8 2.8 5.6-6"
        className="stroke-ink"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0" aria-hidden>
      <circle cx="10" cy="10" r="10" className="fill-black/[0.07]" />
      <path
        d="m7 7 6 6M13 7l-6 6"
        className="stroke-[#9a9a9a]"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      {/* 히어로: 키오스크 단독의 한계를 한 문장으로 선명하게 제시 */}
      <section className="relative min-h-[calc(100svh-64px)] overflow-hidden bg-night text-white md:min-h-[calc(100svh-72px)]">
        <HeroVideo poster={IMG.heroPoster} src={VIDEOS.heroNight} />
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,12,23,0.96)_0%,rgba(7,12,23,0.88)_38%,rgba(7,12,23,0.28)_72%,rgba(7,12,23,0.18)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,rgba(7,12,23,0.8),transparent)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-64px)] max-w-6xl items-center px-5 py-16 md:min-h-[calc(100svh-72px)] md:px-8 md:py-20">
          <div className="max-w-[760px]">
            <p
              className="stage text-[13px] font-semibold tracking-[0.08em] text-gold md:text-[14px]"
              style={{ "--d": "0ms" } as React.CSSProperties}
            >
              키오스크 + 선대응 관제, 하나로
            </p>
            <h1
              className="stage mt-5 text-[40px] font-black leading-[1.14] tracking-[-0.045em] md:text-[68px] md:leading-[1.12]"
              style={{ "--d": "110ms" } as React.CSSProperties}
            >
              키오스크만으론,
              <br />
              <span className="text-gold-bright">무인 운영이 아닙니다.</span>
            </h1>
            <p
              className="stage mt-6 max-w-[620px] text-[17px] leading-[1.75] text-white/72 md:text-[20px]"
              style={{ "--d": "230ms" } as React.CSSProperties}
            >
              고객이 막히는 순간 직접 응대하는 관제까지. 슬낭은 키오스크와
              사람의 대응을 한 시스템으로 운영합니다.
            </p>
            <div
              className="stage mt-9 flex flex-wrap items-center gap-3"
              style={{ "--d": "350ms" } as React.CSSProperties}
            >
              <CtaButton>무료 상담 신청</CtaButton>
              <a
                href="#difference"
                className="group inline-flex items-center gap-3 border-b border-white/45 px-1 py-3 text-[15px] font-semibold text-white transition hover:border-gold hover:text-gold"
              >
                왜 다른지 보기
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 신뢰 지표: 첫 화면의 메시지를 실제 운영 성과로 증명 */}
      <section className="border-b border-line px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <dl className="grid grid-cols-3 divide-x divide-line">
            <div className="pr-4 md:pr-10">
              <dt className="text-[12px] leading-snug text-muted md:text-[14px]">전국 이용 업장</dt>
              <dd className="mt-2 text-[28px] font-black tracking-[-0.04em] text-ink md:text-[42px]">
                <CountUp to={140} suffix="+" />
              </dd>
            </div>
            <div className="px-4 md:px-10">
              <dt className="text-[12px] leading-snug text-muted md:text-[14px]">관리 업장 미성년자 이슈</dt>
              <dd className="mt-2 text-[28px] font-black tracking-[-0.04em] text-ink md:text-[42px]">
                <span className="tnum">0</span>건
              </dd>
            </div>
            <div className="pl-4 md:pl-10">
              <dt className="text-[12px] leading-snug text-muted md:text-[14px]">관제비, 시간당</dt>
              <dd className="mt-2 text-[28px] font-black tracking-[-0.04em] text-gold-text md:text-[42px]">
                <CountUp to={2900} suffix="원" />
              </dd>
            </div>
          </dl>
          <p className="mt-12 text-center text-[13px] font-semibold tracking-[0.08em] text-muted">
            전국 숙박업 현장에서 검증된 통합 운영
          </p>
        </div>
      </section>

      <LogoMarquee />

      {/* 키오스크 단독 운영의 실제 한계 */}
      <section id="difference" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <Reveal>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-[#e9eaec]">
              <Image
                src={IMG.kioskOnlyPain}
                alt="늦은 밤 무인 키오스크 앞에서 도움을 받지 못해 불편을 겪는 고객"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 52vw, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(8,12,20,0.82),transparent)] px-6 pb-6 pt-16 text-white">
                <p className="text-[14px] font-semibold">키오스크 단독 운영의 현실</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <p className="text-[13px] font-semibold tracking-[0.08em] text-gold-text">
              기계만 두면 끝일까요?
            </p>
            <h2 className="mt-4 text-[31px] font-black leading-[1.28] tracking-[-0.04em] md:text-[46px]">
              고객이 막히는 순간,
              <br />
              결국 직원이 필요합니다.
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.8] text-muted">
              예약 오류, 결제 실패, 신분증 확인, 비품 문의. 키오스크는 정해진
              화면 밖의 질문에 답하지 못합니다.
            </p>
            <ul className="mt-8 divide-y divide-line border-y border-line text-[16px]">
              {[
                "고객이 헤매면 사장님에게 전화",
                "장애가 나면 직원이 현장 출동",
                "취객과 미성년자 응대는 사람 몫",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 py-4 text-muted">
                  <CrossIcon />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[18px] font-extrabold text-ink">
              그래서 키오스크만으로는 인건비가 사라지지 않습니다.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 후기: 사장님들의 밤이 달라졌습니다 ──────────────────────── */}
      <section className="overflow-hidden bg-[linear-gradient(0deg,#ffe38c_0%,#fff_20%,#fff_84%,#fff7dd_100%)] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 text-center md:px-8">
          <Reveal>
            <p className="text-[13px] font-semibold tracking-[0.04em] text-gold-text">
              관제의 판도를 완전히 뒤바꾸다
            </p>
            <h2 className="mt-3 font-display text-[32px] font-bold tracking-[-0.02em] md:text-[48px]">
              슬기로운 낭만지기
            </h2>
            <p className="mt-4 text-[15px] text-muted md:text-[17px]">
              먼저 도입한 사장님들의 밤이 이렇게 달라졌습니다.
            </p>
          </Reveal>
        </div>
        <div className="mt-12">
          <ReviewMarquee />
        </div>
      </section>

      {/* 키오스크, 관제센터, 사장님 앱을 하나로 연결 */}
      <section className="relative overflow-hidden bg-ink px-5 py-24 text-white md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <Reveal>
              <p className="text-[13px] font-semibold tracking-[0.08em] text-gold">
                슬낭의 차이
              </p>
              <h2 className="mt-4 text-[31px] font-black leading-[1.28] tracking-[-0.04em] md:text-[48px]">
                키오스크가 묻고,
                <br />
                관제가 답합니다.
              </h2>
              <p className="mt-6 text-[17px] leading-[1.8] text-white/68">
                슬낭은 기계만 설치하지 않습니다. 고객이 들어오는 순간부터
                체크인, 신분증 확인, 문의, 장애 대응까지 관제 요원이 이어받습니다.
              </p>
              <ul className="mt-8 space-y-4 text-[16px] font-semibold">
                {[
                  "고객 호출 전 움직임 감지 선대응",
                  "결제와 객실 문의 즉시 원격 해결",
                  "모든 응대 내역을 사장님 앱에 기록",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={90}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-white/10 bg-night">
                <Image
                  src={IMG.controlCenter}
                  alt="호텔 로비 상황을 실시간으로 확인하며 고객을 응대하는 슬낭 관제 요원"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 56vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(7,12,23,0.9),transparent)] px-6 pb-6 pt-20">
                  <p className="text-[14px] font-semibold text-gold">실시간 선대응 관제센터</p>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <ol className="mt-14 grid divide-y divide-white/12 border-y border-white/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                ["01", "키오스크", "예약 확인과 키 발급"],
                ["02", "관제센터", "질문과 돌발 상황 응대"],
                ["03", "사장님 앱", "운영 기록과 원클릭 전환"],
              ].map(([no, title, body]) => (
                <li key={title} className="py-6 sm:px-7 sm:first:pl-0 sm:last:pr-0">
                  <p className="tnum text-[12px] font-bold text-gold">{no}</p>
                  <h3 className="mt-2 text-[19px] font-bold">{title}</h3>
                  <p className="mt-2 text-[14px] text-white/52">{body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* 원클릭으로 관제까지 함께 전환 */}
      <section className="bg-cream px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <OneClickDemo poster={IMG.oneClickPoster} src={VIDEOS.oneClick}>
            <Reveal>
              <p className="text-[13px] font-semibold tracking-[0.08em] text-gold-text">
                원클릭 무인전환
              </p>
              <h2 className="mt-4 text-[31px] font-black leading-[1.3] tracking-[-0.04em] md:text-[44px]">
                키오스크만 켜지는 게 아닙니다.
                <br />
                <span className="text-gold-text">관제까지 함께 켜집니다.</span>
              </h2>
              <p className="mt-5 max-w-xl text-[17px] leading-[1.8] text-muted">
                앱에서 슥 밀면 그 순간부터 관제 요원이 프론트를 이어받습니다.
                복귀할 때도 똑같이 원클릭입니다.
              </p>
            </Reveal>
          </OneClickDemo>
        </div>
      </section>

      {/* 사장님 앱 실제 화면: 방금 본 원클릭이 실제 앱임을 증명 */}
      <section className="relative overflow-hidden bg-ink px-5 py-24 text-white md:px-8 md:py-32">
        <div
          className="aurora pointer-events-none absolute -top-28 left-[-12%] h-96 w-[44rem] rounded-full bg-gold/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.02fr] lg:gap-16">
            <Reveal>
              <p className="text-[13px] font-semibold tracking-[0.08em] text-gold">
                사장님 전용 앱 · 실제 화면
              </p>
              <h2 className="mt-4 text-[31px] font-black leading-[1.28] tracking-[-0.04em] md:text-[46px]">
                퇴근한 뒤의 프론트,
                <br />폰 안에 다 있습니다.
              </h2>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.8] text-white/68">
                로비 상황은 라이브 영상으로, 체크인은 진행 단계 그대로.
                무인 전환은 슥 미는 것으로 끝나고, 요일별 무인 운영 시간표는
                앱이 대신 지킵니다.
              </p>
              <ul className="mt-8 space-y-4 text-[16px] font-semibold">
                {[
                  "로비 라이브 영상으로 현장을 바로 확인",
                  "예약 확인 → 본인 확인 → 키 발급, 체크인 단계 표시",
                  "고객 응대가 필요하면 앱에서 바로 통화 연결",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={90}>
              <div className="mx-auto flex max-w-[560px] items-start justify-center gap-5 md:gap-7">
                <figure className="float-y w-1/2 max-w-[240px]">
                  <Image
                    src={IMG.appLive}
                    alt="사장님 앱 관제 화면 — 로비 라이브 영상과 체크인 진행 단계"
                    width={852}
                    height={1846}
                    className="h-auto w-full rounded-[30px] border border-white/12 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
                    sizes="(min-width: 768px) 240px, 44vw"
                  />
                  <figcaption className="mt-4 text-center text-[13px] font-semibold text-white/55">
                    실시간 관제 LIVE
                  </figcaption>
                </figure>
                <figure
                  className="float-y w-1/2 max-w-[240px] pt-12"
                  style={{ animationDelay: "1.8s" }}
                >
                  <Image
                    src={IMG.appOneClick}
                    alt="사장님 앱 무인 프런트 전환 화면 — 밀어서 전환 슬라이더와 요일별 무인 운영 시간"
                    width={921}
                    height={2000}
                    className="h-auto w-full rounded-[30px] border border-white/12 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
                    sizes="(min-width: 768px) 240px, 44vw"
                  />
                  <figcaption className="mt-4 text-center text-[13px] font-semibold text-white/55">
                    원클릭 무인 전환
                  </figcaption>
                </figure>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 실제 제품은 생성 이미지 대신 원본 자산을 그대로 사용 */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <Reveal className="order-2 md:order-1">
            <div className="relative min-h-[430px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_50%_38%,#ffffff_0%,#f2f3f5_54%,#e5e7eb_100%)]">
              <div className="absolute inset-x-[10%] bottom-[9%] h-[8%] rounded-full bg-black/15 blur-2xl" aria-hidden />
              <Image
                src={IMG.kioskDevice}
                alt="슬낭 30cm 소형 키오스크와 카드 키 발급기"
                fill
                className="object-contain p-8 md:p-10"
                sizes="(min-width: 768px) 44vw, 90vw"
              />
            </div>
          </Reveal>
          <Reveal className="order-1 md:order-2">
            <div>
              <p className="text-[13px] font-semibold tracking-[0.08em] text-gold-text">
                콤팩트 키오스크
              </p>
              <h2 className="mt-4 text-[31px] font-black leading-[1.3] tracking-[-0.04em] md:text-[44px]">
                키오스크는 작게.
                <br />
                응대는 끝까지.
              </h2>
              <p className="mt-5 text-[17px] leading-[1.8] text-muted">
                단 30cm 기기 안에 예약 연동과 키 발급을 담고, 화면 밖의 모든
                질문은 관제 요원이 이어받습니다.
              </p>
              <p className="mt-3 text-sm text-muted">
                *태블릿 270x220, 카드 키 발급기 300x350x400(mm)
              </p>
              <ol className="mt-9 space-y-5">
                {[
                  "기존 인테리어를 해치지 않는 작은 크기",
                  "장비비와 렌탈비 없이 합리적인 도입",
                  "설치부터 관제 운영까지 한 번에 설계",
                ].map((item, index) => (
                  <li key={item} className="flex items-center gap-4 text-[17px] font-semibold">
                    <span className="tnum grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-[14px] font-extrabold text-ink">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 실제 PMS 화면: 밤 관제에 이어 주간 운영까지 하나로 */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#fffbf0_100%)] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-[13px] font-semibold tracking-[0.08em] text-gold-text">
              운영 관리 PMS · 실제 화면
            </p>
            <h2 className="mt-4 max-w-3xl text-[31px] font-black leading-[1.3] tracking-[-0.04em] md:text-[44px]">
              밤에는 관제가 지키고,
              <br />
              낮에는 <span className="text-gold-text">PMS가 정리합니다.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.8] text-muted">
              객실 현황부터 일 매출, OTA 재고, 하우스키핑까지. 복잡했던 숙박업
              운영을 하나의 화면에서 관리하세요.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-12">
              <PmsShowcase screens={PMS_SCREENS} />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10">
              <Link
                href={LINKS.pms}
                className="group inline-flex items-center gap-2 text-[16px] font-semibold text-gold-text underline-offset-4 hover:underline"
              >
                PMS 기능 자세히 보기
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 제품 라인업 ─────────────────────────────────────────────── */}
      <section className="bg-cream px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-center text-[13px] font-semibold tracking-[0.14em] text-gold-text">
              제품 라인업
            </p>
            <h2 className="mt-3 text-center text-[28px] font-semibold tracking-[-0.03em] md:text-[40px]">
              압도적인 수익률을 만드는 슬낭만의 솔루션
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                href: LINKS.pms,
                tag: "PMS",
                copy: (
                  <>
                    복잡했던 숙박업 운영을
                    <br />
                    하나의 PMS로 더 쉽고 체계적으로.
                  </>
                ),
                className: "bg-gold-deep text-ink",
              },
              {
                href: LINKS.muin,
                tag: "무인관제",
                copy: (
                  <>
                    밤샘 걱정 없는 완벽한 자유.
                    <br />
                    오직 슬낭에서만.
                  </>
                ),
                className: "bg-navy text-white",
              },
              {
                href: LINKS.kiosk,
                tag: "키오스크 및 시스템",
                copy: (
                  <>
                    작지만 강력한 운영 효율.
                    <br />
                    중소형 업장 최적화 맞춤 기능.
                  </>
                ),
                className: "bg-white text-ink border border-line",
              },
            ].map((item, index) => (
              <Reveal key={item.tag} delay={index * 80} className="h-full">
                <Link
                  href={item.href}
                  className={`group flex h-full flex-col rounded-3xl p-8 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(18,18,43,0.16)] ${item.className}`}
                >
                  <p className="text-sm font-semibold opacity-80">{item.tag}</p>
                  <p className="mt-4 text-[22px] font-semibold leading-snug tracking-[-0.01em]">
                    {item.copy}
                  </p>
                  <p className="mt-auto pt-10 text-sm font-medium opacity-80">
                    더 알아보기{" "}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 도입 효과 ───────────────────────────────────────────────── */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="max-w-3xl text-[26px] font-semibold leading-[1.4] tracking-[-0.02em] md:text-[36px]">
              시급 <span className="text-gold-text">2,900원</span>의 전문 프론트
              관제 인력으로
              <br className="hidden md:block" /> 누리는 압도적인 운영 효율
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: IconSave,
                value: <CountUp to={400} prefix="매월 " suffix="만원" />,
                label: "인건비 절감",
              },
              {
                icon: IconRest,
                value: <CountUp to={10} prefix="최대 " suffix="시간" />,
                label: "야간 관리자 휴식 확보",
              },
              {
                icon: IconFlex,
                value: <>주간에도 선택 무인</>,
                label: "운영 유연화",
              },
            ].map((item, index) => (
              <Reveal key={item.label} delay={index * 80} className="h-full">
                <div className="h-full rounded-3xl border border-line bg-white px-7 py-8 transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_50px_rgba(199,149,0,0.14)]">
                  <item.icon className="h-14 w-14" />
                  <p className="mt-6 text-[24px] font-extrabold tracking-[-0.02em] md:text-[26px]">
                    {item.value}
                  </p>
                  <p className="mt-1.5 text-[15px] text-muted">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 실제 사례 ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink px-5 py-24 text-white md:px-8 md:py-32">
        <div
          className="aurora pointer-events-none absolute -bottom-40 right-[-10%] h-96 w-[46rem] rounded-full bg-gold/8 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-[28px] font-semibold leading-[1.4] tracking-[-0.03em] md:text-[44px]">
              어떤 상황이든{" "}
              <span className="text-gold-bright">
                낭만지기가 다 지켜드립니다.
              </span>
            </h2>
            <p className="mt-4 text-sm text-white/55">
              *모두 100% 실제 사례입니다.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {cases.map((item, index) => (
              <Reveal key={item.title} delay={(index % 2) * 90} className="h-full">
                <article className="h-full rounded-3xl border border-white/10 bg-white/[0.05] p-7 transition duration-300 hover:border-gold/40 hover:bg-white/[0.08] md:p-8">
                  <h3 className="text-[20px] font-semibold text-gold-bright">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/45">
                    {item.note}
                  </p>
                  <div className="mt-6 border-t border-white/10 pt-6 text-[17px] leading-7 text-white/85">
                    <p>{item.result}</p>
                    {item.extra ? <p className="mt-2">{item.extra}</p> : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <a
              href={LINKS.blog}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-gold underline-offset-4 hover:underline"
            >
              도입 사례 더 보러가기
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 요금 ────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="relative scroll-mt-24 overflow-hidden bg-night px-5 py-24 text-white md:px-8 md:py-32"
      >
        <div
          className="aurora pointer-events-none absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-[13px] font-semibold tracking-[0.14em] text-gold">
              요금 안내
            </p>
            <h2 className="mt-3 text-center font-display text-[30px] font-bold tracking-[-0.02em] text-gold-bright md:text-[44px]">
              파격 요금
            </h2>
          </Reveal>
          <div className="mt-12 grid items-end gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <Reveal>
              <div>
                <p className="text-[15px] text-white/55">시간 당 · 부가세 포함</p>
                <p className="mt-2 flex items-end gap-2">
                  <span className="text-[76px] font-extrabold leading-none tracking-[-0.05em] text-gold-bright md:text-[110px]">
                    <CountUp to={2900} duration={1400} />
                  </span>
                  <span className="mb-2 text-[28px] font-semibold md:mb-3 md:text-[36px]">
                    원
                  </span>
                </p>
                <h3 className="mt-7 text-[26px] font-semibold leading-snug tracking-[-0.03em] md:text-[36px]">
                  이런 관제 또 없습니다.
                </h3>
                <p className="mt-5 inline-flex rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
                  11시간 이상 이용 시 추가 할인
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div>
                <p className="text-sm text-white/50">초기·고정 비용</p>
                <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                  {zeroFees.map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between py-3.5 text-[16px]"
                    >
                      <span className="text-white/70">{item}</span>
                      <span className="tnum font-extrabold text-gold-bright">
                        0원
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[18px] font-bold leading-snug">
                  추가 비용 없이, 관제비만{" "}
                  <span className="text-gold-bright">2,900원</span>
                </p>
                <p className="mt-3 text-sm text-white/45">
                  *최소 이용시간이 적용됩니다.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <div className="mt-14 flex justify-center">
              <CtaButton>우리 업장 견적 받아보기</CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-[13px] font-semibold tracking-[0.14em] text-gold-text">
              자주 묻는 질문
            </p>
            <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] md:text-[40px]">
              많이 궁금해 하시는 질문들,
              <br />
              미리 준비했습니다.
            </h2>
            <p className="mt-4 leading-7 text-muted">
              아직 궁금증이 해결되지 않으셨다면, 언제든지 문의 주세요.
              <br />
              최대한 신속하게 답변 드리겠습니다.
            </p>
          </Reveal>
          <div className="mt-10">
            <FaqList />
          </div>
        </div>
      </section>

      {/* ── 클로징: 오늘 밤부터는, 편히 주무세요 ────────────────────── */}
      <section className="relative overflow-hidden text-white">
        <Image
          src={IMG.aboutHero}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,6,20,0.82),rgba(6,6,20,0.55)_50%,rgba(6,6,20,0.88))]" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-5 py-28 text-center md:px-8 md:py-36">
          <Reveal>
            <h2 className="font-display text-[34px] font-black leading-[1.4] tracking-[-0.02em] md:text-[56px]">
              오늘 밤부터는,
              <br />
              편히 주무세요.
            </h2>
            <p className="mt-6 text-[16px] leading-[1.8] text-white/70 md:text-[19px]">
              프론트는 슬낭이 지키겠습니다.
              <br />
              우리 업장에 맞는 운영 방식과 견적, 무료 상담으로 확인해 보세요.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row">
              <CtaButton>무료 상담 신청</CtaButton>
              <a
                href={LINKS.tel}
                className="tnum text-[17px] font-semibold text-white/85 underline-offset-4 hover:text-gold-bright hover:underline"
              >
                {COMPANY.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(FAQ_JSONLD) }}
      />
    </main>
  );
}
