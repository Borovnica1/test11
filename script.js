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


  /* ovde nastavi!!
  var makePlayers = function(numberOfPlayers) {
    console.log('to je to ' + numberOfPlayers);
  }*/


  return {
    

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
        broj = item.getAttribute('data-id'); 
        numberIsPicked = true;
        document.querySelector('.map__modal').parentNode.removeChild(document.querySelector('.map__modal'));
      });

    });
  }
  var playerIsCreated = false;
  var name = 'lol';
  var char = 'xoxo';
  function updateEventListener2() {
    var playerL = document.querySelectorAll('.map__box2');
    console.log(playerL);
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
      console.log(name, char, playerIsCreated);
      if (name.length > 0 && char.length > 0) {
        playerIsCreated = true;
        document.querySelector('.map__modal').parentNode.removeChild(document.querySelector('.map__modal'));
      }
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
      playerIsCreated = false;
      broj--;
    }
    

  };

  var hiLol = function() {
    console.log('bla bla');
  };

  // event listeners should be at the end cuz only then i can assign functions to var!!
  setupEventListeners();
})(gameLogic, UIController);
// test git