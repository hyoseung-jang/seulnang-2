import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 | 슬기로운 낭만지기",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-cream">{children}</div>;
}
