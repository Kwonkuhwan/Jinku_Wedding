/**
 * Classic Elegant Wedding Invitation
 * Korean Mobile 청첩장 - Script
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     Utility Helpers
     ═══════════════════════════════════════════ */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const day = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours < 12 ? '오전' : '오후';
    const h12 = hours % 12 || 12;
    const minuteStr = minutes > 0 ? ` ${minutes}분` : '';
    return `${year}년 ${month}월 ${date}일 ${day}요일 ${period} ${h12}시${minuteStr}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00`);
  }

  /* ═══════════════════════════════════════════
     Image Auto-Detection
     ═══════════════════════════════════════════ */

  function loadImagesFromFolder(folder, maxAttempts = 50) {
    return new Promise(resolve => {
        const images = [];
        let current = 1;
        let consecutiveFails = 0;

        function tryNext() {
            if (current > maxAttempts || consecutiveFails >= 3) {
                resolve(images);
                return;
            }
            const img = new Image();
            const path = `images/${folder}/${current}.jpg`;
            img.onload = function() {
                images.push(path);
                consecutiveFails = 0;
                current++;
                tryNext();
            };
            img.onerror = function() {
                consecutiveFails++;
                current++;
                tryNext();
            };
            img.src = path;
        }

        tryNext();
    });
  }

  /* ═══════════════════════════════════════════
     Toast
     ═══════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2500);
  }

  /* ═══════════════════════════════════════════
     Clipboard
     ═══════════════════════════════════════════ */

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(successMsg || '복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다');
    }
  }

  /* ═══════════════════════════════════════════
     OG Meta Tags
     ═══════════════════════════════════════════ */

  function setMetaTags() {
    const m = CONFIG.meta;
    document.title = m.title;
    const setMeta = (attr, val, content) => {
      const el = document.querySelector(`meta[${attr}="${val}"]`);
      if (el) el.setAttribute('content', content);
    };
    setMeta('property', 'og:title', m.title);
    setMeta('property', 'og:description', m.description);
    setMeta('property', 'og:image', 'images/og/1.jpg');
    setMeta('name', 'description', m.description);
  }

  /* ═══════════════════════════════════════════
     Curtain
     ═══════════════════════════════════════════ */

  function initCurtain() {
    const curtain = $('#curtain');
    const btn = $('#curtainBtn');
    const namesEl = $('#curtainNames');

    // If useCurtain is false, skip the curtain entirely
    if (CONFIG.useCurtain === false) {
      curtain.style.display = 'none';
      initPetals();
      return;
    }

    namesEl.textContent = `${CONFIG.groom.name}  &  ${CONFIG.bride.name}`;

    btn.addEventListener('click', () => {
      curtain.classList.add('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(() => {
        curtain.classList.add('is-hidden');
        initPetals();
      }, 1400);
    });

    document.body.classList.add('no-scroll');
  }

  /* ═══════════════════════════════════════════
     Falling Petals
     ═══════════════════════════════════════════ */

  function initPetals() {
    const canvas = $('#petalCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const petals = [];
    const PETAL_COUNT = 25;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height * -1 : -20;
        this.size = 8 + Math.random() * 10;
        this.speedY = 0.5 + Math.random() * 1;
        this.speedX = -0.3 + Math.random() * 0.6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.oscillateAmp = 20 + Math.random() * 30;
        this.oscillateSpeed = 0.01 + Math.random() * 0.02;
        this.oscillateOffset = Math.random() * Math.PI * 2;
        this.opacity = 0.2 + Math.random() * 0.4;
        this.t = 0;
      }

      update() {
        this.t++;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.t * this.oscillateSpeed + this.oscillateOffset) * 0.5;
        this.rotation += this.rotSpeed;
        if (this.y > height + 20) this.reset();
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#e8c8b0';
        ctx.beginPath();
        // Petal shape
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          this.size * 0.3, -this.size * 0.4,
          this.size * 0.7, -this.size * 0.5,
          this.size, 0
        );
        ctx.bezierCurveTo(
          this.size * 0.7, this.size * 0.3,
          this.size * 0.3, this.size * 0.3,
          0, 0
        );
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(new Petal());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ═══════════════════════════════════════════
     Hero Section
     ═══════════════════════════════════════════ */

  function initHero() {
    $('#heroPhoto').src = 'images/hero/1.jpg';
    $('#heroNames').textContent = `${CONFIG.groom.name}  ·  ${CONFIG.bride.name}`;
    $('#heroDate').textContent = formatDate(CONFIG.wedding.date, CONFIG.wedding.time);
    $('#heroVenue').textContent = CONFIG.wedding.venue;
  }

  /* ═══════════════════════════════════════════
     Countdown
     ═══════════════════════════════════════════ */

  function initCountdown() {
    const target = getWeddingDateTime();

    function update() {
      const now = new Date();
      const diff = target - now;

      const labelEl = $('#countdownLabel');

      if (diff <= 0) {
        $('#countDays').textContent = '0';
        $('#countHours').textContent = '0';
        $('#countMinutes').textContent = '0';
        $('#countSeconds').textContent = '0';
        labelEl.textContent = '결혼식이 시작되었습니다';
        return;
      }

      const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      labelEl.textContent = `결혼식까지 D-${totalDays}`;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      $('#countDays').textContent = days;
      $('#countHours').textContent = String(hours).padStart(2, '0');
      $('#countMinutes').textContent = String(minutes).padStart(2, '0');
      $('#countSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ═══════════════════════════════════════════
     Greeting Section
     ═══════════════════════════════════════════ */

  function initGreeting() {
    $('#greetingTitle').textContent = CONFIG.greeting.title;
    $('#greetingContent').textContent = CONFIG.greeting.content;

    const g = CONFIG.groom;
    const b = CONFIG.bride;

    function parentLine(father, mother, fatherDeceased, motherDeceased) {
      const fd = fatherDeceased ? ' deceased' : '';
      const md = motherDeceased ? ' deceased' : '';
      return `<span class="${fd}">${father}</span> · <span class="${md}">${mother}</span>`;
    }

    const parentsHTML = `
      <div class="parent-row">
        ${parentLine(g.father, g.mother, g.fatherDeceased, g.motherDeceased)}
        <span class="parent-dot">●</span>
        의 아들 <span class="child-name">${g.name}</span>
      </div>
      <div class="parent-row">
        ${parentLine(b.father, b.mother, b.fatherDeceased, b.motherDeceased)}
        <span class="parent-dot">●</span>
        의 딸 <span class="child-name">${b.name}</span>
      </div>
    `;

    $('#greetingParents').innerHTML = parentsHTML;
  }

  /* ═══════════════════════════════════════════
     Calendar Section
     ═══════════════════════════════════════════ */

  function initCalendar() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const weddingDay = dt.getDate();

    const grid = $('#calendarGrid');

    // Header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    grid.innerHTML = `<div class="calendar__header">${monthNames[month]} ${year}</div>`;

    // Weekdays
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const wdRow = document.createElement('div');
    wdRow.className = 'calendar__weekdays';
    weekdays.forEach(wd => {
      const el = document.createElement('span');
      el.className = 'calendar__weekday';
      el.textContent = wd;
      wdRow.appendChild(el);
    });
    grid.appendChild(wdRow);

    // Days
    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar__days';

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'calendar__day is-empty';
      daysContainer.appendChild(empty);
    }

    for (let d = 1; d <= lastDate; d++) {
      const dayEl = document.createElement('span');
      dayEl.className = 'calendar__day';
      if (d === weddingDay) dayEl.classList.add('is-today');
      dayEl.textContent = d;
      daysContainer.appendChild(dayEl);
    }

    grid.appendChild(daysContainer);

    // Google Calendar link
    const startDate = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDt = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
    const endDate = endDt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.groom.name + ' ♥ ' + CONFIG.bride.name + ' 결혼식')}&dates=${startDate}/${endDate}&location=${encodeURIComponent(CONFIG.wedding.venue + ' ' + CONFIG.wedding.address)}&details=${encodeURIComponent('결혼식에 초대합니다.')}`;
    $('#googleCalBtn').href = gcalUrl;

    // ICS download
    $('#icsDownloadBtn').addEventListener('click', () => {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding//Invitation//KO',
        'BEGIN:VEVENT',
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 결혼식`,
        `LOCATION:${CONFIG.wedding.venue} ${CONFIG.wedding.address}`,
        'DESCRIPTION:결혼식에 초대합니다.',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wedding.ics';
      a.click();
      URL.revokeObjectURL(url);
      showToast('캘린더 파일이 다운로드됩니다');
    });
  }

  /* ═══════════════════════════════════════════
     Story Section
     ═══════════════════════════════════════════ */

  function initStory(storyImages) {
  $('#storyTitle').textContent = CONFIG.story.title;
  $('#storyContent').textContent = CONFIG.story.content;

  const container = $('#storyPhotos');
  const placeholder = container.querySelector('.loading-placeholder');
  if (placeholder) placeholder.remove();

  if (storyImages.length === 0) return;

  // 1. 여기에 각 사진 순서대로 들어갈 정보를 입력하세요.
  const profileData = [
    { name: "🤵‍권구환", details: "#31세 #ISTJ #개발자<br>#추구미 #건물주" }, // 첫 번째 사진 정보
    { name: "👰김진실", details: "#31세 #ESFP #마케터<br>#추구미 #돈많은백수" }  // 두 번째 사진 정보
    // 사진이 더 있다면 { name: "...", details: "..." } 식으로 계속 추가
  ];

  storyImages.forEach((src, i) => {
    const data = profileData[i] || { name: "이름", details: "정보" }; // 데이터가 없으면 기본값 노출
    
    const div = document.createElement('div');
    div.className = 'story__photo-item animate-item';
    div.setAttribute('data-animate', 'fade-up');
    
    // 2. 이미지 아래에 정보 영역(story__info)을 추가했습니다.
    div.innerHTML = `
      <img src="${src}" alt="스토리 사진 ${i + 1}" loading="lazy">
      <div class="story__info">
        <p class="story__name">${data.name}</p>
        <p class="story__details">${data.details}</p>
      </div>
    `;
    
    div.addEventListener('click', () => openPhotoModal(storyImages, i));
    container.appendChild(div);
  });
}

  /* ═══════════════════════════════════════════
     Gallery Section
     ═══════════════════════════════════════════ */

function initGallery(galleryImages) {
  const grid = $('#galleryGrid');
  const placeholder = grid.querySelector('.loading-placeholder');
  if (placeholder) placeholder.remove();

  if (galleryImages.length === 0) {
    const gallerySection = $('#gallery');
    if (gallerySection) gallerySection.style.display = 'none';
    return;
  }

  const INITIAL_COUNT = 9; // 처음에 보여줄 사진 개수
  let isExpanded = false;

  // 갤러리 아이템 렌더링 함수
  function renderGalleryItems(showAll = false) {
    // 기존 아이템들 제거
    grid.innerHTML = '';
    
    const itemsToShow = showAll ? galleryImages.length : Math.min(INITIAL_COUNT, galleryImages.length);
    
    // ═══ DOM 요소 생성 루프 시작 ═══
    for (let i = 0; i < itemsToShow; i++) {
      const div = document.createElement('div');
      div.className = 'gallery__item animate-item';
      div.setAttribute('data-animate', 'scale-in');
      div.innerHTML = `<img src="${galleryImages[i]}" alt="갤러리 사진 ${i + 1}" loading="lazy">`;
      
      div.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPhotoModal(galleryImages, i);
      });
      
      grid.appendChild(div);
    }
    // ═══ DOM 요소 생성 루프 끝 ═══
    
    // 🎨 ↓↓↓ 여기에 애니메이션 코드 추가! ↓↓↓ 🎨
    if (showAll && isExpanded) {
      // 새로 추가되는 아이템들에 애니메이션 적용
      setTimeout(() => {
        const newItems = grid.querySelectorAll('.gallery__item:nth-child(n+7)');
        newItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('fade-in');
          }, index * 50);
        });
      }, 50);
    }
    // 🎨 ↑↑↑ 애니메이션 코드 끝 ↑↑↑ 🎨
  }

  // 처음에는 6장만 렌더링
  renderGalleryItems(false);

  // 6장보다 많으면 더보기 버튼 추가
  if (galleryImages.length > INITIAL_COUNT) {
    const moreContainer = document.createElement('div');
    moreContainer.className = 'gallery__more-container';
    
    const moreBtn = document.createElement('button');
    moreBtn.className = 'gallery__more-btn';
    moreBtn.innerHTML = `
      <span class="gallery__more-text">더보기</span>
      <span class="gallery__more-count">(+${galleryImages.length - INITIAL_COUNT})</span>
      <span class="gallery__more-arrow">↓</span>
    `;
    
    moreContainer.appendChild(moreBtn);
    grid.parentElement.insertBefore(moreContainer, grid.nextSibling);

    // 더보기/접기 토글 기능
    moreBtn.addEventListener('click', () => {
      if (!isExpanded) {
        // ⚠️ 중요: renderGalleryItems 호출 전에 isExpanded를 true로 설정!
        isExpanded = true;
        renderGalleryItems(true);
        
        // 버튼 텍스트 변경
        moreBtn.querySelector('.gallery__more-text').textContent = '접기';
        moreBtn.querySelector('.gallery__more-count').style.display = 'none';
        //moreBtn.querySelector('.gallery__more-arrow').textContent = '↑';
        moreBtn.classList.add('is-expanded');
      } else {
        // 6장만 표시
        isExpanded = false;
        renderGalleryItems(false);
        
        // 버튼 텍스트 원래대로
        moreBtn.querySelector('.gallery__more-text').textContent = '더보기';
        moreBtn.querySelector('.gallery__more-count').style.display = '';
        //moreBtn.querySelector('.gallery__more-arrow').textContent = '↓';
        moreBtn.classList.remove('is-expanded');
        
        // 갤러리 상단으로 부드럽게 스크롤
        setTimeout(() => {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  }
}

 /* ═══════════════════════════════════════════
   Photo Modal (with Advanced Zoom & Swipe)
   ═══════════════════════════════════════════ */

let modalImages = [];
let modalIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// 줌 관련 변수
let scale = 1;
let translateX = 0;
let translateY = 0;
let lastScale = 1;
let lastTranslateX = 0;
let lastTranslateY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let lastTapTime = 0;

function openPhotoModal(images, index) {
  modalImages = images;
  modalIndex = index;
  resetZoom();
  showModalImage();
  $('#photoModal').classList.add('is-open');
  document.body.classList.add('no-scroll');
}

function closePhotoModal() {
  $('#photoModal').classList.remove('is-open');
  document.body.classList.remove('no-scroll');
  resetZoom();
}

function showModalImage() {
  const img = $('#modalImg');
  img.src = modalImages[modalIndex];
  $('#modalCounter').textContent = `${modalIndex + 1} / ${modalImages.length}`;

  $('#modalPrev').style.display = modalIndex > 0 ? '' : 'none';
  $('#modalNext').style.display = modalIndex < modalImages.length - 1 ? '' : 'none';
  
  resetZoom();
}

function modalNavigate(dir) {
  const newIndex = modalIndex + dir;
  if (newIndex >= 0 && newIndex < modalImages.length) {
    modalIndex = newIndex;
    showModalImage();
  }
}

function resetZoom() {
  scale = 1;
  translateX = 0;
  translateY = 0;
  lastScale = 1;
  lastTranslateX = 0;
  lastTranslateY = 0;
  updateTransform();
}

function updateTransform() {
  const img = $('#modalImg');
  img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  img.style.transition = isDragging ? 'none' : 'transform 0.3s ease';
}

function getDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function getCenter(touch1, touch2) {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2
  };
}

function initPhotoModal() {
  const modal = $('#photoModal');
  const container = $('#modalContainer');
  const img = $('#modalImg');

  $('#modalClose').addEventListener('click', closePhotoModal);
  $('#modalPrev').addEventListener('click', () => modalNavigate(-1));
  $('#modalNext').addEventListener('click', () => modalNavigate(1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'modalContainer') {
      closePhotoModal();
    }
  });

  // 키보드 네비게이션
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closePhotoModal();
    if (e.key === 'ArrowLeft') modalNavigate(-1);
    if (e.key === 'ArrowRight') modalNavigate(1);
  });

  // 터치 이벤트 변수
  let initialDistance = 0;
  let initialScale = 1;
  let touches = [];

  // 터치 시작
  container.addEventListener('touchstart', (e) => {
    touches = Array.from(e.touches);
    
    if (touches.length === 2) {
      // 핀치 줌 시작
      e.preventDefault();
      initialDistance = getDistance(touches[0], touches[1]);
      initialScale = scale;
    } else if (touches.length === 1) {
      // 더블탭 감지
      const currentTime = new Date().getTime();
      const tapGap = currentTime - lastTapTime;
      
      if (tapGap < 300 && tapGap > 0) {
        // 더블탭 확대/축소
        e.preventDefault();
        if (scale > 1) {
          resetZoom();
        } else {
          scale = 2.5;
          updateTransform();
        }
      }
      
      lastTapTime = currentTime;
      
      // 드래그 시작 (확대된 상태에서만)
      if (scale > 1) {
        isDragging = true;
        dragStartX = touches[0].clientX - translateX;
        dragStartY = touches[0].clientY - translateY;
      } else {
        // 스와이프 준비
        touchStartX = touches[0].clientX;
        touchStartY = touches[0].clientY;
      }
    }
  }, { passive: false });

  // 터치 이동
  container.addEventListener('touchmove', (e) => {
    touches = Array.from(e.touches);
    
    if (touches.length === 2) {
      // 핀치 줌
      e.preventDefault();
      const currentDistance = getDistance(touches[0], touches[1]);
      const newScale = initialScale * (currentDistance / initialDistance);
      
      scale = Math.max(1, Math.min(4, newScale));
      updateTransform();
    } else if (touches.length === 1 && isDragging && scale > 1) {
      // 드래그 이동
      e.preventDefault();
      translateX = touches[0].clientX - dragStartX;
      translateY = touches[0].clientY - dragStartY;
      
      // 이동 범위 제한
      const maxTranslate = (scale - 1) * 150;
      translateX = Math.max(-maxTranslate, Math.min(maxTranslate, translateX));
      translateY = Math.max(-maxTranslate, Math.min(maxTranslate, translateY));
      
      updateTransform();
    }
  }, { passive: false });

  // 터치 종료
  container.addEventListener('touchend', (e) => {
    if (touches.length === 2) {
      // 핀치 줌 종료
      lastScale = scale;
    } else if (isDragging) {
      // 드래그 종료
      isDragging = false;
      lastTranslateX = translateX;
      lastTranslateY = translateY;
    } else if (scale === 1) {
      // 스와이프 처리 (확대되지 않은 상태에서만)
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
    }
    
    // 축소 시 위치 초기화
    if (scale <= 1) {
      resetZoom();
    }
    
    touches = [];
  }, { passive: true });

  // 마우스 휠 줌 (데스크탑)
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = scale * delta;
    scale = Math.max(1, Math.min(4, newScale));
    
    if (scale <= 1) {
      resetZoom();
    } else {
      updateTransform();
    }
  }, { passive: false });

  // 이미지 로드 시 줌 초기화
  img.addEventListener('load', () => {
    resetZoom();
  });
}

function handleSwipe() {
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  const minSwipe = 50;

  if (Math.abs(diffX) < minSwipe || Math.abs(diffX) < Math.abs(diffY)) return;

  if (diffX > 0) {
    modalNavigate(1); // swipe left -> next
  } else {
    modalNavigate(-1); // swipe right -> prev
  }
}


  /* ═══════════════════════════════════════════
     Location Section
     ═══════════════════════════════════════════ */

function initLocation() {
  const w = CONFIG.wedding;
  
  // 기본 정보 설정
  $('#locationVenue').textContent = w.venue;
  $('#locationHall').textContent = w.hall;
  $('#locationAddress').textContent = w.address;
  $('#locationTel').textContent = w.tel ? `Tel. ${w.tel}` : '';
  $('#locationMapImg').src = 'images/location/1.jpg';
  $('#kakaoMapBtn').href = w.mapLinks.kakao || '#';
  $('#naverMapBtn').href = w.mapLinks.naver || '#';

  // 주소 복사 기능
  $('#copyAddressBtn').addEventListener('click', () => {
    copyToClipboard(w.address, '주소가 복사되었습니다');
  });

  // 교통 정보 렌더링
  if (w.transport) {
    const transportContainer = $('#locationTransport');
    if (!transportContainer) return; // 안전장치

    let transportHTML = '<h3 class="transport__title">교통 안내</h3><div class="transport__content">';

    // 지하철 정보
    if (w.transport.subway && w.transport.subway.lines) {
      transportHTML += '<div class="transport__section">';
      transportHTML += '<div class="transport__label">🚇 지하철</div>';
      transportHTML += '<div class="transport__items">';
      
      w.transport.subway.lines.forEach(line => {
        transportHTML += `
          <div class="transport__item">
            <span class="subway__badge" style="background-color: ${line.color}">
              ${line.name}
            </span>
            <span class="transport__detail">
              <strong>${line.station}</strong> ${line.exit} ${line.time}
            </span>
          </div>
        `;
      });
      
      transportHTML += '</div></div>';
    }

    // 버스 정보
    if (w.transport.bus && w.transport.bus.info) {
      const busInfo = w.transport.bus.info.replace(/\n/g, '<br>');
      transportHTML += `
        <div class="transport__section">
          <div class="transport__label">🚌 버스</div>
          <div class="transport__info">${busInfo}</div>
        </div>
      `;
    }

    // 주차 정보 (버스와 동일한 구조로 변경)
    if (w.transport.parking) {
      // ✨ transport__section--parking 대신 일반 transport__section 사용
      transportHTML += '<div class="transport__section">';
      transportHTML += '<div class="transport__label">🅿️ 주차 안내</div>';
  
      if (w.transport.parking.available) {
        // 줄바꿈 처리
        const parkingInfo = w.transport.parking.info.replace(/\n/g, '<br>');
        transportHTML += `<div class="transport__info">${parkingInfo}</div>`;
      } else {
        transportHTML += '<div class="transport__info parking__unavailable">주차 공간이 없습니다</div>';
      }
  
      if (w.transport.parking.notice) {
        // 주의사항도 같은 스타일로
        const parkingNotice = w.transport.parking.notice.replace(/\n/g, '<br>');
        transportHTML += `<div class="transport__info transport__notice">${parkingNotice}</div>`;
      }
  
      transportHTML += '</div>';
    }

    transportHTML += '</div>';
    transportContainer.innerHTML = transportHTML;
  }
}

  /* ═══════════════════════════════════════════
     Account Section (축의금)
     ═══════════════════════════════════════════ */

    function renderAccounts(accounts, containerId) {
      const container = $(`#${containerId}`);
      container.innerHTML = ''; // 기존 내용 초기화
  
      accounts.forEach((acc) => {
        const item = document.createElement('div');
        item.className = 'account-item';
    
        // 카카오페이 링크가 있을 때만 송금 버튼 생성
        const kakaoBtn = acc.kakaopay 
          ? `<a href="${acc.kakaopay}" target="_blank" rel="noopener" class="account-item__kakaopay">
               카카오페이
             </a>`
          : '';
    
        item.innerHTML = `
          <div class="account-item__info">
            <div class="account-item__role">${acc.role}</div>
            <div class="account-item__detail">
              <span class="account-item__name">${acc.name || ''}</span>
              ${acc.bank} ${acc.number}
            </div>
          </div>
          <div class="account-item__actions">
            ${kakaoBtn}
            <button class="account-item__copy" data-account="${acc.bank} ${acc.number} ${acc.name || ''}">
              복사
            </button>
          </div>
        `;
        container.appendChild(item);
      });
    }

  function initAccordion(triggerId, panelId) {
    const trigger = $(`#${triggerId}`);
    const panel = $(`#${panelId}`);

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);

      if (!expanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = '0';
      }
    });
  }

  function initAccounts() {
    renderAccounts(CONFIG.accounts.groom, 'groomAccountList');
    renderAccounts(CONFIG.accounts.bride, 'brideAccountList');

    initAccordion('groomAccordion', 'groomAccordionPanel');
    initAccordion('brideAccordion', 'brideAccordionPanel');

    // Copy account delegates
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.account-item__copy');
      if (!btn) return;
      const text = btn.dataset.account;
      copyToClipboard(text, '계좌번호가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Footer
     ═══════════════════════════════════════════ */

  function initFooter() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    $('#footerText').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name} — ${year}.${month}.${day}`;
  }

  /* ═══════════════════════════════════════════
     Loading Placeholders
     ═══════════════════════════════════════════ */

  function showLoadingPlaceholders() {
    const storyPhotos = $('#storyPhotos');
    const galleryGrid = $('#galleryGrid');

    const placeholderHTML = '<div class="loading-placeholder"><span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></div>';

    if (storyPhotos) storyPhotos.innerHTML = placeholderHTML;
    if (galleryGrid) galleryGrid.innerHTML = placeholderHTML;
  }

  /* ═══════════════════════════════════════════
     Scroll Animations (IntersectionObserver)
     ═══════════════════════════════════════════ */

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    // Observe initial static items
    $$('.animate-item').forEach((el) => observer.observe(el));

    // Re-observe after dynamic content is added (MutationObserver)
    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.classList && node.classList.contains('animate-item')) {
            observer.observe(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('.animate-item').forEach((el) => observer.observe(el));
          }
        });
      });
    });

    mutObs.observe(document.body, { childList: true, subtree: true });
  }

    /* ═══════════════════════════════════════════
     music
     ═══════════════════════════════════════════ */

function initMusic() {
  if (!CONFIG.music || !CONFIG.music.showButton) return;

  const audio = new Audio(CONFIG.music.mediaUrl);
  audio.loop = true;
  
  // 이미 버튼이 있다면 중복 생성 방지
  if (document.querySelector('.music-control')) return;

  const musicBtn = document.createElement('div');
  musicBtn.className = 'music-control';
  musicBtn.innerHTML = '<span id="musicIcon">♬</span>'; 
  
  // CSS를 JS에서 직접 주입 (좌표 강제 고정)
  Object.assign(musicBtn.style, {
    position: 'fixed',
    bottom: '25px',
    right: '20px',
    left: 'auto', // 왼쪽으로 튀는 것 방지
    width: '48px',
    height: '48px',
    zIndex: '999999',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #b8956a',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    cursor: 'pointer'
  });

  document.body.appendChild(musicBtn);
  
  // 브라우저 창 크기가 변해도 위치를 사수하는 마법
  window.addEventListener('resize', () => {
    musicBtn.style.right = '20px';
    musicBtn.style.left = 'auto';
  });

  // 중요: body 바로 아래에 넣어야 다른 요소에 가려지지 않습니다.
  document.body.appendChild(musicBtn);

  const musicIcon = document.getElementById('musicIcon');

  // 음악 재생 및 아이콘 변경 함수
  window.playWeddingMusic = function() {
    if (audio.paused) {
      audio.play().then(() => {
        musicBtn.classList.add('playing');
        musicIcon.textContent = '❚❚'; 
      }).catch(e => console.log("자동 재생 제한:", e));
    }
  };

  // 음악 정지 및 아이콘 변경 함수
  window.pauseWeddingMusic = function() {
    audio.pause();
    musicBtn.classList.remove('playing');
    musicIcon.textContent = '♬';
  };

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) window.playWeddingMusic();
    else window.pauseWeddingMusic();
  });

  // 커튼 없이 바로 들어오는 경우를 위한 첫 클릭 이벤트
  document.addEventListener('click', () => {
    if (audio.paused) window.playWeddingMusic();
  }, { once: true });
}

  /* ═══════════════════════════════════════════
     Init
     ═══════════════════════════════════════════ */

  async function init() {
    setMetaTags();
    initMusic();
    initCurtain();
    initHero();
    initCountdown();
    initGreeting();
    initCalendar();

    // Show loading placeholders while detecting images
    showLoadingPlaceholders();

    // Init sections that don't depend on image detection
    initPhotoModal();
    initLocation();
    initAccounts();
    initFooter();
    initScrollAnimations();

    // Set story text immediately (photos load async)
    $('#storyTitle').textContent = CONFIG.story.title;
    $('#storyContent').textContent = CONFIG.story.content;

    // Auto-detect story and gallery images in parallel
    const [storyImages, galleryImages] = await Promise.all([
      loadImagesFromFolder('story'),
      loadImagesFromFolder('gallery')
    ]);

    // Render sections with discovered images
    initStory(storyImages);
    initGallery(galleryImages);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
