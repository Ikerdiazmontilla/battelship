import dom from './dom';
import Player from './player';

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
    const player1 = Player();
    const player2 = Player();
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
  }
};

export default game;
