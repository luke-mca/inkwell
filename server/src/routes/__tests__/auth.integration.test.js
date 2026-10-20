// server/src/routes/__tests__/auth.integration.test.js
//
// Exercise 1: registration and login working together, end to end —
// real Routes, real Services, real Repositories, real (isolated) test
// database, no mocks.

import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { resetDatabase } from "../../test-utils/fixtures.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("a newly registered user can log in with the same credentials (US-01, US-02)", async () => {
  // Arrange: register a real user
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({ email: "alice@example.com", displayName: "Alice", password: "correcthorse" });

  expect(registerRes.status).toBe(201);

  // Act: log in with the credentials just registered
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "alice@example.com", password: "correcthorse" });

  // Assert: login succeeds and resolves to the same stored user
  expect(loginRes.status).toBe(200);
  expect(loginRes.body.accessToken).toEqual(expect.any(String));
  expect(loginRes.body.user.id).toBe(registerRes.body.user.id);
  expect(loginRes.body.user.email).toBe("alice@example.com");
});
