var gameCanvas = document.querySelector(".game-box")
var canvasContext = gameCanvas.getContext("2d")
var currentScore = document.querySelector(".current-score")
var grid = 32 // 32px for each grid space, 512x512px for game board, so 16x16 square grid
var snakeArr = []
var score = 0
var gameOverModal = document.getElementById("game-over-modal")
var modalBackdrop = document.getElementById("modal-backdrop")
var direction

/* starting location for snake head and tail */
snakeArr[0] = { x: 5 * grid, y: 8 * grid }
snakeArr[1] = { x: 4 * grid, y: 8 * grid }
snakeArr[2] = { x: 3 * grid, y: 8 * grid }

/* random location for food */

/* check if snake food is on tail */
for (i = 0; i < snakeArr.length; i++) {
    var snakeFood = {
        x: Math.floor(Math.random() * 15 + 1) * grid,
        y: Math.floor(Math.random() * 13 + 3) * grid,
    }
    if (snakeFood.x == snakeArr[i].x) {
        snakeFood.x = Math.floor(Math.random() * 15 + 1) * grid
    }
    if (snakeFood.y == snakeArr[i].y) {
        snakeFood.y = Math.floor(Math.random() * 13 + 3) * grid
    } else {
        break
    }
}

function moveSnake(event) {
    /* move snake direction based on keypress key code */
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

/* draw snake every 150ms (ms is speed of snake) */
var game
document.addEventListener("keydown", startGame)
function startGame() {
    game = setInterval(drawSnake, 150)
    document.removeEventListener("keydown", startGame)
    document.addEventListener("keydown", moveSnake)
}

function drawSnake() {
    if (direction == undefined) {
        direction = "right"
    }
    for (i = 0; i < snakeArr.length; i++) {
        if (i == 0) {
            canvasContext.fillStyle = "Green"
        } else {
            canvasContext.fillStyle = "Chartreuse"
        }
        canvasContext.fillRect(snakeArr[i].x, snakeArr[i].y, grid, grid)

        canvasContext.strokeStyle = "Blue"
        canvasContext.strokeRect(snakeArr[i].x, snakeArr[i].y, grid, grid)

        /* delete tail of snake as it moves */
        var tail = snakeArr[snakeArr.length - 1]
        canvasContext.clearRect(tail.x, tail.y, grid, grid)
        canvasContext.clearRect(tail.x, tail.y - 1, grid + 2, grid + 2)
        canvasContext.clearRect(tail.x - 1, tail.y, grid + 2, grid + 2)
    }

    canvasContext.fillStyle = "Red"
    canvasContext.fillRect(snakeFood.x, snakeFood.y, grid, grid)

    /* get snake position */
    var snakeX = snakeArr[0].x
    var snakeY = snakeArr[0].y

    /* check direction and move snake */
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

    // if the snake eats the food
    if (snakeX == snakeFood.x && snakeY == snakeFood.y) {
        canvasContext.clearRect(snakeFood.x, snakeFood.y, grid, grid)
        score++
        /* check if snake food is on tail */
        for (i = 0; i < snakeArr.length; i++) {
            snakeFood = {
                x: Math.floor(Math.random() * 15 + 1) * grid,
                y: Math.floor(Math.random() * 13 + 3) * grid,
            }
            if (snakeFood.x == snakeArr[i].x) {
                snakeFood.x = Math.floor(Math.random() * 15 + 1) * grid
            }
            if (snakeFood.y == snakeArr[i].y) {
                snakeFood.y = Math.floor(Math.random() * 13 + 3) * grid
            } else {
                break
            }
        }
    } else {
        /* remove tail */
        snakeArr.pop()
    }

    /* add new head */
    var newHead = {
        x: snakeX,
        y: snakeY,
    }

    /* Check if snake hits edges of box or itself */
    if (
        snakeX < 0 ||
        snakeX > 15 * grid ||
        snakeY < 0 ||
        snakeY > 15 * grid ||
        collision(newHead, snakeArr)
    ) {
        //death
        gameOverModal.classList.remove("hidden")
        modalBackdrop.classList.remove("hidden")
        clearInterval(game)
    }

    snakeArr.unshift(newHead)

    /* update score on page */
    currentScore.textContent = "Current Score: " + score
}

var instructions = document.querySelector('.instructions')
// Draw snake every 150ms (ms is speed of snake)
document.addEventListener("keydown", startGame)
// draw snake every 150ms (ms is speed of snake)

var game
function startGame(){
  instructions.classList.add("hidden")
  game = setInterval(drawSnake, 150)
  document.removeEventListener("keydown", startGame)
  document.addEventListener("keydown", moveSnake)
}
