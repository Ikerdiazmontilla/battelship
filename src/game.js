import dom from './dom';
import Player from './player';
import multiplayer from './multiplayer';

const game = {
  startGame() {
    const player1 = Player(1);
    const player2 = Player(2);
    player2.placeShipRandom(5);
    player2.placeShipRandom(4);
    player2.placeShipRandom(3);
    player2.placeShipRandom(3);
    player2.placeShipRandom(2);
    dom.showStartingDialog(player1, player2);
  },
  startMultiplayer() {
    const player1 = Player(1);
    const player2 = Player(2);
    dom.prepareNewGame();
    multiplayer.resetEverything();
    multiplayer.prepareStartingDialog();
    multiplayer.showStartingDialog(player1, player2);
  },
  chooseGame() {
    const chooseGameMode = document.querySelector('.choose-game');
    chooseGameMode.showModal();
    const playComputer = chooseGameMode.querySelector('.computer');
    playComputer.addEventListener('click', () => {
      chooseGameMode.close();
      game.startGame();
    });
    const playOther = document.querySelector('.multiplayer');
    playOther.addEventListener('click', () => {
      chooseGameMode.close();
      game.startMultiplayer();
    });
  },
};

export default game;
