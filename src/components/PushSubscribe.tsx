"use client";

import { useState, useEffect } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/**
 * 포스트 하단 띠배너 형태의 푸시 구독 유도 컴포넌트.
 * 페이지 진입 시 권한 요청 안 함 — 클릭했을 때만 요청.
 */
export default function PushSubscribe() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 이미 닫은 적 있으면 숨기기
    if (typeof window !== "undefined" && sessionStorage.getItem("push-dismissed")) {
      setDismissed(true);
    }
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setSupported(true);
      navigator.serviceWorker.ready.then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        setSubscribed(!!sub);
      });
    }
  }, []);

  // 지원 안 하거나 이미 구독중이거나 닫았으면 숨김
  if (!supported || subscribed || dismissed) return null;

  async function handleSubscribe() {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setSubscribed(true);
    } catch {
      // 사용자가 권한 거부 → 조용히 닫기
      handleDismiss();
    }
    setLoading(false);
  }

  function handleDismiss() {
    setDismissed(true);
    sessionStorage.setItem("push-dismissed", "1");
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      padding: "16px 20px",
      marginTop: "2rem",
      background: "linear-gradient(135deg, #1e3a5f, #0f172a)",
      borderRadius: "12px",
      border: "1px solid rgba(59,130,246,0.2)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
        <span style={{ fontSize: "24px" }}>🔔</span>
        <div>
          <p style={{ fontWeight: 700, fontSize: "14px", color: "#f8fafc", margin: 0 }}>
            새 글 알림 받기
          </p>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" }}>
            경매 노하우 새 글이 올라오면 알려드릴게요
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "..." : "알림 받기"}
        </button>
        <button
          onClick={handleDismiss}
          style={{
            padding: "8px 10px",
            background: "transparent",
            color: "#64748b",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
