'use strict'

const MINE = '💣'

var gBoard
var savedTable

var gLevel = {
  size: 4,
  MINES: 2,
}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  firstClick: false,
  lives: 3,
}

var gHints = {
  available: 3,
  isActive: false,
}

function onInit() {
  resetGame()
  gBoard = buildBoard(gLevel.size)
  renderBoard(gBoard)
}

function buildBoard(size) {
  const board = []

  for (var i = 0; i < size; i++) {
    const rows = []
    for (var j = 0; j < size; j++) {
      const cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }

      rows.push(cell)
    }
    board.push(rows)
  }

  return board
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="event.preventDefault(); onCellMarked(this,${i}, ${j})"></td>`
    }
    strHTML += '</tr>'
  }
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
  var elFlag = document.querySelector('.flags')
  elFlag.innerHTML = `${gLevel.MINES} : 🚩`
}

function setMinesNegsCount(board, row, col) {
  var counter = 0
  for (var i = row - 1; i <= row + 1; i++) {
    for (var j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < board.length && j >= 0 && j < board[i].length) {
        if (board[i][j].isMine && !(i === row && j === col)) {
          counter++
        }
      }
    }
  }
  return counter
}

function onCellClicked(elCell, i, j) {
  const cell = gBoard[i][j]

  if (!gGame.isOn || gBoard[i][j].isShown) return

  if (gHints.isActive) {
    revealHint(i, j)
    gHints.isActive = false
    return
  }

  if (!gGame.firstClick) {
    placeMines(gBoard, gLevel.MINES, i, j)
    startTimer()
    gGame.firstClick = true
  }
  if (cell.isMine) {
    gGame.lives--
    updateLivesDisplay()
    if (gGame.lives === 0) {
      gGame.isOn = false
      revealAllMines()
      checkGameOver()
    }
  } else {
    cell.isShown = true
    cell.minesAroundCount = setMinesNegsCount(gBoard, i, j)
    elCell.classList.add('shown')
    elCell.innerText = cell.minesAroundCount > 0 ? cell.minesAroundCount : ''
    if (cell.minesAroundCount === 0) {
      expandShown(gBoard, i, j)
    }
    checkGameOver()
  }
}
function checkGameOver() {
  var allCellsRevealed = true
  var correctFlags = 0

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      const cell = gBoard[i][j]
      if (!cell.isMine && !cell.isShown) {
        allCellsRevealed = false
      }
      if (cell.isMine && cell.isMarked) {
        correctFlags++
      }
    }
  }

  if (allCellsRevealed && correctFlags === gLevel.MINES) {
    gGame.isOn = false
    updateSmiley('😎')
    stopTimer()
    return true
  }

  if (!gGame.isOn) {
    stopTimer()
    updateSmiley('🤯')
  }
  return false
}

function expandShown(board, row, col) {
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (
        i >= 0 &&
        i < board.length &&
        j >= 0 &&
        j < board[i].length &&
        !board[i][j].isShown &&
        !board[i][j].isMine &&
        !board[i][j].isMarked
      ) {
        const neighborCell = document.querySelector(`.cell-${i}-${j}`)
        onCellClicked(neighborCell, i, j)
      }
    }
  }
  checkGameOver()
}

function revealAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      const cell = gBoard[i][j]
      if (cell.isMine) {
        const elCell = document.querySelector(`.cell-${i}-${j}`)
        elCell.innerText = MINE
        elCell.classList.add('mine')
      }
    }
  }
}

function onCellMarked(elCell, i, j) {
  const cell = gBoard[i][j]
  var elFlag = document.querySelector('.flags')
  if (!gGame.isOn) return
  if (cell.isShown) return

  if (cell.isMarked) {
    cell.isMarked = false
    elCell.innerText = ''
    gGame.markedCount--
  } else {
    if (gGame.markedCount < gLevel.MINES) {
      cell.isMarked = true
      elCell.innerText = ' 🚩'
      gGame.markedCount++
    }
  }
  elFlag.innerHTML = `  ${gLevel.MINES - gGame.markedCount} : 🚩`
  checkGameOver()
}

function resetGame() {
  gGame.isOn = true
  gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gGame.firstClick = false
  gGame.lives = 3
  updateSmiley('😃')
  updateLivesDisplay()
  stopTimer()
  updateTimerDisplay()
  gBoard = buildBoard(gLevel.size)
  renderBoard(gBoard)
}

function updateSmiley(face) {
  var elSmiley = document.querySelector('h2 span')
  elSmiley.innerText = face
}

function updateLivesDisplay() {
  const elLives = document.querySelector('.lives')
  let livesString = 'Lives: '
  for (let i = 0; i < gGame.lives; i++) {
    livesString += '❤️'
  }
  elLives.textContent = livesString
}
