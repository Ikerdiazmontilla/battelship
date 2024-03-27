import dom from './dom';
import Player from './player';

const game = {
  startGame() {
    const player1 = Player();
    const player2 = Player();
    player2.placeShipRandom(5);
    player2.placeShipRandom(4);
    player2.placeShipRandom(3);
    player2.placeShipRandom(3);
    player2.placeShipRandom(2);
    // player2.placeShip([6, 2], 4, 'horizontal');
    // player2.placeShip([6, 6], 3, 'horizontal');
    // player2.placeShip([1, 5], 3, 'vertical');
    // player2.placeShip([7, 0], 2, 'horizontal');
    dom.showStartingDialog(player1, player2);
    // player1.placeShip([1, 3], 4, 'horizontal');
    // player1.placeShip([7, 3], 3, 'horizontal');
    // player1.placeShip([8, 8], 2, 'horizontal');
    // player1.placeShip([1, 5], 2, 'vertical');
  },
};

export default game;
