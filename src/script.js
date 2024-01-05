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
const gameController = (() => {
    const initializePlayers = () => [
        { name: prompt("Insert Player 1's Name"), token: 'X'},
        { name: prompt("Insert Player 2's Name"), token: 'O'},
    ];

    let players = initializePlayers();
    let currentPlayer = players[0];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const placeMark = (position) => {
        const board = gameboard.getBoard();
        if (board[position] === null) {
            board[position] = currentPlayer.token;
            return true;
        } 
        console.warn(`Position ${position} is already taken, please choose another one.`);
        return false;
    }

    const checkWinCondition = () => {
        const board = gameboard.getBoard();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5 ,8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const [a, b, c] of winConditions) {
            if ((board[a] === board[b]) && (board[a] === board[c])) {
                return board[a];
            }
        }
            
        return null;
    }

    const makeMove = (position) => {
        console.log(`${currentPlayer.name} (${currentPlayer.token}) is playing at position ${position}`);
        
        if (placeMark(position)) {
            const winner = checkWinCondition();
            if (winner) {
                console.log(`Game Over. ${winner} wins!`);
                resetGame();
            } else {
                switchPlayer();
                console.log(`${currentPlayer.name}'s turn.`);
                gameboard.printBoard();
            }
        }
    };

    const resetGame = () => {
        gameboard.getBoard().fill(null);
        players = initializePlayers();
        currentPlayer = players[0];
        console.log(`${currentPlayer.name}'s turn.`);
    }

    // Initial game start
    console.log(`${currentPlayer.name}'s turn.`);
    gameboard.printBoard();

    return { makeMove, resetGame };
})();





