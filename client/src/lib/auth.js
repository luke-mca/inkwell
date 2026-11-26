// client/src/lib/auth.js
//
// localStorage helpers for the access token and the signed-in user.
// Components should not call these directly: they use useAuth() from
// auth-context.js, which keeps React state and storage in step.

const TOKEN_KEY = "inkwell_access_token";
const USER_KEY = "inkwell_user";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null; // corrupted value: treat as signed out
  }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}
