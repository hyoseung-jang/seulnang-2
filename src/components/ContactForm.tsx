"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "@/lib/submit-inquiry";

const fieldClass =
  "mt-2 w-full rounded-md border border-[#d8d8d8] bg-white px-4 py-3 text-[15px] outline-none placeholder:text-[#b3b3b3] focus:border-gold-deep";

const sources = [
  "네이버 검색",
  "네이버 블로그",
  "인스타그램",
  "유튜브",
  "지인 소개",
  "기존 고객 소개",
  "기타",
];

export function ContactForm() {
  const [state, formAction, pending] = useActionState<InquiryState, FormData>(
    submitInquiry,
    null,
  );

  if (state?.ok) {
    return <p className="mt-10 text-center text-[17px] leading-7">{state.message}</p>;
  }

  return (
    <form action={formAction} className="mt-10 space-y-6">
      <label className="block">
        <span className="text-[15px]">
          1. 업장명 <span className="text-[#e11d2e]">*</span>
        </span>
        <input
          required
          name="store"
          placeholder="예) 브라운도트"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="text-[15px]">
          2. 업장 지역 <span className="text-[#e11d2e]">*</span>
        </span>
        <input
          required
          name="region"
          placeholder="예) 인천 남동구 구월동"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="text-[15px]">
          3. 연락처 <span className="text-[#e11d2e]">*</span>
        </span>
        <input
          required
          name="phone"
          type="tel"
          placeholder="010-1234-5678"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="text-[15px]">4. 상담 내용(선택)</span>
        <textarea
          name="message"
          rows={5}
          placeholder="궁금하신 내용을 남겨주세요."
          className={`${fieldClass} min-h-[140px] resize-y`}
        />
      </label>
      <label className="block">
        <span className="text-[15px]">5. 알게된 경로(선택)</span>
        <select name="source" defaultValue="" className={`${fieldClass} text-[#111]`}>
          <option value="" disabled>
            선택해주세요
          </option>
          {sources.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      {state && !state.ok ? (
        <p className="text-center text-sm text-[#e11d2e]">{state.message}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-gold-bright py-4 text-[17px] font-semibold text-black disabled:opacity-60"
      >
        {pending ? "보내는 중..." : "상담 요청하기"}
      </button>
    </form>
  );
}
