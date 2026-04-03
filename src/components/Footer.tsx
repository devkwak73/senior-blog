import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "부놈의 경매이야기";
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "var(--header-bg)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      marginTop: "auto",
    }}>
      <div style={{
        maxWidth: "56rem",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}>

        {/* 이메일 구독 영역 */}
        <div style={{
          padding: "1.5rem",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "1.5rem",
        }}>
          <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--header-text)", marginBottom: "4px" }}>
            📬 이메일로 새 글 받기
          </p>
          <p style={{ fontSize: "13px", color: "var(--header-muted)", marginBottom: "12px" }}>
            경매 노하우와 새 글 소식을 이메일로 받아보세요
          </p>
          <NewsletterForm />
        </div>

        {/* 하단: 사이트 정보 + 링크 */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.25rem",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "var(--header-text)",
              marginBottom: "0.3rem",
            }}>
              {siteName}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--header-muted)" }}>
              © {year} {siteName}. All rights reserved.
            </p>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
            {[
              { href: "/about", label: "블로그 소개" },
              { href: "/contact", label: "문의하기" },
              { href: "/privacy", label: "개인정보처리방침" },
            ].map(({ href, label }, i) => (
              <span key={href} style={{ display: "inline-flex", alignItems: "center" }}>
                {i > 0 && (
                  <span style={{ color: "var(--header-muted)", padding: "0 0.4rem", fontSize: "0.75rem" }}>·</span>
                )}
                <Link
                  href={href}
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--header-muted)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                >
                  {label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
