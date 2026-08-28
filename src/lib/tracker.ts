// 자체 방문 추적기 (first-party). instrumentation-client.ts 에서 초기화된다.
//
// 설계 원칙:
//  - 외부 스크립트 없이 앱 번들에 포함 — 광고 차단기의 서드파티 차단을 피한다.
//  - 수집은 같은 도메인 /api/e 로 sendBeacon — 페이지 이탈 순간에도 유실이 적다.
//  - 시간 측정은 "탭이 실제로 보인 시간"만 누적한다(visibilitychange 기준).
//  - 같은 pageview 에 대한 갱신(pl)은 서버에서 GREATEST 업서트로 처리되므로
//    숨김→복귀→이탈처럼 여러 번 보내도 안전하다.
//
// 쿠키:
//  - sl_vid  방문자 ID(2년)          - sl_sid  세션 ID(30분 슬라이딩)
//  - sl_vn   누적 방문(세션) 횟수     - sl_attr 세션 귀속 스냅샷(문의 기록용)

const VISITOR_COOKIE = "sl_vid";
const SESSION_COOKIE = "sl_sid";
const VISIT_COUNT_COOKIE = "sl_vn";
const ATTR_COOKIE = "sl_attr";
const SESSION_MAX_AGE = 30 * 60; // 30분
const VISITOR_MAX_AGE = 2 * 365 * 24 * 60 * 60; // 2년

type OutgoingEvent = Record<string, unknown> & { t: "ss" | "pv" | "pl" | "ev" };

type SectionTimer = { accMs: number; since: number | null };

type CurrentPageview = {
  id: string;
  path: string;
  since: number | null; // 탭이 보이기 시작한 시각(숨김 상태면 null)
  accMs: number;
  maxScroll: number;
  sections: Map<string, SectionTimer>;
  formStarted: boolean;
};

let visitorId = "";
let sessionId = "";
let current: CurrentPageview | null = null;
let queue: OutgoingEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let observer: IntersectionObserver | null = null;
let sectionScanTimer: ReturnType<typeof setTimeout> | null = null;

function uuid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
}

function isTrackedPath(path: string): boolean {
  return !path.startsWith("/admin");
}

function normalizePath(url: string): string {
  try {
    return new URL(url, location.origin).pathname;
  } catch {
    return location.pathname;
  }
}

// ---------- 전송 ----------

function send(events: OutgoingEvent[]) {
  if (events.length === 0) return;
  // 활동이 있을 때마다 세션 쿠키 수명을 밀어 준다(30분 슬라이딩).
  setCookie(SESSION_COOKIE, sessionId, SESSION_MAX_AGE);
  setCookie(ATTR_COOKIE, getCookie(ATTR_COOKIE) ?? "", SESSION_MAX_AGE);
  const body = JSON.stringify({ v: visitorId, s: sessionId, e: events });
  try {
    if (navigator.sendBeacon?.("/api/e", new Blob([body], { type: "text/plain" }))) {
      return;
    }
  } catch {
    // sendBeacon 실패 시 fetch 로 폴백
  }
  fetch("/api/e", { method: "POST", body, keepalive: true }).catch(() => {});
}

function flush() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  const events = queue;
  queue = [];
  send(events);
}

function enqueue(event: OutgoingEvent, immediate = false) {
  queue.push(event);
  if (immediate) {
    flush();
    return;
  }
  if (!flushTimer) {
    flushTimer = setTimeout(flush, 1500);
  }
}

// ---------- 세션 ----------

function ensureIds() {
  const existingVisitor = getCookie(VISITOR_COOKIE);
  visitorId = existingVisitor ?? uuid();
  setCookie(VISITOR_COOKIE, visitorId, VISITOR_MAX_AGE);

  const existingSession = getCookie(SESSION_COOKIE);
  if (existingSession) {
    sessionId = existingSession;
    return;
  }

  // 새 세션 — 방문 횟수를 올리고, 유입 정보를 서버로 보낸다.
  sessionId = uuid();
  const visitNumber = (parseInt(getCookie(VISIT_COUNT_COOKIE) ?? "0", 10) || 0) + 1;
  setCookie(VISIT_COUNT_COOKIE, String(visitNumber), VISITOR_MAX_AGE);
  setCookie(SESSION_COOKIE, sessionId, SESSION_MAX_AGE);

  // 문의(서버 액션)가 추적 API 와 무관하게 귀속 정보를 읽을 수 있도록
  // 원본(리퍼러·랜딩 URL)을 쿠키에도 남긴다. 채널 분류는 서버가 한다.
  const attr = {
    r: document.referrer.slice(0, 300),
    l: (location.pathname + location.search).slice(0, 300),
    n: visitNumber,
  };
  setCookie(ATTR_COOKIE, JSON.stringify(attr), SESSION_MAX_AGE);

  enqueue({ t: "ss", ref: document.referrer.slice(0, 512), url: location.href.slice(0, 1024), vn: visitNumber });
}

// ---------- 섹션 관심도 ----------

function sectionName(el: Element, index: number): string {
  const explicit = (el as HTMLElement).dataset?.trackSection;
  if (explicit) return explicit.slice(0, 120);
  const heading = el.querySelector("h1, h2, h3");
  const text = heading?.textContent?.replace(/\s+/g, " ").trim();
  return (text ? text.slice(0, 60) : `섹션 ${index + 1}`).slice(0, 120);
}

function accumulateSection(timer: SectionTimer, now: number) {
  if (timer.since !== null) {
    timer.accMs += now - timer.since;
    timer.since = null;
  }
}

function observeSections() {
  observer?.disconnect();
  observer = null;
  const page = current;
  if (!page || typeof IntersectionObserver === "undefined") return;

  const sections = Array.from(document.querySelectorAll("main section, section"));
  if (sections.length === 0) return;
  const names = new Map<Element, string>();
  sections.slice(0, 20).forEach((el, i) => names.set(el, sectionName(el, i)));

  observer = new IntersectionObserver(
    (entries) => {
      const now = Date.now();
      for (const entry of entries) {
        const name = names.get(entry.target);
        if (!name) continue;
        let timer = page.sections.get(name);
        if (!timer) {
          timer = { accMs: 0, since: null };
          page.sections.set(name, timer);
        }
        if (entry.isIntersecting && document.visibilityState === "visible") {
          timer.since = now;
        } else {
          accumulateSection(timer, now);
        }
      }
    },
    // 화면의 절반 이상 차지하거나, 섹션의 40% 이상이 보일 때 "보고 있다"고 판단
    { threshold: [0.4] },
  );
  for (const el of names.keys()) observer.observe(el);
}

// ---------- 페이지뷰 ----------

function buildLeaveEvent(page: CurrentPageview): OutgoingEvent {
  updateScroll(); // 마지막 스크롤 위치까지 반영
  const now = Date.now();
  if (page.since !== null) {
    page.accMs += now - page.since;
    page.since = document.visibilityState === "visible" ? now : null;
  }
  const sec: Array<{ n: string; ms: number }> = [];
  for (const [name, timer] of page.sections) {
    accumulateSection(timer, now);
    if (document.visibilityState === "visible") timer.since = null;
    if (timer.accMs >= 500) sec.push({ n: name, ms: Math.round(timer.accMs) });
  }
  return {
    t: "pl",
    id: page.id,
    path: page.path,
    dur: Math.round(page.accMs),
    sc: Math.round(page.maxScroll),
    sec: sec.slice(0, 20),
  };
}

function updateScroll() {
  if (!current) return;
  const doc = document.documentElement;
  const total = doc.scrollHeight;
  if (total <= 0) return;
  const seen = Math.min(total, window.scrollY + window.innerHeight);
  current.maxScroll = Math.max(current.maxScroll, (seen / total) * 100);
}

function startPageview(path: string) {
  if (!isTrackedPath(path)) {
    current = null;
    observer?.disconnect();
    return;
  }
  current = {
    id: uuid(),
    path,
    since: document.visibilityState === "visible" ? Date.now() : null,
    accMs: 0,
    maxScroll: 0,
    sections: new Map(),
    formStarted: false,
  };
  enqueue({ t: "pv", id: current.id, path }, true);
  updateScroll();
  // 라우팅 직후에는 새 페이지 DOM 이 아직 없다. 렌더가 끝난 뒤 섹션을 잡는다.
  if (sectionScanTimer) clearTimeout(sectionScanTimer);
  sectionScanTimer = setTimeout(observeSections, 600);
}

function closePageview(immediate: boolean) {
  if (!current) return;
  enqueue(buildLeaveEvent(current), immediate);
}

// ---------- 클릭/폼 ----------

function classifyClick(target: unknown): { name: string; label: string } | null {
  if (!(target instanceof Element)) return null;
  const el = target.closest("a, button");
  if (!el) return null;
  const href = el.getAttribute("href") ?? "";
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
  const explicit = (el as HTMLElement).dataset?.track;
  if (explicit) return { name: explicit.slice(0, 64), label: text };
  if (href.startsWith("tel:")) return { name: "phone_click", label: href.slice(4) };
  if (href.startsWith("mailto:")) return { name: "email_click", label: text };
  if (href.includes("pf.kakao.com")) return { name: "kakao_click", label: text };
  if (href.startsWith("/contact") || href === "/contact") {
    return { name: "contact_cta_click", label: text };
  }
  if (/^https?:\/\//.test(href)) {
    try {
      const url = new URL(href);
      if (url.host !== location.host) {
        return { name: "outbound_click", label: url.host + url.pathname.slice(0, 100) };
      }
    } catch {
      return null;
    }
  }
  return null;
}

// ---------- 초기화 ----------

export function initTracker() {
  if (typeof window === "undefined") return;
  try {
    if (!isTrackedPath(location.pathname)) return;
    ensureIds();
    startPageview(location.pathname);

    document.addEventListener(
      "visibilitychange",
      () => {
        const page = current;
        if (!page) return;
        const now = Date.now();
        if (document.visibilityState === "hidden") {
          // 모바일에서는 pagehide 보다 이 시점이 사실상 마지막 기회다.
          if (page.since !== null) {
            page.accMs += now - page.since;
            page.since = null;
          }
          for (const timer of page.sections.values()) accumulateSection(timer, now);
          closePageview(true);
        } else {
          page.since = now;
          // 다시 보이면 화면에 있는 섹션의 타이머는 IntersectionObserver 가
          // 재통지하지 않으므로 여기서 직접 다시 켜지 않는다 — 오차는 스크롤로
          // 곧 재통지되며, 과대 계측보다는 과소 계측을 택한다.
        }
      },
      { passive: true },
    );

    window.addEventListener("pagehide", () => closePageview(true), { passive: true });
    window.addEventListener(
      "pageshow",
      (event) => {
        // bfcache 복원 — 같은 pageview 를 이어서 계측한다(서버는 GREATEST 업서트).
        if (event.persisted && current) {
          current.since = document.visibilityState === "visible" ? Date.now() : null;
        }
      },
      { passive: true },
    );

    // rAF 는 탭이 백그라운드로 가면 멈추므로 시간 기반으로 스로틀한다.
    let lastScrollMeasure = 0;
    window.addEventListener(
      "scroll",
      () => {
        const now = Date.now();
        if (now - lastScrollMeasure < 250) return;
        lastScrollMeasure = now;
        updateScroll();
      },
      { passive: true },
    );

    document.addEventListener(
      "click",
      (event) => {
        if (!current) return;
        const click = classifyClick(event.target);
        if (click) {
          enqueue({ t: "ev", n: click.name, l: click.label, path: current.path });
        }
      },
      { capture: true, passive: true },
    );

    document.addEventListener(
      "focusin",
      (event) => {
        const page = current;
        if (!page || page.formStarted) return;
        const target = event.target;
        if (target instanceof Element && target.closest("form")) {
          page.formStarted = true;
          enqueue({ t: "ev", n: "form_start", l: null, path: page.path });
        }
      },
      { passive: true },
    );

    document.addEventListener("submit", () => {
      if (!current) return;
      enqueue({ t: "ev", n: "form_submit", l: null, path: current.path }, true);
    });
  } catch (error) {
    // 추적 실패가 사이트를 깨면 안 된다.
    console.error("[tracker]", error);
  }
}

/** App Router 네비게이션 시작 시 호출 (instrumentation-client 의 onRouterTransitionStart). */
export function trackNavigation(url: string) {
  try {
    const nextPath = normalizePath(url);
    if (current && nextPath === current.path) return; // 해시 이동 등
    closePageview(true);
    ensureIds(); // 30분 넘게 머물다 이동하면 새 세션이 된다
    startPageview(nextPath);
  } catch (error) {
    console.error("[tracker]", error);
  }
}
