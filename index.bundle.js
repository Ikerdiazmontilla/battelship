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
    const dialog = document.querySelector('.win');
    dialog.showModal();
    const restart = dialog.querySelector('.restart');
    restart.addEventListener('click', _game__WEBPACK_IMPORTED_MODULE_0__["default"].startGame());
    restart.addEventListener('click', () => {
      dialog.close();
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
    const dialog = document.querySelector('.place-ships');
    dialog.showModal();
    dom.dragAndDrop(player1);
    const startButton = document.querySelector('.place-ships .restart');
    startButton.addEventListener('click', () => {
      dialog.close();
      dom.populateGrid(player1.getGrid());
      dom.populateEnemyGrid(player1, player2);
    });
    const chDirection = document.querySelector('#direction');
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
    // const player1 = Player();
    // const player2 = Player();
    // dom.populateGrid(player1.getGrid(), true);
    // const dialog = document.querySelector('.place-ships');
    // dialog.showModal();
    // player1.placeShip([1, 3], 4, 'horizontal');
    // player1.placeShip([7, 3], 3, 'horizontal');
    // player1.placeShip([8, 8], 2, 'horizontal');
    // player1.placeShip([1, 5], 2, 'vertical');
    // player2.placeShip([1, 3], 5, 'horizontal');
    // player2.placeShip([7, 3], 4, 'horizontal');
    // player2.placeShip([8, 8], 3, 'horizontal');
    // player2.placeShip([1, 5], 3, 'vertical');
    // player2.placeShip([2, 4], 2, 'horizontal');
  },
  placeStuff() {
    const player1 = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])();
    const player2 = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])();
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].showStartingDialog(player1, player2);
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
  const grid = createGrid();
  const placeShip = function (start, length, direction) {
    const shipObj = (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(length);
    if (direction === 'vertical') {
      for (let i = 0; i < shipObj.length; i += 1) grid[start[0]][start[1] + i] = shipObj;
    } else {
      for (let i = 0; i < shipObj.length; i += 1) grid[start[0] + i][start[1]] = shipObj;
    }
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
    placeShip,
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
  const getGrid = function () {
    return gameboard.getGrid();
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
    countBoatsAlive
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




_game__WEBPACK_IMPORTED_MODULE_3__["default"].placeStuff();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7OztBQ0FxQjtBQUNHO0FBQ007QUFDSjtBQUUxQnhILDZDQUFJLENBQUN1SCxVQUFVLENBQUMsQ0FBQzs7QUFHakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QiIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmNvbnN0IGRvbSA9IHtcbiAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gIHBvcHVsYXRlR3JpZChncmlkLCBzdGFydCA9IGZhbHNlKSB7XG4gICAgbGV0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDEnKTtcbiAgICBpZiAoc3RhcnQgPT09IHRydWUpIHtcbiAgICAgIGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZC1wbGFjZScpO1xuICAgIH1cbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmNsYXNzTmFtZSA9ICdsaW5lJztcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGlmIChzbG90ID09PSBudWxsKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgZW1wdHknO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc2xvdCkpIHtcbiAgICAgICAgICBjb25zdCBzdW5rID0gc2xvdFsxXS5pc1N1bmsoKTtcbiAgICAgICAgICBpZiAoc3VuayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGhpdCc7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdW5rID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzdW5rJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzaGlwJztcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSAnd2F0ZXInKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgd2F0ZXInO1xuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgICAgfSk7XG4gICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gICAgfSk7XG4gIH0sXG4gIHBvcHVsYXRlRW5lbXlHcmlkKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICB0aGlzLnBsYXllcjEgPSBwbGF5ZXIxO1xuICAgIHRoaXMucGxheWVyMiA9IHBsYXllcjI7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMicpO1xuICAgIGNvbnN0IGdyaWQgPSB0aGlzLnBsYXllcjIuZ2V0R3JpZCgpO1xuICAgIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gJ2xpbmUnO1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2xvdCkpIHtcbiAgICAgICAgICBjb25zdCBzdW5rID0gc2xvdFsxXS5pc1N1bmsoKTtcbiAgICAgICAgICBpZiAoc3VuayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIGhpdCc7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdW5rID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBzdW5rJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xvdCA9PT0gbnVsbCB8fCAoc2xvdCAhPT0gbnVsbCAmJiB0eXBlb2Ygc2xvdCA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgZW1wdHknO1xuICAgICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRvbS5zcXVhcmVDbGlja2VkKTtcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSAnd2F0ZXInKSB7XG4gICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgd2F0ZXInO1xuICAgICAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9ICfinJgnO1xuICAgICAgICB9XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgICAgfSk7XG4gICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gICAgfSk7XG4gIH0sXG4gIHNxdWFyZUNsaWNrZWQ6IGFzeW5jIGV2ZW50ID0+IHtcbiAgICBjb25zdCBlbmVteUdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZDInKTtcbiAgICBjb25zdCBjb2x1bW4gPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgY29uc3QgY2xpY2tlZFNxdWFyZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgY29uc3QgaW5kZXhZID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb2x1bW4uY2hpbGRyZW4sIGNsaWNrZWRTcXVhcmUpO1xuICAgIGNvbnN0IGluZGV4WCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZW5lbXlHcmlkLmNoaWxkcmVuLCBjb2x1bW4pO1xuICAgIGxldCBoaXQgPSBkb20ucGxheWVyMS5hdHRhY2soZG9tLnBsYXllcjIsIGluZGV4WCwgaW5kZXhZKTtcbiAgICBkb20ucG9wdWxhdGVFbmVteUdyaWQoZG9tLnBsYXllcjEsIGRvbS5wbGF5ZXIyKTtcbiAgICBkb20udXBkYXRlQm9hdHNBbGl2ZSgyKTtcbiAgICBpZiAoZG9tLnBsYXllcjIuYWxsU3VuaygpICE9PSBmYWxzZSkgcmV0dXJuIGRvbS5wbGF5ZXJXb24oMSk7XG4gICAgaWYgKGhpdCA9PT0gZmFsc2UpIHtcbiAgICAgIGRvbS50b2dnbGVUdXJuKCk7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBhd2FpdCBkb20uZGVsYXkoNTAwKTtcbiAgICAgICAgaGl0ID0gZG9tLnBsYXllcjIucmFuZG9tQXR0YWNrKGRvbS5wbGF5ZXIxKTtcbiAgICAgICAgZG9tLnBvcHVsYXRlR3JpZChkb20ucGxheWVyMS5nZXRHcmlkKCkpO1xuICAgICAgICBkb20udXBkYXRlQm9hdHNBbGl2ZSgxKTtcbiAgICAgICAgaWYgKGRvbS5wbGF5ZXIxLmFsbFN1bmsoKSAhPT0gZmFsc2UpIHJldHVybiBkb20ucGxheWVyV29uKDIpO1xuICAgICAgICBpZiAoaGl0ID09PSBmYWxzZSkge1xuICAgICAgICAgIGRvbS50b2dnbGVUdXJuKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBkZWxheShtcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbiAgfSxcbiAgcGxheWVyV29uKHBsYXllcikge1xuICAgIGNvbnN0IGRpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW4nKTtcbiAgICBkaWFsb2cuc2hvd01vZGFsKCk7XG4gICAgY29uc3QgcmVzdGFydCA9IGRpYWxvZy5xdWVyeVNlbGVjdG9yKCcucmVzdGFydCcpO1xuICAgIHJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnN0YXJ0R2FtZSgpKTtcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgfSk7XG4gICAgY29uc3QgdHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICB0dXJucy50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXJ9IHdvbiEhIWA7XG4gICAgY29uc3Qgd2lubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lcicpO1xuICAgIHdpbm5lci50ZXh0Q29udGVudCA9IGBQbGF5ZXIgJHtwbGF5ZXJ9IHdvbiEhIWA7XG4gICAgd2lubmVyLmNsYXNzTmFtZSA9ICd3aW5uZXInO1xuICAgIGlmIChwbGF5ZXIgPT09IDIpIHtcbiAgICAgIHdpbm5lci5jbGFzc0xpc3QuYWRkKCd0d28nKTtcbiAgICB9XG4gIH0sXG4gIHRvZ2dsZVR1cm4oKSB7XG4gICAgY29uc3QgZGl2VHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHVybnMnKTtcbiAgICBjb25zdCBjdXJyZW50VHVybiA9IGRpdlR1cm5zLnRleHRDb250ZW50LnN1YnN0cmluZyg3LCA4KTtcbiAgICBpZiAoY3VycmVudFR1cm4gPT09ICcxJykge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDIgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMgcmVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgZGl2VHVybnMudGV4dENvbnRlbnQgPSAnUGxheWVyIDEgdHVybic7XG4gICAgICBkaXZUdXJucy5jbGFzc05hbWUgPSAndHVybnMnO1xuICAgIH1cbiAgfSxcbiAgdXBkYXRlQm9hdHNBbGl2ZShwbGF5ZXJOdW0pIHtcbiAgICBsZXQgcGFyYTtcbiAgICBsZXQgYm9hdHNBbGl2ZTtcbiAgICBpZiAocGxheWVyTnVtID09PSAxKSB7XG4gICAgICBwYXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLm9uZScpO1xuICAgICAgYm9hdHNBbGl2ZSA9IGRvbS5wbGF5ZXIxLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXBzLWFsaXZlLnR3bycpO1xuICAgICAgYm9hdHNBbGl2ZSA9IGRvbS5wbGF5ZXIyLmNvdW50Qm9hdHNBbGl2ZSgpO1xuICAgIH1cbiAgICBwYXJhLnRleHRDb250ZW50ID0gYEFsaXZlIHNoaXBzICR7Ym9hdHNBbGl2ZX1gO1xuICB9LFxuICBkcmFnQW5kRHJvcChwbGF5ZXIpIHtcbiAgICBjb25zdCBib2F0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2F0Jyk7XG4gICAgY29uc3Qgb25EcmFnID0gZXZlbnQgPT4ge1xuICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsZW5ndGg6IGV2ZW50LmN1cnJlbnRUYXJnZXQuY2hpbGRyZW4ubGVuZ3RoLCBpZDogZXZlbnQuY3VycmVudFRhcmdldC5pZCB9KVxuICAgICAgKTtcbiAgICB9O1xuICAgIGJvYXRzLmZvckVhY2goYm9hdCA9PiB7XG4gICAgICBib2F0LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIG9uRHJhZyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBncmlkTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNncmlkLXBsYWNlIC5zcXVhcmUuZW1wdHknKTtcbiAgICAgIGNvbnN0IG9uRHJvcCA9IGV2ZW50ID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QganNvbiA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIGNvbnN0IG9iamVjdCA9IEpTT04ucGFyc2UoanNvbik7XG4gICAgICAgIGNvbnN0IHsgbGVuZ3RoIH0gPSBvYmplY3Q7XG4gICAgICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZC1wbGFjZScpO1xuICAgICAgICBjb25zdCBjb2x1bW4gPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgIGNvbnN0IGNsaWNrZWRTcXVhcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBjb25zdCBpbmRleFkgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGNvbHVtbi5jaGlsZHJlbiwgY2xpY2tlZFNxdWFyZSk7XG4gICAgICAgIGNvbnN0IGluZGV4WCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZ3JpZC5jaGlsZHJlbiwgY29sdW1uKTtcbiAgICAgICAgY29uc3QgeyBkaXJlY3Rpb24gfSA9IGRvbTtcbiAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IHBsYXllci5nZXRHcmlkKCk7XG4gICAgICAgIGNvbnN0IGlzRW1wdHkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgICAgICAgY29uc3Qgc3Vycm91bmRpbmdBcnJheSA9IFtdO1xuXG4gICAgICAgICAgYXJyYXkucHVzaChwbGF5ZXJHcmlkW2luZGV4WF1baW5kZXhZXSk7XG4gICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgIGFycmF5LnB1c2gocGxheWVyR3JpZFtpbmRleFggKyBpXVtpbmRleFldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICBhcnJheS5wdXNoKHBsYXllckdyaWRbaW5kZXhYXVtpbmRleFkgKyBpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IC0xOyBpIDw9IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCB4MSA9IGluZGV4WCArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IGkgOiAwKTtcbiAgICAgICAgICAgIGNvbnN0IHkxID0gaW5kZXhZICsgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gMCA6IGkpO1xuICAgICAgICAgICAgY29uc3QgeDIgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogLTEpO1xuICAgICAgICAgICAgY29uc3QgeTIgPSBpbmRleFkgKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAtMSA6IGkpO1xuICAgICAgICAgICAgY29uc3QgeDMgPSBpbmRleFggKyAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyBpIDogMSk7XG4gICAgICAgICAgICBjb25zdCB5MyA9IGluZGV4WSArIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IDEgOiBpKTtcblxuICAgICAgICAgICAgaWYgKHgxID49IDAgJiYgeDEgPCBwbGF5ZXJHcmlkLmxlbmd0aCAmJiB5MSA+PSAwICYmIHkxIDwgcGxheWVyR3JpZFswXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgc3Vycm91bmRpbmdBcnJheS5wdXNoKHBsYXllckdyaWRbeDFdW3kxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeDIgPj0gMCAmJiB4MiA8IHBsYXllckdyaWQubGVuZ3RoICYmIHkyID49IDAgJiYgeTIgPCBwbGF5ZXJHcmlkWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgICBzdXJyb3VuZGluZ0FycmF5LnB1c2gocGxheWVyR3JpZFt4Ml1beTJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh4MyA+PSAwICYmIHgzIDwgcGxheWVyR3JpZC5sZW5ndGggJiYgeTMgPj0gMCAmJiB5MyA8IHBsYXllckdyaWRbMF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHN1cnJvdW5kaW5nQXJyYXkucHVzaChwbGF5ZXJHcmlkW3gzXVt5M10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGVtcHR5ID0gYXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG4gICAgICAgICAgY29uc3Qgc3Vycm91bmRpbmdFbXB0eSA9IHN1cnJvdW5kaW5nQXJyYXkuZXZlcnkoc3F1YXJlID0+IHNxdWFyZSA9PT0gbnVsbCk7XG5cbiAgICAgICAgICByZXR1cm4gZW1wdHkgJiYgc3Vycm91bmRpbmdFbXB0eTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBpZiAoaXNFbXB0eSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcGxheWVyLnBsYWNlU2hpcChbaW5kZXhYLCBpbmRleFldLCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gICAgICAgIGRvbS5wb3B1bGF0ZUdyaWQocGxheWVyLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGRyYWdnZWRCb2F0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2JqZWN0LmlkKTtcbiAgICAgICAgZHJhZ2dlZEJvYXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0Jywgb25EcmFnKTtcbiAgICAgICAgZHJhZ2dlZEJvYXQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgIGRyYWdnZWRCb2F0LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgICAgIGdyaWRMaXN0ZW5lcnMoKTtcbiAgICAgIH07XG4gICAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZXZlbnQgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIG9uRHJvcCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdyaWRMaXN0ZW5lcnMoKTtcbiAgfSxcbiAgc2hvd1N0YXJ0aW5nRGlhbG9nKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICBkb20ucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpLCB0cnVlKTtcbiAgICBjb25zdCBkaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcHMnKTtcbiAgICBkaWFsb2cuc2hvd01vZGFsKCk7XG4gICAgZG9tLmRyYWdBbmREcm9wKHBsYXllcjEpO1xuICAgIGNvbnN0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzIC5yZXN0YXJ0Jyk7XG4gICAgc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgIGRvbS5wb3B1bGF0ZUdyaWQocGxheWVyMS5nZXRHcmlkKCkpO1xuICAgICAgZG9tLnBvcHVsYXRlRW5lbXlHcmlkKHBsYXllcjEsIHBsYXllcjIpO1xuICAgIH0pO1xuICAgIGNvbnN0IGNoRGlyZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RpcmVjdGlvbicpO1xuICAgIGNoRGlyZWN0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgYm9hdERyYWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hdHMtZHJhZycpO1xuICAgICAgY29uc3QgYm9hdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hdCcpO1xuICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgYm9hdERyYWcuY2xhc3NMaXN0LmFkZCgndmVydGljYWwnKTtcbiAgICAgICAgYm9hdHMuZm9yRWFjaChib2F0ID0+IHtcbiAgICAgICAgICBib2F0LmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2F0RHJhZy5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbCcpO1xuICAgICAgICBib2F0cy5mb3JFYWNoKGJvYXQgPT4ge1xuICAgICAgICAgIGJvYXQuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZG9tO1xuIiwiaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcblxuY29uc3QgZ2FtZSA9IHtcbiAgc3RhcnRHYW1lKCkge1xuICAgIC8vIGNvbnN0IHBsYXllcjEgPSBQbGF5ZXIoKTtcbiAgICAvLyBjb25zdCBwbGF5ZXIyID0gUGxheWVyKCk7XG4gICAgLy8gZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSwgdHJ1ZSk7XG4gICAgLy8gY29uc3QgZGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXBzJyk7XG4gICAgLy8gZGlhbG9nLnNob3dNb2RhbCgpO1xuICAgIC8vIHBsYXllcjEucGxhY2VTaGlwKFsxLCAzXSwgNCwgJ2hvcml6b250YWwnKTtcbiAgICAvLyBwbGF5ZXIxLnBsYWNlU2hpcChbNywgM10sIDMsICdob3Jpem9udGFsJyk7XG4gICAgLy8gcGxheWVyMS5wbGFjZVNoaXAoWzgsIDhdLCAyLCAnaG9yaXpvbnRhbCcpO1xuICAgIC8vIHBsYXllcjEucGxhY2VTaGlwKFsxLCA1XSwgMiwgJ3ZlcnRpY2FsJyk7XG4gICAgLy8gcGxheWVyMi5wbGFjZVNoaXAoWzEsIDNdLCA1LCAnaG9yaXpvbnRhbCcpO1xuICAgIC8vIHBsYXllcjIucGxhY2VTaGlwKFs3LCAzXSwgNCwgJ2hvcml6b250YWwnKTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcChbOCwgOF0sIDMsICdob3Jpem9udGFsJyk7XG4gICAgLy8gcGxheWVyMi5wbGFjZVNoaXAoWzEsIDVdLCAzLCAndmVydGljYWwnKTtcbiAgICAvLyBwbGF5ZXIyLnBsYWNlU2hpcChbMiwgNF0sIDIsICdob3Jpem9udGFsJyk7XG4gIH0sXG4gIHBsYWNlU3R1ZmYoKSB7XG4gICAgY29uc3QgcGxheWVyMSA9IFBsYXllcigpO1xuICAgIGNvbnN0IHBsYXllcjIgPSBQbGF5ZXIoKTtcbiAgICBkb20uc2hvd1N0YXJ0aW5nRGlhbG9nKHBsYXllcjEsIHBsYXllcjIpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcCc7XG5cbmNvbnN0IGNyZWF0ZUdyaWQgPSBmdW5jdGlvbiAobiA9IDEwKSB7XG4gIGNvbnN0IGdyaWQgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xuICAgIGdyaWRbaV0gPSBbXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG47IGogKz0gMSkge1xuICAgICAgZ3JpZFtpXVtqXSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdyaWQ7XG59O1xuXG5jb25zdCBHYW1lYm9hcmQgPSBmdW5jdGlvbiBjcmVhdGVHYW1lYm9hcmQoKSB7XG4gIGNvbnN0IGdyaWQgPSBjcmVhdGVHcmlkKCk7XG4gIGNvbnN0IHBsYWNlU2hpcCA9IGZ1bmN0aW9uIChzdGFydCwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICBjb25zdCBzaGlwT2JqID0gU2hpcChsZW5ndGgpO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcE9iai5sZW5ndGg7IGkgKz0gMSkgZ3JpZFtzdGFydFswXV1bc3RhcnRbMV0gKyBpXSA9IHNoaXBPYmo7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcE9iai5sZW5ndGg7IGkgKz0gMSkgZ3JpZFtzdGFydFswXSArIGldW3N0YXJ0WzFdXSA9IHNoaXBPYmo7XG4gICAgfVxuICB9O1xuICBjb25zdCByZWNlaXZlSGl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdyaWRbeF1beV07XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICBncmlkW3hdW3ldID0gJ3dhdGVyJztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFsdWUuYWRkSGl0KCk7XG4gICAgZ3JpZFt4XVt5XSA9IFsnaGl0JywgdmFsdWVdO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBjb25zdCBhbGxTdW5rID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgaWYgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHNsb3QpKSByZXN1bHQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgY29uc3QgY291bnRCb2F0c0FsaXZlID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGJvYXRzID0gW107XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgc2xvdCAhPT0gbnVsbCAmJlxuICAgICAgICAgIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICFBcnJheS5pc0FycmF5KHNsb3QpICYmXG4gICAgICAgICAgIWJvYXRzLmluY2x1ZGVzKHNsb3QpXG4gICAgICAgICkge1xuICAgICAgICAgIGJvYXRzLnB1c2goc2xvdCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBib2F0cy5sZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ3JpZDtcbiAgfTtcbiAgcmV0dXJuIHsgZ2V0R3JpZCwgcGxhY2VTaGlwLCByZWNlaXZlSGl0LCBhbGxTdW5rLCBjb3VudEJvYXRzQWxpdmUgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSAnLi9nYW1lYm9hcmQnO1xuXG5jb25zdCBQbGF5ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IEdhbWVib2FyZCgpO1xuXG4gIGNvbnN0IGFsbFN1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5hbGxTdW5rKCk7XG4gIH07XG5cbiAgY29uc3Qgd2luID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnSSB3b24nO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IGZ1bmN0aW9uIChzdGFydCwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwKHN0YXJ0LCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gIH07XG5cbiAgY29uc3QgZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLmdldEdyaWQoKTtcbiAgfTtcblxuICBjb25zdCBjb3VudEJvYXRzQWxpdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5jb3VudEJvYXRzQWxpdmUoKTtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlSGl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoeCwgeSk7XG4gIH07XG5cbiAgY29uc3QgYXR0YWNrID0gZnVuY3Rpb24gKHBsYXllciwgeCwgeSkge1xuICAgIGNvbnN0IGhpdCA9IHBsYXllci5yZWNlaXZlSGl0KHgsIHkpO1xuICAgIGlmIChwbGF5ZXIuYWxsU3VuaygpKSB7XG4gICAgICByZXR1cm4gd2luKCk7XG4gICAgfVxuICAgIHJldHVybiBoaXQ7XG4gIH07XG5cbiAgY29uc3QgcmFuZG9tQXR0YWNrID0gZnVuY3Rpb24gKHBsYXllcikge1xuICAgIGxldCB4O1xuICAgIGxldCB5O1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIGlmICh0eXBlb2YgcGxheWVyLmdldEdyaWQoKVt4XVt5XSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkocGxheWVyLmdldEdyaWQoKVt4XVt5XSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhdHRhY2socGxheWVyLCB4LCB5KTtcbiAgfTtcblxuICByZXR1cm4geyBhbGxTdW5rLCBwbGFjZVNoaXAsIGdldEdyaWQsIHJlY2VpdmVIaXQsIGF0dGFjaywgd2luLCByYW5kb21BdHRhY2ssIGNvdW50Qm9hdHNBbGl2ZSB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY29uc3QgU2hpcCA9IGZ1bmN0aW9uIGNyZWF0ZVNoaXAoc2hpcExlbmd0aCkge1xuICBjb25zdCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xuICBsZXQgaGl0cyA9IDA7XG4gIGNvbnN0IGFkZEhpdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBoaXRzICs9IDE7XG4gICAgcmV0dXJuIGhpdHM7XG4gIH07XG4gIGNvbnN0IGlzU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGl0cyA9PT0gbGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHJldHVybiB7IGxlbmd0aCwgYWRkSGl0LCBpc1N1bmsgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIiosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gfVxcbiBcXG5cXG4qIHtcXG5tYXJnaW46IDA7XFxucGFkZGluZzogMDtcXG59XFxuXFxuXFxuYm9keSB7XFxubGluZS1oZWlnaHQ6IDEuNTtcXG4td2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG5mb250LWZhbWlseTogJ1J1YmlrIEJ1YmJsZXMnLCBDb3VyaWVyLCBtb25vc3BhY2U7XFxufVxcblxcblxcbmltZywgcGljdHVyZSwgdmlkZW8sIGNhbnZhcywgc3ZnIHtcXG5kaXNwbGF5OiBibG9jaztcXG5tYXgtd2lkdGg6IDEwMCU7XFxufVxcblxcblxcbmlucHV0LCBidXR0b24sIHRleHRhcmVhLCBzZWxlY3Qge1xcbmZvbnQ6IGluaGVyaXQ7XFxufVxcblxcblxcbnAsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcbm92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XFxufVxcblxcblxcbmJ1dHRvbiwgYXtcXG5jdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcblxcbmF7XFxuICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5cXG5cXG5cXG4vKiBGb290ZXIgKi9cXG5cXG5cXG5odG1sIHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbnBvc2l0aW9uOiByZWxhdGl2ZTtcXG5taW4taGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5cXG5ib2R5IHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbm1hcmdpbi1ib3R0b206IDQ4cHg7XFxufVxcblxcblxcbi5mb290ZXIge1xcbnBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5ib3R0b206IDA7XFxubGVmdDogMDtcXG5kaXNwbGF5OiBmbGV4O1xcbmFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuanVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuZ2FwOiAxMHB4O1xcbndpZHRoOiAxMDAlO1xcbnBhZGRpbmc6IDEwcHg7XFxuYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMThweDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1YiB7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMjJweDtcXG50cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1Yjpob3ZlciB7XFxudHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKSBzY2FsZSgxLjIpO1xcbn1cXG5cXG4vKiBTdHlsaW5nICovXFxuXFxuOnJvb3R7XFxuIC0taGVhZGVyLWJnOiAjM0QzRDNEO1xcbiAtLW1haW4tYmc6IzMwMzAzMDtcXG4gLS10ZXh0OiNGRkZGRkY7XFxuIC0tZ3JpZC1ib3JkZXJzOiMwMDJDNjY7XFxuIC0tZ3JpZC1zcXVhcmVzOiMyMzg5REE7XFxuIC0tbXktYm9hdHM6IzgwODA4MDtcXG4gLS1teS1ib2F0cy1ib3JkZXI6IzQ2NDY0NjtcXG4gLS1zaGlwLWhpdDojRjgyNzI3O1xcbiAtLXNoaXAtc3VuazojRDE2MDYwO1xcbiAtLWdyZWVuLXRleHQ6IzJCQzU1NztcXG4gLS1yZWQtdGV4dDojRTIzNjM2O1xcbn1cXG5cXG5ib2R5IHtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG5oZWFkZXJ7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGVhZGVyLWJnKTtcXG4gICBmbGV4OiAxO1xcbn1cXG5cXG5oMXtcXG4gICBmb250LXNpemU6IDIuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbn1cXG5cXG5tYWlue1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIGZsZXg6IDc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1dmg7XFxuICAgcGFkZGluZzogNXZoIDBweDtcXG59XFxuXFxuLnR1cm5ze1xcbiAgIHBhZGRpbmc6IDEwcHggMzBweDtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgZm9udC1zaXplOiAycmVtOztcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4udHVybnMucmVkIHtcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbiAgIGJvcmRlcjogMnB4IHJpZGdlIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmdyaWQtY29udGFpbmVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdnc7XFxufVxcblxcbi53cmFwcGVye1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ubnVtYmVyLXdyYXBwZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ueS13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBnYXA6IDVweDtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXN7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIG1pbi1oZWlnaHQ6IDcwdmg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXMgcHtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uZ3JpZCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhc3BlY3QtcmF0aW86IDEvMTtcXG4gICBoZWlnaHQ6IDcwdmg7XFxuICAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tZ3JpZC1ib3JkZXJzKTtcXG4gICBib3JkZXItcmFkaXVzOiA2cHg7XFxufVxcblxcbi54LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IDcwdmg7XFxuICAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi54LWNvb3JkaW5hdGVzIHB7XFxuICAgd2lkdGg6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5saW5le1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICB3aWR0aDogMTAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG59XFxuXFxuLnNxdWFyZXtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMCU7XFxuICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XFxufVxcblxcblxcblxcbiNncmlkMiAuc3F1YXJlLmVtcHR5OmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxMTAsIDgsIDE5NCk7XFxuICAgY3Vyc29yOmNyb3NzaGFpcjtcXG59XFxuXFxuLnNxdWFyZS5zaGlwe1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XFxuXFxuLnNxdWFyZS53YXRlcntcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDJyZW07XFxufVxcblxcbi5zcXVhcmUuaGl0IHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLWhpdCk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgZm9udC13ZWlnaHQ6IDgwMDtcXG59XFxuXFxuLnNxdWFyZS5zdW5rIHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLXN1bmspO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5pbmZve1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mbyAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mby50d297XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmluZm8udHdvIC5zaGlwcy1hbGl2ZXtcXG4gICBib3JkZXItdG9wOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5cXG5cXG5cXG5kaWFsb2d7XFxuICAgdG9wOiA1MCU7XFxuICAgbGVmdDogNTAlO1xcbiAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgIGhlaWdodDogNTB2aDtcXG4gICB3aWR0aDogMTAwdnc7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1iZyk7XFxuICAgb3BhY2l0eTogMC45O1xcbiAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlc21va2U7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuXFxuXFxuLmRpYWxvZy1jb250YWluZXJ7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMDAlO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgIGdhcDogMTB2aDtcXG59XFxuXFxuLndpbm5lcntcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIHBhZGRpbmc6IDIwcHg7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuLndpbm5lci50d297XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbmJ1dHRvbntcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IG5vbmU7XFxuICAgb3V0bGluZTogbm9uZTtcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgIHBhZGRpbmc6IDEwcHg7XFxuICAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIDtcXG59XFxuXFxuYnV0dG9uOmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMge1xcbiAgIHBhZGRpbmc6IDJ2aCAydncgO1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgIG9wYWNpdHk6IDAuOTg7XFxuICAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmRpYWxvZy1jb250YWluZXJ7XFxuICAgZ2FwOiAydmg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuZGlhbG9nLWhlYWRlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGdhcDogOHZ3O1xcbn1cXG5cXG5oMntcXG4gICBmb250LXNpemU6IDEuOHJlbTtcXG4gICBmb250LXdlaWdodDogNDAwO1xcbn1cXG5cXG4jZGlyZWN0aW9uIHtcXG4gICBwYWRkaW5nOiA1cHg7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAud3JhcHBlciB7XFxuICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICBnYXA6IDV2dztcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXRzLWRyYWcge1xcbiAgIHdpZHRoOiAyMHY7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGdhcDogM3ZoO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXRzLWRyYWcudmVydGljYWwge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgZ2FwOiAzdnc7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdC13cmFwcGVyIHtcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0IHtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiBmaXQtY29udGVudDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0LnZlcnRpY2FsIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXG59XFxuXFxuLmJvYXQgLmJvYXQtc3F1YXJlIHtcXG4gICBmbGV4OiBub25lO1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXktYm9hdHMpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgYm9yZGVyLXJhZGl1czogOHB4O1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8v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YixZQUFZO0FBQ2Y7O0FBRUE7R0FDRyxRQUFRO0FBQ1g7O0FBRUE7R0FDRyxhQUFhO0dBQ2IsUUFBUTtBQUNYOztBQUVBO0dBQ0csaUJBQWlCO0dBQ2pCLGdCQUFnQjtBQUNuQjs7QUFFQTtHQUNHLFlBQVk7QUFDZjs7QUFFQTtHQUNHLG1CQUFtQjtHQUNuQixRQUFRO0dBQ1IsbUJBQW1CO0FBQ3RCOzs7QUFHQTtHQUNHLFVBQVU7R0FDVixhQUFhO0dBQ2Isc0JBQXNCO0dBQ3RCLFFBQVE7QUFDWDs7QUFFQTtHQUNHLG1CQUFtQjtHQUNuQixRQUFRO0FBQ1g7O0FBRUE7R0FDRyxZQUFZO0dBQ1osc0JBQXNCO0FBQ3pCOztBQUVBO0dBQ0csYUFBYTtHQUNiLGtCQUFrQjtBQUNyQjs7QUFFQTtHQUNHLHNCQUFzQjtHQUN0QixrQkFBa0I7QUFDckI7O0FBRUE7R0FDRyxVQUFVO0dBQ1YsVUFBVTtHQUNWLFdBQVc7R0FDWCxpQ0FBaUM7R0FDakMsd0NBQXdDO0dBQ3hDLGtCQUFrQjtBQUNyQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuIH1cXG4gXFxuXFxuKiB7XFxubWFyZ2luOiAwO1xcbnBhZGRpbmc6IDA7XFxufVxcblxcblxcbmJvZHkge1xcbmxpbmUtaGVpZ2h0OiAxLjU7XFxuLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxuZm9udC1mYW1pbHk6ICdSdWJpayBCdWJibGVzJywgQ291cmllciwgbW9ub3NwYWNlO1xcbn1cXG5cXG5cXG5pbWcsIHBpY3R1cmUsIHZpZGVvLCBjYW52YXMsIHN2ZyB7XFxuZGlzcGxheTogYmxvY2s7XFxubWF4LXdpZHRoOiAxMDAlO1xcbn1cXG5cXG5cXG5pbnB1dCwgYnV0dG9uLCB0ZXh0YXJlYSwgc2VsZWN0IHtcXG5mb250OiBpbmhlcml0O1xcbn1cXG5cXG5cXG5wLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXG5vdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xcbn1cXG5cXG5cXG5idXR0b24sIGF7XFxuY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5cXG5he1xcbiAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuXFxuXFxuXFxuLyogRm9vdGVyICovXFxuXFxuXFxuaHRtbCB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5wb3NpdGlvbjogcmVsYXRpdmU7XFxubWluLWhlaWdodDogMTAwJTtcXG59XFxuXFxuXFxuYm9keSB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5tYXJnaW4tYm90dG9tOiA0OHB4O1xcbn1cXG5cXG5cXG4uZm9vdGVyIHtcXG5wb3NpdGlvbjogYWJzb2x1dGU7XFxuYm90dG9tOiAwO1xcbmxlZnQ6IDA7XFxuZGlzcGxheTogZmxleDtcXG5hbGlnbi1pdGVtczogY2VudGVyO1xcbmp1c3RpZnktY29udGVudDogY2VudGVyO1xcbmdhcDogMTBweDtcXG53aWR0aDogMTAwJTtcXG5wYWRkaW5nOiAxMHB4O1xcbmJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDE4cHg7XFxufVxcblxcblxcbi5mYS1naXRodWIge1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDIycHg7XFxudHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxufVxcblxcblxcbi5mYS1naXRodWI6aG92ZXIge1xcbnRyYW5zZm9ybTogcm90YXRlKDM2MGRlZykgc2NhbGUoMS4yKTtcXG59XFxuXFxuLyogU3R5bGluZyAqL1xcblxcbjpyb290e1xcbiAtLWhlYWRlci1iZzogIzNEM0QzRDtcXG4gLS1tYWluLWJnOiMzMDMwMzA7XFxuIC0tdGV4dDojRkZGRkZGO1xcbiAtLWdyaWQtYm9yZGVyczojMDAyQzY2O1xcbiAtLWdyaWQtc3F1YXJlczojMjM4OURBO1xcbiAtLW15LWJvYXRzOiM4MDgwODA7XFxuIC0tbXktYm9hdHMtYm9yZGVyOiM0NjQ2NDY7XFxuIC0tc2hpcC1oaXQ6I0Y4MjcyNztcXG4gLS1zaGlwLXN1bms6I0QxNjA2MDtcXG4gLS1ncmVlbi10ZXh0OiMyQkM1NTc7XFxuIC0tcmVkLXRleHQ6I0UyMzYzNjtcXG59XFxuXFxuYm9keSB7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuaGVhZGVye1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhlYWRlci1iZyk7XFxuICAgZmxleDogMTtcXG59XFxuXFxuaDF7XFxuICAgZm9udC1zaXplOiAyLjVyZW07XFxuICAgZm9udC13ZWlnaHQ6IDUwMDtcXG59XFxuXFxubWFpbntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWJnKTtcXG4gICBmbGV4OiA3O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGdhcDogNXZoO1xcbiAgIHBhZGRpbmc6IDV2aCAwcHg7XFxufVxcblxcbi50dXJuc3tcXG4gICBwYWRkaW5nOiAxMHB4IDMwcHg7XFxuICAgYm9yZGVyOiAycHggcmlkZ2UgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogMnJlbTs7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnR1cm5zLnJlZCB7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5ncmlkLWNvbnRhaW5lcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgZ2FwOiAxMHZ3O1xcbn1cXG5cXG4ud3JhcHBlcntcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLm51bWJlci13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnktd3JhcHBlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1cHg7XFxufVxcblxcbi55LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBtaW4taGVpZ2h0OiA3MHZoO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi55LWNvb3JkaW5hdGVzIHB7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmdyaWQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYXNwZWN0LXJhdGlvOiAxLzE7XFxuICAgaGVpZ2h0OiA3MHZoO1xcbiAgIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgYm9yZGVyLXJhZGl1czogNnB4O1xcbn1cXG5cXG4ueC1jb29yZGluYXRlc3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiA3MHZoO1xcbiAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4ueC1jb29yZGluYXRlcyBwe1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ubGluZXtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgd2lkdGg6IDEwJTtcXG4gICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbi5zcXVhcmV7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1ncmlkLWJvcmRlcnMpO1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAlO1xcbiAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xcbn1cXG5cXG5cXG5cXG4jZ3JpZDIgLnNxdWFyZS5lbXB0eTpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTEwLCA4LCAxOTQpO1xcbiAgIGN1cnNvcjpjcm9zc2hhaXI7XFxufVxcblxcbi5zcXVhcmUuc2hpcHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcblxcbi5zcXVhcmUud2F0ZXJ7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAycmVtO1xcbn1cXG5cXG4uc3F1YXJlLmhpdCB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1oaXQpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5zcXVhcmUuc3VuayB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1zdW5rKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBmb250LXdlaWdodDogODAwO1xcbn1cXG5cXG4uaW5mb3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8gLnNoaXBzLWFsaXZle1xcbiAgIGJvcmRlci10b3A6IDJweCBzb2xpZCB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8udHdve1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5pbmZvLnR3byAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuXFxuXFxuXFxuZGlhbG9ne1xcbiAgIHRvcDogNTAlO1xcbiAgIGxlZnQ6IDUwJTtcXG4gICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gICBoZWlnaHQ6IDUwdmg7XFxuICAgd2lkdGg6IDEwMHZ3O1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIG9wYWNpdHk6IDAuOTtcXG4gICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZXNtb2tlO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcblxcblxcbi5kaWFsb2ctY29udGFpbmVye1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdmg7XFxufVxcblxcbi53aW5uZXJ7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBwYWRkaW5nOiAyMHB4O1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcbi53aW5uZXIudHdve1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5idXR0b257XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxuICAgYm9yZGVyOiBub25lO1xcbiAgIG91dGxpbmU6IG5vbmU7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gICBwYWRkaW5nOiAxMHB4O1xcbiAgIHRyYW5zaXRpb246IDAuM3MgZWFzZSA7XFxufVxcblxcbmJ1dHRvbjpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG59XFxuXFxuXFxuLnBsYWNlLXNoaXBzIHtcXG4gICBwYWRkaW5nOiAydmggMnZ3IDtcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gICBvcGFjaXR5OiAwLjk4O1xcbiAgIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5kaWFsb2ctY29udGFpbmVye1xcbiAgIGdhcDogMnZoO1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmRpYWxvZy1oZWFkZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBnYXA6IDh2dztcXG59XFxuXFxuaDJ7XFxuICAgZm9udC1zaXplOiAxLjhyZW07XFxuICAgZm9udC13ZWlnaHQ6IDQwMDtcXG59XFxuXFxuI2RpcmVjdGlvbiB7XFxuICAgcGFkZGluZzogNXB4O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLndyYXBwZXIge1xcbiAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgZ2FwOiA1dnc7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0cy1kcmFnIHtcXG4gICB3aWR0aDogMjB2O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBnYXA6IDN2aDtcXG59XFxuXFxuLnBsYWNlLXNoaXBzIC5ib2F0cy1kcmFnLnZlcnRpY2FsIHtcXG4gICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgIGdhcDogM3Z3O1xcbn1cXG5cXG4ucGxhY2Utc2hpcHMgLmJvYXQtd3JhcHBlciB7XFxuICAgZGlzcGxheTpmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICB3aWR0aDogZml0LWNvbnRlbnQ7XFxufVxcblxcbi5wbGFjZS1zaGlwcyAuYm9hdC52ZXJ0aWNhbCB7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxufVxcblxcbi5ib2F0IC5ib2F0LXNxdWFyZSB7XFxuICAgZmxleDogbm9uZTtcXG4gICB3aWR0aDogN3ZoO1xcbiAgIGhlaWdodDogN3ZoO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCAnLi9zdHlsZS5jc3MnO1xuaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmdhbWUucGxhY2VTdHVmZigpO1xuXG5cbi8vIGNvbnN0IHBsYXllcjEgPSBQbGF5ZXIoKTtcbi8vIGNvbnN0IHBsYXllcjIgPSBQbGF5ZXIoKTtcbi8vIHBsYXllcjEucGxhY2VTaGlwKFsxLCAzXSwgNCwgJ2hvcml6b250YWwnKTtcbi8vIHBsYXllcjEucGxhY2VTaGlwKFs3LCAzXSwgMywgJ2hvcml6b250YWwnKTtcbi8vIHBsYXllcjEucGxhY2VTaGlwKFs4LCA4XSwgMiwgJ2hvcml6b250YWwnKTtcbi8vIHBsYXllcjEucGxhY2VTaGlwKFsxLCA1XSwgMiwgJ3ZlcnRpY2FsJyk7XG4vLyBwbGF5ZXIyLmF0dGFjayhwbGF5ZXIxLCAxLCA1KTtcbi8vIHBsYXllcjIuYXR0YWNrKHBsYXllcjEsIDEsIDYpO1xuLy8gcGxheWVyMi5hdHRhY2socGxheWVyMSwgMSwgMyk7XG4vLyBwbGF5ZXIyLmF0dGFjayhwbGF5ZXIxLCA5LCA5KTtcblxuLy8gcGxheWVyMi5wbGFjZVNoaXAoWzEsIDNdLCA0LCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMi5wbGFjZVNoaXAoWzcsIDNdLCAzLCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMi5wbGFjZVNoaXAoWzgsIDhdLCAyLCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMi5wbGFjZVNoaXAoWzEsIDVdLCAyLCAndmVydGljYWwnKTtcbi8vIHBsYXllcjEuYXR0YWNrKHBsYXllcjIsIDEsIDUpO1xuLy8gcGxheWVyMS5hdHRhY2socGxheWVyMiwgMSwgNik7XG4vLyBwbGF5ZXIxLmF0dGFjayhwbGF5ZXIyLCAxLCAzKTtcbi8vIHBsYXllcjEuYXR0YWNrKHBsYXllcjIsIDksIDkpO1xuXG4vLyBkb20ucG9wdWxhdGVFbmVteUdyaWQocGxheWVyMSwgcGxheWVyMik7XG5cbi8vIGRvbS5wb3B1bGF0ZUdyaWQocGxheWVyMS5nZXRHcmlkKCkpO1xuLy8gbGV0IGZpbmlzaCA9IGZhbHNlO1xuLy8gd2hpbGUgKGZpbmlzaCA9PT0gZmFsc2UpIHtcbi8vICAgZmluaXNoID0gZG9tLmxpc3RlbkZvckNsaWNrKHBsYXllcjEsIHBsYXllcjIpO1xuLy8gfVxuXG4vLyBnYW1lYm9hcmQucmVjZWl2ZUhpdCgxLCAzKTtcbi8vIGdhbWVib2FyZC5yZWNlaXZlSGl0KDIsIDMpO1xuLy8gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoMywgMyk7XG4vLyBjb25zb2xlLmxvZyhnYW1lYm9hcmQuYWxsU3VuaygpKTtcbi8vIGNvbnN0IHNoaXAxID0gU2hpcCgzKTtcbi8vIGNvbnNvbGUubG9nKHNoaXAxLmFkZEhpdCgpKTtcblxuLy8gY29uc29sZS5sb2coZ2FtZWJvYXJkLmdyaWRbMV1bM10pO1xuLy8gY29uc29sZS5sb2coc2hpcDEpO1xuLy8gY29uc29sZS5sb2coZ2FtZWJvYXJkLmdyaWRbMV1bM10gPT09IHNoaXAxKTtcbi8vIGdhbWVib2FyZC5yZWNlaXZlSGl0KDEsIDMpO1xuIl0sIm5hbWVzIjpbImdhbWUiLCJkb20iLCJkaXJlY3Rpb24iLCJwb3B1bGF0ZUdyaWQiLCJncmlkIiwic3RhcnQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJncmlkQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiaW5uZXJIVE1MIiwiZm9yRWFjaCIsImxpbmUiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwic2xvdCIsInNxdWFyZSIsIkFycmF5IiwiaXNBcnJheSIsInN1bmsiLCJpc1N1bmsiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicG9wdWxhdGVFbmVteUdyaWQiLCJwbGF5ZXIxIiwicGxheWVyMiIsImdldEdyaWQiLCJhZGRFdmVudExpc3RlbmVyIiwic3F1YXJlQ2xpY2tlZCIsImV2ZW50IiwiZW5lbXlHcmlkIiwiY29sdW1uIiwiY3VycmVudFRhcmdldCIsInBhcmVudE5vZGUiLCJjbGlja2VkU3F1YXJlIiwiaW5kZXhZIiwicHJvdG90eXBlIiwiaW5kZXhPZiIsImNhbGwiLCJjaGlsZHJlbiIsImluZGV4WCIsImhpdCIsImF0dGFjayIsInVwZGF0ZUJvYXRzQWxpdmUiLCJhbGxTdW5rIiwicGxheWVyV29uIiwidG9nZ2xlVHVybiIsImRlbGF5IiwicmFuZG9tQXR0YWNrIiwibXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJwbGF5ZXIiLCJkaWFsb2ciLCJzaG93TW9kYWwiLCJyZXN0YXJ0Iiwic3RhcnRHYW1lIiwiY2xvc2UiLCJ0dXJucyIsIndpbm5lciIsImNsYXNzTGlzdCIsImFkZCIsImRpdlR1cm5zIiwiY3VycmVudFR1cm4iLCJzdWJzdHJpbmciLCJwbGF5ZXJOdW0iLCJwYXJhIiwiYm9hdHNBbGl2ZSIsImNvdW50Qm9hdHNBbGl2ZSIsImRyYWdBbmREcm9wIiwiYm9hdHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwib25EcmFnIiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJpZCIsImJvYXQiLCJncmlkTGlzdGVuZXJzIiwic3F1YXJlcyIsIm9uRHJvcCIsInByZXZlbnREZWZhdWx0IiwianNvbiIsImdldERhdGEiLCJvYmplY3QiLCJwYXJzZSIsInBsYXllckdyaWQiLCJpc0VtcHR5IiwiYXJyYXkiLCJzdXJyb3VuZGluZ0FycmF5IiwicHVzaCIsImkiLCJ4MSIsInkxIiwieDIiLCJ5MiIsIngzIiwieTMiLCJlbXB0eSIsImV2ZXJ5Iiwic3Vycm91bmRpbmdFbXB0eSIsInBsYWNlU2hpcCIsImRyYWdnZWRCb2F0IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZHJhZ2dhYmxlIiwic3R5bGUiLCJvcGFjaXR5Iiwic2hvd1N0YXJ0aW5nRGlhbG9nIiwic3RhcnRCdXR0b24iLCJjaERpcmVjdGlvbiIsImJvYXREcmFnIiwicmVtb3ZlIiwiUGxheWVyIiwicGxhY2VTdHVmZiIsIlNoaXAiLCJjcmVhdGVHcmlkIiwibiIsImoiLCJHYW1lYm9hcmQiLCJjcmVhdGVHYW1lYm9hcmQiLCJzaGlwT2JqIiwicmVjZWl2ZUhpdCIsIngiLCJ5IiwidmFsdWUiLCJhZGRIaXQiLCJyZXN1bHQiLCJpbmNsdWRlcyIsImdhbWVib2FyZCIsIndpbiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNyZWF0ZVNoaXAiLCJzaGlwTGVuZ3RoIiwiaGl0cyJdLCJzb3VyY2VSb290IjoiIn0=