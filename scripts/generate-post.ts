/**
 * 경매AI블로그 자동 글 생성 스크립트
 * 사용법: npx tsx scripts/generate-post.ts
 * 크론탭: 0 9 * * 1-5 cd /path/to/auction-blog && npx tsx scripts/generate-post.ts
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
  database: process.env.DATABASE_NAME || "auction_blog",
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
  bidding: ["real estate auction", "property bidding", "house auction", "real estate investment people", "property sale"],
  law:     ["lawyer office", "legal consultation", "court document", "law firm meeting", "contract signing"],
  before:  ["house inspection", "property research", "real estate search", "home checklist", "building exterior"],
  after:   ["house keys handover", "family moving home", "new home", "property handover", "moving boxes"],
  tax:     ["finance meeting", "tax documents", "financial advisor", "accounting office", "money calculation"],
  ai:      ["technology office", "computer work", "digital workspace", "data analysis", "modern office"],
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

  const queries = CATEGORY_QUERY[category] ?? ["real estate property", "building exterior"];

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
          attribution: `<a href="${photo.links.html}?utm_source=auction_blog&utm_medium=referral" rel="noopener noreferrer" style="color:rgba(255,255,255,0.9);">${photo.user.name}</a> / Unsplash`,
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

// ── 콘텐츠 내 이미지 삽입 (AI팁 섹션 제외) ────────
function injectImagesIntoContent(html: string, images: UnsplashResult[]): string {
  if (!images.length) return html;

  // AI 도구 활용 팁 섹션에는 이미지 삽입 안 함
  const AI_TIP_MARKER = "<h2>💡 AI 도구 활용 팁</h2>";
  const aiTipIdx = html.indexOf(AI_TIP_MARKER);
  const mainContent = aiTipIdx === -1 ? html : html.slice(0, aiTipIdx);
  const aiTipContent = aiTipIdx === -1 ? "" : html.slice(aiTipIdx);

  const DELIMITER = "</h2>";
  const parts = mainContent.split(DELIMITER);

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

  return parts.join(DELIMITER) + aiTipContent;
}

// ── 다음 발행할 주제 결정 ─────────────────────────
async function getNextTopic(): Promise<Topic | null> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT slug FROM posts WHERE slug REGEXP '^(basic|mid|adv)-[0-9]+$'"
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
  return `당신은 "부놈의 경매이야기" 블로그의 운영자 '부놈'입니다. 부동산 경매 전문 블로그 작가입니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}
난이도: ${topic.level}
카테고리: ${topic.category}

[작성 규칙]
1. 누구나 이해할 수 있는 쉽고 친근한 말투로 작성 (단, "중학생", "초등학생" 등 특정 연령 언급 절대 금지)
2. 반드시 존댓말(~요, ~습니다, ~세요)만 사용. 반말(~야, ~해, ~이야) 절대 금지
3. "여러분", "독자님", "친구" 등 독자를 직접 부르는 호칭 절대 사용 금지
4. 글의 첫 문장은 반드시 강한 후킹으로 시작. 의문형·충격적 사실·공감 유발 문장 중 하나로 시작
   좋은 예: "경매로 집을 살 때 가장 큰 착각은 '싸게만 사면 된다'는 생각입니다."
   좋은 예: "부동산 경매에 실패한 사람들의 공통점이 있습니다."
   나쁜 예: "안녕하세요", "여러분", "오늘은 ~에 대해 알아보겠습니다" (금지)
5. 블로그 운영자 '부놈'이 독자에게 차분하고 신뢰감 있게 설명해주는 느낌으로 작성
6. 인사말("안녕하세요", "반갑습니다", "저는 부놈입니다" 등)로 시작 절대 금지
7. 3000자 내외 (너무 짧으면 안 됨)
7. 표(<table>)와 목록(<ul><li>)을 최대한 많이 활용
8. 숫자나 비율로 설명할 수 있는 내용은 반드시 표로 만들 것
9. 어려운 개념은 쉬운 예시로 반드시 설명
10. 글의 흐름이 자연스럽게 이어지도록 작성
11. 단계별 절차(소유권이전, 명도, 세금신고, 입찰, 권리분석 등 순서가 중요한 프로세스)가 있을 때는
    반드시 아래 HTML 구조의 흐름도로 표현할 것 (4~7단계 적합):
    <div class="flow-diagram">
      <div class="flow-step"><div class="flow-num">1</div><div class="flow-body"><strong>단계명</strong><p>설명</p></div></div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step"><div class="flow-num">2</div><div class="flow-body"><strong>단계명</strong><p>설명</p></div></div>
      <div class="flow-arrow">↓</div>
      ...
    </div>
    flow-diagram 클래스는 사용 가능한 태그 목록 외의 div이지만 이 경우에만 허용됨.
11. 글 마지막에 반드시 아래 형식의 "AI 도구 활용 팁" 섹션 추가

[AI 도구 활용 팁 규칙]
- 이 주제(${topic.title})와 직접 관련된 실용적인 팁 5~8줄
- 특정 AI 도구 이름(Claude, ChatGPT, Gemini 등) 절대 언급 금지
- 반드시 "AI 도구"라고만 표기
- 실제로 복사해서 바로 쓸 수 있는 프롬프트 예시 1~2개 포함

[출력 형식 - 매우 중요]
- 순수 HTML 태그만 출력 (코드 블록, 마크다운 절대 사용 금지)
- **, ##, *, \`\`\` 같은 마크다운 기호 절대 사용 금지
- 사용 가능한 태그: <h2> <h3> <p> <ul> <ol> <li> <table> <thead> <tbody> <tr> <th> <td> <strong> <blockquote>
- <h1> 태그 사용 금지 (제목은 별도로 표시됨)
- 응답은 HTML 태그로 시작하고 HTML 태그로 끝날 것

[AI 도구 활용 팁 HTML 형식]
<h2>💡 AI 도구 활용 팁</h2>
<p>...</p>
<ul>
  <li>...</li>
</ul>
<blockquote>프롬프트 예시: "..."</blockquote>`;
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

// ── AI 팁 섹션 추출 ───────────────────────────────
function extractAiTipSection(html: string): string {
  const marker = "<h2>💡 AI 도구 활용 팁</h2>";
  const idx = html.indexOf(marker);
  return idx === -1 ? "" : html.slice(idx);
}

// ── AI 팁 별도 포스팅 저장 ────────────────────────
async function saveAiTipPost(topic: Topic, aiTipHtml: string, thumbnailUrl: string | null): Promise<number> {
  const aiSlug = `ai-tip-${topic.slug}`;
  const aiTitle = `${topic.title} — AI 도구 활용 팁`;
  const backLink = `<p style="margin-bottom:1.5em;"><a href="/posts/${topic.slug}" style="color:var(--accent);">← 원문 보러가기: ${topic.title}</a></p>`;
  const content = backLink + aiTipHtml;
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  const [result] = await pool.query<mysql.ResultSetHeader>(
    `INSERT INTO posts
      (title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at)
     VALUES (?, ?, ?, 'ai', ?, ?, ?, 'published', ?)`,
    [
      aiTitle,
      content,
      aiSlug,
      thumbnailUrl,
      `${topic.title}에서 바로 쓸 수 있는 AI 도구 활용 팁과 프롬프트 예시입니다.`,
      `AI도구활용,AI프롬프트,${topic.keywords}`,
      now,
    ]
  );
  return result.insertId;
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

    writeLog(`📝 주제 선택: [${topic.level}] ${topic.index}/130 - ${topic.title}`);

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

    // AI 팁 별도 포스팅 저장
    const aiTipHtml = extractAiTipSection(contentWithImages);
    if (aiTipHtml) {
      const aiPostId = await saveAiTipPost(topic, aiTipHtml, thumbnail?.url ?? null);
      writeLog(`🤖 AI 팁 포스팅 저장 완료 (id: ${aiPostId}, slug: ai-tip-${topic.slug})`);
      writeLog(`🌐 AI 팁 URL: ${process.env.NEXT_PUBLIC_SITE_URL}/posts/ai-tip-${topic.slug}`);
    }

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.easyhelper.kr";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.easyhelper.kr";

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
        from: "부놈의 경매이야기 <noreply@blog.easyhelper.kr>",
        to: row.email,
        subject: `[새 글] ${topic.title}`,
        html: `
          <div style="max-width:600px;margin:0 auto;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#1a1a1a;">
            <div style="padding:32px 24px;background:#0f172a;border-radius:12px 12px 0 0;">
              <h1 style="color:#f8fafc;font-size:20px;margin:0;">부놈의 경매이야기</h1>
            </div>
            <div style="padding:32px 24px;background:#ffffff;border:1px solid #e2e8f0;">
              <h2 style="font-size:22px;color:#0f172a;margin:0 0 16px;">${topic.title}</h2>
              <p style="font-size:16px;color:#475569;line-height:1.6;margin:0 0 24px;">${topic.meta_description || ""}</p>
              <a href="${postUrl}" style="display:inline-block;padding:14px 28px;background:#3b82f6;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;">글 읽으러 가기</a>
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
