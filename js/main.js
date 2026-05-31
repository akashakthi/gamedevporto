function initSite() {
  const html = document.documentElement;
  const typed = document.getElementById('typed');
  const themeBtn = document.getElementById('themeBtn');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');

  const phrases = [
    'Junior Game Programmer @ RIVRS',
    'Unity / C# Developer',
    'Roblox / Lua Developer',
    'Multiplayer Systems Builder',
    'SOLID Principles Advocate'
  ];

  function startTyping() {
    if (!typed) return;

    let phraseIndex = 0;
    let deleting = false;
    let text = '';

    function type() {
      const full = phrases[phraseIndex];
      text = deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1);
      typed.textContent = text;

      let speed = deleting ? 34 : 70;

      if (!deleting && text === full) {
        speed = 1450;
        deleting = true;
      } else if (deleting && text === '') {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 360;
      }

      window.setTimeout(type, speed);
    }

    type();
  }

  function setupTheme() {
    const savedTheme = localStorage.getItem('aka-theme');
    html.classList.toggle('light', savedTheme === 'alt');

    themeBtn?.addEventListener('click', () => {
      html.classList.toggle('light');
      localStorage.setItem('aka-theme', html.classList.contains('light') ? 'alt' : 'base');
    });
  }

  function setupMenu() {
    menuBtn?.addEventListener('click', () => {
      nav?.classList.toggle('mobile-open');
    });

    nav?.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
      });
    });
  }

  function setupCursor() {
    if (!cursor || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function loop() {
      ringX += (mouseX - ringX) * .14;
      ringY += (mouseY - ringY) * .14;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      window.requestAnimationFrame(loop);
    }

    loop();

    document.querySelectorAll('a, button, .glass, .hero-board').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '58px';
        ring.style.height = '58px';
        ring.style.background = 'rgba(255, 92, 168, .28)';
      });

      el.addEventListener('mouseleave', () => {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.background = 'rgba(255, 240, 102, .35)';
      });
    });
  }

  function setupShapes() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const colors = ['#ff5ca8', '#fff066', '#9deff4', '#a8f77a', '#c6a5ff', '#ff9f5c'];
    const types = ['rect', 'circle', 'triangle', 'slash'];
    let width = 0;
    let height = 0;
    let shapes = [];

    function makeShape() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 42 + 22,
        speedX: (Math.random() - .5) * .28,
        speedY: (Math.random() - .5) * .28,
        rotate: Math.random() * Math.PI,
        rotateSpeed: (Math.random() - .5) * .004,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)]
      };
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.max(12, Math.floor((width * height) / 85000));
      shapes = Array.from({ length: count }, makeShape);
    }

    function drawShape(shape) {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotate);
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';

      if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, shape.size * .45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(0, -shape.size * .55);
        ctx.lineTo(shape.size * .55, shape.size * .45);
        ctx.lineTo(-shape.size * .55, shape.size * .45);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === 'slash') {
        ctx.fillRect(-shape.size * .45, -8, shape.size * .9, 16);
        ctx.strokeRect(-shape.size * .45, -8, shape.size * .9, 16);
      } else {
        ctx.fillRect(-shape.size * .45, -shape.size * .45, shape.size * .9, shape.size * .9);
        ctx.strokeRect(-shape.size * .45, -shape.size * .45, shape.size * .9, shape.size * .9);
      }

      ctx.restore();
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = .62;

      shapes.forEach((shape) => {
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotate += shape.rotateSpeed;

        if (shape.x < -80) shape.x = width + 80;
        if (shape.x > width + 80) shape.x = -80;
        if (shape.y < -80) shape.y = height + 80;
        if (shape.y > height + 80) shape.y = -80;

        drawShape(shape);
      });

      ctx.globalAlpha = 1;
      window.requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    frame();
  }

  function setupReveal() {
    const targets = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: .12 });

    targets.forEach((el, index) => {
      el.style.transitionDelay = `${(index % 4) * .05}s`;
      observer.observe(el);
    });
  }

  function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const target = document.querySelector(anchor.getAttribute('href'));

        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function setupAudio() {
    const bgMusic = document.getElementById('bgMusic');
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    const soundText = document.getElementById('soundText');

    if (!bgMusic || !soundToggle || !soundIcon || !soundText) return;

    const audioCandidates = [
      'music/BgmWeb.mp3',
      'music/BgmWeb.mpeg',
      'music/BgmWeb.wav',
      'music/BgmWeb.ogg'
    ];

    let currentAudioIndex = 0;
    let isMusicReady = false;

    function setSoundUI(state) {
      soundToggle.classList.toggle('is-playing', state === 'playing');
      soundToggle.classList.toggle('is-error', state === 'error');
      soundToggle.setAttribute('aria-pressed', state === 'playing' ? 'true' : 'false');

      if (state === 'playing') {
        soundIcon.textContent = 'ON';
        soundText.textContent = 'Sound On';
      } else if (state === 'loading') {
        soundIcon.textContent = '...';
        soundText.textContent = 'Loading';
      } else if (state === 'error') {
        soundIcon.textContent = 'ERR';
        soundText.textContent = 'No Audio';
      } else {
        soundIcon.textContent = 'OFF';
        soundText.textContent = 'Sound Off';
      }
    }

    function setAudioSource(index) {
      currentAudioIndex = index;
      bgMusic.src = audioCandidates[currentAudioIndex];
      bgMusic.load();
    }

    function tryNextAudioSource() {
      currentAudioIndex += 1;

      if (currentAudioIndex >= audioCandidates.length) {
        setSoundUI('error');
        console.warn('No playable background music file found. Check /music/BgmWeb.mp3');
        return false;
      }

      setAudioSource(currentAudioIndex);
      return true;
    }

    async function playBackgroundMusic() {
      setSoundUI('loading');

      try {
        bgMusic.volume = .35;

        if (!isMusicReady) {
          setAudioSource(currentAudioIndex);
          isMusicReady = true;
        }

        await bgMusic.play();
        setSoundUI('playing');
      } catch (error) {
        console.warn('Failed to play current audio source:', bgMusic.src, error);

        if (tryNextAudioSource()) {
          window.setTimeout(playBackgroundMusic, 150);
        } else {
          setSoundUI('error');
        }
      }
    }

    function pauseBackgroundMusic() {
      bgMusic.pause();
      setSoundUI('off');
    }

    setSoundUI('off');

    soundToggle.addEventListener('click', async () => {
      if (bgMusic.paused) {
        await playBackgroundMusic();
      } else {
        pauseBackgroundMusic();
      }
    });

    bgMusic.addEventListener('error', () => {
      console.warn('Audio source error:', bgMusic.src);

      if (tryNextAudioSource() && !bgMusic.paused) {
        window.setTimeout(playBackgroundMusic, 150);
      }
    });
  }

  startTyping();
  setupTheme();
  setupMenu();
  setupCursor();
  setupShapes();
  setupReveal();
  setupSmoothAnchors();
  setupAudio();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
