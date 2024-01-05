// Module for managing gameboard
const gameboard = (() => {
    const SIZE = 9;
    const board = Array(SIZE).fill(null);    

    const printBoard = () => {
        for (let i = 0; i < SIZE; i += 3) {
            console.log(`${board[i] || '-'} ${board[i + 1] || '-'} ${board[i + 2] || '-'}`)
        }
    }

    return { 
        getBoard: () => board, 
        printBoard 
    };
})();

// Module for controlling game logic
const gameController = (function () {
    const initialisePlayers = () => {
        let playerOneName = prompt("Insert Player 1's Name");
        let playerTwoName = prompt("Insert Player 2's Name");
        
        const players = [
            {
                name: playerOneName,
                token: 1
            }, 
            {
                name: playerTwoName,
                token: 2
            }, 
        ]; 

        return players;
    }

    let players = initialisePlayers();
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printWhoseTurn = () => {
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const placeMark = (position, token) => {
        const board = gameboard.getBoard();
        if (!board[position]) {
            board[position] = token;
            return { success: true };
        } 
        console.warn(`Position ${position} is already taken, please choose another one.`);
        return { success: false };
    }

    const makeMove = (position) => {

        console.log(`${getActivePlayer().name} is playing ${getActivePlayer().token} in position ${position}`);
        const validMove = placeMark(position, getActivePlayer().token);

        const gameState = checkWinCondition(); 
        console.log('gameState:', gameState);

        if (gameState.over) {
            console.log(`Game End. ${gameState.winningToken} is the winningToken.`);
            gameEnding();
        } else {
            if (validMove.success) {
                switchPlayerTurn();
                printWhoseTurn();
                gameboard.printBoard();
            } else {
                printWhoseTurn();
                gameboard.printBoard();
            }
        }
    }

    const checkWinCondition = () => {
        const boardArray = gameboard.getBoard();
        const winConditionsArray = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5 ,8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        for (let trio of winConditionsArray) {
            let winningToken;
            winningToken = (boardArray[trio[0]] == boardArray[trio[1]]) && (boardArray[trio[0]] == boardArray[trio[2]]) ? boardArray[trio[0]] : null;
            
            if (winningToken) {
                return { over: true, winningToken };
            } 
        }

        return { over: false };
    }

    const gameEnding = () => {
        const boardArray = gameboard.getBoard();
        
        // Reset board and prompt for new player names
        boardArray.fill(0);
        players = initialisePlayers();
        activePlayer = players[0];
    }

    const restartGame = () => {
        gameEnding();
    }

    printWhoseTurn(); // Initial instructions

    return { getActivePlayer, makeMove, restartGame };
})();





