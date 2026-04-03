import { Resend } from "resend";
import pool from "./db";
import { RowDataPacket } from "mysql2";

const resend = new Resend(process.env.RESEND_API_KEY || "");

interface SubscriberRow extends RowDataPacket {
  email: string;
  unsubscribe_token: string;
}

/** 모든 활성 구독자에게 새 글 알림 이메일 발송 */
export async function sendNewsletterToAll(post: {
  title: string;
  slug: string;
  meta_description: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.easyhelper.kr";

  const [rows] = await pool.query<SubscriberRow[]>(
    "SELECT email, unsubscribe_token FROM newsletter_subscribers WHERE is_active = 1"
  );

  if (rows.length === 0) return { sent: 0 };

  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${row.unsubscribe_token}`;
    const postUrl = `${siteUrl}/posts/${post.slug}`;

    try {
      await resend.emails.send({
        from: "부놈의 경매이야기 <noreply@blog.easyhelper.kr>",
        to: row.email,
        subject: `[새 글] ${post.title}`,
        html: `
          <div style="max-width:600px;margin:0 auto;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#1a1a1a;">
            <div style="padding:32px 24px;background:#0f172a;border-radius:12px 12px 0 0;">
              <h1 style="color:#f8fafc;font-size:20px;margin:0;">부놈의 경매이야기</h1>
            </div>
            <div style="padding:32px 24px;background:#ffffff;border:1px solid #e2e8f0;">
              <h2 style="font-size:22px;color:#0f172a;margin:0 0 16px;">${post.title}</h2>
              <p style="font-size:16px;color:#475569;line-height:1.6;margin:0 0 24px;">${post.meta_description}</p>
              <a href="${postUrl}" style="display:inline-block;padding:14px 28px;background:#3b82f6;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;">글 읽으러 가기</a>
            </div>
            <div style="padding:16px 24px;background:#f8fafc;border-radius:0 0 12px 12px;text-align:center;">
              <a href="${unsubscribeUrl}" style="font-size:13px;color:#94a3b8;text-decoration:underline;">구독 해제</a>
            </div>
          </div>
        `,
      });
      sent++;
    } catch {
      failed++;
    }
  }

  return { sent, failed, total: rows.length };
}
