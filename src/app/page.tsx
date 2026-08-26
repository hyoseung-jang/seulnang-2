import Image from "next/image";
import Link from "next/link";
import { CtaButton } from "@/components/CtaButton";
import { FaqList } from "@/components/FaqList";
import { LogoMarquee } from "@/components/LogoMarquee";
import { ReviewMarquee } from "@/components/ReviewMarquee";
import { IMG, LINKS } from "@/lib/site";

const problems = [
  "새벽 2~5팀 응대를 위해 매달 버려지는 야간 인건비 250만원,",
  "물가·임금은 폭등하는데 객실가는 10년째 동결,",
  "구인도, 관리도 어려워 결국 또 대표님이 지키는 밤새 카운터,",
  "이 모든 걸 해결하려 도입한 무인관제가 또 다시 사장님을 힘들게 했다면?",
];

const cases = [
  {
    title: "미성년자 무단 출입이 잦은 업장",
    note: "*엘리베이터나 계단으로 무단침입 시 즉시 차단 및 신고 접수",
    result: "1년 간 12건의 미성년자 출입 시도 모두 차단.",
    extra: "슬낭이 관리하는 전 숙박업소 미성년자 이슈 '0건'",
  },
  {
    title: "노년층이 주요 고객인 업장",
    note: "*손님이 오면 이름만 물어보고 바로 객실 키 제공으로 빠른 응대",
    result: "평균 고객 연령 60대인 업장도 문제 없이 이용 중",
  },
  {
    title: "취객/사건 사고가 끊이질 않는 업장",
    note: "*사건 사고 발생 녹음 or 녹화 or 서명, 경찰 출동 시에도 즉시 대응 / 상급 취객 응대 / 사각지대 응대",
    result: "금연방에서 흡연한 인원도 관제 사용 후 100% 검거 및 과태료 부과",
  },
  {
    title: "이미 키오스크를 사용 중인 업장",
    note: "*기존 키오스크는 미성년자 판별 불가, 컴플레인 대응 불가, 전화 대응 불가, 직원 + 키오스크 비용 동시 지출",
    result: "키오스크를 쓰면서도 사람이 근무하던 업장에서, 이제는 완전 퇴근으로 인건비 절감",
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative min-h-[88vh] overflow-hidden text-white">
        <Image
          src={IMG.hero}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
          <h2 className="text-[28px] font-medium tracking-tight md:text-[30px]">
            중소형 모텔/호텔 무인관제
          </h2>
          <h1 className="mt-3 max-w-4xl text-[34px] font-semibold leading-[1.25] tracking-tight md:text-[55px] md:leading-[1.35]">
            무인 관제는 한계가 있다고요?
            <br />
            슬낭의 <span className="text-gold-bright">선대응</span>은 다릅니다.
          </h1>
          <div className="mt-8">
            <CtaButton>우리 업장 맞춤 상담받기</CtaButton>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 text-center md:px-8 md:py-24">
        <h2 className="mx-auto max-w-3xl text-[26px] font-semibold leading-snug tracking-tight md:text-[40px]">
          전국{" "}
          <span className="inline-block rounded-md bg-orange px-2 py-0.5 text-white">
            120+
          </span>{" "}
          숙박업소의 선택, 이제 무인관제는 선택이 아닌 필수입니다.
        </h2>
      </section>

      <LogoMarquee />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-[28px] font-semibold tracking-tight md:text-[42px]">
            매출은 제자리, 운영비는 폭등. 이대로 괜찮을까요?
          </h2>
          <div className="mt-10 space-y-5 text-[18px] leading-8 text-muted md:text-[22px]">
            {problems.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p className="font-semibold text-ink">
              이제, 새로운 차원의 무인관제를 만날 때.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(0deg,#ffe38c_0%,#fff_22%,#fff_78%,#ffe38c_100%)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 text-center md:px-8">
          <p className="text-sm text-gold-text">관제의 판도를 완전히 뒤바꾸다</p>
          <h2 className="mt-3 text-[32px] font-semibold tracking-tight md:text-[48px]">
            슬기로운 낭만지기
          </h2>
          <div className="mt-10">
            <ReviewMarquee />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium text-gold-text">차별점 01</p>
          <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-snug tracking-tight md:text-[40px]">
            호출벨 누른 뒤에야 오는 관제?
            <br />
            이미 응대는 늦었습니다.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-[#f3f3f3] p-6 md:p-8">
              <p className="text-sm text-muted">타사</p>
              <h3 className="mt-3 text-[24px] font-semibold">고객 신호 와야 대응</h3>
              <p className="my-4 text-muted">or</p>
              <h3 className="text-[24px] font-semibold">키오스크 단독</h3>
              <ul className="mt-6 space-y-2 text-muted">
                <li>미성년자 방어 X</li>
                <li>비품/사용문의 X</li>
                <li>장애 대응 X</li>
                <li>유동적인 대응 X</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-ink p-6 text-white md:p-8">
              <h3 className="text-[22px] font-semibold leading-snug md:text-[26px]">
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

      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium text-gold-text">차별점 02</p>
          <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-snug tracking-tight md:text-[40px]">
            원하면 언제든 쉽게
            <br />
            프론트에서 해방 되세요!
          </h2>
          <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-[24px] font-semibold md:text-[32px]">
                슥 밀기만 하면 언제 어디서든 바로 관제 시작
              </h3>
              <p className="mt-4 text-[18px] text-muted">
                유연한 운영으로 노무 문제 걱정없이, 효율적으로
              </p>
            </div>
            <div className="relative mx-auto h-[360px] w-full max-w-sm">
              <Image
                src={IMG.appPhone}
                alt="사장님 전용 관제 앱"
                fill
                className="object-contain"
                sizes="360px"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div className="relative h-[380px] w-full">
            <Image
              src={IMG.kioskDevice}
              alt="무인관제 기기"
              fill
              className="object-contain"
              sizes="(min-width: 768px) 40vw, 90vw"
            />
          </div>
          <div>
            <p className="text-sm text-muted">키오스크, 크지 않아도 됩니다.</p>
            <h2 className="mt-3 text-[28px] font-semibold leading-snug tracking-tight md:text-[40px]">
              기계값 거품을 뺀, 단 30cm의 키오스크 시스템.
            </h2>
            <p className="mt-3 text-sm text-muted">
              *태블릿 270x220, 카드 키 발급기 300x350x400(mm)
            </p>
            <p className="mt-6 leading-7">
              예약 연동은 기본, 사장님만의 운영 노하우까지.
              <br />
              타사 대비 압도적으로 세밀한 설정으로 업장 맞춤 관리가 가능합니다.
            </p>
            <ol className="mt-8 space-y-4">
              <li className="flex gap-4 text-[18px] font-semibold">
                <span className="text-gold-text">1</span>
                기존 인테리어를 해치지않아요
              </li>
              <li className="flex gap-4 text-[18px] font-semibold">
                <span className="text-gold-text">2</span>
                불필요한 비용을 절감하여, 합리적이에요
              </li>
              <li className="flex gap-4 text-[18px] font-semibold">
                <span className="text-gold-text">3</span>
                동선이 방해되지 않아, 작은 업장에도 걱정 없어요.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-[28px] font-semibold tracking-tight md:text-[40px]">
            압도적인 수익률을 만드는 슬낭만의 솔루션
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Link
              href={LINKS.pms}
              className="rounded-2xl bg-gold-deep p-7 text-ink"
            >
              <p className="text-sm">PMS</p>
              <p className="mt-4 text-[22px] font-semibold leading-snug">
                복잡했던 숙박업 운영을
                <br />
                하나의 PMS로 더 쉽고 체계적으로.
              </p>
              <p className="mt-8 text-sm">더 알아보기 →</p>
            </Link>
            <Link href={LINKS.muin} className="rounded-2xl bg-navy p-7 text-white">
              <p className="text-sm">무인관제</p>
              <p className="mt-4 text-[22px] font-semibold leading-snug">
                밤샘 걱정 없는 완벽한 자유.
                <br />
                오직 슬낭에서만.
              </p>
              <p className="mt-8 text-sm">더 알아보기 →</p>
            </Link>
            <Link
              href={LINKS.kiosk}
              className="rounded-2xl bg-[#d9d9d9] p-7 text-ink"
            >
              <p className="text-sm">키오스크 및 시스템</p>
              <p className="mt-4 text-[22px] font-semibold leading-snug">
                작지만 강력한 운영 효율.
                <br />
                중소형 업장 최적화 맞춤 기능.
              </p>
              <p className="mt-8 text-sm">더 알아보기 →</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-[26px] font-semibold leading-snug tracking-tight md:text-[36px]">
            시급 <span className="text-gold-text">1,900원</span>의 전문 프론트 관제
            인력으로 누리는 압도적인 운영 효율
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { src: IMG.save, title: "매월 400만원 절감" },
              { src: IMG.rest, title: "야간 관리자 최대 10시간 휴식" },
              { src: IMG.flex, title: "선택적 주간 무인으로 운영 유연화" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-line p-6">
                <div className="relative h-12 w-12">
                  <Image src={item.src} alt="" fill className="object-contain" sizes="48px" />
                </div>
                <h3 className="mt-5 text-[20px] font-semibold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[28px] font-semibold tracking-tight md:text-[40px]">
            어떤 상황이든 낭만지기가 다 지켜드립니다.
          </h2>
          <p className="mt-3 text-sm text-white/60">*모두 100% 실제 사례입니다.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {cases.map((item) => (
              <article key={item.title} className="rounded-2xl bg-white/5 p-6">
                <h3 className="text-[20px] font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-white/60">{item.note}</p>
                <p className="mt-4 leading-7">{item.result}</p>
                {item.extra ? <p className="mt-2 text-gold">{item.extra}</p> : null}
              </article>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={LINKS.blog}
              target="_blank"
              rel="noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              도입 사례 더 보러가기 →
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 text-center md:px-8 md:py-24">
        <p className="text-sm text-gold-text">파격 요금</p>
        <h2 className="mt-3 text-[28px] font-semibold leading-snug tracking-tight md:text-[44px]">
          시간 당 2,900원(부가세 포함)
          <br />
          이런 관제 또 없습니다.
        </h2>
        <p className="mt-6 text-[20px] font-medium">11시간 이상 이용 시 추가 할인</p>
        <p className="mt-4 text-muted">
          렌탈비 · 장비비 · 초기 세팅비 · 가입비 · 보증금 · 관리비 → 모두 0원
        </p>
        <p className="mt-2 font-semibold">추가 비용 없이, 관제비만 2900원</p>
        <p className="mt-4 text-sm text-muted">*최소 이용시간이 적용됩니다.</p>
        <div className="mt-8">
          <CtaButton>우리 업장 맞춤 상담받기</CtaButton>
        </div>
      </section>

      <section id="faq" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[28px] font-semibold tracking-tight md:text-[40px]">
            많이 궁금해 하시는 질문들, 미리 준비했습니다.
          </h2>
          <p className="mt-4 text-muted">
            아직 궁금증이 해결되지 않으셨다면, 언제든지 문의 주세요.
            <br />
            최대한 신속하게 답변 드리겠습니다.
          </p>
          <div className="mt-10">
            <FaqList />
          </div>
        </div>
      </section>
    </main>
  );
}
