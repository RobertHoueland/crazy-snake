// Credit to https://www.codeexplained.org for explaining canvas elements and how to use them

var gameCanvas = document.querySelector(".game-box")
var canvasContext = gameCanvas.getContext("2d")
var currentScore = document.querySelector(".current-score")
var instructions = document.querySelector(".instructions")
var gameOverModal = document.getElementById("game-over-modal")
var modalBackdrop = document.getElementById("modal-backdrop")
var closeButton = document.getElementsByClassName("modal-close-button")[1]
var enterNameModal = document.getElementById("enter-name-modal")
var okayNameButton = document.getElementsByClassName(
    "game-modal-accept-button"
)[0]
var gameScore = document.querySelector(".gameScore")
var grid = 32 // 32px for each grid space, 512x512px for game board, so 16x16 square grid
var snakeArr = []
var score = 0
var direction = "right"
var currDirection
var game

/* food icon made in MS paint */
const foodImg = new Image()
foodImg.src = "food.png"

const snakeFace = new Image()
snakeFace.src = "face.png"

/* random location for food */
var snakeFood = {
    x: Math.floor(Math.random() * 15 + 1) * grid,
    y: Math.floor(Math.random() * 13 + 3) * grid,
}

closeButton.addEventListener("click", closeModal)
okayNameButton.addEventListener("click", enterHighScore)

function enterHighScore() {
    var username = document.getElementById("username-input").value

    var userInfo = {
        name: username,
        score: score,
    }

    var scoreHTML = Handlebars.templates.table(userInfo)
    var scoreContainer = document.querySelector(".score-container")
    scoreContainer.insertAdjacentHTML("beforeend", scoreHTML)

    closeModal()
}

function closeModal() {
    modalBackdrop.classList.add("hidden")
    gameOverModal.classList.add("hidden")

    //enterNameModal.classList.remove("hidden");
}

function moveSnake(event) {
    /* move snake direction based on keypress key code */
    var key = event.keyCode
    if (
        (key == 37 && currDirection != "right") ||
        (key == 65 && currDirection != "right")
    ) {
        // 'A' key or left arrow key
        direction = "left"
    } else if (
        (key == 38 && currDirection != "down") ||
        (key == 87 && currDirection != "down")
    ) {
        // 'W' key or up arrow key
        direction = "up"
    } else if (
        (key == 39 && currDirection != "left") ||
        (key == 68 && currDirection != "left")
    ) {
        // 'D' key or right arrow key
        direction = "right"
    } else if (
        (key == 40 && currDirection != "up") ||
        (key == 83 && currDirection != "up")
    ) {
        // 'S' key or down arrow key
        direction = "down"
    }
}

function endSnake(head, arr) {
    /* check if snake runs into itself */
    for (i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            return true
        }
    }
    return false
}

/* draw snake every __ms (ms is speed of snake) */
document.addEventListener("keydown", startGame)
function startGame(event) {
    /* starting location for snake head and tail */
    snakeArr[0] = { x: 5 * grid, y: 8 * grid }
    snakeArr[1] = { x: 4 * grid, y: 8 * grid }
    snakeArr[2] = { x: 3 * grid, y: 8 * grid }
    var key = event.keyCode
    /* set difficulty of snake speed */
    if (key == 49) {
        /* Easy: '1' */
        game = setInterval(drawSnake, 150)
        instructions.classList.add("hidden")
        document.removeEventListener("keydown", startGame)
        document.addEventListener("keydown", moveSnake)
    }
    if (key == 50) {
        /* Medium: '2' */
        game = setInterval(drawSnake, 100)
        instructions.classList.add("hidden")
        document.removeEventListener("keydown", startGame)
        document.addEventListener("keydown", moveSnake)
    }
    if (key == 51) {
        /* Hard: '3' */
        game = setInterval(drawSnake, 50)
        instructions.classList.add("hidden")
        document.removeEventListener("keydown", startGame)
        document.addEventListener("keydown", moveSnake)
    }
    if (key == 52) {
        /* Insane: '4' */
        game = setInterval(drawSnake, 25)
        instructions.classList.add("hidden")
        document.removeEventListener("keydown", startGame)
        document.addEventListener("keydown", moveSnake)
    }
}

/* Runs game */
function drawSnake() {
    /* clear canvas each draw */
    canvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    for (i = 0; i < snakeArr.length; i++) {
        /* draw head of snake dark green, tail light green */
        if (i == 0) {
            canvasContext.drawImage(snakeFace, snakeArr[i].x, snakeArr[i].y)
        } else {
            canvasContext.fillStyle = "Chartreuse"
            canvasContext.fillRect(snakeArr[i].x, snakeArr[i].y, grid, grid)
        }

        /* blue border around snake */
        canvasContext.strokeStyle = "blue"
        canvasContext.strokeRect(snakeArr[i].x, snakeArr[i].y, grid, grid)
    }

    /* draw food img and black border around it */
    canvasContext.drawImage(foodImg, snakeFood.x, snakeFood.y)
    canvasContext.strokeStyle = "black"
    canvasContext.strokeRect(snakeFood.x, snakeFood.y, grid, grid)

    /* get snake position */
    var snakeX = snakeArr[0].x
    var snakeY = snakeArr[0].y

    /* check direction and move snake */
    if (direction == "left") {
        snakeX -= grid
        currDirection = "left"
    }
    if (direction == "up") {
        snakeY -= grid
        currDirection = "up"
    }
    if (direction == "right") {
        snakeX += grid
        currDirection = "right"
    }
    if (direction == "down") {
        snakeY += grid
        currDirection = "down"
    }

    /* if snake eats the food */
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
    var snakeHead = {
        x: snakeX,
        y: snakeY,
    }

    /* Check if snake hits edges of box or itself */
    if (
        snakeX < 0 ||
        snakeX > 15 * grid ||
        snakeY < 0 ||
        snakeY > 15 * grid ||
        endSnake(snakeHead, snakeArr)
    ) {
        /* death of snake */
        gameOverModal.classList.remove("hidden")
        modalBackdrop.classList.remove("hidden")
        gameScore.textContent = score
        clearInterval(game)
    }

    snakeArr.unshift(snakeHead)

    /* update score on page */
    currentScore.textContent = "Current Score: " + score
}

closeButton.addEventListener("click", closeModal)

function closeModal() {
    modalBackdrop.classList.add("hidden")
    gameOverModal.classList.add("hidden")
    instructions.classList.remove("hidden")
    /* clear board and restart game */
    canvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    direction = "right"
    score = 0
    snakeArr = []
    document.addEventListener("keydown", startGame)
}
