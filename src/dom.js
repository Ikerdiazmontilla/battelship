import EventHandler from './eventHandler';

const dom = {
  direction: 'horizontal',
  showGrid(gridContainer, grid, playerNumber) {
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
            square.addEventListener('click', EventHandler.onSquareClicked);
          }
        }
        div.appendChild(square);
      });
      gridContainer.appendChild(div);
    });
  },

  populateGrid(grid, start = false) {
    let gridContainer = document.querySelector('#grid1');
    if (start === true) {
      gridContainer = document.querySelector('#grid-place');
    }
    dom.showGrid(gridContainer, grid, 1);
  },
  populateEnemyGrid(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    const gridContainer = document.querySelector('#grid2');
    const grid = this.player2.getGrid();
    dom.showGrid(gridContainer, grid, 2);
  },
  delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
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
    para.textContent = `Alive ships: ${boatsAlive}`;
  },
  dragAndDrop(player) {
    const boats = document.querySelectorAll('.boat');
    boats.forEach(boat => {
      boat.addEventListener('dragstart', EventHandler.onDrag);
      boat.draggable = true;
      boat.style.opacity = '1';
    });

    EventHandler.addGridListeners(player);
  },
  prepareNewGame() {
    const divTurns = document.querySelector('.turns');
    divTurns.textContent = 'Player 1 turn';
    divTurns.className = 'turns';
    const shipsAlive = document.querySelectorAll('.ships-alive');
    shipsAlive.forEach(div => {
      div.textContent = 'Alive ships: 5';
    });
  },
  showStartingDialog(player1, player2) {
    dom.prepareNewGame();
    dom.populateGrid(player1.getGrid(), true);
    const dialogPlace = document.querySelector('.place-ships');
    dialogPlace.showModal();
    dom.dragAndDrop(player1);
    EventHandler.addEventListeners(player1, player2);
  },
};

export default dom;
