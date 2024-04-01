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

export default createGrid;
