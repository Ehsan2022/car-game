// initialize variables
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var carImg = new Image();
carImg.src = "car.png";
var carWidth = 60;
var carHeight = 120;
var carX = canvas.width / 2 - carWidth / 2;
var carY = canvas.height - carHeight - 10;
var carSpeed = 10;
var enemyImg = new Image();
enemyImg.src = "secondCar.png";
var enemyWidth = 60;
var enemyHeight = 120;
var enemyX = Math.floor(Math.random() * (canvas.width - enemyWidth));
var enemyY = -enemyHeight;
var enemySpeed = 10;
var score = 10;
var gameOver = false;
var middleLineY = 0;

// handle keyboard input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var leftPressed = false;
var rightPressed = false;

function keyDownHandler(event) {
  if (event.keyCode == 37) {
    leftPressed = true;
  } else if (event.keyCode == 39) {
    rightPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.keyCode == 37) {
    leftPressed = false;
  } else if (event.keyCode == 39) {
    rightPressed = false;
  }
}

// game loop
function draw() {
  if (!gameOver) {
    // move the car
    if (leftPressed && carX > 0) {
      carX -= carSpeed;
    } else if (rightPressed && carX < canvas.width - carWidth) {
      carX += carSpeed;
    }

    // move the enemy
    enemyY += enemySpeed;
    if (enemyY > canvas.height) {
      enemyX = Math.floor(Math.random() * (canvas.width - enemyWidth));
      enemyY = -enemyHeight;
      score++;
    }

    // move the middle line
    middleLineY += enemySpeed;
    if (middleLineY > canvas.height) {
      middleLineY = 0;
    }

    // car collision
    if (
      carX < enemyX + enemyWidth &&
      carX + carWidth > enemyX &&
      carY < enemyY + enemyHeight &&
      carY + carHeight > enemyY
    ) {
      gameOver = true;

      document.getElementById("score").innerHTML = score;
      document.getElementById("gameOver").style.display = "block";
    } else {
      document.getElementById("gameOver").style.display = "none";
      gameOver = false;
    }

    // draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 2.5, 0, 5, canvas.height);
    ctx.drawImage(carImg, carX, carY, carWidth, carHeight);
    ctx.drawImage(enemyImg, enemyX, enemyY, enemyWidth, enemyHeight);
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // request next frame
    requestAnimationFrame(draw);
  }
}

// start the game loop
draw();

// try again function
function tryAgain() {
  gameOver = false;
  score = 0;
  carX = canvas.width / 2 - carWidth / 2;
  enemyX = Math.floor(Math.random() * (canvas.width - enemyWidth));
  enemyY = -enemyHeight;
  document.getElementById("gameOver").style.display = "none";
  draw();
}
