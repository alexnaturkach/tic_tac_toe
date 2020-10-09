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


  const checkForWinner = () => {
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

    const checker = (arr, winCon) => {
      for (i = 0; i < winCon.length; i++) {
        if (winCon[i].every(item => arr.includes(item))) {
          console.log(`The winner is ${game.getTurn().getName()}`);
          winCon[i].forEach(element => boardNodes[element].style.filter = "invert(1) brightness(50%) sepia(100%) saturate(2005%) hue-rotate(120deg)");
          game.getTurn().incrementScore();
          game.setWinner();
          game.announceWinner();
          game.stopGame();
          game.updateScore();
          x_OnBoard = [];
          o_OnBoard = [];
        } else if (!(winCon[i].every(item => arr.includes(item))) & !gameBoard.includes(0)) {
          game.announceDraw();
          game.announceWinner();
          x_OnBoard = [];
          o_OnBoard = [];
          return;
        }
      }
    }
    checker(x_OnBoard, winConditions);
    checker(o_OnBoard, winConditions);

  }

  const move = (target) => {
    if (gameBoard[target] === 0 & !game.isGameStopped()) {
      gameBoard[target] = game.getTurn().getWeapon();
      boardNodes[target].classList.add(game.getTurn().getWeapon());
      console.log(gameBoard);
      checkForWinner();
      if (game.getTurn() === player1) {
        game.setTurn(player2);
      } else {
        game.setTurn(player1);
      }
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
    console.log(gameBoard);
  }
  return {
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

//dummy players
const player1 = player('p1', 'x');
const player2 = player('p2', 'o');

//rename players for PVP
function createPlayers(){
  const p1 = document.getElementById('p1_name').value;
  const p2 = document.getElementById('p2_name').value;
player1.setName(p1);
player2.setName(p2);
document.getElementById('overlay').style.display = "none";
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
    console.log(`It's ${playerTurn.getName()}'s turn`);
  }
  const updateScore = () => {
    score1.innerText = player1.getScore();
    score2.innerText = player2.getScore();
  }
  const stopGame = () => gameStop = true;
  const continueGame = () => gameStop = false;
  const isGameStopped = () => gameStop;
  const setWinner = () => {
    winner.innerText = `${game.getTurn().getName()} won!`
  };
  const announceWinner = () => {
    announcer.style.display = "block";
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
  }
  return {
    getTurn,
    setTurn,
    updateScore,
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
