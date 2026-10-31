export type InstallReviewPhoto = {
  src: string;
  alt: string;
  caption: string;
  title: string;
};

export type InstallReview = {
  slug: string;
  region: string;
  facilityType: string;
  title: string;
  originalTitle: string;
  date: string;
  summary: string;
  before: string;
  installationType: string;
  installation: string;
  operation: string;
  originalBody: string[];
  sourceUrl: string;
  photos: InstallReviewPhoto[];
};

const photo = (src: string, title: string, alt: string, caption: string): InstallReviewPhoto => ({ src, title, alt, caption });

// 사용자 제공 설치 정보와 카페 원문에서 확인된 사실만 정리한다. 절감액·성과 수치는 넣지 않는다.
export const installReviews: InstallReview[] = [
  {
    slug: "gyeongsan-17-hour", region: "경산", facilityType: "호텔", date: "2026.10.26",
    title: "19시부터 완전 무인, 17시간 관제의 실제 운영", originalTitle: "경산에 무인관제 설치했습니다. 17시간 관제 실시합니다.",
    summary: "낮에는 현장 점검을 하고, 19시부터는 무인관제로 전환하는 호텔 운영 사례입니다.",
    before: "낮 시간 객실 점검과 전날 문의 내역 확인은 현장에서 직접 처리해야 했습니다.",
    installationType: "현금 기능 포함 키오스크",
    installation: "슬낭 무인관제와 현금 결제 기능이 있는 키오스크를 호텔 프런트에 설치했습니다.",
    operation: "직원이 낮에 객실과 문의 내역을 점검한 뒤, 19시부터 완전 무인으로 전환합니다. 카페 원문 기준 17시간 관제 방식입니다.",
    originalBody: ["경산에 다녀왔습니다.", "17시간 무인관제 사용하시는데요,", "낮에는 잠시 직원분이 출근하여 객실 점검 및 전날 문의 내역에 대해 점검 하신 후", "19시부터는 다시 완전 무인으로 운영하십니다.", "외관도 너무 깔끔하고 예뻐 가족단위로 많이들 오실 것 같다는 인상이었습니다.", "무인관제 문의는 010 8953 7633 으로 부탁드립니다.", "자사 서비스를 선택하시지 않으시더라도, 무인운영에 대한 자세한 설명 도와드리겠습니다.", "감사합니다."], sourceUrl: "https://naver.me/GvWQpDiO",
    photos: [
      photo("/images/install-reviews/gyeongsan/seulnang-gyeongsan-hotel-cash-kiosk-installation-01.jpg", "경산 호텔 프런트의 슬낭 무인관제 설치", "경산 호텔 프런트에 설치된 슬낭 무인관제 장비와 현금 결제 키오스크", "슬낭 무인관제 실제 설치 사례 — 경산 호텔 프런트의 현금 결제 키오스크"),
      photo("/images/install-reviews/gyeongsan/seulnang-gyeongsan-hotel-cash-kiosk-installation-02.jpg", "경산 호텔 키오스크 설치 현장", "경산 호텔에 설치된 슬기로운 낭만지기 키오스크 실제 설치 현장", "경산 호텔의 슬기로운 낭만지기 키오스크 설치 현장"),
    ],
  },
  {
    slug: "hoengseong-recommendation", region: "횡성", facilityType: "호텔", date: "2026.10.29",
    title: "지인의 추천 한 번이 설치로 이어진 이유", originalTitle: "2명중 1명은 슬기로운 무인관제를 강력 추천합니다. 횡성다녀왔습니다.",
    summary: "지인 추천을 계기로 무인관제를 도입한 횡성 호텔 사례입니다.", before: "호텔 운영에 맞는 무인관제 도입 방식을 검토하던 상황이었습니다.",
    installationType: "컴팩트형 키오스크", installation: "현금 결제기 없이 슬낭 무인관제를 도입했습니다.", operation: "현장 운영 방식에 맞춰 고객 응대가 필요한 시간대에 무인관제를 활용합니다.",
    originalBody: ["이번 업장은 지인의 권유로 슬기로운낭만지기 무인관제를 알게 되었고, 도입까지 결정하게 되셨습니다.", "슬기로운낭만지기 무인관제는 만족률이 87%, 소개율은 60%대를 유지하고있습니다, 2분중 1분은 주변 지인분께 소개해주시고 설치까지 이어지고있습니다.", "상담 문의는 010 8953 7633 으로 부탁드립니다."], sourceUrl: "https://naver.me/FNtZUvOC",
    photos: [
      photo("/images/install-reviews/hoengseong/seulnang-hoengseong-hotel-monitoring-installation-01.jpg", "횡성 호텔 슬낭 무인관제 설치", "횡성 호텔의 슬낭 무인관제 실제 설치 현장", "슬낭 무인관제 실제 설치 사례 — 횡성 호텔 설치 현장"),
      photo("/images/install-reviews/hoengseong/seulnang-hoengseong-hotel-monitoring-installation-02.jpg", "횡성 호텔 무인관제 현장", "횡성 호텔에 설치된 슬기로운 낭만지기 무인관제 현장", "횡성 호텔의 슬기로운 낭만지기 무인관제 설치 모습"),
    ],
  },
  {
    slug: "daegu-17-hour", region: "대구", facilityType: "호텔", date: "2026.10.25",
    title: "대구에서도 17시간 관제를 시작한 이유", originalTitle: "대구도 점점 관제 사용업장이 늘어나고있네요.!^^",
    summary: "현금 결제 키오스크를 프런트 공간에 설치하고 17시간 관제를 운영하는 호텔 사례입니다.", before: "현장 상황에 맞는 무인운영과 고객 응대 방식을 마련할 필요가 있었습니다.",
    installationType: "현금 기능 포함 키오스크", installation: "프런트 설치 공간에 맞춰 현금 결제 기능이 있는 키오스크와 슬낭 무인관제를 구성했습니다.", operation: "카페 원문 기준 17시간 관제를 사용합니다. 조식 공간이 있는 로비 운영 흐름을 고려해 설치했습니다.",
    originalBody: ["대구에 다녀왔습니다.", "17시간 관제를 사용하시고 계십니다.", "대구에는 슬기로운 관제 뿐만아니라 타업체 등 관제를 사용하는 고객이 많지 않은데요.", "그럼에도 슬기로운이 대구에서 가장 많은 무인운영을 도와드리고있습니다.", "주변업장에서 관제를 사용하지 않아 우려 되시는 부분을 인지하고 빠르게 적응되도록 도와드리겠습니다.", "관련 문의는 010 8953 7633 으로 부탁드립니다."], sourceUrl: "https://naver.me/F05Ln1iM",
    photos: [
      photo("/images/install-reviews/daegu-17h/seulnang-daegu-hotel-cash-kiosk-installation-01.jpg", "대구 호텔 현금 키오스크 설치", "대구 호텔 프런트 공간에 설치된 슬낭 무인관제 현금 결제 키오스크", "슬낭 무인관제 실제 설치 사례 — 대구 호텔 프런트 현금 키오스크"),
      photo("/images/install-reviews/daegu-17h/seulnang-daegu-hotel-lobby-installation-02.jpg", "대구 호텔 로비 무인관제 설치", "대구 호텔 로비의 슬기로운 낭만지기 키오스크 설치 현장", "대구 호텔 로비에 설치된 슬기로운 낭만지기 키오스크"),
    ],
  },
  {
    slug: "yangsan-night-support", region: "양산", facilityType: "3성급 비즈니스 관광호텔", date: "2026.10.25",
    title: "야간 6시간만 맡겼는데 달라진 운영", originalTitle: "양산에 다녀왔습니다 직원 휴게 보장이 이슈네요.",
    summary: "야간 6시간에만 무인관제를 적용해 프런트 운영 공백을 줄인 3성급 비즈니스 관광호텔 사례입니다.", before: "직원 휴게 시간을 보장하면서 프런트 운영을 이어갈 방법이 필요했습니다.",
    installationType: "컴팩트형 키오스크", installation: "현금 결제기 없이 슬낭 무인관제를 고급 프런트 운영 환경에 맞춰 적용했습니다.", operation: "야간 6시간 동안만 무인관제를 사용하고, 필요한 시간대에 한정해 운영합니다.",
    originalBody: ["이번에는 양산에 다녀왔습니다", "3성급 비즈니스 관광호텔로, 프론트가 고급지고 예쁜 호텔이었습니다^^", "직원분들의 휴식을 보장하기 위해 야간 6시간 동안만 무인관제를 이용하시기로 했습니다.", "무조건 모든 시간대에 관제를 이용해야 하는 건 아닙니다. 업장 상황에 맞춰 필요한 시간에만 활용하는 것도 좋은 방법인데요.", "특히 야간 근무 부담이 큰 업장이라면 직원분들이 충분히 쉬면서도 운영 공백을 줄일 수 있다는 점에서 도움이 될 것 같습니다.", "업장마다 운영 방식과 필요한 부분이 다른 만큼, 상황에 맞는 방법을 찾아가는 게 중요합니다"], sourceUrl: "https://naver.me/FG3YLgsw",
    photos: [
      photo("/images/install-reviews/yangsan/seulnang-yangsan-business-hotel-monitoring-installation-01.jpg", "양산 비즈니스 관광호텔 프런트 설치", "양산 3성급 비즈니스 관광호텔 프런트의 슬낭 무인관제 실제 설치 현장", "슬낭 무인관제 실제 설치 사례 — 양산 비즈니스 관광호텔 프런트"),
      photo("/images/install-reviews/yangsan/seulnang-yangsan-business-hotel-monitoring-installation-02.jpg", "양산 호텔 무인관제 설치", "양산 3성급 호텔에 설치된 슬기로운 낭만지기 무인관제", "양산 3성급 비즈니스 관광호텔의 슬기로운 낭만지기 설치 모습"),
      photo("/images/install-reviews/yangsan/seulnang-yangsan-business-hotel-monitoring-installation-03.jpg", "양산 호텔 프런트 현장", "양산 비즈니스 관광호텔 프런트의 슬낭 무인관제 운영 현장", "양산 호텔 프런트에 적용된 슬낭 무인관제 현장"),
    ],
  },
  {
    slug: "geoje-night-calls", region: "거제", facilityType: "3성급 호텔", date: "2026.10.25",
    title: "3성급 호텔이 야간 전화를 맡긴 이유", originalTitle: "거제도 3성급 호텔에 다녀왔습니다 슬기로운관제는 전화도 대신 받습니다.",
    summary: "객실과 부대시설 문의까지 야간 전화로 응대하도록 설정한 3성급 호텔 사례입니다.", before: "야간 체크인과 문의 전화가 이어져 직원 휴게 시간을 확보하기 어려웠습니다.",
    installationType: "현금 기능 포함 키오스크", installation: "현금 결제 기능이 있는 키오스크와 슬낭 무인관제를 설치하고, 호텔·부대시설 안내 정보를 관제에 전달했습니다.", operation: "야간 체크인뿐 아니라 호텔 및 부대시설 관련 전화 문의도 관제가 응대합니다.",
    originalBody: ["3성급 호텔로, 프론트가 웅장하고 고급진 호텔이었습니다.", "이번 고객사에서는 직원분들의 법적으로 휴게 시간을 보장하기 위해 무인관제를 도입해 주셨습니다.", "특히 야간에 걸려 오는 전화까지 대신 응대해 준다는 점을 큰 장점으로 봐주셨는데요.", "야간에는 체크인뿐만 아니라 각종 문의 전화도 계속 들어오다 보니, 직원분들이 제대로 쉬기 어려운 경우가 있습니다.", "이럴 때 관제에서 전화 응대까지 지원하면 직원분들의 휴식 시간을 확보하는 데 도움이 됩니다.", "객실수가 많고 부대시설도 다양하게 있어, 호텔 정보에 대한 내용을 꼼꼼하게 전달받아 여러가지 문의도 전화로 잘 응대해드리고 있습니다.", "저희는 단순히 무인 체크인만 지원하는 게 아니라 야간 전화 응대까지 함께 지원하고 있습니다.", "앞으로도 호텔마다 필요한 부분을 잘 파악해서 실제 운영에 도움이 될 수 있도록 노력하겠습니다"], sourceUrl: "https://naver.me/GsBh7q8L",
    photos: [
      photo("/images/install-reviews/geoje/seulnang-geoje-hotel-cash-kiosk-installation-01.jpg", "거제 3성급 호텔 키오스크 설치", "거제 3성급 호텔 프런트에 설치된 슬낭 무인관제 현금 결제 키오스크", "슬낭 무인관제 실제 설치 사례 — 거제 3성급 호텔 현금 키오스크"),
      photo("/images/install-reviews/geoje/seulnang-geoje-hotel-monitoring-installation-02.jpg", "거제 호텔 무인관제 프런트", "거제 3성급 호텔 프런트의 슬기로운 낭만지기 무인관제 설치 모습", "거제 호텔 프런트에 적용된 슬기로운 낭만지기 무인관제"),
      photo("/images/install-reviews/geoje/seulnang-geoje-hotel-monitoring-installation-03.jpg", "거제 호텔 설치 현장", "거제 3성급 호텔의 슬낭 무인관제 실제 설치 현장", "거제 3성급 호텔 슬낭 무인관제 설치 현장"),
    ],
  },
  {
    slug: "daegu-mother", region: "대구", facilityType: "호텔", date: "2026.10.25",
    title: "아들이 어머니의 프런트 부담을 덜어드린 방법", originalTitle: "대구에 다녀왔습니다 어머니의 운영 부담을 덜어드리기 위해 관제 설치했습니다.",
    summary: "보관함 형태 키오스크와 무인관제로 프런트 운영 부담을 덜고자 한 호텔 사례입니다.", before: "혼자 숙박업을 운영하는 과정에서 늦은 시간까지 프런트를 지키는 부담이 있었습니다.",
    installationType: "보관함형 키오스크", installation: "보관함 형태 키오스크와 슬낭 무인관제를 호텔 운영에 맞춰 설치했습니다.", operation: "대학가 인근 이용객을 포함한 고객 응대가 필요할 때 무인관제로 프런트 운영을 지원합니다.",
    originalBody: ["이번에는 대구에 다녀왔습니다", "이번 고객사는 나이가 있으신 어머니께서 혼자 숙박업을 운영하고 계셔서, 아드님께서 어머니의 운영 부담을 덜어드리고자 무인관제를 도입해 주셨습니다.", "아무래도 연세가 있으시면 늦은 시간까지 프런트를 지키는 일이 쉽지 않으실 텐데요.", "가족 입장에서도 조금이나마 부담을 덜어드리고 싶은 마음이셨던 것 같습니다.", "무인관제가 단순히 인건비를 줄이는 것뿐만 아니라, 이렇게 가족의 걱정을 덜어드리는 데에도 도움이 될 수 있다는 생각이 드네요.", "앞으로 어머니께서도 편하게 이용하실 수 있도록 잘 챙기겠습니다"], sourceUrl: "https://naver.me/GJZSRsGz",
    photos: [
      photo("/images/install-reviews/daegu-mother/seulnang-daegu-hotel-locker-kiosk-installation-01.jpg", "대구 호텔 보관함 키오스크 설치", "대구 호텔에 설치된 슬낭 무인관제 보관함 형태 키오스크", "슬낭 무인관제 실제 설치 사례 — 대구 호텔 보관함 형태 키오스크"),
      photo("/images/install-reviews/daegu-mother/seulnang-daegu-hotel-locker-kiosk-installation-02.jpg", "대구 호텔 무인관제 현장", "대구 호텔 프런트의 슬기로운 낭만지기 무인관제 설치 현장", "대구 호텔에 적용된 슬기로운 낭만지기 무인관제"),
      photo("/images/install-reviews/daegu-mother/seulnang-daegu-hotel-locker-kiosk-installation-03.jpg", "대구 호텔 키오스크 설치 모습", "대구 호텔의 보관함 형태 키오스크 실제 설치 모습", "대구 호텔 보관함 형태 키오스크 설치 현장"),
    ],
  },
  {
    slug: "ulsan-compare", region: "울산", facilityType: "모텔", date: "2026.10.24",
    title: "키오스크 3곳 비교 끝에 선택한 이유", originalTitle: "울산에 다녀왔습니다. 타사 키오스크 3곳 모두 비교하셨네요",
    summary: "키오스크를 비교한 뒤, 필요할 때 관제 시간을 추가하는 무인프런트 전환 기능을 사용하는 모텔 사례입니다.", before: "여러 키오스크의 가격과 업장에 필요한 기능을 비교했습니다.",
    installationType: "컴팩트형 키오스크", installation: "현금 결제기 없이 슬기로운 낭만지기 키오스크와 슬낭 무인관제를 설치했습니다.", operation: "슬기로운 메신저 앱의 무인프런트 전환으로 필요할 때 관제 시간을 유동적으로 추가해 운영합니다.",
    originalBody: ["이번에는 울산에 다녀왔습니다!", "사장님께서 타사 키오스크 3곳을 모두 비교해 보신 뒤 저희를 선택해 주셨습니다.", "가격도 중요하지만, 실제 업장에서 필요한 기능이 있는지도 꼼꼼하게 살펴보셨는데요.", "여러 업체를 비교해 보시고 가격은 물론 기능까지 가장 적합하다고 판단해 주셨습니다.", "특히 저희는 '슬기로운 메신저 앱'으로 필요할 때 관제시간을 유동적으로 추가하는 기능을 지원하고 있는데요. 이 기능도 초반부터 어려움 없이 잘 사용하고 계십니다^^", "직접 비교해 보시고 선택해 주신 만큼 잘 사용하실 수 있도록 앞으로도 꼼꼼하게 챙기겠습니다!", "관련 문의는 010-8953-7633 으로 부탁드립니다."], sourceUrl: "https://naver.me/x2Y1C45l",
    photos: [
      photo("/images/install-reviews/ulsan-compare/seulnang-ulsan-motel-kiosk-installation-01.jpg", "울산 모텔 키오스크 설치", "울산 모텔에 설치된 슬기로운 낭만지기 키오스크 실제 설치 현장", "슬낭 무인관제 실제 설치 사례 — 울산 모텔 키오스크"),
      photo("/images/install-reviews/ulsan-compare/seulnang-ulsan-motel-kiosk-installation-02.jpg", "울산 모텔 무인관제 설치", "울산 모텔 프런트의 슬낭 무인관제 설치 모습", "울산 모텔에 적용된 슬낭 무인관제 현장"),
      photo("/images/install-reviews/ulsan-compare/seulnang-ulsan-motel-kiosk-installation-03.jpg", "울산 모텔 키오스크 현장", "울산 모텔의 슬기로운 낭만지기 키오스크 설치 현장", "울산 모텔 슬기로운 낭만지기 키오스크 설치 모습"),
    ],
  },
  {
    slug: "incheon-bupyeong", region: "인천 부평", facilityType: "숙박업소", date: "2026.09.27",
    title: "2년 쓰던 관제를 바꾼 업장의 이유", originalTitle: "인천 부평, 타관제 해지! 자사 무인관제 설치했습니다. 왜 바꾸셨냐면요",
    summary: "주차 차량 번호와 차키 보관 흐름까지 관제에 반영한 인천 부평 숙박업소 사례입니다.", before: "주차 안내와 차키 관리가 까다로운 운영 환경이었습니다.",
    installationType: "현금 기능 포함 키오스크", installation: "현금 결제 기능이 있는 키오스크와 슬낭 무인관제를 설치하고, 차량 번호 확인 및 차키 보관 흐름을 설정했습니다.", operation: "체크인 시 차량 번호를 확인하고 차키를 보관해 주차 관련 운영 누락을 줄이도록 관리합니다.",
    originalBody: ["인천 부평 호텔, 약 2년간 사용하시던 타 관제를 해지하고 저희 무인관제로 변경하셨습니다.", "왜 바꾸셨냐고 여쭤보니 관제 시간을 상황에 맞게 유동적으로 사용할 수 있고, 관제 응대가 세밀하다는 주변 지인의 이야기를 듣고 결정하셨다고 합니다.", "약 2년 동안 다른 관제를 사용하셨던 만큼 변경을 결정하기까지 고민도 많으셨는데요.", "큰맘 먹고 옮기신 만큼 현재는 실제 운영하면서 관제 응대와 운영 방식에 만족하고 계십니다.", "특히 주차 문제가 까다로운 업장인데, 체크인 시 차 번호를 받고 차키를 모두 보관하여 현재까지 문제 없이 잘 운영되고 있습니다. ^^", "결국 무인관제는 단순히 ‘사람이 대신 받아주는 것’보다 현장 상황에 얼마나 세밀하게 대응하느냐가 중요하다고 생각합니다.", "다음 글은 슬기로운낭만지기가 어떻게 세밀하게 응대할 수 있는지 시스템을 소개해드리도록 하겠습니다.", "관련 문의는 010-8953-7633 으로 부탁드립니다."], sourceUrl: "https://naver.me/5T0spUzn",
    photos: [
      photo("/images/install-reviews/incheon-bupyeong/seulnang-incheon-bupyeong-cash-kiosk-installation-01.jpg", "인천 부평 숙박업소 현금 키오스크 설치", "인천 부평 숙박업소에 설치된 슬낭 무인관제 현금 결제 키오스크", "슬낭 무인관제 실제 설치 사례 — 인천 부평 현금 결제 키오스크"),
      photo("/images/install-reviews/incheon-bupyeong/seulnang-incheon-bupyeong-parking-monitoring-installation-02.jpg", "인천 부평 주차 운영 무인관제", "인천 부평 숙박업소의 차량 번호와 차키 보관 운영을 지원하는 슬낭 무인관제 현장", "인천 부평 숙박업소 주차 운영을 위한 슬낭 무인관제 설치 현장"),
    ],
  },
  {
    slug: "seoul-dongdaemun", region: "서울 동대문", facilityType: "호텔", date: "2026.09.27",
    title: "잔돈까지 돌려주는 키오스크, 동대문에 설치했습니다", originalTitle: "서울 동대문에 위치한 호텔에 무인관제 설치했습니다. 잔돈반환 키오스크 사용합니다.",
    summary: "현금 결제·잔돈 반환과 예약 채널별 주차 안내를 함께 설정한 호텔 사례입니다.", before: "예약 채널마다 주차 가능 조건이 달라, 주차 불가 예약의 안내 누락을 막을 방법이 필요했습니다.",
    installationType: "현금 기능 포함 키오스크", installation: "현금 결제와 잔돈 반환이 가능한 키오스크, 슬낭 무인관제, 예약 채널별 주차 안내 기능을 구성했습니다.", operation: "주차 불가 예약이 주차하는 경우 자동 요금 안내 또는 주차 불가 안내가 표시되도록 설정해 운영 누락을 줄입니다.",
    originalBody: ["서울 동대문에 위치한 호텔에 무인관제 시스템을 설치했습니다.", "이번 현장에서는 잔돈 반환이 가능한 키오스크를 사용하고 있습니다.", "현금 결제 후 잔돈 반환을 선택해서 이용할 수 있어 고객 입장에서도 편리합니다.", "기존에는 현금 결제 금액을 금고함에 넣는 방식이었지만, 약 2개월 전부터 잔돈 반환 기능이 업데이트되어 적용되고 있습니다.", "실제 숙박업 현장에서 조금씩 더 편리하게 운영할 수 있도록 계속 업데이트하고 있습니다.", "또한 해당 업장은 예약 사이트에 따라 주차가 불가능한 상품도 운영하고 계신데요.", "기존에는 주차 불가 상품을 예약한 고객이 주차를 시도하는 경우, 별도의 확인과 안내가 필요한 상황이 있었습니다.", "이를 개선하기 위해 해당 예약 건에 대해 추가 주차 요금이 자동으로 부과되거나, 주차가 불가능하다는 안내가 표시되도록 기능을 구현했습니다.", "기능 적용 이후에는 주차 관련 혼선이 해소되어, 별도의 확인이나 안내가 누락될 걱정 없이 더욱 안정적으로 관제를 진행하고 있습니다. ^^", "관련 문의는 010-8953-7633 으로 부탁드립니다."], sourceUrl: "https://naver.me/xtNBU10R",
    photos: [
      photo("/images/install-reviews/seoul-dongdaemun/seulnang-seoul-dongdaemun-hotel-cash-kiosk-installation-01.jpg", "서울 동대문 호텔 현금 키오스크 설치", "서울 동대문 호텔에 설치된 슬기로운 낭만지기 현금 결제 및 잔돈 반환 키오스크", "슬낭 무인관제 실제 설치 사례 — 서울 동대문 호텔 현금·잔돈 반환 키오스크"),
      photo("/images/install-reviews/seoul-dongdaemun/seulnang-seoul-dongdaemun-hotel-parking-installation-02.jpg", "서울 동대문 호텔 주차 안내 무인관제", "서울 동대문 호텔의 예약 채널별 주차 안내를 지원하는 슬낭 무인관제 설치 현장", "서울 동대문 호텔 주차 안내 기능이 적용된 슬낭 무인관제"),
    ],
  },
];

export function getInstallReview(slug: string) {
  return installReviews.find((review) => review.slug === slug);
}
