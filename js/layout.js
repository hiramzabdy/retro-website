(function() {
  'use strict';

  const PAGES = [
    { id: 'inicio',      label: 'Inicio',        href: '/index.html' },
    { id: 'musica',      label: 'M&#xFA;sica',        href: '/pages/musica.html' },
    { id: 'tecnologia',  label: 'Tecnolog&#xED;a',    href: '/pages/tecnologia.html' },
    { id: 'videojuegos', label: 'Videojuegos',   href: '/pages/videojuegos.html' },
    { id: 'internet',    label: 'Internet',      href: '/pages/internet.html' },
    { id: 'guestbook',   label: 'Guestbook',     href: '/pages/guestbook.html' },
    { id: 'galeria',     label: 'Galer&#xED;a',       href: '/pages/galeria.html' },
    { id: 'quiz',        label: 'Quiz',          href: '/pages/quiz.html' },
  ];

  function buildLayout() {
    const content = document.getElementById('page-content');
    if (!content) return;

    const pageId = content.dataset.page || 'inicio';
    const pageTitle = content.dataset.title || 'RETRO 2000s';
    const pageSubtitle = content.dataset.subtitle || '';

    const navExtra = content.querySelector('#nav-extra');
    const navExtraHTML = navExtra ? navExtra.innerHTML : '';
    const contentHTML = content.innerHTML
      .replace(/<div[^>]*id="nav-extra"[^>]*>.*?<\/div>/, '');

    content.innerHTML = '';
    content.removeAttribute('id');

    const wrapper = document.createElement('div');
    wrapper.id = 'app';

    const bar = document.createElement('div');
    bar.className = 'construction-bar blink-fast';
    bar.innerHTML = '&#x1F6A7; SITIO EN CONSTRUCCI&#xD3;N PERMANENTE &#x1F6A7; Disculpe las molestias! &#x1F6A7;';

    const table = document.createElement('table');
    table.id = 'main-table';
    table.cellPadding = '0';
    table.cellSpacing = '0';

    const iconHTML = pageId === 'inicio'
      ? '<div class="welcome-gif">&#x1F320;</div>'
      : '';

    const headerTR = document.createElement('tr');
    headerTR.innerHTML = `
      <td colspan="2" id="header">
        ${iconHTML}
        <h1>~*~ ${pageTitle} ~*~</h1>
        ${pageSubtitle ? `<p class="welcome-subtitle">${pageSubtitle}</p>` : ''}
        <div class="sparkle-divider">&#x2728; &#x2730; &#x2728; &#x2730; &#x2728; &#x2730; &#x2728;</div>
      </td>`;

    const navLinksHTML = PAGES.map(p =>
      `<a href="${p.href}" class="nav-link${p.id === pageId ? ' active' : ''}">${p.label}</a>`
    ).join('');

    const bodyTR = document.createElement('tr');
    bodyTR.innerHTML = `
      <td id="nav">
        <div class="nav-title">&#x25C9; NAVEGACI&#xD3;N</div>
        ${navLinksHTML}
        <div class="nav-counter">
          <div class="nav-counter-title">Visitante #</div>
          <div class="nav-counter-digits counter-digits">0000001</div>
        </div>
        ${navExtraHTML}
      </td>
      <td id="content">${contentHTML}</td>`;

    const footerTR = document.createElement('tr');
    footerTR.innerHTML = `
      <td colspan="2" id="footer">
        <p class="footer-text">&#xA9; 2001-2009 Retro 2000s. Todos los derechos reservados.</p>
        <div class="footer-credits">
          <span>&#x2728; Hecho con Notepad</span>
          <span>&#x2728; Pure HTML 4.01</span>
          <span>&#x2728; CSS + JS Vanilla</span>
          <span>&#x2728; Sin frameworks</span>
        </div>
        <p style="font-size:8px;color:var(--neon-blue);margin-top:8px;">
          &#x1F310; Mejor visto en 800x600 | Compatible con IE 5.0+, Netscape Navigator, Firefox 1.0 &#x1F310;
        </p>
      </td>`;

    table.appendChild(headerTR);
    table.appendChild(bodyTR);
    table.appendChild(footerTR);

    wrapper.appendChild(bar);
    wrapper.appendChild(table);

    const player = document.createElement('div');
    player.id = 'music-player';
    player.innerHTML = `
      <div class="player-window">
        <div class="player-titlebar">
          <span>&#x266B; Winamp 2.91</span>
          <span class="window-btn close">X</span>
        </div>
        <div class="player-body">
          <div class="player-display">
            <div class="player-title marquee">Complicated</div>
            <div class="player-artist">Avril Lavigne</div>
            <div class="player-progress">
              <div class="player-progress-fill" style="width:0%"></div>
            </div>
            <div class="player-time">
              <span class="player-current-time">0:00</span>
              <span class="player-total-time">3:20</span>
            </div>
          </div>
          <div class="player-controls">
            <button class="player-btn player-btn-prev" title="Anterior">&#x25C0;&#x25C0;</button>
            <button class="player-btn player-btn-play" title="Play/Pause">&#x25B6;</button>
            <button class="player-btn player-btn-stop" title="Detener">&#x25A0;</button>
            <button class="player-btn player-btn-next" title="Siguiente">&#x25B6;&#x25B6;</button>
          </div>
          <div class="player-volume">
            <label>&#x1F50A;</label>
            <input type="range" min="0" max="1" step="0.1" value="0.7">
          </div>
        </div>
      </div>`;

    wrapper.appendChild(player);
    document.body.appendChild(wrapper);

    initWindowButtons();
  }

  function initWindowButtons() {
    document.querySelectorAll('.window-btn.minimize, .window-btn.maximize').forEach(btn => {
      btn.addEventListener('click', function() {
        const target = this.closest('.window-box');
        if (!target) return;
        const body = target.querySelector('.window-body');
        if (!body) return;
        body.style.display = body.style.display === 'none' ? '' : 'none';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', buildLayout);
})();
