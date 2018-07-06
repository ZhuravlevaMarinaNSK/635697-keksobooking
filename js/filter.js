'use strict';

(function () {
  var MIN_PRICE = 10000;
  var MAX_PRICE = 50000;
  var filter = document.querySelector('.map__filters');
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var anyValue = 'any';
  var pins = [];
  //  загрузка данных для пинов
  var disableForm = function (isDisabled) {
    var filterInputs = filter.querySelectorAll('input');
    var filterSelects = filter.querySelectorAll('select');
    filterInputs.forEach(function (item) {
      item.disabled = isDisabled;
    });
    filterSelects.forEach(function (item) {
      item.disabled = isDisabled;
    });
  };

  var getData = function (info) {
    pins = info.slice();
    disableForm(false);
  };

  var getInfo = function (datum) {
    var data = {
      type: filter.querySelector('#housing-type').value,
      price: filter.querySelector('#housing-price').value,
      rooms: filter.querySelector('#housing-rooms').value,
      guests: filter.querySelector('#housing-guests').value
    };
    return data[datum];
  };

  //  для гостей, номеров, типов квартир

  var checkDataField = function (item, name) {
    return getInfo(name) === anyValue ? true : getInfo(name) === item.offer[name].toString();
  };
  //  для цены
  var checkPricefield = function (item, name) {
    if (getInfo(name) !== anyValue) {
      switch (getInfo(name)) {
        case 'low':
          return item.offer.price < MIN_PRICE;
        case 'middle':
          return MAX_PRICE >= item.offer.price && item.offer.price >= MIN_PRICE;
        case 'high':
          return MAX_PRICE < item.offer.price;
        default:
          return true;
      }
    } else {
      return true;
    }
  };
  // для особенностей

  var checkFeaturesfield = function (item) {
    var features = filter.querySelectorAll('input:checked');
    var result;
    if (features.length > 0) {
      var featuresArray = Array.prototype.slice.call(features);
      result = featuresArray.every(function (feature) {
        return item.offer.features.some(function (data) {
          return feature.value === data;
        });
      });

    } else {
      result = true;
    }
    return result;
  };

  // действие при выборе

  var removePins = function () {
    var allPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < allPins.length; i++) {
      mapPins.removeChild(allPins[i]);
    }
  };

  var sortPins = function (it) {
    return checkDataField(it, 'type') && checkDataField(it, 'guests') && checkDataField(it, 'rooms') && checkPricefield(it, 'price') && checkFeaturesfield(it);
  };

  var getSortedPins = function () {
    removePins();
    getInfo();
    var pinsData = pins.filter(sortPins);
    window.createCards.createPins(pinsData);
  };

  window.filter = {
    getSortedPins: getSortedPins,
    getData: getData,
    disableForm: disableForm
  };
})();
