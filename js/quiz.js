document.addEventListener('DOMContentLoaded', function() {
  const quizContainer = document.getElementById('quiz-container');
  const quizResult = document.getElementById('quiz-result');
  const quizForm = document.getElementById('quiz-form');
  const quizQuestions = document.getElementById('quiz-questions');
  const quizSubmit = document.getElementById('quiz-submit');
  const quizRestart = document.getElementById('quiz-restart');

  if (!quizContainer || !quizForm || !quizQuestions) return;

  const questions = [
    {
      question: '¿En qué año se lanzó el primer iPhone?',
      options: ['2005', '2006', '2007', '2008'],
      answer: 2
    },
    {
      question: '¿Cómo se llamaba el asistente virtual de Office en los 2000?',
      options: ['Clippy', 'Cortana', 'Bob', 'Siri'],
      answer: 0
    },
    {
      question: '¿Qué consola fue la rival directa del PlayStation 2?',
      options: ['Dreamcast', 'Xbox', 'GameCube', 'Nintendo 64'],
      answer: 1
    },
    {
      question: '¿En qué red social podías subir 1 foto al día?',
      options: ['MySpace', 'Facebook', 'Fotolog', 'Hi5'],
      answer: 2
    },
    {
      question: '¿Qué mensaje mostraba MSN Messenger cuando estabas ausente?',
      options: ['Fuera de línea', 'Ausente', 'No disponible', 'Inactivo'],
      answer: 1
    },
    {
      question: '¿Cómo se llamaba la mascota virtual más famosa de los 2000?',
      options: ['Pou', 'Tamagotchi', 'Furby', 'Nintendogs'],
      answer: 1
    },
    {
      question: '¿Qué programa se usaba para bajar música con conexiones P2P?',
      options: ['iTunes', 'Spotify', 'Winamp', 'Ares / LimeWire'],
      answer: 3
    },
    {
      question: '¿Cual fue el videojuego más jugado en cybercafés?',
      options: ['World of Warcraft', 'Counter-Strike 1.6', 'Minecraft', 'League of Legends'],
      answer: 1
    },
    {
      question: '¿Qué celular era conocido como "irrompible"?',
      options: ['Motorola RAZR', 'Nokia 3310', 'Sony Ericsson W200', 'BlackBerry'],
      answer: 1
    },
    {
      question: '¿Qué significaba "xD" en el Messenger?',
      options: ['Cara de risa', 'Tristeza', 'Corazón', 'Enojo'],
      answer: 0
    }
  ];

  function buildQuiz() {
    quizQuestions.innerHTML = '';
    questions.forEach((q, qi) => {
      const div = document.createElement('div');
      div.className = 'quiz-question';

      let html = `<h3>${qi + 1}. ${q.question}</h3>`;
      q.options.forEach((opt, oi) => {
        html += `
          <label class="quiz-option">
            <input type="radio" name="q${qi}" value="${oi}" style="display:none;">
            ${String.fromCharCode(65 + oi)}) ${opt}
          </label>
        `;
      });

      div.innerHTML = html;
      quizQuestions.appendChild(div);
    });

    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', function() {
        const parent = this.parentElement;
        parent.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        this.querySelector('input').checked = true;
      });
    });
  }

  function showResult() {
    let score = 0;
    let answeredAll = true;

    questions.forEach((q, qi) => {
      const selected = document.querySelector(`input[name="q${qi}"]:checked`);
      if (selected) {
        if (parseInt(selected.value) === q.answer) {
          score++;
        }
      } else {
        answeredAll = false;
      }
    });

    if (!answeredAll) {
      alert('Responde todas las preguntas antes de enviar!');
      return;
    }

    const percentage = Math.round((score / questions.length) * 100);
    let rank, rankColor;

    if (percentage >= 90) {
      rank = '&#x1F451; ERES UN VERDADERO 2000&#x2019;S KID &#x1F451;';
      rankColor = 'var(--neon-yellow)';
    } else if (percentage >= 70) {
      rank = '&#x2B50; Casi un experto de los 2000 &#x2B50;';
      rankColor = 'var(--neon-pink)';
    } else if (percentage >= 50) {
      rank = '&#x1F31F; Sabes lo b&#xE1;sico de los 2000 &#x1F31F;';
      rankColor = 'var(--neon-blue)';
    } else if (percentage >= 30) {
      rank = '&#x1F4BB; Te falta navegar m&#xE1;s en cyber &#x1F4BB;';
      rankColor = 'var(--neon-green)';
    } else {
      rank = '&#x1F476; Naciste despu&#xE9;s de 2005, verdad? &#x1F476;';
      rankColor = 'var(--neon-orange)';
    }

    quizResult.innerHTML = `
      <div class="quiz-result">
        <h2>Resultados del Quiz</h2>
        <div class="quiz-result-score">${score} / ${questions.length}</div>
        <div style="font-family: 'Press Start 2P', monospace; font-size: 12px; color: ${rankColor}; text-shadow: 0 0 10px ${rankColor}; margin: 20px 0;">
          ${rank}
        </div>
        <p style="color: var(--neon-green); margin-top: 15px;">
          Correctas: ${percentage}%
        </p>
        <button class="retro-btn" onclick="location.reload()" style="margin-top:20px;">
          &#x1F504; Intentar de nuevo
        </button>
      </div>
    `;

    quizForm.style.display = 'none';
    quizResult.style.display = 'block';

    document.querySelectorAll('.quiz-question').forEach(q => {
      q.style.display = 'none';
    });
    quizSubmit.style.display = 'none';
  }

  quizForm.addEventListener('submit', function(e) {
    e.preventDefault();
  });

  quizSubmit.addEventListener('click', showResult);

  buildQuiz();
});
