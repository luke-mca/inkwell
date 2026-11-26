// client/src/components/RegisterForm.jsx (new, Lecture 22)
//
// Same structure as LoginForm: a small state machine, labelled inputs,
// and the server's error message shown in a role="alert" paragraph.
// A successful registration signs the user in straight away, because
// the server's register response already contains an access token.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";

const STATES = { IDLE: "idle", EDITING: "editing", SUBMITTING: "submitting" };

export function RegisterForm() {
  const [status, setStatus] = useState(STATES.IDLE);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleRegister() {
    setStatus(STATES.SUBMITTING);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error.message);
        setStatus(STATES.EDITING);
        return;
      }

      signIn(data);
      navigate("/");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus(STATES.EDITING);
    }
  }

  function onChange(setter) {
    return (e) => {
      setter(e.target.value);
      setStatus(STATES.EDITING);
    };
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create an account</h1>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <div>
          <label
            htmlFor="register-display-name"
            className="block text-sm font-medium text-gray-700"
          >
            Display name
          </label>
          <input
            id="register-display-name"
            value={displayName}
            onChange={onChange(setDisplayName)}
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={onChange(setEmail)}
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={onChange(setPassword)}
            required
            minLength={8}
            aria-describedby="register-password-hint"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
          <p id="register-password-hint" className="mt-1 text-sm text-gray-600">
            At least 8 characters.
          </p>
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === STATES.SUBMITTING}
          className="w-full md:w-auto min-h-[44px] rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {status === STATES.SUBMITTING ? "Creating account…" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
