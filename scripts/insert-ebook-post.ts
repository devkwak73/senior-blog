/**
 * 전자책 다운로드 블로그 포스트 삽입 스크립트
 * 실행: npx tsx scripts/insert-ebook-post.ts
 */
import mysql from "mysql2/promise";
import { createHash } from "crypto";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "auction_blog",
  charset: "utf8mb4",
});

const DOWNLOAD_SECRET = process.env.ADMIN_API_KEY || "fallback-secret";

function makeToken(filename: string): string {
  return createHash("sha256")
    .update(`${filename}::${DOWNLOAD_SECRET}`)
    .digest("hex")
    .slice(0, 16);
}

const tokenVol1 = makeToken("필수 경매용어 100선 상권.pdf");
const tokenVol2 = makeToken("필수 경매용어 100선 하권.pdf");

const title = "경매 입문자 필독! 필수 경매용어 100선 전자책 무료 다운로드";
const slug = "essential-auction-terms-100-ebook";
const category = "before";
const meta_description = "부동산 경매를 시작하기 전에 꼭 알아야 할 핵심 경매용어 100개를 정리한 전자책을 무료로 다운받으세요. 상권·하권으로 나뉘어 입찰부터 명도까지 실전에 필요한 용어를 모두 다룹니다.";
const keywords = "경매용어,부동산경매,경매입문,경매사전,낙찰,유찰,배당,권리분석,임차인,대항력,말소기준권리,전자책,무료다운로드";

const content = `
<h2>경매, 용어를 알아야 시작할 수 있습니다</h2>
<p>부동산 경매에 처음 도전하시는 분들이 가장 먼저 부딪히는 벽이 바로 <strong>생소한 용어</strong>입니다. 법원 경매 사이트를 열어보면 '말소기준권리', '대항력', '배당요구종기일' 같은 단어들이 쏟아져 나옵니다. 뜻을 모른 채 입찰에 나서면 큰 손실로 이어질 수 있습니다.</p>
<p>이번에 <strong>부놈(경매하는 개발자)</strong>이 직접 정리한 「필수 경매용어 100선」 전자책을 무료로 공개합니다. 경매 절차 순서에 따라 꼭 필요한 용어만 100개 엄선하여, 초보자도 이해하기 쉽게 설명했습니다.</p>

<h2>전자책 구성</h2>
<p>전자책은 <strong>상권</strong>과 <strong>하권</strong>, 총 2권으로 구성되어 있습니다.</p>

<table>
  <thead>
    <tr><th>구분</th><th>주요 내용</th><th>수록 용어 수</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>상권</strong></td><td>경매 기초, 입찰 절차, 권리분석 핵심 용어</td><td>50개</td></tr>
    <tr><td><strong>하권</strong></td><td>배당, 명도, 세금, 실전 투자 용어</td><td>50개</td></tr>
  </tbody>
</table>

<h2>이런 분들께 추천합니다</h2>
<ul>
  <li>부동산 경매를 <strong>처음 시작</strong>하시는 분</li>
  <li>경매 강의를 듣기 전 <strong>기본기를 다지고 싶은</strong> 분</li>
  <li>권리분석 공부를 하고 있지만 <strong>용어가 헷갈리는</strong> 분</li>
  <li>경매 관련 뉴스나 판례를 읽을 때 <strong>어려움을 느끼시는</strong> 분</li>
  <li>입찰 전 <strong>체크리스트</strong>처럼 활용하고 싶은 분</li>
</ul>

<h2>수록 용어 미리보기</h2>
<p>전자책에 담긴 핵심 용어 중 일부를 소개합니다.</p>

<h3>권리분석 관련</h3>
<table>
  <thead>
    <tr><th>용어</th><th>핵심 설명</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>말소기준권리</strong></td><td>경매로 소멸되는 권리와 인수되는 권리를 가르는 기준점. 가장 먼저 설정된 (근)저당권·압류·가압류 등이 해당됩니다.</td></tr>
    <tr><td><strong>대항력</strong></td><td>임차인이 새 소유자(낙찰자)에게 자신의 임대차 권리를 주장할 수 있는 힘. 전입신고+확정일자+점유가 핵심입니다.</td></tr>
    <tr><td><strong>배당요구종기일</strong></td><td>채권자가 배당을 요구할 수 있는 마지막 날짜. 이 기한 내에 신청하지 않으면 배당에서 제외됩니다.</td></tr>
    <tr><td><strong>감정평가액</strong></td><td>법원이 선임한 감정인이 산정한 부동산의 시장가치. 최초 매각기일의 최저매각가격 기준이 됩니다.</td></tr>
  </tbody>
</table>

<h3>입찰·낙찰 관련</h3>
<table>
  <thead>
    <tr><th>용어</th><th>핵심 설명</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>최저매각가격</strong></td><td>입찰할 수 있는 최소 금액. 유찰될 때마다 통상 20~30%씩 낮아집니다.</td></tr>
    <tr><td><strong>유찰</strong></td><td>매각기일에 입찰자가 없거나 최저가 미달로 매각이 이루어지지 않는 것.</td></tr>
    <tr><td><strong>매각허가결정</strong></td><td>법원이 최고가 입찰자에게 매각을 허가하는 결정. 이후 대금납부 기한이 정해집니다.</td></tr>
    <tr><td><strong>명도</strong></td><td>낙찰 후 점유자(기존 소유자·임차인 등)를 퇴거시키고 부동산을 인도받는 절차.</td></tr>
  </tbody>
</table>

<p>이 외에도 <strong>선순위 임차인, 유치권, 법정지상권, 공유지분 경매, 배당표, 잔금납부, 소유권이전등기</strong> 등 실전에서 반드시 알아야 할 용어 100개를 모두 수록하고 있습니다.</p>

<h2>전자책 무료 다운로드</h2>
<p>아래 버튼을 클릭하시면 PDF 파일을 바로 다운받으실 수 있습니다.</p>

<div style="display:flex;flex-direction:column;gap:16px;margin:32px 0;">
  <a href="/api/downloads/${tokenVol1}" download style="display:flex;align-items:center;gap:12px;padding:20px 28px;background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:18px;box-shadow:0 4px 14px rgba(59,130,246,0.3);transition:transform 0.2s;">
    <span style="font-size:28px;">📘</span>
    <span>필수 경매용어 100선 — 상권 다운로드 (PDF)</span>
  </a>
  <a href="/api/downloads/${tokenVol2}" download style="display:flex;align-items:center;gap:12px;padding:20px 28px;background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:18px;box-shadow:0 4px 14px rgba(124,58,237,0.3);transition:transform 0.2s;">
    <span style="font-size:28px;">📕</span>
    <span>필수 경매용어 100선 — 하권 다운로드 (PDF)</span>
  </a>
</div>

<blockquote>
  <p>본 전자책은 <strong>부놈의 경매이야기</strong> 블로그 독자분들을 위해 무료로 제공됩니다. 상업적 재배포는 삼가주세요.</p>
</blockquote>

<h2>전자책 활용 팁</h2>
<ul>
  <li><strong>입찰 전 체크리스트</strong>로 활용하세요. 권리분석 시 해당 용어를 하나씩 확인하면 놓치는 부분을 줄일 수 있습니다.</li>
  <li><strong>법원 경매 사이트</strong>(대법원 경매정보)를 볼 때 모르는 용어가 나오면 바로 찾아보는 사전처럼 사용하세요.</li>
  <li>경매 스터디나 강의를 들을 때 <strong>사전 예습 자료</strong>로 활용하시면 이해도가 크게 높아집니다.</li>
  <li>태블릿이나 스마트폰에 저장해두면 현장 임장 시에도 바로 확인할 수 있어 편리합니다.</li>
</ul>

<h2>마무리</h2>
<p>경매는 용어부터 탄탄하게 다져야 안전한 투자가 가능합니다. 이 전자책이 여러분의 경매 첫걸음에 든든한 길잡이가 되길 바랍니다. 궁금하신 점은 댓글로 남겨주세요.</p>
<p>다음에는 「재개발·재건축 완전정복」 전자책도 공개할 예정이니 기대해주세요!</p>
`;

async function main() {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  // 중복 체크
  const [existing] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT id FROM posts WHERE slug = ?", [slug]
  );
  if ((existing as mysql.RowDataPacket[]).length > 0) {
    console.log("이미 같은 slug의 포스트가 존재합니다. 업데이트합니다.");
    await pool.query(
      "UPDATE posts SET title=?, content=?, category=?, meta_description=?, keywords=?, status='published', published_at=?, updated_at=? WHERE slug=?",
      [title, content.trim(), category, meta_description, keywords, now, now, slug]
    );
    console.log("✅ 포스트가 업데이트되었습니다.");
  } else {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      `INSERT INTO posts (title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at)
       VALUES (?, ?, ?, ?, NULL, ?, ?, 'published', ?)`,
      [title, content.trim(), slug, category, meta_description, keywords, now]
    );
    console.log(`✅ 포스트가 생성되었습니다. ID: ${result.insertId}`);
  }

  console.log(`📎 URL: /posts/${slug}`);
  console.log(`📥 상권 다운로드: /api/downloads/${tokenVol1}`);
  console.log(`📥 하권 다운로드: /api/downloads/${tokenVol2}`);

  await pool.end();
}

main().catch((err) => {
  console.error("❌ 에러:", err);
  process.exit(1);
});
