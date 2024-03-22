import './style.css';
// import Ship from './ship';
// import Gameboard from './gameboard';
import Player from './player';

const player1 = Player();
player1.placeShip([1, 3], 3, 'horizontal');
console.log(player1.getGrid());
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
