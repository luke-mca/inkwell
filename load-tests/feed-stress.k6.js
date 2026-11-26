// load-tests/feed-stress.k6.js
//
// Same target as Section 4.5's load test, but Section 4.5's fixed 20
// virtual users is replaced with a ramp that climbs well past
// Inkwell's expected traffic (Lecture 14 §4.7's "beyond expected
// capacity, to find the breaking point").

import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "30s", target: 20 },   // ramp to Section 4.5's baseline
    { duration: "30s", target: 100 },  // push well past expected traffic
    { duration: "30s", target: 300 },  // keep climbing until something breaks
    { duration: "30s", target: 0 },    // ramp back down
  ],
};

export default function () {
  const res = http.get(`${BASE_URL}/api/posts`);
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1); // think time: a real reader pauses between page loads
}
