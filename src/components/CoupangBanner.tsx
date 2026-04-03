"use client";

interface CoupangProduct {
  name: string;
  tip: string;
  highlight: string;
  emoji: string;
  url: string;
}

const products: CoupangProduct[] = [
  {
    name: "가정용 혈압계",
    tip: "아침 기상 후, 저녁 취침 전 하루 2번 측정하면 혈압 변화를 정확히 파악할 수 있어요. 병원 갈 때 기록을 보여드리면 진료에 큰 도움이 됩니다.",
    highlight: "팔뚝형 자동 혈압계 베스트셀러",
    emoji: "💓",
    url: "https://link.coupang.com/a/ehsoc7",
  },
  {
    name: "무릎보호대",
    tip: "계단 오르내릴 때, 산책할 때 무릎이 시큰하다면 보호대가 큰 도움이 돼요. 관절을 잡아줘서 통증이 한결 덜합니다.",
    highlight: "의료용 등급 무릎 서포터",
    emoji: "🦵",
    url: "https://link.coupang.com/a/ehss2E",
  },
  {
    name: "허리보호대",
    tip: "오래 앉아 있거나 무거운 걸 들 때 허리에 무리가 오기 쉬워요. 보호대로 허리를 받쳐주면 통증 예방에 효과적입니다.",
    highlight: "정형외과 추천 허리 서포터",
    emoji: "🏋️",
    url: "https://link.coupang.com/a/ehsvie",
  },
  {
    name: "온열 찜질기",
    tip: "아침에 어깨가 뻣뻣하거나 무릎이 시릴 때, 따뜻하게 찜질하면 혈액순환이 좋아지고 통증이 줄어들어요.",
    highlight: "온도 조절 가능한 전기 찜질팩",
    emoji: "🔥",
    url: "https://link.coupang.com/a/ehsw3p",
  },
  {
    name: "안마기",
    tip: "목·어깨가 자주 뭉치고 결린다면 매일 10분씩 풀어주세요. 굳은 근육을 그대로 두면 두통이나 수면 장애로 이어질 수 있어요.",
    highlight: "목·어깨 전용 무선 안마기",
    emoji: "💆",
    url: "https://link.coupang.com/a/ehszTy",
  },
  {
    name: "오메가3",
    tip: "혈관 건강과 기억력 유지에 도움을 줘요. 식사 직후에 복용하면 흡수율이 높아집니다. 꾸준히 드시는 게 중요해요.",
    highlight: "rTG 고순도 오메가3",
    emoji: "🐟",
    url: "https://link.coupang.com/a/ehsGps",
  },
  {
    name: "요일별 약 케이스",
    tip: "약 종류가 많아지면 빼먹기 쉬워요. 요일별로 미리 넣어두면 '오늘 약 먹었나?' 고민 없이 깔끔하게 관리할 수 있습니다.",
    highlight: "아침·저녁 분리형 7일 케이스",
    emoji: "💊",
    url: "https://link.coupang.com/a/ehsHyc",
  },
  {
    name: "어르신 지팡이",
    tip: "비 오는 날이나 미끄러운 바닥에서 넘어지면 큰 부상으로 이어질 수 있어요. 가볍고 접이식인 지팡이 하나면 외출이 훨씬 안심됩니다.",
    highlight: "초경량 접이식 알루미늄 지팡이",
    emoji: "🚶",
    url: "https://link.coupang.com/a/ehsMxJ",
  },
];

export default function CoupangBanner({ category }: { category?: string }) {
  const seed = (category || "").length + Math.floor(Date.now() / 86400000);
  const product = products[seed % products.length];

  return (
    <a
      href={product.url}
      target="_blank"
      referrerPolicy="unsafe-url"
      className="coupang-inline-banner"
    >
      <div className="coupang-inline-banner__left">
        <div className="coupang-inline-banner__emoji">{product.emoji}</div>
        <div className="coupang-inline-banner__name">{product.name}</div>
        <div className="coupang-inline-banner__tip">{product.tip}</div>
        <div className="coupang-inline-banner__highlight">{product.highlight}</div>
      </div>
      <div className="coupang-inline-banner__right">
        <span className="coupang-inline-banner__cta">쿠팡에서<br />최저가 보기</span>
      </div>
      <div className="coupang-inline-banner__disclosure">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </div>
    </a>
  );
}
