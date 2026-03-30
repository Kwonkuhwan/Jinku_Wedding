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
    showButton: true,
    autoPlay: true,
    mediaUrl: "music/bgm.m4a", // 파일 경로
    // 아래 음원 정보 문구 추가
    info: {
      title: "Wedding Smile",
      artist: "@브금통장",
      link: "https://www.youtube.com/watch?v=Dr0XArLBNf4&t=3988s"
    }
  },

  // ── 초대장 열기 ──
  useCurtain: true,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

    // ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다.",
    content: "어느새 서로의 하루에 빠질수 없는 존재가 되어\n이제는 평생을 함께하기로 했습니다.\n\n지금처럼 서로에게 가장 친한 친구가 되어\n예쁘고 행복하게 잘 살겠습니다.\n\n저희 두 사람의 첫 시작을 함께 해주시면\n큰 기쁨으로 간직하겠습니다."
  },  

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

  // ── 오시는 길 ──
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
      info: "간선버스 146, 333, 341, 360, 740번\n(선릉역 정류장 하차)"
    },
    parking: {
      available: true,
      info: "건물 지하주차장 이용 가능 (2시간 무료)\n450대 주차 가능",
      notice: "주차장 입구가 다소 좁으므로 유의하시고,\n가급적 대중교통을 이용해 주시기 바랍니다."
    }
  }
},

   // ── 스토리 정보 (이름, MBTI 등) ──
  story: {
    title: "두 사람의 Release Note💍",
    content: "업데이트 내역\nver 1.0 — 2017년 봄, 캠퍼스 커플\nver 2.0 — 졸업 후에도 변함없이\nver 3.0 — 사회인이 되어도 함께\nver 4.0 — 2026년 8월 1일, 부부로 정식 출시🎉\n\n출시 예정\nver 5.0 — 예정, 업데이트 기대해주세요.\n\n평생 무료 업데이트를 약속드립니다.\n\n✅이번 업데이트는 오프라인 전용 이벤트로\n참석자만 체험 가능합니다.",
 
    // 사진별 상세 정보 추가
    participants: [
      { name: "🤵‍권구환", details: "#31세 #ISTJ #개발자<br>#추구미 #건물주" },
      { name: "👰김진실", details: "#31세 #ESFP #마케터<br>#추구미 #돈많은백수" }
    ]
  },

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "권구환", bank: "우리은행", number: "1002150295462", kakaopay: "https://qr.kakaopay.com/Ej8bEDkgG" },
      { role: "아버지", name: "권용진", bank: "농협은행", number: "16712552321" }, // 변경 예정
      { role: "어머니", name: "이영임", bank: "농협은행", number: "16801104471" }
    ],
    bride: [
      { role: "신부", name: "김진실", bank: "국민은행", number: "6578201364091",  kakaopay: "https://qr.kakaopay.com/Ej7qmQZxq"},  // 카카오페이 주소만 바꾸면 됨.
      { role: "아버지", name: "김용호", bank: "우리은행", number: "1002044279497" }, // 변경 예정
      { role: "어머니", name: "김보희", bank: "국민은행", number: "59480101026307" } // 변경 예정
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "권구환 ♥ 김진실 결혼합니다",
    description: "2026년 08월 01일, 소중한 분들을 초대합니다.",
    image : "images/og/1.jpg"
  }
};
