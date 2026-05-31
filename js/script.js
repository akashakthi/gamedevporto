function toggleMenu() {
  const nav = document.getElementById('mobileNav');
  const blur = document.getElementById('blur-overlay');
  nav.classList.toggle('show');
  blur.classList.toggle('visible');
}

document.getElementById('closeNavBtn').addEventListener('click', toggleMenu);
document.getElementById('blur-overlay').addEventListener('click', toggleMenu);

document.getElementById('logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
canvas.style.pointerEvents = 'none';

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let particles = Array.from({ length: 90 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 2 + 0.6,
  d: Math.random() * 1.3 + 0.3,
}));

function getParticleColor(theme) {
  return theme === 'day' ? 'rgba(0, 115, 199, 0.35)' : 'rgba(132, 242, 255, 0.45)';
}

function drawParticles(theme) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = getParticleColor(theme);
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
    ctx.fill();
    p.y += p.d;
    if (p.y > canvas.height) {
      p.y = -5;
      p.x = Math.random() * canvas.width;
    }
  });
}

function startParticleLoop() {
  const theme = document.documentElement.dataset.theme || 'night';
  drawParticles(theme);
  requestAnimationFrame(startParticleLoop);
}
startParticleLoop();

function setupInteractiveCards() {
  const cards = document.querySelectorAll('.interactive-float');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      if (window.innerWidth < 900) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = (0.5 - (y / rect.height)) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('site-theme', theme);
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.textContent = theme === 'day' ? '☀️' : '🌙';
}

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  const soundToggle = document.getElementById('soundToggle');
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('site-theme') || 'night';

  setTheme(savedTheme);
  setupInteractiveCards();

  audio.volume = 0.4;
  audio.play().catch(() => {
    soundToggle.textContent = '🔈';
  });

  soundToggle.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      soundToggle.textContent = '🔊';
    } else {
      audio.pause();
      soundToggle.textContent = '🔈';
    }
  });

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === 'night' ? 'day' : 'night');
  });
});

function scrollToGame(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
