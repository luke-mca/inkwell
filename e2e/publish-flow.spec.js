// e2e/publish-flow.spec.js
//
// Section 4.1's device-diversity principle, and Section 4.2's chosen
// headless-browser testing strategy, applied directly: the same user
// journey is run once per viewport, not just once at an arbitrary
// default size.
//
// Lecture 22: the whole journey now goes through the real UI —
// register, publish, see the post with its author in the feed, log out,
// and log back in. Each viewport makes two auth requests (register,
// login), staying under the server's limit of 5 per 10 minutes per IP
// (Lecture 15's rate limiter).

import { test, expect, devices } from "@playwright/test";

const viewports = [
  { name: "mobile", viewport: devices["iPhone 13"].viewport },
  { name: "desktop", viewport: { width: 1280, height: 800 } },
];

for (const viewport of viewports) {
  test.describe(`publish flow — ${viewport.name}`, () => {
    test.use({ viewport: viewport.viewport });

    test("a new user can register, publish, log out and log back in", async ({
      page,
    }) => {
      // A per-run suffix keeps repeated runs against the same database
      // from colliding on the email or the post title.
      const runId = Date.now();
      const email = `e2e-${viewport.name}-${runId}@example.com`;
      const displayName = `E2E ${viewport.name} ${runId}`;
      const title = `Hello from ${viewport.name} (${runId})`;

      // Register through the UI: this also signs the user in.
      await page.goto("http://localhost:5173/register");
      await page.getByLabel("Display name").fill(displayName);
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("correcthorse");
      await page.getByRole("button", { name: "Register" }).click();

      await expect(page).toHaveURL("http://localhost:5173/");
      await expect(page.getByText(`Signed in as ${displayName}`)).toBeVisible();

      // Publish a post.
      await page.getByRole("link", { name: "Write", exact: true }).click();
      await page.getByLabel("Title").fill(title);
      await page.getByLabel("Body").fill("Published end to end.");
      await page.getByRole("button", { name: "Publish" }).click();

      // Assert the navigation first, so a failed publish cannot pass by
      // matching the title still sitting in the unsubmitted form.
      await expect(page).toHaveURL("http://localhost:5173/");
      const post = page.getByRole("listitem").filter({ hasText: title });
      await expect(post.getByRole("heading", { name: title })).toBeVisible();
      await expect(post.getByText(`By ${displayName}`)).toBeVisible();

      // Log out: the signed-in links disappear.
      await page.getByRole("button", { name: "Log out" }).click();
      await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Write", exact: true })).toHaveCount(0);

      // Log back in with the same account.
      await page.getByRole("link", { name: "Log in" }).click();
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("correcthorse");
      await page.getByRole("button", { name: "Log In" }).click();

      await expect(page).toHaveURL("http://localhost:5173/");
      await expect(page.getByText(`Signed in as ${displayName}`)).toBeVisible();
    });
  });
}
