// Handles rendering related to the game board (player pieces, houses, properties).
import { elements, clearElement, toggleElement, getRandomPercent } from './base.js';

// --- Player Piece Movement ---

export const clearPlayerPieces = (players) => {
    players.forEach(player => {
        const piece = document.querySelector(`.map__player${player.id}`);
        if (piece) piece.parentElement.removeChild(piece);
    });
};

export const renderPlayerPiece = (player) => {
    const boardSquare = elements.mapContainer.querySelector(`[data-id="${player.mapSpot}"]`);
    if (!boardSquare) {
        console.error(`Board square with data-id ${player.mapSpot} not found for player ${player.id}`);
        return;
    }

    const markup = `
        <div class="map__player${player.id}" style="display:inline-flex;padding: .1rem;">
            <div class="map__box2 index100" style="border: 1px solid #000; width: 27px; height: 27px; background-color:lightblue; border-radius:50%; overflow:hidden; display:inline-flex; justify-content: center;">
                <span class="map__char" style="display:flex; align-items: center; font-size: 22px;">${player.char}</span>
            </div>
        </div>
    `;
    boardSquare.insertAdjacentHTML('beforeend', markup);
};

export const updatePlayerSpot = (player) => {
    // Remove existing piece
    const existingPiece = document.querySelector(`.map__player${player.id}`);
    if (existingPiece) existingPiece.parentElement.removeChild(existingPiece);
    // Render new piece
    renderPlayerPiece(player);
    // Highlight the new piece temporarily (optional)
    highlightPlayerPiece(player.id, true); // Highlight
    setTimeout(() => highlightPlayerPiece(player.id, false), 500); // Remove highlight after delay
};

export const highlightPlayerPiece = (playerId, highlight = true) => {
    const pieceElement = document.querySelector(`.map__player${playerId} .map__box2`);
    if (pieceElement) {
        pieceElement.style.backgroundColor = highlight ? 'orange' : 'lightblue';
    }
};

// --- Dice Display ---

export const showDice = (diceValues) => {
    const diceHTML1 = `<img src="dices/dice-${diceValues[0]}.png" style="width: 100px; height:100px; border-radius:10px">`;
    const diceHTML2 = `<img src="dices/dice-${diceValues[1]}.png" style="width: 100px; height:100px; border-radius:10px">`;

    clearElement(elements.diceContainer1);
    clearElement(elements.diceContainer2);
    elements.diceContainer1.insertAdjacentHTML('beforeend', diceHTML1);
    elements.diceContainer2.insertAdjacentHTML('beforeend', diceHTML2);
    toggleElement(elements.diceContainer1, true);
    toggleElement(elements.diceContainer2, true);

    elements.playerNumberDisplay.innerHTML = `<h2>Rolled: ${diceValues[0] + diceValues[1]}</h2>`;
    toggleElement(elements.playerNumberDisplay, true);
};

export const hideDice = () => {
    toggleElement(elements.diceContainer1, false);
    toggleElement(elements.diceContainer2, false);
    toggleElement(elements.playerNumberDisplay, false);
    clearElement(elements.diceContainer1);
    clearElement(elements.diceContainer2);
    clearElement(elements.playerNumberDisplay);
};

// --- Property Ownership & Houses ---

export const clearAllPropertyVisuals = (properties) => {
     properties.forEach(prop => {
        const mapCard = elements.mapContainer.querySelector(`[data-id="${prop.id}"]`);
        if (mapCard) {
            // Clear owner indicator
            const ownerIndicator = mapCard.querySelector('.map__cards');
            if (ownerIndicator) ownerIndicator.parentElement.removeChild(ownerIndicator);

            // Clear houses (if applicable)
            const houseContainer = mapCard.querySelector('.map__houses');
            if (houseContainer) clearElement(houseContainer);

            // Reset build/sell overlay state (remove listeners if added dynamically)
            const buildSellOverlay = mapCard.querySelector('.map__buildSell');
             if (buildSellOverlay) {
                buildSellOverlay.style.backgroundColor = 'rgba(0,0,0,0)';
                buildSellOverlay.style.zIndex = '';
                buildSellOverlay.style.cursor = 'default';
                const priceDisplay = buildSellOverlay.querySelector('.housePrice');
                if (priceDisplay) toggleElement(priceDisplay, false);
                // Important: If event listeners were added dynamically, they need to be removed here
                // or by cloning and replacing the node as done in the original script.
                // For simplicity, we assume listeners are handled elsewhere or the node is replaced.
             }
        }
     });
};


const getPropertyPosition = (propertyId) => {
    if ([22, 24, 26, 27, 29, 30].includes(propertyId)) return 'bottom';
    if ([32, 33, 34, 35, 36, 37, 39, 40].includes(propertyId)) return 'right';
    if ([2, 4, 5, 6, 7, 8, 9, 10].includes(propertyId)) return 'top';
    return 'left'; // Default
};

export const renderPropertyOwner = (property) => {
    if (!property.owner) return; // Only render if owned

    const mapCard = elements.mapContainer.querySelector(`[data-id="${property.id}"]`);
    if (!mapCard) return;

    // Remove existing owner indicator first
    const existingIndicator = mapCard.querySelector(`.map__cards${property.owner.id}`);
     if (existingIndicator) existingIndicator.parentElement.removeChild(existingIndicator);


    const position = getPropertyPosition(property.id);
    const statsCard = document.querySelector(`.stats__cards${property.owner.id} [card-id="${property.id}"]`);
    const borderColor = statsCard ? statsCard.style.borderColor || '#ccc' : '#ccc'; // Fallback color
    const rgb = borderColor.startsWith('rgb') ? borderColor.slice(4, -1) : '128,128,128'; // Extract RGB values or use gray

    const markup = `
        <div class="map__cards map__cards-${position} map__cards${property.owner.id}" style="background-color: rgba(${rgb}, 0.7);">
            <div class="map__box2" style="border: 1px solid #000; width: 23px; height: 23px; border-radius:50%; display:flex; justify-content: center; background-color:${borderColor}; margin:auto;">
                <span class="map__char" style="display:flex; align-items: center; font-size: 22px;">${property.owner.char}</span>
            </div>
        </div>
    `;
    // The first child div within map__box is usually the main content area
    if (mapCard.children[0]) {
        mapCard.children[0].insertAdjacentHTML('beforeend', markup);
    } else {
        mapCard.insertAdjacentHTML('beforeend', markup); // Fallback if structure is different
    }
};

export const renderHouses = (property) => {
    const mapCard = elements.mapContainer.querySelector(`[data-id="${property.id}"]`);
    const houseContainer = mapCard ? mapCard.querySelector('.map__houses') : null;

    if (!houseContainer) return; // Not a property that can have houses

    clearElement(houseContainer); // Clear existing houses

    const houseColor = property.houses === 5 ? 'rgba(169, 0, 0, 0.9)' : 'rgba(0, 140, 0, 0.4)'; // Red for hotel, green for houses
    const houseHTML = `
        <div class="houseContainer" style="background-color:${houseColor}">
            <div class="houseSide houseSide__front"></div>
            <div class="houseSide houseSide__right"></div>
            <div class="houseSide houseSide__back"></div>
            <div class="houseSide houseSide__left"></div>
            <div class="houseSide houseSide__bottom"></div>
            <div class="houseSide houseSide__roof">
                <div class="houseRoof houseRoof__right"></div>
                <div class="houseRoof houseRoof__left"></div>
                <div class="houseRoof houseRoof__topRight"></div>
                <div class="houseRoof houseRoof__topLeft"></div>
                <div class="houseRoof houseChimney"></div><div class="houseRoof houseChimney"></div><div class="houseRoof houseChimney"></div><div class="houseRoof houseChimney"></div><div class="houseRoof houseChimney"></div><div class="houseRoof houseChimney"></div><div class="houseRoof houseChimney"></div>
            </div>
        </div>`;

    const numHousesToRender = property.houses === 5 ? 1 : property.houses; // Render 1 hotel model

    for (let i = 0; i < numHousesToRender; i++) {
        houseContainer.insertAdjacentHTML('beforeend', houseHTML);
    }
};


// --- Parking Pot ---
export const updateParkingPot = (potAmount) => {
    if (elements.potDisplay) {
        elements.potDisplay.innerHTML = `$${potAmount}`;
    }
};

export const showParkingMoneyAdded = (amountAdded, totalPot) => {
    if (elements.addPotDisplay) {
        elements.addPotDisplay.innerHTML = `+$${amountAdded}`;
        toggleElement(elements.addPotDisplay, true);
    }
    if (elements.moneyPotContainer) {
        clearElement(elements.moneyPotContainer); // Clear previous bills
        const bills = [500, 100, 50, 20, 10, 5, 1];
        let remainingAmount = amountAdded;
        bills.forEach(billValue => {
            let billCount = Math.floor(remainingAmount / billValue);
            remainingAmount %= billValue;
            while (billCount > 0) {
                const billHTML = `<img draggable="false" src="dices/money${billValue}.png" style="position:absolute; transform:translate(-50%,-50%) rotate(${getRandomPercent() - 100}deg); top:${getRandomPercent()}%; left:${getRandomPercent()}%; width:40%">`;
                elements.moneyPotContainer.insertAdjacentHTML('beforeend', billHTML);
                billCount--;
            }
        });
    }
    // Update total display after a delay
    setTimeout(() => {
        hideParkingMoneyAdded(totalPot);
    }, 1500); // Adjust delay as needed
};

export const hideParkingMoneyAdded = (totalPot) => {
     if (elements.addPotDisplay) {
        toggleElement(elements.addPotDisplay, false);
     }
     updateParkingPot(totalPot);
     // Optionally clear the visual money pile after a longer delay or when collected
     // setTimeout(() => clearElement(elements.moneyPotContainer), 3000);
};

export const clearParkingMoneyVisuals = () => {
    if (elements.moneyPotContainer) {
        clearElement(elements.moneyPotContainer);
    }
     if (elements.addPotDisplay) {
        toggleElement(elements.addPotDisplay, false);
     }
}

// --- Build/Sell Mode ---

const getHousePrice = (propertyId, sellMode = false) => {
    let price = 0;
    // Simplified pricing based on original script - NEEDS REPLACEMENT with actual Monopoly data
    if ([22, 24].includes(propertyId)) price = 60 / 4;
    else if ([27, 29].includes(propertyId)) price = 100 / 4;
    else if (30 === propertyId) price = 120 / 4;
    else if ([32, 34].includes(propertyId)) price = 140 / 4;
    else if (35 === propertyId) price = 160 / 4;
    else if ([37, 39].includes(propertyId)) price = 180 / 4;
    else if (40 === propertyId) price = 200 / 4;
    else if ([2, 4].includes(propertyId)) price = 220 / 4;
    else if (5 === propertyId) price = 240 / 4;
    else if ([7, 8].includes(propertyId)) price = 260 / 4;
    else if (10 === propertyId) price = 280 / 4;
    else if ([12, 13].includes(propertyId)) price = 300 / 4;
    else if (15 === propertyId) price = 320 / 4;
    else if (18 === propertyId) price = 350 / 4;
    else if (20 === propertyId) price = 400 / 4;

    return sellMode ? price / 2 : price;
};


export const highlightBuildableProperties = (propertyIds, buildMode = true) => {
    const hoverColor = buildMode ? 'rgba(0, 169, 0, 0.6)' : 'rgba(169, 0, 0, 0.6)';
    const priceColor = buildMode ? 'darkgreen' : 'red';
    const textPrefix = buildMode ? 'Build house for: ' : 'Sell house for: ';

    propertyIds.forEach(id => {
        const mapCard = elements.mapContainer.querySelector(`[data-id="${id}"]`);
        const overlay = mapCard ? mapCard.querySelector('.map__buildSell') : null;
        const priceDisplay = overlay ? overlay.querySelector('.housePrice') : null;

        if (overlay && priceDisplay) {
            overlay.style.backgroundColor = 'rgba(0,0,0,.6)'; // Initial dark overlay
            overlay.style.zIndex = '100';
            overlay.style.cursor = 'pointer';

            const price = getHousePrice(id, !buildMode);
            priceDisplay.innerHTML = `${textPrefix}<span style="color:${priceColor};">$${price}</span>`;

            // Store handlers to remove them later
            overlay._mouseEnterHandler = () => {
                overlay.style.backgroundColor = hoverColor;
                toggleElement(priceDisplay, true);
            };
            overlay._mouseLeaveHandler = () => {
                overlay.style.backgroundColor = 'rgba(0,0,0,.6)';
                toggleElement(priceDisplay, false);
            };

            overlay.addEventListener('mouseenter', overlay._mouseEnterHandler);
            overlay.addEventListener('mouseleave', overlay._mouseLeaveHandler);
        }
    });
};

export const removeBuildableHighlights = (propertyIds) => {
    propertyIds.forEach(id => {
        const mapCard = elements.mapContainer.querySelector(`[data-id="${id}"]`);
        const overlay = mapCard ? mapCard.querySelector('.map__buildSell') : null;
        const priceDisplay = overlay ? overlay.querySelector('.housePrice') : null;

        if (overlay) {
            overlay.style.backgroundColor = 'rgba(0,0,0,0)';
            overlay.style.zIndex = '';
            overlay.style.cursor = 'default';

            // Remove event listeners if they were stored
            if (overlay._mouseEnterHandler) {
                overlay.removeEventListener('mouseenter', overlay._mouseEnterHandler);
                delete overlay._mouseEnterHandler; // Clean up property
            }
             if (overlay._mouseLeaveHandler) {
                overlay.removeEventListener('mouseleave', overlay._mouseLeaveHandler);
                delete overlay._mouseLeaveHandler; // Clean up property
            }

            if (priceDisplay) {
                toggleElement(priceDisplay, false);
            }
        }
    });
};
