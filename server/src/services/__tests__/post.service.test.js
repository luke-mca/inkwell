// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

const mockPostRepository = { createWithTags: jest.fn() };
const mockEventBus = { emit: jest.fn() };
const mockSearchStrategy = { search: jest.fn() };

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
  PostRepository: mockPostRepository,
}));
jest.unstable_mockModule("../../events/event-bus.js", () => ({
  EventBus: mockEventBus,
}));
jest.unstable_mockModule("../search/substring-search.strategy.js", () => ({
  SubstringSearchStrategy: mockSearchStrategy,
}));

const { PostService } = await import("../post.service.js");

test("publish() creates a PUBLISHED post and emits post.published", async () => {
  mockPostRepository.createWithTags.mockResolvedValue({ id: "p1", title: "Hello", status: "PUBLISHED" });

  const post = await PostService.publish({ authorId: "u1", title: "Hello", body: "World" });

  expect(post.status).toBe("PUBLISHED");
  expect(mockEventBus.emit).toHaveBeenCalledWith(
    "post.published",
    expect.objectContaining({ postId: "p1" })
  );
});

test("publish() rejects an empty title", async () => {
  await expect(
    PostService.publish({ authorId: "u1", title: "", body: "World" })
  ).rejects.toThrow();
});

describe("PostService.search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns the strategy's results for a valid query (row A)", async () => {
    const results = { posts: [{ id: "p1", title: "Hello" }], hasMore: false };
    mockSearchStrategy.search.mockResolvedValue(results);

    const result = await PostService.search({ query: "hello" });

    expect(result).toEqual(results);
  });

  test("returns an empty result, not an error, when nothing matches (row B)", async () => {
    mockSearchStrategy.search.mockResolvedValue({ posts: [], hasMore: false });

    const result = await PostService.search({ query: "zzz" });

    expect(result.posts).toEqual([]);
    expect(result.hasMore).toBe(false);
  });

  test("defaults to page 1 and pageSize 10 when only a query is given (row C, white-box)", async () => {
    mockSearchStrategy.search.mockResolvedValue({ posts: [], hasMore: false });

    await PostService.search({ query: "hello" });

    expect(mockSearchStrategy.search).toHaveBeenCalledWith("hello", { page: 1, pageSize: 10 });
  });

  test("passes explicit pagination through to the strategy (row D)", async () => {
    mockSearchStrategy.search.mockResolvedValue({ posts: [], hasMore: false });

    await PostService.search({ query: "hello", page: 2, pageSize: 5 });

    expect(mockSearchStrategy.search).toHaveBeenCalledWith("hello", { page: 2, pageSize: 5 });
  });
});
