'use strict';

(function () {
  var MIN_PRICE = 10000;
  var MAX_PRICE = 50000;
  var filter = document.querySelector('.map__filters');
  var anyValue = 'any';

  var getInfo = function (datum) {
    var data = {
      type: filter.querySelector('#housing-type').value,
      price: filter.querySelector('#housing-price').value,
      rooms: filter.querySelector('#housing-rooms').value,
      guests: filter.querySelector('#housing-guests').value
    };
    return data[datum];
  };

  var checkDataField = function (item, name) {
    var value = getInfo(name);
    if (value !== anyValue) {
      switch (name) {
        case 'guests':
          return value <= item.offer[name].toString();
        default:
          return value === item.offer[name].toString();
      }
    } else {
      return true;
    }
  };

  var checkPricefield = function (item, name) {
    var value = getInfo(name);
    if (value !== anyValue) {
      switch (value) {
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

  var sortPins = function (pins) {
    var pinsData = pins.filter(function (it) {
      return checkDataField(it, 'type') && checkDataField(it, 'guests') && checkDataField(it, 'rooms') && checkPricefield(it, 'price') && checkFeaturesfield(it);
    });
    return pinsData;
  };

  window.filter = {
    sortPins: sortPins
  };
})();
