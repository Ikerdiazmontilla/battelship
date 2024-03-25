import dom from './dom';
import Player from './player';

const game = {
  startGame() {
    const player1 = Player();
    const player2 = Player();
    player1.placeShip([1, 3], 4, 'horizontal');
    player1.placeShip([7, 3], 3, 'horizontal');
    player1.placeShip([8, 8], 2, 'horizontal');
    player1.placeShip([1, 5], 2, 'vertical');

    player2.placeShip([1, 3], 4, 'horizontal');
    player2.placeShip([7, 3], 3, 'horizontal');
    player2.placeShip([8, 8], 2, 'horizontal');
    player2.placeShip([1, 5], 2, 'vertical');

    dom.populateGrid(player1.getGrid());
    dom.populateEnemyGrid(player1, player2);
  },
};

export default game;