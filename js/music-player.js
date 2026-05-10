document.addEventListener('DOMContentLoaded', function() {
  const player = document.getElementById('music-player');
  if (!player) return;

  const playlist = [
    { title: 'Complicated', artist: 'Avril Lavigne' },
    { title: 'In The End', artist: 'Linkin Park' },
    { title: 'Oops!... I Did It Again', artist: 'Britney Spears' },
    { title: 'Bye Bye Bye', artist: '*NSYNC' },
    { title: 'Hips Don\'t Lie', artist: 'Shakira' },
    { title: 'Gasolina', artist: 'Daddy Yankee' },
    { title: 'I Want It That Way', artist: 'Backstreet Boys' },
    { title: 'Bring Me To Life', artist: 'Evanescence' },
    { title: 'Mr. Brightside', artist: 'The Killers' },
    { title: 'Lose Yourself', artist: 'Eminem' }
  ];

  let currentTrack = 0;
  let isPlaying = false;
  let progressInterval;
  let progress = 0;
  let volume = 0.7;
  let audioCtx = null;
  let oscillator = null;
  let gainNode = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  const notes = [262, 294, 330, 349, 392, 440, 494, 523];
  const melodies = [
    [0, 2, 4, 5, 7, 5, 4, 2],
    [0, 3, 5, 7, 8, 7, 5, 3],
    [0, 2, 3, 5, 7, 3, 0, -1],
    [4, 4, 5, 7, 5, 4, 2, 0],
    [0, 0, 7, 5, 7, 5, 4, 2],
    [2, 4, 5, 7, 5, 4, 5, 2],
    [0, 1, 3, 5, 3, 1, 0, -1],
    [5, 5, 4, 2, 4, 5, 4, 2],
    [0, 7, 5, 4, 5, 7, 0, 7],
    [0, 2, 4, 7, 4, 2, 0, -1]
  ];
  let noteInterval = null;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function startTone() {
    if (oscillator) return;
    const ctx = getAudioCtx();
    oscillator = ctx.createOscillator();
    gainNode = ctx.createGain();

    const melody = melodies[currentTrack % melodies.length];
    let noteIndex = 0;

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(notes[melody[0] < 0 ? 0 : melody[0]] || 262, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();

    if (ctx.state === 'suspended') ctx.resume();

    noteInterval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(noteInterval);
        return;
      }
      noteIndex = (noteIndex + 1) % melody.length;
      const freq = notes[melody[noteIndex < 0 ? 0 : noteIndex]] || 262;
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    }, 250);
  }

  function stopTone() {
    if (noteInterval) {
      clearInterval(noteInterval);
      noteInterval = null;
    }
    if (oscillator) {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch (e) {}
      oscillator = null;
    }
    if (gainNode) {
      gainNode.disconnect();
      gainNode = null;
    }
  }

  function updateDisplay() {
    const track = playlist[currentTrack];
    const titleEl = player.querySelector('.player-title');
    const artistEl = player.querySelector('.player-artist');
    const progressFillEl = player.querySelector('.player-progress-fill');
    const currentTimeEl = player.querySelector('.player-current-time');
    const totalTimeEl = player.querySelector('.player-total-time');

    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    if (progressFillEl) progressFillEl.style.width = progress + '%';
    if (currentTimeEl) currentTimeEl.textContent = formatTime(progress * 2);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(200);
  }

  function startProgress() {
    stopProgress();
    progressInterval = setInterval(() => {
      if (!isPlaying) return;
      progress += 0.5;
      if (progress >= 100) {
        progress = 0;
        nextTrack();
      }
      updateDisplay();
    }, 100);
  }

  function stopProgress() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  function nextTrack() {
    if (isPlaying) {
      stopTone();
      startTone();
    }
    currentTrack = (currentTrack + 1) % playlist.length;
    progress = 0;
    updateDisplay();
  }

  function prevTrack() {
    if (isPlaying) {
      stopTone();
      startTone();
    }
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    progress = 0;
    updateDisplay();
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    const playBtn = player.querySelector('.player-btn-play');

    if (isPlaying) {
      if (playBtn) playBtn.innerHTML = '&#x275A;&#x275A;';
      startTone();
      startProgress();
    } else {
      if (playBtn) playBtn.innerHTML = '&#x25B6;';
      stopTone();
      stopProgress();
    }
    updateDisplay();
  }

  player.querySelector('.player-btn-play')?.addEventListener('click', togglePlay);
  player.querySelector('.player-btn-prev')?.addEventListener('click', () => {
    progress = 0; prevTrack();
  });
  player.querySelector('.player-btn-next')?.addEventListener('click', () => {
    progress = 0; nextTrack();
  });
  player.querySelector('.player-btn-stop')?.addEventListener('click', () => {
    isPlaying = false;
    const playBtn = player.querySelector('.player-btn-play');
    if (playBtn) playBtn.innerHTML = '&#x25B6;';
    progress = 0;
    stopTone();
    stopProgress();
    updateDisplay();
  });

  const volumeSlider = player.querySelector('.player-volume input[type="range"]');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', function() {
      volume = parseFloat(this.value);
      if (gainNode && audioCtx) {
        gainNode.gain.setValueAtTime(volume * 0.15, audioCtx.currentTime);
      }
    });
  }

  player.querySelector('.window-btn.close')?.addEventListener('click', function() {
    isPlaying = false;
    stopTone();
    stopProgress();
    player.style.display = 'none';
  });

  updateDisplay();
});
