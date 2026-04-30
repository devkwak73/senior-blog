import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const revalidate = 3600;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteName = "토닥토닥 시니어";
  const siteDescription = "손자가 설명하듯 쉽고 따뜻한 시니어 생활정보";

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT title, slug, meta_description, category, published_at, updated_at
     FROM posts
     WHERE status = 'published'
     ORDER BY published_at DESC
     LIMIT 50`
  );

  const buildDate = new Date().toUTCString();
  const items = rows
    .map((p) => {
      const url = `${siteUrl}/posts/${p.slug}`;
      const pubDate = p.published_at
        ? new Date(p.published_at).toUTCString()
        : new Date(p.updated_at).toUTCString();
      const desc = p.meta_description || "";
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(desc)}</description>
      <category>${escapeXml(p.category || "")}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
