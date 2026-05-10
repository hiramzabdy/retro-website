document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('guestbook-form');
  const entriesContainer = document.getElementById('guestbook-entries');
  if (!form || !entriesContainer) return;

  const STORAGE_KEY = 'retro2000_guestbook';

  function loadEntries() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function renderEntries() {
    const entries = loadEntries();
    entriesContainer.innerHTML = '';

    if (entries.length === 0) {
      entriesContainer.innerHTML = `
        <div class="guestbook-entry" style="text-align:center; color:var(--neon-yellow);">
          <p>&#x1F4AD; No hay mensajes todav&#xED;a. &#xA1;S&#xE9; el primero en firmar!</p>
        </div>
      `;
      return;
    }

    entries.forEach((entry, index) => {
      const div = document.createElement('div');
      div.className = 'guestbook-entry';

      const emoticonEntry = entry.message
        .replace(/:\)/g, '&#x1F60A;')
        .replace(/:D/g, '&#x1F604;')
        .replace(/:P/g, '&#x1F61C;')
        .replace(/:O/g, '&#x1F632;')
        .replace(/<3/g, '&#x2764;&#xFE0F;')
        .replace(/xD/gi, '&#x1F923;')
        .replace(/:\(\'/g, '&#x1F622;');

      div.innerHTML = `
        <div class="entry-name">&#x1F4AC; ${escapeHtml(entry.name)} dijo:</div>
        <div class="entry-date">${escapeHtml(entry.date)}</div>
        <div class="entry-message">${emoticonEntry}</div>
      `;
      entriesContainer.appendChild(div);

      if (index < entries.length - 1) {
        const divider = document.createElement('div');
        divider.className = 'guestbook-divider';
        divider.innerHTML = '&#x2728; &#x2022; &#x2730; &#x2022; &#x2728;';
        entriesContainer.appendChild(divider);
      }
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('gb-name').value.trim();
    const message = document.getElementById('gb-message').value.trim();

    if (!name || !message) {
      alert('Por favor llena tu nombre y mensaje antes de firmar!');
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const entry = { name, message: escapeHtml(message), date: dateStr };
    const entries = loadEntries();
    entries.unshift(entry);

    if (entries.length > 50) {
      entries.length = 50;
    }

    saveEntries(entries);
    form.reset();
    renderEntries();

    const feedback = document.createElement('div');
    feedback.style.cssText = `
      color: var(--neon-yellow);
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
      text-align: center;
      margin: 10px 0;
      animation: blink 1s step-end 3;
    `;
    feedback.textContent = 'Mensaje enviado exitosamente! xD';
    form.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  renderEntries();
});
