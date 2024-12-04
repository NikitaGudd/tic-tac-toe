class View {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.cellSize = 100;
  }

  renderBoard(board) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < 9; i++) {
      const x = (i % 3) * this.cellSize;
      const y = Math.floor(i / 3) * this.cellSize;

      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);

      if (board[i]) {
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
          board[i],
          x + this.cellSize / 2,
          y + this.cellSize / 2
        );
      }
    }
  }

  showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.querySelector('.modal-message');
    modal.style.display = 'flex';
    modalMessage.textContent = message;
  }
}
