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

// Module for initializing players
const initializePlayers = (callback) => {
    const dialog = document.querySelector("dialog");

    dialog.show();

    dialog.addEventListener('submit', (e) => {
        e.preventDefault();
        const players = [
            { name: document.getElementById('nameInput1').value, token: 'X' },
            { name: document.getElementById('nameInput2').value, token: 'O' }
        ];
        document.getElementById('playerOneName').innerText = players[0].name;
        document.getElementById('playerTwoName').innerText = players[1].name;
        dialog.close();

        callback(players);
    });
}

// Module for controlling game logic
const gameController = () => {

    let players, currentPlayer;

    initializePlayers((initializedPlayers) => {
        players = initializedPlayers;
        currentPlayer = players[0];
        console.log(`${currentPlayer.name}'s turn.`);
        gameboard.printBoard();
    })

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const placeMark = (position) => {
        const board = gameboard.getBoard();
        if (board[position] === null) {
            board[position] = currentPlayer.token;
            displayController().updateScreen();
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
                setTimeout(resetGame, 5000);
            } else {
                switchPlayer();
                console.log(`${currentPlayer.name}'s turn.`);
                gameboard.printBoard();
            }
        }
    };

    const resetGame = () => {
        gameboard.getBoard().fill(null);
        initializePlayers((initializedPlayers) => {
            players = initializedPlayers;
            currentPlayer = players[0];
            console.log(`${currentPlayer.name}'s turn.`);
            gameboard.printBoard();
            displayController().updateScreen();
        })
    }

    // Initial game start
    // console.log(`${currentPlayer.name}'s turn.`);
    gameboard.printBoard();

    return { makeMove, resetGame };
};

// Module for displaying DOM elements
const displayController = () => {
    const board = gameboard.getBoard();
    
    const btnList = document.querySelectorAll('[data-pos]');
    console.log('btnList:', btnList);

    const createImgElement = (src) => {
        const img = document.createElement("img");
        img.src = src;
        img.style = "width: 75%; margin: auto";
        return img;
    }

    const updateScreen = () => {
        let pos = 0;
        for (let token of board) {
            console.log(`pos ${pos}: token ${token}`)
            switch (token) {
                case 'X':
                    btnList[pos].hasChildNodes() ? null : btnList[pos].appendChild(createImgElement("src/x.png"));
                    break;
                case 'O':
                    btnList[pos].hasChildNodes() ? null : btnList[pos].appendChild(createImgElement("src/o.png"));
                    break;
                case null:
                    btnList[pos].innerHTML = "";
                    break;
            }
            pos++;
        }
    }

    return { updateScreen }
}

const game = gameController();