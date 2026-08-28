import type { MetadataRoute } from "next";

const SITE_URL = "https://seulnang.co.kr";

// 새 페이지를 만들면 여기에 추가하는 것까지가 출시다.
const ROUTES = ["/", "/muin", "/kiosk", "/pms", "/aboutus", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
