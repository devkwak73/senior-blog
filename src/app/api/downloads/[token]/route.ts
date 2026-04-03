import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { createHash } from "crypto";

/**
 * 토큰 기반 전자책 다운로드 API
 *
 * - 파일은 data/ebooks/ 에 저장 (public/ 밖이라 직접 URL 접근 불가)
 * - 토큰은 파일명 + 시크릿의 SHA-256 해시 앞 16자
 * - 토큰을 모르면 다운로드 불가능
 */

const DOWNLOAD_SECRET = process.env.ADMIN_API_KEY || "fallback-secret";

// 등록된 전자책 목록
const EBOOK_REGISTRY: Record<string, { filename: string; displayName: string }> = {};

// 파일명으로 토큰 생성
function makeToken(filename: string): string {
  return createHash("sha256")
    .update(`${filename}::${DOWNLOAD_SECRET}`)
    .digest("hex")
    .slice(0, 16);
}

// 레지스트리 초기화 (파일명 → 토큰 매핑)
function initRegistry() {
  if (Object.keys(EBOOK_REGISTRY).length > 0) return;

  const ebooks = [
    { filename: "필수 경매용어 100선 상권.pdf", displayName: "필수 경매용어 100선 상권.pdf" },
    { filename: "필수 경매용어 100선 하권.pdf", displayName: "필수 경매용어 100선 하권.pdf" },
    { filename: "재개발 재건축 완전정복.pdf", displayName: "재개발 재건축 완전정복.pdf" },
  ];

  for (const eb of ebooks) {
    const token = makeToken(eb.filename);
    EBOOK_REGISTRY[token] = eb;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  initRegistry();

  const { token } = await params;
  const entry = EBOOK_REGISTRY[token];

  if (!entry) {
    return NextResponse.json({ error: "유효하지 않은 다운로드 링크입니다." }, { status: 404 });
  }

  // Referer 체크 — 블로그 내부에서만 다운로드 허용
  const referer = request.headers.get("referer") || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (referer && !referer.startsWith(siteUrl)) {
    return NextResponse.json({ error: "허용되지 않은 접근입니다." }, { status: 403 });
  }

  try {
    const filePath = join(process.cwd(), "data", "ebooks", entry.filename);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(entry.displayName)}`,
        "Content-Length": String(fileBuffer.length),
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
  }
}
