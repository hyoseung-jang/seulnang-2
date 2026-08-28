import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { logoutAdmin } from "@/lib/admin-actions";

const NAV = [
  { href: "/admin", label: "개요" },
  { href: "/admin/channels", label: "채널" },
  { href: "/admin/pages", label: "페이지" },
  { href: "/admin/inquiries", label: "문의" },
] as const;

export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 각 페이지도 requireAdmin 을 호출하지만, 레이아웃에서도 한 번 막아 준다.
  await requireAdmin();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-5">
            <Link href="/admin" className="text-[15px] font-bold text-ink">
              슬낭 애널리틱스
            </Link>
            <nav className="flex items-center gap-1 text-[14px]">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2.5 py-1.5 text-muted transition hover:bg-cream hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-[13px] text-muted hover:text-ink md:block"
            >
              사이트 보기 ↗
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-md border border-line px-3 py-1.5 text-[13px] text-muted transition hover:bg-cream"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">{children}</main>
    </>
  );
}
