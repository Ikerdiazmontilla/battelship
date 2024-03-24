import Ship from './ship';
// import index from './index';
import Gameboard from './gameboard';
import Player from './player';

describe('ship testing', () => {
  const ship1 = Ship(3);
  test('ship works', () => {
    expect(ship1.isSunk()).toBe(false);
    ship1.addHit();
    expect(ship1.isSunk()).toBe(false);
    ship1.addHit();
    ship1.addHit();
    expect(ship1.isSunk()).toBe(true);
  });
});

describe('gameboard Logic', () => {
  let gameboard;
  beforeEach(() => {
    gameboard = Gameboard();
    gameboard.placeShip([1, 3], 3, 'horizontal');
  });
  test('ship placement', () => {
    expect(typeof gameboard.getGrid()[1][3]).not.toBeNull();
    expect(typeof gameboard.getGrid()[2][3]).toEqual('object');
    expect(typeof gameboard.getGrid()[3][3]).toEqual('object');
  });

  test('receive hit', () => {
    gameboard.receiveHit(1, 3);
    gameboard.receiveHit(2, 8);
    expect(gameboard.getGrid()[1][3][0]).toBe('hit');
    expect(gameboard.getGrid()[2][8]).toBe('water');
    expect(typeof gameboard.receiveHit(2, 3)).toEqual('object');
  });

  test('all sunk', () => {
    gameboard.receiveHit(1, 3);
    gameboard.receiveHit(2, 3);
    gameboard.receiveHit(3, 3);
    expect(gameboard.allSunk()).toBe(true);
  });

  test('all sunk with two ships', () => {
    gameboard.placeShip([4, 5], 2, 'vertical');
    gameboard.receiveHit(1, 3);
    gameboard.receiveHit(2, 3);
    gameboard.receiveHit(3, 3);
    gameboard.receiveHit(4, 5);
    gameboard.receiveHit(4, 6);
    expect(gameboard.allSunk()).toBe(true);
  });
});

describe('player logic', () => {
  let player1;
  let player2;
  beforeEach(() => {
    player1 = Player();
    player2 = Player();
    player1.placeShip([1, 3], 3, 'horizontal');
  });
  test('player placeShip', () => {
    expect(player1.getGrid()[1][3]).not.toBeNull();
  });
  test('player receive hit', () => {
    player1.receiveHit(1, 3);
    expect(player1.getGrid()[1][3][0]).toBe('hit');
  });
  test('player attack', () => {
    player2 = Player();
    player2.attack(player1, 1, 3);
    expect(player1.getGrid()[1][3][0]).toBe('hit');
  });
  test('player attack calls win', () => {
    player2 = Player();
    player2.attack(player1, 1, 3);
    player2.attack(player1, 2, 3);
    expect(player2.attack(player1, 3, 3)).toBe('I won');
  });

  test('random attack', () => {
    player2.randomAttack(player1);
    let works = false;
    player1.getGrid().forEach(line => {
      line.forEach(slot => {
        if (typeof slot === 'string') {
          works = true;
        }
      });
    });
    expect(works).toBe(true);
  });

  test('random attack does not repeat', () => {
    for (let i = 0; i < 100; i += 1) {
      player2.randomAttack(player1);
    }
    let stringCount = 0;
    player1.getGrid().forEach(line => {
      line.forEach(slot => {
        if (typeof slot === 'string' || Array.isArray(slot)) {
          stringCount += 1;
        }
      });
    });
    expect(stringCount).toBe(100);
  });
});
