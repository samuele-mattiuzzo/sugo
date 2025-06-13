let timer = null
let state = {
  mode: 'default',
  soundOn: true,
  isWork: true,
  running: false,
  endTime: null
}

const durations = {
  test: { work: 1, rest: 1 },
  default: { work: 25, rest: 5 },
  short: { work: 15, rest: 3 },
  long: { work: 50, rest: 10 }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'START') {
    state.mode = msg.mode
    state.soundOn = msg.sound
    state.isWork = true
    state.running = true
    startPhase()
  }
  if (msg.type === 'STOP') {
    clearInterval(timer)
    state.running = false
    state.endTime = null
    updateBadge('')
  }
  if (msg.type === 'DISMISS') {
    state.isWork = !state.isWork
    startPhase()
  }
  if (msg.type === 'GET_STATE') {
    sendResponse(state)
  }
})

function startPhase() {
  const min = durations[state.mode][state.isWork ? 'work' : 'rest']
  const ms = min * 60 * 1000
  state.endTime = Date.now() + ms
  clearInterval(timer)
  tick()
  timer = setInterval(tick, 1000)
}

function tick() {
  const remaining = state.endTime - Date.now()
  if (remaining <= 0) {
    clearInterval(timer)
    state.running = false
    updateBadge('')
    if (state.soundOn) chrome.runtime.sendMessage({ type: 'ALARM' })
  } else {
    const min = Math.floor(remaining / 60000)
    const sec = Math.floor((remaining % 60000) / 1000)
    const text = `${min}:${sec.toString().padStart(2, '0')}`
    updateBadge(text)
  }
}

function updateBadge(text) {
  chrome.action.setBadgeText({ text })
  chrome.action.setBadgeBackgroundColor({ color: '#cc0000' })
}
