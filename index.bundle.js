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
/* harmony import */ var _dragAndDrop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dragAndDrop */ "./src/dragAndDrop.js");


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
    (0,_dragAndDrop__WEBPACK_IMPORTED_MODULE_1__["default"])(player1);
    _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].addEventListeners(player1, player2);
  }
};
/* harmony default export */ __webpack_exports__["default"] = (dom);

/***/ }),

/***/ "./src/dragAndDrop.js":
/*!****************************!*\
  !*** ./src/dragAndDrop.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _eventHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventHandler */ "./src/eventHandler.js");

const dragAndDrop = function (player) {
  const boats = document.querySelectorAll('.boat');
  boats.forEach(boat => {
    boat.addEventListener('dragstart', _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].onDrag);
    boat.draggable = true;
    boat.style.opacity = '1';
  });
  _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].addGridListeners(player);
};
/* harmony default export */ __webpack_exports__["default"] = (dragAndDrop);

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
/* harmony import */ var _multiplayer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./multiplayer */ "./src/multiplayer.js");




const EventHandler = {
  addEventListeners(player1, player2) {
    let isMultiplayer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
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
  onMultiplayerStartClick() {
    const dialogPlace = document.querySelector('.place-ships');
    const boats = document.querySelectorAll('.boat');
    const startButton = document.querySelector('.place-ships .start');
    let canStart;
    boats.forEach(boat => {
      if (boat.draggable === true) canStart = false;
    });
    if (canStart === false) return;
    if (_multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].playerPlacing === 1) {
      const dialogTitle = document.querySelector('.dialog-header h2');
      dialogTitle.textContent = 'Place your ships Captain 2!';
      startButton.textContent = 'Start';
      _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].playerPlacing = 2;
      _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].showStartingDialog(EventHandler.player2, EventHandler.player1);
      return;
    }
    dialogPlace.close();
    _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].populateGrid(EventHandler.player2.getGrid());
    _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].populateEnemyGrid(EventHandler.player2, EventHandler.player1);
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
  },
  onMultiplayerSquareClicked: async event => {
    const enemyGrid = document.querySelector('#grid2');
    const column = event.currentTarget.parentNode;
    const clickedSquare = event.currentTarget;
    const indexY = Array.prototype.indexOf.call(column.children, clickedSquare);
    const indexX = Array.prototype.indexOf.call(enemyGrid.children, column);
    const hit = _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].player1.attack(_multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].player2, indexX, indexY);
    if (_multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].player2.allSunk() !== false) {
      return EventHandler.onWin(_multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].player1.number);
    }
    _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].populateEnemyGrid(_multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].player1, _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].player2);
    _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].updateBoatsAlive();
    if (hit === false) {
      _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].showWaterDialog();
      _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].populateGrid(_multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].player2.getGrid());
      _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].populateEnemyGrid(_multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].player2, _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].player1);
      _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].updateBoatsAlive();
      _multiplayer__WEBPACK_IMPORTED_MODULE_3__["default"].toggleTurn();
    }
    return false;
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
/* harmony import */ var _eventHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventHandler */ "./src/eventHandler.js");
/* harmony import */ var _showGrid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./showGrid */ "./src/showGrid.js");
/* harmony import */ var _dragAndDrop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dragAndDrop */ "./src/dragAndDrop.js");



const multiplayer = {
  direction: 'horizontal',
  playerPlacing: 1,
  populateGrid(grid) {
    let start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let gridContainer = document.querySelector('#grid1');
    if (start === true) {
      gridContainer = document.querySelector('#grid-place');
    }
    (0,_showGrid__WEBPACK_IMPORTED_MODULE_1__["default"])(gridContainer, grid, 1, true);
  },
  populateEnemyGrid(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    const gridContainer = document.querySelector('#grid2');
    const grid = this.player2.getGrid();
    (0,_showGrid__WEBPACK_IMPORTED_MODULE_1__["default"])(gridContainer, grid, 2, true);
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
    (0,_dragAndDrop__WEBPACK_IMPORTED_MODULE_2__["default"])(player1);
    _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].addEventListeners(player1, player2, true);
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

/***/ "./src/showGrid.js":
/*!*************************!*\
  !*** ./src/showGrid.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _eventHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventHandler */ "./src/eventHandler.js");

const showGrid = function (gridContainer, grid, playerNumber) {
  let isMultiplayer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
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
          if (isMultiplayer === true) {
            square.addEventListener('click', _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].onMultiplayerSquareClicked);
          } else {
            square.addEventListener('click', _eventHandler__WEBPACK_IMPORTED_MODULE_0__["default"].onSquareClicked);
          }
        }
      }
      div.appendChild(square);
    });
    gridContainer.appendChild(div);
  });
};
/* harmony default export */ __webpack_exports__["default"] = (showGrid);

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
___CSS_LOADER_EXPORT___.push([module.id, "*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.red{\n   color: var(--red-text);\n}\n\n.info.red .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\nbutton{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\nbutton:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n\n\n.place-ships {\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   opacity: 0.98;\n   color: white;\n}\n\n.place-ships .dialog-container{\n   gap: 2vh;\n}\n\n.place-ships .dialog-header{\n   display: flex;\n   gap: 8vw;\n}\n\nh2{\n   font-size: 1.8rem;\n   font-weight: 400;\n}\n\n#direction {\n   padding: 5px;\n}\n\n.place-ships .wrapper {\n   flex-direction: row;\n   gap: 5vw;\n   align-items: center;\n}\n\n\n.place-ships .boats-drag {\n   width: 20v;\n   display: flex;\n   flex-direction: column;\n   gap: 3vh;\n   cursor: pointer;\n}\n\n.place-ships .boats-drag.vertical {\n   flex-direction: row;\n   gap: 3vw;\n}\n\n.place-ships .boat-wrapper {\n   display:flex;\n   flex-direction: column;\n}\n\n.place-ships .boat {\n   display: flex;\n   width: fit-content;\n}\n\n.place-ships .boat.vertical {\n   flex-direction: column;\n   align-self: center;\n}\n\n.boat .boat-square {\n   flex: none;\n   width: 7vh;\n   height: 7vh;\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.water-dialog{\n   opacity: 0;\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   color: var(--text);\n   font-size: 4rem;\n   transition: opacity 0.5s;\n   text-align: center;\n}\n\n.water-dialog.show{\n   opacity: 1;\n}\n\n.choose-game{\n   color: var(--text);\n   font-size: 4rem;\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   min-width: 100vw;\n   opacity: 1;\n}\n\n.choose-game button {\n   font-size: 2rem;\n   padding: 20px;\n   border-radius: 2.5rem;\n}", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.red{\n   color: var(--red-text);\n}\n\n.info.red .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\nbutton{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\nbutton:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n\n\n.place-ships {\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   opacity: 0.98;\n   color: white;\n}\n\n.place-ships .dialog-container{\n   gap: 2vh;\n}\n\n.place-ships .dialog-header{\n   display: flex;\n   gap: 8vw;\n}\n\nh2{\n   font-size: 1.8rem;\n   font-weight: 400;\n}\n\n#direction {\n   padding: 5px;\n}\n\n.place-ships .wrapper {\n   flex-direction: row;\n   gap: 5vw;\n   align-items: center;\n}\n\n\n.place-ships .boats-drag {\n   width: 20v;\n   display: flex;\n   flex-direction: column;\n   gap: 3vh;\n   cursor: pointer;\n}\n\n.place-ships .boats-drag.vertical {\n   flex-direction: row;\n   gap: 3vw;\n}\n\n.place-ships .boat-wrapper {\n   display:flex;\n   flex-direction: column;\n}\n\n.place-ships .boat {\n   display: flex;\n   width: fit-content;\n}\n\n.place-ships .boat.vertical {\n   flex-direction: column;\n   align-self: center;\n}\n\n.boat .boat-square {\n   flex: none;\n   width: 7vh;\n   height: 7vh;\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.water-dialog{\n   opacity: 0;\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   color: var(--text);\n   font-size: 4rem;\n   transition: opacity 0.5s;\n   text-align: center;\n}\n\n.water-dialog.show{\n   opacity: 1;\n}\n\n.choose-game{\n   color: var(--text);\n   font-size: 4rem;\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   min-width: 100vw;\n   opacity: 1;\n}\n\n.choose-game button {\n   font-size: 2rem;\n   padding: 20px;\n   border-radius: 2.5rem;\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxXQUFXLE1BQU0sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLE1BQU0sS0FBSyxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksU0FBUyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLFVBQVUsS0FBSyxVQUFVLFVBQVUsWUFBWSxXQUFXLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxTQUFTLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLE9B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L2JhdHRsZXNoaXAvLi9zcmMvY3JlYXRlLWdyaWQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kcmFnQW5kRHJvcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2V2ZW50SGFuZGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pc1Bvc2l0aW9uVmFsaWRGb3JTaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbXVsdGlwbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hvd0dyaWQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNyZWF0ZUdyaWQgPSBmdW5jdGlvbiAobiA9IDEwKSB7XG4gIGNvbnN0IGdyaWQgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xuICAgIGdyaWRbaV0gPSBbXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG47IGogKz0gMSkge1xuICAgICAgZ3JpZFtpXVtqXSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdyaWQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVHcmlkO1xuIiwiaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2V2ZW50SGFuZGxlcic7XG5pbXBvcnQgZHJhZ0FuZERyb3AgZnJvbSAnLi9kcmFnQW5kRHJvcCc7XG5cbmNvbnN0IGRvbSA9IHtcbiAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gIHNob3dHcmlkKGdyaWRDb250YWluZXIsIGdyaWQsIHBsYXllck51bWJlcikge1xuICAgIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gJ2xpbmUnO1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2xvdCkpIHtcbiAgICAgICAgICBjb25zdCBzdW5rID0gc2xvdFsxXS5pc1N1bmsoKTtcbiAgICAgICAgICBpZiAoc3VuayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGhpdCc7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdW5rID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzdW5rJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gJ3dhdGVyJykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHdhdGVyJztcbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXJOdW1iZXIgPT09IDEpIHtcbiAgICAgICAgICBpZiAoc2xvdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgZW1wdHknO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHNoaXAnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXJOdW1iZXIgPT09IDIpIHtcbiAgICAgICAgICBpZiAoc2xvdCA9PT0gbnVsbCB8fCAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBlbXB0eSc7XG4gICAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBFdmVudEhhbmRsZXIub25TcXVhcmVDbGlja2VkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgICB9KTtcbiAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9KTtcbiAgfSxcblxuICBwb3B1bGF0ZUdyaWQoZ3JpZCwgc3RhcnQgPSBmYWxzZSkge1xuICAgIGxldCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQxJyk7XG4gICAgaWYgKHN0YXJ0ID09PSB0cnVlKSB7XG4gICAgICBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICB9XG4gICAgZG9tLnNob3dHcmlkKGdyaWRDb250YWluZXIsIGdyaWQsIDEpO1xuICB9LFxuICBwb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgdGhpcy5wbGF5ZXIxID0gcGxheWVyMTtcbiAgICB0aGlzLnBsYXllcjIgPSBwbGF5ZXIyO1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDInKTtcbiAgICBjb25zdCBncmlkID0gdGhpcy5wbGF5ZXIyLmdldEdyaWQoKTtcbiAgICBkb20uc2hvd0dyaWQoZ3JpZENvbnRhaW5lciwgZ3JpZCwgMik7XG4gIH0sXG4gIGRlbGF5KG1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XG4gICAgfSk7XG4gIH0sXG4gIHRvZ2dsZVR1cm4oKSB7XG4gICAgY29uc3QgZGl2VHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICBjb25zdCBjdXJyZW50VHVybiA9IGRpdlR1cm5zLnRleHRDb250ZW50LnN1YnN0cmluZyg3LCA4KTtcbiAgICBpZiAoY3VycmVudFR1cm4gPT09ICcxJykge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDIgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMgcmVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDEgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMnO1xuICAgIH1cbiAgfSxcbiAgdXBkYXRlQm9hdHNBbGl2ZShwbGF5ZXJOdW0pIHtcbiAgICBsZXQgcGFyYTtcbiAgICBsZXQgYm9hdHNBbGl2ZTtcbiAgICBpZiAocGxheWVyTnVtID09PSAxKSB7XG4gICAgICBwYXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLm9uZScpO1xuICAgICAgYm9hdHNBbGl2ZSA9IGRvbS5wbGF5ZXIxLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLnR3bycpO1xuICAgICAgYm9hdHNBbGl2ZSA9IGRvbS5wbGF5ZXIyLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIH1cbiAgICBwYXJhLnRleHRDb250ZW50ID0gYEFsaXZlIHNoaXBzOiAke2JvYXRzQWxpdmV9YDtcbiAgfSxcbiAgcHJlcGFyZU5ld0dhbWUoKSB7XG4gICAgY29uc3QgZGl2VHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICBkaXZUdXJucy50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMSB0dXJuJztcbiAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMnO1xuICAgIGNvbnN0IHNoaXBzQWxpdmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2hpcHMtYWxpdmUnKTtcbiAgICBzaGlwc0FsaXZlLmZvckVhY2goZGl2ID0+IHtcbiAgICAgIGRpdi50ZXh0Q29udGVudCA9ICdBbGl2ZSBzaGlwczogNSc7XG4gICAgfSk7XG4gIH0sXG4gIHNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgZG9tLnByZXBhcmVOZXdHYW1lKCk7XG4gICAgZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgY29uc3QgZGlhbG9nUGxhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMnKTtcbiAgICBkaWFsb2dQbGFjZS5zaG93TW9kYWwoKTtcbiAgICBkcmFnQW5kRHJvcChwbGF5ZXIxKTtcbiAgICBFdmVudEhhbmRsZXIuYWRkRXZlbnRMaXN0ZW5lcnMocGxheWVyMSwgcGxheWVyMik7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkb207XG4iLCJpbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gJy4vZXZlbnRIYW5kbGVyJztcblxuY29uc3QgZHJhZ0FuZERyb3AgPSBmdW5jdGlvbiAocGxheWVyKSB7XG4gIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICBib2F0LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIEV2ZW50SGFuZGxlci5vbkRyYWcpO1xuICAgIGJvYXQuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICBib2F0LnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gIH0pO1xuICBFdmVudEhhbmRsZXIuYWRkR3JpZExpc3RlbmVycyhwbGF5ZXIpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZHJhZ0FuZERyb3A7XG4iLCJpbXBvcnQgZG9tIGZyb20gJy4vZG9tJztcbmltcG9ydCBpc1Bvc2l0aW9uVmFsaWRGb3JTaGlwIGZyb20gJy4vaXNQb3NpdGlvblZhbGlkRm9yU2hpcCc7XG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuaW1wb3J0IG11bHRpcGxheWVyIGZyb20gJy4vbXVsdGlwbGF5ZXInO1xuXG5jb25zdCBFdmVudEhhbmRsZXIgPSB7XG4gIGFkZEV2ZW50TGlzdGVuZXJzKHBsYXllcjEsIHBsYXllcjIsIGlzTXVsdGlwbGF5ZXIgPSBmYWxzZSkge1xuICAgIHRoaXMucGxheWVyMSA9IHBsYXllcjE7XG4gICAgdGhpcy5wbGF5ZXIyID0gcGxheWVyMjtcbiAgICBjb25zdCBvbGRTdGFydEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcyAuc3RhcnQnKTtcbiAgICBjb25zdCBzdGFydEJ1dHRvbiA9IEV2ZW50SGFuZGxlci5yZW1vdmVFdmVudExpc3RlbmVycyhvbGRTdGFydEJ1dHRvbik7XG4gICAgaWYgKGlzTXVsdGlwbGF5ZXIgPT09IHRydWUpIHtcbiAgICAgIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbk11bHRpcGxheWVyU3RhcnRDbGljayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vblN0YXJ0Q2xpY2spO1xuICAgIH1cblxuICAgIGNvbnN0IG9sZENoRGlyZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RpcmVjdGlvbicpO1xuICAgIGNvbnN0IGNoRGlyZWN0aW9uID0gRXZlbnRIYW5kbGVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKG9sZENoRGlyZWN0aW9uKTtcbiAgICBjaERpcmVjdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DaGFuZ2VEaXJlY3Rpb25DbGljayk7XG5cbiAgICBjb25zdCBvbGRSYW5kb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmFuZG9tJyk7XG4gICAgY29uc3QgcmFuZG9tID0gRXZlbnRIYW5kbGVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKG9sZFJhbmRvbSk7XG4gICAgcmFuZG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vblJhbmRvbUNsaWNrKTtcbiAgfSxcbiAgb25SYW5kb21DbGljaygpIHtcbiAgICBFdmVudEhhbmRsZXIucGxheWVyMS5lbXB0eUdyaWQoKTtcbiAgICBFdmVudEhhbmRsZXIucGxheWVyMS5wbGFjZVNoaXBSYW5kb20oNSk7XG4gICAgRXZlbnRIYW5kbGVyLnBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDQpO1xuICAgIEV2ZW50SGFuZGxlci5wbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICBFdmVudEhhbmRsZXIucGxheWVyMS5wbGFjZVNoaXBSYW5kb20oMyk7XG4gICAgRXZlbnRIYW5kbGVyLnBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDIpO1xuICAgIGRvbS5wb3B1bGF0ZUdyaWQoRXZlbnRIYW5kbGVyLnBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgIGNvbnN0IG9sZEJvYXQgPSBib2F0O1xuICAgICAgY29uc3QgbmV3Qm9hdCA9IG9sZEJvYXQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgb2xkQm9hdC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdCb2F0LCBvbGRCb2F0KTtcbiAgICAgIG5ld0JvYXQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICBuZXdCb2F0LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgfSk7XG4gIH0sXG4gIG9uQ2hhbmdlRGlyZWN0aW9uQ2xpY2soKSB7XG4gICAgY29uc3QgYm9hdERyYWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hdHMtZHJhZycpO1xuICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICBpZiAoZG9tLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBib2F0RHJhZy5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgYm9hdC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuICAgICAgfSk7XG4gICAgICBkb20uZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICB9IGVsc2Uge1xuICAgICAgYm9hdERyYWcuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKTtcbiAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgIGJvYXQuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKTtcbiAgICAgIH0pO1xuICAgICAgZG9tLmRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgICB9XG4gIH0sXG4gIG9uU3RhcnRDbGljaygpIHtcbiAgICBjb25zdCBkaWFsb2dQbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcycpO1xuICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICBsZXQgY2FuU3RhcnQ7XG4gICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgIGlmIChib2F0LmRyYWdnYWJsZSA9PT0gdHJ1ZSkgY2FuU3RhcnQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoY2FuU3RhcnQgPT09IGZhbHNlKSByZXR1cm47XG4gICAgZGlhbG9nUGxhY2UuY2xvc2UoKTtcbiAgICBkb20ucG9wdWxhdGVHcmlkKEV2ZW50SGFuZGxlci5wbGF5ZXIxLmdldEdyaWQoKSk7XG4gICAgZG9tLnBvcHVsYXRlRW5lbXlHcmlkKEV2ZW50SGFuZGxlci5wbGF5ZXIxLCBFdmVudEhhbmRsZXIucGxheWVyMik7XG4gIH0sXG4gIG9uTXVsdGlwbGF5ZXJTdGFydENsaWNrKCkge1xuICAgIGNvbnN0IGRpYWxvZ1BsYWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzJyk7XG4gICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgIGNvbnN0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzIC5zdGFydCcpO1xuICAgIGxldCBjYW5TdGFydDtcbiAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgaWYgKGJvYXQuZHJhZ2dhYmxlID09PSB0cnVlKSBjYW5TdGFydCA9IGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChjYW5TdGFydCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICBpZiAobXVsdGlwbGF5ZXIucGxheWVyUGxhY2luZyA9PT0gMSkge1xuICAgICAgY29uc3QgZGlhbG9nVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWhlYWRlciBoMicpO1xuICAgICAgZGlhbG9nVGl0bGUudGV4dENvbnRlbnQgPSAnUGxhY2UgeW91ciBzaGlwcyBDYXB0YWluIDIhJztcbiAgICAgIHN0YXJ0QnV0dG9uLnRleHRDb250ZW50ID0gJ1N0YXJ0JztcbiAgICAgIG11bHRpcGxheWVyLnBsYXllclBsYWNpbmcgPSAyO1xuICAgICAgbXVsdGlwbGF5ZXIuc2hvd1N0YXJ0aW5nRGlhbG9nKEV2ZW50SGFuZGxlci5wbGF5ZXIyLCBFdmVudEhhbmRsZXIucGxheWVyMSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRpYWxvZ1BsYWNlLmNsb3NlKCk7XG4gICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVHcmlkKEV2ZW50SGFuZGxlci5wbGF5ZXIyLmdldEdyaWQoKSk7XG4gICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVFbmVteUdyaWQoRXZlbnRIYW5kbGVyLnBsYXllcjIsIEV2ZW50SGFuZGxlci5wbGF5ZXIxKTtcbiAgfSxcbiAgb25EcmFnKGV2ZW50KSB7XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXG4gICAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IGxlbmd0aDogZXZlbnQuY3VycmVudFRhcmdldC5jaGlsZHJlbi5sZW5ndGgsIGlkOiBldmVudC5jdXJyZW50VGFyZ2V0LmlkIH0pXG4gICAgKTtcbiAgfSxcbiAgYWRkR3JpZExpc3RlbmVycyhwbGF5ZXIpIHtcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2dyaWQtcGxhY2UgLnNxdWFyZS5lbXB0eScpO1xuICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZXZlbnQgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG4gICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIEV2ZW50SGFuZGxlci5vbkRyb3ApO1xuICAgIH0pO1xuICB9LFxuICBvbkRyb3AoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGpzb24gPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgIGNvbnN0IG9iamVjdCA9IEpTT04ucGFyc2UoanNvbik7XG4gICAgY29uc3QgeyBsZW5ndGggfSA9IG9iamVjdDtcbiAgICBjb25zdCBncmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICBjb25zdCBjb2x1bW4gPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgY29uc3QgY2xpY2tlZFNxdWFyZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgY29uc3QgaW5kZXhZID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb2x1bW4uY2hpbGRyZW4sIGNsaWNrZWRTcXVhcmUpO1xuICAgIGNvbnN0IGluZGV4WCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZ3JpZC5jaGlsZHJlbiwgY29sdW1uKTtcbiAgICBjb25zdCB7IGRpcmVjdGlvbiB9ID0gZG9tO1xuICAgIGNvbnN0IHBsYXllckdyaWQgPSBFdmVudEhhbmRsZXIucGxheWVyLmdldEdyaWQoKTtcbiAgICBjb25zdCBpc1ZhbGlkID0gaXNQb3NpdGlvblZhbGlkRm9yU2hpcChpbmRleFgsIGluZGV4WSwgZGlyZWN0aW9uLCBsZW5ndGgsIHBsYXllckdyaWQpO1xuICAgIGlmIChpc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIEV2ZW50SGFuZGxlci5wbGF5ZXIucGxhY2VTaGlwKFtpbmRleFgsIGluZGV4WV0sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgICBkb20ucG9wdWxhdGVHcmlkKEV2ZW50SGFuZGxlci5wbGF5ZXIuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBkcmFnZ2VkQm9hdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9iamVjdC5pZCk7XG4gICAgZHJhZ2dlZEJvYXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgRXZlbnRIYW5kbGVyLm9uRHJhZyk7XG4gICAgZHJhZ2dlZEJvYXQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgZHJhZ2dlZEJvYXQuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICBFdmVudEhhbmRsZXIuYWRkR3JpZExpc3RlbmVycyhFdmVudEhhbmRsZXIucGxheWVyKTtcbiAgfSxcbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMob2xkQnV0dG9uKSB7XG4gICAgY29uc3QgYnV0dG9uID0gb2xkQnV0dG9uLmNsb25lTm9kZSh0cnVlKTtcbiAgICBvbGRCdXR0b24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoYnV0dG9uLCBvbGRCdXR0b24pO1xuICAgIHJldHVybiBidXR0b247XG4gIH0sXG4gIG9uU3F1YXJlQ2xpY2tlZDogYXN5bmMgZXZlbnQgPT4ge1xuICAgIGNvbnN0IGVuZW15R3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMicpO1xuICAgIGNvbnN0IGNvbHVtbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZTtcbiAgICBjb25zdCBjbGlja2VkU3F1YXJlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICBjb25zdCBpbmRleFkgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGNvbHVtbi5jaGlsZHJlbiwgY2xpY2tlZFNxdWFyZSk7XG4gICAgY29uc3QgaW5kZXhYID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChlbmVteUdyaWQuY2hpbGRyZW4sIGNvbHVtbik7XG4gICAgbGV0IGhpdCA9IGRvbS5wbGF5ZXIxLmF0dGFjayhkb20ucGxheWVyMiwgaW5kZXhYLCBpbmRleFkpO1xuICAgIGRvbS5wb3B1bGF0ZUVuZW15R3JpZChkb20ucGxheWVyMSwgZG9tLnBsYXllcjIpO1xuICAgIGRvbS51cGRhdGVCb2F0c0FsaXZlKDIpO1xuICAgIGlmIChkb20ucGxheWVyMi5hbGxTdW5rKCkgIT09IGZhbHNlKSByZXR1cm4gRXZlbnRIYW5kbGVyLm9uV2luKDEpO1xuICAgIGlmIChoaXQgPT09IGZhbHNlKSB7XG4gICAgICBkb20udG9nZ2xlVHVybigpO1xuICAgICAgZG8ge1xuICAgICAgICBhd2FpdCBkb20uZGVsYXkoNTAwKTtcbiAgICAgICAgaGl0ID0gZG9tLnBsYXllcjIucmFuZG9tQXR0YWNrKGRvbS5wbGF5ZXIxKTtcbiAgICAgICAgZG9tLnBvcHVsYXRlR3JpZChkb20ucGxheWVyMS5nZXRHcmlkKCkpO1xuICAgICAgICBkb20udXBkYXRlQm9hdHNBbGl2ZSgxKTtcbiAgICAgICAgaWYgKGRvbS5wbGF5ZXIxLmFsbFN1bmsoKSAhPT0gZmFsc2UpIHJldHVybiBFdmVudEhhbmRsZXIub25XaW4oMik7XG4gICAgICB9IHdoaWxlIChoaXQgIT09IGZhbHNlKTtcbiAgICAgIGRvbS50b2dnbGVUdXJuKCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgb25XaW4ocGxheWVyKSB7XG4gICAgY29uc3QgZGlhbG9nV2luID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbicpO1xuICAgIGRpYWxvZ1dpbi5zaG93TW9kYWwoKTtcbiAgICBjb25zdCByZXN0YXJ0ID0gZGlhbG9nV2luLnF1ZXJ5U2VsZWN0b3IoJy5yZXN0YXJ0Jyk7XG4gICAgcmVzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGdhbWUuY2hvb3NlR2FtZSgpKTtcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGlhbG9nV2luLmNsb3NlKCk7XG4gICAgfSk7XG4gICAgY29uc3QgdHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICB0dXJucy50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXJ9IHdvbiEhIWA7XG4gICAgY29uc3Qgd2lubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lcicpO1xuICAgIHdpbm5lci50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXJ9IHdvbiEhIWA7XG4gICAgd2lubmVyLmNsYXNzTmFtZSA9ICd3aW5uZXInO1xuICAgIGlmIChwbGF5ZXIgPT09IDIpIHtcbiAgICAgIHdpbm5lci5jbGFzc0xpc3QuYWRkKCd0d28nKTtcbiAgICB9XG4gIH0sXG4gIG9uTXVsdGlwbGF5ZXJTcXVhcmVDbGlja2VkOiBhc3luYyBldmVudCA9PiB7XG4gICAgY29uc3QgZW5lbXlHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQyJyk7XG4gICAgY29uc3QgY29sdW1uID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xuICAgIGNvbnN0IGNsaWNrZWRTcXVhcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIGNvbnN0IGluZGV4WSA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoY29sdW1uLmNoaWxkcmVuLCBjbGlja2VkU3F1YXJlKTtcbiAgICBjb25zdCBpbmRleFggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGVuZW15R3JpZC5jaGlsZHJlbiwgY29sdW1uKTtcbiAgICBjb25zdCBoaXQgPSBtdWx0aXBsYXllci5wbGF5ZXIxLmF0dGFjayhtdWx0aXBsYXllci5wbGF5ZXIyLCBpbmRleFgsIGluZGV4WSk7XG4gICAgaWYgKG11bHRpcGxheWVyLnBsYXllcjIuYWxsU3VuaygpICE9PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIEV2ZW50SGFuZGxlci5vbldpbihtdWx0aXBsYXllci5wbGF5ZXIxLm51bWJlcik7XG4gICAgfVxuICAgIG11bHRpcGxheWVyLnBvcHVsYXRlRW5lbXlHcmlkKG11bHRpcGxheWVyLnBsYXllcjEsIG11bHRpcGxheWVyLnBsYXllcjIpO1xuICAgIG11bHRpcGxheWVyLnVwZGF0ZUJvYXRzQWxpdmUoKTtcbiAgICBpZiAoaGl0ID09PSBmYWxzZSkge1xuICAgICAgbXVsdGlwbGF5ZXIuc2hvd1dhdGVyRGlhbG9nKCk7XG4gICAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUdyaWQobXVsdGlwbGF5ZXIucGxheWVyMi5nZXRHcmlkKCkpO1xuICAgICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVFbmVteUdyaWQobXVsdGlwbGF5ZXIucGxheWVyMiwgbXVsdGlwbGF5ZXIucGxheWVyMSk7XG4gICAgICBtdWx0aXBsYXllci51cGRhdGVCb2F0c0FsaXZlKCk7XG4gICAgICBtdWx0aXBsYXllci50b2dnbGVUdXJuKCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50SGFuZGxlcjtcbiIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQgbXVsdGlwbGF5ZXIgZnJvbSAnLi9tdWx0aXBsYXllcic7XG5cbmNvbnN0IGdhbWUgPSB7XG4gIHN0YXJ0R2FtZSgpIHtcbiAgICBjb25zdCBwbGF5ZXIxID0gUGxheWVyKDEpO1xuICAgIGNvbnN0IHBsYXllcjIgPSBQbGF5ZXIoMik7XG4gICAgcGxheWVyMi5wbGFjZVNoaXBSYW5kb20oNSk7XG4gICAgcGxheWVyMi5wbGFjZVNoaXBSYW5kb20oNCk7XG4gICAgcGxheWVyMi5wbGFjZVNoaXBSYW5kb20oMyk7XG4gICAgcGxheWVyMi5wbGFjZVNoaXBSYW5kb20oMyk7XG4gICAgcGxheWVyMi5wbGFjZVNoaXBSYW5kb20oMik7XG4gICAgZG9tLnNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKTtcbiAgfSxcbiAgc3RhcnRNdWx0aXBsYXllcigpIHtcbiAgICBjb25zdCBwbGF5ZXIxID0gUGxheWVyKDEpO1xuICAgIGNvbnN0IHBsYXllcjIgPSBQbGF5ZXIoMik7XG4gICAgbXVsdGlwbGF5ZXIucmVzZXRFdmVyeXRoaW5nKCk7XG4gICAgbXVsdGlwbGF5ZXIucHJlcGFyZVN0YXJ0aW5nRGlhbG9nKCk7XG4gICAgbXVsdGlwbGF5ZXIuc2hvd1N0YXJ0aW5nRGlhbG9nKHBsYXllcjEsIHBsYXllcjIpO1xuICB9LFxuICBjaG9vc2VHYW1lKCkge1xuICAgIGNvbnN0IGNob29zZUdhbWVNb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNob29zZS1nYW1lJyk7XG4gICAgY2hvb3NlR2FtZU1vZGUuc2hvd01vZGFsKCk7XG4gICAgY29uc3QgcGxheUNvbXB1dGVyID0gY2hvb3NlR2FtZU1vZGUucXVlcnlTZWxlY3RvcignLmNvbXB1dGVyJyk7XG4gICAgcGxheUNvbXB1dGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY2hvb3NlR2FtZU1vZGUuY2xvc2UoKTtcbiAgICAgIGdhbWUuc3RhcnRHYW1lKCk7XG4gICAgfSk7XG4gICAgY29uc3QgcGxheU90aGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm11bHRpcGxheWVyJyk7XG4gICAgcGxheU90aGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY2hvb3NlR2FtZU1vZGUuY2xvc2UoKTtcbiAgICAgIGdhbWUuc3RhcnRNdWx0aXBsYXllcigpO1xuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcCc7XG5pbXBvcnQgY3JlYXRlR3JpZCBmcm9tICcuL2NyZWF0ZS1ncmlkJztcbmltcG9ydCBpc1Bvc2l0aW9uVmFsaWRGb3JTaGlwIGZyb20gJy4vaXNQb3NpdGlvblZhbGlkRm9yU2hpcCc7XG5cbmNvbnN0IEdhbWVib2FyZCA9IGZ1bmN0aW9uIGNyZWF0ZUdhbWVib2FyZCgpIHtcbiAgbGV0IGdyaWQgPSBjcmVhdGVHcmlkKCk7XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gZnVuY3Rpb24gKHN0YXJ0LCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIGNvbnN0IHNoaXBPYmogPSBTaGlwKGxlbmd0aCk7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwT2JqLmxlbmd0aDsgaSArPSAxKSBncmlkW3N0YXJ0WzBdXVtzdGFydFsxXSArIGldID0gc2hpcE9iajtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwT2JqLmxlbmd0aDsgaSArPSAxKSBncmlkW3N0YXJ0WzBdICsgaV1bc3RhcnRbMV1dID0gc2hpcE9iajtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwUmFuZG9tID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgIGxldCB4O1xuICAgIGxldCB5O1xuICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgbGV0IGRpcmVjdGlvbjtcbiAgICBjb25zdCBudW0gPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xuICAgIGlmIChudW0gPT09IDApIHtcbiAgICAgIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgICB9IGVsc2Uge1xuICAgICAgZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICB9XG4gICAgd2hpbGUgKGlzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIGlzVmFsaWQgPSBpc1Bvc2l0aW9uVmFsaWRGb3JTaGlwKHgsIHksIGRpcmVjdGlvbiwgbGVuZ3RoLCBncmlkKTtcbiAgICB9XG4gICAgdGhpcy5wbGFjZVNoaXAoW3gsIHldLCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gIH07XG5cbiAgY29uc3QgZW1wdHlHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgIGdyaWQgPSBjcmVhdGVHcmlkKCk7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUhpdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgY29uc3QgdmFsdWUgPSBncmlkW3hdW3ldO1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgZ3JpZFt4XVt5XSA9ICd3YXRlcic7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhbHVlLmFkZEhpdCgpO1xuICAgIGdyaWRbeF1beV0gPSBbJ2hpdCcsIHZhbHVlXTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgY29uc3QgYWxsU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGlmIChzbG90ICE9PSBudWxsICYmIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShzbG90KSkgcmVzdWx0ID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIGNvbnN0IGNvdW50Qm9hdHNBbGl2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBib2F0cyA9IFtdO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHNsb3QgIT09IG51bGwgJiZcbiAgICAgICAgICB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAhQXJyYXkuaXNBcnJheShzbG90KSAmJlxuICAgICAgICAgICFib2F0cy5pbmNsdWRlcyhzbG90KVxuICAgICAgICApIHtcbiAgICAgICAgICBib2F0cy5wdXNoKHNsb3QpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYm9hdHMubGVuZ3RoO1xuICB9O1xuXG4gIGNvbnN0IGdldEdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdyaWQ7XG4gIH07XG4gIHJldHVybiB7XG4gICAgZ2V0R3JpZCxcbiAgICBlbXB0eUdyaWQsXG4gICAgcGxhY2VTaGlwLFxuICAgIHBsYWNlU2hpcFJhbmRvbSxcbiAgICByZWNlaXZlSGl0LFxuICAgIGFsbFN1bmssXG4gICAgY291bnRCb2F0c0FsaXZlLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiY29uc3QgaXNQb3NpdGlvblZhbGlkRm9yU2hpcCA9ICh4LCB5LCBkaXJlY3Rpb24sIGxlbmd0aCwgZ3JpZCkgPT4ge1xuICBjb25zdCBhcnJheSA9IFtdO1xuICBjb25zdCBzdXJyb3VuZGluZ0FycmF5ID0gW107XG5cbiAgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnICYmIHggKyBsZW5ndGggPiBncmlkLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnICYmIHkgKyBsZW5ndGggPj0gZ3JpZFswXS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhcnJheS5wdXNoKGdyaWRbeF1beV0pO1xuICBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBhcnJheS5wdXNoKGdyaWRbeCArIGldW3ldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgYXJyYXkucHVzaChncmlkW3hdW3kgKyBpXSk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgaSA9IC0xOyBpIDw9IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3QgeDEgPSB4ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IDApO1xuICAgIGNvbnN0IHkxID0geSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDAgOiBpKTtcbiAgICBjb25zdCB4MiA9IHggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogLTEpO1xuICAgIGNvbnN0IHkyID0geSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IC0xIDogaSk7XG4gICAgY29uc3QgeDMgPSB4ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IDEpO1xuICAgIGNvbnN0IHkzID0geSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDEgOiBpKTtcblxuICAgIGlmICh4MSA+PSAwICYmIHgxIDwgZ3JpZC5sZW5ndGggJiYgeTEgPj0gMCAmJiB5MSA8IGdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2goZ3JpZFt4MV1beTFdKTtcbiAgICB9XG4gICAgaWYgKHgyID49IDAgJiYgeDIgPCBncmlkLmxlbmd0aCAmJiB5MiA+PSAwICYmIHkyIDwgZ3JpZFswXS5sZW5ndGgpIHtcbiAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChncmlkW3gyXVt5Ml0pO1xuICAgIH1cbiAgICBpZiAoeDMgPj0gMCAmJiB4MyA8IGdyaWQubGVuZ3RoICYmIHkzID49IDAgJiYgeTMgPCBncmlkWzBdLmxlbmd0aCkge1xuICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKGdyaWRbeDNdW3kzXSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZW1wdHkgPSBhcnJheS5ldmVyeShzcXVhcmUgPT4gc3F1YXJlID09PSBudWxsKTtcbiAgY29uc3Qgc3Vycm91bmRpbmdFbXB0eSA9IHN1cnJvdW5kaW5nQXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG5cbiAgcmV0dXJuIGVtcHR5ICYmIHN1cnJvdW5kaW5nRW1wdHk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpc1Bvc2l0aW9uVmFsaWRGb3JTaGlwO1xuIiwiaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2V2ZW50SGFuZGxlcic7XG5pbXBvcnQgc2hvd0dyaWQgZnJvbSAnLi9zaG93R3JpZCc7XG5pbXBvcnQgZHJhZ0FuZERyb3AgZnJvbSAnLi9kcmFnQW5kRHJvcCc7XG5cbmNvbnN0IG11bHRpcGxheWVyID0ge1xuICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgcGxheWVyUGxhY2luZzogMSxcblxuICBwb3B1bGF0ZUdyaWQoZ3JpZCwgc3RhcnQgPSBmYWxzZSkge1xuICAgIGxldCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQxJyk7XG4gICAgaWYgKHN0YXJ0ID09PSB0cnVlKSB7XG4gICAgICBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICB9XG4gICAgc2hvd0dyaWQoZ3JpZENvbnRhaW5lciwgZ3JpZCwgMSwgdHJ1ZSk7XG4gIH0sXG4gIHBvcHVsYXRlRW5lbXlHcmlkKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICB0aGlzLnBsYXllcjEgPSBwbGF5ZXIxO1xuICAgIHRoaXMucGxheWVyMiA9IHBsYXllcjI7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMicpO1xuICAgIGNvbnN0IGdyaWQgPSB0aGlzLnBsYXllcjIuZ2V0R3JpZCgpO1xuICAgIHNob3dHcmlkKGdyaWRDb250YWluZXIsIGdyaWQsIDIsIHRydWUpO1xuICB9LFxuICBzaG93V2F0ZXJEaWFsb2coKSB7XG4gICAgY29uc3Qgd2F0ZXJEaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2F0ZXItZGlhbG9nJyk7XG4gICAgd2F0ZXJEaWFsb2cuc2hvd01vZGFsKCk7XG4gICAgd2F0ZXJEaWFsb2cuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgIGNvbnN0IGNsb3NlRGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNoYW5nZS10dXJuJyk7XG4gICAgY2xvc2VEaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB3YXRlckRpYWxvZy5jbG9zZSgpO1xuICAgICAgd2F0ZXJEaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIH0pO1xuICB9LFxuICB0b2dnbGVUdXJuKCkge1xuICAgIGNvbnN0IGRpdlR1cm5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm5zJyk7XG4gICAgY29uc3QgYXR0YWNrZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLm9uZScpO1xuICAgIGNvbnN0IGF0dGFja2VySW5mbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbmZvLm9uZScpO1xuICAgIGNvbnN0IGRlZmVuZG9yRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci50d28nKTtcbiAgICBjb25zdCBkZWZlbmRvckluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5mby50d28nKTtcbiAgICBjb25zdCBjdXJyZW50VHVybiA9IGRpdlR1cm5zLnRleHRDb250ZW50LnN1YnN0cmluZyg3LCA4KTtcbiAgICBpZiAoY3VycmVudFR1cm4gPT09ICcxJykge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDIgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMgcmVkJztcbiAgICAgIGF0dGFja2VyRGl2LnRleHRDb250ZW50ID0gJ1BsYXllciAyJztcbiAgICAgIGF0dGFja2VySW5mby5jbGFzc05hbWUgPSAnaW5mbyBvbmUgcmVkJztcbiAgICAgIGRlZmVuZG9yRGl2LnRleHRDb250ZW50ID0gJ1BsYXllciAxJztcbiAgICAgIGRlZmVuZG9ySW5mby5jbGFzc05hbWUgPSAnaW5mbyB0d28nO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXZUdXJucy50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMSB0dXJuJztcbiAgICAgIGRpdlR1cm5zLmNsYXNzTmFtZSA9ICd0dXJucyc7XG4gICAgICBhdHRhY2tlckRpdi50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMSc7XG4gICAgICBhdHRhY2tlckluZm8uY2xhc3NOYW1lID0gJ2luZm8gb25lJztcbiAgICAgIGRlZmVuZG9yRGl2LnRleHRDb250ZW50ID0gJ1BsYXllciAyJztcbiAgICAgIGRlZmVuZG9ySW5mby5jbGFzc05hbWUgPSAnaW5mbyB0d28gcmVkJztcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZUJvYXRzQWxpdmUoKSB7XG4gICAgY29uc3QgcGFyYTEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHMtYWxpdmUub25lJyk7XG4gICAgY29uc3QgYm9hdHNBbGl2ZTEgPSBtdWx0aXBsYXllci5wbGF5ZXIxLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIHBhcmExLnRleHRDb250ZW50ID0gYEFsaXZlIHNoaXBzICR7Ym9hdHNBbGl2ZTF9YDtcbiAgICBjb25zdCBwYXJhMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcy1hbGl2ZS50d28nKTtcbiAgICBjb25zdCBib2F0c0FsaXZlMiA9IG11bHRpcGxheWVyLnBsYXllcjIuY291bnRCb2F0c0FsaXZlKCk7XG4gICAgcGFyYTIudGV4dENvbnRlbnQgPSBgQWxpdmUgc2hpcHMgJHtib2F0c0FsaXZlMn1gO1xuICB9LFxuICBwcmVwYXJlU3RhcnRpbmdEaWFsb2coKSB7XG4gICAgY29uc3Qgc3RhcnRpbmdCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMgLnN0YXJ0Jyk7XG4gICAgc3RhcnRpbmdCdXR0b24udGV4dENvbnRlbnQgPSAnTmV4dCc7XG4gICAgY29uc3QgZGlhbG9nVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWhlYWRlciBoMicpO1xuICAgIGRpYWxvZ1RpdGxlLnRleHRDb250ZW50ID0gJ1BsYWNlIHlvdXIgc2hpcHMgQ2FwdGFpbiAxISc7XG4gIH0sXG4gIHNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBkaWFsb2dQbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcycpO1xuICAgIGRpYWxvZ1BsYWNlLnNob3dNb2RhbCgpO1xuICAgIGRyYWdBbmREcm9wKHBsYXllcjEpO1xuICAgIEV2ZW50SGFuZGxlci5hZGRFdmVudExpc3RlbmVycyhwbGF5ZXIxLCBwbGF5ZXIyLCB0cnVlKTtcbiAgfSxcbiAgcmVzZXRFdmVyeXRoaW5nKCkge1xuICAgIHRoaXMucGxheWVyMSA9IG51bGw7XG4gICAgdGhpcy5wbGF5ZXIyID0gbnVsbDtcbiAgICB0aGlzLnBsYXllclBsYWNpbmcgPSAxO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbXVsdGlwbGF5ZXI7XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gJy4vZ2FtZWJvYXJkJztcblxuY29uc3QgUGxheWVyID0gZnVuY3Rpb24gKG51bWJlcikge1xuICBjb25zdCBnYW1lYm9hcmQgPSBHYW1lYm9hcmQoKTtcblxuICBjb25zdCBhbGxTdW5rID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnYW1lYm9hcmQuYWxsU3VuaygpO1xuICB9O1xuXG4gIGNvbnN0IHdpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ0kgd29uJztcbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAoc3RhcnQsIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgZ2FtZWJvYXJkLnBsYWNlU2hpcChzdGFydCwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcFJhbmRvbSA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwUmFuZG9tKGxlbmd0aCk7XG4gIH07XG5cbiAgY29uc3QgZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLmdldEdyaWQoKTtcbiAgfTtcblxuICBjb25zdCBlbXB0eUdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2FtZWJvYXJkLmVtcHR5R3JpZCgpO1xuICB9O1xuXG4gIGNvbnN0IGNvdW50Qm9hdHNBbGl2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVIaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHJldHVybiBnYW1lYm9hcmQucmVjZWl2ZUhpdCh4LCB5KTtcbiAgfTtcblxuICBjb25zdCBhdHRhY2sgPSBmdW5jdGlvbiAocGxheWVyLCB4LCB5KSB7XG4gICAgY29uc3QgaGl0ID0gcGxheWVyLnJlY2VpdmVIaXQoeCwgeSk7XG4gICAgaWYgKHBsYXllci5hbGxTdW5rKCkpIHtcbiAgICAgIHJldHVybiB3aW4oKTtcbiAgICB9XG4gICAgcmV0dXJuIGhpdDtcbiAgfTtcblxuICBjb25zdCByYW5kb21BdHRhY2sgPSBmdW5jdGlvbiAocGxheWVyKSB7XG4gICAgbGV0IHg7XG4gICAgbGV0IHk7XG4gICAgZG8ge1xuICAgICAgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgfSB3aGlsZSAodHlwZW9mIHBsYXllci5nZXRHcmlkKClbeF1beV0gIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkocGxheWVyLmdldEdyaWQoKVt4XVt5XSkpO1xuICAgIHJldHVybiBhdHRhY2socGxheWVyLCB4LCB5KTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG51bWJlcixcbiAgICBhbGxTdW5rLFxuICAgIHBsYWNlU2hpcCxcbiAgICBnZXRHcmlkLFxuICAgIHJlY2VpdmVIaXQsXG4gICAgYXR0YWNrLFxuICAgIHdpbixcbiAgICByYW5kb21BdHRhY2ssXG4gICAgY291bnRCb2F0c0FsaXZlLFxuICAgIHBsYWNlU2hpcFJhbmRvbSxcbiAgICBlbXB0eUdyaWQsXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjb25zdCBTaGlwID0gZnVuY3Rpb24gY3JlYXRlU2hpcChzaGlwTGVuZ3RoKSB7XG4gIGNvbnN0IGxlbmd0aCA9IHNoaXBMZW5ndGg7XG4gIGxldCBoaXRzID0gMDtcbiAgY29uc3QgYWRkSGl0ID0gZnVuY3Rpb24gKCkge1xuICAgIGhpdHMgKz0gMTtcbiAgICByZXR1cm4gaGl0cztcbiAgfTtcbiAgY29uc3QgaXNTdW5rID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChoaXRzID09PSBsZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgcmV0dXJuIHsgbGVuZ3RoLCBhZGRIaXQsIGlzU3VuayB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnLi9ldmVudEhhbmRsZXInO1xuXG5jb25zdCBzaG93R3JpZCA9IGZ1bmN0aW9uIChncmlkQ29udGFpbmVyLCBncmlkLCBwbGF5ZXJOdW1iZXIsIGlzTXVsdGlwbGF5ZXIgPSBmYWxzZSkge1xuICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTmFtZSA9ICdsaW5lJztcbiAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNsb3QpKSB7XG4gICAgICAgIGNvbnN0IHN1bmsgPSBzbG90WzFdLmlzU3VuaygpO1xuICAgICAgICBpZiAoc3VuayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBoaXQnO1xuICAgICAgICB9IGVsc2UgaWYgKHN1bmsgPT09IHRydWUpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzdW5rJztcbiAgICAgICAgfVxuICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gJ3dhdGVyJykge1xuICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSB3YXRlcic7XG4gICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgfSBlbHNlIGlmIChwbGF5ZXJOdW1iZXIgPT09IDEpIHtcbiAgICAgICAgaWYgKHNsb3QgPT09IG51bGwpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBlbXB0eSc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzaGlwJztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwbGF5ZXJOdW1iZXIgPT09IDIpIHtcbiAgICAgICAgaWYgKHNsb3QgPT09IG51bGwgfHwgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnKSkge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGVtcHR5JztcbiAgICAgICAgICBpZiAoaXNNdWx0aXBsYXllciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgRXZlbnRIYW5kbGVyLm9uTXVsdGlwbGF5ZXJTcXVhcmVDbGlja2VkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgRXZlbnRIYW5kbGVyLm9uU3F1YXJlQ2xpY2tlZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICB9KTtcbiAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2hvd0dyaWQ7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIiosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gfVxcbiBcXG5cXG4qIHtcXG5tYXJnaW46IDA7XFxucGFkZGluZzogMDtcXG59XFxuXFxuXFxuYm9keSB7XFxubGluZS1oZWlnaHQ6IDEuNTtcXG4td2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG5mb250LWZhbWlseTogJ1J1YmlrIEJ1YmJsZXMnLCBDb3VyaWVyLCBtb25vc3BhY2U7XFxufVxcblxcblxcbmltZywgcGljdHVyZSwgdmlkZW8sIGNhbnZhcywgc3ZnIHtcXG5kaXNwbGF5OiBibG9jaztcXG5tYXgtd2lkdGg6IDEwMCU7XFxufVxcblxcblxcbmlucHV0LCBidXR0b24sIHRleHRhcmVhLCBzZWxlY3Qge1xcbmZvbnQ6IGluaGVyaXQ7XFxufVxcblxcblxcbnAsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcbm92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XFxufVxcblxcblxcbmJ1dHRvbiwgYXtcXG5jdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcblxcbmF7XFxuICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5cXG5cXG5cXG4vKiBGb290ZXIgKi9cXG5cXG5cXG5odG1sIHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbnBvc2l0aW9uOiByZWxhdGl2ZTtcXG5taW4taGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5cXG5ib2R5IHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbm1hcmdpbi1ib3R0b206IDQ4cHg7XFxufVxcblxcblxcbi5mb290ZXIge1xcbnBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5ib3R0b206IDA7XFxubGVmdDogMDtcXG5kaXNwbGF5OiBmbGV4O1xcbmFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuanVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuZ2FwOiAxMHB4O1xcbndpZHRoOiAxMDAlO1xcbnBhZGRpbmc6IDEwcHg7XFxuYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMThweDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1YiB7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMjJweDtcXG50cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1Yjpob3ZlciB7XFxudHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKSBzY2FsZSgxLjIpO1xcbn1cXG5cXG4vKiBTdHlsaW5nICovXFxuXFxuOnJvb3R7XFxuIC0taGVhZGVyLWJnOiAjM0QzRDNEO1xcbiAtLW1haW4tYmc6IzMwMzAzMDtcXG4gLS10ZXh0OiNGRkZGRkY7XFxuIC0tZ3JpZC1ib3JkZXJzOiMwMDJDNjY7XFxuIC0tZ3JpZC1zcXVhcmVzOiMyMzg5REE7XFxuIC0tbXktYm9hdHM6IzgwODA4MDtcXG4gLS1teS1ib2F0cy1ib3JkZXI6IzQ2NDY0NjtcXG4gLS1zaGlwLWhpdDojRjgyNzI3O1xcbiAtLXNoaXAtc3VuazojRDE2MDYwO1xcbiAtLWdyZWVuLXRleHQ6IzJCQzU1NztcXG4gLS1yZWQtdGV4dDojRTIzNjM2O1xcbn1cXG5cXG5ib2R5IHtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG5oZWFkZXJ7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGVhZGVyLWJnKTtcXG4gICBmbGV4OiAxO1xcbn1cXG5cXG5oMXtcXG4gICBmb250LXNpemU6IDIuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbn1cXG5cXG5tYWlue1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIGZsZXg6IDc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1dmg7XFxuICAgcGFkZGluZzogNXZoIDBweDtcXG59XFxuXFxuLnR1cm5ze1xcbiAgIHBhZGRpbmc6IDEwcHggMzBweDtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgZm9udC1zaXplOiAycmVtOztcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4udHVybnMucmVkIHtcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbiAgIGJvcmRlcjogMnB4IHJpZGdlIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmdyaWQtY29udGFpbmVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdnc7XFxufVxcblxcbi53cmFwcGVye1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ubnVtYmVyLXdyYXBwZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ueS13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBnYXA6IDVweDtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXN7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIG1pbi1oZWlnaHQ6IDcwdmg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXMgcHtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uZ3JpZCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhc3BlY3QtcmF0aW86IDEvMTtcXG4gICBoZWlnaHQ6IDcwdmg7XFxuICAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tZ3JpZC1ib3JkZXJzKTtcXG4gICBib3JkZXItcmFkaXVzOiA2cHg7XFxufVxcblxcbi54LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IDcwdmg7XFxuICAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi54LWNvb3JkaW5hdGVzIHB7XFxuICAgd2lkdGg6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5saW5le1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICB3aWR0aDogMTAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG59XFxuXFxuLnNxdWFyZXtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMCU7XFxuICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XFxufVxcblxcblxcblxcbiNncmlkMiAuc3F1YXJlLmVtcHR5OmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxMTAsIDgsIDE5NCk7XFxuICAgY3Vyc29yOmNyb3NzaGFpcjtcXG59XFxuXFxuLnNxdWFyZS5zaGlwe1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XFxuXFxuLnNxdWFyZS53YXRlcntcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDJyZW07XFxufVxcblxcbi5zcXVhcmUuaGl0IHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLWhpdCk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgZm9udC13ZWlnaHQ6IDgwMDtcXG59XFxuXFxuLnNxdWFyZS5zdW5rIHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLXN1bmspO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5pbmZve1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mbyAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mby5yZWR7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmluZm8ucmVkIC5zaGlwcy1hbGl2ZXtcXG4gICBib3JkZXItdG9wOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5cXG5cXG5cXG5kaWFsb2d7XFxuICAgdG9wOiA1MCU7XFxuICAgbGVmdDogNTAlO1xcbiAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgIGhlaWdodDogNTB2aDtcXG4gICB3aWR0aDogMTAwdnc7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1iZyk7XFxuICAgb3BhY2l0eTogMC45O1xcbiAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlc21va2U7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuXFxuXFxuLmRpYWxvZy1jb250YWluZXJ7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMDAlO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgIGdhcDogMTB2aDtcXG59XFxuXFxuLndpbm5lcntcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIHBhZGRpbmc6IDIwcHg7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuLndpbm5lci50d297XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbmJ1dHRvbntcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IG5vbmU7XFxuICAgb3V0bGluZTogbm9uZTtcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgIHBhZGRpbmc6IDEwcHg7XFxuICAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIDtcXG59XFxuXFxuYnV0dG9uOmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMge1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgbWluLWhlaWdodDogMTAwdmg7XFxuICAgb3BhY2l0eTogMC45ODtcXG4gICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuZGlhbG9nLWNvbnRhaW5lcntcXG4gICBnYXA6IDJ2aDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5kaWFsb2ctaGVhZGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZ2FwOiA4dnc7XFxufVxcblxcbmgye1xcbiAgIGZvbnQtc2l6ZTogMS44cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA0MDA7XFxufVxcblxcbiNkaXJlY3Rpb24ge1xcbiAgIHBhZGRpbmc6IDVweDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC53cmFwcGVyIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgIGdhcDogNXZ3O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdHMtZHJhZyB7XFxuICAgd2lkdGg6IDIwdjtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgZ2FwOiAzdmg7XFxuICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXRzLWRyYWcudmVydGljYWwge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgZ2FwOiAzdnc7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdC13cmFwcGVyIHtcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0IHtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiBmaXQtY29udGVudDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0LnZlcnRpY2FsIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXG59XFxuXFxuLmJvYXQgLmJvYXQtc3F1YXJlIHtcXG4gICBmbGV4OiBub25lO1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXktYm9hdHMpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgYm9yZGVyLXJhZGl1czogOHB4O1xcbn1cXG5cXG4ud2F0ZXItZGlhbG9ne1xcbiAgIG9wYWNpdHk6IDA7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZm9udC1zaXplOiA0cmVtO1xcbiAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC41cztcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi53YXRlci1kaWFsb2cuc2hvd3tcXG4gICBvcGFjaXR5OiAxO1xcbn1cXG5cXG4uY2hvb3NlLWdhbWV7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogNHJlbTtcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIG1pbi13aWR0aDogMTAwdnc7XFxuICAgb3BhY2l0eTogMTtcXG59XFxuXFxuLmNob29zZS1nYW1lIGJ1dHRvbiB7XFxuICAgZm9udC1zaXplOiAycmVtO1xcbiAgIHBhZGRpbmc6IDIwcHg7XFxuICAgYm9yZGVyLXJhZGl1czogMi41cmVtO1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0Usc0JBQXNCO0NBQ3ZCOzs7QUFHRDtBQUNBLFNBQVM7QUFDVCxVQUFVO0FBQ1Y7OztBQUdBO0FBQ0EsZ0JBQWdCO0FBQ2hCLG1DQUFtQztBQUNuQyxnREFBZ0Q7QUFDaEQ7OztBQUdBO0FBQ0EsY0FBYztBQUNkLGVBQWU7QUFDZjs7O0FBR0E7QUFDQSxhQUFhO0FBQ2I7OztBQUdBO0FBQ0EseUJBQXlCO0FBQ3pCOzs7QUFHQTtBQUNBLGVBQWU7QUFDZjs7O0FBR0E7R0FDRyxxQkFBcUI7QUFDeEI7Ozs7O0FBS0EsV0FBVzs7O0FBR1g7QUFDQSxtQkFBbUI7QUFDbkIsa0JBQWtCO0FBQ2xCLGdCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQSxtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25COzs7QUFHQTtBQUNBLGtC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QUFVO0dBQ1YsV0FBVztHQUNYLGlDQUFpQztHQUNqQyx3Q0FBd0M7R0FDeEMsa0JBQWtCO0FBQ3JCOztBQUVBO0dBQ0csVUFBVTtHQUNWLGdCQUFnQjtHQUNoQixpQkFBaUI7R0FDakIsa0JBQWtCO0dBQ2xCLGVBQWU7R0FDZix3QkFBd0I7R0FDeEIsa0JBQWtCO0FBQ3JCOztBQUVBO0dBQ0csVUFBVTtBQUNiOztBQUVBO0dBQ0csa0JBQWtCO0dBQ2xCLGVBQWU7R0FDZixnQkFBZ0I7R0FDaEIsaUJBQWlCO0dBQ2pCLGdCQUFnQjtHQUNoQixVQUFVO0FBQ2I7O0FBRUE7R0FDRyxlQUFlO0dBQ2YsYUFBYTtHQUNiLHFCQUFxQjtBQUN4QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuIH1cXG4gXFxuXFxuKiB7XFxubWFyZ2luOiAwO1xcbnBhZGRpbmc6IDA7XFxufVxcblxcblxcbmJvZHkge1xcbmxpbmUtaGVpZ2h0OiAxLjU7XFxuLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxuZm9udC1mYW1pbHk6ICdSdWJpayBCdWJibGVzJywgQ291cmllciwgbW9ub3NwYWNlO1xcbn1cXG5cXG5cXG5pbWcsIHBpY3R1cmUsIHZpZGVvLCBjYW52YXMsIHN2ZyB7XFxuZGlzcGxheTogYmxvY2s7XFxubWF4LXdpZHRoOiAxMDAlO1xcbn1cXG5cXG5cXG5pbnB1dCwgYnV0dG9uLCB0ZXh0YXJlYSwgc2VsZWN0IHtcXG5mb250OiBpbmhlcml0O1xcbn1cXG5cXG5cXG5wLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXG5vdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xcbn1cXG5cXG5cXG5idXR0b24sIGF7XFxuY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5cXG5he1xcbiAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuXFxuXFxuXFxuLyogRm9vdGVyICovXFxuXFxuXFxuaHRtbCB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5wb3NpdGlvbjogcmVsYXRpdmU7XFxubWluLWhlaWdodDogMTAwJTtcXG59XFxuXFxuXFxuYm9keSB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5tYXJnaW4tYm90dG9tOiA0OHB4O1xcbn1cXG5cXG5cXG4uZm9vdGVyIHtcXG5wb3NpdGlvbjogYWJzb2x1dGU7XFxuYm90dG9tOiAwO1xcbmxlZnQ6IDA7XFxuZGlzcGxheTogZmxleDtcXG5hbGlnbi1pdGVtczogY2VudGVyO1xcbmp1c3RpZnktY29udGVudDogY2VudGVyO1xcbmdhcDogMTBweDtcXG53aWR0aDogMTAwJTtcXG5wYWRkaW5nOiAxMHB4O1xcbmJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDE4cHg7XFxufVxcblxcblxcbi5mYS1naXRodWIge1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDIycHg7XFxudHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxufVxcblxcblxcbi5mYS1naXRodWI6aG92ZXIge1xcbnRyYW5zZm9ybTogcm90YXRlKDM2MGRlZykgc2NhbGUoMS4yKTtcXG59XFxuXFxuLyogU3R5bGluZyAqL1xcblxcbjpyb290e1xcbiAtLWhlYWRlci1iZzogIzNEM0QzRDtcXG4gLS1tYWluLWJnOiMzMDMwMzA7XFxuIC0tdGV4dDojRkZGRkZGO1xcbiAtLWdyaWQtYm9yZGVyczojMDAyQzY2O1xcbiAtLWdyaWQtc3F1YXJlczojMjM4OURBO1xcbiAtLW15LWJvYXRzOiM4MDgwODA7XFxuIC0tbXktYm9hdHMtYm9yZGVyOiM0NjQ2NDY7XFxuIC0tc2hpcC1oaXQ6I0Y4MjcyNztcXG4gLS1zaGlwLXN1bms6I0QxNjA2MDtcXG4gLS1ncmVlbi10ZXh0OiMyQkM1NTc7XFxuIC0tcmVkLXRleHQ6I0UyMzYzNjtcXG59XFxuXFxuYm9keSB7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuaGVhZGVye1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhlYWRlci1iZyk7XFxuICAgZmxleDogMTtcXG59XFxuXFxuaDF7XFxuICAgZm9udC1zaXplOiAyLjVyZW07XFxuICAgZm9udC13ZWlnaHQ6IDUwMDtcXG59XFxuXFxubWFpbntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWJnKTtcXG4gICBmbGV4OiA3O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGdhcDogNXZoO1xcbiAgIHBhZGRpbmc6IDV2aCAwcHg7XFxufVxcblxcbi50dXJuc3tcXG4gICBwYWRkaW5nOiAxMHB4IDMwcHg7XFxuICAgYm9yZGVyOiAycHggcmlkZ2UgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogMnJlbTs7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnR1cm5zLnJlZCB7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5ncmlkLWNvbnRhaW5lcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgZ2FwOiAxMHZ3O1xcbn1cXG5cXG4ud3JhcHBlcntcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLm51bWJlci13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnktd3JhcHBlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1cHg7XFxufVxcblxcbi55LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBtaW4taGVpZ2h0OiA3MHZoO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi55LWNvb3JkaW5hdGVzIHB7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmdyaWQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYXNwZWN0LXJhdGlvOiAxLzE7XFxuICAgaGVpZ2h0OiA3MHZoO1xcbiAgIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgYm9yZGVyLXJhZGl1czogNnB4O1xcbn1cXG5cXG4ueC1jb29yZGluYXRlc3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiA3MHZoO1xcbiAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4ueC1jb29yZGluYXRlcyBwe1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ubGluZXtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgd2lkdGg6IDEwJTtcXG4gICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbi5zcXVhcmV7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1ncmlkLWJvcmRlcnMpO1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAlO1xcbiAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xcbn1cXG5cXG5cXG5cXG4jZ3JpZDIgLnNxdWFyZS5lbXB0eTpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTEwLCA4LCAxOTQpO1xcbiAgIGN1cnNvcjpjcm9zc2hhaXI7XFxufVxcblxcbi5zcXVhcmUuc2hpcHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcblxcbi5zcXVhcmUud2F0ZXJ7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAycmVtO1xcbn1cXG5cXG4uc3F1YXJlLmhpdCB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1oaXQpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5zcXVhcmUuc3VuayB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1zdW5rKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBmb250LXdlaWdodDogODAwO1xcbn1cXG5cXG4uaW5mb3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8gLnNoaXBzLWFsaXZle1xcbiAgIGJvcmRlci10b3A6IDJweCBzb2xpZCB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8ucmVke1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5pbmZvLnJlZCAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuXFxuXFxuXFxuZGlhbG9ne1xcbiAgIHRvcDogNTAlO1xcbiAgIGxlZnQ6IDUwJTtcXG4gICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gICBoZWlnaHQ6IDUwdmg7XFxuICAgd2lkdGg6IDEwMHZ3O1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIG9wYWNpdHk6IDAuOTtcXG4gICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZXNtb2tlO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcblxcblxcbi5kaWFsb2ctY29udGFpbmVye1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdmg7XFxufVxcblxcbi53aW5uZXJ7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBwYWRkaW5nOiAyMHB4O1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcbi53aW5uZXIudHdve1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5idXR0b257XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxuICAgYm9yZGVyOiBub25lO1xcbiAgIG91dGxpbmU6IG5vbmU7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICBwYWRkaW5nOiAxMHB4O1xcbiAgIHRyYW5zaXRpb246IDAuM3MgZWFzZSA7XFxufVxcblxcbmJ1dHRvbjpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG59XFxuXFxuXFxuLnBsYWNlLXNoaXBzIHtcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIG9wYWNpdHk6IDAuOTg7XFxuICAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmRpYWxvZy1jb250YWluZXJ7XFxuICAgZ2FwOiAydmg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuZGlhbG9nLWhlYWRlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGdhcDogOHZ3O1xcbn1cXG5cXG5oMntcXG4gICBmb250LXNpemU6IDEuOHJlbTtcXG4gICBmb250LXdlaWdodDogNDAwO1xcbn1cXG5cXG4jZGlyZWN0aW9uIHtcXG4gICBwYWRkaW5nOiA1cHg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAud3JhcHBlciB7XFxuICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICBnYXA6IDV2dztcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXRzLWRyYWcge1xcbiAgIHdpZHRoOiAyMHY7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGdhcDogM3ZoO1xcbiAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0cy1kcmFnLnZlcnRpY2FsIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgIGdhcDogM3Z3O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQtd3JhcHBlciB7XFxuICAgZGlzcGxheTpmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICB3aWR0aDogZml0LWNvbnRlbnQ7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdC52ZXJ0aWNhbCB7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxufVxcblxcbi5ib2F0IC5ib2F0LXNxdWFyZSB7XFxuICAgZmxleDogbm9uZTtcXG4gICB3aWR0aDogN3ZoO1xcbiAgIGhlaWdodDogN3ZoO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XFxuXFxuLndhdGVyLWRpYWxvZ3tcXG4gICBvcGFjaXR5OiAwO1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgbWluLWhlaWdodDogMTAwdmg7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogNHJlbTtcXG4gICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXM7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ud2F0ZXItZGlhbG9nLnNob3d7XFxuICAgb3BhY2l0eTogMTtcXG59XFxuXFxuLmNob29zZS1nYW1le1xcbiAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBmb250LXNpemU6IDRyZW07XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICBtaW4td2lkdGg6IDEwMHZ3O1xcbiAgIG9wYWNpdHk6IDE7XFxufVxcblxcbi5jaG9vc2UtZ2FtZSBidXR0b24ge1xcbiAgIGZvbnQtc2l6ZTogMnJlbTtcXG4gICBwYWRkaW5nOiAyMHB4O1xcbiAgIGJvcmRlci1yYWRpdXM6IDIuNXJlbTtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCAnLi9zdHlsZS5jc3MnO1xuaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lJztcblxuZ2FtZS5jaG9vc2VHYW1lKCk7XG4iXSwibmFtZXMiOlsiY3JlYXRlR3JpZCIsIm4iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJncmlkIiwiaSIsImoiLCJFdmVudEhhbmRsZXIiLCJkcmFnQW5kRHJvcCIsImRvbSIsImRpcmVjdGlvbiIsInNob3dHcmlkIiwiZ3JpZENvbnRhaW5lciIsInBsYXllck51bWJlciIsImlubmVySFRNTCIsImZvckVhY2giLCJsaW5lIiwiZGl2IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwic2xvdCIsInNxdWFyZSIsIkFycmF5IiwiaXNBcnJheSIsInN1bmsiLCJpc1N1bmsiLCJ0ZXh0Q29udGVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvblNxdWFyZUNsaWNrZWQiLCJhcHBlbmRDaGlsZCIsInBvcHVsYXRlR3JpZCIsInN0YXJ0IiwicXVlcnlTZWxlY3RvciIsInBvcHVsYXRlRW5lbXlHcmlkIiwicGxheWVyMSIsInBsYXllcjIiLCJnZXRHcmlkIiwiZGVsYXkiLCJtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsInRvZ2dsZVR1cm4iLCJkaXZUdXJucyIsImN1cnJlbnRUdXJuIiwic3Vic3RyaW5nIiwidXBkYXRlQm9hdHNBbGl2ZSIsInBsYXllck51bSIsInBhcmEiLCJib2F0c0FsaXZlIiwiY291bnRCb2F0c0FsaXZlIiwicHJlcGFyZU5ld0dhbWUiLCJzaGlwc0FsaXZlIiwicXVlcnlTZWxlY3RvckFsbCIsInNob3dTdGFydGluZ0RpYWxvZyIsImRpYWxvZ1BsYWNlIiwic2hvd01vZGFsIiwiYWRkRXZlbnRMaXN0ZW5lcnMiLCJwbGF5ZXIiLCJib2F0cyIsImJvYXQiLCJvbkRyYWciLCJkcmFnZ2FibGUiLCJzdHlsZSIsIm9wYWNpdHkiLCJhZGRHcmlkTGlzdGVuZXJzIiwiaXNQb3NpdGlvblZhbGlkRm9yU2hpcCIsImdhbWUiLCJtdWx0aXBsYXllciIsImlzTXVsdGlwbGF5ZXIiLCJvbGRTdGFydEJ1dHRvbiIsInN0YXJ0QnV0dG9uIiwicmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJvbk11bHRpcGxheWVyU3RhcnRDbGljayIsIm9uU3RhcnRDbGljayIsIm9sZENoRGlyZWN0aW9uIiwiY2hEaXJlY3Rpb24iLCJvbkNoYW5nZURpcmVjdGlvbkNsaWNrIiwib2xkUmFuZG9tIiwicmFuZG9tIiwib25SYW5kb21DbGljayIsImVtcHR5R3JpZCIsInBsYWNlU2hpcFJhbmRvbSIsIm9sZEJvYXQiLCJuZXdCb2F0IiwiY2xvbmVOb2RlIiwicGFyZW50Tm9kZSIsInJlcGxhY2VDaGlsZCIsImJvYXREcmFnIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwiY2FuU3RhcnQiLCJjbG9zZSIsInBsYXllclBsYWNpbmciLCJkaWFsb2dUaXRsZSIsImV2ZW50IiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjdXJyZW50VGFyZ2V0IiwiY2hpbGRyZW4iLCJpZCIsInNxdWFyZXMiLCJwcmV2ZW50RGVmYXVsdCIsIm9uRHJvcCIsImpzb24iLCJnZXREYXRhIiwib2JqZWN0IiwicGFyc2UiLCJjb2x1bW4iLCJjbGlja2VkU3F1YXJlIiwiaW5kZXhZIiwicHJvdG90eXBlIiwiaW5kZXhPZiIsImNhbGwiLCJpbmRleFgiLCJwbGF5ZXJHcmlkIiwiaXNWYWxpZCIsInBsYWNlU2hpcCIsImRyYWdnZWRCb2F0IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwib2xkQnV0dG9uIiwiYnV0dG9uIiwiZW5lbXlHcmlkIiwiaGl0IiwiYXR0YWNrIiwiYWxsU3VuayIsIm9uV2luIiwicmFuZG9tQXR0YWNrIiwiZGlhbG9nV2luIiwicmVzdGFydCIsImNob29zZUdhbWUiLCJ0dXJucyIsIndpbm5lciIsIm9uTXVsdGlwbGF5ZXJTcXVhcmVDbGlja2VkIiwibnVtYmVyIiwic2hvd1dhdGVyRGlhbG9nIiwiUGxheWVyIiwic3RhcnRHYW1lIiwic3RhcnRNdWx0aXBsYXllciIsInJlc2V0RXZlcnl0aGluZyIsInByZXBhcmVTdGFydGluZ0RpYWxvZyIsImNob29zZUdhbWVNb2RlIiwicGxheUNvbXB1dGVyIiwicGxheU90aGVyIiwiU2hpcCIsIkdhbWVib2FyZCIsImNyZWF0ZUdhbWVib2FyZCIsInNoaXBPYmoiLCJ4IiwieSIsIm51bSIsIk1hdGgiLCJyb3VuZCIsImZsb29yIiwicmVjZWl2ZUhpdCIsInZhbHVlIiwiYWRkSGl0IiwicmVzdWx0IiwiaW5jbHVkZXMiLCJwdXNoIiwiYXJyYXkiLCJzdXJyb3VuZGluZ0FycmF5IiwieDEiLCJ5MSIsIngyIiwieTIiLCJ4MyIsInkzIiwiZW1wdHkiLCJldmVyeSIsInN1cnJvdW5kaW5nRW1wdHkiLCJ3YXRlckRpYWxvZyIsImNsb3NlRGlhbG9nIiwiYXR0YWNrZXJEaXYiLCJhdHRhY2tlckluZm8iLCJkZWZlbmRvckRpdiIsImRlZmVuZG9ySW5mbyIsInBhcmExIiwiYm9hdHNBbGl2ZTEiLCJwYXJhMiIsImJvYXRzQWxpdmUyIiwic3RhcnRpbmdCdXR0b24iLCJnYW1lYm9hcmQiLCJ3aW4iLCJjcmVhdGVTaGlwIiwic2hpcExlbmd0aCIsImhpdHMiXSwic291cmNlUm9vdCI6IiJ9