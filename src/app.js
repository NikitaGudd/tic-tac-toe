import { messages, players } from './constants/constants.js';
import { Controller } from './controller/Controller.js';
import { GameModel } from './model/GameModel.js';
import { AdManager } from './utils/AdManager.js';
import { AI } from './utils/AIPlayer.js';
import { View } from './view/View.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startBtn');
  const modal = document.getElementById('modal');

  const model = new GameModel();
  const view = new View(canvas, ctx);
  const ai = new AI(model);
  const adManager = new AdManager(canvas, ctx, () => {
    controller.startNewGame();
  });

  const controller = new Controller(
    model,
    view,
    ai,
    adManager,
    players,
    messages
  );

  canvas.width = 300;
  canvas.height = 300;

  document.addEventListener('keydown', (event) => {
    controller.handleKeyPress(event);
  });

  canvas.addEventListener('click', (event) => {
    controller.handlePlayerMove(event);
  });

  startBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    controller.startNewGameWithAd(adManager);
  });
});
