import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "블로그 소개",
  description: "토닥토닥 시니어 — 손자가 설명하듯 쉽고 따뜻한 시니어 생활정보 블로그",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "블로그 소개 | 토닥토닥 시니어",
    description: "50대 이상 시니어를 위한 맞춤 생활정보 블로그",
    url: `${siteUrl}/about`,
    images: [{ url: `${siteUrl}/og-image.png` }],
  },
};

export default function AboutPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "토닥토닥 시니어";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* 헤더 */}
      <header style={{ background: "var(--header-bg)" }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "1.5rem 1.5rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.875rem",
              color: "var(--header-muted)",
              textDecoration: "none",
            }}
          >
            ← {siteName}
          </Link>
        </div>
      </header>

      {/* 히어로 */}
      <div style={{ background: "var(--header-bg)", paddingBottom: "3rem" }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            paddingTop: "1rem",
          }}>
            <div style={{
              width: "3px",
              height: "4rem",
              background: "var(--accent)",
              borderRadius: "2px",
              flexShrink: 0,
              marginTop: "0.25rem",
            }} />
            <div>
              <p style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "0.5rem",
              }}>
                About
              </p>
              <h1 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--header-text)",
                lineHeight: 1.25,
              }}>
                {siteName}
              </h1>
              <p style={{
                fontSize: "1rem",
                color: "var(--header-muted)",
                marginTop: "0.75rem",
                lineHeight: 1.7,
              }}>
                손자가 설명하듯 쉽고 따뜻한 시니어 생활정보
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <main style={{ maxWidth: "52rem", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* 블로그 소개 */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "1.25rem",
            paddingBottom: "0.5rem",
            borderBottom: "2px solid var(--border)",
          }}>
            블로그 소개
          </h2>
          <div className="prose">
            <p>
              <strong>토닥토닥 시니어</strong>는 50대 이상 어르신들에게 꼭 필요한 생활정보를
              쉽고 따뜻하게 전달하는 블로그입니다.
            </p>
            <p>
              건강 관리, 지원금 안내, 연금·절세, 디지털 활용법까지 — 시니어 생활 전반에 걸친
              실용적인 정보를 제공합니다. 어려운 전문 용어 대신 누구나 이해할 수 있는 쉬운 말로
              설명하는 것을 원칙으로 합니다.
            </p>
            <p>
              마치 <strong>손자가 할아버지·할머니께 설명하듯</strong> 친절하고 따뜻한 톤으로
              정보를 전달합니다. 필요한 정보를 빠르게 찾고, 바로 활용할 수 있도록 구성했습니다.
            </p>
          </div>
        </section>

        {/* 카테고리 안내 */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "1.5rem",
            paddingBottom: "0.5rem",
            borderBottom: "2px solid var(--border)",
          }}>
            다루는 주제
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(14rem, 1fr))",
            gap: "1rem",
          }}>
            {[
              { label: "건강톡톡", color: "var(--cat-health-c)", bg: "var(--cat-health-bg)", desc: "관절, 혈압, 당뇨, 치매예방 등 시니어 건강 관리 핵심 정보" },
              { label: "지원금알리미", color: "var(--cat-subsidy-c)", bg: "var(--cat-subsidy-bg)", desc: "기초연금, 주거지원, 의료비 등 꼭 받아야 할 혜택 안내" },
              { label: "돈이야기", color: "var(--cat-money-c)", bg: "var(--cat-money-bg)", desc: "연금, 절세, 상속·증여 등 은퇴 후 돈 관리 방법" },
              { label: "어디갈까", color: "var(--cat-travel-c)", bg: "var(--cat-travel-bg)", desc: "무릎 편한 둘레길부터 시니어 맞춤 여행 코스까지" },
              { label: "스마트생활", color: "var(--cat-digital-c)", bg: "var(--cat-digital-bg)", desc: "스마트폰, 키오스크, 온라인쇼핑 등 디지털 생활 가이드" },
              { label: "오늘뭐먹지", color: "var(--cat-food-c)", bg: "var(--cat-food-bg)", desc: "저염식, 당뇨식단, 건강한 간편식 레시피" },
              { label: "마음건강", color: "var(--cat-mind-c)", bg: "var(--cat-mind-bg)", desc: "수면, 우울감, 부부관계 등 마음 돌봄 정보" },
              { label: "생활법률", color: "var(--cat-legal-c)", bg: "var(--cat-legal-bg)", desc: "유언장, 임대차, 사기 예방 등 생활 속 법률 상식" },
            ].map(({ label, color, bg, desc }) => (
              <div key={label} style={{
                background: "var(--bg-card)",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  padding: "0.3em 0.75em",
                  borderRadius: "999px",
                  width: "fit-content",
                  color,
                  background: bg,
                }}>
                  {label}
                </span>
                <p style={{ fontSize: "0.875rem", color: "var(--ink-mid)", lineHeight: 1.6, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 관련 서비스 */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "1.5rem",
            paddingBottom: "0.5rem",
            borderBottom: "2px solid var(--border)",
          }}>
            함께 만든 서비스
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <a
              href="https://play.google.com/store/apps/details?id=com.todak.seniorsafetyguardian&hl=ko"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                background: "var(--accent-faint)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.5rem",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              <div style={{
                width: "3rem",
                height: "3rem",
                background: "var(--accent)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                flexShrink: 0,
              }}>
                📱
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "0.25rem", fontSize: "1rem" }}>
                  토닥토닥 곁에 (Android)
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--ink-mid)", margin: 0, lineHeight: 1.5 }}>
                  시니어 안전 지킴이 안드로이드 앱 — Google Play에서 무료 다운로드
                </p>
              </div>
            </a>
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: "center", paddingTop: "1rem" }}>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9375rem",
              padding: "0.75rem 2rem",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "background 0.15s",
            }}
          >
            문의하기 →
          </Link>
        </div>

      </main>
    </div>
  );
}
