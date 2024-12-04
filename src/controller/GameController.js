class Controller {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.model = new GameModel();
    this.view = new View(canvas, ctx);
    this.ai = new AI(this.model);
    this.playerTitle = document.querySelector('.player');

    this.selectedCell = 0;
    this.cellSize = 100;
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    this.adManager = new AdManager(canvas, ctx, this.startNewGame.bind(this));
  }

  winnerMessage(winner) {
    switch (winner) {
      case 'X':
        return 'Ви виграли!';
      case 'O':
        return "Виграв комп'ютер!";
      default:
        return '';
    }
  }

  startNewGameWithAd() {
    this.adManager.loadAd();
  }

  startNewGame() {
    this.model.reset();
    this.view.renderBoard(this.model.board);
    this.canvas.addEventListener('click', this.handlePlayerMove.bind(this));
    if (Math.random() > 0.5) {
      this.model.currentPlayer = 'O';
      this.ai.makeMove();
      this.view.renderBoard(this.model.board);
    }
    this.updateTurnIndicator();
  }

  updateTurnIndicator() {
    const message =
      this.model.currentPlayer === 'X' ? 'Ваш хід' : "Тепер хід комп'ютера";
    console.log(message);
    this.playerTitle.textContent = message;
  }

  handlePlayerMove(event) {
    if (this.model.isGameOver) return;

    const x = event.offsetX;
    const y = event.offsetY;
    const index = Math.floor(x / 100) + Math.floor(y / 100) * 3;

    if (this.model.board[index] !== null) return;

    this.model.makeMove(index);
    this.view.renderBoard(this.model.board);
    this.updateTurnIndicator();

    if (this.model.isGameOver) {
      const message = this.model.winner
        ? `${this.winnerMessage(this.model.winner)}`
        : 'Нічия!';
      this.view.showModal(message);
    } else {
      this.model.currentPlayer = 'O';
      this.ai.makeMove();
      this.view.renderBoard(this.model.board);
      this.updateTurnIndicator();

      if (this.model.isGameOver) {
        const message = this.model.winner
          ? `${this.winnerMessage(this.model.winner)}`
          : 'Нічия!';
        this.view.showModal(message);
      }
    }
  }

  handleKeyPress(event) {
    if (this.model.isGameOver) return;
    event.preventDefault();
    switch (event.key) {
      case 'ArrowUp':
        if (this.selectedCell >= 3) this.selectedCell -= 3;
        break;
      case 'ArrowDown':
        if (this.selectedCell < 6) this.selectedCell += 3;
        break;
      case 'ArrowLeft':
        if (this.selectedCell % 3 !== 0) this.selectedCell -= 1;
        break;
      case 'ArrowRight':
        if (this.selectedCell % 3 !== 2) this.selectedCell += 1;
        break;
      case 'Enter':
        this.handlePlayerMoveByKey();
        break;
      default:
        return;
    }

    this.view.renderBoard(this.model.board);
    this.highlightSelectedCell();
    this.updateTurnIndicator();
  }

  highlightSelectedCell() {
    const x = (this.selectedCell % 3) * this.cellSize;
    const y = Math.floor(this.selectedCell / 3) * this.cellSize;

    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
  }

  handlePlayerMoveByKey() {
    if (this.model.board[this.selectedCell] !== null) return;

    this.model.makeMove(this.selectedCell);
    this.view.renderBoard(this.model.board);
    this.updateTurnIndicator();

    if (this.model.isGameOver) {
      const message = this.model.winner
        ? `${this.winnerMessage(this.model.winner)}`
        : 'Нічия!';
      this.view.showModal(message);
    } else {
      this.model.currentPlayer = 'O';
      this.ai.makeMove();
      this.view.renderBoard(this.model.board);
      this.updateTurnIndicator();

      if (this.model.isGameOver) {
        const message = this.model.winner
          ? `${this.winnerMessage(this.model.winner)}`
          : 'Нічия!';
        this.view.showModal(message);
      }
    }
  }
}
