// Represents a property on the board.
export default class Property {
  constructor(id, title, value, houses = 0, built = false, owner = null) {
    this.id = id;
    this.title = title;
    this.value = value;
    this.houses = houses; // Number of houses (0-4), 5 represents a hotel
    this.built = built; // Flag if a house was built this turn (prevents multiple builds)
    this.owner = owner; // Player object or null (bank)
    this.isMortgaged = false;
  }

  get rent() {
    // Simplified rent calculation based on original script logic
    // Needs refinement based on actual Monopoly rules (color sets, utilities, railroads)
    if (this.isMortgaged) return 0;
    if (this.houses === 0) {
      return this.value / 10; // Base rent
    } else {
      // Exponential rent increase with houses (original logic)
      // This needs to be replaced with actual Monopoly rent values based on property group and houses/hotel
      return (this.value / 10) * (2 ** this.houses);
    }
  }

  addHouse() {
    if (this.houses < 5) { // Max 4 houses + 1 hotel
      this.houses++;
      this.built = true; // Mark as built this turn
    }
  }

  sellHouse() {
    if (this.houses > 0) {
      this.houses--;
    }
  }

  setOwner(player) {
    this.owner = player;
  }

  clearOwner() {
    this.owner = null; // Back to the bank
    this.houses = 0;
    this.isMortgaged = false;
  }

  mortgage() {
    if (!this.isMortgaged && this.houses === 0) {
      this.isMortgaged = true;
      return this.value / 2; // Mortgage value
    }
    return 0;
  }

  unmortgage() {
    if (this.isMortgaged) {
      this.isMortgaged = false;
      return -(this.value / 2 * 1.1); // Unmortgage cost (10% interest)
    }
    return 0;
  }
}
