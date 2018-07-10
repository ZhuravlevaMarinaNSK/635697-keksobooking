'use strict';

(function () {
  var pins = document.querySelector('.map__pins');
  var adForm = document.querySelector('.ad-form');
  var mainPin = document.querySelector('.map__pin--main');

  mainPin.style.zIndex = 100;
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var dragged = false;

    var onMouseMove = function (moveEvt) {
      var RIGHT_EDGE = pins.offsetWidth - mainPin.offsetWidth;
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentX = mainPin.offsetLeft - shift.x;
      var currentY = mainPin.offsetTop - shift.y;

      if (currentY < window.utils.top) {
        currentY = window.utils.top;
      } else if (currentY > window.utils.bottom) {
        currentY = window.utils.bottom;
      }

      if (currentX < window.utils.left) {
        currentX = window.utils.left;
      } else if (currentX > RIGHT_EDGE) {
        currentX = RIGHT_EDGE;
      }

      mainPin.style.top = currentY + 'px';
      mainPin.style.left = currentX + 'px';
      adForm.querySelector('#address').value = currentX + ', ' + currentY;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (event) {
          event.preventDefault();
          mainPin.removeEventListener('click', onClickPreventDefault);
        };
        mainPin.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
