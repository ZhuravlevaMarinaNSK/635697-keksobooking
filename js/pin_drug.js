'use strict';

(function () {
  var TOP_EDGE = 130;
  var BOTTOM_EDGE = 630;
  var LEFT_EDGE = 0;

  var pins = document.querySelector('.map__pins');
  var adForm = document.querySelector('.ad-form');
  var mainPin = document.querySelector('.map__pin--main');
  var rightEdge = pins.offsetWidth - mainPin.offsetWidth;
  mainPin.style.zIndex = 1000;
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;


    var onMouseMove = function (moveEvt) {
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


      if (currentY < TOP_EDGE) {
        currentY = TOP_EDGE;
      } else if (currentY > BOTTOM_EDGE) {
        currentY = BOTTOM_EDGE;
      }

      if (currentX < LEFT_EDGE) {
        currentX = LEFT_EDGE;
      } else if (currentX > rightEdge) {
        currentX = rightEdge;
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
