const modeSelect = document.getElementById('mode')
const timeDisplay = document.getElementById('time')
const startBtn = document.getElementById('start')
const stopBtn = document.getElementById('stop')
const dismissBtn = document.getElementById('dismiss')
const soundToggle = document.getElementById('soundToggle')
const alarm = document.getElementById('alarm')

let interval = null

startBtn.onclick = () => {
  chrome.runtime.sendMessage({
    type: 'START',
    mode: modeSelect.value,
    sound: soundToggle.checked
  })
  watchState()
}

stopBtn.onclick = () => {
  chrome.runtime.sendMessage({ type: 'STOP' })
  clearInterval(interval)
  timeDisplay.textContent = '--:--'
}

dismissBtn.onclick = () => {
  chrome.runtime.sendMessage({ type: 'DISMISS' })
  dismissBtn.style.display = 'none'
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'ALARM') {
    if (soundToggle.checked) alarm.play()
    dismissBtn.style.display = 'inline-block'
  }
})

function watchState() {
  clearInterval(interval)
  interval = setInterval(() => {
    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (state) => {
      if (!state.running || !state.endTime) return
      const ms = state.endTime - Date.now()
      const min = Math.floor(ms / 60000)
      const sec = Math.floor((ms % 60000) / 1000)
      timeDisplay.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    })
  }, 1000)
}
