// --- DOM Element Selection ---
const statusDisplay = document.querySelector('.status');
const gameBoard = document.querySelector('.game-board');
const restartButton = document.querySelector('.restart-button');
const cells = document.querySelectorAll('.cell');

// --- Game State Variables ---
let gameActive = true;
let currentPlayer = 'X';
// Represents the 3x3 board, initially all empty strings
let gameState = ["", "", "", "", "", "", "", "", ""];

// --- Messages ---
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

// --- Winning Combinations ---
// An array of arrays, where each inner array represents a winning line
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Left-to-right diagonal
    [2, 4, 6]  // Right-to-left diagonal
];

// --- Game Logic Functions ---

/**
 * Handles a click on a cell.
 * @param {MouseEvent} clickedCellEvent - The event object from the click.
 */
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // Ignore the click if the cell is already played or the game is over
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    // Process the move
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

/**
 * Updates the game state and UI for a played cell.
 * @param {HTMLElement} clickedCell - The DOM element of the cell that was clicked.
 * @param {number} clickedCellIndex - The index of the cell in the gameState array.
 */
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    // Add a class for styling ('x' or 'o')
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

/**
 * Checks if the game has been won or if it's a draw.
 */
function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        // If any of the cells in a win condition are empty, we can skip it
        if (a === '' || b === '' || c === '') {
            continue;
        }
        // If all three cells in a win condition are the same, we have a winner
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    // Check for a draw (if all cells are filled and there's no winner)
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    // If we are here, the game is not over, so switch players
    handlePlayerChange();
}

/**
 * Switches the current player and updates the status display.
 */
function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

/**
 * Resets the game to its initial state.
 */
function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('x', 'o');
    });
}

// --- Event Listeners ---
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);

// --- Initial Game Setup ---
// Set the initial status message when the page loads
statusDisplay.innerHTML = currentPlayerTurn();
