// 유입 채널 분류 — 서버에서만 실행한다(수집 API·문의 기록이 같은 규칙을 쓰도록
// 단일 소스로 유지). 우선순위: UTM/광고 클릭ID > 리퍼러 호스트 > 직접 유입.

export type Attribution = {
  channel: string;
  channelDetail: string | null;
  searchKeyword: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
};

const OWN_HOSTS = new Set(["seulnang.co.kr", "www.seulnang.co.kr", "localhost"]);

// 리퍼러 호스트 → 채널. 앞에서부터 첫 매치를 쓴다(구체적인 패턴이 먼저).
const HOST_RULES: Array<[RegExp, string]> = [
  // 광고 리다이렉트 도메인이 search.naver.com 보다 먼저 와야 한다(뒤 패턴이 이것도 매치함).
  [/(^|\.)ad(cr)?\.(search\.)?naver\.com$/, "naver_ads"],
  [/(^|\.)search\.naver\.com$/, "naver_search"],
  [/(^|\.)blog\.naver\.com$/, "naver_blog"],
  [/(^|\.)cafe\.naver\.com$/, "naver_cafe"],
  [/(^|\.)post\.naver\.com$/, "naver_blog"],
  [/(^|\.)map\.naver\.com$/, "naver_map"],
  [/(^|\.)naver\.com$/, "naver_etc"],
  [/(^|\.)google\.(com|co\.kr|[a-z.]+)$/, "google_search"],
  [/(^|\.)(facebook\.com|fb\.com|messenger\.com)$/, "facebook"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube"],
  [/(^|\.)search\.daum\.net$/, "daum_search"],
  [/(^|\.)daum\.net$/, "daum_search"],
  [/(^|\.)(kakao\.com|kakaocorp\.com)$/, "kakao"],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/, "x"],
  [/(^|\.)bing\.com$/, "bing_search"],
  [/(^|\.)(band\.us)$/, "band"],
];

// 검색어를 실어 보내는 리퍼러의 쿼리 파라미터 이름들.
const KEYWORD_PARAMS = ["query", "q", "keyword", "wd"];

function normalizeUtmSource(source: string): string {
  const s = source.toLowerCase();
  if (s.includes("naver")) return "naver";
  if (s.includes("google")) return "google";
  if (s === "fb" || s.includes("facebook") || s.includes("meta")) return "meta";
  if (s.includes("instagram") || s === "ig") return "instagram";
  if (s.includes("kakao")) return "kakao";
  if (s.includes("youtube")) return "youtube";
  return s.slice(0, 24);
}

function truncate(value: string | null | undefined, max: number): string | null {
  if (!value) return null;
  return value.length > max ? value.slice(0, max) : value;
}

/**
 * @param referrer  세션 시작 시점의 document.referrer (없으면 null)
 * @param landingUrl 세션 시작 시점의 전체 URL (utm 등 쿼리 포함)
 */
export function classifyChannel(
  referrer: string | null,
  landingUrl: string | null,
): Attribution {
  let landing: URL | null = null;
  try {
    landing = landingUrl ? new URL(landingUrl) : null;
  } catch {
    landing = null;
  }
  let ref: URL | null = null;
  try {
    ref = referrer ? new URL(referrer) : null;
  } catch {
    ref = null;
  }

  const params = landing?.searchParams;
  const utmSource = truncate(params?.get("utm_source"), 255);
  const utmMedium = truncate(params?.get("utm_medium"), 255);
  const utmCampaign = truncate(params?.get("utm_campaign"), 255);
  const utmContent = truncate(params?.get("utm_content"), 255);
  const utmTerm = truncate(params?.get("utm_term"), 255);

  const base: Omit<Attribution, "channel" | "channelDetail" | "searchKeyword"> = {
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
  };

  // 리퍼러에서 검색어 추출(네이버는 query 파라미터로 넘어온다).
  let searchKeyword: string | null = null;
  if (ref) {
    for (const key of KEYWORD_PARAMS) {
      const value = ref.searchParams.get(key);
      if (value) {
        searchKeyword = truncate(value, 255);
        break;
      }
    }
  }
  // 네이버 검색광고는 랜딩 URL 에 n_query 로 검색어를 붙인다.
  const nQuery = params?.get("n_query") ?? params?.get("n_keyword");
  if (nQuery) searchKeyword = truncate(nQuery, 255);

  // 1) UTM 이 있으면 최우선 — 광고/캠페인 링크는 리퍼러보다 정확하다.
  if (utmSource) {
    const source = normalizeUtmSource(utmSource);
    const medium = (utmMedium ?? "").toLowerCase();
    const isPaid = /cpc|ppc|paid|display|ad|banner|retarget/.test(medium);
    return {
      ...base,
      channel: isPaid ? `${source}_ads` : `${source}_${medium || "link"}`.slice(0, 32),
      channelDetail: truncate(utmCampaign ?? `${utmSource}/${utmMedium ?? "-"}`, 255),
      searchKeyword: searchKeyword ?? utmTerm,
    };
  }

  // 2) 광고 클릭 ID — UTM 없이 들어오는 광고 유입을 잡는다.
  if (params?.has("gclid") || params?.has("wbraid") || params?.has("gbraid")) {
    return { ...base, channel: "google_ads", channelDetail: "gclid", searchKeyword };
  }
  if (params?.has("fbclid")) {
    // fbclid 는 광고가 아니어도 붙지만, 최소한 페이스북/인스타그램발이라는 뜻.
    const host = ref?.hostname ?? "";
    const channel = host.includes("instagram") ? "instagram" : "facebook";
    return { ...base, channel, channelDetail: "fbclid", searchKeyword };
  }
  if (params?.has("n_media") || params?.has("n_query")) {
    return { ...base, channel: "naver_ads", channelDetail: truncate(params?.get("n_media"), 255), searchKeyword };
  }

  // 3) 리퍼러 호스트
  if (ref && !OWN_HOSTS.has(ref.hostname)) {
    for (const [pattern, channel] of HOST_RULES) {
      if (pattern.test(ref.hostname)) {
        return { ...base, channel, channelDetail: ref.hostname, searchKeyword };
      }
    }
    return { ...base, channel: "referral", channelDetail: ref.hostname, searchKeyword };
  }

  // 4) 리퍼러 없음(주소 직접 입력, 북마크, 대부분의 앱 인링크)
  return { ...base, channel: "direct", channelDetail: null, searchKeyword };
}

// 대시보드 표기용 한글 라벨.
export const CHANNEL_LABELS: Record<string, string> = {
  naver_search: "네이버 검색",
  naver_blog: "네이버 블로그",
  naver_cafe: "네이버 카페",
  naver_map: "네이버 지도",
  naver_ads: "네이버 광고",
  naver_etc: "네이버 기타",
  google_search: "구글 검색",
  google_ads: "구글 광고",
  meta_ads: "메타 광고",
  facebook: "페이스북",
  instagram: "인스타그램",
  instagram_ads: "인스타그램 광고",
  youtube: "유튜브",
  kakao: "카카오",
  kakao_ads: "카카오 광고",
  daum_search: "다음 검색",
  bing_search: "빙 검색",
  band: "네이버 밴드",
  x: "X(트위터)",
  direct: "직접 유입",
  referral: "기타 사이트",
};

export function channelLabel(channel: string | null | undefined): string {
  if (!channel) return "알 수 없음";
  return CHANNEL_LABELS[channel] ?? channel;
}
