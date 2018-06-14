'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var TYPES = ['palace', 'flat', 'house', 'bungalo'];

var TIMES = ['12:00', '13:00', '14:00'];

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var NUMBER_OF_ADS = 8;

var PIN_HEIGHT = 40;

var PIN_WIDTH = 40;

var similarPopupTemplate = document.querySelector('template')
  .content;

var ads = [];

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

var getShuffle = function (array) {
  var counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    var index = Math.floor(Math.random() * counter);

    counter--;

    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
};
var map = document.querySelector('.map');
var avatarShuffleArray = getShuffle([1, 2, 3, 4, 5, 6, 7, 8]);
var photoShuffleArray = getShuffle(PHOTOS);


var createAd = function (nums) {
  for (var j = 0; j < nums; j++) {
    var randomX = getRandom(300, 900);
    var randomY = getRandom(130, 630);
    var randomFeaturesArray = getShuffle(FEATURES).slice();
    ads[j] = {
      author: {
        avatar: 'img/avatars/user0' + avatarShuffleArray[j] + '.png'
      },
      location: {
        x: randomX,
        y: randomY
      },
      offer: {
        title: TITLES[getRandom(0, TITLES.length - 1)],
        address: randomX + ', ' + randomY,
        price: getRandom(1000, 1000000),
        type: TYPES[getRandom(0, TYPES.length - 1)],
        rooms: getRandom(1, 5),
        guests: getRandom(1, 10),
        checkin: TIMES[getRandom(0, TIMES.length - 1)],
        checkout: TIMES[getRandom(0, TIMES.length - 1)],
        features: randomFeaturesArray.splice(0, getRandom(1, FEATURES.length)),
        description: ' ',
        photos: photoShuffleArray
      }
    };
  }
};

var getHomeType = function (homeType) {
  var homeTypes = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  return (homeTypes[homeType]);
};

createAd(NUMBER_OF_ADS);

var renderFeatureList = function (item) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < item.length; i++) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature');
    featureItem.classList.add('popup__feature--' + item[i]);
    fragment.appendChild(featureItem);
  }
  return fragment;
};

var renderPhotoList = function (item) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < item.length; i++) {
    var photoFragment = document.createElement('img');
    photoFragment.setAttribute('src', item[i]);
    photoFragment.alt = 'фотография жилья';
    photoFragment.width = '45';
    photoFragment.height = '40';
    photoFragment.classList.add('popup__photo');
    fragment.appendChild(photoFragment);
  }
  return fragment;
};

var renderAd = function (ad) {
  var adElement = similarPopupTemplate.querySelector('.map__card').cloneNode(true);

  adElement.classList.add('popup');
  adElement.querySelector('img').setAttribute('src', ad.author.avatar);
  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + ' р/ночь';
  adElement.querySelector('.popup__type').textContent = getHomeType(ad.offer.type);
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var photosBlock = adElement.querySelector('.popup__photos');
  var featuresBlock = adElement.querySelector('.popup__features');

  photosBlock.innerText = '';
  featuresBlock.innerText = '';

  featuresBlock.appendChild(renderFeatureList(ad.offer.features));
  photosBlock.appendChild(renderPhotoList(ad.offer.photos));

  adElement.querySelector('.popup__description').textContent = ad.offer.description;

  return adElement;
};

var renderPin = function (ad) {
  var adElement = similarPopupTemplate.querySelector('.map__pin').cloneNode(true);

  adElement.classList.add('map__pin');
  adElement.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
  adElement.style.top = ad.location.y - PIN_HEIGHT + 'px';
  adElement.querySelector('img').setAttribute('src', ad.author.avatar);
  adElement.querySelector('img').setAttribute('alt', ad.offer.title);

  return adElement;
};


var getOffset = function (elem) {
  if (elem.getBoundingClientRect) {
    // "правильный" вариант
    return getOffsetRect(elem);
  } else {
    // пусть работает хоть как-то
    return getOffsetSum(elem);
  }
};

var getOffsetSum = function (elem) {
  var top = 0;
  var left = 0;
  while (elem) {
    top = top + parseInt(elem.offsetTop, 10);
    left = left + parseInt(elem.offsetLeft, 10);
    elem = elem.offsetParent;
  }
  var coordinates = top + ', ' + left;
  return coordinates;
};

var getOffsetRect = function (elem) {
  // (1)
  var box = elem.getBoundingClientRect();

  // (2)
  var body = document.body;
  var docElem = document.documentElement;

  // (3)
  var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

  // (4)
  var clientTop = docElem.clientTop || body.clientTop || 0;
  var clientLeft = docElem.clientLeft || body.clientLeft || 0;

  // (5)
  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;
  var coordinates = Math.round(top) + ', ' + Math.round(left);

  return coordinates;
};


var fragment = document.createDocumentFragment();
var fragmentPin = document.createDocumentFragment();

for (var i = 0; i < NUMBER_OF_ADS; i++) {
  fragmentPin.appendChild(renderPin(ads[i]));
}


var closePopup = function () {
  var popup = map.querySelector('.popup');
  var popupClose = map.querySelector('.popup__close');
  popupClose.addEventListener('click', closePopup);

  popup.classList.add('hidden');
};


var onMapPinClick = function (evt) {
  var target = evt.target;
  if (target.classList.contains('map__pin')) {
    fragment.appendChild(renderAd(ads[0]));
  }
};

map.addEventListener('click', onMapPinClick);

var adForm = document.querySelector('.ad-form');
var mainPin = map.querySelector('.map__pin--main');
var adFormFieldsets = adForm.querySelectorAll('fieldset');

var toggleMapFormDisable = function (isDisabled) {
  map.classList.toggle('map--faded', isDisabled);
  adForm.classList.toggle('ad-form--disabled', isDisabled);

  for (var k = 0; k < adFormFieldsets.length; k++) {
    adFormFieldsets[k].disabled = isDisabled;
  }
};

toggleMapFormDisable(true);

var getMainPinPosition = function () {
  var coordinates = getOffset(mainPin);
  adForm.querySelector('#address').value = coordinates;
};

getMainPinPosition();

var onMainPinClick = function () {
  toggleMapFormDisable(false);
  mainPin.removeEventListener('mouseup', onMainPinClick);
  document.querySelector('.map__pins').appendChild(fragmentPin);
  map.insertBefore(fragment, document.querySelector('.map').children[4]);
};

mainPin.addEventListener('mouseup', onMainPinClick);
