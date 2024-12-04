import { players } from '../constants/constants.js';

export class AI {
  constructor(model, maxDepth = 3) {
    this.model = model;
    this.maxDepth = maxDepth;
    this.players = players;
  }

  makeMove() {
    const bestMove = this.minimax(
      this.model.board,
      this.model.currentPlayer,
      -Infinity,
      Infinity,
      0
    );
    if (bestMove?.index !== undefined) {
      this.model.makeMove(bestMove.index);
    }
  }

  minimax(board, currentPlayer, alpha, beta, depth) {
    if (depth >= this.maxDepth || this.isGameOver(board)) {
      return { score: this.evaluateBoard(board, currentPlayer) };
    }

    const isMaximizing = currentPlayer === this.players.computer;
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove = null;

    for (const move of this.getAvailableMoves(board)) {
      const newBoard = this.simulateMove(board, move, currentPlayer);
      const result = this.minimax(
        newBoard,
        this.opponent(currentPlayer),
        alpha,
        beta,
        depth + 1
      );

      if (isMaximizing && result.score > bestScore) {
        bestScore = result.score;
        bestMove = { index: move, score: bestScore };
        alpha = Math.max(alpha, bestScore);
      } else if (!isMaximizing && result.score < bestScore) {
        bestScore = result.score;
        bestMove = { index: move, score: bestScore };
        beta = Math.min(beta, bestScore);
      }

      if (beta <= alpha) break;
    }

    return bestMove || { score: bestScore };
  }

  evaluateBoard(board, currentPlayer) {
    const winner = this.getWinner(board);
    if (winner === currentPlayer) return 10;
    if (winner === this.opponent(currentPlayer)) return -10;
    return 0;
  }

  opponent(player) {
    return player === this.players.human
      ? this.players.computer
      : this.players.human;
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

    for (const [a, b, c] of winPatterns) {
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

  simulateMove(board, move, player) {
    const newBoard = [...board];
    newBoard[move] = player;
    return newBoard;
  }
}
