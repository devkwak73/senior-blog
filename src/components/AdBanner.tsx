"use client";

import { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "horizontal" | "rectangle";
  className?: string;
}

type AdsbyGoogleArray = { push: (obj: object) => void }[] & { push: (obj: object) => void };

declare global {
  interface Window {
    adsbygoogle: AdsbyGoogleArray;
  }
}

export default function AdBanner({ slot, format = "auto", className }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [mounted, setMounted] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !clientId || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 광고 초기화 실패 시 무시
    }
  }, [mounted, clientId, slot]);

  // SSR과 첫 클라이언트 렌더 모두 동일한 빈 div → hydration 불일치 방지
  if (!mounted || !clientId || !slot) {
    return <div className={className} style={{ minHeight: "90px" }} />;
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle${className ? ` ${className}` : ""}`}
      style={{ display: "block", width: "100%" }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
