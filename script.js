var gameLogic = (function() {
  // I'm using here Classical Inheritance. Old school ES5 style.
  // There is much better way to do this with instantiation (*class* keyword) in ES6 and React!!
  // Function constructor
  var Player = function(id, name, char, budget, mapSpot, rolledNumber) {
    this.id = id;
    this.name = name;
    this.char = char;
    this.budget = budget;
    this.mapSpot = mapSpot;
    this.rolledNumber = rolledNumber;
  }

  Player.prototype.movePlayer = function() {
    console.log('dugme roll dice radi brale!')
  }

  var Player1 = new Player(1, 'John', 22);
  console.log(Player1.name);

  var players = [];
  var diceRolls = [];
  var dices = [];

  return {
    addPlayer: function(id, name, char) {
      var newPlayer = new Player(id, name, char, 1500, 1, 0);
      players.unshift(newPlayer);
      console.log(players);
    },

    addDiceRoll: function(player) {
      var dice1 = Math.floor(Math.random() * 6) + 1;
      var dice2 = Math.floor(Math.random() * 6) + 1;
      dices = [dice1, dice2];
      diceRolls.unshift(dices);

      // add to Player property dice number!!
      player.rolledNumber = dice1 + dice2;
    },

    sortPlayers: function(playersArr) {
      playersArr.sort((a, b) => b.rolledNumber - a.rolledNumber);
      diceRolls.sort((a, b) => (b[0] + b[1]) - (a[0] + a[1]));
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

  }

})();


var UIController = (function() {

  var DOMstrings = {
    dice: '.rollDice',
    startGame: '.startGame'
  };
  var mapContainer = document.querySelector('.map');

  return {
    getDomStrings: function() {
      return DOMstrings;
    },

    
    showPlayerPanel: function() {
      // removes StartTheGame button!
      document.querySelector(DOMstrings.startGame).parentNode.removeChild(document.querySelector(DOMstrings.startGame));

      html = '<div class="map__modal" style="width: 50%; position: absolute; top: 50%; left: 50%; background-color: pink; transform: translate(-50%, -50%); padding: 2rem;">'
      + '<h1 class="map__title">' + 'Number of players?' + '</h1>' 
      + '<button class="map__player-number" data-id="2" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px">' + '2' + '</button>'
      + '<button class="map__player-number" data-id="3" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px">' + '3' + '</button>'
      + '<button class="map__player-number" data-id="4" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px">' + '4' + '</button>'
      + '<button class="map__player-number" data-id="5" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px">' + '5' + '</button>'
      + '<button class="map__player-number" data-id="6" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px">' + '6' + '</button>'
      + '<button class="map__player-number" data-id="7" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px">' + '7' + '</button>'
      + '<button class="map__player-number" data-id="8" style="margin-top:.5rem;margin-right:.5rem;width: 40px; height: 40px">' + '8' + '</button>'
      + '</div>';
      
      mapContainer.insertAdjacentHTML('beforeend', html);
    },

    showPlayerCreate: function(playerNumber) {
      html = '<div class="map__modal" style="width: 50%; position: absolute; top: 50%; left: 50%; background-color: pink; transform: translate(-50%, -50%); padding: 1.6rem 2rem;">' 
      + '<h1>' + 'Player ' + playerNumber + '</h1>'
      + '<h2 style="margin-top: .4rem">' + 'Name:' + '</h2>' + '<input type="text" class="player__name" required maxlength="20" style="display:block;height:1.5rem;outline:none;border:none;">'
      + '<h2 style="margin-top: .4rem">' + 'Choose a character:' + '</h2>'
      + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  40px; height: 40px; border-radius:50%; overflow:hidden; display: inline-flex; justify-content: center;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + '&phone;' + '</span>' + '</div>'
      + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  40px; height: 40px; border-radius:50%; overflow:hidden; display: inline-flex; justify-content: center; margin-left: .5rem;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + '&#9877;' + '</span>' + '</div>'
      + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  40px; height: 40px; border-radius:50%; overflow:hidden; display: inline-flex; justify-content: center; margin-left: .5rem;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + '&#10086;' + '</span>' + '</div>'
      + '<button class="map__done" style="display:flex;margin:auto;padding:.6rem .9rem;margin-top:.4rem">' + 'Done' + '</button>'
      + '</div>';

      mapContainer.insertAdjacentHTML('beforeend', html);
    },

    showPlayerDashboard: function(players) {
      // Clears the previous created dashboard of players!!
      document.querySelector('.stats').innerHTML = '';
      document.querySelector('[data-id="'+players[0].mapSpot+'"]').innerHTML = '';

      for (var i = 0; i < players.length; i++) {
        html = '<div class="stats__player'+players[i].id+'" style="height=300px;background-color:lightblue;display:flex;margin-bottom: .4rem">'
        + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  40px; height: 40px; border-radius:50%; overflow:hidden; display:flex;justify-content: center; margin-left: .5rem;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + players[i].char + '</span>' + '</div>'
        + '<div style="margin-left: .3rem">'
        + '<h1>' + players[i].name + '</h1>'
        + '<h2 style="margin-left: .8rem;margin-top:.2rem;color:darkgreen">' + players[i].budget + '</h2>'
        + '</div>'
        + '<div class="stats__rolled'+i+'" style="margin-left:auto;display:flex;justify-content:center;align-items:center;">' + '' + '</div>'
        + '</div>';
        document.querySelector('.stats').insertAdjacentHTML('beforeend', html);


        html = '<div class="stats__player'+players[i].id+'" style="height=300px;background-color:lightblue;display:inline-flex;padding: .2rem;">'
        + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  27px; height: 27px; border-radius:50%; overflow:hidden; display:inline-flex;justify-content: center;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + players[i].char + '</span>' 
        + '</div>';
        document.querySelector('[data-id="'+players[i].mapSpot+'"]').insertAdjacentHTML('beforeend', html);
      }
    },

    showRollDice: function(name, gameIsActive) {
      var rollDiceBtn = document.querySelector('.rollDice');
      var playerNumber = document.querySelector('.playerNumber');
      playerNumber.innerHTML = '<h1> Player: ' + name + '</h1>';
      mapContainer.insertAdjacentElement('beforeend', rollDiceBtn);
      rollDiceBtn.style.display = 'block';
      playerNumber.style.display = 'block';
      // Maybe some animation?
      if (gameIsActive) {
        document.querySelector('.endTurn').style.display = 'block';
      }
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
      htmlDice2 = '<img src="dices/dice-'+dices[1]+'.png" style="width: 25px; height:25px;border-radius:5px;margin-right:.3rem">';
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
      char;
  function updateEventListener2() {
    name = '',
    char = '';
    var playerL = document.querySelectorAll('.map__box2');
    var lastItem = document.querySelector('.map__box2');
    playerL.forEach(item => {
      item.addEventListener('click', exe => {
        lastItem.style.border = "1px solid #000";
        item.style.border = "1px solid red";
        lastItem = item;
        char = item.firstChild.innerHTML;
      })
    })
    document.querySelector('.map__done').addEventListener('click', function(){
      name = document.querySelector('.player__name').value;
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
      UICtrl.showPlayerCreate(broj);
      updateEventListener2();

      while (!playerIsCreated) {
        await new Promise(r => setTimeout(r, 0100));
      }
      game.addPlayer(broj, name, char);

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
      game.addDiceRoll(playersArr[broj2 - 1]);
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

  var i = 0;
  var endTurn = false;
  
  // Some sort of recursion going on here lol
  var gameIsPlaying = async function() {
    var gameIsActive = game.getGameIsActive();
    var playersArr = game.getPlayers();
    if (gameIsActive) {
      console.log(playersArr);
      UICtrl.showRollDice(playersArr[i].name, gameIsActive);

      // Here we are wating for player to click End Turn button!!
      while (!endTurn) {
        await new Promise(r => setTimeout(r, 0100));
      }
      // When we get to last player in order we reset the circle with setting i = 0;
      playersArr.length - 1 == i ? i = 0 : i++;
      endTurn = false;
      gameIsPlaying();
    } else {
      hiLol();
    }
  };

  var hiLol = function() {
    console.log('bla bla');
  };

  // event listeners should be at the end cuz only then i can assign functions to var!!
  setupEventListeners();
})(gameLogic, UIController);

// make video cut extension and display on the board random cuts

// svaka stranka druga boja i special effect???!?!?!?!?