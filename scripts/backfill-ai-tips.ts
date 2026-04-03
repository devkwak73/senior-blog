/**
 * 기존 포스팅에서 AI 도구 활용 팁 섹션을 추출해 ai 카테고리 별도 포스팅으로 등록
 * 사용법: npx tsx scripts/backfill-ai-tips.ts
 */

import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "auction_blog",
  socketPath: process.env.DATABASE_SOCKET || undefined,
  charset: "utf8mb4",
});

function extractAiTipSection(html: string): string {
  const marker = "<h2>💡 AI 도구 활용 팁</h2>";
  const idx = html.indexOf(marker);
  return idx === -1 ? "" : html.slice(idx);
}

async function main() {
  // ai-tip-* 슬러그가 이미 있는 것 파악
  const [existing] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT slug FROM posts WHERE slug LIKE 'ai-tip-%'"
  );
  const existingSlugs = new Set(existing.map((r) => r.slug as string));

  // ai 카테고리가 아닌 published 포스팅 전체 조회
  const [posts] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT slug, title, content, thumbnail_url, keywords, published_at FROM posts WHERE status = 'published' AND category != 'ai' ORDER BY id"
  );

  let created = 0;
  let skipped = 0;

  for (const post of posts) {
    const aiSlug = `ai-tip-${post.slug}`;
    if (existingSlugs.has(aiSlug)) {
      console.log(`⏭️  건너뜀 (이미 존재): ${aiSlug}`);
      skipped++;
      continue;
    }

    const aiTipHtml = extractAiTipSection(post.content as string);
    if (!aiTipHtml) {
      console.log(`⚠️  AI팁 섹션 없음: ${post.slug}`);
      skipped++;
      continue;
    }

    const backLink = `<p style="margin-bottom:1.5em;"><a href="/posts/${post.slug}" style="color:var(--accent);">← 원문 보러가기: ${post.title}</a></p>`;
    const content = backLink + aiTipHtml;
    const aiTitle = `${post.title} — AI 도구 활용 팁`;
    const keywords = `AI도구활용,AI프롬프트,${post.keywords ?? ""}`;
    const metaDesc = `${post.title}에서 바로 쓸 수 있는 AI 도구 활용 팁과 프롬프트 예시입니다.`;

    await pool.query<mysql.ResultSetHeader>(
      `INSERT INTO posts (title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at)
       VALUES (?, ?, ?, 'ai', ?, ?, ?, 'published', ?)`,
      [aiTitle, content, aiSlug, post.thumbnail_url ?? null, metaDesc, keywords, post.published_at]
    );

    console.log(`✅ 생성: ${aiSlug}`);
    created++;
  }

  console.log(`\n완료 — 생성: ${created}개, 건너뜀: ${skipped}개`);
  await pool.end();
}

main().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
