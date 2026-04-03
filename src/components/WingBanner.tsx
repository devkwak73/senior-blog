"use client";

export default function WingBanner() {
  return (
    <div className="wing-banner">

      {/* 상단: 그레이트시니어 유튜브 */}
      <a
        href="https://www.youtube.com/@그레이트시니어"
        target="_blank"
        rel="noopener noreferrer"
        className="wing-card wing-card--dark"
      >
        <div className="wing-card__icon">▶️</div>
        <div className="wing-card__title">그레이트시니어</div>
        <div className="wing-card__divider" />
        <div className="wing-card__desc">
          시니어를 위한<br />유튜브 채널
        </div>
        <div className="wing-card__cta">구독하기 →</div>
      </a>

      {/* 중간: 토닥토닥 곁에 */}
      <a
        href="https://play.google.com/store/apps/details?id=com.todak.seniorsafetyguardian&hl=ko"
        target="_blank"
        rel="noopener noreferrer"
        className="wing-card wing-card--light"
      >
        <div className="wing-card__icon">📱</div>
        <div className="wing-card__title">토닥토닥 곁에</div>
        <div className="wing-card__divider" />
        <div className="wing-card__desc">
          시니어 안전<br />안드로이드 앱
        </div>
        <div className="wing-card__cta">무료 다운로드</div>
      </a>

      {/* 하단: 쿠팡파트너스 150x60 배너 */}
      <div className="wing-coupang-wrap">
        <a
          href="https://link.coupang.com/a/ehs3iE"
          target="_blank"
          referrerPolicy="unsafe-url"
          style={{ display: "block" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ads-partners.coupang.com/banners/977785?subId=&traceId=V0-301-879dd1202e5c73b2-I977785&w=150&h=60"
            alt="쿠팡파트너스 배너"
            width={150}
            height={60}
            style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
          />
        </a>
        <p className="wing-coupang-disclosure">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </div>

    </div>
  );
}
