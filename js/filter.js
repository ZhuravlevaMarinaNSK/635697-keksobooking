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
    var result = true;
    features.forEach(function (feature) {
      result = item.offer.features.some(function (data) {
        return feature.value === data;
      });
    });
    return result;
  };

  // действие при выборе

  var result = function (it) {
    return checkDataField(it, 'type') && checkDataField(it, 'guests') && checkDataField(it, 'rooms') && checkPricefield(it, 'price') && checkFeaturesfield(it);
  };

  window.filter = {
    getInfo: getInfo,
    result: result
  };

  // блокировать фильтр до загрузки пинов
  // дребезг
})();
