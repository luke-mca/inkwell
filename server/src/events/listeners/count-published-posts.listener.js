// server/src/events/listeners/count-published-posts.listener.js

import { EventBus } from "../event-bus.js";

let totalPostsPublished = 0;

EventBus.on("post.published", () => {
  totalPostsPublished += 1;
});

export function getTotalPostsPublished() {
  return totalPostsPublished;
}
