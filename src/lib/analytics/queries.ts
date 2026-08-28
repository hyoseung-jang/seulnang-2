// 관리자 대시보드 조회 쿼리 모음. 전부 서버 컴포넌트에서만 호출한다.
// mysql2 dateStrings 설정으로 날짜는 KST 문자열, 집계값은 문자열로 올 수 있어
// Number() 로 강제 변환해 돌려준다.

import { q } from "@/lib/analytics/bridge";

// GA4 와 같은 기준의 "참여 세션": 10초 이상 머물렀거나, 2페이지 이상 봤거나,
// 문의를 남긴 세션. 이탈(bounce) = 참여하지 않은 세션.
const BOUNCE_EXPR =
  "(pageview_count <= 1 AND duration_seconds < 10 AND has_inquiry = 0)";

function since(days: number): string {
  const n = Math.max(1, Math.min(365, Math.floor(days)));
  return `CURDATE() - INTERVAL ${n - 1} DAY`;
}

const num = (value: unknown): number => Number(value) || 0;

// ---------- 개요 ----------

export type Overview = {
  sessions: number;
  visitors: number;
  newVisitors: number;
  pageviews: number;
  inquiries: number;
  mailFailed: number;
  avgDurationSec: number;
  bounceRate: number; // 0~100
  conversionRate: number; // 0~100, 문의 수 / 세션 수
};

export async function getOverview(days: number): Promise<Overview> {
  const [sessionRows, inquiryRows, newVisitorRows] = await Promise.all([
    q<Record<string, unknown>>(
      `SELECT COUNT(*) AS sessions,
              COUNT(DISTINCT visitor_id) AS visitors,
              COALESCE(SUM(pageview_count), 0) AS pageviews,
              COALESCE(SUM(${BOUNCE_EXPR}), 0) AS bounces,
              COALESCE(ROUND(AVG(duration_seconds)), 0) AS avg_duration
       FROM sessions WHERE started_at >= ${since(days)}`,
    ),
    q<Record<string, unknown>>(
      `SELECT COUNT(*) AS n, COALESCE(SUM(mail_sent = 0), 0) AS mail_failed
       FROM inquiries WHERE created_at >= ${since(days)}`,
    ),
    q<Record<string, unknown>>(
      `SELECT COUNT(*) AS n FROM visitors WHERE first_seen_at >= ${since(days)}`,
    ),
  ]);
  const s = sessionRows[0] ?? {};
  const i = inquiryRows[0] ?? {};
  const sessions = num(s.sessions);
  return {
    sessions,
    visitors: num(s.visitors),
    newVisitors: num(newVisitorRows[0]?.n),
    pageviews: num(s.pageviews),
    inquiries: num(i.n),
    mailFailed: num(i.mail_failed),
    avgDurationSec: num(s.avg_duration),
    bounceRate: sessions ? Math.round((num(s.bounces) / sessions) * 100) : 0,
    conversionRate: sessions
      ? Math.round((num(i.n) / sessions) * 1000) / 10
      : 0,
  };
}

// ---------- 일별 추이 ----------

export type DailyPoint = {
  date: string; // YYYY-MM-DD
  sessions: number;
  visitors: number;
  inquiries: number;
};

export async function getDailySeries(days: number): Promise<DailyPoint[]> {
  const [sessionRows, inquiryRows] = await Promise.all([
    q<Record<string, unknown>>(
      `SELECT DATE(started_at) AS d, COUNT(*) AS sessions,
              COUNT(DISTINCT visitor_id) AS visitors
       FROM sessions WHERE started_at >= ${since(days)}
       GROUP BY DATE(started_at)`,
    ),
    q<Record<string, unknown>>(
      `SELECT DATE(created_at) AS d, COUNT(*) AS n
       FROM inquiries WHERE created_at >= ${since(days)}
       GROUP BY DATE(created_at)`,
    ),
  ]);
  const byDate = new Map<string, DailyPoint>();
  // KST 기준으로 빈 날짜를 채운다.
  const formatter = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" });
  for (let offset = days - 1; offset >= 0; offset--) {
    const date = formatter.format(Date.now() - offset * 86_400_000);
    byDate.set(date, { date, sessions: 0, visitors: 0, inquiries: 0 });
  }
  for (const row of sessionRows) {
    const point = byDate.get(String(row.d));
    if (point) {
      point.sessions = num(row.sessions);
      point.visitors = num(row.visitors);
    }
  }
  for (const row of inquiryRows) {
    const point = byDate.get(String(row.d));
    if (point) point.inquiries = num(row.n);
  }
  return Array.from(byDate.values());
}

// ---------- 채널 ----------

export type ChannelStat = {
  channel: string;
  sessions: number;
  visitors: number;
  bounceRate: number;
  avgDurationSec: number;
  avgPageviews: number;
  inquiries: number;
  conversionRate: number;
};

export async function getChannelStats(days: number): Promise<ChannelStat[]> {
  const rows = await q<Record<string, unknown>>(
    `SELECT channel,
            COUNT(*) AS sessions,
            COUNT(DISTINCT visitor_id) AS visitors,
            COALESCE(SUM(${BOUNCE_EXPR}), 0) AS bounces,
            COALESCE(ROUND(AVG(duration_seconds)), 0) AS avg_duration,
            COALESCE(ROUND(AVG(pageview_count), 1), 0) AS avg_pv,
            COALESCE(SUM(has_inquiry), 0) AS inquiries
     FROM sessions WHERE started_at >= ${since(days)}
     GROUP BY channel ORDER BY sessions DESC`,
  );
  return rows.map((row) => {
    const sessions = num(row.sessions);
    return {
      channel: String(row.channel),
      sessions,
      visitors: num(row.visitors),
      bounceRate: sessions ? Math.round((num(row.bounces) / sessions) * 100) : 0,
      avgDurationSec: num(row.avg_duration),
      avgPageviews: num(row.avg_pv),
      inquiries: num(row.inquiries),
      conversionRate: sessions
        ? Math.round((num(row.inquiries) / sessions) * 1000) / 10
        : 0,
    };
  });
}

export type KeywordStat = { keyword: string; channel: string; sessions: number; inquiries: number };

export async function getTopKeywords(days: number): Promise<KeywordStat[]> {
  const rows = await q<Record<string, unknown>>(
    `SELECT search_keyword, channel, COUNT(*) AS sessions,
            COALESCE(SUM(has_inquiry), 0) AS inquiries
     FROM sessions
     WHERE started_at >= ${since(days)} AND search_keyword IS NOT NULL
     GROUP BY search_keyword, channel ORDER BY sessions DESC LIMIT 30`,
  );
  return rows.map((row) => ({
    keyword: String(row.search_keyword),
    channel: String(row.channel),
    sessions: num(row.sessions),
    inquiries: num(row.inquiries),
  }));
}

export type DetailStat = { detail: string; channel: string; sessions: number; inquiries: number };

export async function getReferrerDetails(days: number): Promise<DetailStat[]> {
  const rows = await q<Record<string, unknown>>(
    `SELECT channel_detail, channel, COUNT(*) AS sessions,
            COALESCE(SUM(has_inquiry), 0) AS inquiries
     FROM sessions
     WHERE started_at >= ${since(days)} AND channel_detail IS NOT NULL
     GROUP BY channel_detail, channel ORDER BY sessions DESC LIMIT 30`,
  );
  return rows.map((row) => ({
    detail: String(row.channel_detail),
    channel: String(row.channel),
    sessions: num(row.sessions),
    inquiries: num(row.inquiries),
  }));
}

export type CampaignStat = {
  campaign: string;
  source: string;
  medium: string;
  sessions: number;
  inquiries: number;
};

export async function getUtmCampaigns(days: number): Promise<CampaignStat[]> {
  const rows = await q<Record<string, unknown>>(
    `SELECT COALESCE(utm_campaign, '(캠페인 없음)') AS campaign,
            COALESCE(utm_source, '-') AS source,
            COALESCE(utm_medium, '-') AS medium,
            COUNT(*) AS sessions,
            COALESCE(SUM(has_inquiry), 0) AS inquiries
     FROM sessions
     WHERE started_at >= ${since(days)} AND utm_source IS NOT NULL
     GROUP BY campaign, source, medium ORDER BY sessions DESC LIMIT 30`,
  );
  return rows.map((row) => ({
    campaign: String(row.campaign),
    source: String(row.source),
    medium: String(row.medium),
    sessions: num(row.sessions),
    inquiries: num(row.inquiries),
  }));
}

// ---------- 기기 ----------

export type DeviceStat = { deviceType: string; sessions: number; inquiries: number };

export async function getDeviceStats(days: number): Promise<DeviceStat[]> {
  const rows = await q<Record<string, unknown>>(
    `SELECT COALESCE(device_type, '기타') AS device_type, COUNT(*) AS sessions,
            COALESCE(SUM(has_inquiry), 0) AS inquiries
     FROM sessions WHERE started_at >= ${since(days)}
     GROUP BY device_type ORDER BY sessions DESC`,
  );
  return rows.map((row) => ({
    deviceType: String(row.device_type),
    sessions: num(row.sessions),
    inquiries: num(row.inquiries),
  }));
}

// ---------- 페이지 ----------

export type PageStat = {
  path: string;
  views: number;
  sessions: number;
  avgSec: number;
  avgScroll: number;
  entries: number; // 랜딩(입구) 횟수
  exits: number; // 마지막 페이지였던 횟수
  exitRate: number;
};

export async function getPageStats(days: number): Promise<PageStat[]> {
  const [viewRows, entryRows, exitRows] = await Promise.all([
    q<Record<string, unknown>>(
      `SELECT path, COUNT(*) AS views, COUNT(DISTINCT session_id) AS sessions,
              COALESCE(ROUND(AVG(duration_ms) / 1000, 1), 0) AS avg_sec,
              COALESCE(ROUND(AVG(max_scroll_pct)), 0) AS avg_scroll
       FROM pageviews WHERE entered_at >= ${since(days)}
       GROUP BY path ORDER BY views DESC LIMIT 50`,
    ),
    q<Record<string, unknown>>(
      `SELECT landing_path AS path, COUNT(*) AS n FROM sessions
       WHERE started_at >= ${since(days)} AND landing_path IS NOT NULL
       GROUP BY landing_path`,
    ),
    q<Record<string, unknown>>(
      `SELECT exit_path AS path, COUNT(*) AS n FROM sessions
       WHERE started_at >= ${since(days)} AND exit_path IS NOT NULL
       GROUP BY exit_path`,
    ),
  ]);
  const entries = new Map(entryRows.map((r) => [String(r.path), num(r.n)]));
  const exits = new Map(exitRows.map((r) => [String(r.path), num(r.n)]));
  return viewRows.map((row) => {
    const path = String(row.path);
    const views = num(row.views);
    const exitCount = exits.get(path) ?? 0;
    return {
      path,
      views,
      sessions: num(row.sessions),
      avgSec: num(row.avg_sec),
      avgScroll: num(row.avg_scroll),
      entries: entries.get(path) ?? 0,
      exits: exitCount,
      exitRate: views ? Math.round((exitCount / views) * 100) : 0,
    };
  });
}

export type SectionStat = {
  path: string;
  section: string;
  views: number;
  avgSec: number;
  totalSec: number;
};

export async function getSectionStats(days: number): Promise<SectionStat[]> {
  const rows = await q<Record<string, unknown>>(
    `SELECT path, section, COUNT(*) AS views,
            COALESCE(ROUND(AVG(dwell_ms) / 1000, 1), 0) AS avg_sec,
            COALESCE(ROUND(SUM(dwell_ms) / 1000), 0) AS total_sec
     FROM section_views WHERE created_at >= ${since(days)}
     GROUP BY path, section ORDER BY total_sec DESC LIMIT 40`,
  );
  return rows.map((row) => ({
    path: String(row.path),
    section: String(row.section),
    views: num(row.views),
    avgSec: num(row.avg_sec),
    totalSec: num(row.total_sec),
  }));
}

export type EventStat = { name: string; count: number; sessions: number };

export async function getEventStats(days: number): Promise<EventStat[]> {
  const rows = await q<Record<string, unknown>>(
    `SELECT name, COUNT(*) AS n, COUNT(DISTINCT session_id) AS sessions
     FROM events WHERE created_at >= ${since(days)}
     GROUP BY name ORDER BY n DESC LIMIT 20`,
  );
  return rows.map((row) => ({
    name: String(row.name),
    count: num(row.n),
    sessions: num(row.sessions),
  }));
}

// ---------- 문의 ----------

export type InquiryRow = {
  id: number;
  createdAt: string;
  store: string;
  region: string | null;
  phone: string | null;
  message: string | null;
  selfSource: string | null;
  channel: string | null;
  channelDetail: string | null;
  searchKeyword: string | null;
  firstChannel: string | null;
  landingPath: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
  deviceType: string | null;
  visitNumber: number | null;
  mailSent: boolean;
  status: string;
  note: string | null;
  visitorId: string | null;
  sessionId: string | null;
};

function mapInquiry(row: Record<string, unknown>): InquiryRow {
  return {
    id: num(row.id),
    createdAt: String(row.created_at),
    store: String(row.store),
    region: (row.region as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    message: (row.message as string | null) ?? null,
    selfSource: (row.self_source as string | null) ?? null,
    channel: (row.channel as string | null) ?? null,
    channelDetail: (row.channel_detail as string | null) ?? null,
    searchKeyword: (row.search_keyword as string | null) ?? null,
    firstChannel: (row.first_channel as string | null) ?? null,
    landingPath: (row.landing_path as string | null) ?? null,
    utmSource: (row.utm_source as string | null) ?? null,
    utmMedium: (row.utm_medium as string | null) ?? null,
    utmCampaign: (row.utm_campaign as string | null) ?? null,
    utmContent: (row.utm_content as string | null) ?? null,
    utmTerm: (row.utm_term as string | null) ?? null,
    referrer: (row.referrer as string | null) ?? null,
    deviceType: (row.device_type as string | null) ?? null,
    visitNumber: row.visit_number === null ? null : num(row.visit_number),
    mailSent: num(row.mail_sent) === 1,
    status: String(row.status ?? "new"),
    note: (row.note as string | null) ?? null,
    visitorId: (row.visitor_id as string | null) ?? null,
    sessionId: (row.session_id as string | null) ?? null,
  };
}

export async function getInquiries(status?: string): Promise<InquiryRow[]> {
  const rows = status
    ? await q<Record<string, unknown>>(
        `SELECT * FROM inquiries WHERE status = ? ORDER BY created_at DESC, id DESC LIMIT 200`,
        [status],
      )
    : await q<Record<string, unknown>>(
        `SELECT * FROM inquiries ORDER BY created_at DESC, id DESC LIMIT 200`,
      );
  return rows.map(mapInquiry);
}

export async function getInquiry(id: number): Promise<InquiryRow | null> {
  const rows = await q<Record<string, unknown>>(
    `SELECT * FROM inquiries WHERE id = ?`,
    [id],
  );
  return rows.length ? mapInquiry(rows[0]) : null;
}

// ---------- 문의 여정(방문자 타임라인) ----------

export type JourneySession = {
  id: string;
  startedAt: string;
  channel: string;
  channelDetail: string | null;
  searchKeyword: string | null;
  landingPath: string | null;
  durationSeconds: number;
  pageviewCount: number;
  deviceType: string | null;
  visitNumber: number;
  hasInquiry: boolean;
};

export type JourneyPageview = {
  sessionId: string;
  path: string;
  enteredAt: string;
  durationMs: number;
  maxScrollPct: number;
};

export type JourneyEvent = {
  sessionId: string;
  path: string | null;
  name: string;
  label: string | null;
  createdAt: string;
};

export type JourneySection = { path: string; section: string; dwellMs: number };

export type VisitorJourney = {
  sessions: JourneySession[];
  pageviews: JourneyPageview[];
  events: JourneyEvent[];
  topSections: JourneySection[];
};

export async function getVisitorJourney(visitorId: string): Promise<VisitorJourney> {
  const [sessionRows, pageviewRows, eventRows, sectionRows] = await Promise.all([
    q<Record<string, unknown>>(
      `SELECT * FROM sessions WHERE visitor_id = ? ORDER BY started_at ASC LIMIT 50`,
      [visitorId],
    ),
    q<Record<string, unknown>>(
      `SELECT session_id, path, entered_at, duration_ms, max_scroll_pct
       FROM pageviews WHERE visitor_id = ? ORDER BY entered_at ASC LIMIT 300`,
      [visitorId],
    ),
    q<Record<string, unknown>>(
      `SELECT session_id, path, name, label, created_at
       FROM events WHERE visitor_id = ? ORDER BY created_at ASC LIMIT 300`,
      [visitorId],
    ),
    q<Record<string, unknown>>(
      `SELECT sv.path, sv.section, SUM(sv.dwell_ms) AS dwell_ms
       FROM section_views sv JOIN sessions s ON sv.session_id = s.id
       WHERE s.visitor_id = ?
       GROUP BY sv.path, sv.section ORDER BY dwell_ms DESC LIMIT 15`,
      [visitorId],
    ),
  ]);
  return {
    sessions: sessionRows.map((row) => ({
      id: String(row.id),
      startedAt: String(row.started_at),
      channel: String(row.channel),
      channelDetail: (row.channel_detail as string | null) ?? null,
      searchKeyword: (row.search_keyword as string | null) ?? null,
      landingPath: (row.landing_path as string | null) ?? null,
      durationSeconds: num(row.duration_seconds),
      pageviewCount: num(row.pageview_count),
      deviceType: (row.device_type as string | null) ?? null,
      visitNumber: num(row.visit_number),
      hasInquiry: num(row.has_inquiry) === 1,
    })),
    pageviews: pageviewRows.map((row) => ({
      sessionId: String(row.session_id),
      path: String(row.path),
      enteredAt: String(row.entered_at),
      durationMs: num(row.duration_ms),
      maxScrollPct: num(row.max_scroll_pct),
    })),
    events: eventRows.map((row) => ({
      sessionId: String(row.session_id),
      path: (row.path as string | null) ?? null,
      name: String(row.name),
      label: (row.label as string | null) ?? null,
      createdAt: String(row.created_at),
    })),
    topSections: sectionRows.map((row) => ({
      path: String(row.path),
      section: String(row.section),
      dwellMs: num(row.dwell_ms),
    })),
  };
}

// ---------- 최근 세션 ----------

export type RecentSession = {
  id: string;
  startedAt: string;
  channel: string;
  searchKeyword: string | null;
  landingPath: string | null;
  exitPath: string | null;
  pageviewCount: number;
  durationSeconds: number;
  deviceType: string | null;
  visitNumber: number;
  hasInquiry: boolean;
};

export async function getRecentSessions(limit = 20): Promise<RecentSession[]> {
  const rows = await q<Record<string, unknown>>(
    `SELECT id, started_at, channel, search_keyword, landing_path, exit_path,
            pageview_count, duration_seconds, device_type, visit_number, has_inquiry
     FROM sessions ORDER BY started_at DESC LIMIT ${Math.min(100, limit)}`,
  );
  return rows.map((row) => ({
    id: String(row.id),
    startedAt: String(row.started_at),
    channel: String(row.channel),
    searchKeyword: (row.search_keyword as string | null) ?? null,
    landingPath: (row.landing_path as string | null) ?? null,
    exitPath: (row.exit_path as string | null) ?? null,
    pageviewCount: num(row.pageview_count),
    durationSeconds: num(row.duration_seconds),
    deviceType: (row.device_type as string | null) ?? null,
    visitNumber: num(row.visit_number),
    hasInquiry: num(row.has_inquiry) === 1,
  }));
}
