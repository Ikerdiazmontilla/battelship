import EventHandler from './eventHandler';

const showGrid = function (gridContainer, grid, playerNumber, isMultiplayer = false) {
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
        if (slot === null || (slot !== null && typeof slot === 'object')) {
          square.className = 'square empty';
          if (isMultiplayer === true) {
            square.addEventListener('click', EventHandler.onMultiplayerSquareClicked);
          } else {
            square.addEventListener('click', EventHandler.onSquareClicked);
          }
        }
      }
      div.appendChild(square);
    });
    gridContainer.appendChild(div);
  });
};

export default showGrid;
