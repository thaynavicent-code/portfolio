// elementos
const squares = document.querySelectorAll('.square');
const timeLeft = document.querySelector('#time-left');
const scoreDisplay = document.querySelector('#score');
const livesDisplay = document.querySelector('#lives');
const startBtn = document.querySelector('#start-btn');

let result = 0;
let hitPosition;
let currentTime = 60;
let lives = 3;
let timerId = null;
let countDownTimerId = null;

// áudios
const sounds = {
  start: new Audio('./src/sounds/start.mp3'),
  appear: new Audio('./src/sounds/ralph_appear.mp3'),
  hit: new Audio('./src/sounds/hit.mp3'),
  miss: new Audio('./src/sounds/miss.mp3'),
  gameOver: new Audio('./src/sounds/game_over.mp3'),
  bgMusic: new Audio('./src/sounds/bg_music.mp3'),
};

sounds.bgMusic.loop = true;
sounds.bgMusic.volume = 0.3;

// função que mostra Ralph
function randomSquare() {
  squares.forEach(square => square.classList.remove('enemy'));
  const randomPosition = squares[Math.floor(Math.random() * squares.length)];
  randomPosition.classList.add('enemy');
  hitPosition = randomPosition.id;

  sounds.appear.currentTime = 0;
  sounds.appear.play().catch(err => console.log('Erro appear:', err));
}

// mover Ralph
function moveEnemy() {
  timerId = setInterval(randomSquare, 700);
}

// contagem regressiva
function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;
  if (currentTime <= 0) endGame();
}

// fim de jogo
function endGame() {
  clearInterval(timerId);
  clearInterval(countDownTimerId);
  sounds.bgMusic.pause();
  sounds.bgMusic.currentTime = 0;

  sounds.gameOver.currentTime = 0;
  sounds.gameOver.play().catch(err => console.log('Erro gameOver:', err));

  alert('Fim de jogo! Sua pontuação final: ' + result);
  startBtn.disabled = false;
}

// clique nas squares
squares.forEach(square => {
  square.addEventListener('click', () => {
    if (square.id === hitPosition) {
      result++;
      scoreDisplay.textContent = result;
      hitPosition = null;

      sounds.hit.currentTime = 0;
      sounds.hit.play().catch(err => console.log('Erro hit:', err));
    } else {
      lives--;
      livesDisplay.textContent = 'x' + lives;

      sounds.miss.currentTime = 0;
      sounds.miss.play().catch(err => console.log('Erro miss:', err));

      if (lives <= 0) endGame();
    }
  });
});

// botão start
startBtn.addEventListener('click', async () => {
  startBtn.disabled = true;

  // desbloquear áudio no navegador
  const unlock = new Audio();
  unlock.play().catch(() => {});

  sounds.start.currentTime = 0;
  await sounds.start.play().catch(err => console.log('Erro start:', err));

  sounds.bgMusic.currentTime = 0;
  await sounds.bgMusic.play().catch(err => console.log('Erro bgMusic:', err));

  // reset
  result = 0;
  currentTime = 60;
  lives = 3;
  scoreDisplay.textContent = result;
  timeLeft.textContent = currentTime;
  livesDisplay.textContent = 'x' + lives;

  moveEnemy();
  countDownTimerId = setInterval(countDown, 1000);
});
