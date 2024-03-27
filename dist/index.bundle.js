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


const game = {
  startGame() {
    const player1 = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])();
    const player2 = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])();
    player2.placeShipRandom(5);
    player2.placeShipRandom(4);
    player2.placeShipRandom(3);
    player2.placeShipRandom(3);
    player2.placeShipRandom(2);
    // player2.placeShip([6, 2], 4, 'horizontal');
    // player2.placeShip([6, 6], 3, 'horizontal');
    // player2.placeShip([1, 5], 3, 'vertical');
    // player2.placeShip([7, 0], 2, 'horizontal');
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].showStartingDialog(player1, player2);
    // player1.placeShip([1, 3], 4, 'horizontal');
    // player1.placeShip([7, 3], 3, 'horizontal');
    // player1.placeShip([8, 8], 2, 'horizontal');
    // player1.placeShip([1, 5], 2, 'vertical');
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

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");

const Player = function () {
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
___CSS_LOADER_EXPORT___.push([module.id, "*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.two{\n   color: var(--red-text);\n}\n\n.info.two .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\nbutton{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\nbutton:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n\n\n.place-ships {\n   padding: 2vh 2vw ;\n   min-height: 100vh;\n   opacity: 0.98;\n   color: white;\n}\n\n.place-ships .dialog-container{\n   gap: 2vh;\n}\n\n.place-ships .dialog-header{\n   display: flex;\n   gap: 8vw;\n}\n\nh2{\n   font-size: 1.8rem;\n   font-weight: 400;\n}\n\n#direction {\n   padding: 5px;\n}\n\n.place-ships .wrapper {\n   flex-direction: row;\n   gap: 5vw;\n   align-items: center;\n}\n\n\n.place-ships .boats-drag {\n   width: 20v;\n   display: flex;\n   flex-direction: column;\n   gap: 3vh;\n}\n\n.place-ships .boats-drag.vertical {\n   flex-direction: row;\n   gap: 3vw;\n}\n\n.place-ships .boat-wrapper {\n   display:flex;\n   flex-direction: column;\n}\n\n.place-ships .boat {\n   display: flex;\n   width: fit-content;\n}\n\n.place-ships .boat.vertical {\n   flex-direction: column;\n   align-self: center;\n}\n\n.boat .boat-square {\n   flex: none;\n   width: 7vh;\n   height: 7vh;\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.two{\n   color: var(--red-text);\n}\n\n.info.two .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\nbutton{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\nbutton:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n\n\n.place-ships {\n   padding: 2vh 2vw ;\n   min-height: 100vh;\n   opacity: 0.98;\n   color: white;\n}\n\n.place-ships .dialog-container{\n   gap: 2vh;\n}\n\n.place-ships .dialog-header{\n   display: flex;\n   gap: 8vw;\n}\n\nh2{\n   font-size: 1.8rem;\n   font-weight: 400;\n}\n\n#direction {\n   padding: 5px;\n}\n\n.place-ships .wrapper {\n   flex-direction: row;\n   gap: 5vw;\n   align-items: center;\n}\n\n\n.place-ships .boats-drag {\n   width: 20v;\n   display: flex;\n   flex-direction: column;\n   gap: 3vh;\n}\n\n.place-ships .boats-drag.vertical {\n   flex-direction: row;\n   gap: 3vw;\n}\n\n.place-ships .boat-wrapper {\n   display:flex;\n   flex-direction: column;\n}\n\n.place-ships .boat {\n   display: flex;\n   width: fit-content;\n}\n\n.place-ships .boat.vertical {\n   flex-direction: column;\n   align-self: center;\n}\n\n.boat .boat-square {\n   flex: none;\n   width: 7vh;\n   height: 7vh;\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}"],"sourceRoot":""}]);
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




_game__WEBPACK_IMPORTED_MODULE_3__["default"].startGame();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFBVSxPQUFPLEtBQUssWUFBWSxVQUFVLFlBQVksS0FBSyxZQUFZLGFBQWEsYUFBYSxRQUFRLEtBQUssWUFBWSxhQUFhLFFBQVEsS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsVUFBVSxZQUFZLFdBQVcsVUFBVSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksUUFBUSxLQUFLLFlBQVksT0FBTyxXQUFXLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxTQUFTLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLFdBQVcs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Q0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsOEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG5jb25zdCBkb20gPSB7XG4gIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICBwb3B1bGF0ZUdyaWQoZ3JpZCwgc3RhcnQgPSBmYWxzZSkge1xuICAgIGxldCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQxJyk7XG4gICAgaWYgKHN0YXJ0ID09PSB0cnVlKSB7XG4gICAgICBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICB9XG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSAnbGluZSc7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpZiAoc2xvdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGVtcHR5JztcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNsb3QpKSB7XG4gICAgICAgICAgY29uc3Qgc3VuayA9IHNsb3RbMV0uaXNTdW5rKCk7XG4gICAgICAgICAgaWYgKHN1bmsgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBoaXQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc3Vuayc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc2hpcCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gJ3dhdGVyJykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHdhdGVyJztcbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfVxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgIH0pO1xuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH0pO1xuICB9LFxuICBwb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgdGhpcy5wbGF5ZXIxID0gcGxheWVyMTtcbiAgICB0aGlzLnBsYXllcjIgPSBwbGF5ZXIyO1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDInKTtcbiAgICBjb25zdCBncmlkID0gdGhpcy5wbGF5ZXIyLmdldEdyaWQoKTtcbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmNsYXNzTmFtZSA9ICdsaW5lJztcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHNsb3QpKSB7XG4gICAgICAgICAgY29uc3Qgc3VuayA9IHNsb3RbMV0uaXNTdW5rKCk7XG4gICAgICAgICAgaWYgKHN1bmsgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBoaXQnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgc3Vuayc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgPT09IG51bGwgfHwgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnKSkge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGVtcHR5JztcbiAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkb20uc3F1YXJlQ2xpY2tlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gJ3dhdGVyJykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHdhdGVyJztcbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfVxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICAgIH0pO1xuICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH0pO1xuICB9LFxuICBzcXVhcmVDbGlja2VkOiBhc3luYyBldmVudCA9PiB7XG4gICAgY29uc3QgZW5lbXlHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQyJyk7XG4gICAgY29uc3QgY29sdW1uID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xuICAgIGNvbnN0IGNsaWNrZWRTcXVhcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIGNvbnN0IGluZGV4WSA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoY29sdW1uLmNoaWxkcmVuLCBjbGlja2VkU3F1YXJlKTtcbiAgICBjb25zdCBpbmRleFggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGVuZW15R3JpZC5jaGlsZHJlbiwgY29sdW1uKTtcbiAgICBsZXQgaGl0ID0gZG9tLnBsYXllcjEuYXR0YWNrKGRvbS5wbGF5ZXIyLCBpbmRleFgsIGluZGV4WSk7XG4gICAgZG9tLnBvcHVsYXRlRW5lbXlHcmlkKGRvbS5wbGF5ZXIxLCBkb20ucGxheWVyMik7XG4gICAgZG9tLnVwZGF0ZUJvYXRzQWxpdmUoMik7XG4gICAgaWYgKGRvbS5wbGF5ZXIyLmFsbFN1bmsoKSAhPT0gZmFsc2UpIHJldHVybiBkb20ucGxheWVyV29uKDEpO1xuICAgIGlmIChoaXQgPT09IGZhbHNlKSB7XG4gICAgICBkb20udG9nZ2xlVHVybigpO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgYXdhaXQgZG9tLmRlbGF5KDUwMCk7XG4gICAgICAgIGhpdCA9IGRvbS5wbGF5ZXIyLnJhbmRvbUF0dGFjayhkb20ucGxheWVyMSk7XG4gICAgICAgIGRvbS5wb3B1bGF0ZUdyaWQoZG9tLnBsYXllcjEuZ2V0R3JpZCgpKTtcbiAgICAgICAgZG9tLnVwZGF0ZUJvYXRzQWxpdmUoMSk7XG4gICAgICAgIGlmIChkb20ucGxheWVyMS5hbGxTdW5rKCkgIT09IGZhbHNlKSByZXR1cm4gZG9tLnBsYXllcldvbigyKTtcbiAgICAgICAgaWYgKGhpdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBkb20udG9nZ2xlVHVybigpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgZGVsYXkobXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG4gIH0sXG4gIHBsYXllcldvbihwbGF5ZXIpIHtcbiAgICBjb25zdCBkaWFsb2dXaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2luJyk7XG4gICAgZGlhbG9nV2luLnNob3dNb2RhbCgpO1xuICAgIGNvbnN0IHJlc3RhcnQgPSBkaWFsb2dXaW4ucXVlcnlTZWxlY3RvcignLnJlc3RhcnQnKTtcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gZ2FtZS5zdGFydEdhbWUoKSk7XG4gICAgcmVzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGRpYWxvZ1dpbi5jbG9zZSgpO1xuICAgIH0pO1xuICAgIGNvbnN0IHR1cm5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm5zJyk7XG4gICAgdHVybnMudGV4dENvbnRlbnQgPSBgUGxheWVyICR7cGxheWVyfSB3b24hISFgO1xuICAgIGNvbnN0IHdpbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXInKTtcbiAgICB3aW5uZXIudGV4dENvbnRlbnQgPSBgUGxheWVyICR7cGxheWVyfSB3b24hISFgO1xuICAgIHdpbm5lci5jbGFzc05hbWUgPSAnd2lubmVyJztcbiAgICBpZiAocGxheWVyID09PSAyKSB7XG4gICAgICB3aW5uZXIuY2xhc3NMaXN0LmFkZCgndHdvJyk7XG4gICAgfVxuICB9LFxuICB0b2dnbGVUdXJuKCkge1xuICAgIGNvbnN0IGRpdlR1cm5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm5zJyk7XG4gICAgY29uc3QgY3VycmVudFR1cm4gPSBkaXZUdXJucy50ZXh0Q29udGVudC5zdWJzdHJpbmcoNywgOCk7XG4gICAgaWYgKGN1cnJlbnRUdXJuID09PSAnMScpIHtcbiAgICAgIGRpdlR1cm5zLnRleHRDb250ZW50ID0gJ1BsYXllciAyIHR1cm4nO1xuICAgICAgZGl2VHVybnMuY2xhc3NOYW1lID0gJ3R1cm5zIHJlZCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpdlR1cm5zLnRleHRDb250ZW50ID0gJ1BsYXllciAxIHR1cm4nO1xuICAgICAgZGl2VHVybnMuY2xhc3NOYW1lID0gJ3R1cm5zJztcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZUJvYXRzQWxpdmUocGxheWVyTnVtKSB7XG4gICAgbGV0IHBhcmE7XG4gICAgbGV0IGJvYXRzQWxpdmU7XG4gICAgaWYgKHBsYXllck51bSA9PT0gMSkge1xuICAgICAgcGFyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcy1hbGl2ZS5vbmUnKTtcbiAgICAgIGJvYXRzQWxpdmUgPSBkb20ucGxheWVyMS5jb3VudEJvYXRzQWxpdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcy1hbGl2ZS50d28nKTtcbiAgICAgIGJvYXRzQWxpdmUgPSBkb20ucGxheWVyMi5jb3VudEJvYXRzQWxpdmUoKTtcbiAgICB9XG4gICAgcGFyYS50ZXh0Q29udGVudCA9IGBBbGl2ZSBzaGlwcyAke2JvYXRzQWxpdmV9YDtcbiAgfSxcbiAgZHJhZ0FuZERyb3AocGxheWVyKSB7XG4gICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgIGNvbnN0IG9uRHJhZyA9IGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHsgbGVuZ3RoOiBldmVudC5jdXJyZW50VGFyZ2V0LmNoaWxkcmVuLmxlbmd0aCwgaWQ6IGV2ZW50LmN1cnJlbnRUYXJnZXQuaWQgfSlcbiAgICAgICk7XG4gICAgfTtcbiAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgYm9hdC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBvbkRyYWcpO1xuICAgICAgYm9hdC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgYm9hdC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZ3JpZExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjZ3JpZC1wbGFjZSAuc3F1YXJlLmVtcHR5Jyk7XG4gICAgICBjb25zdCBvbkRyb3AgPSBldmVudCA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGpzb24gPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICBjb25zdCBvYmplY3QgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgICAgICBjb25zdCB7IGxlbmd0aCB9ID0gb2JqZWN0O1xuICAgICAgICBjb25zdCBncmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQtcGxhY2UnKTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICBjb25zdCBjbGlja2VkU3F1YXJlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgaW5kZXhZID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb2x1bW4uY2hpbGRyZW4sIGNsaWNrZWRTcXVhcmUpO1xuICAgICAgICBjb25zdCBpbmRleFggPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGdyaWQuY2hpbGRyZW4sIGNvbHVtbik7XG4gICAgICAgIGNvbnN0IHsgZGlyZWN0aW9uIH0gPSBkb207XG4gICAgICAgIGNvbnN0IHBsYXllckdyaWQgPSBwbGF5ZXIuZ2V0R3JpZCgpO1xuICAgICAgICBjb25zdCBpc0VtcHR5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgICAgICAgIGNvbnN0IHN1cnJvdW5kaW5nQXJyYXkgPSBbXTtcblxuICAgICAgICAgIGFycmF5LnB1c2gocGxheWVyR3JpZFtpbmRleFhdW2luZGV4WV0pO1xuICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICBhcnJheS5wdXNoKHBsYXllckdyaWRbaW5kZXhYICsgaV1baW5kZXhZXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgYXJyYXkucHVzaChwbGF5ZXJHcmlkW2luZGV4WF1baW5kZXhZICsgaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAobGV0IGkgPSAtMTsgaSA8PSBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgeDEgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMCk7XG4gICAgICAgICAgICBjb25zdCB5MSA9IGluZGV4WSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDAgOiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHgyID0gaW5kZXhYICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IC0xKTtcbiAgICAgICAgICAgIGNvbnN0IHkyID0gaW5kZXhZICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gLTEgOiBpKTtcbiAgICAgICAgICAgIGNvbnN0IHgzID0gaW5kZXhYICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IDEpO1xuICAgICAgICAgICAgY29uc3QgeTMgPSBpbmRleFkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAxIDogaSk7XG5cbiAgICAgICAgICAgIGlmICh4MSA+PSAwICYmIHgxIDwgcGxheWVyR3JpZC5sZW5ndGggJiYgeTEgPj0gMCAmJiB5MSA8IHBsYXllckdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChwbGF5ZXJHcmlkW3gxXVt5MV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHgyID49IDAgJiYgeDIgPCBwbGF5ZXJHcmlkLmxlbmd0aCAmJiB5MiA+PSAwICYmIHkyIDwgcGxheWVyR3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKHBsYXllckdyaWRbeDJdW3kyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeDMgPj0gMCAmJiB4MyA8IHBsYXllckdyaWQubGVuZ3RoICYmIHkzID49IDAgJiYgeTMgPCBwbGF5ZXJHcmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2gocGxheWVyR3JpZFt4M11beTNdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBlbXB0eSA9IGFycmF5LmV2ZXJ5KHNxdWFyZSA9PiBzcXVhcmUgPT09IG51bGwpO1xuICAgICAgICAgIGNvbnN0IHN1cnJvdW5kaW5nRW1wdHkgPSBzdXJyb3VuZGluZ0FycmF5LmV2ZXJ5KHNxdWFyZSA9PiBzcXVhcmUgPT09IG51bGwpO1xuXG4gICAgICAgICAgcmV0dXJuIGVtcHR5ICYmIHN1cnJvdW5kaW5nRW1wdHk7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgaWYgKGlzRW1wdHkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBsYXllci5wbGFjZVNoaXAoW2luZGV4WCwgaW5kZXhZXSwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xuICAgICAgICBkb20ucG9wdWxhdGVHcmlkKHBsYXllci5nZXRHcmlkKCksIHRydWUpO1xuICAgICAgICBjb25zdCBkcmFnZ2VkQm9hdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9iamVjdC5pZCk7XG4gICAgICAgIGRyYWdnZWRCb2F0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIG9uRHJhZyk7XG4gICAgICAgIGRyYWdnZWRCb2F0LmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBkcmFnZ2VkQm9hdC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgICBncmlkTGlzdGVuZXJzKCk7XG4gICAgICB9O1xuICAgICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiB7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGV2ZW50ID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBvbkRyb3ApO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBncmlkTGlzdGVuZXJzKCk7XG4gIH0sXG4gIHNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgY29uc3QgZGlhbG9nUGxhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMnKTtcbiAgICBkaWFsb2dQbGFjZS5zaG93TW9kYWwoKTtcbiAgICBkb20uZHJhZ0FuZERyb3AocGxheWVyMSk7XG4gICAgZG9tLmFkZEV2ZW50TGlzdGVuZXJzKHBsYXllcjEsIHBsYXllcjIpO1xuICB9LFxuICBhZGRFdmVudExpc3RlbmVycyhwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gICAgY29uc3Qgb2xkU3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMgLnN0YXJ0Jyk7XG4gICAgY29uc3Qgc3RhcnRCdXR0b24gPSBvbGRTdGFydEJ1dHRvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgb2xkU3RhcnRCdXR0b24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc3RhcnRCdXR0b24sIG9sZFN0YXJ0QnV0dG9uKTtcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRpYWxvZ1BsYWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzJyk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBsZXQgY2FuU3RhcnQ7XG4gICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICBpZiAoYm9hdC5kcmFnZ2FibGUgPT09IHRydWUpIGNhblN0YXJ0ID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIGlmIChjYW5TdGFydCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgIGRpYWxvZ1BsYWNlLmNsb3NlKCk7XG4gICAgICBkb20ucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpKTtcbiAgICAgIGRvbS5wb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IG9sZENoRGlyZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RpcmVjdGlvbicpO1xuICAgIGNvbnN0IGNoRGlyZWN0aW9uID0gb2xkQ2hEaXJlY3Rpb24uY2xvbmVOb2RlKHRydWUpO1xuICAgIG9sZENoRGlyZWN0aW9uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNoRGlyZWN0aW9uLCBvbGRDaERpcmVjdGlvbik7XG4gICAgY2hEaXJlY3Rpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBib2F0RHJhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2F0cy1kcmFnJyk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBib2F0RHJhZy5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuICAgICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICAgIGJvYXQuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvYXREcmFnLmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICAgICAgYm9hdC5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBvbGRSYW5kb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmFuZG9tJyk7XG4gICAgY29uc3QgcmFuZG9tID0gb2xkUmFuZG9tLmNsb25lTm9kZSh0cnVlKTtcbiAgICBvbGRSYW5kb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocmFuZG9tLCBvbGRSYW5kb20pO1xuICAgIHJhbmRvbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHBsYXllcjEuZW1wdHlHcmlkKCk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSg1KTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDQpO1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBSYW5kb20oMyk7XG4gICAgICBwbGF5ZXIxLnBsYWNlU2hpcFJhbmRvbSgzKTtcbiAgICAgIHBsYXllcjEucGxhY2VTaGlwUmFuZG9tKDIpO1xuICAgICAgZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICBjb25zdCBvbGRCb2F0ID0gYm9hdDtcbiAgICAgICAgY29uc3QgbmV3Qm9hdCA9IG9sZEJvYXQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBvbGRCb2F0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0JvYXQsIG9sZEJvYXQpO1xuICAgICAgICBuZXdCb2F0LmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBuZXdCb2F0LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRvbTtcbiIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5cbmNvbnN0IGdhbWUgPSB7XG4gIHN0YXJ0R2FtZSgpIHtcbiAgICBjb25zdCBwbGF5ZXIxID0gUGxheWVyKCk7XG4gICAgY29uc3QgcGxheWVyMiA9IFBsYXllcigpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDUpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDQpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDMpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwUmFuZG9tKDIpO1xuICAgIC8vIHBsYXllcjIucGxhY2VTaGlwKFs2LCAyXSwgNCwgJ2hvcml6b250YWwnKTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcChbNiwgNl0sIDMsICdob3Jpem9udGFsJyk7XG4gICAgLy8gcGxheWVyMi5wbGFjZVNoaXAoWzEsIDVdLCAzLCAndmVydGljYWwnKTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcChbNywgMF0sIDIsICdob3Jpem9udGFsJyk7XG4gICAgZG9tLnNob3dTdGFydGluZ0RpYWxvZyhwbGF5ZXIxLCBwbGF5ZXIyKTtcbiAgICAvLyBwbGF5ZXIxLnBsYWNlU2hpcChbMSwgM10sIDQsICdob3Jpem9udGFsJyk7XG4gICAgLy8gcGxheWVyMS5wbGFjZVNoaXAoWzcsIDNdLCAzLCAnaG9yaXpvbnRhbCcpO1xuICAgIC8vIHBsYXllcjEucGxhY2VTaGlwKFs4LCA4XSwgMiwgJ2hvcml6b250YWwnKTtcbiAgICAvLyBwbGF5ZXIxLnBsYWNlU2hpcChbMSwgNV0sIDIsICd2ZXJ0aWNhbCcpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcCc7XG5cbmNvbnN0IGNyZWF0ZUdyaWQgPSBmdW5jdGlvbiAobiA9IDEwKSB7XG4gIGNvbnN0IGdyaWQgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xuICAgIGdyaWRbaV0gPSBbXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG47IGogKz0gMSkge1xuICAgICAgZ3JpZFtpXVtqXSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdyaWQ7XG59O1xuXG5jb25zdCBHYW1lYm9hcmQgPSBmdW5jdGlvbiBjcmVhdGVHYW1lYm9hcmQoKSB7XG4gIGxldCBncmlkID0gY3JlYXRlR3JpZCgpO1xuICBjb25zdCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAoc3RhcnQsIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgY29uc3Qgc2hpcE9iaiA9IFNoaXAobGVuZ3RoKTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBPYmoubGVuZ3RoOyBpICs9IDEpIGdyaWRbc3RhcnRbMF1dW3N0YXJ0WzFdICsgaV0gPSBzaGlwT2JqO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBPYmoubGVuZ3RoOyBpICs9IDEpIGdyaWRbc3RhcnRbMF0gKyBpXVtzdGFydFsxXV0gPSBzaGlwT2JqO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXBSYW5kb20gPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgbGV0IHg7XG4gICAgbGV0IHk7XG4gICAgbGV0IGlzRW1wdHkgPSBmYWxzZTtcbiAgICBsZXQgZGlyZWN0aW9uO1xuICAgIGNvbnN0IG51bSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XG4gICAgaWYgKG51bSA9PT0gMCkge1xuICAgICAgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICAgIH1cbiAgICB3aGlsZSAoaXNFbXB0eSA9PT0gZmFsc2UpIHtcbiAgICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuXG4gICAgICBpc0VtcHR5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICAgICAgY29uc3Qgc3Vycm91bmRpbmdBcnJheSA9IFtdO1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyAmJiB4ICsgbGVuZ3RoID4gZ3JpZC5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJyAmJiB5ICsgbGVuZ3RoID49IGdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJyYXkucHVzaChncmlkW3hdW3ldKTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgYXJyYXkucHVzaChncmlkW3ggKyBpXVt5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2goZ3JpZFt4XVt5ICsgaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAtMTsgaSA8PSBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIGNvbnN0IHgxID0geCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAwKTtcbiAgICAgICAgICBjb25zdCB5MSA9IHkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAwIDogaSk7XG4gICAgICAgICAgY29uc3QgeDIgPSB4ICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaSA6IC0xKTtcbiAgICAgICAgICBjb25zdCB5MiA9IHkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAtMSA6IGkpO1xuICAgICAgICAgIGNvbnN0IHgzID0geCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAxKTtcbiAgICAgICAgICBjb25zdCB5MyA9IHkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAxIDogaSk7XG5cbiAgICAgICAgICBpZiAoeDEgPj0gMCAmJiB4MSA8IGdyaWQubGVuZ3RoICYmIHkxID49IDAgJiYgeTEgPCBncmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKGdyaWRbeDFdW3kxXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh4MiA+PSAwICYmIHgyIDwgZ3JpZC5sZW5ndGggJiYgeTIgPj0gMCAmJiB5MiA8IGdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2goZ3JpZFt4Ml1beTJdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHgzID49IDAgJiYgeDMgPCBncmlkLmxlbmd0aCAmJiB5MyA+PSAwICYmIHkzIDwgZ3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChncmlkW3gzXVt5M10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVtcHR5ID0gYXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG4gICAgICAgIGNvbnN0IHN1cnJvdW5kaW5nRW1wdHkgPSBzdXJyb3VuZGluZ0FycmF5LmV2ZXJ5KHNxdWFyZSA9PiBzcXVhcmUgPT09IG51bGwpO1xuXG4gICAgICAgIHJldHVybiBlbXB0eSAmJiBzdXJyb3VuZGluZ0VtcHR5O1xuICAgICAgfSkoKTtcbiAgICB9XG4gICAgY29uc3Qgc2hpcE9iaiA9IFNoaXAobGVuZ3RoKTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBPYmoubGVuZ3RoOyBpICs9IDEpIGdyaWRbeF1beSArIGldID0gc2hpcE9iajtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwT2JqLmxlbmd0aDsgaSArPSAxKSBncmlkW3ggKyBpXVt5XSA9IHNoaXBPYmo7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGVtcHR5R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBncmlkID0gY3JlYXRlR3JpZCgpO1xuICB9XG5cbiAgY29uc3QgcmVjZWl2ZUhpdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgY29uc3QgdmFsdWUgPSBncmlkW3hdW3ldO1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgZ3JpZFt4XVt5XSA9ICd3YXRlcic7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhbHVlLmFkZEhpdCgpO1xuICAgIGdyaWRbeF1beV0gPSBbJ2hpdCcsIHZhbHVlXTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgY29uc3QgYWxsU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGlmIChzbG90ICE9PSBudWxsICYmIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShzbG90KSkgcmVzdWx0ID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIGNvbnN0IGNvdW50Qm9hdHNBbGl2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBib2F0cyA9IFtdO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHNsb3QgIT09IG51bGwgJiZcbiAgICAgICAgICB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAhQXJyYXkuaXNBcnJheShzbG90KSAmJlxuICAgICAgICAgICFib2F0cy5pbmNsdWRlcyhzbG90KVxuICAgICAgICApIHtcbiAgICAgICAgICBib2F0cy5wdXNoKHNsb3QpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYm9hdHMubGVuZ3RoO1xuICB9O1xuXG4gIGNvbnN0IGdldEdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdyaWQ7XG4gIH07XG4gIHJldHVybiB7IGdldEdyaWQsIGVtcHR5R3JpZCwgcGxhY2VTaGlwLCBwbGFjZVNoaXBSYW5kb20sIHJlY2VpdmVIaXQsIGFsbFN1bmssIGNvdW50Qm9hdHNBbGl2ZSB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tICcuL2dhbWVib2FyZCc7XG5cbmNvbnN0IFBsYXllciA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gR2FtZWJvYXJkKCk7XG5cbiAgY29uc3QgYWxsU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLmFsbFN1bmsoKTtcbiAgfTtcblxuICBjb25zdCB3aW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdJIHdvbic7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gZnVuY3Rpb24gKHN0YXJ0LCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoc3RhcnQsIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXBSYW5kb20gPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgZ2FtZWJvYXJkLnBsYWNlU2hpcFJhbmRvbShsZW5ndGgpO1xuICB9O1xuXG4gIGNvbnN0IGdldEdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5nZXRHcmlkKCk7XG4gIH07XG5cbiAgY29uc3QgZW1wdHlHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgIGdhbWVib2FyZC5lbXB0eUdyaWQoKTtcbiAgfVxuXG4gIGNvbnN0IGNvdW50Qm9hdHNBbGl2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVIaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHJldHVybiBnYW1lYm9hcmQucmVjZWl2ZUhpdCh4LCB5KTtcbiAgfTtcblxuICBjb25zdCBhdHRhY2sgPSBmdW5jdGlvbiAocGxheWVyLCB4LCB5KSB7XG4gICAgY29uc3QgaGl0ID0gcGxheWVyLnJlY2VpdmVIaXQoeCwgeSk7XG4gICAgaWYgKHBsYXllci5hbGxTdW5rKCkpIHtcbiAgICAgIHJldHVybiB3aW4oKTtcbiAgICB9XG4gICAgcmV0dXJuIGhpdDtcbiAgfTtcblxuICBjb25zdCByYW5kb21BdHRhY2sgPSBmdW5jdGlvbiAocGxheWVyKSB7XG4gICAgbGV0IHg7XG4gICAgbGV0IHk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgaWYgKHR5cGVvZiBwbGF5ZXIuZ2V0R3JpZCgpW3hdW3ldID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShwbGF5ZXIuZ2V0R3JpZCgpW3hdW3ldKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGF0dGFjayhwbGF5ZXIsIHgsIHkpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgYWxsU3VuayxcbiAgICBwbGFjZVNoaXAsXG4gICAgZ2V0R3JpZCxcbiAgICByZWNlaXZlSGl0LFxuICAgIGF0dGFjayxcbiAgICB3aW4sXG4gICAgcmFuZG9tQXR0YWNrLFxuICAgIGNvdW50Qm9hdHNBbGl2ZSxcbiAgICBwbGFjZVNoaXBSYW5kb20sXG4gICAgZW1wdHlHcmlkLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY29uc3QgU2hpcCA9IGZ1bmN0aW9uIGNyZWF0ZVNoaXAoc2hpcExlbmd0aCkge1xuICBjb25zdCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xuICBsZXQgaGl0cyA9IDA7XG4gIGNvbnN0IGFkZEhpdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBoaXRzICs9IDE7XG4gICAgcmV0dXJuIGhpdHM7XG4gIH07XG4gIGNvbnN0IGlzU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGl0cyA9PT0gbGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHJldHVybiB7IGxlbmd0aCwgYWRkSGl0LCBpc1N1bmsgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIiosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gfVxcbiBcXG5cXG4qIHtcXG5tYXJnaW46IDA7XFxucGFkZGluZzogMDtcXG59XFxuXFxuXFxuYm9keSB7XFxubGluZS1oZWlnaHQ6IDEuNTtcXG4td2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG5mb250LWZhbWlseTogJ1J1YmlrIEJ1YmJsZXMnLCBDb3VyaWVyLCBtb25vc3BhY2U7XFxufVxcblxcblxcbmltZywgcGljdHVyZSwgdmlkZW8sIGNhbnZhcywgc3ZnIHtcXG5kaXNwbGF5OiBibG9jaztcXG5tYXgtd2lkdGg6IDEwMCU7XFxufVxcblxcblxcbmlucHV0LCBidXR0b24sIHRleHRhcmVhLCBzZWxlY3Qge1xcbmZvbnQ6IGluaGVyaXQ7XFxufVxcblxcblxcbnAsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcbm92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XFxufVxcblxcblxcbmJ1dHRvbiwgYXtcXG5jdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcblxcbmF7XFxuICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5cXG5cXG5cXG4vKiBGb290ZXIgKi9cXG5cXG5cXG5odG1sIHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbnBvc2l0aW9uOiByZWxhdGl2ZTtcXG5taW4taGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5cXG5ib2R5IHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbm1hcmdpbi1ib3R0b206IDQ4cHg7XFxufVxcblxcblxcbi5mb290ZXIge1xcbnBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5ib3R0b206IDA7XFxubGVmdDogMDtcXG5kaXNwbGF5OiBmbGV4O1xcbmFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuanVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuZ2FwOiAxMHB4O1xcbndpZHRoOiAxMDAlO1xcbnBhZGRpbmc6IDEwcHg7XFxuYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMThweDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1YiB7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMjJweDtcXG50cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1Yjpob3ZlciB7XFxudHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKSBzY2FsZSgxLjIpO1xcbn1cXG5cXG4vKiBTdHlsaW5nICovXFxuXFxuOnJvb3R7XFxuIC0taGVhZGVyLWJnOiAjM0QzRDNEO1xcbiAtLW1haW4tYmc6IzMwMzAzMDtcXG4gLS10ZXh0OiNGRkZGRkY7XFxuIC0tZ3JpZC1ib3JkZXJzOiMwMDJDNjY7XFxuIC0tZ3JpZC1zcXVhcmVzOiMyMzg5REE7XFxuIC0tbXktYm9hdHM6IzgwODA4MDtcXG4gLS1teS1ib2F0cy1ib3JkZXI6IzQ2NDY0NjtcXG4gLS1zaGlwLWhpdDojRjgyNzI3O1xcbiAtLXNoaXAtc3VuazojRDE2MDYwO1xcbiAtLWdyZWVuLXRleHQ6IzJCQzU1NztcXG4gLS1yZWQtdGV4dDojRTIzNjM2O1xcbn1cXG5cXG5ib2R5IHtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG5oZWFkZXJ7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGVhZGVyLWJnKTtcXG4gICBmbGV4OiAxO1xcbn1cXG5cXG5oMXtcXG4gICBmb250LXNpemU6IDIuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbn1cXG5cXG5tYWlue1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIGZsZXg6IDc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1dmg7XFxuICAgcGFkZGluZzogNXZoIDBweDtcXG59XFxuXFxuLnR1cm5ze1xcbiAgIHBhZGRpbmc6IDEwcHggMzBweDtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgZm9udC1zaXplOiAycmVtOztcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4udHVybnMucmVkIHtcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbiAgIGJvcmRlcjogMnB4IHJpZGdlIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmdyaWQtY29udGFpbmVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdnc7XFxufVxcblxcbi53cmFwcGVye1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ubnVtYmVyLXdyYXBwZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ueS13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBnYXA6IDVweDtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXN7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIG1pbi1oZWlnaHQ6IDcwdmg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXMgcHtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uZ3JpZCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhc3BlY3QtcmF0aW86IDEvMTtcXG4gICBoZWlnaHQ6IDcwdmg7XFxuICAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tZ3JpZC1ib3JkZXJzKTtcXG4gICBib3JkZXItcmFkaXVzOiA2cHg7XFxufVxcblxcbi54LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IDcwdmg7XFxuICAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi54LWNvb3JkaW5hdGVzIHB7XFxuICAgd2lkdGg6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5saW5le1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICB3aWR0aDogMTAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG59XFxuXFxuLnNxdWFyZXtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMCU7XFxuICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XFxufVxcblxcblxcblxcbiNncmlkMiAuc3F1YXJlLmVtcHR5OmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxMTAsIDgsIDE5NCk7XFxuICAgY3Vyc29yOmNyb3NzaGFpcjtcXG59XFxuXFxuLnNxdWFyZS5zaGlwe1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XFxuXFxuLnNxdWFyZS53YXRlcntcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDJyZW07XFxufVxcblxcbi5zcXVhcmUuaGl0IHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLWhpdCk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgZm9udC13ZWlnaHQ6IDgwMDtcXG59XFxuXFxuLnNxdWFyZS5zdW5rIHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLXN1bmspO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5pbmZve1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mbyAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mby50d297XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmluZm8udHdvIC5zaGlwcy1hbGl2ZXtcXG4gICBib3JkZXItdG9wOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5cXG5cXG5cXG5kaWFsb2d7XFxuICAgdG9wOiA1MCU7XFxuICAgbGVmdDogNTAlO1xcbiAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgIGhlaWdodDogNTB2aDtcXG4gICB3aWR0aDogMTAwdnc7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1iZyk7XFxuICAgb3BhY2l0eTogMC45O1xcbiAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlc21va2U7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuXFxuXFxuLmRpYWxvZy1jb250YWluZXJ7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMDAlO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgIGdhcDogMTB2aDtcXG59XFxuXFxuLndpbm5lcntcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIHBhZGRpbmc6IDIwcHg7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuLndpbm5lci50d297XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbmJ1dHRvbntcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IG5vbmU7XFxuICAgb3V0bGluZTogbm9uZTtcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgIHBhZGRpbmc6IDEwcHg7XFxuICAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIDtcXG59XFxuXFxuYnV0dG9uOmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMge1xcbiAgIHBhZGRpbmc6IDJ2aCAydncgO1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIG9wYWNpdHk6IDAuOTg7XFxuICAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmRpYWxvZy1jb250YWluZXJ7XFxuICAgZ2FwOiAydmg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuZGlhbG9nLWhlYWRlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGdhcDogOHZ3O1xcbn1cXG5cXG5oMntcXG4gICBmb250LXNpemU6IDEuOHJlbTtcXG4gICBmb250LXdlaWdodDogNDAwO1xcbn1cXG5cXG4jZGlyZWN0aW9uIHtcXG4gICBwYWRkaW5nOiA1cHg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAud3JhcHBlciB7XFxuICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICBnYXA6IDV2dztcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXRzLWRyYWcge1xcbiAgIHdpZHRoOiAyMHY7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGdhcDogM3ZoO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXRzLWRyYWcudmVydGljYWwge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgZ2FwOiAzdnc7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdC13cmFwcGVyIHtcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0IHtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiBmaXQtY29udGVudDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0LnZlcnRpY2FsIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXG59XFxuXFxuLmJvYXQgLmJvYXQtc3F1YXJlIHtcXG4gICBmbGV4OiBub25lO1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXktYm9hdHMpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgYm9yZGVyLXJhZGl1czogOHB4O1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0Usc0JBQXNCO0NBQ3ZCOzs7QUFHRDtBQUNBLFNBQVM7QUFDVCxVQUFVO0FBQ1Y7OztBQUdBO0FBQ0EsZ0JBQWdCO0FBQ2hCLG1DQUFtQztBQUNuQyxnREFBZ0Q7QUFDaEQ7OztBQUdBO0FBQ0EsY0FBYztBQUNkLGVBQWU7QUFDZjs7O0FBR0E7QUFDQSxhQUFhO0FBQ2I7OztBQUdBO0FBQ0EseUJBQXlCO0FBQ3pCOzs7QUFHQTtBQUNBLGVBQWU7QUFDZjs7O0FBR0E7R0FDRyxxQkFBcUI7QUFDeEI7Ozs7O0FBS0EsV0FBVzs7O0FBR1g7QUFDQSxtQkFBbUI7QUFDbkIsa0JBQWtCO0FBQ2xCLGdCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQSxtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25COzs7QUFHQTtBQUNBLGtCQUFrQjtBQUNsQixTQUFTO0FBQ1QsT0FBTztBQUNQLGFBQWE7QUFDYixtQkFBbUI7QUFDbkIsdUJBQXVCO0FBQ3ZCLFNBQVM7QUFDVCxXQUFXO0FBQ1gsYUFBYTtBQUNiLHVCQUF1QjtBQUN2QixZQUFZO0FBQ1osZUFBZTtBQUNmOzs7QUFHQTtBQUNBLFlBQVk7QUFDWixlQUFlO0FBQ2Ysc0NBQXNDO0FBQ3RDOzs7QUFHQTtBQUNBLG9DQUFvQztBQUNwQzs7QUFFQSxZQUFZOztBQUVaO0NB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ZUFBZTtHQUNmLHdCQUF3QjtHQUN4QixhQUFhO0dBQ2IsbUNBQW1DO0dBQ25DLG1CQUFtQjtBQUN0Qjs7QUFFQTtHQUNHLHNCQUFzQjtHQUN0QixpQ0FBaUM7QUFDcEM7O0FBRUE7R0FDRyxpQkFBaUI7R0FDakIsa0JBQWtCO0dBQ2xCLHFDQUFxQztHQUNyQyxZQUFZO0dBQ1osYUFBYTtHQUNiLG1CQUFtQjtHQUNuQixhQUFhO0dBQ2Isc0JBQXNCO0FBQ3pCOztBQUVBO0dBQ0csNkJBQTZCO0dBQzdCLDBCQUEwQjtBQUM3Qjs7O0FBR0E7R0FDRyxpQkFBaUI7R0FDakIsaUJBQWlCO0dBQ2pCLGFBQWE7R0FDYixZQUFZO0FBQ2Y7O0FBRUE7R0FDRyxRQUFRO0FBQ1g7O0FBRUE7R0FDRyxhQUFhO0dBQ2IsUUFBUTtBQUNYOztBQUVBO0dBQ0csaUJBQWlCO0dBQ2pCLGdCQUFnQjtBQUNuQjs7QUFFQTtHQUNHLFlBQVk7QUFDZjs7QUFFQTtHQUNHLG1CQUFtQjtHQUNuQixRQUFRO0dBQ1IsbUJBQW1CO0FBQ3RCOzs7QUFHQTtHQUNHLFVBQVU7R0FDVixhQUFhO0dBQ2Isc0JBQXNCO0dBQ3RCLFFBQVE7QUFDWDs7QUFFQTtHQUNHLG1CQUFtQjtHQUNuQixRQUFRO0FBQ1g7O0FBRUE7R0FDRyxZQUFZO0dBQ1osc0JBQXNCO0FBQ3pCOztBQUVBO0dBQ0csYUFBYTtHQUNiLGtCQUFrQjtBQUNyQjs7QUFFQTtHQUNHLHNCQUFzQjtHQUN0QixrQkFBa0I7QUFDckI7O0FBRUE7R0FDRyxVQUFVO0dBQ1YsVUFBVTtHQUNWLFdBQVc7R0FDWCxpQ0FBaUM7R0FDakMsd0NBQXdDO0dBQ3hDLGtCQUFrQjtBQUNyQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuIH1cXG4gXFxuXFxuKiB7XFxubWFyZ2luOiAwO1xcbnBhZGRpbmc6IDA7XFxufVxcblxcblxcbmJvZHkge1xcbmxpbmUtaGVpZ2h0OiAxLjU7XFxuLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxuZm9udC1mYW1pbHk6ICdSdWJpayBCdWJibGVzJywgQ291cmllciwgbW9ub3NwYWNlO1xcbn1cXG5cXG5cXG5pbWcsIHBpY3R1cmUsIHZpZGVvLCBjYW52YXMsIHN2ZyB7XFxuZGlzcGxheTogYmxvY2s7XFxubWF4LXdpZHRoOiAxMDAlO1xcbn1cXG5cXG5cXG5pbnB1dCwgYnV0dG9uLCB0ZXh0YXJlYSwgc2VsZWN0IHtcXG5mb250OiBpbmhlcml0O1xcbn1cXG5cXG5cXG5wLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXG5vdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xcbn1cXG5cXG5cXG5idXR0b24sIGF7XFxuY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5cXG5he1xcbiAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuXFxuXFxuXFxuLyogRm9vdGVyICovXFxuXFxuXFxuaHRtbCB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5wb3NpdGlvbjogcmVsYXRpdmU7XFxubWluLWhlaWdodDogMTAwJTtcXG59XFxuXFxuXFxuYm9keSB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5tYXJnaW4tYm90dG9tOiA0OHB4O1xcbn1cXG5cXG5cXG4uZm9vdGVyIHtcXG5wb3NpdGlvbjogYWJzb2x1dGU7XFxuYm90dG9tOiAwO1xcbmxlZnQ6IDA7XFxuZGlzcGxheTogZmxleDtcXG5hbGlnbi1pdGVtczogY2VudGVyO1xcbmp1c3RpZnktY29udGVudDogY2VudGVyO1xcbmdhcDogMTBweDtcXG53aWR0aDogMTAwJTtcXG5wYWRkaW5nOiAxMHB4O1xcbmJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDE4cHg7XFxufVxcblxcblxcbi5mYS1naXRodWIge1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDIycHg7XFxudHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxufVxcblxcblxcbi5mYS1naXRodWI6aG92ZXIge1xcbnRyYW5zZm9ybTogcm90YXRlKDM2MGRlZykgc2NhbGUoMS4yKTtcXG59XFxuXFxuLyogU3R5bGluZyAqL1xcblxcbjpyb290e1xcbiAtLWhlYWRlci1iZzogIzNEM0QzRDtcXG4gLS1tYWluLWJnOiMzMDMwMzA7XFxuIC0tdGV4dDojRkZGRkZGO1xcbiAtLWdyaWQtYm9yZGVyczojMDAyQzY2O1xcbiAtLWdyaWQtc3F1YXJlczojMjM4OURBO1xcbiAtLW15LWJvYXRzOiM4MDgwODA7XFxuIC0tbXktYm9hdHMtYm9yZGVyOiM0NjQ2NDY7XFxuIC0tc2hpcC1oaXQ6I0Y4MjcyNztcXG4gLS1zaGlwLXN1bms6I0QxNjA2MDtcXG4gLS1ncmVlbi10ZXh0OiMyQkM1NTc7XFxuIC0tcmVkLXRleHQ6I0UyMzYzNjtcXG59XFxuXFxuYm9keSB7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuaGVhZGVye1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhlYWRlci1iZyk7XFxuICAgZmxleDogMTtcXG59XFxuXFxuaDF7XFxuICAgZm9udC1zaXplOiAyLjVyZW07XFxuICAgZm9udC13ZWlnaHQ6IDUwMDtcXG59XFxuXFxubWFpbntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWJnKTtcXG4gICBmbGV4OiA3O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGdhcDogNXZoO1xcbiAgIHBhZGRpbmc6IDV2aCAwcHg7XFxufVxcblxcbi50dXJuc3tcXG4gICBwYWRkaW5nOiAxMHB4IDMwcHg7XFxuICAgYm9yZGVyOiAycHggcmlkZ2UgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogMnJlbTs7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnR1cm5zLnJlZCB7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5ncmlkLWNvbnRhaW5lcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgZ2FwOiAxMHZ3O1xcbn1cXG5cXG4ud3JhcHBlcntcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLm51bWJlci13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnktd3JhcHBlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1cHg7XFxufVxcblxcbi55LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBtaW4taGVpZ2h0OiA3MHZoO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi55LWNvb3JkaW5hdGVzIHB7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmdyaWQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYXNwZWN0LXJhdGlvOiAxLzE7XFxuICAgaGVpZ2h0OiA3MHZoO1xcbiAgIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgYm9yZGVyLXJhZGl1czogNnB4O1xcbn1cXG5cXG4ueC1jb29yZGluYXRlc3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiA3MHZoO1xcbiAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4ueC1jb29yZGluYXRlcyBwe1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ubGluZXtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgd2lkdGg6IDEwJTtcXG4gICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbi5zcXVhcmV7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1ncmlkLWJvcmRlcnMpO1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAlO1xcbiAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xcbn1cXG5cXG5cXG5cXG4jZ3JpZDIgLnNxdWFyZS5lbXB0eTpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTEwLCA4LCAxOTQpO1xcbiAgIGN1cnNvcjpjcm9zc2hhaXI7XFxufVxcblxcbi5zcXVhcmUuc2hpcHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcblxcbi5zcXVhcmUud2F0ZXJ7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAycmVtO1xcbn1cXG5cXG4uc3F1YXJlLmhpdCB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1oaXQpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5zcXVhcmUuc3VuayB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1zdW5rKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBmb250LXdlaWdodDogODAwO1xcbn1cXG5cXG4uaW5mb3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8gLnNoaXBzLWFsaXZle1xcbiAgIGJvcmRlci10b3A6IDJweCBzb2xpZCB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8udHdve1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5pbmZvLnR3byAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuXFxuXFxuXFxuZGlhbG9ne1xcbiAgIHRvcDogNTAlO1xcbiAgIGxlZnQ6IDUwJTtcXG4gICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gICBoZWlnaHQ6IDUwdmg7XFxuICAgd2lkdGg6IDEwMHZ3O1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIG9wYWNpdHk6IDAuOTtcXG4gICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZXNtb2tlO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcblxcblxcbi5kaWFsb2ctY29udGFpbmVye1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdmg7XFxufVxcblxcbi53aW5uZXJ7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBwYWRkaW5nOiAyMHB4O1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcbi53aW5uZXIudHdve1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5idXR0b257XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxuICAgYm9yZGVyOiBub25lO1xcbiAgIG91dGxpbmU6IG5vbmU7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICBwYWRkaW5nOiAxMHB4O1xcbiAgIHRyYW5zaXRpb246IDAuM3MgZWFzZSA7XFxufVxcblxcbmJ1dHRvbjpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG59XFxuXFxuXFxuLnBsYWNlLXNoaXBzIHtcXG4gICBwYWRkaW5nOiAydmggMnZ3IDtcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICBvcGFjaXR5OiAwLjk4O1xcbiAgIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5kaWFsb2ctY29udGFpbmVye1xcbiAgIGdhcDogMnZoO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmRpYWxvZy1oZWFkZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBnYXA6IDh2dztcXG59XFxuXFxuaDJ7XFxuICAgZm9udC1zaXplOiAxLjhyZW07XFxuICAgZm9udC13ZWlnaHQ6IDQwMDtcXG59XFxuXFxuI2RpcmVjdGlvbiB7XFxuICAgcGFkZGluZzogNXB4O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLndyYXBwZXIge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgZ2FwOiA1dnc7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0cy1kcmFnIHtcXG4gICB3aWR0aDogMjB2O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBnYXA6IDN2aDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0cy1kcmFnLnZlcnRpY2FsIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgIGdhcDogM3Z3O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQtd3JhcHBlciB7XFxuICAgZGlzcGxheTpmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICB3aWR0aDogZml0LWNvbnRlbnQ7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdC52ZXJ0aWNhbCB7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxufVxcblxcbi5ib2F0IC5ib2F0LXNxdWFyZSB7XFxuICAgZmxleDogbm9uZTtcXG4gICB3aWR0aDogN3ZoO1xcbiAgIGhlaWdodDogN3ZoO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCAnLi9zdHlsZS5jc3MnO1xuaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmdhbWUuc3RhcnRHYW1lKCk7XG5cbi8vIGNvbnN0IHBsYXllcjEgPSBQbGF5ZXIoKTtcbi8vIGNvbnN0IHBsYXllcjIgPSBQbGF5ZXIoKTtcbi8vIHBsYXllcjEucGxhY2VTaGlwKFsxLCAzXSwgNCwgJ2hvcml6b250YWwnKTtcbi8vIHBsYXllcjEucGxhY2VTaGlwKFs3LCAzXSwgMywgJ2hvcml6b250YWwnKTtcbi8vIHBsYXllcjEucGxhY2VTaGlwKFs4LCA4XSwgMiwgJ2hvcml6b250YWwnKTtcbi8vIHBsYXllcjEucGxhY2VTaGlwKFsxLCA1XSwgMiwgJ3ZlcnRpY2FsJyk7XG4vLyBwbGF5ZXIyLmF0dGFjayhwbGF5ZXIxLCAxLCA1KTtcbi8vIHBsYXllcjIuYXR0YWNrKHBsYXllcjEsIDEsIDYpO1xuLy8gcGxheWVyMi5hdHRhY2socGxheWVyMSwgMSwgMyk7XG4vLyBwbGF5ZXIyLmF0dGFjayhwbGF5ZXIxLCA5LCA5KTtcblxuLy8gcGxheWVyMi5wbGFjZVNoaXAoWzEsIDNdLCA0LCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMi5wbGFjZVNoaXAoWzcsIDNdLCAzLCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMi5wbGFjZVNoaXAoWzgsIDhdLCAyLCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMi5wbGFjZVNoaXAoWzEsIDVdLCAyLCAndmVydGljYWwnKTtcbi8vIHBsYXllcjEuYXR0YWNrKHBsYXllcjIsIDEsIDUpO1xuLy8gcGxheWVyMS5hdHRhY2socGxheWVyMiwgMSwgNik7XG4vLyBwbGF5ZXIxLmF0dGFjayhwbGF5ZXIyLCAxLCAzKTtcbi8vIHBsYXllcjEuYXR0YWNrKHBsYXllcjIsIDksIDkpO1xuXG4vLyBkb20ucG9wdWxhdGVFbmVteUdyaWQocGxheWVyMSwgcGxheWVyMik7XG5cbi8vIGRvbS5wb3B1bGF0ZUdyaWQocGxheWVyMS5nZXRHcmlkKCkpO1xuLy8gbGV0IGZpbmlzaCA9IGZhbHNlO1xuLy8gd2hpbGUgKGZpbmlzaCA9PT0gZmFsc2UpIHtcbi8vICAgZmluaXNoID0gZG9tLmxpc3RlbkZvckNsaWNrKHBsYXllcjEsIHBsYXllcjIpO1xuLy8gfVxuXG4vLyBnYW1lYm9hcmQucmVjZWl2ZUhpdCgxLCAzKTtcbi8vIGdhbWVib2FyZC5yZWNlaXZlSGl0KDIsIDMpO1xuLy8gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoMywgMyk7XG4vLyBjb25zb2xlLmxvZyhnYW1lYm9hcmQuYWxsU3VuaygpKTtcbi8vIGNvbnN0IHNoaXAxID0gU2hpcCgzKTtcbi8vIGNvbnNvbGUubG9nKHNoaXAxLmFkZEhpdCgpKTtcblxuLy8gY29uc29sZS5sb2coZ2FtZWJvYXJkLmdyaWRbMV1bM10pO1xuLy8gY29uc29sZS5sb2coc2hpcDEpO1xuLy8gY29uc29sZS5sb2coZ2FtZWJvYXJkLmdyaWRbMV1bM10gPT09IHNoaXAxKTtcbi8vIGdhbWVib2FyZC5yZWNlaXZlSGl0KDEsIDMpO1xuIl0sIm5hbWVzIjpbImdhbWUiLCJkb20iLCJkaXJlY3Rpb24iLCJwb3B1bGF0ZUdyaWQiLCJncmlkIiwic3RhcnQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJncmlkQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiaW5uZXJIVE1MIiwiZm9yRWFjaCIsImxpbmUiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwic2xvdCIsInNxdWFyZSIsIkFycmF5IiwiaXNBcnJheSIsInN1bmsiLCJpc1N1bmsiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicG9wdWxhdGVFbmVteUdyaWQiLCJwbGF5ZXIxIiwicGxheWVyMiIsImdldEdyaWQiLCJhZGRFdmVudExpc3RlbmVyIiwic3F1YXJlQ2xpY2tlZCIsImV2ZW50IiwiZW5lbXlHcmlkIiwiY29sdW1uIiwiY3VycmVudFRhcmdldCIsInBhcmVudE5vZGUiLCJjbGlja2VkU3F1YXJlIiwiaW5kZXhZIiwicHJvdG90eXBlIiwiaW5kZXhPZiIsImNhbGwiLCJjaGlsZHJlbiIsImluZGV4WCIsImhpdCIsImF0dGFjayIsInVwZGF0ZUJvYXRzQWxpdmUiLCJhbGxTdW5rIiwicGxheWVyV29uIiwidG9nZ2xlVHVybiIsImRlbGF5IiwicmFuZG9tQXR0YWNrIiwibXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJwbGF5ZXIiLCJkaWFsb2dXaW4iLCJzaG93TW9kYWwiLCJyZXN0YXJ0Iiwic3RhcnRHYW1lIiwiY2xvc2UiLCJ0dXJucyIsIndpbm5lciIsImNsYXNzTGlzdCIsImFkZCIsImRpdlR1cm5zIiwiY3VycmVudFR1cm4iLCJzdWJzdHJpbmciLCJwbGF5ZXJOdW0iLCJwYXJhIiwiYm9hdHNBbGl2ZSIsImNvdW50Qm9hdHNBbGl2ZSIsImRyYWdBbmREcm9wIiwiYm9hdHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwib25EcmFnIiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJpZCIsImJvYXQiLCJkcmFnZ2FibGUiLCJzdHlsZSIsIm9wYWNpdHkiLCJncmlkTGlzdGVuZXJzIiwic3F1YXJlcyIsIm9uRHJvcCIsInByZXZlbnREZWZhdWx0IiwianNvbiIsImdldERhdGEiLCJvYmplY3QiLCJwYXJzZSIsInBsYXllckdyaWQiLCJpc0VtcHR5IiwiYXJyYXkiLCJzdXJyb3VuZGluZ0FycmF5IiwicHVzaCIsImkiLCJ4MSIsInkxIiwieDIiLCJ5MiIsIngzIiwieTMiLCJlbXB0eSIsImV2ZXJ5Iiwic3Vycm91bmRpbmdFbXB0eSIsInBsYWNlU2hpcCIsImRyYWdnZWRCb2F0IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic2hvd1N0YXJ0aW5nRGlhbG9nIiwiZGlhbG9nUGxhY2UiLCJhZGRFdmVudExpc3RlbmVycyIsIm9sZFN0YXJ0QnV0dG9uIiwic3RhcnRCdXR0b24iLCJjbG9uZU5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJjYW5TdGFydCIsIm9sZENoRGlyZWN0aW9uIiwiY2hEaXJlY3Rpb24iLCJib2F0RHJhZyIsInJlbW92ZSIsIm9sZFJhbmRvbSIsInJhbmRvbSIsImVtcHR5R3JpZCIsInBsYWNlU2hpcFJhbmRvbSIsIm9sZEJvYXQiLCJuZXdCb2F0IiwiUGxheWVyIiwiU2hpcCIsImNyZWF0ZUdyaWQiLCJuIiwiaiIsIkdhbWVib2FyZCIsImNyZWF0ZUdhbWVib2FyZCIsInNoaXBPYmoiLCJ4IiwieSIsIm51bSIsIk1hdGgiLCJyb3VuZCIsImZsb29yIiwicmVjZWl2ZUhpdCIsInZhbHVlIiwiYWRkSGl0IiwicmVzdWx0IiwiaW5jbHVkZXMiLCJnYW1lYm9hcmQiLCJ3aW4iLCJjcmVhdGVTaGlwIiwic2hpcExlbmd0aCIsImhpdHMiXSwic291cmNlUm9vdCI6IiJ9