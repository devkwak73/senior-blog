/**
 * 시니어 생활정보 블로그 자동 글 생성 스크립트
 * 사용법: npx tsx scripts/generate-post.ts
 * 크론탭: 0 9 * * 1-5 cd /path/to/senior-blog && npx tsx scripts/generate-post.ts
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import mysql from "mysql2/promise";
import webpush from "web-push";
import { Resend } from "resend";
import { allTopics, Topic } from "./topics";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// .env.local 로드
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ── DB 연결 ──────────────────────────────────────
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "senior_blog",
  socketPath: process.env.DATABASE_SOCKET || undefined,
  charset: "utf8mb4",
});

// ── Gemini 클라이언트 ─────────────────────────────
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY가 .env.local에 설정되어 있지 않습니다.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ── 카테고리 → Unsplash 검색어 맵 ────────────────
const CATEGORY_QUERY: Record<string, string[]> = {
  health:  ["senior health", "elderly exercise", "walking park", "medical checkup", "yoga senior"],
  subsidy: ["government office korea", "senior center", "welfare office", "document filing", "elderly care"],
  money:   ["retirement planning", "pension finance", "savings bank", "family inheritance", "elderly financial"],
  travel:  ["hiking trail korea", "hot spring spa", "couple travel", "temple stay", "nature scenery"],
  digital: ["senior smartphone", "elderly technology", "kiosk touchscreen", "online shopping", "digital literacy"],
  food:    ["healthy korean meal", "simple cooking", "seasonal vegetables", "nutrition senior", "korean traditional food"],
  mind:    ["meditation garden", "elderly couple", "hobby painting", "social gathering", "peaceful nature"],
  legal:   ["legal document signing", "consumer protection", "family meeting", "elder safety", "will testament"],
};

interface UnsplashResult {
  url: string;
  attribution: string;
}

// ── DB에서 이미 사용된 이미지 URL 조회 (썸네일 + 본문 인라인 모두) ──
async function getUsedImageIds(): Promise<Set<string>> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT thumbnail_url, content FROM posts WHERE status = 'published'"
  );
  const ids = new Set<string>();
  const inlineRegex = /src="(https:\/\/images\.unsplash\.com\/[^"?]+)/g;

  for (const row of rows) {
    // thumbnail_url
    if (row.thumbnail_url) {
      ids.add((row.thumbnail_url as string).split("?")[0]);
    }
    // 본문 내 Unsplash 인라인 이미지
    let match;
    while ((match = inlineRegex.exec(row.content as string)) !== null) {
      ids.add(match[1]);
    }
    inlineRegex.lastIndex = 0;
  }
  return ids;
}

// ── Unsplash 이미지 여러 장 가져오기 (중복 제외) ─
async function fetchUnsplashImages(category: string, count: number, usedIds: Set<string> = new Set()): Promise<UnsplashResult[]> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    writeLog("⚠️  UNSPLASH_ACCESS_KEY 미설정 — 이미지 없이 진행");
    return [];
  }

  const queries = CATEGORY_QUERY[category] ?? ["senior lifestyle", "peaceful nature"];

  try {
    const results: UnsplashResult[] = [];

    // 검색어를 순회하며 미사용 이미지가 충분히 모일 때까지 시도
    for (const query of queries) {
      if (results.length >= count) break;

      let page = 1;
      while (results.length < count && page <= 2) {
      const url = new URL("https://api.unsplash.com/search/photos");
      url.searchParams.set("query", query);
      url.searchParams.set("per_page", "30");
      url.searchParams.set("orientation", "landscape");
      url.searchParams.set("page", String(page));

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Client-ID ${unsplashKey}` },
      });

      if (!res.ok) {
        writeLog(`⚠️  Unsplash API 오류 (${res.status}) — 이미지 없이 진행`);
        break;
      }

      const data = await res.json() as {
        results: Array<{
          id: string;
          urls: { regular: string };
          user: { name: string };
          links: { html: string };
        }>;
      };

      if (!data.results?.length) break;

      for (const photo of data.results) {
        const baseUrl = photo.urls.regular.split("?")[0];
        if (usedIds.has(baseUrl)) continue; // 이미 사용된 이미지 제외
        usedIds.add(baseUrl); // 이번 요청 내 중복도 방지
        results.push({
          url: photo.urls.regular,
          attribution: `<a href="${photo.links.html}?utm_source=senior_blog&utm_medium=referral" rel="noopener noreferrer" style="color:rgba(255,255,255,0.9);">${photo.user.name}</a> / Unsplash`,
        });
        if (results.length >= count) break;
      }

      page++;
      } // end while
    } // end for

    if (!results.length) writeLog("⚠️  Unsplash 미사용 이미지 없음 — 이미지 없이 진행");
    return results;
  } catch (err) {
    writeLog(`⚠️  Unsplash fetch 실패: ${err instanceof Error ? err.message : String(err)} — 이미지 없이 진행`);
    return [];
  }
}

// ── 콘텐츠 내 이미지 삽입 ────────────────────────
function injectImagesIntoContent(html: string, images: UnsplashResult[]): string {
  if (!images.length) return html;

  const DELIMITER = "</h2>";
  const parts = html.split(DELIMITER);

  // 1번째 h2 뒤(index 1), 3번째 h2 뒤(index 3)에 삽입
  const targets: Array<[partIndex: number, imageIndex: number]> = [
    [1, 0],
    [3, 1],
  ];

  for (const [partIdx, imgIdx] of targets) {
    if (partIdx >= parts.length || !images[imgIdx]) continue;

    const img = images[imgIdx];
    const figure = [
      `<figure style="margin:1.75em 0;position:relative;display:block;">`,
      `<img src="${img.url}" alt="관련 이미지" loading="lazy"`,
      ` style="width:100%;max-height:400px;object-fit:cover;border-radius:10px;border:1px solid var(--border);display:block;" />`,
      `<figcaption style="position:absolute;bottom:8px;right:10px;font-size:0.65rem;`,
      `color:rgba(255,255,255,0.85);background:rgba(0,0,0,0.45);`,
      `padding:2px 7px;border-radius:4px;line-height:1.5;white-space:nowrap;">`,
      img.attribution,
      `</figcaption></figure>`,
    ].join("");

    parts[partIdx] = parts[partIdx] + figure;
  }

  return parts.join(DELIMITER);
}

// ── 다음 발행할 주제 결정 ─────────────────────────
async function getNextTopic(): Promise<Topic | null> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT slug FROM posts WHERE slug REGEXP '^(health|subsidy|money|travel|digital|food|mind|legal)-[0-9]+$'"
  );
  const existingSlugs = new Set(rows.map((r) => r.slug));

  for (const topic of allTopics) {
    if (!existingSlugs.has(topic.slug)) {
      return topic;
    }
  }
  return null; // 모든 주제 완료
}

// ── Gemini 프롬프트 생성 ──────────────────────────
function buildPrompt(topic: Topic): string {
  return `당신은 "토닥토닥 시니어" 블로그의 운영자 '마인드라'입니다. 50대 이상 시니어를 위한 생활정보 블로그 작가입니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}
카테고리: ${topic.category}
SEO 키워드: ${topic.keywords}

[작성 규칙]
1. 손자가 할머니·할아버지께 설명하듯 쉽고 따뜻한 말투로 작성
2. 반드시 존댓말(~요, ~습니다, ~세요)만 사용
3. "여러분", "독자님" 등 독자를 직접 부르는 호칭 사용 금지
4. 한 문장은 40자 이내로 짧게 끊어 쓰기
5. 전문 용어는 반드시 쉬운 말로 풀어서 설명
6. 글의 첫 문장은 공감을 유발하는 질문이나 상황 묘사로 시작
   좋은 예: "무릎이 시리면 관절염인가요? 많은 분이 이렇게 걱정하세요."
   좋은 예: "기초연금, 내가 받을 수 있는 건지 헷갈리시죠?"
   나쁜 예: "안녕하세요" (인사말 시작 절대 금지)
   나쁜 예: "오늘은 ~에 대해 알아보겠습니다" (금지)
7. 2500~3000자 내외
8. 표(<table>)와 목록(<ul><li>)을 적극 활용하여 한눈에 보기 쉽게 정리
9. 금액, 기한, 자격조건 등 핵심 수치는 반드시 표로 정리
10. 단계별 절차가 있으면 순서도(flow-diagram) 형식 사용
11. 핵심 내용은 <strong> 태그로 강조
12. 글 마지막에 "한 줄 요약" 섹션 추가

[한 줄 요약 형식]
<h2>한 줄 요약</h2>
<blockquote>[이 글의 핵심을 1~2문장으로 정리]</blockquote>

[출력 형식]
- 순수 HTML 태그만 출력 (마크다운 절대 금지)
- 사용 가능한 태그: <h2> <h3> <p> <ul> <ol> <li> <table> <thead> <tbody> <tr> <th> <td> <strong> <blockquote>
- <h1> 태그 사용 금지 (제목은 별도 처리됨)
- 응답은 반드시 HTML 태그로 시작하고 HTML 태그로 끝날 것`;
}

// ── HTML 정리: 마크다운 잔재 + 아이콘 태그 제거 ──
function cleanHtml(raw: string): string {
  return raw
    .replace(/```html\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^#{1,6}\s+(.+)$/gm, "<p>$1</p>")
    .replace(/<i\b[^>]*class="[^"]*(?:material-icons|fa|fas|far|fab)[^"]*"[^>]*>.*?<\/i>/gi, "")
    .replace(/<span\b[^>]*class="[^"]*(?:material-icons|material-symbols)[^"]*"[^>]*>.*?<\/span>/gi, "")
    .replace(/<i\b[^>]*>([a-z_]{3,30})<\/i>/gi, "")
    .trim();
}

// ── DB에 글 저장 ──────────────────────────────────
async function savePost(topic: Topic, content: string, thumbnailUrl: string | null): Promise<number> {
  const now = new Date();
  const publishedAt = now.toISOString().slice(0, 19).replace("T", " ");

  const [result] = await pool.query<mysql.ResultSetHeader>(
    `INSERT INTO posts
      (title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
    [
      topic.title,
      content,
      topic.slug,
      topic.category,
      thumbnailUrl,
      topic.meta_description,
      topic.keywords,
      publishedAt,
    ]
  );
  return result.insertId;
}

// ── 로그 파일 기록 ────────────────────────────────
function writeLog(message: string): void {
  const logPath = path.resolve(process.cwd(), "scripts/generate.log");
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logPath, line, "utf-8");
  console.log(message);
}

// ── 메인 실행 ─────────────────────────────────────
async function main() {
  writeLog("=== 글 자동 생성 시작 ===");

  try {
    const topic = await getNextTopic();

    if (!topic) {
      writeLog("✅ 모든 주제(130개)가 발행 완료됐습니다!");
      await pool.end();
      return;
    }

    writeLog(`📝 주제 선택: [${topic.category}] ${topic.index}/120 - ${topic.title}`);

    // Gemini로 글 생성
    writeLog("🤖 Gemini로 글 생성 중...");
    const prompt = buildPrompt(topic);
    const result = await model.generateContent(prompt);
    const rawContent = result.response.text();
    const content = cleanHtml(rawContent);
    writeLog(`✍️  생성 완료 (${content.length}자)`);

    // Unsplash 이미지 가져오기 (중복 제외, 썸네일 1장 + 인라인 2장)
    writeLog("🖼️  Unsplash 이미지 가져오는 중...");
    const usedIds = await getUsedImageIds();
    const allImages = await fetchUnsplashImages(topic.category, 3, usedIds);
    const thumbnail = allImages[0] ?? null;
    const inlineImages = allImages.slice(1, 3);
    const contentWithImages = injectImagesIntoContent(content, inlineImages);
    if (thumbnail) writeLog(`🖼️  썸네일: ${thumbnail.url}`);

    // DB 저장 (원문)
    const postId = await savePost(topic, contentWithImages, thumbnail?.url ?? null);
    writeLog(`💾 DB 저장 완료 (id: ${postId}, slug: ${topic.slug})`);
    writeLog(`🌐 URL: ${process.env.NEXT_PUBLIC_SITE_URL}/posts/${topic.slug}`);

    // 웹 푸시 알림 발송
    await sendPushNotifications(topic, postId);

    // 이메일 뉴스레터 발송
    await sendNewsletterEmails(topic);

    writeLog("=== 완료 ===\n");

  } catch (error) {
    writeLog(`❌ 오류 발생: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// ── 웹 푸시 알림 ──────────────────────────────────
async function sendPushNotifications(topic: Topic, postId: number) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    writeLog("⚠️  VAPID 키 미설정 — 푸시 알림 건너뜀");
    return;
  }

  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || "mailto:dev.kwak73@gmail.com",
    publicKey,
    privateKey
  );

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT id, endpoint, auth_key, p256dh_key FROM push_subscriptions WHERE is_active = 1"
  );

  if (rows.length === 0) {
    writeLog("📭 푸시 구독자 없음 — 건너뜀");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const payload = JSON.stringify({
    title: topic.title,
    body: topic.meta_description || "",
    url: `${siteUrl}/posts/${topic.slug}`,
    icon: "/og-image.png",
    tag: `post-${postId}`,
  });

  let sent = 0;
  let failed = 0;
  for (const row of rows) {
    try {
      await webpush.sendNotification(
        { endpoint: row.endpoint, keys: { auth: row.auth_key, p256dh: row.p256dh_key } },
        payload
      );
      sent++;
    } catch (err: unknown) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code === 410 || code === 404) {
        await pool.query("UPDATE push_subscriptions SET is_active = 0 WHERE id = ?", [row.id]);
      }
      failed++;
    }
  }
  writeLog(`🔔 푸시 알림: ${sent}건 발송, ${failed}건 실패 (총 ${rows.length}명)`);
}

// ── 이메일 뉴스레터 ──────────────────────────────────
async function sendNewsletterEmails(topic: Topic) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_placeholder")) {
    writeLog("⚠️  Resend API 키 미설정 — 이메일 건너뜀");
    return;
  }

  const resend = new Resend(apiKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT email, unsubscribe_token FROM newsletter_subscribers WHERE is_active = 1"
  );

  if (rows.length === 0) {
    writeLog("📭 이메일 구독자 없음 — 건너뜀");
    return;
  }

  let sent = 0;
  let failed = 0;
  const postUrl = `${siteUrl}/posts/${topic.slug}`;

  for (const row of rows) {
    const unsubUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${row.unsubscribe_token}`;
    try {
      await resend.emails.send({
        from: "토닥토닥 시니어 <noreply@senior.yourdomain.com>",
        to: row.email,
        subject: `[새 글] ${topic.title}`,
        html: `
          <div style="max-width:600px;margin:0 auto;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#1a1a1a;">
            <div style="padding:32px 24px;background:#0f172a;border-radius:12px 12px 0 0;">
              <h1 style="color:#f8fafc;font-size:20px;margin:0;">토닥토닥 시니어</h1>
            </div>
            <div style="padding:32px 24px;background:#ffffff;border:1px solid #e2e8f0;">
              <h2 style="font-size:22px;color:#0f172a;margin:0 0 16px;">${topic.title}</h2>
              <p style="font-size:16px;color:#475569;line-height:1.6;margin:0 0 24px;">${topic.meta_description || ""}</p>
              <a href="${postUrl}" style="display:inline-block;padding:14px 28px;background:#1a7a3d;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;">글 읽으러 가기</a>
            </div>
            <div style="padding:16px 24px;background:#f8fafc;border-radius:0 0 12px 12px;text-align:center;">
              <a href="${unsubUrl}" style="font-size:13px;color:#94a3b8;text-decoration:underline;">구독 해제</a>
            </div>
          </div>
        `,
      });
      sent++;
    } catch {
      failed++;
    }
  }
  writeLog(`📧 이메일 뉴스레터: ${sent}건 발송, ${failed}건 실패 (총 ${rows.length}명)`);
}

main();
