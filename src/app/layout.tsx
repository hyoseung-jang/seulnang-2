import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { Header } from "@/components/Header";
import { StickyCta } from "@/components/StickyCta";
import { COMPANY } from "@/lib/site";
import { jsonLdString } from "@/lib/jsonld";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

const SITE_URL = "https://seulnang.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${COMPANY.name} : 무인 관제의 혁신, 차원이 다른 선대응 무인관제`,
  description:
    "중소형 모텔/호텔 무인관제. 호출벨 뒤가 아니라, 움직임이 감지되는 순간 선대응하는 슬낭의 관제.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: COMPANY.name,
    title: `${COMPANY.name} : 무인 관제의 혁신, 차원이 다른 선대응 무인관제`,
    description:
      "중소형 모텔/호텔 무인관제. 호출벨 뒤가 아니라, 움직임이 감지되는 순간 선대응하는 슬낭의 관제.",
    images: [{ url: "/images/home/first-photo.png", width: 1480, height: 909, alt: "슬기로운 낭만지기 무인 관제" }],
  },
  twitter: { card: "summary_large_image" },
};

/* 조직 JSON-LD — 사이트 전체에서 단일 @id 로 전역 1회 선언. 내용은 푸터·사이트 가시 정보와 동일해야 한다. */
const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: COMPANY.name,
  legalName: COMPANY.legal,
  url: SITE_URL,
  logo: `${SITE_URL}/images/home/company-logo.png`,
  telephone: "+82-1551-6783",
  email: COMPANY.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "한양대학로 60 401호",
    addressLocality: "안산시 상록구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  sameAs: [
    "https://go.rosegoldsoftware.co.kr",
    "https://blog.naver.com/motel_safe_tech",
    "https://pf.kakao.com/_dJbsX",
  ],
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: COMPANY.name,
  inLanguage: "ko",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={notoSansKr.variable} data-scroll-behavior="smooth">
      <body className="min-h-dvh bg-white pb-28 font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(ORGANIZATION_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(WEBSITE_JSONLD) }}
        />
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
