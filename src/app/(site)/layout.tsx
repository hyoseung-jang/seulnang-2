// 공개 사이트 공통 크롬(헤더·푸터·플로팅 CTA). /admin 은 이 레이아웃을 쓰지 않는다.
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { Header } from "@/components/Header";
import { MarketingTags } from "@/components/MarketingTags";
import { StickyCta } from "@/components/StickyCta";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <MarketingTags />
      <Header />
      {children}
      <Footer />
      <Suspense>
        <StickyCta />
      </Suspense>
      <FloatingContact />
    </div>
  );
}
