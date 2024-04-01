import dom from './dom';
import isPositionValidForShip from './isPositionValidForShip';
import game from './game';
import multiplayer from './multiplayer';

const EventHandler = {
  addEventListeners(player1, player2, isMultiplayer = false) {
    this.player1 = player1;
    this.player2 = player2;
    const oldStartButton = document.querySelector('.place-ships .start');
    const startButton = EventHandler.removeEventListeners(oldStartButton);
    if (isMultiplayer === true) {
      startButton.addEventListener('click', this.onMultiplayerStartClick);
    } else {
      startButton.addEventListener('click', this.onStartClick);
    }

    const oldChDirection = document.querySelector('#direction');
    const chDirection = EventHandler.removeEventListeners(oldChDirection);
    chDirection.addEventListener('click', this.onChangeDirectionClick);

    const oldRandom = document.querySelector('.random');
    const random = EventHandler.removeEventListeners(oldRandom);
    random.addEventListener('click', this.onRandomClick);
  },
  onRandomClick() {
    EventHandler.player1.emptyGrid();
    EventHandler.player1.placeShipRandom(5);
    EventHandler.player1.placeShipRandom(4);
    EventHandler.player1.placeShipRandom(3);
    EventHandler.player1.placeShipRandom(3);
    EventHandler.player1.placeShipRandom(2);
    dom.populateGrid(EventHandler.player1.getGrid(), true);
    const boats = document.querySelectorAll('.boat');
    boats.forEach(boat => {
      const oldBoat = boat;
      const newBoat = oldBoat.cloneNode(true);
      oldBoat.parentNode.replaceChild(newBoat, oldBoat);
      newBoat.draggable = false;
      newBoat.style.opacity = '0';
    });
  },
  onChangeDirectionClick() {
    const boatDrag = document.querySelector('.boats-drag');
    const boats = document.querySelectorAll('.boat');
    if (dom.direction === 'horizontal') {
      boatDrag.classList.add('vertical');
      boats.forEach(boat => {
        boat.classList.add('vertical');
      });
      dom.direction = 'vertical';
    } else {
      boatDrag.classList.remove('vertical');
      boats.forEach(boat => {
        boat.classList.remove('vertical');
      });
      dom.direction = 'horizontal';
    }
  },
  onStartClick() {
    const dialogPlace = document.querySelector('.place-ships');
    const boats = document.querySelectorAll('.boat');
    let canStart;
    boats.forEach(boat => {
      if (boat.draggable === true) canStart = false;
    });
    if (canStart === false) return;
    dialogPlace.close();
    dom.populateGrid(EventHandler.player1.getGrid());
    dom.populateEnemyGrid(EventHandler.player1, EventHandler.player2);
  },
  onMultiplayerStartClick() {
    const dialogPlace = document.querySelector('.place-ships');
    const boats = document.querySelectorAll('.boat');
    const startButton = document.querySelector('.place-ships .start');
    let canStart;
    boats.forEach(boat => {
      if (boat.draggable === true) canStart = false;
    });
    if (canStart === false) return;
    if (multiplayer.playerPlacing === 1) {
      const dialogTitle = document.querySelector('.dialog-header h2');
      dialogTitle.textContent = 'Place your ships Captain 2!';
      startButton.textContent = 'Start';
      multiplayer.playerPlacing = 2;
      multiplayer.showStartingDialog(EventHandler.player2, EventHandler.player1);
      return;
    }
    dialogPlace.close();
    multiplayer.populateGrid(EventHandler.player2.getGrid());
    multiplayer.populateEnemyGrid(EventHandler.player2, EventHandler.player1);
  },
  onDrag(event) {
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({ length: event.currentTarget.children.length, id: event.currentTarget.id })
    );
  },
  addGridListeners(player) {
    const squares = document.querySelectorAll('#grid-place .square.empty');
    this.player = player;
    squares.forEach(square => {
      square.addEventListener('dragover', event => {
        event.preventDefault();
      });
      square.addEventListener('drop', EventHandler.onDrop);
    });
  },
  onDrop(event) {
    event.preventDefault();
    const json = event.dataTransfer.getData('application/json');
    const object = JSON.parse(json);
    const { length } = object;
    const grid = document.querySelector('#grid-place');
    const column = event.currentTarget.parentNode;
    const clickedSquare = event.currentTarget;
    const indexY = Array.prototype.indexOf.call(column.children, clickedSquare);
    const indexX = Array.prototype.indexOf.call(grid.children, column);
    const { direction } = dom;
    const playerGrid = EventHandler.player.getGrid();
    const isValid = isPositionValidForShip(indexX, indexY, direction, length, playerGrid);
    if (isValid === false) {
      return;
    }

    EventHandler.player.placeShip([indexX, indexY], length, direction);
    dom.populateGrid(EventHandler.player.getGrid(), true);
    const draggedBoat = document.getElementById(object.id);
    draggedBoat.removeEventListener('dragstart', EventHandler.onDrag);
    draggedBoat.draggable = false;
    draggedBoat.style.opacity = '0';
    EventHandler.addGridListeners(EventHandler.player);
  },
  removeEventListeners(oldButton) {
    const button = oldButton.cloneNode(true);
    oldButton.parentNode.replaceChild(button, oldButton);
    return button;
  },
  onSquareClicked: async event => {
    const enemyGrid = document.querySelector('#grid2');
    const column = event.currentTarget.parentNode;
    const clickedSquare = event.currentTarget;
    const indexY = Array.prototype.indexOf.call(column.children, clickedSquare);
    const indexX = Array.prototype.indexOf.call(enemyGrid.children, column);
    let hit = dom.player1.attack(dom.player2, indexX, indexY);
    dom.populateEnemyGrid(dom.player1, dom.player2);
    dom.updateBoatsAlive(2);
    if (dom.player2.allSunk() !== false) return EventHandler.onWin(1);
    if (hit === false) {
      dom.toggleTurn();
      do {
        await dom.delay(500);
        hit = dom.player2.randomAttack(dom.player1);
        dom.populateGrid(dom.player1.getGrid());
        dom.updateBoatsAlive(1);
        if (dom.player1.allSunk() !== false) return EventHandler.onWin(2);
      } while (hit !== false);
      dom.toggleTurn();
    }
    return false;
  },
  onWin(player) {
    const dialogWin = document.querySelector('.win');
    dialogWin.showModal();
    const restart = dialogWin.querySelector('.restart');
    restart.addEventListener('click', () => game.chooseGame());
    restart.addEventListener('click', () => {
      dialogWin.close();
    });
    const turns = document.querySelector('.turns');
    turns.textContent = `Player ${player} won!!!`;
    const winner = document.querySelector('.winner');
    winner.textContent = `Player ${player} won!!!`;
    winner.className = 'winner';
    if (player === 2) {
      winner.classList.add('two');
    }
  },
  onMultiplayerSquareClicked: async event => {
    const enemyGrid = document.querySelector('#grid2');
    const column = event.currentTarget.parentNode;
    const clickedSquare = event.currentTarget;
    const indexY = Array.prototype.indexOf.call(column.children, clickedSquare);
    const indexX = Array.prototype.indexOf.call(enemyGrid.children, column);
    const hit = multiplayer.player1.attack(multiplayer.player2, indexX, indexY);
    if (multiplayer.player2.allSunk() !== false) {
      return EventHandler.onWin(multiplayer.player1.number);
    }
    multiplayer.populateEnemyGrid(multiplayer.player1, multiplayer.player2);
    multiplayer.updateBoatsAlive();
    if (hit === false) {
      multiplayer.showWaterDialog();
      multiplayer.populateGrid(multiplayer.player2.getGrid());
      multiplayer.populateEnemyGrid(multiplayer.player2, multiplayer.player1);
      multiplayer.updateBoatsAlive();
      multiplayer.toggleTurn();
    }
    return false;
  },
};

export default EventHandler;
