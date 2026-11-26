// client/src/components/__tests__/RegisterForm.test.jsx (new, Lecture 22)

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, test, expect, beforeEach } from "vitest";
import { RegisterForm } from "../RegisterForm";
import { AuthProvider } from "../AuthProvider";

beforeEach(() => {
  localStorage.clear();
  globalThis.fetch = vi.fn();
});

function renderForm() {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<p>Feed page</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText("Display name"), "Ada");
  await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
  await userEvent.type(screen.getByLabelText("Password"), "correcthorse");
  await userEvent.click(screen.getByRole("button", { name: "Register" }));
}

test("registers, signs the user in, and goes to the feed", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      user: { id: "u1", displayName: "Ada" },
      accessToken: "new-token",
      refreshToken: "refresh",
    }),
  });

  renderForm();
  await fillAndSubmit();

  expect(await screen.findByText("Feed page")).toBeInTheDocument();
  expect(localStorage.getItem("inkwell_access_token")).toBe("new-token");
  expect(globalThis.fetch).toHaveBeenCalledWith(
    "/api/auth/register",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({
        email: "ada@example.com",
        displayName: "Ada",
        password: "correcthorse",
      }),
    }),
  );
});

test("shows the server's message when the email is already registered", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: false,
    json: async () => ({
      error: {
        code: "EMAIL_ALREADY_REGISTERED",
        message: "This email is already registered.",
      },
    }),
  });

  renderForm();
  await fillAndSubmit();

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "This email is already registered.",
  );
  expect(localStorage.getItem("inkwell_access_token")).toBeNull();
});
