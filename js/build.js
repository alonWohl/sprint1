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
