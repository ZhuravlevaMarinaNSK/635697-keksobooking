'use strict';

(function () {
  var pinsContainer = document.querySelector('.map__pins');
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
      var TOP_EDGE = 130 - window.utils.pinHeight - window.utils.mainPinTail;
      var BOTTOM_EDGE = 630 - window.utils.pinHeight - window.utils.mainPinTail;
      var LEFT_EDGE = 0;
      var RIGHT_EDGE = pinsContainer.offsetWidth - mainPin.offsetWidth;
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
      } else if (currentX > RIGHT_EDGE) {
        currentX = RIGHT_EDGE;
      }

      mainPin.style.top = currentY + 'px';
      mainPin.style.left = currentX + 'px';
      var top = currentY + window.utils.pinHeight + window.utils.mainPinTail;
      var left = currentX + window.utils.pinWidth / 2;
      adForm.querySelector('#address').value = left + ', ' + top;
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
