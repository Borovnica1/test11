// Represents a player in the game.
export default class Player {
  constructor(id, name, char, budget = 600, mapSpot = 21, rolledNumber = 0, inJail = 0, properties = []) {
    this.id = id;
    this.name = name;
    this.char = char;
    this.budget = budget;
    this.mapSpot = mapSpot;
    this.rolledNumber = rolledNumber;
    this.inJail = inJail; // Turns left in jail
    this.properties = properties; // Array of Property objects
    this.isBankrupt = false;
  }

  updateBudget(amount) {
    this.budget += amount;
  }

  moveTo(spot) {
    this.mapSpot = spot;
    if (this.mapSpot > 40) {
      this.mapSpot -= 40;
    }
  }

  goToJail() {
    this.mapSpot = 31; // Jail spot ID
    this.inJail = 3;
  }

  addProperty(property) {
    this.properties.push(property);
  }

  removeProperty(propertyId) {
    const index = this.properties.findIndex(prop => prop.id === propertyId);
    if (index > -1) {
      this.properties.splice(index, 1);
    }
  }

  hasProperty(propertyId) {
    return this.properties.some(prop => prop.id === propertyId);
  }

  declareBankruptcy() {
    this.isBankrupt = true;
    // Logic to handle property transfer might go here or in the controller
  }
}
