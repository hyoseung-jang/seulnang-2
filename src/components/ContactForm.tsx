"use client";

import { useState } from "react";
import { COMPANY, LINKS } from "@/lib/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-2xl bg-cream p-6 md:p-8">
      {sent ? (
        <p className="text-[18px] leading-7">
          문의가 접수되었습니다. 3일 이내에 작성해주신 연락처로 연락드리겠습니다.
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <label className="block">
            <span className="mb-2 block text-sm">이름</span>
            <input
              required
              name="name"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-gold-deep"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm">연락처</span>
            <input
              required
              name="phone"
              type="tel"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-gold-deep"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm">업소명</span>
            <input
              required
              name="store"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-gold-deep"
            />
          </label>
          <button
            type="submit"
            className="mt-2 w-full rounded-[14px] bg-brown py-4 font-medium text-white"
          >
            무료 상담 신청
          </button>
        </form>
      )}
      <p className="mt-6 text-xs leading-5 text-muted">
        슬기로운 낭만지기(이하 “회사”)는 이용자의 개인정보를 보호하며 관련 법령을
        준수합니다.
        <br />
        수집 항목 : 이름, 연락처, 업소명
        <br />
        수집 목적 : 문의 상담 및 서비스 안내, 도입 상담 진행
        <br />
        보관 기간 : 상담 종료 후 파기
        <br />
        문의 : {COMPANY.contactEmail}
      </p>
      <a
        href={LINKS.kakao}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex rounded-lg bg-kakao px-4 py-2 text-sm font-medium text-[#392020]"
      >
        카톡 문의
      </a>
    </div>
  );
}
