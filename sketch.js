let circles = [];
let score = 0;
let timer;
let gameState = 'start';
let gameOverSound;
let startButton;

function preload() {
  gameOverSound = loadSound('mixkit-arcade-video-game-bonus-2044.wav');
}

function setup() {
  createCanvas(400, 400);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  timer = new Timer(60);

  startButton = createButton('Start');
  startButton.position(width / 2 - 30, height / 2 - 20);
  startButton.mousePressed(startGame);
}

function draw() {
  background('#a9d4c6');

  if (gameState === 'start') {
    displayStartScreen();
  } else if (gameState === 'playing') {
    timer.update();
    timer.display();

    if (timer.finished()) {
      endGame();
    }

    if (random(1) < 0.02) {
      let circleColor = random(['white', 'green', 'yellow', 'black', 'blue', 'red', 'purple']);
      circles.push(new Circle(circleColor));
    }

    for (let i = circles.length - 1; i >= 0; i--) {
      circles[i].display();
      circles[i].move();
      if (circles[i].y > height) {
        if (circles[i].color === 'red') {
          endGame();
        } else if (circles[i].color === 'yellow') {
          score += 10;
          if (score >= 30) {
            circles[i].speed = random(5, 6);
          }
        }
        circles.splice(i, 1);
      }
    }

    textSize(24);
    text('Score: ' + score, width / 2, 30);
  } else if (gameState === 'gameOver') {
    displayGameOver();
  }
}

function startGame() {
  circles = [];
  score = 0;
  gameState = 'playing';
  timer.start();
  gameOverSound.stop();
}

function displayStartScreen() {
  textSize(32);
  text('Click "Start" to Play', width / 2, height / 2 - 40);
}

function endGame() {
  gameState = 'gameOver';
  timer.stop();
  gameOverSound.play();
}

function displayGameOver() {
  textSize(32);
  text('Game Over', width / 2, height / 2 - 40);
  text('Total Score: ' + score, width / 2, height / 2 + 20);
}

class Circle {
  constructor(color) {
    this.x = random(width);
    this.y = 0;
    this.color = color;
    this.speed = random(2, 5);
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, 30, 30);
  }

  move() {
    this.y += this.speed;
  }

  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < 15;
  }
}

class Timer {
  constructor(seconds) {
    this.seconds = seconds;
    this.startTime = 0;
    this.running = false;
  }

  start() {
    this.startTime = millis();
    this.running = true;
  }

  update() {
    if (this.running) {
      let elapsed = floor((millis() - this.startTime) / 1000);
      this.remaining = this.seconds - elapsed;
    }
  }

  display() {
    textSize(24);
    text('Time: ' + this.remaining, width / 2, 60);
  }

  finished() {
    return this.remaining <= 0;
  }

  stop() {
    this.running = false;
  }
}
