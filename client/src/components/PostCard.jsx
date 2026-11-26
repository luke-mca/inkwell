// client/src/components/PostCard.jsx
//
// Lecture 22: each post in the feed shows who wrote it and when. The
// server already sends post.author (id and displayName only, Lecture 16's
// DTO) and post.publishedAt; until now the card simply never showed them.

export function PostCard({ post }) {
  return (
    <li className="border-b border-gray-200 pb-4">
      <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
      <p className="mt-1 text-sm text-gray-600">
        By {post.author?.displayName ?? "Unknown author"}
        {post.publishedAt && (
          <>
            {" · "}
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString()}
            </time>
          </>
        )}
      </p>
      <p className="mt-1 text-gray-600 line-clamp-3">{post.body}</p>
    </li>
  );
}
