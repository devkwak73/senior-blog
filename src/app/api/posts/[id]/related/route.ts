import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, slug, category, meta_description, published_at
       FROM posts
       WHERE status = 'published'
         AND category = (SELECT category FROM posts WHERE id = ?)
         AND id != ?
       ORDER BY published_at DESC
       LIMIT 2`,
      [postId, postId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/posts/[id]/related error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
