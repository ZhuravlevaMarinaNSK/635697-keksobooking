'use strict';

(function () {
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var NUMBER_OF_ADS = 8;
  var PIN_HEIGHT = 40;
  var PIN_WIDTH = 40;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var MAIN_PIN_TAIL = 22;
  var DEBOUNCE_INTERVAL = 300;

  var GUEST_ROOMS = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; padding: 50px 10px; margin: 0 auto; text-align: center; vertical-align: middle; background-color: #da641a; border: 15px dashed white';
    node.style.position = 'absolute';
    node.style.left = '190px';
    node.style.right = '150px';
    node.style.top = '100px';
    node.style.bottom = '300px';
    node.style.fontSize = '30px';
    node.classList.add('error-message');

    node.textContent = 'Что-то пошло не так ¯\_(ツ)_/¯ ' + errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };


  var debounce = function (fun) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.utils = {
    titles: TITLES,
    types: TYPES,
    times: TIMES,
    features: FEATURES,
    photos: PHOTOS,
    numberOfAds: NUMBER_OF_ADS,
    pinHeight: PIN_HEIGHT,
    pinWidth: PIN_WIDTH,
    escKeycode: ESC_KEYCODE,
    enterKeycode: ENTER_KEYCODE,
    mainPinTail: MAIN_PIN_TAIL,
    guestRooms: GUEST_ROOMS,
    error: errorHandler,
    debounce: debounce,
    getRandom: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min) + min);
    },
    getShuffle: function (array) {
      var counter = array.length;
      while (counter > 0) {
        var index = Math.floor(Math.random() * counter);
        counter--;
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
      return array;
    }
  };
})();
