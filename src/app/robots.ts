import type { MetadataRoute } from "next";

const SITE_URL = "https://seulnang.co.kr";

// AI 크롤러는 용도별(학습·검색 색인·실시간 fetch)로 나뉜다.
// 검색·AI 인용 유입이 목표이므로 전부 명시적으로 허용한다 (기본 * 허용의 재확인).
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/admin", "/api"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
