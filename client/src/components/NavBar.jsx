// client/src/components/NavBar.jsx
//
// Base (unprefixed) classes target mobile first (Section 4.5).
// md: and lg: prefixes layer on enhancements for larger viewports —
// never the reverse.
//
// Lecture 22: the links depend on who is signed in. Signed out: Feed,
// Log in, Register. Signed in: Feed, Write, the user's name, Log out.

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";

const linkClass = ({ isActive }) =>
  `text-sm ${isActive ? "font-semibold text-indigo-600" : "text-gray-600"}`;

export function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate("/");
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-gray-200">
      <span className="font-bold text-lg">Inkwell</span>
      <div className="flex flex-wrap items-center gap-4">
        <NavLink to="/" className={linkClass}>
          Feed
        </NavLink>
        {user ? (
          <>
            <NavLink to="/write" className={linkClass}>
              Write
            </NavLink>
            <span className="text-sm text-gray-600">
              Signed in as {user.displayName}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-gray-600 underline"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              Log in
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
