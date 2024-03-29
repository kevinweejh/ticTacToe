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

// Module for displaying DOM elements
const displayController = () => {
    const board = gameboard.getBoard();

    const btnList = document.querySelectorAll('[data-pos]');

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

// Module for controlling game logic
const gameController = (() => {
    let players, currentPlayer; 
    const initializePlayers = () => {
        players = [
            { name: prompt("Insert Player 1's name:"), token: 'X' }, 
            { name: prompt("Insert Player 2's name:"), token: 'O' }
        ]

        document.getElementById('playerOneName').innerText = players[0].name;
        document.getElementById('playerTwoName').innerText = players[1].name;

        return players;
    };

    const dialog = document.getElementById('welcomeDialog');
    dialog.addEventListener('submit', () => {
        players = initializePlayers();
        currentPlayer = players[0];
        updateWhoseTurn();
    })

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        updateWhoseTurn();
    };

    const display = displayController();
    const placeMark = (position) => {
        const board = gameboard.getBoard();

        if (board[position] === null) {
            board[position] = currentPlayer.token;
            display.updateScreen();
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
            const getNameFromToken = (players, token) => {
                const winner = players.find((player) => player.token === token);
                return winner ? winner.name : null;
            }

            if ((board[a] === board[b]) && (board[a] === board[c]) && board[a]) {
                return getNameFromToken(players, board[a]);
            }
        }
        return null;
    }

    const btnList = document.querySelectorAll('[data-pos]');

    for (let btn of btnList) {
        btn.addEventListener("click", () => {
            makeMove(btn.dataset.pos);
        })
    }

    const makeMove = (position) => {
        console.log(`${currentPlayer.name} (${currentPlayer.token}) is playing at position ${position}`);
        
        if (placeMark(position)) {
            const winner = checkWinCondition();
            
            if (winner) {
                console.log(`Game Over. ${winner} wins!`);
                const winnerDisplay = document.getElementById('winnerDisplay');
                winnerDisplay.innerText = `Game Over. ${winner} wins!`;
                const dialog = document.querySelector("#gameEnd")
                dialog.show();
                setTimeout(() => dialog.close(), 3000);
                setTimeout(resetGame, 3000);
            } else {
                switchPlayer();
                gameboard.printBoard();
            }
        }
    };

    const resetGame = () => {
        gameboard.getBoard().fill(null);
        display.updateScreen();
        players = initializePlayers();
        currentPlayer = players[0];
        updateWhoseTurn();
    }

    const updateWhoseTurn = () => {
        const instruction = document.getElementById('whoseTurn');
        instruction.innerText = `${currentPlayer.name}'s turn.`;
        console.log(`${currentPlayer.name}'s turn.`);
    }

    return { makeMove, resetGame, updateWhoseTurn };
})();
