// load-tests/feed.k6.js
//
// A minimal k6 load test against Inkwell's staging environment,
// finally redeeming Lecture 14 §4.7's deferred promise.
//
// The target comes from the BASE_URL environment variable, so the same
// script runs against staging, a local Docker Compose stack, or anything
// else, without editing the file.

import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  vus: 20,           // 20 virtual users...
  duration: "30s",   // ...for 30 seconds — Inkwell's "expected traffic"
                     // assumption for a small course project, not a
                     // stress test looking for the breaking point.
  thresholds: {
    http_req_duration: ["p(95)<500"], // fail the run if P95 latency > 500ms
  },
};

export function setup() {
  // Section 4.5's spin-down caveat, handled directly: wake the free
  // Render instance with one request before the timed run starts, so
  // cold-start latency doesn't pollute the P95 measurement. The long
  // timeout covers Render's roughly one-minute spin-up.
  http.get(`${BASE_URL}/api/health`, { timeout: "120s" });
}

export default function () {
  const res = http.get(`${BASE_URL}/api/posts`);
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1); // think time: a real reader pauses between page loads
}
