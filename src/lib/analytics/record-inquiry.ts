// 문의(전환) 기록. submit-inquiry 서버 액션에서 호출된다.
//
// 귀속 정보는 추적기가 심어 둔 쿠키에서 읽는다:
//  - sl_vid/sl_sid: 방문자·세션 ID (세션 테이블과 조인 가능)
//  - sl_attr: 세션 시작 시점의 리퍼러·랜딩 URL 스냅샷.
//    /api/e 가 차단된 환경에서도 문의 자체의 귀속은 이 쿠키만으로 복원된다.

import { cookies, headers } from "next/headers";
import { analyticsEnabled, batch, type SqlQuery } from "@/lib/analytics/bridge";
import { classifyChannel } from "@/lib/analytics/channel";
import { parseUa } from "@/lib/analytics/ua";
import { notifySalesHq } from "@/lib/saleshq";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type InquiryRecord = {
  store: string;
  region: string;
  phone: string;
  message: string;
  selfSource: string;
  mailSent: boolean;
};

/**
 * 문의 기록 + 영업 HQ 즉시 등록. 분석 브리지가 꺼져 있어도 sales-hq 등록은 시도한다(문의는 무조건 영업에 닿아야 한다).
 * 돌려주는 값: 분석 DB inquiries.id (기록 실패면 null).
 */
export async function recordInquiry(input: InquiryRecord): Promise<number | null> {
  const createdAt = new Date().toISOString();
  if (!analyticsEnabled) {
    await notifySalesHq({
      store: input.store, region: input.region, phone: input.phone, message: input.message, selfSource: input.selfSource,
      channel: null, channelDetail: null, searchKeyword: null, referrer: null, landingPath: null,
      utm: { source: null, medium: null, campaign: null, content: null, term: null }, device: null, visitNumber: null, createdAt,
    });
    return null;
  }

  const cookieStore = await cookies();
  const headerStore = await headers();

  const rawVid = cookieStore.get("sl_vid")?.value ?? "";
  const rawSid = cookieStore.get("sl_sid")?.value ?? "";
  const visitorId = UUID_RE.test(rawVid) ? rawVid.toLowerCase() : null;
  const sessionId = UUID_RE.test(rawSid) ? rawSid.toLowerCase() : null;

  let referrer: string | null = null;
  let landing: string | null = null;
  let visitNumber: number | null = null;
  try {
    const raw = cookieStore.get("sl_attr")?.value ?? "";
    const decoded = raw.includes("%") ? decodeURIComponent(raw) : raw;
    const attr = JSON.parse(decoded) as { r?: string; l?: string; n?: number };
    referrer = attr.r || null;
    landing = attr.l || null;
    visitNumber = Number.isFinite(attr.n) ? Number(attr.n) : null;
  } catch {
    // 쿠키가 없거나 깨져 있어도 문의 기록은 계속한다.
  }

  const attribution = classifyChannel(
    referrer,
    landing ? `https://seulnang.co.kr${landing}` : null,
  );
  const landingPath = landing ? landing.split("?")[0].slice(0, 255) : null;
  const { deviceType } = parseUa(headerStore.get("user-agent") ?? "");

  const queries: SqlQuery[] = [
    {
      sql: `INSERT INTO inquiries
              (created_at, store, region, phone, message, self_source,
               visitor_id, session_id, channel, channel_detail, search_keyword,
               referrer, landing_path, utm_source, utm_medium, utm_campaign,
               utm_content, utm_term, first_channel, device_type, visit_number,
               mail_sent, status)
            VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    (SELECT first_channel FROM visitors WHERE id = ?),
                    ?, ?, ?, 'new')`,
      params: [
        input.store.slice(0, 255),
        input.region.slice(0, 255) || null,
        input.phone.slice(0, 64) || null,
        input.message.slice(0, 5000) || null,
        input.selfSource.slice(0, 64) || null,
        visitorId,
        sessionId,
        attribution.channel,
        attribution.channelDetail,
        attribution.searchKeyword,
        referrer?.slice(0, 512) ?? null,
        landingPath,
        attribution.utmSource,
        attribution.utmMedium,
        attribution.utmCampaign,
        attribution.utmContent,
        attribution.utmTerm,
        visitorId,
        deviceType,
        visitNumber,
        input.mailSent ? 1 : 0,
      ],
    },
  ];
  if (sessionId) {
    queries.push({
      sql: `UPDATE sessions SET has_inquiry = 1, last_activity_at = NOW() WHERE id = ?`,
      params: [sessionId],
    });
  }

  let inquiryId: number | null = null;
  try {
    const results = await batch(queries);
    const head = results[0] as { insertId?: number } | undefined;
    inquiryId = typeof head?.insertId === "number" && head.insertId > 0 ? head.insertId : null;
  } catch (error) {
    console.error("[inquiry] 분석 DB 기록 실패 — sales-hq 즉시 등록은 계속한다", error);
  }

  // 영업 HQ 즉시 등록 — 분석 DB 의 같은 id 를 멱등 키로 넘겨 폴링과 중복되지 않게 한다
  await notifySalesHq({
    id: inquiryId,
    store: input.store, region: input.region, phone: input.phone, message: input.message, selfSource: input.selfSource,
    channel: attribution.channel, channelDetail: attribution.channelDetail, searchKeyword: attribution.searchKeyword,
    referrer: referrer?.slice(0, 512) ?? null, landingPath,
    utm: { source: attribution.utmSource, medium: attribution.utmMedium, campaign: attribution.utmCampaign, content: attribution.utmContent, term: attribution.utmTerm },
    device: deviceType, visitNumber, createdAt,
  });
  return inquiryId;
}
