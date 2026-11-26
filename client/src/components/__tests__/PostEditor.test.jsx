// client/src/components/__tests__/PostEditor.test.jsx
//
// A component integration test: renders PostEditor for real, simulates
// real user interaction, and mocks only the network boundary (fetch) —
// everything else (React state, event handlers, rendering) is real.
//
// Lecture 22: PostEditor now reads the signed-in user from AuthProvider,
// so the test renders it inside one, with a user already signed in.

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, test, expect, beforeEach } from "vitest";
import { PostEditor } from "../PostEditor";
import { AuthProvider } from "../AuthProvider";
import { saveToken, saveUser } from "../../lib/auth";

beforeEach(() => {
  localStorage.clear();
  saveToken("test-token");
  saveUser({ id: "u1", displayName: "Ada" });
  globalThis.fetch = vi.fn();
});

function renderEditor() {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/write"]}>
        <Routes>
          <Route path="/write" element={<PostEditor />} />
          <Route path="/login" element={<p>Login page</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

test("shows an error message anchored to the form when publish fails", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => ({ error: { message: "Title is required." } }),
  });

  renderEditor();

  await userEvent.type(screen.getByLabelText(/body/i), "Some content");
  await userEvent.click(screen.getByRole("button", { name: /publish/i }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Title is required.",
  );
});

test("signs the user out and goes to the login page when the token has expired", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: false,
    status: 401,
    json: async () => ({ error: { code: "UNAUTHENTICATED" } }),
  });

  renderEditor();

  await userEvent.type(screen.getByLabelText(/title/i), "Hello");
  await userEvent.type(screen.getByLabelText(/body/i), "World");
  await userEvent.click(screen.getByRole("button", { name: /publish/i }));

  expect(await screen.findByText("Login page")).toBeInTheDocument();
  expect(localStorage.getItem("inkwell_access_token")).toBeNull();
});
