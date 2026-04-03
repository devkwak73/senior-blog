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

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "토닥토닥 시니어";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;
const naverVerification = process.env.NEXT_PUBLIC_NAVER_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${siteName}`,
    default: siteName,
  },
  description: "손자가 설명하듯 쉽고 따뜻한 시니어 생활정보",
  keywords: ["시니어", "어르신", "기초연금", "건강관리", "시니어 생활정보", "노후준비", "시니어 디지털", "시니어 여행"],
  authors: [{ name: "마인드라", url: siteUrl }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "ko_KR",
    url: siteUrl,
    title: siteName,
    description: "손자가 설명하듯 쉽고 따뜻한 시니어 생활정보",
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "손자가 설명하듯 쉽고 따뜻한 시니어 생활정보",
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
