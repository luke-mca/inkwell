// client/src/App.jsx
//
// Defines Inkwell's information architecture (Section 5.1) as routes.
// This file's only job is routing + layout — no business logic here,
// the same "thin top layer" discipline we applied to server/src/index.js
// in Lecture 5.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { useAuth } from "./lib/auth-context";
import { NavBar } from "./components/NavBar";
import { Feed } from "./components/Feed";
import { PostEditor } from "./components/PostEditor";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

// Lecture 22: only a signed-in user can open the editor.
function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <main className="w-full px-4 py-6 md:max-w-2xl md:mx-auto md:px-6 md:py-8">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route
              path="/write"
              element={
                <RequireAuth>
                  <PostEditor />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
