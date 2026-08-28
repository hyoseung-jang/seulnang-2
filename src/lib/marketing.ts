// 서드파티 마케팅 태그(광고 플랫폼용) ID 와 전환 헬퍼.
//
// 이 태그들은 "광고 플랫폼의 학습/리타게팅/전환 보고"를 위한 것이다.
// 우리 자체 분석(/api/e → ota-server)과는 별개로 동작하며 서로 영향이 없다.
// ID 들은 Framer 시절 사이트에서 쓰던 값 그대로다(2026-08-27 이전 쿠키에서 확인).

export const GA4_ID = "G-6W8XFQYFFJ";
export const META_PIXEL_ID = "1741723013728749";
// 네이버 검색광고 프리미엄 로그분석(전환추적) 공통 스크립트 ID
export const NAVER_WCS_ID = "s_1d43ce56f7ab";

// 구글 애즈 전환 태그 — 아직 ID/라벨을 모른다(애즈 콘솔 > 목표 > 전환에서 확인).
// 값을 채우면 아래 코드가 자동으로 활성화된다. 비어 있는 동안에는 GA4 의
// generate_lead 이벤트를 애즈에서 "GA4 가져오기"로 전환으로 쓰면 된다.
export const GOOGLE_ADS_ID = ""; // 예: "AW-123456789"
export const GOOGLE_ADS_LEAD_LABEL = ""; // 예: "AbC-DEf12GhIJkLmNO"

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    fbq?: Fbq;
    wcs?: { cnv: (type: string, value: string) => unknown };
    wcs_add?: Record<string, string>;
    wcs_do?: (nasa?: Record<string, unknown>) => void;
  }
}

/** SPA 라우트 전환 시 각 플랫폼에 페이지뷰를 알린다.
 *  GA4 는 향상된 측정(히스토리 변경)이 자동 수집하므로 여기서 다시 쏘지 않는다. */
export function trackMarketingPageview(path: string) {
  try {
    window.fbq?.("track", "PageView");
    // 메타 광고가 "웹사이트 콘텐츠 조회" 최적화로 돌고 있어 ViewContent 도 쏜다.
    window.fbq?.("track", "ViewContent", { content_name: path });
  } catch {
    /* 태그 실패가 사이트를 깨면 안 된다 */
  }
  try {
    window.wcs_do?.();
  } catch {
    /* noop */
  }
}

/** 문의 접수 성공(전환) — 각 광고 플랫폼에 전환 신호를 보낸다. */
export function fireLeadConversion() {
  try {
    window.fbq?.("track", "Lead");
  } catch {
    /* noop */
  }
  try {
    window.gtag?.("event", "generate_lead", { currency: "KRW", value: 1 });
    if (GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL) {
      window.gtag?.("event", "conversion", {
        send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
      });
    }
  } catch {
    /* noop */
  }
  try {
    if (window.wcs && window.wcs_do) {
      // 네이버 전환 유형 4 = 신청/예약, 전환가치 1
      window.wcs_do({ cnv: window.wcs.cnv("4", "1") });
    }
  } catch {
    /* noop */
  }
}
