var gameCanvas = document.querySelector(".game-box")
var canvasContext = gameCanvas.getContext("2d")
var foodIcon = new Image()
foodIcon.src = "/green_square.png"

canvasContext.drawImage(foodIcon, 100, 200, 20, 20)

// Create first square for snake icon
canvasContext.fillStyle = "DarkOrange"
canvasContext.fillRect(100, 300, 30, 30)

var grid = 32 // 32px for each grid space

function drawSnake() {
    
}
