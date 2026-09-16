const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

const gameWidth = canvas.width;
const gameHeight = canvas.height;

const paddle = {
  width: 100,
  height: 12,
  x: (gameWidth - 100) / 2,
  y: gameHeight - 30,
  speed: 7,
  dx: 0,
};

const ball = {
  radius: 10,
  x: gameWidth / 2,
  y: gameHeight / 2,
  speed: 5,
  dx: 4,
  dy: -4,
};

const brick = {
  rowCount: 5,
  columnCount: 8,
  width: 70,
  height: 18,
  padding: 12,
  offsetTop: 40,
  offsetLeft: 30,
};

let bricks = [];
let score = 0;
let lives = 3;
let animationId = null;
let running = false;

function createBricks() {
  bricks = [];
  for (let row = 0; row < brick.rowCount; row++) {
    bricks[row] = [];
    for (let col = 0; col < brick.columnCount; col++) {
      bricks[row][col] = { x: 0, y: 0, status: 1 };
    }
  }
}

function drawPaddle() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ff5d8f';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let row = 0; row < brick.rowCount; row++) {
    for (let col = 0; col < brick.columnCount; col++) {
      const item = bricks[row][col];
      if (item.status === 1) {
        const brickX = col * (brick.width + brick.padding) + brick.offsetLeft;
        const brickY = row * (brick.height + brick.padding) + brick.offsetTop;
        item.x = brickX;
        item.y = brickY;
        ctx.fillStyle = row % 2 === 0 ? '#2ec4b6' : '#ff9f1c';
        ctx.fillRect(brickX, brickY, brick.width, brick.height);
        ctx.strokeStyle = '#061a22';
        ctx.strokeRect(brickX, brickY, brick.width, brick.height);
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, gameWidth, gameHeight);
  drawBricks();
  drawPaddle();
  drawBall();
}

function update() {
  paddle.x += paddle.dx;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > gameWidth) paddle.x = gameWidth - paddle.width;

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius > gameWidth || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
    ball.dy = -ball.dy;
    const deltaX = ball.x - (paddle.x + paddle.width / 2);
    ball.dx = deltaX * 0.2;
  }

  if (ball.y + ball.radius > gameHeight) {
    lives -= 1;
    livesEl.textContent = lives;
    if (lives === 0) {
      endGame('ゲームオーバー');
      return;
    }
    resetBall();
  }

  checkBrickCollision();
  if (score === brick.rowCount * brick.columnCount) {
    endGame('クリア！おめでとう');
    return;
  }
}

function checkBrickCollision() {
  for (let row = 0; row < brick.rowCount; row++) {
    for (let col = 0; col < brick.columnCount; col++) {
      const item = bricks[row][col];
      if (item.status === 1) {
        if (
          ball.x > item.x &&
          ball.x < item.x + brick.width &&
          ball.y - ball.radius < item.y + brick.height &&
          ball.y + ball.radius > item.y
        ) {
          ball.dy = -ball.dy;
          item.status = 0;
          score += 1;
          scoreEl.textContent = score;
        }
      }
    }
  }
}

function resetBall() {
  ball.x = gameWidth / 2;
  ball.y = gameHeight / 2;
  ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = -4;
  paddle.x = (gameWidth - paddle.width) / 2;
}

function gameLoop() {
  update();
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
  if (!running) {
    running = true;
    startBtn.textContent = '一時停止';
    animationId = requestAnimationFrame(gameLoop);
  } else {
    running = false;
    startBtn.textContent = 'スタート';
    cancelAnimationFrame(animationId);
  }
}

function resetGame() {
  running = false;
  cancelAnimationFrame(animationId);
  score = 0;
  lives = 3;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  startBtn.textContent = 'スタート';
  createBricks();
  resetBall();
  draw();
}

function endGame(message) {
  running = false;
  cancelAnimationFrame(animationId);
  startBtn.textContent = 'スタート';
  setTimeout(() => {
    alert(`${message}\nスコア: ${score}`);
  }, 20);
}

function keyDownHandler(event) {
  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    paddle.dx = paddle.speed;
  }
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    paddle.dx = -paddle.speed;
  }
}

function keyUpHandler(event) {
  if (
    event.code === 'ArrowRight' ||
    event.code === 'KeyD' ||
    event.code === 'ArrowLeft' ||
    event.code === 'KeyA'
  ) {
    paddle.dx = 0;
  }
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

createBricks();
resetBall();
draw();
