import { Player } from './player.js';

export class GameController {
  constructor(board, uiController, config) {
    this.board = board;
    this.uiController = uiController;
    this.config = config;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.gameActive = false;
    this.diceRolls = [];
    this.doubleRollCount = 0;
  }

  startNewGame(playerNames) {
    this.players = playerNames.map((name, index) => 
      new Player(
        index + 1,
        name,
        this.config.playerChars[index],
        this.config.startingMoney,
        this.config.startingPosition
      )
    );
    this.gameActive = true;
    this.currentPlayerIndex = 0;
    this.uiController.updatePlayers(this.players);
    this.startTurn();
  }

  startTurn() {
    const player = this.getCurrentPlayer();
    this.uiController.highlightCurrentPlayer(player);
    
    if (player.inJail > 0) {
      this.handleJailTurn(player);
    } else {
      this.uiController.enableDiceRoll();
    }
  }

  rollDice() {
    if (!this.gameActive || !this.getCurrentPlayer()) return;

    const player = this.getCurrentPlayer();
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;

    this.diceRolls = [dice1, dice2];
    player.rolledNumber = total;
    
    // Show dice animation
    this.uiController.showDiceRoll(dice1, dice2);
    
    // After animation completes, handle the move
    setTimeout(() => {
      this.handleDiceRollResult(player, total);
    }, 1000); // Match this duration with CSS animation
    
    if (dice1 === dice2) {
      this.doubleRollCount++;
      if (this.doubleRollCount === 3) {
        this.sendToJail(player);
        return;
      }
    }

    player.move(total);
    this.uiController.updatePlayerPosition(player);
    this.handleLanding(player);
  }

  handleLanding(player) {
    const currentSpot = player.mapSpot;
    const property = this.board.getPropertyById(currentSpot);

    if (property) {
      this.handlePropertyLanding(player, property);
    } else if ([3, 17, 28].includes(currentSpot)) {
      this.handleChanceCard(player);
    } else if ([14, 23, 38].includes(currentSpot)) {
      this.handleCommunityChestCard(player);
    } else if (currentSpot === 11) {
      this.sendToJail(player);
    } else if (currentSpot === 1) {
      this.handleFreeParking(player);
    }
  }

  handlePropertyLanding(player, property) {
    if (property.ownerId) {
      this.handleOwnedProperty(player, property);
    } else {
      this.uiController.showPropertyPurchaseOption(player, property);
    }
  }

  endTurn() {
    const player = this.getCurrentPlayer();
    this.uiController.removeHighlight(player);
    
    if (this.doubleRollCount === 0 || player.inJail > 0) {
      this.nextPlayer();
    }
    this.doubleRollCount = 0;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.startTurn();
  }

  handlePropertyPurchase(player, property) {
    if (player.budget >= property.value) {
      player.updateBudget(property.value, '-');
      property.ownerId = player.id;
      player.addProperty(property);
      this.uiController.updatePlayerStats(player);
      this.uiController.showPropertyOwned(player, property);
      this.endTurn();
    } else {
      this.uiController.showInsufficientFunds();
    }
  }

  handleAuction(property) {
    // Start auction process
    this.uiController.showAuctionStarted(property);
    // Auction logic would be implemented here
  }

  sendToJail(player) {
    player.mapSpot = 11; // Jail position
    player.inJail = 3; // 3 turns in jail
    this.uiController.updatePlayerPosition(player);
    this.uiController.showJailNotification(player);
    this.endTurn();
  }

  handleOwnedProperty(player, property) {
    const owner = this.players.find(p => p.id === property.ownerId);
    if (owner !== player) {
      const rent = this.calculateRent(property);
      player.updateBudget(rent, '-');
      owner.updateBudget(rent, '+');
      this.uiController.updatePlayerStats(player);
      this.uiController.updatePlayerStats(owner);
      this.uiController.showRentPaid(player, owner, rent);
    }
    this.endTurn();
  }

  calculateRent(property) {
    // Simple rent calculation - would be enhanced with houses/hotels
    return Math.floor(property.value * 0.1);
  }

  handleJailTurn(player) {
    this.uiController.showJailOptions(player);
  }

  handleChanceCard(player) {
    const card = this.board.drawChanceCard();
    this.uiController.showCard(card);
    this.handleCardEffect(player, card);
  }

  handleCommunityChestCard(player) {
    const card = this.board.drawCommunityChestCard();
    this.uiController.showCard(card);
    this.handleCardEffect(player, card);
  }

  handleCardEffect(player, card) {
    // Would implement various card effects
    this.uiController.showCardEffect(player, card);
    this.endTurn();
  }

  clearGame() {
    console.group('Clearing game state');
    console.log('Players before:', this.players.length);
    console.log('Game active:', this.gameActive);
    
    this.players = [];
    this.currentPlayerIndex = 0;
    this.gameActive = false;
    this.diceRolls = [];
    this.doubleRollCount = 0;
    
    this.uiController.clearUI();
    
    console.log('Players after:', this.players.length);
    console.log('Game active:', this.gameActive);
    console.groupEnd();
  }

  handleDiceRollResult(player, total) {
    // Remove dice display
    const diceResult = document.querySelector('.dice-result');
    if (diceResult) diceResult.remove();
    
    // Move player
    player.move(total);
    
    // If player moved past Go (space 40)
    if (player.mapSpot > 40) {
      player.mapSpot -= 40;
      player.updateBudget(200, '+'); // Collect $200 for passing Go
    }

    this.uiController.updatePlayerPosition(player);
    this.handleLanding(player);
  }
}
