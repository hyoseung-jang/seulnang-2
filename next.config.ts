import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        pathname: "/images/**",
      },
    ],
  },
  // 기존 사이트(Framer)와 동일하게 www 는 apex 로 308 리다이렉트한다.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.seulnang.co.kr" }],
        destination: "https://seulnang.co.kr/:path*",
        permanent: true,
      },
      // Framer 시절 네이버 검색광고(cms 키워드 그룹)가 연결하던 랜딩 경로.
      // 새 사이트에는 없어서 404 → 비즈채널 심사 거부의 원인이 됐다.
      // 홈으로 임시(307) 리다이렉트해 살려 둔다 — 나중에 전용 랜딩을 만들면
      // 이 항목을 지우고 실제 페이지로 대체한다.
      { source: "/kcms", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
