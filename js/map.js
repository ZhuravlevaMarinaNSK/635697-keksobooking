'use strict';

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
var similarPopupTemplate = document.querySelector('template')
  .content;

var adForm = document.querySelector('.ad-form');
var mainPin = map.querySelector('.map__pin--main');
var adFormFieldsets = adForm.querySelectorAll('fieldset');


var photoShuffleArray = getShuffle(PHOTOS);

var createAd = function (nums) {
  var randomX = getRandom(300, 900);
  var randomY = getRandom(130, 630);
  var randomFeaturesArray = getShuffle(FEATURES).slice();
  var ads = {
    author: {
      avatar: 'img/avatars/user0' + (nums + 1) + '.png'
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
  return ads;
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

var renderPin = function (ad, number) {
  var adElement = similarPopupTemplate.querySelector('.map__pin').cloneNode(true);

  adElement.classList.add('map__pin');
  adElement.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
  adElement.style.top = ad.location.y - PIN_HEIGHT + 'px';
  adElement.setAttribute('data-id', number);

  adElement.querySelector('img').setAttribute('src', ad.author.avatar);
  adElement.querySelector('img').setAttribute('alt', ad.offer.title);

  adElement.addEventListener('click', function () {
    showCard(document.querySelector('.map'), cards[number]);
  });

  return adElement;
};

var getMainPinPosition = function () {
  var top = mainPin.offsetTop + PIN_HEIGHT;
  var left = mainPin.offsetLeft + PIN_WIDTH / 2;
  var coordinates = top + ', ' + left;
  adForm.querySelector('#address').value = coordinates;
};

var createPins = function (ads) {
  var fragmentPin = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    fragmentPin.appendChild(renderPin(ads[i], i));
  }
  document.querySelector('.map__pins').appendChild(fragmentPin);
};

var toggleMapFormDisable = function (isDisabled) {
  map.classList.toggle('map--faded', isDisabled);
  adForm.classList.toggle('ad-form--disabled', isDisabled);

  for (var k = 0; k < adFormFieldsets.length; k++) {
    adFormFieldsets[k].disabled = isDisabled;
  }

  getMainPinPosition();
};

toggleMapFormDisable(true);


var onMainPinClick = function () {
  toggleMapFormDisable(false);
  mainPin.removeEventListener('mouseup', onMainPinClick);
  createPins(cards);
};

mainPin.addEventListener('mouseup', onMainPinClick);

var onPopupCloseEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  var popup = map.querySelector('.popup');
  var popupClose = document.querySelector('.popup__close');
  map.removeChild(popup);
  document.removeEventListener('keydown', onPopupEscPress);
  popupClose.removeEventListener('click', closePopup);
  popupClose.removeEventListener('keydown', onPopupCloseEnterPress);
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

var createMapCards = function (quantity) {
  var cards = [];
  for (var i = 0; i < quantity; i++) {
    cards[i] = createAd(i);
  }
  return cards;
};

var cards = createMapCards(NUMBER_OF_ADS);

var showCard = function (div, card) {
  var mapCard = div.querySelector('.map__card');
  if (mapCard) {
    closePopup();
  }
  div.insertBefore(renderAd(card), div.children[4]);

  var popupClose = map.querySelector('.popup__close');
  popupClose.addEventListener('click', closePopup);
  popupClose.addEventListener('keydown', onPopupCloseEnterPress);
  document.addEventListener('keydown', onPopupEscPress);
};
