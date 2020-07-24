var gameLogic = (function() {
  // function constructor , n broj igraca sa inputa i for loopa koja pravi igrace
  var Player = function(id, name, mapSpot) {
    this.id = id;
    this.name = name;
    this.mapSpot = mapSpot;
  }

  Player.prototype.movePlayer = function() {
    console.log('dugme roll dice radi brale!')
  }

  var Player1 = new Player(1, 'John', 22);
  console.log(Player1.name);

})();


var UIController = (function() {

  var DOMstrings = {
    dice: '.rollDice',
    startGame: '.startGame'
  };

/*  var activePlayer = [1, 2, 3, 4],
      player1 = 1,
      player2 = 1,
      player3 = 0, 
      player4 = 0, 
      diceScore = 0;
  
  document.querySelector('.endTurn').addEventListener('click', nextPlayer);

  function nextPlayer() {
  
  }

  document.querySelector('.rollDice').addEventListener('click', diceNumber);

  function diceNumber() {
    diceScore = Math.floor(Math.random() * 11) + 2;
    
    // koji je na redu igrac
    if (player2 > 40) {
      player2 -= 40;
    }
    player2 += movePlayer(diceScore, player2);
    console.log('player 2 je: ' + player2);

    //return diceScore;
  };

  function movePlayer(diceScore, activePlayer) {
    console.log('broj kockice: ' + diceScore);
    document.querySelector('[data-id="'+activePlayer+'"]').classList.remove('player' + 2);
    activePlayer += diceScore;
    console.log(activePlayer);
    if (activePlayer > 40) {
      activePlayer -= 40;
    }

    document.querySelector('[data-id="'+activePlayer+'"]').classList.add('player' + 2);
    return diceScore;
  } */

  








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

      var playersNumber = document.querySelectorAll('.map__player-number');
      
      
      playersNumber.forEach(item => {
        item.addEventListener('click', exe => {
          var broj = item.getAttribute('data-id');

          makePlayers(broj);
        })
      })

      function makePlayers(broj) {
        console.log(broj);

        // Removes h1 and number of player boxes!!
        document.querySelector('.map__title').parentNode.removeChild(document.querySelector('.map__title'));
        playersNumber.forEach(item => {
          item.parentNode.removeChild(document.querySelector('.map__player-number'));
        });

        
        while (0 < broj) {
          document.querySelector('.map__modal').insertAdjacentHTML('beforeend', 'idemo odma ' + broj + '</br>');

          POZOVI FUNKCIJU DA UBACUJE JEDAN PO JEDAN IGRAC PO IME INPUT I BOJA!!

          broj--;
        }
        
      }
            
    }
  }

})();

var controller = (function(game, UICtrl) {
  
  var setupEventListeners = function() {
    var DOM = UICtrl.getDomStrings();

    document.querySelector(DOM.dice).addEventListener('click', hiLol);

    document.querySelector(DOM.startGame).addEventListener('click', createPlayer);
  };

  setupEventListeners();

  function createPlayer() {
    UICtrl.showPlayerPanel()
  }

  function hiLol() {
    console.log('hmmmmm');
  }
  



})(gameLogic, UIController);