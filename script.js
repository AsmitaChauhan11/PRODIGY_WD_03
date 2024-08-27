const board = document.getElementById('board');
const cells = Array.from(board.getElementsByClassName('cell'));
const message = document.getElementById('message');
let currentPlayer = 'X';
let gameMode = null;
let gameBoard = Array(9).fill(null);

document.getElementById('playPvP').addEventListener('click', () => startGame('PvP'));
document.getElementById('playPvAI').addEventListener('click', () => startGame('PvAI'));

cells.forEach(cell => cell.addEventListener('click', handleClick));

function startGame(mode) {
    gameMode = mode;
    gameBoard.fill(null);
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.textContent = '';
        cell.style.pointerEvents = 'auto';
    });
    message.textContent = `Player ${currentPlayer}'s turn`;
}

function handleClick(e) {
    const index = cells.indexOf(e.target);
    if (gameBoard[index] || !gameMode) return;

    gameBoard[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        message.textContent = `Player ${currentPlayer} wins!`;
        endGame();
    } else if (gameBoard.every(cell => cell)) {
        message.textContent = 'It\'s a draw!';
        endGame();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s turn`;
        if (gameMode === 'PvAI' && currentPlayer === 'O') aiMove();
    }
}

function aiMove() {
    const bestMove = getBestMove();
    cells[bestMove].click();
}

function getBestMove() {
    const emptyCells = gameBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);

    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < emptyCells.length; i++) {
        const index = emptyCells[i];
        gameBoard[index] = 'O';
        const score = minimax(gameBoard, false);
        gameBoard[index] = null;

        if (score > bestScore) {
            bestScore = score;
            move = index;
        }
    }

    return move;
}

function minimax(board, isMaximizing) {
    const winner = checkWinner(board);
    if (winner === 'O') return 10;
    if (winner === 'X') return -10;
    if (board.every(cell => cell)) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;

    const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);

    for (let i = 0; i < emptyCells.length; i++) {
        const index = emptyCells[i];
        board[index] = isMaximizing ? 'O' : 'X';
        const score = minimax(board, !isMaximizing);
        board[index] = null;

        bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }

    return bestScore;
}

function checkWin() {
    const winner = checkWinner(gameBoard);
    if (winner) {
        return winner;
    }
    return null;
}

function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function endGame() {
    cells.forEach(cell => cell.style.pointerEvents = 'none');
}
