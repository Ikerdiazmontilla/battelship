/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");

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
          square.addEventListener('click', dom.squareClicked);
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
    let hit = dom.player1.attack(dom.player2, indexX, indexY);
    dom.populateEnemyGrid(dom.player1, dom.player2);
    dom.updateBoatsAlive(2);
    if (dom.player2.allSunk() !== false) return dom.playerWon(1);
    if (hit === false) {
      dom.toggleTurn();
      while (true) {
        await dom.delay(500);
        hit = dom.player2.randomAttack(dom.player1);
        dom.populateGrid(dom.player1.getGrid());
        dom.updateBoatsAlive(1);
        if (dom.player1.allSunk() !== false) return dom.playerWon(2);
        if (hit === false) {
          dom.toggleTurn();
          break;
        }
      }
    }
    return false;
  },
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  playerWon(player) {
    const dialogWin = document.querySelector('.win');
    dialogWin.showModal();
    const restart = dialogWin.querySelector('.restart');
    restart.addEventListener('click', () => _game__WEBPACK_IMPORTED_MODULE_0__["default"].startGame());
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
    para.textContent = `Alive ships ${boatsAlive}`;
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
        } = dom;
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
        dom.populateGrid(player.getGrid(), true);
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
  showStartingDialog(player1, player2) {
    dom.populateGrid(player1.getGrid(), true);
    const dialogPlace = document.querySelector('.place-ships');
    dialogPlace.showModal();
    dom.dragAndDrop(player1);
    dom.addEventListeners(player1, player2);
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
      dialogPlace.close();
      dom.populateGrid(player1.getGrid());
      dom.populateEnemyGrid(player1, player2);
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
      dom.populateGrid(player1.getGrid(), true);
      const boats = document.querySelectorAll('.boat');
      boats.forEach(boat => {
        const oldBoat = boat;
        const newBoat = oldBoat.cloneNode(true);
        oldBoat.parentNode.replaceChild(newBoat, oldBoat);
        newBoat.draggable = false;
        newBoat.style.opacity = '0';
      });
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (dom);

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
    // player2.placeShipRandom(5);
    // player2.placeShipRandom(4);
    // player2.placeShipRandom(3);
    // player2.placeShipRandom(3);
    // player2.placeShipRandom(2);
    // player2.placeShip([6, 2], 4, 'horizontal');
    // player2.placeShip([6, 6], 3, 'horizontal');
    // player2.placeShip([1, 5], 3, 'vertical');
    // player2.placeShip([7, 0], 2, 'horizontal');
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].showStartingDialog(player1, player2);
    // player1.placeShip([1, 3], 4, 'horizontal');
    // player1.placeShip([7, 3], 3, 'horizontal');
    // player1.placeShip([8, 8], 2, 'horizontal');
    // player1.placeShip([1, 5], 2, 'vertical');
  },
  startMultiplayer() {
    const player1 = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])(1);
    const player2 = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])(2);
    _multiplayer__WEBPACK_IMPORTED_MODULE_2__["default"].resetEverything();
    _multiplayer__WEBPACK_IMPORTED_MODULE_2__["default"].prepareStartingDialog();
    _multiplayer__WEBPACK_IMPORTED_MODULE_2__["default"].showStartingDialog(player1, player2);
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
const Gameboard = function createGameboard() {
  let grid = createGrid();
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
    let isEmpty = false;
    let direction;
    const num = Math.round(Math.random());
    if (num === 0) {
      direction = 'horizontal';
    } else {
      direction = 'vertical';
    }
    while (isEmpty === false) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      isEmpty = function () {
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
      }();
    }
    const shipObj = (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(length);
    if (direction === 'vertical') {
      for (let i = 0; i < shipObj.length; i += 1) grid[x][y + i] = shipObj;
    } else {
      for (let i = 0; i < shipObj.length; i += 1) grid[x + i][y] = shipObj;
    }
  };
  const emptyGrid = function () {
    grid = createGrid();
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

/***/ "./src/multiplayer.js":
/*!****************************!*\
  !*** ./src/multiplayer.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");


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
  // delay(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // },
  playerWon(player) {
    const dialogWin = document.querySelector('.win');
    dialogWin.showModal();
    const restart = dialogWin.querySelector('.restart');
    restart.addEventListener('click', () => _game__WEBPACK_IMPORTED_MODULE_0__["default"].startMultiplayer());
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
    while (true) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      if (typeof player.getGrid()[x][y] === 'object' && !Array.isArray(player.getGrid()[x][y])) {
        break;
      }
    }
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
___CSS_LOADER_EXPORT___.push([module.id, "*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.red{\n   color: var(--red-text);\n}\n\n.info.red .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\nbutton{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\nbutton:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n\n\n.place-ships {\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   opacity: 0.98;\n   color: white;\n}\n\n.place-ships .dialog-container{\n   gap: 2vh;\n}\n\n.place-ships .dialog-header{\n   display: flex;\n   gap: 8vw;\n}\n\nh2{\n   font-size: 1.8rem;\n   font-weight: 400;\n}\n\n#direction {\n   padding: 5px;\n}\n\n.place-ships .wrapper {\n   flex-direction: row;\n   gap: 5vw;\n   align-items: center;\n}\n\n\n.place-ships .boats-drag {\n   width: 20v;\n   display: flex;\n   flex-direction: column;\n   gap: 3vh;\n}\n\n.place-ships .boats-drag.vertical {\n   flex-direction: row;\n   gap: 3vw;\n}\n\n.place-ships .boat-wrapper {\n   display:flex;\n   flex-direction: column;\n}\n\n.place-ships .boat {\n   display: flex;\n   width: fit-content;\n}\n\n.place-ships .boat.vertical {\n   flex-direction: column;\n   align-self: center;\n}\n\n.boat .boat-square {\n   flex: none;\n   width: 7vh;\n   height: 7vh;\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.water-dialog{\n   opacity: 0;\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   color: var(--text);\n   font-size: 4rem;\n   transition: opacity 0.5s;\n   text-align: center;\n}\n\n.water-dialog.show{\n   opacity: 1;\n}", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.red{\n   color: var(--red-text);\n}\n\n.info.red .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\nbutton{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\nbutton:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n\n\n.place-ships {\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   opacity: 0.98;\n   color: white;\n}\n\n.place-ships .dialog-container{\n   gap: 2vh;\n}\n\n.place-ships .dialog-header{\n   display: flex;\n   gap: 8vw;\n}\n\nh2{\n   font-size: 1.8rem;\n   font-weight: 400;\n}\n\n#direction {\n   padding: 5px;\n}\n\n.place-ships .wrapper {\n   flex-direction: row;\n   gap: 5vw;\n   align-items: center;\n}\n\n\n.place-ships .boats-drag {\n   width: 20v;\n   display: flex;\n   flex-direction: column;\n   gap: 3vh;\n}\n\n.place-ships .boats-drag.vertical {\n   flex-direction: row;\n   gap: 3vw;\n}\n\n.place-ships .boat-wrapper {\n   display:flex;\n   flex-direction: column;\n}\n\n.place-ships .boat {\n   display: flex;\n   width: fit-content;\n}\n\n.place-ships .boat.vertical {\n   flex-direction: column;\n   align-self: center;\n}\n\n.boat .boat-square {\n   flex: none;\n   width: 7vh;\n   height: 7vh;\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.water-dialog{\n   opacity: 0;\n   padding: 2vh 2vw;\n   min-height: 100vh;\n   color: var(--text);\n   font-size: 4rem;\n   transition: opacity 0.5s;\n   text-align: center;\n}\n\n.water-dialog.show{\n   opacity: 1;\n}"],"sourceRoot":""}]);
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
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/dom.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./game */ "./src/game.js");




_game__WEBPACK_IMPORTED_MODULE_3__["default"].startMultiplayer();

// const player1 = Player();
// const player2 = Player();
// player1.placeShip([1, 3], 4, 'horizontal');
// player1.placeShip([7, 3], 3, 'horizontal');
// player1.placeShip([8, 8], 2, 'horizontal');
// player1.placeShip([1, 5], 2, 'vertical');
// player2.attack(player1, 1, 5);
// player2.attack(player1, 1, 6);
// player2.attack(player1, 1, 3);
// player2.attack(player1, 9, 9);

// player2.placeShip([1, 3], 4, 'horizontal');
// player2.placeShip([7, 3], 3, 'horizontal');
// player2.placeShip([8, 8], 2, 'horizontal');
// player2.placeShip([1, 5], 2, 'vertical');
// player1.attack(player2, 1, 5);
// player1.attack(player2, 1, 6);
// player1.attack(player2, 1, 3);
// player1.attack(player2, 9, 9);

// dom.populateEnemyGrid(player1, player2);

// dom.populateGrid(player1.getGrid());
// let finish = false;
// while (finish === false) {
//   finish = dom.listenForClick(player1, player2);
// }

// gameboard.receiveHit(1, 3);
// gameboard.receiveHit(2, 3);
// gameboard.receiveHit(3, 3);
// console.log(gameboard.allSunk());
// const ship1 = Ship(3);
// console.log(ship1.addHit());

// console.log(gameboard.grid[1][3]);
// console.log(ship1);
// console.log(gameboard.grid[1][3] === ship1);
// gameboard.receiveHit(1, 3);
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFZLGFBQWEsUUFBUSxLQUFLLFlBQVksV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsVUFBVSxVQUFVLFlBQVksV0FBVyxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxRQUFRLEtBQUssWUFBWSxPQUFPLFdBQVcsS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLFNBQVMsS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxP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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsOEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tdWx0aXBsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmNvbnN0IGRvbSA9IHtcbiAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gIHBvcHVsYXRlR3JpZChncmlkLCBzdGFydCA9IGZhbHNlKSB7XG4gICAgbGV0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDEnKTtcbiAgICBpZiAoc3RhcnQgPT09IHRydWUpIHtcbiAgICAgIGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZC1wbGFjZScpO1xuICAgIH1cbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmNsYXNzTmFtZSA9ICdsaW5lJztcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGlmIChzbG90ID09PSBudWxsKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgZW1wdHknO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc2xvdCkpIHtcbiAgICAgICAgICBjb25zdCBzdW5rID0gc2xvdFsxXS5pc1N1bmsoKTtcbiAgICAgICAgICBpZiAoc3VuayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGhpdCc7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdW5rID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzdW5rJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzaGlwJztcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSAnd2F0ZXInKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgd2F0ZXInO1xuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgICAgfSk7XG4gICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gICAgfSk7XG4gIH0sXG4gIHBvcHVsYXRlRW5lbXlHcmlkKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICB0aGlzLnBsYXllcjEgPSBwbGF5ZXIxO1xuICAgIHRoaXMucGxheWVyMiA9IHBsYXllcjI7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMicpO1xuICAgIGNvbnN0IGdyaWQgPSB0aGlzLnBsYXllcjIuZ2V0R3JpZCgpO1xuICAgIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gJ2xpbmUnO1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2xvdCkpIHtcbiAgICAgICAgICBjb25zdCBzdW5rID0gc2xvdFsxXS5pc1N1bmsoKTtcbiAgICAgICAgICBpZiAoc3VuayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGhpdCc7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdW5rID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzdW5rJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gbnVsbCB8fCAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgZW1wdHknO1xuICAgICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRvbS5zcXVhcmVDbGlja2VkKTtcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSAnd2F0ZXInKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgd2F0ZXInO1xuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgICAgfSk7XG4gICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gICAgfSk7XG4gIH0sXG4gIHNxdWFyZUNsaWNrZWQ6IGFzeW5jIGV2ZW50ID0+IHtcbiAgICBjb25zdCBlbmVteUdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDInKTtcbiAgICBjb25zdCBjb2x1bW4gPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgY29uc3QgY2xpY2tlZFNxdWFyZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgY29uc3QgaW5kZXhZID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb2x1bW4uY2hpbGRyZW4sIGNsaWNrZWRTcXVhcmUpO1xuICAgIGNvbnN0IGluZGV4WCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZW5lbXlHcmlkLmNoaWxkcmVuLCBjb2x1bW4pO1xuICAgIGxldCBoaXQgPSBkb20ucGxheWVyMS5hdHRhY2soZG9tLnBsYXllcjIsIGluZGV4WCwgaW5kZXhZKTtcbiAgICBkb20ucG9wdWxhdGVFbmVteUdyaWQoZG9tLnBsYXllcjEsIGRvbS5wbGF5ZXIyKTtcbiAgICBkb20udXBkYXRlQm9hdHNBbGl2ZSgyKTtcbiAgICBpZiAoZG9tLnBsYXllcjIuYWxsU3VuaygpICE9PSBmYWxzZSkgcmV0dXJuIGRvbS5wbGF5ZXJXb24oMSk7XG4gICAgaWYgKGhpdCA9PT0gZmFsc2UpIHtcbiAgICAgIGRvbS50b2dnbGVUdXJuKCk7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBhd2FpdCBkb20uZGVsYXkoNTAwKTtcbiAgICAgICAgaGl0ID0gZG9tLnBsYXllcjIucmFuZG9tQXR0YWNrKGRvbS5wbGF5ZXIxKTtcbiAgICAgICAgZG9tLnBvcHVsYXRlR3JpZChkb20ucGxheWVyMS5nZXRHcmlkKCkpO1xuICAgICAgICBkb20udXBkYXRlQm9hdHNBbGl2ZSgxKTtcbiAgICAgICAgaWYgKGRvbS5wbGF5ZXIxLmFsbFN1bmsoKSAhPT0gZmFsc2UpIHJldHVybiBkb20ucGxheWVyV29uKDIpO1xuICAgICAgICBpZiAoaGl0ID09PSBmYWxzZSkge1xuICAgICAgICAgIGRvbS50b2dnbGVUdXJuKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBkZWxheShtcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbiAgfSxcbiAgcGxheWVyV29uKHBsYXllcikge1xuICAgIGNvbnN0IGRpYWxvZ1dpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW4nKTtcbiAgICBkaWFsb2dXaW4uc2hvd01vZGFsKCk7XG4gICAgY29uc3QgcmVzdGFydCA9IGRpYWxvZ1dpbi5xdWVyeVNlbGVjdG9yKCcucmVzdGFydCcpO1xuICAgIHJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBnYW1lLnN0YXJ0R2FtZSgpKTtcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGlhbG9nV2luLmNsb3NlKCk7XG4gICAgfSk7XG4gICAgY29uc3QgdHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICB0dXJucy50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXJ9IHdvbiEhIWA7XG4gICAgY29uc3Qgd2lubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lcicpO1xuICAgIHdpbm5lci50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXJ9IHdvbiEhIWA7XG4gICAgd2lubmVyLmNsYXNzTmFtZSA9ICd3aW5uZXInO1xuICAgIGlmIChwbGF5ZXIgPT09IDIpIHtcbiAgICAgIHdpbm5lci5jbGFzc0xpc3QuYWRkKCd0d28nKTtcbiAgICB9XG4gIH0sXG4gIHRvZ2dsZVR1cm4oKSB7XG4gICAgY29uc3QgZGl2VHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICBjb25zdCBjdXJyZW50VHVybiA9IGRpdlR1cm5zLnRleHRDb250ZW50LnN1YnN0cmluZyg3LCA4KTtcbiAgICBpZiAoY3VycmVudFR1cm4gPT09ICcxJykge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDIgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMgcmVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDEgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMnO1xuICAgIH1cbiAgfSxcbiAgdXBkYXRlQm9hdHNBbGl2ZShwbGF5ZXJOdW0pIHtcbiAgICBsZXQgcGFyYTtcbiAgICBsZXQgYm9hdHNBbGl2ZTtcbiAgICBpZiAocGxheWVyTnVtID09PSAxKSB7XG4gICAgICBwYXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLm9uZScpO1xuICAgICAgYm9hdHNBbGl2ZSA9IGRvbS5wbGF5ZXIxLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLnR3bycpO1xuICAgICAgYm9hdHNBbGl2ZSA9IGRvbS5wbGF5ZXIyLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIH1cbiAgICBwYXJhLnRleHRDb250ZW50ID0gYEFsaXZlIHNoaXBzICR7Ym9hdHNBbGl2ZX1gO1xuICB9LFxuICBkcmFnQW5kRHJvcChwbGF5ZXIpIHtcbiAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgY29uc3Qgb25EcmFnID0gZXZlbnQgPT4ge1xuICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsZW5ndGg6IGV2ZW50LmN1cnJlbnRUYXJnZXQuY2hpbGRyZW4ubGVuZ3RoLCBpZDogZXZlbnQuY3VycmVudFRhcmdldC5pZCB9KVxuICAgICAgKTtcbiAgICB9O1xuICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICBib2F0LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIG9uRHJhZyk7XG4gICAgICBib2F0LmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICBib2F0LnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgfSk7XG5cbiAgICBjb25zdCBncmlkTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNncmlkLXBsYWNlIC5zcXVhcmUuZW1wdHknKTtcbiAgICAgIGNvbnN0IG9uRHJvcCA9IGV2ZW50ID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QganNvbiA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIGNvbnN0IG9iamVjdCA9IEpTT04ucGFyc2UoanNvbik7XG4gICAgICAgIGNvbnN0IHsgbGVuZ3RoIH0gPSBvYmplY3Q7XG4gICAgICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZC1wbGFjZScpO1xuICAgICAgICBjb25zdCBjb2x1bW4gPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgIGNvbnN0IGNsaWNrZWRTcXVhcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBjb25zdCBpbmRleFkgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGNvbHVtbi5jaGlsZHJlbiwgY2xpY2tlZFNxdWFyZSk7XG4gICAgICAgIGNvbnN0IGluZGV4WCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZ3JpZC5jaGlsZHJlbiwgY29sdW1uKTtcbiAgICAgICAgY29uc3QgeyBkaXJlY3Rpb24gfSA9IGRvbTtcbiAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IHBsYXllci5nZXRHcmlkKCk7XG4gICAgICAgIGNvbnN0IGlzRW1wdHkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgICAgICAgY29uc3Qgc3Vycm91bmRpbmdBcnJheSA9IFtdO1xuXG4gICAgICAgICAgYXJyYXkucHVzaChwbGF5ZXJHcmlkW2luZGV4WF1baW5kZXhZXSk7XG4gICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgIGFycmF5LnB1c2gocGxheWVyR3JpZFtpbmRleFggKyBpXVtpbmRleFldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICBhcnJheS5wdXNoKHBsYXllckdyaWRbaW5kZXhYXVtpbmRleFkgKyBpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IC0xOyBpIDw9IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCB4MSA9IGluZGV4WCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAwKTtcbiAgICAgICAgICAgIGNvbnN0IHkxID0gaW5kZXhZICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gMCA6IGkpO1xuICAgICAgICAgICAgY29uc3QgeDIgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogLTEpO1xuICAgICAgICAgICAgY29uc3QgeTIgPSBpbmRleFkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAtMSA6IGkpO1xuICAgICAgICAgICAgY29uc3QgeDMgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMSk7XG4gICAgICAgICAgICBjb25zdCB5MyA9IGluZGV4WSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDEgOiBpKTtcblxuICAgICAgICAgICAgaWYgKHgxID49IDAgJiYgeDEgPCBwbGF5ZXJHcmlkLmxlbmd0aCAmJiB5MSA+PSAwICYmIHkxIDwgcGxheWVyR3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKHBsYXllckdyaWRbeDFdW3kxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeDIgPj0gMCAmJiB4MiA8IHBsYXllckdyaWQubGVuZ3RoICYmIHkyID49IDAgJiYgeTIgPCBwbGF5ZXJHcmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2gocGxheWVyR3JpZFt4Ml1beTJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh4MyA+PSAwICYmIHgzIDwgcGxheWVyR3JpZC5sZW5ndGggJiYgeTMgPj0gMCAmJiB5MyA8IHBsYXllckdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChwbGF5ZXJHcmlkW3gzXVt5M10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGVtcHR5ID0gYXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG4gICAgICAgICAgY29uc3Qgc3Vycm91bmRpbmdFbXB0eSA9IHN1cnJvdW5kaW5nQXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG5cbiAgICAgICAgICByZXR1cm4gZW1wdHkgJiYgc3Vycm91bmRpbmdFbXB0eTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBpZiAoaXNFbXB0eSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcGxheWVyLnBsYWNlU2hpcChbaW5kZXhYLCBpbmRleFldLCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gICAgICAgIGRvbS5wb3B1bGF0ZUdyaWQocGxheWVyLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGRyYWdnZWRCb2F0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2JqZWN0LmlkKTtcbiAgICAgICAgZHJhZ2dlZEJvYXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0Jywgb25EcmFnKTtcbiAgICAgICAgZHJhZ2dlZEJvYXQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgIGRyYWdnZWRCb2F0LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgICAgIGdyaWRMaXN0ZW5lcnMoKTtcbiAgICAgIH07XG4gICAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZXZlbnQgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIG9uRHJvcCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdyaWRMaXN0ZW5lcnMoKTtcbiAgfSxcbiAgc2hvd1N0YXJ0aW5nRGlhbG9nKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICBkb20ucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBkaWFsb2dQbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcycpO1xuICAgIGRpYWxvZ1BsYWNlLnNob3dNb2RhbCgpO1xuICAgIGRvbS5kcmFnQW5kRHJvcChwbGF5ZXIxKTtcbiAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcnMocGxheWVyMSwgcGxheWVyMik7XG4gIH0sXG4gIGFkZEV2ZW50TGlzdGVuZXJzKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICBjb25zdCBvbGRTdGFydEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcyAuc3RhcnQnKTtcbiAgICBjb25zdCBzdGFydEJ1dHRvbiA9IG9sZFN0YXJ0QnV0dG9uLmNsb25lTm9kZSh0cnVlKTtcbiAgICBvbGRTdGFydEJ1dHRvbi5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzdGFydEJ1dHRvbiwgb2xkU3RhcnRCdXR0b24pO1xuICAgIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGlhbG9nUGxhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMnKTtcbiAgICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICAgIGxldCBjYW5TdGFydDtcbiAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgIGlmIChib2F0LmRyYWdnYWJsZSA9PT0gdHJ1ZSkgY2FuU3RhcnQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGNhblN0YXJ0ID09PSBmYWxzZSkgcmV0dXJuO1xuICAgICAgZGlhbG9nUGxhY2UuY2xvc2UoKTtcbiAgICAgIGRvbS5wb3B1bGF0ZUdyaWQocGxheWVyMS5nZXRHcmlkKCkpO1xuICAgICAgZG9tLnBvcHVsYXRlRW5lbXlHcmlkKHBsYXllcjEsIHBsYXllcjIpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb2xkQ2hEaXJlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGlyZWN0aW9uJyk7XG4gICAgY29uc3QgY2hEaXJlY3Rpb24gPSBvbGRDaERpcmVjdGlvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgb2xkQ2hEaXJlY3Rpb24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2hEaXJlY3Rpb24sIG9sZENoRGlyZWN0aW9uKTtcbiAgICBjaERpcmVjdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGJvYXREcmFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvYXRzLWRyYWcnKTtcbiAgICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIGJvYXREcmFnLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgICAgYm9hdC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9hdERyYWcuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKTtcbiAgICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgICBib2F0LmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IG9sZFJhbmRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yYW5kb20nKTtcbiAgICBjb25zdCByYW5kb20gPSBvbGRSYW5kb20uY2xvbmVOb2RlKHRydWUpO1xuICAgIG9sZFJhbmRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChyYW5kb20sIG9sZFJhbmRvbSk7XG4gICAgcmFuZG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgcGxheWVyMS5lbXB0eUdyaWQoKTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDUpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oNCk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oMik7XG4gICAgICBkb20ucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgIGNvbnN0IG9sZEJvYXQgPSBib2F0O1xuICAgICAgICBjb25zdCBuZXdCb2F0ID0gb2xkQm9hdC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIG9sZEJvYXQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Qm9hdCwgb2xkQm9hdCk7XG4gICAgICAgIG5ld0JvYXQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgIG5ld0JvYXQuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZG9tO1xuIiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcbmltcG9ydCBtdWx0aXBsYXllciBmcm9tICcuL211bHRpcGxheWVyJ1xuXG5jb25zdCBnYW1lID0ge1xuICBzdGFydEdhbWUoKSB7XG4gICAgY29uc3QgcGxheWVyMSA9IFBsYXllcigxKTtcbiAgICBjb25zdCBwbGF5ZXIyID0gUGxheWVyKDIpO1xuICAgIC8vIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDUpO1xuICAgIC8vIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDQpO1xuICAgIC8vIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgIC8vIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgIC8vIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDIpO1xuICAgIC8vIHBsYXllcjIucGxhY2VTaGlwKFs2LCAyXSwgNCwgJ2hvcml6b250YWwnKTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcChbNiwgNl0sIDMsICdob3Jpem9udGFsJyk7XG4gICAgLy8gcGxheWVyMi5wbGFjZVNoaXAoWzEsIDVdLCAzLCAndmVydGljYWwnKTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcChbNywgMF0sIDIsICdob3Jpem9udGFsJyk7XG4gICAgZG9tLnNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKTtcbiAgICAvLyBwbGF5ZXIxLnBsYWNlU2hpcChbMSwgM10sIDQsICdob3Jpem9udGFsJyk7XG4gICAgLy8gcGxheWVyMS5wbGFjZVNoaXAoWzcsIDNdLCAzLCAnaG9yaXpvbnRhbCcpO1xuICAgIC8vIHBsYXllcjEucGxhY2VTaGlwKFs4LCA4XSwgMiwgJ2hvcml6b250YWwnKTtcbiAgICAvLyBwbGF5ZXIxLnBsYWNlU2hpcChbMSwgNV0sIDIsICd2ZXJ0aWNhbCcpO1xuICB9LFxuICBzdGFydE11bHRpcGxheWVyKCkge1xuICAgIGNvbnN0IHBsYXllcjEgPSBQbGF5ZXIoMSk7XG4gICAgY29uc3QgcGxheWVyMiA9IFBsYXllcigyKTtcbiAgICBtdWx0aXBsYXllci5yZXNldEV2ZXJ5dGhpbmcoKTtcbiAgICBtdWx0aXBsYXllci5wcmVwYXJlU3RhcnRpbmdEaWFsb2coKTtcbiAgICBtdWx0aXBsYXllci5zaG93U3RhcnRpbmdEaWFsb2cocGxheWVyMSwgcGxheWVyMik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWU7XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuXG5jb25zdCBjcmVhdGVHcmlkID0gZnVuY3Rpb24gKG4gPSAxMCkge1xuICBjb25zdCBncmlkID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpICs9IDEpIHtcbiAgICBncmlkW2ldID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBuOyBqICs9IDEpIHtcbiAgICAgIGdyaWRbaV1bal0gPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBncmlkO1xufTtcblxuY29uc3QgR2FtZWJvYXJkID0gZnVuY3Rpb24gY3JlYXRlR2FtZWJvYXJkKCkge1xuICBsZXQgZ3JpZCA9IGNyZWF0ZUdyaWQoKTtcbiAgY29uc3QgcGxhY2VTaGlwID0gZnVuY3Rpb24gKHN0YXJ0LCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIGNvbnN0IHNoaXBPYmogPSBTaGlwKGxlbmd0aCk7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwT2JqLmxlbmd0aDsgaSArPSAxKSBncmlkW3N0YXJ0WzBdXVtzdGFydFsxXSArIGldID0gc2hpcE9iajtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwT2JqLmxlbmd0aDsgaSArPSAxKSBncmlkW3N0YXJ0WzBdICsgaV1bc3RhcnRbMV1dID0gc2hpcE9iajtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwUmFuZG9tID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgIGxldCB4O1xuICAgIGxldCB5O1xuICAgIGxldCBpc0VtcHR5ID0gZmFsc2U7XG4gICAgbGV0IGRpcmVjdGlvbjtcbiAgICBjb25zdCBudW0gPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xuICAgIGlmIChudW0gPT09IDApIHtcbiAgICAgIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgICB9IGVsc2Uge1xuICAgICAgZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICB9XG4gICAgd2hpbGUgKGlzRW1wdHkgPT09IGZhbHNlKSB7XG4gICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblxuICAgICAgaXNFbXB0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgICAgIGNvbnN0IHN1cnJvdW5kaW5nQXJyYXkgPSBbXTtcblxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgJiYgeCArIGxlbmd0aCA+IGdyaWQubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcgJiYgeSArIGxlbmd0aCA+PSBncmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFycmF5LnB1c2goZ3JpZFt4XVt5XSk7XG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2goZ3JpZFt4ICsgaV1beV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBhcnJheS5wdXNoKGdyaWRbeF1beSArIGldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gLTE7IGkgPD0gbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBjb25zdCB4MSA9IHggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMCk7XG4gICAgICAgICAgY29uc3QgeTEgPSB5ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gMCA6IGkpO1xuICAgICAgICAgIGNvbnN0IHgyID0geCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAtMSk7XG4gICAgICAgICAgY29uc3QgeTIgPSB5ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gLTEgOiBpKTtcbiAgICAgICAgICBjb25zdCB4MyA9IHggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMSk7XG4gICAgICAgICAgY29uc3QgeTMgPSB5ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gMSA6IGkpO1xuXG4gICAgICAgICAgaWYgKHgxID49IDAgJiYgeDEgPCBncmlkLmxlbmd0aCAmJiB5MSA+PSAwICYmIHkxIDwgZ3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChncmlkW3gxXVt5MV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeDIgPj0gMCAmJiB4MiA8IGdyaWQubGVuZ3RoICYmIHkyID49IDAgJiYgeTIgPCBncmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKGdyaWRbeDJdW3kyXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh4MyA+PSAwICYmIHgzIDwgZ3JpZC5sZW5ndGggJiYgeTMgPj0gMCAmJiB5MyA8IGdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2goZ3JpZFt4M11beTNdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbXB0eSA9IGFycmF5LmV2ZXJ5KHNxdWFyZSA9PiBzcXVhcmUgPT09IG51bGwpO1xuICAgICAgICBjb25zdCBzdXJyb3VuZGluZ0VtcHR5ID0gc3Vycm91bmRpbmdBcnJheS5ldmVyeShzcXVhcmUgPT4gc3F1YXJlID09PSBudWxsKTtcblxuICAgICAgICByZXR1cm4gZW1wdHkgJiYgc3Vycm91bmRpbmdFbXB0eTtcbiAgICAgIH0pKCk7XG4gICAgfVxuICAgIGNvbnN0IHNoaXBPYmogPSBTaGlwKGxlbmd0aCk7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwT2JqLmxlbmd0aDsgaSArPSAxKSBncmlkW3hdW3kgKyBpXSA9IHNoaXBPYmo7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcE9iai5sZW5ndGg7IGkgKz0gMSkgZ3JpZFt4ICsgaV1beV0gPSBzaGlwT2JqO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBlbXB0eUdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ3JpZCA9IGNyZWF0ZUdyaWQoKTtcbiAgfVxuXG4gIGNvbnN0IHJlY2VpdmVIaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGNvbnN0IHZhbHVlID0gZ3JpZFt4XVt5XTtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIGdyaWRbeF1beV0gPSAnd2F0ZXInO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YWx1ZS5hZGRIaXQoKTtcbiAgICBncmlkW3hdW3ldID0gWydoaXQnLCB2YWx1ZV07XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIGNvbnN0IGFsbFN1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBpZiAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoc2xvdCkpIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBjb25zdCBjb3VudEJvYXRzQWxpdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYm9hdHMgPSBbXTtcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBzbG90ICE9PSBudWxsICYmXG4gICAgICAgICAgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgIUFycmF5LmlzQXJyYXkoc2xvdCkgJiZcbiAgICAgICAgICAhYm9hdHMuaW5jbHVkZXMoc2xvdClcbiAgICAgICAgKSB7XG4gICAgICAgICAgYm9hdHMucHVzaChzbG90KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJvYXRzLmxlbmd0aDtcbiAgfTtcblxuICBjb25zdCBnZXRHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBncmlkO1xuICB9O1xuICByZXR1cm4geyBnZXRHcmlkLCBlbXB0eUdyaWQsIHBsYWNlU2hpcCwgcGxhY2VTaGlwUmFuZG9tLCByZWNlaXZlSGl0LCBhbGxTdW5rLCBjb3VudEJvYXRzQWxpdmUgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsImltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZSc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcblxuY29uc3QgbXVsdGlwbGF5ZXIgPSB7XG4gIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICBwbGF5ZXJQbGFjaW5nOiAxLFxuICBwb3B1bGF0ZUdyaWQoZ3JpZCwgc3RhcnQgPSBmYWxzZSkge1xuICAgIGxldCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQxJyk7XG4gICAgaWYgKHN0YXJ0ID09PSB0cnVlKSB7XG4gICAgICBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICB9XG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSAnbGluZSc7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpZiAoc2xvdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGVtcHR5JztcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNsb3QpKSB7XG4gICAgICAgICAgY29uc3Qgc3VuayA9IHNsb3RbMV0uaXNTdW5rKCk7XG4gICAgICAgICAgaWYgKHN1bmsgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBoaXQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc3Vuayc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc2hpcCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gJ3dhdGVyJykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHdhdGVyJztcbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfVxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgIH0pO1xuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH0pO1xuICB9LFxuICBwb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgdGhpcy5wbGF5ZXIxID0gcGxheWVyMTtcbiAgICB0aGlzLnBsYXllcjIgPSBwbGF5ZXIyO1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDInKTtcbiAgICBjb25zdCBncmlkID0gdGhpcy5wbGF5ZXIyLmdldEdyaWQoKTtcbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmNsYXNzTmFtZSA9ICdsaW5lJztcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHNsb3QpKSB7XG4gICAgICAgICAgY29uc3Qgc3VuayA9IHNsb3RbMV0uaXNTdW5rKCk7XG4gICAgICAgICAgaWYgKHN1bmsgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBoaXQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc3Vuayc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgPT09IG51bGwgfHwgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnKSkge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGVtcHR5JztcbiAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBtdWx0aXBsYXllci5zcXVhcmVDbGlja2VkKTtcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSAnd2F0ZXInKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgd2F0ZXInO1xuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgICAgfSk7XG4gICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gICAgfSk7XG4gIH0sXG4gIHNxdWFyZUNsaWNrZWQ6IGFzeW5jIGV2ZW50ID0+IHtcbiAgICBjb25zdCBlbmVteUdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDInKTtcbiAgICBjb25zdCBjb2x1bW4gPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgY29uc3QgY2xpY2tlZFNxdWFyZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgY29uc3QgaW5kZXhZID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb2x1bW4uY2hpbGRyZW4sIGNsaWNrZWRTcXVhcmUpO1xuICAgIGNvbnN0IGluZGV4WCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZW5lbXlHcmlkLmNoaWxkcmVuLCBjb2x1bW4pO1xuICAgIGNvbnN0IGhpdCA9IG11bHRpcGxheWVyLnBsYXllcjEuYXR0YWNrKG11bHRpcGxheWVyLnBsYXllcjIsIGluZGV4WCwgaW5kZXhZKTtcbiAgICBpZiAobXVsdGlwbGF5ZXIucGxheWVyMi5hbGxTdW5rKCkgIT09IGZhbHNlKSByZXR1cm4gbXVsdGlwbGF5ZXIucGxheWVyV29uKG11bHRpcGxheWVyLnBsYXllcjEpO1xuICAgIG11bHRpcGxheWVyLnBvcHVsYXRlRW5lbXlHcmlkKG11bHRpcGxheWVyLnBsYXllcjEsIG11bHRpcGxheWVyLnBsYXllcjIpO1xuICAgIG11bHRpcGxheWVyLnVwZGF0ZUJvYXRzQWxpdmUoKTtcbiAgICBpZiAoaGl0ID09PSBmYWxzZSkge1xuICAgICAgbXVsdGlwbGF5ZXIuc2hvd1dhdGVyRGlhbG9nKCk7XG4gICAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUdyaWQobXVsdGlwbGF5ZXIucGxheWVyMi5nZXRHcmlkKCkpO1xuICAgICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVFbmVteUdyaWQobXVsdGlwbGF5ZXIucGxheWVyMiwgbXVsdGlwbGF5ZXIucGxheWVyMSk7XG4gICAgICBtdWx0aXBsYXllci51cGRhdGVCb2F0c0FsaXZlKCk7XG4gICAgICBtdWx0aXBsYXllci50b2dnbGVUdXJuKCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgc2hvd1dhdGVyRGlhbG9nKCkge1xuICAgIGNvbnN0IHdhdGVyRGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndhdGVyLWRpYWxvZycpO1xuICAgIHdhdGVyRGlhbG9nLnNob3dNb2RhbCgpO1xuICAgIHdhdGVyRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICBjb25zdCBjbG9zZURpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGFuZ2UtdHVybicpO1xuICAgIGNsb3NlRGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgd2F0ZXJEaWFsb2cuY2xvc2UoKTtcbiAgICAgIHdhdGVyRGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB9KTtcbiAgfSxcbiAgLy8gZGVsYXkobXMpIHtcbiAgLy8gICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG4gIC8vIH0sXG4gIHBsYXllcldvbihwbGF5ZXIpIHtcbiAgICBjb25zdCBkaWFsb2dXaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2luJyk7XG4gICAgZGlhbG9nV2luLnNob3dNb2RhbCgpO1xuICAgIGNvbnN0IHJlc3RhcnQgPSBkaWFsb2dXaW4ucXVlcnlTZWxlY3RvcignLnJlc3RhcnQnKTtcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gZ2FtZS5zdGFydE11bHRpcGxheWVyKCkpO1xuICAgIHJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBkaWFsb2dXaW4uY2xvc2UoKTtcbiAgICB9KTtcbiAgICBjb25zdCB0dXJucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50dXJucycpO1xuICAgIHR1cm5zLnRleHRDb250ZW50ID0gYFBsYXllciAke3BsYXllci5udW1iZXJ9IHdvbiEhIWA7XG4gICAgY29uc3Qgd2lubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lcicpO1xuICAgIHdpbm5lci50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXIubnVtYmVyfSB3b24hISFgO1xuICAgIHdpbm5lci5jbGFzc05hbWUgPSAnd2lubmVyJztcbiAgICBpZiAocGxheWVyLm51bWJlciA9PT0gMikge1xuICAgICAgd2lubmVyLmNsYXNzTGlzdC5hZGQoJ3R3bycpO1xuICAgIH1cbiAgfSxcbiAgdG9nZ2xlVHVybigpIHtcbiAgICBjb25zdCBkaXZUdXJucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50dXJucycpO1xuICAgIGNvbnN0IGF0dGFja2VyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci5vbmUnKTtcbiAgICBjb25zdCBhdHRhY2tlckluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5mby5vbmUnKTtcbiAgICBjb25zdCBkZWZlbmRvckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXIudHdvJyk7XG4gICAgY29uc3QgZGVmZW5kb3JJbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmluZm8udHdvJyk7XG4gICAgY29uc3QgY3VycmVudFR1cm4gPSBkaXZUdXJucy50ZXh0Q29udGVudC5zdWJzdHJpbmcoNywgOCk7XG4gICAgaWYgKGN1cnJlbnRUdXJuID09PSAnMScpIHtcbiAgICAgIGRpdlR1cm5zLnRleHRDb250ZW50ID0gJ1BsYXllciAyIHR1cm4nO1xuICAgICAgZGl2VHVybnMuY2xhc3NOYW1lID0gJ3R1cm5zIHJlZCc7XG4gICAgICBhdHRhY2tlckRpdi50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMic7XG4gICAgICBhdHRhY2tlckluZm8uY2xhc3NOYW1lID0gJ2luZm8gb25lIHJlZCc7XG4gICAgICBkZWZlbmRvckRpdi50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMSc7XG4gICAgICBkZWZlbmRvckluZm8uY2xhc3NOYW1lID0gJ2luZm8gdHdvJztcbiAgICB9IGVsc2Uge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDEgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMnO1xuICAgICAgYXR0YWNrZXJEaXYudGV4dENvbnRlbnQgPSAnUGxheWVyIDEnO1xuICAgICAgYXR0YWNrZXJJbmZvLmNsYXNzTmFtZSA9ICdpbmZvIG9uZSc7XG4gICAgICBkZWZlbmRvckRpdi50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMic7XG4gICAgICBkZWZlbmRvckluZm8uY2xhc3NOYW1lID0gJ2luZm8gdHdvIHJlZCc7XG4gICAgfVxuICB9LFxuICB1cGRhdGVCb2F0c0FsaXZlKCkge1xuICAgIGNvbnN0IHBhcmExID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLm9uZScpO1xuICAgIGNvbnN0IGJvYXRzQWxpdmUxID0gbXVsdGlwbGF5ZXIucGxheWVyMS5jb3VudEJvYXRzQWxpdmUoKTtcbiAgICBwYXJhMS50ZXh0Q29udGVudCA9IGBBbGl2ZSBzaGlwcyAke2JvYXRzQWxpdmUxfWA7XG4gICAgY29uc3QgcGFyYTIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHMtYWxpdmUudHdvJyk7XG4gICAgY29uc3QgYm9hdHNBbGl2ZTIgPSBtdWx0aXBsYXllci5wbGF5ZXIyLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIHBhcmEyLnRleHRDb250ZW50ID0gYEFsaXZlIHNoaXBzICR7Ym9hdHNBbGl2ZTJ9YDtcbiAgfSxcbiAgZHJhZ0FuZERyb3AocGxheWVyKSB7XG4gICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgIGNvbnN0IG9uRHJhZyA9IGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHsgbGVuZ3RoOiBldmVudC5jdXJyZW50VGFyZ2V0LmNoaWxkcmVuLmxlbmd0aCwgaWQ6IGV2ZW50LmN1cnJlbnRUYXJnZXQuaWQgfSlcbiAgICAgICk7XG4gICAgfTtcbiAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgYm9hdC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBvbkRyYWcpO1xuICAgICAgYm9hdC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgYm9hdC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZ3JpZExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjZ3JpZC1wbGFjZSAuc3F1YXJlLmVtcHR5Jyk7XG4gICAgICBjb25zdCBvbkRyb3AgPSBldmVudCA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGpzb24gPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICBjb25zdCBvYmplY3QgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgICAgICBjb25zdCB7IGxlbmd0aCB9ID0gb2JqZWN0O1xuICAgICAgICBjb25zdCBncmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICBjb25zdCBjbGlja2VkU3F1YXJlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgaW5kZXhZID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb2x1bW4uY2hpbGRyZW4sIGNsaWNrZWRTcXVhcmUpO1xuICAgICAgICBjb25zdCBpbmRleFggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGdyaWQuY2hpbGRyZW4sIGNvbHVtbik7XG4gICAgICAgIGNvbnN0IHsgZGlyZWN0aW9uIH0gPSBtdWx0aXBsYXllcjtcbiAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IHBsYXllci5nZXRHcmlkKCk7XG4gICAgICAgIGNvbnN0IGlzRW1wdHkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgICAgICAgY29uc3Qgc3Vycm91bmRpbmdBcnJheSA9IFtdO1xuXG4gICAgICAgICAgYXJyYXkucHVzaChwbGF5ZXJHcmlkW2luZGV4WF1baW5kZXhZXSk7XG4gICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgIGFycmF5LnB1c2gocGxheWVyR3JpZFtpbmRleFggKyBpXVtpbmRleFldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICBhcnJheS5wdXNoKHBsYXllckdyaWRbaW5kZXhYXVtpbmRleFkgKyBpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IC0xOyBpIDw9IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCB4MSA9IGluZGV4WCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAwKTtcbiAgICAgICAgICAgIGNvbnN0IHkxID0gaW5kZXhZICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gMCA6IGkpO1xuICAgICAgICAgICAgY29uc3QgeDIgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogLTEpO1xuICAgICAgICAgICAgY29uc3QgeTIgPSBpbmRleFkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAtMSA6IGkpO1xuICAgICAgICAgICAgY29uc3QgeDMgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMSk7XG4gICAgICAgICAgICBjb25zdCB5MyA9IGluZGV4WSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDEgOiBpKTtcblxuICAgICAgICAgICAgaWYgKHgxID49IDAgJiYgeDEgPCBwbGF5ZXJHcmlkLmxlbmd0aCAmJiB5MSA+PSAwICYmIHkxIDwgcGxheWVyR3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKHBsYXllckdyaWRbeDFdW3kxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeDIgPj0gMCAmJiB4MiA8IHBsYXllckdyaWQubGVuZ3RoICYmIHkyID49IDAgJiYgeTIgPCBwbGF5ZXJHcmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2gocGxheWVyR3JpZFt4Ml1beTJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh4MyA+PSAwICYmIHgzIDwgcGxheWVyR3JpZC5sZW5ndGggJiYgeTMgPj0gMCAmJiB5MyA8IHBsYXllckdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChwbGF5ZXJHcmlkW3gzXVt5M10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGVtcHR5ID0gYXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG4gICAgICAgICAgY29uc3Qgc3Vycm91bmRpbmdFbXB0eSA9IHN1cnJvdW5kaW5nQXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG5cbiAgICAgICAgICByZXR1cm4gZW1wdHkgJiYgc3Vycm91bmRpbmdFbXB0eTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBpZiAoaXNFbXB0eSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcGxheWVyLnBsYWNlU2hpcChbaW5kZXhYLCBpbmRleFldLCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gICAgICAgIG11bHRpcGxheWVyLnBvcHVsYXRlR3JpZChwbGF5ZXIuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICAgICAgY29uc3QgZHJhZ2dlZEJvYXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvYmplY3QuaWQpO1xuICAgICAgICBkcmFnZ2VkQm9hdC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBvbkRyYWcpO1xuICAgICAgICBkcmFnZ2VkQm9hdC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgZHJhZ2dlZEJvYXQuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICAgICAgZ3JpZExpc3RlbmVycygpO1xuICAgICAgfTtcbiAgICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBldmVudCA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgb25Ecm9wKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ3JpZExpc3RlbmVycygpO1xuICB9LFxuICBwcmVwYXJlU3RhcnRpbmdEaWFsb2coKSB7XG4gICAgY29uc3Qgc3RhcnRpbmdCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMgLnN0YXJ0Jyk7XG4gICAgc3RhcnRpbmdCdXR0b24udGV4dENvbnRlbnQgPSAnTmV4dCc7XG4gICAgY29uc3QgZGlhbG9nVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWhlYWRlciBoMicpO1xuICAgIGRpYWxvZ1RpdGxlLnRleHRDb250ZW50ID0gJ1BsYWNlIHlvdXIgc2hpcHMgQ2FwdGFpbiAxISc7XG4gIH0sXG4gIHNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBkaWFsb2dQbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcycpO1xuICAgIGRpYWxvZ1BsYWNlLnNob3dNb2RhbCgpO1xuICAgIG11bHRpcGxheWVyLmRyYWdBbmREcm9wKHBsYXllcjEpO1xuICAgIG11bHRpcGxheWVyLmFkZEV2ZW50TGlzdGVuZXJzKHBsYXllcjEsIHBsYXllcjIpO1xuICB9LFxuICBhZGRFdmVudExpc3RlbmVycyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgY29uc3Qgb2xkU3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMgLnN0YXJ0Jyk7XG4gICAgY29uc3Qgc3RhcnRCdXR0b24gPSBvbGRTdGFydEJ1dHRvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgb2xkU3RhcnRCdXR0b24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc3RhcnRCdXR0b24sIG9sZFN0YXJ0QnV0dG9uKTtcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRpYWxvZ1BsYWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzJyk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBsZXQgY2FuU3RhcnQ7XG4gICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICBpZiAoYm9hdC5kcmFnZ2FibGUgPT09IHRydWUpIGNhblN0YXJ0ID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIGlmIChjYW5TdGFydCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgIGlmICh0aGlzLnBsYXllclBsYWNpbmcgPT09IDEpIHtcbiAgICAgICAgY29uc3QgZGlhbG9nVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWhlYWRlciBoMicpO1xuICAgICAgICBkaWFsb2dUaXRsZS50ZXh0Q29udGVudCA9ICdQbGFjZSB5b3VyIHNoaXBzIENhcHRhaW4gMiEnO1xuICAgICAgICBzdGFydEJ1dHRvbi50ZXh0Q29udGVudCA9ICdTdGFydCc7XG4gICAgICAgIHRoaXMucGxheWVyUGxhY2luZyA9IDI7XG4gICAgICAgIHRoaXMuc2hvd1N0YXJ0aW5nRGlhbG9nKHBsYXllcjIsIHBsYXllcjEpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBkaWFsb2dQbGFjZS5jbG9zZSgpO1xuICAgICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVHcmlkKHBsYXllcjIuZ2V0R3JpZCgpKTtcbiAgICAgIG11bHRpcGxheWVyLnBvcHVsYXRlRW5lbXlHcmlkKHBsYXllcjIsIHBsYXllcjEpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb2xkQ2hEaXJlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGlyZWN0aW9uJyk7XG4gICAgY29uc3QgY2hEaXJlY3Rpb24gPSBvbGRDaERpcmVjdGlvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgb2xkQ2hEaXJlY3Rpb24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2hEaXJlY3Rpb24sIG9sZENoRGlyZWN0aW9uKTtcbiAgICBjaERpcmVjdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGJvYXREcmFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvYXRzLWRyYWcnKTtcbiAgICAgIGNvbnN0IGJvYXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXQnKTtcbiAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIGJvYXREcmFnLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgICAgYm9hdC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9hdERyYWcuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKTtcbiAgICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgICBib2F0LmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IG9sZFJhbmRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yYW5kb20nKTtcbiAgICBjb25zdCByYW5kb20gPSBvbGRSYW5kb20uY2xvbmVOb2RlKHRydWUpO1xuICAgIG9sZFJhbmRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChyYW5kb20sIG9sZFJhbmRvbSk7XG4gICAgcmFuZG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgcGxheWVyMS5lbXB0eUdyaWQoKTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDUpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oNCk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oMik7XG4gICAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUdyaWQocGxheWVyMS5nZXRHcmlkKCksIHRydWUpO1xuICAgICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgY29uc3Qgb2xkQm9hdCA9IGJvYXQ7XG4gICAgICAgIGNvbnN0IG5ld0JvYXQgPSBvbGRCb2F0LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgb2xkQm9hdC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdCb2F0LCBvbGRCb2F0KTtcbiAgICAgICAgbmV3Qm9hdC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgbmV3Qm9hdC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHJlc2V0RXZlcnl0aGluZygpIHtcbiAgICB0aGlzLnBsYXllcjEgPSBudWxsO1xuICAgIHRoaXMucGxheWVyMiA9IG51bGw7XG4gICAgdGhpcy5wbGF5ZXJQbGFjaW5nID0gMTtcbiAgICB0aGlzLmRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgbXVsdGlwbGF5ZXI7XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gJy4vZ2FtZWJvYXJkJztcblxuY29uc3QgUGxheWVyID0gZnVuY3Rpb24gKG51bWJlcikge1xuICBjb25zdCBnYW1lYm9hcmQgPSBHYW1lYm9hcmQoKTtcblxuICBjb25zdCBhbGxTdW5rID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnYW1lYm9hcmQuYWxsU3VuaygpO1xuICB9O1xuXG4gIGNvbnN0IHdpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ0kgd29uJztcbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAoc3RhcnQsIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgZ2FtZWJvYXJkLnBsYWNlU2hpcChzdGFydCwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcFJhbmRvbSA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwUmFuZG9tKGxlbmd0aCk7XG4gIH07XG5cbiAgY29uc3QgZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLmdldEdyaWQoKTtcbiAgfTtcblxuICBjb25zdCBlbXB0eUdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2FtZWJvYXJkLmVtcHR5R3JpZCgpO1xuICB9XG5cbiAgY29uc3QgY291bnRCb2F0c0FsaXZlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnYW1lYm9hcmQuY291bnRCb2F0c0FsaXZlKCk7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUhpdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5yZWNlaXZlSGl0KHgsIHkpO1xuICB9O1xuXG4gIGNvbnN0IGF0dGFjayA9IGZ1bmN0aW9uIChwbGF5ZXIsIHgsIHkpIHtcbiAgICBjb25zdCBoaXQgPSBwbGF5ZXIucmVjZWl2ZUhpdCh4LCB5KTtcbiAgICBpZiAocGxheWVyLmFsbFN1bmsoKSkge1xuICAgICAgcmV0dXJuIHdpbigpO1xuICAgIH1cbiAgICByZXR1cm4gaGl0O1xuICB9O1xuXG4gIGNvbnN0IHJhbmRvbUF0dGFjayA9IGZ1bmN0aW9uIChwbGF5ZXIpIHtcbiAgICBsZXQgeDtcbiAgICBsZXQgeTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICBpZiAodHlwZW9mIHBsYXllci5nZXRHcmlkKClbeF1beV0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHBsYXllci5nZXRHcmlkKClbeF1beV0pKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXR0YWNrKHBsYXllciwgeCwgeSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBudW1iZXIsXG4gICAgYWxsU3VuayxcbiAgICBwbGFjZVNoaXAsXG4gICAgZ2V0R3JpZCxcbiAgICByZWNlaXZlSGl0LFxuICAgIGF0dGFjayxcbiAgICB3aW4sXG4gICAgcmFuZG9tQXR0YWNrLFxuICAgIGNvdW50Qm9hdHNBbGl2ZSxcbiAgICBwbGFjZVNoaXBSYW5kb20sXG4gICAgZW1wdHlHcmlkLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY29uc3QgU2hpcCA9IGZ1bmN0aW9uIGNyZWF0ZVNoaXAoc2hpcExlbmd0aCkge1xuICBjb25zdCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xuICBsZXQgaGl0cyA9IDA7XG4gIGNvbnN0IGFkZEhpdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBoaXRzICs9IDE7XG4gICAgcmV0dXJuIGhpdHM7XG4gIH07XG4gIGNvbnN0IGlzU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGl0cyA9PT0gbGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHJldHVybiB7IGxlbmd0aCwgYWRkSGl0LCBpc1N1bmsgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIiosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gfVxcbiBcXG5cXG4qIHtcXG5tYXJnaW46IDA7XFxucGFkZGluZzogMDtcXG59XFxuXFxuXFxuYm9keSB7XFxubGluZS1oZWlnaHQ6IDEuNTtcXG4td2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG5mb250LWZhbWlseTogJ1J1YmlrIEJ1YmJsZXMnLCBDb3VyaWVyLCBtb25vc3BhY2U7XFxufVxcblxcblxcbmltZywgcGljdHVyZSwgdmlkZW8sIGNhbnZhcywgc3ZnIHtcXG5kaXNwbGF5OiBibG9jaztcXG5tYXgtd2lkdGg6IDEwMCU7XFxufVxcblxcblxcbmlucHV0LCBidXR0b24sIHRleHRhcmVhLCBzZWxlY3Qge1xcbmZvbnQ6IGluaGVyaXQ7XFxufVxcblxcblxcbnAsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcbm92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XFxufVxcblxcblxcbmJ1dHRvbiwgYXtcXG5jdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcblxcbmF7XFxuICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5cXG5cXG5cXG4vKiBGb290ZXIgKi9cXG5cXG5cXG5odG1sIHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbnBvc2l0aW9uOiByZWxhdGl2ZTtcXG5taW4taGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5cXG5ib2R5IHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbm1hcmdpbi1ib3R0b206IDQ4cHg7XFxufVxcblxcblxcbi5mb290ZXIge1xcbnBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5ib3R0b206IDA7XFxubGVmdDogMDtcXG5kaXNwbGF5OiBmbGV4O1xcbmFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuanVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuZ2FwOiAxMHB4O1xcbndpZHRoOiAxMDAlO1xcbnBhZGRpbmc6IDEwcHg7XFxuYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMThweDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1YiB7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMjJweDtcXG50cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1Yjpob3ZlciB7XFxudHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKSBzY2FsZSgxLjIpO1xcbn1cXG5cXG4vKiBTdHlsaW5nICovXFxuXFxuOnJvb3R7XFxuIC0taGVhZGVyLWJnOiAjM0QzRDNEO1xcbiAtLW1haW4tYmc6IzMwMzAzMDtcXG4gLS10ZXh0OiNGRkZGRkY7XFxuIC0tZ3JpZC1ib3JkZXJzOiMwMDJDNjY7XFxuIC0tZ3JpZC1zcXVhcmVzOiMyMzg5REE7XFxuIC0tbXktYm9hdHM6IzgwODA4MDtcXG4gLS1teS1ib2F0cy1ib3JkZXI6IzQ2NDY0NjtcXG4gLS1zaGlwLWhpdDojRjgyNzI3O1xcbiAtLXNoaXAtc3VuazojRDE2MDYwO1xcbiAtLWdyZWVuLXRleHQ6IzJCQzU1NztcXG4gLS1yZWQtdGV4dDojRTIzNjM2O1xcbn1cXG5cXG5ib2R5IHtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG5oZWFkZXJ7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGVhZGVyLWJnKTtcXG4gICBmbGV4OiAxO1xcbn1cXG5cXG5oMXtcXG4gICBmb250LXNpemU6IDIuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbn1cXG5cXG5tYWlue1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIGZsZXg6IDc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1dmg7XFxuICAgcGFkZGluZzogNXZoIDBweDtcXG59XFxuXFxuLnR1cm5ze1xcbiAgIHBhZGRpbmc6IDEwcHggMzBweDtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgZm9udC1zaXplOiAycmVtOztcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4udHVybnMucmVkIHtcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbiAgIGJvcmRlcjogMnB4IHJpZGdlIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmdyaWQtY29udGFpbmVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdnc7XFxufVxcblxcbi53cmFwcGVye1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ubnVtYmVyLXdyYXBwZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ueS13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBnYXA6IDVweDtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXN7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIG1pbi1oZWlnaHQ6IDcwdmg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXMgcHtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uZ3JpZCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhc3BlY3QtcmF0aW86IDEvMTtcXG4gICBoZWlnaHQ6IDcwdmg7XFxuICAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tZ3JpZC1ib3JkZXJzKTtcXG4gICBib3JkZXItcmFkaXVzOiA2cHg7XFxufVxcblxcbi54LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IDcwdmg7XFxuICAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi54LWNvb3JkaW5hdGVzIHB7XFxuICAgd2lkdGg6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5saW5le1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICB3aWR0aDogMTAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG59XFxuXFxuLnNxdWFyZXtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMCU7XFxuICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XFxufVxcblxcblxcblxcbiNncmlkMiAuc3F1YXJlLmVtcHR5OmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxMTAsIDgsIDE5NCk7XFxuICAgY3Vyc29yOmNyb3NzaGFpcjtcXG59XFxuXFxuLnNxdWFyZS5zaGlwe1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XFxuXFxuLnNxdWFyZS53YXRlcntcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDJyZW07XFxufVxcblxcbi5zcXVhcmUuaGl0IHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLWhpdCk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgZm9udC13ZWlnaHQ6IDgwMDtcXG59XFxuXFxuLnNxdWFyZS5zdW5rIHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLXN1bmspO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5pbmZve1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mbyAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mby5yZWR7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmluZm8ucmVkIC5zaGlwcy1hbGl2ZXtcXG4gICBib3JkZXItdG9wOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5cXG5cXG5cXG5kaWFsb2d7XFxuICAgdG9wOiA1MCU7XFxuICAgbGVmdDogNTAlO1xcbiAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgIGhlaWdodDogNTB2aDtcXG4gICB3aWR0aDogMTAwdnc7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1iZyk7XFxuICAgb3BhY2l0eTogMC45O1xcbiAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlc21va2U7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuXFxuXFxuLmRpYWxvZy1jb250YWluZXJ7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMDAlO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgIGdhcDogMTB2aDtcXG59XFxuXFxuLndpbm5lcntcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIHBhZGRpbmc6IDIwcHg7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuLndpbm5lci50d297XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbmJ1dHRvbntcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IG5vbmU7XFxuICAgb3V0bGluZTogbm9uZTtcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgIHBhZGRpbmc6IDEwcHg7XFxuICAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIDtcXG59XFxuXFxuYnV0dG9uOmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMge1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgbWluLWhlaWdodDogMTAwdmg7XFxuICAgb3BhY2l0eTogMC45ODtcXG4gICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuZGlhbG9nLWNvbnRhaW5lcntcXG4gICBnYXA6IDJ2aDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5kaWFsb2ctaGVhZGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZ2FwOiA4dnc7XFxufVxcblxcbmgye1xcbiAgIGZvbnQtc2l6ZTogMS44cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA0MDA7XFxufVxcblxcbiNkaXJlY3Rpb24ge1xcbiAgIHBhZGRpbmc6IDVweDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC53cmFwcGVyIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgIGdhcDogNXZ3O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdHMtZHJhZyB7XFxuICAgd2lkdGg6IDIwdjtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgZ2FwOiAzdmg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdHMtZHJhZy52ZXJ0aWNhbCB7XFxuICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICBnYXA6IDN2dztcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0LXdyYXBwZXIge1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQudmVydGljYWwge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24tc2VsZjogY2VudGVyO1xcbn1cXG5cXG4uYm9hdCAuYm9hdC1zcXVhcmUge1xcbiAgIGZsZXg6IG5vbmU7XFxuICAgd2lkdGg6IDd2aDtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcblxcbi53YXRlci1kaWFsb2d7XFxuICAgb3BhY2l0eTogMDtcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBmb250LXNpemU6IDRyZW07XFxuICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzO1xcbiAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLndhdGVyLWRpYWxvZy5zaG93e1xcbiAgIG9wYWNpdHk6IDE7XFxufVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxzQkFBc0I7Q0FDdkI7OztBQUdEO0FBQ0EsU0FBUztBQUNULFVBQVU7QUFDVjs7O0FBR0E7QUFDQSxnQkFBZ0I7QUFDaEIsbUNBQW1DO0FBQ25DLGdEQUFnRDtBQUNoRDs7O0FBR0E7QUFDQSxjQUFjO0FBQ2QsZUFBZTtBQUNmOzs7QUFHQTtBQUNBLGFBQWE7QUFDYjs7O0FBR0E7QUFDQSx5QkFBeUI7QUFDekI7OztBQUdBO0FBQ0EsZUFBZTtBQUNmOzs7QUFHQTtHQUNHLHFCQUFxQjtBQUN4Qjs7Ozs7QUFLQSxXQUFXOzs7QUFHWDtBQUNBLG1CQUFtQjtBQUNuQixrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBLG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkI7OztBQUdBO0FBQ0Esa0JBQWtCO0FBQ2xCLFNBQVM7QUFDVCxPQUFPO0FBQ1AsYUFBYTtBQUNiLG1CQUFtQjtBQUNuQix1QkFBdUI7QUFDdkIsU0FBUztBQUNULFdBQVc7QUFDWCxhQUFhO0FBQ2IsdUJBQXVCO0FBQ3ZCLFlBQVk7QUFDWixlQUFlO0FBQ2Y7OztBQUdBO0FBQ0EsWUFBWTtBQUNaLGVBQWU7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VTtBQUNiXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gfVxcbiBcXG5cXG4qIHtcXG5tYXJnaW46IDA7XFxucGFkZGluZzogMDtcXG59XFxuXFxuXFxuYm9keSB7XFxubGluZS1oZWlnaHQ6IDEuNTtcXG4td2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG5mb250LWZhbWlseTogJ1J1YmlrIEJ1YmJsZXMnLCBDb3VyaWVyLCBtb25vc3BhY2U7XFxufVxcblxcblxcbmltZywgcGljdHVyZSwgdmlkZW8sIGNhbnZhcywgc3ZnIHtcXG5kaXNwbGF5OiBibG9jaztcXG5tYXgtd2lkdGg6IDEwMCU7XFxufVxcblxcblxcbmlucHV0LCBidXR0b24sIHRleHRhcmVhLCBzZWxlY3Qge1xcbmZvbnQ6IGluaGVyaXQ7XFxufVxcblxcblxcbnAsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcbm92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XFxufVxcblxcblxcbmJ1dHRvbiwgYXtcXG5jdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcblxcbmF7XFxuICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5cXG5cXG5cXG4vKiBGb290ZXIgKi9cXG5cXG5cXG5odG1sIHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbnBvc2l0aW9uOiByZWxhdGl2ZTtcXG5taW4taGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5cXG5ib2R5IHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbm1hcmdpbi1ib3R0b206IDQ4cHg7XFxufVxcblxcblxcbi5mb290ZXIge1xcbnBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5ib3R0b206IDA7XFxubGVmdDogMDtcXG5kaXNwbGF5OiBmbGV4O1xcbmFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuanVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuZ2FwOiAxMHB4O1xcbndpZHRoOiAxMDAlO1xcbnBhZGRpbmc6IDEwcHg7XFxuYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMThweDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1YiB7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMjJweDtcXG50cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1Yjpob3ZlciB7XFxudHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKSBzY2FsZSgxLjIpO1xcbn1cXG5cXG4vKiBTdHlsaW5nICovXFxuXFxuOnJvb3R7XFxuIC0taGVhZGVyLWJnOiAjM0QzRDNEO1xcbiAtLW1haW4tYmc6IzMwMzAzMDtcXG4gLS10ZXh0OiNGRkZGRkY7XFxuIC0tZ3JpZC1ib3JkZXJzOiMwMDJDNjY7XFxuIC0tZ3JpZC1zcXVhcmVzOiMyMzg5REE7XFxuIC0tbXktYm9hdHM6IzgwODA4MDtcXG4gLS1teS1ib2F0cy1ib3JkZXI6IzQ2NDY0NjtcXG4gLS1zaGlwLWhpdDojRjgyNzI3O1xcbiAtLXNoaXAtc3VuazojRDE2MDYwO1xcbiAtLWdyZWVuLXRleHQ6IzJCQzU1NztcXG4gLS1yZWQtdGV4dDojRTIzNjM2O1xcbn1cXG5cXG5ib2R5IHtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG5oZWFkZXJ7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGVhZGVyLWJnKTtcXG4gICBmbGV4OiAxO1xcbn1cXG5cXG5oMXtcXG4gICBmb250LXNpemU6IDIuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbn1cXG5cXG5tYWlue1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIGZsZXg6IDc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1dmg7XFxuICAgcGFkZGluZzogNXZoIDBweDtcXG59XFxuXFxuLnR1cm5ze1xcbiAgIHBhZGRpbmc6IDEwcHggMzBweDtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgZm9udC1zaXplOiAycmVtOztcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4udHVybnMucmVkIHtcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbiAgIGJvcmRlcjogMnB4IHJpZGdlIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmdyaWQtY29udGFpbmVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdnc7XFxufVxcblxcbi53cmFwcGVye1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ubnVtYmVyLXdyYXBwZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ueS13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBnYXA6IDVweDtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXN7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIG1pbi1oZWlnaHQ6IDcwdmg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXMgcHtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uZ3JpZCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhc3BlY3QtcmF0aW86IDEvMTtcXG4gICBoZWlnaHQ6IDcwdmg7XFxuICAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tZ3JpZC1ib3JkZXJzKTtcXG4gICBib3JkZXItcmFkaXVzOiA2cHg7XFxufVxcblxcbi54LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IDcwdmg7XFxuICAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi54LWNvb3JkaW5hdGVzIHB7XFxuICAgd2lkdGg6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5saW5le1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICB3aWR0aDogMTAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG59XFxuXFxuLnNxdWFyZXtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMCU7XFxuICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XFxufVxcblxcblxcblxcbiNncmlkMiAuc3F1YXJlLmVtcHR5OmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxMTAsIDgsIDE5NCk7XFxuICAgY3Vyc29yOmNyb3NzaGFpcjtcXG59XFxuXFxuLnNxdWFyZS5zaGlwe1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XFxuXFxuLnNxdWFyZS53YXRlcntcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDJyZW07XFxufVxcblxcbi5zcXVhcmUuaGl0IHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLWhpdCk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgZm9udC13ZWlnaHQ6IDgwMDtcXG59XFxuXFxuLnNxdWFyZS5zdW5rIHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLXN1bmspO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5pbmZve1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mbyAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mby5yZWR7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmluZm8ucmVkIC5zaGlwcy1hbGl2ZXtcXG4gICBib3JkZXItdG9wOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5cXG5cXG5cXG5kaWFsb2d7XFxuICAgdG9wOiA1MCU7XFxuICAgbGVmdDogNTAlO1xcbiAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgIGhlaWdodDogNTB2aDtcXG4gICB3aWR0aDogMTAwdnc7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1iZyk7XFxuICAgb3BhY2l0eTogMC45O1xcbiAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlc21va2U7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuXFxuXFxuLmRpYWxvZy1jb250YWluZXJ7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMDAlO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgIGdhcDogMTB2aDtcXG59XFxuXFxuLndpbm5lcntcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIHBhZGRpbmc6IDIwcHg7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuLndpbm5lci50d297XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbmJ1dHRvbntcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IG5vbmU7XFxuICAgb3V0bGluZTogbm9uZTtcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgIHBhZGRpbmc6IDEwcHg7XFxuICAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIDtcXG59XFxuXFxuYnV0dG9uOmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMge1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgbWluLWhlaWdodDogMTAwdmg7XFxuICAgb3BhY2l0eTogMC45ODtcXG4gICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuZGlhbG9nLWNvbnRhaW5lcntcXG4gICBnYXA6IDJ2aDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5kaWFsb2ctaGVhZGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZ2FwOiA4dnc7XFxufVxcblxcbmgye1xcbiAgIGZvbnQtc2l6ZTogMS44cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA0MDA7XFxufVxcblxcbiNkaXJlY3Rpb24ge1xcbiAgIHBhZGRpbmc6IDVweDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC53cmFwcGVyIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgIGdhcDogNXZ3O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdHMtZHJhZyB7XFxuICAgd2lkdGg6IDIwdjtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgZ2FwOiAzdmg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdHMtZHJhZy52ZXJ0aWNhbCB7XFxuICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICBnYXA6IDN2dztcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0LXdyYXBwZXIge1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQudmVydGljYWwge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24tc2VsZjogY2VudGVyO1xcbn1cXG5cXG4uYm9hdCAuYm9hdC1zcXVhcmUge1xcbiAgIGZsZXg6IG5vbmU7XFxuICAgd2lkdGg6IDd2aDtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcblxcbi53YXRlci1kaWFsb2d7XFxuICAgb3BhY2l0eTogMDtcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBmb250LXNpemU6IDRyZW07XFxuICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzO1xcbiAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLndhdGVyLWRpYWxvZy5zaG93e1xcbiAgIG9wYWNpdHk6IDE7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZTsgfTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgJy4vc3R5bGUuY3NzJztcbmltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG5nYW1lLnN0YXJ0TXVsdGlwbGF5ZXIoKTtcblxuLy8gY29uc3QgcGxheWVyMSA9IFBsYXllcigpO1xuLy8gY29uc3QgcGxheWVyMiA9IFBsYXllcigpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzEsIDNdLCA0LCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzcsIDNdLCAzLCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzgsIDhdLCAyLCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzEsIDVdLCAyLCAndmVydGljYWwnKTtcbi8vIHBsYXllcjIuYXR0YWNrKHBsYXllcjEsIDEsIDUpO1xuLy8gcGxheWVyMi5hdHRhY2socGxheWVyMSwgMSwgNik7XG4vLyBwbGF5ZXIyLmF0dGFjayhwbGF5ZXIxLCAxLCAzKTtcbi8vIHBsYXllcjIuYXR0YWNrKHBsYXllcjEsIDksIDkpO1xuXG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbMSwgM10sIDQsICdob3Jpem9udGFsJyk7XG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbNywgM10sIDMsICdob3Jpem9udGFsJyk7XG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbOCwgOF0sIDIsICdob3Jpem9udGFsJyk7XG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbMSwgNV0sIDIsICd2ZXJ0aWNhbCcpO1xuLy8gcGxheWVyMS5hdHRhY2socGxheWVyMiwgMSwgNSk7XG4vLyBwbGF5ZXIxLmF0dGFjayhwbGF5ZXIyLCAxLCA2KTtcbi8vIHBsYXllcjEuYXR0YWNrKHBsYXllcjIsIDEsIDMpO1xuLy8gcGxheWVyMS5hdHRhY2socGxheWVyMiwgOSwgOSk7XG5cbi8vIGRvbS5wb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKTtcblxuLy8gZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSk7XG4vLyBsZXQgZmluaXNoID0gZmFsc2U7XG4vLyB3aGlsZSAoZmluaXNoID09PSBmYWxzZSkge1xuLy8gICBmaW5pc2ggPSBkb20ubGlzdGVuRm9yQ2xpY2socGxheWVyMSwgcGxheWVyMik7XG4vLyB9XG5cbi8vIGdhbWVib2FyZC5yZWNlaXZlSGl0KDEsIDMpO1xuLy8gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoMiwgMyk7XG4vLyBnYW1lYm9hcmQucmVjZWl2ZUhpdCgzLCAzKTtcbi8vIGNvbnNvbGUubG9nKGdhbWVib2FyZC5hbGxTdW5rKCkpO1xuLy8gY29uc3Qgc2hpcDEgPSBTaGlwKDMpO1xuLy8gY29uc29sZS5sb2coc2hpcDEuYWRkSGl0KCkpO1xuXG4vLyBjb25zb2xlLmxvZyhnYW1lYm9hcmQuZ3JpZFsxXVszXSk7XG4vLyBjb25zb2xlLmxvZyhzaGlwMSk7XG4vLyBjb25zb2xlLmxvZyhnYW1lYm9hcmQuZ3JpZFsxXVszXSA9PT0gc2hpcDEpO1xuLy8gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoMSwgMyk7XG4iXSwibmFtZXMiOlsiZ2FtZSIsImRvbSIsImRpcmVjdGlvbiIsInBvcHVsYXRlR3JpZCIsImdyaWQiLCJzdGFydCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImdyaWRDb250YWluZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lckhUTUwiLCJmb3JFYWNoIiwibGluZSIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJzbG90Iiwic3F1YXJlIiwiQXJyYXkiLCJpc0FycmF5Iiwic3VuayIsImlzU3VuayIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJwb3B1bGF0ZUVuZW15R3JpZCIsInBsYXllcjEiLCJwbGF5ZXIyIiwiZ2V0R3JpZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcXVhcmVDbGlja2VkIiwiZXZlbnQiLCJlbmVteUdyaWQiLCJjb2x1bW4iLCJjdXJyZW50VGFyZ2V0IiwicGFyZW50Tm9kZSIsImNsaWNrZWRTcXVhcmUiLCJpbmRleFkiLCJwcm90b3R5cGUiLCJpbmRleE9mIiwiY2FsbCIsImNoaWxkcmVuIiwiaW5kZXhYIiwiaGl0IiwiYXR0YWNrIiwidXBkYXRlQm9hdHNBbGl2ZSIsImFsbFN1bmsiLCJwbGF5ZXJXb24iLCJ0b2dnbGVUdXJuIiwiZGVsYXkiLCJyYW5kb21BdHRhY2siLCJtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsInBsYXllciIsImRpYWxvZ1dpbiIsInNob3dNb2RhbCIsInJlc3RhcnQiLCJzdGFydEdhbWUiLCJjbG9zZSIsInR1cm5zIiwid2lubmVyIiwiY2xhc3NMaXN0IiwiYWRkIiwiZGl2VHVybnMiLCJjdXJyZW50VHVybiIsInN1YnN0cmluZyIsInBsYXllck51bSIsInBhcmEiLCJib2F0c0FsaXZlIiwiY291bnRCb2F0c0FsaXZlIiwiZHJhZ0FuZERyb3AiLCJib2F0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvbkRyYWciLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsImlkIiwiYm9hdCIsImRyYWdnYWJsZSIsInN0eWxlIiwib3BhY2l0eSIsImdyaWRMaXN0ZW5lcnMiLCJzcXVhcmVzIiwib25Ecm9wIiwicHJldmVudERlZmF1bHQiLCJqc29uIiwiZ2V0RGF0YSIsIm9iamVjdCIsInBhcnNlIiwicGxheWVyR3JpZCIsImlzRW1wdHkiLCJhcnJheSIsInN1cnJvdW5kaW5nQXJyYXkiLCJwdXNoIiwiaSIsIngxIiwieTEiLCJ4MiIsInkyIiwieDMiLCJ5MyIsImVtcHR5IiwiZXZlcnkiLCJzdXJyb3VuZGluZ0VtcHR5IiwicGxhY2VTaGlwIiwiZHJhZ2dlZEJvYXQiLCJnZXRFbGVtZW50QnlJZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzaG93U3RhcnRpbmdEaWFsb2ciLCJkaWFsb2dQbGFjZSIsImFkZEV2ZW50TGlzdGVuZXJzIiwib2xkU3RhcnRCdXR0b24iLCJzdGFydEJ1dHRvbiIsImNsb25lTm9kZSIsInJlcGxhY2VDaGlsZCIsImNhblN0YXJ0Iiwib2xkQ2hEaXJlY3Rpb24iLCJjaERpcmVjdGlvbiIsImJvYXREcmFnIiwicmVtb3ZlIiwib2xkUmFuZG9tIiwicmFuZG9tIiwiZW1wdHlHcmlkIiwicGxhY2VTaGlwUmFuZG9tIiwib2xkQm9hdCIsIm5ld0JvYXQiLCJQbGF5ZXIiLCJtdWx0aXBsYXllciIsInN0YXJ0TXVsdGlwbGF5ZXIiLCJyZXNldEV2ZXJ5dGhpbmciLCJwcmVwYXJlU3RhcnRpbmdEaWFsb2ciLCJTaGlwIiwiY3JlYXRlR3JpZCIsIm4iLCJqIiwiR2FtZWJvYXJkIiwiY3JlYXRlR2FtZWJvYXJkIiwic2hpcE9iaiIsIngiLCJ5IiwibnVtIiwiTWF0aCIsInJvdW5kIiwiZmxvb3IiLCJyZWNlaXZlSGl0IiwidmFsdWUiLCJhZGRIaXQiLCJyZXN1bHQiLCJpbmNsdWRlcyIsInBsYXllclBsYWNpbmciLCJzaG93V2F0ZXJEaWFsb2ciLCJ3YXRlckRpYWxvZyIsImNsb3NlRGlhbG9nIiwibnVtYmVyIiwiYXR0YWNrZXJEaXYiLCJhdHRhY2tlckluZm8iLCJkZWZlbmRvckRpdiIsImRlZmVuZG9ySW5mbyIsInBhcmExIiwiYm9hdHNBbGl2ZTEiLCJwYXJhMiIsImJvYXRzQWxpdmUyIiwic3RhcnRpbmdCdXR0b24iLCJkaWFsb2dUaXRsZSIsImdhbWVib2FyZCIsIndpbiIsImNyZWF0ZVNoaXAiLCJzaGlwTGVuZ3RoIiwiaGl0cyJdLCJzb3VyY2VSb290IjoiIn0=