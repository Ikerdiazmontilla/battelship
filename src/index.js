import './style.css';
import dom from './dom';

import Player from './player';

const player1 = Player();
const player2 = Player();
player1.placeShip([1, 3], 4, 'horizontal');
player1.placeShip([7, 3], 3, 'horizontal');
player1.placeShip([8, 8], 2, 'horizontal');
player1.placeShip([1, 5], 2, 'vertical');
player2.attack(player1, 1, 5);
player2.attack(player1, 1, 6);
player2.attack(player1, 1, 3);
player2.attack(player1, 9, 9);

dom.populateGrid(player1.getGrid());

player2.placeShip([1, 3], 4, 'horizontal');
player2.placeShip([7, 3], 3, 'horizontal');
player2.placeShip([8, 8], 2, 'horizontal');
player2.placeShip([1, 5], 2, 'vertical');
player1.attack(player2, 1, 5);
player1.attack(player2, 1, 6);
player1.attack(player2, 1, 3);
player1.attack(player2, 9, 9);

dom.populateEnemyGrid(player2.getGrid());

// dom.populateGrid(player2.getGrid(), 2);
// let finish = false;
// while (finish === false) {
//   finish = player1.randomAttack(player2);
//   finish = player2.randomAttack(player1);
//   console.log(player1.getGrid());
//   console.log(player2.getGrid());
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
