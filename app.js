let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

// New Elements
let turnText = document.querySelector("#turn-text");
let turnDot = document.querySelector("#turn-dot");
let scoreXEl = document.getElementById("score-x");
let scoreOEl = document.getElementById("score-o");
let scoreDrawEl = document.getElementById("score-draw");

let turnO = false; // Start with X (standard rules)
let count = 0; // To Track Draw
let gameActive = true;

let scores = { x: 0, o: 0, draw: 0 };

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const updateTurnIndicator = () => {
  if (turnO) {
    turnText.innerText = "Player O's Turn";
    turnDot.style.backgroundColor = "var(--accent-o)";
  } else {
    turnText.innerText = "Player X's Turn";
    turnDot.style.backgroundColor = "var(--accent-x)";
  }
};

const updateScoreboard = () => {
  scoreXEl.innerText = scores.x;
  scoreOEl.innerText = scores.o;
  scoreDrawEl.innerText = scores.draw;
};

const resetGame = () => {
  turnO = false;
  count = 0;
  gameActive = true;
  enableBoxes();
  msgContainer.classList.remove("show");
  msgContainer.classList.add("hide");
  updateTurnIndicator();
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!gameActive) return;

    if (turnO) {
      // Player O
      box.innerText = "O";
      box.classList.add("o");
      turnO = false;
    } else {
      // Player X
      box.innerText = "X";
      box.classList.add("x");
      turnO = true;
    }
    box.disabled = true;
    count++;
    updateTurnIndicator();

    let winningPattern = checkWinner();

    if (winningPattern) {
        // We found a winner
        let winner = boxes[winningPattern[0]].innerText;
        handleWin(winner, winningPattern);
    } else if (count === 9) {
        gameDraw();
    }
  });
});

const handleWin = (winner, pattern) => {
    gameActive = false;
    
    // Highlight winning cells
    pattern.forEach(index => {
        boxes[index].classList.add("win");
    });

    // Update Score
    if(winner === "X") scores.x++;
    else scores.o++;
    updateScoreboard();

    showWinner(winner);
};

const gameDraw = () => {
  scores.draw++;
  updateScoreboard();
  msg.innerText = `It's a Draw! 🤝`;
  msgContainer.classList.remove("hide");
  msgContainer.classList.add("show");
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
    // Remove old classes
    box.classList.remove("x", "o", "win");
  }
};

const showWinner = (winner) => {
  msg.innerText = `🎉 Player ${winner} Wins!`;
  // Small delay so users can see the winning line animation before the modal
  setTimeout(() => {
    msgContainer.classList.remove("hide");
    msgContainer.classList.add("show");
  }, 800);
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        return pattern; // Return the winning pattern indices
      }
    }
  }
  return null;
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// Initialize
updateTurnIndicator();