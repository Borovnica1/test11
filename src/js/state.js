import Player from './models/Player.js';
import Property from './models/Property.js';
import CardDeck from './models/CardDeck.js';
import * as config from './config.js';

// Central state object
export const state = {
    players: [], // Array of Player objects
    bankProperties: [], // Array of Property objects owned by the bank
    chanceDeck: null, // CardDeck object
    communityChestDeck: null, // CardDeck object
    dice: [0, 0], // Current dice roll [dice1, dice2]
    currentPlayerIndex: 0,
    gameActive: false,
    gameMode: null, // 'lastmode' or 'timemode'
    gameTimeLimit: null, // In seconds for timemode
    parkingPot: 0,
    availableChars: [],
    propertyIdMap: new Map(), // For quick lookup: propertyId -> propertyObject
    doubleRollsCount: 0,
};

// --- Initialization ---

const initializeBankProperties = () => {
    state.bankProperties = config.BOARD_SQUARES
        .filter(sq => sq.type === 'property' || sq.type === 'railroad' || sq.type === 'utility')
        .map(sq => new Property(sq.id, sq.name, sq.value, 0, false, null)); // Initially owned by bank (null)

    // Populate the map for quick lookup
    state.propertyIdMap.clear();
    state.bankProperties.forEach(prop => state.propertyIdMap.set(prop.id, prop));
};

export const initGame = () => {
    state.players = [];
    state.dice = [0, 0];
    state.currentPlayerIndex = 0;
    state.gameActive = false;
    state.gameMode = null;
    state.gameTimeLimit = null;
    state.parkingPot = 0;
    state.doubleRollsCount = 0;
    state.availableChars = [...config.CHARACTERS]; // Copy available characters

    initializeBankProperties();

    // Initialize card decks
    state.chanceDeck = new CardDeck(config.CHANCE_CARDS);
    state.communityChestDeck = new CardDeck(config.COMMUNITY_CHEST_CARDS);

    console.log("Game Initialized. State:", state);
};

// --- Player Management ---

export const addPlayer = (id, name, char) => {
    const newPlayer = new Player(id, name, char, config.STARTING_BUDGET, config.GO_SPOT_ID);
    state.players.unshift(newPlayer); // Add to the beginning as in original script
    console.log("Player added:", newPlayer, "Current Players:", state.players);
};

export const removeChar = (charIndex) => {
    if (charIndex >= 0 && charIndex < state.availableChars.length) {
        state.availableChars.splice(charIndex, 1);
    }
};

export const sortPlayersByRoll = () => {
    // Sorts based on the 'rolledNumber' property set during initial rolls
    state.players.sort((a, b) => b.rolledNumber - a.rolledNumber);
    console.log("Players sorted by roll:", state.players);
};

export const sortPlayersByBudget = () => {
    // Sorts for end-game ranking (ascending, lowest budget first for ranking display)
    state.players.sort((a, b) => a.budget - b.budget);
};

export const getCurrentPlayer = () => {
    if (state.players.length === 0) return null;
    return state.players[state.currentPlayerIndex];
};

export const nextPlayerTurn = () => {
    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    state.doubleRollsCount = 0; // Reset double roll count for the new player
    // Reset property build status for the new player's turn
    const currentPlayer = getCurrentPlayer();
    if (currentPlayer) {
        currentPlayer.properties.forEach(prop => prop.built = false);
    }
};

export const removePlayer = (playerId) => {
    const playerIndex = state.players.findIndex(p => p.id === playerId);
    if (playerIndex > -1) {
        const removedPlayer = state.players[playerIndex];
        console.log(`Removing player ${removedPlayer.name}`);

        // Return properties to bank
        removedPlayer.properties.forEach(prop => {
            prop.clearOwner(); // Resets owner, houses, mortgage status
            if (!state.propertyIdMap.has(prop.id)) { // Add back to bank if not already there (shouldn't happen often)
                 state.bankProperties.push(prop);
                 state.propertyIdMap.set(prop.id, prop);
            }
        });

        state.players.splice(playerIndex, 1);

        // Adjust currentPlayerIndex if necessary
        if (state.players.length > 0 && state.currentPlayerIndex >= state.players.length) {
            state.currentPlayerIndex = 0; // Wrap around or reset
        } else if (playerIndex < state.currentPlayerIndex) {
             state.currentPlayerIndex--; // Adjust index if removed player was before current
        }
         // If the removed player *was* the current player, the index might now point to the next player naturally.
         // If it was the *last* player, the index should wrap to 0 if players remain.

        console.log("Players after removal:", state.players);
        return removedPlayer; // Return the removed player object if needed
    }
    return null;
};


// --- Dice Rolling ---

export const rollDice = () => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    state.dice = [dice1, dice2];
    console.log(`Dice rolled: ${dice1}, ${dice2}`);

    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    // Store initial roll for sorting if game not active
    if (!state.gameActive) {
        currentPlayer.rolledNumber = dice1 + dice2;
    } else {
        // Check for doubles
        if (dice1 === dice2) {
            state.doubleRollsCount++;
            console.log(`Doubles rolled! Count: ${state.doubleRollsCount}`);
        } else {
            state.doubleRollsCount = 0; // Reset if not doubles
        }
    }
    return state.dice;
};

// --- Property Management ---
export const getPropertyById = (id) => {
    return state.propertyIdMap.get(id);
};

export const transferProperty = (propertyId, toPlayer) => {
    const property = getPropertyById(propertyId);
    if (!property) {
        console.error(`Property with ID ${propertyId} not found for transfer.`);
        return false;
    }

    const fromOwner = property.owner; // Could be null (bank) or another player

    // Remove from bank's list if owned by bank
    if (fromOwner === null) {
        const bankIndex = state.bankProperties.findIndex(p => p.id === propertyId);
        if (bankIndex > -1) {
            state.bankProperties.splice(bankIndex, 1);
        } else {
             console.warn(`Property ${propertyId} was owned by bank but not found in bankProperties list.`);
        }
    }
    // Remove from previous player owner's list
    else if (fromOwner instanceof Player) {
        fromOwner.removeProperty(propertyId);
    }

    // Add to new player's list and set owner
    if (toPlayer instanceof Player) {
        property.setOwner(toPlayer);
        toPlayer.addProperty(property);
        console.log(`Property ${property.name} transferred to ${toPlayer.name}`);
        return true;
    } else { // Transferring back to bank (e.g., bankruptcy)
        property.clearOwner();
        state.bankProperties.push(property); // Add back to bank list
        console.log(`Property ${property.name} transferred back to bank`);
        return true;
    }
    return false; // Should not happen
};


// --- Card Management ---
export const drawChanceCard = () => {
    return state.chanceDeck.drawCard();
};

export const drawCommunityChestCard = () => {
    return state.communityChestDeck.drawCard();
};

// --- Game State Updates ---
export const updateParkingPot = (amount) => {
    state.parkingPot += amount;
    console.log(`Parking Pot updated by ${amount}. New total: ${state.parkingPot}`);
};

export const setGameMode = (mode, timeLimitMinutes = null) => {
    state.gameMode = mode;
    if (mode === 'timemode' && timeLimitMinutes) {
        state.gameTimeLimit = timeLimitMinutes * 60; // Convert minutes to seconds
    } else {
        state.gameTimeLimit = null;
    }
    console.log(`Game mode set to: ${mode}, Time Limit: ${state.gameTimeLimit}s`);
};

export const startGame = () => {
    if (state.players.length >= 2) { // Need at least 2 players
        state.gameActive = true;
        state.currentPlayerIndex = 0; // Ensure first player starts
        console.log("Game Started!");
    } else {
        console.error("Cannot start game with fewer than 2 players.");
    }
};

export const checkWinCondition = () => {
    if (!state.gameActive) return null;

    if (state.gameMode === 'lastmode') {
        if (state.players.length === 1) {
            return state.players[0]; // Last player remaining wins
        }
    }
    // Time mode win condition is handled by timer expiry in controller
    return null; // No winner yet or time mode still running
};
