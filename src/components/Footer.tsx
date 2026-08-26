import Link from "next/link";
import { COMPANY, LINKS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <h3 className="text-lg font-semibold">{COMPANY.legal}</h3>
          <div className="mt-4 space-y-1 text-sm leading-6 text-muted">
            <p>주소: {COMPANY.address}</p>
            <p>지사: {COMPANY.branch}</p>
            <p>이메일: {COMPANY.email}</p>
            <p>사업자등록번호: {COMPANY.bizNo}</p>
            <p>고객센터: {COMPANY.phone}</p>
            <p>대표자: {COMPANY.ceo}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <a
            href={LINKS.kakao}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center rounded-lg bg-kakao px-4 py-2 font-medium text-[#392020]"
          >
            간편 문의
          </a>
          <Link
            href={LINKS.contact}
            className="inline-flex w-fit items-center gap-2 rounded-[14px] bg-gold px-5 py-3 font-medium"
          >
            우리 업장 맞춤 상담받기
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm">↗</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
