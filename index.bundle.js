/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/create-grid.js":
/*!****************************!*\
  !*** ./src/create-grid.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const createGrid = function () {
  let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  const grid = [];
  for (let i = 0; i < n; i += 1) {
    grid[i] = [];
    for (let j = 0; j < n; j += 1) {
      grid[i][j] = null;
    }
  }
  return grid;
};
/* harmony default export */ __webpack_exports__["default"] = (createGrid);

/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _eventHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventHandler */ "./src/eventHandler.js");

const dom = {
  direction: 'horizontal',
  populateGrid(grid) {
    let start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let gridContainer = document.querySelector('#grid1');
    if (start === true) {
      gridContainer = document.querySelector('#grid-place');
    }
    gridContainer.innerHTML = '';
    grid.forEach(line => {
      const div = document.createElement('div');
      div.className = 'line';
      line.forEach(slot => {
        const square = document.createElement('div');
        if (slot === null) {
          square.className = 'square empty';
        } else if (Array.isArray(slot)) {
          const sunk = slot[1].isSunk();
          if (sunk === false) {
            square.className = 'square hit';
          } else if (sunk === true) {
            square.className = 'square sunk';
          }
          square.textContent = '✘';
        } else if (slot !== null && typeof slot === 'object') {
          square.className = 'square ship';
        } else if (slot === 'water') {
          square.className = 'square water';
          square.textContent = '✘';
        }
        div.appendChild(square);
      });
      gridContainer.appendChild(div);
    });
  },
  populateEnemyGrid(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    const gridContainer = document.querySelector('#grid2');
    const grid = this.player2.getGrid();
    gridContainer.innerHTML = '';
    grid.forEach(line => {
      const div = document.createElement('div');
      div.className = 'line';
      line.forEach(slot => {
        const square = document.createElement('div');
        if (Array.isArray(slot)) {
          const sunk = slot[1].isSunk();
          if (sunk === false) {
            square.className = 'square hit';
          } else if (sunk === true) {
            square.className = 'square sunk';
          }
          square.textContent = '✘';
        } else if (slot === null || slot !== null && typeof slot === 'object') {
          square.className = 'square empty';
          square.addEventListener('click', _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].onSquareClicked);
        } else if (slot === 'water') {
          square.className = 'square water';
          square.textContent = '✘';
        }
        div.appendChild(square);
      });
      gridContainer.appendChild(div);
    });
  },
  delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  },
  toggleTurn() {
    const divTurns = document.querySelector('.turns');
    const currentTurn = divTurns.textContent.substring(7, 8);
    if (currentTurn === '1') {
      divTurns.textContent = 'Player 2 turn';
      divTurns.className = 'turns red';
    } else {
      divTurns.textContent = 'Player 1 turn';
      divTurns.className = 'turns';
    }
  },
  updateBoatsAlive(playerNum) {
    let para;
    let boatsAlive;
    if (playerNum === 1) {
      para = document.querySelector('.ships-alive.one');
      boatsAlive = dom.player1.countBoatsAlive();
    } else {
      para = document.querySelector('.ships-alive.two');
      boatsAlive = dom.player2.countBoatsAlive();
    }
    para.textContent = `Alive ships: ${boatsAlive}`;
  },
  dragAndDrop(player) {
    const boats = document.querySelectorAll('.boat');
    boats.forEach(boat => {
      boat.addEventListener('dragstart', _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].onDrag);
      boat.draggable = true;
      boat.style.opacity = '1';
    });
    _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].addGridListeners(player);
  },
  prepareNewGame() {
    const divTurns = document.querySelector('.turns');
    divTurns.textContent = 'Player 1 turn';
    divTurns.className = 'turns';
    const shipsAlive = document.querySelectorAll('.ships-alive');
    shipsAlive.forEach(div => {
      div.textContent = 'Alive ships: 5';
    });
  },
  showStartingDialog(player1, player2) {
    dom.prepareNewGame();
    dom.populateGrid(player1.getGrid(), true);
    const dialogPlace = document.querySelector('.place-ships');
    dialogPlace.showModal();
    dom.dragAndDrop(player1);
    _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].addEventListeners(player1, player2);
  }
};
/* harmony default export */ __webpack_exports__["default"] = (dom);

/***/ }),

/***/ "./src/eventHandler.js":
/*!*****************************!*\
  !*** ./src/eventHandler.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");
/* harmony import */ var _isPositionValidForShip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isPositionValidForShip */ "./src/isPositionValidForShip.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game */ "./src/game.js");



const EventHandler = {
  addEventListeners(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    const oldStartButton = document.querySelector('.place-ships .start');
    const startButton = EventHandler.removeEventListeners(oldStartButton);
    startButton.addEventListener('click', this.onStartClick);
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
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].populateGrid(EventHandler.player1.getGrid(), true);
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
    if (_dom__WEBPACK_IMPORTED_MODULE_0__["default"].direction === 'horizontal') {
      boatDrag.classList.add('vertical');
      boats.forEach(boat => {
        boat.classList.add('vertical');
      });
      _dom__WEBPACK_IMPORTED_MODULE_0__["default"].direction = 'vertical';
    } else {
      boatDrag.classList.remove('vertical');
      boats.forEach(boat => {
        boat.classList.remove('vertical');
      });
      _dom__WEBPACK_IMPORTED_MODULE_0__["default"].direction = 'horizontal';
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
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].populateGrid(EventHandler.player1.getGrid());
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].populateEnemyGrid(EventHandler.player1, EventHandler.player2);
  },
  onDrag(event) {
    event.dataTransfer.setData('application/json', JSON.stringify({
      length: event.currentTarget.children.length,
      id: event.currentTarget.id
    }));
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
    const {
      length
    } = object;
    const grid = document.querySelector('#grid-place');
    const column = event.currentTarget.parentNode;
    const clickedSquare = event.currentTarget;
    const indexY = Array.prototype.indexOf.call(column.children, clickedSquare);
    const indexX = Array.prototype.indexOf.call(grid.children, column);
    const {
      direction
    } = _dom__WEBPACK_IMPORTED_MODULE_0__["default"];
    const playerGrid = EventHandler.player.getGrid();
    const isValid = (0,_isPositionValidForShip__WEBPACK_IMPORTED_MODULE_1__["default"])(indexX, indexY, direction, length, playerGrid);
    if (isValid === false) {
      return;
    }
    EventHandler.player.placeShip([indexX, indexY], length, direction);
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].populateGrid(EventHandler.player.getGrid(), true);
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
    let hit = _dom__WEBPACK_IMPORTED_MODULE_0__["default"].player1.attack(_dom__WEBPACK_IMPORTED_MODULE_0__["default"].player2, indexX, indexY);
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].populateEnemyGrid(_dom__WEBPACK_IMPORTED_MODULE_0__["default"].player1, _dom__WEBPACK_IMPORTED_MODULE_0__["default"].player2);
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].updateBoatsAlive(2);
    if (_dom__WEBPACK_IMPORTED_MODULE_0__["default"].player2.allSunk() !== false) return EventHandler.onWin(1);
    if (hit === false) {
      _dom__WEBPACK_IMPORTED_MODULE_0__["default"].toggleTurn();
      do {
        await _dom__WEBPACK_IMPORTED_MODULE_0__["default"].delay(500);
        hit = _dom__WEBPACK_IMPORTED_MODULE_0__["default"].player2.randomAttack(_dom__WEBPACK_IMPORTED_MODULE_0__["default"].player1);
        _dom__WEBPACK_IMPORTED_MODULE_0__["default"].populateGrid(_dom__WEBPACK_IMPORTED_MODULE_0__["default"].player1.getGrid());
        _dom__WEBPACK_IMPORTED_MODULE_0__["default"].updateBoatsAlive(1);
        if (_dom__WEBPACK_IMPORTED_MODULE_0__["default"].player1.allSunk() !== false) return EventHandler.onWin(2);
      } while (hit !== false);
      _dom__WEBPACK_IMPORTED_MODULE_0__["default"].toggleTurn();
    }
    return false;
  },
  onWin(player) {
    const dialogWin = document.querySelector('.win');
    dialogWin.showModal();
    const restart = dialogWin.querySelector('.restart');
    restart.addEventListener('click', () => _game__WEBPACK_IMPORTED_MODULE_2__["default"].chooseGame());
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
  }
};
/* harmony default export */ __webpack_exports__["default"] = (EventHandler);

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _multiplayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./multiplayer */ "./src/multiplayer.js");



const game = {
  startGame() {
    const player1 = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])(1);
    const player2 = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])(2);
    player2.placeShipRandom(5);
    player2.placeShipRandom(4);
    player2.placeShipRandom(3);
    player2.placeShipRandom(3);
    player2.placeShipRandom(2);
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].showStartingDialog(player1, player2);
  },
  startMultiplayer() {
    const player1 = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])(1);
    const player2 = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])(2);
    _multiplayer__WEBPACK_IMPORTED_MODULE_2__["default"].resetEverything();
    _multiplayer__WEBPACK_IMPORTED_MODULE_2__["default"].prepareStartingDialog();
    _multiplayer__WEBPACK_IMPORTED_MODULE_2__["default"].showStartingDialog(player1, player2);
  },
  chooseGame() {
    const chooseGameMode = document.querySelector('.choose-game');
    chooseGameMode.showModal();
    const playComputer = chooseGameMode.querySelector('.computer');
    playComputer.addEventListener('click', () => {
      chooseGameMode.close();
      game.startGame();
    });
    const playOther = document.querySelector('.multiplayer');
    playOther.addEventListener('click', () => {
      chooseGameMode.close();
      game.startMultiplayer();
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (game);

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");
/* harmony import */ var _create_grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create-grid */ "./src/create-grid.js");
/* harmony import */ var _isPositionValidForShip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isPositionValidForShip */ "./src/isPositionValidForShip.js");



const Gameboard = function createGameboard() {
  let grid = (0,_create_grid__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const placeShip = function (start, length, direction) {
    const shipObj = (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(length);
    if (direction === 'vertical') {
      for (let i = 0; i < shipObj.length; i += 1) grid[start[0]][start[1] + i] = shipObj;
    } else {
      for (let i = 0; i < shipObj.length; i += 1) grid[start[0] + i][start[1]] = shipObj;
    }
  };
  const placeShipRandom = function (length) {
    let x;
    let y;
    let isValid = false;
    let direction;
    const num = Math.round(Math.random());
    if (num === 0) {
      direction = 'horizontal';
    } else {
      direction = 'vertical';
    }
    while (isValid === false) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      isValid = (0,_isPositionValidForShip__WEBPACK_IMPORTED_MODULE_2__["default"])(x, y, direction, length, grid);
    }
    this.placeShip([x, y], length, direction);
  };
  const emptyGrid = function () {
    grid = (0,_create_grid__WEBPACK_IMPORTED_MODULE_1__["default"])();
  };
  const receiveHit = function (x, y) {
    const value = grid[x][y];
    if (value === null) {
      grid[x][y] = 'water';
      return false;
    }
    value.addHit();
    grid[x][y] = ['hit', value];
    return value;
  };
  const allSunk = function () {
    let result = true;
    grid.forEach(line => {
      line.forEach(slot => {
        if (slot !== null && typeof slot === 'object' && !Array.isArray(slot)) result = false;
      });
    });
    return result;
  };
  const countBoatsAlive = function () {
    const boats = [];
    grid.forEach(line => {
      line.forEach(slot => {
        if (slot !== null && typeof slot === 'object' && !Array.isArray(slot) && !boats.includes(slot)) {
          boats.push(slot);
        }
      });
    });
    return boats.length;
  };
  const getGrid = function () {
    return grid;
  };
  return {
    getGrid,
    emptyGrid,
    placeShip,
    placeShipRandom,
    receiveHit,
    allSunk,
    countBoatsAlive
  };
};
/* harmony default export */ __webpack_exports__["default"] = (Gameboard);

/***/ }),

/***/ "./src/isPositionValidForShip.js":
/*!***************************************!*\
  !*** ./src/isPositionValidForShip.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const isPositionValidForShip = (x, y, direction, length, grid) => {
  const array = [];
  const surroundingArray = [];
  if (direction === 'horizontal' && x + length > grid.length) {
    return false;
  }
  if (direction === 'vertical' && y + length >= grid[0].length) {
    return false;
  }
  array.push(grid[x][y]);
  if (direction === 'horizontal') {
    for (let i = 0; i < length; i += 1) {
      array.push(grid[x + i][y]);
    }
  } else {
    for (let i = 0; i < length; i += 1) {
      array.push(grid[x][y + i]);
    }
  }
  for (let i = -1; i <= length; i += 1) {
    const x1 = x + (direction === 'horizontal' ? i : 0);
    const y1 = y + (direction === 'horizontal' ? 0 : i);
    const x2 = x + (direction === 'horizontal' ? i : -1);
    const y2 = y + (direction === 'horizontal' ? -1 : i);
    const x3 = x + (direction === 'horizontal' ? i : 1);
    const y3 = y + (direction === 'horizontal' ? 1 : i);
    if (x1 >= 0 && x1 < grid.length && y1 >= 0 && y1 < grid[0].length) {
      surroundingArray.push(grid[x1][y1]);
    }
    if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length) {
      surroundingArray.push(grid[x2][y2]);
    }
    if (x3 >= 0 && x3 < grid.length && y3 >= 0 && y3 < grid[0].length) {
      surroundingArray.push(grid[x3][y3]);
    }
  }
  const empty = array.every(square => square === null);
  const surroundingEmpty = surroundingArray.every(square => square === null);
  return empty && surroundingEmpty;
};
/* harmony default export */ __webpack_exports__["default"] = (isPositionValidForShip);

/***/ }),

/***/ "./src/multiplayer.js":
/*!****************************!*\
  !*** ./src/multiplayer.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");

const multiplayer = {
  direction: 'horizontal',
  playerPlacing: 1,
  populateGrid(grid) {
    let start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let gridContainer = document.querySelector('#grid1');
    if (start === true) {
      gridContainer = document.querySelector('#grid-place');
    }
    gridContainer.innerHTML = '';
    grid.forEach(line => {
      const div = document.createElement('div');
      div.className = 'line';
      line.forEach(slot => {
        const square = document.createElement('div');
        if (slot === null) {
          square.className = 'square empty';
        } else if (Array.isArray(slot)) {
          const sunk = slot[1].isSunk();
          if (sunk === false) {
            square.className = 'square hit';
          } else if (sunk === true) {
            square.className = 'square sunk';
          }
          square.textContent = '✘';
        } else if (slot !== null && typeof slot === 'object') {
          square.className = 'square ship';
        } else if (slot === 'water') {
          square.className = 'square water';
          square.textContent = '✘';
        }
        div.appendChild(square);
      });
      gridContainer.appendChild(div);
    });
  },
  populateEnemyGrid(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    const gridContainer = document.querySelector('#grid2');
    const grid = this.player2.getGrid();
    gridContainer.innerHTML = '';
    grid.forEach(line => {
      const div = document.createElement('div');
      div.className = 'line';
      line.forEach(slot => {
        const square = document.createElement('div');
        if (Array.isArray(slot)) {
          const sunk = slot[1].isSunk();
          if (sunk === false) {
            square.className = 'square hit';
          } else if (sunk === true) {
            square.className = 'square sunk';
          }
          square.textContent = '✘';
        } else if (slot === null || slot !== null && typeof slot === 'object') {
          square.className = 'square empty';
          square.addEventListener('click', multiplayer.squareClicked);
        } else if (slot === 'water') {
          square.className = 'square water';
          square.textContent = '✘';
        }
        div.appendChild(square);
      });
      gridContainer.appendChild(div);
    });
  },
  squareClicked: async event => {
    const enemyGrid = document.querySelector('#grid2');
    const column = event.currentTarget.parentNode;
    const clickedSquare = event.currentTarget;
    const indexY = Array.prototype.indexOf.call(column.children, clickedSquare);
    const indexX = Array.prototype.indexOf.call(enemyGrid.children, column);
    const hit = multiplayer.player1.attack(multiplayer.player2, indexX, indexY);
    if (multiplayer.player2.allSunk() !== false) return multiplayer.playerWon(multiplayer.player1);
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
  showWaterDialog() {
    const waterDialog = document.querySelector('.water-dialog');
    waterDialog.showModal();
    waterDialog.classList.add('show');
    const closeDialog = document.querySelector('.change-turn');
    closeDialog.addEventListener('click', () => {
      waterDialog.close();
      waterDialog.classList.remove('show');
    });
  },
  playerWon(player) {
    const dialogWin = document.querySelector('.win');
    dialogWin.showModal();
    const restart = dialogWin.querySelector('.restart');
    restart.addEventListener('click', () => _game__WEBPACK_IMPORTED_MODULE_0__["default"].chooseGame());
    restart.addEventListener('click', () => {
      dialogWin.close();
    });
    const turns = document.querySelector('.turns');
    turns.textContent = `Player ${player.number} won!!!`;
    const winner = document.querySelector('.winner');
    winner.textContent = `Player ${player.number} won!!!`;
    winner.className = 'winner';
    if (player.number === 2) {
      winner.classList.add('two');
    }
  },
  toggleTurn() {
    const divTurns = document.querySelector('.turns');
    const attackerDiv = document.querySelector('.player.one');
    const attackerInfo = document.querySelector('.info.one');
    const defendorDiv = document.querySelector('.player.two');
    const defendorInfo = document.querySelector('.info.two');
    const currentTurn = divTurns.textContent.substring(7, 8);
    if (currentTurn === '1') {
      divTurns.textContent = 'Player 2 turn';
      divTurns.className = 'turns red';
      attackerDiv.textContent = 'Player 2';
      attackerInfo.className = 'info one red';
      defendorDiv.textContent = 'Player 1';
      defendorInfo.className = 'info two';
    } else {
      divTurns.textContent = 'Player 1 turn';
      divTurns.className = 'turns';
      attackerDiv.textContent = 'Player 1';
      attackerInfo.className = 'info one';
      defendorDiv.textContent = 'Player 2';
      defendorInfo.className = 'info two red';
    }
  },
  updateBoatsAlive() {
    const para1 = document.querySelector('.ships-alive.one');
    const boatsAlive1 = multiplayer.player1.countBoatsAlive();
    para1.textContent = `Alive ships ${boatsAlive1}`;
    const para2 = document.querySelector('.ships-alive.two');
    const boatsAlive2 = multiplayer.player2.countBoatsAlive();
    para2.textContent = `Alive ships ${boatsAlive2}`;
  },
  dragAndDrop(player) {
    const boats = document.querySelectorAll('.boat');
    const onDrag = event => {
      event.dataTransfer.setData('application/json', JSON.stringify({
        length: event.currentTarget.children.length,
        id: event.currentTarget.id
      }));
    };
    boats.forEach(boat => {
      boat.addEventListener('dragstart', onDrag);
      boat.draggable = true;
      boat.style.opacity = '1';
    });
    const gridListeners = function () {
      const squares = document.querySelectorAll('#grid-place .square.empty');
      const onDrop = event => {
        event.preventDefault();
        const json = event.dataTransfer.getData('application/json');
        const object = JSON.parse(json);
        const {
          length
        } = object;
        const grid = document.querySelector('#grid-place');
        const column = event.currentTarget.parentNode;
        const clickedSquare = event.currentTarget;
        const indexY = Array.prototype.indexOf.call(column.children, clickedSquare);
        const indexX = Array.prototype.indexOf.call(grid.children, column);
        const {
          direction
        } = multiplayer;
        const playerGrid = player.getGrid();
        const isEmpty = function () {
          const array = [];
          const surroundingArray = [];
          array.push(playerGrid[indexX][indexY]);
          if (direction === 'horizontal') {
            for (let i = 0; i < length; i += 1) {
              array.push(playerGrid[indexX + i][indexY]);
            }
          } else {
            for (let i = 0; i < length; i += 1) {
              array.push(playerGrid[indexX][indexY + i]);
            }
          }
          for (let i = -1; i <= length; i += 1) {
            const x1 = indexX + (direction === 'horizontal' ? i : 0);
            const y1 = indexY + (direction === 'horizontal' ? 0 : i);
            const x2 = indexX + (direction === 'horizontal' ? i : -1);
            const y2 = indexY + (direction === 'horizontal' ? -1 : i);
            const x3 = indexX + (direction === 'horizontal' ? i : 1);
            const y3 = indexY + (direction === 'horizontal' ? 1 : i);
            if (x1 >= 0 && x1 < playerGrid.length && y1 >= 0 && y1 < playerGrid[0].length) {
              surroundingArray.push(playerGrid[x1][y1]);
            }
            if (x2 >= 0 && x2 < playerGrid.length && y2 >= 0 && y2 < playerGrid[0].length) {
              surroundingArray.push(playerGrid[x2][y2]);
            }
            if (x3 >= 0 && x3 < playerGrid.length && y3 >= 0 && y3 < playerGrid[0].length) {
              surroundingArray.push(playerGrid[x3][y3]);
            }
          }
          const empty = array.every(square => square === null);
          const surroundingEmpty = surroundingArray.every(square => square === null);
          return empty && surroundingEmpty;
        }();
        if (isEmpty === false) {
          return;
        }
        player.placeShip([indexX, indexY], length, direction);
        multiplayer.populateGrid(player.getGrid(), true);
        const draggedBoat = document.getElementById(object.id);
        draggedBoat.removeEventListener('dragstart', onDrag);
        draggedBoat.draggable = false;
        draggedBoat.style.opacity = '0';
        gridListeners();
      };
      squares.forEach(square => {
        square.addEventListener('dragover', event => {
          event.preventDefault();
        });
        square.addEventListener('drop', onDrop);
      });
    };
    gridListeners();
  },
  prepareStartingDialog() {
    const startingButton = document.querySelector('.place-ships .start');
    startingButton.textContent = 'Next';
    const dialogTitle = document.querySelector('.dialog-header h2');
    dialogTitle.textContent = 'Place your ships Captain 1!';
  },
  showStartingDialog(player1, player2) {
    multiplayer.populateGrid(player1.getGrid(), true);
    const dialogPlace = document.querySelector('.place-ships');
    dialogPlace.showModal();
    multiplayer.dragAndDrop(player1);
    multiplayer.addEventListeners(player1, player2);
  },
  addEventListeners(player1, player2) {
    const oldStartButton = document.querySelector('.place-ships .start');
    const startButton = oldStartButton.cloneNode(true);
    oldStartButton.parentNode.replaceChild(startButton, oldStartButton);
    startButton.addEventListener('click', () => {
      const dialogPlace = document.querySelector('.place-ships');
      const boats = document.querySelectorAll('.boat');
      let canStart;
      boats.forEach(boat => {
        if (boat.draggable === true) canStart = false;
      });
      if (canStart === false) return;
      if (this.playerPlacing === 1) {
        const dialogTitle = document.querySelector('.dialog-header h2');
        dialogTitle.textContent = 'Place your ships Captain 2!';
        startButton.textContent = 'Start';
        this.playerPlacing = 2;
        this.showStartingDialog(player2, player1);
        return;
      }
      dialogPlace.close();
      multiplayer.populateGrid(player2.getGrid());
      multiplayer.populateEnemyGrid(player2, player1);
    });
    const oldChDirection = document.querySelector('#direction');
    const chDirection = oldChDirection.cloneNode(true);
    oldChDirection.parentNode.replaceChild(chDirection, oldChDirection);
    chDirection.addEventListener('click', () => {
      const boatDrag = document.querySelector('.boats-drag');
      const boats = document.querySelectorAll('.boat');
      if (this.direction === 'horizontal') {
        boatDrag.classList.add('vertical');
        boats.forEach(boat => {
          boat.classList.add('vertical');
        });
        this.direction = 'vertical';
      } else {
        boatDrag.classList.remove('vertical');
        boats.forEach(boat => {
          boat.classList.remove('vertical');
        });
        this.direction = 'horizontal';
      }
    });
    const oldRandom = document.querySelector('.random');
    const random = oldRandom.cloneNode(true);
    oldRandom.parentNode.replaceChild(random, oldRandom);
    random.addEventListener('click', () => {
      player1.emptyGrid();
      player1.placeShipRandom(5);
      player1.placeShipRandom(4);
      player1.placeShipRandom(3);
      player1.placeShipRandom(3);
      player1.placeShipRandom(2);
      multiplayer.populateGrid(player1.getGrid(), true);
      const boats = document.querySelectorAll('.boat');
      boats.forEach(boat => {
        const oldBoat = boat;
        const newBoat = oldBoat.cloneNode(true);
        oldBoat.parentNode.replaceChild(newBoat, oldBoat);
        newBoat.draggable = false;
        newBoat.style.opacity = '0';
      });
    });
  },
  resetEverything() {
    this.player1 = null;
    this.player2 = null;
    this.playerPlacing = 1;
    this.direction = 'horizontal';
  }
};
/* harmony default export */ __webpack_exports__["default"] = (multiplayer);

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");

const Player = function (number) {
  const gameboard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const allSunk = function () {
    return gameboard.allSunk();
  };
  const win = function () {
    return 'I won';
  };
  const placeShip = function (start, length, direction) {
    gameboard.placeShip(start, length, direction);
  };
  const placeShipRandom = function (length) {
    gameboard.placeShipRandom(length);
  };
  const getGrid = function () {
    return gameboard.getGrid();
  };
  const emptyGrid = function () {
    gameboard.emptyGrid();
  };
  const countBoatsAlive = function () {
    return gameboard.countBoatsAlive();
  };
  const receiveHit = function (x, y) {
    return gameboard.receiveHit(x, y);
  };
  const attack = function (player, x, y) {
    const hit = player.receiveHit(x, y);
    if (player.allSunk()) {
      return win();
    }
    return hit;
  };
  const randomAttack = function (player) {
    let x;
    let y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (typeof player.getGrid()[x][y] !== 'object' || Array.isArray(player.getGrid()[x][y]));
    return attack(player, x, y);
  };
  return {
    number,
    allSunk,
    placeShip,
    getGrid,
    receiveHit,
    attack,
    win,
    randomAttack,
    countBoatsAlive,
    placeShipRandom,
    emptyGrid
  };
};
/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const Ship = function createShip(shipLength) {
  const length = shipLength;
  let hits = 0;
  const addHit = function () {
    hits += 1;
    return hits;
  };
  const isSunk = function () {
    if (hits === length) return true;
    return false;
  };
  return {
    length,
    addHit,
    isSunk
  };
};
/* harmony default export */ __webpack_exports__["default"] = (Ship);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.red{\n   color: var(--red-text);\n}\n\n.info.red .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\nbutton{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\nbutton:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n\n\n.place-ships {\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   opacity: 0.98;\n   color: white;\n}\n\n.place-ships .dialog-container{\n   gap: 2vh;\n}\n\n.place-ships .dialog-header{\n   display: flex;\n   gap: 8vw;\n}\n\nh2{\n   font-size: 1.8rem;\n   font-weight: 400;\n}\n\n#direction {\n   padding: 5px;\n}\n\n.place-ships .wrapper {\n   flex-direction: row;\n   gap: 5vw;\n   align-items: center;\n}\n\n\n.place-ships .boats-drag {\n   width: 20v;\n   display: flex;\n   flex-direction: column;\n   gap: 3vh;\n}\n\n.place-ships .boats-drag.vertical {\n   flex-direction: row;\n   gap: 3vw;\n}\n\n.place-ships .boat-wrapper {\n   display:flex;\n   flex-direction: column;\n}\n\n.place-ships .boat {\n   display: flex;\n   width: fit-content;\n}\n\n.place-ships .boat.vertical {\n   flex-direction: column;\n   align-self: center;\n}\n\n.boat .boat-square {\n   flex: none;\n   width: 7vh;\n   height: 7vh;\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.water-dialog{\n   opacity: 0;\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   color: var(--text);\n   font-size: 4rem;\n   transition: opacity 0.5s;\n   text-align: center;\n}\n\n.water-dialog.show{\n   opacity: 1;\n}\n\n.choose-game{\n   color: var(--text);\n   font-size: 4rem;\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   min-width: 100vw;\n   opacity: 1;\n}\n\n.choose-game button {\n   font-size: 2rem;\n   padding: 20px;\n   border-radius: 2.5rem;\n}", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.red{\n   color: var(--red-text);\n}\n\n.info.red .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\nbutton{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\nbutton:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n\n\n.place-ships {\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   opacity: 0.98;\n   color: white;\n}\n\n.place-ships .dialog-container{\n   gap: 2vh;\n}\n\n.place-ships .dialog-header{\n   display: flex;\n   gap: 8vw;\n}\n\nh2{\n   font-size: 1.8rem;\n   font-weight: 400;\n}\n\n#direction {\n   padding: 5px;\n}\n\n.place-ships .wrapper {\n   flex-direction: row;\n   gap: 5vw;\n   align-items: center;\n}\n\n\n.place-ships .boats-drag {\n   width: 20v;\n   display: flex;\n   flex-direction: column;\n   gap: 3vh;\n}\n\n.place-ships .boats-drag.vertical {\n   flex-direction: row;\n   gap: 3vw;\n}\n\n.place-ships .boat-wrapper {\n   display:flex;\n   flex-direction: column;\n}\n\n.place-ships .boat {\n   display: flex;\n   width: fit-content;\n}\n\n.place-ships .boat.vertical {\n   flex-direction: column;\n   align-self: center;\n}\n\n.boat .boat-square {\n   flex: none;\n   width: 7vh;\n   height: 7vh;\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.water-dialog{\n   opacity: 0;\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   color: var(--text);\n   font-size: 4rem;\n   transition: opacity 0.5s;\n   text-align: center;\n}\n\n.water-dialog.show{\n   opacity: 1;\n}\n\n.choose-game{\n   color: var(--text);\n   font-size: 4rem;\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   min-width: 100vw;\n   opacity: 1;\n}\n\n.choose-game button {\n   font-size: 2rem;\n   padding: 20px;\n   border-radius: 2.5rem;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ (function(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ (function(module) {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ (function(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ (function(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ (function(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ (function(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ (function(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	!function() {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./src/game.js");


_game__WEBPACK_IMPORTED_MODULE_1__["default"].chooseGame();
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEsVUFBVSxHQUFHLFNBQUFBLENBQUEsRUFBa0I7RUFBQSxJQUFSQyxDQUFDLEdBQUFDLFNBQUEsQ0FBQUMsTUFBQSxRQUFBRCxTQUFBLFFBQUFFLFNBQUEsR0FBQUYsU0FBQSxNQUFHLEVBQUU7RUFDakMsTUFBTUcsSUFBSSxHQUFHLEVBQUU7RUFFZixLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0wsQ0FBQyxFQUFFSyxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQzdCRCxJQUFJLENBQUNDLENBQUMsQ0FBQyxHQUFHLEVBQUU7SUFDWixLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR04sQ0FBQyxFQUFFTSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQzdCRixJQUFJLENBQUNDLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUMsR0FBRyxJQUFJO0lBQ25CO0VBQ0Y7RUFFQSxPQUFPRixJQUFJO0FBQ2IsQ0FBQztBQUVELCtEQUFlTCxVQUFVOzs7Ozs7Ozs7Ozs7QUNiaUI7QUFFMUMsTUFBTVMsR0FBRyxHQUFHO0VBQ1ZDLFNBQVMsRUFBRSxZQUFZO0VBQ3ZCQyxZQUFZQSxDQUFDTixJQUFJLEVBQWlCO0lBQUEsSUFBZk8sS0FBSyxHQUFBVixTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBRyxLQUFLO0lBQzlCLElBQUlXLGFBQWEsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQ3BELElBQUlILEtBQUssS0FBSyxJQUFJLEVBQUU7TUFDbEJDLGFBQWEsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBQ3ZEO0lBQ0FGLGFBQWEsQ0FBQ0csU0FBUyxHQUFHLEVBQUU7SUFDNUJYLElBQUksQ0FBQ1ksT0FBTyxDQUFDQyxJQUFJLElBQUk7TUFDbkIsTUFBTUMsR0FBRyxHQUFHTCxRQUFRLENBQUNNLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDekNELEdBQUcsQ0FBQ0UsU0FBUyxHQUFHLE1BQU07TUFDdEJILElBQUksQ0FBQ0QsT0FBTyxDQUFDSyxJQUFJLElBQUk7UUFDbkIsTUFBTUMsTUFBTSxHQUFHVCxRQUFRLENBQUNNLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDNUMsSUFBSUUsSUFBSSxLQUFLLElBQUksRUFBRTtVQUNqQkMsTUFBTSxDQUFDRixTQUFTLEdBQUcsY0FBYztRQUNuQyxDQUFDLE1BQU0sSUFBSUcsS0FBSyxDQUFDQyxPQUFPLENBQUNILElBQUksQ0FBQyxFQUFFO1VBQzlCLE1BQU1JLElBQUksR0FBR0osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDSyxNQUFNLENBQUMsQ0FBQztVQUM3QixJQUFJRCxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQ2xCSCxNQUFNLENBQUNGLFNBQVMsR0FBRyxZQUFZO1VBQ2pDLENBQUMsTUFBTSxJQUFJSyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3hCSCxNQUFNLENBQUNGLFNBQVMsR0FBRyxhQUFhO1VBQ2xDO1VBQ0FFLE1BQU0sQ0FBQ0ssV0FBVyxHQUFHLEdBQUc7UUFDMUIsQ0FBQyxNQUFNLElBQUlOLElBQUksS0FBSyxJQUFJLElBQUksT0FBT0EsSUFBSSxLQUFLLFFBQVEsRUFBRTtVQUNwREMsTUFBTSxDQUFDRixTQUFTLEdBQUcsYUFBYTtRQUNsQyxDQUFDLE1BQU0sSUFBSUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtVQUMzQkMsTUFBTSxDQUFDRixTQUFTLEdBQUcsY0FBYztVQUNqQ0UsTUFBTSxDQUFDSyxXQUFXLEdBQUcsR0FBRztRQUMxQjtRQUNBVCxHQUFHLENBQUNVLFdBQVcsQ0FBQ04sTUFBTSxDQUFDO01BQ3pCLENBQUMsQ0FBQztNQUNGVixhQUFhLENBQUNnQixXQUFXLENBQUNWLEdBQUcsQ0FBQztJQUNoQyxDQUFDLENBQUM7RUFDSixDQUFDO0VBQ0RXLGlCQUFpQkEsQ0FBQ0MsT0FBTyxFQUFFQyxPQUFPLEVBQUU7SUFDbEMsSUFBSSxDQUFDRCxPQUFPLEdBQUdBLE9BQU87SUFDdEIsSUFBSSxDQUFDQyxPQUFPLEdBQUdBLE9BQU87SUFDdEIsTUFBTW5CLGFBQWEsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQ3RELE1BQU1WLElBQUksR0FBRyxJQUFJLENBQUMyQixPQUFPLENBQUNDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DcEIsYUFBYSxDQUFDRyxTQUFTLEdBQUcsRUFBRTtJQUM1QlgsSUFBSSxDQUFDWSxPQUFPLENBQUNDLElBQUksSUFBSTtNQUNuQixNQUFNQyxHQUFHLEdBQUdMLFFBQVEsQ0FBQ00sYUFBYSxDQUFDLEtBQUssQ0FBQztNQUN6Q0QsR0FBRyxDQUFDRSxTQUFTLEdBQUcsTUFBTTtNQUN0QkgsSUFBSSxDQUFDRCxPQUFPLENBQUNLLElBQUksSUFBSTtRQUNuQixNQUFNQyxNQUFNLEdBQUdULFFBQVEsQ0FBQ00sYUFBYSxDQUFDLEtBQUssQ0FBQztRQUM1QyxJQUFJSSxLQUFLLENBQUNDLE9BQU8sQ0FBQ0gsSUFBSSxDQUFDLEVBQUU7VUFDdkIsTUFBTUksSUFBSSxHQUFHSixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUNLLE1BQU0sQ0FBQyxDQUFDO1VBQzdCLElBQUlELElBQUksS0FBSyxLQUFLLEVBQUU7WUFDbEJILE1BQU0sQ0FBQ0YsU0FBUyxHQUFHLFlBQVk7VUFDakMsQ0FBQyxNQUFNLElBQUlLLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDeEJILE1BQU0sQ0FBQ0YsU0FBUyxHQUFHLGFBQWE7VUFDbEM7VUFDQUUsTUFBTSxDQUFDSyxXQUFXLEdBQUcsR0FBRztRQUMxQixDQUFDLE1BQU0sSUFBSU4sSUFBSSxLQUFLLElBQUksSUFBS0EsSUFBSSxLQUFLLElBQUksSUFBSSxPQUFPQSxJQUFJLEtBQUssUUFBUyxFQUFFO1VBQ3ZFQyxNQUFNLENBQUNGLFNBQVMsR0FBRyxjQUFjO1VBQ2pDRSxNQUFNLENBQUNXLGdCQUFnQixDQUFDLE9BQU8sRUFBRTFCLHFEQUFZLENBQUMyQixlQUFlLENBQUM7UUFDaEUsQ0FBQyxNQUFNLElBQUliLElBQUksS0FBSyxPQUFPLEVBQUU7VUFDM0JDLE1BQU0sQ0FBQ0YsU0FBUyxHQUFHLGNBQWM7VUFDakNFLE1BQU0sQ0FBQ0ssV0FBVyxHQUFHLEdBQUc7UUFDMUI7UUFDQVQsR0FBRyxDQUFDVSxXQUFXLENBQUNOLE1BQU0sQ0FBQztNQUN6QixDQUFDLENBQUM7TUFDRlYsYUFBYSxDQUFDZ0IsV0FBVyxDQUFDVixHQUFHLENBQUM7SUFDaEMsQ0FBQyxDQUFDO0VBQ0osQ0FBQztFQUNEaUIsS0FBS0EsQ0FBQ0MsRUFBRSxFQUFFO0lBQ1IsT0FBTyxJQUFJQyxPQUFPLENBQUNDLE9BQU8sSUFBSTtNQUM1QkMsVUFBVSxDQUFDRCxPQUFPLEVBQUVGLEVBQUUsQ0FBQztJQUN6QixDQUFDLENBQUM7RUFDSixDQUFDO0VBQ0RJLFVBQVVBLENBQUEsRUFBRztJQUNYLE1BQU1DLFFBQVEsR0FBRzVCLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxNQUFNNEIsV0FBVyxHQUFHRCxRQUFRLENBQUNkLFdBQVcsQ0FBQ2dCLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELElBQUlELFdBQVcsS0FBSyxHQUFHLEVBQUU7TUFDdkJELFFBQVEsQ0FBQ2QsV0FBVyxHQUFHLGVBQWU7TUFDdENjLFFBQVEsQ0FBQ3JCLFNBQVMsR0FBRyxXQUFXO0lBQ2xDLENBQUMsTUFBTTtNQUNMcUIsUUFBUSxDQUFDZCxXQUFXLEdBQUcsZUFBZTtNQUN0Q2MsUUFBUSxDQUFDckIsU0FBUyxHQUFHLE9BQU87SUFDOUI7RUFDRixDQUFDO0VBQ0R3QixnQkFBZ0JBLENBQUNDLFNBQVMsRUFBRTtJQUMxQixJQUFJQyxJQUFJO0lBQ1IsSUFBSUMsVUFBVTtJQUNkLElBQUlGLFNBQVMsS0FBSyxDQUFDLEVBQUU7TUFDbkJDLElBQUksR0FBR2pDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGtCQUFrQixDQUFDO01BQ2pEaUMsVUFBVSxHQUFHdkMsR0FBRyxDQUFDc0IsT0FBTyxDQUFDa0IsZUFBZSxDQUFDLENBQUM7SUFDNUMsQ0FBQyxNQUFNO01BQ0xGLElBQUksR0FBR2pDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGtCQUFrQixDQUFDO01BQ2pEaUMsVUFBVSxHQUFHdkMsR0FBRyxDQUFDdUIsT0FBTyxDQUFDaUIsZUFBZSxDQUFDLENBQUM7SUFDNUM7SUFDQUYsSUFBSSxDQUFDbkIsV0FBVyxHQUFJLGdCQUFlb0IsVUFBVyxFQUFDO0VBQ2pELENBQUM7RUFDREUsV0FBV0EsQ0FBQ0MsTUFBTSxFQUFFO0lBQ2xCLE1BQU1DLEtBQUssR0FBR3RDLFFBQVEsQ0FBQ3VDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztJQUNoREQsS0FBSyxDQUFDbkMsT0FBTyxDQUFDcUMsSUFBSSxJQUFJO01BQ3BCQSxJQUFJLENBQUNwQixnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUxQixxREFBWSxDQUFDK0MsTUFBTSxDQUFDO01BQ3ZERCxJQUFJLENBQUNFLFNBQVMsR0FBRyxJQUFJO01BQ3JCRixJQUFJLENBQUNHLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLEdBQUc7SUFDMUIsQ0FBQyxDQUFDO0lBRUZsRCxxREFBWSxDQUFDbUQsZ0JBQWdCLENBQUNSLE1BQU0sQ0FBQztFQUN2QyxDQUFDO0VBQ0RTLGNBQWNBLENBQUEsRUFBRztJQUNmLE1BQU1sQixRQUFRLEdBQUc1QixRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDakQyQixRQUFRLENBQUNkLFdBQVcsR0FBRyxlQUFlO0lBQ3RDYyxRQUFRLENBQUNyQixTQUFTLEdBQUcsT0FBTztJQUM1QixNQUFNd0MsVUFBVSxHQUFHL0MsUUFBUSxDQUFDdUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDO0lBQzVEUSxVQUFVLENBQUM1QyxPQUFPLENBQUNFLEdBQUcsSUFBSTtNQUN4QkEsR0FBRyxDQUFDUyxXQUFXLEdBQUcsZ0JBQWdCO0lBQ3BDLENBQUMsQ0FBQztFQUNKLENBQUM7RUFDRGtDLGtCQUFrQkEsQ0FBQy9CLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0lBQ25DdkIsR0FBRyxDQUFDbUQsY0FBYyxDQUFDLENBQUM7SUFDcEJuRCxHQUFHLENBQUNFLFlBQVksQ0FBQ29CLE9BQU8sQ0FBQ0UsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDekMsTUFBTThCLFdBQVcsR0FBR2pELFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGNBQWMsQ0FBQztJQUMxRGdELFdBQVcsQ0FBQ0MsU0FBUyxDQUFDLENBQUM7SUFDdkJ2RCxHQUFHLENBQUN5QyxXQUFXLENBQUNuQixPQUFPLENBQUM7SUFDeEJ2QixxREFBWSxDQUFDeUQsaUJBQWlCLENBQUNsQyxPQUFPLEVBQUVDLE9BQU8sQ0FBQztFQUNsRDtBQUNGLENBQUM7QUFFRCwrREFBZXZCLEdBQUc7Ozs7Ozs7Ozs7Ozs7O0FDNUhNO0FBQ3NDO0FBQ3BDO0FBRTFCLE1BQU1ELFlBQVksR0FBRztFQUNuQnlELGlCQUFpQkEsQ0FBQ2xDLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0lBQ2xDLElBQUksQ0FBQ0QsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ0MsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLE1BQU1vQyxjQUFjLEdBQUd0RCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztJQUNwRSxNQUFNc0QsV0FBVyxHQUFHN0QsWUFBWSxDQUFDOEQsb0JBQW9CLENBQUNGLGNBQWMsQ0FBQztJQUNyRUMsV0FBVyxDQUFDbkMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQ3FDLFlBQVksQ0FBQztJQUV4RCxNQUFNQyxjQUFjLEdBQUcxRCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxZQUFZLENBQUM7SUFDM0QsTUFBTTBELFdBQVcsR0FBR2pFLFlBQVksQ0FBQzhELG9CQUFvQixDQUFDRSxjQUFjLENBQUM7SUFDckVDLFdBQVcsQ0FBQ3ZDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUN3QyxzQkFBc0IsQ0FBQztJQUVsRSxNQUFNQyxTQUFTLEdBQUc3RCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDbkQsTUFBTTZELE1BQU0sR0FBR3BFLFlBQVksQ0FBQzhELG9CQUFvQixDQUFDSyxTQUFTLENBQUM7SUFDM0RDLE1BQU0sQ0FBQzFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMyQyxhQUFhLENBQUM7RUFDdEQsQ0FBQztFQUNEQSxhQUFhQSxDQUFBLEVBQUc7SUFDZHJFLFlBQVksQ0FBQ3VCLE9BQU8sQ0FBQytDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hDdEUsWUFBWSxDQUFDdUIsT0FBTyxDQUFDZ0QsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN2Q3ZFLFlBQVksQ0FBQ3VCLE9BQU8sQ0FBQ2dELGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDdkN2RSxZQUFZLENBQUN1QixPQUFPLENBQUNnRCxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDdkUsWUFBWSxDQUFDdUIsT0FBTyxDQUFDZ0QsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN2Q3ZFLFlBQVksQ0FBQ3VCLE9BQU8sQ0FBQ2dELGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDdkN0RSw0Q0FBRyxDQUFDRSxZQUFZLENBQUNILFlBQVksQ0FBQ3VCLE9BQU8sQ0FBQ0UsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDdEQsTUFBTW1CLEtBQUssR0FBR3RDLFFBQVEsQ0FBQ3VDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztJQUNoREQsS0FBSyxDQUFDbkMsT0FBTyxDQUFDcUMsSUFBSSxJQUFJO01BQ3BCLE1BQU0wQixPQUFPLEdBQUcxQixJQUFJO01BQ3BCLE1BQU0yQixPQUFPLEdBQUdELE9BQU8sQ0FBQ0UsU0FBUyxDQUFDLElBQUksQ0FBQztNQUN2Q0YsT0FBTyxDQUFDRyxVQUFVLENBQUNDLFlBQVksQ0FBQ0gsT0FBTyxFQUFFRCxPQUFPLENBQUM7TUFDakRDLE9BQU8sQ0FBQ3pCLFNBQVMsR0FBRyxLQUFLO01BQ3pCeUIsT0FBTyxDQUFDeEIsS0FBSyxDQUFDQyxPQUFPLEdBQUcsR0FBRztJQUM3QixDQUFDLENBQUM7RUFDSixDQUFDO0VBQ0RnQixzQkFBc0JBLENBQUEsRUFBRztJQUN2QixNQUFNVyxRQUFRLEdBQUd2RSxRQUFRLENBQUNDLGFBQWEsQ0FBQyxhQUFhLENBQUM7SUFDdEQsTUFBTXFDLEtBQUssR0FBR3RDLFFBQVEsQ0FBQ3VDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztJQUNoRCxJQUFJNUMsNENBQUcsQ0FBQ0MsU0FBUyxLQUFLLFlBQVksRUFBRTtNQUNsQzJFLFFBQVEsQ0FBQ0MsU0FBUyxDQUFDQyxHQUFHLENBQUMsVUFBVSxDQUFDO01BQ2xDbkMsS0FBSyxDQUFDbkMsT0FBTyxDQUFDcUMsSUFBSSxJQUFJO1FBQ3BCQSxJQUFJLENBQUNnQyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxVQUFVLENBQUM7TUFDaEMsQ0FBQyxDQUFDO01BQ0Y5RSw0Q0FBRyxDQUFDQyxTQUFTLEdBQUcsVUFBVTtJQUM1QixDQUFDLE1BQU07TUFDTDJFLFFBQVEsQ0FBQ0MsU0FBUyxDQUFDRSxNQUFNLENBQUMsVUFBVSxDQUFDO01BQ3JDcEMsS0FBSyxDQUFDbkMsT0FBTyxDQUFDcUMsSUFBSSxJQUFJO1FBQ3BCQSxJQUFJLENBQUNnQyxTQUFTLENBQUNFLE1BQU0sQ0FBQyxVQUFVLENBQUM7TUFDbkMsQ0FBQyxDQUFDO01BQ0YvRSw0Q0FBRyxDQUFDQyxTQUFTLEdBQUcsWUFBWTtJQUM5QjtFQUNGLENBQUM7RUFDRDZELFlBQVlBLENBQUEsRUFBRztJQUNiLE1BQU1SLFdBQVcsR0FBR2pELFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGNBQWMsQ0FBQztJQUMxRCxNQUFNcUMsS0FBSyxHQUFHdEMsUUFBUSxDQUFDdUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO0lBQ2hELElBQUlvQyxRQUFRO0lBQ1pyQyxLQUFLLENBQUNuQyxPQUFPLENBQUNxQyxJQUFJLElBQUk7TUFDcEIsSUFBSUEsSUFBSSxDQUFDRSxTQUFTLEtBQUssSUFBSSxFQUFFaUMsUUFBUSxHQUFHLEtBQUs7SUFDL0MsQ0FBQyxDQUFDO0lBQ0YsSUFBSUEsUUFBUSxLQUFLLEtBQUssRUFBRTtJQUN4QjFCLFdBQVcsQ0FBQzJCLEtBQUssQ0FBQyxDQUFDO0lBQ25CakYsNENBQUcsQ0FBQ0UsWUFBWSxDQUFDSCxZQUFZLENBQUN1QixPQUFPLENBQUNFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDaER4Qiw0Q0FBRyxDQUFDcUIsaUJBQWlCLENBQUN0QixZQUFZLENBQUN1QixPQUFPLEVBQUV2QixZQUFZLENBQUN3QixPQUFPLENBQUM7RUFDbkUsQ0FBQztFQUNEdUIsTUFBTUEsQ0FBQ29DLEtBQUssRUFBRTtJQUNaQSxLQUFLLENBQUNDLFlBQVksQ0FBQ0MsT0FBTyxDQUN4QixrQkFBa0IsRUFDbEJDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO01BQUU1RixNQUFNLEVBQUV3RixLQUFLLENBQUNLLGFBQWEsQ0FBQ0MsUUFBUSxDQUFDOUYsTUFBTTtNQUFFK0YsRUFBRSxFQUFFUCxLQUFLLENBQUNLLGFBQWEsQ0FBQ0U7SUFBRyxDQUFDLENBQzVGLENBQUM7RUFDSCxDQUFDO0VBQ0R2QyxnQkFBZ0JBLENBQUNSLE1BQU0sRUFBRTtJQUN2QixNQUFNZ0QsT0FBTyxHQUFHckYsUUFBUSxDQUFDdUMsZ0JBQWdCLENBQUMsMkJBQTJCLENBQUM7SUFDdEUsSUFBSSxDQUFDRixNQUFNLEdBQUdBLE1BQU07SUFDcEJnRCxPQUFPLENBQUNsRixPQUFPLENBQUNNLE1BQU0sSUFBSTtNQUN4QkEsTUFBTSxDQUFDVyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUV5RCxLQUFLLElBQUk7UUFDM0NBLEtBQUssQ0FBQ1MsY0FBYyxDQUFDLENBQUM7TUFDeEIsQ0FBQyxDQUFDO01BQ0Y3RSxNQUFNLENBQUNXLGdCQUFnQixDQUFDLE1BQU0sRUFBRTFCLFlBQVksQ0FBQzZGLE1BQU0sQ0FBQztJQUN0RCxDQUFDLENBQUM7RUFDSixDQUFDO0VBQ0RBLE1BQU1BLENBQUNWLEtBQUssRUFBRTtJQUNaQSxLQUFLLENBQUNTLGNBQWMsQ0FBQyxDQUFDO0lBQ3RCLE1BQU1FLElBQUksR0FBR1gsS0FBSyxDQUFDQyxZQUFZLENBQUNXLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztJQUMzRCxNQUFNQyxNQUFNLEdBQUdWLElBQUksQ0FBQ1csS0FBSyxDQUFDSCxJQUFJLENBQUM7SUFDL0IsTUFBTTtNQUFFbkc7SUFBTyxDQUFDLEdBQUdxRyxNQUFNO0lBQ3pCLE1BQU1uRyxJQUFJLEdBQUdTLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGFBQWEsQ0FBQztJQUNsRCxNQUFNMkYsTUFBTSxHQUFHZixLQUFLLENBQUNLLGFBQWEsQ0FBQ2IsVUFBVTtJQUM3QyxNQUFNd0IsYUFBYSxHQUFHaEIsS0FBSyxDQUFDSyxhQUFhO0lBQ3pDLE1BQU1ZLE1BQU0sR0FBR3BGLEtBQUssQ0FBQ3FGLFNBQVMsQ0FBQ0MsT0FBTyxDQUFDQyxJQUFJLENBQUNMLE1BQU0sQ0FBQ1QsUUFBUSxFQUFFVSxhQUFhLENBQUM7SUFDM0UsTUFBTUssTUFBTSxHQUFHeEYsS0FBSyxDQUFDcUYsU0FBUyxDQUFDQyxPQUFPLENBQUNDLElBQUksQ0FBQzFHLElBQUksQ0FBQzRGLFFBQVEsRUFBRVMsTUFBTSxDQUFDO0lBQ2xFLE1BQU07TUFBRWhHO0lBQVUsQ0FBQyxHQUFHRCw0Q0FBRztJQUN6QixNQUFNd0csVUFBVSxHQUFHekcsWUFBWSxDQUFDMkMsTUFBTSxDQUFDbEIsT0FBTyxDQUFDLENBQUM7SUFDaEQsTUFBTWlGLE9BQU8sR0FBR2hELG1FQUFzQixDQUFDOEMsTUFBTSxFQUFFSixNQUFNLEVBQUVsRyxTQUFTLEVBQUVQLE1BQU0sRUFBRThHLFVBQVUsQ0FBQztJQUNyRixJQUFJQyxPQUFPLEtBQUssS0FBSyxFQUFFO01BQ3JCO0lBQ0Y7SUFFQTFHLFlBQVksQ0FBQzJDLE1BQU0sQ0FBQ2dFLFNBQVMsQ0FBQyxDQUFDSCxNQUFNLEVBQUVKLE1BQU0sQ0FBQyxFQUFFekcsTUFBTSxFQUFFTyxTQUFTLENBQUM7SUFDbEVELDRDQUFHLENBQUNFLFlBQVksQ0FBQ0gsWUFBWSxDQUFDMkMsTUFBTSxDQUFDbEIsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDckQsTUFBTW1GLFdBQVcsR0FBR3RHLFFBQVEsQ0FBQ3VHLGNBQWMsQ0FBQ2IsTUFBTSxDQUFDTixFQUFFLENBQUM7SUFDdERrQixXQUFXLENBQUNFLG1CQUFtQixDQUFDLFdBQVcsRUFBRTlHLFlBQVksQ0FBQytDLE1BQU0sQ0FBQztJQUNqRTZELFdBQVcsQ0FBQzVELFNBQVMsR0FBRyxLQUFLO0lBQzdCNEQsV0FBVyxDQUFDM0QsS0FBSyxDQUFDQyxPQUFPLEdBQUcsR0FBRztJQUMvQmxELFlBQVksQ0FBQ21ELGdCQUFnQixDQUFDbkQsWUFBWSxDQUFDMkMsTUFBTSxDQUFDO0VBQ3BELENBQUM7RUFDRG1CLG9CQUFvQkEsQ0FBQ2lELFNBQVMsRUFBRTtJQUM5QixNQUFNQyxNQUFNLEdBQUdELFNBQVMsQ0FBQ3JDLFNBQVMsQ0FBQyxJQUFJLENBQUM7SUFDeENxQyxTQUFTLENBQUNwQyxVQUFVLENBQUNDLFlBQVksQ0FBQ29DLE1BQU0sRUFBRUQsU0FBUyxDQUFDO0lBQ3BELE9BQU9DLE1BQU07RUFDZixDQUFDO0VBQ0RyRixlQUFlLEVBQUUsTUFBTXdELEtBQUssSUFBSTtJQUM5QixNQUFNOEIsU0FBUyxHQUFHM0csUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQ2xELE1BQU0yRixNQUFNLEdBQUdmLEtBQUssQ0FBQ0ssYUFBYSxDQUFDYixVQUFVO0lBQzdDLE1BQU13QixhQUFhLEdBQUdoQixLQUFLLENBQUNLLGFBQWE7SUFDekMsTUFBTVksTUFBTSxHQUFHcEYsS0FBSyxDQUFDcUYsU0FBUyxDQUFDQyxPQUFPLENBQUNDLElBQUksQ0FBQ0wsTUFBTSxDQUFDVCxRQUFRLEVBQUVVLGFBQWEsQ0FBQztJQUMzRSxNQUFNSyxNQUFNLEdBQUd4RixLQUFLLENBQUNxRixTQUFTLENBQUNDLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDVSxTQUFTLENBQUN4QixRQUFRLEVBQUVTLE1BQU0sQ0FBQztJQUN2RSxJQUFJZ0IsR0FBRyxHQUFHakgsNENBQUcsQ0FBQ3NCLE9BQU8sQ0FBQzRGLE1BQU0sQ0FBQ2xILDRDQUFHLENBQUN1QixPQUFPLEVBQUVnRixNQUFNLEVBQUVKLE1BQU0sQ0FBQztJQUN6RG5HLDRDQUFHLENBQUNxQixpQkFBaUIsQ0FBQ3JCLDRDQUFHLENBQUNzQixPQUFPLEVBQUV0Qiw0Q0FBRyxDQUFDdUIsT0FBTyxDQUFDO0lBQy9DdkIsNENBQUcsQ0FBQ29DLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUN2QixJQUFJcEMsNENBQUcsQ0FBQ3VCLE9BQU8sQ0FBQzRGLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLE9BQU9wSCxZQUFZLENBQUNxSCxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLElBQUlILEdBQUcsS0FBSyxLQUFLLEVBQUU7TUFDakJqSCw0Q0FBRyxDQUFDZ0MsVUFBVSxDQUFDLENBQUM7TUFDaEIsR0FBRztRQUNELE1BQU1oQyw0Q0FBRyxDQUFDMkIsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNwQnNGLEdBQUcsR0FBR2pILDRDQUFHLENBQUN1QixPQUFPLENBQUM4RixZQUFZLENBQUNySCw0Q0FBRyxDQUFDc0IsT0FBTyxDQUFDO1FBQzNDdEIsNENBQUcsQ0FBQ0UsWUFBWSxDQUFDRiw0Q0FBRyxDQUFDc0IsT0FBTyxDQUFDRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDeEIsNENBQUcsQ0FBQ29DLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJcEMsNENBQUcsQ0FBQ3NCLE9BQU8sQ0FBQzZGLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLE9BQU9wSCxZQUFZLENBQUNxSCxLQUFLLENBQUMsQ0FBQyxDQUFDO01BQ25FLENBQUMsUUFBUUgsR0FBRyxLQUFLLEtBQUs7TUFDdEJqSCw0Q0FBRyxDQUFDZ0MsVUFBVSxDQUFDLENBQUM7SUFDbEI7SUFDQSxPQUFPLEtBQUs7RUFDZCxDQUFDO0VBQ0RvRixLQUFLQSxDQUFDMUUsTUFBTSxFQUFFO0lBQ1osTUFBTTRFLFNBQVMsR0FBR2pILFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUNoRGdILFNBQVMsQ0FBQy9ELFNBQVMsQ0FBQyxDQUFDO0lBQ3JCLE1BQU1nRSxPQUFPLEdBQUdELFNBQVMsQ0FBQ2hILGFBQWEsQ0FBQyxVQUFVLENBQUM7SUFDbkRpSCxPQUFPLENBQUM5RixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTWlDLDZDQUFJLENBQUM4RCxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzFERCxPQUFPLENBQUM5RixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtNQUN0QzZGLFNBQVMsQ0FBQ3JDLEtBQUssQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQztJQUNGLE1BQU13QyxLQUFLLEdBQUdwSCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDOUNtSCxLQUFLLENBQUN0RyxXQUFXLEdBQUksVUFBU3VCLE1BQU8sU0FBUTtJQUM3QyxNQUFNZ0YsTUFBTSxHQUFHckgsUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDO0lBQ2hEb0gsTUFBTSxDQUFDdkcsV0FBVyxHQUFJLFVBQVN1QixNQUFPLFNBQVE7SUFDOUNnRixNQUFNLENBQUM5RyxTQUFTLEdBQUcsUUFBUTtJQUMzQixJQUFJOEIsTUFBTSxLQUFLLENBQUMsRUFBRTtNQUNoQmdGLE1BQU0sQ0FBQzdDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUM3QjtFQUNGO0FBQ0YsQ0FBQztBQUVELCtEQUFlL0UsWUFBWTs7Ozs7Ozs7Ozs7Ozs7QUMxSkg7QUFDTTtBQUNVO0FBRXhDLE1BQU0yRCxJQUFJLEdBQUc7RUFDWG1FLFNBQVNBLENBQUEsRUFBRztJQUNWLE1BQU12RyxPQUFPLEdBQUdxRyxtREFBTSxDQUFDLENBQUMsQ0FBQztJQUN6QixNQUFNcEcsT0FBTyxHQUFHb0csbURBQU0sQ0FBQyxDQUFDLENBQUM7SUFDekJwRyxPQUFPLENBQUMrQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzFCL0MsT0FBTyxDQUFDK0MsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUMxQi9DLE9BQU8sQ0FBQytDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDMUIvQyxPQUFPLENBQUMrQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzFCL0MsT0FBTyxDQUFDK0MsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUMxQnRFLDRDQUFHLENBQUNxRCxrQkFBa0IsQ0FBQy9CLE9BQU8sRUFBRUMsT0FBTyxDQUFDO0VBQzFDLENBQUM7RUFDRHVHLGdCQUFnQkEsQ0FBQSxFQUFHO0lBQ2pCLE1BQU14RyxPQUFPLEdBQUdxRyxtREFBTSxDQUFDLENBQUMsQ0FBQztJQUN6QixNQUFNcEcsT0FBTyxHQUFHb0csbURBQU0sQ0FBQyxDQUFDLENBQUM7SUFDekJDLG9EQUFXLENBQUNHLGVBQWUsQ0FBQyxDQUFDO0lBQzdCSCxvREFBVyxDQUFDSSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ25DSixvREFBVyxDQUFDdkUsa0JBQWtCLENBQUMvQixPQUFPLEVBQUVDLE9BQU8sQ0FBQztFQUNsRCxDQUFDO0VBQ0RpRyxVQUFVQSxDQUFBLEVBQUc7SUFDWCxNQUFNUyxjQUFjLEdBQUc1SCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxjQUFjLENBQUM7SUFDN0QySCxjQUFjLENBQUMxRSxTQUFTLENBQUMsQ0FBQztJQUMxQixNQUFNMkUsWUFBWSxHQUFHRCxjQUFjLENBQUMzSCxhQUFhLENBQUMsV0FBVyxDQUFDO0lBQzlENEgsWUFBWSxDQUFDekcsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07TUFDM0N3RyxjQUFjLENBQUNoRCxLQUFLLENBQUMsQ0FBQztNQUN0QnZCLElBQUksQ0FBQ21FLFNBQVMsQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQztJQUNGLE1BQU1NLFNBQVMsR0FBRzlILFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGNBQWMsQ0FBQztJQUN4RDZILFNBQVMsQ0FBQzFHLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO01BQ3hDd0csY0FBYyxDQUFDaEQsS0FBSyxDQUFDLENBQUM7TUFDdEJ2QixJQUFJLENBQUNvRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQztFQUNKO0FBQ0YsQ0FBQztBQUVELCtEQUFlcEUsSUFBSTs7Ozs7Ozs7Ozs7Ozs7QUN0Q087QUFDYTtBQUN1QjtBQUU5RCxNQUFNMkUsU0FBUyxHQUFHLFNBQVNDLGVBQWVBLENBQUEsRUFBRztFQUMzQyxJQUFJMUksSUFBSSxHQUFHTCx3REFBVSxDQUFDLENBQUM7RUFFdkIsTUFBTW1ILFNBQVMsR0FBRyxTQUFBQSxDQUFVdkcsS0FBSyxFQUFFVCxNQUFNLEVBQUVPLFNBQVMsRUFBRTtJQUNwRCxNQUFNc0ksT0FBTyxHQUFHSCxpREFBSSxDQUFDMUksTUFBTSxDQUFDO0lBQzVCLElBQUlPLFNBQVMsS0FBSyxVQUFVLEVBQUU7TUFDNUIsS0FBSyxJQUFJSixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcwSSxPQUFPLENBQUM3SSxNQUFNLEVBQUVHLENBQUMsSUFBSSxDQUFDLEVBQUVELElBQUksQ0FBQ08sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBR04sQ0FBQyxDQUFDLEdBQUcwSSxPQUFPO0lBQ3BGLENBQUMsTUFBTTtNQUNMLEtBQUssSUFBSTFJLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzBJLE9BQU8sQ0FBQzdJLE1BQU0sRUFBRUcsQ0FBQyxJQUFJLENBQUMsRUFBRUQsSUFBSSxDQUFDTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUdOLENBQUMsQ0FBQyxDQUFDTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBR29JLE9BQU87SUFDcEY7RUFDRixDQUFDO0VBRUQsTUFBTWpFLGVBQWUsR0FBRyxTQUFBQSxDQUFVNUUsTUFBTSxFQUFFO0lBQ3hDLElBQUk4SSxDQUFDO0lBQ0wsSUFBSUMsQ0FBQztJQUNMLElBQUloQyxPQUFPLEdBQUcsS0FBSztJQUNuQixJQUFJeEcsU0FBUztJQUNiLE1BQU15SSxHQUFHLEdBQUdDLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUN4RSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLElBQUl1RSxHQUFHLEtBQUssQ0FBQyxFQUFFO01BQ2J6SSxTQUFTLEdBQUcsWUFBWTtJQUMxQixDQUFDLE1BQU07TUFDTEEsU0FBUyxHQUFHLFVBQVU7SUFDeEI7SUFDQSxPQUFPd0csT0FBTyxLQUFLLEtBQUssRUFBRTtNQUN4QitCLENBQUMsR0FBR0csSUFBSSxDQUFDRSxLQUFLLENBQUNGLElBQUksQ0FBQ3hFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ2xDc0UsQ0FBQyxHQUFHRSxJQUFJLENBQUNFLEtBQUssQ0FBQ0YsSUFBSSxDQUFDeEUsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDbENzQyxPQUFPLEdBQUdoRCxtRUFBc0IsQ0FBQytFLENBQUMsRUFBRUMsQ0FBQyxFQUFFeEksU0FBUyxFQUFFUCxNQUFNLEVBQUVFLElBQUksQ0FBQztJQUNqRTtJQUNBLElBQUksQ0FBQzhHLFNBQVMsQ0FBQyxDQUFDOEIsQ0FBQyxFQUFFQyxDQUFDLENBQUMsRUFBRS9JLE1BQU0sRUFBRU8sU0FBUyxDQUFDO0VBQzNDLENBQUM7RUFFRCxNQUFNb0UsU0FBUyxHQUFHLFNBQUFBLENBQUEsRUFBWTtJQUM1QnpFLElBQUksR0FBR0wsd0RBQVUsQ0FBQyxDQUFDO0VBQ3JCLENBQUM7RUFFRCxNQUFNdUosVUFBVSxHQUFHLFNBQUFBLENBQVVOLENBQUMsRUFBRUMsQ0FBQyxFQUFFO0lBQ2pDLE1BQU1NLEtBQUssR0FBR25KLElBQUksQ0FBQzRJLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUM7SUFDeEIsSUFBSU0sS0FBSyxLQUFLLElBQUksRUFBRTtNQUNsQm5KLElBQUksQ0FBQzRJLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUMsR0FBRyxPQUFPO01BQ3BCLE9BQU8sS0FBSztJQUNkO0lBQ0FNLEtBQUssQ0FBQ0MsTUFBTSxDQUFDLENBQUM7SUFDZHBKLElBQUksQ0FBQzRJLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRU0sS0FBSyxDQUFDO0lBQzNCLE9BQU9BLEtBQUs7RUFDZCxDQUFDO0VBRUQsTUFBTTVCLE9BQU8sR0FBRyxTQUFBQSxDQUFBLEVBQVk7SUFDMUIsSUFBSThCLE1BQU0sR0FBRyxJQUFJO0lBQ2pCckosSUFBSSxDQUFDWSxPQUFPLENBQUNDLElBQUksSUFBSTtNQUNuQkEsSUFBSSxDQUFDRCxPQUFPLENBQUNLLElBQUksSUFBSTtRQUNuQixJQUFJQSxJQUFJLEtBQUssSUFBSSxJQUFJLE9BQU9BLElBQUksS0FBSyxRQUFRLElBQUksQ0FBQ0UsS0FBSyxDQUFDQyxPQUFPLENBQUNILElBQUksQ0FBQyxFQUFFb0ksTUFBTSxHQUFHLEtBQUs7TUFDdkYsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBQ0YsT0FBT0EsTUFBTTtFQUNmLENBQUM7RUFFRCxNQUFNekcsZUFBZSxHQUFHLFNBQUFBLENBQUEsRUFBWTtJQUNsQyxNQUFNRyxLQUFLLEdBQUcsRUFBRTtJQUNoQi9DLElBQUksQ0FBQ1ksT0FBTyxDQUFDQyxJQUFJLElBQUk7TUFDbkJBLElBQUksQ0FBQ0QsT0FBTyxDQUFDSyxJQUFJLElBQUk7UUFDbkIsSUFDRUEsSUFBSSxLQUFLLElBQUksSUFDYixPQUFPQSxJQUFJLEtBQUssUUFBUSxJQUN4QixDQUFDRSxLQUFLLENBQUNDLE9BQU8sQ0FBQ0gsSUFBSSxDQUFDLElBQ3BCLENBQUM4QixLQUFLLENBQUN1RyxRQUFRLENBQUNySSxJQUFJLENBQUMsRUFDckI7VUFDQThCLEtBQUssQ0FBQ3dHLElBQUksQ0FBQ3RJLElBQUksQ0FBQztRQUNsQjtNQUNGLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztJQUNGLE9BQU84QixLQUFLLENBQUNqRCxNQUFNO0VBQ3JCLENBQUM7RUFFRCxNQUFNOEIsT0FBTyxHQUFHLFNBQUFBLENBQUEsRUFBWTtJQUMxQixPQUFPNUIsSUFBSTtFQUNiLENBQUM7RUFDRCxPQUFPO0lBQ0w0QixPQUFPO0lBQ1A2QyxTQUFTO0lBQ1RxQyxTQUFTO0lBQ1RwQyxlQUFlO0lBQ2Z3RSxVQUFVO0lBQ1YzQixPQUFPO0lBQ1AzRTtFQUNGLENBQUM7QUFDSCxDQUFDO0FBRUQsK0RBQWU2RixTQUFTOzs7Ozs7Ozs7OztBQzNGeEIsTUFBTTVFLHNCQUFzQixHQUFHQSxDQUFDK0UsQ0FBQyxFQUFFQyxDQUFDLEVBQUV4SSxTQUFTLEVBQUVQLE1BQU0sRUFBRUUsSUFBSSxLQUFLO0VBQ2hFLE1BQU13SixLQUFLLEdBQUcsRUFBRTtFQUNoQixNQUFNQyxnQkFBZ0IsR0FBRyxFQUFFO0VBRTNCLElBQUlwSixTQUFTLEtBQUssWUFBWSxJQUFJdUksQ0FBQyxHQUFHOUksTUFBTSxHQUFHRSxJQUFJLENBQUNGLE1BQU0sRUFBRTtJQUMxRCxPQUFPLEtBQUs7RUFDZDtFQUNBLElBQUlPLFNBQVMsS0FBSyxVQUFVLElBQUl3SSxDQUFDLEdBQUcvSSxNQUFNLElBQUlFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ0YsTUFBTSxFQUFFO0lBQzVELE9BQU8sS0FBSztFQUNkO0VBRUEwSixLQUFLLENBQUNELElBQUksQ0FBQ3ZKLElBQUksQ0FBQzRJLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUMsQ0FBQztFQUN0QixJQUFJeEksU0FBUyxLQUFLLFlBQVksRUFBRTtJQUM5QixLQUFLLElBQUlKLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0gsTUFBTSxFQUFFRyxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ2xDdUosS0FBSyxDQUFDRCxJQUFJLENBQUN2SixJQUFJLENBQUM0SSxDQUFDLEdBQUczSSxDQUFDLENBQUMsQ0FBQzRJLENBQUMsQ0FBQyxDQUFDO0lBQzVCO0VBQ0YsQ0FBQyxNQUFNO0lBQ0wsS0FBSyxJQUFJNUksQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHSCxNQUFNLEVBQUVHLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDbEN1SixLQUFLLENBQUNELElBQUksQ0FBQ3ZKLElBQUksQ0FBQzRJLENBQUMsQ0FBQyxDQUFDQyxDQUFDLEdBQUc1SSxDQUFDLENBQUMsQ0FBQztJQUM1QjtFQUNGO0VBRUEsS0FBSyxJQUFJQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUVBLENBQUMsSUFBSUgsTUFBTSxFQUFFRyxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ3BDLE1BQU15SixFQUFFLEdBQUdkLENBQUMsSUFBSXZJLFNBQVMsS0FBSyxZQUFZLEdBQUdKLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkQsTUFBTTBKLEVBQUUsR0FBR2QsQ0FBQyxJQUFJeEksU0FBUyxLQUFLLFlBQVksR0FBRyxDQUFDLEdBQUdKLENBQUMsQ0FBQztJQUNuRCxNQUFNMkosRUFBRSxHQUFHaEIsQ0FBQyxJQUFJdkksU0FBUyxLQUFLLFlBQVksR0FBR0osQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BELE1BQU00SixFQUFFLEdBQUdoQixDQUFDLElBQUl4SSxTQUFTLEtBQUssWUFBWSxHQUFHLENBQUMsQ0FBQyxHQUFHSixDQUFDLENBQUM7SUFDcEQsTUFBTTZKLEVBQUUsR0FBR2xCLENBQUMsSUFBSXZJLFNBQVMsS0FBSyxZQUFZLEdBQUdKLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkQsTUFBTThKLEVBQUUsR0FBR2xCLENBQUMsSUFBSXhJLFNBQVMsS0FBSyxZQUFZLEdBQUcsQ0FBQyxHQUFHSixDQUFDLENBQUM7SUFFbkQsSUFBSXlKLEVBQUUsSUFBSSxDQUFDLElBQUlBLEVBQUUsR0FBRzFKLElBQUksQ0FBQ0YsTUFBTSxJQUFJNkosRUFBRSxJQUFJLENBQUMsSUFBSUEsRUFBRSxHQUFHM0osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDRixNQUFNLEVBQUU7TUFDakUySixnQkFBZ0IsQ0FBQ0YsSUFBSSxDQUFDdkosSUFBSSxDQUFDMEosRUFBRSxDQUFDLENBQUNDLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDO0lBQ0EsSUFBSUMsRUFBRSxJQUFJLENBQUMsSUFBSUEsRUFBRSxHQUFHNUosSUFBSSxDQUFDRixNQUFNLElBQUkrSixFQUFFLElBQUksQ0FBQyxJQUFJQSxFQUFFLEdBQUc3SixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUNGLE1BQU0sRUFBRTtNQUNqRTJKLGdCQUFnQixDQUFDRixJQUFJLENBQUN2SixJQUFJLENBQUM0SixFQUFFLENBQUMsQ0FBQ0MsRUFBRSxDQUFDLENBQUM7SUFDckM7SUFDQSxJQUFJQyxFQUFFLElBQUksQ0FBQyxJQUFJQSxFQUFFLEdBQUc5SixJQUFJLENBQUNGLE1BQU0sSUFBSWlLLEVBQUUsSUFBSSxDQUFDLElBQUlBLEVBQUUsR0FBRy9KLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ0YsTUFBTSxFQUFFO01BQ2pFMkosZ0JBQWdCLENBQUNGLElBQUksQ0FBQ3ZKLElBQUksQ0FBQzhKLEVBQUUsQ0FBQyxDQUFDQyxFQUFFLENBQUMsQ0FBQztJQUNyQztFQUNGO0VBRUEsTUFBTUMsS0FBSyxHQUFHUixLQUFLLENBQUNTLEtBQUssQ0FBQy9JLE1BQU0sSUFBSUEsTUFBTSxLQUFLLElBQUksQ0FBQztFQUNwRCxNQUFNZ0osZ0JBQWdCLEdBQUdULGdCQUFnQixDQUFDUSxLQUFLLENBQUMvSSxNQUFNLElBQUlBLE1BQU0sS0FBSyxJQUFJLENBQUM7RUFFMUUsT0FBTzhJLEtBQUssSUFBSUUsZ0JBQWdCO0FBQ2xDLENBQUM7QUFFRCwrREFBZXJHLHNCQUFzQjs7Ozs7Ozs7Ozs7O0FDL0NYO0FBRTFCLE1BQU1tRSxXQUFXLEdBQUc7RUFDbEIzSCxTQUFTLEVBQUUsWUFBWTtFQUN2QjhKLGFBQWEsRUFBRSxDQUFDO0VBQ2hCN0osWUFBWUEsQ0FBQ04sSUFBSSxFQUFpQjtJQUFBLElBQWZPLEtBQUssR0FBQVYsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsS0FBSztJQUM5QixJQUFJVyxhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUNwRCxJQUFJSCxLQUFLLEtBQUssSUFBSSxFQUFFO01BQ2xCQyxhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGFBQWEsQ0FBQztJQUN2RDtJQUNBRixhQUFhLENBQUNHLFNBQVMsR0FBRyxFQUFFO0lBQzVCWCxJQUFJLENBQUNZLE9BQU8sQ0FBQ0MsSUFBSSxJQUFJO01BQ25CLE1BQU1DLEdBQUcsR0FBR0wsUUFBUSxDQUFDTSxhQUFhLENBQUMsS0FBSyxDQUFDO01BQ3pDRCxHQUFHLENBQUNFLFNBQVMsR0FBRyxNQUFNO01BQ3RCSCxJQUFJLENBQUNELE9BQU8sQ0FBQ0ssSUFBSSxJQUFJO1FBQ25CLE1BQU1DLE1BQU0sR0FBR1QsUUFBUSxDQUFDTSxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzVDLElBQUlFLElBQUksS0FBSyxJQUFJLEVBQUU7VUFDakJDLE1BQU0sQ0FBQ0YsU0FBUyxHQUFHLGNBQWM7UUFDbkMsQ0FBQyxNQUFNLElBQUlHLEtBQUssQ0FBQ0MsT0FBTyxDQUFDSCxJQUFJLENBQUMsRUFBRTtVQUM5QixNQUFNSSxJQUFJLEdBQUdKLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ0ssTUFBTSxDQUFDLENBQUM7VUFDN0IsSUFBSUQsSUFBSSxLQUFLLEtBQUssRUFBRTtZQUNsQkgsTUFBTSxDQUFDRixTQUFTLEdBQUcsWUFBWTtVQUNqQyxDQUFDLE1BQU0sSUFBSUssSUFBSSxLQUFLLElBQUksRUFBRTtZQUN4QkgsTUFBTSxDQUFDRixTQUFTLEdBQUcsYUFBYTtVQUNsQztVQUNBRSxNQUFNLENBQUNLLFdBQVcsR0FBRyxHQUFHO1FBQzFCLENBQUMsTUFBTSxJQUFJTixJQUFJLEtBQUssSUFBSSxJQUFJLE9BQU9BLElBQUksS0FBSyxRQUFRLEVBQUU7VUFDcERDLE1BQU0sQ0FBQ0YsU0FBUyxHQUFHLGFBQWE7UUFDbEMsQ0FBQyxNQUFNLElBQUlDLElBQUksS0FBSyxPQUFPLEVBQUU7VUFDM0JDLE1BQU0sQ0FBQ0YsU0FBUyxHQUFHLGNBQWM7VUFDakNFLE1BQU0sQ0FBQ0ssV0FBVyxHQUFHLEdBQUc7UUFDMUI7UUFDQVQsR0FBRyxDQUFDVSxXQUFXLENBQUNOLE1BQU0sQ0FBQztNQUN6QixDQUFDLENBQUM7TUFDRlYsYUFBYSxDQUFDZ0IsV0FBVyxDQUFDVixHQUFHLENBQUM7SUFDaEMsQ0FBQyxDQUFDO0VBQ0osQ0FBQztFQUNEVyxpQkFBaUJBLENBQUNDLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0lBQ2xDLElBQUksQ0FBQ0QsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ0MsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLE1BQU1uQixhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUN0RCxNQUFNVixJQUFJLEdBQUcsSUFBSSxDQUFDMkIsT0FBTyxDQUFDQyxPQUFPLENBQUMsQ0FBQztJQUNuQ3BCLGFBQWEsQ0FBQ0csU0FBUyxHQUFHLEVBQUU7SUFDNUJYLElBQUksQ0FBQ1ksT0FBTyxDQUFDQyxJQUFJLElBQUk7TUFDbkIsTUFBTUMsR0FBRyxHQUFHTCxRQUFRLENBQUNNLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDekNELEdBQUcsQ0FBQ0UsU0FBUyxHQUFHLE1BQU07TUFDdEJILElBQUksQ0FBQ0QsT0FBTyxDQUFDSyxJQUFJLElBQUk7UUFDbkIsTUFBTUMsTUFBTSxHQUFHVCxRQUFRLENBQUNNLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDNUMsSUFBSUksS0FBSyxDQUFDQyxPQUFPLENBQUNILElBQUksQ0FBQyxFQUFFO1VBQ3ZCLE1BQU1JLElBQUksR0FBR0osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDSyxNQUFNLENBQUMsQ0FBQztVQUM3QixJQUFJRCxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQ2xCSCxNQUFNLENBQUNGLFNBQVMsR0FBRyxZQUFZO1VBQ2pDLENBQUMsTUFBTSxJQUFJSyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3hCSCxNQUFNLENBQUNGLFNBQVMsR0FBRyxhQUFhO1VBQ2xDO1VBQ0FFLE1BQU0sQ0FBQ0ssV0FBVyxHQUFHLEdBQUc7UUFDMUIsQ0FBQyxNQUFNLElBQUlOLElBQUksS0FBSyxJQUFJLElBQUtBLElBQUksS0FBSyxJQUFJLElBQUksT0FBT0EsSUFBSSxLQUFLLFFBQVMsRUFBRTtVQUN2RUMsTUFBTSxDQUFDRixTQUFTLEdBQUcsY0FBYztVQUNqQ0UsTUFBTSxDQUFDVyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUVtRyxXQUFXLENBQUNvQyxhQUFhLENBQUM7UUFDN0QsQ0FBQyxNQUFNLElBQUluSixJQUFJLEtBQUssT0FBTyxFQUFFO1VBQzNCQyxNQUFNLENBQUNGLFNBQVMsR0FBRyxjQUFjO1VBQ2pDRSxNQUFNLENBQUNLLFdBQVcsR0FBRyxHQUFHO1FBQzFCO1FBQ0FULEdBQUcsQ0FBQ1UsV0FBVyxDQUFDTixNQUFNLENBQUM7TUFDekIsQ0FBQyxDQUFDO01BQ0ZWLGFBQWEsQ0FBQ2dCLFdBQVcsQ0FBQ1YsR0FBRyxDQUFDO0lBQ2hDLENBQUMsQ0FBQztFQUNKLENBQUM7RUFDRHNKLGFBQWEsRUFBRSxNQUFNOUUsS0FBSyxJQUFJO0lBQzVCLE1BQU04QixTQUFTLEdBQUczRyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDbEQsTUFBTTJGLE1BQU0sR0FBR2YsS0FBSyxDQUFDSyxhQUFhLENBQUNiLFVBQVU7SUFDN0MsTUFBTXdCLGFBQWEsR0FBR2hCLEtBQUssQ0FBQ0ssYUFBYTtJQUN6QyxNQUFNWSxNQUFNLEdBQUdwRixLQUFLLENBQUNxRixTQUFTLENBQUNDLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDTCxNQUFNLENBQUNULFFBQVEsRUFBRVUsYUFBYSxDQUFDO0lBQzNFLE1BQU1LLE1BQU0sR0FBR3hGLEtBQUssQ0FBQ3FGLFNBQVMsQ0FBQ0MsT0FBTyxDQUFDQyxJQUFJLENBQUNVLFNBQVMsQ0FBQ3hCLFFBQVEsRUFBRVMsTUFBTSxDQUFDO0lBQ3ZFLE1BQU1nQixHQUFHLEdBQUdXLFdBQVcsQ0FBQ3RHLE9BQU8sQ0FBQzRGLE1BQU0sQ0FBQ1UsV0FBVyxDQUFDckcsT0FBTyxFQUFFZ0YsTUFBTSxFQUFFSixNQUFNLENBQUM7SUFDM0UsSUFBSXlCLFdBQVcsQ0FBQ3JHLE9BQU8sQ0FBQzRGLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLE9BQU9TLFdBQVcsQ0FBQ3FDLFNBQVMsQ0FBQ3JDLFdBQVcsQ0FBQ3RHLE9BQU8sQ0FBQztJQUM5RnNHLFdBQVcsQ0FBQ3ZHLGlCQUFpQixDQUFDdUcsV0FBVyxDQUFDdEcsT0FBTyxFQUFFc0csV0FBVyxDQUFDckcsT0FBTyxDQUFDO0lBQ3ZFcUcsV0FBVyxDQUFDeEYsZ0JBQWdCLENBQUMsQ0FBQztJQUM5QixJQUFJNkUsR0FBRyxLQUFLLEtBQUssRUFBRTtNQUNqQlcsV0FBVyxDQUFDc0MsZUFBZSxDQUFDLENBQUM7TUFDN0J0QyxXQUFXLENBQUMxSCxZQUFZLENBQUMwSCxXQUFXLENBQUNyRyxPQUFPLENBQUNDLE9BQU8sQ0FBQyxDQUFDLENBQUM7TUFDdkRvRyxXQUFXLENBQUN2RyxpQkFBaUIsQ0FBQ3VHLFdBQVcsQ0FBQ3JHLE9BQU8sRUFBRXFHLFdBQVcsQ0FBQ3RHLE9BQU8sQ0FBQztNQUN2RXNHLFdBQVcsQ0FBQ3hGLGdCQUFnQixDQUFDLENBQUM7TUFDOUJ3RixXQUFXLENBQUM1RixVQUFVLENBQUMsQ0FBQztJQUMxQjtJQUNBLE9BQU8sS0FBSztFQUNkLENBQUM7RUFDRGtJLGVBQWVBLENBQUEsRUFBRztJQUNoQixNQUFNQyxXQUFXLEdBQUc5SixRQUFRLENBQUNDLGFBQWEsQ0FBQyxlQUFlLENBQUM7SUFDM0Q2SixXQUFXLENBQUM1RyxTQUFTLENBQUMsQ0FBQztJQUN2QjRHLFdBQVcsQ0FBQ3RGLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxNQUFNc0YsV0FBVyxHQUFHL0osUUFBUSxDQUFDQyxhQUFhLENBQUMsY0FBYyxDQUFDO0lBQzFEOEosV0FBVyxDQUFDM0ksZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07TUFDMUMwSSxXQUFXLENBQUNsRixLQUFLLENBQUMsQ0FBQztNQUNuQmtGLFdBQVcsQ0FBQ3RGLFNBQVMsQ0FBQ0UsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUN0QyxDQUFDLENBQUM7RUFDSixDQUFDO0VBQ0RrRixTQUFTQSxDQUFDdkgsTUFBTSxFQUFFO0lBQ2hCLE1BQU00RSxTQUFTLEdBQUdqSCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxNQUFNLENBQUM7SUFDaERnSCxTQUFTLENBQUMvRCxTQUFTLENBQUMsQ0FBQztJQUNyQixNQUFNZ0UsT0FBTyxHQUFHRCxTQUFTLENBQUNoSCxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ25EaUgsT0FBTyxDQUFDOUYsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU1pQyw2Q0FBSSxDQUFDOEQsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUMxREQsT0FBTyxDQUFDOUYsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07TUFDdEM2RixTQUFTLENBQUNyQyxLQUFLLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUM7SUFDRixNQUFNd0MsS0FBSyxHQUFHcEgsUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQzlDbUgsS0FBSyxDQUFDdEcsV0FBVyxHQUFJLFVBQVN1QixNQUFNLENBQUMySCxNQUFPLFNBQVE7SUFDcEQsTUFBTTNDLE1BQU0sR0FBR3JILFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUNoRG9ILE1BQU0sQ0FBQ3ZHLFdBQVcsR0FBSSxVQUFTdUIsTUFBTSxDQUFDMkgsTUFBTyxTQUFRO0lBQ3JEM0MsTUFBTSxDQUFDOUcsU0FBUyxHQUFHLFFBQVE7SUFDM0IsSUFBSThCLE1BQU0sQ0FBQzJILE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDdkIzQyxNQUFNLENBQUM3QyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDN0I7RUFDRixDQUFDO0VBQ0Q5QyxVQUFVQSxDQUFBLEVBQUc7SUFDWCxNQUFNQyxRQUFRLEdBQUc1QixRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDakQsTUFBTWdLLFdBQVcsR0FBR2pLLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGFBQWEsQ0FBQztJQUN6RCxNQUFNaUssWUFBWSxHQUFHbEssUUFBUSxDQUFDQyxhQUFhLENBQUMsV0FBVyxDQUFDO0lBQ3hELE1BQU1rSyxXQUFXLEdBQUduSyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxhQUFhLENBQUM7SUFDekQsTUFBTW1LLFlBQVksR0FBR3BLLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFdBQVcsQ0FBQztJQUN4RCxNQUFNNEIsV0FBVyxHQUFHRCxRQUFRLENBQUNkLFdBQVcsQ0FBQ2dCLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELElBQUlELFdBQVcsS0FBSyxHQUFHLEVBQUU7TUFDdkJELFFBQVEsQ0FBQ2QsV0FBVyxHQUFHLGVBQWU7TUFDdENjLFFBQVEsQ0FBQ3JCLFNBQVMsR0FBRyxXQUFXO01BQ2hDMEosV0FBVyxDQUFDbkosV0FBVyxHQUFHLFVBQVU7TUFDcENvSixZQUFZLENBQUMzSixTQUFTLEdBQUcsY0FBYztNQUN2QzRKLFdBQVcsQ0FBQ3JKLFdBQVcsR0FBRyxVQUFVO01BQ3BDc0osWUFBWSxDQUFDN0osU0FBUyxHQUFHLFVBQVU7SUFDckMsQ0FBQyxNQUFNO01BQ0xxQixRQUFRLENBQUNkLFdBQVcsR0FBRyxlQUFlO01BQ3RDYyxRQUFRLENBQUNyQixTQUFTLEdBQUcsT0FBTztNQUM1QjBKLFdBQVcsQ0FBQ25KLFdBQVcsR0FBRyxVQUFVO01BQ3BDb0osWUFBWSxDQUFDM0osU0FBUyxHQUFHLFVBQVU7TUFDbkM0SixXQUFXLENBQUNySixXQUFXLEdBQUcsVUFBVTtNQUNwQ3NKLFlBQVksQ0FBQzdKLFNBQVMsR0FBRyxjQUFjO0lBQ3pDO0VBQ0YsQ0FBQztFQUNEd0IsZ0JBQWdCQSxDQUFBLEVBQUc7SUFDakIsTUFBTXNJLEtBQUssR0FBR3JLLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0lBQ3hELE1BQU1xSyxXQUFXLEdBQUcvQyxXQUFXLENBQUN0RyxPQUFPLENBQUNrQixlQUFlLENBQUMsQ0FBQztJQUN6RGtJLEtBQUssQ0FBQ3ZKLFdBQVcsR0FBSSxlQUFjd0osV0FBWSxFQUFDO0lBQ2hELE1BQU1DLEtBQUssR0FBR3ZLLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0lBQ3hELE1BQU11SyxXQUFXLEdBQUdqRCxXQUFXLENBQUNyRyxPQUFPLENBQUNpQixlQUFlLENBQUMsQ0FBQztJQUN6RG9JLEtBQUssQ0FBQ3pKLFdBQVcsR0FBSSxlQUFjMEosV0FBWSxFQUFDO0VBQ2xELENBQUM7RUFDRHBJLFdBQVdBLENBQUNDLE1BQU0sRUFBRTtJQUNsQixNQUFNQyxLQUFLLEdBQUd0QyxRQUFRLENBQUN1QyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7SUFDaEQsTUFBTUUsTUFBTSxHQUFHb0MsS0FBSyxJQUFJO01BQ3RCQSxLQUFLLENBQUNDLFlBQVksQ0FBQ0MsT0FBTyxDQUN4QixrQkFBa0IsRUFDbEJDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO1FBQUU1RixNQUFNLEVBQUV3RixLQUFLLENBQUNLLGFBQWEsQ0FBQ0MsUUFBUSxDQUFDOUYsTUFBTTtRQUFFK0YsRUFBRSxFQUFFUCxLQUFLLENBQUNLLGFBQWEsQ0FBQ0U7TUFBRyxDQUFDLENBQzVGLENBQUM7SUFDSCxDQUFDO0lBQ0Q5QyxLQUFLLENBQUNuQyxPQUFPLENBQUNxQyxJQUFJLElBQUk7TUFDcEJBLElBQUksQ0FBQ3BCLGdCQUFnQixDQUFDLFdBQVcsRUFBRXFCLE1BQU0sQ0FBQztNQUMxQ0QsSUFBSSxDQUFDRSxTQUFTLEdBQUcsSUFBSTtNQUNyQkYsSUFBSSxDQUFDRyxLQUFLLENBQUNDLE9BQU8sR0FBRyxHQUFHO0lBQzFCLENBQUMsQ0FBQztJQUVGLE1BQU02SCxhQUFhLEdBQUcsU0FBQUEsQ0FBQSxFQUFZO01BQ2hDLE1BQU1wRixPQUFPLEdBQUdyRixRQUFRLENBQUN1QyxnQkFBZ0IsQ0FBQywyQkFBMkIsQ0FBQztNQUN0RSxNQUFNZ0QsTUFBTSxHQUFHVixLQUFLLElBQUk7UUFDdEJBLEtBQUssQ0FBQ1MsY0FBYyxDQUFDLENBQUM7UUFDdEIsTUFBTUUsSUFBSSxHQUFHWCxLQUFLLENBQUNDLFlBQVksQ0FBQ1csT0FBTyxDQUFDLGtCQUFrQixDQUFDO1FBQzNELE1BQU1DLE1BQU0sR0FBR1YsSUFBSSxDQUFDVyxLQUFLLENBQUNILElBQUksQ0FBQztRQUMvQixNQUFNO1VBQUVuRztRQUFPLENBQUMsR0FBR3FHLE1BQU07UUFDekIsTUFBTW5HLElBQUksR0FBR1MsUUFBUSxDQUFDQyxhQUFhLENBQUMsYUFBYSxDQUFDO1FBQ2xELE1BQU0yRixNQUFNLEdBQUdmLEtBQUssQ0FBQ0ssYUFBYSxDQUFDYixVQUFVO1FBQzdDLE1BQU13QixhQUFhLEdBQUdoQixLQUFLLENBQUNLLGFBQWE7UUFDekMsTUFBTVksTUFBTSxHQUFHcEYsS0FBSyxDQUFDcUYsU0FBUyxDQUFDQyxPQUFPLENBQUNDLElBQUksQ0FBQ0wsTUFBTSxDQUFDVCxRQUFRLEVBQUVVLGFBQWEsQ0FBQztRQUMzRSxNQUFNSyxNQUFNLEdBQUd4RixLQUFLLENBQUNxRixTQUFTLENBQUNDLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDMUcsSUFBSSxDQUFDNEYsUUFBUSxFQUFFUyxNQUFNLENBQUM7UUFDbEUsTUFBTTtVQUFFaEc7UUFBVSxDQUFDLEdBQUcySCxXQUFXO1FBQ2pDLE1BQU1wQixVQUFVLEdBQUc5RCxNQUFNLENBQUNsQixPQUFPLENBQUMsQ0FBQztRQUNuQyxNQUFNdUosT0FBTyxHQUFJLFlBQVk7VUFDM0IsTUFBTTNCLEtBQUssR0FBRyxFQUFFO1VBQ2hCLE1BQU1DLGdCQUFnQixHQUFHLEVBQUU7VUFFM0JELEtBQUssQ0FBQ0QsSUFBSSxDQUFDM0MsVUFBVSxDQUFDRCxNQUFNLENBQUMsQ0FBQ0osTUFBTSxDQUFDLENBQUM7VUFDdEMsSUFBSWxHLFNBQVMsS0FBSyxZQUFZLEVBQUU7WUFDOUIsS0FBSyxJQUFJSixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdILE1BQU0sRUFBRUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtjQUNsQ3VKLEtBQUssQ0FBQ0QsSUFBSSxDQUFDM0MsVUFBVSxDQUFDRCxNQUFNLEdBQUcxRyxDQUFDLENBQUMsQ0FBQ3NHLE1BQU0sQ0FBQyxDQUFDO1lBQzVDO1VBQ0YsQ0FBQyxNQUFNO1lBQ0wsS0FBSyxJQUFJdEcsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHSCxNQUFNLEVBQUVHLENBQUMsSUFBSSxDQUFDLEVBQUU7Y0FDbEN1SixLQUFLLENBQUNELElBQUksQ0FBQzNDLFVBQVUsQ0FBQ0QsTUFBTSxDQUFDLENBQUNKLE1BQU0sR0FBR3RHLENBQUMsQ0FBQyxDQUFDO1lBQzVDO1VBQ0Y7VUFFQSxLQUFLLElBQUlBLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRUEsQ0FBQyxJQUFJSCxNQUFNLEVBQUVHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDcEMsTUFBTXlKLEVBQUUsR0FBRy9DLE1BQU0sSUFBSXRHLFNBQVMsS0FBSyxZQUFZLEdBQUdKLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEQsTUFBTTBKLEVBQUUsR0FBR3BELE1BQU0sSUFBSWxHLFNBQVMsS0FBSyxZQUFZLEdBQUcsQ0FBQyxHQUFHSixDQUFDLENBQUM7WUFDeEQsTUFBTTJKLEVBQUUsR0FBR2pELE1BQU0sSUFBSXRHLFNBQVMsS0FBSyxZQUFZLEdBQUdKLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6RCxNQUFNNEosRUFBRSxHQUFHdEQsTUFBTSxJQUFJbEcsU0FBUyxLQUFLLFlBQVksR0FBRyxDQUFDLENBQUMsR0FBR0osQ0FBQyxDQUFDO1lBQ3pELE1BQU02SixFQUFFLEdBQUduRCxNQUFNLElBQUl0RyxTQUFTLEtBQUssWUFBWSxHQUFHSixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hELE1BQU04SixFQUFFLEdBQUd4RCxNQUFNLElBQUlsRyxTQUFTLEtBQUssWUFBWSxHQUFHLENBQUMsR0FBR0osQ0FBQyxDQUFDO1lBRXhELElBQUl5SixFQUFFLElBQUksQ0FBQyxJQUFJQSxFQUFFLEdBQUc5QyxVQUFVLENBQUM5RyxNQUFNLElBQUk2SixFQUFFLElBQUksQ0FBQyxJQUFJQSxFQUFFLEdBQUcvQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM5RyxNQUFNLEVBQUU7Y0FDN0UySixnQkFBZ0IsQ0FBQ0YsSUFBSSxDQUFDM0MsVUFBVSxDQUFDOEMsRUFBRSxDQUFDLENBQUNDLEVBQUUsQ0FBQyxDQUFDO1lBQzNDO1lBQ0EsSUFBSUMsRUFBRSxJQUFJLENBQUMsSUFBSUEsRUFBRSxHQUFHaEQsVUFBVSxDQUFDOUcsTUFBTSxJQUFJK0osRUFBRSxJQUFJLENBQUMsSUFBSUEsRUFBRSxHQUFHakQsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDOUcsTUFBTSxFQUFFO2NBQzdFMkosZ0JBQWdCLENBQUNGLElBQUksQ0FBQzNDLFVBQVUsQ0FBQ2dELEVBQUUsQ0FBQyxDQUFDQyxFQUFFLENBQUMsQ0FBQztZQUMzQztZQUNBLElBQUlDLEVBQUUsSUFBSSxDQUFDLElBQUlBLEVBQUUsR0FBR2xELFVBQVUsQ0FBQzlHLE1BQU0sSUFBSWlLLEVBQUUsSUFBSSxDQUFDLElBQUlBLEVBQUUsR0FBR25ELFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzlHLE1BQU0sRUFBRTtjQUM3RTJKLGdCQUFnQixDQUFDRixJQUFJLENBQUMzQyxVQUFVLENBQUNrRCxFQUFFLENBQUMsQ0FBQ0MsRUFBRSxDQUFDLENBQUM7WUFDM0M7VUFDRjtVQUVBLE1BQU1DLEtBQUssR0FBR1IsS0FBSyxDQUFDUyxLQUFLLENBQUMvSSxNQUFNLElBQUlBLE1BQU0sS0FBSyxJQUFJLENBQUM7VUFDcEQsTUFBTWdKLGdCQUFnQixHQUFHVCxnQkFBZ0IsQ0FBQ1EsS0FBSyxDQUFDL0ksTUFBTSxJQUFJQSxNQUFNLEtBQUssSUFBSSxDQUFDO1VBRTFFLE9BQU84SSxLQUFLLElBQUlFLGdCQUFnQjtRQUNsQyxDQUFDLENBQUUsQ0FBQztRQUVKLElBQUlpQixPQUFPLEtBQUssS0FBSyxFQUFFO1VBQ3JCO1FBQ0Y7UUFDQXJJLE1BQU0sQ0FBQ2dFLFNBQVMsQ0FBQyxDQUFDSCxNQUFNLEVBQUVKLE1BQU0sQ0FBQyxFQUFFekcsTUFBTSxFQUFFTyxTQUFTLENBQUM7UUFDckQySCxXQUFXLENBQUMxSCxZQUFZLENBQUN3QyxNQUFNLENBQUNsQixPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztRQUNoRCxNQUFNbUYsV0FBVyxHQUFHdEcsUUFBUSxDQUFDdUcsY0FBYyxDQUFDYixNQUFNLENBQUNOLEVBQUUsQ0FBQztRQUN0RGtCLFdBQVcsQ0FBQ0UsbUJBQW1CLENBQUMsV0FBVyxFQUFFL0QsTUFBTSxDQUFDO1FBQ3BENkQsV0FBVyxDQUFDNUQsU0FBUyxHQUFHLEtBQUs7UUFDN0I0RCxXQUFXLENBQUMzRCxLQUFLLENBQUNDLE9BQU8sR0FBRyxHQUFHO1FBQy9CNkgsYUFBYSxDQUFDLENBQUM7TUFDakIsQ0FBQztNQUNEcEYsT0FBTyxDQUFDbEYsT0FBTyxDQUFDTSxNQUFNLElBQUk7UUFDeEJBLE1BQU0sQ0FBQ1csZ0JBQWdCLENBQUMsVUFBVSxFQUFFeUQsS0FBSyxJQUFJO1VBQzNDQSxLQUFLLENBQUNTLGNBQWMsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQztRQUNGN0UsTUFBTSxDQUFDVyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUVtRSxNQUFNLENBQUM7TUFDekMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNEa0YsYUFBYSxDQUFDLENBQUM7RUFDakIsQ0FBQztFQUNEOUMscUJBQXFCQSxDQUFBLEVBQUc7SUFDdEIsTUFBTWdELGNBQWMsR0FBRzNLLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLHFCQUFxQixDQUFDO0lBQ3BFMEssY0FBYyxDQUFDN0osV0FBVyxHQUFHLE1BQU07SUFDbkMsTUFBTThKLFdBQVcsR0FBRzVLLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLG1CQUFtQixDQUFDO0lBQy9EMkssV0FBVyxDQUFDOUosV0FBVyxHQUFHLDZCQUE2QjtFQUN6RCxDQUFDO0VBQ0RrQyxrQkFBa0JBLENBQUMvQixPQUFPLEVBQUVDLE9BQU8sRUFBRTtJQUNuQ3FHLFdBQVcsQ0FBQzFILFlBQVksQ0FBQ29CLE9BQU8sQ0FBQ0UsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDakQsTUFBTThCLFdBQVcsR0FBR2pELFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLGNBQWMsQ0FBQztJQUMxRGdELFdBQVcsQ0FBQ0MsU0FBUyxDQUFDLENBQUM7SUFDdkJxRSxXQUFXLENBQUNuRixXQUFXLENBQUNuQixPQUFPLENBQUM7SUFDaENzRyxXQUFXLENBQUNwRSxpQkFBaUIsQ0FBQ2xDLE9BQU8sRUFBRUMsT0FBTyxDQUFDO0VBQ2pELENBQUM7RUFDRGlDLGlCQUFpQkEsQ0FBQ2xDLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0lBQ2xDLE1BQU1vQyxjQUFjLEdBQUd0RCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztJQUNwRSxNQUFNc0QsV0FBVyxHQUFHRCxjQUFjLENBQUNjLFNBQVMsQ0FBQyxJQUFJLENBQUM7SUFDbERkLGNBQWMsQ0FBQ2UsVUFBVSxDQUFDQyxZQUFZLENBQUNmLFdBQVcsRUFBRUQsY0FBYyxDQUFDO0lBQ25FQyxXQUFXLENBQUNuQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtNQUMxQyxNQUFNNkIsV0FBVyxHQUFHakQsUUFBUSxDQUFDQyxhQUFhLENBQUMsY0FBYyxDQUFDO01BQzFELE1BQU1xQyxLQUFLLEdBQUd0QyxRQUFRLENBQUN1QyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7TUFDaEQsSUFBSW9DLFFBQVE7TUFDWnJDLEtBQUssQ0FBQ25DLE9BQU8sQ0FBQ3FDLElBQUksSUFBSTtRQUNwQixJQUFJQSxJQUFJLENBQUNFLFNBQVMsS0FBSyxJQUFJLEVBQUVpQyxRQUFRLEdBQUcsS0FBSztNQUMvQyxDQUFDLENBQUM7TUFDRixJQUFJQSxRQUFRLEtBQUssS0FBSyxFQUFFO01BQ3hCLElBQUksSUFBSSxDQUFDK0UsYUFBYSxLQUFLLENBQUMsRUFBRTtRQUM1QixNQUFNa0IsV0FBVyxHQUFHNUssUUFBUSxDQUFDQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7UUFDL0QySyxXQUFXLENBQUM5SixXQUFXLEdBQUcsNkJBQTZCO1FBQ3ZEeUMsV0FBVyxDQUFDekMsV0FBVyxHQUFHLE9BQU87UUFDakMsSUFBSSxDQUFDNEksYUFBYSxHQUFHLENBQUM7UUFDdEIsSUFBSSxDQUFDMUcsa0JBQWtCLENBQUM5QixPQUFPLEVBQUVELE9BQU8sQ0FBQztRQUN6QztNQUNGO01BQ0FnQyxXQUFXLENBQUMyQixLQUFLLENBQUMsQ0FBQztNQUNuQjJDLFdBQVcsQ0FBQzFILFlBQVksQ0FBQ3FCLE9BQU8sQ0FBQ0MsT0FBTyxDQUFDLENBQUMsQ0FBQztNQUMzQ29HLFdBQVcsQ0FBQ3ZHLGlCQUFpQixDQUFDRSxPQUFPLEVBQUVELE9BQU8sQ0FBQztJQUNqRCxDQUFDLENBQUM7SUFFRixNQUFNeUMsY0FBYyxHQUFHMUQsUUFBUSxDQUFDQyxhQUFhLENBQUMsWUFBWSxDQUFDO0lBQzNELE1BQU0wRCxXQUFXLEdBQUdELGNBQWMsQ0FBQ1UsU0FBUyxDQUFDLElBQUksQ0FBQztJQUNsRFYsY0FBYyxDQUFDVyxVQUFVLENBQUNDLFlBQVksQ0FBQ1gsV0FBVyxFQUFFRCxjQUFjLENBQUM7SUFDbkVDLFdBQVcsQ0FBQ3ZDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO01BQzFDLE1BQU1tRCxRQUFRLEdBQUd2RSxRQUFRLENBQUNDLGFBQWEsQ0FBQyxhQUFhLENBQUM7TUFDdEQsTUFBTXFDLEtBQUssR0FBR3RDLFFBQVEsQ0FBQ3VDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztNQUNoRCxJQUFJLElBQUksQ0FBQzNDLFNBQVMsS0FBSyxZQUFZLEVBQUU7UUFDbkMyRSxRQUFRLENBQUNDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUNsQ25DLEtBQUssQ0FBQ25DLE9BQU8sQ0FBQ3FDLElBQUksSUFBSTtVQUNwQkEsSUFBSSxDQUFDZ0MsU0FBUyxDQUFDQyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ2hDLENBQUMsQ0FBQztRQUNGLElBQUksQ0FBQzdFLFNBQVMsR0FBRyxVQUFVO01BQzdCLENBQUMsTUFBTTtRQUNMMkUsUUFBUSxDQUFDQyxTQUFTLENBQUNFLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDckNwQyxLQUFLLENBQUNuQyxPQUFPLENBQUNxQyxJQUFJLElBQUk7VUFDcEJBLElBQUksQ0FBQ2dDLFNBQVMsQ0FBQ0UsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxDQUFDLENBQUM7UUFDRixJQUFJLENBQUM5RSxTQUFTLEdBQUcsWUFBWTtNQUMvQjtJQUNGLENBQUMsQ0FBQztJQUVGLE1BQU1pRSxTQUFTLEdBQUc3RCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDbkQsTUFBTTZELE1BQU0sR0FBR0QsU0FBUyxDQUFDTyxTQUFTLENBQUMsSUFBSSxDQUFDO0lBQ3hDUCxTQUFTLENBQUNRLFVBQVUsQ0FBQ0MsWUFBWSxDQUFDUixNQUFNLEVBQUVELFNBQVMsQ0FBQztJQUNwREMsTUFBTSxDQUFDMUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07TUFDckNILE9BQU8sQ0FBQytDLFNBQVMsQ0FBQyxDQUFDO01BQ25CL0MsT0FBTyxDQUFDZ0QsZUFBZSxDQUFDLENBQUMsQ0FBQztNQUMxQmhELE9BQU8sQ0FBQ2dELGVBQWUsQ0FBQyxDQUFDLENBQUM7TUFDMUJoRCxPQUFPLENBQUNnRCxlQUFlLENBQUMsQ0FBQyxDQUFDO01BQzFCaEQsT0FBTyxDQUFDZ0QsZUFBZSxDQUFDLENBQUMsQ0FBQztNQUMxQmhELE9BQU8sQ0FBQ2dELGVBQWUsQ0FBQyxDQUFDLENBQUM7TUFDMUJzRCxXQUFXLENBQUMxSCxZQUFZLENBQUNvQixPQUFPLENBQUNFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO01BQ2pELE1BQU1tQixLQUFLLEdBQUd0QyxRQUFRLENBQUN1QyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7TUFDaERELEtBQUssQ0FBQ25DLE9BQU8sQ0FBQ3FDLElBQUksSUFBSTtRQUNwQixNQUFNMEIsT0FBTyxHQUFHMUIsSUFBSTtRQUNwQixNQUFNMkIsT0FBTyxHQUFHRCxPQUFPLENBQUNFLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDdkNGLE9BQU8sQ0FBQ0csVUFBVSxDQUFDQyxZQUFZLENBQUNILE9BQU8sRUFBRUQsT0FBTyxDQUFDO1FBQ2pEQyxPQUFPLENBQUN6QixTQUFTLEdBQUcsS0FBSztRQUN6QnlCLE9BQU8sQ0FBQ3hCLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLEdBQUc7TUFDN0IsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0VBQ0osQ0FBQztFQUNEOEUsZUFBZUEsQ0FBQSxFQUFHO0lBQ2hCLElBQUksQ0FBQ3pHLE9BQU8sR0FBRyxJQUFJO0lBQ25CLElBQUksQ0FBQ0MsT0FBTyxHQUFHLElBQUk7SUFDbkIsSUFBSSxDQUFDd0ksYUFBYSxHQUFHLENBQUM7SUFDdEIsSUFBSSxDQUFDOUosU0FBUyxHQUFHLFlBQVk7RUFDL0I7QUFDRixDQUFDO0FBRUQsK0RBQWUySCxXQUFXOzs7Ozs7Ozs7Ozs7QUNqVVU7QUFFcEMsTUFBTUQsTUFBTSxHQUFHLFNBQUFBLENBQVUwQyxNQUFNLEVBQUU7RUFDL0IsTUFBTWEsU0FBUyxHQUFHN0Msc0RBQVMsQ0FBQyxDQUFDO0VBRTdCLE1BQU1sQixPQUFPLEdBQUcsU0FBQUEsQ0FBQSxFQUFZO0lBQzFCLE9BQU8rRCxTQUFTLENBQUMvRCxPQUFPLENBQUMsQ0FBQztFQUM1QixDQUFDO0VBRUQsTUFBTWdFLEdBQUcsR0FBRyxTQUFBQSxDQUFBLEVBQVk7SUFDdEIsT0FBTyxPQUFPO0VBQ2hCLENBQUM7RUFFRCxNQUFNekUsU0FBUyxHQUFHLFNBQUFBLENBQVV2RyxLQUFLLEVBQUVULE1BQU0sRUFBRU8sU0FBUyxFQUFFO0lBQ3BEaUwsU0FBUyxDQUFDeEUsU0FBUyxDQUFDdkcsS0FBSyxFQUFFVCxNQUFNLEVBQUVPLFNBQVMsQ0FBQztFQUMvQyxDQUFDO0VBRUQsTUFBTXFFLGVBQWUsR0FBRyxTQUFBQSxDQUFVNUUsTUFBTSxFQUFFO0lBQ3hDd0wsU0FBUyxDQUFDNUcsZUFBZSxDQUFDNUUsTUFBTSxDQUFDO0VBQ25DLENBQUM7RUFFRCxNQUFNOEIsT0FBTyxHQUFHLFNBQUFBLENBQUEsRUFBWTtJQUMxQixPQUFPMEosU0FBUyxDQUFDMUosT0FBTyxDQUFDLENBQUM7RUFDNUIsQ0FBQztFQUVELE1BQU02QyxTQUFTLEdBQUcsU0FBQUEsQ0FBQSxFQUFZO0lBQzVCNkcsU0FBUyxDQUFDN0csU0FBUyxDQUFDLENBQUM7RUFDdkIsQ0FBQztFQUVELE1BQU03QixlQUFlLEdBQUcsU0FBQUEsQ0FBQSxFQUFZO0lBQ2xDLE9BQU8wSSxTQUFTLENBQUMxSSxlQUFlLENBQUMsQ0FBQztFQUNwQyxDQUFDO0VBRUQsTUFBTXNHLFVBQVUsR0FBRyxTQUFBQSxDQUFVTixDQUFDLEVBQUVDLENBQUMsRUFBRTtJQUNqQyxPQUFPeUMsU0FBUyxDQUFDcEMsVUFBVSxDQUFDTixDQUFDLEVBQUVDLENBQUMsQ0FBQztFQUNuQyxDQUFDO0VBRUQsTUFBTXZCLE1BQU0sR0FBRyxTQUFBQSxDQUFVeEUsTUFBTSxFQUFFOEYsQ0FBQyxFQUFFQyxDQUFDLEVBQUU7SUFDckMsTUFBTXhCLEdBQUcsR0FBR3ZFLE1BQU0sQ0FBQ29HLFVBQVUsQ0FBQ04sQ0FBQyxFQUFFQyxDQUFDLENBQUM7SUFDbkMsSUFBSS9GLE1BQU0sQ0FBQ3lFLE9BQU8sQ0FBQyxDQUFDLEVBQUU7TUFDcEIsT0FBT2dFLEdBQUcsQ0FBQyxDQUFDO0lBQ2Q7SUFDQSxPQUFPbEUsR0FBRztFQUNaLENBQUM7RUFFRCxNQUFNSSxZQUFZLEdBQUcsU0FBQUEsQ0FBVTNFLE1BQU0sRUFBRTtJQUNyQyxJQUFJOEYsQ0FBQztJQUNMLElBQUlDLENBQUM7SUFDTCxHQUFHO01BQ0RELENBQUMsR0FBR0csSUFBSSxDQUFDRSxLQUFLLENBQUNGLElBQUksQ0FBQ3hFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ2xDc0UsQ0FBQyxHQUFHRSxJQUFJLENBQUNFLEtBQUssQ0FBQ0YsSUFBSSxDQUFDeEUsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDcEMsQ0FBQyxRQUFRLE9BQU96QixNQUFNLENBQUNsQixPQUFPLENBQUMsQ0FBQyxDQUFDZ0gsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSTFILEtBQUssQ0FBQ0MsT0FBTyxDQUFDMEIsTUFBTSxDQUFDbEIsT0FBTyxDQUFDLENBQUMsQ0FBQ2dILENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUMsQ0FBQztJQUM1RixPQUFPdkIsTUFBTSxDQUFDeEUsTUFBTSxFQUFFOEYsQ0FBQyxFQUFFQyxDQUFDLENBQUM7RUFDN0IsQ0FBQztFQUVELE9BQU87SUFDTDRCLE1BQU07SUFDTmxELE9BQU87SUFDUFQsU0FBUztJQUNUbEYsT0FBTztJQUNQc0gsVUFBVTtJQUNWNUIsTUFBTTtJQUNOaUUsR0FBRztJQUNIOUQsWUFBWTtJQUNaN0UsZUFBZTtJQUNmOEIsZUFBZTtJQUNmRDtFQUNGLENBQUM7QUFDSCxDQUFDO0FBRUQsK0RBQWVzRCxNQUFNOzs7Ozs7Ozs7OztBQ3RFckIsTUFBTVMsSUFBSSxHQUFHLFNBQVNnRCxVQUFVQSxDQUFDQyxVQUFVLEVBQUU7RUFDM0MsTUFBTTNMLE1BQU0sR0FBRzJMLFVBQVU7RUFDekIsSUFBSUMsSUFBSSxHQUFHLENBQUM7RUFDWixNQUFNdEMsTUFBTSxHQUFHLFNBQUFBLENBQUEsRUFBWTtJQUN6QnNDLElBQUksSUFBSSxDQUFDO0lBQ1QsT0FBT0EsSUFBSTtFQUNiLENBQUM7RUFDRCxNQUFNcEssTUFBTSxHQUFHLFNBQUFBLENBQUEsRUFBWTtJQUN6QixJQUFJb0ssSUFBSSxLQUFLNUwsTUFBTSxFQUFFLE9BQU8sSUFBSTtJQUNoQyxPQUFPLEtBQUs7RUFDZCxDQUFDO0VBQ0QsT0FBTztJQUFFQSxNQUFNO0lBQUVzSixNQUFNO0lBQUU5SDtFQUFPLENBQUM7QUFDbkMsQ0FBQztBQUVELCtEQUFla0gsSUFBSTs7Ozs7Ozs7Ozs7Ozs7O0FDZG5CO0FBQzBHO0FBQ2pCO0FBQ3pGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0Y7QUFDQSxrRUFBa0UsMkJBQTJCLElBQUksVUFBVSxZQUFZLGFBQWEsR0FBRyxZQUFZLG1CQUFtQixzQ0FBc0MsbURBQW1ELEdBQUcsd0NBQXdDLGlCQUFpQixrQkFBa0IsR0FBRyx1Q0FBdUMsZ0JBQWdCLEdBQUcsaUNBQWlDLDRCQUE0QixHQUFHLGdCQUFnQixrQkFBa0IsR0FBRyxRQUFRLDJCQUEyQixHQUFHLGtDQUFrQywyQ0FBMkMsbUJBQW1CLEdBQUcsWUFBWSw0Q0FBNEMsR0FBRyxlQUFlLHFCQUFxQixZQUFZLFVBQVUsZ0JBQWdCLHNCQUFzQiwwQkFBMEIsWUFBWSxjQUFjLGdCQUFnQiwwQkFBMEIsZUFBZSxrQkFBa0IsR0FBRyxrQkFBa0IsZUFBZSxrQkFBa0IseUNBQXlDLEdBQUcsd0JBQXdCLHVDQUF1QyxHQUFHLDJCQUEyQix3QkFBd0IscUJBQXFCLGtCQUFrQiwwQkFBMEIsMEJBQTBCLHNCQUFzQiw2QkFBNkIsc0JBQXNCLHVCQUF1Qix3QkFBd0Isc0JBQXNCLEdBQUcsVUFBVSx3QkFBd0IsbUJBQW1CLDRCQUE0Qix1QkFBdUIsR0FBRyxXQUFXLHNCQUFzQixtQkFBbUIseUJBQXlCLHdDQUF3QyxhQUFhLEdBQUcsT0FBTyx1QkFBdUIsc0JBQXNCLEdBQUcsU0FBUyxzQ0FBc0MsYUFBYSxtQkFBbUIsNEJBQTRCLHlCQUF5QixjQUFjLHNCQUFzQixHQUFHLFdBQVcsd0JBQXdCLHlDQUF5Qyw4QkFBOEIsc0JBQXNCLHlCQUF5QixHQUFHLGdCQUFnQiw0QkFBNEIsdUNBQXVDLEdBQUcsb0JBQW9CLG1CQUFtQix5QkFBeUIsNkJBQTZCLGVBQWUsR0FBRyxhQUFhLGtCQUFrQiw0QkFBNEIsR0FBRyxvQkFBb0IsbUJBQW1CLDRCQUE0QixHQUFHLGVBQWUsbUJBQW1CLHlCQUF5QixjQUFjLEdBQUcsbUJBQW1CLG1CQUFtQiw0QkFBNEIsdUJBQXVCLHNCQUFzQix5QkFBeUIsR0FBRyxxQkFBcUIsaUJBQWlCLHdCQUF3QixtQkFBbUIseUJBQXlCLDZCQUE2QixHQUFHLFdBQVcsbUJBQW1CLHVCQUF1QixrQkFBa0IsMkNBQTJDLHdCQUF3QixHQUFHLG1CQUFtQixtQkFBbUIsaUJBQWlCLDBCQUEwQix1QkFBdUIsNkJBQTZCLEdBQUcscUJBQXFCLGdCQUFnQix3QkFBd0IsR0FBRyxVQUFVLG1CQUFtQiw0QkFBNEIsZ0JBQWdCLGtCQUFrQixHQUFHLFlBQVksMkNBQTJDLDJDQUEyQyxpQkFBaUIsaUJBQWlCLDRDQUE0QyxHQUFHLG1DQUFtQyx3Q0FBd0Msc0JBQXNCLEdBQUcsaUJBQWlCLHVDQUF1Qyw4Q0FBOEMsd0JBQXdCLEdBQUcsa0JBQWtCLG1CQUFtQiwyQkFBMkIscUJBQXFCLEdBQUcsaUJBQWlCLHVDQUF1Qyw4Q0FBOEMsbUJBQW1CLDJCQUEyQixxQkFBcUIsc0JBQXNCLEdBQUcsa0JBQWtCLHdDQUF3Qyw4Q0FBOEMsbUJBQW1CLDJCQUEyQixxQkFBcUIsc0JBQXNCLEdBQUcsVUFBVSxtQkFBbUIsNEJBQTRCLHlCQUF5Qix1QkFBdUIsc0JBQXNCLDhCQUE4QixHQUFHLHVCQUF1Qiw2Q0FBNkMsR0FBRyxjQUFjLDRCQUE0QixHQUFHLDJCQUEyQiwyQ0FBMkMsR0FBRyxpQkFBaUIsY0FBYyxlQUFlLHNDQUFzQyxrQkFBa0Isa0JBQWtCLHNDQUFzQyxrQkFBa0Isa0NBQWtDLHlCQUF5QixHQUFHLDBCQUEwQixpQkFBaUIsa0JBQWtCLG1CQUFtQiw0QkFBNEIseUJBQXlCLDZCQUE2QixlQUFlLEdBQUcsWUFBWSxxQkFBcUIsOEJBQThCLG1CQUFtQix5Q0FBeUMseUJBQXlCLEdBQUcsZ0JBQWdCLDRCQUE0Qix1Q0FBdUMsR0FBRyxXQUFXLHVCQUF1Qix3QkFBd0IsMkNBQTJDLGtCQUFrQixtQkFBbUIseUJBQXlCLG1CQUFtQiw0QkFBNEIsR0FBRyxpQkFBaUIsbUNBQW1DLGdDQUFnQyxHQUFHLG9CQUFvQixzQkFBc0IsdUJBQXVCLG1CQUFtQixrQkFBa0IsR0FBRyxtQ0FBbUMsY0FBYyxHQUFHLGdDQUFnQyxtQkFBbUIsY0FBYyxHQUFHLE9BQU8sdUJBQXVCLHNCQUFzQixHQUFHLGdCQUFnQixrQkFBa0IsR0FBRywyQkFBMkIseUJBQXlCLGNBQWMseUJBQXlCLEdBQUcsZ0NBQWdDLGdCQUFnQixtQkFBbUIsNEJBQTRCLGNBQWMsR0FBRyx1Q0FBdUMseUJBQXlCLGNBQWMsR0FBRyxnQ0FBZ0Msa0JBQWtCLDRCQUE0QixHQUFHLHdCQUF3QixtQkFBbUIsd0JBQXdCLEdBQUcsaUNBQWlDLDRCQUE0Qix3QkFBd0IsR0FBRyx3QkFBd0IsZ0JBQWdCLGdCQUFnQixpQkFBaUIsdUNBQXVDLDhDQUE4Qyx3QkFBd0IsR0FBRyxrQkFBa0IsZ0JBQWdCLHNCQUFzQix1QkFBdUIsd0JBQXdCLHFCQUFxQiw4QkFBOEIsd0JBQXdCLEdBQUcsdUJBQXVCLGdCQUFnQixHQUFHLGlCQUFpQix3QkFBd0IscUJBQXFCLHNCQUFzQix1QkFBdUIsc0JBQXNCLGdCQUFnQixHQUFHLHlCQUF5QixxQkFBcUIsbUJBQW1CLDJCQUEyQixHQUFHLE9BQU8sZ0ZBQWdGLFlBQVksUUFBUSxLQUFLLFVBQVUsVUFBVSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsUUFBUSxLQUFLLFVBQVUsVUFBVSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssWUFBWSxRQUFRLEtBQUssVUFBVSxPQUFPLEtBQUssWUFBWSxVQUFVLFlBQVksS0FBSyxZQUFZLGFBQWEsYUFBYSxRQUFRLEtBQUssWUFBWSxhQUFhLFFBQVEsS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsVUFBVSxZQUFZLFdBQVcsVUFBVSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksUUFBUSxLQUFLLFlBQVksT0FBTyxXQUFXLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxTQUFTLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksVUFBVSxLQUFLLFVBQVUsVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLFNBQVMsS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsUUFBUSxLQUFLLFlBQVksYUFBYSxXQUFXLFVBQVUsTUFBTSxLQUFLLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxZQUFZLFdBQVcsWUFBWSxRQUFRLEtBQUssVUFBVSxVQUFVLFlBQVksV0FBVyxNQUFNLEtBQUssWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxP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LGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBLGVBQWUsNEJBQTRCO1dBQzNDLGVBQWU7V0FDZixpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEEsOENBQThDOzs7OztXQ0E5QztXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7QUNBcUI7QUFDSztBQUUxQjFFLDZDQUFJLENBQUM4RCxVQUFVLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jcmVhdGUtZ3JpZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2V2ZW50SGFuZGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pc1Bvc2l0aW9uVmFsaWRGb3JTaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbXVsdGlwbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjcmVhdGVHcmlkID0gZnVuY3Rpb24gKG4gPSAxMCkge1xuICBjb25zdCBncmlkID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpICs9IDEpIHtcbiAgICBncmlkW2ldID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBuOyBqICs9IDEpIHtcbiAgICAgIGdyaWRbaV1bal0gPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBncmlkO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlR3JpZDtcbiIsImltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnLi9ldmVudEhhbmRsZXInO1xuXG5jb25zdCBkb20gPSB7XG4gIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICBwb3B1bGF0ZUdyaWQoZ3JpZCwgc3RhcnQgPSBmYWxzZSkge1xuICAgIGxldCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQxJyk7XG4gICAgaWYgKHN0YXJ0ID09PSB0cnVlKSB7XG4gICAgICBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICB9XG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSAnbGluZSc7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpZiAoc2xvdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGVtcHR5JztcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNsb3QpKSB7XG4gICAgICAgICAgY29uc3Qgc3VuayA9IHNsb3RbMV0uaXNTdW5rKCk7XG4gICAgICAgICAgaWYgKHN1bmsgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBoaXQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc3Vuayc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc2hpcCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gJ3dhdGVyJykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHdhdGVyJztcbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfVxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgIH0pO1xuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH0pO1xuICB9LFxuICBwb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgdGhpcy5wbGF5ZXIxID0gcGxheWVyMTtcbiAgICB0aGlzLnBsYXllcjIgPSBwbGF5ZXIyO1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDInKTtcbiAgICBjb25zdCBncmlkID0gdGhpcy5wbGF5ZXIyLmdldEdyaWQoKTtcbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmNsYXNzTmFtZSA9ICdsaW5lJztcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHNsb3QpKSB7XG4gICAgICAgICAgY29uc3Qgc3VuayA9IHNsb3RbMV0uaXNTdW5rKCk7XG4gICAgICAgICAgaWYgKHN1bmsgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBoaXQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc3Vuayc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgPT09IG51bGwgfHwgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnKSkge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGVtcHR5JztcbiAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBFdmVudEhhbmRsZXIub25TcXVhcmVDbGlja2VkKTtcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSAnd2F0ZXInKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgd2F0ZXInO1xuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgICAgfSk7XG4gICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gICAgfSk7XG4gIH0sXG4gIGRlbGF5KG1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XG4gICAgfSk7XG4gIH0sXG4gIHRvZ2dsZVR1cm4oKSB7XG4gICAgY29uc3QgZGl2VHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICBjb25zdCBjdXJyZW50VHVybiA9IGRpdlR1cm5zLnRleHRDb250ZW50LnN1YnN0cmluZyg3LCA4KTtcbiAgICBpZiAoY3VycmVudFR1cm4gPT09ICcxJykge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDIgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMgcmVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDEgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMnO1xuICAgIH1cbiAgfSxcbiAgdXBkYXRlQm9hdHNBbGl2ZShwbGF5ZXJOdW0pIHtcbiAgICBsZXQgcGFyYTtcbiAgICBsZXQgYm9hdHNBbGl2ZTtcbiAgICBpZiAocGxheWVyTnVtID09PSAxKSB7XG4gICAgICBwYXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLm9uZScpO1xuICAgICAgYm9hdHNBbGl2ZSA9IGRvbS5wbGF5ZXIxLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLnR3bycpO1xuICAgICAgYm9hdHNBbGl2ZSA9IGRvbS5wbGF5ZXIyLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIH1cbiAgICBwYXJhLnRleHRDb250ZW50ID0gYEFsaXZlIHNoaXBzOiAke2JvYXRzQWxpdmV9YDtcbiAgfSxcbiAgZHJhZ0FuZERyb3AocGxheWVyKSB7XG4gICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICBib2F0LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIEV2ZW50SGFuZGxlci5vbkRyYWcpO1xuICAgICAgYm9hdC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgYm9hdC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIH0pO1xuXG4gICAgRXZlbnRIYW5kbGVyLmFkZEdyaWRMaXN0ZW5lcnMocGxheWVyKTtcbiAgfSxcbiAgcHJlcGFyZU5ld0dhbWUoKSB7XG4gICAgY29uc3QgZGl2VHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICBkaXZUdXJucy50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMSB0dXJuJztcbiAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMnO1xuICAgIGNvbnN0IHNoaXBzQWxpdmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2hpcHMtYWxpdmUnKTtcbiAgICBzaGlwc0FsaXZlLmZvckVhY2goZGl2ID0+IHtcbiAgICAgIGRpdi50ZXh0Q29udGVudCA9ICdBbGl2ZSBzaGlwczogNSc7XG4gICAgfSk7XG4gIH0sXG4gIHNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgZG9tLnByZXBhcmVOZXdHYW1lKCk7XG4gICAgZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgY29uc3QgZGlhbG9nUGxhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMnKTtcbiAgICBkaWFsb2dQbGFjZS5zaG93TW9kYWwoKTtcbiAgICBkb20uZHJhZ0FuZERyb3AocGxheWVyMSk7XG4gICAgRXZlbnRIYW5kbGVyLmFkZEV2ZW50TGlzdGVuZXJzKHBsYXllcjEsIHBsYXllcjIpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZG9tO1xuIiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgaXNQb3NpdGlvblZhbGlkRm9yU2hpcCBmcm9tICcuL2lzUG9zaXRpb25WYWxpZEZvclNoaXAnO1xuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lJztcblxuY29uc3QgRXZlbnRIYW5kbGVyID0ge1xuICBhZGRFdmVudExpc3RlbmVycyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgdGhpcy5wbGF5ZXIxID0gcGxheWVyMTtcbiAgICB0aGlzLnBsYXllcjIgPSBwbGF5ZXIyO1xuICAgIGNvbnN0IG9sZFN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzIC5zdGFydCcpO1xuICAgIGNvbnN0IHN0YXJ0QnV0dG9uID0gRXZlbnRIYW5kbGVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKG9sZFN0YXJ0QnV0dG9uKTtcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25TdGFydENsaWNrKTtcblxuICAgIGNvbnN0IG9sZENoRGlyZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RpcmVjdGlvbicpO1xuICAgIGNvbnN0IGNoRGlyZWN0aW9uID0gRXZlbnRIYW5kbGVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKG9sZENoRGlyZWN0aW9uKTtcbiAgICBjaERpcmVjdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DaGFuZ2VEaXJlY3Rpb25DbGljayk7XG5cbiAgICBjb25zdCBvbGRSYW5kb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmFuZG9tJyk7XG4gICAgY29uc3QgcmFuZG9tID0gRXZlbnRIYW5kbGVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKG9sZFJhbmRvbSk7XG4gICAgcmFuZG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vblJhbmRvbUNsaWNrKTtcbiAgfSxcbiAgb25SYW5kb21DbGljaygpIHtcbiAgICBFdmVudEhhbmRsZXIucGxheWVyMS5lbXB0eUdyaWQoKTtcbiAgICBFdmVudEhhbmRsZXIucGxheWVyMS5wbGFjZVNoaXBSYW5kb20oNSk7XG4gICAgRXZlbnRIYW5kbGVyLnBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDQpO1xuICAgIEV2ZW50SGFuZGxlci5wbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICBFdmVudEhhbmRsZXIucGxheWVyMS5wbGFjZVNoaXBSYW5kb20oMyk7XG4gICAgRXZlbnRIYW5kbGVyLnBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDIpO1xuICAgIGRvbS5wb3B1bGF0ZUdyaWQoRXZlbnRIYW5kbGVyLnBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgIGNvbnN0IG9sZEJvYXQgPSBib2F0O1xuICAgICAgY29uc3QgbmV3Qm9hdCA9IG9sZEJvYXQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgb2xkQm9hdC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdCb2F0LCBvbGRCb2F0KTtcbiAgICAgIG5ld0JvYXQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICBuZXdCb2F0LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgfSk7XG4gIH0sXG4gIG9uQ2hhbmdlRGlyZWN0aW9uQ2xpY2soKSB7XG4gICAgY29uc3QgYm9hdERyYWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hdHMtZHJhZycpO1xuICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICBpZiAoZG9tLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBib2F0RHJhZy5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgYm9hdC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuICAgICAgfSk7XG4gICAgICBkb20uZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICB9IGVsc2Uge1xuICAgICAgYm9hdERyYWcuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKTtcbiAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgIGJvYXQuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKTtcbiAgICAgIH0pO1xuICAgICAgZG9tLmRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgICB9XG4gIH0sXG4gIG9uU3RhcnRDbGljaygpIHtcbiAgICBjb25zdCBkaWFsb2dQbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcycpO1xuICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICBsZXQgY2FuU3RhcnQ7XG4gICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgIGlmIChib2F0LmRyYWdnYWJsZSA9PT0gdHJ1ZSkgY2FuU3RhcnQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoY2FuU3RhcnQgPT09IGZhbHNlKSByZXR1cm47XG4gICAgZGlhbG9nUGxhY2UuY2xvc2UoKTtcbiAgICBkb20ucG9wdWxhdGVHcmlkKEV2ZW50SGFuZGxlci5wbGF5ZXIxLmdldEdyaWQoKSk7XG4gICAgZG9tLnBvcHVsYXRlRW5lbXlHcmlkKEV2ZW50SGFuZGxlci5wbGF5ZXIxLCBFdmVudEhhbmRsZXIucGxheWVyMik7XG4gIH0sXG4gIG9uRHJhZyhldmVudCkge1xuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsZW5ndGg6IGV2ZW50LmN1cnJlbnRUYXJnZXQuY2hpbGRyZW4ubGVuZ3RoLCBpZDogZXZlbnQuY3VycmVudFRhcmdldC5pZCB9KVxuICAgICk7XG4gIH0sXG4gIGFkZEdyaWRMaXN0ZW5lcnMocGxheWVyKSB7XG4gICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNncmlkLXBsYWNlIC5zcXVhcmUuZW1wdHknKTtcbiAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcbiAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGV2ZW50ID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBFdmVudEhhbmRsZXIub25Ecm9wKTtcbiAgICB9KTtcbiAgfSxcbiAgb25Ecm9wKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBqc29uID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICBjb25zdCBvYmplY3QgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgIGNvbnN0IHsgbGVuZ3RoIH0gPSBvYmplY3Q7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkLXBsYWNlJyk7XG4gICAgY29uc3QgY29sdW1uID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xuICAgIGNvbnN0IGNsaWNrZWRTcXVhcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIGNvbnN0IGluZGV4WSA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoY29sdW1uLmNoaWxkcmVuLCBjbGlja2VkU3F1YXJlKTtcbiAgICBjb25zdCBpbmRleFggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGdyaWQuY2hpbGRyZW4sIGNvbHVtbik7XG4gICAgY29uc3QgeyBkaXJlY3Rpb24gfSA9IGRvbTtcbiAgICBjb25zdCBwbGF5ZXJHcmlkID0gRXZlbnRIYW5kbGVyLnBsYXllci5nZXRHcmlkKCk7XG4gICAgY29uc3QgaXNWYWxpZCA9IGlzUG9zaXRpb25WYWxpZEZvclNoaXAoaW5kZXhYLCBpbmRleFksIGRpcmVjdGlvbiwgbGVuZ3RoLCBwbGF5ZXJHcmlkKTtcbiAgICBpZiAoaXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBFdmVudEhhbmRsZXIucGxheWVyLnBsYWNlU2hpcChbaW5kZXhYLCBpbmRleFldLCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gICAgZG9tLnBvcHVsYXRlR3JpZChFdmVudEhhbmRsZXIucGxheWVyLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgY29uc3QgZHJhZ2dlZEJvYXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvYmplY3QuaWQpO1xuICAgIGRyYWdnZWRCb2F0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIEV2ZW50SGFuZGxlci5vbkRyYWcpO1xuICAgIGRyYWdnZWRCb2F0LmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgIGRyYWdnZWRCb2F0LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgRXZlbnRIYW5kbGVyLmFkZEdyaWRMaXN0ZW5lcnMoRXZlbnRIYW5kbGVyLnBsYXllcik7XG4gIH0sXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzKG9sZEJ1dHRvbikge1xuICAgIGNvbnN0IGJ1dHRvbiA9IG9sZEJ1dHRvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgb2xkQnV0dG9uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGJ1dHRvbiwgb2xkQnV0dG9uKTtcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9LFxuICBvblNxdWFyZUNsaWNrZWQ6IGFzeW5jIGV2ZW50ID0+IHtcbiAgICBjb25zdCBlbmVteUdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDInKTtcbiAgICBjb25zdCBjb2x1bW4gPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgY29uc3QgY2xpY2tlZFNxdWFyZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgY29uc3QgaW5kZXhZID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb2x1bW4uY2hpbGRyZW4sIGNsaWNrZWRTcXVhcmUpO1xuICAgIGNvbnN0IGluZGV4WCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZW5lbXlHcmlkLmNoaWxkcmVuLCBjb2x1bW4pO1xuICAgIGxldCBoaXQgPSBkb20ucGxheWVyMS5hdHRhY2soZG9tLnBsYXllcjIsIGluZGV4WCwgaW5kZXhZKTtcbiAgICBkb20ucG9wdWxhdGVFbmVteUdyaWQoZG9tLnBsYXllcjEsIGRvbS5wbGF5ZXIyKTtcbiAgICBkb20udXBkYXRlQm9hdHNBbGl2ZSgyKTtcbiAgICBpZiAoZG9tLnBsYXllcjIuYWxsU3VuaygpICE9PSBmYWxzZSkgcmV0dXJuIEV2ZW50SGFuZGxlci5vbldpbigxKTtcbiAgICBpZiAoaGl0ID09PSBmYWxzZSkge1xuICAgICAgZG9tLnRvZ2dsZVR1cm4oKTtcbiAgICAgIGRvIHtcbiAgICAgICAgYXdhaXQgZG9tLmRlbGF5KDUwMCk7XG4gICAgICAgIGhpdCA9IGRvbS5wbGF5ZXIyLnJhbmRvbUF0dGFjayhkb20ucGxheWVyMSk7XG4gICAgICAgIGRvbS5wb3B1bGF0ZUdyaWQoZG9tLnBsYXllcjEuZ2V0R3JpZCgpKTtcbiAgICAgICAgZG9tLnVwZGF0ZUJvYXRzQWxpdmUoMSk7XG4gICAgICAgIGlmIChkb20ucGxheWVyMS5hbGxTdW5rKCkgIT09IGZhbHNlKSByZXR1cm4gRXZlbnRIYW5kbGVyLm9uV2luKDIpO1xuICAgICAgfSB3aGlsZSAoaGl0ICE9PSBmYWxzZSk7XG4gICAgICBkb20udG9nZ2xlVHVybigpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIG9uV2luKHBsYXllcikge1xuICAgIGNvbnN0IGRpYWxvZ1dpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW4nKTtcbiAgICBkaWFsb2dXaW4uc2hvd01vZGFsKCk7XG4gICAgY29uc3QgcmVzdGFydCA9IGRpYWxvZ1dpbi5xdWVyeVNlbGVjdG9yKCcucmVzdGFydCcpO1xuICAgIHJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBnYW1lLmNob29zZUdhbWUoKSk7XG4gICAgcmVzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGRpYWxvZ1dpbi5jbG9zZSgpO1xuICAgIH0pO1xuICAgIGNvbnN0IHR1cm5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm5zJyk7XG4gICAgdHVybnMudGV4dENvbnRlbnQgPSBgUGxheWVyICR7cGxheWVyfSB3b24hISFgO1xuICAgIGNvbnN0IHdpbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXInKTtcbiAgICB3aW5uZXIudGV4dENvbnRlbnQgPSBgUGxheWVyICR7cGxheWVyfSB3b24hISFgO1xuICAgIHdpbm5lci5jbGFzc05hbWUgPSAnd2lubmVyJztcbiAgICBpZiAocGxheWVyID09PSAyKSB7XG4gICAgICB3aW5uZXIuY2xhc3NMaXN0LmFkZCgndHdvJyk7XG4gICAgfVxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyO1xuIiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcbmltcG9ydCBtdWx0aXBsYXllciBmcm9tICcuL211bHRpcGxheWVyJztcblxuY29uc3QgZ2FtZSA9IHtcbiAgc3RhcnRHYW1lKCkge1xuICAgIGNvbnN0IHBsYXllcjEgPSBQbGF5ZXIoMSk7XG4gICAgY29uc3QgcGxheWVyMiA9IFBsYXllcigyKTtcbiAgICBwbGF5ZXIyLnBsYWNlU2hpcFJhbmRvbSg1KTtcbiAgICBwbGF5ZXIyLnBsYWNlU2hpcFJhbmRvbSg0KTtcbiAgICBwbGF5ZXIyLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICBwbGF5ZXIyLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICBwbGF5ZXIyLnBsYWNlU2hpcFJhbmRvbSgyKTtcbiAgICBkb20uc2hvd1N0YXJ0aW5nRGlhbG9nKHBsYXllcjEsIHBsYXllcjIpO1xuICB9LFxuICBzdGFydE11bHRpcGxheWVyKCkge1xuICAgIGNvbnN0IHBsYXllcjEgPSBQbGF5ZXIoMSk7XG4gICAgY29uc3QgcGxheWVyMiA9IFBsYXllcigyKTtcbiAgICBtdWx0aXBsYXllci5yZXNldEV2ZXJ5dGhpbmcoKTtcbiAgICBtdWx0aXBsYXllci5wcmVwYXJlU3RhcnRpbmdEaWFsb2coKTtcbiAgICBtdWx0aXBsYXllci5zaG93U3RhcnRpbmdEaWFsb2cocGxheWVyMSwgcGxheWVyMik7XG4gIH0sXG4gIGNob29zZUdhbWUoKSB7XG4gICAgY29uc3QgY2hvb3NlR2FtZU1vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2hvb3NlLWdhbWUnKTtcbiAgICBjaG9vc2VHYW1lTW9kZS5zaG93TW9kYWwoKTtcbiAgICBjb25zdCBwbGF5Q29tcHV0ZXIgPSBjaG9vc2VHYW1lTW9kZS5xdWVyeVNlbGVjdG9yKCcuY29tcHV0ZXInKTtcbiAgICBwbGF5Q29tcHV0ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjaG9vc2VHYW1lTW9kZS5jbG9zZSgpO1xuICAgICAgZ2FtZS5zdGFydEdhbWUoKTtcbiAgICB9KTtcbiAgICBjb25zdCBwbGF5T3RoZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubXVsdGlwbGF5ZXInKTtcbiAgICBwbGF5T3RoZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjaG9vc2VHYW1lTW9kZS5jbG9zZSgpO1xuICAgICAgZ2FtZS5zdGFydE11bHRpcGxheWVyKCk7XG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwJztcbmltcG9ydCBjcmVhdGVHcmlkIGZyb20gJy4vY3JlYXRlLWdyaWQnO1xuaW1wb3J0IGlzUG9zaXRpb25WYWxpZEZvclNoaXAgZnJvbSAnLi9pc1Bvc2l0aW9uVmFsaWRGb3JTaGlwJztcblxuY29uc3QgR2FtZWJvYXJkID0gZnVuY3Rpb24gY3JlYXRlR2FtZWJvYXJkKCkge1xuICBsZXQgZ3JpZCA9IGNyZWF0ZUdyaWQoKTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAoc3RhcnQsIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgY29uc3Qgc2hpcE9iaiA9IFNoaXAobGVuZ3RoKTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBPYmoubGVuZ3RoOyBpICs9IDEpIGdyaWRbc3RhcnRbMF1dW3N0YXJ0WzFdICsgaV0gPSBzaGlwT2JqO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBPYmoubGVuZ3RoOyBpICs9IDEpIGdyaWRbc3RhcnRbMF0gKyBpXVtzdGFydFsxXV0gPSBzaGlwT2JqO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXBSYW5kb20gPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgbGV0IHg7XG4gICAgbGV0IHk7XG4gICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcbiAgICBsZXQgZGlyZWN0aW9uO1xuICAgIGNvbnN0IG51bSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XG4gICAgaWYgKG51bSA9PT0gMCkge1xuICAgICAgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICAgIH1cbiAgICB3aGlsZSAoaXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgaXNWYWxpZCA9IGlzUG9zaXRpb25WYWxpZEZvclNoaXAoeCwgeSwgZGlyZWN0aW9uLCBsZW5ndGgsIGdyaWQpO1xuICAgIH1cbiAgICB0aGlzLnBsYWNlU2hpcChbeCwgeV0sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgfTtcblxuICBjb25zdCBlbXB0eUdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ3JpZCA9IGNyZWF0ZUdyaWQoKTtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlSGl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdyaWRbeF1beV07XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICBncmlkW3hdW3ldID0gJ3dhdGVyJztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFsdWUuYWRkSGl0KCk7XG4gICAgZ3JpZFt4XVt5XSA9IFsnaGl0JywgdmFsdWVdO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBjb25zdCBhbGxTdW5rID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgaWYgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHNsb3QpKSByZXN1bHQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgY29uc3QgY291bnRCb2F0c0FsaXZlID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGJvYXRzID0gW107XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgc2xvdCAhPT0gbnVsbCAmJlxuICAgICAgICAgIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICFBcnJheS5pc0FycmF5KHNsb3QpICYmXG4gICAgICAgICAgIWJvYXRzLmluY2x1ZGVzKHNsb3QpXG4gICAgICAgICkge1xuICAgICAgICAgIGJvYXRzLnB1c2goc2xvdCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBib2F0cy5sZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ3JpZDtcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBnZXRHcmlkLFxuICAgIGVtcHR5R3JpZCxcbiAgICBwbGFjZVNoaXAsXG4gICAgcGxhY2VTaGlwUmFuZG9tLFxuICAgIHJlY2VpdmVIaXQsXG4gICAgYWxsU3VuayxcbiAgICBjb3VudEJvYXRzQWxpdmUsXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XG4iLCJjb25zdCBpc1Bvc2l0aW9uVmFsaWRGb3JTaGlwID0gKHgsIHksIGRpcmVjdGlvbiwgbGVuZ3RoLCBncmlkKSA9PiB7XG4gIGNvbnN0IGFycmF5ID0gW107XG4gIGNvbnN0IHN1cnJvdW5kaW5nQXJyYXkgPSBbXTtcblxuICBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgJiYgeCArIGxlbmd0aCA+IGdyaWQubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcgJiYgeSArIGxlbmd0aCA+PSBncmlkWzBdLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFycmF5LnB1c2goZ3JpZFt4XVt5XSk7XG4gIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGFycmF5LnB1c2goZ3JpZFt4ICsgaV1beV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBhcnJheS5wdXNoKGdyaWRbeF1beSArIGldKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCBpID0gLTE7IGkgPD0gbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCB4MSA9IHggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMCk7XG4gICAgY29uc3QgeTEgPSB5ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gMCA6IGkpO1xuICAgIGNvbnN0IHgyID0geCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAtMSk7XG4gICAgY29uc3QgeTIgPSB5ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gLTEgOiBpKTtcbiAgICBjb25zdCB4MyA9IHggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMSk7XG4gICAgY29uc3QgeTMgPSB5ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gMSA6IGkpO1xuXG4gICAgaWYgKHgxID49IDAgJiYgeDEgPCBncmlkLmxlbmd0aCAmJiB5MSA+PSAwICYmIHkxIDwgZ3JpZFswXS5sZW5ndGgpIHtcbiAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChncmlkW3gxXVt5MV0pO1xuICAgIH1cbiAgICBpZiAoeDIgPj0gMCAmJiB4MiA8IGdyaWQubGVuZ3RoICYmIHkyID49IDAgJiYgeTIgPCBncmlkWzBdLmxlbmd0aCkge1xuICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKGdyaWRbeDJdW3kyXSk7XG4gICAgfVxuICAgIGlmICh4MyA+PSAwICYmIHgzIDwgZ3JpZC5sZW5ndGggJiYgeTMgPj0gMCAmJiB5MyA8IGdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2goZ3JpZFt4M11beTNdKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBlbXB0eSA9IGFycmF5LmV2ZXJ5KHNxdWFyZSA9PiBzcXVhcmUgPT09IG51bGwpO1xuICBjb25zdCBzdXJyb3VuZGluZ0VtcHR5ID0gc3Vycm91bmRpbmdBcnJheS5ldmVyeShzcXVhcmUgPT4gc3F1YXJlID09PSBudWxsKTtcblxuICByZXR1cm4gZW1wdHkgJiYgc3Vycm91bmRpbmdFbXB0eTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGlzUG9zaXRpb25WYWxpZEZvclNoaXA7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG5jb25zdCBtdWx0aXBsYXllciA9IHtcbiAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gIHBsYXllclBsYWNpbmc6IDEsXG4gIHBvcHVsYXRlR3JpZChncmlkLCBzdGFydCA9IGZhbHNlKSB7XG4gICAgbGV0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDEnKTtcbiAgICBpZiAoc3RhcnQgPT09IHRydWUpIHtcbiAgICAgIGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZC1wbGFjZScpO1xuICAgIH1cbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmNsYXNzTmFtZSA9ICdsaW5lJztcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGlmIChzbG90ID09PSBudWxsKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgZW1wdHknO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc2xvdCkpIHtcbiAgICAgICAgICBjb25zdCBzdW5rID0gc2xvdFsxXS5pc1N1bmsoKTtcbiAgICAgICAgICBpZiAoc3VuayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGhpdCc7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdW5rID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzdW5rJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzaGlwJztcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSAnd2F0ZXInKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgd2F0ZXInO1xuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgICAgfSk7XG4gICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gICAgfSk7XG4gIH0sXG4gIHBvcHVsYXRlRW5lbXlHcmlkKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICB0aGlzLnBsYXllcjEgPSBwbGF5ZXIxO1xuICAgIHRoaXMucGxheWVyMiA9IHBsYXllcjI7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMicpO1xuICAgIGNvbnN0IGdyaWQgPSB0aGlzLnBsYXllcjIuZ2V0R3JpZCgpO1xuICAgIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gJ2xpbmUnO1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2xvdCkpIHtcbiAgICAgICAgICBjb25zdCBzdW5rID0gc2xvdFsxXS5pc1N1bmsoKTtcbiAgICAgICAgICBpZiAoc3VuayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGhpdCc7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdW5rID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzdW5rJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gbnVsbCB8fCAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgZW1wdHknO1xuICAgICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG11bHRpcGxheWVyLnNxdWFyZUNsaWNrZWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgPT09ICd3YXRlcicpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSB3YXRlcic7XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH1cbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgICB9KTtcbiAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9KTtcbiAgfSxcbiAgc3F1YXJlQ2xpY2tlZDogYXN5bmMgZXZlbnQgPT4ge1xuICAgIGNvbnN0IGVuZW15R3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMicpO1xuICAgIGNvbnN0IGNvbHVtbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZTtcbiAgICBjb25zdCBjbGlja2VkU3F1YXJlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICBjb25zdCBpbmRleFkgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGNvbHVtbi5jaGlsZHJlbiwgY2xpY2tlZFNxdWFyZSk7XG4gICAgY29uc3QgaW5kZXhYID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChlbmVteUdyaWQuY2hpbGRyZW4sIGNvbHVtbik7XG4gICAgY29uc3QgaGl0ID0gbXVsdGlwbGF5ZXIucGxheWVyMS5hdHRhY2sobXVsdGlwbGF5ZXIucGxheWVyMiwgaW5kZXhYLCBpbmRleFkpO1xuICAgIGlmIChtdWx0aXBsYXllci5wbGF5ZXIyLmFsbFN1bmsoKSAhPT0gZmFsc2UpIHJldHVybiBtdWx0aXBsYXllci5wbGF5ZXJXb24obXVsdGlwbGF5ZXIucGxheWVyMSk7XG4gICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVFbmVteUdyaWQobXVsdGlwbGF5ZXIucGxheWVyMSwgbXVsdGlwbGF5ZXIucGxheWVyMik7XG4gICAgbXVsdGlwbGF5ZXIudXBkYXRlQm9hdHNBbGl2ZSgpO1xuICAgIGlmIChoaXQgPT09IGZhbHNlKSB7XG4gICAgICBtdWx0aXBsYXllci5zaG93V2F0ZXJEaWFsb2coKTtcbiAgICAgIG11bHRpcGxheWVyLnBvcHVsYXRlR3JpZChtdWx0aXBsYXllci5wbGF5ZXIyLmdldEdyaWQoKSk7XG4gICAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUVuZW15R3JpZChtdWx0aXBsYXllci5wbGF5ZXIyLCBtdWx0aXBsYXllci5wbGF5ZXIxKTtcbiAgICAgIG11bHRpcGxheWVyLnVwZGF0ZUJvYXRzQWxpdmUoKTtcbiAgICAgIG11bHRpcGxheWVyLnRvZ2dsZVR1cm4oKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBzaG93V2F0ZXJEaWFsb2coKSB7XG4gICAgY29uc3Qgd2F0ZXJEaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2F0ZXItZGlhbG9nJyk7XG4gICAgd2F0ZXJEaWFsb2cuc2hvd01vZGFsKCk7XG4gICAgd2F0ZXJEaWFsb2cuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgIGNvbnN0IGNsb3NlRGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNoYW5nZS10dXJuJyk7XG4gICAgY2xvc2VEaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB3YXRlckRpYWxvZy5jbG9zZSgpO1xuICAgICAgd2F0ZXJEaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIH0pO1xuICB9LFxuICBwbGF5ZXJXb24ocGxheWVyKSB7XG4gICAgY29uc3QgZGlhbG9nV2luID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbicpO1xuICAgIGRpYWxvZ1dpbi5zaG93TW9kYWwoKTtcbiAgICBjb25zdCByZXN0YXJ0ID0gZGlhbG9nV2luLnF1ZXJ5U2VsZWN0b3IoJy5yZXN0YXJ0Jyk7XG4gICAgcmVzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGdhbWUuY2hvb3NlR2FtZSgpKTtcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGlhbG9nV2luLmNsb3NlKCk7XG4gICAgfSk7XG4gICAgY29uc3QgdHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICB0dXJucy50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXIubnVtYmVyfSB3b24hISFgO1xuICAgIGNvbnN0IHdpbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXInKTtcbiAgICB3aW5uZXIudGV4dENvbnRlbnQgPSBgUGxheWVyICR7cGxheWVyLm51bWJlcn0gd29uISEhYDtcbiAgICB3aW5uZXIuY2xhc3NOYW1lID0gJ3dpbm5lcic7XG4gICAgaWYgKHBsYXllci5udW1iZXIgPT09IDIpIHtcbiAgICAgIHdpbm5lci5jbGFzc0xpc3QuYWRkKCd0d28nKTtcbiAgICB9XG4gIH0sXG4gIHRvZ2dsZVR1cm4oKSB7XG4gICAgY29uc3QgZGl2VHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICBjb25zdCBhdHRhY2tlckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXIub25lJyk7XG4gICAgY29uc3QgYXR0YWNrZXJJbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmluZm8ub25lJyk7XG4gICAgY29uc3QgZGVmZW5kb3JEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLnR3bycpO1xuICAgIGNvbnN0IGRlZmVuZG9ySW5mbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbmZvLnR3bycpO1xuICAgIGNvbnN0IGN1cnJlbnRUdXJuID0gZGl2VHVybnMudGV4dENvbnRlbnQuc3Vic3RyaW5nKDcsIDgpO1xuICAgIGlmIChjdXJyZW50VHVybiA9PT0gJzEnKSB7XG4gICAgICBkaXZUdXJucy50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMiB0dXJuJztcbiAgICAgIGRpdlR1cm5zLmNsYXNzTmFtZSA9ICd0dXJucyByZWQnO1xuICAgICAgYXR0YWNrZXJEaXYudGV4dENvbnRlbnQgPSAnUGxheWVyIDInO1xuICAgICAgYXR0YWNrZXJJbmZvLmNsYXNzTmFtZSA9ICdpbmZvIG9uZSByZWQnO1xuICAgICAgZGVmZW5kb3JEaXYudGV4dENvbnRlbnQgPSAnUGxheWVyIDEnO1xuICAgICAgZGVmZW5kb3JJbmZvLmNsYXNzTmFtZSA9ICdpbmZvIHR3byc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpdlR1cm5zLnRleHRDb250ZW50ID0gJ1BsYXllciAxIHR1cm4nO1xuICAgICAgZGl2VHVybnMuY2xhc3NOYW1lID0gJ3R1cm5zJztcbiAgICAgIGF0dGFja2VyRGl2LnRleHRDb250ZW50ID0gJ1BsYXllciAxJztcbiAgICAgIGF0dGFja2VySW5mby5jbGFzc05hbWUgPSAnaW5mbyBvbmUnO1xuICAgICAgZGVmZW5kb3JEaXYudGV4dENvbnRlbnQgPSAnUGxheWVyIDInO1xuICAgICAgZGVmZW5kb3JJbmZvLmNsYXNzTmFtZSA9ICdpbmZvIHR3byByZWQnO1xuICAgIH1cbiAgfSxcbiAgdXBkYXRlQm9hdHNBbGl2ZSgpIHtcbiAgICBjb25zdCBwYXJhMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcy1hbGl2ZS5vbmUnKTtcbiAgICBjb25zdCBib2F0c0FsaXZlMSA9IG11bHRpcGxheWVyLnBsYXllcjEuY291bnRCb2F0c0FsaXZlKCk7XG4gICAgcGFyYTEudGV4dENvbnRlbnQgPSBgQWxpdmUgc2hpcHMgJHtib2F0c0FsaXZlMX1gO1xuICAgIGNvbnN0IHBhcmEyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLnR3bycpO1xuICAgIGNvbnN0IGJvYXRzQWxpdmUyID0gbXVsdGlwbGF5ZXIucGxheWVyMi5jb3VudEJvYXRzQWxpdmUoKTtcbiAgICBwYXJhMi50ZXh0Q29udGVudCA9IGBBbGl2ZSBzaGlwcyAke2JvYXRzQWxpdmUyfWA7XG4gIH0sXG4gIGRyYWdBbmREcm9wKHBsYXllcikge1xuICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICBjb25zdCBvbkRyYWcgPSBldmVudCA9PiB7XG4gICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7IGxlbmd0aDogZXZlbnQuY3VycmVudFRhcmdldC5jaGlsZHJlbi5sZW5ndGgsIGlkOiBldmVudC5jdXJyZW50VGFyZ2V0LmlkIH0pXG4gICAgICApO1xuICAgIH07XG4gICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgIGJvYXQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0Jywgb25EcmFnKTtcbiAgICAgIGJvYXQuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICAgIGJvYXQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICB9KTtcblxuICAgIGNvbnN0IGdyaWRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2dyaWQtcGxhY2UgLnNxdWFyZS5lbXB0eScpO1xuICAgICAgY29uc3Qgb25Ecm9wID0gZXZlbnQgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBqc29uID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICAgICAgY29uc3QgeyBsZW5ndGggfSA9IG9iamVjdDtcbiAgICAgICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkLXBsYWNlJyk7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgY29uc3QgY2xpY2tlZFNxdWFyZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIGNvbnN0IGluZGV4WSA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoY29sdW1uLmNoaWxkcmVuLCBjbGlja2VkU3F1YXJlKTtcbiAgICAgICAgY29uc3QgaW5kZXhYID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChncmlkLmNoaWxkcmVuLCBjb2x1bW4pO1xuICAgICAgICBjb25zdCB7IGRpcmVjdGlvbiB9ID0gbXVsdGlwbGF5ZXI7XG4gICAgICAgIGNvbnN0IHBsYXllckdyaWQgPSBwbGF5ZXIuZ2V0R3JpZCgpO1xuICAgICAgICBjb25zdCBpc0VtcHR5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICAgIGNvbnN0IHN1cnJvdW5kaW5nQXJyYXkgPSBbXTtcblxuICAgICAgICAgIGFycmF5LnB1c2gocGxheWVyR3JpZFtpbmRleFhdW2luZGV4WV0pO1xuICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICBhcnJheS5wdXNoKHBsYXllckdyaWRbaW5kZXhYICsgaV1baW5kZXhZXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgYXJyYXkucHVzaChwbGF5ZXJHcmlkW2luZGV4WF1baW5kZXhZICsgaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAobGV0IGkgPSAtMTsgaSA8PSBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgeDEgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMCk7XG4gICAgICAgICAgICBjb25zdCB5MSA9IGluZGV4WSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDAgOiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHgyID0gaW5kZXhYICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IC0xKTtcbiAgICAgICAgICAgIGNvbnN0IHkyID0gaW5kZXhZICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gLTEgOiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHgzID0gaW5kZXhYICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IDEpO1xuICAgICAgICAgICAgY29uc3QgeTMgPSBpbmRleFkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAxIDogaSk7XG5cbiAgICAgICAgICAgIGlmICh4MSA+PSAwICYmIHgxIDwgcGxheWVyR3JpZC5sZW5ndGggJiYgeTEgPj0gMCAmJiB5MSA8IHBsYXllckdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChwbGF5ZXJHcmlkW3gxXVt5MV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHgyID49IDAgJiYgeDIgPCBwbGF5ZXJHcmlkLmxlbmd0aCAmJiB5MiA+PSAwICYmIHkyIDwgcGxheWVyR3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKHBsYXllckdyaWRbeDJdW3kyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeDMgPj0gMCAmJiB4MyA8IHBsYXllckdyaWQubGVuZ3RoICYmIHkzID49IDAgJiYgeTMgPCBwbGF5ZXJHcmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2gocGxheWVyR3JpZFt4M11beTNdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBlbXB0eSA9IGFycmF5LmV2ZXJ5KHNxdWFyZSA9PiBzcXVhcmUgPT09IG51bGwpO1xuICAgICAgICAgIGNvbnN0IHN1cnJvdW5kaW5nRW1wdHkgPSBzdXJyb3VuZGluZ0FycmF5LmV2ZXJ5KHNxdWFyZSA9PiBzcXVhcmUgPT09IG51bGwpO1xuXG4gICAgICAgICAgcmV0dXJuIGVtcHR5ICYmIHN1cnJvdW5kaW5nRW1wdHk7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgaWYgKGlzRW1wdHkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBsYXllci5wbGFjZVNoaXAoW2luZGV4WCwgaW5kZXhZXSwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xuICAgICAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUdyaWQocGxheWVyLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGRyYWdnZWRCb2F0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2JqZWN0LmlkKTtcbiAgICAgICAgZHJhZ2dlZEJvYXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0Jywgb25EcmFnKTtcbiAgICAgICAgZHJhZ2dlZEJvYXQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgIGRyYWdnZWRCb2F0LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgICAgIGdyaWRMaXN0ZW5lcnMoKTtcbiAgICAgIH07XG4gICAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZXZlbnQgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIG9uRHJvcCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdyaWRMaXN0ZW5lcnMoKTtcbiAgfSxcbiAgcHJlcGFyZVN0YXJ0aW5nRGlhbG9nKCkge1xuICAgIGNvbnN0IHN0YXJ0aW5nQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzIC5zdGFydCcpO1xuICAgIHN0YXJ0aW5nQnV0dG9uLnRleHRDb250ZW50ID0gJ05leHQnO1xuICAgIGNvbnN0IGRpYWxvZ1RpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZy1oZWFkZXIgaDInKTtcbiAgICBkaWFsb2dUaXRsZS50ZXh0Q29udGVudCA9ICdQbGFjZSB5b3VyIHNoaXBzIENhcHRhaW4gMSEnO1xuICB9LFxuICBzaG93U3RhcnRpbmdEaWFsb2cocGxheWVyMSwgcGxheWVyMikge1xuICAgIG11bHRpcGxheWVyLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgY29uc3QgZGlhbG9nUGxhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMnKTtcbiAgICBkaWFsb2dQbGFjZS5zaG93TW9kYWwoKTtcbiAgICBtdWx0aXBsYXllci5kcmFnQW5kRHJvcChwbGF5ZXIxKTtcbiAgICBtdWx0aXBsYXllci5hZGRFdmVudExpc3RlbmVycyhwbGF5ZXIxLCBwbGF5ZXIyKTtcbiAgfSxcbiAgYWRkRXZlbnRMaXN0ZW5lcnMocGxheWVyMSwgcGxheWVyMikge1xuICAgIGNvbnN0IG9sZFN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzIC5zdGFydCcpO1xuICAgIGNvbnN0IHN0YXJ0QnV0dG9uID0gb2xkU3RhcnRCdXR0b24uY2xvbmVOb2RlKHRydWUpO1xuICAgIG9sZFN0YXJ0QnV0dG9uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHN0YXJ0QnV0dG9uLCBvbGRTdGFydEJ1dHRvbik7XG4gICAgc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBkaWFsb2dQbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcycpO1xuICAgICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgICAgbGV0IGNhblN0YXJ0O1xuICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgaWYgKGJvYXQuZHJhZ2dhYmxlID09PSB0cnVlKSBjYW5TdGFydCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgICBpZiAoY2FuU3RhcnQgPT09IGZhbHNlKSByZXR1cm47XG4gICAgICBpZiAodGhpcy5wbGF5ZXJQbGFjaW5nID09PSAxKSB7XG4gICAgICAgIGNvbnN0IGRpYWxvZ1RpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZy1oZWFkZXIgaDInKTtcbiAgICAgICAgZGlhbG9nVGl0bGUudGV4dENvbnRlbnQgPSAnUGxhY2UgeW91ciBzaGlwcyBDYXB0YWluIDIhJztcbiAgICAgICAgc3RhcnRCdXR0b24udGV4dENvbnRlbnQgPSAnU3RhcnQnO1xuICAgICAgICB0aGlzLnBsYXllclBsYWNpbmcgPSAyO1xuICAgICAgICB0aGlzLnNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIyLCBwbGF5ZXIxKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZGlhbG9nUGxhY2UuY2xvc2UoKTtcbiAgICAgIG11bHRpcGxheWVyLnBvcHVsYXRlR3JpZChwbGF5ZXIyLmdldEdyaWQoKSk7XG4gICAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIyLCBwbGF5ZXIxKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IG9sZENoRGlyZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RpcmVjdGlvbicpO1xuICAgIGNvbnN0IGNoRGlyZWN0aW9uID0gb2xkQ2hEaXJlY3Rpb24uY2xvbmVOb2RlKHRydWUpO1xuICAgIG9sZENoRGlyZWN0aW9uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNoRGlyZWN0aW9uLCBvbGRDaERpcmVjdGlvbik7XG4gICAgY2hEaXJlY3Rpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBib2F0RHJhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2F0cy1kcmFnJyk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBib2F0RHJhZy5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuICAgICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICAgIGJvYXQuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvYXREcmFnLmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgICAgYm9hdC5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBvbGRSYW5kb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmFuZG9tJyk7XG4gICAgY29uc3QgcmFuZG9tID0gb2xkUmFuZG9tLmNsb25lTm9kZSh0cnVlKTtcbiAgICBvbGRSYW5kb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocmFuZG9tLCBvbGRSYW5kb20pO1xuICAgIHJhbmRvbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHBsYXllcjEuZW1wdHlHcmlkKCk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSg1KTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDQpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oMyk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDIpO1xuICAgICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgIGNvbnN0IG9sZEJvYXQgPSBib2F0O1xuICAgICAgICBjb25zdCBuZXdCb2F0ID0gb2xkQm9hdC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIG9sZEJvYXQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Qm9hdCwgb2xkQm9hdCk7XG4gICAgICAgIG5ld0JvYXQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgIG5ld0JvYXQuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICByZXNldEV2ZXJ5dGhpbmcoKSB7XG4gICAgdGhpcy5wbGF5ZXIxID0gbnVsbDtcbiAgICB0aGlzLnBsYXllcjIgPSBudWxsO1xuICAgIHRoaXMucGxheWVyUGxhY2luZyA9IDE7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBtdWx0aXBsYXllcjtcbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSAnLi9nYW1lYm9hcmQnO1xuXG5jb25zdCBQbGF5ZXIgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IEdhbWVib2FyZCgpO1xuXG4gIGNvbnN0IGFsbFN1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5hbGxTdW5rKCk7XG4gIH07XG5cbiAgY29uc3Qgd2luID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnSSB3b24nO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IGZ1bmN0aW9uIChzdGFydCwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwKHN0YXJ0LCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwUmFuZG9tID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgIGdhbWVib2FyZC5wbGFjZVNoaXBSYW5kb20obGVuZ3RoKTtcbiAgfTtcblxuICBjb25zdCBnZXRHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnYW1lYm9hcmQuZ2V0R3JpZCgpO1xuICB9O1xuXG4gIGNvbnN0IGVtcHR5R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBnYW1lYm9hcmQuZW1wdHlHcmlkKCk7XG4gIH07XG5cbiAgY29uc3QgY291bnRCb2F0c0FsaXZlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnYW1lYm9hcmQuY291bnRCb2F0c0FsaXZlKCk7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUhpdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5yZWNlaXZlSGl0KHgsIHkpO1xuICB9O1xuXG4gIGNvbnN0IGF0dGFjayA9IGZ1bmN0aW9uIChwbGF5ZXIsIHgsIHkpIHtcbiAgICBjb25zdCBoaXQgPSBwbGF5ZXIucmVjZWl2ZUhpdCh4LCB5KTtcbiAgICBpZiAocGxheWVyLmFsbFN1bmsoKSkge1xuICAgICAgcmV0dXJuIHdpbigpO1xuICAgIH1cbiAgICByZXR1cm4gaGl0O1xuICB9O1xuXG4gIGNvbnN0IHJhbmRvbUF0dGFjayA9IGZ1bmN0aW9uIChwbGF5ZXIpIHtcbiAgICBsZXQgeDtcbiAgICBsZXQgeTtcbiAgICBkbyB7XG4gICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICB9IHdoaWxlICh0eXBlb2YgcGxheWVyLmdldEdyaWQoKVt4XVt5XSAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShwbGF5ZXIuZ2V0R3JpZCgpW3hdW3ldKSk7XG4gICAgcmV0dXJuIGF0dGFjayhwbGF5ZXIsIHgsIHkpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbnVtYmVyLFxuICAgIGFsbFN1bmssXG4gICAgcGxhY2VTaGlwLFxuICAgIGdldEdyaWQsXG4gICAgcmVjZWl2ZUhpdCxcbiAgICBhdHRhY2ssXG4gICAgd2luLFxuICAgIHJhbmRvbUF0dGFjayxcbiAgICBjb3VudEJvYXRzQWxpdmUsXG4gICAgcGxhY2VTaGlwUmFuZG9tLFxuICAgIGVtcHR5R3JpZCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNvbnN0IFNoaXAgPSBmdW5jdGlvbiBjcmVhdGVTaGlwKHNoaXBMZW5ndGgpIHtcbiAgY29uc3QgbGVuZ3RoID0gc2hpcExlbmd0aDtcbiAgbGV0IGhpdHMgPSAwO1xuICBjb25zdCBhZGRIaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaGl0cyArPSAxO1xuICAgIHJldHVybiBoaXRzO1xuICB9O1xuICBjb25zdCBpc1N1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGhpdHMgPT09IGxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICByZXR1cm4geyBsZW5ndGgsIGFkZEhpdCwgaXNTdW5rIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuIH1cXG4gXFxuXFxuKiB7XFxubWFyZ2luOiAwO1xcbnBhZGRpbmc6IDA7XFxufVxcblxcblxcbmJvZHkge1xcbmxpbmUtaGVpZ2h0OiAxLjU7XFxuLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxuZm9udC1mYW1pbHk6ICdSdWJpayBCdWJibGVzJywgQ291cmllciwgbW9ub3NwYWNlO1xcbn1cXG5cXG5cXG5pbWcsIHBpY3R1cmUsIHZpZGVvLCBjYW52YXMsIHN2ZyB7XFxuZGlzcGxheTogYmxvY2s7XFxubWF4LXdpZHRoOiAxMDAlO1xcbn1cXG5cXG5cXG5pbnB1dCwgYnV0dG9uLCB0ZXh0YXJlYSwgc2VsZWN0IHtcXG5mb250OiBpbmhlcml0O1xcbn1cXG5cXG5cXG5wLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXG5vdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xcbn1cXG5cXG5cXG5idXR0b24sIGF7XFxuY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5cXG5he1xcbiAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuXFxuXFxuXFxuLyogRm9vdGVyICovXFxuXFxuXFxuaHRtbCB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5wb3NpdGlvbjogcmVsYXRpdmU7XFxubWluLWhlaWdodDogMTAwJTtcXG59XFxuXFxuXFxuYm9keSB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5tYXJnaW4tYm90dG9tOiA0OHB4O1xcbn1cXG5cXG5cXG4uZm9vdGVyIHtcXG5wb3NpdGlvbjogYWJzb2x1dGU7XFxuYm90dG9tOiAwO1xcbmxlZnQ6IDA7XFxuZGlzcGxheTogZmxleDtcXG5hbGlnbi1pdGVtczogY2VudGVyO1xcbmp1c3RpZnktY29udGVudDogY2VudGVyO1xcbmdhcDogMTBweDtcXG53aWR0aDogMTAwJTtcXG5wYWRkaW5nOiAxMHB4O1xcbmJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDE4cHg7XFxufVxcblxcblxcbi5mYS1naXRodWIge1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDIycHg7XFxudHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxufVxcblxcblxcbi5mYS1naXRodWI6aG92ZXIge1xcbnRyYW5zZm9ybTogcm90YXRlKDM2MGRlZykgc2NhbGUoMS4yKTtcXG59XFxuXFxuLyogU3R5bGluZyAqL1xcblxcbjpyb290e1xcbiAtLWhlYWRlci1iZzogIzNEM0QzRDtcXG4gLS1tYWluLWJnOiMzMDMwMzA7XFxuIC0tdGV4dDojRkZGRkZGO1xcbiAtLWdyaWQtYm9yZGVyczojMDAyQzY2O1xcbiAtLWdyaWQtc3F1YXJlczojMjM4OURBO1xcbiAtLW15LWJvYXRzOiM4MDgwODA7XFxuIC0tbXktYm9hdHMtYm9yZGVyOiM0NjQ2NDY7XFxuIC0tc2hpcC1oaXQ6I0Y4MjcyNztcXG4gLS1zaGlwLXN1bms6I0QxNjA2MDtcXG4gLS1ncmVlbi10ZXh0OiMyQkM1NTc7XFxuIC0tcmVkLXRleHQ6I0UyMzYzNjtcXG59XFxuXFxuYm9keSB7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuaGVhZGVye1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhlYWRlci1iZyk7XFxuICAgZmxleDogMTtcXG59XFxuXFxuaDF7XFxuICAgZm9udC1zaXplOiAyLjVyZW07XFxuICAgZm9udC13ZWlnaHQ6IDUwMDtcXG59XFxuXFxubWFpbntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWJnKTtcXG4gICBmbGV4OiA3O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGdhcDogNXZoO1xcbiAgIHBhZGRpbmc6IDV2aCAwcHg7XFxufVxcblxcbi50dXJuc3tcXG4gICBwYWRkaW5nOiAxMHB4IDMwcHg7XFxuICAgYm9yZGVyOiAycHggcmlkZ2UgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogMnJlbTs7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnR1cm5zLnJlZCB7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5ncmlkLWNvbnRhaW5lcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgZ2FwOiAxMHZ3O1xcbn1cXG5cXG4ud3JhcHBlcntcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLm51bWJlci13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnktd3JhcHBlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1cHg7XFxufVxcblxcbi55LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBtaW4taGVpZ2h0OiA3MHZoO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi55LWNvb3JkaW5hdGVzIHB7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmdyaWQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYXNwZWN0LXJhdGlvOiAxLzE7XFxuICAgaGVpZ2h0OiA3MHZoO1xcbiAgIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgYm9yZGVyLXJhZGl1czogNnB4O1xcbn1cXG5cXG4ueC1jb29yZGluYXRlc3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiA3MHZoO1xcbiAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4ueC1jb29yZGluYXRlcyBwe1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ubGluZXtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgd2lkdGg6IDEwJTtcXG4gICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbi5zcXVhcmV7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1ncmlkLWJvcmRlcnMpO1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAlO1xcbiAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xcbn1cXG5cXG5cXG5cXG4jZ3JpZDIgLnNxdWFyZS5lbXB0eTpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTEwLCA4LCAxOTQpO1xcbiAgIGN1cnNvcjpjcm9zc2hhaXI7XFxufVxcblxcbi5zcXVhcmUuc2hpcHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcblxcbi5zcXVhcmUud2F0ZXJ7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAycmVtO1xcbn1cXG5cXG4uc3F1YXJlLmhpdCB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1oaXQpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5zcXVhcmUuc3VuayB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1zdW5rKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBmb250LXdlaWdodDogODAwO1xcbn1cXG5cXG4uaW5mb3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8gLnNoaXBzLWFsaXZle1xcbiAgIGJvcmRlci10b3A6IDJweCBzb2xpZCB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8ucmVke1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5pbmZvLnJlZCAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuXFxuXFxuXFxuZGlhbG9ne1xcbiAgIHRvcDogNTAlO1xcbiAgIGxlZnQ6IDUwJTtcXG4gICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gICBoZWlnaHQ6IDUwdmg7XFxuICAgd2lkdGg6IDEwMHZ3O1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIG9wYWNpdHk6IDAuOTtcXG4gICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZXNtb2tlO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcblxcblxcbi5kaWFsb2ctY29udGFpbmVye1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdmg7XFxufVxcblxcbi53aW5uZXJ7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBwYWRkaW5nOiAyMHB4O1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcbi53aW5uZXIudHdve1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5idXR0b257XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxuICAgYm9yZGVyOiBub25lO1xcbiAgIG91dGxpbmU6IG5vbmU7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICBwYWRkaW5nOiAxMHB4O1xcbiAgIHRyYW5zaXRpb246IDAuM3MgZWFzZSA7XFxufVxcblxcbmJ1dHRvbjpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG59XFxuXFxuXFxuLnBsYWNlLXNoaXBzIHtcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIG9wYWNpdHk6IDAuOTg7XFxuICAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmRpYWxvZy1jb250YWluZXJ7XFxuICAgZ2FwOiAydmg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuZGlhbG9nLWhlYWRlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGdhcDogOHZ3O1xcbn1cXG5cXG5oMntcXG4gICBmb250LXNpemU6IDEuOHJlbTtcXG4gICBmb250LXdlaWdodDogNDAwO1xcbn1cXG5cXG4jZGlyZWN0aW9uIHtcXG4gICBwYWRkaW5nOiA1cHg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAud3JhcHBlciB7XFxuICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICBnYXA6IDV2dztcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXRzLWRyYWcge1xcbiAgIHdpZHRoOiAyMHY7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGdhcDogM3ZoO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXRzLWRyYWcudmVydGljYWwge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgZ2FwOiAzdnc7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdC13cmFwcGVyIHtcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0IHtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiBmaXQtY29udGVudDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0LnZlcnRpY2FsIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXG59XFxuXFxuLmJvYXQgLmJvYXQtc3F1YXJlIHtcXG4gICBmbGV4OiBub25lO1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXktYm9hdHMpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgYm9yZGVyLXJhZGl1czogOHB4O1xcbn1cXG5cXG4ud2F0ZXItZGlhbG9ne1xcbiAgIG9wYWNpdHk6IDA7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZm9udC1zaXplOiA0cmVtO1xcbiAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC41cztcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi53YXRlci1kaWFsb2cuc2hvd3tcXG4gICBvcGFjaXR5OiAxO1xcbn1cXG5cXG4uY2hvb3NlLWdhbWV7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogNHJlbTtcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIG1pbi13aWR0aDogMTAwdnc7XFxuICAgb3BhY2l0eTogMTtcXG59XFxuXFxuLmNob29zZS1nYW1lIGJ1dHRvbiB7XFxuICAgZm9udC1zaXplOiAycmVtO1xcbiAgIHBhZGRpbmc6IDIwcHg7XFxuICAgYm9yZGVyLXJhZGl1czogMi41cmVtO1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0Usc0JBQXNCO0NBQ3ZCOzs7QUFHRDtBQUNBLFNBQVM7QUFDVCxVQUFVO0FBQ1Y7OztBQUdBO0FBQ0EsZ0JBQWdCO0FBQ2hCLG1DQUFtQztBQUNuQyxnREFBZ0Q7QUFDaEQ7OztBQUdBO0FBQ0EsY0FBYztBQUNkLGVBQWU7QUFDZjs7O0FBR0E7QUFDQSxhQUFhO0FBQ2I7OztBQUdBO0FBQ0EseUJBQXlCO0FBQ3pCOzs7QUFHQTtBQUNBLGVBQWU7QUFDZjs7O0FBR0E7R0FDRyxxQkFBcUI7QUFDeEI7Ozs7O0FBS0EsV0FBVzs7O0FBR1g7QUFDQSxtQkFBbUI7QUFDbkIsa0JBQWtCO0FBQ2xCLGdCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQSxtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25COzs7QUFHQTtBQUNBLGtCQUFrQjtBQUNsQixTQUFTO0FBQ1QsT0FBTztBQUNQLGFBQWE7QUFDYixtQkFBbUI7QUFDbkIsdUJBQXVCO0FBQ3ZCLFNBQVM7QUFDVCxXQUFXO0FBQ1gsYUFBYTtBQUNiLHVCQUF1QjtBQUN2QixZQUFZO0FBQ1osZUFBZTtBQUNmOzs7QUFHQTtBQUNBLFlBQVk7QUFDWixlQUFlO0FBQ2Ysc0NBQXNDO0FBQ3RDOzs7QUFHQTtBQUNBLG9DQUFvQztBQUNwQzs7QUFFQSxZQUFZOztBQUVaO0NBQ0Msb0JBQW9CO0NBQ3BCLGlCQUFpQjtDQUNqQixjQUFjO0NBQ2Qsc0JBQXNCO0NBQ3RCLHNCQUFzQjtDQUN0QixrQkFBa0I7Q0FDbEIseUJBQXlCO0NBQ3pCLGtCQUFrQjtDQUNsQixtQkFBbUI7Q0FDbkIsb0JBQW9CO0NBQ3BCLGtCQUFrQjtBQUNuQjs7QUFFQTtHQUNHLGtCQUFrQjtHQUNsQixhQUFhO0dBQ2Is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QixhQUFhO0dBQ2Isc0JBQXNCO0FBQ3pCOztBQUVBO0dBQ0csNkJBQTZCO0dBQzdCLDBCQUEwQjtBQUM3Qjs7O0FBR0E7R0FDRyxnQkFBZ0I7R0FDaEIsaUJBQWlCO0dBQ2pCLGFBQWE7R0FDYixZQUFZO0FBQ2Y7O0FBRUE7R0FDRyxRQUFRO0FBQ1g7O0FBRUE7R0FDRyxhQUFhO0dBQ2IsUUFBUTtBQUNYOztBQUVBO0dBQ0csaUJBQWlCO0dBQ2pCLGdCQUFnQjtBQUNuQjs7QUFFQTtHQUNHLFlBQVk7QUFDZjs7QUFFQTtHQUNHLG1CQUFtQjtHQUNuQixRQUFRO0dBQ1IsbUJBQW1CO0FBQ3RCOzs7QUFHQTtHQUNHLFVBQVU7R0FDVixhQUFhO0dBQ2Isc0JBQXNCO0dBQ3RCLFFBQVE7QUFDWDs7QUFFQTtHQUNHLG1CQUFtQjtHQUNuQixRQUFRO0FBQ1g7O0FBRUE7R0FDRyxZQUFZO0dBQ1osc0JBQXNCO0FBQ3pCOztBQUVBO0dBQ0csYUFBYTtHQUNiLGtCQUFrQjtBQUNyQjs7QUFFQTtHQUNHLHNCQUFzQjtHQUN0QixrQkFBa0I7QUFDckI7O0FBRUE7R0FDRyxVQUFVO0dBQ1YsVUFBVTtHQUNWLFdBQVc7R0FDWCxpQ0FBaUM7R0FDakMsd0NBQXdDO0dBQ3hDLGtCQUFrQjtBQUNyQjs7QUFFQTtHQUNHLFVBQVU7R0FDVixnQkFBZ0I7R0FDaEIsaUJBQWlCO0dBQ2pCLGtCQUFrQjtHQUNsQixlQUFlO0dBQ2Ysd0JBQXdCO0dBQ3hCLGtCQUFrQjtBQUNyQjs7QUFFQTtHQUNHLFVBQVU7QUFDYjs7QUFFQTtHQUNHLGtCQUFrQjtHQUNsQixlQUFlO0dBQ2YsZ0JBQWdCO0dBQ2hCLGlCQUFpQjtHQUNqQixnQkFBZ0I7R0FDaEIsVUFBVTtBQUNiOztBQUVBO0dBQ0csZUFBZTtHQUNmLGFBQWE7R0FDYixxQkFBcUI7QUFDeEJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiwgKjo6YmVmb3JlLCAqOjphZnRlciB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiB9XFxuIFxcblxcbioge1xcbm1hcmdpbjogMDtcXG5wYWRkaW5nOiAwO1xcbn1cXG5cXG5cXG5ib2R5IHtcXG5saW5lLWhlaWdodDogMS41O1xcbi13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xcbmZvbnQtZmFtaWx5OiAnUnViaWsgQnViYmxlcycsIENvdXJpZXIsIG1vbm9zcGFjZTtcXG59XFxuXFxuXFxuaW1nLCBwaWN0dXJlLCB2aWRlbywgY2FudmFzLCBzdmcge1xcbmRpc3BsYXk6IGJsb2NrO1xcbm1heC13aWR0aDogMTAwJTtcXG59XFxuXFxuXFxuaW5wdXQsIGJ1dHRvbiwgdGV4dGFyZWEsIHNlbGVjdCB7XFxuZm9udDogaW5oZXJpdDtcXG59XFxuXFxuXFxucCwgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XFxub3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcXG59XFxuXFxuXFxuYnV0dG9uLCBhe1xcbmN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuXFxuYXtcXG4gICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxufVxcblxcblxcblxcblxcbi8qIEZvb3RlciAqL1xcblxcblxcbmh0bWwge1xcbi8qIGZvb3RlciBzdXBwb3J0ICovXFxucG9zaXRpb246IHJlbGF0aXZlO1xcbm1pbi1oZWlnaHQ6IDEwMCU7XFxufVxcblxcblxcbmJvZHkge1xcbi8qIGZvb3RlciBzdXBwb3J0ICovXFxubWFyZ2luLWJvdHRvbTogNDhweDtcXG59XFxuXFxuXFxuLmZvb3RlciB7XFxucG9zaXRpb246IGFic29sdXRlO1xcbmJvdHRvbTogMDtcXG5sZWZ0OiAwO1xcbmRpc3BsYXk6IGZsZXg7XFxuYWxpZ24taXRlbXM6IGNlbnRlcjtcXG5qdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5nYXA6IDEwcHg7XFxud2lkdGg6IDEwMCU7XFxucGFkZGluZzogMTBweDtcXG5iYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG5jb2xvcjogd2hpdGU7XFxuZm9udC1zaXplOiAxOHB4O1xcbn1cXG5cXG5cXG4uZmEtZ2l0aHViIHtcXG5jb2xvcjogd2hpdGU7XFxuZm9udC1zaXplOiAyMnB4O1xcbnRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG5cXG4uZmEtZ2l0aHViOmhvdmVyIHtcXG50cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpIHNjYWxlKDEuMik7XFxufVxcblxcbi8qIFN0eWxpbmcgKi9cXG5cXG46cm9vdHtcXG4gLS1oZWFkZXItYmc6ICMzRDNEM0Q7XFxuIC0tbWFpbi1iZzojMzAzMDMwO1xcbiAtLXRleHQ6I0ZGRkZGRjtcXG4gLS1ncmlkLWJvcmRlcnM6IzAwMkM2NjtcXG4gLS1ncmlkLXNxdWFyZXM6IzIzODlEQTtcXG4gLS1teS1ib2F0czojODA4MDgwO1xcbiAtLW15LWJvYXRzLWJvcmRlcjojNDY0NjQ2O1xcbiAtLXNoaXAtaGl0OiNGODI3Mjc7XFxuIC0tc2hpcC1zdW5rOiNEMTYwNjA7XFxuIC0tZ3JlZW4tdGV4dDojMkJDNTU3O1xcbiAtLXJlZC10ZXh0OiNFMjM2MzY7XFxufVxcblxcbmJvZHkge1xcbiAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgbWluLWhlaWdodDogMTAwdmg7XFxufVxcblxcbmhlYWRlcntcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1oZWFkZXItYmcpO1xcbiAgIGZsZXg6IDE7XFxufVxcblxcbmgxe1xcbiAgIGZvbnQtc2l6ZTogMi41cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA1MDA7XFxufVxcblxcbm1haW57XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1iZyk7XFxuICAgZmxleDogNztcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBnYXA6IDV2aDtcXG4gICBwYWRkaW5nOiA1dmggMHB4O1xcbn1cXG5cXG4udHVybnN7XFxuICAgcGFkZGluZzogMTBweCAzMHB4O1xcbiAgIGJvcmRlcjogMnB4IHJpZGdlIHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBmb250LXNpemU6IDJyZW07O1xcbiAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcblxcbi50dXJucy5yZWQge1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxuICAgYm9yZGVyOiAycHggcmlkZ2UgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG4uZ3JpZC1jb250YWluZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgIGdhcDogMTB2dztcXG59XFxuXFxuLndyYXBwZXJ7XFxuICAgZGlzcGxheTpmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbi5udW1iZXItd3JhcHBlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbi55LXdyYXBwZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGdhcDogNXB4O1xcbn1cXG5cXG4ueS1jb29yZGluYXRlc3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgbWluLWhlaWdodDogNzB2aDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4ueS1jb29yZGluYXRlcyBwe1xcbiAgIGhlaWdodDogN3ZoO1xcbiAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5ncmlkIHtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFzcGVjdC1yYXRpbzogMS8xO1xcbiAgIGhlaWdodDogNzB2aDtcXG4gICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1ncmlkLWJvcmRlcnMpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDZweDtcXG59XFxuXFxuLngtY29vcmRpbmF0ZXN7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICB3aWR0aDogNzB2aDtcXG4gICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLngtY29vcmRpbmF0ZXMgcHtcXG4gICB3aWR0aDogN3ZoO1xcbiAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLmxpbmV7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIHdpZHRoOiAxMCU7XFxuICAgaGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG4uc3F1YXJle1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JpZC1ib3JkZXJzKTtcXG4gICB3aWR0aDogMTAwJTtcXG4gICBoZWlnaHQ6IDEwJTtcXG4gICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMgZWFzZTtcXG59XFxuXFxuXFxuXFxuI2dyaWQyIC5zcXVhcmUuZW1wdHk6aG92ZXJ7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDExMCwgOCwgMTk0KTtcXG4gICBjdXJzb3I6Y3Jvc3NoYWlyO1xcbn1cXG5cXG4uc3F1YXJlLnNoaXB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXktYm9hdHMpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgYm9yZGVyLXJhZGl1czogOHB4O1xcbn1cXG5cXG4uc3F1YXJlLndhdGVye1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogMnJlbTtcXG59XFxuXFxuLnNxdWFyZS5oaXQge1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoaXAtaGl0KTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBmb250LXdlaWdodDogODAwO1xcbn1cXG5cXG4uc3F1YXJlLnN1bmsge1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoaXAtc3Vuayk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgZm9udC13ZWlnaHQ6IDgwMDtcXG59XFxuXFxuLmluZm97XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgZm9udC13ZWlnaHQ6IDUwMDtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxufVxcblxcbi5pbmZvIC5zaGlwcy1hbGl2ZXtcXG4gICBib3JkZXItdG9wOiAycHggc29saWQgdmFyKC0tZ3JlZW4tdGV4dCk7XFxufVxcblxcbi5pbmZvLnJlZHtcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG4uaW5mby5yZWQgLnNoaXBzLWFsaXZle1xcbiAgIGJvcmRlci10b3A6IDJweCBzb2xpZCB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcblxcblxcblxcbmRpYWxvZ3tcXG4gICB0b3A6IDUwJTtcXG4gICBsZWZ0OiA1MCU7XFxuICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICAgaGVpZ2h0OiA1MHZoO1xcbiAgIHdpZHRoOiAxMDB2dztcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWJnKTtcXG4gICBvcGFjaXR5OiAwLjk7XFxuICAgYm9yZGVyOiAxcHggc29saWQgd2hpdGVzbW9rZTtcXG4gICBib3JkZXItcmFkaXVzOiAxMnB4O1xcbn1cXG5cXG5cXG5cXG4uZGlhbG9nLWNvbnRhaW5lcntcXG4gICB3aWR0aDogMTAwJTtcXG4gICBoZWlnaHQ6IDEwMCU7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgZ2FwOiAxMHZoO1xcbn1cXG5cXG4ud2lubmVye1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgcGFkZGluZzogMjBweDtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBib3JkZXItcmFkaXVzOiAxMnB4O1xcbn1cXG5cXG4ud2lubmVyLnR3b3tcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuYnV0dG9ue1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbiAgIGJvcmRlcjogbm9uZTtcXG4gICBvdXRsaW5lOiBub25lO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgcGFkZGluZzogMTBweDtcXG4gICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgO1xcbn1cXG5cXG5idXR0b246aG92ZXJ7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxufVxcblxcblxcbi5wbGFjZS1zaGlwcyB7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICBvcGFjaXR5OiAwLjk4O1xcbiAgIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5kaWFsb2ctY29udGFpbmVye1xcbiAgIGdhcDogMnZoO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmRpYWxvZy1oZWFkZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBnYXA6IDh2dztcXG59XFxuXFxuaDJ7XFxuICAgZm9udC1zaXplOiAxLjhyZW07XFxuICAgZm9udC13ZWlnaHQ6IDQwMDtcXG59XFxuXFxuI2RpcmVjdGlvbiB7XFxuICAgcGFkZGluZzogNXB4O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLndyYXBwZXIge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgZ2FwOiA1dnc7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0cy1kcmFnIHtcXG4gICB3aWR0aDogMjB2O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBnYXA6IDN2aDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0cy1kcmFnLnZlcnRpY2FsIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgIGdhcDogM3Z3O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQtd3JhcHBlciB7XFxuICAgZGlzcGxheTpmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICB3aWR0aDogZml0LWNvbnRlbnQ7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdC52ZXJ0aWNhbCB7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxufVxcblxcbi5ib2F0IC5ib2F0LXNxdWFyZSB7XFxuICAgZmxleDogbm9uZTtcXG4gICB3aWR0aDogN3ZoO1xcbiAgIGhlaWdodDogN3ZoO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XFxuXFxuLndhdGVyLWRpYWxvZ3tcXG4gICBvcGFjaXR5OiAwO1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgbWluLWhlaWdodDogMTAwdmg7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogNHJlbTtcXG4gICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXM7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ud2F0ZXItZGlhbG9nLnNob3d7XFxuICAgb3BhY2l0eTogMTtcXG59XFxuXFxuLmNob29zZS1nYW1le1xcbiAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBmb250LXNpemU6IDRyZW07XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICBtaW4td2lkdGg6IDEwMHZ3O1xcbiAgIG9wYWNpdHk6IDE7XFxufVxcblxcbi5jaG9vc2UtZ2FtZSBidXR0b24ge1xcbiAgIGZvbnQtc2l6ZTogMnJlbTtcXG4gICBwYWRkaW5nOiAyMHB4O1xcbiAgIGJvcmRlci1yYWRpdXM6IDIuNXJlbTtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCAnLi9zdHlsZS5jc3MnO1xuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lJztcblxuZ2FtZS5jaG9vc2VHYW1lKCk7XG4iXSwibmFtZXMiOlsiY3JlYXRlR3JpZCIsIm4iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJncmlkIiwiaSIsImoiLCJFdmVudEhhbmRsZXIiLCJkb20iLCJkaXJlY3Rpb24iLCJwb3B1bGF0ZUdyaWQiLCJzdGFydCIsImdyaWRDb250YWluZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lckhUTUwiLCJmb3JFYWNoIiwibGluZSIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJzbG90Iiwic3F1YXJlIiwiQXJyYXkiLCJpc0FycmF5Iiwic3VuayIsImlzU3VuayIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJwb3B1bGF0ZUVuZW15R3JpZCIsInBsYXllcjEiLCJwbGF5ZXIyIiwiZ2V0R3JpZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvblNxdWFyZUNsaWNrZWQiLCJkZWxheSIsIm1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwidG9nZ2xlVHVybiIsImRpdlR1cm5zIiwiY3VycmVudFR1cm4iLCJzdWJzdHJpbmciLCJ1cGRhdGVCb2F0c0FsaXZlIiwicGxheWVyTnVtIiwicGFyYSIsImJvYXRzQWxpdmUiLCJjb3VudEJvYXRzQWxpdmUiLCJkcmFnQW5kRHJvcCIsInBsYXllciIsImJvYXRzIiwicXVlcnlTZWxlY3RvckFsbCIsImJvYXQiLCJvbkRyYWciLCJkcmFnZ2FibGUiLCJzdHlsZSIsIm9wYWNpdHkiLCJhZGRHcmlkTGlzdGVuZXJzIiwicHJlcGFyZU5ld0dhbWUiLCJzaGlwc0FsaXZlIiwic2hvd1N0YXJ0aW5nRGlhbG9nIiwiZGlhbG9nUGxhY2UiLCJzaG93TW9kYWwiLCJhZGRFdmVudExpc3RlbmVycyIsImlzUG9zaXRpb25WYWxpZEZvclNoaXAiLCJnYW1lIiwib2xkU3RhcnRCdXR0b24iLCJzdGFydEJ1dHRvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXJzIiwib25TdGFydENsaWNrIiwib2xkQ2hEaXJlY3Rpb24iLCJjaERpcmVjdGlvbiIsIm9uQ2hhbmdlRGlyZWN0aW9uQ2xpY2siLCJvbGRSYW5kb20iLCJyYW5kb20iLCJvblJhbmRvbUNsaWNrIiwiZW1wdHlHcmlkIiwicGxhY2VTaGlwUmFuZG9tIiwib2xkQm9hdCIsIm5ld0JvYXQiLCJjbG9uZU5vZGUiLCJwYXJlbnROb2RlIiwicmVwbGFjZUNoaWxkIiwiYm9hdERyYWciLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJjYW5TdGFydCIsImNsb3NlIiwiZXZlbnQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsImN1cnJlbnRUYXJnZXQiLCJjaGlsZHJlbiIsImlkIiwic3F1YXJlcyIsInByZXZlbnREZWZhdWx0Iiwib25Ecm9wIiwianNvbiIsImdldERhdGEiLCJvYmplY3QiLCJwYXJzZSIsImNvbHVtbiIsImNsaWNrZWRTcXVhcmUiLCJpbmRleFkiLCJwcm90b3R5cGUiLCJpbmRleE9mIiwiY2FsbCIsImluZGV4WCIsInBsYXllckdyaWQiLCJpc1ZhbGlkIiwicGxhY2VTaGlwIiwiZHJhZ2dlZEJvYXQiLCJnZXRFbGVtZW50QnlJZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvbGRCdXR0b24iLCJidXR0b24iLCJlbmVteUdyaWQiLCJoaXQiLCJhdHRhY2siLCJhbGxTdW5rIiwib25XaW4iLCJyYW5kb21BdHRhY2siLCJkaWFsb2dXaW4iLCJyZXN0YXJ0IiwiY2hvb3NlR2FtZSIsInR1cm5zIiwid2lubmVyIiwiUGxheWVyIiwibXVsdGlwbGF5ZXIiLCJzdGFydEdhbWUiLCJzdGFydE11bHRpcGxheWVyIiwicmVzZXRFdmVyeXRoaW5nIiwicHJlcGFyZVN0YXJ0aW5nRGlhbG9nIiwiY2hvb3NlR2FtZU1vZGUiLCJwbGF5Q29tcHV0ZXIiLCJwbGF5T3RoZXIiLCJTaGlwIiwiR2FtZWJvYXJkIiwiY3JlYXRlR2FtZWJvYXJkIiwic2hpcE9iaiIsIngiLCJ5IiwibnVtIiwiTWF0aCIsInJvdW5kIiwiZmxvb3IiLCJyZWNlaXZlSGl0IiwidmFsdWUiLCJhZGRIaXQiLCJyZXN1bHQiLCJpbmNsdWRlcyIsInB1c2giLCJhcnJheSIsInN1cnJvdW5kaW5nQXJyYXkiLCJ4MSIsInkxIiwieDIiLCJ5MiIsIngzIiwieTMiLCJlbXB0eSIsImV2ZXJ5Iiwic3Vycm91bmRpbmdFbXB0eSIsInBsYXllclBsYWNpbmciLCJzcXVhcmVDbGlja2VkIiwicGxheWVyV29uIiwic2hvd1dhdGVyRGlhbG9nIiwid2F0ZXJEaWFsb2ciLCJjbG9zZURpYWxvZyIsIm51bWJlciIsImF0dGFja2VyRGl2IiwiYXR0YWNrZXJJbmZvIiwiZGVmZW5kb3JEaXYiLCJkZWZlbmRvckluZm8iLCJwYXJhMSIsImJvYXRzQWxpdmUxIiwicGFyYTIiLCJib2F0c0FsaXZlMiIsImdyaWRMaXN0ZW5lcnMiLCJpc0VtcHR5Iiwic3RhcnRpbmdCdXR0b24iLCJkaWFsb2dUaXRsZSIsImdhbWVib2FyZCIsIndpbiIsImNyZWF0ZVNoaXAiLCJzaGlwTGVuZ3RoIiwiaGl0cyJdLCJzb3VyY2VSb290IjoiIn0=