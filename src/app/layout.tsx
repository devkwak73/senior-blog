import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/Footer";
import WingBanner from "@/components/WingBanner";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "부놈의 경매이야기";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;
const naverVerification = process.env.NEXT_PUBLIC_NAVER_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${siteName}`,
    default: siteName,
  },
  description: "AI로 더 쉽게, 더 스마트하게 — 부동산 경매 기초부터 실전까지",
  keywords: ["부동산 경매", "경매 입찰", "권리분석", "낙찰", "명도", "경매 세금", "AI 경매", "경매 초보"],
  authors: [{ name: "부놈", url: siteUrl }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "ko_KR",
    url: siteUrl,
    title: siteName,
    description: "AI로 더 쉽게, 더 스마트하게 — 부동산 경매 기초부터 실전까지",
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "AI로 더 쉽게, 더 스마트하게 — 부동산 경매 기초부터 실전까지",
    images: [`${siteUrl}/og-image.png`],
  },
  ...(googleVerification || naverVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(naverVerification
            ? { other: { "naver-site-verification": naverVerification } }
            : {}),
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Footer />
        <WingBanner />
        {/* 서비스워커 등록 (웹 푸시용) */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js').catch(function(){});
            }
          `}
        </Script>
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {gaId && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
