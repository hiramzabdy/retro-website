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

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let oscillator = null;
  let gainNode = null;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function startTone() {
    if (oscillator) return;
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    const notes = [262, 294, 330, 349, 392, 440, 494, 523];
    const melody = [0, 2, 4, 5, 7, 5, 4, 2, 0, 2, 4, 5, 4, 2, 0, -1];

    let noteIndex = 0;
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(notes[melody[0]] || 262, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(volume * 0.15, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();

    const noteInterval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(noteInterval);
        return;
      }
      noteIndex = (noteIndex + 1) % melody.length;
      const freq = notes[melody[noteIndex]] || 262;
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    }, 250);

    oscillator._noteInterval = noteInterval;
  }

  function stopTone() {
    if (oscillator) {
      if (oscillator._noteInterval) clearInterval(oscillator._noteInterval);
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
    currentTrack = (currentTrack + 1) % playlist.length;
    progress = 0;
    updateDisplay();
  }

  function prevTrack() {
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
      if (audioCtx.state === 'suspended') audioCtx.resume();
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
      if (gainNode) {
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
