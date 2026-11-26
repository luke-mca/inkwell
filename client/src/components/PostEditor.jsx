// client/src/components/PostEditor.jsx — full, updated

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth";
import { useAuth } from "../lib/auth-context";

const STATES = { IDLE: "idle", EDITING: "editing", PUBLISHING: "publishing" };

export function PostEditor() {
  const [status, setStatus] = useState(STATES.IDLE);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handlePublish() {
    setStatus(STATES.PUBLISHING);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        // No authorId: since Lecture 15 the server takes the author from
        // the verified token (requireAuth), never from the request body.
        body: JSON.stringify({ title, body }),
      });

      if (response.status === 401) {
        // Lecture 22: the 15-minute access token (Lecture 6) has expired.
        signOut();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const { error } = await response.json();
        setErrorMessage(error.message);
        setStatus(STATES.EDITING);
        return;
      }

      navigate("/");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus(STATES.EDITING);
    }
  }

  return (
    <div>
      {/* h1 added: no page in the app has had one since Lecture 7's
          Router rewrite dropped Lecture 1's placeholder — a real
          accessibility violation the axe-core check below catches. */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Write a new post
      </h1>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handlePublish();
        }}
      >
        <div>
          <label
            htmlFor="post-title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="post-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setStatus(STATES.EDITING);
            }}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            aria-describedby={errorMessage ? "post-error" : undefined}
          />
        </div>

        <div>
          <label
            htmlFor="post-body"
            className="block text-sm font-medium text-gray-700"
          >
            Body
          </label>
          <textarea
            id="post-body"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setStatus(STATES.EDITING);
            }}
            rows={10}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
        </div>

        {errorMessage && (
          <p id="post-error" role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === STATES.PUBLISHING}
          className="w-full md:w-auto min-h-[44px] rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {status === STATES.PUBLISHING ? "Publishing…" : "Publish"}
        </button>
      </form>
    </div>
  );
}
