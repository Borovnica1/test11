// Contains common DOM elements selectors and utility functions for views.

export const elements = {
  mapContainer: document.querySelector('.map'),
  statsContainer: document.querySelector('.stats'),
  diceContainer1: document.querySelector('.rollDice1'),
  diceContainer2: document.querySelector('.rollDice2'),
  playerNumberDisplay: document.querySelector('.playerNumber'),
  rollDiceBtn: document.querySelector('.rollDice'),
  endTurnBtn: document.querySelector('.endTurn'),
  startGameBtn: document.querySelector('.startGame'),
  startGameBtn2: document.querySelector('.startGame2'), // In menu
  startGameBtn3: document.querySelector('.startGame3'), // In overlay rankings
  cardModal: document.querySelector('.map__card'),
  cardModalTitle1: document.querySelector('.map__card h2:first-of-type'),
  cardModalImage: document.querySelector('.map__card img'),
  cardModalTitle2: document.querySelector('.map__card h2:last-of-type'),
  cardTakenBtn: document.querySelector('.cardTaken'),
  mapTextDisplay: document.querySelector('.map__text'),
  buyPropertyBtn: document.querySelector('.aBitLeft'),
  auctionBtn: document.querySelector('.aBitRight'),
  payRentBtn: document.querySelector('.rent'),
  qOptionBtns: document.querySelectorAll('.qOption'), // Buy/Auction buttons
  potDisplay: document.querySelector('.map__potBudget'),
  addPotDisplay: document.querySelector('.map__addPotBudget'),
  moneyPotContainer: document.querySelector('.map__moneyPot'),
  goToJailModal: document.querySelector('.map__toJail'),
  goToJailName: document.querySelector('.map__toJailName'),
  inJailModal: document.querySelector('.map__inJail'),
  inJailTurns: document.querySelector('.map__inJailTurns'),
  freeMoneyModal: document.querySelector('.map__freeMoney'),
  freeMoneyName: document.querySelector('.map__freeMoneyName'),
  winDisplay: document.querySelector('.map__winDisplay'),
  winDisplayPlayer: document.querySelector('.map__winDisplay .playerNumber'), // Reusing class, might need dedicated ID/class
  menuContainer: document.querySelector('.menu'),
  menuExpandBtns: document.querySelectorAll('.menu__menu'),
  menuExpandedContainer: document.querySelector('.menu__exp'),
  menuExpandedBtns: document.querySelectorAll('.menu__exp__btn'),
  buildBtn: document.querySelector('.build'),
  sellBtn: document.querySelector('.sell'),
  tradeBtn: document.querySelector('.trade'),
  doneBtn: document.querySelector('.done'),
  pauseBtn: document.querySelector('.pause'),
  unpauseBtn: document.querySelector('.unpause'),
  overlay: document.querySelector('.overlay'),
  overlayRankings: document.querySelector('.overlay__rankings'),
  clockDisplay: document.querySelector('.clock'),
  tradeOverlay: document.querySelector('.trade__overlay'),
  tradeModal: document.querySelector('.trade__modal'),
  tradeCurrentPlayerContainer: document.querySelector('.trade__modal .currentPlayer'),
  tradeOfferContainer: document.querySelector('.trade__modal .offer'),
  tradeOfferDisplay: document.querySelector('.trade__modal .offer__display'),
  tradeOfferButtons: document.querySelector('.trade__modal .offer__buttons'),
  tradeOfferOfferBtn: document.querySelector('.trade__modal .offer__buttons button:nth-child(1)'),
  tradeOfferCancelBtn: document.querySelector('.trade__modal .offer__buttons button:nth-child(2)'),
  tradeOfferAcceptBtn: document.querySelector('.trade__modal .offer__buttons button:nth-child(3)'),
  tradeOfferRejectBtn: document.querySelector('.trade__modal .offer__buttons button:nth-child(4)'),
  tradeOtherPlayerContainer: document.querySelector('.trade__modal .tradePlayer'),
};

// Utility function to clear content
export const clearElement = (element) => {
  if (element) {
    element.innerHTML = '';
  } else {
    console.warn('Attempted to clear a null or undefined element');
  }
};

// Utility function to show/hide element
export const toggleElement = (element, show) => {
  if (element) {
    element.style.display = show ? 'block' : 'none'; // Or 'flex', 'grid' depending on element
  } else {
    console.warn('Attempted to toggle a null or undefined element');
  }
};

// Utility function to add/remove class
export const toggleClass = (element, className, force) => {
    if (element) {
        element.classList.toggle(className, force);
    } else {
       console.warn(`Attempted to toggle class '${className}' on a null or undefined element`);
    }
};

// Render Loader/Spinner (optional)
export const renderLoader = (parent) => {
  const loader = `
    <div class="loader">
      {/* Add SVG or CSS spinner here */}
      Loading...
    </div>
  `;
  if (parent) {
    parent.insertAdjacentHTML('afterbegin', loader);
  }
};

export const clearLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) loader.parentElement.removeChild(loader);
};

// Function to get random number (from original UIController)
export const getRandomPercent = () => {
  return Math.floor(Math.random() * 100) + 1;
};
