/* ===== THIỆP CƯỚI ONLINE - MAIN JS ===== */

document.addEventListener('DOMContentLoaded', function() {

  // ===== CONFIGURATION =====
  // Thay đổi ngày cưới ở đây (định dạng: YYYY-MM-DD HH:mm)
  const WEDDING_DATE = new Date('2026-06-01T07:00:00');
  
  // ===== ENVELOPE OPEN =====
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('envelope-open-btn');
  
  if (openBtn && envelope) {
    openBtn.addEventListener('click', function() {
      envelope.classList.add('hidden');
      const audio = document.getElementById('bg-music');
      if (audio) {
        audio.play().then(() => {
          const icon = document.querySelector('.music-icon');
          if (icon) icon.classList.add('playing');
          setMusicState(true);
        }).catch(() => {});
      }
      setTimeout(createConfetti, 300);
    });
  }

  // ===== MUSIC PLAYER =====
  let isMusicPlaying = false;
  const audio = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');

  function setMusicState(state) {
    isMusicPlaying = state;
    if (musicBtn) {
      const icon = musicBtn.querySelector('.music-icon');
      if (icon) {
        if (isMusicPlaying) {
          icon.classList.add('playing');
        } else {
          icon.classList.remove('playing');
        }
      }
    }
  }

  if (musicBtn && audio) {
    musicBtn.addEventListener('click', function() {
      if (isMusicPlaying) {
        audio.pause();
        setMusicState(false);
      } else {
        audio.play().then(() => {
          setMusicState(true);
        }).catch(() => {});
      }
    });
  }

  // ===== COUNTDOWN TIMER =====
  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '0';
      if (hoursEl) hoursEl.textContent = '0';
      if (minutesEl) minutesEl.textContent = '0';
      if (secondsEl) secondsEl.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== SCROLL ANIMATIONS =====
  function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const windowHeight = window.innerHeight;

    elements.forEach(function(el) {
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top;
      const triggerPoint = windowHeight * 0.85;

      if (elementTop < triggerPoint) {
        el.classList.add('animated');
      }
    });
  }

  window.addEventListener('scroll', handleScrollAnimations);
  window.addEventListener('resize', handleScrollAnimations);
  handleScrollAnimations();

  // ===== AUTO SCROLL =====
  const autoScrollBtn = document.getElementById('auto-scroll-btn');
  let isAutoScrolling = false;
  let autoScrollSpeed = 1; // pixels per frame
  let scrollRaf = null;
  let userScrollTimeout = null;

  function startAutoScroll() {
    isAutoScrolling = true;
    autoScrollBtn.classList.add('scrolling');
    autoScroll();
  }

  function stopAutoScroll() {
    isAutoScrolling = false;
    autoScrollBtn.classList.remove('scrolling');
    if (scrollRaf) {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = null;
    }
  }

  function autoScroll() {
    if (!isAutoScrolling) return;
    window.scrollBy(0, autoScrollSpeed);
    
    // Dừng khi đến cuối trang
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 5) {
      stopAutoScroll();
      return;
    }
    
    scrollRaf = requestAnimationFrame(autoScroll);
  }

  // Hiện nút auto-scroll sau khi mở thiệp
  if (autoScrollBtn) {
    // Hiện nút sau khi mở thiệp hoặc scroll xuống
    function checkShowAutoScrollBtn() {
      if (envelope && !envelope.classList.contains('hidden')) {
        autoScrollBtn.classList.remove('visible');
        return;
      }
      if (window.scrollY > 100) {
        autoScrollBtn.classList.add('visible');
      } else {
        autoScrollBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', checkShowAutoScrollBtn);

    // Theo dõi khi mở thiệp để hiện nút
    const observer = new MutationObserver(function() {
      if (envelope && envelope.classList.contains('hidden')) {
        setTimeout(function() {
          autoScrollBtn.classList.add('visible');
        }, 1000);
      }
    });
    if (envelope) {
      observer.observe(envelope, { attributes: true, attributeFilter: ['class'] });
    }

    autoScrollBtn.addEventListener('click', function() {
      if (isAutoScrolling) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }
    });

    // Người dùng cuộn tay → dừng auto-scroll
    let lastScrollTop = 0;
    window.addEventListener('wheel', function(e) {
      if (isAutoScrolling) {
        stopAutoScroll();
      }
    }, { passive: true });

    window.addEventListener('touchstart', function() {
      if (isAutoScrolling) {
        stopAutoScroll();
      }
    }, { passive: true });
  }

  // ===== GALLERY LIGHTBOX =====
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryItems.forEach(function(img) {
    img.addEventListener('click', function() {
      const src = this.src;
      if (lightboxImg) lightboxImg.src = src;
      if (lightbox) lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // ===== MESSAGE / GUESTBOOK =====
  const messageForm = document.getElementById('message-form');
  const messageListEl = document.getElementById('message-list');

  // ===== FIREBASE (chia sẻ lời chúc cho tất cả mọi người) =====
  let useFirebase = false;
  let dbRef = null;

  try {
    // Kiểm tra FIREBASE_CONFIG (được khai báo trong index.html)
    if (typeof FIREBASE_CONFIG !== 'undefined' && FIREBASE_CONFIG.databaseURL) {
      firebase.initializeApp(FIREBASE_CONFIG);
      dbRef = firebase.database().ref('messages');
      useFirebase = true;
      console.log('Firebase đã kết nối thành công!');
    } else {
      console.warn('Firebase chưa cấu hình, dùng localStorage');
    }
  } catch (e) {
    console.warn('Lỗi Firebase, dùng localStorage:', e.message);
  }

  // --- Hiển thị lời chúc ---
  function renderMessages(messages) {
    if (!messageListEl) return;
    messageListEl.innerHTML = '';
    const sorted = messages.slice().sort(function(a, b) {
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
    sorted.forEach(function(msg) {
      const item = createMessageElement(msg);
      messageListEl.appendChild(item);
    });
  }

  function createMessageElement(msg) {
    const div = document.createElement('div');
    div.className = 'message-item';
    div.innerHTML = 
      '<div class="message-item-name">' + escapeHtml(msg.name) + '</div>' +
      '<div class="message-item-text">' + escapeHtml(msg.message) + '</div>' +
      '<div class="message-item-time">' + msg.time + '</div>';
    return div;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  function formatTime(date) {
    return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + 
           date.getHours().toString().padStart(2,'0') + ':' + date.getMinutes().toString().padStart(2,'0');
  }

  function showToast(message) {
    // Tạo toast nếu chưa có
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
    }, 2500);
  }

  // --- Tải lời chúc ---
  function loadMessages() {
    if (useFirebase && dbRef) {
      dbRef.orderByChild('timestamp').on('value', function(snapshot) {
        const messages = [];
        snapshot.forEach(function(child) {
          messages.push(child.val());
        });
        renderMessages(messages);
      });
    } else {
      const saved = localStorage.getItem('wedding_messages');
      if (saved && messageListEl) {
        const messages = JSON.parse(saved);
        renderMessages(messages);
      }
    }
  }

  // --- Gửi lời chúc ---
  if (messageForm) {
    messageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nameInput = document.getElementById('msg-name');
      const messageInput = document.getElementById('msg-text');
      
      const name = nameInput ? nameInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !message) {
        showToast('Vui lòng nhập tên và lời chúc!');
        return;
      }

      const now = new Date();
      const timeStr = formatTime(now);
      const timestamp = now.getTime();

      const newMsg = {
        name: name,
        message: message,
        time: timeStr,
        timestamp: timestamp
      };

      if (useFirebase && dbRef) {
        dbRef.push(newMsg).then(function() {
          showToast('Gửi lời chúc thành công!');
        }).catch(function(err) {
          showToast('Không thể gửi. Vui lòng thử lại!');
          console.error('Firebase error:', err);
        });
      } else {
        let messages = [];
        const saved = localStorage.getItem('wedding_messages');
        if (saved) messages = JSON.parse(saved);
        messages.push(newMsg);
        localStorage.setItem('wedding_messages', JSON.stringify(messages));
        renderMessages(messages);
        showToast('Gửi lời chúc thành công!');
      }

      if (nameInput) nameInput.value = '';
      if (messageInput) messageInput.value = '';
    });
  }

  loadMessages();

  // ===== CONFETTI =====
  function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#E8D29B', '#9C5A1A', '#f5e6c8', '#d4a574', '#c08b5c', '#e6c99a', '#b8860b'];

    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = (Math.random() * 8 + 4) + 'px';
      confetti.style.height = (Math.random() * 8 + 4) + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      confetti.style.animationDelay = (Math.random() * 1) + 's';
      container.appendChild(confetti);
    }

    setTimeout(function() {
      container.remove();
    }, 5000);
  }

  // ===== SMOOTH SCROLL for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
