// Credit to https://www.codeexplained.org for explaining canvas elements and how to use them

var gameCanvas = document.querySelector(".game-box")
var canvasContext = gameCanvas.getContext("2d")
var currentScore = document.querySelector(".current-score")
var instructions = document.querySelector(".instructions")
var gameOverModal = document.getElementById("game-over-modal")
var modalBackdrop = document.getElementById("modal-backdrop")
var closeButton = document.getElementsByClassName("modal-close-button")[0]
var okayNameButton = document.getElementsByClassName(
    "game-modal-accept-button"
)[0]
var gameScore = document.querySelector(".game-score")
var grid = 32 // 32px for each grid space, 512x512px for game board, so 16x16 square grid
var snakeArr = []
var score = 0
var direction = "right"
var currDirection
var game
var birdFly
var foxMove
var snakeFood = {}
var bootObstacle = {}
var birdObstacle = {}
var foxObstacle = {}

/* icons made in MS paint */
const foodImg = new Image()
foodImg.src = "food.png"
const snakeFace = new Image()
snakeFace.src = "face.png"
const gridImg = new Image()
gridImg.src = "grid.png"
/* icon from https://www.clker.com/clipart-simple-brown-boot.html */
const boot = new Image()
boot.src = "boot.png"
/* icon from http://clipart-library.com/clipart/8TA6eypGc.htm */
const bird = new Image()
bird.src = "bird.png"
/* icon from https://www.pinterest.com/pin/193021534009808883/ */
const fox = new Image()
fox.src = "fox.png"

function findFoodLocation() {
    snakeFood.x = Math.floor(Math.random() * 15 + 1) * grid
    snakeFood.y = Math.floor(Math.random() * 13 + 3) * grid
    for (i = 0; i < snakeArr.length; i++) {
        if (
            (snakeFood.x == snakeArr[i].x && snakeFood.y == snakeArr[i].y) ||
            (snakeFood.x == birdObstacle.x && snakeFood.y == birdObstacle.y) ||
            (snakeFood.x == bootObstacle.x && snakeFood.y == bootObstacle.y) ||
            (snakeFood.x == foxObstacle.x && snakeFood.y == foxObstacle.y)
        ) {
            snakeFood.x = Math.floor(Math.random() * 15 + 1) * grid
            snakeFood.y = Math.floor(Math.random() * 13 + 3) * grid
        }
    }
}

function findBootLocation() {
    bootObstacle.x = Math.floor(Math.random() * 15 + 1) * grid
    bootObstacle.y = Math.floor(Math.random() * 13 + 3) * grid
    for (i = 0; i < snakeArr.length; i++) {
        if (
            (bootObstacle.x == snakeArr[i].x &&
                bootObstacle.y == snakeArr[i].y) ||
            (bootObstacle.x == birdObstacle.x &&
                bootObstacle.y == birdObstacle.y) ||
            (bootObstacle.x == snakeFood.x && bootObstacle.y == snakeFood.y) ||
            (bootObstacle.x == foxObstacle.x && bootObstacle.y == foxObstacle.y)
        ) {
            bootObstacle.x = Math.floor(Math.random() * 15 + 1) * grid
            bootObstacle.y = Math.floor(Math.random() * 13 + 3) * grid
        }
    }
}

function findBirdLocation() {
    birdObstacle.x = Math.floor(Math.random() * 15 + 1) * grid
    birdObstacle.y = Math.floor(Math.random() * 13 + 3) * grid
    for (i = 0; i < snakeArr.length; i++) {
        if (
            (birdObstacle.x == snakeArr[i].x &&
                birdObstacle.y == snakeArr[i].y) ||
            (birdObstacle.x == snakeFood.x && birdObstacle.y == snakeFood.y) ||
            (birdObstacle.x == bootObstacle.x &&
                birdObstacle.y == bootObstacle.y) ||
            (birdObstacle.x == foxObstacle.x && birdObstacle.y == foxObstacle.y)
        ) {
            birdObstacle.x = Math.floor(Math.random() * 15 + 1) * grid
            birdObstacle.y = Math.floor(Math.random() * 13 + 3) * grid
        }
    }
}

function findFoxLocation() {
    foxObstacle.x = Math.floor(Math.random() * 15 + 1) * grid
    foxObstacle.y = Math.floor(Math.random() * 13 + 3) * grid
    for (i = 0; i < snakeArr.length; i++) {
        if (
            (foxObstacle.x == snakeArr[i].x &&
                foxObstacle.y == snakeArr[i].y) ||
            (foxObstacle.x == snakeFood.x && foxObstacle.y == snakeFood.y) ||
            (foxObstacle.x == bootObstacle.x &&
                foxObstacle.y == bootObstacle.y) ||
            (foxObstacle.x == birdObstacle.x && foxObstacle.y == birdObstacle.y)
        ) {
            foxObstacle.x = Math.floor(Math.random() * 15 + 1) * grid
            foxObstacle.y = Math.floor(Math.random() * 13 + 3) * grid
        }
    }
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

/* check if snake runs into itself */
function endSnake(head, arr) {
    for (i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            return true
        }
    }
    return false
}

/* Starts game, draw snake every __ms (ms affects speed of snake) */
document.addEventListener("keydown", startGame)
function startGame(event) {
    /* starting location for snake head and tail */
    snakeArr[0] = { x: 5 * grid, y: 8 * grid }
    snakeArr[1] = { x: 4 * grid, y: 8 * grid }
    snakeArr[2] = { x: 3 * grid, y: 8 * grid }
    var key = event.keyCode
    /* set difficulty of snake speed */
    if (key == 49 || key == 97) {
        /* Easy: '1' */
        findFoodLocation()
        findBootLocation()
        findBirdLocation()
        findFoxLocation()
        game = setInterval(drawSnake, 150)
        birdFly = setInterval(findBirdLocation, 5000)
        foxMove = setInterval(findFoxLocation, 10000)
        instructions.classList.add("hidden")
        document.removeEventListener("keydown", startGame)
        document.addEventListener("keydown", moveSnake)
    }
    if (key == 50 || key == 98) {
        /* Medium: '2' */
        findFoodLocation()
        findBootLocation()
        findBirdLocation()
        findFoxLocation()
        game = setInterval(drawSnake, 100)
        birdFly = setInterval(findBirdLocation, 3000)
        foxMove = setInterval(findFoxLocation, 6000)
        instructions.classList.add("hidden")
        document.removeEventListener("keydown", startGame)
        document.addEventListener("keydown", moveSnake)
    }
    if (key == 51 || key == 99) {
        /* Hard: '3' */
        findFoodLocation()
        findBootLocation()
        findBirdLocation()
        findFoxLocation()
        game = setInterval(drawSnake, 50)
        birdFly = setInterval(findBirdLocation, 2000)
        foxMove = setInterval(findFoxLocation, 4000)
        instructions.classList.add("hidden")
        document.removeEventListener("keydown", startGame)
        document.addEventListener("keydown", moveSnake)
    }
    if (key == 52 || key == 100) {
        /* Insane: '4' */
        findFoodLocation()
        findBootLocation()
        findBirdLocation()
        findFoxLocation()
        game = setInterval(drawSnake, 25)
        birdFly = setInterval(findBirdLocation, 1000)
        foxMove = setInterval(findFoxLocation, 2000)
        instructions.classList.add("hidden")
        document.removeEventListener("keydown", startGame)
        document.addEventListener("keydown", moveSnake)
    }
}

/* Runs game */
function drawSnake() {
    /* clear canvas each draw */
    canvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    canvasContext.drawImage(gridImg, 0, 0)
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

    /* draw icons and black border around */
    canvasContext.drawImage(foodImg, snakeFood.x, snakeFood.y)
    canvasContext.strokeStyle = "black"
    canvasContext.strokeRect(snakeFood.x, snakeFood.y, grid, grid)

    canvasContext.drawImage(boot, bootObstacle.x, bootObstacle.y)
    canvasContext.strokeStyle = "black"
    canvasContext.strokeRect(bootObstacle.x, bootObstacle.y, grid, grid)

    canvasContext.drawImage(bird, birdObstacle.x, birdObstacle.y)
    canvasContext.strokeStyle = "black"
    canvasContext.strokeRect(birdObstacle.x, birdObstacle.y, grid, grid)

    canvasContext.drawImage(fox, foxObstacle.x, foxObstacle.y)
    canvasContext.strokeStyle = "black"
    canvasContext.strokeRect(foxObstacle.x, foxObstacle.y, grid, grid)

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
        /* new food location */
        findFoodLocation()
    } else {
        /* remove tail */
        snakeArr.pop()
    }

    /* new head */
    var snakeHead = {
        x: snakeX,
        y: snakeY,
    }

    /* Check if snake hits edges of box or itself or obstacle */
    if (
        snakeX < 0 ||
        snakeX > 15 * grid ||
        snakeY < 0 ||
        snakeY > 15 * grid ||
        endSnake(snakeHead, snakeArr) ||
        (snakeX == bootObstacle.x && snakeY == bootObstacle.y) ||
        (snakeX == birdObstacle.x && snakeY == birdObstacle.y) ||
        (snakeX == foxObstacle.x && snakeY == foxObstacle.y)
    ) {
        /* death of snake */
        setTimeout(() => {
            gameOverModal.classList.remove("hidden")
            modalBackdrop.classList.remove("hidden")
        }, 350)
        gameScore.textContent = score
        clearInterval(game)
        clearInterval(birdFly)
        clearInterval(foxMove)
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
    findFoodLocation()
    findBootLocation()
    findBirdLocation()
    findFoxLocation()
    snakeArr = []
    document.addEventListener("keydown", startGame)
}
