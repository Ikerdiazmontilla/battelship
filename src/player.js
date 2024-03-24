import Gameboard from './gameboard';

const Player = function () {
  const gameboard = Gameboard();

  const allSunk = function () {
    return gameboard.allSunk();
  };

  const win = function () {
    return 'I won';
  };

  const placeShip = function (start, length, direction) {
    gameboard.placeShip(start, length, direction);
  };

  const getGrid = function () {
    return gameboard.getGrid();
  };

  const receiveHit = function (x, y) {
    gameboard.receiveHit(x, y);
  };

  const attack = function (player, x, y) {
    player.receiveHit(x, y);
    if (player.allSunk()) {
      return win();
    }
    return false;
  };

  const randomAttack = function (player) {
    let x;
    let y;
    while (true) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      if (typeof player.getGrid()[x][y] === 'object' && !Array.isArray(player.getGrid()[x][y])) {
        break;
      }
    }
    return attack(player, x, y);
  };

  return { allSunk, placeShip, getGrid, receiveHit, attack, win, randomAttack };
};

export default Player;
