"use server";

import nodemailer from "nodemailer";
import { recordInquiry } from "@/lib/analytics/record-inquiry";
import { COMPANY } from "@/lib/site";

export type InquiryState = {
  ok: boolean;
  message: string;
} | null;

// 네이버웍스 SMTP (biz@rosegoldsoftware.co.kr) — 사내에서 이미 사용 중인 발송 계정.
const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.worksmobile.com";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465);
const SMTP_USER = process.env.SMTP_USER ?? "biz@rosegoldsoftware.co.kr";

// 수신 주소는 이 파일("use server")에서만 읽는다. site.ts 는 클라이언트
// 컴포넌트도 import 하므로 거기에 두면 공개 JS 번들로 그대로 새어 나간다.
// 운영 중 수신자 변경은 Vercel 환경변수 INQUIRY_TO(쉼표 구분)로 한다.
const DEFAULT_INQUIRY_TO = [
  "rose5084gold@gmail.com",
  "gytmd1119@naver.com",
  "biz@rosegoldsoftware.co.kr",
];

function inquiryRecipients() {
  const configured = (process.env.INQUIRY_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter((address) => address.includes("@"));

  if (configured.length > 0) return configured;

  // 환경변수가 비었거나 형식이 깨져도 문의가 유실되지 않도록 기본값으로 보낸다.
  console.warn("[inquiry] INQUIRY_TO 가 비어 있어 기본 수신처로 발송합니다.");
  return DEFAULT_INQUIRY_TO;
}

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

  // 전환(문의) 기록 — 메일 성패와 무관하게 리드는 DB 에 남긴다.
  // 기록 실패가 문의 접수를 막아서는 안 되므로 항상 삼켜서 로그만 남긴다.
  const record = (mailSent: boolean) =>
    recordInquiry({
      store,
      region,
      phone,
      message,
      selfSource: source,
      mailSent,
    }).catch((error) => console.error("[inquiry] 전환 기록 실패", error));

  const password = process.env.SMTP_PASSWORD;
  if (!password) {
    console.error("[inquiry] SMTP_PASSWORD 가 설정되어 있지 않습니다.");
    await record(false);
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
      to: inquiryRecipients(),
      subject: `[상담 요청] ${store}`,
      text: body,
    });
  } catch (error) {
    console.error("[inquiry] 메일 발송 실패", error);
    // 메일이 실패해도 리드가 유실되지 않도록 기록한다(대시보드에서 mail_sent=0 으로 표시).
    await record(false);
    return { ok: false, message: "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  await record(true);

  return {
    ok: true,
    message: "문의가 접수되었습니다. 3일 이내에 작성해주신 연락처로 연락드리겠습니다.",
  };
}
