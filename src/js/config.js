// Configuration constants for the Monopoly game

export const STARTING_BUDGET = 600;
export const PASS_GO_SALARY = 200;
export const JAIL_SPOT_ID = 31;
export const GO_SPOT_ID = 21;
export const MAX_HOUSES = 4; // Before hotel
export const HOTEL_LEVEL = 5;

export const CHARACTERS = ['&#9877;', '&#10086;', '&#9885;', '&#9882;', '&#9884;', '&#9992;', '&#9763;', '&#9876;'];

// --- Board Square Definitions ---
// IDs correspond to data-id in index.html
// type: 'property', 'railroad', 'utility', 'chance', 'communityChest', 'tax', 'go', 'jail', 'freeParking', 'goToJail'
// group: Color group for properties (used for monopolies) - null for non-properties
// value: Purchase price
// baseRent: Rent with 0 houses (or base for RR/Utility) - Needs refinement based on rules
// houseCost: Cost to build one house/hotel - Needs refinement based on rules

// Note: Rents for railroads/utilities depend on how many are owned.
// Note: Rents for properties depend on houses/hotel AND if a monopoly is owned.
// These complex rent calculations will be handled in the Property model or game logic.

export const BOARD_SQUARES = [
    { id: 1, name: "Free Parking", type: 'freeParking', group: null },
    { id: 2, name: "Kentucky Avenue", type: 'property', group: 'red', value: 220, baseRent: 18, houseCost: 150 },
    { id: 3, name: "Chance", type: 'chance', group: null },
    { id: 4, name: "Indiana Avenue", type: 'property', group: 'red', value: 220, baseRent: 18, houseCost: 150 },
    { id: 5, name: "Illinois Avenue", type: 'property', group: 'red', value: 240, baseRent: 20, houseCost: 150 },
    { id: 6, name: "B. & O. Railroad", type: 'railroad', group: 'railroad', value: 200, baseRent: 25 },
    { id: 7, name: "Atlantic Avenue", type: 'property', group: 'yellow', value: 260, baseRent: 22, houseCost: 150 },
    { id: 8, name: "Ventnor Avenue", type: 'property', group: 'yellow', value: 260, baseRent: 22, houseCost: 150 },
    { id: 9, name: "Water Works", type: 'utility', group: 'utility', value: 150, baseRent: 4 }, // Rent is 4x or 10x dice roll
    { id: 10, name: "Marvin Gardens", type: 'property', group: 'yellow', value: 280, baseRent: 24, houseCost: 150 },
    { id: 11, name: "Go To Jail", type: 'goToJail', group: null },
    { id: 12, name: "Pacific Avenue", type: 'property', group: 'green', value: 300, baseRent: 26, houseCost: 200 },
    { id: 13, name: "North Carolina Avenue", type: 'property', group: 'green', value: 300, baseRent: 26, houseCost: 200 },
    { id: 14, name: "Community Chest", type: 'communityChest', group: null },
    { id: 15, name: "Pennsylvania Avenue", type: 'property', group: 'green', value: 320, baseRent: 28, houseCost: 200 },
    { id: 16, name: "Short Line", type: 'railroad', group: 'railroad', value: 200, baseRent: 25 },
    { id: 17, name: "Chance", type: 'chance', group: null },
    { id: 18, name: "Park Place", type: 'property', group: 'darkblue', value: 350, baseRent: 35, houseCost: 200 },
    { id: 19, name: "Luxury Tax", type: 'tax', group: null, value: 100 }, // Tax amount
    { id: 20, name: "Boardwalk", type: 'property', group: 'darkblue', value: 400, baseRent: 50, houseCost: 200 },
    { id: 21, name: "GO", type: 'go', group: null }, // Start square
    { id: 22, name: "Mediterranean Avenue", type: 'property', group: 'brown', value: 60, baseRent: 2, houseCost: 50 },
    { id: 23, name: "Community Chest", type: 'communityChest', group: null },
    { id: 24, name: "Baltic Avenue", type: 'property', group: 'brown', value: 60, baseRent: 4, houseCost: 50 },
    { id: 25, name: "Income Tax", type: 'tax', group: null, value: 200 }, // Tax amount
    { id: 26, name: "Reading Railroad", type: 'railroad', group: 'railroad', value: 200, baseRent: 25 },
    { id: 27, name: "Oriental Avenue", type: 'property', group: 'lightblue', value: 100, baseRent: 6, houseCost: 50 },
    { id: 28, name: "Chance", type: 'chance', group: null },
    { id: 29, name: "Vermont Avenue", type: 'property', group: 'lightblue', value: 100, baseRent: 6, houseCost: 50 },
    { id: 30, name: "Connecticut Avenue", type: 'property', group: 'lightblue', value: 120, baseRent: 8, houseCost: 50 },
    { id: 31, name: "Jail / Just Visiting", type: 'jail', group: null },
    { id: 32, name: "St. Charles Place", type: 'property', group: 'pink', value: 140, baseRent: 10, houseCost: 100 },
    { id: 33, name: "Electric Company", type: 'utility', group: 'utility', value: 150, baseRent: 4 }, // Rent is 4x or 10x dice roll
    { id: 34, name: "States Avenue", type: 'property', group: 'pink', value: 140, baseRent: 10, houseCost: 100 },
    { id: 35, name: "Virginia Avenue", type: 'property', group: 'pink', value: 160, baseRent: 12, houseCost: 100 },
    { id: 36, name: "Pennsylvania Railroad", type: 'railroad', group: 'railroad', value: 200, baseRent: 25 },
    { id: 37, name: "St. James Place", type: 'property', group: 'orange', value: 180, baseRent: 14, houseCost: 100 },
    { id: 38, name: "Community Chest", type: 'communityChest', group: null },
    { id: 39, name: "Tennessee Avenue", type: 'property', group: 'orange', value: 180, baseRent: 14, houseCost: 100 },
    { id: 40, name: "New York Avenue", type: 'property', group: 'orange', value: 200, baseRent: 16, houseCost: 100 },
];

// --- Card Definitions ---
// action: 'move', 'moveto', 'addfunds', 'removefunds', 'collectfromplayers', 'payplayers', 'gotojail', 'getoutofjail'
// value: amount for funds actions, target square ID for moveto, number of steps for move
// targetProperty: Name or ID for specific property moves (e.g., 'Illinois Avenue')

export const CHANCE_CARDS = [
  { id: 1, text: 'Advance to "Go". (Collect $200)', action: 'moveto', value: GO_SPOT_ID },
  { id: 2, text: 'Advance to Illinois Avenue. If you pass Go, collect $200.', action: 'moveto', value: 5, targetProperty: 'Illinois Avenue' }, // ID 5
  { id: 3, text: 'Advance to St. Charles Place. If you pass Go, collect $200.', action: 'moveto', value: 32, targetProperty: 'St. Charles Place' }, // ID 32
  // { id: 4, text: 'Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.', action: 'movenearest', value: 'utility' },
  // { id: 5, text: 'Advance token to the nearest Railroad and pay owner twice the rental to which he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.', action: 'movenearest', value: 'railroad' },
  { id: 6, text: 'Bank pays you dividend of $50.', action: 'addfunds', value: 50 },
  // { id: 7, text: 'Get out of Jail Free.', action: 'getoutofjail' },
  { id: 8, text: 'Go Back 3 Spaces.', action: 'move', value: -3 },
  { id: 9, text: 'Go directly to Jail. Do not pass Go, do not collect $200.', action: 'gotojail' },
  // { id: 10, text: 'Make general repairs on all your property: For each house pay $25, For each hotel pay $100.', action: 'propertycharges', value: { house: 25, hotel: 100 } },
  // { id: 11, text: 'Pay poor tax of $15.', action: 'removefunds', value: 15 }, // Often considered a tax, but original script had it here
  { id: 12, text: 'Take a trip to Reading Railroad. If you pass Go, collect $200.', action: 'moveto', value: 26, targetProperty: 'Reading Railroad' }, // ID 26
  { id: 13, text: 'Take a walk on the Boardwalk. Advance token to Boardwalk.', action: 'moveto', value: 20, targetProperty: 'Boardwalk' }, // ID 20
  { id: 14, text: 'You have been elected Chairman of the Board. Pay each player $50.', action: 'payplayers', value: 50 },
  { id: 15, text: 'Your building loan matures. Collect $150.', action: 'addfunds', value: 150 },
  { id: 16, text: 'You have won a crossword competition. Collect $100.', action: 'addfunds', value: 100 },
  // Add placeholders for missing/complex cards if needed
];

export const COMMUNITY_CHEST_CARDS = [
  { id: 17, text: 'Advance to "Go". (Collect $200)', action: 'moveto', value: GO_SPOT_ID },
  { id: 18, text: 'Bank error in your favor. Collect $200.', action: 'addfunds', value: 200 },
  // { id: 19, text: 'Doctor\'s fees. Pay $50.', action: 'removefunds', value: 50 },
  { id: 20, text: 'From sale of stock you get $50.', action: 'addfunds', value: 50 }, // Original script says $45, standard rules say $50
  // { id: 21, text: 'Get out of Jail Free.', action: 'getoutofjail' },
  { id: 22, text: 'Go directly to Jail. Do not pass Go, do not collect $200.', action: 'gotojail' },
  // { id: 23, text: 'Grand Opera Night. Collect $50 from every player for opening night seats.', action: 'collectfromplayers', value: 50 }, // Original script has this text reversed
  { id: 24, text: 'Holiday Fund matures. Receive $100.', action: 'addfunds', value: 100 }, // Original script says Xmas Fund
  // { id: 25, text: 'Income tax refund. Collect $20.', action: 'addfunds', value: 20 },
  { id: 26, text: 'It is your birthday. Collect $10 from every player.', action: 'collectfromplayers', value: 10 }, // Original script has this text reversed
  // { id: 27, text: 'Life insurance matures. Collect $100.', action: 'addfunds', value: 100 },
  { id: 28, text: 'Pay hospital fees of $100.', action: 'removefunds', value: 100 },
  { id: 29, text: 'Pay school fees of $50.', action: 'removefunds', value: 50 }, // Original script says $150, standard rules say $50
  { id: 30, text: 'Receive $25 consultancy fee.', action: 'addfunds', value: 25 },
  // { id: 31, text: 'You are assessed for street repairs: Pay $40 per house, $115 per hotel you own.', action: 'propertycharges', value: { house: 40, hotel: 115 } },
  { id: 32, text: 'You have won second prize in a beauty contest. Collect $10.', action: 'addfunds', value: 10 },
  { id: 33, text: 'You inherit $100.', action: 'addfunds', value: 100 },
  // Add placeholders for missing/complex cards if needed
];

// Helper to get property details by ID
export const getSquareById = (id) => BOARD_SQUARES.find(sq => sq.id === id);

// Helper to get property IDs
export const getPropertySquareIds = () => BOARD_SQUARES.filter(sq => sq.type === 'property' || sq.type === 'railroad' || sq.type === 'utility').map(sq => sq.id);
