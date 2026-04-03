"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("구독 완료! 새 글이 올라오면 이메일로 알려드릴게요.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "오류가 발생했습니다.");
      }
    } catch {
      setStatus("error");
      setMessage("네트워크 오류가 발생했습니다.");
    }
  }

  return (
    <div style={{ width: "100%" }}>
      {status === "success" ? (
        <p style={{ color: "#22c55e", fontSize: "14px", fontWeight: 600 }}>{message}</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder="이메일 주소"
            required
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border, #334155)",
              background: "var(--card, #1e293b)",
              color: "var(--foreground, #f8fafc)",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              padding: "10px 18px",
              background: "var(--primary, #3b82f6)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: status === "loading" ? "wait" : "pointer",
              opacity: status === "loading" ? 0.7 : 1,
              whiteSpace: "nowrap",
            }}
          >
            구독
          </button>
        </form>
      )}
      {status === "error" && (
        <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "6px" }}>{message}</p>
      )}
    </div>
  );
}
