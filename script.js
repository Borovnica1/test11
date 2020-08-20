var gameLogic = (function() {
  // function constructor , n broj igraca sa inputa i for loopa koja pravi igrace
  var Player = function(id, name, budget, mapSpot) {
    this.id = id;
    this.name = name;
    this.budget = budget;
    this.mapSpot = mapSpot;
  }

  Player.prototype.movePlayer = function() {
    console.log('dugme roll dice radi brale!')
  }

  var Player1 = new Player(1, 'John', 22);
  console.log(Player1.name);


  // ovde nastavi!!
  var makePlayers = function(numberOfPlayers) {
    console.log('to je to ' + numberOfPlayers);
  }


  return {
    updateEventListener: lol = function() {
      var playersNumber = document.querySelectorAll('.map__player-number');
      
      // Put on every single number button CLICK event and calls function with that number
      playersNumber.forEach(item => {

        item.addEventListener('click', exe => {
          broj = item.getAttribute('data-id'); 
          makePlayers(broj);
        });

      });
    },

  }

})();


var UIController = (function() {

  var DOMstrings = {
    dice: '.rollDice',
    startGame: '.startGame'
  };

  return {
    getDomStrings: function() {
      return DOMstrings;
    },

    
    showPlayerPanel: function() {
      // removes StartTheGame button!
      document.querySelector(DOMstrings.startGame).parentNode.removeChild(document.querySelector(DOMstrings.startGame));


      var mapContainer = document.querySelector('.map');


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

      // Nastavi, slicno kao ovo ispod ali u game logic nova funkcija da bude i da vraca broj koji se izabere! ako ne bude islo uvek moze input box pa teraj lol

      /*
      var playersNumber = document.querySelectorAll('.map__player-number');
      
      playersNumber.forEach(item => {
        item.addEventListener('click', exe => {
          broj = item.getAttribute('data-id');

          makePlayers(broj);
          
        });
      });

      function makePlayers(broj) {
        console.log(broj);

        // Removes h1 and number of player boxes!!
        document.querySelector('.map__title').parentNode.removeChild(document.querySelector('.map__title'));
        playersNumber.forEach(item => {
          item.parentNode.removeChild(document.querySelector('.map__player-number'));
        });
        var id = 0;

        while (id < broj) {
          
          document.querySelector('.map__modal').insertAdjacentHTML('beforeend', 'idemo odma ' + id + '</br>');

          //POZOVI FUNKCIJU DA UBACUJE JEDAN PO JEDAN IGRAC PO IME INPUT I BOJA!!
          
          id++;
        }
      }
      */
    }
  }
})();


var controller = (function(game, UICtrl) {
  
  var setupEventListeners = function() {
    var DOM = UICtrl.getDomStrings();

    document.querySelector(DOM.dice).addEventListener('click', hiLol);
    document.querySelector(DOM.startGame).addEventListener('click', createGame);

    
  };

  

  function createGame() {
    UICtrl.showPlayerPanel();
    game.updateEventListener();
    // vidi iz app.js korak po korak isto radi obavezno
  };

  // Pravi ovde sledecu funkciju koja se poziva kada klikne se broj i pitaj za ime i boju
  
  function createGame2(numberOfPlayers) {
    console.log('smhhhh ' + numberOfPlayers);
  };

  var hiLol = function() {
    console.log('bla bla');
  };

  // event listeners should be at the end cuz only then i can assign functions to var!!
  setupEventListeners();
})(gameLogic, UIController);