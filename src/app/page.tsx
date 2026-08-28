import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconFlex, IconRest, IconSave } from "@/components/BenefitIcons";
import { FaqList } from "@/components/FaqList";
import { LogoMarquee } from "@/components/LogoMarquee";
import { Reveal } from "@/components/Reveal";
import { ReviewMarquee } from "@/components/ReviewMarquee";
import { jsonLdString } from "@/lib/jsonld";
import { FAQS, IMG, LINKS } from "@/lib/site";

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

const zeroFees = [
  "렌탈비",
  "장비비",
  "초기 세팅비",
  "가입비",
  "보증금",
  "관리비",
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
          className="scale-105 object-cover blur-[3px]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
          <p className="text-[15px] font-medium tracking-[0.02em] text-white/80 md:text-[16px]">
            중소형 모텔/호텔 무인관제
          </p>
          <h1 className="mt-4 max-w-4xl text-[34px] font-semibold leading-[1.3] tracking-[-0.03em] md:text-[55px] md:leading-[1.32]">
            호텔·모텔 프론트,
            <br />
            이제 시간당{" "}
            <span className="text-gold-bright">2,900원</span>으로 운영하세요
          </h1>
        </div>
      </section>

      <section className="px-5 py-16 text-center md:px-8 md:py-24">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-[26px] font-semibold leading-[1.4] tracking-[-0.02em] md:text-[40px]">
            전국{" "}
            <span className="inline-block rounded-md bg-orange px-2 py-0.5 text-white">
              140+
            </span>{" "}
            숙박업소의 선택, 이제 무인관제는 선택이 아닌 필수입니다.
          </h2>
        </Reveal>
      </section>

      <LogoMarquee />

      <section className="bg-ink px-5 py-20 text-white md:px-8 md:py-28">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-[28px] font-semibold leading-[1.4] tracking-[-0.03em] md:text-[42px]">
              매출은 제자리,{" "}
              <span className="font-extrabold">운영비는 폭등.</span>
              <br />
              이대로 괜찮을까요?
            </h2>
            <div className="mt-12 space-y-6 text-[18px] leading-[1.8] text-white/72 md:text-[22px]">
              <p>
                새벽 2~5팀 응대를 위해 매달 버려지는 야간 인건비{" "}
                <strong className="font-bold text-white">250만원,</strong>
              </p>
              <p>
                물가·임금은 폭등하는데 객실가는{" "}
                <strong className="font-bold text-white">10년째 동결,</strong>
              </p>
              <p>
                구인도, 관리도 어려워 결국 또{" "}
                <strong className="font-bold text-white">
                  대표님이 지키는 밤새 카운터,
                </strong>
              </p>
              <p>
                이 모든 걸 해결하려 도입한 무인관제가{" "}
                <strong className="font-bold text-white">
                  또 다시 사장님을 힘들게 했다면?
                </strong>
              </p>
            </div>
            <div className="relative mx-auto mt-14 inline-flex max-w-full">
              <div className="gold-glow absolute -inset-4 rounded-full bg-gold/80 blur-2xl" />
              <p className="relative rounded-full bg-gold px-5 py-3.5 text-[16px] font-extrabold leading-snug text-ink md:px-10 md:py-5 md:text-[24px]">
                이제, 새로운 차원의 무인관제를 만날 때
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[linear-gradient(0deg,#ffe38c_0%,#fff_18%,#fff_82%,#ffe38c_100%)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 text-center md:px-8">
          <p className="text-sm font-medium tracking-[0.04em] text-gold-text">
            관제의 판도를 완전히 뒤바꾸다
          </p>
          <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.03em] md:text-[48px]">
            슬기로운 낭만지기
          </h2>
          <div className="mt-10">
            <ReviewMarquee />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-medium tracking-[0.04em] text-gold-text">
              차별점 01
            </p>
            <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-[1.35] tracking-[-0.03em] md:text-[40px]">
              호출벨 누른 뒤에야 오는 관제?
              <br />
              이미 응대는 늦었습니다.
            </h2>
          </Reveal>
          <div className="mt-12 grid items-stretch gap-5 md:grid-cols-2 md:items-center">
            <Reveal>
              <div className="rounded-2xl bg-[#f3f3f3] p-6 md:p-8">
                <p className="text-sm text-muted">타사</p>
                <h3 className="mt-3 text-[22px] font-medium text-[#5a5a5a] md:text-[24px]">
                  고객 신호 와야 대응
                </h3>
                <p className="my-4 text-muted">or</p>
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
            </Reveal>
            <Reveal delay={80}>
              <div className="relative md:-mx-2 md:scale-[1.03]">
                <div className="gold-glow absolute -inset-3 rounded-[32px] bg-gold blur-xl" />
                <div className="relative rounded-[24px] bg-gold p-6 text-ink shadow-[0_18px_50px_rgba(199,149,0,0.28)] md:p-8">
                  <p className="text-sm font-semibold">슬기로운 낭만지기</p>
                  <h3 className="mt-3 text-[24px] font-extrabold leading-snug md:text-[28px]">
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
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm font-medium tracking-[0.04em] text-gold-text">
              차별점 02
            </p>
            <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-[1.35] tracking-[-0.03em] md:text-[40px]">
              원하면 언제든 쉽게
              <br />
              프론트에서 해방 되세요!
            </h2>
          </Reveal>
          <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
            <Reveal>
              <div>
                <h3 className="text-[24px] font-semibold leading-snug md:text-[32px]">
                  슥 밀기만 하면 언제 어디서든 바로 관제 시작
                </h3>
                <p className="mt-4 text-[18px] leading-7 text-muted">
                  유연한 운영으로 노무 문제 걱정없이, 효율적으로
                </p>
              </div>
            </Reveal>
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
          <Reveal>
            <div>
              <p className="text-sm text-muted">키오스크, 크지 않아도 됩니다.</p>
              <h2 className="mt-3 text-[28px] font-semibold leading-[1.35] tracking-[-0.03em] md:text-[40px]">
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
          </Reveal>
        </div>
      </section>

      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-[28px] font-semibold tracking-[-0.03em] md:text-[40px]">
            압도적인 수익률을 만드는 슬낭만의 솔루션
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Link
              href={LINKS.pms}
              className="rounded-2xl bg-gold-deep p-7 text-ink transition duration-200 hover:brightness-105"
            >
              <p className="text-sm">PMS</p>
              <p className="mt-4 text-[22px] font-semibold leading-snug">
                복잡했던 숙박업 운영을
                <br />
                하나의 PMS로 더 쉽고 체계적으로.
              </p>
              <p className="mt-8 text-sm">더 알아보기 →</p>
            </Link>
            <Link
              href={LINKS.muin}
              className="rounded-2xl bg-navy p-7 text-white transition duration-200 hover:brightness-110"
            >
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
              className="rounded-2xl bg-[#d9d9d9] p-7 text-ink transition duration-200 hover:bg-[#cecece]"
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
          <Reveal>
            <h2 className="max-w-3xl text-[26px] font-semibold leading-[1.4] tracking-[-0.02em] md:text-[36px]">
              시급 <span className="text-gold-text">2,900원</span>의 전문 프론트
              관제 인력으로 누리는 압도적인 운영 효율
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: IconSave, title: "매월 400만원 절감" },
              { icon: IconRest, title: "야간 관리자 최대 10시간 휴식" },
              { icon: IconFlex, title: "선택적 주간 무인으로 운영 유연화" },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="rounded-2xl border border-line px-6 py-7 transition duration-200 hover:border-gold/80">
                  <item.icon className="h-14 w-14" />
                  <h3 className="mt-5 text-[20px] font-semibold leading-snug">
                    {item.title}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-20 text-white md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-[28px] font-semibold leading-[1.4] tracking-[-0.03em] md:text-[44px]">
              어떤 상황이든{" "}
              <span className="text-gold-bright">낭만지기가 다 지켜드립니다.</span>
            </h2>
            <p className="mt-4 text-sm text-white/55">*모두 100% 실제 사례입니다.</p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {cases.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 md:p-8"
              >
                <h3 className="text-[20px] font-semibold text-gold-bright">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/45">{item.note}</p>
                <div className="mt-5 border-t border-white/10 pt-5 text-[17px] leading-7 text-white/85">
                  <p>{item.result}</p>
                  {item.extra ? <p className="mt-2">{item.extra}</p> : null}
                </div>
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

      <section className="relative overflow-hidden bg-[#0c0c18] px-5 py-20 text-white md:px-8 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-gold/18 blur-3xl" />
        <Reveal>
          <div className="relative mx-auto max-w-5xl">
            <p className="text-center text-[28px] font-extrabold tracking-[-0.03em] text-gold-bright md:text-[40px]">
              파격 요금
            </p>
            <div className="mt-10 grid items-end gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
              <div>
                <p className="text-[15px] text-white/55">시간 당 · 부가세 포함</p>
                <p className="mt-2 flex items-end gap-2">
                  <span className="text-[72px] font-extrabold leading-none tracking-[-0.05em] text-gold-bright md:text-[104px]">
                    2,900
                  </span>
                  <span className="mb-2 text-[28px] font-semibold md:mb-3 md:text-[36px]">
                    원
                  </span>
                </p>
                <h2 className="mt-6 text-[26px] font-semibold leading-snug tracking-[-0.03em] md:text-[36px]">
                  이런 관제 또 없습니다.
                </h2>
                <p className="mt-5 inline-flex rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
                  11시간 이상 이용 시 추가 할인
                </p>
              </div>
              <div>
                <p className="text-sm text-white/50">초기·고정 비용</p>
                <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                  {zeroFees.map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between py-3 text-[16px]"
                    >
                      <span className="text-white/70">{item}</span>
                      <span className="font-extrabold text-gold-bright">0원</span>
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
            </div>
          </div>
        </Reveal>
      </section>

      <section id="faq" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[28px] font-semibold tracking-[-0.03em] md:text-[40px]">
            많이 궁금해 하시는 질문들, 미리 준비했습니다.
          </h2>
          <p className="mt-4 leading-7 text-muted">
            아직 궁금증이 해결되지 않으셨다면, 언제든지 문의 주세요.
            <br />
            최대한 신속하게 답변 드리겠습니다.
          </p>
          <div className="mt-10">
            <FaqList />
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(FAQ_JSONLD) }}
      />
    </main>
  );
}
