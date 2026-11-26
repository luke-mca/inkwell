// client/src/components/Feed.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "./PostCard";

export function Feed() {
  const [posts, setPosts] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Lecture 22: a failed request used to leave the feed stuck on
    // "Loading posts…" (or crash, when the error body had no `posts`).
    fetch("/api/posts?page=1")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setPosts(data.posts))
      .catch(() => setFailed(true));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feed</h1>

      {failed && (
        <p role="alert" className="text-red-600">
          Could not load posts. Please try again later.
        </p>
      )}

      {!failed && posts === null && <p className="text-gray-500">Loading posts…</p>}

      {posts !== null && posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet.</p>
          <Link to="/write" className="text-indigo-600 underline">
            Write the first one
          </Link>
        </div>
      )}

      {posts !== null && posts.length > 0 && (
        <ul className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      )}
    </div>
  );
}
