/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @rebloom/canon ships untranspiled ESM (JSX/modern syntax) — Next must transpile it.
  transpilePackages: ['@rebloom/canon'],
  // Proxy API + media to the backend in dev so the browser hits a same-origin path
  // (cookies stay first-party). In prod, Caddy serves /api and /media; this rewrite
  // only fires for `next dev`.
  async rewrites() {
    // canon marketing/feed components use plain <img src="img/<unsplash-id>.jpg"> (and
    // "img/av/<id>.jpg" avatars) — relative paths that resolve to /img/… and, on the
    // blog article route, /blog/img/…. Proxy them to the Unsplash CDN so the SEO/teaser
    // pages render real photos. Avatars (w1…w6) have no public source → one neutral
    // portrait. These fire in dev AND prod (low-traffic public pages).
    const UNS = 'https://images.unsplash.com';
    const imageRewrites = [
      { source: '/img/av/:id.jpg', destination: `${UNS}/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=70&auto=format` },
      { source: '/blog/img/:id.jpg', destination: `${UNS}/photo-:id?w=1200&q=70&auto=format&fit=crop` },
      // canon 0.8.1 auth now points its login-aside photo at `img/hero-lacybird.png` and
      // the T-ID mark at `img/oauth/tid.svg` — both shipped as web/public/img assets, so
      // they resolve natively (the old 1561181286→hero rewrite is gone; that Unsplash id
      // is again a real content photo via the generic rule below).
      { source: '/img/:id.jpg', destination: `${UNS}/photo-:id?w=900&q=70&auto=format&fit=crop` },
    ];
    // API/media proxy: dev only (Caddy serves these in prod).
    const api = process.env.API_PROXY_TARGET;
    const apiRewrites = api
      ? [
          { source: '/api/:path*', destination: `${api}/api/:path*` },
          { source: '/media/:path*', destination: `${api}/media/:path*` },
        ]
      : [];
    return [...apiRewrites, ...imageRewrites];
  },
};

export default nextConfig;
