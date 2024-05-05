'use strict'

const MINE = '💣'

var gBoard
var gLevel = {
  size: 4,
  MINES: 2,
}
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}

function onInit() {
  gGame.isOn = true
  gBoard = buildBoard(4)
  gLevel.MINES=2
  renderBoard(gBoard)
  console.table(gBoard)
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
        isMarked: true,
      }
    
      rows.push(cell)
    }
    board.push(rows)
  }
  placeMines(board, gLevel.MINES)
  return board
}

function setMinesNegsCount(board, row, col) {
  var counter = 0;
  for (var i = row - 1; i <= row + 1; i++) {
    for (var j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < board.length && j >= 0 && j < board[i].length) {
        if (board[i][j].isMine && !(i === row && j === col)) {
          counter++;
        }
      }
    }
  }
  return counter;
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})"></td>`
    }
    strHTML += '</tr>'
  }
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
  if (!gGame.isOn || gBoard[i][j].isShown) return;
  const cell = gBoard[i][j];

  if (cell.isMine) {
    elCell.innerText = MINE
    gGame.isOn = false;
    checkGameOver();
  } else {
    cell.isShown = true;
    cell.minesAroundCount = setMinesNegsCount(gBoard, i, j);
    elCell.style.backgroundColor = "gray"
    elCell.innerText = cell.minesAroundCount > 0 ? cell.minesAroundCount : '';
    if (cell.minesAroundCount === 0) {
      expandShown(gBoard, i, j);
   
    }
  }
}
function checkGameOver() {
  console.log('game over')
}


function expandShown(board, row, col) {
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < board.length && j >= 0 && j < board[i].length && !board[i][j].isShown && !board[i][j].isMine) {
        const neighborCell = document.querySelector(`.cell-${i}-${j}`);
        onCellClicked(neighborCell, i, j);  // Reuse onCellClicked to handle cell opening logic
      }
    }
  }
}

function changeLevelMedium(){
  gGame.isOn=true
  gLevel.size=8
gLevel.MINES = 14
gBoard=buildBoard(gLevel.size)
renderBoard(gBoard)

}
function changeLevelExpert(){
  gGame.isOn=true
  gLevel.size=12
gLevel.MINES = 32
gBoard=buildBoard(gLevel.size)
renderBoard(gBoard)

}

function placeMines(board, minesCount) {
  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const row = Math.floor(Math.random() * board.length);
    const col = Math.floor(Math.random() * board[0].length);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }
}