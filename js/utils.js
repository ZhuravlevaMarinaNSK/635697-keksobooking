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

  var GUEST_ROOMS = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
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
