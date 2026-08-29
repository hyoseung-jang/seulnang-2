import Link from "next/link";
import { COMPANY, LINKS } from "@/lib/site";

/* 회사 정보(주소·사업자번호 등)는 루트 레이아웃의 Organization JSON-LD 와 동일해야 한다 */
export function Footer() {
  return (
    <footer className="bg-night text-white">
      {/* 하단 고정 CTA 에 가리지 않도록 아래쪽 여백을 푸터 배경 안에 확보 */}
      <div className="mx-auto max-w-6xl px-5 pb-36 pt-14 md:px-8 md:pb-32 md:pt-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <p className="font-display text-[19px] font-bold">{COMPANY.legal}</p>
            <p className="mt-3 max-w-sm text-[14px] leading-6 text-white/50">
              중소형 모텔·호텔을 위한 선대응 무인관제.
              <br />
              사장님이 비운 프론트를 슬낭이 지킵니다.
            </p>
            <div className="mt-6 space-y-1.5 text-[13px] leading-6 text-white/45">
              <p>주소: {COMPANY.address}</p>
              <p>지사: {COMPANY.branch}</p>
              <p>
                대표자: {COMPANY.ceo} · 사업자등록번호: {COMPANY.bizNo}
              </p>
              <p>
                이메일: {COMPANY.email} · 고객센터:{" "}
                <a href={LINKS.tel} className="tnum text-white/70 hover:text-gold">
                  {COMPANY.phone}
                </a>
              </p>
            </div>
          </div>

          <nav aria-label="제품" className="text-[14px]">
            <p className="text-[13px] font-semibold tracking-[0.1em] text-gold">
              제품
            </p>
            <ul className="mt-4 space-y-2.5 text-white/60">
              <li>
                <Link href={LINKS.pms} className="transition hover:text-white">
                  PMS
                </Link>
              </li>
              <li>
                <Link href={LINKS.muin} className="transition hover:text-white">
                  무인관제
                </Link>
              </li>
              <li>
                <Link href={LINKS.kiosk} className="transition hover:text-white">
                  키오스크 및 시스템
                </Link>
              </li>
              <li>
                <Link href={LINKS.faq} className="transition hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          <div className="text-[14px]">
            <p className="text-[13px] font-semibold tracking-[0.1em] text-gold">
              문의
            </p>
            <ul className="mt-4 space-y-2.5 text-white/60">
              <li>
                <Link href={LINKS.contact} className="transition hover:text-white">
                  무료 상담 신청
                </Link>
              </li>
              <li>
                <Link href={LINKS.about} className="transition hover:text-white">
                  회사 소개
                </Link>
              </li>
              <li>
                <a
                  href={LINKS.blog}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  블로그
                </a>
              </li>
            </ul>
            <a
              href={LINKS.kakao}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center rounded-xl bg-kakao px-4 py-2.5 text-[13px] font-semibold text-[#392020] transition duration-200 hover:-translate-y-0.5"
            >
              카카오톡 간편 문의
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-white/35 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {COMPANY.legal}. All rights reserved.
          </p>
          <a
            href="/privacy"
            className="w-fit underline underline-offset-4 transition hover:text-white/70"
          >
            개인정보처리방침
          </a>
        </div>
      </div>
    </footer>
  );
}
