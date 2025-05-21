let score = 0;
let coinSound, bombSound;

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

  function displayFinalScore() {
    const modalHeading = document.createElement("h2");
    modalHeading.textContent = "Game Over";

    const finalScore = document.createElement("h3");
    finalScore.className = "final-score";
    finalScore.textContent = `You Collected ${score} Coins`;

    playButton.textContent = "Play Again";
    modal.replaceChildren(modalHeading, finalScore, playButton);
    root.appendChild(modal);
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
      root.removeChild(coin);
    }, 5000);

    coin.addEventListener("mouseover", () => {
      score++;
      scoreElement.textContent = `Coins Collected : ${score}`;
      // Play coin collection sound
      coinSound.currentTime = 0; // Rewind to start in case it's already playing
      coinSound.play().catch(e => console.log("Audio play failed:", e));
      root.removeChild(coin);
      clearTimeout(timeout);
    });
  }

  function addBomb() {
    const bomb = document.createElement("img");
    bomb.src = window.gameAssets.bomb;

    const width = window.innerWidth;
    const height = window.innerHeight;

    let top = Math.random() * height;
    let left = Math.random() * width;

    top = top > height - 105 ? height - 105 : top;
    left = left > width - 105 ? width - 105 : left;

    bomb.style.width = "45px";
    bomb.style.height = "60px";
    bomb.style.position = "absolute";
    bomb.style.top = top + "px";
    bomb.style.left = left + "px";

    root.appendChild(bomb);

    const timeout = setTimeout(() => {
      root.removeChild(bomb);
    }, 2000);

    bomb.addEventListener("mouseover", () => {
      // Play bomb explosion sound
      bombSound.currentTime = 0;
      bombSound.play().catch(e => console.log("Audio play failed:", e));
      
      score++;
      root.removeChild(bomb);
      clearTimeout(timeout);

      clearInterval(insertCoin);
      clearInterval(insertBomb);

      displayFinalScore();
    });
  }

  const insertCoin = setInterval(addCoin, 1000);
  const insertBomb = setInterval(addBomb, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  displayStart();
});
