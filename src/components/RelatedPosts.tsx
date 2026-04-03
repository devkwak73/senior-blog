import Link from "next/link";

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  meta_description: string | null;
  published_at: string | null;
}

const catLabels: Record<string, string> = {
  before:  "입찰준비",
  bidding: "입찰·낙찰",
  after:   "명도·출구",
  tax:     "세금·대출",
  law:     "권리분석",
  ai:      "AI활용",
};
const catBadgeClass: Record<string, string> = {
  before:  "badge badge-before",
  bidding: "badge badge-bidding",
  after:   "badge badge-after",
  tax:     "badge badge-tax",
  law:     "badge badge-law",
  ai:      "badge badge-ai",
};

export default function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
    }}>
      <h2 style={{
        fontSize: "0.875rem",
        fontWeight: 700,
        color: "var(--ink-muted)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
      }}>
        <span style={{ color: "var(--accent)" }}>▪</span> 함께 보면 좋은 글
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div className="related-post-card">
              <div style={{ marginBottom: "0.4rem" }}>
                <span className={catBadgeClass[post.category] || "badge"} style={{ fontSize: "0.65rem" }}>
                  {catLabels[post.category] || post.category}
                </span>
              </div>
              <p style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.9875rem",
                fontWeight: 700,
                color: "var(--ink)",
                lineHeight: 1.4,
                marginBottom: "0.35rem",
              }}>
                {post.title}
              </p>
              {post.meta_description && (
                <p style={{
                  fontSize: "0.8125rem",
                  color: "var(--ink-muted)",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {post.meta_description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
