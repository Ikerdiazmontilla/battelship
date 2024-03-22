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

  const randomAttack = function () {
    
  };

  return { allSunk, placeShip, getGrid, receiveHit, attack, win };
};

export default Player;
