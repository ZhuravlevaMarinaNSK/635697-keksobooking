'use strict';

(function () {
  var similarPopupTemplate = document.querySelector('template')
  .content;

  var renderFeatureList = function (items) {
    var fragment = document.createDocumentFragment();
    items.forEach(function (item) {
      var featureItem = document.createElement('li');
      featureItem.classList.add('popup__feature');
      featureItem.classList.add('popup__feature--' + item);
      fragment.appendChild(featureItem);
    });
    return fragment;
  };

  var renderPhotoList = function (items) {
    var fragment = document.createDocumentFragment();
    items.forEach(function (item) {
      var photoFragment = document.createElement('img');
      photoFragment.setAttribute('src', item);
      photoFragment.alt = 'фотография жилья';
      photoFragment.width = '45';
      photoFragment.height = '40';
      photoFragment.classList.add('popup__photo');
      fragment.appendChild(photoFragment);
    });
    return fragment;
  };

  var desactivatePin = function () {
    var allPins = document.querySelectorAll('.map__pin');
    allPins.forEach(function (it) {
      if (it.classList.contains('map__pin--active')) {
        it.classList.remove('map__pin--active');
      }
    });
  };

  var onPinClick = function (evt) {
    var target;
    if (evt.target.tagName === 'BUTTON' && evt.target !== document.querySelector('.popup__close') && evt.target !== document.querySelector('.map__pin--main')) {
      target = evt.target;
    } else if (evt.target.parentNode.tagName === 'BUTTON' && evt.target.parentNode !== document.querySelector('.map__pin--main')) {
      target = evt.target.parentNode;
    }
    if (target) {
      desactivatePin();
      target.classList.add('map__pin--active');
    }
  };

  var renderPin = function (ad) {
    var adElement = similarPopupTemplate.querySelector('.map__pin').cloneNode(true);

    adElement.classList.add('map__pin');
    adElement.style.left = ad.location.x - window.utils.pinWidth / 2 + 'px';
    adElement.style.top = ad.location.y - window.utils.pinHeight + 'px';
    adElement.querySelector('img').setAttribute('src', ad.author.avatar);
    adElement.querySelector('img').setAttribute('alt', ad.offer.title);
    adElement.addEventListener('click', function () {
      window.map.showCard(document.querySelector('.map'), ad);
      document.addEventListener('click', onPinClick);
    });
    return adElement;
  };

  var createPin = function (ads) {
    var fragmentPin = document.createDocumentFragment();
    var arr = ads.slice(0, 4);
    arr.forEach(function (item) {
      fragmentPin.appendChild(renderPin(item));
    });
    document.querySelector('.map__pins').appendChild(fragmentPin);
    return;
  };

  var removePins = function () {
    var mapPins = document.querySelector('.map__pins');
    var allPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    allPins.forEach(function (item) {
      mapPins.removeChild(item);
    });
    document.removeEventListener('click', onPinClick);
  };

  var homeType = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var getHomeType = function (types) {
    return (homeType[types]);
  };

  var checkEmptiness = function (item, block, action) {
    return item.length !== 0 ? block.appendChild(action(item)) : block.classList.add('visually-hidden');
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

    checkEmptiness(ad.offer.features, featuresBlock, renderFeatureList);
    checkEmptiness(ad.offer.photos, photosBlock, renderPhotoList);

    adElement.querySelector('.popup__description').textContent = ad.offer.description;
    return adElement;
  };

  window.createCards = {
    createPins: createPin,
    renderAd: renderAd,
    removePins: removePins,
    desactivatePin: desactivatePin
  };
})();
