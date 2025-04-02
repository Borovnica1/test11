// Handles rendering and interactions for various modals (player setup, card display, jail, etc.).
import { elements, clearElement, toggleElement } from './base.js';

// --- Generic Modal Handling ---

const clearModalContainer = () => {
    // Find any existing modal and remove it
    const existingModal = elements.mapContainer.querySelector('.map__modal');
    if (existingModal) existingModal.parentElement.removeChild(existingModal);
};

const insertModalHTML = (html) => {
    clearModalContainer(); // Ensure only one modal is shown at a time
    elements.mapContainer.insertAdjacentHTML('beforeend', html);
};

// --- Player Setup Modals ---

export const showPlayerNumberPanel = () => {
    const html = `
        <div class="map__modal" style="width: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 2rem; z-index: 110; background-color: rgba(255, 255, 47, 0.699); border-radius: 10px; font-size: 12px; font-weight: 300; cursor: default;">
            <h1 class="map__title">Number of players?</h1>
            ${[2, 3, 4, 5, 6, 7, 8].map(num => `
                <button class="map__player-number btn" data-id="${num}" style="margin-top:.5rem; margin-right:.5rem; width: 40px; height: 40px;">${num}</button>
            `).join('')}
        </div>`;
    insertModalHTML(html);
};

export const showGameModePanel = () => {
    const html = `
        <div class="map__modal" style="width: 70%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 2rem; z-index: 110; background-color: rgba(255, 255, 47, 0.699); border-radius: 10px; font-size: 12px; font-weight: 300; cursor: default;">
            <h1 class="map__title" style="text-align:center; font-size:1.5rem">Gamemode: ?</h1>
            <div style="display: flex; justify-content: space-around; align-items: flex-start;">
                <div class="map__mode" data-id="lastmode" style="width: 46%; cursor: pointer; margin: 2rem 2%; padding: .15rem; background-color: rgba(172, 172, 172, 0.151); border-radius: 10px;">
                    <img src="dices/lastman.jpg" style="border-radius: 10px; width: 100%; height: 170px;">
                    <ul style="list-style: disc; margin-left: 20px; font-size: 1.1rem;">
                        <li><span>Last Man Standing mode!</span></li>
                        <li><span>When player goes below $0 he is kicked out!</span></li>
                        <li><span>No time limit!</span></li>
                    </ul>
                    <span style="display:block;">&nbsp;</span>
                </div>
                <div class="map__mode" data-id="timemode" style="width: 46%; cursor: pointer; margin: 2rem 2%; padding: .15rem; background-color: rgba(172, 172, 172, 0.151); border-radius: 10px;">
                    <img src="dices/timemode.jpg" style="border-radius: 10px; width: 100%; height: 170px;">
                     <ul style="list-style: disc; margin-left: 20px; font-size: 1.1rem;">
                        <li><span>Time mode!</span></li>
                        <li><span>Player with most money after <input class="map__mode-number" type="number" value="30" min="1" max="1000" style="outline: none; width: 70px; height: 25px;"> minutes wins!</span></li>
                        <li><span>Player can go in debt!</span></li>
                    </ul>
                    <span class="map__mode-number-warning" style="font-size:.9rem; color:red; display: block;">&nbsp;</span>
                </div>
            </div>
        </div>`;
    insertModalHTML(html);
    // Add hover effect listener
    document.querySelectorAll('.map__mode').forEach(modeDiv => {
        modeDiv.addEventListener('mouseenter', () => modeDiv.style.backgroundColor = 'rgba(0, 174, 255, 0.308)');
        modeDiv.addEventListener('mouseleave', () => modeDiv.style.backgroundColor = 'rgba(172, 172, 172, 0.151)');
    });
};


export const showPlayerCreatePanel = (playerNumber, availableChars) => {
    const charsHTML = availableChars.map((char, index) => `
        <div class="map__box2 arrayIndex${index}" style="cursor:pointer; border: 1px solid #000; width: 40px; height: 40px; border-radius:50%; overflow:hidden; display: inline-flex; justify-content: center; margin-right:.2rem; margin-top:.1rem; background-color: #ffa4d1; color: rgb(31, 31, 31);">
            <span class="map__char" style="display:flex; align-items: center; font-size: 30px;">${char}</span>
        </div>
    `).join('');

    const html = `
        <div class="map__modal" style="width: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 1.6rem 2rem; z-index: 110; background-color: rgba(255, 255, 47, 0.699); border-radius: 10px; font-size: 12px; font-weight: 300; cursor: default;">
            <h1>Player ${playerNumber}</h1>
            <h2 style="margin-top: .4rem">Name:</h2>
            <input type="text" class="player__name" required maxlength="14" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123 || (event.charCode == 32))" placeholder="Player Name" style="display:block; height:1.9rem; outline:none; border:none; font-size: 18px; padding-left: .5rem;">
            <h2 style="margin-top: .4rem">Choose a character:</h2>
            <div class="char-selection-container">
                ${charsHTML}
            </div>
            <button class="map__done btn" style="display:flex; margin:auto; padding:.6rem .9rem; margin-top:.4rem">Done</button>
        </div>`;
    insertModalHTML(html);
    document.querySelector('.player__name').focus();

    // Add hover/selection listeners for characters
    let lastSelectedItem = null;
    document.querySelectorAll('.char-selection-container .map__box2').forEach(item => {
        item.addEventListener('mouseenter', () => { if (item !== lastSelectedItem) item.style.backgroundColor = '#82cdff'; });
        item.addEventListener('mouseleave', () => { if (item !== lastSelectedItem) item.style.backgroundColor = '#ffa4d1'; });
        item.addEventListener('click', () => {
            if (lastSelectedItem) {
                lastSelectedItem.style.border = "1px solid #000";
                lastSelectedItem.style.backgroundColor = '#ffa4d1';
            }
            item.style.border = "1px solid orangered";
            item.style.backgroundColor = 'lightblue';
            lastSelectedItem = item;
            // Store selected char/index in data attributes or handle in controller
            item.closest('.map__modal').dataset.selectedChar = item.querySelector('.map__char').innerHTML;
            item.closest('.map__modal').dataset.selectedCharIndex = item.className.match(/arrayIndex(\d+)/)[1];
        });
    });
};

export const getPlayerCreationInput = () => {
    const modal = document.querySelector('.map__modal');
    const nameInput = modal ? modal.querySelector('.player__name') : null;
    const name = nameInput ? nameInput.value.trim() : '';
    const selectedChar = modal ? modal.dataset.selectedChar : null;
    const selectedCharIndex = modal ? modal.dataset.selectedCharIndex : null;

    if (name.length > 0 && selectedChar) {
        return { name, char: selectedChar, charIndex: parseInt(selectedCharIndex, 10) };
    }
    return null; // Indicate invalid input
};

export const removeModal = clearModalContainer;

// --- Card Display Modal ---

export const showCardModal = (cardData) => {
    // cardData: { type: 'property'/'chance'/'tax' etc., title1, title2, imageSrc, showBuy, showAuction, showRent, showTakeCard, ownerName, price, rentAmount, auctionStartPrice }
    toggleElement(elements.cardModal, true);
    elements.cardModalTitle1.innerHTML = cardData.title1 || '';
    elements.cardModalTitle2.innerHTML = cardData.title2 || '';
    elements.cardModalImage.src = cardData.imageSrc || '';
    elements.cardModalImage.style.border = cardData.imageSrc ? '2px solid #000' : 'none';

    // Hide all buttons initially
    toggleElement(elements.buyPropertyBtn, false);
    toggleElement(elements.auctionBtn, false);
    toggleElement(elements.payRentBtn, false);
    toggleElement(elements.cardTakenBtn, false);
    elements.buyPropertyBtn.classList.remove('aBitLeftAuction');
    elements.auctionBtn.classList.remove('aBitRightAuction');


    // Show relevant buttons based on card type
    if (cardData.showBuy) {
        elements.buyPropertyBtn.innerHTML = 'Buy Property';
        elements.auctionBtn.innerHTML = `Auction $${cardData.auctionStartPrice}`;
        toggleElement(elements.buyPropertyBtn, true);
        toggleElement(elements.auctionBtn, true);
    }
    if (cardData.showAuction) {
         elements.buyPropertyBtn.innerHTML = `${cardData.ownerName} Bid: $${cardData.price}?`; // Price here is the next bid amount
         elements.auctionBtn.innerHTML = 'Fold';
         toggleElement(elements.buyPropertyBtn, true);
         toggleElement(elements.auctionBtn, true);
         elements.buyPropertyBtn.classList.add('aBitLeftAuction');
         elements.auctionBtn.classList.add('aBitRightAuction');
    }
    if (cardData.showRent) {
        elements.payRentBtn.innerHTML = `Pay Rent: $${cardData.rentAmount}`;
        toggleElement(elements.payRentBtn, true);
    }
    if (cardData.showTakeCard) {
        toggleElement(elements.cardTakenBtn, true);
    }
};

export const hideCardModal = () => {
    toggleElement(elements.cardModal, false);
    // Ensure all conditional buttons are hidden
    toggleElement(elements.buyPropertyBtn, false);
    toggleElement(elements.auctionBtn, false);
    toggleElement(elements.payRentBtn, false);
    toggleElement(elements.cardTakenBtn, false);
    elements.buyPropertyBtn.classList.remove('aBitLeftAuction');
    elements.auctionBtn.classList.remove('aBitRightAuction');
};

// --- Chance/Community Chest Text Display ---

export const showCardText = (text, cardType) => {
    if (cardType === 'chance') {
        elements.mapTextDisplay.style.backgroundColor = 'rgba(245, 131, 0, 0.753)';
        elements.mapTextDisplay.style.border = '1px solid orange';
    } else { // communityChest
        elements.mapTextDisplay.style.backgroundColor = 'rgba(84, 172, 230, 0.788)';
        elements.mapTextDisplay.style.border = '1px solid lightblue';
    }
    elements.mapTextDisplay.innerHTML = text;
    toggleElement(elements.mapTextDisplay, true);
};

export const hideCardText = () => {
    toggleElement(elements.mapTextDisplay, false);
};


// --- Jail Modals ---

export const showGoToJail = (playerName) => {
    elements.goToJailName.textContent = playerName;
    toggleElement(elements.goToJailModal, true);
};

export const hideGoToJail = () => {
    toggleElement(elements.goToJailModal, false);
};

export const showInJail = (playerName, turnsLeft) => {
    elements.inJailTurns.textContent = `${playerName} ${turnsLeft}`;
    toggleElement(elements.inJailModal, true);
};

export const hideInJail = () => {
    toggleElement(elements.inJailModal, false);
};

// --- Other Modals (Parking, Win, Bankruptcy) ---

export const showFreeParking = (playerName) => {
    elements.freeMoneyName.textContent = playerName;
    toggleElement(elements.freeMoneyModal, true);
};

export const hideFreeParking = () => {
    toggleElement(elements.freeMoneyModal, false);
    // Clearing the money visuals might happen here or in boardView depending on timing
    // clearElement(elements.moneyPotContainer);
};

export const showBankruptcyMessage = (playerName) => {
    elements.playerNumberDisplay.innerHTML = `<h1 style="width:600px"><span style="color:rgb(0, 174, 255)">${playerName}</span>'s budget just went below $0!</h1>`;
    toggleElement(elements.playerNumberDisplay, true);
};

export const showWinnerDisplay = (playerName) => {
    elements.winDisplayPlayer.innerHTML = `<h1 style="white-space:nowrap;"><span style="color:rgb(0, 174, 255)">${playerName}</span> won the game!!</h1>`;
    toggleElement(elements.winDisplay, true);
};

export const hideWinnerDisplay = () => {
    toggleElement(elements.winDisplay, false);
};

// --- Trade Modals ---

export const showTradePlayerSelection = (availablePlayers) => {
     const playersHTML = availablePlayers.map(player => `
        <div class="map__box3" player-id="${player.id}" style="cursor:pointer; width: 40px; height: 40px; border-radius:50%; display:inline-flex; justify-content: center; background-color:#82cdff; margin-right:.4rem; margin-top:.8rem">
            <span class="map__char" style="border-radius:50%; border: 1px solid #000; display:inline-grid; width:100%; text-align:center; align-items: center; font-size: 22px;">${player.char}</span>
        </div>
    `).join('');

    const html = `
        <div class="map__modal" style="width: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 1.5rem; z-index: 110; background-color: rgba(255, 255, 47, 0.699); border-radius: 10px; font-size: 12px; font-weight: 300; cursor: default;">
            <h1 class="map__title">Trade with: ?</h1>
            <div class="trade-player-selection">
                ${playersHTML}
            </div>
            <button class="map__trade btn" style="font-size: 20px; display:flex; margin:auto; padding:.4rem .7rem; margin-top:1rem">Trade</button>
        </div>`;
    insertModalHTML(html);

     // Add selection listener
     let lastSelectedItem = null;
     document.querySelectorAll('.trade-player-selection .map__box3').forEach(item => {
         item.addEventListener('click', (e) => {
             if (lastSelectedItem) {
                 lastSelectedItem.children[0].style.border = "1px solid #000";
                 lastSelectedItem.children[0].style.backgroundColor = '#82cdff';
             }
             item.children[0].style.border = "1px solid orangered";
             item.children[0].style.backgroundColor = 'pink';
             lastSelectedItem = item;
             // Store selected player ID
             item.closest('.map__modal').dataset.selectedTraderId = item.getAttribute('player-id');
         });
     });
};

export const getSelectedTraderId = () => {
    const modal = document.querySelector('.map__modal');
    return modal ? modal.dataset.selectedTraderId : null;
};


export const showTradeInterface = (currentPlayer, otherPlayer) => {
    toggleElement(elements.tradeOverlay, true);
    toggleElement(elements.tradeModal, true);
    toggleElement(elements.tradeOfferOfferBtn, true);
    toggleElement(elements.tradeOfferCancelBtn, true);
    toggleElement(elements.tradeOfferAcceptBtn, false);
    toggleElement(elements.tradeOfferRejectBtn, false);

    // Enable interaction
    elements.tradeCurrentPlayerContainer.style.pointerEvents = 'initial';
    elements.tradeOtherPlayerContainer.style.pointerEvents = 'initial';

    // Set initial offer text
    elements.tradeOfferDisplay.children[0].textContent = currentPlayer.name;
    elements.tradeOfferDisplay.children[1].textContent = 'About to offer...';
};

export const hideTradeInterface = () => {
    toggleElement(elements.tradeOverlay, false);
    toggleElement(elements.tradeModal, false);
};

export const updateTradeOfferUI = (receivingPlayerName, isOfferMade) => {
     toggleElement(elements.tradeOfferOfferBtn, !isOfferMade);
     toggleElement(elements.tradeOfferCancelBtn, !isOfferMade);
     toggleElement(elements.tradeOfferAcceptBtn, isOfferMade);
     toggleElement(elements.tradeOfferRejectBtn, isOfferMade);

     elements.tradeOfferDisplay.children[0].textContent = receivingPlayerName;
     elements.tradeOfferDisplay.children[1].textContent = isOfferMade ? 'This offer I...' : 'About to offer...';

     // Lock/unlock panels
     elements.tradeCurrentPlayerContainer.style.pointerEvents = isOfferMade ? 'none' : 'initial';
     elements.tradeOtherPlayerContainer.style.pointerEvents = isOfferMade ? 'none' : 'initial';
};
