import type { Metadata } from "next";
import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";
import { IMG } from "@/lib/site";

export const metadata: Metadata = {
  title: "거품 없는 중소형 호텔 맞춤 키오스크 | 슬기로운 낭만지기",
  description:
    "기계값 거품은 빼고 기능은 꽉 채웠습니다. 30cm 소형 사이즈로 좁은 프런트에도 딱 맞는 키오스크.",
};

export default function KioskPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <h1 className="max-w-4xl text-[32px] font-semibold leading-snug tracking-tight md:text-[48px]">
          작은 매장일수록 디테일은 더 세밀하게. 중소형 업장에 딱 맞춘 키오스크
        </h1>
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
            <p className="text-sm text-muted">키오스크, 크지 않아도 됩니다.</p>
            <h2 className="mt-3 text-[28px] font-semibold leading-snug md:text-[36px]">
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
            <ol className="mt-8 space-y-3 font-semibold">
              <li>01. 기존 인테리어를 해치지 않아요.</li>
              <li>02. 불필요한 비용을 절감하여, 합리적이에요.</li>
              <li>03. 동선이 방해되지 않아, 작은 업장에도 걱정 없어요.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-4xl text-[26px] font-semibold leading-snug md:text-[36px]">
            프론트는 기본, 엘리베이터와 계단 앞까지. 외부인과 미성년자의 무단 출입을
            빈틈없이 차단합니다.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <article className="rounded-2xl bg-white p-6">
              <p className="text-sm text-muted">비품도 걱정 없어요.</p>
              <h3 className="mt-2 text-[22px] font-semibold">고객 전용 비품함</h3>
              <p className="mt-3 text-muted">클릭 한번이면 끝, 비품도 이제 원격으로</p>
              <p className="mt-6 text-sm text-muted">
                *하드웨어 및 제공 품목 : 키오스크 태블릿 + 키발급기, 카메라, 비품
                보관함, 현금함
              </p>
            </article>
            <article className="rounded-2xl bg-white p-6">
              <p className="text-sm text-muted">멀리 외출 중에도 매장은 사장님 손안에.</p>
              <h3 className="mt-2 text-[22px] font-semibold">사장님 전용 관제 앱</h3>
              <p className="mt-3 text-muted">
                외출 중에도 프런트 그대로, 폰으로 하는 손님 맞이
              </p>
            </article>
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
