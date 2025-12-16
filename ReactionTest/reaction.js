// ==== Elements ====
const lights = [
  document.getElementById('light1'),
  document.getElementById('light2'),
  document.getElementById('light3'),
  document.getElementById('light4'),
  document.getElementById('light5')
];

const startButton = document.getElementById('startButton');
const bestTimeDisplay = document.getElementById('bestTimeDisplay');
const allTimesDisplay = document.getElementById('allTimes');
const messageBox = document.getElementById('messageBox');

let startTime;
let bestTime = null;
let allTimes = [];
let gameInProgress = false;
let canReact = false;

let intervalId = null;
let timeoutId = null;

// ==== Functions ====

// Reset lights and cancel any ongoing timers
function resetLights() {
  lights.forEach(light => light.classList.remove('red','on'));
  startTime = null;
  gameInProgress = false;
  canReact = false;
  startButton.disabled = false;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

// Show floating message
function showMessage(text, duration = 2000) {
  messageBox.textContent = text;
  messageBox.style.opacity = '1';
  messageBox.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    messageBox.style.opacity = '0';
    messageBox.style.transform = 'translateX(-50%) translateY(-20px)';
  }, duration);
}

// Record reaction time
function recordReaction() {
  const reactionTime = Date.now() - startTime;
  allTimes.push(reactionTime);

  if (!bestTime || reactionTime < bestTime) bestTime = reactionTime;

  bestTimeDisplay.textContent = `Best Time: ${bestTime} ms`;
  allTimesDisplay.textContent = `All Times:\n${allTimes.join(' ms\n')} ms`;

  showMessage(`Your reaction time: ${reactionTime} ms`, 2500);

  resetLights();
}

// Start the F1 lights sequence
function startLights() {
  gameInProgress = true;
  canReact = false;
  let i = 0;

  // Turn on first light immediately
  lights[i].classList.add('red', 'on');
  i++;

  intervalId = setInterval(() => {
    if (i < lights.length) {
      lights[i].classList.add('red', 'on');
      i++;
    } else {
      clearInterval(intervalId);
      intervalId = null;

      // Random delay before lights go off
      const delay = Math.random() * (3000 - 200) + 200;

      timeoutId = setTimeout(() => {
        lights.forEach(light => light.classList.remove('red','on')); // lights off instantly
        startTime = Date.now();
        canReact = true; // now clicks are valid
        timeoutId = null;
      }, delay);
    }
  }, 1000);
}

// ==== Event Listeners ====

// Start button click
startButton.addEventListener('click', () => {
  if (!gameInProgress) {
    startLights(); // start game
    return;
  }

  if (!canReact) {
    showMessage("Too early! Wait for the lights to go off.", 2000);
    resetLights(); // reset game if clicked too early
    return;
  }

  // Lights are off → valid reaction
  recordReaction();
});

// Click anywhere to react
document.body.addEventListener('click', (e) => {
  if (e.target.id === 'startButton') return; // ignore Start button here

  if (!gameInProgress) return;

  if (!canReact) {
    showMessage("Too early! Wait for the lights to go off.", 2000);
    resetLights(); 
    return;
  }

  recordReaction();
});




const showTimesBtn = document.getElementById('showTimesBtn');
const timesPopup = document.getElementById('timesPopup');
const timesList = document.getElementById('timesList');
const closeTimes = document.getElementById('closeTimes');

showTimesBtn.addEventListener('click', () => {
  if (allTimes.length === 0) {
    timesList.textContent = 'No times yet.';
  } else {
    timesList.textContent = allTimes.map(t => `${t} ms`).join('\n');
  }
  timesPopup.style.display = 'flex';
});

closeTimes.addEventListener('click', () => {
  timesPopup.style.display = 'none';
});

// Optional: click outside content to close
timesPopup.addEventListener('click', (e) => {
  if (e.target === timesPopup) {
    timesPopup.style.display = 'none';
  }
});
