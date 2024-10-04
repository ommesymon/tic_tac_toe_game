const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

// Winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to handle cell clicks
function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.getAttribute("data-index"));

    if (board[cellIndex] !== "" || !gameActive) {
        return;
    }

    updateCell(cell, cellIndex);
    checkResult();

    if (gameActive) {
        setTimeout(computerMove, 500); // AI plays after 0.5 seconds
    }
}

// Function to update the cell and the board
function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

// Function to check the game's result
function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];

        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a tie!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// Function to reset the game
function resetGame() {
    currentPlayer = "X";
    gameActive = true;
    board = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `Player X's turn`;
    cells.forEach(cell => {
        cell.textContent = "";
    });
}

// Improved AI with Minimax Algorithm
function computerMove() {
    if (currentPlayer === "O" && gameActive) {
        const bestMove = minimax(board, "O").index;
        const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
        updateCell(cell, bestMove);
        checkResult();
    }
}

// Minimax Algorithm for Unbeatable AI
function minimax(newBoard, player) {
    const emptyCells = newBoard.map((val, idx) => (val === "" ? idx : null)).filter(val => val !== null);

    // Check for terminal states
    const winner = checkWin(newBoard);
    if (winner === "X") return { score: -10 };  // Player X wins
    if (winner === "O") return { score: 10 };   // AI wins
    if (emptyCells.length === 0) return { score: 0 };  // Draw

    // Array to store all the move objects
    const moves = [];

    // Loop through empty cells
    for (let i = 0; i < emptyCells.length; i++) {
        const move = {};
        move.index = emptyCells[i];

        // Make the move for the current player
        newBoard[emptyCells[i]] = player;

        // Recursively call minimax for the next turn
        if (player === "O") {
            move.score = minimax(newBoard, "X").score;
        } else {
            move.score = minimax(newBoard, "O").score;
        }

        // Reset the spot after trying the move
        newBoard[emptyCells[i]] = "";

        moves.push(move);
    }

    // Pick the best move
    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
}

// Check for a win or terminal state
function checkWin(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Event Listeners
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
