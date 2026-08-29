export const IMG = {
  logo: "/images/home/company-logo.png",
  hero: "/images/home/first-photo.png",
  heroPoster: "/images/home/hero-lobby-poster.jpg",
  oneClickPoster: "/images/home/oneclick-app-poster.jpg",
  kioskOnlyPain: "/images/generated/kiosk-only-pain.jpg",
  controlCenter: "/images/generated/control-center.jpg",
  kioskDevice: "/images/home/kiosk-photo.png",
  kioskLobby: "/images/home/kiosk-lobby.jpg",
  aboutHero: "/images/generated/control-center.jpg",
  appLive: "/images/app/app-live.jpg",
  appOneClick: "/images/app/app-oneclick.jpg",
  pmsRoom: "/images/pms/pms-rooms.jpg",
  pmsSales: "/images/pms/pms-sales.jpg",
  pmsInventory: "/images/pms/pms-ota.jpg",
  pmsReservation: "/images/pms/date-reservation.png",
  pmsHousekeeping: "/images/pms/pms-housekeeping.jpg",
  elevatorKiosk: "/images/kiosk/elevator.png",
  supplyLocker: "/images/kiosk/supply-locker-only.png",
  appInquiry: "/images/kiosk/app-inquiry.png",
  appLog1: "/images/kiosk/app-log-pay.png",
  appLog2: "/images/kiosk/app-log-need.png",
  appLog3: "/images/kiosk/app-log-check.png",
  report:
    "https://framerusercontent.com/images/knQp7ttYZh71nMGy1L0OSGOyZx0.png?width=1666&height=1111",
  compare:
    "https://framerusercontent.com/images/S64auGSbBXN17PEn1iHxgn9YTNc.png?width=500&height=500",
  save: "https://framerusercontent.com/images/gPfLUhd1wCcQ55WZCFN6xooLc.png?width=96&height=96",
  rest: "https://framerusercontent.com/images/TtlpBdFayerL3wj1fh7WcoWxu8Q.png?width=96&height=96",
  flex: "https://framerusercontent.com/images/WoolQGgLjWKVIc1qyudVonqxzo.png?width=96&height=96",
} as const;

/* 힉스필드로 제작한 브랜드 영상 — 포스터는 각 영상의 첫 프레임과 동일해야 한다.
   hero-lobby: 실제 키오스크 로비 사진(kiosk-lobby.jpg)을 시작 프레임으로 영상화.
   oneclick-app: 실제 관리자앱 '무인 프런트 전환' 화면을 합성해 원클릭 퇴근 스토리로 영상화. */
export const VIDEOS = {
  heroNight: "/videos/hero-lobby.mp4",
  oneClick: "/videos/oneclick-app.mp4",
} as const;

/* 스크롤 시퀀스(ScrollSequence) 프레임 세트 — 힉스필드 영상을 12fps webp 로
   잘라 둔 것. base/{960,1600}/NNN.webp 구조이고 poster 는 1번 프레임과 동일하다.
   kiosk: 실제 키오스크 카운터 컷(kiosk-lobby.jpg)에서 카메라가 물러나며
          기기가 로비 속 한 점이 될 때까지 — "작음"을 공간으로 증명.
   dawn:  밤 호텔 외관에서 새벽이 밝아올 때까지 — "오늘 밤부터는, 편히 주무세요". */
export const SEQUENCES = {
  kiosk: {
    base: "/sequences/kiosk",
    frames: 145,
    poster: "/sequences/kiosk/poster.jpg",
  },
  dawn: {
    base: "/sequences/dawn",
    frames: 120,
    poster: "/sequences/dawn/poster.jpg",
  },
} as const;

export const LINKS = {
  home: "/",
  pms: "/pms",
  muin: "/muin",
  kiosk: "/kiosk",
  contact: "/contact",
  about: "/aboutus",
  faq: "/#faq",
  blog: "https://blog.naver.com/PostList.naver?blogId=motel_safe_tech&categoryNo=1&from=menu&userSelectMenu=true",
  kakao: "https://pf.kakao.com/_dJbsX/friend",
  tel: "tel:1551-6783",
  email: "mailto:info@rosegoldsoftware.co.kr",
} as const;

export const COMPANY = {
  name: "슬기로운 낭만지기",
  legal: "(주) 슬기로운 낭만지기",
  phone: "1551-6783",
  email: "info@rosegoldsoftware.co.kr",
  ceo: "김연수",
  bizNo: "719-88-02911",
  address: "경기도 안산시 상록구 한양대학로 60 401호",
  branch: "인천 연수구 인천타워대로 323 송도 센트로드 B동 2205호",
};

export const HOTEL_LOGOS = [
  { name: "브라운도트 호텔", src: "/images/home/browndot.png" },
  { name: "넘버25 호텔", src: "/images/home/no25.png" },
  { name: "하운드 호텔", src: "/images/home/hound.png" },
  { name: "뉴캐슬 호텔", src: "/images/home/newcastle.png" },
  { name: "저스트 슬립 호텔", src: "/images/home/justsleep.png" },
  { name: "리베 호텔", src: "/images/home/labe.png" },
  { name: "에이치에비뉴 호텔", src: "/images/home/havenue.png" },
  { name: "도노 호텔", src: "/images/home/dono.png" },
  {
    name: "엘스테이 호텔",
    src: "https://framerusercontent.com/images/dZiRyUleslifgrvRTtuL8wR1rMc.png?width=466&height=582",
  },
  { name: "레츠스테이 호텔", src: "/images/home/lets-stay.png" },
];

export const REVIEWS = [
  {
    quote:
      "어플이 진짜 신세계네요. 알림 받고 키 발급까지 다 되니까, 동선이 줄어서 대만족입니다.",
    hotel: "충청도 S호텔",
  },
  {
    quote:
      "혹시 나중에 가게 내놓을 때가 걱정이었는데, 꼼꼼하게 향후 계획까지 상담해 주셔서 마음이 놓여요.",
    hotel: "전북 N호텔",
  },
  {
    quote:
      "낮엔 제가 직접 폰으로 보고 밤엔 맡기니까 딱 좋습니다. 식당 음식 판매까지 다 받아주니 편하네요.",
    hotel: "경기도 K호텔",
  },
  {
    quote:
      "기존 키오스크만으론 무리였는데 여긴 각 층 CCTV 설치도 가능하고, 확실히 비용 절감이 되네요.",
    hotel: "경기도 H호텔",
  },
  {
    quote:
      "지긋지긋한 직원 관리도 끝이네요. 프런트 민원 줄고 스트레스 안 받으니까 왜 이제 했나 싶어요.",
    hotel: "충청도 S호텔",
  },
  {
    quote:
      "호텔 이미지 때문에 무인운영은 망설여졌었는데, 인테리어도 안 해치고 운영만 편해져서 다행입니다.",
    hotel: "경기도 N호텔",
  },
  {
    quote:
      "투잡러여서 잘 쉬지 못했는데, 이제 잘 시간이 생겨서 일상을 정상적으로 보낼 수 있게 됐어요.",
    hotel: "경기도 D호텔",
  },
  {
    quote:
      "비싼 키오스크 사놔도 결국 사람이 있어야하더라구요. 그런데 이제야 좀 숨통이 트입니다.",
    hotel: "경기도 G호텔",
  },
  {
    quote:
      "주차나 키 문제 같은 기본 고충부터 같이 분석/설계해주니까, 운영 전체가 확실히 편해진 기분입니다.",
    hotel: "전북 B호텔",
  },
  {
    quote:
      "기존 CCTV 관제는 답답해서 못 써요. 여기로 바꾸고 나선 쓰던 대기업 키오스크도 그냥 꺼버렸어요.",
    hotel: "경기도 A호텔",
  },
];

export const FAQS = [
  {
    q: "기존 키텍을 교체해야 하나요?",
    a: "기존 키텍을 그대로 쓰면서 연동하는 경우가 많습니다. 업장 환경을 확인한 뒤 맞춤으로 안내드립니다.",
  },
  {
    q: "카드키가 아닌 열쇠 키면 어떻게 하나요?",
    a: "열쇠 키 업장도 운영 방식에 맞춰 설계합니다. 상담 시 현재 키 형태를 알려주시면 됩니다.",
  },
  {
    q: "설치비가 있나요?",
    a: "렌탈비, 장비비, 초기 세팅비, 가입비, 보증금, 관리비는 모두 0원입니다. 관제비만 시간당 2,900원(부가세 포함)입니다.",
  },
  {
    q: "유지보수는 어떻게 이루어지나요?",
    a: "설치 이후에도 원격·방문 지원으로 운영이 끊기지 않게 관리합니다. 자세한 범위는 상담 때 안내드립니다.",
  },
  {
    q: "직원 교육이 필요한가요?",
    a: "사장님 앱은 슥 밀기만 하면 관제가 시작될 정도로 단순합니다. 필요 시 현장 안내를 도와드립니다.",
  },
  {
    q: "보안은 어떻게 보장되나요?",
    a: "신분증 확인, 미성년자 출입 차단, 사건 사고 녹화·녹음 대응까지 관제 요원이 실시간으로 처리합니다.",
  },
  {
    q: "결제 방식은 어떻게 되나요?",
    a: "관제비는 시간당 2,900원(부가세 포함)이며, 11시간 이상 이용 시 추가 할인이 적용됩니다. 최소 이용시간이 있습니다.",
  },
  {
    q: "업종별 맞춤 설정이 가능한가요?",
    a: "금연실, 우선 판매 객실, 주차 안내, 할인 기준 등 사장님 운영 노하우에 맞춰 세밀하게 설정합니다.",
  },
];
