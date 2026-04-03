"use client";

import { useState, useEffect } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function SubscribeCard() {
  // 푸시 상태
  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  // 이메일 상태
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailMsg, setEmailMsg] = useState("");

  // 전체 닫기
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("sub-dismissed")) {
      setDismissed(true);
    }
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setPushSupported(true);
      navigator.serviceWorker.ready.then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        setPushSubscribed(!!sub);
      });
    }
  }, []);

  if (dismissed) return null;

  async function handlePush() {
    setPushLoading(true);
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
      setPushSubscribed(true);
    } catch {
      // 권한 거부 시 무시
    }
    setPushLoading(false);
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setEmailStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailStatus("success");
        setEmailMsg("구독 완료!");
        setEmail("");
      } else {
        setEmailStatus("error");
        setEmailMsg(data.error || "오류가 발생했습니다.");
      }
    } catch {
      setEmailStatus("error");
      setEmailMsg("네트워크 오류");
    }
  }

  function handleDismiss() {
    setDismissed(true);
    sessionStorage.setItem("sub-dismissed", "1");
  }

  return (
    <div style={{
      marginTop: "2rem",
      background: "linear-gradient(135deg, #1e3a5f, #0f172a)",
      borderRadius: "12px",
      border: "1px solid rgba(59,130,246,0.2)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* 닫기 */}
      <button onClick={handleDismiss} style={{
        position: "absolute", top: "10px", right: "12px",
        background: "transparent", border: "none", color: "#64748b",
        fontSize: "14px", cursor: "pointer", padding: "4px",
      }}>✕</button>

      {/* 푸시 알림 */}
      {pushSupported && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "12px", padding: "16px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <span style={{ fontSize: "22px" }}>🔔</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: "14px", color: "#f8fafc", margin: 0 }}>
                브라우저 알림 받기
              </p>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" }}>
                새 글이 올라오면 바로 알려드려요
              </p>
            </div>
          </div>
          {pushSubscribed ? (
            <span style={{ fontSize: "13px", color: "#22c55e", fontWeight: 600 }}>구독 중 ✓</span>
          ) : (
            <button onClick={handlePush} disabled={pushLoading} style={{
              padding: "8px 16px", background: "#3b82f6", color: "#fff",
              border: "none", borderRadius: "8px", fontSize: "13px",
              fontWeight: 700, cursor: pushLoading ? "wait" : "pointer",
              flexShrink: 0,
            }}>
              {pushLoading ? "..." : "알림 받기"}
            </button>
          )}
        </div>
      )}

      {/* 구분선 */}
      {pushSupported && (
        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 20px" }} />
      )}

      {/* 이메일 구독 */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <span style={{ fontSize: "22px" }}>📬</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: "14px", color: "#f8fafc", margin: 0 }}>
              이메일로 받기
            </p>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" }}>
              이메일로도 새 글 소식을 받아보세요
            </p>
          </div>
        </div>
        {emailStatus === "success" ? (
          <p style={{ color: "#22c55e", fontSize: "13px", fontWeight: 600, margin: 0 }}>{emailMsg}</p>
        ) : (
          <form onSubmit={handleEmail} style={{ display: "flex", gap: "8px" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailStatus("idle"); }}
              placeholder="이메일 주소"
              required
              style={{
                flex: 1, padding: "9px 14px", borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
                color: "#f8fafc", fontSize: "13px", outline: "none",
              }}
            />
            <button type="submit" disabled={emailStatus === "loading"} style={{
              padding: "9px 16px", background: "#3b82f6", color: "#fff",
              border: "none", borderRadius: "8px", fontSize: "13px",
              fontWeight: 700, cursor: emailStatus === "loading" ? "wait" : "pointer",
              flexShrink: 0,
            }}>
              구독
            </button>
          </form>
        )}
        {emailStatus === "error" && (
          <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{emailMsg}</p>
        )}
      </div>
    </div>
  );
}
