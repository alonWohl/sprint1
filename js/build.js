'use strict'

var minePlacementMode = false
var minesAdded = 0

function changeLevelEasy() {
  gLevel.size = 4
  gLevel.MINES = 2
  resetGame()
  gBoard = buildBoard(gLevel.size)
  renderBoard(gBoard)
}

function changeLevelMedium() {
  gLevel.size = 8
  gLevel.MINES = 14
  resetGame()
  gBoard = buildBoard(gLevel.size)
  renderBoard(gBoard)
}

function changeLevelExpert() {
  gLevel.size = 12
  gLevel.MINES = 32
  resetGame()
  gBoard = buildBoard(gLevel.size)
  renderBoard(gBoard)
}

function placeMines(board, minesCount, i, j) {
  var minesPlaced = 0
  while (minesPlaced < minesCount) {
    const row = Math.floor(Math.random() * board.length)
    const col = Math.floor(Math.random() * board[0].length)

    if (
      !board[row][col].isMine &&
      !(Math.abs(row - i) <= 1 && Math.abs(col - j) <= 1)
    ) {
      board[row][col].isMine = true
      minesPlaced++
    }
  }
}

function toggleMinePlacementMode() {
  var elToggleMineAdd = document.querySelector('.manual-mine')
  minePlacementMode = !minePlacementMode

  if (minePlacementMode) {
    elToggleMineAdd.classList.add('clicked')
  } else {
    elToggleMineAdd.classList.remove('clicked')
  }
}

function updateSmiley(face) {
  var elSmiley = document.querySelector('h2 span')
  elSmiley.innerText = face
}

function updateLivesDisplay() {
  const elLives = document.querySelector('.lives')
  var livesString = 'Lives: '
  for (let i = 0; i < gGame.lives; i++) {
    livesString += '❤️'
  }
  elLives.textContent = livesString
}

function addMineManually(i, j) {
  var elFlag = document.querySelector('.flags')
  if (minePlacementMode) {
    if (!gBoard[i][j].isMine) {
      gBoard[i][j].isMine = true
      minesAdded++
      gLevel.MINES ++
      updateFlag()

      console.log(`Mine added at (${i}, ${j}).`)
    } else {
      alert("There's already a mine here!")
    }
  }
}

function updateFlag(){
  var elFlag = document.querySelector('.flags')
  elFlag.innerHTML = `${gLevel.MINES} : 🚩`
}