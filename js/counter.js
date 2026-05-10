document.addEventListener('DOMContentLoaded', function() {
  const isIndex = window.location.pathname === '/' ||
                  window.location.pathname.endsWith('/index.html') ||
                  window.location.pathname === '';
  if (!isIndex) return;

  const counterElements = document.querySelectorAll('.counter-digits');
  if (counterElements.length === 0) return;

  let visits = parseInt(localStorage.getItem('retro2000_visits') || '0', 10);
  visits++;
  localStorage.setItem('retro2000_visits', visits.toString());

  const displayNum = visits.toString().padStart(7, '0');

  counterElements.forEach(el => {
    el.textContent = displayNum;
  });

  const milestones = [100, 500, 1000, 5000, 10000, 50000, 100000];

  milestones.forEach(m => {
    if (visits === m) {
      const msg = document.createElement('div');
      msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #000;
        color: #ffff00;
        font-family: 'Press Start 2P', monospace;
        font-size: 14px;
        padding: 20px 30px;
        border: 3px solid #ffff00;
        box-shadow: 0 0 30px #ffff00;
        z-index: 99999;
        text-align: center;
      `;
      msg.innerHTML = `&#x2B50; HITO ${m} VISITAS &#x2B50;<br><span style="font-size:10px;">Gracias por estar aqu&#xED;</span>`;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 4000);
    }
  });
});
