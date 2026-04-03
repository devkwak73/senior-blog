import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
import PostShareButton from "./PostShareButton";
import AdBanner from "./AdBanner";

interface PostListProps {
  posts: Partial<Post & { like_count?: number }>[];
}

const catBadgeClass: Record<string, string> = {
  before: "badge badge-before",
  bidding: "badge badge-bidding",
  after:   "badge badge-after",
  tax:     "badge badge-tax",
  law:     "badge badge-law",
  ai:      "badge badge-ai",
};

const catLabels: Record<string, string> = {
  before: "입찰준비",
  bidding: "입찰·낙찰",
  after:   "명도·출구",
  tax:     "세금·대출",
  law:     "권리분석",
  ai:      "AI활용",
};

function getLevelBadge(slug?: string): { cls: string; label: string } | null {
  if (!slug) return null;
  if (slug.startsWith("basic-")) return { cls: "badge badge-basic", label: "기초" };
  if (slug.startsWith("mid-"))   return { cls: "badge badge-mid",   label: "중급" };
  if (slug.startsWith("adv-"))   return { cls: "badge badge-adv",   label: "고급" };
  return null;
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--ink-muted)" }}>
        <p style={{ fontSize: "1rem" }}>아직 게시된 글이 없습니다.</p>
      </div>
    );
  }

  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIST || "";

  return (
    <div>
      {posts.map((post) => {
        const cat = post.category || "before";
        const level = getLevelBadge(post.slug);
        const likeCount = (post as Record<string, unknown>).like_count as number || 0;
        const publishedDate = post.published_at
          ? new Date(post.published_at).toLocaleDateString("ko-KR", {
              year: "numeric", month: "long", day: "numeric",
            })
          : "";

        return (
          <div key={post.id}>
          <article className="feed-article">

            {/* 메타 */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              marginBottom: "0.875rem", flexWrap: "wrap",
            }}>
              <span className={catBadgeClass[cat] || "badge"}>
                {catLabels[cat] || cat}
              </span>
              {level && <span className={level.cls}>{level.label}</span>}
              {publishedDate && (
                <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)", marginLeft: "0.25rem" }}>
                  {publishedDate}
                </span>
              )}
              <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                · 조회 {(post.view_count || 0).toLocaleString()}
              </span>
              {likeCount > 0 && (
                <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                  · ♥ {likeCount.toLocaleString()}
                </span>
              )}
            </div>

            {/* 제목 */}
            <Link href={`/posts/${post.slug}`} className="feed-title">
              {post.title}
            </Link>

            {/* 썸네일 */}
            {post.thumbnail_url && (
              <div style={{
                position: "relative", width: "100%", height: "18rem",
                margin: "1.25rem 0", borderRadius: "10px", overflow: "hidden",
                border: "1px solid var(--border)",
              }}>
                <Image
                  src={post.thumbnail_url}
                  alt={post.title || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

            {/* 본문 요약 */}
            {post.content && (
              <div
                className="prose"
                style={{
                  marginTop: "1.25rem",
                  maxHeight: "30em",
                  overflow: "hidden",
                  position: "relative",
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
            {post.content && post.content.length > 2000 && (
              <div style={{
                marginTop: "-4em",
                position: "relative",
                zIndex: 1,
                paddingTop: "4em",
                background: "linear-gradient(transparent, var(--bg-card) 60%)",
                textAlign: "center",
                paddingBottom: "0.75rem",
              }}>
                <a href={`/posts/${post.slug}`} style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 24px",
                  background: "var(--accent)",
                  color: "#ffffff",
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}>
                  전체 글 읽기 →
                </a>
              </div>
            )}

            {/* 하단 — 공유 버튼만 */}
            <div style={{
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}>
              <PostShareButton slug={post.slug || ""} title={post.title || ""} />
            </div>
          </article>
          </div>
        );
      })}
      {/* 목록 하단 광고 1개 */}
      {posts.length > 0 && (
        <div className="feed-ad-slot">
          <AdBanner slot={adSlot} format="horizontal" />
        </div>
      )}
    </div>
  );
}
