// Handles rendering and interactions for player action buttons (Roll Dice, End Turn, Menu, etc.).
import { elements, toggleElement, toggleClass } from './base.js';

// --- Turn Control Buttons ---

export const showRollDiceButton = (playerName, isInitialRoll = false) => {
    const message = isInitialRoll
        ? `<span style="color:rgb(0, 174, 255)">${playerName}</span> roll for the play order!`
        : `<span style="color:rgb(0, 174, 255)">${playerName}</span>'s turn!`;

    elements.playerNumberDisplay.innerHTML = `<h1 style="width:600px">${message}</h1>`;
    toggleElement(elements.playerNumberDisplay, true);
    toggleElement(elements.rollDiceBtn, true);
};

export const hideRollDiceButton = () => {
    toggleElement(elements.rollDiceBtn, false);
    // Keep player turn message visible until dice are rolled or turn ends
};

export const showEndTurnButton = () => {
    toggleElement(elements.endTurnBtn, true);
};

export const hideEndTurnButton = () => {
    toggleElement(elements.endTurnBtn, false);
};

// --- Main Menu Buttons ---

export const showActionButtons = () => {
    toggleElement(elements.buildBtn, true);
    toggleElement(elements.sellBtn, true);
    toggleElement(elements.tradeBtn, true);
    toggleElement(elements.menuExpandBtns[0], true); // Assuming first is the main one
    toggleElement(elements.doneBtn, false); // Ensure done is hidden initially
};

export const hideActionButtons = () => {
    toggleElement(elements.buildBtn, false);
    toggleElement(elements.sellBtn, false);
    toggleElement(elements.tradeBtn, false);
    toggleElement(elements.menuExpandBtns[0], false);
};

export const showDoneButton = () => {
    toggleElement(elements.doneBtn, true);
};

export const hideDoneButton = () => {
    toggleElement(elements.doneBtn, false);
};


// --- Expanded Menu ---
let isMenuExpanded = false;

export const toggleExpandedMenu = async () => {
    toggleClass(elements.menuExpandedContainer, 'menu__expClick');
    isMenuExpanded = !isMenuExpanded;

    if (isMenuExpanded) {
        // Wait for expansion animation before showing buttons
        await new Promise(r => setTimeout(r, 200)); // Match CSS transition duration
    }

    elements.menuExpandedBtns.forEach(btn => {
        toggleClass(btn, 'menu__exp__btnClick', isMenuExpanded);
    });
};

// --- Pause/Overlay ---

export const showOverlay = (showRankings = false) => {
    toggleElement(elements.overlay, true);
    toggleElement(elements.overlayRankings, showRankings);
    // Ensure unpause button is visible when overlay is shown without rankings
    toggleElement(elements.unpauseBtn, !showRankings);
};

export const hideOverlay = () => {
    toggleElement(elements.overlay, false);
    toggleElement(elements.overlayRankings, false);
};

// --- Clock ---
export const updateClock = (timeString) => {
    elements.clockDisplay.textContent = timeString;
};

// --- Game Start/Reset Buttons ---
export const hideStartButtons = () => {
    toggleElement(elements.startGameBtn, false); // Main start button
    // The other start buttons (startGameBtn2, startGameBtn3) are handled by their respective menus/overlays
};

export const showStartButton = () => {
     toggleElement(elements.startGameBtn, true);
}
