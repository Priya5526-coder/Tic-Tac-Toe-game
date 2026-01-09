let boardSize = 3;
let board = [];
let currentPlayer = "X";
let gameActive = true;
let botEnabled = false;
let xScore = 0;
let oScore = 0;

const boardEl = document.getElementById("board");
const turnText = document.getElementById("turnText");

/* POPUP ELEMENTS */
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const playAgainBtn = document.getElementById("playAgain");

/* SOUNDS */
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const drawSound = document.getElementById("drawSound");
const clickSound = document.getElementById("clickSound");

function stopAllSounds() {
  winSound.pause(); winSound.currentTime = 0;
  loseSound.pause(); loseSound.currentTime = 0;
  drawSound.pause(); drawSound.currentTime = 0;
}

function initBoard() {
  board = Array(boardSize * boardSize).fill("");
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${boardSize}, 80px)`;
  currentPlayer = "X";
  gameActive = true;
  turnText.innerText = "Player X Turn";
  popup.classList.add("hidden");

  board.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => makeMove(index);
    boardEl.appendChild(cell);
  });
}

function makeMove(index) {
  if (!gameActive || board[index]) return;

  clickSound.currentTime = 0;
  clickSound.play();

  board[index] = currentPlayer;
  boardEl.children[index].innerText = currentPlayer;

  if (checkWin()) {
    gameActive = false;
    currentPlayer === "X" ? xScore++ : oScore++;
    updateScore();

    stopAllSounds();

    if (botEnabled && currentPlayer === "O") {
      loseSound.play();
      showPopup("😢 You Lost!");
    } else {
      winSound.play();
      showPopup(`🎉 Player ${currentPlayer} Wins!`);
    }
    return;
  }

  if (!board.includes("")) {
    gameActive = false;
    stopAllSounds();
    drawSound.play();
    showPopup("🤝 It's a Draw!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnText.innerText = `Player ${currentPlayer} Turn`;

  if (botEnabled && currentPlayer === "O") {
    setTimeout(botMove, 400);
  }
}

function botMove() {
  const empty = board
    .map((v, i) => v === "" ? i : null)
    .filter(v => v !== null);

  const randomIndex = empty[Math.floor(Math.random() * empty.length)];
  makeMove(randomIndex);
}

function checkWin() {
  const win = 3;
  const lines = [];

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c <= boardSize - win; c++) {
      lines.push([...Array(win)].map((_, i) => board[r * boardSize + c + i]));
    }
  }

  for (let c = 0; c < boardSize; c++) {
    for (let r = 0; r <= boardSize - win; r++) {
      lines.push([...Array(win)].map((_, i) => board[(r + i) * boardSize + c]));
    }
  }

  for (let r = 0; r <= boardSize - win; r++) {
    for (let c = 0; c <= boardSize - win; c++) {
      lines.push([...Array(win)].map((_, i) => board[(r + i) * boardSize + c + i]));
      lines.push([...Array(win)].map((_, i) => board[(r + win - 1 - i) * boardSize + c + i]));
    }
  }

  return lines.some(line => line.every(v => v === currentPlayer));
}

function updateScore() {
  document.getElementById("xScore").innerText = xScore;
  document.getElementById("oScore").innerText = oScore;
}

function showPopup(message) {
  popupText.innerText = message;
  popup.classList.remove("hidden");
}

/* BUTTON EVENTS */
playAgainBtn.onclick = initBoard;

document.getElementById("resetGame").onclick = initBoard;

document.getElementById("botMode").onclick = () => {
  botEnabled = true;
  setActive("botMode", "sameDevice");
  initBoard();
};

document.getElementById("sameDevice").onclick = () => {
  botEnabled = false;
  setActive("sameDevice", "botMode");
  initBoard();
};

document.getElementById("size3").onclick = () => {
  boardSize = 3;
  setActive("size3", "size5");
  initBoard();
};

document.getElementById("size5").onclick = () => {
  boardSize = 5;
  setActive("size5", "size3");
  initBoard();
};

function setActive(a, b) {
  document.getElementById(a).classList.add("active");
  document.getElementById(b).classList.remove("active");
}

/* START GAME */
initBoard();
