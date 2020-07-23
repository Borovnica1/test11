var gameLogic = (function() {
  // function constructor , n broj igraca sa inputa i for loopa koja pravi igrace
  var Player = function(id, mapSpot) {
    this.id = id;
    this.mapSpot = mapSpot;
  }

  Player.prototype.movePlayer = function() {

  }

  var Player1 = new Player(1, 22);
  console.log(Player1.mapSpot);

})();


var UIController = (function() {

  var DOMstrings = {
    dice: '.rollDice'
  }

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
    }
  }

})();

var controller = (function(game, UICtrl) {
  
  var setupEventListeners = function() {
    var DOM = UICtrl.getDomStrings();

    document.querySelector(DOM.dice).addEventListener('click', Person)3333333

  };




})(gameLogic, UIController);