// client/src/components/__tests__/NavBar.test.jsx (new, Lecture 22)

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { test, expect, beforeEach } from "vitest";
import { NavBar } from "../NavBar";
import { AuthProvider } from "../AuthProvider";
import { saveToken, saveUser } from "../../lib/auth";

beforeEach(() => {
  localStorage.clear();
});

function renderNavBar() {
  render(
    <AuthProvider>
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    </AuthProvider>,
  );
}

test("signed out: offers Log in and Register, not Write", () => {
  renderNavBar();

  expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Write" })).toBeNull();
});

test("signed in: shows the user's name, and Log out signs them out", async () => {
  saveToken("test-token");
  saveUser({ id: "u1", displayName: "Ada" });
  renderNavBar();

  expect(screen.getByText("Signed in as Ada")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Write" })).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Log out" }));

  expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
  expect(localStorage.getItem("inkwell_access_token")).toBeNull();
});
