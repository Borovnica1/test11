// Handles rendering related to the player stats panel and player-specific info.
import { elements, clearElement, toggleElement } from './base.js';
import * as boardView from './boardView.js'; // For property visuals

// --- Player Stats Panel ---

const statsCardsHTML = (playerId, tradeMode = false) => {
    const tradeStyles = tradeMode
        ? 'background-color: transparent; display:flex; flex-direction:column; height: 420px;'
        : '';
    const gridStyles = tradeMode
        ? 'margin-top:.2rem; width:80%; height:49%; margin-bottom:.4rem;'
        : '';
    const containerStyles = tradeMode
        ? ''
        : 'display:none; justify-content:space-around; align-items:center; height:220px; background-color:#82cdff; border-radius: 0 0 10px 10px; margin-top:-5px;';

    // Property groups based on original HTML structure
    return `
        <div class="stats__cards${playerId}" style="${containerStyles}${tradeStyles}">
            <div style="background-color:; width:40%; height:90%; display:grid; grid-template-columns:repeat(4, 1fr); grid-template-rows:repeat(5, 1fr); grid-gap:4px; ${gridStyles}">
                <span card-id="22" style="border:1px solid #955436"></span> <span card-id="24" style="border:1px solid #955436"></span> <span></span> <span></span>
                <span card-id="27" style="border:1px solid #aae0fa"></span> <span card-id="29" style="border:1px solid #aae0fa"></span> <span card-id="30" style="border:1px solid #aae0fa"></span> <span></span>
                <span card-id="32" style="border:1px solid #d93a96"></span> <span card-id="34" style="border:1px solid #d93a96"></span> <span card-id="35" style="border:1px solid #d93a96"></span> <span></span>
                <span card-id="37" style="border:1px solid #f7941d"></span> <span card-id="39" style="border:1px solid #f7941d"></span> <span card-id="40" style="border:1px solid #f7941d"></span> <span></span>
                <span card-id="2" style="border:1px solid #ed1b24"></span>  <span card-id="4" style="border:1px solid #ed1b24"></span>  <span card-id="5" style="border:1px solid #ed1b24"></span>
            </div>
            <div style="background-color:; width:40%; height:90%; display:grid; grid-template-columns:repeat(4, 1fr); grid-template-rows:repeat(5, 1fr); grid-gap:4px; ${gridStyles}">
                <span card-id="7" style="border:1px solid #fef200"></span>  <span card-id="8" style="border:1px solid #fef200"></span> <span card-id="10" style="border:1px solid #fef200"></span> <span></span>
                <span card-id="12" style="border:1px solid #1fb25a"></span> <span card-id="13" style="border:1px solid #1fb25a"></span> <span card-id="15" style="border:1px solid #1fb25a"></span> <span></span>
                <span card-id="18" style="border:1px solid #0072bb"></span> <span card-id="20" style="border:1px solid #0072bb"></span> <span></span> <span></span>
                <span card-id="33" style="border:1px solid #ffffff"></span> <span card-id="9" style="border:1px solid #ffffff"></span> <span></span> <span></span>
                <span card-id="26" style="border:1px solid #d3d3d3"></span> <span card-id="36" style="border:1px solid #d3d3d3"></span> <span card-id="6" style="border:1px solid #d3d3d3"></span> <span card-id="16" style="border:1px solid #d3d3d3"></span>
            </div>
        </div>`;
};


export const renderPlayerDashboard = (players, rankingsMode = false) => {
    const container = rankingsMode ? elements.overlayRankings : elements.statsContainer;
    clearElement(container); // Clear previous dashboard

    // If not rankings mode, clear initial player piece from GO square (assuming player 0 starts there visually)
    // This needs adjustment based on actual initial placement logic
    // if (!rankingsMode && players.length > 0) {
    //     const goSquare = elements.mapContainer.querySelector('[data-id="21"]'); // Assuming 21 is GO
    //     if (goSquare) clearElement(goSquare);
    // }

    let placeCount = players.length;

    players.forEach(player => {
        const playerHTML = `
            <div class="stats__player${player.id}" style="cursor:pointer; height:70px; background-color:lightblue; display:flex; align-items:center; margin-top:.4rem; border-radius:5px; padding:.5rem 1rem; border:2px solid lightblue; position:relative">
                <div class="map__box2" style="cursor:pointer; border:1px solid #000; width:40px; height:40px; border-radius:50%; display:flex; justify-content:center; background-color:#82cdff">
                    <span class="map__char" style="display:flex; align-items:center; font-size:22px;">${player.char}</span>
                </div>
                <div style="margin-left:.3rem; overflow:hidden; width:46%; white-space:nowrap;">
                    <h1>${player.name}</h1>
                    <h2 class="player-budget" style="margin-left:.8rem; margin-top:.2rem; color:darkgreen">$${player.budget}</h2>
                </div>
                <div class="stats__rolled${player.id}" style="margin-left:auto; display:flex; justify-content:center; align-items:center;"></div>
                <div class="stats__arrow" style="font-size:1.2rem; position:absolute; top:90%; left:50%; transform:translate(-50%,-50%); width:20px; height:20px; border:10px solid transparent; border-top:10px solid black;"></div>
            </div>
            ${statsCardsHTML(player.id)}
        `;

        if (!rankingsMode) {
            container.insertAdjacentHTML('beforeend', playerHTML);
            boardView.renderPlayerPiece(player); // Render piece on board
        } else {
            // Insert into rankings overlay
            container.insertAdjacentHTML('afterbegin', playerHTML); // Prepend to show highest rank first
            const statsRolledDiv = container.querySelector(`.stats__rolled${player.id}`);
            let placeIndicator;
            if (placeCount <= 3) {
                placeIndicator = `<img src="dices/rankings${placeCount}.png" alt="award image" style="width:40px; height:50px">`;
            } else {
                placeIndicator = `&#1011${placeCount + 1};`; // Circled number
                if (statsRolledDiv) statsRolledDiv.style.marginRight = '.55rem';
            }
            if (statsRolledDiv) {
                statsRolledDiv.style.fontSize = '1.8rem';
                statsRolledDiv.insertAdjacentHTML('beforeend', placeIndicator);
            }
            placeCount--;
        }
    });

    // Add event listeners for expanding property cards if not in rankings mode
    if (!rankingsMode) {
        addStatsCardToggleListeners();
    }
};

export const updatePlayerDiceRoll = (playerId, diceValues) => {
    const statsRolledDiv = document.querySelector(`.stats__rolled${playerId}`);
    if (!statsRolledDiv) return;

    const diceHTML1 = `<img src="dices/dice-${diceValues[0]}.png" style="width: 25px; height:25px; border-radius:5px; margin: 0 .3rem">`;
    const diceHTML2 = `<img src="dices/dice-${diceValues[1]}.png" style="width: 25px; height:25px; border-radius:5px;">`;
    statsRolledDiv.innerHTML = `<h2>Rolled: ${diceValues[0] + diceValues[1]}</h2>${diceHTML1}${diceHTML2}`;
};

export const highlightCurrentPlayer = (playerId, highlight = true) => {
    const playerPanel = document.querySelector(`.stats__player${playerId}`);
    if (playerPanel) {
        playerPanel.style.border = `2px solid ${highlight ? 'orange' : 'lightblue'}`;
        const charBg = playerPanel.querySelector('.map__box2');
        if (charBg) charBg.style.backgroundColor = highlight ? 'orange' : '#82cdff';
    }
    boardView.highlightPlayerPiece(playerId, highlight); // Also highlight piece on board
};

export const showMoneyChange = (playerId, amount, sign) => {
    const budgetElement = document.querySelector(`.stats__player${playerId} .player-budget`);
    if (!budgetElement) return;

    const color = sign === '+' ? 'green' : 'red';
    const changeHTML = `<span class="money-change" style="color:${color}; margin-left:.5rem;">${sign}$${Math.abs(amount)}</span>`;
    budgetElement.insertAdjacentHTML('beforeend', changeHTML);
};

export const hideMoneyChange = (playerId, newBudget) => {
    const budgetElement = document.querySelector(`.stats__player${playerId} .player-budget`);
    if (budgetElement) {
        // Remove temporary money change spans
        const changes = budgetElement.querySelectorAll('.money-change');
        changes.forEach(el => el.parentElement.removeChild(el));
        // Update budget display
        budgetElement.textContent = `$${newBudget}`;
    }
};

export const removePlayerDisplay = (playerId) => {
    const playerPanel = document.querySelector(`.stats__player${playerId}`);
    if (playerPanel) playerPanel.parentElement.removeChild(playerPanel);

    const statsCards = document.querySelector(`.stats__cards${playerId}`);
    if (statsCards) statsCards.parentElement.removeChild(statsCards);

    // Remove piece from board is handled in boardView or controller logic
};

// --- Stats Cards (Owned Properties Display) ---

export const updateStatsCards = (player) => {
    const statsCardsContainer = document.querySelector(`.stats__cards${player.id}`);
    if (!statsCardsContainer) return;

    // Reset all card backgrounds first
    const allSpans = statsCardsContainer.querySelectorAll('span[card-id]');
    allSpans.forEach(span => {
        span.style.backgroundColor = '';
        span.style.cursor = 'default';
        span.classList.remove('trade__arrow--left', 'trade__arrow--right'); // Clear trade indicators
        // Remove existing event listeners if added dynamically for trade
        // const spanClone = span.cloneNode(true);
        // span.parentNode.replaceChild(spanClone, span);
    });

    // Highlight owned properties
    player.properties.forEach(prop => {
        const cardSpan = statsCardsContainer.querySelector(`[card-id="${prop.id}"]`);
        if (cardSpan) {
            cardSpan.style.backgroundColor = cardSpan.style.borderColor || '#ccc'; // Use border color as background
        }
        // Update property owner visual on the main board
        boardView.renderPropertyOwner(prop);
    });
};


const addStatsCardToggleListeners = () => {
     const playerPanels = document.querySelectorAll('[class*="stats__player"]');
     playerPanels.forEach(panel => {
         // Clone and replace to remove old listeners before adding new ones
         const panelClone = panel.cloneNode(true);
         panel.parentNode.replaceChild(panelClone, panel);

         panelClone.addEventListener('click', (event) => {
             // Prevent clicks on interactive elements within the panel from toggling
             if (event.target.closest('input') || event.target.closest('button')) return;

             const id = panelClone.className.match(/stats__player(\d+)/)[1];
             const cards = document.querySelector(`.stats__cards${id}`);
             const arrow = panelClone.querySelector('.stats__arrow');

             if (cards && arrow) {
                 const isHidden = cards.style.display === 'none';
                 toggleElement(cards, isHidden); // Show if hidden, hide if shown
                 arrow.style.borderBottom = isHidden ? '10px solid black' : '10px solid transparent';
                 arrow.style.borderTop = isHidden ? '10px solid transparent' : '10px solid black';
                 arrow.style.top = isHidden ? '70%' : '90%';
             }
         });
     });
};

// --- Trade View Specific ---

export const renderTradePlayerPanel = (player, containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    clearElement(container);

    const markup = `
        <h1 style="font-size:20px; color:rgb(0, 174, 255); text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; overflow:hidden">${player.name}</h1>
        <div class="map__box2" style="margin:.6rem auto; border:1px solid #000; width:40px; height:40px; border-radius:50%; display:flex; justify-content:center; background-color:#82cdff">
            <span class="map__char" style="display:flex; align-items:center; font-size:22px;">${player.char}</span>
        </div>
        ${statsCardsHTML(player.id + 10, true)} {/* Use tradeMode=true */}
        <span style="color:darkgreen; font-size:18px">Money Amount:
            <input class="offer__money${player.id + 10}" value="0" type="number" style="color:darkgreen; outline:none; width: 80px;"
                   oninput="this.value = Math.max(0, Math.min(this.value, ${player.budget}));"
                   onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                   min="0" max="${player.budget}"> $
        </span>
    `;
    container.insertAdjacentHTML('beforeend', markup);

    // Make property cards clickable
    const statsCardsContainer = container.querySelector(`.stats__cards${player.id + 10}`);
    player.properties.forEach(prop => {
        const cardSpan = statsCardsContainer.querySelector(`[card-id="${prop.id}"]`);
        if (cardSpan) {
            cardSpan.style.backgroundColor = cardSpan.style.borderColor || '#ccc';
            cardSpan.style.cursor = 'pointer';
        }
    });
};

export const toggleTradePropertySelection = (cardElement, isSelecting, isCurrentUser) => {
    if (cardElement) {
        const arrowClass = isCurrentUser ? 'trade__arrow--right' : 'trade__arrow--left';
        cardElement.classList.toggle(arrowClass, isSelecting);
    }
};

export const resetTradePlayerPanel = (player) => {
     const statsCardsContainer = document.querySelector(`.stats__cards${player.id + 10}`); // ID used in trade
     if (!statsCardsContainer) return;

     const allSpans = statsCardsContainer.querySelectorAll('span[card-id]');
     allSpans.forEach(span => {
         span.classList.remove('trade__arrow--left', 'trade__arrow--right');
         // Reset background if needed, though updateStatsCards might handle this better
         // span.style.backgroundColor = '';
     });

     const moneyInput = document.querySelector(`.offer__money${player.id + 10}`);
     if (moneyInput) moneyInput.value = 0;
}
