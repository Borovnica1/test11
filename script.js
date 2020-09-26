// Using IIFE for data privacy (this is ES5, there are blocks for ES6) and module pattern architecture for keeping code clean!

var gameLogic = (function() {
  // I'm using here Classical Inheritance. Old school ES5 style.
  // There is much better way to do this with instantiation (*class* keyword) in ES6 and React!!
  // Function constructor
  var Player = function(id, name, char, budget, mapSpot, rolledNumber, inJail, properties) {
    this.id = id;
    this.name = name;
    this.char = char;
    this.budget = budget;
    this.mapSpot = mapSpot;
    this.rolledNumber = rolledNumber;
    this.inJail = inJail;
    this.properties = properties;
  }

  var Player1 = new Player(1, 'John', 22);
  console.log(Player1.name);

  var players = [];
  var diceRolls = [];
  var dices = [];
  let propertyIDs;
  var charsArr;
  var chances;
  var communityChests;
  var bankProperties;
  var parkingMoney;
  var makeData = function() {
    charsArr = ['&#9877;', '&#10086;', '&#9885;', '&#9882;', '&#9884;', '&#9992;', '&#9763;', '&#9876;'];
    chances = ['Advance to "Go".', 'Advance to Illinois Avenue.', 'Advance to St. Charles Place. If you pass Go, collect $200.', 'Bank pays you dividend of $50.', 'Go Back 3 Spaces.', 'Go directly to Jail', 'Take a walk on the Board walk.', 'You have been elected Chairman of the Board. Pay each player $50.', 'Your building and loan matures. Collect $150.', 'You have won a crossword competition. Collect $100.'];
    communityChests = ['Advance to "Go".', 'Bank error in your favor. Collect $200.', 'From sale of stock you get $45.', 'Xmas Fund matures. Collect $100.', 'Hospital Fees. Pay hospital $100.', 'Pay school tax of $150', 'You inherit $100.', 'Receive for services $25.', 'It\'s your birthday. Collect $10 from every player.', 'Grand Opera Opening. Collect $50 from every player for opening night seats.'];
    bankProperties = [['Kentucky Avenue', 220], ['Indiana Avenue', 220], ['Illinois Avenue', 240], ['B. & O. Railroad', 200], ['Atlantic Avenue', 260], ['Ventnor Avenue', 260], ['Water Works', 150], ['Marvin Gardens', 280], ['Pacific Avenue', 300], ['North Carolina Avenue', 300], ['Pennsylvania Avenue', 320], ['Short Line', 200], ['Park Place', 350], ['Boardwalk', 400], ['Mediterranean Avenue', 60], ['Baltic Avenue', 60],['Reading Railroad', 200], ['Oriental Avenue', 100], ['Vermont Avenue', 100], ['Connecticut Avenue', 120], ['St. Charles Place', 140], ['Electric Company', 150], ['States Avenue', 140], ['Virginia Avenue', 160], ['Pennsylvania Railroad', 200], ['St. James Place', 180], ['Tennessee Avenue', 180], ['New York Avenue', 200]];


    var Property = function(id, title, value, houses, built) {
      this.id = id;
      this.title = title;
      this.value = value;
      this.houses = houses;
      this.built = built;
    }
    var id = 0;
    var nonPropertyCards = [1,3,11,14,17,19,21,23,25,28,31,38];
    for (var i = 0; i < bankProperties.length; i++) {
      // Skip the non property card!!
      id++;
      if (nonPropertyCards.includes(id)) id++;
      var newProperty = new Property (id, bankProperties[0][0], bankProperties[0][1], 0, false);
      bankProperties.push(newProperty);
      bankProperties.shift();
    }
  
    propertyIDs = bankProperties.map(x => x.id);
    //console.log(bankProperties.indexOf(bankProperties.find(x => x.id == 18)));
  
    var Chance = function(id, text) {
      this.id = id;
      this.text = text;
    }
    for (var i = 0; i < chances.length; i++) {
      var newChance = new Chance(i+1, chances[0]);
      chances.push(newChance);
      chances.shift();
    }
    // Now to randomize the order!
    for (var j = 0; j < chances.length; j++) {
      var random = Math.floor(Math.random() * (chances.length - j));
      chances.push(chances[random]);
      chances.splice(random, 1);
    }
  
    var CommunityChest = function(id, text) {
      this.id = id;
      this.text = text;
    }
    for (var i = 0; i < communityChests.length; i++) {
      var newCommunityChest = new CommunityChest(i+1, communityChests[0]);
      communityChests.push(newCommunityChest);
      communityChests.shift();
    }
    // Now to randomize the order!
    for (var j = 0; j < communityChests.length; j++) {
      var random = Math.floor(Math.random() * (communityChests.length - j));
      communityChests.push(communityChests[random]);
      communityChests.splice(random, 1);
    }
    
    parkingMoney = 0;
  }
 /*  makeData();
 */
  return {
    addPlayer: function(id, name, char) {
      var newPlayer = new Player(id, name, char, 600, 21, 0, 0, []);
      players.unshift(newPlayer);
      console.log(players);
    },

    addDiceRoll: function(player, gameIsActive) {
      var dice1 = Math.floor(Math.random() * 6) + 1;
      var dice2 = Math.floor(Math.random() * 6) + 1;
      dices = [dice1, dice2];
      diceRolls.unshift(dices);

      // add to Player property dice number!!
      player.rolledNumber = dice1 + dice2;

      // We only count dice rolls once the game starts!!
      if (gameIsActive) {
        player.mapSpot += dice1 + dice2;
        // If over 40 it means the player made full circle!!
        if (player.mapSpot > 40) player.mapSpot -= 40;
      }
    },

    sortPlayers: function(playersArr) {
      playersArr.sort((a, b) => b.rolledNumber - a.rolledNumber);
      diceRolls.sort((a, b) => (b[0] + b[1]) - (a[0] + a[1]));
    },

    sortByRankings: function(playersArr) {
      playersArr.sort((a, b) => a.budget - b.budget); 
    },

    removeChar: function(charsIndex) {
      // Removes chosen char from our array of available chars!!
      charsArr.splice(charsIndex, 1);
    },

    updateBudget: function(player, moneyDiff, sign) {
      if (sign == '+') {
        player.budget += moneyDiff;
      } else {
        player.budget -= moneyDiff;
      }
      
    },

    payTime: function(player, playerTwo, amount, sign) {
      if (sign == '+') {
        player.budget += amount;
        playerTwo.budget -= amount;
      } else {
        player.budget -= amount;
        playerTwo.budget += amount;
      }
    },

    updateParkingMoney: function(value) {
      parkingMoney += value;
    },

    changeSpot: function(player, id){
      switch (id) {
        case 1:
          player.mapSpot = 21;break;
        case 2:
          player.mapSpot = 5;break;
        case 3:
          player.mapSpot = 32;break;
        case 5:
          // fixes a bug when this case happens on the chance card near Free Parking
          player.mapSpot == 3 ? player.mapSpot = 40 : player.mapSpot -= 3;break;
        case 6:
          player.mapSpot = 31;
          player.inJail = 3;break;
        case 7:
          player.mapSpot = 20;break;
      }  
    },

    getPlayers: function() {
      return players;
    },

    getDices: function() {
      return dices;
    },

    getRolledDices: function() {
      return diceRolls;
    },

    getGameIsActive: function() {
      return players.length == 1 ? false : true;
    },

    getCharsArr: function() {
      return charsArr;
    },

    //maybe just getCards?
    getChances: function() {
      return chances;
    },

    getCommunityChests: function() {
      return communityChests;
    },

    getBankProperties: function() {
      return bankProperties;
    },

    getPropertyIDs: function() {
      return propertyIDs;
    },

    getParkingMoney: function(){
      return parkingMoney;
    },
    
    clearGame: function() {
      players = [];
      diceRolls = [];
      dices = [];
      makeData();
    }
  }

})();


var UIController = (function() {

  var DOMstrings = {
    dice: '.rollDice',
    startGame: '.startGame'
  };
  var mapContainer = document.querySelector('.map');
  var mapText = document.querySelector('.map__text');

  var random = function() {
    return Math.floor(Math.random() * 100) + 1;
  }

  return {
    getDomStrings: function() {
      return DOMstrings;
    },

    
    showPlayerPanel: function() {
      // removes StartTheGame button!
      document.querySelector(DOMstrings.startGame).style.display = 'none';/* parentNode.removeChild(document.querySelector(DOMstrings.startGame)); */

      html = '<div class="map__modal" style="width: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 2rem;">'
      + '<h1 class="map__title">' + 'Number of players?' + '</h1>' 
      + '<button class="map__player-number" data-id="2" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px;cursor:pointer;">' + '2' + '</button>'
      + '<button class="map__player-number" data-id="3" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px;cursor:pointer;">' + '3' + '</button>'
      + '<button class="map__player-number" data-id="4" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px;cursor:pointer;">' + '4' + '</button>'
      + '<button class="map__player-number" data-id="5" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px;cursor:pointer;">' + '5' + '</button>'
      + '<button class="map__player-number" data-id="6" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px;cursor:pointer;">' + '6' + '</button>'
      + '<button class="map__player-number" data-id="7" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px;cursor:pointer;">' + '7' + '</button>'
      + '<button class="map__player-number" data-id="8" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px;cursor:pointer;">' + '8' + '</button>'
      + '</div>';
      
      mapContainer.insertAdjacentHTML('beforeend', html);
    },

    showModePanel: function() {
      html = '<div class="map__modal" style="width: 70%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 2rem;">'
      + '<h1 class="map__title" style="text-align:center;font-size:1.5rem">' + 'Gamemode: ?' + '</h1>'
      + '<div class="map__mode" data-id="lastmode">' 
      + '<img src="dices/lastman.jpg">'
      + '<li>' + '<span>Last Man Standing mode!</span>' + '</li>'
      + '<li>' + '<span>When player goes below $0 he is kicked out!</span>' + '</li>'
      + '<li>' + '<span>No time limit!</span>' + '</li>'
      + '<span style="display:block;">' + '&nbsp' + '</span>'
      + '</div>'
      + '<div class="map__mode" data-id="timemode">' 
      + '<img src="dices/timemode.jpg">'
      + '<li>' + '<span>Time mode!</span>' + '</li>'
      + '<li>' + '<span>Player with most money after <input class="map__mode-number" type="number" value="" min="1" max="1000"> minutes wins!</span>' + '</li>'
      + '<li>' + '<span>Player can go in debt!</span>' + '</li>'
      + '<span class="map__mode-number-warning" style="font-size:.9rem;color:red;">' + '&nbsp' + '</span>'
      + '</div>'
      + '</div>';
      mapContainer.insertAdjacentHTML('beforeend', html);
    },

    showPlayerCreate: function(playerNumber, charsArr) {
      html = '<div class="map__modal" style="width: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 1.6rem 2rem;">' 
      + '<h1>' + 'Player ' + playerNumber + '</h1>'
      // onkeypress attribute allows only letters to be typed
      + '<h2 style="margin-top: .4rem">' + 'Name:' + '</h2>' + '<input type="text" class="player__name" required maxlength="14" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)" placeholder="Player Name" style="display:block;height:1.9rem;outline:none;border:none;">'
      + '<h2 style="margin-top: .4rem">' + 'Choose a character:' + '</h2>'
      for (var i = 0; i < charsArr.length; i++) {
        html += '<div class="map__box2 arrayIndex'+i+'" style="cursor:pointer; border: 1px solid #000; width:  40px; height: 40px; border-radius:50%; overflow:hidden; display: inline-flex; justify-content: center;margin-right:.2rem">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 30px;">'  + charsArr[i] + '</span>' + '</div>'
      } 
      html += '<button class="map__done btn" style="display:flex;margin:auto;padding:.6rem .9rem;margin-top:.4rem">' + 'Done' + '</button>'
      + '</div>';
      

      mapContainer.insertAdjacentHTML('beforeend', html);
      document.querySelector('.player__name').focus();
    },

    showPlayerDashboard: function(players, rankings) {
      console.log(rankings);
      // Clears the previous created dashboard of players!! (after sorting i believe)
      document.querySelector('.stats').innerHTML = '';
      if (!rankings) {
        document.querySelector('[data-id="'+players[0].mapSpot+'"]').innerHTML = '';
      }
      var placeCount = players.length;

      for (var i = 0; i < players.length; i++) {
        html = '<div class="stats__player'+players[i].id+'" style="cursor:pointer;height:70px;background-color:lightblue;display:flex;align-items:center;margin-top: .4rem;border-radius:5px;padding:.5rem 1rem;border:2px solid lightblue;position:relative">'
        + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  40px; height: 40px; border-radius:50%;display:flex;justify-content: center;background-color:#82cdff">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + players[i].char + '</span>' + '</div>'
        + '<div style="margin-left: .3rem;overflow:hidden;width:46%;white-space: nowrap;">'
        + '<h1>' + players[i].name + '</h1>'
        + '<h2 style="margin-left: .8rem;margin-top:.2rem;color:darkgreen">' + '$' + players[i].budget + '</h2>'
        + '</div>'
        + '<div class="stats__rolled'+players[i].id+'" style="margin-left:auto;display:flex;justify-content:center;align-items:center;">' + '' + '</div>'
        + '<div class="stats__arrow" style="font-size:1.2rem;position:absolute;top:90%;left:50%;transform:translate(-50%,-50%);width:20px;height:20px;border:10px solid transparent;border-top:10px solid black;"></div>'
        + '</div>'


        + '<div class="stats__cards'+players[i].id+'" style="display:none;justify-content:space-around;align-items:center;height:220px;background-color:#82cdff;border-radius: 0 0 10px 10px;margin-top:-5px;">'
        + '<div style="background-color:;width:40%;height:90%;display:grid;grid-template-columns:repeat(4, 1fr);grid-template-rows:repeat(5, 1fr);grid-gap:4px;">' + '<span card-id="22" style="border:1px solid #955436"></span>' + '<span card-id="24" style="border:1px solid #955436"></span>' + 
        '<span></span>' + '<span></span>' +
        '<span card-id="27" style="border:1px solid #aae0fa"></span>' + 
        '<span card-id="29" style="border:1px solid #aae0fa"></span>' + 
        '<span card-id="30" style="border:1px solid #aae0fa"></span>' + 
        '<span></span>' +
        '<span card-id="32" style="border:1px solid #d93a96"></span>' + 
        '<span card-id="34" style="border:1px solid #d93a96"></span>' + 
        '<span card-id="35" style="border:1px solid #d93a96"></span>' +
        '<span></span>' +
        '<span card-id="37" style="border:1px solid #f7941d"></span>' + 
        '<span card-id="39" style="border:1px solid #f7941d"></span>' + 
        '<span card-id="40" style="border:1px solid #f7941d"></span>' +
        '<span></span>' +
        '<span card-id="2" style="border:1px solid #ed1b24"></span>' + 
        '<span card-id="4" style="border:1px solid #ed1b24"></span>' + 
        '<span card-id="5" style="border:1px solid #ed1b24"></span>' +
         '</div>'
        + '<div style="background-color:;width:40%;height:90%;display:grid;grid-template-columns:repeat(4, 1fr);grid-template-rows:repeat(5, 1fr);grid-gap:4px;">' + '<span card-id="7" style="border:1px solid #fef200"></span>' + '<span card-id="8" style="border:1px solid #fef200"></span>' +
        '<span card-id="10" style="border:1px solid #fef200"></span>' +
        '<span></span>' +
        '<span card-id="12" style="border:1px solid #1fb25a"></span>' + 
        '<span card-id="13" style="border:1px solid #1fb25a"></span>' + 
        '<span card-id="15" style="border:1px solid #1fb25a"></span>' +
        '<span></span>' +
        '<span card-id="18" style="border:1px solid #0072bb"></span>' + 
        '<span card-id="20" style="border:1px solid #0072bb"></span>' +
        '<span></span>' + '<span></span>' +
        '<span card-id="33" style="border:1px solid #ffffff"></span>' + 
        '<span card-id="9" style="border:1px solid #ffffff"></span>' +
        '<span></span>' + '<span></span>' +
        '<span card-id="26" style="border:1px solid #d3d3d3"></span>' + 
        '<span card-id="36" style="border:1px solid #d3d3d3"></span>' + 
        '<span card-id="6" style="border:1px solid #d3d3d3"></span>' + 
        '<span card-id="16" style="border:1px solid #d3d3d3"></span>' +  '</div>'
        + '</div>';
        if (!rankings) {
          document.querySelector('.stats').insertAdjacentHTML('beforeend', html);
        } else {
          document.querySelector('.overlay__rankings').insertAdjacentHTML('afterbegin', html);
          var place;
          if (placeCount <= 3) {
            place = '<img src="dices/rankings'+(placeCount)+'.png" alt="award image" style="width:40px;height:50px">'
          } else {
            place = '&#1011'+(placeCount+1)+';'
            document.querySelector('.stats__rolled'+players[i].id).style.marginRight = '.55rem'
          }
          document.querySelector('.stats__rolled'+players[i].id).style.fontSize = '1.8rem';
          document.querySelector('.stats__rolled'+players[i].id).insertAdjacentHTML('beforeend', place);
          placeCount--;
        }
        


        html = '<div class="map__player'+players[i].id+'" style="display:inline-flex;padding: .1rem;">'
        + '<div class="map__box2 index100" style="border: 1px solid #000; width:  27px; height: 27px;background-color:lightblue; border-radius:50%; overflow:hidden; display:inline-flex;justify-content: center;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + players[i].char + '</span>' 
        + '</div>';
        if (!rankings) {
          document.querySelector('[data-id="'+players[i].mapSpot+'"]').insertAdjacentHTML('beforeend', html);
        }
      }
    },

    showRollDice: function(name, gameIsActive) {
      var rollDiceBtn = document.querySelector('.rollDice');
      var playerNumber = document.querySelector('.playerNumber');
      if (gameIsActive == true) {
        playerNumber.innerHTML = '<h1 style="width:600px">' + '<span style="color:rgb(0, 174, 255)">' + name + '</span>' + '\'s turn!' +  '</h1>';
      } else {
        playerNumber.innerHTML = '<h1 style="width:600px">' + '<span style="color:rgb(0, 174, 255)">' + name + '</span>' + ' roll for the play order!' +  '</h1>';
      }
      mapContainer.insertAdjacentElement('beforeend', rollDiceBtn);
      rollDiceBtn.style.display = 'block';
      playerNumber.style.display = 'block';
    },

    showEndTurn: function() {
      document.querySelector('.endTurn').style.display = 'block';
    },
    hideEndTurn: function() {
      document.querySelector('.endTurn').style.display = 'none';
    },

    showDices: function(dices, id) {
      htmlDice1 = '<img src="dices/dice-'+dices[0]+'.png" style="width: 100px; height:100px;border-radius:10px">';
      htmlDice2 = '<img src="dices/dice-'+dices[1]+'.png" style="width: 100px; height:100px;border-radius:10px">';
      document.querySelector('.rollDice1').insertAdjacentHTML('beforeend', htmlDice1);
      document.querySelector('.rollDice2').insertAdjacentHTML('beforeend', htmlDice2);
      document.querySelector('.rollDice1').style.display = 'block';
      document.querySelector('.rollDice2').style.display = 'block';
      document.querySelector('.playerNumber').innerHTML = '<h2>' + 'Rolled: ' + (dices[0] + dices[1]) + '</h2>';

      // Now changing size of dices
      htmlDice1 = '<img src="dices/dice-'+dices[0]+'.png" style="width: 25px; height:25px; border-radius:5px;margin: 0 .3rem">';
      htmlDice2 = '<img src="dices/dice-'+dices[1]+'.png" style="width: 25px; height:25px;border-radius:5px;">';
      document.querySelector('.stats__rolled'+id).innerHTML = '<h2>Rolled: ' + (dices[0] + dices[1]) + '</h2>' + htmlDice1 + htmlDice2;
    },

    showDicesNextToPlayerName: function(dices, sortedPlayer) {
      htmlDice1 = '<img src="dices/dice-'+dices[0]+'.png" style="width: 25px; height:25px; border-radius:5px;margin: 0 .3rem">';
      htmlDice2 = '<img src="dices/dice-'+dices[1]+'.png" style="width: 25px; height:25px;border-radius:5px;margin-right:.3rem">';
      document.querySelector('.stats__rolled'+sortedPlayer).innerHTML = '<h2>Rolled: ' + (dices[0] + dices[1]) + '</h2>' + htmlDice1 + htmlDice2;
    },

    hideDices: function() {
      // innerHTML is bad practice cuz the whole page has to render again!!
      // The goal is to make as few DOM manipulation as possible.
      // React solves those problems.
      document.querySelector('.rollDice1').innerHTML = '';
      document.querySelector('.rollDice2').innerHTML = '';
      document.querySelector('.playerNumber').innerHTML = '';
    },

    updatePlayerSpot: function(player) {
      // Deletes him from current spot
      document.querySelector('.map__player'+player.id).parentNode.removeChild(document.querySelector('.map__player'+player.id));

      // Puts him to new spot
      html = '<div class="map__player'+player.id+'" style="display:inline-flex;padding: .1rem;">'
        + '<div class="map__box2 index100" style="border: 1px solid #000; width:  27px; height: 27px;background-color:orange;border-radius:50%; overflow:hidden; display:inline-flex;justify-content: center;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + player.char + '</span>' 
        + '</div>';
        document.querySelector('[data-id="'+player.mapSpot+'"]').insertAdjacentHTML('beforeend', html);
    },

    showGoToJail: function(playerName, playerTurnsLeft) {
      // Cheks if the player is already in prison!!
      if (playerTurnsLeft == 0) {
        document.querySelector('.map__toJailName').innerHTML = playerName;
        document.querySelector('.map__toJail').style.display = 'block';
      } else {
        document.querySelector('.map__inJailTurns').innerHTML = playerName + ' ' + playerTurnsLeft;
        document.querySelector('.map__inJail').style.display = 'block';
      }
    },
    hideGoToJail: function() {
      document.querySelector('.map__toJail').style.display = 'none';
      document.querySelector('.map__inJail').style.display = 'none';
    },

    showCard: function(cardNumber, typeOfCard, price, owner, rent) {
      // Sets image
      var firstTitle = document.querySelector('.map__card').children[0];
      var img = document.querySelector('.map__card').children[1];
      var secondTitle = document.querySelector('.map__card').children[2];
      
      img.src = 'dices/' + cardNumber + '.jpg';
      img.style.border = '2px solid #000';
      switch (typeOfCard) {
        case ('tax'):
          firstTitle.innerHTML = 'Unfortunately you landed on:';
          secondTitle.innerHTML = 'You gotta pay money lol';
          break;
        case ('chance'):
          firstTitle.innerHTML = 'You landed on:';
          secondTitle.innerHTML = 'Chance time!!';
          document.querySelector('.cardTaken').style.display = 'block';
          break;
        case ('communityChest'):
          firstTitle.innerHTML = 'You landed on:';
          secondTitle.innerHTML = 'Community Chest time!!';
          document.querySelector('.cardTaken').style.display = 'block';
          break;
        case ('go'):
          firstTitle.innerHTML = 'You passed:';
          secondTitle.innerHTML = 'Bank gives you $200!';
          break;
        case ('go2'):
          firstTitle.innerHTML = 'You passed twice:';
          secondTitle.innerHTML = 'Bank gives you $400!';
          break;
        case ('property'):
          firstTitle.innerHTML = 'You landed on:';
          secondTitle.innerHTML = 'Cost: $' + price;
          document.querySelector('.aBitLeft').innerHTML = 'Buy Property';
          document.querySelector('.aBitRight').innerHTML = 'Auction $' + price / 2;
          document.querySelectorAll('.qOption').forEach(el => el.style.display = 'block');
          break;
        case ('propertyTaken'):
          firstTitle.innerHTML = 'You landed on:';
          secondTitle.innerHTML = 'Owner: ' + owner.name;
          document.querySelector('.rent').innerHTML = 'Pay Rent: $' + rent ;
          document.querySelector('.rent').style.display = 'block';
          break;
        case ('auction'):
          firstTitle.innerHTML = 'Auction for:';
          secondTitle.innerHTML = 'Bid: $' + price;
          document.querySelector('.aBitLeft').innerHTML = owner.name + ' Bid: $' + Math.floor(price + (price / 5)) + ' ?';
          document.querySelector('.aBitRight').innerHTML = 'Fold';
          document.querySelectorAll('.qOption').forEach(el => el.style.display = 'block');
          document.querySelector('.aBitLeft').classList.add('aBitLeftAuction');
          document.querySelector('.aBitRight').classList.add('aBitRightAuction');
          break;
        case ('auctionWinner'):
          firstTitle.innerHTML = 'Winner is: ' + owner.name;
          secondTitle.innerHTML = 'Cost: $' + price;
          break;
      }
      document.querySelector('.map__card').style.display = 'block';
    },
    hideCard: function() {
      document.querySelector('.map__card').style.display = 'none';
      document.querySelectorAll('.qOption').forEach(el => el.style.display = 'none');
      document.querySelector('.rent').style.display = 'none';
      document.querySelector('.aBitLeft').classList.remove('aBitLeftAuction');
      document.querySelector('.aBitRight').classList.remove('aBitRightAuction');
    },

    showMoneyChange: function(id, money, sign) {
      var budgetElement = document.querySelector('.stats__player'+id).children[1].children[1];
      var color;
      sign == '+' ? color = 'green' : color = 'red';
      budgetElement.insertAdjacentHTML('beforeend', '<span style="color:'+color+';margin-left:.5rem;">' + sign + '$' + money + '</span>');
    },
    hideMoneyChange: function(id, playerBudget) {
      var budgetElement = document.querySelector('.stats__player'+id).children[1].children[1];
      budgetElement.innerHTML = '$' + playerBudget;
    },

    
    showCardText: function(text, typeOfCard) {
      if (typeOfCard == 'chance') {
        mapText.style.backgroundColor = 'rgba(245, 131, 0, 0.753)';
        mapText.style.border = 'orange';
      } else {
        mapText.style.backgroundColor = 'rgba(84, 172, 230, 0.788)';
        mapText.style.border = 'lightblue';
      }
      mapText.innerHTML = text;
      mapText.style.display = 'block';
    },
    hideCardText: function() {
      mapText.style.display = 'none';
    },

    highlightCurrent: function(id) {
      document.querySelector('.map__player'+id).children[0].style.backgroundColor = 'orange';
      document.querySelector('.stats__player'+id).style.border = '2px solid orange';
      document.querySelector('.stats__player'+id).children[0].style.backgroundColor = 'orange';
    },
    removeCurrent: function(id) {
      document.querySelector('.map__player'+id).children[0].style.backgroundColor = 'lightblue';
      document.querySelector('.stats__player'+id).style.border = '2px solid lightblue';
      document.querySelector('.stats__player'+id).children[0].style.backgroundColor = 'lightblue';
    },

    showParkingChange: function(addValue) {
      document.querySelector('.map__addPotBudget').innerHTML = '+$'+addValue;
      document.querySelector('.map__addPotBudget').style.display = 'block'
      // 220
      var left,
          html,
          bills = [500,100,50,20,10,5,1],
          billsCount;
      for (var i = 0; i < bills.length; i++) {
        if (addValue >= bills[i]) {
          left = addValue % bills[i];
          billsCount = ((addValue - left) / bills[i]);
          addValue = left; 
        }
        while (billsCount > 0) {
          html = '<img draggable="false" src="dices/money'+bills[i]+'.png" style="position:absolute;transform:translate(-50%,-50%) rotate('+(random()-100)+'deg);top:'+random()+'%;left:'+random()+'%;width:40%">';
          document.querySelector('.map__moneyPot').insertAdjacentHTML('beforeend', html);
          billsCount--;
        }
      }

    },
    hideParkingChange: function(potBudget) {
      document.querySelector('.map__addPotBudget').style.display = 'none'
      document.querySelector('.map__potBudget').innerHTML = '$'+potBudget;
    },
    showParking: function(playerName) {
      document.querySelector('.map__freeMoneyName').innerHTML = playerName;
      document.querySelector('.map__freeMoney').style.display = 'block';
    },
    hideParking: function() {
      document.querySelector('.map__freeMoney').style.display = 'none';
      document.querySelector('.map__moneyPot').innerHTML = '';
    },

    clearGame: function(players) {
      for (var i = 0; i < players.length; i++) {
        document.querySelector('.map__player'+players[i].id).parentNode.removeChild(document.querySelector('.map__player'+players[i].id));
      };
      var list = document.querySelector('.map').querySelectorAll('button, .card');
      list.forEach(el => {
        el.style.display = 'none';
      })
      document.querySelector('.map__moneyPot').style.display = 'block';
      document.querySelector('.map__pot').style.display = 'block';
      document.querySelector('.map__moneyPot').innerHTML = '';
      document.querySelector('.map__potBudget').innerHTML = '$0';
      document.querySelector('.stats').innerHTML = '';
      mapText.style.display = 'none';
    },

    clearMapCards: function(properties) {
      for (var i = 0; i < properties.length; i++) {
        document.querySelector('.map').querySelector('[data-id="'+properties[i].id+'"]').children[0].innerHTML = '';
      }
    },

    showBankruptcy: function(name) {
      document.querySelector('.playerNumber').innerHTML = '<h1 style="width:600px">' + '<span style="color:rgb(0, 174, 255)">' + name + '</span>' + '\'s budget just went below $0!' +  '</h1>';
    },

    removePlayer: function(id, properties) {
      document.querySelector('.map__player'+id).parentNode.removeChild(document.querySelector('.map__player'+id));
      document.querySelector('.stats__player'+id).parentNode.removeChild(document.querySelector('.stats__player'+id));
      document.querySelector('.stats__cards'+id).parentNode.removeChild(document.querySelector('.stats__cards'+id));
      for (var i = 0; i < properties.length; i++) {
        document.querySelector('.map').querySelector('[data-id="'+properties[i].id+'"]').children[0].innerHTML = '';
      }
    },

    showWinner: function(player) {
      document.querySelector('.playerNumber').innerHTML = '<h1 style="width:600px">' + '<span style="color:rgb(0, 174, 255)">' + player.name + '</span>' + ' won the game!!' +  '</h1>';
      document.querySelector('.map__winDisplay').style.display = 'block';  
    },

    updateStatsCards: function(properties, id, char) {
      var cards = document.querySelector('.stats__cards'+id);
      var mapCard;
      var html;
      var bordCol;
      var rgb;
      var position;
      //mapCard.children[0].style.display = 'block';

      for (var i = 0; i < properties.length; i++) {
        mapCard = document.querySelector('.map').querySelector('[data-id="'+properties[i].id+'"]');
        bordCol = cards.querySelector('[card-id="'+properties[i].id+'"').style.borderColor;
        cards.querySelector('[card-id="'+properties[i].id+'"]').style.backgroundColor = bordCol;
        rgb = bordCol.slice(4, bordCol.length - 1);
        if ([22,24,26,27,29,30].includes(properties[i].id)) {
          position = 'bottom';
        } else if ([32,33,34,35,36,37,39,40].includes(properties[i].id)) {
          position = 'right';
        } else if ([2,4,5,6,7,8,9,10].includes(properties[i].id)) {
          position = 'top';
        } else {
          position = 'left'
        }
        html = '<div class="map__cards map__cards-'+position+' map__cards'+id+'" style="background-color: rgba('+rgb+', 0.7);">'
        + '<div class="map__box2" style="border: 1px solid #000; width:  23px; height: 23px; border-radius:50%;display:flex;justify-content: center;background-color:'+bordCol+';margin:auto;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + char + '</span>' + '</div>'
        + '</div>'
        mapCard.children[0].innerHTML = html;
      }
    },

    availHouseSpots: function(propIds, buildSell) {
      var color;
      var card;

      buildSell == 'Build' ? color = 'rgba(0,169,0,.6)' : color = 'rgba(169,0,0,.6)'
      for (var i = 0; i < propIds.length; i++) {
        card = mapContainer.querySelector('[data-id="'+propIds[i]+'"]').children[2];
        card.style.backgroundColor = 'rgba(0,0,0,.6)';;
        card.style.zIndex = '100';
        card.style.cursor = 'pointer';

        card.addEventListener('mouseenter', (event) => {
          // make sure i put bg color only on the card overlay
          if (event.target.parentNode.getAttribute('data-id') > 0) {
            event.target.style.backgroundColor = color;
          }
        });
        card.addEventListener('mouseleave', (event) => {
          // make sure i put bg color only on the card overlay
          if (event.target.parentNode.getAttribute('data-id') > 0) {
            event.target.style.backgroundColor = 'rgba(0,0,0,.6)';
          }
        });
      }
      
    },

    removeHouseSpots: function(propIds) {
      var card;
      var cardClone;
      console.log(propIds.length);
      console.log(propIds);
      for (var i = 0; i < propIds.length; i++) {
        card = mapContainer.querySelector('[data-id="'+propIds[i]+'"]').children[2];
        card.style.backgroundColor = 'rgba(0,0,0,.0)';
        card.style.zIndex = '';
        card.style.cursor = 'default';
        cardClone = card.cloneNode(true);
        card.parentNode.replaceChild(cardClone, card);
      }
    }, 

    addRemoveHouse: function(id, addRemove, houses) {
      var card;
      var color;
      houses == 4 && addRemove == 'Build' ? color = 'rgba(169, 0,0,0.9)' : color = 'rgba(0, 140,0,0.4)';
      card = mapContainer.querySelector('[data-id="'+id+'"]').children[1];
      html = '<div class="" style="width: 19px; height: 19px; background-color: '+color+';">'+'</div>';
      if (addRemove == 'Build') {
        card.insertAdjacentHTML('beforeend', html);
      } else {
        card.innerHTML = '';
        for (var i = 0; i < houses - 1; i++) {
          card.insertAdjacentHTML('beforeend', html);
        }
      }
    }

  }
})();


var controller = (function(game, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDomStrings();
    var expended = false;

    document.querySelector(DOM.dice).addEventListener('click', hiLol);
    document.querySelector(DOM.startGame).addEventListener('click', createGame);
    document.querySelector(DOM.startGame+2).addEventListener('click', createGame);
    document.querySelector('.build').addEventListener('click', () => {
      var build = document.querySelector('.build').innerHTML;
      document.querySelectorAll('.menu__btn').forEach(el => el.style.display = 'none');
      document.querySelector('.done').style.display = 'block';
      buildSellHouses(build);
    });
    document.querySelector('.sell').addEventListener('click', () => {
      var sell = document.querySelector('.sell').innerHTML;
      document.querySelectorAll('.menu__btn').forEach(el => el.style.display = 'none');
      document.querySelector('.done').style.display = 'block';
      buildSellHouses(sell);
    });
    document.querySelector('.done').addEventListener('click', () => {
      document.querySelectorAll('.menu__btn').forEach(el => el.style.display = 'block');
      document.querySelector('.done').style.display = 'none';
      UICtrl.removeHouseSpots(availSpots);
    })


    document.querySelector('.endTurn').addEventListener('click', () => endTurn = true);
    document.querySelectorAll('.menu__menu').forEach(el => {
      el.addEventListener('click', async () => {
        document.querySelector('.menu__exp').classList.toggle('menu__expClick');
        if (!expended) await new Promise(r => setTimeout(r, 0200));
        document.querySelectorAll('.menu__exp__btn').forEach(el => {
          el.classList.toggle('menu__exp__btnClick');
        })
        expended == false ? expended = true : expended = false;
      })
    })

    document.querySelector('.pause').addEventListener('click', () => {
      document.querySelector('.overlay').style.display = 'flex';
      clearInterval(timeInterval);
      clearInterval(timeInterval2);
    });
    document.querySelector('.unpause').addEventListener('click', () => {
      document.querySelector('.overlay').style.display = 'none';
      if (mode == 'timemode') {
        startTimer(gameTime);
      } else if (mode == 'lastmode'){
        startClock();
      }
    })
  };

  var broj = 0;
  var numberIsPicked = false;
  function updateEventListener() {
    var playersNumber = document.querySelectorAll('.map__player-number');
    
    // Put on every single number button CLICK event and calls function with that number
    playersNumber.forEach(item => {

      item.addEventListener('click', exe => {
        broj = parseInt(item.getAttribute('data-id')); 
        numberIsPicked = true;
        document.querySelector('.map__modal').parentNode.removeChild(document.querySelector('.map__modal'));
      });
    });
  }
  var playerIsCreated = false;
  var name,
      char,
      charIndex;
  function updateEventListener2() {
    name = '',
    char = '';
    var playerL = document.querySelectorAll('.map__box2');
    var lastItem = document.querySelector('.map__box2');
    playerL.forEach(item => {
      item.addEventListener('click', exe => {
        lastItem.style.border = "1px solid #000";
        lastItem.style.backgroundColor = '';
        item.style.border = "2px solid orangered";
        item.style.backgroundColor = 'lightblue';
        lastItem = item;
        char = item.firstChild.innerHTML;
        // Grabbing chars index from class name!!
        // console.log(item.classList[1].charAt(item.classList[1].length - 1));
        charIndex = item.classList[1].charAt(item.classList[1].length - 1);
      })
    })
    document.querySelector('.map__done').addEventListener('click', function(){
      name = document.querySelector('.player__name').value;
      name = name.trim();
      if (name.length > 0 && char.length > 0) {
        playerIsCreated = true;
        document.querySelector('.map__modal').parentNode.removeChild(document.querySelector('.map__modal'));
      }
    });
  }
  var diceClicked = false;
  function updateEventListener3() {
    document.querySelector('.rollDice').addEventListener('click', () => {
      diceClicked = true;
      document.querySelector('.rollDice').style.display = 'none';
    })
  }
  var cardTaken = false;
  function updateEventListener4() {
    document.querySelector('.cardTaken').addEventListener('click', () => {
      cardTaken = true;
      document.querySelector('.cardTaken').style.display = 'none';
    })
  }
  var actionTaken = false;
  var actionBuy = false;
  var actionRent = false;
  function updateEventListener5() {
    var options = document.querySelectorAll('.qOption')
    options[0].addEventListener('click', () => {
      actionBuy = true;
      actionTaken = true;
    })
    options[1].addEventListener('click', () => {
      actionTaken = true;
    })
    document.querySelector('.rent').addEventListener('click', () => {
      actionTaken = true;
      actionRent = true;
    })
  }
  var mode = '';
  var gameTime;
  var modeIsPicked = false;
  function updateEventListener6() {
    var modes = document.querySelectorAll('.map__mode');
    // Put on every single mode button CLICK event and calls function with that mode
    modes.forEach(item => {
      item.addEventListener('click', exe => {
        mode = item.getAttribute('data-id');
        gameTime = document.querySelector('.map__mode-number').value;
        console.log(mode, gameTime);
        if (mode == 'lastmode') {
          modeIsPicked = true;
          document.querySelector('.map__modal').parentNode.removeChild(document.querySelector('.map__modal'));
        } else {
          if (gameTime >= 1 && gameTime <= 1000) {
            modeIsPicked = true;
            document.querySelector('.map__modal').parentNode.removeChild(document.querySelector('.map__modal'));
          } else {
            document.querySelector('.map__mode-number-warning').innerHTML = 'Positive number between 1 and 1000!'
          }
        }
      });
    });
  }
  function updateEventListener7() {
    var list = document.querySelectorAll('[class*="stats__player"]');
    list.forEach(element => {
      element.addEventListener('click', () => {
        var id = element.className.charAt(element.className.length - 1);
        var cards = document.querySelector('.stats__cards'+id);
        var arrow = element.querySelector('.stats__arrow');
        if (cards.style.display === 'none')  {
          cards.style.display = 'flex';
          arrow.style.borderBottom = '10px solid black';
          arrow.style.borderTop = '10px solid transparent';
          arrow.style.top = '70%'
        } else {
          cards.style.display = 'none'
          arrow.style.borderTop = '10px solid black';
          arrow.style.borderBottom = '10px solid transparent';
          arrow.style.top = '90%'
        }
      })
    })
  }

  let timeInterval;
  let timeInterval2;
  var startTime,
      endTime;
  var throwError = false;
  async function createGame() {
    //////////////////////////
    /// We have to clear all visual in UICtrl before we continue. (when we reset the game)
    /// before we reset data
    // This diceClicked makes it throw an error and cleans the previous game funcion executions
    diceClicked = true;
    // So with bunch of these trues i can make game throw an error so it resets itself properly visually!!
    throwError = true;
    actionTaken = true;
    cardTaken = true;
    endTurn = true;
    document.querySelector('.map__winDisplay').style.display = 'none';  
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.overlay__rankings').style.display = 'none';
    document.querySelector('.overlay__rankings').innerHTML = '<button class="startGame3 startGame btn">New Game</button>';
    document.querySelector('.startGame3').addEventListener('click', createGame);
    clearInterval(timeInterval);
    clearInterval(timeInterval2);
    document.querySelector('.clock').innerHTML = '00:00:00'
    await new Promise(r => setTimeout(r, 0100));
    UICtrl.hideDices();
    UICtrl.clearGame(game.getPlayers());
    game.clearGame();
    UICtrl.clearMapCards(game.getBankProperties());
    diceClicked = false;
    throwError = false; 
    actionTaken = false;
    cardTaken = false;
    endTurn = false;
    
    UICtrl.showPlayerPanel();
    updateEventListener();
    
    // Waits for a number of players to be picked before continuing this function!!
    while (!numberIsPicked) {
      await new Promise(r => setTimeout(r, 0100));
    }
    numberIsPicked = false;

    UICtrl.showModePanel();
    updateEventListener6();
    while (!modeIsPicked) {
      await new Promise(r => setTimeout(r, 0100));
    }
    modeIsPicked = false;


    // making broj2 so i can make 2 while loops!!
    var broj2 = broj; 

    while (broj > 0) {
      var charsArr = game.getCharsArr();
      UICtrl.showPlayerCreate(broj, charsArr);
      updateEventListener2();

      while (!playerIsCreated) {
        await new Promise(r => setTimeout(r, 0100));
      }
      game.addPlayer(broj, name, char);
      game.removeChar(charIndex);

      playerIsCreated = false;
      broj--;
    }
    var playersArr = game.getPlayers();
    UICtrl.showPlayerDashboard(playersArr);

    // Roll dice for play order!!
    while (broj2 > 0) {
      // Added gameIsActive as second argument so i wouldnt create anouther similiar showRollDice function.
      var gameIsActive = false;
      UICtrl.showRollDice(playersArr[broj2 - 1].name, gameIsActive);
      updateEventListener3();
      while (!diceClicked) {
        await new Promise(r => setTimeout(r, 0100));
      }
      game.addDiceRoll(playersArr[broj2 - 1], gameIsActive);
      var dices = game.getDices();
      UICtrl.showDices(dices, broj2);
      await new Promise(r => setTimeout(r, 0500));
      UICtrl.hideDices();
      diceClicked = false;
      broj2--;
    };
    // Now sort players by rolledNumber!!
    game.sortPlayers(playersArr);
    UICtrl.showPlayerDashboard(playersArr);
    var rolledDices = game.getRolledDices();
    console.log(rolledDices, playersArr);
    updateEventListener7();
    var lastNumberSame = 0;
    var sameNumbers;
    var id = 0;
    var p = 0;
    for (var h = 0; h < rolledDices.length; h++) {
      if (h !== 0) {
        lastNumberSame = playersArr.find(x => x.rolledNumber == (rolledDices[h-1][0] + rolledDices[h-1][1])).id;
      }
      id = playersArr.find(x => x.rolledNumber == (rolledDices[h][0] + rolledDices[h][1])).id;
      if (lastNumberSame == playersArr.find(x => x.rolledNumber == (rolledDices[h][0] + rolledDices[h][1])).id) {
        sameNumbers = playersArr.filter(x => x.rolledNumber == (rolledDices[h-1][0] + rolledDices[h-1][1]));
        p++;
        id = sameNumbers[p].id;
      } else {
        p = 0;
      }

      UICtrl.showDicesNextToPlayerName(rolledDices[h], id);
    }
    // And now we can play the game!!
    i = 0;
    if (mode == 'timemode') {
      // make seconds out of minutes
      gameTime = gameTime * 60;
      startTimer();
    } else {
      startClock();
    }
    
    gameIsPlaying(i);
  };
  console.log(new Date() / 1000);
  // Keeps track of which player is on turn!!
  let i = 0;
  let currentPlayer = 0;
  var endTurn = false;
  var doubleRolls = 0;
  var playersArr;
  // Some sort of recursion going on here lol (not sure if this is the best way to do it :S? Why doesn't this throw stack overflow error?)
  var gameIsPlaying = async function(i) {
    // This throws an error when i want to create New Game and clears the previous game execution!!
    if (throwError) document.querySelector('.loool'+errorrrrrr);
    
    var gameIsActive = game.getGameIsActive();
    playersArr = game.getPlayers();
    // Highlights current player
    UICtrl.highlightCurrent(playersArr[i].id);
    endTurn = false;
    doubleRolls = 0;

    // refresh all properties so we can build in this turn!
    playersArr[i].properties.forEach(el => {
      el.built = false;
    })

    if (gameIsActive && playersArr[i].inJail == 0) {
      // Roll while player keeps getting double dice!
      do {
        var bankProperties = game.getBankProperties();
        var propertiesIDs = game.getPropertyIDs();

        var lastSpot = playersArr[i].mapSpot;
        var beforeRollSpot = playersArr[i].mapSpot;
        UICtrl.showRollDice(playersArr[i].name, gameIsActive);
        // Here we are wating for player to click Roll Dice button!!
        while (!diceClicked) {
          await new Promise(r => setTimeout(r, 0100));
        }
        diceClicked = false;
        game.addDiceRoll(playersArr[i], gameIsActive);
        var dices = game.getDices();;
        UICtrl.showDices(dices, playersArr[i].id);
        await new Promise(r => setTimeout(r, 0500));
        UICtrl.hideDices();
        UICtrl.updatePlayerSpot(playersArr[i]);
        if (dices[0] == dices[1]) doubleRolls++;
        // i want to see him getting to his spot lol
        //await new Promise(r => setTimeout(r, 0500));
        // Go To Jail card and 3 times in a row Double rolled
        if (doubleRolls == 3 || playersArr[i].mapSpot == 11) {
          UICtrl.showGoToJail(playersArr[i].name, playersArr[i].inJail);
          await new Promise(r => setTimeout(r, 3000));
          UICtrl.hideGoToJail();
          playersArr[i].inJail = 3;
          playersArr[i].mapSpot = 31;
          UICtrl.updatePlayerSpot(playersArr[i]);
          break;
        }
        // Check if landed on Chance
        if ([28,3,17].includes(playersArr[i].mapSpot)) {
          var chances = game.getChances();
          var typeOfCard = 'chance';
          UICtrl.showCard(playersArr[i].mapSpot, typeOfCard);
          cardTaken = false;
          updateEventListener4();
          while (!cardTaken) {
            await new Promise(r => setTimeout(r, 0100));
          }
          UICtrl.hideCard();
          UICtrl.showCardText(chances[0].text, typeOfCard);
          // check if we only change a spot or we get money
          if ([1,2,3,5,6,7].includes(chances[0].id)) {
            lastSpot = playersArr[i].mapSpot;
            // animation here would be good tho
            game.changeSpot(playersArr[i], chances[0].id);
            await new Promise(r => setTimeout(r, 2000));
            UICtrl.updatePlayerSpot(playersArr[i]);
            //////////////////////////
            // check the new card spot
            // maybe not here but down

          } else if ([4,9,10].includes(chances[0].id)) {
            var moneyDiff = 0;
            var sign = '+';
            chances[0].id == 4 ? moneyDiff = 50 : chances[0].id == 9 ? moneyDiff = 150 : moneyDiff = 100;
            game.updateBudget(playersArr[i], moneyDiff, sign);
            UICtrl.showMoneyChange(playersArr[i].id, moneyDiff, sign);
            await new Promise(r => setTimeout(r, 3000));
            UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
          } else {
            var moneyAmount = 50;
            var moneySum = 0;
            for (var j = 0; j < playersArr.length; j++){
              // Pay everyone except myself
              if (playersArr[j] !== playersArr[i]) {
                game.payTime(playersArr[i], playersArr[j], moneyAmount, sign = '-');
                UICtrl.showMoneyChange(playersArr[j].id, moneyAmount, sign = '+');
                moneySum += moneyAmount;
              }
              if (j+1 == playersArr.length) {
                UICtrl.showMoneyChange(playersArr[i].id, moneySum, sign = '-');
              }
            }
            await new Promise(r => setTimeout(r, 3000));
            // And now remove numbers next to the budget
            UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
            for (var k = 0; k < playersArr.length; k++){
              if (playersArr[k] !== playersArr[i]) {
                UICtrl.hideMoneyChange(playersArr[k].id, playersArr[k].budget);
              }
            }
          }
          UICtrl.hideCardText();
          // puts the card on the back
          chances.push(chances[0]);
          // and then removes it from the top
          chances.shift();
        }
        // Check if landed on Community chest
        if ([14,23,38].includes(playersArr[i].mapSpot)) {
          var communityChests = game.getCommunityChests();
          var typeOfCard = 'communityChest';
          UICtrl.showCard(playersArr[i].mapSpot, typeOfCard);
          cardTaken = false;
          updateEventListener4();
          while (!cardTaken) {
            await new Promise(r => setTimeout(r, 0100));
          }
          UICtrl.hideCard();
          UICtrl.showCardText(communityChests[0].text, typeOfCard);
          if (1 == communityChests[0].id) {
            lastSpot = playersArr[i].mapSpot;
            // animation here would be good tho
            game.changeSpot(playersArr[i], communityChests[0].id);
            await new Promise(r => setTimeout(r, 2000));
            UICtrl.updatePlayerSpot(playersArr[i]);
          } else if ([5,6].includes(communityChests[0].id)) {
            var moneyDiff = 0;
            var sign = '-';
            communityChests[0].id == 5 ? moneyDiff = 100 : moneyDiff = 150;
            game.updateBudget(playersArr[i], moneyDiff, sign);
            UICtrl.showMoneyChange(playersArr[i].id, moneyDiff, sign);
            await new Promise(r => setTimeout(r, 3000));
            UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
          } else if ([3,4,7,2,8].includes(communityChests[0].id)) {
            var moneyDiff = 0;
            var sign = '+';
            communityChests[0].id == 2 ? moneyDiff = 200 : communityChests[0].id == 3 ?moneyDiff = 45 : communityChests[0].id == 8 ? moneyDiff = 25 : moneyDiff = 100;
            game.updateBudget(playersArr[i], moneyDiff, sign);
            UICtrl.showMoneyChange(playersArr[i].id, moneyDiff, sign);
            await new Promise(r => setTimeout(r, 3000));
            UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
          } else {
            var moneyAmount = 0;
            var moneySum = 0;
            communityChests[0].id == 9 ? moneyAmount = 10 : moneyAmount = 50;
            for (var j = 0; j < playersArr.length; j++){
              // Take from everyone except myself
              if (playersArr[j] !== playersArr[i]) {
                game.payTime(playersArr[i], playersArr[j], moneyAmount, sign = '+');
                UICtrl.showMoneyChange(playersArr[j].id, moneyAmount, sign = '-');
                moneySum += moneyAmount;
              }
              if (j+1 == playersArr.length) {
                UICtrl.showMoneyChange(playersArr[i].id, moneySum, sign = '+');
              }
            }
            await new Promise(r => setTimeout(r, 3000));
            // And now remove numbers next to the budget
            UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
            for (var k = 0; k < playersArr.length; k++){
              if (playersArr[k] !== playersArr[i]) {
                UICtrl.hideMoneyChange(playersArr[k].id, playersArr[k].budget);
              }
            }
          }
          UICtrl.hideCardText();
          // puts the card on the back
          communityChests.push(communityChests[0]);
          // and then removes it from the top
          communityChests.shift();
        }
        //////////////////////////////////
        // Does the player pass the GO???
        if (playersArr[i].mapSpot == 21 && [23, 28].includes(lastSpot) && beforeRollSpot < 21) {
          game.updateBudget(playersArr[i], 400, '+');
          UICtrl.showCard(21, 'go2');
          UICtrl.showMoneyChange(playersArr[i].id, 400, '+');
          await new Promise(r => setTimeout(r, 2000));
          UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
          UICtrl.hideCard();
        } else if ((playersArr[i].mapSpot >= 21 && (playersArr[i].mapSpot - lastSpot) <=  12 && lastSpot < 21)
          || playersArr[i].mapSpot == 21 
          || playersArr[i].mapSpot == 29 + lastSpot // st. charles place
          || playersArr[i].mapSpot == 15 + lastSpot // st. charles place
          || playersArr[i].mapSpot == -12 + lastSpot
          || ([23,28].includes(lastSpot) && beforeRollSpot < 21)) {
          game.updateBudget(playersArr[i], 200, '+');
          UICtrl.showCard(21, 'go');
          UICtrl.showMoneyChange(playersArr[i].id, 200, '+');
          await new Promise(r => setTimeout(r, 2000));
          UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
          UICtrl.hideCard();
        } /* else if ([23,28].includes(lastSpot) && beforeRollSpot < 21) {
          game.updateBudget(playersArr[i], 200, '+');
          UICtrl.showCard(21, 'go');
          UICtrl.showMoneyChange(playersArr[i].id, 200, '+');
          await new Promise(r => setTimeout(r, 2000));
          UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
          UICtrl.hideCard();
        } */
        // Check if landed on Tax card
        if (playersArr[i].mapSpot == 25 || playersArr[i].mapSpot == 19) {
          var moneyDiff = 0;
          var sign = '-';
          var typeOfCard = 'tax';
          playersArr[i].mapSpot == 25 ? moneyDiff = 200 : moneyDiff = 100;
          UICtrl.showCard(playersArr[i].mapSpot, typeOfCard);
          game.updateBudget(playersArr[i], moneyDiff, sign);
          UICtrl.showMoneyChange(playersArr[i].id, moneyDiff, sign);
          await new Promise(r => setTimeout(r, 3000));
          UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
          UICtrl.hideCard();
        }
        // Player landed on Parking
        if (playersArr[i].mapSpot == 1 && game.getParkingMoney() !== 0) {
          game.updateBudget(playersArr[i], game.getParkingMoney(), sign = '+');
          UICtrl.showParking(playersArr[i].name);
          UICtrl.showMoneyChange(playersArr[i].id, game.getParkingMoney(), sign = '+');
          game.updateParkingMoney(-game.getParkingMoney());
          await new Promise(r => setTimeout(r, 2500));
          UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
          UICtrl.hideParkingChange(game.getParkingMoney());
          UICtrl.hideParking();
        }
        // check card and display it and maybe buy?
        breakme: if (propertiesIDs.includes(playersArr[i].mapSpot)) {
          var typeOfCard;
          var indexOfProperty;
          var owner = 0;
          var rent;
          var property = bankProperties.find(x => x.id == playersArr[i].mapSpot);
          // Check if its available to buy the property
          if (property !== undefined) {
            typeOfCard = 'property';
          } else {
            typeOfCard = 'propertyTaken';
            /////////////////////
            // Find who owner of the property is and get it!!!
            var n = 0;
            while (property == undefined) {
              property = playersArr[n].properties.find(x => x.id == playersArr[i].mapSpot);
              owner = playersArr[n];
              n++;
            }
            rent = (property.value);
          }
          // Stop the execution of this roll cuz property is already owned by me
          if (owner == playersArr[i]) break breakme;
          UICtrl.showCard(playersArr[i].mapSpot, typeOfCard, property.value, owner, rent);
          updateEventListener5();
          while (!actionTaken) {
            await new Promise(r => setTimeout(r, 0100));
          }
          // throws an error so i can reset the game for a new one
          if (throwError) document.querySelector('.loool'+errorrrrrr);
          actionTaken = false;
          UICtrl.hideCard();
          if (actionRent) {
            sign = '-';
            moneyDiff = rent;
            game.payTime(playersArr[i], owner, moneyDiff, sign);
            UICtrl.showMoneyChange(playersArr[i].id, moneyDiff, sign);
            UICtrl.showMoneyChange(owner.id, moneyDiff, sign = '+');
            await new Promise(r => setTimeout(r, 1000));
            UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
            UICtrl.hideMoneyChange(owner.id, owner.budget);
            actionRent = false;
            // Give properties to the player you lost to if your budget is below $0
            if (playersArr[i].budget < 0) {
              for (var ggg = 0; ggg < playersArr[i].properties.length; ggg++) {
                owner.properties.push(playersArr[i].properties[ggg]);
              }
              while (playersArr[i].properties.length !== 0) {
                playersArr[i].properties.pop();
              }
              UICtrl.updateStatsCards(owner.properties, owner.id, owner.char);
            }
          } else if (actionBuy) {
            sign = '-';
            moneyDiff = property.value;
            game.updateBudget(playersArr[i], moneyDiff, sign);
            game.updateParkingMoney(property.value);
            UICtrl.showParkingChange(property.value);
            UICtrl.showMoneyChange(playersArr[i].id, moneyDiff, sign);
            await new Promise(r => setTimeout(r, 1000));
            UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
            UICtrl.hideParkingChange(game.getParkingMoney());
            // Gives property to the owner array and takes it from the bank!!
            playersArr[i].properties.push(bankProperties.find(x => x.id == playersArr[i].mapSpot));
            indexOfProperty = bankProperties.indexOf(bankProperties.find(x => x.id == playersArr[i].mapSpot));
            bankProperties.splice(indexOfProperty, 1);
            actionBuy = false;
            UICtrl.updateStatsCards(playersArr[i].properties, playersArr[i].id, playersArr[i].char);
            // ADD visuals which show who owns what
          } else {
            typeOfCard = 'auction';
            var bidValue = (property.value / 2);
            var n = i;
            var bidders = [];
            var bidder;
            for(var k = 0; k < playersArr.length; k++){
              bidders.push(playersArr[k]);
            }
            while (bidders.length !== 1) {
              bidders.length - 1 == n ? n = 0 : n++;
              bidder = bidders[n];
              UICtrl.showCard(playersArr[i].mapSpot, typeOfCard, bidValue, bidder);
              while (!actionTaken) {
                await new Promise(r => setTimeout(r, 0100));
              }
              actionTaken = false;
              if (actionBuy) {
                bidValue < 10000 ? bidValue = Math.floor(bidValue + (bidValue / 5)) : bidValue = 10000;
                actionBuy = false;
              } else {
                bidders.splice(n, 1);
                n--;
              }
              UICtrl.hideCard();
            }
            typeOfCard = 'auctionWinner';
            UICtrl.showCard(playersArr[i].mapSpot, typeOfCard, bidValue, bidders[0]);
            game.updateBudget(bidders[0], bidValue, sign = '-');
            game.updateParkingMoney(bidValue);
            UICtrl.showMoneyChange(bidders[0].id, bidValue, sign = '-');
            UICtrl.showParkingChange(bidValue);
            await new Promise(r => setTimeout(r, 2000));
            UICtrl.hideMoneyChange(bidders[0].id, bidders[0].budget);
            UICtrl.hideParkingChange(game.getParkingMoney());
            UICtrl.hideCard();
            // Gives property to the owner array and takes it from the bank!!
            bidders[0].properties.push(bankProperties.find(x => x.id == playersArr[i].mapSpot));
            indexOfProperty = bankProperties.indexOf(bankProperties.find(x => x.id == playersArr[i].mapSpot));
            bankProperties.splice(indexOfProperty, 1);
            UICtrl.updateStatsCards(bidders[0].properties, bidders[0].id, bidders[0].char);
            // CHECK AFTER THIS ACUTION IF THE PLAYER WHO WON WENT BELOW $0!!!
            var bidderOut = false;
            if (bidders[0].budget < 0) {
              if (bidders[0].id == playersArr[i].id) {
                // dices[0] is changed here so if the removed player rolled double it doesnt count.
                dices[0] = 42;
              }
              console.log(playersArr.indexOf(bidders[0]));
              // give properties back to the bank
              for (var g = 0; g < bidders[0].properties.length; g++) {
                bankProperties.push(bidders[0].properties[g]);
              }
              removePlayer(bidders[0], bankProperties);
              await new Promise(r => setTimeout(r, 2000));
              bidderOut = true;

            }
          }
          
        }
        if (bidderOut) {
          i--;
        } else {
          ////////////////////////////////
          // check if players budget is below 0 and if it is kick him out of the game
          if (playersArr[i].budget < 0 && bidders == undefined) {
            for (var gg = 0; gg < playersArr[i].properties.length; gg++) {
              bankProperties.push(playersArr[i].properties[gg]);
            }
            removePlayer(playersArr[i], bankProperties);
            await new Promise(r => setTimeout(r, 2000));
            i--;
            // dices[0] is changed here so if the removed player rolled double it doesnt count.
            dices[0] = 42;
          }
        }
        bidderOut = false
        bidders = undefined;


      } while(dices[0] == [dices[1]] && playersArr[i].inJail == 0);

      /////////////////////////////////
      ////////////// SAME //////////
      UICtrl.showEndTurn();
      // Here we are wating for player to click End Turn button!!
      while (!endTurn) {
        await new Promise(r => setTimeout(r, 0100));
      }
      endTurn = false;

      // make this same as in jail!!!
      if (i == -1) {
        UICtrl.highlightCurrent(playersArr[i+1].id);
        UICtrl.removeCurrent(playersArr[i+1].id);
      } else {
        UICtrl.highlightCurrent(playersArr[i].id);
        UICtrl.removeCurrent(playersArr[i].id);
      }
      UICtrl.hideEndTurn();
      // When we get to last player in order we reset the circle with setting i = 0;
      playersArr.length - 1 == i ? i = 0 : i++;
      currentPlayer = i;
      gameIsPlaying(i);
    } else if (gameIsActive) {
      // this is when jail happens (else if)!!! not end of the game!
      UICtrl.showGoToJail(playersArr[i].name, playersArr[i].inJail);
      playersArr[i].inJail--;

      /////////////////////////////////
      ////////////// SAME //////////
      UICtrl.showEndTurn();
      // Here we are wating for player to click End Turn button!!
      while (!endTurn) {
        await new Promise(r => setTimeout(r, 0100));
      }
      endTurn = false;
      UICtrl.removeCurrent(playersArr[i].id);
      UICtrl.hideGoToJail();
      UICtrl.hideEndTurn();
      // When we get to last player in order we reset the circle with setting i = 0;
      playersArr.length - 1 == i ? i = 0 : i++;
      currentPlayer = i;
      gameIsPlaying(i);
    } else {
      UICtrl.showWinner(playersArr[i]);
    }
  };

  var removePlayer = async function(player, bankProperties) {
    UICtrl.showBankruptcy(player.name);
    await new Promise(r => setTimeout(r, 2000));
    UICtrl.removePlayer(player.id, bankProperties);
    var indexOfPlayer = playersArr.indexOf(playersArr.find(x => x.id == player.id));
    playersArr.splice(indexOfPlayer, 1);
    endTurn = true;
  }
  
  function getGameTime(theTime) {
    var seconds = Math.floor(theTime % 60);
    var minutes = Math.floor((theTime / 60) % 60);
    var hours = Math.floor((theTime / 60 / 60));
    var total = theTime;
    hours = ('0' + hours).slice(-2);
    minutes = ('0' + minutes).slice(-2);
    seconds = ('0' + seconds).slice(-2);
    return {
      total,
      hours,
      minutes,
      seconds
    }
  }

  var startTimer = function() {
     timeInterval = setInterval(() => {
      gameTime--;
      const time = getGameTime(gameTime);
      document.querySelector('.clock').innerHTML = 'Remaining: ' + time.hours + ':' + time.minutes + ':' + time.seconds;
      if (time.total <= 0) {
        clearInterval(timeInterval);

        game.sortByRankings(game.getPlayers());
        document.querySelector('.overlay').style.display = 'flex';
        document.querySelector('.overlay__rankings').style.display = 'flex';
        UICtrl.showPlayerDashboard(game.getPlayers(), true);
        for (var i = 0; i < game.getPlayers().length; i++) {
          console.log(i);
          UICtrl.updateStatsCards(playersArr[i].properties, playersArr[i].id, playersArr[i].char);
        }
        updateEventListener7();
      }
    }, 1000);
  }

  function getTime() {
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var seconds = new Date().getSeconds();
    hours = ('0' + hours).slice(-2);
    minutes = ('0' + minutes).slice(-2);
    seconds = ('0' + seconds).slice(-2);
    return {
      hours,
      minutes,
      seconds
    }
  }

  var startClock = function() {
     timeInterval2 = setInterval(() => {
      const time = getTime();
      document.querySelector('.clock').innerHTML = time.hours + ':' + time.minutes +':'+ time.seconds;
    }, 1000);
  }

  var propIds;
  var availSpots;
  var buildSellHouses = function(buildOrSell) {
    console.log(playersArr[currentPlayer].name, playersArr[currentPlayer].properties);
    var card;
    var propIdsOpen;
    propIds = [];
    availSpots = [];
    for (var i = 0; i < playersArr[currentPlayer].properties.length; i++) {
      propIds.push(playersArr[currentPlayer].properties[i].id);
    }
    propIdsOpen = findAvailSpots(propIds);
    // check if we already built on this property and if we did we drop it
    var indexOf;
    var id;
    propIdsOpen.forEach(id => {
      console.log(availSpots);
      indexOf = playersArr[currentPlayer].properties.indexOf(playersArr[currentPlayer].properties.find(el => el.id == id));

      if (playersArr[currentPlayer].properties[indexOf].built == false && playersArr[currentPlayer].properties[indexOf].houses < 5 && buildOrSell == 'Build') {
        availSpots.push(id);
      } else if (buildOrSell == 'Sell' && playersArr[currentPlayer].properties[indexOf].houses <= 5 && playersArr[currentPlayer].properties[indexOf].houses >= 1) {
        availSpots.push(id);
      }
    });
    console.log(availSpots);
    UICtrl.availHouseSpots(availSpots, buildOrSell);

    
    availSpots.forEach(id => {
      card = document.querySelector('.map').querySelector('[data-id="'+id+'"]').children[2];
      card.addEventListener('click', (event) => {
        id = event.target.parentNode.getAttribute('data-id');
        if (id > 0) {
          indexOf = playersArr[currentPlayer].properties.indexOf(playersArr[currentPlayer].properties.find(el => el.id == id));
          UICtrl.addRemoveHouse(id, buildOrSell, playersArr[currentPlayer].properties[indexOf].houses);

          UICtrl.removeHouseSpots([id]);
          
          if (buildOrSell == 'Build') {
            playersArr[currentPlayer].properties[indexOf].built = true;
            playersArr[currentPlayer].properties[indexOf].houses++;
          } else {
            playersArr[currentPlayer].properties[indexOf].houses--;
          }
        }
      });
    })
  }

  var findAvailSpots = function(propIds) {
    var ids = [];
    if (propIds.includes(22) && propIds.includes(24)) {
      ids.push(22,24);
    }
    if (propIds.includes(27) && propIds.includes(29) && propIds.includes(30)) {
      ids.push(27,29,30);
    }
    if (propIds.includes(32) && propIds.includes(34) && propIds.includes(35)) {
      ids.push(32,34,35);
    }
    if (propIds.includes(37) && propIds.includes(39) && propIds.includes(40)) {
      ids.push(37,39,40);
    }
    if (propIds.includes(2) && propIds.includes(4) && propIds.includes(5)) {
      ids.push(2,4,5);
    }
    if (propIds.includes(7) && propIds.includes(8) && propIds.includes(10)) {
      ids.push(7,8,10);
    }
    if (propIds.includes(12) && propIds.includes(13) && propIds.includes(15)) {
      ids.push(12,13,15);
    }
    if (propIds.includes(18) && propIds.includes(20)) {
    ids.push(18,20);
    }
    return ids;
  }

  var checkIfPlayerPassedGO = function() {

  };

  var hiLol = function() {
    
  };

  // event listeners should be at the end cuz only then i can assign functions to var!!
  setupEventListeners();
})(gameLogic, UIController);

// Maybe make it online multiplayer?

// SNSOPOLY EDITION?!?!?!
// make video cut extension and display on the board random cuts
// svaka stranka druga boja i special effect???!?!?!?!?

// houses and hotels!!!
// trade feature!!!
// responsive oon mobile