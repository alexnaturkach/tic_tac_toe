//gameboard Object
const gameboard = (() => {
  let gameBoard = [0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ];

  const boardNodes = document.getElementsByClassName('cell');

  for (let item of boardNodes) {
    item.addEventListener('click', (e) => {
      move(Array.prototype.indexOf.call(boardNodes, e.target));
    })
  }


  // const checkForWinner = () => {
  //   const winConditions = [
  //     //rows
  //     [0, 1, 2],
  //     [3, 4, 5],
  //     [6, 7, 8],
  //     //columns
  //     [0, 3, 6],
  //     [1, 4, 7],
  //     [2, 5, 8],
  //     //diagonals
  //     [0, 4, 8],
  //     [2, 4, 6]
  //   ];
  //
  //   let x_OnBoard = [];
  //   let o_OnBoard = [];
  //   //sort X and O indices to corresponding arrays
  //   for (i = 0; i < gameBoard.length; i++) {
  //     if (gameBoard[i] === player1.getWeapon()) {
  //       x_OnBoard.push(i);
  //     } else if (gameBoard[i] === player2.getWeapon()) {
  //       o_OnBoard.push(i);
  //     }
  //   }
  //
  //   const checker = (arr, winCon) => {
  //     for (i = 0; i < winCon.length; i++) {
  //       if (winCon[i].every(item => arr.includes(item))) {
  //
  //         winCon[i].forEach(element => boardNodes[element].style.filter = "invert(1) brightness(50%) sepia(100%) saturate(2005%) hue-rotate(120deg)");
  //         game.getTurn().incrementScore();
  //         game.setWinner();
  //         game.announceWinner();
  //         game.stopGame();
  //         game.updateScore();
  //         x_OnBoard = [];
  //         o_OnBoard = [];
  //         return;
  //       } else if (!(winCon[i].every(item => arr.includes(item))) & !gameBoard.includes(0)) {
  //         game.announceDraw();
  //         game.announceWinner();
  //       }
  //     }
  //   }
  //   checker(o_OnBoard, winConditions);
  //   checker(x_OnBoard, winConditions);
  // }

  const checkWinner = () => {
    let winner = null;
    const winConditions = [
      //rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      //columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      //diagonals
      [0, 4, 8],
      [2, 4, 6]
    ];

    let x_OnBoard = [];
    let o_OnBoard = [];
    //sort X and O indices to corresponding arrays
    for (i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === player1.getWeapon()) {
        x_OnBoard.push(i);
      } else if (gameBoard[i] === player2.getWeapon()) {
        o_OnBoard.push(i);
      }
    }

    const checker = (arr, arr2, winCon) => {
      for (i = 0; i < winCon.length; i++) {
        if (winCon[i].every(item => arr.includes(item))) {

          winner = player1.getWeapon();
        } else if (winCon[i].every(item => arr2.includes(item))) {
          winner = player2.getWeapon();
        }
      }
    }
    checker(x_OnBoard, o_OnBoard, winConditions);
    if (winner !== null) {
      return winner;
    } else if (!gameBoard.includes(0) & winner === null) {
      return 'tie';
    } else {
      return winner;
    }
  }

  const emptyCells = gameBoard.filter(cell => cell === 0);

  function bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let bestMove;
    for (i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === 0) {
        gameBoard[i] = player2.getWeapon();
        let score = minimax(gameBoard, 0, false);
        gameBoard[i] = 0;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    console.log(bestMove);
    gameBoard[bestMove] = player2.getWeapon();
    game.setTurn(player1);
    boardNodes[bestMove].classList.add(player2.getWeapon());
  }

  let scores = {
    x: -10,
    o: 10,
    tie: 0
  };

  function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === 0) {
          gameBoard[i] = player2.getWeapon();
          let score = minimax(gameBoard, depth + 1, false);
          gameBoard[i] = 0;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === 0) {
          gameBoard[i] = player1.getWeapon();
          let score = minimax(gameBoard, depth + 1, true);
          gameBoard[i] = 0;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }


  const move = (target) => {
    if (gameBoard[target] === 0 & !game.isGameStopped()) {
      gameBoard[target] = game.getTurn().getWeapon();
      boardNodes[target].classList.add(game.getTurn().getWeapon());
      // checkForWinner();
      if (game.getTurn() === player1) {
        game.setTurn(player2);
      } else {
        game.setTurn(player1);
      }
    }
    bestMove();
    console.log(checkWinner());
  }

  const resetBoard = () => {
    for (i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] !== 0) {
        gameBoard[i] = 0;
        boardNodes[i].classList.remove("x", "o");
      }
      boardNodes[i].style.filter = "none";
    }

  }
  return {
    move,
    resetBoard,
    // checkForWinner,
  };
})();

//player factory
const player = (name, weapon) => {

  let score = 0;
  const getName = () => name;
  const setName = (newName) => name = newName;
  const getWeapon = () => weapon;
  const resetScore = () => {
    score = 0;
  }
  const incrementScore = () => score++;
  const getScore = () => score;

  return {
    getName,
    setName,
    getWeapon,
    incrementScore,
    resetScore,
    getScore,
  }
}

//dummy players
const player1 = player('p1', 'x');
const player2 = player('p2', 'o');

//rename players for PVP
function createPlayers() {
  const p1 = document.getElementById('p1_name').value;
  const p2 = document.getElementById('p2_name').value;
  if (p1 === '' & p2 === '') {
    player1.setName('Player 1');
    player2.setName('Player 2');
  } else {
    player1.setName(p1);
    player2.setName(p2);
  }
  game.resetGameScore();
  document.getElementById('p1name').innerText = player1.getName();
  document.getElementById('p2name').innerText = player2.getName();
}


//game master module
const game = (() => {
  const score1 = document.getElementById('score1');
  const score2 = document.getElementById('score2');
  const winner = document.getElementById('winner');
  const announcer = document.getElementById('announcer');
  let gameStop = false;
  let playerTurn = player1;
  gameboard.resetBoard();
  const getTurn = () => playerTurn;
  const setTurn = (player) => {
    playerTurn = player;

  }

  const updateScore = () => {
    score1.innerText = player1.getScore();
    score2.innerText = player2.getScore();
  }
  const resetGameScore = () => {
    document.getElementById('burger').classList.toggle('is-active');
    player1.resetScore();
    player2.resetScore();
    toggleOverlay();
    updateScore();
    newRound();
  }
  const stopGame = () => gameStop = true;
  const continueGame = () => gameStop = false;
  const isGameStopped = () => gameStop;
  const setWinner = () => {
    winner.innerText = `${game.getTurn().getName()} won!`
  };
  const announceWinner = () => {
    announcer.style.display = "block";
    document.getElementById('resetBoardButton').style.visibility = 'hidden';
  }
  const clearWinner = () => {
    winner.innerText = ""
  }
  const announceDraw = () => {
    winner.innerText = "It's a draw!"
  }
  const clearAnnouncer = () => {
    announcer.style.display = "none"
  };

  const newRound = () => {
    setTurn(player1);
    gameboard.resetBoard();
    continueGame();
    clearWinner();
    clearAnnouncer();
    document.getElementById('resetBoardButton').style.visibility = 'visible';
  }
  return {
    getTurn,
    setTurn,
    updateScore,
    resetGameScore,
    setWinner,
    announceWinner,
    announceDraw,
    clearWinner,
    clearAnnouncer,
    stopGame,
    continueGame,
    isGameStopped,
    newRound,
  }
})();


//events
function showNameInputs() {
  document.querySelector('#namesForm').classList.toggle('active');
}

function toggleOverlay() {
  document.getElementById('overlay').classList.toggle('hidden');
}


document.getElementById('resetBoardButton').addEventListener('mousedown', (e) => {
  e.target.classList.add('clickedReset');
})

document.addEventListener('mouseup', (e) => {
  if (e.target === document.getElementById('resetBoardButton')) {
    gameboard.resetBoard();
    e.target.classList.remove('clickedReset');
  } else {
    document.getElementById('resetBoardButton').classList.remove('clickedReset');
  }
})
