// client/src/components/AuthProvider.jsx (new, Lecture 22)
//
// Holds the signed-in user in React state, so the NavBar updates the
// moment someone registers, logs in or logs out, and mirrors it in
// localStorage (lib/auth.js) so a page refresh keeps them signed in.

import { useState } from "react";
import { AuthContext } from "../lib/auth-context";
import {
  getToken,
  getUser,
  saveToken,
  saveUser,
  clearToken,
  clearUser,
} from "../lib/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? getUser() : null));

  function signIn({ accessToken, user }) {
    saveToken(accessToken);
    saveUser(user);
    setUser(user);
  }

  function signOut() {
    clearToken();
    clearUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
