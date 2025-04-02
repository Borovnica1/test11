/**
 * Board class managing Monopoly properties and locations
 */
export class Board {
  constructor() {
    this.properties = this.initializeProperties();
    this.chanceCards = this.initializeChanceCards();
    this.communityChestCards = this.initializeCommunityChestCards();
    this.parkingMoney = 0;
  }

  initializeProperties() {
    return [
      {id: 2, title: 'Kentucky Avenue', value: 220, houses: 0, built: false, color: '#ed1b24'},
      {id: 4, title: 'Indiana Avenue', value: 220, houses: 0, built: false, color: '#ed1b24'},
      {id: 5, title: 'Illinois Avenue', value: 240, houses: 0, built: false, color: '#ed1b24'},
      {id: 7, title: 'B. & O. Railroad', value: 200, houses: 0, built: false, color: '#000000'},
      {id: 8, title: 'Atlantic Avenue', value: 260, houses: 0, built: false, color: '#fef200'},
      {id: 10, title: 'Ventnor Avenue', value: 260, houses: 0, built: false, color: '#fef200'},
      {id: 12, title: 'Water Works', value: 150, houses: 0, built: false, color: '#aae0fa'},
      {id: 13, title: 'Marvin Gardens', value: 280, houses: 0, built: false, color: '#1fb25a'},
      {id: 15, title: 'Pacific Avenue', value: 300, houses: 0, built: false, color: '#1fb25a'},
      {id: 16, title: 'North Carolina Avenue', value: 300, houses: 0, built: false, color: '#1fb25a'},
      {id: 18, title: 'Pennsylvania Avenue', value: 320, houses: 0, built: false, color: '#0072bb'},
      {id: 20, title: 'Park Place', value: 350, houses: 0, built: false, color: '#0072bb'},
      {id: 22, title: 'Boardwalk', value: 400, houses: 0, built: false, color: '#0072bb'},
      // Add remaining properties...
    ];
  }

  initializeChanceCards() {
    const cards = [
      'Advance to "Go"',
      'Advance to Illinois Avenue',
      'Advance to St. Charles Place',
      'Bank pays you dividend of $50',
      'Go Back 3 Spaces',
      'Go directly to Jail',
      'Take a walk on the Board walk',
      'You have been elected Chairman of the Board',
      'Your building and loan matures',
      'You have won a crossword competition'
    ];
    return this.shuffleCards(cards.map((text, index) => ({id: index + 1, text})));
  }

  initializeCommunityChestCards() {
    const cards = [
      'Advance to "Go"',
      'Bank error in your favor',
      'From sale of stock you get $45',
      'Xmas Fund matures',
      'Hospital Fees',
      'Pay school tax',
      'You inherit $100',
      'Receive for services $25',
      'It\'s your birthday',
      'Grand Opera Opening'
    ];
    return this.shuffleCards(cards.map((text, index) => ({id: index + 1, text})));
  }

  shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  getPropertyById(id) {
    return this.properties.find(prop => prop.id === id);
  }

  drawChanceCard() {
    const card = this.chanceCards.shift();
    this.chanceCards.push(card);
    return card;
  }

  drawCommunityChestCard() {
    const card = this.communityChestCards.shift();
    this.communityChestCards.push(card);
    return card;
  }

  updateParkingMoney(amount) {
    this.parkingMoney += amount;
  }
}
