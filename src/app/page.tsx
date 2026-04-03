import { Suspense } from "react";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import PostList from "@/components/PostList";
import PostCard from "@/components/PostCard";
import ViewToggle from "@/components/ViewToggle";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";

const LIMIT = 10;

const categories: { key: string | null; label: string }[] = [
  { key: null,       label: "전체" },
  { key: "health",   label: "건강톡톡" },
  { key: "subsidy",  label: "지원금알리미" },
  { key: "money",    label: "돈이야기" },
  { key: "travel",   label: "어디갈까" },
  { key: "digital",  label: "스마트생활" },
  { key: "food",     label: "오늘뭐먹지" },
  { key: "mind",     label: "마음건강" },
  { key: "legal",    label: "생활법률" },
];

type SearchParams = Promise<{
  view?: string;
  page?: string;
  category?: string;
  q?: string;
}>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { view = "list", page = "1", category, q } = await searchParams;

  const currentView = view === "card" ? "card" : "list";
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * LIMIT;
  const searchQuery = q?.trim() || "";

  let whereClauses = "status = 'published'";
  const queryParams: (string | number)[] = [];
  const countParams: (string | number)[] = [];

  // 검색어
  if (searchQuery) {
    const searchPattern = `%${searchQuery}%`;
    whereClauses += " AND (title LIKE ? OR content LIKE ?)";
    queryParams.push(searchPattern, searchPattern);
    countParams.push(searchPattern, searchPattern);
  }

  // 카테고리 필터
  if (category) {
    whereClauses += " AND category = ?";
    queryParams.push(category);
    countParams.push(category);
  }

  queryParams.push(LIMIT, offset);

  const [[{ total }]] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM posts WHERE ${whereClauses}`,
    countParams
  );

  const [posts] = await pool.query<RowDataPacket[]>(
    `SELECT id, title, slug, category, thumbnail_url, meta_description, content, published_at, view_count,
            (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as like_count
     FROM posts WHERE ${whereClauses}
     ORDER BY published_at DESC LIMIT ? OFFSET ?`,
    queryParams
  );

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── 헤더 ──────────────────────────────────── */}
      <header style={{ background: "var(--header-bg)" }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "2rem 1.5rem 1.75rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <div style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "0.5rem",
              }}>
                시니어 맞춤 생활정보 블로그
              </div>
              <h1 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--header-text)",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}>
                {process.env.NEXT_PUBLIC_SITE_NAME || "토닥토닥 시니어"}
              </h1>
              <p style={{
                fontSize: "0.8125rem",
                color: "var(--header-muted)",
                marginTop: "0.5rem",
                letterSpacing: "0.02em",
              }}>
                손자가 설명하듯 쉽고 따뜻한 시니어 생활정보
              </p>
            </div>
            <div style={{
              flexShrink: 0,
              width: "3px",
              height: "4.5rem",
              background: "var(--accent)",
              borderRadius: "2px",
            }} />
          </div>
        </div>
      </header>

      {/* ── 검색바 ────────────────────────────────── */}
      <div style={{
        background: "var(--bg)",
        padding: "0.875rem 1.5rem",
        borderBottom: "1px solid var(--border-light)",
      }}>
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      {/* ── 검색 결과 안내 ─────────────────────────── */}
      {searchQuery && (
        <div style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "0.75rem 1.5rem 0",
        }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--ink-muted)" }}>
            &ldquo;<strong style={{ color: "var(--ink)" }}>{searchQuery}</strong>&rdquo; 검색 결과 {total}건
          </p>
        </div>
      )}

      {/* ── 카테고리 탭 ───────────────────────────── */}
      <div style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            className="scrollbar-hide"
            style={{ display: "flex", overflowX: "auto" }}
          >
            {categories.map(({ key, label }) => {
              const isActive = (!key && !category) || key === category;
              const href = key
                ? `/?view=${currentView}&category=${key}`
                : `/?view=${currentView}`;
              return (
                <a
                  key={key ?? "all"}
                  href={href}
                  className={`cat-tab${isActive ? " active" : ""}`}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 메인 콘텐츠 ───────────────────────────── */}
      <main style={{ maxWidth: "56rem", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* 뷰 토글 + 글 수 */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 0",
        }}>
          <span style={{ fontSize: "0.8125rem", color: "var(--ink-muted)" }}>
            총{" "}
            <strong style={{ color: "var(--ink)", fontWeight: 700 }}>{total}</strong>
            개의 글
          </span>
          <Suspense>
            <ViewToggle currentView={currentView} />
          </Suspense>
        </div>

        {/* 글 목록 */}
        <div style={{
          background: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          marginBottom: "1.5rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          {currentView === "card" ? (
            <div style={{ padding: "1.25rem" }}>
              <PostCard posts={posts as unknown as Partial<import("@/types").Post>[]} />
            </div>
          ) : (
            <PostList posts={posts as unknown as Partial<import("@/types").Post>[]} />
          )}
        </div>

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          view={currentView}
          category={category}
          q={searchQuery}
        />
        <div style={{ height: "3rem" }} />
      </main>
    </div>
  );
}
