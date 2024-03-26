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
  populateGrid(grid) {
    const gridContainer = document.querySelector('#grid1');
    gridContainer.innerHTML = '';
    grid.forEach(line => {
      const div = document.createElement('div');
      div.className = 'line';
      line.forEach(slot => {
        const square = document.createElement('div');
        if (slot === null) {
          square.className = 'square';
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
    const dialog = document.querySelector('dialog');
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
  startLoop: event => {
    const enemyGrid = document.querySelector('#grid2');
    const column = event.currentTarget.parentNode;
    const clickedSquare = event.currentTarget;
    const indexY = Array.prototype.indexOf.call(column.children, clickedSquare);
    const indexX = Array.prototype.indexOf.call(enemyGrid.children, column);
    player1.attack(player2, indexX, indexY);
    dom.populateEnemyGrid(player1, player2);
    if (player2.allSunk() !== false) return 'Player 1 won';
    dom.toggleTurn();
    player2.randomAttack(player1);
    dom.populateGrid(player1.getGrid());
    if (player1.allSunk() !== false) return 'Player 2 won';
    dom.toggleTurn();
    return false;
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
    player1.placeShip([1, 3], 4, 'horizontal');
    player1.placeShip([7, 3], 3, 'horizontal');
    player1.placeShip([8, 8], 2, 'horizontal');
    player1.placeShip([1, 5], 2, 'vertical');
    player2.placeShip([1, 3], 4, 'horizontal');
    player2.placeShip([7, 3], 3, 'horizontal');
    player2.placeShip([8, 8], 2, 'horizontal');
    player2.placeShip([1, 5], 2, 'vertical');
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].populateGrid(player1.getGrid());
    _dom__WEBPACK_IMPORTED_MODULE_0__["default"].populateEnemyGrid(player1, player2);
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
___CSS_LOADER_EXPORT___.push([module.id, "*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.two{\n   color: var(--red-text);\n}\n\n.info.two .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\n.restart{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\n.restart:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["*, *::before, *::after {\n  box-sizing: border-box;\n }\n \n\n* {\nmargin: 0;\npadding: 0;\n}\n\n\nbody {\nline-height: 1.5;\n-webkit-font-smoothing: antialiased;\nfont-family: 'Rubik Bubbles', Courier, monospace;\n}\n\n\nimg, picture, video, canvas, svg {\ndisplay: block;\nmax-width: 100%;\n}\n\n\ninput, button, textarea, select {\nfont: inherit;\n}\n\n\np, h1, h2, h3, h4, h5, h6 {\noverflow-wrap: break-word;\n}\n\n\nbutton, a{\ncursor: pointer;\n}\n\n\na{\n   text-decoration: none;\n}\n\n\n\n\n/* Footer */\n\n\nhtml {\n/* footer support */\nposition: relative;\nmin-height: 100%;\n}\n\n\nbody {\n/* footer support */\nmargin-bottom: 48px;\n}\n\n\n.footer {\nposition: absolute;\nbottom: 0;\nleft: 0;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ngap: 10px;\nwidth: 100%;\npadding: 10px;\nbackground-color: black;\ncolor: white;\nfont-size: 18px;\n}\n\n\n.fa-github {\ncolor: white;\nfont-size: 22px;\ntransition: transform 0.3s ease-in-out;\n}\n\n\n.fa-github:hover {\ntransform: rotate(360deg) scale(1.2);\n}\n\n/* Styling */\n\n:root{\n --header-bg: #3D3D3D;\n --main-bg:#303030;\n --text:#FFFFFF;\n --grid-borders:#002C66;\n --grid-squares:#2389DA;\n --my-boats:#808080;\n --my-boats-border:#464646;\n --ship-hit:#F82727;\n --ship-sunk:#D16060;\n --green-text:#2BC557;\n --red-text:#E23636;\n}\n\nbody {\n   color: var(--text);\n   display: flex;\n   flex-direction: column;\n   min-height: 100vh;\n}\n\nheader{\n   padding: 2vh 2vw;\n   display: flex;\n   align-items: center;\n   background-color: var(--header-bg);\n   flex: 1;\n}\n\nh1{\n   font-size: 2.5rem;\n   font-weight: 500;\n}\n\nmain{\n   background-color: var(--main-bg);\n   flex: 7;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   gap: 5vh;\n   padding: 5vh 0px;\n}\n\n.turns{\n   padding: 10px 30px;\n   border: 2px ridge var(--green-text);\n   color: var(--green-text);\n   font-size: 2rem;;\n   border-radius: 10px;\n}\n\n.turns.red {\n   color: var(--red-text);\n   border: 2px ridge var(--red-text);\n}\n\n.grid-container{\n   display: flex;\n   align-items: center;\n   justify-content: center;\n   gap: 10vw;\n}\n\n.wrapper{\n   display:flex;\n   flex-direction: column;\n}\n\n.number-wrapper{\n   display: flex;\n   flex-direction: column;\n}\n\n.y-wrapper{\n   display: flex;\n   align-items: center;\n   gap: 5px;\n}\n\n.y-coordinates{\n   display: flex;\n   flex-direction: column;\n   font-size: 1.5rem;\n   min-height: 70vh;\n   align-items: center;\n}\n\n.y-coordinates p{\n   height: 7vh;\n   text-align: center;\n   display: flex;\n   align-items: center;\n   justify-content: center;\n}\n\n.grid {\n   display: flex;\n   aspect-ratio: 1/1;\n   height: 70vh;\n   border: 3px solid var(--grid-borders);\n   border-radius: 6px;\n}\n\n.x-coordinates{\n   display: flex;\n   width: 70vh;\n   align-self: flex-end;\n   font-size: 1.5rem;\n   justify-content: center;\n}\n\n.x-coordinates p{\n   width: 7vh;\n   text-align: center;\n}\n\n.line{\n   display: flex;\n   flex-direction: column;\n   width: 10%;\n   height: 100%;\n}\n\n.square{\n   background-color: var(--grid-squares);\n   border: 2px solid var(--grid-borders);\n   width: 100%;\n   height: 10%;\n   transition: background-color 0.2s ease;\n}\n\n#grid2 .square.empty:hover{\n   background-color: rgb(110, 8, 194);\n   cursor:crosshair;\n}\n\n.square.ship{\n   background-color: var(--my-boats);\n   border: 4px solid var(--my-boats-border);\n   border-radius: 8px;\n}\n\n.square.water{\n   display: grid;\n   place-content: center;\n   font-size: 2rem;\n}\n\n.square.hit {\n   background-color: var(--ship-hit);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.square.sunk {\n   background-color: var(--ship-sunk);\n   border: 4px solid var(--my-boats-border);\n   display: grid;\n   place-content: center;\n   font-size: 3rem;\n   font-weight: 800;\n}\n\n.info{\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   font-size: 1.5rem;\n   font-weight: 500;\n   color: var(--green-text);\n}\n\n.info .ships-alive{\n   border-top: 2px solid var(--green-text);\n}\n\n.info.two{\n   color: var(--red-text);\n}\n\n.info.two .ships-alive{\n   border-top: 2px solid var(--red-text);\n}\n\n\n\n\ndialog{\n   top: 50%;\n   left: 50%;\n   transform: translate(-50%, -50%);\n   height: 50vh;\n   width: 100vw;\n   background-color: var(--main-bg);\n   opacity: 0.9;\n   border: 1px solid whitesmoke;\n   border-radius: 12px;\n}\n\n.dialog-container{\n   width: 100%;\n   height: 100%;\n   display: flex;\n   flex-direction: column;\n   align-items: center;\n   justify-content: center;\n   gap: 10vh;\n}\n\n.winner{\n   font-size: 3rem;\n   color: var(--green-text);\n   padding: 20px;\n   border: 2px solid var(--green-text);\n   border-radius: 12px;\n}\n\n.winner.two{\n   color: var(--red-text);\n   border: 2px solid var(--red-text);\n}\n\n.restart{\n   font-size: 1.5rem;\n   color: var(--text);\n   background-color: var(--grid-squares);\n   border: none;\n   outline: none;\n   border-radius: 10px;\n   padding: 10px;\n   transition: 0.3s ease ;\n}\n\n.restart:hover{\n   background-color: var(--text);\n   color: var(--grid-squares);\n}\n"],"sourceRoot":""}]);
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





// const dialog = document.querySelector('dialog');
// dialog.showModal();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUEwQjtBQUUxQixNQUFNQyxHQUFHLEdBQUc7RUFDVkMsWUFBWUEsQ0FBQ0MsSUFBSSxFQUFFO0lBQ2pCLE1BQU1DLGFBQWEsR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQ3RERixhQUFhLENBQUNHLFNBQVMsR0FBRyxFQUFFO0lBQzVCSixJQUFJLENBQUNLLE9BQU8sQ0FBQ0MsSUFBSSxJQUFJO01BQ25CLE1BQU1DLEdBQUcsR0FBR0wsUUFBUSxDQUFDTSxhQUFhLENBQUMsS0FBSyxDQUFDO01BQ3pDRCxHQUFHLENBQUNFLFNBQVMsR0FBRyxNQUFNO01BQ3RCSCxJQUFJLENBQUNELE9BQU8sQ0FBQ0ssSUFBSSxJQUFJO1FBQ25CLE1BQU1DLE1BQU0sR0FBR1QsUUFBUSxDQUFDTSxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzVDLElBQUlFLElBQUksS0FBSyxJQUFJLEVBQUU7VUFDakJDLE1BQU0sQ0FBQ0YsU0FBUyxHQUFHLFFBQVE7UUFDN0IsQ0FBQyxNQUFNLElBQUlHLEtBQUssQ0FBQ0MsT0FBTyxDQUFDSCxJQUFJLENBQUMsRUFBRTtVQUM5QixNQUFNSSxJQUFJLEdBQUdKLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQ0ssTUFBTSxDQUFDLENBQUM7VUFDN0IsSUFBSUQsSUFBSSxLQUFLLEtBQUssRUFBRTtZQUNsQkgsTUFBTSxDQUFDRixTQUFTLEdBQUcsWUFBWTtVQUNqQyxDQUFDLE1BQU0sSUFBSUssSUFBSSxLQUFLLElBQUksRUFBRTtZQUN4QkgsTUFBTSxDQUFDRixTQUFTLEdBQUcsYUFBYTtVQUNsQztVQUNBRSxNQUFNLENBQUNLLFdBQVcsR0FBRyxHQUFHO1FBQzFCLENBQUMsTUFBTSxJQUFJTixJQUFJLEtBQUssSUFBSSxJQUFJLE9BQU9BLElBQUksS0FBSyxRQUFRLEVBQUU7VUFDcERDLE1BQU0sQ0FBQ0YsU0FBUyxHQUFHLGFBQWE7UUFDbEMsQ0FBQyxNQUFNLElBQUlDLElBQUksS0FBSyxPQUFPLEVBQUU7VUFDM0JDLE1BQU0sQ0FBQ0YsU0FBUyxHQUFHLGNBQWM7VUFDakNFLE1BQU0sQ0FBQ0ssV0FBVyxHQUFHLEdBQUc7UUFDMUI7UUFDQVQsR0FBRyxDQUFDVSxXQUFXLENBQUNOLE1BQU0sQ0FBQztNQUN6QixDQUFDLENBQUM7TUFDRlYsYUFBYSxDQUFDZ0IsV0FBVyxDQUFDVixHQUFHLENBQUM7SUFDaEMsQ0FBQyxDQUFDO0VBQ0osQ0FBQztFQUNEVyxpQkFBaUJBLENBQUNDLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0lBQ2xDLElBQUksQ0FBQ0QsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ0MsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLE1BQU1uQixhQUFhLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUN0RCxNQUFNSCxJQUFJLEdBQUcsSUFBSSxDQUFDb0IsT0FBTyxDQUFDQyxPQUFPLENBQUMsQ0FBQztJQUNuQ3BCLGFBQWEsQ0FBQ0csU0FBUyxHQUFHLEVBQUU7SUFDNUJKLElBQUksQ0FBQ0ssT0FBTyxDQUFDQyxJQUFJLElBQUk7TUFDbkIsTUFBTUMsR0FBRyxHQUFHTCxRQUFRLENBQUNNLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDekNELEdBQUcsQ0FBQ0UsU0FBUyxHQUFHLE1BQU07TUFDdEJILElBQUksQ0FBQ0QsT0FBTyxDQUFDSyxJQUFJLElBQUk7UUFDbkIsTUFBTUMsTUFBTSxHQUFHVCxRQUFRLENBQUNNLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDNUMsSUFBSUksS0FBSyxDQUFDQyxPQUFPLENBQUNILElBQUksQ0FBQyxFQUFFO1VBQ3ZCLE1BQU1JLElBQUksR0FBR0osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDSyxNQUFNLENBQUMsQ0FBQztVQUM3QixJQUFJRCxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQ2xCSCxNQUFNLENBQUNGLFNBQVMsR0FBRyxZQUFZO1VBQ2pDLENBQUMsTUFBTSxJQUFJSyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3hCSCxNQUFNLENBQUNGLFNBQVMsR0FBRyxhQUFhO1VBQ2xDO1VBQ0FFLE1BQU0sQ0FBQ0ssV0FBVyxHQUFHLEdBQUc7UUFDMUIsQ0FBQyxNQUFNLElBQUlOLElBQUksS0FBSyxJQUFJLElBQUtBLElBQUksS0FBSyxJQUFJLElBQUksT0FBT0EsSUFBSSxLQUFLLFFBQVMsRUFBRTtVQUN2RUMsTUFBTSxDQUFDRixTQUFTLEdBQUcsY0FBYztVQUNqQ0UsTUFBTSxDQUFDVyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUV4QixHQUFHLENBQUN5QixhQUFhLENBQUM7UUFDckQsQ0FBQyxNQUFNLElBQUliLElBQUksS0FBSyxPQUFPLEVBQUU7VUFDM0JDLE1BQU0sQ0FBQ0YsU0FBUyxHQUFHLGNBQWM7VUFDakNFLE1BQU0sQ0FBQ0ssV0FBVyxHQUFHLEdBQUc7UUFDMUI7UUFDQVQsR0FBRyxDQUFDVSxXQUFXLENBQUNOLE1BQU0sQ0FBQztNQUN6QixDQUFDLENBQUM7TUFDRlYsYUFBYSxDQUFDZ0IsV0FBVyxDQUFDVixHQUFHLENBQUM7SUFDaEMsQ0FBQyxDQUFDO0VBQ0osQ0FBQztFQUNEZ0IsYUFBYSxFQUFFLE1BQU1DLEtBQUssSUFBSTtJQUM1QixNQUFNQyxTQUFTLEdBQUd2QixRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDbEQsTUFBTXVCLE1BQU0sR0FBR0YsS0FBSyxDQUFDRyxhQUFhLENBQUNDLFVBQVU7SUFDN0MsTUFBTUMsYUFBYSxHQUFHTCxLQUFLLENBQUNHLGFBQWE7SUFDekMsTUFBTUcsTUFBTSxHQUFHbEIsS0FBSyxDQUFDbUIsU0FBUyxDQUFDQyxPQUFPLENBQUNDLElBQUksQ0FBQ1AsTUFBTSxDQUFDUSxRQUFRLEVBQUVMLGFBQWEsQ0FBQztJQUMzRSxNQUFNTSxNQUFNLEdBQUd2QixLQUFLLENBQUNtQixTQUFTLENBQUNDLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDUixTQUFTLENBQUNTLFFBQVEsRUFBRVIsTUFBTSxDQUFDO0lBQ3ZFLElBQUlVLEdBQUcsR0FBR3RDLEdBQUcsQ0FBQ3FCLE9BQU8sQ0FBQ2tCLE1BQU0sQ0FBQ3ZDLEdBQUcsQ0FBQ3NCLE9BQU8sRUFBRWUsTUFBTSxFQUFFTCxNQUFNLENBQUM7SUFDekRoQyxHQUFHLENBQUNvQixpQkFBaUIsQ0FBQ3BCLEdBQUcsQ0FBQ3FCLE9BQU8sRUFBRXJCLEdBQUcsQ0FBQ3NCLE9BQU8sQ0FBQztJQUMvQ3RCLEdBQUcsQ0FBQ3dDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUN2QixJQUFJeEMsR0FBRyxDQUFDc0IsT0FBTyxDQUFDbUIsT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsT0FBT3pDLEdBQUcsQ0FBQzBDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsSUFBSUosR0FBRyxLQUFLLEtBQUssRUFBRTtNQUNqQnRDLEdBQUcsQ0FBQzJDLFVBQVUsQ0FBQyxDQUFDO01BQ2hCLE9BQU8sSUFBSSxFQUFFO1FBQ1gsTUFBTTNDLEdBQUcsQ0FBQzRDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDcEJOLEdBQUcsR0FBR3RDLEdBQUcsQ0FBQ3NCLE9BQU8sQ0FBQ3VCLFlBQVksQ0FBQzdDLEdBQUcsQ0FBQ3FCLE9BQU8sQ0FBQztRQUMzQ3JCLEdBQUcsQ0FBQ0MsWUFBWSxDQUFDRCxHQUFHLENBQUNxQixPQUFPLENBQUNFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdkN2QixHQUFHLENBQUN3QyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBSXhDLEdBQUcsQ0FBQ3FCLE9BQU8sQ0FBQ29CLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLE9BQU96QyxHQUFHLENBQUMwQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUlKLEdBQUcsS0FBSyxLQUFLLEVBQUU7VUFDakJ0QyxHQUFHLENBQUMyQyxVQUFVLENBQUMsQ0FBQztVQUNoQjtRQUNGO01BQ0Y7SUFDRjtJQUNBLE9BQU8sS0FBSztFQUNkLENBQUM7RUFDREMsS0FBS0EsQ0FBQ0UsRUFBRSxFQUFFO0lBQ1IsT0FBTyxJQUFJQyxPQUFPLENBQUNDLE9BQU8sSUFBSUMsVUFBVSxDQUFDRCxPQUFPLEVBQUVGLEVBQUUsQ0FBQyxDQUFDO0VBQ3hELENBQUM7RUFDREosU0FBU0EsQ0FBQ1EsTUFBTSxFQUFFO0lBQ2hCLE1BQU1DLE1BQU0sR0FBRy9DLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUMvQzhDLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDLENBQUM7SUFDbEIsTUFBTUMsT0FBTyxHQUFHRixNQUFNLENBQUM5QyxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ2hEZ0QsT0FBTyxDQUFDN0IsZ0JBQWdCLENBQUMsT0FBTyxFQUFFekIsNkNBQUksQ0FBQ3VELFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDbkRELE9BQU8sQ0FBQzdCLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO01BQ3RDMkIsTUFBTSxDQUFDSSxLQUFLLENBQUMsQ0FBQztJQUNoQixDQUFDLENBQUM7SUFDRixNQUFNQyxLQUFLLEdBQUdwRCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDOUNtRCxLQUFLLENBQUN0QyxXQUFXLEdBQUksVUFBU2dDLE1BQU8sU0FBUTtJQUM3QyxNQUFNTyxNQUFNLEdBQUdyRCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDaERvRCxNQUFNLENBQUN2QyxXQUFXLEdBQUksVUFBU2dDLE1BQU8sU0FBUTtJQUM5Q08sTUFBTSxDQUFDOUMsU0FBUyxHQUFHLFFBQVE7SUFDM0IsSUFBSXVDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDaEJPLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDQyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQzdCO0VBQ0YsQ0FBQztFQUNEaEIsVUFBVUEsQ0FBQSxFQUFHO0lBQ1gsTUFBTWlCLFFBQVEsR0FBR3hELFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxNQUFNd0QsV0FBVyxHQUFHRCxRQUFRLENBQUMxQyxXQUFXLENBQUM0QyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4RCxJQUFJRCxXQUFXLEtBQUssR0FBRyxFQUFFO01BQ3ZCRCxRQUFRLENBQUMxQyxXQUFXLEdBQUcsZUFBZTtNQUN0QzBDLFFBQVEsQ0FBQ2pELFNBQVMsR0FBRyxXQUFXO0lBQ2xDLENBQUMsTUFBTTtNQUNMaUQsUUFBUSxDQUFDMUMsV0FBVyxHQUFHLGVBQWU7TUFDdEMwQyxRQUFRLENBQUNqRCxTQUFTLEdBQUcsT0FBTztJQUM5QjtFQUNGLENBQUM7RUFDRG9ELFNBQVMsRUFBRXJDLEtBQUssSUFBSTtJQUNsQixNQUFNQyxTQUFTLEdBQUd2QixRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDbEQsTUFBTXVCLE1BQU0sR0FBR0YsS0FBSyxDQUFDRyxhQUFhLENBQUNDLFVBQVU7SUFDN0MsTUFBTUMsYUFBYSxHQUFHTCxLQUFLLENBQUNHLGFBQWE7SUFDekMsTUFBTUcsTUFBTSxHQUFHbEIsS0FBSyxDQUFDbUIsU0FBUyxDQUFDQyxPQUFPLENBQUNDLElBQUksQ0FBQ1AsTUFBTSxDQUFDUSxRQUFRLEVBQUVMLGFBQWEsQ0FBQztJQUMzRSxNQUFNTSxNQUFNLEdBQUd2QixLQUFLLENBQUNtQixTQUFTLENBQUNDLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDUixTQUFTLENBQUNTLFFBQVEsRUFBRVIsTUFBTSxDQUFDO0lBQ3ZFUCxPQUFPLENBQUNrQixNQUFNLENBQUNqQixPQUFPLEVBQUVlLE1BQU0sRUFBRUwsTUFBTSxDQUFDO0lBQ3ZDaEMsR0FBRyxDQUFDb0IsaUJBQWlCLENBQUNDLE9BQU8sRUFBRUMsT0FBTyxDQUFDO0lBQ3ZDLElBQUlBLE9BQU8sQ0FBQ21CLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLE9BQU8sY0FBYztJQUN0RHpDLEdBQUcsQ0FBQzJDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hCckIsT0FBTyxDQUFDdUIsWUFBWSxDQUFDeEIsT0FBTyxDQUFDO0lBQzdCckIsR0FBRyxDQUFDQyxZQUFZLENBQUNvQixPQUFPLENBQUNFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbkMsSUFBSUYsT0FBTyxDQUFDb0IsT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsT0FBTyxjQUFjO0lBQ3REekMsR0FBRyxDQUFDMkMsVUFBVSxDQUFDLENBQUM7SUFDaEIsT0FBTyxLQUFLO0VBQ2QsQ0FBQztFQUNESCxnQkFBZ0JBLENBQUN3QixTQUFTLEVBQUU7SUFDMUIsSUFBSUMsSUFBSTtJQUNSLElBQUlDLFVBQVU7SUFDZCxJQUFJRixTQUFTLEtBQUssQ0FBQyxFQUFFO01BQ25CQyxJQUFJLEdBQUc3RCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztNQUNqRDZELFVBQVUsR0FBR2xFLEdBQUcsQ0FBQ3FCLE9BQU8sQ0FBQzhDLGVBQWUsQ0FBQyxDQUFDO0lBQzVDLENBQUMsTUFBTTtNQUNMRixJQUFJLEdBQUc3RCxRQUFRLENBQUNDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztNQUNqRDZELFVBQVUsR0FBR2xFLEdBQUcsQ0FBQ3NCLE9BQU8sQ0FBQzZDLGVBQWUsQ0FBQyxDQUFDO0lBQzVDO0lBQ0FGLElBQUksQ0FBQy9DLFdBQVcsR0FBSSxlQUFjZ0QsVUFBVyxFQUFDO0VBQ2hEO0FBQ0YsQ0FBQztBQUVELCtEQUFlbEUsR0FBRzs7Ozs7Ozs7Ozs7OztBQ3RKTTtBQUNNO0FBRTlCLE1BQU1ELElBQUksR0FBRztFQUNYdUQsU0FBU0EsQ0FBQSxFQUFHO0lBQ1YsTUFBTWpDLE9BQU8sR0FBRytDLG1EQUFNLENBQUMsQ0FBQztJQUN4QixNQUFNOUMsT0FBTyxHQUFHOEMsbURBQU0sQ0FBQyxDQUFDO0lBQ3hCL0MsT0FBTyxDQUFDZ0QsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUM7SUFDMUNoRCxPQUFPLENBQUNnRCxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksQ0FBQztJQUMxQ2hELE9BQU8sQ0FBQ2dELFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDO0lBQzFDaEQsT0FBTyxDQUFDZ0QsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUM7SUFFeEMvQyxPQUFPLENBQUMrQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksQ0FBQztJQUMxQy9DLE9BQU8sQ0FBQytDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDO0lBQzFDL0MsT0FBTyxDQUFDK0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUM7SUFDMUMvQyxPQUFPLENBQUMrQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQztJQUV4Q3JFLDRDQUFHLENBQUNDLFlBQVksQ0FBQ29CLE9BQU8sQ0FBQ0UsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNuQ3ZCLDRDQUFHLENBQUNvQixpQkFBaUIsQ0FBQ0MsT0FBTyxFQUFFQyxPQUFPLENBQUM7RUFDekM7QUFDRixDQUFDO0FBRUQsK0RBQWV2QixJQUFJOzs7Ozs7Ozs7Ozs7QUN0Qk87QUFFMUIsTUFBTXdFLFVBQVUsR0FBRyxTQUFBQSxDQUFBLEVBQWtCO0VBQUEsSUFBUkMsQ0FBQyxHQUFBQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBRyxFQUFFO0VBQ2pDLE1BQU12RSxJQUFJLEdBQUcsRUFBRTtFQUVmLEtBQUssSUFBSTBFLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0osQ0FBQyxFQUFFSSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQzdCMUUsSUFBSSxDQUFDMEUsQ0FBQyxDQUFDLEdBQUcsRUFBRTtJQUNaLEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHTCxDQUFDLEVBQUVLLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDN0IzRSxJQUFJLENBQUMwRSxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEdBQUcsSUFBSTtJQUNuQjtFQUNGO0VBRUEsT0FBTzNFLElBQUk7QUFDYixDQUFDO0FBRUQsTUFBTTRFLFNBQVMsR0FBRyxTQUFTQyxlQUFlQSxDQUFBLEVBQUc7RUFDM0MsTUFBTTdFLElBQUksR0FBR3FFLFVBQVUsQ0FBQyxDQUFDO0VBQ3pCLE1BQU1GLFNBQVMsR0FBRyxTQUFBQSxDQUFVVyxLQUFLLEVBQUVOLE1BQU0sRUFBRU8sU0FBUyxFQUFFO0lBQ3BELE1BQU1DLE9BQU8sR0FBR1osaURBQUksQ0FBQ0ksTUFBTSxDQUFDO0lBQzVCLElBQUlPLFNBQVMsS0FBSyxVQUFVLEVBQUU7TUFDNUIsS0FBSyxJQUFJTCxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdNLE9BQU8sQ0FBQ1IsTUFBTSxFQUFFRSxDQUFDLElBQUksQ0FBQyxFQUFFMUUsSUFBSSxDQUFDOEUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBR0osQ0FBQyxDQUFDLEdBQUdNLE9BQU87SUFDcEYsQ0FBQyxNQUFNO01BQ0wsS0FBSyxJQUFJTixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdNLE9BQU8sQ0FBQ1IsTUFBTSxFQUFFRSxDQUFDLElBQUksQ0FBQyxFQUFFMUUsSUFBSSxDQUFDOEUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHSixDQUFDLENBQUMsQ0FBQ0ksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUdFLE9BQU87SUFDcEY7RUFDRixDQUFDO0VBQ0QsTUFBTUMsVUFBVSxHQUFHLFNBQUFBLENBQVVDLENBQUMsRUFBRUMsQ0FBQyxFQUFFO0lBQ2pDLE1BQU1DLEtBQUssR0FBR3BGLElBQUksQ0FBQ2tGLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUM7SUFDeEIsSUFBSUMsS0FBSyxLQUFLLElBQUksRUFBRTtNQUNsQnBGLElBQUksQ0FBQ2tGLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUMsR0FBRyxPQUFPO01BQ3BCLE9BQU8sS0FBSztJQUNkO0lBQ0FDLEtBQUssQ0FBQ0MsTUFBTSxDQUFDLENBQUM7SUFDZHJGLElBQUksQ0FBQ2tGLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRUMsS0FBSyxDQUFDO0lBQzNCLE9BQU9BLEtBQUs7RUFDZCxDQUFDO0VBRUQsTUFBTTdDLE9BQU8sR0FBRyxTQUFBQSxDQUFBLEVBQVk7SUFDMUIsSUFBSStDLE1BQU0sR0FBRyxJQUFJO0lBQ2pCdEYsSUFBSSxDQUFDSyxPQUFPLENBQUNDLElBQUksSUFBSTtNQUNuQkEsSUFBSSxDQUFDRCxPQUFPLENBQUNLLElBQUksSUFBSTtRQUNuQixJQUFJQSxJQUFJLEtBQUssSUFBSSxJQUFJLE9BQU9BLElBQUksS0FBSyxRQUFRLElBQUksQ0FBQ0UsS0FBSyxDQUFDQyxPQUFPLENBQUNILElBQUksQ0FBQyxFQUFFNEUsTUFBTSxHQUFHLEtBQUs7TUFDdkYsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBQ0YsT0FBT0EsTUFBTTtFQUNmLENBQUM7RUFFRCxNQUFNckIsZUFBZSxHQUFHLFNBQUFBLENBQUEsRUFBWTtJQUNsQyxNQUFNc0IsS0FBSyxHQUFHLEVBQUU7SUFDaEJ2RixJQUFJLENBQUNLLE9BQU8sQ0FBQ0MsSUFBSSxJQUFJO01BQ25CQSxJQUFJLENBQUNELE9BQU8sQ0FBQ0ssSUFBSSxJQUFJO1FBQ25CLElBQ0VBLElBQUksS0FBSyxJQUFJLElBQ2IsT0FBT0EsSUFBSSxLQUFLLFFBQVEsSUFDeEIsQ0FBQ0UsS0FBSyxDQUFDQyxPQUFPLENBQUNILElBQUksQ0FBQyxJQUNwQixDQUFDNkUsS0FBSyxDQUFDQyxRQUFRLENBQUM5RSxJQUFJLENBQUMsRUFDckI7VUFDQTZFLEtBQUssQ0FBQ0UsSUFBSSxDQUFDL0UsSUFBSSxDQUFDO1FBQ2xCO01BQ0YsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBQ0YsT0FBTzZFLEtBQUssQ0FBQ2YsTUFBTTtFQUNyQixDQUFDO0VBRUQsTUFBTW5ELE9BQU8sR0FBRyxTQUFBQSxDQUFBLEVBQVk7SUFDMUIsT0FBT3JCLElBQUk7RUFDYixDQUFDO0VBQ0QsT0FBTztJQUFFcUIsT0FBTztJQUFFOEMsU0FBUztJQUFFYyxVQUFVO0lBQUUxQyxPQUFPO0lBQUUwQjtFQUFnQixDQUFDO0FBQ3JFLENBQUM7QUFFRCwrREFBZVcsU0FBUzs7Ozs7Ozs7Ozs7O0FDckVZO0FBRXBDLE1BQU1WLE1BQU0sR0FBRyxTQUFBQSxDQUFBLEVBQVk7RUFDekIsTUFBTXdCLFNBQVMsR0FBR2Qsc0RBQVMsQ0FBQyxDQUFDO0VBRTdCLE1BQU1yQyxPQUFPLEdBQUcsU0FBQUEsQ0FBQSxFQUFZO0lBQzFCLE9BQU9tRCxTQUFTLENBQUNuRCxPQUFPLENBQUMsQ0FBQztFQUM1QixDQUFDO0VBRUQsTUFBTW9ELEdBQUcsR0FBRyxTQUFBQSxDQUFBLEVBQVk7SUFDdEIsT0FBTyxPQUFPO0VBQ2hCLENBQUM7RUFFRCxNQUFNeEIsU0FBUyxHQUFHLFNBQUFBLENBQVVXLEtBQUssRUFBRU4sTUFBTSxFQUFFTyxTQUFTLEVBQUU7SUFDcERXLFNBQVMsQ0FBQ3ZCLFNBQVMsQ0FBQ1csS0FBSyxFQUFFTixNQUFNLEVBQUVPLFNBQVMsQ0FBQztFQUMvQyxDQUFDO0VBRUQsTUFBTTFELE9BQU8sR0FBRyxTQUFBQSxDQUFBLEVBQVk7SUFDMUIsT0FBT3FFLFNBQVMsQ0FBQ3JFLE9BQU8sQ0FBQyxDQUFDO0VBQzVCLENBQUM7RUFFRCxNQUFNNEMsZUFBZSxHQUFHLFNBQUFBLENBQUEsRUFBWTtJQUNsQyxPQUFPeUIsU0FBUyxDQUFDekIsZUFBZSxDQUFDLENBQUM7RUFDcEMsQ0FBQztFQUVELE1BQU1nQixVQUFVLEdBQUcsU0FBQUEsQ0FBVUMsQ0FBQyxFQUFFQyxDQUFDLEVBQUU7SUFDakMsT0FBT08sU0FBUyxDQUFDVCxVQUFVLENBQUNDLENBQUMsRUFBRUMsQ0FBQyxDQUFDO0VBQ25DLENBQUM7RUFFRCxNQUFNOUMsTUFBTSxHQUFHLFNBQUFBLENBQVVXLE1BQU0sRUFBRWtDLENBQUMsRUFBRUMsQ0FBQyxFQUFFO0lBQ3JDLE1BQU0vQyxHQUFHLEdBQUdZLE1BQU0sQ0FBQ2lDLFVBQVUsQ0FBQ0MsQ0FBQyxFQUFFQyxDQUFDLENBQUM7SUFDbkMsSUFBSW5DLE1BQU0sQ0FBQ1QsT0FBTyxDQUFDLENBQUMsRUFBRTtNQUNwQixPQUFPb0QsR0FBRyxDQUFDLENBQUM7SUFDZDtJQUNBLE9BQU92RCxHQUFHO0VBQ1osQ0FBQztFQUVELE1BQU1PLFlBQVksR0FBRyxTQUFBQSxDQUFVSyxNQUFNLEVBQUU7SUFDckMsSUFBSWtDLENBQUM7SUFDTCxJQUFJQyxDQUFDO0lBQ0wsT0FBTyxJQUFJLEVBQUU7TUFDWEQsQ0FBQyxHQUFHVSxJQUFJLENBQUNDLEtBQUssQ0FBQ0QsSUFBSSxDQUFDRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUNsQ1gsQ0FBQyxHQUFHUyxJQUFJLENBQUNDLEtBQUssQ0FBQ0QsSUFBSSxDQUFDRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUNsQyxJQUFJLE9BQU85QyxNQUFNLENBQUMzQixPQUFPLENBQUMsQ0FBQyxDQUFDNkQsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDdkUsS0FBSyxDQUFDQyxPQUFPLENBQUNtQyxNQUFNLENBQUMzQixPQUFPLENBQUMsQ0FBQyxDQUFDNkQsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDeEY7TUFDRjtJQUNGO0lBQ0EsT0FBTzlDLE1BQU0sQ0FBQ1csTUFBTSxFQUFFa0MsQ0FBQyxFQUFFQyxDQUFDLENBQUM7RUFDN0IsQ0FBQztFQUVELE9BQU87SUFBRTVDLE9BQU87SUFBRTRCLFNBQVM7SUFBRTlDLE9BQU87SUFBRTRELFVBQVU7SUFBRTVDLE1BQU07SUFBRXNELEdBQUc7SUFBRWhELFlBQVk7SUFBRXNCO0VBQWdCLENBQUM7QUFDaEcsQ0FBQztBQUVELCtEQUFlQyxNQUFNOzs7Ozs7Ozs7OztBQ3JEckIsTUFBTUUsSUFBSSxHQUFHLFNBQVMyQixVQUFVQSxDQUFDQyxVQUFVLEVBQUU7RUFDM0MsTUFBTXhCLE1BQU0sR0FBR3dCLFVBQVU7RUFDekIsSUFBSUMsSUFBSSxHQUFHLENBQUM7RUFDWixNQUFNWixNQUFNLEdBQUcsU0FBQUEsQ0FBQSxFQUFZO0lBQ3pCWSxJQUFJLElBQUksQ0FBQztJQUNULE9BQU9BLElBQUk7RUFDYixDQUFDO0VBQ0QsTUFBTWxGLE1BQU0sR0FBRyxTQUFBQSxDQUFBLEVBQVk7SUFDekIsSUFBSWtGLElBQUksS0FBS3pCLE1BQU0sRUFBRSxPQUFPLElBQUk7SUFDaEMsT0FBTyxLQUFLO0VBQ2QsQ0FBQztFQUNELE9BQU87SUFBRUEsTUFBTTtJQUFFYSxNQUFNO0lBQUV0RTtFQUFPLENBQUM7QUFDbkMsQ0FBQztBQUVELCtEQUFlcUQsSUFBSTs7Ozs7Ozs7Ozs7Ozs7O0FDZG5CO0FBQzBHO0FBQ2pCO0FBQ3pGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0Y7QUFDQSxrRUFBa0UsMkJBQTJCLElBQUksVUFBVSxZQUFZLGFBQWEsR0FBRyxZQUFZLG1CQUFtQixzQ0FBc0MsbURBQW1ELEdBQUcsd0NBQXdDLGlCQUFpQixrQkFBa0IsR0FBRyx1Q0FBdUMsZ0JBQWdCLEdBQUcsaUNBQWlDLDRCQUE0QixHQUFHLGdCQUFnQixrQkFBa0IsR0FBRyxRQUFRLDJCQUEyQixHQUFHLGtDQUFrQywyQ0FBMkMsbUJBQW1CLEdBQUcsWUFBWSw0Q0FBNEMsR0FBRyxlQUFlLHFCQUFxQixZQUFZLFVBQVUsZ0JBQWdCLHNCQUFzQiwwQkFBMEIsWUFBWSxjQUFjLGdCQUFnQiwwQkFBMEIsZUFBZSxrQkFBa0IsR0FBRyxrQkFBa0IsZUFBZSxrQkFBa0IseUNBQXlDLEdBQUcsd0JBQXdCLHVDQUF1QyxHQUFHLDJCQUEyQix3QkFBd0IscUJBQXFCLGtCQUFrQiwwQkFBMEIsMEJBQTBCLHNCQUFzQiw2QkFBNkIsc0JBQXNCLHVCQUF1Qix3QkFBd0Isc0JBQXNCLEdBQUcsVUFBVSx3QkFBd0IsbUJBQW1CLDRCQUE0Qix1QkFBdUIsR0FBRyxXQUFXLHNCQUFzQixtQkFBbUIseUJBQXlCLHdDQUF3QyxhQUFhLEdBQUcsT0FBTyx1QkFBdUIsc0JBQXNCLEdBQUcsU0FBUyxzQ0FBc0MsYUFBYSxtQkFBbUIsNEJBQTRCLHlCQUF5QixjQUFjLHNCQUFzQixHQUFHLFdBQVcsd0JBQXdCLHlDQUF5Qyw4QkFBOEIsc0JBQXNCLHlCQUF5QixHQUFHLGdCQUFnQiw0QkFBNEIsdUNBQXVDLEdBQUcsb0JBQW9CLG1CQUFtQix5QkFBeUIsNkJBQTZCLGVBQWUsR0FBRyxhQUFhLGtCQUFrQiw0QkFBNEIsR0FBRyxvQkFBb0IsbUJBQW1CLDRCQUE0QixHQUFHLGVBQWUsbUJBQW1CLHlCQUF5QixjQUFjLEdBQUcsbUJBQW1CLG1CQUFtQiw0QkFBNEIsdUJBQXVCLHNCQUFzQix5QkFBeUIsR0FBRyxxQkFBcUIsaUJBQWlCLHdCQUF3QixtQkFBbUIseUJBQXlCLDZCQUE2QixHQUFHLFdBQVcsbUJBQW1CLHVCQUF1QixrQkFBa0IsMkNBQTJDLHdCQUF3QixHQUFHLG1CQUFtQixtQkFBbUIsaUJBQWlCLDBCQUEwQix1QkFBdUIsNkJBQTZCLEdBQUcscUJBQXFCLGdCQUFnQix3QkFBd0IsR0FBRyxVQUFVLG1CQUFtQiw0QkFBNEIsZ0JBQWdCLGtCQUFrQixHQUFHLFlBQVksMkNBQTJDLDJDQUEyQyxpQkFBaUIsaUJBQWlCLDRDQUE0QyxHQUFHLCtCQUErQix3Q0FBd0Msc0JBQXNCLEdBQUcsaUJBQWlCLHVDQUF1Qyw4Q0FBOEMsd0JBQXdCLEdBQUcsa0JBQWtCLG1CQUFtQiwyQkFBMkIscUJBQXFCLEdBQUcsaUJBQWlCLHVDQUF1Qyw4Q0FBOEMsbUJBQW1CLDJCQUEyQixxQkFBcUIsc0JBQXNCLEdBQUcsa0JBQWtCLHdDQUF3Qyw4Q0FBOEMsbUJBQW1CLDJCQUEyQixxQkFBcUIsc0JBQXNCLEdBQUcsVUFBVSxtQkFBbUIsNEJBQTRCLHlCQUF5Qix1QkFBdUIsc0JBQXNCLDhCQUE4QixHQUFHLHVCQUF1Qiw2Q0FBNkMsR0FBRyxjQUFjLDRCQUE0QixHQUFHLDJCQUEyQiwyQ0FBMkMsR0FBRyxpQkFBaUIsY0FBYyxlQUFlLHNDQUFzQyxrQkFBa0Isa0JBQWtCLHNDQUFzQyxrQkFBa0Isa0NBQWtDLHlCQUF5QixHQUFHLHNCQUFzQixpQkFBaUIsa0JBQWtCLG1CQUFtQiw0QkFBNEIseUJBQXlCLDZCQUE2QixlQUFlLEdBQUcsWUFBWSxxQkFBcUIsOEJBQThCLG1CQUFtQix5Q0FBeUMseUJBQXlCLEdBQUcsZ0JBQWdCLDRCQUE0Qix1Q0FBdUMsR0FBRyxhQUFhLHVCQUF1Qix3QkFBd0IsMkNBQTJDLGtCQUFrQixtQkFBbUIseUJBQXlCLG1CQUFtQiw0QkFBNEIsR0FBRyxtQkFBbUIsbUNBQW1DLGdDQUFnQyxHQUFHLFNBQVMsZ0ZBQWdGLFlBQVksUUFBUSxLQUFLLFVBQVUsVUFBVSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsUUFBUSxLQUFLLFVBQVUsVUFBVSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssWUFBWSxRQUFRLEtBQUssVUFBVSxPQUFPLEtBQUssWUFBWSxVQUFVLFlBQVksS0FBSyxZQUFZLGFBQWEsYUFBYSxRQUFRLEtBQUssWUFBWSxhQUFhLFFBQVEsS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsVUFBVSxZQUFZLFdBQVcsVUFBVSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksUUFBUSxLQUFLLFlBQVksT0FBTyxXQUFXLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksVUFBVSxLQUFLLFVBQVUsVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsa0RBQWtELDJCQUEyQixJQUFJLFVBQVUsWUFBWSxhQUFhLEdBQUcsWUFBWSxtQkFBbUIsc0NBQXNDLG1EQUFtRCxHQUFHLHdDQUF3QyxpQkFBaUIsa0JBQWtCLEdBQUcsdUNBQXVDLGdCQUFnQixHQUFHLGlDQUFpQyw0QkFBNEIsR0FBRyxnQkFBZ0Isa0JBQWtCLEdBQUcsUUFBUSwyQkFBMkIsR0FBRyxrQ0FBa0MsMkNBQTJDLG1CQUFtQixHQUFHLFlBQVksNENBQTRDLEdBQUcsZUFBZSxxQkFBcUIsWUFBWSxVQUFVLGdCQUFnQixzQkFBc0IsMEJBQTBCLFlBQVksY0FBYyxnQkFBZ0IsMEJBQTBCLGVBQWUsa0JBQWtCLEdBQUcsa0JBQWtCLGVBQWUsa0JBQWtCLHlDQUF5QyxHQUFHLHdCQUF3Qix1Q0FBdUMsR0FBRywyQkFBMkIsd0JBQXdCLHFCQUFxQixrQkFBa0IsMEJBQTBCLDBCQUEwQixzQkFBc0IsNkJBQTZCLHNCQUFzQix1QkFBdUIsd0JBQXdCLHNCQUFzQixHQUFHLFVBQVUsd0JBQXdCLG1CQUFtQiw0QkFBNEIsdUJBQXVCLEdBQUcsV0FBVyxzQkFBc0IsbUJBQW1CLHlCQUF5Qix3Q0FBd0MsYUFBYSxHQUFHLE9BQU8sdUJBQXVCLHNCQUFzQixHQUFHLFNBQVMsc0NBQXNDLGFBQWEsbUJBQW1CLDRCQUE0Qix5QkFBeUIsY0FBYyxzQkFBc0IsR0FBRyxXQUFXLHdCQUF3Qix5Q0FBeUMsOEJBQThCLHNCQUFzQix5QkFBeUIsR0FBRyxnQkFBZ0IsNEJBQTRCLHVDQUF1QyxHQUFHLG9CQUFvQixtQkFBbUIseUJBQXlCLDZCQUE2QixlQUFlLEdBQUcsYUFBYSxrQkFBa0IsNEJBQTRCLEdBQUcsb0JBQW9CLG1CQUFtQiw0QkFBNEIsR0FBRyxlQUFlLG1CQUFtQix5QkFBeUIsY0FBYyxHQUFHLG1CQUFtQixtQkFBbUIsNEJBQTRCLHVCQUF1QixzQkFBc0IseUJBQXlCLEdBQUcscUJBQXFCLGlCQUFpQix3QkFBd0IsbUJBQW1CLHlCQUF5Qiw2QkFBNkIsR0FBRyxXQUFXLG1CQUFtQix1QkFBdUIsa0JBQWtCLDJDQUEyQyx3QkFBd0IsR0FBRyxtQkFBbUIsbUJBQW1CLGlCQUFpQiwwQkFBMEIsdUJBQXVCLDZCQUE2QixHQUFHLHFCQUFxQixnQkFBZ0Isd0JBQXdCLEdBQUcsVUFBVSxtQkFBbUIsNEJBQTRCLGdCQUFnQixrQkFBa0IsR0FBRyxZQUFZLDJDQUEyQywyQ0FBMkMsaUJBQWlCLGlCQUFpQiw0Q0FBNEMsR0FBRywrQkFBK0Isd0NBQXdDLHNCQUFzQixHQUFHLGlCQUFpQix1Q0FBdUMsOENBQThDLHdCQUF3QixHQUFHLGtCQUFrQixtQkFBbUIsMkJBQTJCLHFCQUFxQixHQUFHLGlCQUFpQix1Q0FBdUMsOENBQThDLG1CQUFtQiwyQkFBMkIscUJBQXFCLHNCQUFzQixHQUFHLGtCQUFrQix3Q0FBd0MsOENBQThDLG1CQUFtQiwyQkFBMkIscUJBQXFCLHNCQUFzQixHQUFHLFVBQVUsbUJBQW1CLDRCQUE0Qix5QkFBeUIsdUJBQXVCLHNCQUFzQiw4QkFBOEIsR0FBRyx1QkFBdUIsNkNBQTZDLEdBQUcsY0FBYyw0QkFBNEIsR0FBRywyQkFBMkIsMkNBQTJDLEdBQUcsaUJBQWlCLGNBQWMsZUFBZSxzQ0FBc0Msa0JBQWtCLGtCQUFrQixzQ0FBc0Msa0JBQWtCLGtDQUFrQyx5QkFBeUIsR0FBRyxzQkFBc0IsaUJBQWlCLGtCQUFrQixtQkFBbUIsNEJBQTRCLHlCQUF5Qiw2QkFBNkIsZUFBZSxHQUFHLFlBQVkscUJBQXFCLDhCQUE4QixtQkFBbUIseUNBQXlDLHlCQUF5QixHQUFHLGdCQUFnQiw0QkFBNEIsdUNBQXVDLEdBQUcsYUFBYSx1QkFBdUIsd0JBQXdCLDJDQUEyQyxrQkFBa0IsbUJBQW1CLHlCQUF5QixtQkFBbUIsNEJBQTRCLEdBQUcsbUJBQW1CLG1DQUFtQyxnQ0FBZ0MsR0FBRyxxQkFBcUI7QUFDbDlaO0FBQ0EsK0RBQWUsdUJBQXVCLEVBQUM7Ozs7Ozs7Ozs7O0FDUDFCOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0EscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzRkFBc0YscUJBQXFCO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixpREFBaUQscUJBQXFCO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzREFBc0QscUJBQXFCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNwRmE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxjQUFjO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkQSxNQUErRjtBQUMvRixNQUFxRjtBQUNyRixNQUE0RjtBQUM1RixNQUErRztBQUMvRyxNQUF3RztBQUN4RyxNQUF3RztBQUN4RyxNQUFtRztBQUNuRztBQUNBOztBQUVBOztBQUVBLDRCQUE0QixxR0FBbUI7QUFDL0Msd0JBQXdCLGtIQUFhOztBQUVyQyx1QkFBdUIsdUdBQWE7QUFDcEM7QUFDQSxpQkFBaUIsK0ZBQU07QUFDdkIsNkJBQTZCLHNHQUFrQjs7QUFFL0MsYUFBYSwwR0FBRyxDQUFDLHNGQUFPOzs7O0FBSTZDO0FBQ3JFLE9BQU8sK0RBQWUsc0ZBQU8sSUFBSSxzRkFBTyxVQUFVLHNGQUFPLG1CQUFtQixFQUFDOzs7Ozs7Ozs7OztBQzFCaEU7O0FBRWI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiw2QkFBNkI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNuRmE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDakNhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNUYTs7QUFFYjtBQUNBO0FBQ0EsY0FBYyxLQUF3QyxHQUFHLHNCQUFpQixHQUFHLENBQUk7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1RhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSxlQUFlLDRCQUE0QjtXQUMzQyxlQUFlO1dBQ2YsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBLDhDQUE4Qzs7Ozs7V0NBOUM7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7Ozs7QUNBcUI7QUFDRztBQUNNO0FBQ0o7O0FBRTFCO0FBQ0E7O0FBRUF2RSw2Q0FBSSxDQUFDdUQsU0FBUyxDQUFDLENBQUM7O0FBRWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsOEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG5jb25zdCBkb20gPSB7XG4gIHBvcHVsYXRlR3JpZChncmlkKSB7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMScpO1xuICAgIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gJ2xpbmUnO1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaWYgKHNsb3QgPT09IG51bGwpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSc7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzbG90KSkge1xuICAgICAgICAgIGNvbnN0IHN1bmsgPSBzbG90WzFdLmlzU3VuaygpO1xuICAgICAgICAgIGlmIChzdW5rID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgaGl0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKHN1bmsgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHN1bmsnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ICE9PSBudWxsICYmIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHNoaXAnO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgPT09ICd3YXRlcicpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSB3YXRlcic7XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH1cbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgICB9KTtcbiAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9KTtcbiAgfSxcbiAgcG9wdWxhdGVFbmVteUdyaWQocGxheWVyMSwgcGxheWVyMikge1xuICAgIHRoaXMucGxheWVyMSA9IHBsYXllcjE7XG4gICAgdGhpcy5wbGF5ZXIyID0gcGxheWVyMjtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWQyJyk7XG4gICAgY29uc3QgZ3JpZCA9IHRoaXMucGxheWVyMi5nZXRHcmlkKCk7XG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBncmlkLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSAnbGluZSc7XG4gICAgICBsaW5lLmZvckVhY2goc2xvdCA9PiB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzbG90KSkge1xuICAgICAgICAgIGNvbnN0IHN1bmsgPSBzbG90WzFdLmlzU3VuaygpO1xuICAgICAgICAgIGlmIChzdW5rID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3F1YXJlLmNsYXNzTmFtZSA9ICdzcXVhcmUgaGl0JztcbiAgICAgICAgICB9IGVsc2UgaWYgKHN1bmsgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNxdWFyZS5jbGFzc05hbWUgPSAnc3F1YXJlIHN1bmsnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSAn4pyYJztcbiAgICAgICAgfSBlbHNlIGlmIChzbG90ID09PSBudWxsIHx8IChzbG90ICE9PSBudWxsICYmIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSBlbXB0eSc7XG4gICAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZG9tLnNxdWFyZUNsaWNrZWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHNsb3QgPT09ICd3YXRlcicpIHtcbiAgICAgICAgICBzcXVhcmUuY2xhc3NOYW1lID0gJ3NxdWFyZSB3YXRlcic7XG4gICAgICAgICAgc3F1YXJlLnRleHRDb250ZW50ID0gJ+KcmCc7XG4gICAgICAgIH1cbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgICB9KTtcbiAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9KTtcbiAgfSxcbiAgc3F1YXJlQ2xpY2tlZDogYXN5bmMgZXZlbnQgPT4ge1xuICAgIGNvbnN0IGVuZW15R3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMicpO1xuICAgIGNvbnN0IGNvbHVtbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZTtcbiAgICBjb25zdCBjbGlja2VkU3F1YXJlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICBjb25zdCBpbmRleFkgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGNvbHVtbi5jaGlsZHJlbiwgY2xpY2tlZFNxdWFyZSk7XG4gICAgY29uc3QgaW5kZXhYID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChlbmVteUdyaWQuY2hpbGRyZW4sIGNvbHVtbik7XG4gICAgbGV0IGhpdCA9IGRvbS5wbGF5ZXIxLmF0dGFjayhkb20ucGxheWVyMiwgaW5kZXhYLCBpbmRleFkpO1xuICAgIGRvbS5wb3B1bGF0ZUVuZW15R3JpZChkb20ucGxheWVyMSwgZG9tLnBsYXllcjIpO1xuICAgIGRvbS51cGRhdGVCb2F0c0FsaXZlKDIpO1xuICAgIGlmIChkb20ucGxheWVyMi5hbGxTdW5rKCkgIT09IGZhbHNlKSByZXR1cm4gZG9tLnBsYXllcldvbigxKTtcbiAgICBpZiAoaGl0ID09PSBmYWxzZSkge1xuICAgICAgZG9tLnRvZ2dsZVR1cm4oKTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGF3YWl0IGRvbS5kZWxheSg1MDApO1xuICAgICAgICBoaXQgPSBkb20ucGxheWVyMi5yYW5kb21BdHRhY2soZG9tLnBsYXllcjEpO1xuICAgICAgICBkb20ucG9wdWxhdGVHcmlkKGRvbS5wbGF5ZXIxLmdldEdyaWQoKSk7XG4gICAgICAgIGRvbS51cGRhdGVCb2F0c0FsaXZlKDEpO1xuICAgICAgICBpZiAoZG9tLnBsYXllcjEuYWxsU3VuaygpICE9PSBmYWxzZSkgcmV0dXJuIGRvbS5wbGF5ZXJXb24oMik7XG4gICAgICAgIGlmIChoaXQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgZG9tLnRvZ2dsZVR1cm4oKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIGRlbGF5KG1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuICB9LFxuICBwbGF5ZXJXb24ocGxheWVyKSB7XG4gICAgY29uc3QgZGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGlhbG9nJyk7XG4gICAgZGlhbG9nLnNob3dNb2RhbCgpO1xuICAgIGNvbnN0IHJlc3RhcnQgPSBkaWFsb2cucXVlcnlTZWxlY3RvcignLnJlc3RhcnQnKTtcbiAgICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZ2FtZS5zdGFydEdhbWUoKSk7XG4gICAgcmVzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgIH0pO1xuICAgIGNvbnN0IHR1cm5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm5zJyk7XG4gICAgdHVybnMudGV4dENvbnRlbnQgPSBgUGxheWVyICR7cGxheWVyfSB3b24hISFgO1xuICAgIGNvbnN0IHdpbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5uZXInKTtcbiAgICB3aW5uZXIudGV4dENvbnRlbnQgPSBgUGxheWVyICR7cGxheWVyfSB3b24hISFgO1xuICAgIHdpbm5lci5jbGFzc05hbWUgPSAnd2lubmVyJztcbiAgICBpZiAocGxheWVyID09PSAyKSB7XG4gICAgICB3aW5uZXIuY2xhc3NMaXN0LmFkZCgndHdvJyk7XG4gICAgfVxuICB9LFxuICB0b2dnbGVUdXJuKCkge1xuICAgIGNvbnN0IGRpdlR1cm5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnR1cm5zJyk7XG4gICAgY29uc3QgY3VycmVudFR1cm4gPSBkaXZUdXJucy50ZXh0Q29udGVudC5zdWJzdHJpbmcoNywgOCk7XG4gICAgaWYgKGN1cnJlbnRUdXJuID09PSAnMScpIHtcbiAgICAgIGRpdlR1cm5zLnRleHRDb250ZW50ID0gJ1BsYXllciAyIHR1cm4nO1xuICAgICAgZGl2VHVybnMuY2xhc3NOYW1lID0gJ3R1cm5zIHJlZCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpdlR1cm5zLnRleHRDb250ZW50ID0gJ1BsYXllciAxIHR1cm4nO1xuICAgICAgZGl2VHVybnMuY2xhc3NOYW1lID0gJ3R1cm5zJztcbiAgICB9XG4gIH0sXG4gIHN0YXJ0TG9vcDogZXZlbnQgPT4ge1xuICAgIGNvbnN0IGVuZW15R3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkMicpO1xuICAgIGNvbnN0IGNvbHVtbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZTtcbiAgICBjb25zdCBjbGlja2VkU3F1YXJlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICBjb25zdCBpbmRleFkgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGNvbHVtbi5jaGlsZHJlbiwgY2xpY2tlZFNxdWFyZSk7XG4gICAgY29uc3QgaW5kZXhYID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChlbmVteUdyaWQuY2hpbGRyZW4sIGNvbHVtbik7XG4gICAgcGxheWVyMS5hdHRhY2socGxheWVyMiwgaW5kZXhYLCBpbmRleFkpO1xuICAgIGRvbS5wb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKTtcbiAgICBpZiAocGxheWVyMi5hbGxTdW5rKCkgIT09IGZhbHNlKSByZXR1cm4gJ1BsYXllciAxIHdvbic7XG4gICAgZG9tLnRvZ2dsZVR1cm4oKTtcbiAgICBwbGF5ZXIyLnJhbmRvbUF0dGFjayhwbGF5ZXIxKTtcbiAgICBkb20ucG9wdWxhdGVHcmlkKHBsYXllcjEuZ2V0R3JpZCgpKTtcbiAgICBpZiAocGxheWVyMS5hbGxTdW5rKCkgIT09IGZhbHNlKSByZXR1cm4gJ1BsYXllciAyIHdvbic7XG4gICAgZG9tLnRvZ2dsZVR1cm4oKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHVwZGF0ZUJvYXRzQWxpdmUocGxheWVyTnVtKSB7XG4gICAgbGV0IHBhcmE7XG4gICAgbGV0IGJvYXRzQWxpdmU7XG4gICAgaWYgKHBsYXllck51bSA9PT0gMSkge1xuICAgICAgcGFyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcy1hbGl2ZS5vbmUnKTtcbiAgICAgIGJvYXRzQWxpdmUgPSBkb20ucGxheWVyMS5jb3VudEJvYXRzQWxpdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwcy1hbGl2ZS50d28nKTtcbiAgICAgIGJvYXRzQWxpdmUgPSBkb20ucGxheWVyMi5jb3VudEJvYXRzQWxpdmUoKTtcbiAgICB9XG4gICAgcGFyYS50ZXh0Q29udGVudCA9IGBBbGl2ZSBzaGlwcyAke2JvYXRzQWxpdmV9YDtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRvbTtcbiIsImltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5cbmNvbnN0IGdhbWUgPSB7XG4gIHN0YXJ0R2FtZSgpIHtcbiAgICBjb25zdCBwbGF5ZXIxID0gUGxheWVyKCk7XG4gICAgY29uc3QgcGxheWVyMiA9IFBsYXllcigpO1xuICAgIHBsYXllcjEucGxhY2VTaGlwKFsxLCAzXSwgNCwgJ2hvcml6b250YWwnKTtcbiAgICBwbGF5ZXIxLnBsYWNlU2hpcChbNywgM10sIDMsICdob3Jpem9udGFsJyk7XG4gICAgcGxheWVyMS5wbGFjZVNoaXAoWzgsIDhdLCAyLCAnaG9yaXpvbnRhbCcpO1xuICAgIHBsYXllcjEucGxhY2VTaGlwKFsxLCA1XSwgMiwgJ3ZlcnRpY2FsJyk7XG5cbiAgICBwbGF5ZXIyLnBsYWNlU2hpcChbMSwgM10sIDQsICdob3Jpem9udGFsJyk7XG4gICAgcGxheWVyMi5wbGFjZVNoaXAoWzcsIDNdLCAzLCAnaG9yaXpvbnRhbCcpO1xuICAgIHBsYXllcjIucGxhY2VTaGlwKFs4LCA4XSwgMiwgJ2hvcml6b250YWwnKTtcbiAgICBwbGF5ZXIyLnBsYWNlU2hpcChbMSwgNV0sIDIsICd2ZXJ0aWNhbCcpO1xuXG4gICAgZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSk7XG4gICAgZG9tLnBvcHVsYXRlRW5lbXlHcmlkKHBsYXllcjEsIHBsYXllcjIpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcCc7XG5cbmNvbnN0IGNyZWF0ZUdyaWQgPSBmdW5jdGlvbiAobiA9IDEwKSB7XG4gIGNvbnN0IGdyaWQgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xuICAgIGdyaWRbaV0gPSBbXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG47IGogKz0gMSkge1xuICAgICAgZ3JpZFtpXVtqXSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdyaWQ7XG59O1xuXG5jb25zdCBHYW1lYm9hcmQgPSBmdW5jdGlvbiBjcmVhdGVHYW1lYm9hcmQoKSB7XG4gIGNvbnN0IGdyaWQgPSBjcmVhdGVHcmlkKCk7XG4gIGNvbnN0IHBsYWNlU2hpcCA9IGZ1bmN0aW9uIChzdGFydCwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICBjb25zdCBzaGlwT2JqID0gU2hpcChsZW5ndGgpO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcE9iai5sZW5ndGg7IGkgKz0gMSkgZ3JpZFtzdGFydFswXV1bc3RhcnRbMV0gKyBpXSA9IHNoaXBPYmo7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcE9iai5sZW5ndGg7IGkgKz0gMSkgZ3JpZFtzdGFydFswXSArIGldW3N0YXJ0WzFdXSA9IHNoaXBPYmo7XG4gICAgfVxuICB9O1xuICBjb25zdCByZWNlaXZlSGl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdyaWRbeF1beV07XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICBncmlkW3hdW3ldID0gJ3dhdGVyJztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFsdWUuYWRkSGl0KCk7XG4gICAgZ3JpZFt4XVt5XSA9IFsnaGl0JywgdmFsdWVdO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBjb25zdCBhbGxTdW5rID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuICAgIGdyaWQuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGxpbmUuZm9yRWFjaChzbG90ID0+IHtcbiAgICAgICAgaWYgKHNsb3QgIT09IG51bGwgJiYgdHlwZW9mIHNsb3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHNsb3QpKSByZXN1bHQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgY29uc3QgY291bnRCb2F0c0FsaXZlID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGJvYXRzID0gW107XG4gICAgZ3JpZC5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgbGluZS5mb3JFYWNoKHNsb3QgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgc2xvdCAhPT0gbnVsbCAmJlxuICAgICAgICAgIHR5cGVvZiBzbG90ID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICFBcnJheS5pc0FycmF5KHNsb3QpICYmXG4gICAgICAgICAgIWJvYXRzLmluY2x1ZGVzKHNsb3QpXG4gICAgICAgICkge1xuICAgICAgICAgIGJvYXRzLnB1c2goc2xvdCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBib2F0cy5sZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ3JpZDtcbiAgfTtcbiAgcmV0dXJuIHsgZ2V0R3JpZCwgcGxhY2VTaGlwLCByZWNlaXZlSGl0LCBhbGxTdW5rLCBjb3VudEJvYXRzQWxpdmUgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSAnLi9nYW1lYm9hcmQnO1xuXG5jb25zdCBQbGF5ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IEdhbWVib2FyZCgpO1xuXG4gIGNvbnN0IGFsbFN1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5hbGxTdW5rKCk7XG4gIH07XG5cbiAgY29uc3Qgd2luID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnSSB3b24nO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IGZ1bmN0aW9uIChzdGFydCwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwKHN0YXJ0LCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gIH07XG5cbiAgY29uc3QgZ2V0R3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLmdldEdyaWQoKTtcbiAgfTtcblxuICBjb25zdCBjb3VudEJvYXRzQWxpdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdhbWVib2FyZC5jb3VudEJvYXRzQWxpdmUoKTtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlSGl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICByZXR1cm4gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoeCwgeSk7XG4gIH07XG5cbiAgY29uc3QgYXR0YWNrID0gZnVuY3Rpb24gKHBsYXllciwgeCwgeSkge1xuICAgIGNvbnN0IGhpdCA9IHBsYXllci5yZWNlaXZlSGl0KHgsIHkpO1xuICAgIGlmIChwbGF5ZXIuYWxsU3VuaygpKSB7XG4gICAgICByZXR1cm4gd2luKCk7XG4gICAgfVxuICAgIHJldHVybiBoaXQ7XG4gIH07XG5cbiAgY29uc3QgcmFuZG9tQXR0YWNrID0gZnVuY3Rpb24gKHBsYXllcikge1xuICAgIGxldCB4O1xuICAgIGxldCB5O1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIGlmICh0eXBlb2YgcGxheWVyLmdldEdyaWQoKVt4XVt5XSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkocGxheWVyLmdldEdyaWQoKVt4XVt5XSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhdHRhY2socGxheWVyLCB4LCB5KTtcbiAgfTtcblxuICByZXR1cm4geyBhbGxTdW5rLCBwbGFjZVNoaXAsIGdldEdyaWQsIHJlY2VpdmVIaXQsIGF0dGFjaywgd2luLCByYW5kb21BdHRhY2ssIGNvdW50Qm9hdHNBbGl2ZSB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY29uc3QgU2hpcCA9IGZ1bmN0aW9uIGNyZWF0ZVNoaXAoc2hpcExlbmd0aCkge1xuICBjb25zdCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xuICBsZXQgaGl0cyA9IDA7XG4gIGNvbnN0IGFkZEhpdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBoaXRzICs9IDE7XG4gICAgcmV0dXJuIGhpdHM7XG4gIH07XG4gIGNvbnN0IGlzU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGl0cyA9PT0gbGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIHJldHVybiB7IGxlbmd0aCwgYWRkSGl0LCBpc1N1bmsgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIiosICo6OmJlZm9yZSwgKjo6YWZ0ZXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gfVxcbiBcXG5cXG4qIHtcXG5tYXJnaW46IDA7XFxucGFkZGluZzogMDtcXG59XFxuXFxuXFxuYm9keSB7XFxubGluZS1oZWlnaHQ6IDEuNTtcXG4td2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG5mb250LWZhbWlseTogJ1J1YmlrIEJ1YmJsZXMnLCBDb3VyaWVyLCBtb25vc3BhY2U7XFxufVxcblxcblxcbmltZywgcGljdHVyZSwgdmlkZW8sIGNhbnZhcywgc3ZnIHtcXG5kaXNwbGF5OiBibG9jaztcXG5tYXgtd2lkdGg6IDEwMCU7XFxufVxcblxcblxcbmlucHV0LCBidXR0b24sIHRleHRhcmVhLCBzZWxlY3Qge1xcbmZvbnQ6IGluaGVyaXQ7XFxufVxcblxcblxcbnAsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcbm92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XFxufVxcblxcblxcbmJ1dHRvbiwgYXtcXG5jdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcblxcbmF7XFxuICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5cXG5cXG5cXG4vKiBGb290ZXIgKi9cXG5cXG5cXG5odG1sIHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbnBvc2l0aW9uOiByZWxhdGl2ZTtcXG5taW4taGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5cXG5ib2R5IHtcXG4vKiBmb290ZXIgc3VwcG9ydCAqL1xcbm1hcmdpbi1ib3R0b206IDQ4cHg7XFxufVxcblxcblxcbi5mb290ZXIge1xcbnBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5ib3R0b206IDA7XFxubGVmdDogMDtcXG5kaXNwbGF5OiBmbGV4O1xcbmFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuanVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuZ2FwOiAxMHB4O1xcbndpZHRoOiAxMDAlO1xcbnBhZGRpbmc6IDEwcHg7XFxuYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMThweDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1YiB7XFxuY29sb3I6IHdoaXRlO1xcbmZvbnQtc2l6ZTogMjJweDtcXG50cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcXG59XFxuXFxuXFxuLmZhLWdpdGh1Yjpob3ZlciB7XFxudHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKSBzY2FsZSgxLjIpO1xcbn1cXG5cXG4vKiBTdHlsaW5nICovXFxuXFxuOnJvb3R7XFxuIC0taGVhZGVyLWJnOiAjM0QzRDNEO1xcbiAtLW1haW4tYmc6IzMwMzAzMDtcXG4gLS10ZXh0OiNGRkZGRkY7XFxuIC0tZ3JpZC1ib3JkZXJzOiMwMDJDNjY7XFxuIC0tZ3JpZC1zcXVhcmVzOiMyMzg5REE7XFxuIC0tbXktYm9hdHM6IzgwODA4MDtcXG4gLS1teS1ib2F0cy1ib3JkZXI6IzQ2NDY0NjtcXG4gLS1zaGlwLWhpdDojRjgyNzI3O1xcbiAtLXNoaXAtc3VuazojRDE2MDYwO1xcbiAtLWdyZWVuLXRleHQ6IzJCQzU1NztcXG4gLS1yZWQtdGV4dDojRTIzNjM2O1xcbn1cXG5cXG5ib2R5IHtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG5oZWFkZXJ7XFxuICAgcGFkZGluZzogMnZoIDJ2dztcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGVhZGVyLWJnKTtcXG4gICBmbGV4OiAxO1xcbn1cXG5cXG5oMXtcXG4gICBmb250LXNpemU6IDIuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbn1cXG5cXG5tYWlue1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIGZsZXg6IDc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1dmg7XFxuICAgcGFkZGluZzogNXZoIDBweDtcXG59XFxuXFxuLnR1cm5ze1xcbiAgIHBhZGRpbmc6IDEwcHggMzBweDtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgZm9udC1zaXplOiAycmVtOztcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG5cXG4udHVybnMucmVkIHtcXG4gICBjb2xvcjogdmFyKC0tcmVkLXRleHQpO1xcbiAgIGJvcmRlcjogMnB4IHJpZGdlIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmdyaWQtY29udGFpbmVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdnc7XFxufVxcblxcbi53cmFwcGVye1xcbiAgIGRpc3BsYXk6ZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ubnVtYmVyLXdyYXBwZXJ7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4ueS13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBnYXA6IDVweDtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXN7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIG1pbi1oZWlnaHQ6IDcwdmg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnktY29vcmRpbmF0ZXMgcHtcXG4gICBoZWlnaHQ6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uZ3JpZCB7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhc3BlY3QtcmF0aW86IDEvMTtcXG4gICBoZWlnaHQ6IDcwdmg7XFxuICAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tZ3JpZC1ib3JkZXJzKTtcXG4gICBib3JkZXItcmFkaXVzOiA2cHg7XFxufVxcblxcbi54LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgd2lkdGg6IDcwdmg7XFxuICAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxuICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi54LWNvb3JkaW5hdGVzIHB7XFxuICAgd2lkdGg6IDd2aDtcXG4gICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5saW5le1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICB3aWR0aDogMTAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG59XFxuXFxuLnNxdWFyZXtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMCU7XFxuICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XFxufVxcblxcbiNncmlkMiAuc3F1YXJlLmVtcHR5OmhvdmVye1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxMTAsIDgsIDE5NCk7XFxuICAgY3Vyc29yOmNyb3NzaGFpcjtcXG59XFxuXFxuLnNxdWFyZS5zaGlwe1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15LWJvYXRzKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDhweDtcXG59XFxuXFxuLnNxdWFyZS53YXRlcntcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDJyZW07XFxufVxcblxcbi5zcXVhcmUuaGl0IHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLWhpdCk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBkaXNwbGF5OiBncmlkO1xcbiAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgZm9udC13ZWlnaHQ6IDgwMDtcXG59XFxuXFxuLnNxdWFyZS5zdW5rIHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwLXN1bmspO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5pbmZve1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mbyAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbn1cXG5cXG4uaW5mby50d297XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuLmluZm8udHdvIC5zaGlwcy1hbGl2ZXtcXG4gICBib3JkZXItdG9wOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG5cXG5cXG5cXG5kaWFsb2d7XFxuICAgdG9wOiA1MCU7XFxuICAgbGVmdDogNTAlO1xcbiAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgIGhlaWdodDogNTB2aDtcXG4gICB3aWR0aDogMTAwdnc7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1iZyk7XFxuICAgb3BhY2l0eTogMC45O1xcbiAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlc21va2U7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuLmRpYWxvZy1jb250YWluZXJ7XFxuICAgd2lkdGg6IDEwMCU7XFxuICAgaGVpZ2h0OiAxMDAlO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgIGdhcDogMTB2aDtcXG59XFxuXFxuLndpbm5lcntcXG4gICBmb250LXNpemU6IDNyZW07XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIHBhZGRpbmc6IDIwcHg7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgYm9yZGVyLXJhZGl1czogMTJweDtcXG59XFxuXFxuLndpbm5lci50d297XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5yZXN0YXJ0e1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmlkLXNxdWFyZXMpO1xcbiAgIGJvcmRlcjogbm9uZTtcXG4gICBvdXRsaW5lOiBub25lO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgcGFkZGluZzogMTBweDtcXG4gICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgO1xcbn1cXG5cXG4ucmVzdGFydDpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXh0KTtcXG4gICBjb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG59XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHNCQUFzQjtDQUN2Qjs7O0FBR0Q7QUFDQSxTQUFTO0FBQ1QsVUFBVTtBQUNWOzs7QUFHQTtBQUNBLGdCQUFnQjtBQUNoQixtQ0FBbUM7QUFDbkMsZ0RBQWdEO0FBQ2hEOzs7QUFHQTtBQUNBLGNBQWM7QUFDZCxlQUFlO0FBQ2Y7OztBQUdBO0FBQ0EsYUFBYTtBQUNiOzs7QUFHQTtBQUNBLHlCQUF5QjtBQUN6Qjs7O0FBR0E7QUFDQSxlQUFlO0FBQ2Y7OztBQUdBO0dBQ0cscUJBQXFCO0FBQ3hCOzs7OztBQUtBLFdBQVc7OztBQUdYO0FBQ0EsbUJBQW1CO0FBQ25CLGtCQUFrQjtBQUNsQixnQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0EsbUJBQW1CO0FBQ25C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Qjs7QUFFQTtHQUNHLHFDQUFxQztBQUN4Qzs7Ozs7QUFLQTtHQUNHLFFBQVE7R0FDUixTQUFTO0dBQ1QsZ0NBQWdDO0dBQ2hDLFlBQVk7R0FDWixZQUFZO0dBQ1osZ0NBQWdDO0dBQ2hDLFlBQVk7R0FDWiw0QkFBNEI7R0FDNUIsbUJBQW1CO0FBQ3RCOztBQUVBO0dBQ0csV0FBVztHQUNYLFlBQVk7R0FDWixhQUFhO0dBQ2Isc0JBQXNCO0dBQ3RCLG1CQUFtQjtHQUNuQix1QkFBdUI7R0FDdkIsU0FBUztBQUNaOztBQUVBO0dBQ0csZUFBZTtHQUNmLHdCQUF3QjtHQUN4QixhQUFhO0dBQ2IsbUNBQW1DO0dBQ25DLG1CQUFtQjtBQUN0Qjs7QUFFQTtHQUNHLHNCQUFzQjtHQUN0QixpQ0FBaUM7QUFDcEM7O0FBRUE7R0FDRyxpQkFBaUI7R0FDakIsa0JBQWtCO0dBQ2xCLHFDQUFxQztHQUNyQyxZQUFZO0dBQ1osYUFBYTtHQUNiLG1CQUFtQjtHQUNuQixhQUFhO0dBQ2Isc0JBQXNCO0FBQ3pCOztBQUVBO0dBQ0csNkJBQTZCO0dBQzdCLDBCQUEwQjtBQUM3QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLCAqOjpiZWZvcmUsICo6OmFmdGVyIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuIH1cXG4gXFxuXFxuKiB7XFxubWFyZ2luOiAwO1xcbnBhZGRpbmc6IDA7XFxufVxcblxcblxcbmJvZHkge1xcbmxpbmUtaGVpZ2h0OiAxLjU7XFxuLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxuZm9udC1mYW1pbHk6ICdSdWJpayBCdWJibGVzJywgQ291cmllciwgbW9ub3NwYWNlO1xcbn1cXG5cXG5cXG5pbWcsIHBpY3R1cmUsIHZpZGVvLCBjYW52YXMsIHN2ZyB7XFxuZGlzcGxheTogYmxvY2s7XFxubWF4LXdpZHRoOiAxMDAlO1xcbn1cXG5cXG5cXG5pbnB1dCwgYnV0dG9uLCB0ZXh0YXJlYSwgc2VsZWN0IHtcXG5mb250OiBpbmhlcml0O1xcbn1cXG5cXG5cXG5wLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXG5vdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xcbn1cXG5cXG5cXG5idXR0b24sIGF7XFxuY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5cXG5he1xcbiAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuXFxuXFxuXFxuLyogRm9vdGVyICovXFxuXFxuXFxuaHRtbCB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5wb3NpdGlvbjogcmVsYXRpdmU7XFxubWluLWhlaWdodDogMTAwJTtcXG59XFxuXFxuXFxuYm9keSB7XFxuLyogZm9vdGVyIHN1cHBvcnQgKi9cXG5tYXJnaW4tYm90dG9tOiA0OHB4O1xcbn1cXG5cXG5cXG4uZm9vdGVyIHtcXG5wb3NpdGlvbjogYWJzb2x1dGU7XFxuYm90dG9tOiAwO1xcbmxlZnQ6IDA7XFxuZGlzcGxheTogZmxleDtcXG5hbGlnbi1pdGVtczogY2VudGVyO1xcbmp1c3RpZnktY29udGVudDogY2VudGVyO1xcbmdhcDogMTBweDtcXG53aWR0aDogMTAwJTtcXG5wYWRkaW5nOiAxMHB4O1xcbmJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDE4cHg7XFxufVxcblxcblxcbi5mYS1naXRodWIge1xcbmNvbG9yOiB3aGl0ZTtcXG5mb250LXNpemU6IDIycHg7XFxudHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XFxufVxcblxcblxcbi5mYS1naXRodWI6aG92ZXIge1xcbnRyYW5zZm9ybTogcm90YXRlKDM2MGRlZykgc2NhbGUoMS4yKTtcXG59XFxuXFxuLyogU3R5bGluZyAqL1xcblxcbjpyb290e1xcbiAtLWhlYWRlci1iZzogIzNEM0QzRDtcXG4gLS1tYWluLWJnOiMzMDMwMzA7XFxuIC0tdGV4dDojRkZGRkZGO1xcbiAtLWdyaWQtYm9yZGVyczojMDAyQzY2O1xcbiAtLWdyaWQtc3F1YXJlczojMjM4OURBO1xcbiAtLW15LWJvYXRzOiM4MDgwODA7XFxuIC0tbXktYm9hdHMtYm9yZGVyOiM0NjQ2NDY7XFxuIC0tc2hpcC1oaXQ6I0Y4MjcyNztcXG4gLS1zaGlwLXN1bms6I0QxNjA2MDtcXG4gLS1ncmVlbi10ZXh0OiMyQkM1NTc7XFxuIC0tcmVkLXRleHQ6I0UyMzYzNjtcXG59XFxuXFxuYm9keSB7XFxuICAgY29sb3I6IHZhcigtLXRleHQpO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBtaW4taGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuaGVhZGVye1xcbiAgIHBhZGRpbmc6IDJ2aCAydnc7XFxuICAgZGlzcGxheTogZmxleDtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhlYWRlci1iZyk7XFxuICAgZmxleDogMTtcXG59XFxuXFxuaDF7XFxuICAgZm9udC1zaXplOiAyLjVyZW07XFxuICAgZm9udC13ZWlnaHQ6IDUwMDtcXG59XFxuXFxubWFpbntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWJnKTtcXG4gICBmbGV4OiA3O1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgIGdhcDogNXZoO1xcbiAgIHBhZGRpbmc6IDV2aCAwcHg7XFxufVxcblxcbi50dXJuc3tcXG4gICBwYWRkaW5nOiAxMHB4IDMwcHg7XFxuICAgYm9yZGVyOiAycHggcmlkZ2UgdmFyKC0tZ3JlZW4tdGV4dCk7XFxuICAgY29sb3I6IHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGZvbnQtc2l6ZTogMnJlbTs7XFxuICAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuLnR1cm5zLnJlZCB7XFxuICAgY29sb3I6IHZhcigtLXJlZC10ZXh0KTtcXG4gICBib3JkZXI6IDJweCByaWRnZSB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5ncmlkLWNvbnRhaW5lcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgZ2FwOiAxMHZ3O1xcbn1cXG5cXG4ud3JhcHBlcntcXG4gICBkaXNwbGF5OmZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLm51bWJlci13cmFwcGVye1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLnktd3JhcHBlcntcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgZ2FwOiA1cHg7XFxufVxcblxcbi55LWNvb3JkaW5hdGVze1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBtaW4taGVpZ2h0OiA3MHZoO1xcbiAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi55LWNvb3JkaW5hdGVzIHB7XFxuICAgaGVpZ2h0OiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmdyaWQge1xcbiAgIGRpc3BsYXk6IGZsZXg7XFxuICAgYXNwZWN0LXJhdGlvOiAxLzE7XFxuICAgaGVpZ2h0OiA3MHZoO1xcbiAgIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLWdyaWQtYm9yZGVycyk7XFxuICAgYm9yZGVyLXJhZGl1czogNnB4O1xcbn1cXG5cXG4ueC1jb29yZGluYXRlc3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIHdpZHRoOiA3MHZoO1xcbiAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xcbiAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4ueC1jb29yZGluYXRlcyBwe1xcbiAgIHdpZHRoOiA3dmg7XFxuICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ubGluZXtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgd2lkdGg6IDEwJTtcXG4gICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbi5zcXVhcmV7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1ncmlkLWJvcmRlcnMpO1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAlO1xcbiAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xcbn1cXG5cXG4jZ3JpZDIgLnNxdWFyZS5lbXB0eTpob3ZlcntcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTEwLCA4LCAxOTQpO1xcbiAgIGN1cnNvcjpjcm9zc2hhaXI7XFxufVxcblxcbi5zcXVhcmUuc2hpcHtcXG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teS1ib2F0cyk7XFxuICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tbXktYm9hdHMtYm9yZGVyKTtcXG4gICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcblxcbi5zcXVhcmUud2F0ZXJ7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAycmVtO1xcbn1cXG5cXG4uc3F1YXJlLmhpdCB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1oaXQpO1xcbiAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcigtLW15LWJvYXRzLWJvcmRlcik7XFxuICAgZGlzcGxheTogZ3JpZDtcXG4gICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxufVxcblxcbi5zcXVhcmUuc3VuayB7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1zdW5rKTtcXG4gICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1teS1ib2F0cy1ib3JkZXIpO1xcbiAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgcGxhY2UtY29udGVudDogY2VudGVyO1xcbiAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICBmb250LXdlaWdodDogODAwO1xcbn1cXG5cXG4uaW5mb3tcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBmb250LXdlaWdodDogNTAwO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8gLnNoaXBzLWFsaXZle1xcbiAgIGJvcmRlci10b3A6IDJweCBzb2xpZCB2YXIoLS1ncmVlbi10ZXh0KTtcXG59XFxuXFxuLmluZm8udHdve1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxufVxcblxcbi5pbmZvLnR3byAuc2hpcHMtYWxpdmV7XFxuICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLXJlZC10ZXh0KTtcXG59XFxuXFxuXFxuXFxuXFxuZGlhbG9ne1xcbiAgIHRvcDogNTAlO1xcbiAgIGxlZnQ6IDUwJTtcXG4gICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gICBoZWlnaHQ6IDUwdmg7XFxuICAgd2lkdGg6IDEwMHZ3O1xcbiAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmcpO1xcbiAgIG9wYWNpdHk6IDAuOTtcXG4gICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZXNtb2tlO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcbi5kaWFsb2ctY29udGFpbmVye1xcbiAgIHdpZHRoOiAxMDAlO1xcbiAgIGhlaWdodDogMTAwJTtcXG4gICBkaXNwbGF5OiBmbGV4O1xcbiAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICBnYXA6IDEwdmg7XFxufVxcblxcbi53aW5uZXJ7XFxuICAgZm9udC1zaXplOiAzcmVtO1xcbiAgIGNvbG9yOiB2YXIoLS1ncmVlbi10ZXh0KTtcXG4gICBwYWRkaW5nOiAyMHB4O1xcbiAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyZWVuLXRleHQpO1xcbiAgIGJvcmRlci1yYWRpdXM6IDEycHg7XFxufVxcblxcbi53aW5uZXIudHdve1xcbiAgIGNvbG9yOiB2YXIoLS1yZWQtdGV4dCk7XFxuICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tcmVkLXRleHQpO1xcbn1cXG5cXG4ucmVzdGFydHtcXG4gICBmb250LXNpemU6IDEuNXJlbTtcXG4gICBjb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JpZC1zcXVhcmVzKTtcXG4gICBib3JkZXI6IG5vbmU7XFxuICAgb3V0bGluZTogbm9uZTtcXG4gICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgIHBhZGRpbmc6IDEwcHg7XFxuICAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIDtcXG59XFxuXFxuLnJlc3RhcnQ6aG92ZXJ7XFxuICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGV4dCk7XFxuICAgY29sb3I6IHZhcigtLWdyaWQtc3F1YXJlcyk7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZTsgfTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgJy4vc3R5bGUuY3NzJztcbmltcG9ydCBkb20gZnJvbSAnLi9kb20nO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG4vLyBjb25zdCBkaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaWFsb2cnKTtcbi8vIGRpYWxvZy5zaG93TW9kYWwoKTtcblxuZ2FtZS5zdGFydEdhbWUoKTtcblxuLy8gY29uc3QgcGxheWVyMSA9IFBsYXllcigpO1xuLy8gY29uc3QgcGxheWVyMiA9IFBsYXllcigpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzEsIDNdLCA0LCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzcsIDNdLCAzLCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzgsIDhdLCAyLCAnaG9yaXpvbnRhbCcpO1xuLy8gcGxheWVyMS5wbGFjZVNoaXAoWzEsIDVdLCAyLCAndmVydGljYWwnKTtcbi8vIHBsYXllcjIuYXR0YWNrKHBsYXllcjEsIDEsIDUpO1xuLy8gcGxheWVyMi5hdHRhY2socGxheWVyMSwgMSwgNik7XG4vLyBwbGF5ZXIyLmF0dGFjayhwbGF5ZXIxLCAxLCAzKTtcbi8vIHBsYXllcjIuYXR0YWNrKHBsYXllcjEsIDksIDkpO1xuXG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbMSwgM10sIDQsICdob3Jpem9udGFsJyk7XG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbNywgM10sIDMsICdob3Jpem9udGFsJyk7XG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbOCwgOF0sIDIsICdob3Jpem9udGFsJyk7XG4vLyBwbGF5ZXIyLnBsYWNlU2hpcChbMSwgNV0sIDIsICd2ZXJ0aWNhbCcpO1xuLy8gcGxheWVyMS5hdHRhY2socGxheWVyMiwgMSwgNSk7XG4vLyBwbGF5ZXIxLmF0dGFjayhwbGF5ZXIyLCAxLCA2KTtcbi8vIHBsYXllcjEuYXR0YWNrKHBsYXllcjIsIDEsIDMpO1xuLy8gcGxheWVyMS5hdHRhY2socGxheWVyMiwgOSwgOSk7XG5cbi8vIGRvbS5wb3B1bGF0ZUVuZW15R3JpZChwbGF5ZXIxLCBwbGF5ZXIyKTtcblxuLy8gZG9tLnBvcHVsYXRlR3JpZChwbGF5ZXIxLmdldEdyaWQoKSk7XG4vLyBsZXQgZmluaXNoID0gZmFsc2U7XG4vLyB3aGlsZSAoZmluaXNoID09PSBmYWxzZSkge1xuLy8gICBmaW5pc2ggPSBkb20ubGlzdGVuRm9yQ2xpY2socGxheWVyMSwgcGxheWVyMik7XG4vLyB9XG5cbi8vIGdhbWVib2FyZC5yZWNlaXZlSGl0KDEsIDMpO1xuLy8gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoMiwgMyk7XG4vLyBnYW1lYm9hcmQucmVjZWl2ZUhpdCgzLCAzKTtcbi8vIGNvbnNvbGUubG9nKGdhbWVib2FyZC5hbGxTdW5rKCkpO1xuLy8gY29uc3Qgc2hpcDEgPSBTaGlwKDMpO1xuLy8gY29uc29sZS5sb2coc2hpcDEuYWRkSGl0KCkpO1xuXG4vLyBjb25zb2xlLmxvZyhnYW1lYm9hcmQuZ3JpZFsxXVszXSk7XG4vLyBjb25zb2xlLmxvZyhzaGlwMSk7XG4vLyBjb25zb2xlLmxvZyhnYW1lYm9hcmQuZ3JpZFsxXVszXSA9PT0gc2hpcDEpO1xuLy8gZ2FtZWJvYXJkLnJlY2VpdmVIaXQoMSwgMyk7XG4iXSwibmFtZXMiOlsiZ2FtZSIsImRvbSIsInBvcHVsYXRlR3JpZCIsImdyaWQiLCJncmlkQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiaW5uZXJIVE1MIiwiZm9yRWFjaCIsImxpbmUiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwic2xvdCIsInNxdWFyZSIsIkFycmF5IiwiaXNBcnJheSIsInN1bmsiLCJpc1N1bmsiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicG9wdWxhdGVFbmVteUdyaWQiLCJwbGF5ZXIxIiwicGxheWVyMiIsImdldEdyaWQiLCJhZGRFdmVudExpc3RlbmVyIiwic3F1YXJlQ2xpY2tlZCIsImV2ZW50IiwiZW5lbXlHcmlkIiwiY29sdW1uIiwiY3VycmVudFRhcmdldCIsInBhcmVudE5vZGUiLCJjbGlja2VkU3F1YXJlIiwiaW5kZXhZIiwicHJvdG90eXBlIiwiaW5kZXhPZiIsImNhbGwiLCJjaGlsZHJlbiIsImluZGV4WCIsImhpdCIsImF0dGFjayIsInVwZGF0ZUJvYXRzQWxpdmUiLCJhbGxTdW5rIiwicGxheWVyV29uIiwidG9nZ2xlVHVybiIsImRlbGF5IiwicmFuZG9tQXR0YWNrIiwibXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJwbGF5ZXIiLCJkaWFsb2ciLCJzaG93TW9kYWwiLCJyZXN0YXJ0Iiwic3RhcnRHYW1lIiwiY2xvc2UiLCJ0dXJucyIsIndpbm5lciIsImNsYXNzTGlzdCIsImFkZCIsImRpdlR1cm5zIiwiY3VycmVudFR1cm4iLCJzdWJzdHJpbmciLCJzdGFydExvb3AiLCJwbGF5ZXJOdW0iLCJwYXJhIiwiYm9hdHNBbGl2ZSIsImNvdW50Qm9hdHNBbGl2ZSIsIlBsYXllciIsInBsYWNlU2hpcCIsIlNoaXAiLCJjcmVhdGVHcmlkIiwibiIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImkiLCJqIiwiR2FtZWJvYXJkIiwiY3JlYXRlR2FtZWJvYXJkIiwic3RhcnQiLCJkaXJlY3Rpb24iLCJzaGlwT2JqIiwicmVjZWl2ZUhpdCIsIngiLCJ5IiwidmFsdWUiLCJhZGRIaXQiLCJyZXN1bHQiLCJib2F0cyIsImluY2x1ZGVzIiwicHVzaCIsImdhbWVib2FyZCIsIndpbiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNyZWF0ZVNoaXAiLCJzaGlwTGVuZ3RoIiwiaGl0cyJdLCJzb3VyY2VSb290IjoiIn0=