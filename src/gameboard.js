import Ship from './ship';

const createGrid = function (n = 10) {
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
    const shipObj = Ship(length);
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
  return { getGrid, placeShip, receiveHit, allSunk, countBoatsAlive };
};

export default Gameboard;
