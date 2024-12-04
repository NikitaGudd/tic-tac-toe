class AI {
  constructor(model, maxDepth = 3) {
    this.model = model;
    this.maxDepth = maxDepth;
  }

  makeMove() {
    const bestMove = this.minimax(
      this.model.board,
      this.model.currentPlayer,
      -Infinity,
      Infinity,
      0
    );
    this.model.makeMove(bestMove.index);
  }

  minimax(board, currentPlayer, alpha, beta, depth) {
    const availableMoves = this.getAvailableMoves(board);

    if (depth >= this.maxDepth || this.isGameOver(board)) {
      return { score: this.evaluateBoard(board, currentPlayer) };
    }

    let bestMove = null;

    if (currentPlayer === 'O') {
      let bestScore = -Infinity;
      for (const move of availableMoves) {
        const newBoard = this.makeMoveOnBoard(board, move, 'O');
        const result = this.minimax(newBoard, 'X', alpha, beta, depth + 1);
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = { index: move, score: bestScore };
        }
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break;
      }
    } else {
      let bestScore = Infinity;
      for (const move of availableMoves) {
        const newBoard = this.makeMoveOnBoard(board, move, 'X');
        const result = this.minimax(newBoard, 'O', alpha, beta, depth + 1);
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = { index: move, score: bestScore };
        }
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break;
      }
    }

    return bestMove;
  }

  evaluateBoard(board, currentPlayer) {
    const winner = this.getWinner(board);
    if (winner === currentPlayer) return 10;
    if (winner === this.opponent(currentPlayer)) return -10;
    return 0;
  }

  opponent(player) {
    return player === 'X' ? 'O' : 'X';
  }

  isGameOver(board) {
    return (
      this.getWinner(board) !== null ||
      this.getAvailableMoves(board).length === 0
    );
  }

  getWinner(board) {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  }

  getAvailableMoves(board) {
    return board
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null);
  }

  makeMoveOnBoard(board, move, player) {
    const newBoard = [...board];
    newBoard[move] = player;
    return newBoard;
  }
}
