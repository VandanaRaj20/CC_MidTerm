//Name of the audio file: mixkit-arcade-video-game-bonus-2044.wav
// I have developed a simple game where if you click yellow ball, you get 10 points
//Red ball will disqualify you from the game
//After 30 points, the speed of yellow ball will increase


//i created an array to push multiple balls
let circles = [];

//set initial score to 0
let score = 0;

let timer;

//I set the initial state of the game to 'start'
let gameState = 'start';

//A sound will be played when game gets over
let gameOverSound;
let startButton;

function preload() {
  //here i loaded an audio file i downloaded from the web
  gameOverSound = loadSound('mixkit-arcade-video-game-bonus-2044.wav');
}

function setup() {
  createCanvas(600, 400);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  
  //I setting the timer to 60 seconds; that will be the time to collect as much score as possible
  timer = new Timer(60);

  //I created a start button where after clicking, the game begins
  startButton = createButton('Start');
  startButton.position(width / 2 - 30, height / 2 - 20);
  
  //After clicking, the "startGame" function is called
  startButton.mousePressed(startGame);
}

function draw() {
  background('#a9d4c6');

  //Gave if-else statements to check the status of gameState
  if (gameState === 'start') {
    displayStartScreen();
  } else if (gameState === 'playing') {
    timer.update();
    timer.display();

    if (timer.finished()) {
      //by default i set, if timer runs out then endGame()will be called
      endGame();
    
    }
    //if red ball is clicked
    else if (isRedBallClicked()) {
      endGame();
    } else {
      if (random(1) < 0.02) {
        //assign dedicated colors to random number of circles
        let circleColor = random(['white', 'green', 'yellow', 'black', 'blue', 'red', 'purple']);
        circles.push(new Circle(circleColor));
      }

      //while gameState is in 'playing' mode, i check if player clicked either red or yellow.
      for (let i = circles.length - 1; i >= 0; i--) {
        circles[i].display();
        circles[i].move();
        if (circles[i].y > height) {
          if (circles[i].color === 'red') {
            endGame();
          } else if (circles[i].color === 'yellow') {
            score += 10;
            if (score >= 30) {
              circles[i].speed = random(7,10 );
            }
          }
          circles.splice(i, 1);
        }
      }

      textSize(24);
      text('Score: ' + score, width / 2, 30);
    }
  } else if (gameState === 'gameOver') {
    displayGameOver();
  }
}

//This function checks if red ball is clicked
function isRedBallClicked() {
  for (let i = circles.length - 1; i >= 0; i--) {
    if (circles[i].contains(mouseX, mouseY) && circles[i].color === 'red') {
      return true;
    }
  }
  return false;
}

function startGame() {
  circles = [];
  score = 0;
  gameState = 'playing';
  timer.start();
  gameOverSound.stop();
}

function displayStartScreen() {
  textSize(16);
  text('Click "Start" to Play', width / 2, height / 2 + 30);
  text('Collect yellow 💛for 10 pts and red will be game over😈', width / 2, height / 2 - 40);
}

//my intial error whcih resulted in game getting over before timer runs out
// function endGame() {
//   gameState = 'gameOver';
//   timer.stop();
//   gameOverSound.play();
// }


//I gave an if condition to check if red ball is clicked or time ran out
function endGame() {
  if (timer.finished() || isRedBallClicked()) {
    gameState = 'gameOver';
  }
  //timer.stop();
  gameOverSound.play();
}

//GAME OVER message will be displayed with the total score earned after game gets over
function displayGameOver() {
  textSize(32);
  text('Game Over', width / 2, height / 2 - 40);
  text('Total Score: ' + score, width / 2, height / 2 + 20);
}


//Class to assign properties to the circle
class Circle {
  constructor(color) {
    
    //the X coordinates of the circle could be anywhere while they move only alongside Y-axis
    this.x = random(width);
    this.y = 0;
    this.color = color;
    
    //assigning the speed at which the ball will fall down
    this.speed = random(4, 7);
  }

  
  //The following functions talk about the details of each functions assigned to the circles
  display() {
    fill(this.color);
    ellipse(this.x, this.y, 30, 30);
  }

  //speed of the circles aong Y axis
  move() {
    this.y += this.speed;
  }

  //calculates distance between two circles
  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < 15;
  }
}


//class timer assigns properties for the timer to run
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

  //the timer gets updated each second and displays the remaining time left
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
