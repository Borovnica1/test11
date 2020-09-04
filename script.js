// Using IIFE for data privacy (this is ES5, there are blocks for ES6) and MVC architecture for keeping code clean!

var gameLogic = (function() {
  // I'm using here Classical Inheritance. Old school ES5 style.
  // There is much better way to do this with instantiation (*class* keyword) in ES6 and React!!
  // Function constructor
  var Player = function(id, name, char, budget, mapSpot, rolledNumber, inJail) {
    this.id = id;
    this.name = name;
    this.char = char;
    this.budget = budget;
    this.mapSpot = mapSpot;
    this.rolledNumber = rolledNumber;
    this.inJail = inJail;
  }

  var Player1 = new Player(1, 'John', 22);
  console.log(Player1.name);

  var players = [];
  var diceRolls = [];
  var dices = [];
  var charsArr = ['&#9877;', '&#10086;', '&#9885;', '&#9882;', '&#9884;', '&#9992;', '&#9763;', '&#9876;'];
  var chances = ['Advance to "Go".', 'Advance to Illinois Avenue.', 'Advance to St. Charles Place. If you pass Go, collect $200.', 'Bank pays you dividend of $50.', 'Go Back 3 Spaces.', 'Go directly to Jail', 'Take a walk on the Board walk.', 'You have been elected Chairman of the Board. Pay each player $50.', 'Your building and loan matures. Collect $150.', 'You have won a crossword competition. Collect $100.'];
  var communityChests = ['Advance to "Go".', 'Bank error in your favor. Collect $200.', 'From sale of stock you get $45.', 'Xmas Fund matures. Collect $100.', 'Hospital Fees. Pay hospital $100.', 'Pay school tax of $150', 'You inherit $100.', 'Receive for services $25.', 'It\'s your birthday. Collect $10 from every player.', 'Grand Opera Opening. Collect $50 from every player for opening night seats.'];

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

  return {
    addPlayer: function(id, name, char) {
      var newPlayer = new Player(id, name, char, 1500, 21, 0, 0);
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

  return {
    getDomStrings: function() {
      return DOMstrings;
    },

    
    showPlayerPanel: function() {
      // removes StartTheGame button!
      document.querySelector(DOMstrings.startGame).parentNode.removeChild(document.querySelector(DOMstrings.startGame));

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

    showPlayerCreate: function(playerNumber, charsArr) {
      html = '<div class="map__modal" style="width: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 1.6rem 2rem;">' 
      + '<h1>' + 'Player ' + playerNumber + '</h1>'
      + '<h2 style="margin-top: .4rem">' + 'Name:' + '</h2>' + '<input type="text" class="player__name" required maxlength="14" style="display:block;height:1.9rem;outline:none;border:none;">'
      + '<h2 style="margin-top: .4rem">' + 'Choose a character:' + '</h2>'
      for (var i = 0; i < charsArr.length; i++) {
        html += '<div class="map__box2 arrayIndex'+i+'" style="cursor:pointer; border: 1px solid #000; width:  40px; height: 40px; border-radius:50%; overflow:hidden; display: inline-flex; justify-content: center;margin-right:.2rem">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 30px;">'  + charsArr[i] + '</span>' + '</div>'
      } 
      html += '<button class="map__done btn" style="display:flex;margin:auto;padding:.6rem .9rem;margin-top:.4rem">' + 'Done' + '</button>'
      + '</div>'

      mapContainer.insertAdjacentHTML('beforeend', html);
    },

    showPlayerDashboard: function(players) {
      // Clears the previous created dashboard of players!! (after sorting i believe)
      document.querySelector('.stats').innerHTML = '';
      document.querySelector('[data-id="'+players[0].mapSpot+'"]').innerHTML = '';

      for (var i = 0; i < players.length; i++) {
        html = '<div class="stats__player'+players[i].id+'" style="height=300px;background-color:lightblue;display:flex;margin-bottom: .4rem;border-radius:5px;padding:.5rem 1rem;">'
        + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  40px; height: 40px; border-radius:50%;display:flex;justify-content: center;background-color:#82cdff">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + players[i].char + '</span>' + '</div>'
        + '<div style="margin-left: .3rem;overflow:hidden;width:47%;white-space: nowrap;">'
        + '<h1>' + players[i].name + '</h1>'
        + '<h2 style="margin-left: .8rem;margin-top:.2rem;color:darkgreen">' + '$' + players[i].budget + '</h2>'
        + '</div>'
        + '<div class="stats__rolled'+i+'" style="margin-left:auto;display:flex;justify-content:center;align-items:center;">' + '' + '</div>'
        + '</div>';
        document.querySelector('.stats').insertAdjacentHTML('beforeend', html);


        html = '<div class="map__player'+players[i].id+'" style="display:inline-flex;padding: .1rem;">'
        + '<div class="map__box2 index100" style="cursor:pointer; border: 1px solid #000; width:  27px; height: 27px;background-color:lightblue; border-radius:50%; overflow:hidden; display:inline-flex;justify-content: center;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + players[i].char + '</span>' 
        + '</div>';
        document.querySelector('[data-id="'+players[i].mapSpot+'"]').insertAdjacentHTML('beforeend', html);
      }
    },

    showRollDice: function(name) {
      var rollDiceBtn = document.querySelector('.rollDice');
      var playerNumber = document.querySelector('.playerNumber');
      playerNumber.innerHTML = '<h1 style="width:600px">' + '<span style="color:rgb(0, 174, 255)">' + name + '</span>' + '\'s turn!' +  '</h1>';
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

    showDices: function(dices, index) {
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
      document.querySelector('.stats__rolled'+index).innerHTML = '<h2>Rolled: ' + (dices[0] + dices[1]) + '</h2>' + htmlDice1 + htmlDice2;
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
        + '<div class="map__box2 index100" style="cursor:pointer; border: 1px solid #000; width:  27px; height: 27px;background-color:lightblue;border-radius:50%; overflow:hidden; display:inline-flex;justify-content: center;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + player.char + '</span>' 
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

    showCard: function(cardNumber, typeOfCard) {
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
      }
      document.querySelector('.map__card').style.display = 'block';
    },
    hideCard: function() {
      document.querySelector('.map__card').style.display = 'none';
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
    }


  }
})();


var controller = (function(game, UICtrl) {
  
  var setupEventListeners = function() {
    var DOM = UICtrl.getDomStrings();

    document.querySelector(DOM.dice).addEventListener('click', hiLol);
    document.querySelector(DOM.startGame).addEventListener('click', createGame);
    document.querySelector('.endTurn').addEventListener('click', () => endTurn = true);

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

  async function createGame() {
    UICtrl.showPlayerPanel();
    updateEventListener();
    
    // Waits for a number of players to be picked before continuing this function!!
    while (!numberIsPicked) {
      await new Promise(r => setTimeout(r, 0100));
    }

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
    // Show some visual box where it says that they are rolling for play order
    while (broj2 > 0) {
      // Added gameIsActive as second argument so i wouldnt create anouther similiar showRollDice function.
      var gameIsActive = false;
      UICtrl.showRollDice(playersArr[broj2 - 1].name);
      updateEventListener3();
      while (!diceClicked) {
        await new Promise(r => setTimeout(r, 0100));
      }
      game.addDiceRoll(playersArr[broj2 - 1], gameIsActive);
      var dices = game.getDices();
      UICtrl.showDices(dices, broj2 - 1);
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
    for (var i = 0; i < rolledDices.length; i++) {
      UICtrl.showDicesNextToPlayerName(rolledDices[i], i);
    }
    // And now we can play the game!!
    gameIsPlaying();
  };

  // Keeps track of which player is on turn!!
  var i = 0;
  var endTurn = false;
  var doubleRolls = 0;
  // Some sort of recursion going on here lol (not sure if this is the best way to do it :S? Why doesn't this throw stack overflow error?)
  var gameIsPlaying = async function() {
    var gameIsActive = game.getGameIsActive();
    var playersArr = game.getPlayers();
    doubleRolls = 0;
    if (gameIsActive && playersArr[i].inJail == 0) {
      // Roll while player keeps getting double dice!
      do {
        var lastSpot = playersArr[i].mapSpot;
        UICtrl.showRollDice(playersArr[i].name);
        // Here we are wating for player to click Roll Dice button!!
        while (!diceClicked) {
          await new Promise(r => setTimeout(r, 0100));
        }
        diceClicked = false;
        game.addDiceRoll(playersArr[i], gameIsActive);
        var dices = game.getDices();
        UICtrl.showDices(dices, i);
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
        // Check if landed on Tax card
        if (playersArr[i].mapSpot == 25 || playersArr[i].mapSpot == 19) {
          var moneyDiff = 0;
          var sign = '-';
          var typeOfCard = 'tax';
          playersArr[i].mapSpot == 25 ? moneyDiff = 200 : moneyDiff = 100;
          UICtrl.showCard(playersArr[i].mapSpot, typeOfCard);
          game.updateBudget(playersArr[i], moneyDiff, sign);
          console.log(playersArr[i]);
          UICtrl.showMoneyChange(playersArr[i].id, moneyDiff, sign);
          await new Promise(r => setTimeout(r, 3000));
          UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
          UICtrl.hideCard();
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
        console.log(lastSpot, playersArr[i].mapSpot);
        if ((playersArr[i].mapSpot >= 21 && (playersArr[i].mapSpot - lastSpot) <= 12 && lastSpot < 21)
          || playersArr[i].mapSpot == 21
          || playersArr[i].mapSpot == 29 + lastSpot
          || playersArr[i].mapSpot == 15 + lastSpot
          || playersArr[i].mapSpot == 23 - lastSpot ) {
          game.updateBudget(playersArr[i], 200, '+');
          UICtrl.showMoneyChange(playersArr[i].id, 200, '+');
          await new Promise(r => setTimeout(r, 2000));
          UICtrl.hideMoneyChange(playersArr[i].id, playersArr[i].budget);
        }

        // check card and display it and maybe buy?
      } while(dices[0] == [dices[1]]);

      /////////////////////////////////
      ////////////// SAME //////////
      UICtrl.showEndTurn();
      // Here we are wating for player to click End Turn button!!
      while (!endTurn) {
        await new Promise(r => setTimeout(r, 0100));
      }
      endTurn = false;
      UICtrl.hideEndTurn();
      // When we get to last player in order we reset the circle with setting i = 0;
      playersArr.length - 1 == i ? i = 0 : i++;
      gameIsPlaying();
    } else {
      // this is when jail happens (else if)!!! not end of the game!
      UICtrl.showGoToJail(playersArr[i].name, playersArr[i].inJail);
      await new Promise(r => setTimeout(r, 1000));
      UICtrl.hideGoToJail();
      playersArr[i].inJail--;

      /////////////////////////////////
      ////////////// SAME //////////
      UICtrl.showEndTurn();
      // Here we are wating for player to click End Turn button!!
      while (!endTurn) {
        await new Promise(r => setTimeout(r, 0100));
      }
      endTurn = false;
      UICtrl.hideEndTurn();
      // When we get to last player in order we reset the circle with setting i = 0;
      playersArr.length - 1 == i ? i = 0 : i++;
      gameIsPlaying();
    }
  };

  var hiLol = function() {
    
  };

  // event listeners should be at the end cuz only then i can assign functions to var!!
  setupEventListeners();
})(gameLogic, UIController);

// make video cut extension and display on the board random cuts

// svaka stranka druga boja i special effect???!?!?!?!?

// DODAJ I DA MOZE DA SE OTVORI SVAKI IGRAC I VIDE KARTICE!!
// add free parking spot to give all the money spent
// add menu just under board
// game ends after 30mins?