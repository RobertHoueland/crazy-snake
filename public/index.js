var gameCanvas = document.querySelector(".game-box")
var canvasContext = gameCanvas.getContext("2d")
var foodIcon = new Image()
foodIcon.src = "/green_square.png"
canvasContext.drawImage(foodIcon, 100, 200, 20, 20)

var grid = 32 // 32px for each grid space
var snakeArr = []
snakeArr[0] = { x: 9 * grid, y: 10 * grid }
snakeArr[1] = { x: 8 * grid, y: 10 * grid }

var snakeFood = {
    x: Math.floor(Math.random() * 17 + 1) * grid,
    y: Math.floor(Math.random() * 15 + 3) * grid,
}
var score = 0
var direction

function drawSnake() {
    for (i = 0; i < snakeArr.length; i++) {
        if (i == 0) {
            canvasContext.fillStyle = "Green"
        } else {
            canvasContext.fillStyle = "Chartreuse"
        }
        canvasContext.fillRect(snakeArr[i].x, snakeArr[i].y, grid, grid)

        canvasContext.strokeStyle = "DarkOrange"
        canvasContext.strokeRect(snakeArr[i].x, snakeArr[i].y, grid, grid)
    }

    canvasContext.fillStyle = "red"
    canvasContext.fillRect(snakeFood.x, snakeFood.y, grid, grid)

    // Get old snake position
    var snakeX = snakeArr[0].x
    var snakeY = snakeArr[0].y

    // Check direction
    if (direction == "LEFT") {
        snakeX -= grid
    }
    if (direction == "UP") {
        snakeY -= grid
    }
    if (direction == "RIGHT") {
        snakeX += grid
    }
    if (direction == "DOWN") {
        snakeY += grid
    }

    // if the snake eats the food
    if (snakeX == snakeFood.x && snakeY == snakeFood.y) {
        score++
        //eat.play()
        snakeFood = {
            x: Math.floor(Math.random() * 17 + 1) * grid,
            y: Math.floor(Math.random() * 15 + 3) * grid,
        }
    } else {
        // Remove tail
        snakeArr.pop()
    }

    // Add new Head
    var newHead = {
        x: snakeX,
        y: snakeY,
    }

    if (
        snakeX < grid ||
        snakeX > 17 * grid ||
        snakeY < 3 * grid ||
        snakeY > 17 * grid ||
        collision(newHead, snakeArr)
    ) {
        clearInterval(game)
    }

    snakeArr.unshift(newHead)

    canvasContext.fillStyle = "white"
    canvasContext.font = "45px Arial"
    canvasContext.fillText(score, 2 * grid, 1.6 * grid)
}

function moveSnake(event) {
    // Move snake direction based on keypress key code
    var key = event.keyCode
    if (
        (key == 37 && direction != "right") ||
        (key == 65 && direction != "right")
    ) {
        // 'A' key or left arrow key
        direction = "left"
    } else if (
        (key == 38 && direction != "down") ||
        (key == 87 && direction != "down")
    ) {
        // 'W' key or up arrow key
        direction = "up"
    } else if (
        (key == 39 && direction != "left") ||
        (key == 68 && direction != "left")
    ) {
        // 'D' key or right arrow key
        direction = "right"
    } else if (
        (key == 40 && direction != "up") ||
        (key == 83 && direction != "up")
    ) {
        // 'S' key or down arrow key
        direction = "down"
    }
}

document.addEventListener("keydown", moveSnake)

// Draw snake every 100ms
var game = setInterval(drawSnake, 100)
