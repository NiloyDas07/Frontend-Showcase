let score = 0;
let coinSound, bombSound;
let cursorX = 0;
let cursorY = 0;

// Cursor Position
window.addEventListener("mousemove", e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

// Root
const root = document.querySelector("#root");

// Page Heading
const heading = document.createElement("h1");
heading.textContent = "Coin Burst";

// Score
const scoreElement = document.createElement("h2");
scoreElement.id = "score";
scoreElement.textContent = "Coins Collected : 0";

// Add the heading and score to the root
root.append(heading, scoreElement);

// Modal
const modal = document.createElement("div");
modal.classList.add("modal");

// Play Button
const playButton = document.createElement("button");
playButton.className = "start-button";
playButton.textContent = "Start Game";
playButton.addEventListener("click", () => {
  score = 0;
  scoreElement.textContent = "Coins Collected : 0";
  root.removeChild(modal);
  play();
});

const displayStart = () => {
  // Initialize audio when the game starts
  initAudio();
  
  // Instructions
  const instructionsHeading = document.createElement("h2");
  instructionsHeading.textContent = "Instructions";

  const instructions = document.createElement("ol");

  const steps = [
    "Hover over the coins to collect them. Clicking also works for mobile devices, but this game is mainly designed for desktop.",
    "Avoid touching the bombs. If you touch a bomb, the game will end.",
    "Collect as many coins as possible.",
    'Click the "Start Game" button to start the game.'
  ];

  steps.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    instructions.appendChild(li);
  });
    modal.append(instructionsHeading, instructions, playButton);
    root.append(modal);
};

function initAudio() {
  coinSound = new Audio();
  bombSound = new Audio();
  
  // Check for browser support and set audio sources
  if (coinSound.canPlayType('audio/ogg')) {
    coinSound.src = window.gameAssets.coinOgg;
    bombSound.src = window.gameAssets.bombOgg;
  } else {
    coinSound.src = window.gameAssets.coinMp3;
    bombSound.src = window.gameAssets.bombMp3;
  }
  
  // Preload audio
  coinSound.load();
  bombSound.load();
}

function play() {
  const root = document.getElementById("root");
  let difficulty = 1;
  let waveDuration = 15000;  // 15 seconds per wave
  let coinIntervalId, bombIntervalId, waveTimeoutId;

  function setSpawners() {
    // Clear old spawners if any
    clearInterval(coinIntervalId);
    clearInterval(bombIntervalId);

    // Calculate new rates - decreases with increasing difficulty
    const coinRate = Math.max(300, 1000 - difficulty * 100);
    const bombRate = Math.max(300, 1000 - difficulty * 80);

    coinIntervalId = setInterval(addCoin, coinRate);
    bombIntervalId = setInterval(addBomb, bombRate);
  }

  function rampDifficulty() {
    difficulty++;
    // Cap difficulty at 10
    if (difficulty <= 10) {
      setSpawners();
      waveTimeoutId = setTimeout(rampDifficulty, waveDuration);
    }
  }

  function displayFinalScore() {
    const modalHeading = document.createElement("h2");
    modalHeading.textContent = "Game Over";

    const finalScore = document.createElement("h3");
    finalScore.className = "final-score";
    finalScore.textContent = `You Collected ${score} Coins`;

    playButton.textContent = "Play Again";
    playButton.classList.add("center-x");
    modal.replaceChildren(modalHeading, finalScore, playButton);
    root.appendChild(modal);
  }

  function gameOver() {
    clearInterval(coinIntervalId);
    clearInterval(bombIntervalId);
    clearTimeout(waveTimeoutId);
    displayFinalScore();
  }

  function addCoin() {
    const coin = document.createElement("img");
    coin.src = window.gameAssets.coin;

    const width = window.innerWidth;
    const height = window.innerHeight;

    let top = Math.random() * height;
    let left = Math.random() * width;

    top = top > height - 105 ? height - 105 : top;
    left = left > width - 105 ? width - 105 : left;

    coin.style.width = "50px";
    coin.style.height = "50px";
    coin.style.position = "absolute";
    coin.style.top = top + "px";
    coin.style.left = left + "px";

    root.appendChild(coin);

    const timeout = setTimeout(() => {
      if (coin.parentNode === root) {
        root.removeChild(coin);
      }
    }, 5000);

    coin.addEventListener("mouseover", () => {
      score++;
      scoreElement.textContent = `Coins Collected : ${score}`;
      // Play coin collection sound
      coinSound.currentTime = 0;
      coinSound.play().catch(e => console.log("Audio play failed:", e));
      if (coin.parentNode === root) {
        root.removeChild(coin);
      }
      clearTimeout(timeout);
    });
  }

  function addBomb() {
    const bomb = document.createElement("img");
    bomb.src = window.gameAssets.bomb;
    bomb.style.width = "45px";
    bomb.style.height = "60px";
    bomb.style.position = "absolute";

    const width = window.innerWidth;
    const height = window.innerHeight;
    const safeRadius = 80; // px around the cursor

    let top, left, dx, dy, dist;
    do {
      top  = Math.random() * (height  - 105);
      left = Math.random() * (width   - 105);

      // compute euclidean distance to pointer:
      dx = left + 22.5 - cursorX; // + half bomb width
      dy = top  + 30   - cursorY; // + half bomb height
      dist = Math.hypot(dx, dy);
    } while (dist < safeRadius);  
    
    bomb.style.top = `${top}px`;
    bomb.style.left = `${left}px`;

    root.appendChild(bomb);

    const timeout = setTimeout(() => {
      if (bomb.parentNode === root) {
        root.removeChild(bomb);
      }
    }, 2000);

    bomb.addEventListener("mouseover", () => {
      // Play bomb explosion sound
      bombSound.currentTime = 0;
      bombSound.play().catch(e => console.log("Audio play failed:", e));
      
      if (bomb.parentNode === root) {
        root.removeChild(bomb);
      }
      clearTimeout(timeout);
      gameOver();
    });
  }


  // start the first wave
  setSpawners();
  waveTimeoutId = setTimeout(rampDifficulty, waveDuration);
}

window.addEventListener("DOMContentLoaded", () => {
  displayStart();
});
