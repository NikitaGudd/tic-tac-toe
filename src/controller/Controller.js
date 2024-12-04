export class Controller {
  constructor(model, view, ai, adManager, players, messages) {
    this.model = model;
    this.view = view;
    this.ai = ai;
    this.adManager = adManager;
    this.messages = messages;
    this.players = players;
    this.selectedCell = 0;
    this.cellSize = 100;
    this.isPlayerTurn = true;

    this.GRID_SIZE = 3;
    this.TOTAL_CELLS = this.GRID_SIZE * this.GRID_SIZE;
  }

  startNewGame() {
    this.resetGame();
    if (Math.random() > 0.5) {
      this.makeAIMove();
    }
    this.updateTurnIndicator();
  }

  startNewGameWithAd() {
    this.resetGame();
    this.adManager.loadAd();
  }

  handlePlayerMove(event = null) {
    if (!this.isPlayerTurn || this.model.isGameOver) return;

    let cellIndex;

    if (event) {
      cellIndex = this.view.getCellIndexFromCoordinates(
        event.offsetX,
        event.offsetY
      );
    } else {
      cellIndex = this.selectedCell;
    }

    if (!this.isCellEmpty(cellIndex)) return;

    this.makePlayerMove(cellIndex);
    if (!this.checkGameOver()) {
      this.isPlayerTurn = false;
      this.makeAIMoveWithDelay();
    }
  }

  handleKeyPress(event) {
    if (this.model.isGameOver) return;

    event.preventDefault();
    const movementKeys = {
      ArrowUp: () => this.moveSelection(-this.GRID_SIZE),
      ArrowDown: () => this.moveSelection(this.GRID_SIZE),
      ArrowLeft: () => this.moveSelection(-1),
      ArrowRight: () => this.moveSelection(1),
      Enter: () => this.handlePlayerMove(),
    };

    if (movementKeys[event.key]) movementKeys[event.key]();

    this.view.renderBoard(this.model.board);
    this.view.highlightSelectedCell(this.selectedCell);
  }

  resetGame() {
    this.model.reset();
    this.view.renderBoard(this.model.board);
    this.isPlayerTurn = true;
  }

  makePlayerMove(cellIndex) {
    this.model.makeMove(cellIndex);
    this.view.renderBoard(this.model.board);
    this.updateTurnIndicator();
  }

  makeAIMove() {
    this.model.currentPlayer = this.players.computer;
    this.ai.makeMove();
    this.view.renderBoard(this.model.board);
    this.updateTurnIndicator();
  }

  makeAIMoveWithDelay() {
    setTimeout(() => {
      this.makeAIMove();
      if (!this.checkGameOver()) {
        this.isPlayerTurn = true;
      }
    }, 1000);
  }

  checkGameOver() {
    if (!this.model.isGameOver) return false;

    const message = this.model.winner
      ? this.getWinMessage(this.model.winner)
      : this.messages.draw;

    this.adManager.loadAd(() => this.view.showModal(message));
    return true;
  }

  updateTurnIndicator() {
    const playerTitle = document.querySelector('.player');

    const message =
      this.model.currentPlayer === this.players.human
        ? this.messages.turn.player
        : this.messages.turn.computer;

    playerTitle.textContent = message;
  }

  moveSelection(offset) {
    const newSelection = this.selectedCell + offset;
    if (newSelection >= 0 && newSelection < this.TOTAL_CELLS) {
      this.selectedCell = newSelection;
    }
  }

  getWinMessage(winner) {
    return winner === this.players.human
      ? this.messages.win.player
      : this.messages.win.computer;
  }

  isCellEmpty(cellIndex) {
    return this.model.board[cellIndex] === null;
  }
}
