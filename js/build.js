'use strict'
var gSafeClicks = {
  available: 3,
}

var minePlacementMode = false
var minesAdded = 0

function changeLevelEasy() {
  resetGame()
  gLevel.size = 4
  gLevel.MINES = 2
  gBoard = buildBoard(gLevel.size)
  renderBoard(gBoard)
}

function changeLevelMedium() {
  resetGame()
  gLevel.size = 8
  gLevel.MINES = 14
  gBoard = buildBoard(gLevel.size)
  renderBoard(gBoard)
}

function changeLevelExpert() {
  resetGame()
  gLevel.size = 12
  gLevel.MINES = 32
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
  var elToggleMineAdd = document.querySelector('.add-mine')
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
  for (var i = 0; i < gGame.lives; i++) {
    livesString += '❤️'
  }
  elLives.textContent = livesString
}

function addMineManually(i, j) {
  if (minePlacementMode) {
    if (!gBoard[i][j].isMine) {
      gBoard[i][j].isMine = true
      minesAdded++
      gLevel.MINES++

      updateFlag()

      console.log(`Mine added at (${i}, ${j}).`)
    } else {
      alert("There's already a mine here!")
    }
  }
}

function updateFlag() {
  var elFlag = document.querySelector('.flags')
  elFlag.innerHTML = `${gLevel.MINES} : 🚩`
}

function onSafeClick() {
  if (gSafeClicks.available <= 0 || !gGame.isOn || !gGame.firstClick) {
    return
  }

  var safeCells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      const cell = gBoard[i][j]
      if (!cell.isShown && !cell.isMine && !cell.isMarked) {
        safeCells.push({ i, j })
      }
    }
  }

  if (safeCells.length > 0) {
    const randomCell = safeCells[Math.floor(Math.random() * safeCells.length)]
    const elCell = document.querySelector(
      `.cell-${randomCell.i}-${randomCell.j}`
    )
    elCell.classList.add('safe')
    setTimeout(() => {
      elCell.classList.remove('safe')
    }, 1000)

    gSafeClicks.available--
    updateSafeClickDisplay()
  }
}

function updateSafeClickDisplay() {
  var elSafeClickBtn = document.querySelector('.safe-click')
  elSafeClickBtn.innerText = `🛟 Safe Click : ${gSafeClicks.available}`
}
