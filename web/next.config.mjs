/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @rebloom/canon ships untranspiled ESM (JSX/modern syntax) — Next must transpile it.
  transpilePackages: ['@rebloom/canon'],
  // Proxy API + media to the backend in dev so the browser hits a same-origin path
  // (cookies stay first-party). In prod, Caddy serves /api and /media; this rewrite
  // only fires for `next dev`.
  async rewrites() {
    const api = process.env.API_PROXY_TARGET;
    if (!api) return [];
    return [
      { source: '/api/:path*', destination: `${api}/api/:path*` },
      { source: '/media/:path*', destination: `${api}/media/:path*` },
    ];
  },
};

export default nextConfig;
