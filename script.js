//>>gameboard Object<<
//gameboard array
const gameboard = (() => {
  let gameBoard = [0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ];
  //collect all cell nodes into an array
  const boardNodes = document.getElementsByClassName('cell');
  //click to move event
  const clickToMove = (e) => {
    move(Array.prototype.indexOf.call(boardNodes, e.target));
  }
  //add a click listener for move - global
  const addClicks = () => {
    for (let item of boardNodes) {
      item.addEventListener('click', clickToMove);
    }
  }
  //remove listeners to prevent moves when AI is making his move - global
  const removeClicks = () => {
    for (let item of boardNodes) {
      item.removeEventListener('click', clickToMove);
    }
  }
  // add click listeners by default
  addClicks();
  //collection of winning index combinations
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
  //check for a winner -- Universal function
  const checkForWinner = () => {
    //arrays to store X and O indices
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
    //check if there is a winning combination in any of the X or O arrays
    const checker = (arr, arr2, winCon) => {
      for (i = 0; i < winCon.length; i++) {
        if (winCon[i].every(item => arr.includes(item))) {
          winCon[i].forEach(element => boardNodes[element].style.filter = "invert(1) brightness(50%) sepia(100%) saturate(2005%) hue-rotate(120deg)");
          player1.incrementScore();
          game.setWinner();
          game.announceWinner();
          game.stopGame();
          game.updateScore();
        } else if (winCon[i].every(item => arr2.includes(item))) {
          winCon[i].forEach(element => boardNodes[element].style.filter = "invert(1) brightness(50%) sepia(100%) saturate(2005%) hue-rotate(120deg)");
          player2.incrementScore();
          game.setWinner();
          game.announceWinner();
          game.stopGame();
          game.updateScore();
        } else if (!(winCon[i].every(item => arr.includes(item))) & !gameBoard.includes(0)) {
          game.announceDraw();
          game.announceWinner();
        }
      }
    }
    checker(x_OnBoard, o_OnBoard, winConditions);
  }
  //>> Support for minimax function << light winner checker
  const checkWin = () => {
    let winner = null;
    let openCells = 0;
    let x_OnBoard = [];
    let o_OnBoard = [];
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
          winner = 'o';
        }
      }
    }
    checker(x_OnBoard, o_OnBoard, winConditions);
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === 0) {
        openCells++;
      }
    }
    if (winner == null & openCells == 0) {
      return 'tie';
    } else {
      return winner;
    }
  }
  //move function
  const move = (target) => {
    if (gameBoard[target] === 0 & !game.isGameStopped()) {
      gameBoard[target] = game.getTurn().getWeapon();
      boardNodes[target].classList.add(game.getTurn().getWeapon());
      checkForWinner();
      if (game.getTurn() === player1) {
        game.setTurn(player2);
      } else {
        game.setTurn(player1);
      }
      if (game.getGameMode() === 'PvsHardAI' & gameBoard.includes(0) & !game.isGameStopped()) {
        removeClicks();
        setTimeout(bestMove, 1000);
      } else if (game.getGameMode() === 'PvsEasyAI' & gameBoard.includes(0) & !game.isGameStopped()) {
        removeClicks();
        setTimeout(randomAiMove, 1000);
      }
    }
  }
  //generate random integer
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  const randomAiMove = () => {
    let emptyCells = [];
    for (i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === 0) {
        emptyCells.push(i);
      }
    }
    randomMove = emptyCells[getRandomInt(0, emptyCells.length)];
    gameBoard[randomMove] = player2.getWeapon();
    boardNodes[randomMove].classList.add(player2.getWeapon());
    checkForWinner();
    game.setTurn(player1);
    addClicks();
  }

  function bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let goodMove;
    for (let i = 0; i < 9; i++) {
      // Is the spot available?
      if (gameBoard[i] === 0) {
        gameBoard[i] = player2.getWeapon();
        let score = minimax(gameBoard, 0, false);
        gameBoard[i] = 0;
        if (score > bestScore) {
          bestScore = score;
          goodMove = i;
        }
      }
    }
    gameBoard[goodMove] = player2.getWeapon();
    boardNodes[goodMove].classList.add(player2.getWeapon());
    checkForWinner();
    game.setTurn(player1);
    addClicks();
  }

  let scores = {
    x: -10,
    o: 10,
    tie: 0
  };

  function minimax(board, depth, isMaximizing) {
    let result = checkWin();
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        // Is the spot available?
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
      for (let i = 0; i < 9; i++) {
        // Is the spot available?
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
    addClicks,
    removeClicks,
    move,
    resetBoard,
    checkForWinner,
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

//default players
const player1 = player('p1', 'x');
const player2 = player('p2', 'o');

//rename players for PVP and start a PvP game
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
  game.setGameMode('');
  game.resetGameScore();
  document.getElementById('p1name').innerText = player1.getName();
  document.getElementById('p2name').innerText = player2.getName();
}

//start a game vs Easy AI
function startVsEasyAI() {
  game.resetGameScore();
  game.setGameMode('PvsEasyAI');
}

//start a game vs Unbeatable AI
function startVsHardAI() {
  game.resetGameScore();
  game.setGameMode('PvsHardAI');
}

//game master module
const game = (() => {
  let gameMode;
  const setGameMode = (mode) => gameMode = mode;
  const getGameMode = () => gameMode;
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
    console.log(`It's ${playerTurn.getName()}'s turn`);
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
    let id = window.setTimeout(function() {}, 0);
    while (id--) {
      window.clearTimeout(id); // will do nothing if no timeout with id is present
    }
    setTurn(player1);
    gameboard.resetBoard();
    continueGame();
    clearWinner();
    clearAnnouncer();
    gameboard.addClicks();
    document.getElementById('resetBoardButton').style.visibility = 'visible';
  }
  return {
    setGameMode,
    getGameMode,
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

function showAiModes() {
  document.querySelector('#easyAI').classList.toggle('active');
  document.querySelector('#hardAI').classList.toggle('active');
}

function toggleOverlay() {
  document.getElementById('overlay').classList.toggle('hidden');
}


document.getElementById('resetBoardButton').addEventListener('mousedown', (e) => {
  e.target.classList.add('clickedReset');
})

document.addEventListener('mouseup', (e) => {
  if (e.target === document.getElementById('resetBoardButton')) {
    game.newRound();
    e.target.classList.remove('clickedReset');
  } else {
    document.getElementById('resetBoardButton').classList.remove('clickedReset');
  }
})
