'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var TYPES = ['palace', 'flat', 'house', 'bungalo'];

var TIMES = ['12:00', '13:00', '14:00'];

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var NUMBER_OF_ADS = 8;

var similarPopupTemplate = document.querySelector('template')
  .content;

var ads = [];

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

function getShuffle(array) {
  var counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
      // Pick a random index
      var index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      var temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }
  return array;
}

var avatarShuffleArray = getShuffle([1, 2, 3, 4, 5, 6, 7, 8]);
var photoShuffleArray = getShuffle(PHOTOS);
var featuresShuffleArray = getShuffle(FEATURES);

for (var j = 0; j < NUMBER_OF_ADS; j++) {
  var randomX = getRandom(300, 900);
  var randomY = getRandom(130, 630);
  var randomFeatures = featuresShuffleArray.splice(0, getRandom(1, FEATURES.length));
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
      features: randomFeatures,
      description: ' ',
      photos: photoShuffleArray
    }
  }
}

var getHomeType = function (homeType) {
  var homeTypes = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  }
  return(homeTypes[homeType]);
}

var renderAd = function (ad) {
  var adElement = similarPopupTemplate.querySelector('.map__card').cloneNode(true);

  adElement.querySelector('img').setAttribute('src', ad.author.avatar);
  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + ' р/ночь';
  adElement.querySelector('.popup__type').textContent = getHomeType(ad.offer.type);
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  adElement.querySelector('.popup__features').innerText = '';
  for (i = 0; i < ad.offer.features.length; i++ ) {
    var li = document.createElement('li');
    li.classList.add('popup__feature', 'popup__feature--' + ad.offer.features[i] + '');
    adElement.querySelector('.popup__features').appendChild(li);
  }

  adElement.querySelector('.popup__photos').innerText = '';
  for (i = 0; i <= ad.offer.photos.length; i++ ) {
    var element = document.createElement('img');
    element.setAttribute('src', ad.offer.photos[i]);
    element.alt = 'фотография жилья';
    element.width = '45';
    element.height = '40';
    adElement.querySelector('.popup__photos').appendChild(element);
  }

  adElement.querySelector('.popup__description').textContent = ad.offer.description;

  return adElement;
};

var renderPin = function (ad) {
  var adElement = similarPopupTemplate.querySelector('.map__pin').cloneNode(true);

  adElement.style.left = ad.location.x - 20 + 'px';
  adElement.style.top = ad.location.y - 40 + 'px';
  adElement.querySelector('img').setAttribute('src', ad.author.avatar);
  adElement.querySelector('img').setAttribute('alt', ad.offer.title);

  return adElement;
};

var fragment = document.createDocumentFragment();
var fragmentPin = document.createDocumentFragment();
for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(renderAd(ads[i]));
  fragmentPin.appendChild(renderPin(ads[i]));
}

document.querySelector('.map__pins').appendChild(fragmentPin);
document.querySelector('.map').insertBefore(fragment, document.querySelector('.map').children[4]);

document.querySelector('.map').classList.remove('map--faded');
