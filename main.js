import { Player } from './player.js';
import { Board } from './board.js';
import { GameController } from './game-controller.js';
import { UIController } from './ui-controller.js';

// Game configuration
const GAME_CONFIG = {
  startingMoney: 900,
  startingPosition: 21,
  maxPlayers: 8,
  playerChars: ['👨', '👩', '👴', '👵', '👦', '👧', '👨‍💼', '👩‍💼']
};

// Initialize game components
const board = new Board();
const uiController = new UIController();
const gameController = new GameController(board, uiController, GAME_CONFIG);

// Connect UI controller to game controller
uiController.gameController = gameController;

// Start the game
uiController.showStartScreen();

// Handle player selection
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('player-count-btn')) {
    const playerCount = parseInt(e.target.dataset.count);
    const playerNames = Array.from({length: playerCount}, (_, i) => `Player ${i+1}`);
    gameController.startNewGame(playerNames);
    document.querySelector('.start-modal').remove();
  }

  // Handle New Game button click
  if (e.target.classList.contains('startGame')) {
    console.log('New Game button clicked - Resetting game');
    gameController.clearGame();
    uiController.showStartScreen();
    console.log('Start screen should now be visible');
  }

  // Handle Roll Dice button click via event delegation
  if (e.target.closest('.rollDice')) {
    const button = e.target.closest('.rollDice');
    button.style.display = 'none'; // Hide button after click
    gameController.rollDice();
  }
});

// Export for debugging
window.game = { 
  board,
  uiController, 
  gameController,
  Player
};
