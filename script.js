//gameboard Object
const gameboard = (() => {
  let gameBoard = [0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ];

  const boardNodes = document.getElementsByClassName('cell');

  console.log(boardNodes);
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
        }
        else if (!(winCon[i].every(item => arr.includes(item))) & !gameBoard.includes(0)){
          console.log("Draw");
          return;
        }
      }
    }
    checker(x_OnBoard, winConditions);
    checker(o_OnBoard, winConditions);
    x_OnBoard = [];
    o_OnBoard = [];
  }

  const move = (target) => {
    if (gameBoard[target] === 0) {
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
      }
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
  const getWeapon = () => weapon;
  const resetScore = () => {
    score = 0;
  }
  const incrementScore = () => {
    score++;
  }
  const getScore = () => {
    score
  }

  return {
    getName,
    getWeapon,
    incrementScore,
    resetScore,
    getScore,
  }
}
//dummy players
const player1 = player('Alex', 'x');
const player2 = player('Dog', 'o');

//game master function
const game = (() => {
  let playerTurn = player1;
  gameboard.resetBoard();
  console.log(`It's ${playerTurn.getName()}'s turn`);
  const getTurn = () => playerTurn;
  const setTurn = (player) => {
    playerTurn = player;
    console.log(`It's ${playerTurn.getName()}'s turn`);
  }
  return {
    getTurn,
    setTurn,
  }
})();

const newGame = () => {
  gameboard.resetBoard();
}
