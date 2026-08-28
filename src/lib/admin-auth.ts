// /admin 대시보드 인증. ADMIN_PASSWORD 환경 변수 하나로 동작하는 단순한
// HMAC 서명 쿠키 방식 — 별도 계정/DB 없이 영업팀이 같은 비밀번호를 공유한다.

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "sl_admin";
const SESSION_DAYS = 30;

function secretKey(): Buffer | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  // 비밀번호에서 서명 키를 파생 — 비밀번호를 바꾸면 기존 세션이 전부 무효화된다.
  return createHash("sha256").update(`seulnang-admin:${password}`).digest();
}

function macOf(exp: number, key: Buffer): string {
  return createHmac("sha256", key).update(String(exp)).digest("hex");
}

export function createAdminSession(): { value: string; maxAge: number } | null {
  const key = secretKey();
  if (!key) return null;
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return { value: `${exp}.${macOf(exp, key)}`, maxAge: SESSION_DAYS * 24 * 60 * 60 };
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // 길이가 달라도 비교 시간이 일정하도록 해시끼리 비교한다.
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const key = secretKey();
  if (!key) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const exp = Number(value.slice(0, dot));
  const mac = value.slice(dot + 1);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = macOf(exp, key);
  try {
    return timingSafeEqual(Buffer.from(mac, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

/** 대시보드의 모든 페이지·액션 첫 줄에서 호출한다. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
