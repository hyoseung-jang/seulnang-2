// 방문 이벤트 수집 엔드포인트. 클라이언트 추적기(src/lib/tracker.ts)가
// sendBeacon 으로 쏜다. 같은 도메인(/api/e)이라 광고 차단기에 잘 걸리지 않고,
// 여기서 IP·UA 를 붙여 ota-server 브리지로 넘긴다.
//
// 응답은 항상 204 — 추적 실패가 사용자 경험이나 콘솔에 드러날 이유가 없다.

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { analyticsEnabled, batch, type SqlQuery } from "@/lib/analytics/bridge";
import { classifyChannel } from "@/lib/analytics/channel";
import { isBot, parseUa } from "@/lib/analytics/ua";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type IncomingEvent = {
  t: "ss" | "pv" | "pl" | "ev";
  // ss
  ref?: string;
  url?: string;
  vn?: number;
  // pv / pl
  id?: string;
  path?: string;
  dur?: number;
  sc?: number;
  sec?: Array<{ n?: string; ms?: number }>;
  // ev
  n?: string;
  l?: string;
};

function str(value: unknown, max: number): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  return value.slice(0, max);
}

function int(value: unknown, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.round(n), max);
}

// 세션 활동 갱신 — 모든 이벤트 종류가 공유한다.
function touchSession(sessionId: string, exitPath?: string | null): SqlQuery {
  return {
    sql: `UPDATE sessions
          SET last_activity_at = NOW(),
              duration_seconds = TIMESTAMPDIFF(SECOND, started_at, NOW())
              ${exitPath ? ", exit_path = ?" : ""}
          WHERE id = ?`,
    params: exitPath ? [exitPath, sessionId] : [sessionId],
  };
}

export async function POST(request: NextRequest) {
  const done = new Response(null, { status: 204 });
  if (!analyticsEnabled) return done;

  const ua = request.headers.get("user-agent");
  if (isBot(ua)) return done;

  let payload: { v?: unknown; s?: unknown; e?: unknown };
  try {
    payload = JSON.parse(await request.text());
  } catch {
    return done;
  }

  const visitorId = typeof payload.v === "string" ? payload.v.toLowerCase() : "";
  const sessionId = typeof payload.s === "string" ? payload.s.toLowerCase() : "";
  const events = Array.isArray(payload.e) ? (payload.e as IncomingEvent[]).slice(0, 25) : [];
  if (!UUID_RE.test(visitorId) || !UUID_RE.test(sessionId) || events.length === 0) {
    return done;
  }

  const { deviceType, os, browser } = parseUa(ua ?? "");
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const ipHash = ip
    ? createHash("sha256")
        .update(`${process.env.ANALYTICS_IP_SALT ?? "seulnang"}:${ip}`)
        .digest("hex")
        .slice(0, 16)
    : null;

  const queries: SqlQuery[] = [];

  for (const event of events) {
    if (event.t === "ss") {
      const referrer = str(event.ref, 512);
      const landingUrl = str(event.url, 1024);
      let landingPath: string | null = null;
      try {
        landingPath = landingUrl ? new URL(landingUrl).pathname.slice(0, 255) : null;
      } catch {
        landingPath = null;
      }
      const attribution = classifyChannel(referrer, landingUrl);
      const visitNumber = int(event.vn, 100_000) || 1;

      queries.push({
        sql: `INSERT INTO visitors
                (id, first_seen_at, last_seen_at, first_channel, first_channel_detail,
                 first_referrer, first_landing_path, first_utm_source, first_utm_medium,
                 first_utm_campaign, first_utm_content, first_utm_term,
                 device_type, os, browser, session_count)
              VALUES (?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
              ON DUPLICATE KEY UPDATE
                last_seen_at = NOW(),
                session_count = session_count + 1`,
        params: [
          visitorId,
          attribution.channel,
          attribution.channelDetail,
          referrer,
          landingPath,
          attribution.utmSource,
          attribution.utmMedium,
          attribution.utmCampaign,
          attribution.utmContent,
          attribution.utmTerm,
          deviceType,
          os,
          browser,
        ],
      });
      queries.push({
        sql: `INSERT INTO sessions
                (id, visitor_id, started_at, last_activity_at, channel, channel_detail,
                 search_keyword, referrer, landing_path, utm_source, utm_medium,
                 utm_campaign, utm_content, utm_term, device_type, os, browser,
                 ip_hash, visit_number)
              VALUES (?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE last_activity_at = NOW()`,
        params: [
          sessionId,
          visitorId,
          attribution.channel,
          attribution.channelDetail,
          attribution.searchKeyword,
          referrer,
          landingPath,
          attribution.utmSource,
          attribution.utmMedium,
          attribution.utmCampaign,
          attribution.utmContent,
          attribution.utmTerm,
          deviceType,
          os,
          browser,
          ipHash,
          visitNumber,
        ],
      });
      continue;
    }

    if (event.t === "pv") {
      const pageviewId = typeof event.id === "string" ? event.id.toLowerCase() : "";
      const path = str(event.path, 255);
      if (!UUID_RE.test(pageviewId) || !path) continue;
      queries.push({
        sql: `INSERT IGNORE INTO pageviews (id, session_id, visitor_id, path, entered_at)
              VALUES (?, ?, ?, ?, NOW(3))`,
        params: [pageviewId, sessionId, visitorId, path],
      });
      queries.push({
        sql: `UPDATE sessions SET pageview_count = pageview_count + 1 WHERE id = ?`,
        params: [sessionId],
      });
      queries.push(touchSession(sessionId, path));
      continue;
    }

    if (event.t === "pl") {
      const pageviewId = typeof event.id === "string" ? event.id.toLowerCase() : "";
      const path = str(event.path, 255);
      if (!UUID_RE.test(pageviewId)) continue;
      // 같은 pageview 에 pl 이 여러 번 올 수 있다(탭 숨김 → 복귀 → 이탈).
      // GREATEST 로 누적값만 남긴다.
      queries.push({
        sql: `UPDATE pageviews
              SET duration_ms = GREATEST(duration_ms, ?),
                  max_scroll_pct = GREATEST(max_scroll_pct, ?)
              WHERE id = ? AND session_id = ?`,
        params: [int(event.dur, 7_200_000), int(event.sc, 100), pageviewId, sessionId],
      });
      const sections = Array.isArray(event.sec) ? event.sec.slice(0, 20) : [];
      for (const section of sections) {
        const name = str(section?.n, 120);
        const ms = int(section?.ms, 7_200_000);
        if (!name || ms < 500) continue;
        queries.push({
          sql: `INSERT INTO section_views
                  (pageview_id, session_id, path, section, dwell_ms, created_at)
                VALUES (?, ?, ?, ?, ?, NOW()) AS incoming
                ON DUPLICATE KEY UPDATE
                  dwell_ms = GREATEST(section_views.dwell_ms, incoming.dwell_ms)`,
          params: [pageviewId, sessionId, path ?? "", name, ms],
        });
      }
      queries.push(touchSession(sessionId, path));
      continue;
    }

    if (event.t === "ev") {
      const name = str(event.n, 64);
      if (!name) continue;
      queries.push({
        sql: `INSERT INTO events (session_id, visitor_id, path, name, label, created_at)
              VALUES (?, ?, ?, ?, ?, NOW(3))`,
        params: [sessionId, visitorId, str(event.path, 255), name, str(event.l, 255)],
      });
      queries.push({
        sql: `UPDATE sessions SET event_count = event_count + 1 WHERE id = ?`,
        params: [sessionId],
      });
      queries.push(touchSession(sessionId));
    }
  }

  if (queries.length === 0) return done;

  try {
    await batch(queries);
  } catch (error) {
    console.error("[analytics] 수집 실패:", (error as Error).message);
  }
  return done;
}
