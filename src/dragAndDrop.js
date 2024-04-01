import EventHandler from './eventHandler';

const dragAndDrop = function (player) {
  const boats = document.querySelectorAll('.boat');
  boats.forEach(boat => {
    boat.addEventListener('dragstart', EventHandler.onDrag);
    boat.draggable = true;
    boat.style.opacity = '1';
  });
  EventHandler.addGridListeners(player);
};

export default dragAndDrop;
