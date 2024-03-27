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

      isEmpty = (function () {
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
      })();
    }
    const shipObj = Ship(length);
    if (direction === 'vertical') {
      for (let i = 0; i < shipObj.length; i += 1) grid[x][y + i] = shipObj;
    } else {
      for (let i = 0; i < shipObj.length; i += 1) grid[x + i][y] = shipObj;
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
  return { getGrid, placeShip, placeShipRandom, receiveHit, allSunk, countBoatsAlive };
};

export default Gameboard;
