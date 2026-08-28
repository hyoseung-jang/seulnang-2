"use server";

// 관리자 대시보드 서버 액션: 로그인/로그아웃, 문의 상태 변경.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  createAdminSession,
  requireAdmin,
  verifyPassword,
} from "@/lib/admin-auth";
import { q } from "@/lib/analytics/bridge";

export type LoginState = { message: string } | null;

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!process.env.ADMIN_PASSWORD) {
    return { message: "ADMIN_PASSWORD 환경 변수가 설정되어 있지 않습니다." };
  }
  if (!password || !verifyPassword(password)) {
    return { message: "비밀번호가 올바르지 않습니다." };
  }
  const session = createAdminSession();
  if (!session) return { message: "세션 생성에 실패했습니다." };
  (await cookies()).set(ADMIN_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: session.maxAge,
  });
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

const INQUIRY_STATUSES = new Set(["new", "contacted", "converted", "closed"]);

export async function updateInquiry(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").slice(0, 2000);
  if (!Number.isInteger(id) || id <= 0 || !INQUIRY_STATUSES.has(status)) return;
  await q(`UPDATE inquiries SET status = ?, note = ? WHERE id = ?`, [
    status,
    note || null,
    id,
  ]);
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
}
