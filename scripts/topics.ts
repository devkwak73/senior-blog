export interface Topic {
  index: number;       // 전체 순번 (1~120)
  slug: string;        // DB slug (health-001 형식)
  category: string;    // DB category 값
  title: string;
  keywords: string;
  meta_description: string;
}

const healthTopics: Omit<Topic, "index" | "slug">[] = [
  { category: "health", title: "무릎이 시리면 관절염인가요? 초기 증상 자가진단법", keywords: "관절염,무릎통증,관절염초기증상,자가진단", meta_description: "무릎이 시리고 아플 때 관절염인지 아닌지 스스로 확인하는 자가진단 방법과 초기 증상을 알기 쉽게 설명합니다." },
  { category: "health", title: "당뇨 초기 관리, 약 안 먹고 시작하는 방법", keywords: "당뇨초기,혈당관리,당뇨식이요법,생활습관", meta_description: "당뇨 초기 단계에서 약물 없이 식이요법과 운동으로 혈당을 관리하는 구체적인 방법을 안내합니다." },
  { category: "health", title: "고혈압 낮추는 생활습관 5가지", keywords: "고혈압,혈압낮추기,생활습관,고혈압관리", meta_description: "고혈압 환자가 일상에서 실천할 수 있는 혈압을 낮추는 생활습관 5가지를 구체적으로 정리합니다." },
  { category: "health", title: "치매 초기 증상과 예방법 총정리", keywords: "치매,치매초기증상,치매예방,인지기능", meta_description: "치매의 초기 증상을 놓치지 않고 확인하는 법과 일상에서 실천 가능한 치매 예방법을 총정리합니다." },
  { category: "health", title: "어깨가 안 올라가요, 오십견 자가 체크와 스트레칭", keywords: "오십견,어깨통증,어깨스트레칭,오십견운동", meta_description: "어깨가 잘 안 올라갈 때 오십견인지 확인하는 방법과 집에서 할 수 있는 스트레칭 동작을 알려드립니다." },
  { category: "health", title: "걷기 운동, 하루 몇 보가 적당할까?", keywords: "걷기운동,시니어운동,하루걸음수,건강걷기", meta_description: "시니어에게 적합한 하루 걷기 운동량과 올바른 걷기 자세, 무릎 보호 방법을 안내합니다." },
  { category: "health", title: "60대 이후 꼭 받아야 할 건강검진 항목", keywords: "건강검진,시니어건강검진,검진항목,60대건강", meta_description: "60대 이상이 매년 꼭 챙겨야 할 건강검진 항목과 무료 검진 혜택을 정리합니다." },
  { category: "health", title: "눈이 침침할 때, 백내장과 녹내장 구별법", keywords: "백내장,녹내장,눈건강,시력저하", meta_description: "나이 들면서 눈이 침침해질 때 백내장인지 녹내장인지 구별하는 방법과 치료 시기를 설명합니다." },
  { category: "health", title: "골다공증 예방, 칼슘만 먹으면 될까?", keywords: "골다공증,칼슘,뼈건강,비타민D", meta_description: "골다공증 예방을 위해 칼슘 외에 꼭 알아야 할 영양소와 생활습관을 정리합니다." },
  { category: "health", title: "허리 아플 때 해야 할 것과 하면 안 되는 것", keywords: "허리통증,요통,척추건강,허리운동", meta_description: "허리가 아플 때 병원 가기 전 집에서 해야 할 것과 절대 하면 안 되는 행동을 구분해 알려드립니다." },
  { category: "health", title: "소화가 안 될 때, 시니어 위장 건강 지키는 법", keywords: "소화불량,위장건강,소화기관,시니어식사", meta_description: "나이가 들면서 약해지는 소화 기능을 개선하는 식사 습관과 생활 수칙을 안내합니다." },
  { category: "health", title: "시니어를 위한 근력 운동 입문 가이드", keywords: "근력운동,시니어운동,근감소증,홈트레이닝", meta_description: "근감소증을 예방하기 위해 시니어가 집에서 안전하게 시작할 수 있는 근력 운동을 소개합니다." },
  { category: "health", title: "만성 기침이 2주 이상 지속될 때 의심 질환", keywords: "만성기침,기침원인,폐건강,호흡기질환", meta_description: "기침이 2주 넘게 계속될 때 의심해볼 수 있는 질환과 병원 방문 시기를 안내합니다." },
  { category: "health", title: "시니어 독감·폐렴 예방접종 시기와 종류", keywords: "독감예방접종,폐렴백신,시니어백신,무료접종", meta_description: "시니어가 꼭 맞아야 할 독감·폐렴 예방접종의 종류와 무료 접종 시기를 정리합니다." },
  { category: "health", title: "약 여러 개 먹을 때 주의할 점, 다약제 복용 가이드", keywords: "다약제복용,약물상호작용,복약관리,약먹는법", meta_description: "여러 가지 약을 동시에 복용할 때 주의해야 할 약물 상호작용과 안전한 복약 관리법을 설명합니다." },
];

const subsidyTopics: Omit<Topic, "index" | "slug">[] = [
  { category: "subsidy", title: "2026년 기초연금 수급 조건과 신청 방법 총정리", keywords: "기초연금,기초연금신청,수급조건,노인연금", meta_description: "2026년 기초연금 수급 조건, 금액, 신청 방법을 한 번에 정리합니다. 소득인정액 기준도 쉽게 설명합니다." },
  { category: "subsidy", title: "에너지바우처 신청 방법 완벽 가이드", keywords: "에너지바우처,난방비지원,에너지바우처신청,겨울지원금", meta_description: "겨울 난방비 부담을 줄여주는 에너지바우처의 신청 자격과 방법을 단계별로 안내합니다." },
  { category: "subsidy", title: "시니어 일자리 지원 프로그램 한눈에 보기", keywords: "시니어일자리,노인일자리,일자리지원,취업프로그램", meta_description: "정부와 지자체에서 운영하는 시니어 일자리 지원 프로그램의 종류와 신청 방법을 한눈에 정리합니다." },
  { category: "subsidy", title: "노인 장기요양보험 등급 신청 방법과 혜택", keywords: "장기요양보험,요양등급,요양급여,등급신청", meta_description: "장기요양보험 등급 판정 기준과 신청 절차, 등급별 받을 수 있는 혜택을 쉽게 설명합니다." },
  { category: "subsidy", title: "긴급복지지원제도, 갑자기 어려워졌을 때 받는 법", keywords: "긴급복지지원,긴급생활지원,복지급여,위기상황지원", meta_description: "갑작스러운 위기 상황에서 긴급복지지원을 받는 방법과 지원 내용을 빠르게 안내합니다." },
  { category: "subsidy", title: "시니어 교통비 할인 혜택 총정리", keywords: "교통비할인,시니어교통,경로우대,지하철무료", meta_description: "시니어가 받을 수 있는 지하철, 버스, KTX 등 교통비 할인 혜택을 종류별로 정리합니다." },
  { category: "subsidy", title: "틀니·임플란트 건강보험 적용 받는 방법", keywords: "틀니보험,임플란트보험,치과보험,시니어치과", meta_description: "65세 이상 어르신이 틀니와 임플란트 시술 시 건강보험 적용받는 조건과 본인부담금을 안내합니다." },
  { category: "subsidy", title: "기초생활수급자 조건과 신청 절차 쉽게 알아보기", keywords: "기초생활수급자,기초수급,생계급여,의료급여", meta_description: "기초생활수급자가 되기 위한 조건과 신청 절차, 받을 수 있는 급여 종류를 쉽게 설명합니다." },
  { category: "subsidy", title: "주거급여 신청 조건과 지원 금액 알아보기", keywords: "주거급여,주거지원,임차료지원,주거복지", meta_description: "주거급여 신청 자격과 지역별 지원 금액, 신청 방법을 단계별로 안내합니다." },
  { category: "subsidy", title: "시니어 문화·여가 할인 혜택 모음", keywords: "문화할인,시니어할인,영화할인,여가혜택", meta_description: "영화관, 미술관, 국립공원 등 시니어가 할인받을 수 있는 문화·여가 혜택을 모아 정리합니다." },
  { category: "subsidy", title: "보청기 정부 지원금 받는 방법", keywords: "보청기지원,보청기보조금,청력보조,보청기구입", meta_description: "보청기 구입 시 정부 지원금을 받는 조건과 절차, 지원 금액을 알기 쉽게 안내합니다." },
  { category: "subsidy", title: "노인 돌봄 서비스 종류와 신청 방법", keywords: "노인돌봄,돌봄서비스,방문돌봄,노인복지", meta_description: "혼자 사는 어르신을 위한 돌봄 서비스의 종류와 신청 방법, 이용 비용을 정리합니다." },
  { category: "subsidy", title: "시니어 무료 건강검진 대상과 검사 항목", keywords: "무료건강검진,국가건강검진,시니어검진,검진대상", meta_description: "시니어가 무료로 받을 수 있는 국가 건강검진의 대상 조건과 검사 항목을 정리합니다." },
  { category: "subsidy", title: "국민연금과 기초연금 동시 수령할 수 있을까?", keywords: "국민연금,기초연금,연금중복,연금수령", meta_description: "국민연금을 받으면서 기초연금도 받을 수 있는지, 감액 기준은 어떻게 되는지 명확히 설명합니다." },
  { category: "subsidy", title: "시니어를 위한 정부 지원금 한눈에 보는 체크리스트", keywords: "정부지원금,시니어혜택,복지혜택,지원금총정리", meta_description: "시니어가 놓치기 쉬운 정부 지원금과 혜택을 한 장의 체크리스트로 모아 정리합니다." },
];

const moneyTopics: Omit<Topic, "index" | "slug">[] = [
  { category: "money", title: "국민연금 수령액 늘리는 5가지 방법", keywords: "국민연금,연금수령액,연금늘리기,노후자금", meta_description: "국민연금 수령액을 합법적으로 늘릴 수 있는 5가지 구체적인 방법을 알기 쉽게 설명합니다." },
  { category: "money", title: "상속세 줄이는 합법적인 절세 전략", keywords: "상속세,절세전략,상속세계산,세금절약", meta_description: "상속세 부담을 합법적으로 줄이는 절세 방법과 미리 준비해야 할 사항을 정리합니다." },
  { category: "money", title: "보이스피싱 피해 예방과 대처법", keywords: "보이스피싱,전화사기,피싱예방,금융사기", meta_description: "시니어를 노리는 보이스피싱의 주요 수법과 예방법, 피해 시 즉시 대처하는 방법을 안내합니다." },
  { category: "money", title: "시니어 정기예금 vs 적금, 어디에 넣는 게 유리할까?", keywords: "정기예금,적금,시니어재테크,예금금리", meta_description: "시니어에게 유리한 예금과 적금의 차이를 비교하고 상황별 추천 상품을 안내합니다." },
  { category: "money", title: "주택연금이란? 집을 담보로 매달 연금 받기", keywords: "주택연금,역모기지,주택담보연금,노후자금", meta_description: "주택연금의 개념과 가입 조건, 매달 받을 수 있는 금액을 구체적인 예시로 설명합니다." },
  { category: "money", title: "자녀에게 용돈 줄 때도 증여세를 내야 하나요?", keywords: "증여세,자녀증여,증여한도,세금", meta_description: "자녀나 손주에게 용돈이나 목돈을 줄 때 증여세가 부과되는 기준과 면세 한도를 설명합니다." },
  { category: "money", title: "퇴직금 일시금 vs 연금 수령, 어떤 게 유리할까?", keywords: "퇴직금,퇴직연금,일시금수령,연금수령", meta_description: "퇴직금을 한꺼번에 받을지 연금으로 받을지 세금과 수익 측면에서 비교 분석합니다." },
  { category: "money", title: "시니어 통신비 절약하는 방법 총정리", keywords: "통신비절약,시니어요금제,알뜰폰,휴대폰요금", meta_description: "시니어에게 맞는 알뜰 요금제와 통신비 할인 혜택을 활용하는 방법을 정리합니다." },
  { category: "money", title: "건강보험료 줄이는 합법적인 방법", keywords: "건강보험료,보험료절감,피부양자,보험료줄이기", meta_description: "은퇴 후 늘어나는 건강보험료를 합법적으로 줄이는 방법과 피부양자 자격 조건을 설명합니다." },
  { category: "money", title: "시니어 맞춤 보험, 꼭 필요한 것만 골라 가입하기", keywords: "시니어보험,실비보험,보험가입,보험추천", meta_description: "시니어에게 꼭 필요한 보험과 불필요한 보험을 구분하고 현명하게 가입하는 방법을 안내합니다." },
  { category: "money", title: "은퇴 후 생활비, 한 달에 얼마 필요할까?", keywords: "은퇴생활비,노후자금,생활비계산,노후설계", meta_description: "은퇴 후 실제로 필요한 한 달 생활비를 항목별로 계산하고 부족분을 준비하는 방법을 안내합니다." },
  { category: "money", title: "시니어 대상 금융 사기 유형과 예방법", keywords: "금융사기,시니어사기,투자사기,사기예방", meta_description: "시니어를 주요 타깃으로 하는 금융 사기의 대표 유형과 피해를 예방하는 구체적 방법을 정리합니다." },
  { category: "money", title: "소득공제와 세액공제, 시니어가 챙겨야 할 연말정산", keywords: "소득공제,세액공제,연말정산,시니어세금", meta_description: "시니어가 놓치기 쉬운 소득공제·세액공제 항목과 연말정산에서 환급받는 방법을 안내합니다." },
  { category: "money", title: "재산 정리, 미리 준비하는 똑똑한 방법", keywords: "재산정리,자산관리,상속준비,노후재산", meta_description: "나이가 들기 전에 재산을 체계적으로 정리하고 가족에게 부담을 줄이는 방법을 설명합니다." },
  { category: "money", title: "농협·우체국 시니어 우대 금융상품 비교", keywords: "시니어금융,농협우대,우체국저축,시니어예금", meta_description: "농협과 우체국에서 시니어에게 우대 금리를 제공하는 예금·적금 상품을 비교 정리합니다." },
];

const travelTopics: Omit<Topic, "index" | "slug">[] = [
  { category: "travel", title: "무릎 편한 둘레길 TOP 10 추천", keywords: "둘레길추천,무릎편한길,시니어산책,걷기좋은길", meta_description: "무릎에 부담이 적으면서 풍경이 아름다운 전국 둘레길 TOP 10을 코스별로 소개합니다." },
  { category: "travel", title: "시니어 맞춤 제주도 3박 4일 여행 코스", keywords: "제주도여행,시니어여행,제주코스,제주맞춤여행", meta_description: "무리하지 않으면서 제주도의 핵심 명소를 편하게 즐기는 3박 4일 여행 코스를 소개합니다." },
  { category: "travel", title: "온천 여행 추천 BEST 5", keywords: "온천여행,온천추천,온천리조트,시니어온천", meta_description: "전국 온천 여행지 중 시니어에게 인기 있는 곳 BEST 5를 숙소와 교통 정보까지 정리합니다." },
  { category: "travel", title: "혼자 떠나도 좋은 시니어 국내 여행지 추천", keywords: "혼자여행,시니어혼자여행,국내여행,나홀로여행", meta_description: "혼자서도 안전하고 편하게 즐길 수 있는 국내 시니어 추천 여행지를 엄선해 소개합니다." },
  { category: "travel", title: "경주 2박 3일 느린 여행, 역사와 힐링 코스", keywords: "경주여행,경주코스,역사여행,시니어경주", meta_description: "서두르지 않고 경주의 역사 명소와 힐링 공간을 즐기는 2박 3일 느린 여행 코스를 안내합니다." },
  { category: "travel", title: "시니어 해외여행 준비 체크리스트", keywords: "해외여행준비,시니어해외여행,여행체크리스트,여행준비물", meta_description: "시니어 해외여행 시 건강, 보험, 준비물 등 꼭 챙겨야 할 항목을 체크리스트로 정리합니다." },
  { category: "travel", title: "기차로 떠나는 느린 여행, KTX·ITX 추천 코스", keywords: "기차여행,KTX여행,ITX여행,시니어기차", meta_description: "운전 없이 KTX와 ITX를 타고 편하게 떠나는 추천 기차 여행 코스를 소개합니다." },
  { category: "travel", title: "전국 사찰 템플스테이 추천 BEST 5", keywords: "템플스테이,사찰여행,사찰추천,힐링여행", meta_description: "마음을 쉬게 해주는 전국 사찰 템플스테이 추천 5곳과 참여 방법을 안내합니다." },
  { category: "travel", title: "시니어 단체 여행 프로그램 찾는 법", keywords: "단체여행,시니어단체,패키지여행,여행프로그램", meta_description: "시니어를 위한 단체 여행 프로그램을 찾고 신청하는 방법과 주의사항을 정리합니다." },
  { category: "travel", title: "봄꽃 여행, 벚꽃·진달래 명소 추천", keywords: "봄꽃여행,벚꽃명소,진달래,봄여행", meta_description: "봄에 떠나기 좋은 벚꽃과 진달래 명소를 개화 시기와 함께 지역별로 추천합니다." },
  { category: "travel", title: "가을 단풍 여행, 전국 단풍 명소 총정리", keywords: "단풍여행,단풍명소,가을여행,단풍시기", meta_description: "전국 단풍 명소를 단풍 절정 시기와 함께 정리하고 시니어에게 편한 코스를 추천합니다." },
  { category: "travel", title: "시니어를 위한 섬 여행 추천, 배 타고 떠나는 힐링", keywords: "섬여행,시니어섬여행,국내섬,섬추천", meta_description: "접근성이 좋고 경치 좋은 국내 섬 여행지를 교통편과 함께 추천합니다." },
  { category: "travel", title: "여행 중 건강 지키는 법, 시니어 여행 건강 수칙", keywords: "여행건강,시니어건강,여행주의사항,건강수칙", meta_description: "여행 중 체력 관리, 약 복용, 응급 상황 대처 등 시니어가 지켜야 할 건강 수칙을 안내합니다." },
  { category: "travel", title: "전국 수목원·식물원 나들이 추천 BEST 7", keywords: "수목원,식물원,나들이,시니어나들이", meta_description: "평지가 많아 걷기 편한 전국 수목원·식물원 7곳을 입장료, 교통편과 함께 추천합니다." },
  { category: "travel", title: "부부가 함께 떠나는 느린 여행 코스 추천", keywords: "부부여행,시니어부부,느린여행,부부여행코스", meta_description: "은퇴 후 부부가 함께 느긋하게 즐길 수 있는 국내 여행 코스를 엄선해 소개합니다." },
];

const digitalTopics: Omit<Topic, "index" | "slug">[] = [
  { category: "digital", title: "스마트폰 글씨 크기 키우는 방법 완전 가이드", keywords: "글씨크기,스마트폰설정,화면확대,큰글씨", meta_description: "스마트폰 화면의 글씨를 크게 키우는 방법을 삼성·아이폰별로 캡처 화면과 함께 안내합니다." },
  { category: "digital", title: "키오스크 무서워하지 마세요! 주문 방법 따라하기", keywords: "키오스크,무인주문기,키오스크사용법,주문방법", meta_description: "식당, 카페, 영화관 키오스크에서 당황하지 않고 주문하는 방법을 단계별로 따라합니다." },
  { category: "digital", title: "카카오톡 사진 보내기·영상통화 하는 법", keywords: "카카오톡,사진보내기,영상통화,카톡사용법", meta_description: "카카오톡으로 사진을 보내고 영상통화를 거는 방법을 처음부터 차근차근 설명합니다." },
  { category: "digital", title: "스마트폰으로 사진 잘 찍는 5가지 팁", keywords: "스마트폰사진,사진찍는법,사진팁,폰카메라", meta_description: "스마트폰 카메라로 인물, 풍경, 음식 사진을 예쁘게 찍는 간단한 팁 5가지를 소개합니다." },
  { category: "digital", title: "네이버 지도로 길 찾기·버스 시간 확인하기", keywords: "네이버지도,길찾기,버스시간,교통앱", meta_description: "네이버 지도 앱으로 목적지까지 길을 찾고 버스·지하철 시간을 확인하는 방법을 안내합니다." },
  { category: "digital", title: "유튜브 보는 법과 좋아하는 영상 저장하는 법", keywords: "유튜브,유튜브사용법,영상보기,유튜브저장", meta_description: "유튜브에서 원하는 영상을 찾아보고 나중에 다시 볼 수 있게 저장하는 방법을 설명합니다." },
  { category: "digital", title: "스마트폰 배터리 오래 쓰는 설정법", keywords: "배터리절약,스마트폰배터리,배터리설정,충전", meta_description: "스마트폰 배터리를 오래 쓸 수 있게 해주는 설정 방법과 올바른 충전 습관을 알려드립니다." },
  { category: "digital", title: "스마트폰에 쌓인 사진·파일 정리하는 방법", keywords: "사진정리,파일정리,스마트폰용량,저장공간", meta_description: "스마트폰 저장 공간이 부족할 때 불필요한 사진과 파일을 정리하는 방법을 안내합니다." },
  { category: "digital", title: "모바일 뱅킹 처음 시작하는 방법 (송금·조회)", keywords: "모바일뱅킹,인터넷뱅킹,송금방법,계좌조회", meta_description: "은행 앱을 설치하고 계좌 조회, 이체까지 모바일 뱅킹을 처음 시작하는 방법을 안내합니다." },
  { category: "digital", title: "정부24·복지로 앱으로 서류 발급·복지 신청하기", keywords: "정부24,복지로,서류발급,온라인신청", meta_description: "정부24와 복지로 앱을 활용해 주민등록등본 발급, 복지 서비스 신청하는 방법을 안내합니다." },
  { category: "digital", title: "스팸 전화·문자 차단하는 방법", keywords: "스팸차단,스팸전화,스팸문자,전화차단", meta_description: "귀찮은 스팸 전화와 문자를 효과적으로 차단하는 스마트폰 설정과 앱 활용법을 알려드립니다." },
  { category: "digital", title: "카카오택시 부르는 법과 결제 방법", keywords: "카카오택시,택시호출,택시앱,택시부르기", meta_description: "카카오택시 앱으로 택시를 부르고 결제하는 전체 과정을 처음부터 따라하며 설명합니다." },
  { category: "digital", title: "스마트폰 와이파이 연결하는 방법", keywords: "와이파이,Wi-Fi연결,인터넷연결,와이파이설정", meta_description: "집이나 카페에서 스마트폰을 와이파이에 연결하는 방법을 간단하게 설명합니다." },
  { category: "digital", title: "QR코드 찍는 법과 활용하는 방법", keywords: "QR코드,QR코드스캔,QR사용법,큐알코드", meta_description: "스마트폰으로 QR코드를 찍는 방법과 출입, 결제, 메뉴판 등 일상에서 활용하는 법을 안내합니다." },
  { category: "digital", title: "스마트폰 글씨 입력, 음성으로 편하게 하는 법", keywords: "음성입력,음성인식,스마트폰음성,말로입력", meta_description: "작은 키보드 대신 음성으로 문자와 검색어를 편하게 입력하는 방법을 설명합니다." },
];

const foodTopics: Omit<Topic, "index" | "slug">[] = [
  { category: "food", title: "고혈압에 좋은 저염식 반찬 레시피 5가지", keywords: "저염식,고혈압식단,저염반찬,건강반찬", meta_description: "싱겁지만 맛있는 고혈압 관리용 저염식 반찬 레시피 5가지를 재료부터 조리법까지 소개합니다." },
  { category: "food", title: "당뇨 환자를 위한 일주일 식단표", keywords: "당뇨식단,혈당관리식단,당뇨밥상,일주일식단", meta_description: "당뇨 환자가 혈당을 안정적으로 관리할 수 있는 일주일 식단표를 아침·점심·저녁으로 구성합니다." },
  { category: "food", title: "혼자 사는 어르신을 위한 간편 한끼 레시피", keywords: "간편식,혼밥레시피,시니어요리,간단요리", meta_description: "혼자 사는 어르신이 쉽고 빠르게 만들어 먹을 수 있는 영양 만점 간편 한끼 레시피를 소개합니다." },
  { category: "food", title: "관절에 좋은 음식과 피해야 할 음식", keywords: "관절음식,관절건강,관절영양,항염식품", meta_description: "관절 건강을 지키는 데 도움이 되는 음식과 염증을 악화시키는 피해야 할 음식을 정리합니다." },
  { category: "food", title: "면역력 높이는 시니어 영양 간식 5가지", keywords: "면역력간식,시니어간식,영양간식,건강간식", meta_description: "면역력을 높여주는 시니어 맞춤 영양 간식 5가지를 만드는 법과 효능을 소개합니다." },
  { category: "food", title: "제철 식재료로 만드는 봄·여름 건강 밥상", keywords: "제철음식,봄식재료,여름식재료,건강밥상", meta_description: "봄과 여름 제철 식재료를 활용해 영양가 높은 건강 밥상을 차리는 레시피를 소개합니다." },
  { category: "food", title: "제철 식재료로 만드는 가을·겨울 건강 밥상", keywords: "가을음식,겨울음식,제철요리,건강식단", meta_description: "가을과 겨울 제철 식재료로 만드는 따뜻하고 영양 풍부한 건강 밥상 레시피를 안내합니다." },
  { category: "food", title: "소화 잘 되는 부드러운 음식 레시피 모음", keywords: "소화잘되는음식,부드러운음식,죽레시피,위장건강", meta_description: "소화 기능이 약해진 시니어를 위한 부드럽고 소화 잘 되는 음식 레시피를 모아 소개합니다." },
  { category: "food", title: "시니어를 위한 단백질 보충 식단", keywords: "단백질식단,근감소증예방,단백질음식,시니어영양", meta_description: "근감소증을 예방하기 위해 시니어에게 필요한 단백질 섭취량과 단백질이 풍부한 식단을 소개합니다." },
  { category: "food", title: "건강한 김치 담그기, 저염 김치 레시피", keywords: "저염김치,건강김치,김치담그기,저염식", meta_description: "나트륨은 줄이면서 맛은 살린 건강한 저염 김치 담그는 방법을 단계별로 안내합니다." },
  { category: "food", title: "뼈 건강 지키는 칼슘 가득 레시피 5가지", keywords: "칼슘음식,뼈건강식단,골다공증식단,칼슘레시피", meta_description: "골다공증 예방에 도움이 되는 칼슘이 풍부한 음식과 레시피 5가지를 소개합니다." },
  { category: "food", title: "전자레인지로 뚝딱 만드는 초간단 요리 5선", keywords: "전자레인지요리,초간단요리,간편요리,쉬운레시피", meta_description: "불 없이 전자레인지만으로 간편하게 만들 수 있는 건강한 요리 5가지를 소개합니다." },
  { category: "food", title: "약이 되는 차, 시니어 건강차 가이드", keywords: "건강차,시니어차,약차,한방차", meta_description: "시니어에게 좋은 건강차의 종류와 효능, 올바른 마시는 방법을 증상별로 안내합니다." },
  { category: "food", title: "시니어 영양제, 꼭 먹어야 할 것 vs 불필요한 것", keywords: "시니어영양제,비타민추천,영양보충제,건강보조식품", meta_description: "시니어에게 꼭 필요한 영양제와 효과가 불분명한 영양제를 구분해 정리합니다." },
  { category: "food", title: "손주와 함께 만드는 건강 간식 레시피", keywords: "손주간식,건강간식만들기,가족요리,아이간식", meta_description: "손주와 함께 만들 수 있는 건강하고 재미있는 간식 레시피를 소개합니다." },
];

const mindTopics: Omit<Topic, "index" | "slug">[] = [
  { category: "mind", title: "혼자 있는 시간이 불안할 때, 외로움 극복법", keywords: "외로움,외로움극복,혼자사는어르신,고독감", meta_description: "혼자 있는 시간이 불안하고 외로울 때 마음을 다스리고 외로움을 극복하는 구체적 방법을 안내합니다." },
  { category: "mind", title: "잠이 안 올 때 해볼 수 있는 7가지 방법", keywords: "불면증,수면건강,잠안올때,수면습관", meta_description: "밤에 잠이 잘 오지 않을 때 시도해볼 수 있는 7가지 자연스러운 수면 개선 방법을 소개합니다." },
  { category: "mind", title: "은퇴 후 부부 관계, 함께 행복하게 사는 비결", keywords: "부부관계,은퇴부부,부부행복,황혼부부", meta_description: "은퇴 후 함께 보내는 시간이 늘어난 부부가 서로 존중하며 행복하게 사는 비결을 알려드립니다." },
  { category: "mind", title: "우울한 기분이 계속될 때, 노년기 우울증 자가진단", keywords: "노년우울증,우울증자가진단,시니어우울,마음건강", meta_description: "노년기 우울증의 증상과 자가진단 방법, 전문 도움을 받아야 할 시기를 안내합니다." },
  { category: "mind", title: "화가 자주 나고 짜증이 늘었을 때 감정 다스리는 법", keywords: "감정조절,분노관리,짜증,감정다스리기", meta_description: "나이 들면서 감정 조절이 어려워질 때 화와 짜증을 건강하게 다스리는 방법을 소개합니다." },
  { category: "mind", title: "배우자를 떠나보낸 후, 상실감 극복하기", keywords: "배우자사별,상실감,사별극복,애도", meta_description: "배우자를 먼저 떠나보낸 후 찾아오는 상실감과 슬픔을 건강하게 극복하는 방법을 안내합니다." },
  { category: "mind", title: "손주 돌봄 스트레스, 나도 쉬어야 합니다", keywords: "손주돌봄,육아스트레스,조부모돌봄,돌봄스트레스", meta_description: "손주를 돌보면서 쌓이는 스트레스를 인정하고 자신을 위한 쉼을 찾는 방법을 이야기합니다." },
  { category: "mind", title: "시니어를 위한 명상 입문, 하루 10분의 기적", keywords: "명상,시니어명상,마음챙김,명상방법", meta_description: "명상이 처음인 시니어도 쉽게 따라할 수 있는 하루 10분 명상법을 단계별로 안내합니다." },
  { category: "mind", title: "새로운 취미 시작하기, 시니어 추천 취미 10가지", keywords: "시니어취미,취미추천,은퇴후취미,새로운취미", meta_description: "은퇴 후 삶에 활력을 주는 시니어 추천 취미 10가지를 비용과 시작 방법과 함께 소개합니다." },
  { category: "mind", title: "자녀와의 관계가 서먹해졌을 때, 대화 다시 시작하기", keywords: "자녀관계,부모자녀대화,가족관계,소통방법", meta_description: "성인 자녀와 관계가 서먹해졌을 때 다시 가까워지기 위한 대화법과 마음가짐을 안내합니다." },
  { category: "mind", title: "은퇴 후 삶의 의미 찾기, 제2의 인생 설계", keywords: "은퇴후삶,인생이모작,삶의의미,제2인생", meta_description: "은퇴 후 무기력함을 벗어나 새로운 삶의 의미와 보람을 찾는 방법을 이야기합니다." },
  { category: "mind", title: "노년기 불안장애, 걱정이 멈추지 않을 때", keywords: "불안장애,걱정,노년기불안,불안극복", meta_description: "노년기에 찾아오는 지나친 걱정과 불안을 이해하고 건강하게 관리하는 방법을 안내합니다." },
  { category: "mind", title: "반려동물과 함께하는 시니어 생활의 좋은 점", keywords: "반려동물,시니어반려동물,반려견,반려묘", meta_description: "반려동물이 시니어의 정서 건강에 미치는 긍정적 효과와 키울 때 고려할 점을 소개합니다." },
  { category: "mind", title: "감사 일기 쓰기, 마음이 따뜻해지는 습관", keywords: "감사일기,마음건강,긍정습관,일기쓰기", meta_description: "매일 감사한 일을 적는 감사 일기가 마음 건강에 주는 효과와 쉽게 시작하는 방법을 안내합니다." },
  { category: "mind", title: "동네 시니어 모임·봉사활동 참여하는 방법", keywords: "시니어모임,봉사활동,사회참여,동네모임", meta_description: "외로움을 줄이고 보람을 찾을 수 있는 동네 시니어 모임과 봉사활동에 참여하는 방법을 안내합니다." },
];

const legalTopics: Omit<Topic, "index" | "slug">[] = [
  { category: "legal", title: "유언장 꼭 써야 하나요? 작성법과 효력 총정리", keywords: "유언장,유언장작성,유언효력,유언방법", meta_description: "유언장의 법적 효력과 올바른 작성법, 유언장을 꼭 써야 하는 경우를 쉽게 설명합니다." },
  { category: "legal", title: "전세 사기 예방을 위한 체크리스트", keywords: "전세사기,전세사기예방,전세계약,전세보증금", meta_description: "전세 계약 전 반드시 확인해야 할 전세 사기 예방 체크리스트를 항목별로 정리합니다." },
  { category: "legal", title: "보이스피싱 당했을 때 즉시 해야 할 3가지", keywords: "보이스피싱대처,피싱신고,피해구제,금융사기대처", meta_description: "보이스피싱 피해를 입었을 때 골든타임 안에 즉시 해야 할 3가지 긴급 조치를 안내합니다." },
  { category: "legal", title: "상속 순위와 법정상속분, 누가 얼마나 받을까?", keywords: "상속순위,법정상속분,상속비율,상속법", meta_description: "상속인 순위와 법정상속분 비율을 표로 정리하고 실제 사례로 쉽게 설명합니다." },
  { category: "legal", title: "사전연명의료의향서, 꼭 알아야 할 것들", keywords: "연명의료,사전의향서,존엄사,연명치료", meta_description: "사전연명의료의향서가 무엇이고 어디서 작성하는지, 효력과 주의사항을 안내합니다." },
  { category: "legal", title: "성년후견제도란? 치매 부모님을 위한 법적 보호", keywords: "성년후견,치매법적보호,후견인,후견제도", meta_description: "치매 등으로 판단 능력이 떨어진 가족을 법적으로 보호하는 성년후견제도를 쉽게 설명합니다." },
  { category: "legal", title: "시니어 임대차 계약 시 꼭 확인할 사항", keywords: "임대차계약,전세계약,월세계약,계약주의사항", meta_description: "시니어가 임대차 계약을 할 때 꼭 확인해야 할 법적 사항과 주의점을 정리합니다." },
  { category: "legal", title: "교통사고 났을 때 합의·보상 절차 총정리", keywords: "교통사고,합의,보상,교통사고처리", meta_description: "교통사고 발생 시 합의와 보상을 받는 절차를 단계별로 알기 쉽게 정리합니다." },
  { category: "legal", title: "병원비 과다 청구, 의료분쟁 해결 방법", keywords: "의료분쟁,병원비,의료비과다청구,의료피해", meta_description: "병원비가 과하게 청구되었거나 의료 피해를 입었을 때 분쟁을 해결하는 방법을 안내합니다." },
  { category: "legal", title: "기초연금 재산 기준, 집이 있으면 못 받나요?", keywords: "기초연금재산,기초연금집,소득인정액,재산기준", meta_description: "자가 주택이 있을 때 기초연금을 받을 수 있는지 소득인정액 계산 방법과 함께 설명합니다." },
  { category: "legal", title: "이혼 시 재산분할과 위자료, 시니어가 알아야 할 법률", keywords: "이혼재산분할,위자료,시니어이혼,황혼이혼", meta_description: "황혼 이혼 시 재산분할 기준과 위자료 청구 방법, 연금 분할에 대해 설명합니다." },
  { category: "legal", title: "사기 피해를 당했을 때 고소장 쓰는 법", keywords: "고소장,사기고소,고소방법,법률피해", meta_description: "사기 피해를 입었을 때 경찰에 고소장을 작성하고 제출하는 방법을 단계별로 안내합니다." },
  { category: "legal", title: "시니어 소비자 피해 구제 받는 방법", keywords: "소비자피해,소비자보호,환불,소비자구제", meta_description: "부당한 상품 판매나 서비스로 피해를 입었을 때 소비자 피해 구제를 받는 절차를 설명합니다." },
  { category: "legal", title: "요양병원·요양원 입소 계약 시 확인할 법적 사항", keywords: "요양원계약,요양병원,입소계약,요양시설", meta_description: "요양병원이나 요양원에 입소할 때 계약서에서 꼭 확인해야 할 법적 사항을 정리합니다." },
  { category: "legal", title: "유류분 청구란? 상속에서 빠졌을 때 대처법", keywords: "유류분,유류분청구,상속분쟁,상속권리", meta_description: "유언으로 상속에서 제외되었을 때 유류분 청구를 통해 권리를 되찾는 방법을 설명합니다." },
];

// ── 전체 토픽 조합 ──────────────────────────────────────────────────
const categoryMap: { topics: Omit<Topic, "index" | "slug">[]; prefix: string }[] = [
  { topics: healthTopics,  prefix: "health" },
  { topics: subsidyTopics, prefix: "subsidy" },
  { topics: moneyTopics,   prefix: "money" },
  { topics: travelTopics,  prefix: "travel" },
  { topics: digitalTopics, prefix: "digital" },
  { topics: foodTopics,    prefix: "food" },
  { topics: mindTopics,    prefix: "mind" },
  { topics: legalTopics,   prefix: "legal" },
];

export const allTopics: Topic[] = categoryMap.flatMap(({ topics, prefix }, catIdx) =>
  topics.map((t, i) => ({
    index: catIdx * 15 + i + 1,
    slug: `${prefix}-${String(i + 1).padStart(3, "0")}`,
    ...t,
  })),
);
