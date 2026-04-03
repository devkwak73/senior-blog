"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/");
      return;
    }
    const params = new URLSearchParams();
    params.set("q", trimmed);
    const view = searchParams.get("view");
    if (view) params.set("view", view);
    router.push(`/?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: "28rem",
      margin: "0 auto",
      position: "relative",
    }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="글 제목, 내용 검색..."
        style={{
          width: "100%",
          padding: "0.625rem 2.5rem 0.625rem 2.25rem",
          fontSize: "0.875rem",
          border: "1px solid var(--border)",
          borderRadius: "9999px",
          background: "var(--bg-card)",
          color: "var(--ink)",
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
        onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
      />
      {/* 검색 아이콘 */}
      <button type="submit" style={{
        position: "absolute",
        left: "0.75rem",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        color: "var(--ink-muted)",
        display: "flex",
        alignItems: "center",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
      {/* X 버튼 */}
      {query && (
        <button type="button" onClick={handleClear} style={{
          position: "absolute",
          right: "0.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          color: "var(--ink-faint)",
          display: "flex",
          alignItems: "center",
          fontSize: "1rem",
          lineHeight: 1,
        }}>
          &times;
        </button>
      )}
    </form>
  );
}
