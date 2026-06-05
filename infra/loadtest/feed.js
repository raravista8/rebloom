// k6 load test — read-path capacity of the single box (post-tuning).
// Ramps request-rate to find the req/s ceiling + p95 knee. Read-heavy mix mirrors
// "online browsing" (feed API + geo SSG page + healthcheck). Run:
//   k6 run -e BASE=https://peredarim.ru infra/loadtest/feed.js
import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BASE = __ENV.BASE || 'https://peredarim.ru';
const dFeed = new Trend('d_feed', true);
const dGeo = new Trend('d_geo', true);
const dReady = new Trend('d_ready', true);
const errs = new Rate('errors');

export const options = {
  discardResponseBodies: true, // we measure latency/throughput, not parse bodies
  insecureSkipTLSVerify: true, // for running on the box against https://localhost
  scenarios: {
    ramp: {
      executor: 'ramping-arrival-rate',
      startRate: 50,
      timeUnit: '1s',
      preAllocatedVUs: 200,
      maxVUs: 1500,
      stages: [
        { target: 100, duration: '20s' },
        { target: 300, duration: '30s' },
        { target: 600, duration: '30s' },
        { target: 1000, duration: '30s' },
        { target: 1500, duration: '30s' },
        { target: 1500, duration: '20s' },
      ],
    },
  },
  thresholds: {
    // informational — we read the per-stage numbers, not pass/fail
    http_req_failed: ['rate<0.5'],
  },
};

export default function () {
  const r = Math.random();
  let res;
  if (r < 0.7) {
    res = http.get(`${BASE}/api/feed?city_id=msk&section=fresh&limit=20`, { tags: { ep: 'feed' } });
    dFeed.add(res.timings.duration);
  } else if (r < 0.9) {
    res = http.get(`${BASE}/moskva`, { tags: { ep: 'geo' } });
    dGeo.add(res.timings.duration);
  } else {
    res = http.get(`${BASE}/readyz`, { tags: { ep: 'ready' } });
    dReady.add(res.timings.duration);
  }
  const ok = check(res, { 'status 200': (x) => x.status === 200 });
  errs.add(!ok);
}
