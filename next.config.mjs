/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Forwarded-For",
            value: "$remote_addr",
          },
        ],
      },
    ];
  }
};

export default nextConfig;
