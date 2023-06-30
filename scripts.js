"use strict";

const boardSize = 3;

// Game Logic
const Gameboard = (() => {
  // Players
  const PlayerOne = (name) => {
    return { name, mark: "O" };
  };
  const PlayerTwo = (name) => {
    return { name, mark: "X" };
  };

  const p1 = PlayerOne("jane");
  const p2 = PlayerTwo("tim");

  // Gameboard shenanigans
  const gameboard = (() => {
    const arr = [];

    for (let i = 0; i < boardSize; i++) {
      const temp = [];
      for (let j = 0; j < boardSize; j++) {
        temp.push("");
      }
      arr.push(temp);
    }

    return arr;
  })();

  const addMark = (mark, location) => {
    // Ex. of location: [1, 2]
    const [row, col] = location;
    if (!gameboard[row][col]) gameboard[row][col] = mark;
  };

  const isGameOver = () => {
    // The logic below will either return a winner or 'tie'

    // Check for across
    for (let i = 0; i < boardSize; i++) {
      if (
        gameboard[i][0] === gameboard[i][1] &&
        gameboard[i][1] === gameboard[i][2]
      ) {
        const output = gameboard[i][0];
        if (output) return output;
      }
    }
    // Check for straights
    for (let i = 0; i < boardSize; i++) {
      if (
        gameboard[0][i] === gameboard[1][i] &&
        gameboard[1][i] === gameboard[2][i]
      ) {
        const output = gameboard[0][i];
        if (output) return output;
      }
    }

    // Check for diagonals
    if (
      (gameboard[0][0] === gameboard[1][1] &&
        gameboard[1][1] === gameboard[2][2]) ||
      (gameboard[0][2] === gameboard[1][1] &&
        gameboard[1][1] === gameboard[2][0])
    ) {
      const output = gameboard[1][1];
      if (output) return output;
    }

    // Check for tie
    // let tie = false;
    for (let i = 0; i < boardSize; i++) {
      if (gameboard[i].includes("")) return 1;
    }

    // return gameStatus;
    return "tie";
  };

  return {
    gameboard,
    addMark,
    isGameOver,
    p1,
    p2,
  };
})();

const indexTable = (() => {
  const tbodyEl = document.getElementById("gameboard-table").firstElementChild;
  console.log(tbodyEl);
  for (let i = 0; i < boardSize; i++) {
    const currentRow = tbodyEl.children[i];
    currentRow.setAttribute("data-row", i);
    for (let j = 0; j < boardSize; j++) {
      const currentTD = currentRow.children[j];
      currentTD.setAttribute("data-col", j);
    }
  }
})();

// the real DOM shit
const startBtn = document.getElementById("button--start");
let isGame = true;

startBtn.addEventListener("click", function () {
  if (isGame) {
    const boxes = document.querySelectorAll("td");
    const p1Indicator = document.getElementById("indicator--p1");
    const p2Indicator = document.getElementById("indicator--p2");
    const winnerIndicator = document.getElementById("indicator--winner");

    let isGame = false;
    let activePlayer = 1;

    const init = (() => {
      activePlayer = 1;
      p1Indicator.classList.toggle("player--active");
    })();

    const switchPlayer = function () {
      activePlayer = activePlayer == 1 ? 2 : 1;
      p1Indicator.classList.toggle("player--active");
      p2Indicator.classList.toggle("player--active");
    };

    for (let i = 0; i < boxes.length; i++) {
      boxes[i].addEventListener("click", function (event) {
        const row = event.target.closest("tr").getAttribute("data-row");
        const col = boxes[i].getAttribute("data-col");
        if (!boxes[i].innerHTML) {
          if (activePlayer === 1) {
            Gameboard.addMark(Gameboard.p1.mark, [row, col]);
            boxes[i].innerHTML = Gameboard.p1.mark;
          } else if (activePlayer === 2) {
            Gameboard.addMark(Gameboard.p2.mark, [row, col]);
            boxes[i].innerHTML = Gameboard.p2.mark;
          }

          if (Gameboard.isGameOver() === Gameboard.p1.mark)
            winnerIndicator.innerHTML = `Congrats, ${Gameboard.p1.name}!`;
          else if (Gameboard.isGameOver() === Gameboard.p2.mark)
            winnerIndicator.innerHTML = `Congrats, ${Gameboard.p2.name}!`;
          switchPlayer();
        }
      });
    }
  }
});
