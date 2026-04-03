import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { endpoint, keys } = await request.json();

    if (!endpoint || !keys?.auth || !keys?.p256dh) {
      return NextResponse.json({ error: "잘못된 구독 정보입니다." }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO push_subscriptions (endpoint, auth_key, p256dh_key, is_active)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE auth_key = VALUES(auth_key), p256dh_key = VALUES(p256dh_key), is_active = 1`,
      [endpoint, keys.auth, keys.p256dh]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "구독 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json();
    if (!endpoint) {
      return NextResponse.json({ error: "endpoint가 필요합니다." }, { status: 400 });
    }

    await pool.query("UPDATE push_subscriptions SET is_active = 0 WHERE endpoint = ?", [endpoint]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "구독 해제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
