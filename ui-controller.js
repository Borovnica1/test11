export class UIController {
  constructor() {
    this.domElements = {
      map: document.querySelector('.map'),
      stats: document.querySelector('.stats'),
      rollDiceBtn: document.querySelector('.rollDice'),
      endTurnBtn: document.querySelector('.endTurn'),
      // Add other DOM elements here...
    };
  }

  showStartScreen() {
    // Create and show player selection UI
    const html = `
      <div class="start-modal">
        <h1>Monopoly Clone</h1>
        <div class="player-selection">
          <h2>Select Number of Players</h2>
          <div class="player-count">
            ${[2,3,4,5,6,7,8].map(num => `
              <button class="player-count-btn" data-count="${num}">${num}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    this.domElements.map.insertAdjacentHTML('beforeend', html);
  }

  updatePlayers(players) {
    // Clear existing player displays
    this.domElements.stats.innerHTML = '';
    
    // Create player stats panels
    players.forEach(player => {
      const playerHtml = `
        <div class="player-stats" data-player-id="${player.id}">
          <div class="player-icon">${player.char}</div>
          <div class="player-info">
            <div class="player-name">${player.name}</div>
            <div class="player-money">$${player.budget}</div>
          </div>
        </div>
      `;
      this.domElements.stats.insertAdjacentHTML('beforeend', playerHtml);
    });
  }

  highlightCurrentPlayer(player) {
    // Remove highlight from all players
    document.querySelectorAll('.player-stats').forEach(el => {
      el.classList.remove('active');
    });
    
    // Highlight current player
    const playerEl = document.querySelector(`.player-stats[data-player-id="${player.id}"]`);
    if (playerEl) {
      playerEl.classList.add('active');
    }
  }

  enableDiceRoll() {
    this.domElements.rollDiceBtn.style.display = 'block';
    this.domElements.rollDiceBtn.addEventListener('click', this.handleDiceRoll.bind(this));
  }

  showDiceRoll(dice1, dice2) {
    // Show dice animation and results
    const diceHtml = `
      <div class="dice-result">
        <div class="die">${dice1}</div>
        <div class="die">${dice2}</div>
      </div>
    `;
    this.domElements.map.insertAdjacentHTML('beforeend', diceHtml);
    this.domElements.rollDiceBtn.style.display = 'none';
  }

  updatePlayerPosition(player) {
    // Remove player from old position
    document.querySelectorAll(`.player-marker[data-player-id="${player.id}"]`).forEach(el => {
      el.remove();
    });
    
    // Add player to new position
    const positionEl = document.querySelector(`[data-id="${player.mapSpot}"]`);
    if (positionEl) {
      const markerHtml = `
        <div class="player-marker" data-player-id="${player.id}">
          ${player.char}
        </div>
      `;
      positionEl.insertAdjacentHTML('beforeend', markerHtml);
    }
  }

  showPropertyPurchaseOption(player, property) {
    this.removePropertyDialog();
    
    const html = `
      <div class="property-dialog">
        <h2>${property.title}</h2>
        <p>Price: $${property.value}</p>
        <div class="dialog-actions">
          <button class="buy-btn">Buy</button>
          <button class="auction-btn">Auction</button>
        </div>
      </div>
    `;
    const dialog = this.domElements.map.insertAdjacentHTML('beforeend', html);
    
    // Add event listeners
    document.querySelector('.buy-btn').addEventListener('click', () => {
      this.gameController.handlePropertyPurchase(player, property);
      this.removePropertyDialog();
    });
    
    document.querySelector('.auction-btn').addEventListener('click', () => {
      this.gameController.handleAuction(property);
      this.removePropertyDialog();
    });
  }

  removePropertyDialog() {
    const dialog = document.querySelector('.property-dialog');
    if (dialog) dialog.remove();
  }

  showPropertyOwned(player, property) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <p>${player.name} bought ${property.title}!</p>
    `;
    this.domElements.map.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  showInsufficientFunds() {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = 'Insufficient funds!';
    this.domElements.map.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  showRentPaid(player, owner, amount) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <p>${player.name} paid $${amount} rent to ${owner.name}</p>
    `;
    this.domElements.map.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  showJailNotification(player) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
      <p>${player.name} was sent to jail!</p>
    `;
    this.domElements.map.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  showJailOptions(player) {
    const html = `
      <div class="jail-options">
        <p>${player.name} is in jail (${player.inJail} turns left)</p>
        <button class="pay-bail-btn">Pay $50 Bail</button>
        <button class="roll-double-btn">Roll for Double</button>
      </div>
    `;
    this.domElements.map.insertAdjacentHTML('beforeend', html);
  }

  showCard(card) {
    const html = `
      <div class="card-display">
        <h3>${card.text}</h3>
      </div>
    `;
    this.domElements.map.insertAdjacentHTML('beforeend', html);
  }

  updatePlayerStats(player) {
    const playerEl = document.querySelector(`.player-stats[data-player-id="${player.id}"] .player-money`);
    if (playerEl) {
      playerEl.textContent = `$${player.budget}`;
    }
  }

  clearUI() {
    console.log('Clearing UI elements');
    // Remove all player markers
    document.querySelectorAll('.player-marker').forEach(el => el.remove());
    // Clear player stats
    this.domElements.stats.innerHTML = '';
    // Hide dice roll button
    this.domElements.rollDiceBtn.style.display = 'none';
    // Remove any active dialogs
    this.removePropertyDialog();
    document.querySelectorAll('.notification, .jail-options, .card-display')
      .forEach(el => el.remove());
    // Reset any UI state
    if (this.domElements.endTurnBtn) {
      this.domElements.endTurnBtn.style.display = 'none';
    }
  }
}
