"use client";

// 광고 플랫폼 태그 4종 로더 — 공개 사이트((site) 레이아웃)에서만 렌더된다.
// /admin 은 이 컴포넌트를 거치지 않으므로 태그가 붙지 않는다.
//
// Framer → Next.js 이전(2026-08-27) 때 누락됐던 태그들의 복구다.
// 각 스니펫은 플랫폼 공식 코드를 next/script 로 옮긴 것이며, 초기 페이지뷰는
// 스니펫 자체가, SPA 라우트 전환은 아래 useEffect 가 쏜다.

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  GA4_ID,
  GOOGLE_ADS_ID,
  META_PIXEL_ID,
  NAVER_WCS_ID,
  trackMarketingPageview,
} from "@/lib/marketing";

export function MarketingTags() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 초기 로드의 페이지뷰는 각 스니펫/onLoad 가 이미 보냈다.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackMarketingPageview(pathname);
  }, [pathname]);

  return (
    <>
      {/* GA4 (+ 구글 애즈 전환 태그: ID 가 채워지면 함께 설정) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA4_ID}');
${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}`}
      </Script>

      {/* 메타 픽셀 */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
fbq('track', 'ViewContent', {content_name: location.pathname});`}
      </Script>

      {/* 네이버 검색광고 전환추적(프리미엄 로그분석) — wcslog.js 로드 후에만
          wcs_do 를 부를 수 있어 onLoad 에서 초기화한다. */}
      <Script
        src="https://wcs.naver.net/wcslog.js"
        strategy="afterInteractive"
        onLoad={() => {
          try {
            window.wcs_add = window.wcs_add ?? {};
            window.wcs_add.wa = NAVER_WCS_ID;
            window.wcs_do?.();
          } catch {
            /* noop */
          }
        }}
      />
    </>
  );
}
