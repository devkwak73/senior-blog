import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return new NextResponse("잘못된 링크입니다.", { status: 400 });
  }

  await pool.query(
    "UPDATE newsletter_subscribers SET is_active = 0 WHERE unsubscribe_token = ?",
    [token]
  );

  return new NextResponse(
    `<!DOCTYPE html>
    <html lang="ko">
    <head><meta charset="utf-8"><title>구독 해제</title></head>
    <body style="font-family:'Apple SD Gothic Neo',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8fafc;">
      <div style="text-align:center;padding:40px;">
        <h1 style="font-size:24px;color:#0f172a;">구독이 해제되었습니다</h1>
        <p style="color:#64748b;margin-top:12px;">더 이상 이메일 알림을 받지 않습니다.</p>
        <a href="/" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#3b82f6;color:#fff;border-radius:8px;text-decoration:none;">블로그로 돌아가기</a>
      </div>
    </body>
    </html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
