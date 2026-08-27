import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { Header } from "@/components/Header";
import { StickyCta } from "@/components/StickyCta";
import { COMPANY } from "@/lib/site";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${COMPANY.name} : 무인 관제의 혁신, 차원이 다른 선대응 무인관제`,
  description:
    "중소형 모텔/호텔 무인관제. 호출벨 뒤가 아니라, 움직임이 감지되는 순간 선대응하는 슬낭의 관제.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={notoSansKr.variable} data-scroll-behavior="smooth">
      <body className="min-h-dvh bg-white pb-28 font-sans antialiased">
        <Header />
        {children}
        <Footer />
        <Suspense>
          <StickyCta />
        </Suspense>
        <FloatingContact />
      </body>
    </html>
  );
}
