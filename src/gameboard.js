import Ship from './ship';
import createGrid from './create-grid';
import isPositionValidForShip from './isPositionValidForShip';

const Gameboard = function createGameboard() {
  let grid = createGrid();

  const placeShip = function (start, length, direction) {
    const shipObj = Ship(length);
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
      isValid = isPositionValidForShip(x, y, direction, length, grid);
    }
    this.placeShip([x, y], length, direction);
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
        if (
          slot !== null &&
          typeof slot === 'object' &&
          !Array.isArray(slot) &&
          !boats.includes(slot)
        ) {
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
    countBoatsAlive,
  };
};

export default Gameboard;
