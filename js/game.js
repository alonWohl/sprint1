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
  // placeMines(board, gLevel.MINES)
  return board
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
}

function onCellClicked(elCell, i, j) {
  if (!gGame.isOn || gBoard[i][j].isShown) return
 
  if (!gGame.firstClick) {
    placeMines(gBoard, gLevel.MINES, i, j)
    gGame.firstClick = true
  }
  const cell = gBoard[i][j]

  if (cell.isMine) {
    revealAllMines()
    gGame.isOn = false
    checkGameOver()
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
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      const cell = gBoard[i][j]
      if (!cell.isMine && !cell.isShown) {
        return false
      }
    }
  }

  var correctFlags = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      const cell = gBoard[i][j]
      if (cell.isMine && cell.isMarked) {
        correctFlags++
      }
    }
  }

  if (correctFlags === gLevel.MINES) {
    gGame.isOn = false
    alert('Congratulations! You have won the game!')
    return true
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

function revealAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      const cell = gBoard[i][j]
      if (cell.isMine) {
        const elCell = document.querySelector(`.cell-${i}-${j}`)
        elCell.innerText = MINE
      }
    }
  }
}

function onCellMarked(elCell, i, j) {
  const cell = gBoard[i][j]

  if (cell.isShown) return

  if (cell.isMarked) {
    cell.isMarked = false
    elCell.innerText = ''
    gGame.markedCount--
  } else {
    if (gGame.markedCount < gLevel.MINES) {
      cell.isMarked = true
      elCell.innerText = '⛳️'
      gGame.markedCount++
    }
  }
  checkGameOver()
}
function resetGame() {
  gGame.isOn = true
  gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gGame.firstClick = false
  gLevel.markedCounter = 0
}
