document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const restartBtn = document.getElementById('restartBtn');
  const modal = document.getElementById('modal');
  const gameController = new Controller(canvas, ctx);

  canvas.width = 300;
  canvas.height = 300;

  restartBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    gameController.startNewGameWithAd();
  });

  gameController.startNewGameWithAd();
});
