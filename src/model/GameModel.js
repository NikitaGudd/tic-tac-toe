import { players } from '../constants/constants.js';

export class GameModel {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.isGameOver = false;
    this.players = players;
  }

  makeMove(index) {
    if (this.board[index] || this.isGameOver) return;
    this.board[index] = this.currentPlayer;
    this.checkWinner();
    this.currentPlayer =
      this.currentPlayer === this.players.human
        ? this.players.computer
        : this.players.human;
  }

  checkWinner() {
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

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.winner = this.board[a];
        this.isGameOver = true;
        return;
      }
    }

    if (!this.board.includes(null)) {
      this.isGameOver = true;
    }
  }

  reset() {
    this.board = Array(9).fill(null);
    this.currentPlayer = this.players.human;
    this.winner = null;
    this.isGameOver = false;
  }
}
