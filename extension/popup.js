let workDur = 25, breakDur = 5, long = false, running = false, isWork = true, timer = null, soundOn = true, remaining = 0

const modeSelect = document.getElementById('mode')
const timeDisplay = document.getElementById('time')
const startBtn = document.getElementById('start')
const stopBtn = document.getElementById('stop')
const dismissBtn = document.getElementById('dismiss')
const soundToggle = document.getElementById('soundToggle')
const alarm = document.getElementById('alarm')

modeSelect.onchange = () => {
  if (modeSelect.value === 'long') { workDur = 50; breakDur = 10 }
  else if (modeSelect.value === 'short') { workDur = 15; breakDur = 3 }
  else { workDur = 25; breakDur = 5 }
  reset()
}

startBtn.onclick = () => {
  if (!running) startTimer()
}

stopBtn.onclick = () => {
  reset()
}

dismissBtn.onclick = () => {
  isWork = !isWork
  dismissBtn.style.display = 'none'
  startTimer()
}

soundToggle.onchange = () => {
  soundOn = soundToggle.checked
}

function startTimer() {
  running = true
  let duration = (isWork ? workDur : breakDur) * 60
  remaining = duration
  updateDisplay(remaining)
  timer = setInterval(() => {
    remaining--
    updateDisplay(remaining)
    if (remaining <= 0) {
      clearInterval(timer)
      running = false
      if (soundOn) alarm.play()
      dismissBtn.style.display = 'inline-block'
    }
  }, 1000)
}

function reset() {
  clearInterval(timer)
  running = false
  isWork = true
  dismissBtn.style.display = 'none'
  updateDisplay(workDur * 60)
}

function updateDisplay(secs) {
  let m = Math.floor(secs / 60)
  let s = secs % 60
  timeDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

reset()
