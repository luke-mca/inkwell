// client/src/components/NavBar.jsx
//
// Base (unprefixed) classes target mobile first (Section 4.5).
// md: and lg: prefixes layer on enhancements for larger viewports —
// never the reverse.

import { NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      {/* Exercise 1: the same smiley mark as public/favicon.svg, inlined here
          so the wordmark and the browser tab show one identical icon. */}
      <span className="flex items-center gap-2 font-bold text-lg">
        <svg viewBox="0 0 32 32" className="h-6 w-6" role="img" aria-label="Inkwell logo">
          <circle cx="16" cy="16" r="15" fill="#4f46e5" />
          <circle cx="11" cy="13" r="2.25" fill="#fff" />
          <circle cx="21" cy="13" r="2.25" fill="#fff" />
          <path d="M10 19 Q16 25 22 19" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        Inkwell
      </span>
      <div className="flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm ${isActive ? "font-semibold text-indigo-600" : "text-gray-600"}`
          }
        >
          Feed
        </NavLink>
        <NavLink
          to="/write"
          className={({ isActive }) =>
            `text-sm ${isActive ? "font-semibold text-indigo-600" : "text-gray-600"}`
          }
        >
          Write
        </NavLink>
      </div>
    </nav>
  );
}
