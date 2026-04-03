import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
import PostShareButton from "./PostShareButton";
import AdBanner from "./AdBanner";

interface PostCardProps {
  posts: Partial<Post & { like_count?: number }>[];
}

const catLabels: Record<string, string> = {
  health:  "건강톡톡",
  subsidy: "지원금알리미",
  money:   "돈이야기",
  travel:  "어디갈까",
  digital: "스마트생활",
  food:    "오늘뭐먹지",
  mind:    "마음건강",
  legal:   "생활법률",
};

const catBadgeClass: Record<string, string> = {
  health:  "badge badge-health",
  subsidy: "badge badge-subsidy",
  money:   "badge badge-money",
  travel:  "badge badge-travel",
  digital: "badge badge-digital",
  food:    "badge badge-food",
  mind:    "badge badge-mind",
  legal:   "badge badge-legal",
};

// Top border accent per category
const catAccent: Record<string, string> = {
  health:  "var(--cat-health-c)",
  subsidy: "var(--cat-subsidy-c)",
  money:   "var(--cat-money-c)",
  travel:  "var(--cat-travel-c)",
  digital: "var(--cat-digital-c)",
  food:    "var(--cat-food-c)",
  mind:    "var(--cat-mind-c)",
  legal:   "var(--cat-legal-c)",
};

export default function PostCard({ posts }: PostCardProps) {
  if (posts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--ink-muted)" }}>
        <p>아직 게시된 글이 없습니다.</p>
      </div>
    );
  }

  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIST || "";
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1rem",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={gridStyle}>
        {posts.map((post) => {
              const cat = post.category || "health";
              const accent = catAccent[cat] || "var(--accent)";
              const likeCount = (post as Record<string, unknown>).like_count as number || 0;
              const publishedDate = post.published_at
                ? new Date(post.published_at).toLocaleDateString("ko-KR")
                : "";

              return (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="post-card"
                  style={{ borderTop: `3px solid ${accent}` }}
                >
                  {post.thumbnail_url ? (
                    <div className="post-card-thumb">
                      <Image
                        src={post.thumbnail_url}
                        alt={post.title || ""}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="post-card-placeholder">
                      <span style={{ fontSize: "2rem", opacity: 0.4 }}>🌿</span>
                    </div>
                  )}

                  <div className="post-card-body">
                    <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                      <span className={catBadgeClass[cat] || "badge"}>{catLabels[cat] || cat}</span>
                    </div>

                    <h2 className="post-card-title">{post.title}</h2>

                    {post.meta_description && (
                      <p style={{
                        fontSize: "0.75rem",
                        color: "var(--ink-muted)",
                        lineHeight: 1.6,
                        marginBottom: "0.75rem",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                      }}>
                        {post.meta_description}
                      </p>
                    )}

                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      fontSize: "0.6875rem", color: "var(--ink-faint)", marginTop: "auto",
                      paddingTop: "0.5rem", borderTop: "1px solid var(--border-light)",
                    }}>
                      <span>{publishedDate || ""} · 조회 {(post.view_count || 0).toLocaleString()}{likeCount > 0 ? ` · ♥ ${likeCount}` : ""}</span>
                      <PostShareButton slug={post.slug || ""} title={post.title || ""} />
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
      {/* 목록 하단 광고 1개 */}
      {posts.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <AdBanner slot={adSlot} format="horizontal" />
        </div>
      )}
    </div>
  );
}
