import type { Metadata } from "next";
import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";
import { Reveal } from "@/components/Reveal";
import { IMG } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/kiosk" },
  title: "관제까지 하나로 연결된 호텔 키오스크 | 슬기로운 낭만지기",
  description:
    "30cm 키오스크와 출입 통제, 무료 제공 관리자·하우스키핑 앱, 매일 아침 관제 리포트까지. 중소형 호텔을 위한 무인 프론트 한 세트.",
};

/* 히어로 아래 구성 요약 — 이 페이지에서 다루는 순서 그대로다.
   '기계 한 대'가 아니라 '프론트 한 세트'라는 첫 문장을 목차로 증명한다. */
const bundle = [
  { no: "01", title: "30cm 키오스크", desc: "예약 확인부터 결제, 키 발급까지" },
  { no: "02", title: "출입 통제", desc: "엘리베이터·계단 앞 무단 출입 차단" },
  { no: "03", title: "앱 2종 기본 무료", desc: "관리자 앱 + 하우스키핑 앱" },
  { no: "04", title: "관제 리포트", desc: "밤새 일어난 일을 아침 한 장에" },
];

/* 관제와 연결되는 사장님 앱 — 개편 전 페이지의 검증된 두 장면을 유지한다. */
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

/* 관제 리포트에 실제로 담기는 내역 — 대표가 확정해 준 항목만 쓴다. */
const reportItems = [
  {
    no: "01",
    title: "추가 결제 내역",
    body: "비품 판매·전달, 인원 추가 요금까지. 밤사이 발생한 결제를 건별로 정리해 드립니다.",
  },
  {
    no: "02",
    title: "진상 고객 응대 내역",
    body: "어떤 일이 있었고 어떻게 응대했는지, 필요한 경우 CCTV 녹화 영상과 함께 전달합니다. 앱에서도 바로 확인됩니다.",
  },
  {
    no: "03",
    title: "객실 점검 요청",
    body: "점검이 필요한 객실은 따로 정리해, 아침에 바로 조치할 수 있게 합니다.",
  },
  {
    no: "04",
    title: "추가 인원 신분증 확인",
    body: "체크인 이후 인원이 늘어나면 신분증 확인까지 마치고, 그 내역을 남깁니다.",
  },
];

export default function KioskPage() {
  return (
    <main>
      {/* ── 히어로: 실제 설치 로비 실사로 '세트'의 인상을 먼저 준다 ── */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm font-medium tracking-[0.04em] text-gold-text">
          키오스크 및 시스템
        </p>
        <h1
          data-motion="headline"
          className="mt-4 max-w-4xl text-[32px] font-black leading-[1.3] tracking-[-0.04em] md:text-[48px]"
        >
          키오스크 한 대가 아니라,
          <br />
          무인 프론트 <span className="text-gold-text">한 세트</span>입니다.
        </h1>
        <p className="mt-6 max-w-3xl text-[18px] leading-8 text-muted">
          30cm 키오스크와 키 발급기, 출입 통제, 기본 무료 앱 2종, 매일 아침
          도착하는 관제 리포트까지. 중소형 업장에 맞춰 처음부터 하나로
          설계했습니다.
        </p>
        <Reveal variant="zoom" delay={90}>
          <div className="parallax-media relative mt-12 aspect-[16/9] overflow-hidden rounded-[28px] bg-night">
            <Image
              src={IMG.kioskLobby}
              alt="호텔 로비 대리석 카운터 위에 설치된 슬낭 키오스크 — 카드 키 발급기와 체크인 태블릿"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 72rem, 100vw"
              preload
            />
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(7,12,23,0.7),transparent_55%)] px-6 pb-6 pt-16 text-white md:px-8 md:pb-8">
              <p className="text-[14px] font-semibold">
                실제 설치 로비 — 인테리어를 해치지 않는 크기
              </p>
            </div>
          </div>
        </Reveal>
        <dl
          data-motion="stagger"
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-4"
        >
          {bundle.map((item) => (
            <div key={item.no} className="border-t border-line pt-5">
              <dt className="flex items-baseline gap-2.5">
                <span className="tnum text-[13px] font-bold text-gold-text">
                  {item.no}
                </span>
                <span className="text-[17px] font-extrabold tracking-[-0.01em]">
                  {item.title}
                </span>
              </dt>
              <dd className="mt-2 text-[14px] leading-6 text-muted">
                {item.desc}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── 하드웨어: 기계값 거품 뺀 30cm ─────────────────────────────
          단품 연출컷 대신 히어로 로비 실사의 접사 크롭 2장을 쓴다 —
          '내어주는 기계'와 '맞이하는 화면'이 실제 설치 환경 그대로 보인다. */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal variant="left">
            <div className="flex items-start justify-center gap-5 md:gap-6">
              <figure className="w-[55%] max-w-[300px]">
                <div className="parallax-media overflow-hidden rounded-[24px] ring-1 ring-black/5">
                  <Image
                    src={IMG.kioskIssuer}
                    alt="대리석 카운터 위 슬낭 카드 키 발급기와 원목 키 트레이 — 실제 설치 접사"
                    width={600}
                    height={730}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 300px, 50vw"
                  />
                </div>
                <figcaption className="mt-3 text-center text-[13px] font-semibold text-muted">
                  카드 키 발급기
                </figcaption>
              </figure>
              <figure className="w-[45%] max-w-[250px] pt-14">
                <div className="parallax-media overflow-hidden rounded-[24px] ring-1 ring-black/5">
                  <Image
                    src={IMG.kioskTablet}
                    alt="슬낭 체크인 태블릿 실제 화면 — 예약 고객·현장 고객·추가 물품·퇴실 메뉴"
                    width={580}
                    height={460}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 250px, 42vw"
                  />
                </div>
                <figcaption className="mt-3 text-center text-[13px] font-semibold text-muted">
                  체크인 태블릿
                </figcaption>
              </figure>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <p className="text-sm font-semibold text-gold-text">
              기계는 작게, 응대는 끝까지
            </p>
            <h2 className="mt-3 text-[28px] font-semibold leading-snug tracking-[-0.03em] md:text-[36px]">
              기계값 거품을 뺀,
              <br />단 30cm의 키오스크 시스템.
            </h2>
            <p className="mt-3 text-sm text-muted">
              *태블릿 270x220, 카드 키 발급기 300x350x400(mm)
            </p>
            <p className="mt-6 leading-7 text-muted">
              예약 연동과 키 발급은 기계가, 고객의 질문과 돌발 상황은 관제가.
              하나의 팀처럼 이어져 진짜 무인 운영을 만듭니다.
            </p>
            <ol data-motion="stagger" data-motion-x="" className="mt-8 space-y-3 font-semibold">
              <li>01. 기존 인테리어를 해치지 않는 작은 크기</li>
              <li>02. 고객 호출 전 움직임 감지 선대응</li>
              <li>03. 렌탈비·장비비 0원, 설치부터 관제까지 한 번에</li>
            </ol>
            <p className="mt-6 text-sm text-muted">
              *함께 제공: 키오스크 태블릿 + 키 발급기, 카메라, 비품 보관함,
              현금함
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 출시 예고: 스탠드형 배리어프리 키오스크 ─────────────── */}
      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <article className="grid overflow-hidden rounded-[28px] bg-night text-white shadow-[0_24px_80px_rgba(18,18,43,0.14)] lg:grid-cols-[0.9fr_1.1fr] lg:rounded-[36px]">
              <div className="flex flex-col justify-center px-7 py-12 sm:px-10 md:py-16 lg:px-14">
                <p className="w-fit rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-[12px] font-bold tracking-[0.16em] text-gold">
                  COMING SOON
                </p>
                <h2
                  id="barrier-free-kiosk-title"
                  data-motion="headline"
                  className="mt-6 text-[30px] font-black leading-[1.35] tracking-[-0.04em] sm:text-[36px] lg:text-[42px]"
                >
                  스탠드형 배리어프리 키오스크,
                  <br />곧 선보입니다.
                </h2>
                <p className="mt-6 text-[17px] leading-[1.8] text-white/70">
                  누구나 불편 없이 체크인할 수 있도록
                  <br className="hidden sm:block" /> 더 세심하게 설계하고
                  있습니다.
                </p>
                <p className="mt-10 border-t border-white/12 pt-6 text-[14px] leading-6 text-white/55">
                  출시 전 배리어프리 접근성 검사를 진행할 예정입니다.
                </p>
              </div>
              <div className="relative overflow-hidden bg-[#c7a47d]">
                <Image
                  src={IMG.barrierFreeKiosk}
                  alt="호텔 로비에 설치된 스탠드형 배리어프리 키오스크 출시 예정 이미지"
                  width={1024}
                  height={1536}
                  className="block h-auto w-full"
                  sizes="(min-width: 1024px) 40rem, 100vw"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(to_bottom,rgba(12,12,24,0.32),transparent)] lg:inset-y-0 lg:left-0 lg:h-auto lg:w-24 lg:bg-[linear-gradient(to_right,rgba(12,12,24,0.32),transparent)]"
                  aria-hidden
                />
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ── 출입 통제·비품함: 이미지 없이 성과 수치로 미는 신뢰 밴드 ── */}
      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2
              data-motion="headline"
              className="max-w-4xl text-[26px] font-black leading-[1.35] tracking-[-0.03em] md:text-[38px]"
            >
              프론트는 기본, 엘리베이터와 계단 앞까지.
              <br />
              외부인과 미성년자의 무단 출입을{" "}
              <span className="text-gold-text">빈틈없이 차단</span>합니다.
            </h2>
          </Reveal>
          <div
            data-motion="stagger"
            className="mt-12 grid gap-x-10 gap-y-9 md:grid-cols-3"
          >
            <div className="border-t-2 border-ink pt-6">
              <p className="text-[38px] font-black leading-none tracking-[-0.04em] md:text-[46px]">
                <span className="tnum">0</span>건
              </p>
              <p className="mt-3 text-[16px] font-bold">
                슬낭 관리 업장 미성년자 이슈
              </p>
              <p className="mt-2 text-[14px] leading-6 text-muted">
                신분증 확인부터 출입 차단까지, 관제가 실시간으로 지켜본
                결과입니다.
              </p>
            </div>
            <div className="border-t border-line pt-6">
              <p className="pt-[7px] text-[19px] font-bold leading-snug md:pt-[13px] md:text-[21px]">
                객실로 가는 길목에서
                <br />한 번 더 확인합니다
              </p>
              <p className="mt-2 text-[14px] leading-6 text-muted">
                엘리베이터·계단 앞 출입 통제로, 무단침입 시 즉시 차단하고
                신고까지 접수합니다.
              </p>
            </div>
            <div className="border-t border-line pt-6">
              <p className="pt-[7px] text-[19px] font-bold leading-snug md:pt-[13px] md:text-[21px]">
                비품도 걱정 없어요,
                <br />
                고객 전용 비품함
              </p>
              <p className="mt-2 text-[14px] leading-6 text-muted">
                클릭 한번이면 끝, 비품도 이제 원격으로. 현금함까지 기본
                구성입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 차키 보관함: 열쇠 키 업장의 무인 전환을 여는 선택 구성 ──── */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.04em] text-gold-text">
              차키 보관함 · 선택 구성
            </p>
            <h2
              data-motion="headline"
              className="mt-3 text-[28px] font-black leading-[1.32] tracking-[-0.03em] md:text-[40px]"
            >
              카드키가 아니어도 됩니다.
              <br />
              열쇠 키 업장도 <span className="text-gold-text">무인</span>이
              됩니다.
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.8] text-muted">
              열쇠를 쓰신다는 이유로 무인 전환을 포기하셨나요? 차키 보관함이
              열쇠를 대신 내어주고 돌려받습니다. 키텍 교체 없이, 지금 그 열쇠
              그대로 관제 서비스를 이용할 수 있습니다.
            </p>
            <ul data-motion="stagger" data-motion-x="" className="mt-8 space-y-3 font-semibold">
              <li>01. 관제가 열어주는 보관함으로 열쇠 수령·반납</li>
              <li>02. 열쇠 키 업장도 관제 서비스 그대로 이용</li>
              <li>03. 손님 차키 보관까지 한 번에 해결</li>
            </ul>
          </Reveal>
          <Reveal variant="right" delay={90}>
            <div className="flex items-start justify-center gap-5 md:gap-6">
              <figure className="w-[55%] max-w-[300px]">
                <div className="overflow-hidden rounded-[24px] ring-1 ring-black/5">
                  <Image
                    src={IMG.keyLockerTall}
                    alt="슬낭 차키 보관함 스탠드형 — 5단 서랍식 화이트 캐비닛"
                    width={765}
                    height={1024}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 300px, 50vw"
                  />
                </div>
                <figcaption className="mt-3 text-center text-[13px] font-semibold text-muted">
                  스탠드형
                </figcaption>
              </figure>
              <figure className="w-[45%] max-w-[230px] pt-12">
                <div className="overflow-hidden rounded-[24px] ring-1 ring-black/5">
                  <Image
                    src={IMG.keyLockerCompact}
                    alt="슬낭 차키 보관함 콤팩트형 — 10칸 서랍식 화이트 캐비닛"
                    width={401}
                    height={706}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 230px, 40vw"
                  />
                </div>
                <figcaption className="mt-3 text-center text-[13px] font-semibold text-muted">
                  콤팩트형
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 기본 무료 앱 2종: 장비만 팔고 끝내지 않는다는 증거 ─────── */}
      <section className="relative overflow-hidden bg-ink px-5 py-20 text-white md:px-8 md:py-28">
        <div
          className="aurora pointer-events-none absolute -top-32 right-[-14%] h-96 w-[44rem] rounded-full bg-gold/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="text-[13px] font-semibold tracking-[0.08em] text-gold">
              기본 제공 소프트웨어
            </p>
            <h2
              data-motion="headline"
              className="mt-4 max-w-3xl text-[30px] font-black leading-[1.3] tracking-[-0.04em] md:text-[44px]"
            >
              관리자 앱과 하우스키핑 앱,
              <br />
              기본 기능은 <span className="text-gold-bright">무료</span>로
              드립니다.
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.8] text-white/68">
              기계만 놓고 가는 회사가 아니니까요. 업장을 실제로 굴리는 데 필요한
              앱 두 가지를 기본으로 함께 드립니다.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <Reveal className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.05] p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[22px] font-bold tracking-[-0.02em]">
                    관리자 앱
                  </h3>
                  <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-[12px] font-bold text-gold">
                    기본 기능 무료
                  </span>
                </div>
                <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-white/62">
                  객실 현황과 요금, 체크아웃, 배정 요청까지 한 화면에서. 밤새
                  관제가 처리한 기록도 전부 여기로 모입니다.
                </p>
                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={IMG.adminRooms}
                    alt="슬낭 관리자 앱 객실 관리 화면 — 층별 객실 현황과 요금, 배정 요청"
                    width={2000}
                    height={1078}
                    className="h-auto w-full"
                    sizes="(min-width: 1024px) 46rem, 100vw"
                  />
                </div>
              </article>
            </Reveal>
            <Reveal delay={90} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.05] p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[22px] font-bold tracking-[-0.02em]">
                    하우스키핑 앱
                  </h3>
                  <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-[12px] font-bold text-gold">
                    기본 기능 무료
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-[1.75] text-white/62">
                  객실별 청소·비품·시설 점검 업무를 직원 폰으로 바로 배정하고,
                  완료 현황까지 실시간으로 확인합니다.
                </p>
                <div className="mx-auto mt-6 w-full max-w-[230px]">
                  <Image
                    src={IMG.appHousekeeping}
                    alt="슬낭 하우스키핑 앱 오늘의 업무 화면 — 객실별 청소·비품·시설 점검 배정"
                    width={921}
                    height={2000}
                    className="h-auto w-full rounded-[24px] border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                    sizes="230px"
                  />
                </div>
              </article>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="mt-5 text-[13px] text-white/40">
              *CCTV 영상 확인 기능은 별도 비용이 있습니다.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 관제와 연결되는 사장님 앱 ───────────────────────────────── */}
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
          </div>
        </div>
      </section>

      {/* ── 관제 리포트: 밤새 일어난 일이 아침 한 장으로 ────────────── */}
      <section className="relative overflow-hidden bg-night px-5 py-20 text-white md:px-8 md:py-28">
        <div
          className="aurora pointer-events-none absolute -bottom-36 left-[-12%] h-96 w-[44rem] rounded-full bg-gold/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="text-[13px] font-semibold tracking-[0.08em] text-gold">
              관제 리포트
            </p>
            <h2
              data-motion="headline"
              className="mt-4 max-w-3xl text-[30px] font-black leading-[1.32] tracking-[-0.04em] md:text-[44px]"
            >
              걱정 마세요. 밤새 일어난 모든 일,
              <br />
              <span className="text-gold-bright">보고서에 다 담았습니다.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.8] text-white/68">
              매일 아침, 지난밤의 업장이 한 장으로 정리되어 도착합니다. 무슨
              일이 있었는지 몰라서 불안한 아침은 이제 없습니다.
            </p>
          </Reveal>
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div data-motion="stagger" className="space-y-4">
              {reportItems.map((item) => (
                <article
                  key={item.no}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition duration-300 hover:border-gold/40 hover:bg-white/[0.08]"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="tnum text-[13px] font-bold text-gold">
                      {item.no}
                    </span>
                    <h3 className="text-[19px] font-bold tracking-[-0.01em]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 pl-8 text-[15px] leading-[1.75] text-white/62">
                    {item.body}
                  </p>
                </article>
              ))}
              <p className="pt-1 text-[13px] text-white/40">
                *업장 상황에 따라 기록 항목은 더 늘어납니다.
              </p>
            </div>
            <Reveal variant="right" delay={90}>
              <div className="mx-auto flex max-w-[520px] items-start justify-center gap-5">
                <figure className="w-1/2 max-w-[230px]">
                  <Image
                    src={IMG.appLog1}
                    alt="관제 일지 앱 화면 — 체크인·주차·결제 기록"
                    width={473}
                    height={1024}
                    className="h-auto w-full rounded-[24px] border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                    sizes="(min-width: 768px) 230px, 44vw"
                  />
                </figure>
                <figure className="w-1/2 max-w-[230px] pt-12">
                  <Image
                    src={IMG.appLog2}
                    alt="관제 일지 앱 화면 — 점검 필요 객실 보고"
                    width={473}
                    height={1024}
                    className="h-auto w-full rounded-[24px] border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                    sizes="(min-width: 768px) 230px, 44vw"
                  />
                </figure>
              </div>
              <p className="mt-5 text-center text-[13px] font-semibold text-white/55">
                리포트 내역은 사장님 앱에서도 그대로 확인됩니다
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 설치 클로징 ─────────────────────────────────────────────── */}
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
        <div className="mt-9 flex justify-center">
          <CtaButton>무료 상담 신청</CtaButton>
        </div>
      </section>
    </main>
  );
}
