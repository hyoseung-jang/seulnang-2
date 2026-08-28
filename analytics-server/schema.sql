-- seulnang_analytics 스키마. 서버 기동 시 매번 실행되므로 전부 멱등이어야 한다.
-- 시간은 전부 KST(DATETIME) — MySQL 서버 타임존을 +09:00 으로 고정하고
-- 브리지 커넥션도 +09:00/dateStrings 로 접속해 왕복 변환이 없다.

CREATE TABLE IF NOT EXISTS visitors (
  id CHAR(36) PRIMARY KEY,
  first_seen_at DATETIME NOT NULL,
  last_seen_at DATETIME NOT NULL,
  -- 최초 유입(first-touch) 귀속. 재방문해도 바뀌지 않는다.
  first_channel VARCHAR(32) NOT NULL DEFAULT 'direct',
  first_channel_detail VARCHAR(255) NULL,
  first_referrer VARCHAR(512) NULL,
  first_landing_path VARCHAR(255) NULL,
  first_utm_source VARCHAR(255) NULL,
  first_utm_medium VARCHAR(255) NULL,
  first_utm_campaign VARCHAR(255) NULL,
  first_utm_content VARCHAR(255) NULL,
  first_utm_term VARCHAR(255) NULL,
  device_type VARCHAR(16) NULL,
  os VARCHAR(32) NULL,
  browser VARCHAR(32) NULL,
  session_count INT NOT NULL DEFAULT 0,
  KEY idx_visitors_first_seen (first_seen_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id CHAR(36) PRIMARY KEY,
  visitor_id CHAR(36) NOT NULL,
  started_at DATETIME NOT NULL,
  last_activity_at DATETIME NOT NULL,
  -- 이번 세션(last-touch) 귀속
  channel VARCHAR(32) NOT NULL DEFAULT 'direct',
  channel_detail VARCHAR(255) NULL,
  search_keyword VARCHAR(255) NULL,
  referrer VARCHAR(512) NULL,
  landing_path VARCHAR(255) NULL,
  exit_path VARCHAR(255) NULL,
  utm_source VARCHAR(255) NULL,
  utm_medium VARCHAR(255) NULL,
  utm_campaign VARCHAR(255) NULL,
  utm_content VARCHAR(255) NULL,
  utm_term VARCHAR(255) NULL,
  device_type VARCHAR(16) NULL,
  os VARCHAR(32) NULL,
  browser VARCHAR(32) NULL,
  ip_hash CHAR(16) NULL,
  pageview_count INT NOT NULL DEFAULT 0,
  event_count INT NOT NULL DEFAULT 0,
  duration_seconds INT NOT NULL DEFAULT 0,
  has_inquiry TINYINT NOT NULL DEFAULT 0,
  visit_number INT NOT NULL DEFAULT 1,
  KEY idx_sessions_started (started_at),
  KEY idx_sessions_visitor (visitor_id, started_at),
  KEY idx_sessions_channel (channel, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pageviews (
  id CHAR(36) PRIMARY KEY,               -- 클라이언트가 생성한 UUID. 체류시간 업데이트가 이 키로 온다.
  session_id CHAR(36) NOT NULL,
  visitor_id CHAR(36) NOT NULL,
  path VARCHAR(255) NOT NULL,
  entered_at DATETIME(3) NOT NULL,
  duration_ms INT NOT NULL DEFAULT 0,    -- 탭이 실제로 보인 시간만 누적(visibility 기준)
  max_scroll_pct TINYINT NOT NULL DEFAULT 0,
  KEY idx_pageviews_session (session_id, entered_at),
  KEY idx_pageviews_path (path, entered_at),
  KEY idx_pageviews_entered (entered_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 페이지 안에서 어떤 섹션을 얼마나 봤는지. (pageview, section) 당 1행으로 GREATEST 갱신.
CREATE TABLE IF NOT EXISTS section_views (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pageview_id CHAR(36) NOT NULL,
  session_id CHAR(36) NOT NULL,
  path VARCHAR(255) NOT NULL,
  section VARCHAR(120) NOT NULL,
  dwell_ms INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_section_views (pageview_id, section),
  KEY idx_section_views_path (path, section),
  KEY idx_section_views_session (session_id),
  KEY idx_section_views_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 클릭 등 개별 행동. name: cta_click / phone_click / kakao_click / outbound_click /
-- form_start / form_submit / form_error ...
CREATE TABLE IF NOT EXISTS events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id CHAR(36) NULL,
  visitor_id CHAR(36) NULL,
  path VARCHAR(255) NULL,
  name VARCHAR(64) NOT NULL,
  label VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL,
  KEY idx_events_name (name, created_at),
  KEY idx_events_session (session_id),
  KEY idx_events_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 문의(전환). 세션 행이 없어도(추적 차단 등) 문의 자체와 쿠키로 넘어온 귀속 정보는 남긴다.
CREATE TABLE IF NOT EXISTS inquiries (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  created_at DATETIME NOT NULL,
  store VARCHAR(255) NOT NULL,
  region VARCHAR(255) NULL,
  phone VARCHAR(64) NULL,
  message TEXT NULL,
  self_source VARCHAR(64) NULL,          -- 폼의 "알게된 경로"(자기보고)
  visitor_id CHAR(36) NULL,
  session_id CHAR(36) NULL,
  channel VARCHAR(32) NULL,              -- 측정된 last-touch 채널
  channel_detail VARCHAR(255) NULL,
  search_keyword VARCHAR(255) NULL,
  referrer VARCHAR(512) NULL,
  landing_path VARCHAR(255) NULL,
  utm_source VARCHAR(255) NULL,
  utm_medium VARCHAR(255) NULL,
  utm_campaign VARCHAR(255) NULL,
  utm_content VARCHAR(255) NULL,
  utm_term VARCHAR(255) NULL,
  first_channel VARCHAR(32) NULL,        -- 이 방문자의 최초 유입 채널(first-touch)
  device_type VARCHAR(16) NULL,
  visit_number INT NULL,                 -- 몇 번째 방문에서 문의했는지
  mail_sent TINYINT NOT NULL DEFAULT 0,
  status VARCHAR(16) NOT NULL DEFAULT 'new',  -- new / contacted / converted / closed
  note TEXT NULL,
  KEY idx_inquiries_created (created_at),
  KEY idx_inquiries_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
