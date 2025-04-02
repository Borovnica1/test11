// Represents a deck of Chance or Community Chest cards.
export default class CardDeck {
  constructor(cardsData) {
    this.cards = this._initializeDeck(cardsData);
    this.discardPile = [];
    this.shuffle();
  }

  _initializeDeck(cardsData) {
    // cardsData should be an array of objects, e.g., [{id: 1, text: '...', action: ...}, ...]
    return cardsData.map(card => ({ ...card })); // Create copies
  }

  shuffle() {
    // Combine deck and discard pile, then shuffle
    this.cards = this.cards.concat(this.discardPile);
    this.discardPile = [];

    // Fisher-Yates (Knuth) Shuffle
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard() {
    if (this.cards.length === 0) {
      if (this.discardPile.length === 0) {
        console.error("No cards left in deck or discard pile!");
        return null; // Or handle error appropriately
      }
      this.shuffle(); // Reshuffle discard pile into deck
    }
    const drawnCard = this.cards.shift(); // Take card from the top
    // Handle 'Get Out of Jail Free' cards - they might not go to discard immediately
    // For now, assume all cards go to discard
    this.discardPile.push(drawnCard);
    return drawnCard;
  }

  // Method to add a 'Get Out of Jail Free' card back to the deck if used
  returnCard(card) {
     const index = this.discardPile.findIndex(c => c.id === card.id && c.text === card.text);
     if (index > -1) {
       this.cards.push(...this.discardPile.splice(index, 1)); // Move from discard to deck
       this.shuffle(); // Shuffle after returning
     } else {
        console.warn("Tried to return a card not found in the discard pile:", card);
     }
  }
}
