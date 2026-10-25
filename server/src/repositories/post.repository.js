// server/src/repositories/post.repository.js — excerpt, updated
//
// Verification fix: this section's snippet shapes a findFeed() function
// that doesn't exist anywhere in this codebase. The real feed-serving
// queries are findPublished() (Lecture 6) and searchPublished()
// (Lecture 9) — the author include + DTO shaping is applied to both of
// those instead.

import { prisma } from "../db/client.js";
import { toPublicUser } from "../dto/user.dto.js";

export const PostRepository = {
  create({ authorId, title, body, status, publishedAt }) {
    return prisma.post.create({
      data: { authorId, title, body, status, publishedAt },
    });
  },

  createWithTags({ authorId, title, body, status, publishedAt, tagNames }) {
    return prisma.post.create({
      data: {
        authorId,
        title,
        body,
        status,
        publishedAt,
        tags: {
          create: tagNames.map((name) => ({
            tag: { connectOrCreate: { where: { name }, create: { name } } },
          })),
        },
      },
      include: { tags: { include: { tag: true } } },
    });
  },

  async findPublished({ page, pageSize }) {
    const rows = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: { author: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize + 1, // fetch one extra row to compute hasMore
    });
    const hasMore = rows.length > pageSize;
    return {
      posts: rows.slice(0, pageSize).map((post) => ({ ...post, author: toPublicUser(post.author) })),
      hasMore,
    };
  },

  async searchPublished({ query, page, pageSize }) {
    const where = {
      status: "PUBLISHED",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { body: { contains: query, mode: "insensitive" } },
      ],
    };
    const rows = await prisma.post.findMany({
      where,
      include: { author: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize + 1,
    });
    const hasMore = rows.length > pageSize;
    return {
      posts: rows.slice(0, pageSize).map((post) => ({ ...post, author: toPublicUser(post.author) })),
      hasMore,
    };
  },
};
