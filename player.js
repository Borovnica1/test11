/**
 * Player class representing a Monopoly player
 */
export class Player {
  constructor(id, name, char, budget = 600, mapSpot = 21, rolledNumber = 0, inJail = 0, properties = []) {
    this.id = id;
    this.name = name;
    this.char = char;
    this.budget = budget;
    this.mapSpot = mapSpot;
    this.rolledNumber = rolledNumber;
    this.inJail = inJail;
    this.properties = properties;
  }

  /**
   * Update player's budget
   * @param {number} amount - Amount to add/subtract
   * @param {string} operation - '+' to add, '-' to subtract
   */
  updateBudget(amount, operation) {
    if (operation === '+') {
      this.budget += amount;
    } else {
      this.budget -= amount;
    }
  }

  /**
   * Move player on the board
   * @param {number} spaces - Number of spaces to move
   */
  move(spaces) {
    this.mapSpot += spaces;
    if (this.mapSpot > 40) this.mapSpot -= 40; // Loop around board
  }

  /**
   * Add property to player's portfolio
   * @param {Object} property - Property object to add
   */
  addProperty(property) {
    this.properties.push(property);
  }

  /**
   * Remove property from player's portfolio
   * @param {number} propertyId - ID of property to remove
   */
  removeProperty(propertyId) {
    const index = this.properties.findIndex(p => p.id === propertyId);
    if (index !== -1) {
      this.properties.splice(index, 1);
    }
  }
}
