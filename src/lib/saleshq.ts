// 영업 HQ(sales-hq) 즉시 등록 — 문의가 접수되는 그 순간 서버 액션에서 직접 밀어 넣는다.
// 30분 폴링(sales-hq syncWeb)은 안전망일 뿐이고, 이 호출이 실패해도 문의 메일·분석 DB 기록은 영향받지 않는다.
// 인증은 분석 브리지와 같은 토큰(ANALYTICS_BRIDGE_TOKEN) — sales-hq 가 같은 토큰을 받는다.
// 서버 코드 전용(토큰) — 클라이언트에서 import 금지.

const SALESHQ_INBOUND_URL =
  process.env.SALESHQ_INBOUND_URL ?? "https://api-ota.rosegoldsoftware.co.kr/saleshq/api/v1/inbound/inquiry";
const TOKEN = process.env.SALESHQ_INBOUND_TOKEN ?? process.env.ANALYTICS_BRIDGE_TOKEN;

export type SalesHqInquiry = {
  id?: number | null;
  store: string;
  region: string;
  phone: string;
  message: string;
  selfSource: string;
  channel: string | null;
  channelDetail: string | null;
  searchKeyword: string | null;
  referrer: string | null;
  landingPath: string | null;
  utm: { source: string | null; medium: string | null; campaign: string | null; content: string | null; term: string | null };
  device: string | null;
  visitNumber: number | null;
  createdAt: string;
};

/** 접수 즉시 sales-hq 에 등록. 성공 여부만 돌려주고 절대 던지지 않는다. */
export async function notifySalesHq(inquiry: SalesHqInquiry): Promise<boolean> {
  if (!TOKEN) return false;
  try {
    const res = await fetch(SALESHQ_INBOUND_URL, {
      method: "POST",
      headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
      body: JSON.stringify({ source: "web", ...inquiry }),
      cache: "no-store",
      signal: AbortSignal.timeout(6_000),
    });
    if (!res.ok) console.error("[inquiry] sales-hq 즉시 등록 실패", res.status);
    return res.ok;
  } catch (error) {
    console.error("[inquiry] sales-hq 즉시 등록 오류", error);
    return false;
  }
}
