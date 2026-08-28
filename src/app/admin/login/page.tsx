import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="w-full max-w-[360px] rounded-2xl border border-line bg-white p-8">
        <h1 className="text-center text-[20px] font-bold text-ink">
          슬기로운 낭만지기
        </h1>
        <p className="mt-1 text-center text-[13px] text-muted">
          방문·문의 분석 대시보드
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
