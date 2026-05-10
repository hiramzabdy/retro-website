document.addEventListener('DOMContentLoaded', function() {
  initStarfield();
  initCursorTrail();
  initActiveNav();
});

function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    const count = Math.floor((canvas.width * canvas.height) / 2000);
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: 1,
        color: ['#ffffff', '#ff6ec7', '#00d4ff', '#ffff00', '#39ff14'][Math.floor(Math.random() * 5)]
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      star.opacity += star.twinkleSpeed * star.twinkleDir;
      if (star.opacity > 1) {
        star.opacity = 1;
        star.twinkleDir = -1;
      } else if (star.opacity < 0.1) {
        star.opacity = 0.1;
        star.twinkleDir = 1;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.globalAlpha = star.opacity;
      ctx.fillStyle = star.color;
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  }

  resize();
  createStars();
  animate();

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });
}

function initCursorTrail() {
  const canvas = document.getElementById('cursor-trail');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = -100;
  let mouseY = -100;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const colors = ['#ff6ec7', '#39ff14', '#00d4ff', '#ffff00', '#ff6600', '#cc00ff'];
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: mouseX + (Math.random() - 0.5) * 10,
        y: mouseY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        decay: Math.random() * 0.03 + 0.02,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.life > 0);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fill();
      ctx.shadowBlur = 5;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(animate);
  }

  animate();
}

function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath && currentPath.includes(linkPath.replace('./', '').replace('../', ''))) {
      link.classList.add('active');
    }
  });

  if (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '') {
    const homeLink = document.querySelector('.nav-link[href="index.html"]');
    if (homeLink) homeLink.classList.add('active');
  }
}
