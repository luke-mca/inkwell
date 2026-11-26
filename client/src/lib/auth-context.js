// client/src/lib/auth-context.js (new, Lecture 22)
//
// The signed-in user, shared by every component that needs it (NavBar,
// LoginForm, RegisterForm, PostEditor). AuthProvider supplies the value;
// useAuth() reads it. Kept apart from AuthProvider.jsx because a .jsx file
// that exports a component should export only components (react-refresh).

import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth() must be used inside <AuthProvider>");
  }
  return auth;
}
