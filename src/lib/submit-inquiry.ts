"use server";

import { Resend } from "resend";
import { COMPANY } from "@/lib/site";

export type InquiryState = {
  ok: boolean;
  message: string;
} | null;

function textOf(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const store = textOf(formData, "store");
  const region = textOf(formData, "region");
  const phone = textOf(formData, "phone");
  const message = textOf(formData, "message");
  const source = textOf(formData, "source");

  if (!store || !region || !phone) {
    return { ok: false, message: "필수 항목을 입력해 주세요." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      message: "메일 발송 설정이 되어 있지 않습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  const body = [
    `업장명: ${store}`,
    `업장 지역: ${region}`,
    `연락처: ${phone}`,
    `상담 내용: ${message || "-"}`,
    `알게된 경로: ${source || "-"}`,
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from:
      process.env.CONTACT_FROM ??
      `${COMPANY.name} <beth.t@example.com>`,
    to: [...COMPANY.inquiryTo],
    subject: `[상담 요청] ${store}`,
    text: body,
  });

  if (error) {
    return { ok: false, message: "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  return {
    ok: true,
    message: "문의가 접수되었습니다. 3일 이내에 작성해주신 연락처로 연락드리겠습니다.",
  };
}
