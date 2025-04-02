import * as state from './state.js';
import * as config from './config.js';
import { elements } from './views/base.js';
import * as boardView from './views/boardView.js';
import * as playerView from './views/playerView.js';
import * as modalView from './views/modalView.js';
import * as actionView from './views/actionView.js';

console.log('Controller loaded');

// --- Helper Functions ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Waits for a specific button within a modal to be clicked.
 * @param {string} modalSelector - CSS selector for the modal container.
 * @param {string} buttonSelector - CSS selector for the button(s) to listen on.
 * @returns {Promise<Element>} - Resolves with the clicked button element.
 */
const waitForModalButtonClick = (modalSelector, buttonSelector) => {
    return new Promise(resolve => {
        const modal = document.querySelector(modalSelector);
        if (!modal) {
            console.error(`Modal not found: ${modalSelector}`);
            // Resolve with null or reject? For now, log error and hang indefinitely.
            return;
        }
        const buttons = modal.querySelectorAll(buttonSelector);
        const clickHandler = (event) => {
            buttons.forEach(btn => btn.removeEventListener('click', clickHandler));
            resolve(event.target.closest(buttonSelector)); // Resolve with the button element
        };
        buttons.forEach(btn => btn.addEventListener('click', clickHandler));
    });
};


// --- Control Functions ---

/**
 * Manages the entire game setup process.
 */
const controlStartGame = async () => {
    console.log('Starting new game setup...');
    // 0. Reset Game State and UI
    state.initGame();
    actionView.hideStartButtons(); // Hide the main start button
    actionView.hideActionButtons();
    actionView.hideEndTurnButton();
    boardView.clearPlayerPieces([]); // Clear any old pieces
    boardView.clearAllPropertyVisuals(config.BOARD_SQUARES); // Clear property visuals
    boardView.clearParkingMoneyVisuals();
    boardView.updateParkingPot(0);
    playerView.renderPlayerDashboard([]); // Clear player panels
    modalView.removeModal(); // Clear any existing modals
    modalView.hideWinnerDisplay();
    actionView.updateClock('00:00:00');
    // TODO: Stop any running timers (if implementing time mode)

    try {
        // 1. Get Number of Players
        modalView.showPlayerNumberPanel();
        const numButton = await waitForModalButtonClick('.map__modal', '.map__player-number');
        const numPlayers = parseInt(numButton.dataset.id, 10);
        console.log(`Number of players selected: ${numPlayers}`);
        modalView.removeModal();
        await delay(100); // Short pause

        // 2. Get Game Mode
        modalView.showGameModePanel();
        const modeButton = await waitForModalButtonClick('.map__modal', '.map__mode');
        const gameMode = modeButton.dataset.id;
        let timeLimit = null;
        if (gameMode === 'timemode') {
            const timeInput = modeButton.querySelector('.map__mode-number');
            timeLimit = parseInt(timeInput.value, 10);
            if (isNaN(timeLimit) || timeLimit < 1 || timeLimit > 1000) {
                 // Show warning and retry or default? For now, default/error.
                 console.error("Invalid time limit entered.");
                 // Optionally show warning in UI:
                 // const warningEl = modeButton.querySelector('.map__mode-number-warning');
                 // warningEl.textContent = 'Positive number between 1 and 1000!';
                 // For simplicity, we'll just proceed with default or potentially error out later.
                 timeLimit = 30; // Defaulting to 30 mins if invalid
            }
        }
        state.setGameMode(gameMode, timeLimit);
        console.log(`Game mode selected: ${gameMode}, Time limit: ${timeLimit}`);
        modalView.removeModal();
        await delay(100);

        // 3. Create Players
        for (let i = 1; i <= numPlayers; i++) {
            modalView.showPlayerCreatePanel(i, state.availableChars);
            let playerData = null;
            while (!playerData) {
                const doneButton = await waitForModalButtonClick('.map__modal', '.map__done');
                playerData = modalView.getPlayerCreationInput();
                if (!playerData) {
                    console.warn("Player creation input invalid. Please enter name and select character.");
                    // Optionally show a message to the user in the modal
                }
            }
            state.addPlayer(i, playerData.name, playerData.char); // ID starts from 1
            state.removeChar(playerData.charIndex);
            console.log(`Player ${i} created: ${playerData.name}, Char: ${playerData.char}`);
            modalView.removeModal();
            await delay(100);
        }

        // 4. Initial Player Dashboard Render
        playerView.renderPlayerDashboard(state.players);
        await delay(500); // Let user see the initial dashboard

        // 5. Initial Dice Rolls for Turn Order
        console.log("Starting initial dice rolls for turn order...");
        for (const player of state.players) {
            actionView.showRollDiceButton(player.name, true); // Indicate initial roll
            elements.rollDiceBtn.disabled = false; // Ensure button is enabled

            // Wait for the current player to click the roll dice button
            await new Promise(resolve => {
                 const handler = () => {
                     elements.rollDiceBtn.removeEventListener('click', handler);
                     elements.rollDiceBtn.disabled = true; // Disable after click
                     resolve();
                 }
                 elements.rollDiceBtn.addEventListener('click', handler);
            });

            const diceValues = state.rollDice(); // Roll dice and store result in player state
            boardView.showDice(diceValues);
            playerView.updatePlayerDiceRoll(player.id, diceValues); // Show dice in stats panel
            await delay(1000); // Show dice result briefly
            boardView.hideDice();
            actionView.hideRollDiceButton(); // Hide button for next player
        }

        // 6. Sort Players and Update Dashboard
        state.sortPlayersByRoll();
        playerView.renderPlayerDashboard(state.players); // Re-render dashboard in sorted order
        // Re-display the initial rolls in the sorted dashboard
        state.players.forEach(p => {
            // Find the initial roll data (might need to store it temporarily if state.dice changes)
            // For now, assuming p.rolledNumber holds the sum, but not individual dice.
            // This part needs refinement - how to get individual dice for display after sorting?
            // Let's skip showing individual dice here for now, just the sum is stored.
             const statsRolledDiv = document.querySelector(`.stats__rolled${p.id}`);
             if(statsRolledDiv) statsRolledDiv.innerHTML = `<h2>Rolled: ${p.rolledNumber}</h2>`;
        });
        await delay(1000); // Let user see the order

        // 7. Start the Game Loop
        state.startGame();
        console.log("Setup complete. Starting game loop...");
        controlGameLoop(); // Function to handle turns

    } catch (error) {
        console.error("Error during game setup:", error);
        // Optionally reset UI or show error message
        actionView.showStartButton(); // Show start button again if setup fails
    }
};

/**
 * Main game loop handler.
 */
const controlGameLoop = async () => {
    console.log("Entering game loop...");
    while (state.gameActive) {
        const currentPlayer = state.getCurrentPlayer();
        if (!currentPlayer) {
            console.error("No current player found. Exiting loop.");
            state.gameActive = false;
            break;
        }

        console.log(`--- ${currentPlayer.name}'s Turn ---`);
        playerView.highlightCurrentPlayer(currentPlayer.id, true);

        // --- Turn Start ---
        // Reset turn-specific flags (e.g., property build status) - done in state.nextPlayerTurn

        // --- Handle Jail ---
        if (currentPlayer.inJail > 0) {
            console.log(`${currentPlayer.name} is in jail for ${currentPlayer.inJail} more turns.`);
            modalView.showInJail(currentPlayer.name, currentPlayer.inJail);
            await delay(2000); // Show message
            modalView.hideInJail();
            // TODO: Implement jail options (pay fine, use card, roll doubles)
            // For now, just skip turn and decrement jail time
            currentPlayer.inJail--;
            // End turn immediately if still in jail
             await endTurnSequence(currentPlayer);
             continue; // Skip to next player
        }

        // --- Roll Dice Phase ---
        let rolledDoubles = false;
        do {
            actionView.showRollDiceButton(currentPlayer.name);
            elements.rollDiceBtn.disabled = false;

            // Wait for roll
             await new Promise(resolve => {
                 const handler = () => {
                     elements.rollDiceBtn.removeEventListener('click', handler);
                     elements.rollDiceBtn.disabled = true;
                     resolve();
                 }
                 elements.rollDiceBtn.addEventListener('click', handler);
            });
            actionView.hideRollDiceButton(); // Hide button after roll

            const diceValues = state.rollDice();
            rolledDoubles = diceValues[0] === diceValues[1];
            boardView.showDice(diceValues);
            playerView.updatePlayerDiceRoll(currentPlayer.id, diceValues);
            await delay(1000); // Show dice
            boardView.hideDice();

            // --- Movement Phase ---
            const previousSpot = currentPlayer.mapSpot;
            const diceTotal = diceValues[0] + diceValues[1];
            currentPlayer.moveTo(previousSpot + diceTotal);
            console.log(`${currentPlayer.name} moves ${diceTotal} spaces to square ${currentPlayer.mapSpot} (${config.getSquareById(currentPlayer.mapSpot)?.name})`);
            boardView.updatePlayerSpot(currentPlayer); // Animate or update piece position
            await delay(500); // Short delay after movement

            // --- Action Phase (Landing on Square) ---
            // Check for passing GO first
            if (currentPlayer.mapSpot < previousSpot && previousSpot !== config.JAIL_SPOT_ID) { // Passed GO (handle jail exit case)
                 console.log(`${currentPlayer.name} passed GO!`);
                 currentPlayer.updateBudget(config.PASS_GO_SALARY);
                 playerView.showMoneyChange(currentPlayer.id, config.PASS_GO_SALARY, '+');
                 modalView.showCardModal({ type: 'go', title1: 'You passed:', title2: `Bank gives you $${config.PASS_GO_SALARY}!`, imageSrc: `dices/${config.GO_SPOT_ID}.jpg` });
                 await delay(1500);
                 playerView.hideMoneyChange(currentPlayer.id, currentPlayer.budget);
                 modalView.hideCardModal();
            }

            // Handle landing on the specific square type
            const currentSquare = config.getSquareById(currentPlayer.mapSpot);
            await handleSquareLanding(currentPlayer, currentSquare, diceTotal);

            // --- Post-Action Checks ---
            // Check for bankruptcy after actions
            if (currentPlayer.budget < 0) {
                 console.log(`${currentPlayer.name} is potentially bankrupt!`);
                 // TODO: Implement mortgage/sell logic before declaring bankruptcy
                 modalView.showBankruptcyMessage(currentPlayer.name);
                 await delay(2000);
                 state.removePlayer(currentPlayer.id); // Remove player from state
                 playerView.removePlayerDisplay(currentPlayer.id); // Remove from UI
                 boardView.clearAllPropertyVisuals(currentPlayer.properties); // Clear their property visuals
                 rolledDoubles = false; // Bankrupt player doesn't get extra turn
                 break; // End this player's turn immediately
            }

             // Check for Go To Jail (landing on square or 3 doubles)
             if (currentSquare?.type === 'goToJail' || state.doubleRollsCount === 3) {
                 if (state.doubleRollsCount === 3) console.log("3 doubles rolled!");
                 modalView.showGoToJail(currentPlayer.name);
                 await delay(2000);
                 modalView.hideGoToJail();
                 currentPlayer.goToJail();
                 boardView.updatePlayerSpot(currentPlayer); // Move piece to jail
                 rolledDoubles = false; // No extra turn after going to jail
                 break; // End turn immediately
             }


        } while (rolledDoubles && state.gameActive && !currentPlayer.isBankrupt); // Loop if doubles were rolled and player is still in game

        // --- End Turn Phase ---
        if (!currentPlayer.isBankrupt && state.gameActive) {
             await endTurnSequence(currentPlayer);
        }

        // Check for win condition after turn potentially removes a player
        const winner = state.checkWinCondition();
        if (winner) {
            console.log(`Winner detected: ${winner.name}`);
            modalView.showWinnerDisplay(winner.name);
            playerView.renderPlayerDashboard(state.players, true); // Show final rankings
            actionView.showOverlay(true); // Show overlay with rankings
            state.gameActive = false; // Stop the loop
        }

        // TODO: Check time limit if in time mode

    } // End while(state.gameActive)
    console.log("Game loop finished.");
     actionView.showStartButton(); // Show start button again
};

/**
 * Handles the sequence of events when a player lands on a square.
 */
const handleSquareLanding = async (player, square, diceTotal) => {
    if (!square) return;
    console.log(`Handling landing on: ${square.name} (Type: ${square.type})`);

    switch (square.type) {
        case 'property':
        case 'railroad':
        case 'utility':
            await handlePropertyLanding(player, square);
            break;
        case 'chance':
            await handleCardDraw(player, 'chance');
            break;
        case 'communityChest':
            await handleCardDraw(player, 'communityChest');
            break;
        case 'tax':
            await handleTaxLanding(player, square);
            break;
        case 'go':
            // Passing GO handled earlier, landing bonus (if any) could be added here
            console.log("Landed on GO.");
            break;
        case 'jail':
            console.log("Just visiting jail.");
            break;
        case 'freeParking':
            await handleFreeParkingLanding(player);
            break;
        case 'goToJail':
            // Action handled in main loop after this function returns
            console.log("Landing on Go To Jail square.");
            break;
        default:
            console.log(`Landed on unhandled square type: ${square.type}`);
    }
};

/**
 * Handles landing on a property, railroad, or utility.
 */
const handlePropertyLanding = async (player, square) => {
    const property = state.getPropertyById(square.id);
    if (!property) {
        console.error(`Property state not found for square ID: ${square.id}`);
        return;
    }

    if (property.owner === null) { // Available to buy
        console.log(`${square.name} is unowned.`);
        modalView.showCardModal({
            type: 'property',
            title1: `You landed on: ${square.name}`,
            title2: `Cost: $${property.value}`,
            imageSrc: `dices/${square.id}.jpg`,
            showBuy: true,
            showAuction: true,
            auctionStartPrice: Math.floor(property.value / 2),
        });

        const clickedButton = await waitForModalButtonClick('.map__card', '.qOption');
        modalView.hideCardModal();

        if (clickedButton.classList.contains('aBitLeft')) { // Buy Property
            if (player.budget >= property.value) {
                player.updateBudget(-property.value);
                state.transferProperty(property.id, player);
                state.updateParkingPot(property.value); // Add cost to pot (as per original script)
                playerView.showMoneyChange(player.id, property.value, '-');
                playerView.updateStatsCards(player); // Update player's card display
                boardView.showParkingMoneyAdded(property.value, state.parkingPot); // Show money added to pot
                await delay(1500);
                playerView.hideMoneyChange(player.id, player.budget);
            } else {
                console.log("Not enough funds to buy.");
                // TODO: Implement auction automatically if cannot afford? Standard rules vary.
                 await handleAuction(player, property); // Start auction if cannot buy
            }
        } else { // Auction
             await handleAuction(player, property);
        }

    } else if (property.owner !== player && !property.isMortgaged) { // Owned by another player, not mortgaged
        console.log(`${square.name} is owned by ${property.owner.name}.`);
        const rent = property.rent; // Use the getter in Property model (needs refinement)
        // TODO: Refine rent calculation based on monopolies, utilities owned, railroads owned.
        console.log(`Rent is $${rent}`);

        modalView.showCardModal({
            type: 'propertyTaken',
            title1: `You landed on: ${square.name}`,
            title2: `Owner: ${property.owner.name}`,
            imageSrc: `dices/${square.id}.jpg`,
            showRent: true,
            rentAmount: rent,
        });

        await waitForModalButtonClick('.map__card', '.rent');
        modalView.hideCardModal();

        player.updateBudget(-rent);
        property.owner.updateBudget(rent);
        playerView.showMoneyChange(player.id, rent, '-');
        playerView.showMoneyChange(property.owner.id, rent, '+');
        await delay(1500);
        playerView.hideMoneyChange(player.id, player.budget);
        playerView.hideMoneyChange(property.owner.id, property.owner.budget);

    } else if (property.owner === player) {
        console.log(`Landed on own property: ${square.name}`);
    } else if (property.isMortgaged) {
         console.log(`${square.name} is mortgaged. No rent due.`);
         // Show message?
    }
};

/**
 * Handles the auction process for a property.
 */
 const handleAuction = async (landingPlayer, property) => {
     console.log(`Starting auction for ${property.name}`);
     let currentBid = Math.floor(property.value / 2);
     let highestBidder = null;
     let bidders = [...state.players]; // Start with all players
     let currentPlayerIndex = state.players.indexOf(landingPlayer); // Start bidding after the landing player

     while (bidders.length > 1) {
         currentPlayerIndex = (currentPlayerIndex + 1) % bidders.length;
         const currentBidder = bidders[currentPlayerIndex];

         console.log(`Auction turn: ${currentBidder.name}, Current Bid: $${currentBid}. Bidders left: ${bidders.map(b=>b.name)}`);

         const nextBidMin = Math.floor(currentBid + (currentBid / 5)); // Suggest next bid (original logic)
         const canAffordNext = currentBidder.budget >= nextBidMin;

         modalView.showCardModal({
             type: 'auction',
             title1: `Auction for: ${property.name}`,
             title2: `Current Bid: $${currentBid} ${highestBidder ? '('+highestBidder.name+')' : ''}`,
             imageSrc: `dices/${property.id}.jpg`,
             showAuction: true, // Re-uses the buy/auction buttons
             ownerName: currentBidder.name, // Player whose turn it is to bid/fold
             price: canAffordNext ? nextBidMin : currentBid + 1, // Show next possible bid
         });
         // Modify button text for clarity
         elements.buyPropertyBtn.textContent = canAffordNext ? `Bid $${nextBidMin}` : `Bid $${currentBid + 1}`; // Allow bidding $1 more if cannot afford suggested
         elements.auctionBtn.textContent = 'Fold';


         const clickedButton = await waitForModalButtonClick('.map__card', '.qOption');

         if (clickedButton.classList.contains('aBitLeft')) { // Bid
             // Determine actual bid amount based on button text
             const bidText = elements.buyPropertyBtn.textContent;
             const bidAmount = parseInt(bidText.match(/\$(\d+)/)[1], 10);

             if (currentBidder.budget >= bidAmount) {
                 currentBid = bidAmount;
                 highestBidder = currentBidder;
                 console.log(`${currentBidder.name} bids $${currentBid}`);
             } else {
                 console.log(`${currentBidder.name} cannot afford bid $${bidAmount}. Folding.`);
                 // Fold player
                 bidders.splice(currentPlayerIndex, 1);
                 currentPlayerIndex--; // Adjust index because array shrunk
             }
         } else { // Fold
             console.log(`${currentBidder.name} folds.`);
             bidders.splice(currentPlayerIndex, 1);
             currentPlayerIndex--; // Adjust index
         }
         modalView.hideCardModal(); // Hide modal between bids/folds
         await delay(100); // Small delay
     }

     // Auction ends
     const winner = bidders[0]; // Last remaining bidder
     console.log(`Auction won by ${winner.name} for $${currentBid}`);

     modalView.showCardModal({
         type: 'auctionWinner',
         title1: `Winner is: ${winner.name}`,
         title2: `Cost: $${currentBid}`,
         imageSrc: `dices/${property.id}.jpg`,
     });
     await delay(2000);
     modalView.hideCardModal();

     // Process payment and property transfer
     winner.updateBudget(-currentBid);
     state.transferProperty(property.id, winner);
     state.updateParkingPot(currentBid); // Add winning bid to pot
     playerView.showMoneyChange(winner.id, currentBid, '-');
     playerView.updateStatsCards(winner);
     boardView.showParkingMoneyAdded(currentBid, state.parkingPot);
     await delay(1500);
     playerView.hideMoneyChange(winner.id, winner.budget);

     // Check if winner went bankrupt
     if (winner.budget < 0) {
         console.log(`${winner.name} went bankrupt from auction!`);
         modalView.showBankruptcyMessage(winner.name);
         await delay(2000);
         state.removePlayer(winner.id);
         playerView.removePlayerDisplay(winner.id);
         boardView.clearAllPropertyVisuals(winner.properties); // Properties already returned to bank by removePlayer
     }
 };


/**
 * Handles drawing and processing a Chance or Community Chest card.
 */
const handleCardDraw = async (player, deckType) => {
    console.log(`Drawing ${deckType} card...`);
    const card = deckType === 'chance' ? state.drawChanceCard() : state.drawCommunityChestCard();
    if (!card) return;

    console.log(`Card drawn: ${card.text}`);
    modalView.showCardModal({
        type: deckType,
        title1: `You landed on: ${deckType === 'chance' ? 'Chance' : 'Community Chest'}`,
        title2: `${deckType === 'chance' ? 'Chance' : 'Community Chest'} time!!`,
        imageSrc: `dices/${player.mapSpot}.jpg`, // Use square image
        showTakeCard: true,
    });

    await waitForModalButtonClick('.map__card', '.cardTaken');
    modalView.hideCardModal();
    await delay(200);

    modalView.showCardText(card.text, deckType);
    await delay(2500); // Show card text

    // --- Execute Card Action ---
    let passedGo = false;
    const originalSpot = player.mapSpot;

    switch (card.action) {
        case 'moveto':
            player.moveTo(card.value);
            console.log(`Moved to square ${card.value}`);
            // Check if passed GO after moving
            if (card.value < originalSpot && card.value !== config.JAIL_SPOT_ID) {
                 passedGo = true;
            }
            break;
        case 'move':
            player.moveTo(player.mapSpot + card.value);
            console.log(`Moved ${card.value} spaces to ${player.mapSpot}`);
             if (player.mapSpot < originalSpot && card.value < 0) { // Moved backwards past GO
                 // No salary for moving backwards past GO
             } else if (player.mapSpot < originalSpot && card.value > 0) { // Moved forwards past GO
                 passedGo = true;
             }
            break;
        case 'addfunds':
            player.updateBudget(card.value);
            playerView.showMoneyChange(player.id, card.value, '+');
            break;
        case 'removefunds':
            player.updateBudget(-card.value);
            state.updateParkingPot(card.value); // Add tax/fee to pot
            playerView.showMoneyChange(player.id, card.value, '-');
            boardView.showParkingMoneyAdded(card.value, state.parkingPot);
            break;
        case 'payplayers':
            let totalPaid = 0;
            state.players.forEach(otherPlayer => {
                if (otherPlayer !== player) {
                    player.updateBudget(-card.value);
                    otherPlayer.updateBudget(card.value);
                    playerView.showMoneyChange(otherPlayer.id, card.value, '+');
                    totalPaid += card.value;
                }
            });
            playerView.showMoneyChange(player.id, totalPaid, '-');
            break;
        case 'collectfromplayers':
             let totalCollected = 0;
             state.players.forEach(otherPlayer => {
                 if (otherPlayer !== player) {
                     otherPlayer.updateBudget(-card.value); // Player pays
                     player.updateBudget(card.value);      // Current player collects
                     playerView.showMoneyChange(otherPlayer.id, card.value, '-');
                     totalCollected += card.value;
                 }
             });
             playerView.showMoneyChange(player.id, totalCollected, '+');
            break;
        case 'gotojail':
            player.goToJail();
            break;
        // case 'getoutofjail':
        //     player.addGetOutOfJailCard(deckType); // Need to add this method to Player model
        //     // This card is held, not discarded immediately
        //     // state[deckType === 'chance' ? 'chanceDeck' : 'communityChestDeck'].holdCard(card); // Need method in CardDeck
        //     break;
        // case 'propertycharges':
        //     // TODO: Implement property charges logic
        //     break;
        // case 'movenearest':
        //     // TODO: Implement move to nearest utility/railroad logic
        //     break;
        default:
            console.warn(`Unhandled card action: ${card.action}`);
    }

    modalView.hideCardText();

    // Update visuals after action
    if (['addfunds', 'removefunds', 'payplayers', 'collectfromplayers'].includes(card.action)) {
        await delay(1500); // Show money changes
        playerView.hideMoneyChange(player.id, player.budget);
        state.players.forEach(p => {
            if (p !== player) playerView.hideMoneyChange(p.id, p.budget);
        });
    }

    if (['moveto', 'move', 'gotojail'].includes(card.action)) {
        boardView.updatePlayerSpot(player); // Update piece position
        await delay(500);
         // Handle passing GO salary if applicable
         if (passedGo) {
             console.log(`${player.name} passed GO from card!`);
             player.updateBudget(config.PASS_GO_SALARY);
             playerView.showMoneyChange(player.id, config.PASS_GO_SALARY, '+');
             modalView.showCardModal({ type: 'go', title1: 'You passed:', title2: `Bank gives you $${config.PASS_GO_SALARY}!`, imageSrc: `dices/${config.GO_SPOT_ID}.jpg` });
             await delay(1500);
             playerView.hideMoneyChange(player.id, player.budget);
             modalView.hideCardModal();
         }
        // If moved, recursively handle landing on the new square
        const newSquare = config.getSquareById(player.mapSpot);
        await handleSquareLanding(player, newSquare, 0); // diceTotal 0 as it wasn't a dice roll move
    }
};

/**
 * Handles landing on a tax square.
 */
const handleTaxLanding = async (player, square) => {
    const taxAmount = square.value;
    console.log(`Landed on ${square.name}. Paying $${taxAmount}`);
    modalView.showCardModal({
        type: 'tax',
        title1: `Unfortunately you landed on: ${square.name}`,
        title2: `You gotta pay $${taxAmount}`,
        imageSrc: `dices/${square.id}.jpg`,
    });
    await delay(2000); // Show message
    modalView.hideCardModal();

    player.updateBudget(-taxAmount);
    state.updateParkingPot(taxAmount); // Add tax to pot
    playerView.showMoneyChange(player.id, taxAmount, '-');
    boardView.showParkingMoneyAdded(taxAmount, state.parkingPot);
    await delay(1500);
    playerView.hideMoneyChange(player.id, player.budget);
};

/**
 * Handles landing on the Free Parking square.
 */
const handleFreeParkingLanding = async (player) => {
    console.log("Landed on Free Parking.");
    if (state.parkingPot > 0) {
        console.log(`Collecting $${state.parkingPot} from the pot!`);
        modalView.showFreeParking(player.name);
        await delay(1000); // Show modal briefly

        player.updateBudget(state.parkingPot);
        playerView.showMoneyChange(player.id, state.parkingPot, '+');
        state.updateParkingPot(-state.parkingPot); // Reset pot to 0
        boardView.clearParkingMoneyVisuals(); // Clear money images
        boardView.updateParkingPot(0); // Update display

        await delay(1500);
        playerView.hideMoneyChange(player.id, player.budget);
        modalView.hideFreeParking();
    } else {
        console.log("Parking pot is empty.");
        // Optionally show a simple "Free Parking" message modal
    }
};

/**
 * Handles the end-of-turn sequence (showing button, waiting, cleanup).
 */
const endTurnSequence = async (player) => {
     console.log("Ending turn sequence...");
     actionView.showEndTurnButton();
     elements.endTurnBtn.disabled = false;

     await new Promise(resolve => {
         const handler = () => {
             elements.endTurnBtn.removeEventListener('click', handler);
             elements.endTurnBtn.disabled = true;
             resolve();
         }
         elements.endTurnBtn.addEventListener('click', handler);
     });

     actionView.hideEndTurnButton();
     playerView.highlightCurrentPlayer(player.id, false); // Unhighlight current player
     state.nextPlayerTurn(); // Advance to next player in state
}


// --- Event Listeners Setup ---

const setupEventListeners = () => {
    console.log('Setting up event listeners...');
    // Start Game Buttons
    elements.startGameBtn.addEventListener('click', controlStartGame);
    elements.startGameBtn2.addEventListener('click', controlStartGame); // Assumes it's always visible or handled by menu toggle
    elements.startGameBtn3.addEventListener('click', controlStartGame); // Assumes it's always visible or handled by overlay toggle

    // --- In-Game Action Buttons ---
    // Roll Dice: Listener added dynamically in controlGameLoop/controlStartGame
    // End Turn: Listener added dynamically in endTurnSequence

    // Menu Buttons
    elements.menuExpandBtns.forEach(btn => btn.addEventListener('click', actionView.toggleExpandedMenu));
    elements.pauseBtn.addEventListener('click', () => {
        actionView.showOverlay();
        // TODO: Pause timer if time mode is active
    });
     elements.unpauseBtn.addEventListener('click', () => {
        actionView.hideOverlay();
         // TODO: Resume timer if time mode is active
     });

    // Build/Sell/Trade/Done - Listeners might be better added when buttons are shown
    elements.buildBtn.addEventListener('click', controlBuildSellMode.bind(null, true)); // true for build mode
    elements.sellBtn.addEventListener('click', controlBuildSellMode.bind(null, false)); // false for sell mode
    elements.doneBtn.addEventListener('click', controlExitBuildSellMode);
    elements.tradeBtn.addEventListener('click', controlTradeSequence);

    // Property Action Buttons (Buy/Auction/Rent) - Listeners added dynamically when modal shown

    // Card Action Button (Take Card) - Listener added dynamically when modal shown

    // Trade Modal Buttons
    elements.tradeOfferOfferBtn.addEventListener('click', handleTradeOffer);
    elements.tradeOfferCancelBtn.addEventListener('click', handleTradeCancel);
    elements.tradeOfferAcceptBtn.addEventListener('click', handleTradeAccept);
    elements.tradeOfferRejectBtn.addEventListener('click', handleTradeReject);

    // Build/Sell Click Listener (on map container)
    elements.mapContainer.addEventListener('click', handleBuildSellClick);

    // Trade Property Click Listener (on trade modal containers)
    elements.tradeCurrentPlayerContainer.addEventListener('click', handleTradePropertyClick);
    elements.tradeOtherPlayerContainer.addEventListener('click', handleTradePropertyClick);


    console.log('Event listeners set up.');
};

// --- Control Functions for Specific Actions (Build/Sell, Trade) ---

let buildSellModeActive = false;
let isBuilding = false;
let buildableProperties = [];

const controlBuildSellMode = (buildMode) => {
    if (buildSellModeActive) return; // Prevent entering mode again if already active

    const player = state.getCurrentPlayer();
    if (!player) return;

    isBuilding = buildMode;
    buildSellModeActive = true;
    console.log(`Entering ${buildMode ? 'Build' : 'Sell'} mode for ${player.name}`);

    actionView.hideActionButtons();
    actionView.showDoneButton();

    // Determine eligible properties
    // TODO: Implement logic to find properties eligible for building/selling
    // - Must own all properties in a color group (monopoly)
    // - Cannot build if any property in group is mortgaged
    // - Houses must be built evenly across the group
    // - Selling must also happen evenly
    // - Max 4 houses / 1 hotel per property
    buildableProperties = player.properties // Placeholder: Allow all owned properties for now
         .filter(p => p.type === 'property') // Only properties, not RR/Utilities
         .filter(p => buildMode ? p.houses < config.HOTEL_LEVEL : p.houses > 0) // Can build if < hotel, can sell if > 0 houses
         .filter(p => !p.built || !buildMode) // Cannot build twice in one turn
         .map(p => p.id);

    console.log("Eligible properties:", buildableProperties);
    boardView.highlightBuildableProperties(buildableProperties, isBuilding);
};

const controlExitBuildSellMode = () => {
    if (!buildSellModeActive) return;

    console.log("Exiting Build/Sell mode.");
    boardView.removeBuildableHighlights(buildableProperties);
    buildableProperties = [];
    buildSellModeActive = false;
    actionView.hideDoneButton();
    actionView.showActionButtons();
};

const handleBuildSellClick = async (event) => {
    if (!buildSellModeActive) return;

    const overlay = event.target.closest('.map__buildSell');
    if (!overlay) return;

    const mapBox = overlay.closest('.map__box');
    const propertyId = parseInt(mapBox.dataset.id, 10);

    if (!buildableProperties.includes(propertyId)) return; // Clicked on non-eligible property

    const player = state.getCurrentPlayer();
    const property = state.getPropertyById(propertyId);

    if (!player || !property) return;

    // Check affordability for building
    const houseCost = config.getSquareById(propertyId)?.houseCost || 9999; // Get house cost
    if (isBuilding && player.budget < houseCost) {
        console.log("Not enough funds to build.");
        // TODO: Show message to user?
        return;
    }

    console.log(`${isBuilding ? 'Building on' : 'Selling from'} ${property.name}`);

    // Update state
    const moneyChange = isBuilding ? -houseCost : (houseCost / 2); // Sell price is half cost
    const sign = isBuilding ? '-' : '+';
    player.updateBudget(moneyChange);
    if (isBuilding) {
        property.addHouse();
    } else {
        property.sellHouse();
    }

    // Update UI
    boardView.renderHouses(property); // Update house visuals on board
    playerView.showMoneyChange(player.id, Math.abs(moneyChange), sign);
    playerView.updateStatsCards(player); // Update property list if needed (though houses aren't shown there)

    // Remove highlight for this property as action is done (or mark as built)
    boardView.removeBuildableHighlights([propertyId]);
    const index = buildableProperties.indexOf(propertyId);
    if (index > -1) buildableProperties.splice(index, 1); // Remove from clickable list for this turn if built

    // Re-highlight remaining properties if needed (or update text if house count changed)
    // boardView.highlightBuildableProperties(buildableProperties, isBuilding); // Re-apply highlights might be complex due to listeners

    await delay(1000);
    playerView.hideMoneyChange(player.id, player.budget);

     // If built, mark property as built this turn
     if (isBuilding) property.built = true;

     // Re-evaluate buildable properties if needed (e.g., if max houses reached)
     // For simplicity, we might just let the user click Done to refresh.
};


// --- Trade Sequence ---
let tradeState = {
    isActive: false,
    initiator: null,
    recipient: null,
    initiatorOffer: { properties: [], money: 0 },
    recipientOffer: { properties: [], money: 0 },
    isOfferMade: false,
};

const controlTradeSequence = async () => {
    if (tradeState.isActive) return;

    const initiator = state.getCurrentPlayer();
    if (!initiator || state.players.length < 2) {
        console.log("Cannot trade with fewer than 2 players.");
        return;
    }

    tradeState.isActive = true;
    tradeState.initiator = initiator;
    tradeState.isOfferMade = false;
    tradeState.initiatorOffer = { properties: [], money: 0 };
    tradeState.recipientOffer = { properties: [], money: 0 };


    console.log(`Starting trade sequence for ${initiator.name}`);
    actionView.hideActionButtons(); // Hide main buttons during trade

    // 1. Select Player to Trade With
    const availablePlayers = state.players.filter(p => p !== initiator);
    if (availablePlayers.length === 0) {
         console.log("No other players to trade with.");
         tradeState.isActive = false;
         actionView.showActionButtons();
         return;
    } else if (availablePlayers.length === 1) {
        tradeState.recipient = availablePlayers[0]; // Auto-select if only one option
    } else {
        modalView.showTradePlayerSelection(availablePlayers);
        const selectedId = await new Promise(resolve => {
             const handler = async () => {
                 const id = modalView.getSelectedTraderId();
                 if (id) {
                     modal.removeEventListener('click', handler); // Clean up listener
                     resolve(id);
                 }
             };
             const modal = document.querySelector('.map__modal');
             // Listen for click on the main trade button within the modal
             modal.querySelector('.map__trade').addEventListener('click', handler);
        });

        modalView.removeModal();
        if (!selectedId) { // User might have closed modal without selecting
            console.log("Trade cancelled - no player selected.");
            tradeState.isActive = false;
            actionView.showActionButtons();
            return;
        }
        tradeState.recipient = state.players.find(p => p.id === parseInt(selectedId, 10));
    }

    if (!tradeState.recipient) {
         console.error("Selected recipient not found.");
         tradeState.isActive = false;
         actionView.showActionButtons();
         return;
    }

    console.log(`Trading with ${tradeState.recipient.name}`);

    // 2. Show Trade Interface
    playerView.renderTradePlayerPanel(tradeState.initiator, '.currentPlayer');
    playerView.renderTradePlayerPanel(tradeState.recipient, '.tradePlayer');
    modalView.showTradeInterface(tradeState.initiator, tradeState.recipient);

    // Event listeners for property clicks and buttons are added in setupEventListeners

};

const handleTradePropertyClick = (event) => {
    if (!tradeState.isActive || tradeState.isOfferMade) return; // Don't allow changes after offer

    const cardSpan = event.target.closest('span[card-id]');
    if (!cardSpan) return;

    const propertyId = parseInt(cardSpan.getAttribute('card-id'), 10);
    const isInitiatorPanel = event.target.closest('.currentPlayer');
    const targetOffer = isInitiatorPanel ? tradeState.initiatorOffer : tradeState.recipientOffer;
    const player = isInitiatorPanel ? tradeState.initiator : tradeState.recipient;

    // Check if property actually belongs to this player
    if (!player.properties.some(p => p.id === propertyId)) return;

    const propertyIndex = targetOffer.properties.indexOf(propertyId);
    let isSelecting = false;
    if (propertyIndex > -1) {
        targetOffer.properties.splice(propertyIndex, 1); // Remove if already selected
        isSelecting = false;
    } else {
        targetOffer.properties.push(propertyId); // Add if not selected
        isSelecting = true;
    }

    playerView.toggleTradePropertySelection(cardSpan, isSelecting, isInitiatorPanel);
    console.log("Current Trade State:", tradeState);
};

const handleTradeOffer = () => {
    if (!tradeState.isActive || tradeState.isOfferMade) return;

    // Get money amounts from inputs
    const initiatorMoneyInput = document.querySelector(`.offer__money${tradeState.initiator.id + 10}`);
    const recipientMoneyInput = document.querySelector(`.offer__money${tradeState.recipient.id + 10}`);
    tradeState.initiatorOffer.money = parseInt(initiatorMoneyInput.value, 10) || 0;
    tradeState.recipientOffer.money = parseInt(recipientMoneyInput.value, 10) || 0;

    // Basic validation (ensure amounts don't exceed budget - input handles max, check min=0)
    if (tradeState.initiatorOffer.money < 0 || tradeState.recipientOffer.money < 0) {
        console.error("Invalid money amount in trade offer.");
        // TODO: Show user feedback
        return;
    }
     if (tradeState.initiatorOffer.money > tradeState.initiator.budget || tradeState.recipientOffer.money > tradeState.recipient.budget) {
         console.error("Trade offer exceeds player budget.");
         // TODO: Show user feedback
         return;
     }


    console.log("Offer made:", tradeState);
    tradeState.isOfferMade = true;
    modalView.updateTradeOfferUI(tradeState.recipient.name, true); // Update UI for recipient to respond
};

const handleTradeCancel = () => {
    if (!tradeState.isActive) return;
    console.log("Trade cancelled by initiator.");
    resetTradeStateAndUI();
};

const handleTradeAccept = async () => {
    if (!tradeState.isActive || !tradeState.isOfferMade) return;
    console.log("Trade accepted by recipient.");

    // --- Execute the trade ---
    const { initiator, recipient, initiatorOffer, recipientOffer } = tradeState;

    // 1. Exchange Money
    const netMoneyInitiator = recipientOffer.money - initiatorOffer.money;
    const netMoneyRecipient = initiatorOffer.money - recipientOffer.money;

    initiator.updateBudget(netMoneyInitiator);
    recipient.updateBudget(netMoneyRecipient);

    // 2. Exchange Properties
    initiatorOffer.properties.forEach(propId => state.transferProperty(propId, recipient));
    recipientOffer.properties.forEach(propId => state.transferProperty(propId, initiator));

    // --- Update UI ---
    console.log("Updating UI after trade...");
    playerView.showMoneyChange(initiator.id, Math.abs(netMoneyInitiator), netMoneyInitiator >= 0 ? '+' : '-');
    playerView.showMoneyChange(recipient.id, Math.abs(netMoneyRecipient), netMoneyRecipient >= 0 ? '+' : '-');

    // Update stats cards for both players AFTER properties are transferred in state
    playerView.updateStatsCards(initiator);
    playerView.updateStatsCards(recipient);

    await delay(1500); // Show money change briefly
    playerView.hideMoneyChange(initiator.id, initiator.budget);
    playerView.hideMoneyChange(recipient.id, recipient.budget);

    resetTradeStateAndUI();

     // Check bankruptcy after trade
     [initiator, recipient].forEach(async p => {
         if (p.budget < 0) {
             console.log(`${p.name} went bankrupt after trade!`);
             modalView.showBankruptcyMessage(p.name);
             await delay(2000);
             state.removePlayer(p.id);
             playerView.removePlayerDisplay(p.id);
             boardView.clearAllPropertyVisuals(p.properties);
         }
     });

};

const handleTradeReject = () => {
    if (!tradeState.isActive || !tradeState.isOfferMade) return;
    console.log("Trade rejected by recipient.");
    resetTradeStateAndUI();
};

const resetTradeStateAndUI = () => {
     console.log("Resetting trade state and UI.");
     modalView.hideTradeInterface();
     // Reset panels visually (clear selections, money)
     if(tradeState.initiator) playerView.resetTradePlayerPanel(tradeState.initiator);
     if(tradeState.recipient) playerView.resetTradePlayerPanel(tradeState.recipient);

     tradeState = { // Reset state object
         isActive: false,
         initiator: null,
         recipient: null,
         initiatorOffer: { properties: [], money: 0 },
         recipientOffer: { properties: [], money: 0 },
         isOfferMade: false,
     };
     actionView.showActionButtons(); // Show main buttons again
}


// --- Initialization ---

const init = () => {
    console.log('Application has started.');
    setupEventListeners();
    // Show start button initially
    actionView.showStartButton();
    // Hide other elements that shouldn't be visible at start
    actionView.hideActionButtons();
    actionView.hideEndTurnButton();
    actionView.hideDoneButton();
    modalView.hideCardModal();
    modalView.hideCardText();
    modalView.hideGoToJail();
    modalView.hideInJail();
    modalView.hideFreeParking();
    modalView.hideWinnerDisplay();
    modalView.hideTradeInterface();
    boardView.hideDice();
    actionView.hideOverlay();

};

init();
