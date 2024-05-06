'use strict'

var timerInterval

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  timerInterval = setInterval(function () {
    gGame.secsPassed++
    updateTimerDisplay()
  }, 1000)
}

function stopTimer() {
  clearInterval(timerInterval)
}

function updateTimerDisplay() {
  const elTimer = document.querySelector('.timer')
  elTimer.innerHTML = `Time: ${gGame.secsPassed} sec`
}
