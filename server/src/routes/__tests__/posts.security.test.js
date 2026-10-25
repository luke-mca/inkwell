// server/src/routes/__tests__/posts.security.test.js
//
// Lecture 15, Exercise 1: the GET /api/posts Denial of Service mitigation,
// verified end to end. A security test checks what the system must NOT
// do — here, hand back more than MAX_PAGE_SIZE rows no matter what
// pageSize the client asks for.

import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { createTestUser, resetDatabase } from "../../test-utils/fixtures.js";
import { MAX_PAGE_SIZE } from "../../services/post.service.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function seedPublishedPosts(count) {
  const author = await createTestUser();
  await prisma.post.createMany({
    data: Array.from({ length: count }, (_, i) => ({
      authorId: author.id,
      title: `Post ${i}`,
      body: `Body ${i}`,
      status: "PUBLISHED",
      publishedAt: new Date(),
    })),
  });
}

test("an oversized pageSize is clamped to MAX_PAGE_SIZE on the feed", async () => {
  await seedPublishedPosts(MAX_PAGE_SIZE + 5);

  const res = await request(app).get("/api/posts?page=1&pageSize=1000000");

  expect(res.status).toBe(200);
  expect(res.body.posts).toHaveLength(MAX_PAGE_SIZE);
  expect(res.body.hasMore).toBe(true);
});

test("an oversized pageSize is clamped to MAX_PAGE_SIZE on search", async () => {
  await seedPublishedPosts(MAX_PAGE_SIZE + 5);

  const res = await request(app).get("/api/posts?search=Post&pageSize=1000000");

  expect(res.status).toBe(200);
  expect(res.body.posts).toHaveLength(MAX_PAGE_SIZE);
  expect(res.body.hasMore).toBe(true);
});

test("feed responses never expose the author's email (DTO regression guard)", async () => {
  await seedPublishedPosts(1);

  const res = await request(app).get("/api/posts?page=1");

  expect(res.body.posts[0].author).not.toHaveProperty("email");
  expect(res.body.posts[0].author).not.toHaveProperty("passwordHash");
});
