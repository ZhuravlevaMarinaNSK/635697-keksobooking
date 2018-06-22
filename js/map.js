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
var MAIN_PIN_TAIL = 22;

var TOP_EDGE = 130;
var BOTTOM_EDGE = 630;
var LEFT_EDGE = 0;

var GUEST_ROOMS = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

var map = document.querySelector('.map');
var similarPopupTemplate = document.querySelector('template')
  .content;

var adForm = document.querySelector('.ad-form');
var mainPin = map.querySelector('.map__pin--main');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var pins = document.querySelector('.map__pins');

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
  var top = mainPin.offsetTop + PIN_HEIGHT + MAIN_PIN_TAIL;
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

var roomNumberInput = document.querySelector('#room_number');
var guestNumberInput = document.querySelector('#capacity');

var typeInput = document.querySelector('#type');
var priceInput = document.querySelector('#price');

var onTypeChange = function () {
  switch (typeInput.value) {
    case 'bungalo':
      priceInput.min = 0;
      priceInput.placeholder = 0;
      break;
    case 'flat':
      priceInput.min = 1000;
      priceInput.placeholder = 1000;
      break;
    case 'house':
      priceInput.min = 5000;
      priceInput.placeholder = 5000;
      break;
    case 'palace':
      priceInput.min = 10000;
      priceInput.placeholder = 10000;
      break;
  }
};

var onTypeInput = function () {
  if (!priceInput.validity.valid) {
    highlightBorderError(priceInput);
  } else {
    unhighlightBorderError(priceInput);
  }
};

var highlightBorderError = function (element) {
  element.style.borderColor = 'red';
};

var unhighlightBorderError = function (element) {
  element.style.borderColor = '#d9d9d3';
};

var roomCheck = function () {
  var arr = GUEST_ROOMS[roomNumberInput.value].slice();
  guestNumberInput.setCustomValidity('');
  if (arr.indexOf(parseInt(guestNumberInput.value, 10)) < 0) {
    guestNumberInput.setCustomValidity('Число комнат не соответствует количеству гостей');
    highlightBorderError(guestNumberInput);
  } else {
    unhighlightBorderError(guestNumberInput);
  }
};

roomNumberInput.addEventListener('change', function () {
  roomCheck();
});

guestNumberInput.addEventListener('change', function () {
  roomCheck();
});

var timeCheckinInput = document.querySelector('#timein');
var timeCheckoutInput = document.querySelector('#timeout');

var ontimeCheckinChange = function () {
  timeCheckoutInput.value = timeCheckinInput.value;
};

var ontimeCheckoutChange = function () {
  timeCheckinInput.value = timeCheckoutInput.value;
};

var reset = adForm.querySelector('.ad-form__reset');
var submit = adForm.querySelector('.ad-form__submit');
var success = document.querySelector('.success');
success.classList.add('hidden');

var onSubmitClick = function (evt) {
  roomCheck();
  if (userTitleInput.checkValidity() && priceInput.checkValidity() && roomNumberInput.checkValidity() && guestNumberInput.checkValidity()) {
    evt.preventDefault();
    toggleMapFormDisable(true);
    var pinsForDelete = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pinsForDelete.length; i++) {
      document.querySelector('.map__pins').removeChild(pinsForDelete[i]);
    }

    adForm.reset();
    getMainPinPosition();
    mainPin.addEventListener('mouseup', onMainPinClick);
    success.classList.remove('hidden');
    document.addEventListener('keydown', onSuccessEscPress);
    success.addEventListener('click', closeSuccessMessage);
  }
};

var toggleMapFormDisable = function (isDisabled) {
  map.classList.toggle('map--faded', isDisabled);
  adForm.classList.toggle('ad-form--disabled', isDisabled);

  for (var k = 0; k < adFormFieldsets.length; k++) {
    adFormFieldsets[k].disabled = isDisabled;
  }
  getMainPinPosition();
  mainPin.removeEventListener('mouseup', onMainPinClick);
  priceInput.removeEventListener('invalid', onTypeInput);
  userTitleInput.removeEventListener('input', onTitleInputInvalid);
  typeInput.removeEventListener('change', onTypeChange);
  mainPin.removeEventListener('mousedown', onMainPinMousedown);
  timeCheckinInput.removeEventListener('change', ontimeCheckinChange);
  timeCheckoutInput.removeEventListener('change', ontimeCheckoutChange);
  submit.removeEventListener('click', onSubmitClick);
  userTitleInput.removeEventListener('input', onTitleInput);
};

var userTitleInput = adForm.querySelector('#title');

var onTitleInputInvalid = function () {
  if (userTitleInput.validity.tooShort) {
    userTitleInput.setCustomValidity('Заголовок должен состоять минимум из 30-ти символов');
    highlightBorderError(userTitleInput);
  } else if (userTitleInput.validity.tooLong) {
    userTitleInput.setCustomValidity('Заголовок не должен превышать 100 символов');
    highlightBorderError(userTitleInput);
  } else if (userTitleInput.validity.valueMissing) {
    userTitleInput.setCustomValidity('Обязательное поле');
    highlightBorderError(userTitleInput);
  } else {
    userTitleInput.setCustomValidity('');
    unhighlightBorderError(userTitleInput);
  }
  userTitleInput.addEventListener('invalid', onTitleInputInvalid);
};

var onTitleInput = function (evt) {
  var target = evt.target;
  if (target.value.length < 5) {
    target.setCustomValidity('Имя должно состоять минимум из 5-ти символов');
  } else {
    target.setCustomValidity('');
    unhighlightBorderError(userTitleInput);
  }
};

toggleMapFormDisable(true);

var onMainPinClick = function () {
  toggleMapFormDisable(false);
  mainPin.removeEventListener('mouseup', onMainPinClick);
  createPins(cards);
  onTypeChange();
  reset.addEventListener('click', onResetClick);
  priceInput.addEventListener('invalid', onTypeInput);
  priceInput.addEventListener('input', onTypeInput);
  typeInput.addEventListener('change', onTypeChange);

  userTitleInput.addEventListener('invalid', onTitleInputInvalid);
  userTitleInput.addEventListener('input', onTitleInput);
  mainPin.addEventListener('mousedown', onMainPinMousedown);
  timeCheckinInput.addEventListener('change', ontimeCheckinChange);
  timeCheckoutInput.addEventListener('change', ontimeCheckoutChange);
  submit.addEventListener('click', onSubmitClick);
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

var onSuccessEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeSuccessMessage();
  }
};

var closeSuccessMessage = function () {
  success.classList.add('hidden');
  document.removeEventListener('keydown', onSuccessEscPress);
  success.removeEventListener('click', closeSuccessMessage);
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

var onResetClick = function () {
  var popup = map.querySelector('.popup');
  if (popup) {
    closePopup();
  }
  toggleMapFormDisable(true);
  var pinsForDelete = map.querySelectorAll('.map__pin:not(.map__pin--main)');
  for (var i = 0; i < pinsForDelete.length; i++) {
    document.querySelector('.map__pins').removeChild(pinsForDelete[i]);
  }
  adForm.reset();
  getMainPinPosition();
  mainPin.addEventListener('mouseup', onMainPinClick);
};

var rightEdge = pins.offsetWidth - mainPin.offsetWidth;

var onMainPinMousedown = function (evt) {
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
};
