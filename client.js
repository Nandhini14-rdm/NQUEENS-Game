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

    let n = 4;
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
                // Disable board interaction when time is up
                disableBoard();
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
        solutions = solveNQueens(n);
        if (solutions.length > 0) {
            currentSolutionIndex = 0;
            renderSolution();
            stopTimer(); // Stop the timer when showing solutions
        }
        updateSolutionsCount();
    });

    prevSolutionBtn.addEventListener('click', () => {
        if (solutions.length > 0 && currentSolutionIndex > 0) {
            currentSolutionIndex--;
            renderSolution();
            stopTimer(); // Stop the timer when navigating solutions
        }
    });

    nextSolutionBtn.addEventListener('click', () => {
        if (solutions.length > 0 && currentSolutionIndex < solutions.length - 1) {
            currentSolutionIndex++;
            renderSolution();
            stopTimer(); // Stop the timer when navigating solutions
        }
    });

    undoMoveBtn.addEventListener('click', () => {
        undoMove();
        // Do not stop the timer when undoing a move
    });

    createBoard(); // Initial board creation
});
