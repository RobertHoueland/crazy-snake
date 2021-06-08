var gameCanvas = document.querySelector(".game-box")
var canvasContext = gameCanvas.getContext("2d")
var currentScore = document.querySelector(".current-score")
var grid = 32 // 32px for each grid space, 512x512px for game board, so 16x16 square grid
var snakeArr = []
var score = 0
var direction = "right"
/* starting location for snake head and tail */
snakeArr[0] = { x: 9 * grid, y: 8 * grid }
snakeArr[1] = { x: 8 * grid, y: 8 * grid }
/* random location for food */
var snakeFood = {
    x: Math.floor(Math.random() * 15 + 1) * grid,
    y: Math.floor(Math.random() * 13 + 3) * grid,
}

document.addEventListener("keydown", moveSnake)

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

function collision(head, arr) {
    for (i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            return true
        }
    }
    return false
}

function drawSnake() {
    for (i = 0; i < snakeArr.length; i++) {
        if (i == 0) {
            canvasContext.fillStyle = "Green"
        } else {
            canvasContext.fillStyle = "Chartreuse"
        }
        canvasContext.fillRect(snakeArr[i].x, snakeArr[i].y, grid, grid)

        canvasContext.strokeStyle = "Blue"
        canvasContext.strokeRect(snakeArr[i].x, snakeArr[i].y, grid, grid)
    }

    canvasContext.fillStyle = "Red"
    canvasContext.fillRect(snakeFood.x, snakeFood.y, grid, grid)

    // Get old snake position
    var snakeX = snakeArr[0].x
    var snakeY = snakeArr[0].y

    console.log(direction, snakeX, snakeY)

    // Check direction
    if (direction == "left") {
        snakeX -= grid
    }
    if (direction == "up") {
        snakeY -= grid
    }
    if (direction == "right") {
        snakeX += grid
    }
    if (direction == "down") {
        snakeY += grid
    }

    console.log(direction, snakeX, snakeY)

    // if the snake eats the food
    if (snakeX == snakeFood.x && snakeY == snakeFood.y) {
        score++
        eat.play()
        snakeFood = {
            x: Math.floor(Math.random() * 15 + 1) * grid,
            y: Math.floor(Math.random() * 13 + 3) * grid,
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
        snakeX > 15 * grid ||
        snakeY < 3 * grid ||
        snakeY > 15 * grid ||
        collision(newHead, snakeArr)
    ) {
        clearInterval(game)
    }

    snakeArr.unshift(newHead)

    currentScore.textContent = "Current Score: " + score
}

// Draw snake every 100ms
var game = setInterval(drawSnake, 100)
