let ballX = 75
let ballSpeedX = 5
let ballY = 75
let ballSpeedY = 7

const BRICK_W = 80
const BRICK_H = 20
const BRICK_GAP = 2
const BRICK_COLS = 10
const BRICK_ROWS = 14
let brickGrid = new Array(BRICK_COLS * BRICK_ROWS)

const PADDLE_WIDTH = 100
const PADDLE_THICKNESS = 10
const PADDLE_BOTTOM_GAP = 60
let paddleX = 400

let mouseX
let mouseY

let canvas, ctx

const brickReset = () => {
  for (let i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
    brickGrid[i] = true
  }
}

window.onload = () => {
  canvas = document.querySelector('#gameCanvas')
  ctx = canvas.getContext('2d')

  let fps = 30
  setInterval(updateAll, 1000 / fps)

  canvas.addEventListener('mousemove', updateMousePos)
  brickReset()
}

const updateMousePos = event => {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement

  mouseX = event.clientX - rect.left - root.scrollLeft
  mouseY = event.clientY - rect.top - root.scrollTop
  paddleX = mouseX - PADDLE_WIDTH / 2
}

const updateAll = () => {
  moveAll()
  drawAll()
}

const ballReset = () => {
  ballX = canvas.width / 2
  ballY = canvas.height / 2
}

const moveAll = () => {
  ballX += ballSpeedX
  ballY += ballSpeedY

  if (ballX > canvas.width || ballX < 0) {
    ballSpeedX *= -1
  }

  if (ballY < 0) {
    ballSpeedY *= -1
  }
  if (ballY > canvas.height) {
    ballReset()
  }

  let ballBrickCol = Math.floor(ballX / BRICK_W)
  let ballBrickRow = Math.floor(ballY / BRICK_H)
  let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow)

  if (
    ballBrickCol >= 0 &&
    ballBrickCol < BRICK_COLS &&
    ballBrickRow >= 0 &&
    ballBrickRow < BRICK_ROWS
  ) {
    if (brickGrid[brickIndexUnderBall]) {
      brickGrid[brickIndexUnderBall] = false
      ballSpeedY *= -1
    }
  }

  let paddleTopEdgeY = canvas.height - PADDLE_BOTTOM_GAP
  let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS
  let paddleLeftEdgeX = paddleX
  let paddleRightEdgeX = paddleX + PADDLE_WIDTH

  if (
    ballY > paddleTopEdgeY &&
    ballY < paddleBottomEdgeY &&
    ballX > paddleLeftEdgeX &&
    ballX < paddleRightEdgeX
  ) {
    ballSpeedY *= -1
    let centerPaddleX = paddleX + PADDLE_WIDTH / 2
    let ballDistanceFromPaddleX = ballX - centerPaddleX
    ballSpeedX = ballDistanceFromPaddleX * 0.35
  }
}

const rowColToArrayIndex = (col, row) => {
  return col + BRICK_COLS * row
}

const drawBricks = () => {
  for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow)
      if (brickGrid[arrayIndex]) {
        colorRect(
          BRICK_W * eachCol,
          BRICK_H * eachRow,
          BRICK_W - BRICK_GAP,
          BRICK_H - BRICK_GAP,
          'blue'
        )
      }
    }
  }
}

const drawAll = () => {
  colorRect(0, 0, canvas.width, canvas.height, 'black')
  drawCircle(ballX, ballY, 10, 'red')

  colorRect(
    paddleX,
    canvas.height - PADDLE_BOTTOM_GAP,
    PADDLE_WIDTH,
    PADDLE_THICKNESS,
    'white'
  )
  drawBricks()

  // colorText(
  //   `${mouseBrickCol},${mouseBrickRow} : ${brickIndexUnderMouse}`,
  //   mouseX,
  //   mouseY,
  //   'yellow'
  // )
}

const colorRect = (x, y, width, height, color) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}

const drawCircle = (x, y, radius, color) => {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2, true)
  ctx.fill()
}

const colorText = (words, x, y, color) => {
  ctx.fillStyle = color
  ctx.fillText(words, x, y)
}
