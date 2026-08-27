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
    ];
  },
};

export default nextConfig;
