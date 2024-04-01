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
  showGrid(gridContainer, grid, playerNumber) {
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
        } else if (slot === 'water') {
          square.className = 'square water';
          square.textContent = '✘';
        } else if (playerNumber === 1) {
          if (slot === null) {
            square.className = 'square empty';
          } else if (slot !== null && typeof slot === 'object') {
            square.className = 'square ship';
          }
        } else if (playerNumber === 2) {
          if (slot === null || slot !== null && typeof slot === 'object') {
            square.className = 'square empty';
            square.addEventListener('click', _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].onSquareClicked);
          }
        }
        div.appendChild(square);
      });
      gridContainer.appendChild(div);
    });
  },
  populateGrid(grid) {
    let start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let gridContainer = document.querySelector('#grid1');
    if (start === true) {
      gridContainer = document.querySelector('#grid-place');
    }
    dom.showGrid(gridContainer, grid, 1);
  },
  populateEnemyGrid(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    const gridContainer = document.querySelector('#grid2');
    const grid = this.player2.getGrid();
    dom.showGrid(gridContainer, grid, 2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWEsV0FBVyxVQUFVLFVBQVUsWUFBWSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLFFBQVEsS0FBSyxZQUFZLE9BQU8sV0FBVyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxXQUFXLE1BQU0sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLE1BQU0sS0FBSyxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksU0FBUyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLFVBQVUsS0FBSyxVQUFVLFVB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QUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7O0FDQXFCO0FBQ0s7QUFFMUIxRSw2Q0FBSSxDQUFDOEQsVUFBVSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY3JlYXRlLWdyaWQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9ldmVudEhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaXNQb3NpdGlvblZhbGlkRm9yU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL211bHRpcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY3JlYXRlR3JpZCA9IGZ1bmN0aW9uIChuID0gMTApIHtcbiAgY29uc3QgZ3JpZCA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSArPSAxKSB7XG4gICAgZ3JpZFtpXSA9IFtdO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbjsgaiArPSAxKSB7XG4gICAgICBncmlkW2ldW2pdID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ3JpZDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUdyaWQ7XG4iLCJpbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gJy4vZXZlbnRIYW5kbGVyJztcblxuY29uc3QgZG9tID0ge1xuICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgc2hvd0dyaWQoZ3JpZENvbnRhaW5lciwgZ3JpZCwgcGxheWVyTnVtYmVyKSB7XG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSAnbGluZSc7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzbG90KSkge1xuICAgICAgICAgIGNvbnN0IHN1bmsgPSBzbG90WzFdLmlzU3VuaygpO1xuICAgICAgICAgIGlmIChzdW5rID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgaGl0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKHN1bmsgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHN1bmsnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSAnd2F0ZXInKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgd2F0ZXInO1xuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9IGVsc2UgaWYgKHBsYXllck51bWJlciA9PT0gMSkge1xuICAgICAgICAgIGlmIChzbG90ID09PSBudWxsKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBlbXB0eSc7XG4gICAgICAgICAgfSBlbHNlIGlmIChzbG90ICE9PSBudWxsICYmIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc2hpcCc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHBsYXllck51bWJlciA9PT0gMikge1xuICAgICAgICAgIGlmIChzbG90ID09PSBudWxsIHx8IChzbG90ICE9PSBudWxsICYmIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGVtcHR5JztcbiAgICAgICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIEV2ZW50SGFuZGxlci5vblNxdWFyZUNsaWNrZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgIH0pO1xuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH0pO1xuICB9LFxuXG4gIHBvcHVsYXRlR3JpZChncmlkLCBzdGFydCA9IGZhbHNlKSB7XG4gICAgbGV0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDEnKTtcbiAgICBpZiAoc3RhcnQgPT09IHRydWUpIHtcbiAgICAgIGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZC1wbGFjZScpO1xuICAgIH1cbiAgICBkb20uc2hvd0dyaWQoZ3JpZENvbnRhaW5lciwgZ3JpZCwgMSk7XG4gIH0sXG4gIHBvcHVsYXRlRW5lbXlHcmlkKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICB0aGlzLnBsYXllcjEgPSBwbGF5ZXIxO1xuICAgIHRoaXMucGxheWVyMiA9IHBsYXllcjI7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMicpO1xuICAgIGNvbnN0IGdyaWQgPSB0aGlzLnBsYXllcjIuZ2V0R3JpZCgpO1xuICAgIGRvbS5zaG93R3JpZChncmlkQ29udGFpbmVyLCBncmlkLCAyKTtcbiAgfSxcbiAgZGVsYXkobXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKTtcbiAgICB9KTtcbiAgfSxcbiAgdG9nZ2xlVHVybigpIHtcbiAgICBjb25zdCBkaXZUdXJucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50dXJucycpO1xuICAgIGNvbnN0IGN1cnJlbnRUdXJuID0gZGl2VHVybnMudGV4dENvbnRlbnQuc3Vic3RyaW5nKDcsIDgpO1xuICAgIGlmIChjdXJyZW50VHVybiA9PT0gJzEnKSB7XG4gICAgICBkaXZUdXJucy50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMiB0dXJuJztcbiAgICAgIGRpdlR1cm5zLmNsYXNzTmFtZSA9ICd0dXJucyByZWQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXZUdXJucy50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMSB0dXJuJztcbiAgICAgIGRpdlR1cm5zLmNsYXNzTmFtZSA9ICd0dXJucyc7XG4gICAgfVxuICB9LFxuICB1cGRhdGVCb2F0c0FsaXZlKHBsYXllck51bSkge1xuICAgIGxldCBwYXJhO1xuICAgIGxldCBib2F0c0FsaXZlO1xuICAgIGlmIChwbGF5ZXJOdW0gPT09IDEpIHtcbiAgICAgIHBhcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHMtYWxpdmUub25lJyk7XG4gICAgICBib2F0c0FsaXZlID0gZG9tLnBsYXllcjEuY291bnRCb2F0c0FsaXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHMtYWxpdmUudHdvJyk7XG4gICAgICBib2F0c0FsaXZlID0gZG9tLnBsYXllcjIuY291bnRCb2F0c0FsaXZlKCk7XG4gICAgfVxuICAgIHBhcmEudGV4dENvbnRlbnQgPSBgQWxpdmUgc2hpcHM6ICR7Ym9hdHNBbGl2ZX1gO1xuICB9LFxuICBkcmFnQW5kRHJvcChwbGF5ZXIpIHtcbiAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgIGJvYXQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgRXZlbnRIYW5kbGVyLm9uRHJhZyk7XG4gICAgICBib2F0LmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICBib2F0LnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgfSk7XG5cbiAgICBFdmVudEhhbmRsZXIuYWRkR3JpZExpc3RlbmVycyhwbGF5ZXIpO1xuICB9LFxuICBwcmVwYXJlTmV3R2FtZSgpIHtcbiAgICBjb25zdCBkaXZUdXJucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50dXJucycpO1xuICAgIGRpdlR1cm5zLnRleHRDb250ZW50ID0gJ1BsYXllciAxIHR1cm4nO1xuICAgIGRpdlR1cm5zLmNsYXNzTmFtZSA9ICd0dXJucyc7XG4gICAgY29uc3Qgc2hpcHNBbGl2ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaGlwcy1hbGl2ZScpO1xuICAgIHNoaXBzQWxpdmUuZm9yRWFjaChkaXYgPT4ge1xuICAgICAgZGl2LnRleHRDb250ZW50ID0gJ0FsaXZlIHNoaXBzOiA1JztcbiAgICB9KTtcbiAgfSxcbiAgc2hvd1N0YXJ0aW5nRGlhbG9nKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICBkb20ucHJlcGFyZU5ld0dhbWUoKTtcbiAgICBkb20ucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBkaWFsb2dQbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcycpO1xuICAgIGRpYWxvZ1BsYWNlLnNob3dNb2RhbCgpO1xuICAgIGRvbS5kcmFnQW5kRHJvcChwbGF5ZXIxKTtcbiAgICBFdmVudEhhbmRsZXIuYWRkRXZlbnRMaXN0ZW5lcnMocGxheWVyMSwgcGxheWVyMik7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkb207XG4iLCJpbXBvcnQgZG9tIGZyb20gJy4vZG9tJztcbmltcG9ydCBpc1Bvc2l0aW9uVmFsaWRGb3JTaGlwIGZyb20gJy4vaXNQb3NpdGlvblZhbGlkRm9yU2hpcCc7XG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG5jb25zdCBFdmVudEhhbmRsZXIgPSB7XG4gIGFkZEV2ZW50TGlzdGVuZXJzKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICB0aGlzLnBsYXllcjEgPSBwbGF5ZXIxO1xuICAgIHRoaXMucGxheWVyMiA9IHBsYXllcjI7XG4gICAgY29uc3Qgb2xkU3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMgLnN0YXJ0Jyk7XG4gICAgY29uc3Qgc3RhcnRCdXR0b24gPSBFdmVudEhhbmRsZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnMob2xkU3RhcnRCdXR0b24pO1xuICAgIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vblN0YXJ0Q2xpY2spO1xuXG4gICAgY29uc3Qgb2xkQ2hEaXJlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGlyZWN0aW9uJyk7XG4gICAgY29uc3QgY2hEaXJlY3Rpb24gPSBFdmVudEhhbmRsZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnMob2xkQ2hEaXJlY3Rpb24pO1xuICAgIGNoRGlyZWN0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNoYW5nZURpcmVjdGlvbkNsaWNrKTtcblxuICAgIGNvbnN0IG9sZFJhbmRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yYW5kb20nKTtcbiAgICBjb25zdCByYW5kb20gPSBFdmVudEhhbmRsZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnMob2xkUmFuZG9tKTtcbiAgICByYW5kb20uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uUmFuZG9tQ2xpY2spO1xuICB9LFxuICBvblJhbmRvbUNsaWNrKCkge1xuICAgIEV2ZW50SGFuZGxlci5wbGF5ZXIxLmVtcHR5R3JpZCgpO1xuICAgIEV2ZW50SGFuZGxlci5wbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSg1KTtcbiAgICBFdmVudEhhbmRsZXIucGxheWVyMS5wbGFjZVNoaXBSYW5kb20oNCk7XG4gICAgRXZlbnRIYW5kbGVyLnBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgIEV2ZW50SGFuZGxlci5wbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICBFdmVudEhhbmRsZXIucGxheWVyMS5wbGFjZVNoaXBSYW5kb20oMik7XG4gICAgZG9tLnBvcHVsYXRlR3JpZChFdmVudEhhbmRsZXIucGxheWVyMS5nZXRHcmlkKCksIHRydWUpO1xuICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgY29uc3Qgb2xkQm9hdCA9IGJvYXQ7XG4gICAgICBjb25zdCBuZXdCb2F0ID0gb2xkQm9hdC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICBvbGRCb2F0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0JvYXQsIG9sZEJvYXQpO1xuICAgICAgbmV3Qm9hdC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgIG5ld0JvYXQuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICB9KTtcbiAgfSxcbiAgb25DaGFuZ2VEaXJlY3Rpb25DbGljaygpIHtcbiAgICBjb25zdCBib2F0RHJhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2F0cy1kcmFnJyk7XG4gICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgIGlmIChkb20uZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGJvYXREcmFnLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJyk7XG4gICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICBib2F0LmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJyk7XG4gICAgICB9KTtcbiAgICAgIGRvbS5kaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICAgIH0gZWxzZSB7XG4gICAgICBib2F0RHJhZy5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbCcpO1xuICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgYm9hdC5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbCcpO1xuICAgICAgfSk7XG4gICAgICBkb20uZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICAgIH1cbiAgfSxcbiAgb25TdGFydENsaWNrKCkge1xuICAgIGNvbnN0IGRpYWxvZ1BsYWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzJyk7XG4gICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgIGxldCBjYW5TdGFydDtcbiAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgaWYgKGJvYXQuZHJhZ2dhYmxlID09PSB0cnVlKSBjYW5TdGFydCA9IGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChjYW5TdGFydCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICBkaWFsb2dQbGFjZS5jbG9zZSgpO1xuICAgIGRvbS5wb3B1bGF0ZUdyaWQoRXZlbnRIYW5kbGVyLnBsYXllcjEuZ2V0R3JpZCgpKTtcbiAgICBkb20ucG9wdWxhdGVFbmVteUdyaWQoRXZlbnRIYW5kbGVyLnBsYXllcjEsIEV2ZW50SGFuZGxlci5wbGF5ZXIyKTtcbiAgfSxcbiAgb25EcmFnKGV2ZW50KSB7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXG4gICAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IGxlbmd0aDogZXZlbnQuY3VycmVudFRhcmdldC5jaGlsZHJlbi5sZW5ndGgsIGlkOiBldmVudC5jdXJyZW50VGFyZ2V0LmlkIH0pXG4gICAgKTtcbiAgfSxcbiAgYWRkR3JpZExpc3RlbmVycyhwbGF5ZXIpIHtcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2dyaWQtcGxhY2UgLnNxdWFyZS5lbXB0eScpO1xuICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZXZlbnQgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG4gICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIEV2ZW50SGFuZGxlci5vbkRyb3ApO1xuICAgIH0pO1xuICB9LFxuICBvbkRyb3AoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGpzb24gPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgIGNvbnN0IG9iamVjdCA9IEpTT04ucGFyc2UoanNvbik7XG4gICAgY29uc3QgeyBsZW5ndGggfSA9IG9iamVjdDtcbiAgICBjb25zdCBncmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICBjb25zdCBjb2x1bW4gPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgY29uc3QgY2xpY2tlZFNxdWFyZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgY29uc3QgaW5kZXhZID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb2x1bW4uY2hpbGRyZW4sIGNsaWNrZWRTcXVhcmUpO1xuICAgIGNvbnN0IGluZGV4WCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZ3JpZC5jaGlsZHJlbiwgY29sdW1uKTtcbiAgICBjb25zdCB7IGRpcmVjdGlvbiB9ID0gZG9tO1xuICAgIGNvbnN0IHBsYXllckdyaWQgPSBFdmVudEhhbmRsZXIucGxheWVyLmdldEdyaWQoKTtcbiAgICBjb25zdCBpc1ZhbGlkID0gaXNQb3NpdGlvblZhbGlkRm9yU2hpcChpbmRleFgsIGluZGV4WSwgZGlyZWN0aW9uLCBsZW5ndGgsIHBsYXllckdyaWQpO1xuICAgIGlmIChpc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIEV2ZW50SGFuZGxlci5wbGF5ZXIucGxhY2VTaGlwKFtpbmRleFgsIGluZGV4WV0sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgICBkb20ucG9wdWxhdGVHcmlkKEV2ZW50SGFuZGxlci5wbGF5ZXIuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBkcmFnZ2VkQm9hdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9iamVjdC5pZCk7XG4gICAgZHJhZ2dlZEJvYXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgRXZlbnRIYW5kbGVyLm9uRHJhZyk7XG4gICAgZHJhZ2dlZEJvYXQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgZHJhZ2dlZEJvYXQuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICBFdmVudEhhbmRsZXIuYWRkR3JpZExpc3RlbmVycyhFdmVudEhhbmRsZXIucGxheWVyKTtcbiAgfSxcbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMob2xkQnV0dG9uKSB7XG4gICAgY29uc3QgYnV0dG9uID0gb2xkQnV0dG9uLmNsb25lTm9kZSh0cnVlKTtcbiAgICBvbGRCdXR0b24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoYnV0dG9uLCBvbGRCdXR0b24pO1xuICAgIHJldHVybiBidXR0b247XG4gIH0sXG4gIG9uU3F1YXJlQ2xpY2tlZDogYXN5bmMgZXZlbnQgPT4ge1xuICAgIGNvbnN0IGVuZW15R3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMicpO1xuICAgIGNvbnN0IGNvbHVtbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZTtcbiAgICBjb25zdCBjbGlja2VkU3F1YXJlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICBjb25zdCBpbmRleFkgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGNvbHVtbi5jaGlsZHJlbiwgY2xpY2tlZFNxdWFyZSk7XG4gICAgY29uc3QgaW5kZXhYID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChlbmVteUdyaWQuY2hpbGRyZW4sIGNvbHVtbik7XG4gICAgbGV0IGhpdCA9IGRvbS5wbGF5ZXIxLmF0dGFjayhkb20ucGxheWVyMiwgaW5kZXhYLCBpbmRleFkpO1xuICAgIGRvbS5wb3B1bGF0ZUVuZW15R3JpZChkb20ucGxheWVyMSwgZG9tLnBsYXllcjIpO1xuICAgIGRvbS51cGRhdGVCb2F0c0FsaXZlKDIpO1xuICAgIGlmIChkb20ucGxheWVyMi5hbGxTdW5rKCkgIT09IGZhbHNlKSByZXR1cm4gRXZlbnRIYW5kbGVyLm9uV2luKDEpO1xuICAgIGlmIChoaXQgPT09IGZhbHNlKSB7XG4gICAgICBkb20udG9nZ2xlVHVybigpO1xuICAgICAgZG8ge1xuICAgICAgICBhd2FpdCBkb20uZGVsYXkoNTAwKTtcbiAgICAgICAgaGl0ID0gZG9tLnBsYXllcjIucmFuZG9tQXR0YWNrKGRvbS5wbGF5ZXIxKTtcbiAgICAgICAgZG9tLnBvcHVsYXRlR3JpZChkb20ucGxheWVyMS5nZXRHcmlkKCkpO1xuICAgICAgICBkb20udXBkYXRlQm9hdHNBbGl2ZSgxKTtcbiAgICAgICAgaWYgKGRvbS5wbGF5ZXIxLmFsbFN1bmsoKSAhPT0gZmFsc2UpIHJldHVybiBFdmVudEhhbmRsZXIub25XaW4oMik7XG4gICAgICB9IHdoaWxlIChoaXQgIT09IGZhbHNlKTtcbiAgICAgIGRvbS50b2dnbGVUdXJuKCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgb25XaW4ocGxheWVyKSB7XG4gICAgY29uc3QgZGlhbG9nV2luID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbicpO1xuICAgIGRpYWxvZ1dpbi5zaG93TW9kYWwoKTtcbiAgICBjb25zdCByZXN0YXJ0ID0gZGlhbG9nV2luLnF1ZXJ5U2VsZWN0b3IoJy5yZXN0YXJ0Jyk7XG4gICAgcmVzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGdhbWUuY2hvb3NlR2FtZSgpKTtcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGlhbG9nV2luLmNsb3NlKCk7XG4gICAgfSk7XG4gICAgY29uc3QgdHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICB0dXJucy50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXJ9IHdvbiEhIWA7XG4gICAgY29uc3Qgd2lubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lcicpO1xuICAgIHdpbm5lci50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXJ9IHdvbiEhIWA7XG4gICAgd2lubmVyLmNsYXNzTmFtZSA9ICd3aW5uZXInO1xuICAgIGlmIChwbGF5ZXIgPT09IDIpIHtcbiAgICAgIHdpbm5lci5jbGFzc0xpc3QuYWRkKCd0d28nKTtcbiAgICB9XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBFdmVudEhhbmRsZXI7XG4iLCJpbXBvcnQgZG9tIGZyb20gJy4vZG9tJztcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9wbGF5ZXInO1xuaW1wb3J0IG11bHRpcGxheWVyIGZyb20gJy4vbXVsdGlwbGF5ZXInO1xuXG5jb25zdCBnYW1lID0ge1xuICBzdGFydEdhbWUoKSB7XG4gICAgY29uc3QgcGxheWVyMSA9IFBsYXllcigxKTtcbiAgICBjb25zdCBwbGF5ZXIyID0gUGxheWVyKDIpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDUpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDQpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDIpO1xuICAgIGRvbS5zaG93U3RhcnRpbmdEaWFsb2cocGxheWVyMSwgcGxheWVyMik7XG4gIH0sXG4gIHN0YXJ0TXVsdGlwbGF5ZXIoKSB7XG4gICAgY29uc3QgcGxheWVyMSA9IFBsYXllcigxKTtcbiAgICBjb25zdCBwbGF5ZXIyID0gUGxheWVyKDIpO1xuICAgIG11bHRpcGxheWVyLnJlc2V0RXZlcnl0aGluZygpO1xuICAgIG11bHRpcGxheWVyLnByZXBhcmVTdGFydGluZ0RpYWxvZygpO1xuICAgIG11bHRpcGxheWVyLnNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKTtcbiAgfSxcbiAgY2hvb3NlR2FtZSgpIHtcbiAgICBjb25zdCBjaG9vc2VHYW1lTW9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaG9vc2UtZ2FtZScpO1xuICAgIGNob29zZUdhbWVNb2RlLnNob3dNb2RhbCgpO1xuICAgIGNvbnN0IHBsYXlDb21wdXRlciA9IGNob29zZUdhbWVNb2RlLnF1ZXJ5U2VsZWN0b3IoJy5jb21wdXRlcicpO1xuICAgIHBsYXlDb21wdXRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNob29zZUdhbWVNb2RlLmNsb3NlKCk7XG4gICAgICBnYW1lLnN0YXJ0R2FtZSgpO1xuICAgIH0pO1xuICAgIGNvbnN0IHBsYXlPdGhlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tdWx0aXBsYXllcicpO1xuICAgIHBsYXlPdGhlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNob29zZUdhbWVNb2RlLmNsb3NlKCk7XG4gICAgICBnYW1lLnN0YXJ0TXVsdGlwbGF5ZXIoKTtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWU7XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuaW1wb3J0IGNyZWF0ZUdyaWQgZnJvbSAnLi9jcmVhdGUtZ3JpZCc7XG5pbXBvcnQgaXNQb3NpdGlvblZhbGlkRm9yU2hpcCBmcm9tICcuL2lzUG9zaXRpb25WYWxpZEZvclNoaXAnO1xuXG5jb25zdCBHYW1lYm9hcmQgPSBmdW5jdGlvbiBjcmVhdGVHYW1lYm9hcmQoKSB7XG4gIGxldCBncmlkID0gY3JlYXRlR3JpZCgpO1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IGZ1bmN0aW9uIChzdGFydCwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICBjb25zdCBzaGlwT2JqID0gU2hpcChsZW5ndGgpO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcE9iai5sZW5ndGg7IGkgKz0gMSkgZ3JpZFtzdGFydFswXV1bc3RhcnRbMV0gKyBpXSA9IHNoaXBPYmo7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcE9iai5sZW5ndGg7IGkgKz0gMSkgZ3JpZFtzdGFydFswXSArIGldW3N0YXJ0WzFdXSA9IHNoaXBPYmo7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcFJhbmRvbSA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgICBsZXQgeDtcbiAgICBsZXQgeTtcbiAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuICAgIGxldCBkaXJlY3Rpb247XG4gICAgY29uc3QgbnVtID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcbiAgICBpZiAobnVtID09PSAwKSB7XG4gICAgICBkaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgfVxuICAgIHdoaWxlIChpc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICBpc1ZhbGlkID0gaXNQb3NpdGlvblZhbGlkRm9yU2hpcCh4LCB5LCBkaXJlY3Rpb24sIGxlbmd0aCwgZ3JpZCk7XG4gICAgfVxuICAgIHRoaXMucGxhY2VTaGlwKFt4LCB5XSwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xuICB9O1xuXG4gIGNvbnN0IGVtcHR5R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBncmlkID0gY3JlYXRlR3JpZCgpO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVIaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGNvbnN0IHZhbHVlID0gZ3JpZFt4XVt5XTtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIGdyaWRbeF1beV0gPSAnd2F0ZXInO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YWx1ZS5hZGRIaXQoKTtcbiAgICBncmlkW3hdW3ldID0gWydoaXQnLCB2YWx1ZV07XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIGNvbnN0IGFsbFN1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBpZiAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoc2xvdCkpIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBjb25zdCBjb3VudEJvYXRzQWxpdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYm9hdHMgPSBbXTtcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBzbG90ICE9PSBudWxsICYmXG4gICAgICAgICAgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgIUFycmF5LmlzQXJyYXkoc2xvdCkgJiZcbiAgICAgICAgICAhYm9hdHMuaW5jbHVkZXMoc2xvdClcbiAgICAgICAgKSB7XG4gICAgICAgICAgYm9hdHMucHVzaChzbG90KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJvYXRzLmxlbmd0aDtcbiAgfTtcblxuICBjb25zdCBnZXRHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBncmlkO1xuICB9O1xuICByZXR1cm4ge1xuICAgIGdldEdyaWQsXG4gICAgZW1wdHlHcmlkLFxuICAgIHBsYWNlU2hpcCxcbiAgICBwbGFjZVNoaXBSYW5kb20sXG4gICAgcmVjZWl2ZUhpdCxcbiAgICBhbGxTdW5rLFxuICAgIGNvdW50Qm9hdHNBbGl2ZSxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsImNvbnN0IGlzUG9zaXRpb25WYWxpZEZvclNoaXAgPSAoeCwgeSwgZGlyZWN0aW9uLCBsZW5ndGgsIGdyaWQpID0+IHtcbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgY29uc3Qgc3Vycm91bmRpbmdBcnJheSA9IFtdO1xuXG4gIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyAmJiB4ICsgbGVuZ3RoID4gZ3JpZC5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJyAmJiB5ICsgbGVuZ3RoID49IGdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXJyYXkucHVzaChncmlkW3hdW3ldKTtcbiAgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgYXJyYXkucHVzaChncmlkW3ggKyBpXVt5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGFycmF5LnB1c2goZ3JpZFt4XVt5ICsgaV0pO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAtMTsgaSA8PSBsZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IHgxID0geCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAwKTtcbiAgICBjb25zdCB5MSA9IHkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAwIDogaSk7XG4gICAgY29uc3QgeDIgPSB4ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IC0xKTtcbiAgICBjb25zdCB5MiA9IHkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAtMSA6IGkpO1xuICAgIGNvbnN0IHgzID0geCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAxKTtcbiAgICBjb25zdCB5MyA9IHkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAxIDogaSk7XG5cbiAgICBpZiAoeDEgPj0gMCAmJiB4MSA8IGdyaWQubGVuZ3RoICYmIHkxID49IDAgJiYgeTEgPCBncmlkWzBdLmxlbmd0aCkge1xuICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKGdyaWRbeDFdW3kxXSk7XG4gICAgfVxuICAgIGlmICh4MiA+PSAwICYmIHgyIDwgZ3JpZC5sZW5ndGggJiYgeTIgPj0gMCAmJiB5MiA8IGdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2goZ3JpZFt4Ml1beTJdKTtcbiAgICB9XG4gICAgaWYgKHgzID49IDAgJiYgeDMgPCBncmlkLmxlbmd0aCAmJiB5MyA+PSAwICYmIHkzIDwgZ3JpZFswXS5sZW5ndGgpIHtcbiAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChncmlkW3gzXVt5M10pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGVtcHR5ID0gYXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG4gIGNvbnN0IHN1cnJvdW5kaW5nRW1wdHkgPSBzdXJyb3VuZGluZ0FycmF5LmV2ZXJ5KHNxdWFyZSA9PiBzcXVhcmUgPT09IG51bGwpO1xuXG4gIHJldHVybiBlbXB0eSAmJiBzdXJyb3VuZGluZ0VtcHR5O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaXNQb3NpdGlvblZhbGlkRm9yU2hpcDtcbiIsImltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmNvbnN0IG11bHRpcGxheWVyID0ge1xuICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgcGxheWVyUGxhY2luZzogMSxcbiAgcG9wdWxhdGVHcmlkKGdyaWQsIHN0YXJ0ID0gZmFsc2UpIHtcbiAgICBsZXQgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMScpO1xuICAgIGlmIChzdGFydCA9PT0gdHJ1ZSkge1xuICAgICAgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkLXBsYWNlJyk7XG4gICAgfVxuICAgIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gJ2xpbmUnO1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaWYgKHNsb3QgPT09IG51bGwpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBlbXB0eSc7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzbG90KSkge1xuICAgICAgICAgIGNvbnN0IHN1bmsgPSBzbG90WzFdLmlzU3VuaygpO1xuICAgICAgICAgIGlmIChzdW5rID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgaGl0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKHN1bmsgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHN1bmsnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ICE9PSBudWxsICYmIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHNoaXAnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgPT09ICd3YXRlcicpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSB3YXRlcic7XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH1cbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgICB9KTtcbiAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9KTtcbiAgfSxcbiAgcG9wdWxhdGVFbmVteUdyaWQocGxheWVyMSwgcGxheWVyMikge1xuICAgIHRoaXMucGxheWVyMSA9IHBsYXllcjE7XG4gICAgdGhpcy5wbGF5ZXIyID0gcGxheWVyMjtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQyJyk7XG4gICAgY29uc3QgZ3JpZCA9IHRoaXMucGxheWVyMi5nZXRHcmlkKCk7XG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSAnbGluZSc7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzbG90KSkge1xuICAgICAgICAgIGNvbnN0IHN1bmsgPSBzbG90WzFdLmlzU3VuaygpO1xuICAgICAgICAgIGlmIChzdW5rID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgaGl0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKHN1bmsgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHN1bmsnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSBudWxsIHx8IChzbG90ICE9PSBudWxsICYmIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBlbXB0eSc7XG4gICAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbXVsdGlwbGF5ZXIuc3F1YXJlQ2xpY2tlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gJ3dhdGVyJykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHdhdGVyJztcbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfVxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgIH0pO1xuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH0pO1xuICB9LFxuICBzcXVhcmVDbGlja2VkOiBhc3luYyBldmVudCA9PiB7XG4gICAgY29uc3QgZW5lbXlHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQyJyk7XG4gICAgY29uc3QgY29sdW1uID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xuICAgIGNvbnN0IGNsaWNrZWRTcXVhcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIGNvbnN0IGluZGV4WSA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoY29sdW1uLmNoaWxkcmVuLCBjbGlja2VkU3F1YXJlKTtcbiAgICBjb25zdCBpbmRleFggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGVuZW15R3JpZC5jaGlsZHJlbiwgY29sdW1uKTtcbiAgICBjb25zdCBoaXQgPSBtdWx0aXBsYXllci5wbGF5ZXIxLmF0dGFjayhtdWx0aXBsYXllci5wbGF5ZXIyLCBpbmRleFgsIGluZGV4WSk7XG4gICAgaWYgKG11bHRpcGxheWVyLnBsYXllcjIuYWxsU3VuaygpICE9PSBmYWxzZSkgcmV0dXJuIG11bHRpcGxheWVyLnBsYXllcldvbihtdWx0aXBsYXllci5wbGF5ZXIxKTtcbiAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUVuZW15R3JpZChtdWx0aXBsYXllci5wbGF5ZXIxLCBtdWx0aXBsYXllci5wbGF5ZXIyKTtcbiAgICBtdWx0aXBsYXllci51cGRhdGVCb2F0c0FsaXZlKCk7XG4gICAgaWYgKGhpdCA9PT0gZmFsc2UpIHtcbiAgICAgIG11bHRpcGxheWVyLnNob3dXYXRlckRpYWxvZygpO1xuICAgICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVHcmlkKG11bHRpcGxheWVyLnBsYXllcjIuZ2V0R3JpZCgpKTtcbiAgICAgIG11bHRpcGxheWVyLnBvcHVsYXRlRW5lbXlHcmlkKG11bHRpcGxheWVyLnBsYXllcjIsIG11bHRpcGxheWVyLnBsYXllcjEpO1xuICAgICAgbXVsdGlwbGF5ZXIudXBkYXRlQm9hdHNBbGl2ZSgpO1xuICAgICAgbXVsdGlwbGF5ZXIudG9nZ2xlVHVybigpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHNob3dXYXRlckRpYWxvZygpIHtcbiAgICBjb25zdCB3YXRlckRpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53YXRlci1kaWFsb2cnKTtcbiAgICB3YXRlckRpYWxvZy5zaG93TW9kYWwoKTtcbiAgICB3YXRlckRpYWxvZy5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgY29uc3QgY2xvc2VEaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2hhbmdlLXR1cm4nKTtcbiAgICBjbG9zZURpYWxvZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHdhdGVyRGlhbG9nLmNsb3NlKCk7XG4gICAgICB3YXRlckRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgfSk7XG4gIH0sXG4gIHBsYXllcldvbihwbGF5ZXIpIHtcbiAgICBjb25zdCBkaWFsb2dXaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2luJyk7XG4gICAgZGlhbG9nV2luLnNob3dNb2RhbCgpO1xuICAgIGNvbnN0IHJlc3RhcnQgPSBkaWFsb2dXaW4ucXVlcnlTZWxlY3RvcignLnJlc3RhcnQnKTtcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gZ2FtZS5jaG9vc2VHYW1lKCkpO1xuICAgIHJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBkaWFsb2dXaW4uY2xvc2UoKTtcbiAgICB9KTtcbiAgICBjb25zdCB0dXJucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50dXJucycpO1xuICAgIHR1cm5zLnRleHRDb250ZW50ID0gYFBsYXllciAke3BsYXllci5udW1iZXJ9IHdvbiEhIWA7XG4gICAgY29uc3Qgd2lubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lcicpO1xuICAgIHdpbm5lci50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXIubnVtYmVyfSB3b24hISFgO1xuICAgIHdpbm5lci5jbGFzc05hbWUgPSAnd2lubmVyJztcbiAgICBpZiAocGxheWVyLm51bWJlciA9PT0gMikge1xuICAgICAgd2lubmVyLmNsYXNzTGlzdC5hZGQoJ3R3bycpO1xuICAgIH1cbiAgfSxcbiAgdG9nZ2xlVHVybigpIHtcbiAgICBjb25zdCBkaXZUdXJucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50dXJucycpO1xuICAgIGNvbnN0IGF0dGFja2VyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci5vbmUnKTtcbiAgICBjb25zdCBhdHRhY2tlckluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5mby5vbmUnKTtcbiAgICBjb25zdCBkZWZlbmRvckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXIudHdvJyk7XG4gICAgY29uc3QgZGVmZW5kb3JJbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmluZm8udHdvJyk7XG4gICAgY29uc3QgY3VycmVudFR1cm4gPSBkaXZUdXJucy50ZXh0Q29udGVudC5zdWJzdHJpbmcoNywgOCk7XG4gICAgaWYgKGN1cnJlbnRUdXJuID09PSAnMScpIHtcbiAgICAgIGRpdlR1cm5zLnRleHRDb250ZW50ID0gJ1BsYXllciAyIHR1cm4nO1xuICAgICAgZGl2VHVybnMuY2xhc3NOYW1lID0gJ3R1cm5zIHJlZCc7XG4gICAgICBhdHRhY2tlckRpdi50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMic7XG4gICAgICBhdHRhY2tlckluZm8uY2xhc3NOYW1lID0gJ2luZm8gb25lIHJlZCc7XG4gICAgICBkZWZlbmRvckRpdi50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMSc7XG4gICAgICBkZWZlbmRvckluZm8uY2xhc3NOYW1lID0gJ2luZm8gdHdvJztcbiAgICB9IGVsc2Uge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDEgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMnO1xuICAgICAgYXR0YWNrZXJEaXYudGV4dENvbnRlbnQgPSAnUGxheWVyIDEnO1xuICAgICAgYXR0YWNrZXJJbmZvLmNsYXNzTmFtZSA9ICdpbmZvIG9uZSc7XG4gICAgICBkZWZlbmRvckRpdi50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMic7XG4gICAgICBkZWZlbmRvckluZm8uY2xhc3NOYW1lID0gJ2luZm8gdHdvIHJlZCc7XG4gICAgfVxuICB9LFxuICB1cGRhdGVCb2F0c0FsaXZlKCkge1xuICAgIGNvbnN0IHBhcmExID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLm9uZScpO1xuICAgIGNvbnN0IGJvYXRzQWxpdmUxID0gbXVsdGlwbGF5ZXIucGxheWVyMS5jb3VudEJvYXRzQWxpdmUoKTtcbiAgICBwYXJhMS50ZXh0Q29udGVudCA9IGBBbGl2ZSBzaGlwcyAke2JvYXRzQWxpdmUxfWA7XG4gICAgY29uc3QgcGFyYTIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHMtYWxpdmUudHdvJyk7XG4gICAgY29uc3QgYm9hdHNBbGl2ZTIgPSBtdWx0aXBsYXllci5wbGF5ZXIyLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIHBhcmEyLnRleHRDb250ZW50ID0gYEFsaXZlIHNoaXBzICR7Ym9hdHNBbGl2ZTJ9YDtcbiAgfSxcbiAgZHJhZ0FuZERyb3AocGxheWVyKSB7XG4gICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgIGNvbnN0IG9uRHJhZyA9IGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHsgbGVuZ3RoOiBldmVudC5jdXJyZW50VGFyZ2V0LmNoaWxkcmVuLmxlbmd0aCwgaWQ6IGV2ZW50LmN1cnJlbnRUYXJnZXQuaWQgfSlcbiAgICAgICk7XG4gICAgfTtcbiAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgYm9hdC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBvbkRyYWcpO1xuICAgICAgYm9hdC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgYm9hdC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZ3JpZExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjZ3JpZC1wbGFjZSAuc3F1YXJlLmVtcHR5Jyk7XG4gICAgICBjb25zdCBvbkRyb3AgPSBldmVudCA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGpzb24gPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICBjb25zdCBvYmplY3QgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgICAgICBjb25zdCB7IGxlbmd0aCB9ID0gb2JqZWN0O1xuICAgICAgICBjb25zdCBncmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICBjb25zdCBjbGlja2VkU3F1YXJlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgaW5kZXhZID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb2x1bW4uY2hpbGRyZW4sIGNsaWNrZWRTcXVhcmUpO1xuICAgICAgICBjb25zdCBpbmRleFggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGdyaWQuY2hpbGRyZW4sIGNvbHVtbik7XG4gICAgICAgIGNvbnN0IHsgZGlyZWN0aW9uIH0gPSBtdWx0aXBsYXllcjtcbiAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IHBsYXllci5nZXRHcmlkKCk7XG4gICAgICAgIGNvbnN0IGlzRW1wdHkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgICAgICAgY29uc3Qgc3Vycm91bmRpbmdBcnJheSA9IFtdO1xuXG4gICAgICAgICAgYXJyYXkucHVzaChwbGF5ZXJHcmlkW2luZGV4WF1baW5kZXhZXSk7XG4gICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgIGFycmF5LnB1c2gocGxheWVyR3JpZFtpbmRleFggKyBpXVtpbmRleFldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICBhcnJheS5wdXNoKHBsYXllckdyaWRbaW5kZXhYXVtpbmRleFkgKyBpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IC0xOyBpIDw9IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCB4MSA9IGluZGV4WCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAwKTtcbiAgICAgICAgICAgIGNvbnN0IHkxID0gaW5kZXhZICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gMCA6IGkpO1xuICAgICAgICAgICAgY29uc3QgeDIgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogLTEpO1xuICAgICAgICAgICAgY29uc3QgeTIgPSBpbmRleFkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAtMSA6IGkpO1xuICAgICAgICAgICAgY29uc3QgeDMgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMSk7XG4gICAgICAgICAgICBjb25zdCB5MyA9IGluZGV4WSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDEgOiBpKTtcblxuICAgICAgICAgICAgaWYgKHgxID49IDAgJiYgeDEgPCBwbGF5ZXJHcmlkLmxlbmd0aCAmJiB5MSA+PSAwICYmIHkxIDwgcGxheWVyR3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKHBsYXllckdyaWRbeDFdW3kxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeDIgPj0gMCAmJiB4MiA8IHBsYXllckdyaWQubGVuZ3RoICYmIHkyID49IDAgJiYgeTIgPCBwbGF5ZXJHcmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2gocGxheWVyR3JpZFt4Ml1beTJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh4MyA+PSAwICYmIHgzIDwgcGxheWVyR3JpZC5sZW5ndGggJiYgeTMgPj0gMCAmJiB5MyA8IHBsYXllckdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChwbGF5ZXJHcmlkW3gzXVt5M10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGVtcHR5ID0gYXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG4gICAgICAgICAgY29uc3Qgc3Vycm91bmRpbmdFbXB0eSA9IHN1cnJvdW5kaW5nQXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG5cbiAgICAgICAgICByZXR1cm4gZW1wdHkgJiYgc3Vycm91bmRpbmdFbXB0eTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBpZiAoaXNFbXB0eSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcGxheWVyLnBsYWNlU2hpcChbaW5kZXhYLCBpbmRleFldLCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gICAgICAgIG11bHRpcGxheWVyLnBvcHVsYXRlR3JpZChwbGF5ZXIuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICAgICAgY29uc3QgZHJhZ2dlZEJvYXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvYmplY3QuaWQpO1xuICAgICAgICBkcmFnZ2VkQm9hdC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBvbkRyYWcpO1xuICAgICAgICBkcmFnZ2VkQm9hdC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgZHJhZ2dlZEJvYXQuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICAgICAgZ3JpZExpc3RlbmVycygpO1xuICAgICAgfTtcbiAgICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBldmVudCA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgb25Ecm9wKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ3JpZExpc3RlbmVycygpO1xuICB9LFxuICBwcmVwYXJlU3RhcnRpbmdEaWFsb2coKSB7XG4gICAgY29uc3Qgc3RhcnRpbmdCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMgLnN0YXJ0Jyk7XG4gICAgc3RhcnRpbmdCdXR0b24udGV4dENvbnRlbnQgPSAnTmV4dCc7XG4gICAgY29uc3QgZGlhbG9nVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWhlYWRlciBoMicpO1xuICAgIGRpYWxvZ1RpdGxlLnRleHRDb250ZW50ID0gJ1BsYWNlIHlvdXIgc2hpcHMgQ2FwdGFpbiAxISc7XG4gIH0sXG4gIHNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBkaWFsb2dQbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcycpO1xuICAgIGRpYWxvZ1BsYWNlLnNob3dNb2RhbCgpO1xuICAgIG11bHRpcGxheWVyLmRyYWdBbmREcm9wKHBsYXllcjEpO1xuICAgIG11bHRpcGxheWVyLmFkZEV2ZW50TGlzdGVuZXJzKHBsYXllcjEsIHBsYXllcjIpO1xuICB9LFxuICBhZGRFdmVudExpc3RlbmVycyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgY29uc3Qgb2xkU3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMgLnN0YXJ0Jyk7XG4gICAgY29uc3Qgc3RhcnRCdXR0b24gPSBvbGRTdGFydEJ1dHRvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgb2xkU3RhcnRCdXR0b24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc3RhcnRCdXR0b24sIG9sZFN0YXJ0QnV0dG9uKTtcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRpYWxvZ1BsYWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzJyk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBsZXQgY2FuU3RhcnQ7XG4gICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICBpZiAoYm9hdC5kcmFnZ2FibGUgPT09IHRydWUpIGNhblN0YXJ0ID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIGlmIChjYW5TdGFydCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgIGlmICh0aGlzLnBsYXllclBsYWNpbmcgPT09IDEpIHtcbiAgICAgICAgY29uc3QgZGlhbG9nVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWhlYWRlciBoMicpO1xuICAgICAgICBkaWFsb2dUaXRsZS50ZXh0Q29udGVudCA9ICdQbGFjZSB5b3VyIHNoaXBzIENhcHRhaW4gMiEnO1xuICAgICAgICBzdGFydEJ1dHRvbi50ZXh0Q29udGVudCA9ICdTdGFydCc7XG4gICAgICAgIHRoaXMucGxheWVyUGxhY2luZyA9IDI7XG4gICAgICAgIHRoaXMuc2hvd1N0YXJ0aW5nRGlhbG9nKHBsYXllcjIsIHBsYXllcjEpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBkaWFsb2dQbGFjZS5jbG9zZSgpO1xuICAgICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVHcmlkKHBsYXllcjIuZ2V0R3JpZCgpKTtcbiAgICAgIG11bHRpcGxheWVyLnBvcHVsYXRlRW5lbXlHcmlkKHBsYXllcjIsIHBsYXllcjEpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb2xkQ2hEaXJlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGlyZWN0aW9uJyk7XG4gICAgY29uc3QgY2hEaXJlY3Rpb24gPSBvbGRDaERpcmVjdGlvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgb2xkQ2hEaXJlY3Rpb24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2hEaXJlY3Rpb24sIG9sZENoRGlyZWN0aW9uKTtcbiAgICBjaERpcmVjdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGJvYXREcmFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvYXRzLWRyYWcnKTtcbiAgICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIGJvYXREcmFnLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgICAgYm9hdC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9hdERyYWcuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKTtcbiAgICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgICBib2F0LmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IG9sZFJhbmRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yYW5kb20nKTtcbiAgICBjb25zdCByYW5kb20gPSBvbGRSYW5kb20uY2xvbmVOb2RlKHRydWUpO1xuICAgIG9sZFJhbmRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChyYW5kb20sIG9sZFJhbmRvbSk7XG4gICAgcmFuZG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgcGxheWVyMS5lbXB0eUdyaWQoKTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDUpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oNCk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oMik7XG4gICAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUdyaWQocGxheWVyMS5nZXRHcmlkKCksIHRydWUpO1xuICAgICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgY29uc3Qgb2xkQm9hdCA9IGJvYXQ7XG4gICAgICAgIGNvbnN0IG5ld0JvYXQgPSBvbGRCb2F0LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgb2xkQm9hdC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdCb2F0LCBvbGRCb2F0KTtcbiAgICAgICAgbmV3Qm9hdC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgbmV3Qm9hdC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHJlc2V0RXZlcnl0aGluZygpIHtcbiAgICB0aGlzLnBsYXllcjEgPSBudWxsO1xuICAgIHRoaXMucGxheWVyMiA9IG51bGw7XG4gICAgdGhpcy5wbGF5ZXJQbGFjaW5nID0gMTtcbiAgICB0aGlzLmRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG11bHRpcGxheWVyO1xuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tICcuL2dhbWVib2FyZCc7XG5cbmNvbnN0IFBsYXllciA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gR2FtZWJvYXJkKCk7XG5cbiAgY29uc3QgYWxsU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLmFsbFN1bmsoKTtcbiAgfTtcblxuICBjb25zdCB3aW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdJIHdvbic7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gZnVuY3Rpb24gKHN0YXJ0LCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoc3RhcnQsIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXBSYW5kb20gPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgZ2FtZWJvYXJkLnBsYWNlU2hpcFJhbmRvbShsZW5ndGgpO1xuICB9O1xuXG4gIGNvbnN0IGdldEdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5nZXRHcmlkKCk7XG4gIH07XG5cbiAgY29uc3QgZW1wdHlHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgIGdhbWVib2FyZC5lbXB0eUdyaWQoKTtcbiAgfTtcblxuICBjb25zdCBjb3VudEJvYXRzQWxpdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5jb3VudEJvYXRzQWxpdmUoKTtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlSGl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoeCwgeSk7XG4gIH07XG5cbiAgY29uc3QgYXR0YWNrID0gZnVuY3Rpb24gKHBsYXllciwgeCwgeSkge1xuICAgIGNvbnN0IGhpdCA9IHBsYXllci5yZWNlaXZlSGl0KHgsIHkpO1xuICAgIGlmIChwbGF5ZXIuYWxsU3VuaygpKSB7XG4gICAgICByZXR1cm4gd2luKCk7XG4gICAgfVxuICAgIHJldHVybiBoaXQ7XG4gIH07XG5cbiAgY29uc3QgcmFuZG9tQXR0YWNrID0gZnVuY3Rpb24gKHBsYXllcikge1xuICAgIGxldCB4O1xuICAgIGxldCB5O1xuICAgIGRvIHtcbiAgICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIH0gd2hpbGUgKHR5cGVvZiBwbGF5ZXIuZ2V0R3JpZCgpW3hdW3ldICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KHBsYXllci5nZXRHcmlkKClbeF1beV0pKTtcbiAgICByZXR1cm4gYXR0YWNrKHBsYXllciwgeCwgeSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBudW1iZXIsXG4gICAgYWxsU3VuayxcbiAgICBwbGFjZVNoaXAsXG4gICAgZ2V0R3JpZCxcbiAgICByZWNlaXZlSGl0LFxuICAgIGF0dGFjayxcbiAgICB3aW4sXG4gICAgcmFuZG9tQXR0YWNrLFxuICAgIGNvdW50Qm9hdHNBbGl2ZSxcbiAgICBwbGFjZVNoaXBSYW5kb20sXG4gICAgZW1wdHlHcmlkLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY29uc3QgU2hpcCA9IGZ1bmN0aW9uIGNyZWF0ZVNoaXAoc2hpcExlbmd0aCkge1xuICBjb25zdCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xuICBsZXQgaGl0cyA9IDA7XG4gIGNvbnN0IGFkZEhpdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBoaXRzICs9IDE7XG4gICAgcmV0dXJuIGhpdHM7XG4gIH07XG4gIGNvbnN0IGlzU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGl0cyA9PT0gbGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHJldHVybiB7IGxlbmd0aCwgYWRkSGl0LCBpc1N1bmsgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIiosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gfVxcbiBcXG5cXG4qIHtcXG5tYXJnaW46IDA7XFxucGFkZGluZzogMDtcXG59XFxuXFxuXFxuYm9keSB7XFxubGluZS1oZWlnaHQ6IDEuNTtcXG4td2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG5mb250LWZhbWlseTogJ1J1YmlrIEJ1YmJsZXMnLCBDb3VyaWVyLCBtb25vc3BhY2U7XFxufVxcblxcblxcbmltZywgcGljdHVyZSwgdmlkZW8sIGNhbnZhcywgc3ZnIHtcXG5kaXNwbGF5OiBibG9jaztcXG5tYXgtd2lkdGg6IDEwMCU7XFxufVxcblxcblxcbmlucHV0LCBidXR0b24sIHRleHRhcmVhLCBzZWxlY3Qge1xcbmZvbnQ6IGluaGVyaXQ7XFxufVxcblxcblxcbnAsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcbm92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XFxufVxcblxcblxcbmJ1dHRvbiwgYXtcXG5jdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcblxcbmF7XFxuICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5cXG5cXG5cXG4vKiBGb290ZXIgKi9cXG5cXG5cXG5odG1sIHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbnBvc2l0aW9uOiByZWxhdGl2ZTtcXG5taW4taGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5cXG5ib2R5IHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbm1hcmdpbi1ib3R0b206IDQ4cHg7XFxufVxcblxcblxcbi5mb290ZXIge1xcbnBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5ib3R0b206IDA7XFxubGVmdDogMDtcXG5kaXNwbGF5OiBmbGV4O1xcbmFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuanVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuZ2FwOiAxMHB4O1xcbndpZHRoOiAxMDAlO1xcbnBhZGRpbmc6IDEwcHg7XFxuYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMThweDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1YiB7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMjJweDtcXG50cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1Yjpob3ZlciB7XFxudHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKSBzY2FsZSgxLjIpO1xcbn1cXG5cXG4vKiBTdHlsaW5nICovXFxuXFxuOnJvb3R7XFxuIC0taGVhZGVyLWJnOiAjM0QzRDNEO1xcbiAtLW1haW4tYmc6IzMwMzAzMDtcXG4gLS10ZXh0OiNGRkZGRkY7XFxuIC0tZ3JpZC1ib3JkZXJzOiMwMDJDNjY7XFxuIC0tZ3JpZC1zcXVhcmVzOiMyMzg5REE7XFxuIC0tbXktYm9hdHM6IzgwODA4MDtcXG4gLS1teS1ib2F0cy1ib3JkZXI6IzQ2NDY0NjtcXG4gLS1zaGlwLWhpdDojRjgyNzI3O1xcbiAtLXNoaXAtc3VuazojRDE2MDYwO1xcbiAtLWdyZWVuLXRleHQ6IzJCQzU1NztcXG4gLS1yZWQtdGV4dDojRTIzNjM2O1xcbn1cXG5cXG5ib2R5IHtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG5oZWFkZXJ7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGVhZGVyLWJnKTtcXG4gICBmbGV4OiAxO1xcbn1cXG5cXG5oMXtcXG4gICBmb250LXNpemU6IDIuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbn1cXG5cXG5tYWlue1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIGZsZXg6IDc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1dmg7XFxuICAgcGFkZGluZzogNXZoIDBweDtcXG59XFxuXFxuLnR1cm5ze1xcbiAgIHBhZGRpbmc6IDEwcHggMzBweDtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgZm9udC1zaXplOiAycmVtOztcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4udHVybnMucmVkIHtcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbiAgIGJvcmRlcjogMnB4IHJpZGdlIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmdyaWQtY29udGFpbmVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdnc7XFxufVxcblxcbi53cmFwcGVye1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ubnVtYmVyLXdyYXBwZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ueS13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBnYXA6IDVweDtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXN7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIG1pbi1oZWlnaHQ6IDcwdmg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXMgcHtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uZ3JpZCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhc3BlY3QtcmF0aW86IDEvMTtcXG4gICBoZWlnaHQ6IDcwdmg7XFxuICAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tZ3JpZC1ib3JkZXJzKTtcXG4gICBib3JkZXItcmFkaXVzOiA2cHg7XFxufVxcblxcbi54LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IDcwdmg7XFxuICAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi54LWNvb3JkaW5hdGVzIHB7XFxuICAgd2lkdGg6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5saW5le1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICB3aWR0aDogMTAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG59XFxuXFxuLnNxdWFyZXtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMCU7XFxuICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XFxufVxcblxcblxcblxcbiNncmlkMiAuc3F1YXJlLmVtcHR5OmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxMTAsIDgsIDE5NCk7XFxuICAgY3Vyc29yOmNyb3NzaGFpcjtcXG59XFxuXFxuLnNxdWFyZS5zaGlwe1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XFxuXFxuLnNxdWFyZS53YXRlcntcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDJyZW07XFxufVxcblxcbi5zcXVhcmUuaGl0IHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLWhpdCk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgZm9udC13ZWlnaHQ6IDgwMDtcXG59XFxuXFxuLnNxdWFyZS5zdW5rIHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLXN1bmspO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5pbmZve1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mbyAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mby5yZWR7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmluZm8ucmVkIC5zaGlwcy1hbGl2ZXtcXG4gICBib3JkZXItdG9wOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5cXG5cXG5cXG5kaWFsb2d7XFxuICAgdG9wOiA1MCU7XFxuICAgbGVmdDogNTAlO1xcbiAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgIGhlaWdodDogNTB2aDtcXG4gICB3aWR0aDogMTAwdnc7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1iZyk7XFxuICAgb3BhY2l0eTogMC45O1xcbiAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlc21va2U7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuXFxuXFxuLmRpYWxvZy1jb250YWluZXJ7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMDAlO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgIGdhcDogMTB2aDtcXG59XFxuXFxuLndpbm5lcntcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIHBhZGRpbmc6IDIwcHg7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuLndpbm5lci50d297XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbmJ1dHRvbntcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IG5vbmU7XFxuICAgb3V0bGluZTogbm9uZTtcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgIHBhZGRpbmc6IDEwcHg7XFxuICAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIDtcXG59XFxuXFxuYnV0dG9uOmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMge1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgbWluLWhlaWdodDogMTAwdmg7XFxuICAgb3BhY2l0eTogMC45ODtcXG4gICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuZGlhbG9nLWNvbnRhaW5lcntcXG4gICBnYXA6IDJ2aDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5kaWFsb2ctaGVhZGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZ2FwOiA4dnc7XFxufVxcblxcbmgye1xcbiAgIGZvbnQtc2l6ZTogMS44cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA0MDA7XFxufVxcblxcbiNkaXJlY3Rpb24ge1xcbiAgIHBhZGRpbmc6IDVweDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC53cmFwcGVyIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgIGdhcDogNXZ3O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdHMtZHJhZyB7XFxuICAgd2lkdGg6IDIwdjtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgZ2FwOiAzdmg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdHMtZHJhZy52ZXJ0aWNhbCB7XFxuICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICBnYXA6IDN2dztcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0LXdyYXBwZXIge1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQudmVydGljYWwge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24tc2VsZjogY2VudGVyO1xcbn1cXG5cXG4uYm9hdCAuYm9hdC1zcXVhcmUge1xcbiAgIGZsZXg6IG5vbmU7XFxuICAgd2lkdGg6IDd2aDtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcblxcbi53YXRlci1kaWFsb2d7XFxuICAgb3BhY2l0eTogMDtcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBmb250LXNpemU6IDRyZW07XFxuICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzO1xcbiAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLndhdGVyLWRpYWxvZy5zaG93e1xcbiAgIG9wYWNpdHk6IDE7XFxufVxcblxcbi5jaG9vc2UtZ2FtZXtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZm9udC1zaXplOiA0cmVtO1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgbWluLWhlaWdodDogMTAwdmg7XFxuICAgbWluLXdpZHRoOiAxMDB2dztcXG4gICBvcGFjaXR5OiAxO1xcbn1cXG5cXG4uY2hvb3NlLWdhbWUgYnV0dG9uIHtcXG4gICBmb250LXNpemU6IDJyZW07XFxuICAgcGFkZGluZzogMjBweDtcXG4gICBib3JkZXItcmFkaXVzOiAyLjVyZW07XFxufVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxzQkFBc0I7Q0FDdkI7OztBQUdEO0FBQ0EsU0FBUztBQUNULFVBQVU7QUFDVjs7O0FBR0E7QUFDQSxnQkFBZ0I7QUFDaEIsbUNBQW1DO0FBQ25DLGdEQUFnRDtBQUNoRDs7O0FBR0E7QUFDQSxjQUFjO0FBQ2QsZUFBZTtBQUNmOzs7QUFHQTtBQUNBLGFBQWE7QUFDYjs7O0FBR0E7QUFDQSx5QkFBeUI7QUFDekI7OztBQUdBO0FBQ0EsZUFBZTtBQUNmOzs7QUFHQTtHQUNHLHFCQUFxQjtBQUN4Qjs7Ozs7QUFLQSxXQUFXOzs7QUFHWDtBQUNBLG1CQUFtQjtBQUNuQixrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBLG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkI7OztBQUdBO0FBQ0Esa0JBQWtCO0FBQ2xCLFNBQVM7QUFDVCxPQUFPO0FBQ1AsYUFBYTtBQUNiLG1CQUFtQjtBQUNuQix1QkFBdUI7QUFDdkIsU0FBUztBQUNULFdBQVc7QUFDWCxhQUFhO0FBQ2IsdUJBQXVCO0FBQ3ZCLFlBQVk7QUFDWixlQUFlO0FBQ2Y7OztBQUdBO0FBQ0EsWUFBWTtBQUNaLGVBQWU7QUFDZixzQ0FBc0M7QUFDdEM7OztBQUdBO0FBQ0Esb0NBQW9DO0FBQ3BDOztBQUVBLFlBQVk7O0FBRVo7Q0FDQyxvQkFBb0I7Q0FDcEIsaUJBQWlCO0NBQ2pCLGNBQWM7Q0FDZCxzQkFBc0I7Q0FDdEIsc0JBQXNCO0NBQ3RCLGtCQUFrQjtDQUNsQix5QkFBeUI7Q0FDekIsa0JBQWtCO0NBQ2xCLG1CQUFtQjtDQUNuQixvQkFBb0I7Q0FDcEIsa0JBQWtCO0FBQ25COztBQUVBO0dBQ0csa0JBQWtCO0dBQ2xCLGFBQWE7R0FDYixzQkFBc0I7R0FDdEIsaUJBQWlCO0FBQ3BCOztBQUVBO0dBQ0csZ0JBQWdCO0dBQ2hCLGFBQWE7R0FDYixtQkFBbUI7R0FDbkIsa0NBQWtDO0dBQ2xDLE9BQU87QUFDVjs7QUFFQTtHQUNHLGlCQUFpQjtHQUNqQixnQkFBZ0I7QUFDbkI7O0FBRUE7R0FDRyxnQ0FBZ0M7R0FDaEMsT0FBTztHQUNQLGFBQWE7R0FDYixzQkFBc0I7R0FDdEIsbUJBQW1CO0dBQ25CLFFBQVE7R0FDUixnQkFBZ0I7QUFDbkI7O0FBRUE7R0FDRyxrQkFBa0I7R0FDbEIsbUNBQW1DO0dBQ25DLHdCQUF3QjtHQUN4QixlQUFlO0dBQ2YsbUJBQW1CO0FBQ3RCOztBQUVBO0dBQ0csc0JBQXNCO0dBQ3RCLGlDQUFpQztBQUNwQzs7QUFFQTtHQUNHLGFBQWE7R0FDYixtQkFBbUI7R0FDbkIsdUJBQXVCO0dBQ3ZCLFNBQVM7QUFDWjs7QUFFQTtHQUNHLFlBQVk7R0FDWixzQkFBc0I7QUFDekI7O0FBRUE7R0FDRyxhQUFhO0dBQ2Isc0JBQXNCO0FBQ3pCOztBQUVBO0dBQ0csYUFBYTtHQUNiLG1CQUFtQjtHQUNuQixRQUFRO0FBQ1g7O0FBRUE7R0FDRyxhQUFhO0dBQ2Isc0JBQXNCO0dBQ3RCLGlCQUFpQjtHQUNqQixnQkFBZ0I7R0FDaEIsbUJBQW1CO0FBQ3RCOztBQUVBO0dBQ0csV0FBVztHQUNYLGtCQUFrQjtHQUNsQixhQUFhO0dBQ2IsbUJBQW1CO0dBQ25CLHVCQUF1QjtBQUMxQjs7QUFFQTtHQUNHLGFBQWE7R0FDYixpQkFBaUI7R0FDakIsWUFBWTtHQUNaLHFDQUFxQztHQUNyQyxrQkFBa0I7QUFDckI7O0FBRUE7R0FDRyxhQUFhO0dBQ2IsV0FBVztHQUNYLG9CQUFvQjtHQUNwQixpQkFBaUI7R0FDakIsdUJBQXVCO0FBQzFCOztBQUVBO0dBQ0csVUFBVTtHQUNWLGtCQUFrQjtBQUNyQjs7QUFFQTtHQUNHLGFBQWE7R0FDYixzQkFBc0I7R0FDdEIsVUFBVTtHQUNWLFlBQVk7QUFDZjs7QUFFQTtHQUNHLHFDQUFxQztHQUNyQyxxQ0FBcUM7R0FDckMsV0FBVztHQUNYLFdBQVc7R0FDWCxzQ0FBc0M7QUFDekM7Ozs7QUFJQTtHQUNHLGtDQUFrQztHQUNsQyxnQkFBZ0I7QUFDbkI7O0FBRUE7R0FDRyxpQ0FBaUM7R0FDakMsd0NBQXdDO0dBQ3hDLGtCQUFrQjtBQUNyQjs7QUFFQTtHQUNHLGFBQWE7R0FDYixxQkFBcUI7R0FDckIsZUFBZTtBQUNsQjs7QUFFQTtHQUNHLGlDQUFpQztHQUNqQyx3Q0FBd0M7R0FDeEMsYUFBYTtHQUNiLHFCQUFxQjtHQUNyQixlQUFlO0dBQ2YsZ0JBQWdCO0FBQ25COztBQUVBO0dBQ0csa0NBQWtDO0dBQ2xDLHdDQUF3QztHQUN4QyxhQUFhO0dBQ2IscUJBQXFCO0dBQ3JCLGVBQWU7R0FDZixnQkFBZ0I7QUFDbkI7O0FBRUE7R0FDRyxhQUFhO0dBQ2Isc0JBQXNCO0dBQ3RCLG1CQUFtQjtHQUNuQixpQkFBaUI7R0FDakIsZ0JBQWdCO0dBQ2hCLHdCQUF3QjtBQUMzQjs7QUFFQTtHQUNHLHVDQUF1QztBQUMxQzs7QUFFQTtHQUNHLHNCQUFzQjtBQUN6Qjs7QUFFQTtHQUNHLHFDQUFxQztBQUN4Qzs7Ozs7QUFLQTtHQUNHLFFBQVE7R0FDUixTQUFTO0dBQ1QsZ0NBQWdDO0dBQ2hDLFlBQVk7R0FDWixZQUFZO0dBQ1osZ0NBQWdDO0dBQ2hDLFlBQVk7R0FDWiw0QkFBNEI7R0FDNUIsbUJBQW1CO0FBQ3RCOzs7O0FBSUE7R0FDRyxXQUFXO0dBQ1gsWUFBWTtHQUNaLGFBQWE7R0FDYixzQkFBc0I7R0FDdEIsbUJBQW1CO0dBQ25CLHVCQUF1QjtHQUN2QixTQUFTO0FBQ1o7O0FBRUE7R0FDRyxlQUFlO0dBQ2Ysd0JBQXdCO0dBQ3hCLGFBQWE7R0FDYixtQ0FBbUM7R0FDbkMsbUJBQW1CO0FBQ3RCOztBQUVBO0dBQ0csc0JBQXNCO0dBQ3RCLGlDQUFpQztBQUNwQzs7QUFFQTtHQUNHLGlCQUFpQjtHQUNqQixrQkFBa0I7R0FDbEIscUNBQXFDO0dBQ3JDLFlBQVk7R0FDWixhQUFhO0dBQ2IsbUJBQW1CO0dBQ25CLGFBQWE7R0FDYixzQkFBc0I7QUFDekI7O0FBRUE7R0FDRyw2QkFBNkI7R0FDN0IsMEJBQTBCO0FBQzdCOzs7QUFHQTtHQUNHLGdCQUFnQjtHQUNoQixpQkFBaUI7R0FDakIsYUFBYTtHQUNiLFlBQVk7QUFDZjs7QUFFQTtHQUNHLFFBQVE7QUFDWDs7QUFFQTtHQUNHLGFBQWE7R0FDYixRQUFRO0FBQ1g7O0FBRUE7R0FDRyxpQkFBaUI7R0FDakIsZ0JBQWdCO0FBQ25COztBQUVBO0dBQ0csWUFBWTtBQUNmOztBQUVBO0dBQ0csbUJBQW1CO0dBQ25CLFFBQVE7R0FDUixtQkFBbUI7QUFDdEI7OztBQUdBO0dBQ0csVUFBVTtHQUNWLGFBQWE7R0FDYixzQkFBc0I7R0FDdEIsUUFBUTtBQUNYOztBQUVBO0dBQ0csbUJBQW1CO0dBQ25CLFFBQVE7QUFDWDs7QUFFQTtHQUNHLFlBQVk7R0FDWixzQkFBc0I7QUFDekI7O0FBRUE7R0FDRyxhQUFhO0dBQ2Isa0JBQWtCO0FBQ3JCOztBQUVBO0dBQ0csc0JBQXNCO0dBQ3RCLGtCQUFrQjtBQUNyQjs7QUFFQTtHQUNHLFVBQVU7R0FDVixVQUFVO0dBQ1YsV0FBVztHQUNYLGlDQUFpQztHQUNqQyx3Q0FBd0M7R0FDeEMsa0JBQWtCO0FBQ3JCOztBQUVBO0dBQ0csVUFBVTtHQUNWLGdCQUFnQjtHQUNoQixpQkFBaUI7R0FDakIsa0JBQWtCO0dBQ2xCLGVBQWU7R0FDZix3QkFBd0I7R0FDeEIsa0JBQWtCO0FBQ3JCOztBQUVBO0dBQ0csVUFBVTtBQUNiOztBQUVBO0dBQ0csa0JBQWtCO0dBQ2xCLGVBQWU7R0FDZixnQkFBZ0I7R0FDaEIsaUJBQWlCO0dBQ2pCLGdCQUFnQjtHQUNoQixVQUFVO0FBQ2I7O0FBRUE7R0FDRyxlQUFlO0dBQ2YsYUFBYTtHQUNiLHFCQUFxQjtBQUN4QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuIH1cXG4gXFxuXFxuKiB7XFxubWFyZ2luOiAwO1xcbnBhZGRpbmc6IDA7XFxufVxcblxcblxcbmJvZHkge1xcbmxpbmUtaGVpZ2h0OiAxLjU7XFxuLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxuZm9udC1mYW1pbHk6ICdSdWJpayBCdWJibGVzJywgQ291cmllciwgbW9ub3NwYWNlO1xcbn1cXG5cXG5cXG5pbWcsIHBpY3R1cmUsIHZpZGVvLCBjYW52YXMsIHN2ZyB7XFxuZGlzcGxheTogYmxvY2s7XFxubWF4LXdpZHRoOiAxMDAlO1xcbn1cXG5cXG5cXG5pbnB1dCwgYnV0dG9uLCB0ZXh0YXJlYSwgc2VsZWN0IHtcXG5mb250OiBpbmhlcml0O1xcbn1cXG5cXG5cXG5wLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXG5vdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xcbn1cXG5cXG5cXG5idXR0b24sIGF7XFxuY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5cXG5he1xcbiAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuXFxuXFxuXFxuLyogRm9vdGVyICovXFxuXFxuXFxuaHRtbCB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5wb3NpdGlvbjogcmVsYXRpdmU7XFxubWluLWhlaWdodDogMTAwJTtcXG59XFxuXFxuXFxuYm9keSB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5tYXJnaW4tYm90dG9tOiA0OHB4O1xcbn1cXG5cXG5cXG4uZm9vdGVyIHtcXG5wb3NpdGlvbjogYWJzb2x1dGU7XFxuYm90dG9tOiAwO1xcbmxlZnQ6IDA7XFxuZGlzcGxheTogZmxleDtcXG5hbGlnbi1pdGVtczogY2VudGVyO1xcbmp1c3RpZnktY29udGVudDogY2VudGVyO1xcbmdhcDogMTBweDtcXG53aWR0aDogMTAwJTtcXG5wYWRkaW5nOiAxMHB4O1xcbmJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDE4cHg7XFxufVxcblxcblxcbi5mYS1naXRodWIge1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDIycHg7XFxudHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxufVxcblxcblxcbi5mYS1naXRodWI6aG92ZXIge1xcbnRyYW5zZm9ybTogcm90YXRlKDM2MGRlZykgc2NhbGUoMS4yKTtcXG59XFxuXFxuLyogU3R5bGluZyAqL1xcblxcbjpyb290e1xcbiAtLWhlYWRlci1iZzogIzNEM0QzRDtcXG4gLS1tYWluLWJnOiMzMDMwMzA7XFxuIC0tdGV4dDojRkZGRkZGO1xcbiAtLWdyaWQtYm9yZGVyczojMDAyQzY2O1xcbiAtLWdyaWQtc3F1YXJlczojMjM4OURBO1xcbiAtLW15LWJvYXRzOiM4MDgwODA7XFxuIC0tbXktYm9hdHMtYm9yZGVyOiM0NjQ2NDY7XFxuIC0tc2hpcC1oaXQ6I0Y4MjcyNztcXG4gLS1zaGlwLXN1bms6I0QxNjA2MDtcXG4gLS1ncmVlbi10ZXh0OiMyQkM1NTc7XFxuIC0tcmVkLXRleHQ6I0UyMzYzNjtcXG59XFxuXFxuYm9keSB7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuaGVhZGVye1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhlYWRlci1iZyk7XFxuICAgZmxleDogMTtcXG59XFxuXFxuaDF7XFxuICAgZm9udC1zaXplOiAyLjVyZW07XFxuICAgZm9udC13ZWlnaHQ6IDUwMDtcXG59XFxuXFxubWFpbntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWJnKTtcXG4gICBmbGV4OiA3O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGdhcDogNXZoO1xcbiAgIHBhZGRpbmc6IDV2aCAwcHg7XFxufVxcblxcbi50dXJuc3tcXG4gICBwYWRkaW5nOiAxMHB4IDMwcHg7XFxuICAgYm9yZGVyOiAycHggcmlkZ2UgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogMnJlbTs7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnR1cm5zLnJlZCB7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5ncmlkLWNvbnRhaW5lcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgZ2FwOiAxMHZ3O1xcbn1cXG5cXG4ud3JhcHBlcntcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLm51bWJlci13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnktd3JhcHBlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1cHg7XFxufVxcblxcbi55LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBtaW4taGVpZ2h0OiA3MHZoO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi55LWNvb3JkaW5hdGVzIHB7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmdyaWQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYXNwZWN0LXJhdGlvOiAxLzE7XFxuICAgaGVpZ2h0OiA3MHZoO1xcbiAgIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgYm9yZGVyLXJhZGl1czogNnB4O1xcbn1cXG5cXG4ueC1jb29yZGluYXRlc3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiA3MHZoO1xcbiAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4ueC1jb29yZGluYXRlcyBwe1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ubGluZXtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgd2lkdGg6IDEwJTtcXG4gICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbi5zcXVhcmV7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1ncmlkLWJvcmRlcnMpO1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAlO1xcbiAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xcbn1cXG5cXG5cXG5cXG4jZ3JpZDIgLnNxdWFyZS5lbXB0eTpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTEwLCA4LCAxOTQpO1xcbiAgIGN1cnNvcjpjcm9zc2hhaXI7XFxufVxcblxcbi5zcXVhcmUuc2hpcHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcblxcbi5zcXVhcmUud2F0ZXJ7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAycmVtO1xcbn1cXG5cXG4uc3F1YXJlLmhpdCB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1oaXQpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5zcXVhcmUuc3VuayB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1zdW5rKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBmb250LXdlaWdodDogODAwO1xcbn1cXG5cXG4uaW5mb3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8gLnNoaXBzLWFsaXZle1xcbiAgIGJvcmRlci10b3A6IDJweCBzb2xpZCB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8ucmVke1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5pbmZvLnJlZCAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuXFxuXFxuXFxuZGlhbG9ne1xcbiAgIHRvcDogNTAlO1xcbiAgIGxlZnQ6IDUwJTtcXG4gICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gICBoZWlnaHQ6IDUwdmg7XFxuICAgd2lkdGg6IDEwMHZ3O1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIG9wYWNpdHk6IDAuOTtcXG4gICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZXNtb2tlO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcblxcblxcbi5kaWFsb2ctY29udGFpbmVye1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdmg7XFxufVxcblxcbi53aW5uZXJ7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBwYWRkaW5nOiAyMHB4O1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcbi53aW5uZXIudHdve1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5idXR0b257XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxuICAgYm9yZGVyOiBub25lO1xcbiAgIG91dGxpbmU6IG5vbmU7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICBwYWRkaW5nOiAxMHB4O1xcbiAgIHRyYW5zaXRpb246IDAuM3MgZWFzZSA7XFxufVxcblxcbmJ1dHRvbjpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG59XFxuXFxuXFxuLnBsYWNlLXNoaXBzIHtcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIG9wYWNpdHk6IDAuOTg7XFxuICAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmRpYWxvZy1jb250YWluZXJ7XFxuICAgZ2FwOiAydmg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuZGlhbG9nLWhlYWRlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGdhcDogOHZ3O1xcbn1cXG5cXG5oMntcXG4gICBmb250LXNpemU6IDEuOHJlbTtcXG4gICBmb250LXdlaWdodDogNDAwO1xcbn1cXG5cXG4jZGlyZWN0aW9uIHtcXG4gICBwYWRkaW5nOiA1cHg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAud3JhcHBlciB7XFxuICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICBnYXA6IDV2dztcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXRzLWRyYWcge1xcbiAgIHdpZHRoOiAyMHY7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGdhcDogM3ZoO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXRzLWRyYWcudmVydGljYWwge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgZ2FwOiAzdnc7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdC13cmFwcGVyIHtcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0IHtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiBmaXQtY29udGVudDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0LnZlcnRpY2FsIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXG59XFxuXFxuLmJvYXQgLmJvYXQtc3F1YXJlIHtcXG4gICBmbGV4OiBub25lO1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXktYm9hdHMpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgYm9yZGVyLXJhZGl1czogOHB4O1xcbn1cXG5cXG4ud2F0ZXItZGlhbG9ne1xcbiAgIG9wYWNpdHk6IDA7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZm9udC1zaXplOiA0cmVtO1xcbiAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC41cztcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi53YXRlci1kaWFsb2cuc2hvd3tcXG4gICBvcGFjaXR5OiAxO1xcbn1cXG5cXG4uY2hvb3NlLWdhbWV7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogNHJlbTtcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIG1pbi13aWR0aDogMTAwdnc7XFxuICAgb3BhY2l0eTogMTtcXG59XFxuXFxuLmNob29zZS1nYW1lIGJ1dHRvbiB7XFxuICAgZm9udC1zaXplOiAycmVtO1xcbiAgIHBhZGRpbmc6IDIwcHg7XFxuICAgYm9yZGVyLXJhZGl1czogMi41cmVtO1xcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGU7IH07XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG5nYW1lLmNob29zZUdhbWUoKTtcbiJdLCJuYW1lcyI6WyJjcmVhdGVHcmlkIiwibiIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImdyaWQiLCJpIiwiaiIsIkV2ZW50SGFuZGxlciIsImRvbSIsImRpcmVjdGlvbiIsInNob3dHcmlkIiwiZ3JpZENvbnRhaW5lciIsInBsYXllck51bWJlciIsImlubmVySFRNTCIsImZvckVhY2giLCJsaW5lIiwiZGl2IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwic2xvdCIsInNxdWFyZSIsIkFycmF5IiwiaXNBcnJheSIsInN1bmsiLCJpc1N1bmsiLCJ0ZXh0Q29udGVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvblNxdWFyZUNsaWNrZWQiLCJhcHBlbmRDaGlsZCIsInBvcHVsYXRlR3JpZCIsInN0YXJ0IiwicXVlcnlTZWxlY3RvciIsInBvcHVsYXRlRW5lbXlHcmlkIiwicGxheWVyMSIsInBsYXllcjIiLCJnZXRHcmlkIiwiZGVsYXkiLCJtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsInRvZ2dsZVR1cm4iLCJkaXZUdXJucyIsImN1cnJlbnRUdXJuIiwic3Vic3RyaW5nIiwidXBkYXRlQm9hdHNBbGl2ZSIsInBsYXllck51bSIsInBhcmEiLCJib2F0c0FsaXZlIiwiY291bnRCb2F0c0FsaXZlIiwiZHJhZ0FuZERyb3AiLCJwbGF5ZXIiLCJib2F0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJib2F0Iiwib25EcmFnIiwiZHJhZ2dhYmxlIiwic3R5bGUiLCJvcGFjaXR5IiwiYWRkR3JpZExpc3RlbmVycyIsInByZXBhcmVOZXdHYW1lIiwic2hpcHNBbGl2ZSIsInNob3dTdGFydGluZ0RpYWxvZyIsImRpYWxvZ1BsYWNlIiwic2hvd01vZGFsIiwiYWRkRXZlbnRMaXN0ZW5lcnMiLCJpc1Bvc2l0aW9uVmFsaWRGb3JTaGlwIiwiZ2FtZSIsIm9sZFN0YXJ0QnV0dG9uIiwic3RhcnRCdXR0b24iLCJyZW1vdmVFdmVudExpc3RlbmVycyIsIm9uU3RhcnRDbGljayIsIm9sZENoRGlyZWN0aW9uIiwiY2hEaXJlY3Rpb24iLCJvbkNoYW5nZURpcmVjdGlvbkNsaWNrIiwib2xkUmFuZG9tIiwicmFuZG9tIiwib25SYW5kb21DbGljayIsImVtcHR5R3JpZCIsInBsYWNlU2hpcFJhbmRvbSIsIm9sZEJvYXQiLCJuZXdCb2F0IiwiY2xvbmVOb2RlIiwicGFyZW50Tm9kZSIsInJlcGxhY2VDaGlsZCIsImJvYXREcmFnIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwiY2FuU3RhcnQiLCJjbG9zZSIsImV2ZW50IiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjdXJyZW50VGFyZ2V0IiwiY2hpbGRyZW4iLCJpZCIsInNxdWFyZXMiLCJwcmV2ZW50RGVmYXVsdCIsIm9uRHJvcCIsImpzb24iLCJnZXREYXRhIiwib2JqZWN0IiwicGFyc2UiLCJjb2x1bW4iLCJjbGlja2VkU3F1YXJlIiwiaW5kZXhZIiwicHJvdG90eXBlIiwiaW5kZXhPZiIsImNhbGwiLCJpbmRleFgiLCJwbGF5ZXJHcmlkIiwiaXNWYWxpZCIsInBsYWNlU2hpcCIsImRyYWdnZWRCb2F0IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwib2xkQnV0dG9uIiwiYnV0dG9uIiwiZW5lbXlHcmlkIiwiaGl0IiwiYXR0YWNrIiwiYWxsU3VuayIsIm9uV2luIiwicmFuZG9tQXR0YWNrIiwiZGlhbG9nV2luIiwicmVzdGFydCIsImNob29zZUdhbWUiLCJ0dXJucyIsIndpbm5lciIsIlBsYXllciIsIm11bHRpcGxheWVyIiwic3RhcnRHYW1lIiwic3RhcnRNdWx0aXBsYXllciIsInJlc2V0RXZlcnl0aGluZyIsInByZXBhcmVTdGFydGluZ0RpYWxvZyIsImNob29zZUdhbWVNb2RlIiwicGxheUNvbXB1dGVyIiwicGxheU90aGVyIiwiU2hpcCIsIkdhbWVib2FyZCIsImNyZWF0ZUdhbWVib2FyZCIsInNoaXBPYmoiLCJ4IiwieSIsIm51bSIsIk1hdGgiLCJyb3VuZCIsImZsb29yIiwicmVjZWl2ZUhpdCIsInZhbHVlIiwiYWRkSGl0IiwicmVzdWx0IiwiaW5jbHVkZXMiLCJwdXNoIiwiYXJyYXkiLCJzdXJyb3VuZGluZ0FycmF5IiwieDEiLCJ5MSIsIngyIiwieTIiLCJ4MyIsInkzIiwiZW1wdHkiLCJldmVyeSIsInN1cnJvdW5kaW5nRW1wdHkiLCJwbGF5ZXJQbGFjaW5nIiwic3F1YXJlQ2xpY2tlZCIsInBsYXllcldvbiIsInNob3dXYXRlckRpYWxvZyIsIndhdGVyRGlhbG9nIiwiY2xvc2VEaWFsb2ciLCJudW1iZXIiLCJhdHRhY2tlckRpdiIsImF0dGFja2VySW5mbyIsImRlZmVuZG9yRGl2IiwiZGVmZW5kb3JJbmZvIiwicGFyYTEiLCJib2F0c0FsaXZlMSIsInBhcmEyIiwiYm9hdHNBbGl2ZTIiLCJncmlkTGlzdGVuZXJzIiwiaXNFbXB0eSIsInN0YXJ0aW5nQnV0dG9uIiwiZGlhbG9nVGl0bGUiLCJnYW1lYm9hcmQiLCJ3aW4iLCJjcmVhdGVTaGlwIiwic2hpcExlbmd0aCIsImhpdHMiXSwic291cmNlUm9vdCI6IiJ9