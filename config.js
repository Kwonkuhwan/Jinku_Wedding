/**
 * Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
    // ── 배경 음악 설정 ──
  music: {
    showButton: true,      // 음악 조절 버튼 표시 여부
    autoPlay: true,        // 자동 재생 시도 (브라우저 정책에 따라 제한될 수 있음)
    mediaUrl: "music/bgm.mp3" // 음악 파일 경로 (준비하신 파일명으로 수정하세요)
  },

  // ── 초대장 열기 ──
  useCurtain: true,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "권구환",
    nameEn: "KWON KUHWAN",
    father: "권용진",
    mother: "이영임",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "김진실",
    nameEn: "KIM JINSIL",
    father: "김용호",
    mother: "김보희",
    fatherDeceased: false,
    motherDeceased: false
  },

wedding: {
  date: "2026-08-01",
  time: "12:30",
  venue: "르비르모어 선릉",
  hall: "클리타홀 2층",
  address: "서울시 강남구 테헤란로 406 A동",
  tel: "02-501-7000",
  mapLinks: {
    kakao: "https://kko.to/ZiF8w7afEX",
    naver: "https://naver.me/xl0D3i0o"
  },

  // ✨ 교통 정보 추가
  transport: {
    subway: {
      lines: [
        { name: "2호선", station: "선릉역", exit: "1번 출구", time: "도보 1분", color: "#00a84d" },
        { name: "분당선", station: "선릉역", exit: "1번 출구", time: "도보 1분", color: "#fabe00" }
      ]
    },
    bus: {
      info: "간선버스 146, 301, 362번\n지선버스 3426, 4419번\n(선릉역 정류장 하차)"
    },
    parking: {
      available: true,
      info: "건물 지하주차장 이용 가능 (2시간 무료)\n450대 주차 가능",
      notice: "주차 공간이 협소하오니\n가급적 대중교통을 이용해 주시기 바랍니다."
    }
  }
},

  // ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다",
    content: "서로 다른 길을 걸어온 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해 주시면 감사하겠습니다."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "우리의 이야기",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "권구환", bank: "우리은행", number: "1002150295462", kakaopay: "https://qr.kakaopay.com/Ej8bEDkgG" },
      { role: "아버지", name: "권용진", bank: "신한은행", number: "000-000-000000" }, // 변경 예정
      { role: "어머니", name: "이영임", bank: "농협은행", number: "16801104471" }
    ],
    bride: [
      { role: "신부", name: "김진실", bank: "국민은행", number: "6578201364091",  kakaopay: "https://qr.kakaopay.com/Ej7qmQZxq"},  // 카카오페이 주소만 바꾸면 됨.
      { role: "아버지", name: "김용호", bank: "기업은행", number: "000-000-000000" }, // 변경 예정
      { role: "어머니", name: "김보희", bank: "농협은행", number: "000-000-000000" } // 변경 예정
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "권구환 ♥ 김진실 결혼합니다",
    description: "2026년 08월 01일, 소중한 분들을 초대합니다.",
    image : "images/og/1.jpg"
  }
};
