// User-Agent 최소 파싱. 라이브러리 없이 영업 분석에 필요한 수준만 뽑는다:
// 기기 구분(모바일/데스크톱), OS, 브라우저(국내 인앱 브라우저 포함).

export type UaInfo = {
  deviceType: "mobile" | "tablet" | "desktop";
  os: string;
  browser: string;
};

const BOT_PATTERN =
  /bot|crawl|spider|slurp|headless|lighthouse|preview|scrap|monitor|curl|wget|python-requests|yeti|petal|semrush|ahrefs|mj12|facebookexternalhit|vercel/i;

export function isBot(ua: string | null): boolean {
  if (!ua) return true;
  return BOT_PATTERN.test(ua);
}

export function parseUa(ua: string): UaInfo {
  const deviceType: UaInfo["deviceType"] = /ipad|tablet/i.test(ua)
    ? "tablet"
    : /mobi|android|iphone/i.test(ua)
      ? "mobile"
      : "desktop";

  let os = "기타";
  if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/mac os x|macintosh/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  // 인앱 브라우저를 먼저 본다 — Chrome/Safari 토큰을 같이 달고 다니기 때문.
  let browser = "기타";
  if (/KAKAOTALK/i.test(ua)) browser = "카카오톡 인앱";
  else if (/NAVER\(inapp/i.test(ua) || /\bNAVER\b/.test(ua)) browser = "네이버앱 인앱";
  else if (/Instagram/i.test(ua)) browser = "인스타그램 인앱";
  else if (/FBAN|FBAV|FB_IAB/i.test(ua)) browser = "페이스북 인앱";
  else if (/Whale/i.test(ua)) browser = "웨일";
  else if (/SamsungBrowser/i.test(ua)) browser = "삼성 인터넷";
  else if (/Edg(e|A|iOS)?\//i.test(ua)) browser = "엣지";
  else if (/OPR|Opera/i.test(ua)) browser = "오페라";
  else if (/Firefox|FxiOS/i.test(ua)) browser = "파이어폭스";
  else if (/CriOS|Chrome/i.test(ua)) browser = "크롬";
  else if (/Safari/i.test(ua)) browser = "사파리";

  return { deviceType, os, browser };
}
