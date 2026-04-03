import { notFound } from "next/navigation";
import type { Metadata } from "next";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Post } from "@/types";
import JsonLd from "@/components/JsonLd";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import RelatedPosts from "@/components/RelatedPosts";
import SubscribeCard from "@/components/SubscribeCard";
import Link from "next/link";
import CoupangBanner from "@/components/CoupangBanner";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<Post | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM posts WHERE slug = ? AND status = 'published'",
    [slug]
  );
  return (rows[0] as Post) || null;
}

async function getRelatedPosts(postId: number, category: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, title, slug, category, meta_description, published_at
     FROM posts
     WHERE status = 'published'
       AND category = ?
       AND id != ?
     ORDER BY published_at DESC
     LIMIT 2`,
    [category, postId]
  );
  return rows as Array<{
    id: number; title: string; slug: string;
    category: string; meta_description: string | null; published_at: string | null;
  }>;
}

async function getLikeCount(postId: number): Promise<number> {
  const [[row]] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM likes WHERE post_id = ?",
    [postId]
  );
  return row?.count || 0;
}

export async function generateStaticParams() {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT slug FROM posts WHERE status = 'published'"
  );
  return rows.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (!post) return { title: "글을 찾을 수 없습니다" };
  const ogImage = post.thumbnail_url || `${siteUrl}/og-image.png`;
  return {
    title: post.title,
    description: post.meta_description || post.title,
    keywords: post.keywords || undefined,
    alternates: {
      canonical: `${siteUrl}/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.meta_description || post.title,
      url: `${siteUrl}/posts/${post.slug}`,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_description || post.title,
      images: [ogImage],
    },
  };
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

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  await pool.query("UPDATE posts SET view_count = view_count + 1 WHERE id = ?", [post.id]);
  const [likeCount, relatedPosts] = await Promise.all([
    getLikeCount(post.id),
    getRelatedPosts(post.id, post.category),
  ]);

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("ko-KR", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <>
      <JsonLd post={post} />
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* ── 상단 내비 ─────────────────────────── */}
        <header style={{
          background: "var(--header-bg)",
          borderBottom: "1px solid #2a2a28",
        }}>
          <div style={{
            maxWidth: "52rem", margin: "0 auto",
            padding: "0.875rem 1.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <Link href="/" style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--header-text)",
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}>
              토닥토닥 시니어
            </Link>
            <Link href="/" style={{
              fontSize: "0.75rem",
              color: "var(--header-muted)",
              textDecoration: "none",
              display: "flex", alignItems: "center", gap: "0.3rem",
            }}>
              ← 목록으로
            </Link>
          </div>
        </header>

        <main style={{ maxWidth: "52rem", margin: "0 auto", padding: "0 1.5rem" }}>

          {/* ── 아티클 ─────────────────────────── */}
          <article style={{
            background: "var(--bg-card)",
            borderRadius: "0 0 16px 16px",
            border: "1px solid var(--border)",
            borderTop: "none",
            padding: "2.5rem 2.5rem 3rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>

            {/* 메타 */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              marginBottom: "1.25rem", flexWrap: "wrap",
            }}>
              <span className={catBadgeClass[post.category] || "badge"}>
                {catLabels[post.category] || post.category}
              </span>
              {publishedDate && (
                <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)", marginLeft: "0.25rem" }}>
                  {publishedDate}
                </span>
              )}
              <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                · 조회 {post.view_count.toLocaleString()}
              </span>
            </div>

            {/* 제목 */}
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
              fontWeight: 800,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              marginBottom: "2rem",
            }}>
              {post.title}
            </h1>

            {/* 구분선 */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              marginBottom: "2rem",
            }}>
              <div style={{ width: "2.5rem", height: "3px", background: "var(--accent)", borderRadius: "2px" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)", fontWeight: 600, letterSpacing: "0.05em" }}>
                마인드라
              </span>
            </div>

            {/* 썸네일 */}
            {post.thumbnail_url && (
              <div style={{
                marginBottom: "2.5rem", borderRadius: "10px", overflow: "hidden",
                border: "1px solid var(--border)",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  style={{ width: "100%", height: "auto", maxHeight: "24rem", objectFit: "cover", display: "block" }}
                />
              </div>
            )}

            {/* 본문 */}
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* 쿠팡파트너스 가로 배너 */}
            <CoupangBanner category={post.category} />

            {/* 좋아요 & 공유 */}
            <div style={{
              marginTop: "2.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <LikeButton postId={post.id} initialCount={likeCount} />
              <ShareButton title={post.title} />
            </div>

            {/* 구독 카드 (푸시 + 이메일) */}
            <SubscribeCard />
          </article>

          {/* ── 함께 보면 좋은 글 ───────────────── */}
          <RelatedPosts posts={relatedPosts} />

          {/* ── 댓글 (임시 숨김) ──────────────────── */}
          {/* <CommentSection postId={post.id} /> */}
          <div style={{ height: "3rem" }} />
        </main>
      </div>
    </>
  );
}
