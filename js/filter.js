'use strict';

(function () {
  var MIN_PRICE = 5000;
  var MAX_PRICE = 10000;
  var filter = document.querySelector('.map__filters');
  var anyValue = 'any';
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');

  var getData = function (datum) {
    var data = {
      type: filter.querySelector('#housing-type').value,
      price: filter.querySelector('#housing-price').value,
      rooms: filter.querySelector('#housing-rooms').value,
      guests: filter.querySelector('#housing-guests').value
    };
    return data[datum];
  };

  var price = 'price';
  var type = 'type'; // пересмотреть
  var rooms = 'rooms';
  var guests = 'guests';

  var pins = [];
  //  загрузка данных для пинов
  var getInfo = function (info) {
    pins = info.slice();
  };

  //  для гостей, номеров, типов квартир

  var checkDataField = function (name) {
    var pinsData = pins;
    var sortedPins = pinsData.filter(function (item) {
      return getData(name) === anyValue ? true : getData(name) === item.offer[name].toString();
    });
    return sortedPins;
  };
  //  для цены
  var checkPricefield = function (items) {
    switch (getData(price)) {
      case 'low':
        return items.filter(function (pin) {
          return pin.offer.price < MIN_PRICE;
        });
      case 'middle':
        return items.filter(function (pin) {
          return MAX_PRICE >= pin.offer.price && pin.offer.price >= MIN_PRICE;
        });
      case 'high':
        return items.filter(function (pin) {
          return MAX_PRICE > pin.offer.price;
        });
      default:
        return items;
    }
  };
  // для особенностей
  var getFeatureType = function (featureType) {
    var featureTypes = {
      'filter-wifi': 'wifi',
      'filter-dishwasher': 'dishwasher',
      'filter-parking': 'parking',
      'filter-washer': 'washer',
      'filter-elevator': 'elevator',
      'filter-conditioner': 'conditioner'
    };
    return (featureTypes[featureType]);
  };

  var checkFeaturesfield = function (item) {
    var features = filter.querySelectorAll('.map__checkbox');
    item = item.filter(function (it) {
      for (var i = 0; i < features.length; i++) {
        for (var j = 0; j < it.offer.features.length; j++) {
          if (features[i].checked && it.offer.features[j] === getFeatureType(features[i].id)) {
            return true;
          }
        }
      }
      return false;
    });
    return item;
  };

  // действие при выборе
  var removePins = function () {
    var allPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < allPins.length; i++) {
      mapPins.removeChild(allPins[i]);
    }
  };

  var updatePins = function () {
    removePins();
    var pinsData = pins;
    var resultPins = checkDataField(type).filter(function (e) {
      return checkDataField(guests).indexOf(e) > -1;
    }).filter(function (e) {
      return checkDataField(rooms).indexOf(e) > -1;
    }).filter(function (e) {
      return checkFeaturesfield(pinsData).indexOf(e) > -1;
    }).filter(function (e) {
      return checkPricefield(pinsData).indexOf(e) > -1;
    });

    window.createCards.createPins(resultPins);
  };

  window.filter = {
    updatePins: updatePins,
    getInfo: getInfo
  };

  // проблема с отрисовкой пинов
})();
