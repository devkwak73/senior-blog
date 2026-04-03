import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    const unsubscribeToken = randomBytes(32).toString("hex");

    await pool.query(
      `INSERT INTO newsletter_subscribers (email, unsubscribe_token, is_active)
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE is_active = 1, unsubscribe_token = VALUES(unsubscribe_token)`,
      [email, unsubscribeToken]
    );

    return NextResponse.json({ ok: true, message: "구독이 완료되었습니다!" });
  } catch {
    return NextResponse.json({ error: "구독 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
