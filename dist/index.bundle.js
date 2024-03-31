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
      multiplayer.populateGrid(multiplayer.player2.getGrid());
      multiplayer.populateEnemyGrid(multiplayer.player2, multiplayer.player1);
      multiplayer.updateBoatsAlive();
      multiplayer.toggleTurn();
    }
    return false;
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
___CSS_LOADER_EXPORT___.push([module.id, "*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.red{\n   color: var(--red-text);\n}\n\n.info.red .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\nbutton{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\nbutton:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n\n\n.place-ships {\n   padding: 2vh 2vw ;\n   min-height: 100vh;\n   opacity: 0.98;\n   color: white;\n}\n\n.place-ships .dialog-container{\n   gap: 2vh;\n}\n\n.place-ships .dialog-header{\n   display: flex;\n   gap: 8vw;\n}\n\nh2{\n   font-size: 1.8rem;\n   font-weight: 400;\n}\n\n#direction {\n   padding: 5px;\n}\n\n.place-ships .wrapper {\n   flex-direction: row;\n   gap: 5vw;\n   align-items: center;\n}\n\n\n.place-ships .boats-drag {\n   width: 20v;\n   display: flex;\n   flex-direction: column;\n   gap: 3vh;\n}\n\n.place-ships .boats-drag.vertical {\n   flex-direction: row;\n   gap: 3vw;\n}\n\n.place-ships .boat-wrapper {\n   display:flex;\n   flex-direction: column;\n}\n\n.place-ships .boat {\n   display: flex;\n   width: fit-content;\n}\n\n.place-ships .boat.vertical {\n   flex-direction: column;\n   align-self: center;\n}\n\n.boat .boat-square {\n   flex: none;\n   width: 7vh;\n   height: 7vh;\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.red{\n   color: var(--red-text);\n}\n\n.info.red .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\nbutton{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\nbutton:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n\n\n.place-ships {\n   padding: 2vh 2vw ;\n   min-height: 100vh;\n   opacity: 0.98;\n   color: white;\n}\n\n.place-ships .dialog-container{\n   gap: 2vh;\n}\n\n.place-ships .dialog-header{\n   display: flex;\n   gap: 8vw;\n}\n\nh2{\n   font-size: 1.8rem;\n   font-weight: 400;\n}\n\n#direction {\n   padding: 5px;\n}\n\n.place-ships .wrapper {\n   flex-direction: row;\n   gap: 5vw;\n   align-items: center;\n}\n\n\n.place-ships .boats-drag {\n   width: 20v;\n   display: flex;\n   flex-direction: column;\n   gap: 3vh;\n}\n\n.place-ships .boats-drag.vertical {\n   flex-direction: row;\n   gap: 3vw;\n}\n\n.place-ships .boat-wrapper {\n   display:flex;\n   flex-direction: column;\n}\n\n.place-ships .boat {\n   display: flex;\n   width: fit-content;\n}\n\n.place-ships .boat.vertical {\n   flex-direction: column;\n   align-self: center;\n}\n\n.boat .boat-square {\n   flex: none;\n   width: 7vh;\n   height: 7vh;\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWEsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsVUFBVSxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsVUFBVSxZQUFZLFNBQVMsS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxVQUFVLEtBQUssVUFBVSxVQUFVLFlBQVksV0FBVyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsU0FBUyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9B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QUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBLGVBQWUsNEJBQTRCO1dBQzNDLGVBQWU7V0FDZixpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEEsOENBQThDOzs7OztXQ0E5QztXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7OztBQ0FxQjtBQUNHO0FBQ007QUFDSjtBQUUxQnRJLDZDQUFJLENBQUNxSSxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbXVsdGlwbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG5jb25zdCBkb20gPSB7XG4gIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICBwb3B1bGF0ZUdyaWQoZ3JpZCwgc3RhcnQgPSBmYWxzZSkge1xuICAgIGxldCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQxJyk7XG4gICAgaWYgKHN0YXJ0ID09PSB0cnVlKSB7XG4gICAgICBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICB9XG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSAnbGluZSc7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpZiAoc2xvdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGVtcHR5JztcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNsb3QpKSB7XG4gICAgICAgICAgY29uc3Qgc3VuayA9IHNsb3RbMV0uaXNTdW5rKCk7XG4gICAgICAgICAgaWYgKHN1bmsgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBoaXQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc3Vuayc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc2hpcCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gJ3dhdGVyJykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHdhdGVyJztcbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfVxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgIH0pO1xuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH0pO1xuICB9LFxuICBwb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgdGhpcy5wbGF5ZXIxID0gcGxheWVyMTtcbiAgICB0aGlzLnBsYXllcjIgPSBwbGF5ZXIyO1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDInKTtcbiAgICBjb25zdCBncmlkID0gdGhpcy5wbGF5ZXIyLmdldEdyaWQoKTtcbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmNsYXNzTmFtZSA9ICdsaW5lJztcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHNsb3QpKSB7XG4gICAgICAgICAgY29uc3Qgc3VuayA9IHNsb3RbMV0uaXNTdW5rKCk7XG4gICAgICAgICAgaWYgKHN1bmsgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBoaXQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc3Vuayc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgPT09IG51bGwgfHwgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnKSkge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGVtcHR5JztcbiAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkb20uc3F1YXJlQ2xpY2tlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gJ3dhdGVyJykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHdhdGVyJztcbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfVxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgIH0pO1xuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH0pO1xuICB9LFxuICBzcXVhcmVDbGlja2VkOiBhc3luYyBldmVudCA9PiB7XG4gICAgY29uc3QgZW5lbXlHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQyJyk7XG4gICAgY29uc3QgY29sdW1uID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xuICAgIGNvbnN0IGNsaWNrZWRTcXVhcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIGNvbnN0IGluZGV4WSA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoY29sdW1uLmNoaWxkcmVuLCBjbGlja2VkU3F1YXJlKTtcbiAgICBjb25zdCBpbmRleFggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGVuZW15R3JpZC5jaGlsZHJlbiwgY29sdW1uKTtcbiAgICBsZXQgaGl0ID0gZG9tLnBsYXllcjEuYXR0YWNrKGRvbS5wbGF5ZXIyLCBpbmRleFgsIGluZGV4WSk7XG4gICAgZG9tLnBvcHVsYXRlRW5lbXlHcmlkKGRvbS5wbGF5ZXIxLCBkb20ucGxheWVyMik7XG4gICAgZG9tLnVwZGF0ZUJvYXRzQWxpdmUoMik7XG4gICAgaWYgKGRvbS5wbGF5ZXIyLmFsbFN1bmsoKSAhPT0gZmFsc2UpIHJldHVybiBkb20ucGxheWVyV29uKDEpO1xuICAgIGlmIChoaXQgPT09IGZhbHNlKSB7XG4gICAgICBkb20udG9nZ2xlVHVybigpO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgYXdhaXQgZG9tLmRlbGF5KDUwMCk7XG4gICAgICAgIGhpdCA9IGRvbS5wbGF5ZXIyLnJhbmRvbUF0dGFjayhkb20ucGxheWVyMSk7XG4gICAgICAgIGRvbS5wb3B1bGF0ZUdyaWQoZG9tLnBsYXllcjEuZ2V0R3JpZCgpKTtcbiAgICAgICAgZG9tLnVwZGF0ZUJvYXRzQWxpdmUoMSk7XG4gICAgICAgIGlmIChkb20ucGxheWVyMS5hbGxTdW5rKCkgIT09IGZhbHNlKSByZXR1cm4gZG9tLnBsYXllcldvbigyKTtcbiAgICAgICAgaWYgKGhpdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBkb20udG9nZ2xlVHVybigpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgZGVsYXkobXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG4gIH0sXG4gIHBsYXllcldvbihwbGF5ZXIpIHtcbiAgICBjb25zdCBkaWFsb2dXaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2luJyk7XG4gICAgZGlhbG9nV2luLnNob3dNb2RhbCgpO1xuICAgIGNvbnN0IHJlc3RhcnQgPSBkaWFsb2dXaW4ucXVlcnlTZWxlY3RvcignLnJlc3RhcnQnKTtcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gZ2FtZS5zdGFydEdhbWUoKSk7XG4gICAgcmVzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGRpYWxvZ1dpbi5jbG9zZSgpO1xuICAgIH0pO1xuICAgIGNvbnN0IHR1cm5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm5zJyk7XG4gICAgdHVybnMudGV4dENvbnRlbnQgPSBgUGxheWVyICR7cGxheWVyfSB3b24hISFgO1xuICAgIGNvbnN0IHdpbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXInKTtcbiAgICB3aW5uZXIudGV4dENvbnRlbnQgPSBgUGxheWVyICR7cGxheWVyfSB3b24hISFgO1xuICAgIHdpbm5lci5jbGFzc05hbWUgPSAnd2lubmVyJztcbiAgICBpZiAocGxheWVyID09PSAyKSB7XG4gICAgICB3aW5uZXIuY2xhc3NMaXN0LmFkZCgndHdvJyk7XG4gICAgfVxuICB9LFxuICB0b2dnbGVUdXJuKCkge1xuICAgIGNvbnN0IGRpdlR1cm5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm5zJyk7XG4gICAgY29uc3QgY3VycmVudFR1cm4gPSBkaXZUdXJucy50ZXh0Q29udGVudC5zdWJzdHJpbmcoNywgOCk7XG4gICAgaWYgKGN1cnJlbnRUdXJuID09PSAnMScpIHtcbiAgICAgIGRpdlR1cm5zLnRleHRDb250ZW50ID0gJ1BsYXllciAyIHR1cm4nO1xuICAgICAgZGl2VHVybnMuY2xhc3NOYW1lID0gJ3R1cm5zIHJlZCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpdlR1cm5zLnRleHRDb250ZW50ID0gJ1BsYXllciAxIHR1cm4nO1xuICAgICAgZGl2VHVybnMuY2xhc3NOYW1lID0gJ3R1cm5zJztcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZUJvYXRzQWxpdmUocGxheWVyTnVtKSB7XG4gICAgbGV0IHBhcmE7XG4gICAgbGV0IGJvYXRzQWxpdmU7XG4gICAgaWYgKHBsYXllck51bSA9PT0gMSkge1xuICAgICAgcGFyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcy1hbGl2ZS5vbmUnKTtcbiAgICAgIGJvYXRzQWxpdmUgPSBkb20ucGxheWVyMS5jb3VudEJvYXRzQWxpdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcy1hbGl2ZS50d28nKTtcbiAgICAgIGJvYXRzQWxpdmUgPSBkb20ucGxheWVyMi5jb3VudEJvYXRzQWxpdmUoKTtcbiAgICB9XG4gICAgcGFyYS50ZXh0Q29udGVudCA9IGBBbGl2ZSBzaGlwcyAke2JvYXRzQWxpdmV9YDtcbiAgfSxcbiAgZHJhZ0FuZERyb3AocGxheWVyKSB7XG4gICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgIGNvbnN0IG9uRHJhZyA9IGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHsgbGVuZ3RoOiBldmVudC5jdXJyZW50VGFyZ2V0LmNoaWxkcmVuLmxlbmd0aCwgaWQ6IGV2ZW50LmN1cnJlbnRUYXJnZXQuaWQgfSlcbiAgICAgICk7XG4gICAgfTtcbiAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgYm9hdC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBvbkRyYWcpO1xuICAgICAgYm9hdC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgYm9hdC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZ3JpZExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjZ3JpZC1wbGFjZSAuc3F1YXJlLmVtcHR5Jyk7XG4gICAgICBjb25zdCBvbkRyb3AgPSBldmVudCA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGpzb24gPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICBjb25zdCBvYmplY3QgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgICAgICBjb25zdCB7IGxlbmd0aCB9ID0gb2JqZWN0O1xuICAgICAgICBjb25zdCBncmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICBjb25zdCBjbGlja2VkU3F1YXJlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgaW5kZXhZID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb2x1bW4uY2hpbGRyZW4sIGNsaWNrZWRTcXVhcmUpO1xuICAgICAgICBjb25zdCBpbmRleFggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGdyaWQuY2hpbGRyZW4sIGNvbHVtbik7XG4gICAgICAgIGNvbnN0IHsgZGlyZWN0aW9uIH0gPSBkb207XG4gICAgICAgIGNvbnN0IHBsYXllckdyaWQgPSBwbGF5ZXIuZ2V0R3JpZCgpO1xuICAgICAgICBjb25zdCBpc0VtcHR5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICAgIGNvbnN0IHN1cnJvdW5kaW5nQXJyYXkgPSBbXTtcblxuICAgICAgICAgIGFycmF5LnB1c2gocGxheWVyR3JpZFtpbmRleFhdW2luZGV4WV0pO1xuICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICBhcnJheS5wdXNoKHBsYXllckdyaWRbaW5kZXhYICsgaV1baW5kZXhZXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgYXJyYXkucHVzaChwbGF5ZXJHcmlkW2luZGV4WF1baW5kZXhZICsgaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAobGV0IGkgPSAtMTsgaSA8PSBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgeDEgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMCk7XG4gICAgICAgICAgICBjb25zdCB5MSA9IGluZGV4WSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDAgOiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHgyID0gaW5kZXhYICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IC0xKTtcbiAgICAgICAgICAgIGNvbnN0IHkyID0gaW5kZXhZICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gLTEgOiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHgzID0gaW5kZXhYICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IDEpO1xuICAgICAgICAgICAgY29uc3QgeTMgPSBpbmRleFkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAxIDogaSk7XG5cbiAgICAgICAgICAgIGlmICh4MSA+PSAwICYmIHgxIDwgcGxheWVyR3JpZC5sZW5ndGggJiYgeTEgPj0gMCAmJiB5MSA8IHBsYXllckdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChwbGF5ZXJHcmlkW3gxXVt5MV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHgyID49IDAgJiYgeDIgPCBwbGF5ZXJHcmlkLmxlbmd0aCAmJiB5MiA+PSAwICYmIHkyIDwgcGxheWVyR3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKHBsYXllckdyaWRbeDJdW3kyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeDMgPj0gMCAmJiB4MyA8IHBsYXllckdyaWQubGVuZ3RoICYmIHkzID49IDAgJiYgeTMgPCBwbGF5ZXJHcmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2gocGxheWVyR3JpZFt4M11beTNdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBlbXB0eSA9IGFycmF5LmV2ZXJ5KHNxdWFyZSA9PiBzcXVhcmUgPT09IG51bGwpO1xuICAgICAgICAgIGNvbnN0IHN1cnJvdW5kaW5nRW1wdHkgPSBzdXJyb3VuZGluZ0FycmF5LmV2ZXJ5KHNxdWFyZSA9PiBzcXVhcmUgPT09IG51bGwpO1xuXG4gICAgICAgICAgcmV0dXJuIGVtcHR5ICYmIHN1cnJvdW5kaW5nRW1wdHk7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgaWYgKGlzRW1wdHkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBsYXllci5wbGFjZVNoaXAoW2luZGV4WCwgaW5kZXhZXSwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xuICAgICAgICBkb20ucG9wdWxhdGVHcmlkKHBsYXllci5nZXRHcmlkKCksIHRydWUpO1xuICAgICAgICBjb25zdCBkcmFnZ2VkQm9hdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9iamVjdC5pZCk7XG4gICAgICAgIGRyYWdnZWRCb2F0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIG9uRHJhZyk7XG4gICAgICAgIGRyYWdnZWRCb2F0LmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBkcmFnZ2VkQm9hdC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgICBncmlkTGlzdGVuZXJzKCk7XG4gICAgICB9O1xuICAgICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiB7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGV2ZW50ID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBvbkRyb3ApO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBncmlkTGlzdGVuZXJzKCk7XG4gIH0sXG4gIHNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgY29uc3QgZGlhbG9nUGxhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMnKTtcbiAgICBkaWFsb2dQbGFjZS5zaG93TW9kYWwoKTtcbiAgICBkb20uZHJhZ0FuZERyb3AocGxheWVyMSk7XG4gICAgZG9tLmFkZEV2ZW50TGlzdGVuZXJzKHBsYXllcjEsIHBsYXllcjIpO1xuICB9LFxuICBhZGRFdmVudExpc3RlbmVycyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgY29uc3Qgb2xkU3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMgLnN0YXJ0Jyk7XG4gICAgY29uc3Qgc3RhcnRCdXR0b24gPSBvbGRTdGFydEJ1dHRvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgb2xkU3RhcnRCdXR0b24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc3RhcnRCdXR0b24sIG9sZFN0YXJ0QnV0dG9uKTtcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRpYWxvZ1BsYWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzJyk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBsZXQgY2FuU3RhcnQ7XG4gICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICBpZiAoYm9hdC5kcmFnZ2FibGUgPT09IHRydWUpIGNhblN0YXJ0ID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIGlmIChjYW5TdGFydCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgIGRpYWxvZ1BsYWNlLmNsb3NlKCk7XG4gICAgICBkb20ucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpKTtcbiAgICAgIGRvbS5wb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IG9sZENoRGlyZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RpcmVjdGlvbicpO1xuICAgIGNvbnN0IGNoRGlyZWN0aW9uID0gb2xkQ2hEaXJlY3Rpb24uY2xvbmVOb2RlKHRydWUpO1xuICAgIG9sZENoRGlyZWN0aW9uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNoRGlyZWN0aW9uLCBvbGRDaERpcmVjdGlvbik7XG4gICAgY2hEaXJlY3Rpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBib2F0RHJhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2F0cy1kcmFnJyk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBib2F0RHJhZy5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuICAgICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICAgIGJvYXQuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvYXREcmFnLmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgICAgYm9hdC5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBvbGRSYW5kb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmFuZG9tJyk7XG4gICAgY29uc3QgcmFuZG9tID0gb2xkUmFuZG9tLmNsb25lTm9kZSh0cnVlKTtcbiAgICBvbGRSYW5kb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocmFuZG9tLCBvbGRSYW5kb20pO1xuICAgIHJhbmRvbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHBsYXllcjEuZW1wdHlHcmlkKCk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSg1KTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDQpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oMyk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDIpO1xuICAgICAgZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICBjb25zdCBvbGRCb2F0ID0gYm9hdDtcbiAgICAgICAgY29uc3QgbmV3Qm9hdCA9IG9sZEJvYXQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBvbGRCb2F0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0JvYXQsIG9sZEJvYXQpO1xuICAgICAgICBuZXdCb2F0LmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBuZXdCb2F0LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRvbTtcbiIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQgbXVsdGlwbGF5ZXIgZnJvbSAnLi9tdWx0aXBsYXllcidcblxuY29uc3QgZ2FtZSA9IHtcbiAgc3RhcnRHYW1lKCkge1xuICAgIGNvbnN0IHBsYXllcjEgPSBQbGF5ZXIoMSk7XG4gICAgY29uc3QgcGxheWVyMiA9IFBsYXllcigyKTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcFJhbmRvbSg1KTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcFJhbmRvbSg0KTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcFJhbmRvbSgyKTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcChbNiwgMl0sIDQsICdob3Jpem9udGFsJyk7XG4gICAgLy8gcGxheWVyMi5wbGFjZVNoaXAoWzYsIDZdLCAzLCAnaG9yaXpvbnRhbCcpO1xuICAgIC8vIHBsYXllcjIucGxhY2VTaGlwKFsxLCA1XSwgMywgJ3ZlcnRpY2FsJyk7XG4gICAgLy8gcGxheWVyMi5wbGFjZVNoaXAoWzcsIDBdLCAyLCAnaG9yaXpvbnRhbCcpO1xuICAgIGRvbS5zaG93U3RhcnRpbmdEaWFsb2cocGxheWVyMSwgcGxheWVyMik7XG4gICAgLy8gcGxheWVyMS5wbGFjZVNoaXAoWzEsIDNdLCA0LCAnaG9yaXpvbnRhbCcpO1xuICAgIC8vIHBsYXllcjEucGxhY2VTaGlwKFs3LCAzXSwgMywgJ2hvcml6b250YWwnKTtcbiAgICAvLyBwbGF5ZXIxLnBsYWNlU2hpcChbOCwgOF0sIDIsICdob3Jpem9udGFsJyk7XG4gICAgLy8gcGxheWVyMS5wbGFjZVNoaXAoWzEsIDVdLCAyLCAndmVydGljYWwnKTtcbiAgfSxcbiAgc3RhcnRNdWx0aXBsYXllcigpIHtcbiAgICBjb25zdCBwbGF5ZXIxID0gUGxheWVyKDEpO1xuICAgIGNvbnN0IHBsYXllcjIgPSBQbGF5ZXIoMik7XG4gICAgbXVsdGlwbGF5ZXIuc2hvd1N0YXJ0aW5nRGlhbG9nKHBsYXllcjEsIHBsYXllcjIpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwJztcblxuY29uc3QgY3JlYXRlR3JpZCA9IGZ1bmN0aW9uIChuID0gMTApIHtcbiAgY29uc3QgZ3JpZCA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSArPSAxKSB7XG4gICAgZ3JpZFtpXSA9IFtdO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbjsgaiArPSAxKSB7XG4gICAgICBncmlkW2ldW2pdID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ3JpZDtcbn07XG5cbmNvbnN0IEdhbWVib2FyZCA9IGZ1bmN0aW9uIGNyZWF0ZUdhbWVib2FyZCgpIHtcbiAgbGV0IGdyaWQgPSBjcmVhdGVHcmlkKCk7XG4gIGNvbnN0IHBsYWNlU2hpcCA9IGZ1bmN0aW9uIChzdGFydCwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICBjb25zdCBzaGlwT2JqID0gU2hpcChsZW5ndGgpO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcE9iai5sZW5ndGg7IGkgKz0gMSkgZ3JpZFtzdGFydFswXV1bc3RhcnRbMV0gKyBpXSA9IHNoaXBPYmo7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcE9iai5sZW5ndGg7IGkgKz0gMSkgZ3JpZFtzdGFydFswXSArIGldW3N0YXJ0WzFdXSA9IHNoaXBPYmo7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcFJhbmRvbSA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgICBsZXQgeDtcbiAgICBsZXQgeTtcbiAgICBsZXQgaXNFbXB0eSA9IGZhbHNlO1xuICAgIGxldCBkaXJlY3Rpb247XG4gICAgY29uc3QgbnVtID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcbiAgICBpZiAobnVtID09PSAwKSB7XG4gICAgICBkaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgfVxuICAgIHdoaWxlIChpc0VtcHR5ID09PSBmYWxzZSkge1xuICAgICAgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cbiAgICAgIGlzRW1wdHkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICBjb25zdCBzdXJyb3VuZGluZ0FycmF5ID0gW107XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnICYmIHggKyBsZW5ndGggPiBncmlkLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnICYmIHkgKyBsZW5ndGggPj0gZ3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBhcnJheS5wdXNoKGdyaWRbeF1beV0pO1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBhcnJheS5wdXNoKGdyaWRbeCArIGldW3ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgYXJyYXkucHVzaChncmlkW3hdW3kgKyBpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IC0xOyBpIDw9IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgY29uc3QgeDEgPSB4ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IDApO1xuICAgICAgICAgIGNvbnN0IHkxID0geSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDAgOiBpKTtcbiAgICAgICAgICBjb25zdCB4MiA9IHggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogLTEpO1xuICAgICAgICAgIGNvbnN0IHkyID0geSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IC0xIDogaSk7XG4gICAgICAgICAgY29uc3QgeDMgPSB4ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IDEpO1xuICAgICAgICAgIGNvbnN0IHkzID0geSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDEgOiBpKTtcblxuICAgICAgICAgIGlmICh4MSA+PSAwICYmIHgxIDwgZ3JpZC5sZW5ndGggJiYgeTEgPj0gMCAmJiB5MSA8IGdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2goZ3JpZFt4MV1beTFdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHgyID49IDAgJiYgeDIgPCBncmlkLmxlbmd0aCAmJiB5MiA+PSAwICYmIHkyIDwgZ3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChncmlkW3gyXVt5Ml0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeDMgPj0gMCAmJiB4MyA8IGdyaWQubGVuZ3RoICYmIHkzID49IDAgJiYgeTMgPCBncmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKGdyaWRbeDNdW3kzXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW1wdHkgPSBhcnJheS5ldmVyeShzcXVhcmUgPT4gc3F1YXJlID09PSBudWxsKTtcbiAgICAgICAgY29uc3Qgc3Vycm91bmRpbmdFbXB0eSA9IHN1cnJvdW5kaW5nQXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG5cbiAgICAgICAgcmV0dXJuIGVtcHR5ICYmIHN1cnJvdW5kaW5nRW1wdHk7XG4gICAgICB9KSgpO1xuICAgIH1cbiAgICBjb25zdCBzaGlwT2JqID0gU2hpcChsZW5ndGgpO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcE9iai5sZW5ndGg7IGkgKz0gMSkgZ3JpZFt4XVt5ICsgaV0gPSBzaGlwT2JqO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBPYmoubGVuZ3RoOyBpICs9IDEpIGdyaWRbeCArIGldW3ldID0gc2hpcE9iajtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZW1wdHlHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgIGdyaWQgPSBjcmVhdGVHcmlkKCk7XG4gIH1cblxuICBjb25zdCByZWNlaXZlSGl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdyaWRbeF1beV07XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICBncmlkW3hdW3ldID0gJ3dhdGVyJztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFsdWUuYWRkSGl0KCk7XG4gICAgZ3JpZFt4XVt5XSA9IFsnaGl0JywgdmFsdWVdO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBjb25zdCBhbGxTdW5rID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgaWYgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHNsb3QpKSByZXN1bHQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgY29uc3QgY291bnRCb2F0c0FsaXZlID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGJvYXRzID0gW107XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgc2xvdCAhPT0gbnVsbCAmJlxuICAgICAgICAgIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICFBcnJheS5pc0FycmF5KHNsb3QpICYmXG4gICAgICAgICAgIWJvYXRzLmluY2x1ZGVzKHNsb3QpXG4gICAgICAgICkge1xuICAgICAgICAgIGJvYXRzLnB1c2goc2xvdCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBib2F0cy5sZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ3JpZDtcbiAgfTtcbiAgcmV0dXJuIHsgZ2V0R3JpZCwgZW1wdHlHcmlkLCBwbGFjZVNoaXAsIHBsYWNlU2hpcFJhbmRvbSwgcmVjZWl2ZUhpdCwgYWxsU3VuaywgY291bnRCb2F0c0FsaXZlIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5cbmNvbnN0IG11bHRpcGxheWVyID0ge1xuICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgcGxheWVyUGxhY2luZzogMSxcbiAgcG9wdWxhdGVHcmlkKGdyaWQsIHN0YXJ0ID0gZmFsc2UpIHtcbiAgICBsZXQgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMScpO1xuICAgIGlmIChzdGFydCA9PT0gdHJ1ZSkge1xuICAgICAgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkLXBsYWNlJyk7XG4gICAgfVxuICAgIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gJ2xpbmUnO1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaWYgKHNsb3QgPT09IG51bGwpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBlbXB0eSc7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzbG90KSkge1xuICAgICAgICAgIGNvbnN0IHN1bmsgPSBzbG90WzFdLmlzU3VuaygpO1xuICAgICAgICAgIGlmIChzdW5rID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgaGl0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKHN1bmsgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHN1bmsnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ICE9PSBudWxsICYmIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHNoaXAnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgPT09ICd3YXRlcicpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSB3YXRlcic7XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH1cbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgICB9KTtcbiAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9KTtcbiAgfSxcbiAgcG9wdWxhdGVFbmVteUdyaWQocGxheWVyMSwgcGxheWVyMikge1xuICAgIHRoaXMucGxheWVyMSA9IHBsYXllcjE7XG4gICAgdGhpcy5wbGF5ZXIyID0gcGxheWVyMjtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQyJyk7XG4gICAgY29uc3QgZ3JpZCA9IHRoaXMucGxheWVyMi5nZXRHcmlkKCk7XG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSAnbGluZSc7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzbG90KSkge1xuICAgICAgICAgIGNvbnN0IHN1bmsgPSBzbG90WzFdLmlzU3VuaygpO1xuICAgICAgICAgIGlmIChzdW5rID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgaGl0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKHN1bmsgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHN1bmsnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSBudWxsIHx8IChzbG90ICE9PSBudWxsICYmIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBlbXB0eSc7XG4gICAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbXVsdGlwbGF5ZXIuc3F1YXJlQ2xpY2tlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gJ3dhdGVyJykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHdhdGVyJztcbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfVxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgIH0pO1xuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH0pO1xuICB9LFxuICBzcXVhcmVDbGlja2VkOiBhc3luYyBldmVudCA9PiB7XG4gICAgY29uc3QgZW5lbXlHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQyJyk7XG4gICAgY29uc3QgY29sdW1uID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xuICAgIGNvbnN0IGNsaWNrZWRTcXVhcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIGNvbnN0IGluZGV4WSA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoY29sdW1uLmNoaWxkcmVuLCBjbGlja2VkU3F1YXJlKTtcbiAgICBjb25zdCBpbmRleFggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGVuZW15R3JpZC5jaGlsZHJlbiwgY29sdW1uKTtcbiAgICBjb25zdCBoaXQgPSBtdWx0aXBsYXllci5wbGF5ZXIxLmF0dGFjayhtdWx0aXBsYXllci5wbGF5ZXIyLCBpbmRleFgsIGluZGV4WSk7XG4gICAgaWYgKG11bHRpcGxheWVyLnBsYXllcjIuYWxsU3VuaygpICE9PSBmYWxzZSkgcmV0dXJuIG11bHRpcGxheWVyLnBsYXllcldvbihtdWx0aXBsYXllci5wbGF5ZXIxKTtcbiAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUVuZW15R3JpZChtdWx0aXBsYXllci5wbGF5ZXIxLCBtdWx0aXBsYXllci5wbGF5ZXIyKTtcbiAgICBtdWx0aXBsYXllci51cGRhdGVCb2F0c0FsaXZlKCk7XG4gICAgaWYgKGhpdCA9PT0gZmFsc2UpIHtcbiAgICAgIG11bHRpcGxheWVyLnBvcHVsYXRlR3JpZChtdWx0aXBsYXllci5wbGF5ZXIyLmdldEdyaWQoKSk7XG4gICAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUVuZW15R3JpZChtdWx0aXBsYXllci5wbGF5ZXIyLCBtdWx0aXBsYXllci5wbGF5ZXIxKTtcbiAgICAgIG11bHRpcGxheWVyLnVwZGF0ZUJvYXRzQWxpdmUoKTtcbiAgICAgIG11bHRpcGxheWVyLnRvZ2dsZVR1cm4oKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvLyBkZWxheShtcykge1xuICAvLyAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbiAgLy8gfSxcbiAgcGxheWVyV29uKHBsYXllcikge1xuICAgIGNvbnN0IGRpYWxvZ1dpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW4nKTtcbiAgICBkaWFsb2dXaW4uc2hvd01vZGFsKCk7XG4gICAgY29uc3QgcmVzdGFydCA9IGRpYWxvZ1dpbi5xdWVyeVNlbGVjdG9yKCcucmVzdGFydCcpO1xuICAgIHJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBnYW1lLnN0YXJ0TXVsdGlwbGF5ZXIoKSk7XG4gICAgcmVzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGRpYWxvZ1dpbi5jbG9zZSgpO1xuICAgIH0pO1xuICAgIGNvbnN0IHR1cm5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm5zJyk7XG4gICAgdHVybnMudGV4dENvbnRlbnQgPSBgUGxheWVyICR7cGxheWVyLm51bWJlcn0gd29uISEhYDtcbiAgICBjb25zdCB3aW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2lubmVyJyk7XG4gICAgd2lubmVyLnRleHRDb250ZW50ID0gYFBsYXllciAke3BsYXllci5udW1iZXJ9IHdvbiEhIWA7XG4gICAgd2lubmVyLmNsYXNzTmFtZSA9ICd3aW5uZXInO1xuICAgIGlmIChwbGF5ZXIubnVtYmVyID09PSAyKSB7XG4gICAgICB3aW5uZXIuY2xhc3NMaXN0LmFkZCgndHdvJyk7XG4gICAgfVxuICB9LFxuICB0b2dnbGVUdXJuKCkge1xuICAgIGNvbnN0IGRpdlR1cm5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm5zJyk7XG4gICAgY29uc3QgYXR0YWNrZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLm9uZScpO1xuICAgIGNvbnN0IGF0dGFja2VySW5mbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbmZvLm9uZScpO1xuICAgIGNvbnN0IGRlZmVuZG9yRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci50d28nKTtcbiAgICBjb25zdCBkZWZlbmRvckluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5mby50d28nKTtcbiAgICBjb25zdCBjdXJyZW50VHVybiA9IGRpdlR1cm5zLnRleHRDb250ZW50LnN1YnN0cmluZyg3LCA4KTtcbiAgICBpZiAoY3VycmVudFR1cm4gPT09ICcxJykge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDIgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMgcmVkJztcbiAgICAgIGF0dGFja2VyRGl2LnRleHRDb250ZW50ID0gJ1BsYXllciAyJztcbiAgICAgIGF0dGFja2VySW5mby5jbGFzc05hbWUgPSAnaW5mbyBvbmUgcmVkJztcbiAgICAgIGRlZmVuZG9yRGl2LnRleHRDb250ZW50ID0gJ1BsYXllciAxJztcbiAgICAgIGRlZmVuZG9ySW5mby5jbGFzc05hbWUgPSAnaW5mbyB0d28nO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXZUdXJucy50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMSB0dXJuJztcbiAgICAgIGRpdlR1cm5zLmNsYXNzTmFtZSA9ICd0dXJucyc7XG4gICAgICBhdHRhY2tlckRpdi50ZXh0Q29udGVudCA9ICdQbGF5ZXIgMSc7XG4gICAgICBhdHRhY2tlckluZm8uY2xhc3NOYW1lID0gJ2luZm8gb25lJztcbiAgICAgIGRlZmVuZG9yRGl2LnRleHRDb250ZW50ID0gJ1BsYXllciAyJztcbiAgICAgIGRlZmVuZG9ySW5mby5jbGFzc05hbWUgPSAnaW5mbyB0d28gcmVkJztcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZUJvYXRzQWxpdmUoKSB7XG4gICAgY29uc3QgcGFyYTEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHMtYWxpdmUub25lJyk7XG4gICAgY29uc3QgYm9hdHNBbGl2ZTEgPSBtdWx0aXBsYXllci5wbGF5ZXIxLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIHBhcmExLnRleHRDb250ZW50ID0gYEFsaXZlIHNoaXBzICR7Ym9hdHNBbGl2ZTF9YDtcbiAgICBjb25zdCBwYXJhMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcy1hbGl2ZS50d28nKTtcbiAgICBjb25zdCBib2F0c0FsaXZlMiA9IG11bHRpcGxheWVyLnBsYXllcjIuY291bnRCb2F0c0FsaXZlKCk7XG4gICAgcGFyYTIudGV4dENvbnRlbnQgPSBgQWxpdmUgc2hpcHMgJHtib2F0c0FsaXZlMn1gO1xuICB9LFxuICBkcmFnQW5kRHJvcChwbGF5ZXIpIHtcbiAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgY29uc3Qgb25EcmFnID0gZXZlbnQgPT4ge1xuICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsZW5ndGg6IGV2ZW50LmN1cnJlbnRUYXJnZXQuY2hpbGRyZW4ubGVuZ3RoLCBpZDogZXZlbnQuY3VycmVudFRhcmdldC5pZCB9KVxuICAgICAgKTtcbiAgICB9O1xuICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICBib2F0LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIG9uRHJhZyk7XG4gICAgICBib2F0LmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICBib2F0LnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgfSk7XG5cbiAgICBjb25zdCBncmlkTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNncmlkLXBsYWNlIC5zcXVhcmUuZW1wdHknKTtcbiAgICAgIGNvbnN0IG9uRHJvcCA9IGV2ZW50ID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QganNvbiA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIGNvbnN0IG9iamVjdCA9IEpTT04ucGFyc2UoanNvbik7XG4gICAgICAgIGNvbnN0IHsgbGVuZ3RoIH0gPSBvYmplY3Q7XG4gICAgICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZC1wbGFjZScpO1xuICAgICAgICBjb25zdCBjb2x1bW4gPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgIGNvbnN0IGNsaWNrZWRTcXVhcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBjb25zdCBpbmRleFkgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGNvbHVtbi5jaGlsZHJlbiwgY2xpY2tlZFNxdWFyZSk7XG4gICAgICAgIGNvbnN0IGluZGV4WCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZ3JpZC5jaGlsZHJlbiwgY29sdW1uKTtcbiAgICAgICAgY29uc3QgeyBkaXJlY3Rpb24gfSA9IG11bHRpcGxheWVyO1xuICAgICAgICBjb25zdCBwbGF5ZXJHcmlkID0gcGxheWVyLmdldEdyaWQoKTtcbiAgICAgICAgY29uc3QgaXNFbXB0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICAgICAgICBjb25zdCBzdXJyb3VuZGluZ0FycmF5ID0gW107XG5cbiAgICAgICAgICBhcnJheS5wdXNoKHBsYXllckdyaWRbaW5kZXhYXVtpbmRleFldKTtcbiAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgYXJyYXkucHVzaChwbGF5ZXJHcmlkW2luZGV4WCArIGldW2luZGV4WV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgIGFycmF5LnB1c2gocGxheWVyR3JpZFtpbmRleFhdW2luZGV4WSArIGldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gLTE7IGkgPD0gbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHgxID0gaW5kZXhYICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IDApO1xuICAgICAgICAgICAgY29uc3QgeTEgPSBpbmRleFkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAwIDogaSk7XG4gICAgICAgICAgICBjb25zdCB4MiA9IGluZGV4WCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAtMSk7XG4gICAgICAgICAgICBjb25zdCB5MiA9IGluZGV4WSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IC0xIDogaSk7XG4gICAgICAgICAgICBjb25zdCB4MyA9IGluZGV4WCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAxKTtcbiAgICAgICAgICAgIGNvbnN0IHkzID0gaW5kZXhZICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gMSA6IGkpO1xuXG4gICAgICAgICAgICBpZiAoeDEgPj0gMCAmJiB4MSA8IHBsYXllckdyaWQubGVuZ3RoICYmIHkxID49IDAgJiYgeTEgPCBwbGF5ZXJHcmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2gocGxheWVyR3JpZFt4MV1beTFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh4MiA+PSAwICYmIHgyIDwgcGxheWVyR3JpZC5sZW5ndGggJiYgeTIgPj0gMCAmJiB5MiA8IHBsYXllckdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChwbGF5ZXJHcmlkW3gyXVt5Ml0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHgzID49IDAgJiYgeDMgPCBwbGF5ZXJHcmlkLmxlbmd0aCAmJiB5MyA+PSAwICYmIHkzIDwgcGxheWVyR3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKHBsYXllckdyaWRbeDNdW3kzXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZW1wdHkgPSBhcnJheS5ldmVyeShzcXVhcmUgPT4gc3F1YXJlID09PSBudWxsKTtcbiAgICAgICAgICBjb25zdCBzdXJyb3VuZGluZ0VtcHR5ID0gc3Vycm91bmRpbmdBcnJheS5ldmVyeShzcXVhcmUgPT4gc3F1YXJlID09PSBudWxsKTtcblxuICAgICAgICAgIHJldHVybiBlbXB0eSAmJiBzdXJyb3VuZGluZ0VtcHR5O1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIGlmIChpc0VtcHR5ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwbGF5ZXIucGxhY2VTaGlwKFtpbmRleFgsIGluZGV4WV0sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgICAgICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVHcmlkKHBsYXllci5nZXRHcmlkKCksIHRydWUpO1xuICAgICAgICBjb25zdCBkcmFnZ2VkQm9hdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9iamVjdC5pZCk7XG4gICAgICAgIGRyYWdnZWRCb2F0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIG9uRHJhZyk7XG4gICAgICAgIGRyYWdnZWRCb2F0LmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBkcmFnZ2VkQm9hdC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgICBncmlkTGlzdGVuZXJzKCk7XG4gICAgICB9O1xuICAgICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiB7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGV2ZW50ID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBvbkRyb3ApO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBncmlkTGlzdGVuZXJzKCk7XG4gIH0sXG4gIHNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBkaWFsb2dQbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwcycpO1xuICAgIGRpYWxvZ1BsYWNlLnNob3dNb2RhbCgpO1xuICAgIG11bHRpcGxheWVyLmRyYWdBbmREcm9wKHBsYXllcjEpO1xuICAgIG11bHRpcGxheWVyLmFkZEV2ZW50TGlzdGVuZXJzKHBsYXllcjEsIHBsYXllcjIpO1xuICB9LFxuICBhZGRFdmVudExpc3RlbmVycyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgY29uc3Qgb2xkU3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMgLnN0YXJ0Jyk7XG4gICAgY29uc3Qgc3RhcnRCdXR0b24gPSBvbGRTdGFydEJ1dHRvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgb2xkU3RhcnRCdXR0b24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc3RhcnRCdXR0b24sIG9sZFN0YXJ0QnV0dG9uKTtcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRpYWxvZ1BsYWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzJyk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBsZXQgY2FuU3RhcnQ7XG4gICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICBpZiAoYm9hdC5kcmFnZ2FibGUgPT09IHRydWUpIGNhblN0YXJ0ID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIGlmIChjYW5TdGFydCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgIGlmICh0aGlzLnBsYXllclBsYWNpbmcgPT09IDEpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJQbGFjaW5nID0gMjtcbiAgICAgICAgdGhpcy5zaG93U3RhcnRpbmdEaWFsb2cocGxheWVyMiwgcGxheWVyMSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRpYWxvZ1BsYWNlLmNsb3NlKCk7XG4gICAgICBtdWx0aXBsYXllci5wb3B1bGF0ZUdyaWQocGxheWVyMi5nZXRHcmlkKCkpO1xuICAgICAgbXVsdGlwbGF5ZXIucG9wdWxhdGVFbmVteUdyaWQocGxheWVyMiwgcGxheWVyMSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBvbGRDaERpcmVjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkaXJlY3Rpb24nKTtcbiAgICBjb25zdCBjaERpcmVjdGlvbiA9IG9sZENoRGlyZWN0aW9uLmNsb25lTm9kZSh0cnVlKTtcbiAgICBvbGRDaERpcmVjdGlvbi5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjaERpcmVjdGlvbiwgb2xkQ2hEaXJlY3Rpb24pO1xuICAgIGNoRGlyZWN0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgYm9hdERyYWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hdHMtZHJhZycpO1xuICAgICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgYm9hdERyYWcuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKTtcbiAgICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgICBib2F0LmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2F0RHJhZy5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbCcpO1xuICAgICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICAgIGJvYXQuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3Qgb2xkUmFuZG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJhbmRvbScpO1xuICAgIGNvbnN0IHJhbmRvbSA9IG9sZFJhbmRvbS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgb2xkUmFuZG9tLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHJhbmRvbSwgb2xkUmFuZG9tKTtcbiAgICByYW5kb20uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBwbGF5ZXIxLmVtcHR5R3JpZCgpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oNSk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSg0KTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oMyk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSgyKTtcbiAgICAgIG11bHRpcGxheWVyLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICBjb25zdCBvbGRCb2F0ID0gYm9hdDtcbiAgICAgICAgY29uc3QgbmV3Qm9hdCA9IG9sZEJvYXQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBvbGRCb2F0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0JvYXQsIG9sZEJvYXQpO1xuICAgICAgICBuZXdCb2F0LmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBuZXdCb2F0LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG11bHRpcGxheWVyO1xuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tICcuL2dhbWVib2FyZCc7XG5cbmNvbnN0IFBsYXllciA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gR2FtZWJvYXJkKCk7XG5cbiAgY29uc3QgYWxsU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLmFsbFN1bmsoKTtcbiAgfTtcblxuICBjb25zdCB3aW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdJIHdvbic7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gZnVuY3Rpb24gKHN0YXJ0LCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoc3RhcnQsIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXBSYW5kb20gPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgZ2FtZWJvYXJkLnBsYWNlU2hpcFJhbmRvbShsZW5ndGgpO1xuICB9O1xuXG4gIGNvbnN0IGdldEdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5nZXRHcmlkKCk7XG4gIH07XG5cbiAgY29uc3QgZW1wdHlHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgIGdhbWVib2FyZC5lbXB0eUdyaWQoKTtcbiAgfVxuXG4gIGNvbnN0IGNvdW50Qm9hdHNBbGl2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVIaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHJldHVybiBnYW1lYm9hcmQucmVjZWl2ZUhpdCh4LCB5KTtcbiAgfTtcblxuICBjb25zdCBhdHRhY2sgPSBmdW5jdGlvbiAocGxheWVyLCB4LCB5KSB7XG4gICAgY29uc3QgaGl0ID0gcGxheWVyLnJlY2VpdmVIaXQoeCwgeSk7XG4gICAgaWYgKHBsYXllci5hbGxTdW5rKCkpIHtcbiAgICAgIHJldHVybiB3aW4oKTtcbiAgICB9XG4gICAgcmV0dXJuIGhpdDtcbiAgfTtcblxuICBjb25zdCByYW5kb21BdHRhY2sgPSBmdW5jdGlvbiAocGxheWVyKSB7XG4gICAgbGV0IHg7XG4gICAgbGV0IHk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgaWYgKHR5cGVvZiBwbGF5ZXIuZ2V0R3JpZCgpW3hdW3ldID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShwbGF5ZXIuZ2V0R3JpZCgpW3hdW3ldKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGF0dGFjayhwbGF5ZXIsIHgsIHkpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbnVtYmVyLFxuICAgIGFsbFN1bmssXG4gICAgcGxhY2VTaGlwLFxuICAgIGdldEdyaWQsXG4gICAgcmVjZWl2ZUhpdCxcbiAgICBhdHRhY2ssXG4gICAgd2luLFxuICAgIHJhbmRvbUF0dGFjayxcbiAgICBjb3VudEJvYXRzQWxpdmUsXG4gICAgcGxhY2VTaGlwUmFuZG9tLFxuICAgIGVtcHR5R3JpZCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNvbnN0IFNoaXAgPSBmdW5jdGlvbiBjcmVhdGVTaGlwKHNoaXBMZW5ndGgpIHtcbiAgY29uc3QgbGVuZ3RoID0gc2hpcExlbmd0aDtcbiAgbGV0IGhpdHMgPSAwO1xuICBjb25zdCBhZGRIaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaGl0cyArPSAxO1xuICAgIHJldHVybiBoaXRzO1xuICB9O1xuICBjb25zdCBpc1N1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGhpdHMgPT09IGxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICByZXR1cm4geyBsZW5ndGgsIGFkZEhpdCwgaXNTdW5rIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuIH1cXG4gXFxuXFxuKiB7XFxubWFyZ2luOiAwO1xcbnBhZGRpbmc6IDA7XFxufVxcblxcblxcbmJvZHkge1xcbmxpbmUtaGVpZ2h0OiAxLjU7XFxuLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxuZm9udC1mYW1pbHk6ICdSdWJpayBCdWJibGVzJywgQ291cmllciwgbW9ub3NwYWNlO1xcbn1cXG5cXG5cXG5pbWcsIHBpY3R1cmUsIHZpZGVvLCBjYW52YXMsIHN2ZyB7XFxuZGlzcGxheTogYmxvY2s7XFxubWF4LXdpZHRoOiAxMDAlO1xcbn1cXG5cXG5cXG5pbnB1dCwgYnV0dG9uLCB0ZXh0YXJlYSwgc2VsZWN0IHtcXG5mb250OiBpbmhlcml0O1xcbn1cXG5cXG5cXG5wLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXG5vdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xcbn1cXG5cXG5cXG5idXR0b24sIGF7XFxuY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5cXG5he1xcbiAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuXFxuXFxuXFxuLyogRm9vdGVyICovXFxuXFxuXFxuaHRtbCB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5wb3NpdGlvbjogcmVsYXRpdmU7XFxubWluLWhlaWdodDogMTAwJTtcXG59XFxuXFxuXFxuYm9keSB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5tYXJnaW4tYm90dG9tOiA0OHB4O1xcbn1cXG5cXG5cXG4uZm9vdGVyIHtcXG5wb3NpdGlvbjogYWJzb2x1dGU7XFxuYm90dG9tOiAwO1xcbmxlZnQ6IDA7XFxuZGlzcGxheTogZmxleDtcXG5hbGlnbi1pdGVtczogY2VudGVyO1xcbmp1c3RpZnktY29udGVudDogY2VudGVyO1xcbmdhcDogMTBweDtcXG53aWR0aDogMTAwJTtcXG5wYWRkaW5nOiAxMHB4O1xcbmJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDE4cHg7XFxufVxcblxcblxcbi5mYS1naXRodWIge1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDIycHg7XFxudHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxufVxcblxcblxcbi5mYS1naXRodWI6aG92ZXIge1xcbnRyYW5zZm9ybTogcm90YXRlKDM2MGRlZykgc2NhbGUoMS4yKTtcXG59XFxuXFxuLyogU3R5bGluZyAqL1xcblxcbjpyb290e1xcbiAtLWhlYWRlci1iZzogIzNEM0QzRDtcXG4gLS1tYWluLWJnOiMzMDMwMzA7XFxuIC0tdGV4dDojRkZGRkZGO1xcbiAtLWdyaWQtYm9yZGVyczojMDAyQzY2O1xcbiAtLWdyaWQtc3F1YXJlczojMjM4OURBO1xcbiAtLW15LWJvYXRzOiM4MDgwODA7XFxuIC0tbXktYm9hdHMtYm9yZGVyOiM0NjQ2NDY7XFxuIC0tc2hpcC1oaXQ6I0Y4MjcyNztcXG4gLS1zaGlwLXN1bms6I0QxNjA2MDtcXG4gLS1ncmVlbi10ZXh0OiMyQkM1NTc7XFxuIC0tcmVkLXRleHQ6I0UyMzYzNjtcXG59XFxuXFxuYm9keSB7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuaGVhZGVye1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhlYWRlci1iZyk7XFxuICAgZmxleDogMTtcXG59XFxuXFxuaDF7XFxuICAgZm9udC1zaXplOiAyLjVyZW07XFxuICAgZm9udC13ZWlnaHQ6IDUwMDtcXG59XFxuXFxubWFpbntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWJnKTtcXG4gICBmbGV4OiA3O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGdhcDogNXZoO1xcbiAgIHBhZGRpbmc6IDV2aCAwcHg7XFxufVxcblxcbi50dXJuc3tcXG4gICBwYWRkaW5nOiAxMHB4IDMwcHg7XFxuICAgYm9yZGVyOiAycHggcmlkZ2UgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogMnJlbTs7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnR1cm5zLnJlZCB7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5ncmlkLWNvbnRhaW5lcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgZ2FwOiAxMHZ3O1xcbn1cXG5cXG4ud3JhcHBlcntcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLm51bWJlci13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnktd3JhcHBlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1cHg7XFxufVxcblxcbi55LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBtaW4taGVpZ2h0OiA3MHZoO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi55LWNvb3JkaW5hdGVzIHB7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmdyaWQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYXNwZWN0LXJhdGlvOiAxLzE7XFxuICAgaGVpZ2h0OiA3MHZoO1xcbiAgIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgYm9yZGVyLXJhZGl1czogNnB4O1xcbn1cXG5cXG4ueC1jb29yZGluYXRlc3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiA3MHZoO1xcbiAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4ueC1jb29yZGluYXRlcyBwe1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ubGluZXtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgd2lkdGg6IDEwJTtcXG4gICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbi5zcXVhcmV7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1ncmlkLWJvcmRlcnMpO1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAlO1xcbiAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xcbn1cXG5cXG5cXG5cXG4jZ3JpZDIgLnNxdWFyZS5lbXB0eTpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTEwLCA4LCAxOTQpO1xcbiAgIGN1cnNvcjpjcm9zc2hhaXI7XFxufVxcblxcbi5zcXVhcmUuc2hpcHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcblxcbi5zcXVhcmUud2F0ZXJ7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAycmVtO1xcbn1cXG5cXG4uc3F1YXJlLmhpdCB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1oaXQpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5zcXVhcmUuc3VuayB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1zdW5rKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBmb250LXdlaWdodDogODAwO1xcbn1cXG5cXG4uaW5mb3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8gLnNoaXBzLWFsaXZle1xcbiAgIGJvcmRlci10b3A6IDJweCBzb2xpZCB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8ucmVke1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5pbmZvLnJlZCAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuXFxuXFxuXFxuZGlhbG9ne1xcbiAgIHRvcDogNTAlO1xcbiAgIGxlZnQ6IDUwJTtcXG4gICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gICBoZWlnaHQ6IDUwdmg7XFxuICAgd2lkdGg6IDEwMHZ3O1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIG9wYWNpdHk6IDAuOTtcXG4gICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZXNtb2tlO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcblxcblxcbi5kaWFsb2ctY29udGFpbmVye1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdmg7XFxufVxcblxcbi53aW5uZXJ7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBwYWRkaW5nOiAyMHB4O1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcbi53aW5uZXIudHdve1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5idXR0b257XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxuICAgYm9yZGVyOiBub25lO1xcbiAgIG91dGxpbmU6IG5vbmU7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICBwYWRkaW5nOiAxMHB4O1xcbiAgIHRyYW5zaXRpb246IDAuM3MgZWFzZSA7XFxufVxcblxcbmJ1dHRvbjpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG59XFxuXFxuXFxuLnBsYWNlLXNoaXBzIHtcXG4gICBwYWRkaW5nOiAydmggMnZ3IDtcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICBvcGFjaXR5OiAwLjk4O1xcbiAgIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5kaWFsb2ctY29udGFpbmVye1xcbiAgIGdhcDogMnZoO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmRpYWxvZy1oZWFkZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBnYXA6IDh2dztcXG59XFxuXFxuaDJ7XFxuICAgZm9udC1zaXplOiAxLjhyZW07XFxuICAgZm9udC13ZWlnaHQ6IDQwMDtcXG59XFxuXFxuI2RpcmVjdGlvbiB7XFxuICAgcGFkZGluZzogNXB4O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLndyYXBwZXIge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgZ2FwOiA1dnc7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0cy1kcmFnIHtcXG4gICB3aWR0aDogMjB2O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBnYXA6IDN2aDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0cy1kcmFnLnZlcnRpY2FsIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgIGdhcDogM3Z3O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQtd3JhcHBlciB7XFxuICAgZGlzcGxheTpmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICB3aWR0aDogZml0LWNvbnRlbnQ7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdC52ZXJ0aWNhbCB7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxufVxcblxcbi5ib2F0IC5ib2F0LXNxdWFyZSB7XFxuICAgZmxleDogbm9uZTtcXG4gICB3aWR0aDogN3ZoO1xcbiAgIGhlaWdodDogN3ZoO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHNCQUFzQjtDQUN2Qjs7O0FBR0Q7QUFDQSxTQUFTO0FBQ1QsVUFBVTtBQUNWOzs7QUFHQTtBQUNBLGdCQUFnQjtBQUNoQixtQ0FBbUM7QUFDbkMsZ0RBQWdEO0FBQ2hEOzs7QUFHQTtBQUNBLGNBQWM7QUFDZCxlQUFlO0FBQ2Y7OztBQUdBO0FBQ0EsYUFBYTtBQUNiOzs7QUFHQTtBQUNBLHlCQUF5QjtBQUN6Qjs7O0FBR0E7QUFDQSxlQUFlO0FBQ2Y7OztBQUdBO0dBQ0cscUJBQXFCO0FBQ3hCOzs7OztBQUtBLFdBQVc7OztBQUdYO0FBQ0EsbUJBQW1CO0FBQ25CLGtCQUFrQjtBQUNsQixnQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0EsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQjs7O0FBR0E7QUFDQSxrQkFBa0I7QUFDbEIs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QWlDO0dBQ2pDLHdDQUF3QztHQUN4QyxrQkFBa0I7QUFDckJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiwgKjo6YmVmb3JlLCAqOjphZnRlciB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiB9XFxuIFxcblxcbioge1xcbm1hcmdpbjogMDtcXG5wYWRkaW5nOiAwO1xcbn1cXG5cXG5cXG5ib2R5IHtcXG5saW5lLWhlaWdodDogMS41O1xcbi13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xcbmZvbnQtZmFtaWx5OiAnUnViaWsgQnViYmxlcycsIENvdXJpZXIsIG1vbm9zcGFjZTtcXG59XFxuXFxuXFxuaW1nLCBwaWN0dXJlLCB2aWRlbywgY2FudmFzLCBzdmcge1xcbmRpc3BsYXk6IGJsb2NrO1xcbm1heC13aWR0aDogMTAwJTtcXG59XFxuXFxuXFxuaW5wdXQsIGJ1dHRvbiwgdGV4dGFyZWEsIHNlbGVjdCB7XFxuZm9udDogaW5oZXJpdDtcXG59XFxuXFxuXFxucCwgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XFxub3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcXG59XFxuXFxuXFxuYnV0dG9uLCBhe1xcbmN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuXFxuYXtcXG4gICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxufVxcblxcblxcblxcblxcbi8qIEZvb3RlciAqL1xcblxcblxcbmh0bWwge1xcbi8qIGZvb3RlciBzdXBwb3J0ICovXFxucG9zaXRpb246IHJlbGF0aXZlO1xcbm1pbi1oZWlnaHQ6IDEwMCU7XFxufVxcblxcblxcbmJvZHkge1xcbi8qIGZvb3RlciBzdXBwb3J0ICovXFxubWFyZ2luLWJvdHRvbTogNDhweDtcXG59XFxuXFxuXFxuLmZvb3RlciB7XFxucG9zaXRpb246IGFic29sdXRlO1xcbmJvdHRvbTogMDtcXG5sZWZ0OiAwO1xcbmRpc3BsYXk6IGZsZXg7XFxuYWxpZ24taXRlbXM6IGNlbnRlcjtcXG5qdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5nYXA6IDEwcHg7XFxud2lkdGg6IDEwMCU7XFxucGFkZGluZzogMTBweDtcXG5iYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG5jb2xvcjogd2hpdGU7XFxuZm9udC1zaXplOiAxOHB4O1xcbn1cXG5cXG5cXG4uZmEtZ2l0aHViIHtcXG5jb2xvcjogd2hpdGU7XFxuZm9udC1zaXplOiAyMnB4O1xcbnRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG5cXG4uZmEtZ2l0aHViOmhvdmVyIHtcXG50cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpIHNjYWxlKDEuMik7XFxufVxcblxcbi8qIFN0eWxpbmcgKi9cXG5cXG46cm9vdHtcXG4gLS1oZWFkZXItYmc6ICMzRDNEM0Q7XFxuIC0tbWFpbi1iZzojMzAzMDMwO1xcbiAtLXRleHQ6I0ZGRkZGRjtcXG4gLS1ncmlkLWJvcmRlcnM6IzAwMkM2NjtcXG4gLS1ncmlkLXNxdWFyZXM6IzIzODlEQTtcXG4gLS1teS1ib2F0czojODA4MDgwO1xcbiAtLW15LWJvYXRzLWJvcmRlcjojNDY0NjQ2O1xcbiAtLXNoaXAtaGl0OiNGODI3Mjc7XFxuIC0tc2hpcC1zdW5rOiNEMTYwNjA7XFxuIC0tZ3JlZW4tdGV4dDojMkJDNTU3O1xcbiAtLXJlZC10ZXh0OiNFMjM2MzY7XFxufVxcblxcbmJvZHkge1xcbiAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgbWluLWhlaWdodDogMTAwdmg7XFxufVxcblxcbmhlYWRlcntcXG4gICBwYWRkaW5nOiAydmggMnZ3O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1oZWFkZXItYmcpO1xcbiAgIGZsZXg6IDE7XFxufVxcblxcbmgxe1xcbiAgIGZvbnQtc2l6ZTogMi41cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA1MDA7XFxufVxcblxcbm1haW57XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1iZyk7XFxuICAgZmxleDogNztcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBnYXA6IDV2aDtcXG4gICBwYWRkaW5nOiA1dmggMHB4O1xcbn1cXG5cXG4udHVybnN7XFxuICAgcGFkZGluZzogMTBweCAzMHB4O1xcbiAgIGJvcmRlcjogMnB4IHJpZGdlIHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBmb250LXNpemU6IDJyZW07O1xcbiAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcblxcbi50dXJucy5yZWQge1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxuICAgYm9yZGVyOiAycHggcmlkZ2UgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG4uZ3JpZC1jb250YWluZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgIGdhcDogMTB2dztcXG59XFxuXFxuLndyYXBwZXJ7XFxuICAgZGlzcGxheTpmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbi5udW1iZXItd3JhcHBlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbi55LXdyYXBwZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGdhcDogNXB4O1xcbn1cXG5cXG4ueS1jb29yZGluYXRlc3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgbWluLWhlaWdodDogNzB2aDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4ueS1jb29yZGluYXRlcyBwe1xcbiAgIGhlaWdodDogN3ZoO1xcbiAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5ncmlkIHtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFzcGVjdC1yYXRpbzogMS8xO1xcbiAgIGhlaWdodDogNzB2aDtcXG4gICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1ncmlkLWJvcmRlcnMpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDZweDtcXG59XFxuXFxuLngtY29vcmRpbmF0ZXN7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICB3aWR0aDogNzB2aDtcXG4gICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLngtY29vcmRpbmF0ZXMgcHtcXG4gICB3aWR0aDogN3ZoO1xcbiAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLmxpbmV7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIHdpZHRoOiAxMCU7XFxuICAgaGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG4uc3F1YXJle1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JpZC1ib3JkZXJzKTtcXG4gICB3aWR0aDogMTAwJTtcXG4gICBoZWlnaHQ6IDEwJTtcXG4gICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMgZWFzZTtcXG59XFxuXFxuXFxuXFxuI2dyaWQyIC5zcXVhcmUuZW1wdHk6aG92ZXJ7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDExMCwgOCwgMTk0KTtcXG4gICBjdXJzb3I6Y3Jvc3NoYWlyO1xcbn1cXG5cXG4uc3F1YXJlLnNoaXB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXktYm9hdHMpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgYm9yZGVyLXJhZGl1czogOHB4O1xcbn1cXG5cXG4uc3F1YXJlLndhdGVye1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogMnJlbTtcXG59XFxuXFxuLnNxdWFyZS5oaXQge1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoaXAtaGl0KTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBmb250LXdlaWdodDogODAwO1xcbn1cXG5cXG4uc3F1YXJlLnN1bmsge1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoaXAtc3Vuayk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgZm9udC13ZWlnaHQ6IDgwMDtcXG59XFxuXFxuLmluZm97XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgZm9udC13ZWlnaHQ6IDUwMDtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxufVxcblxcbi5pbmZvIC5zaGlwcy1hbGl2ZXtcXG4gICBib3JkZXItdG9wOiAycHggc29saWQgdmFyKC0tZ3JlZW4tdGV4dCk7XFxufVxcblxcbi5pbmZvLnJlZHtcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG4uaW5mby5yZWQgLnNoaXBzLWFsaXZle1xcbiAgIGJvcmRlci10b3A6IDJweCBzb2xpZCB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcblxcblxcblxcbmRpYWxvZ3tcXG4gICB0b3A6IDUwJTtcXG4gICBsZWZ0OiA1MCU7XFxuICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICAgaGVpZ2h0OiA1MHZoO1xcbiAgIHdpZHRoOiAxMDB2dztcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWJnKTtcXG4gICBvcGFjaXR5OiAwLjk7XFxuICAgYm9yZGVyOiAxcHggc29saWQgd2hpdGVzbW9rZTtcXG4gICBib3JkZXItcmFkaXVzOiAxMnB4O1xcbn1cXG5cXG5cXG5cXG4uZGlhbG9nLWNvbnRhaW5lcntcXG4gICB3aWR0aDogMTAwJTtcXG4gICBoZWlnaHQ6IDEwMCU7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgZ2FwOiAxMHZoO1xcbn1cXG5cXG4ud2lubmVye1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgcGFkZGluZzogMjBweDtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBib3JkZXItcmFkaXVzOiAxMnB4O1xcbn1cXG5cXG4ud2lubmVyLnR3b3tcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuYnV0dG9ue1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbiAgIGJvcmRlcjogbm9uZTtcXG4gICBvdXRsaW5lOiBub25lO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgcGFkZGluZzogMTBweDtcXG4gICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgO1xcbn1cXG5cXG5idXR0b246aG92ZXJ7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxufVxcblxcblxcbi5wbGFjZS1zaGlwcyB7XFxuICAgcGFkZGluZzogMnZoIDJ2dyA7XFxuICAgbWluLWhlaWdodDogMTAwdmg7XFxuICAgb3BhY2l0eTogMC45ODtcXG4gICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuZGlhbG9nLWNvbnRhaW5lcntcXG4gICBnYXA6IDJ2aDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5kaWFsb2ctaGVhZGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZ2FwOiA4dnc7XFxufVxcblxcbmgye1xcbiAgIGZvbnQtc2l6ZTogMS44cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA0MDA7XFxufVxcblxcbiNkaXJlY3Rpb24ge1xcbiAgIHBhZGRpbmc6IDVweDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC53cmFwcGVyIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgIGdhcDogNXZ3O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdHMtZHJhZyB7XFxuICAgd2lkdGg6IDIwdjtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgZ2FwOiAzdmg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdHMtZHJhZy52ZXJ0aWNhbCB7XFxuICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICBnYXA6IDN2dztcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0LXdyYXBwZXIge1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQudmVydGljYWwge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24tc2VsZjogY2VudGVyO1xcbn1cXG5cXG4uYm9hdCAuYm9hdC1zcXVhcmUge1xcbiAgIGZsZXg6IG5vbmU7XFxuICAgd2lkdGg6IDd2aDtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZTsgfTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgJy4vc3R5bGUuY3NzJztcbmltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG5nYW1lLnN0YXJ0TXVsdGlwbGF5ZXIoKTtcblxuLy8gY29uc3QgcGxheWVyMSA9IFBsYXllcigpO1xuLy8gY29uc3QgcGxheWVyMiA9IFBsYXllcigpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzEsIDNdLCA0LCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzcsIDNdLCAzLCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzgsIDhdLCAyLCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzEsIDVdLCAyLCAndmVydGljYWwnKTtcbi8vIHBsYXllcjIuYXR0YWNrKHBsYXllcjEsIDEsIDUpO1xuLy8gcGxheWVyMi5hdHRhY2socGxheWVyMSwgMSwgNik7XG4vLyBwbGF5ZXIyLmF0dGFjayhwbGF5ZXIxLCAxLCAzKTtcbi8vIHBsYXllcjIuYXR0YWNrKHBsYXllcjEsIDksIDkpO1xuXG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbMSwgM10sIDQsICdob3Jpem9udGFsJyk7XG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbNywgM10sIDMsICdob3Jpem9udGFsJyk7XG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbOCwgOF0sIDIsICdob3Jpem9udGFsJyk7XG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbMSwgNV0sIDIsICd2ZXJ0aWNhbCcpO1xuLy8gcGxheWVyMS5hdHRhY2socGxheWVyMiwgMSwgNSk7XG4vLyBwbGF5ZXIxLmF0dGFjayhwbGF5ZXIyLCAxLCA2KTtcbi8vIHBsYXllcjEuYXR0YWNrKHBsYXllcjIsIDEsIDMpO1xuLy8gcGxheWVyMS5hdHRhY2socGxheWVyMiwgOSwgOSk7XG5cbi8vIGRvbS5wb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKTtcblxuLy8gZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSk7XG4vLyBsZXQgZmluaXNoID0gZmFsc2U7XG4vLyB3aGlsZSAoZmluaXNoID09PSBmYWxzZSkge1xuLy8gICBmaW5pc2ggPSBkb20ubGlzdGVuRm9yQ2xpY2socGxheWVyMSwgcGxheWVyMik7XG4vLyB9XG5cbi8vIGdhbWVib2FyZC5yZWNlaXZlSGl0KDEsIDMpO1xuLy8gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoMiwgMyk7XG4vLyBnYW1lYm9hcmQucmVjZWl2ZUhpdCgzLCAzKTtcbi8vIGNvbnNvbGUubG9nKGdhbWVib2FyZC5hbGxTdW5rKCkpO1xuLy8gY29uc3Qgc2hpcDEgPSBTaGlwKDMpO1xuLy8gY29uc29sZS5sb2coc2hpcDEuYWRkSGl0KCkpO1xuXG4vLyBjb25zb2xlLmxvZyhnYW1lYm9hcmQuZ3JpZFsxXVszXSk7XG4vLyBjb25zb2xlLmxvZyhzaGlwMSk7XG4vLyBjb25zb2xlLmxvZyhnYW1lYm9hcmQuZ3JpZFsxXVszXSA9PT0gc2hpcDEpO1xuLy8gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoMSwgMyk7XG4iXSwibmFtZXMiOlsiZ2FtZSIsImRvbSIsImRpcmVjdGlvbiIsInBvcHVsYXRlR3JpZCIsImdyaWQiLCJzdGFydCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImdyaWRDb250YWluZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lckhUTUwiLCJmb3JFYWNoIiwibGluZSIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJzbG90Iiwic3F1YXJlIiwiQXJyYXkiLCJpc0FycmF5Iiwic3VuayIsImlzU3VuayIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJwb3B1bGF0ZUVuZW15R3JpZCIsInBsYXllcjEiLCJwbGF5ZXIyIiwiZ2V0R3JpZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcXVhcmVDbGlja2VkIiwiZXZlbnQiLCJlbmVteUdyaWQiLCJjb2x1bW4iLCJjdXJyZW50VGFyZ2V0IiwicGFyZW50Tm9kZSIsImNsaWNrZWRTcXVhcmUiLCJpbmRleFkiLCJwcm90b3R5cGUiLCJpbmRleE9mIiwiY2FsbCIsImNoaWxkcmVuIiwiaW5kZXhYIiwiaGl0IiwiYXR0YWNrIiwidXBkYXRlQm9hdHNBbGl2ZSIsImFsbFN1bmsiLCJwbGF5ZXJXb24iLCJ0b2dnbGVUdXJuIiwiZGVsYXkiLCJyYW5kb21BdHRhY2siLCJtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsInBsYXllciIsImRpYWxvZ1dpbiIsInNob3dNb2RhbCIsInJlc3RhcnQiLCJzdGFydEdhbWUiLCJjbG9zZSIsInR1cm5zIiwid2lubmVyIiwiY2xhc3NMaXN0IiwiYWRkIiwiZGl2VHVybnMiLCJjdXJyZW50VHVybiIsInN1YnN0cmluZyIsInBsYXllck51bSIsInBhcmEiLCJib2F0c0FsaXZlIiwiY291bnRCb2F0c0FsaXZlIiwiZHJhZ0FuZERyb3AiLCJib2F0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvbkRyYWciLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsImlkIiwiYm9hdCIsImRyYWdnYWJsZSIsInN0eWxlIiwib3BhY2l0eSIsImdyaWRMaXN0ZW5lcnMiLCJzcXVhcmVzIiwib25Ecm9wIiwicHJldmVudERlZmF1bHQiLCJqc29uIiwiZ2V0RGF0YSIsIm9iamVjdCIsInBhcnNlIiwicGxheWVyR3JpZCIsImlzRW1wdHkiLCJhcnJheSIsInN1cnJvdW5kaW5nQXJyYXkiLCJwdXNoIiwiaSIsIngxIiwieTEiLCJ4MiIsInkyIiwieDMiLCJ5MyIsImVtcHR5IiwiZXZlcnkiLCJzdXJyb3VuZGluZ0VtcHR5IiwicGxhY2VTaGlwIiwiZHJhZ2dlZEJvYXQiLCJnZXRFbGVtZW50QnlJZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzaG93U3RhcnRpbmdEaWFsb2ciLCJkaWFsb2dQbGFjZSIsImFkZEV2ZW50TGlzdGVuZXJzIiwib2xkU3RhcnRCdXR0b24iLCJzdGFydEJ1dHRvbiIsImNsb25lTm9kZSIsInJlcGxhY2VDaGlsZCIsImNhblN0YXJ0Iiwib2xkQ2hEaXJlY3Rpb24iLCJjaERpcmVjdGlvbiIsImJvYXREcmFnIiwicmVtb3ZlIiwib2xkUmFuZG9tIiwicmFuZG9tIiwiZW1wdHlHcmlkIiwicGxhY2VTaGlwUmFuZG9tIiwib2xkQm9hdCIsIm5ld0JvYXQiLCJQbGF5ZXIiLCJtdWx0aXBsYXllciIsInN0YXJ0TXVsdGlwbGF5ZXIiLCJTaGlwIiwiY3JlYXRlR3JpZCIsIm4iLCJqIiwiR2FtZWJvYXJkIiwiY3JlYXRlR2FtZWJvYXJkIiwic2hpcE9iaiIsIngiLCJ5IiwibnVtIiwiTWF0aCIsInJvdW5kIiwiZmxvb3IiLCJyZWNlaXZlSGl0IiwidmFsdWUiLCJhZGRIaXQiLCJyZXN1bHQiLCJpbmNsdWRlcyIsInBsYXllclBsYWNpbmciLCJudW1iZXIiLCJhdHRhY2tlckRpdiIsImF0dGFja2VySW5mbyIsImRlZmVuZG9yRGl2IiwiZGVmZW5kb3JJbmZvIiwicGFyYTEiLCJib2F0c0FsaXZlMSIsInBhcmEyIiwiYm9hdHNBbGl2ZTIiLCJnYW1lYm9hcmQiLCJ3aW4iLCJjcmVhdGVTaGlwIiwic2hpcExlbmd0aCIsImhpdHMiXSwic291cmNlUm9vdCI6IiJ9