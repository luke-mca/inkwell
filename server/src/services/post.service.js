// server/src/services/post.service.js

import { PostRepository } from "../repositories/post.repository.js";
import { assertNonEmpty } from "../utils/validation.js";
import { SubstringSearchStrategy } from "./search/substring-search.strategy.js";
import { EventBus } from "../events/event-bus.js";

const searchStrategy = SubstringSearchStrategy; // swap this line to change search behavior system-wide

// Lecture 15, Exercise 1: STRIDE Denial of Service mitigation for
// GET /api/posts. Without a ceiling, ?pageSize=1000000 asks the database
// to load (and the server to serialize) the entire posts table in one
// request. Oversized values are clamped rather than rejected so existing
// clients that ask for "a lot" still get a valid page.
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export function clampPageSize(pageSize) {
  const n = Number(pageSize);
  if (!Number.isInteger(n) || n < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(n, MAX_PAGE_SIZE);
}

export const PostService = {
  async publish({ authorId, title, body, tagNames = [] }) {
    assertNonEmpty(title, "title", "MISSING_TITLE");
    assertNonEmpty(body, "body", "MISSING_BODY");

    const post = await PostRepository.createWithTags({
      authorId,
      title,
      body,
      tagNames,
      status: "PUBLISHED",
      publishedAt: new Date(),
    });

    EventBus.emit("post.published", {
      postId: post.id,
      authorId,
      title: post.title,
      tags: tagNames,
    });

    return post;
  },

  async listPublished({ page = 1, pageSize = DEFAULT_PAGE_SIZE }) {
    const { posts, hasMore } = await PostRepository.findPublished({
      page,
      pageSize: clampPageSize(pageSize),
    });
    return { posts, page, hasMore };
  },

  async search({ query, page = 1, pageSize = DEFAULT_PAGE_SIZE }) {
    return searchStrategy.search(query, { page, pageSize: clampPageSize(pageSize) });
  },
};
