"use server";

import nodemailer from "nodemailer";
import { COMPANY } from "@/lib/site";

export type InquiryState = {
  ok: boolean;
  message: string;
} | null;

// 네이버웍스 SMTP (biz@rosegoldsoftware.co.kr) — 사내에서 이미 사용 중인 발송 계정.
const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.worksmobile.com";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465);
const SMTP_USER = process.env.SMTP_USER ?? "biz@rosegoldsoftware.co.kr";

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

  const password = process.env.SMTP_PASSWORD;
  if (!password) {
    console.error("[inquiry] SMTP_PASSWORD 가 설정되어 있지 않습니다.");
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

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    await transporter.sendMail({
      // 발신 주소는 인증 계정과 같아야 네이버웍스가 거부하지 않는다.
      from: { name: COMPANY.name, address: SMTP_USER },
      to: [...COMPANY.inquiryTo],
      subject: `[상담 요청] ${store}`,
      text: body,
    });
  } catch (error) {
    console.error("[inquiry] 메일 발송 실패", error);
    return { ok: false, message: "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  return {
    ok: true,
    message: "문의가 접수되었습니다. 3일 이내에 작성해주신 연락처로 연락드리겠습니다.",
  };
}
