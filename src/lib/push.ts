import webpush from "web-push";
import pool from "./db";
import { RowDataPacket } from "mysql2";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || "mailto:dev.kwak73@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

interface PushSubscriptionRow extends RowDataPacket {
  id: number;
  endpoint: string;
  auth_key: string;
  p256dh_key: string;
}

/** 모든 활성 구독자에게 푸시 알림 전송 */
export async function notifyAllSubscribers(payload: {
  title: string;
  body: string;
  url: string;
  icon?: string;
}) {
  const [rows] = await pool.query<PushSubscriptionRow[]>(
    "SELECT id, endpoint, auth_key, p256dh_key FROM push_subscriptions WHERE is_active = 1"
  );

  const message = JSON.stringify(payload);
  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    const subscription = {
      endpoint: row.endpoint,
      keys: { auth: row.auth_key, p256dh: row.p256dh_key },
    };

    try {
      await webpush.sendNotification(subscription, message);
      sent++;
    } catch (err: unknown) {
      const statusCode = (err as { statusCode?: number }).statusCode;
      // 410 Gone 또는 404 = 구독 만료 → 비활성화
      if (statusCode === 410 || statusCode === 404) {
        await pool.query("UPDATE push_subscriptions SET is_active = 0 WHERE id = ?", [row.id]);
      }
      failed++;
    }
  }

  return { sent, failed, total: rows.length };
}
