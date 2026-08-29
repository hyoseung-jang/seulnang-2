import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { COMPANY } from "@/lib/site";
import { jsonLdString } from "@/lib/jsonld";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

/* 디스플레이 서체 — 감성 헤드라인 전용(호텔 브랜드 톤). 본문에는 쓰지 않는다. */
const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const SITE_URL = "https://seulnang.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${COMPANY.name} | 키오스크와 관제를 하나로`,
  description:
    "키오스크만으로 해결되지 않는 고객 응대까지. 중소형 모텔과 호텔을 위한 키오스크, 선대응 관제, PMS 통합 운영 시스템.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: COMPANY.name,
    title: `${COMPANY.name} | 키오스크와 관제를 하나로`,
    description:
      "키오스크만으로 해결되지 않는 고객 응대까지. 키오스크와 선대응 관제를 하나로 연결합니다.",
    images: [{ url: "/images/home/hero-lobby-poster.jpg", width: 1920, height: 1080, alt: "슬기로운 낭만지기 무인 키오스크가 지키는 호텔 로비" }],
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
  telephone: "+82-70-4152-5252",
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
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${notoSerifKr.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh bg-white font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(ORGANIZATION_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(WEBSITE_JSONLD) }}
        />
        {children}
      </body>
    </html>
  );
}
