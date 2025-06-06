const { invoke } = window.__TAURI__.core;

let clockTimerEl;
let startBtnEl;
let nextBtnEl;
let timerInterval = null;
let isRunning = false;

let mode = "pomodoro"; // "pomodoro" or "custom"
let currentSession = "work"; // "work" or "short_break"

let default_settings = {
  "pomodoro": {
    "work_duration": 25 * 60, // 25 minutes
    "short_break_duration": 5 * 60, // 5 minutes
    // "work_duration": 10, // 25 minutes
    // "short_break_duration": 5, // 5 minutes
  }
}

let timeRemaining = default_settings[mode].work_duration;

function notify(message) {
  invoke("notify", { "text" : message })
    .then(() => console.log("Notification sent:", message))
    .catch(err => console.error("Failed to send notification:", err));
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  clockTimerEl.textContent = formatTime(timeRemaining);
  if (currentSession === "work") {
    nextBtnEl.textContent = "Break";
    document.body.classList.remove("break-mode");
  } else {
    nextBtnEl.textContent = "Work";
    document.body.classList.add("break-mode");
  }
}

function startTimer() {
  if (isRunning) return;
  
  isRunning = true;
  startBtnEl.textContent = "Pause";
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateDisplay();
    
    if (timeRemaining <= 0) {
      // Timer finished - auto switch to next session and start it
      if (currentSession === "work") {
        currentSession = "short_break";
        timeRemaining = default_settings[mode].short_break_duration;
        notify("Time for a break!");
      } else {
        currentSession = "work";
        timeRemaining = default_settings[mode].work_duration;
        notify("Time to get back to work!");
      }
      updateDisplay();
      // Continue running the timer for the next session      
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  
  isRunning = false;
  startBtnEl.textContent = "Start";
  clearInterval(timerInterval);
}

function resetTimer() {
  pauseTimer();
  if (currentSession === "work") {
    timeRemaining = default_settings[mode].work_duration;
  } else {
    timeRemaining = default_settings[mode].short_break_duration;
  }
  updateDisplay();
}

function switchSession() {
  pauseTimer();
  if (currentSession === "work") {
    currentSession = "short_break";
    timeRemaining = default_settings[mode].short_break_duration;
  } else {
    currentSession = "work";
    timeRemaining = default_settings[mode].work_duration;
  }
  updateDisplay();
}

function stopTimer() {
  pauseTimer();
}

window.addEventListener("DOMContentLoaded", () => {
  clockTimerEl = document.querySelector("#clock-timer");
  startBtnEl = document.querySelector("#start-btn");
  nextBtnEl = document.querySelector("#next-btn");
  
  // Initialize display
  updateDisplay();
  
  startBtnEl.addEventListener("click", () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });
  
  nextBtnEl.addEventListener("click", () => {
    switchSession();
  });
});
