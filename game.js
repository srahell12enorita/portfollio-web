let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

const box = 20;
let snake, food, direction, score, gameInterval, isGameRunning, gameSpeed;

window.onload = function () {
    document.getElementById("gameCanvas").style.display = "block";
    document.getElementById("score").style.display = "block";
    document.getElementById("startBtn").style.display = "block";
};

document.addEventListener("keydown", changeDirection);
document.addEventListener("keydown", toggleGame);

function initializeGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    food = generateFood();
    direction = "RIGHT";
    score = 0;
    gameSpeed = 150; // Starting speed of the game (time interval for each game loop)
    document.getElementById("score").innerText = "Score: " + score;
}

function changeDirection(event) {
    const key = event.key.toLowerCase();
    if (key === "a" && direction !== "RIGHT") direction = "LEFT";
    else if (key === "w" && direction !== "DOWN") direction = "UP";
    else if (key === "d" && direction !== "LEFT") direction = "RIGHT";
    else if (key === "s" && direction !== "UP") direction = "DOWN";
}

function toggleGame(event) {
    if (event.keyCode === 32) { // Space key to toggle start/pause
        if (isGameRunning) {
            clearInterval(gameInterval);
            isGameRunning = false;
            document.getElementById("restartBtn").style.display = "block";
        } else {
            gameInterval = setInterval(drawGame, gameSpeed); // Control speed here
            isGameRunning = true;
        }
    }
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });

    let headX = snake[0].x;
    let headY = snake[0].y;
    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    if (headX === food.x && headY === food.y) {
        score++;
        food = generateFood();
        increaseSpeed(); // Increase speed when food is eaten
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };
    if (headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height || checkCollision(newHead, snake)) {
        clearInterval(gameInterval);
        alert("Game Over! Score: " + score);
        document.getElementById("restartBtn").style.display = "block"; // Show Restart button
        isGameRunning = false;
        return;
    }

    snake.unshift(newHead);
    document.getElementById("score").innerText = "Score: " + score;
}

function checkCollision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function increaseSpeed() {
    if (gameSpeed > 50) { // Speed cap to prevent too high speed
        gameSpeed -= 5; // Increase speed as game progresses
        clearInterval(gameInterval);
        gameInterval = setInterval(drawGame, gameSpeed);
    }
}

function startGame() {
    initializeGame();
    document.getElementById("startBtn").style.display = "none"; // Hide start button
    document.getElementById("restartBtn").style.display = "none"; // Hide restart button
    gameInterval = setInterval(drawGame, gameSpeed); // Start game loop
    isGameRunning = true;
}
function restartGame() {
    initializeGame();
    document.getElementById("restartBtn").style.display = "none"; // Hide restart button after restart
    document.getElementById("startBtn").style.display = "none"; // Hide start button
    gameInterval = setInterval(drawGame, gameSpeed); // Restart the game loop
    isGameRunning = true;
}