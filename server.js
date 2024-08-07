document.addEventListener('DOMContentLoaded', () => {
    const boardDiv = document.getElementById('board');
    const sizeInput = document.getElementById('sizeInput');
    const generateBoardBtn = document.getElementById('generateBoard');
    const showSolutionsBtn = document.getElementById('showSolutions');
    const prevSolutionBtn = document.getElementById('prevSolution');
    const nextSolutionBtn = document.getElementById('nextSolution');
    const undoMoveBtn = document.getElementById('undoMove');
    const solutionsCountDiv = document.getElementById('solutionsCount');
    const timerDiv = document.getElementById('timer');
    const messageDiv = document.getElementById('message');

    let n = 8;
    let queens = [];
    let history = [];
    let solutions = [];
    let currentSolutionIndex = 0;
    let countdown;
    const gameDuration = 30; // Game duration in seconds
    let gameStarted = false; // Flag to check if the game has started

    const startTimer = () => {
        let timeLeft = gameDuration;
        timerDiv.textContent = `Time left: ${timeLeft}s`;
        countdown = setInterval(() => {
            timeLeft--;
            timerDiv.textContent = `Time left: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                disableBoard();
                if (queens.every((col) => col !== -1)) {
                    messageDiv.textContent = 'Congratulations, you won!';
                } else {
                    messageDiv.textContent = 'You lose!';
                }
            }
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(countdown);
        timerDiv.textContent = 'Time left: 0s';
    };

    const resetGame = () => {
        if (gameStarted) {
            stopTimer();
        }
        gameStarted = false;
        n = parseInt(sizeInput.value, 10) || 8;
        createBoard();
        queens = Array(n).fill(-1);
        history = [];
        solutions = [];
        currentSolutionIndex = 0;
        solutionsCountDiv.textContent = 'Number of Solutions: 0';
        timerDiv.textContent = 'Time left: 0s';
        messageDiv.textContent = ''; // Clear any previous messages
    };

    const disableBoard = () => {
        Array.from(boardDiv.children).forEach(square => {
            square.removeEventListener('click', onSquareClick);
        });
    };

    const enableBoard = () => {
        Array.from(boardDiv.children).forEach(square => {
            square.addEventListener('click', onSquareClick);
        });
    };

    const createBoard = () => {
        boardDiv.innerHTML = '';
        boardDiv.style.gridTemplateColumns = `repeat(${n}, 40px)`;
        boardDiv.style.gridTemplateRows = `repeat(${n}, 40px)`;
        for (let i = 0; i < n * n; i++) {
            const square = document.createElement('div');
            square.className = 'square ' + ((Math.floor(i / n) + i) % 2 === 0 ? 'dark' : 'light');
            square.addEventListener('click', onSquareClick);
            boardDiv.appendChild(square);
        }
    };

    const onSquareClick = (event) => {
        const index = Array.from(boardDiv.children).indexOf(event.target);
        const row = Math.floor(index / n);
        const col = index % n;
        placePlayerQueen(row, col);
    };

    const isValid = (board, row, col) => {
        for (let i = 0; i < row; i++) {
            if (board[i] === col || 
                board[i] - i === col - row || 
                board[i] + i === col + row) {
                return false;
            }
        }
        return true;
    };

    const solveNQueens = (n) => {
        const solutions = [];
        const solve = (row, board) => {
            if (row === n) {
                solutions.push([...board]);
                return;
            }
            for (let col = 0; col < n; col++) {
                if (isValid(board, row, col)) {
                    board[row] = col;
                    solve(row + 1, board);
                    board[row] = -1;
                }
            }
        };
        solve(0, Array(n).fill(-1));
        return solutions;
    };

    const placePlayerQueen = (row, col) => {
        if (isValid(queens, row, col) && queens[row] === -1) {
            queens[row] = col;
            history.push([...queens]);
            renderQueens();
            if (!gameStarted) {
                startTimer();
                gameStarted = true;
            }
            if (queens.every((col, row) => col !== -1)) {
                // All queens are placed
                stopTimer();
                messageDiv.textContent = 'Congratulations, you won!';
            }
        }
    };

    const renderQueens = () => {
        Array.from(boardDiv.children).forEach((square) => {
            square.classList.remove('queen');
        });
        queens.forEach((col, row) => {
            if (col >= 0 && col < n) {
                boardDiv.children[row * n + col].classList.add('queen');
            }
        });
    };

    const renderSolution = () => {
        queens = solutions[currentSolutionIndex];
        renderQueens();
    };

    const undoMove = () => {
        history.pop();
        queens = history[history.length - 1] || Array(n).fill(-1);
        renderQueens();
    };

    const updateSolutionsCount = () => {
        solutionsCountDiv.textContent = `Number of Solutions: ${solutions.length}`;
    };

    generateBoardBtn.addEventListener('click', () => {
        resetGame();
    });

    showSolutionsBtn.addEventListener('click', () => {
        stopTimer();
        solutions = solveNQueens(n);
        if (solutions.length > 0) {
            currentSolutionIndex = 0;
            renderSolution();
        }
        updateSolutionsCount();
    });

    prevSolutionBtn.addEventListener('click', () => {
        stopTimer();
        if (solutions.length > 0 && currentSolutionIndex > 0) {
            currentSolutionIndex--;
            renderSolution();
        }
    });

    nextSolutionBtn.addEventListener('click', () => {
        stopTimer();
        if (solutions.length > 0 && currentSolutionIndex < solutions.length - 1) {
            currentSolutionIndex++;
            renderSolution();
        }
    });

    undoMoveBtn.addEventListener('click', () => {
        undoMove();
    });

    createBoard(); // Initial board creation
});
