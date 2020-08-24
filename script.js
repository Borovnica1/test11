var gameLogic = (function() {
  // function constructor , n broj igraca sa inputa i for loopa koja pravi igrace
  var Player = function(id, name, char, budget, mapSpot) {
    this.id = id;
    this.name = name;
    this.char = char;
    this.budget = budget;
    this.mapSpot = mapSpot;
  }

  Player.prototype.movePlayer = function() {
    console.log('dugme roll dice radi brale!')
  }

  var Player1 = new Player(1, 'John', 22);
  console.log(Player1.name);

  var players = [];

  /* ovde nastavi!!
  var makePlayers = function(numberOfPlayers) {
    console.log('to je to ' + numberOfPlayers);
  }*/


  return {
    addPlayer: function(id, name, char) {
      var newPlayer = new Player(id, name, char, 1500, 1);
      players.unshift(newPlayer);
      console.log(players);
    },

    getPlayers: function() {
      return players;
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
      + '<h2 style="margin-top: .4rem">' + 'Name:' + '</h2>' + '<input type="text" class="player__name" required style="display:block;">'
      + '<h2 style="margin-top: .4rem">' + 'Choose a character:' + '</h2>'
      + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  30px; height: 30px; border-radius:50%; overflow:hidden; display: inline-flex; justify-content: center;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + '&phone;' + '</span>' + '</div>'
      + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  30px; height: 30px; border-radius:50%; overflow:hidden; display: inline-flex; justify-content: center; margin-left: .5rem;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + '&#9877;' + '</span>' + '</div>'
      + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  30px; height: 30px; border-radius:50%; overflow:hidden; display: inline-flex; justify-content: center; margin-left: .5rem;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + '&#10086;' + '</span>' + '</div>'
      + '<button class="map__done" style="display:flex;margin:auto;padding:.3rem .6rem;margin-top:.4rem">' + 'Done' + '</button>'
      + '</div>';

      mapContainer.insertAdjacentHTML('beforeend', html);
    },

    showPlayerDashboard: function(players) {
      for (var i = 0; i < players.length; i++) {
        console.log(players[i].name);
        html = '<div class="stats__player'+players[i].id+'" style="height=300px;background-color:lightblue;display:flex;margin-bottom: .4rem">'
        + '<div class="map__box2" style="cursor:pointer; border: 1px solid #000; width:  30px; height: 30px; border-radius:50%; overflow:hidden; display:flex;justify-content: center; margin-left: .5rem;">' + '<span class="map__char" style="display:flex; align-items: center; font-size: 22px;">'  + players[i].char + '</span>' + '</div>'
        + '<div style="margin-left: .3rem">'
        + '<h2>' + players[i].name + '</h2>'
        + '<h3 style="margin-left: .5rem;margin-top:.2rem">' + players[i].budget + '</h3>'
        + '</div>'
        + '</div>';

        document.querySelector('.stats').insertAdjacentHTML('beforeend', html);

        // u istoj for petlji dodaj igrace i na kartu!
      }
    }
  }
})();


var controller = (function(game, UICtrl) {
  
  var setupEventListeners = function() {
    var DOM = UICtrl.getDomStrings();

    document.querySelector(DOM.dice).addEventListener('click', hiLol);
    document.querySelector(DOM.startGame).addEventListener('click', createGame);

    
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
      console.log(name, char, playerIsCreated);
    });
    
  }

  async function createGame() {
    UICtrl.showPlayerPanel();
    updateEventListener();
    
    // Waits for a number of players to be picked before continuing this function!!
    while (!numberIsPicked) {
      await new Promise(r => setTimeout(r, 0100));
    }

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


  };

  var hiLol = function() {
    console.log('bla bla');
  };

  // event listeners should be at the end cuz only then i can assign functions to var!!
  setupEventListeners();
})(gameLogic, UIController);

// make video cut extension and display on the board random cuts