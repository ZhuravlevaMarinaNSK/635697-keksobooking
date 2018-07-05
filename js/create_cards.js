'use strict';

(function () {
  var similarPopupTemplate = document.querySelector('template')
  .content;


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

  var renderPin = function (ad) {
    var adElement = similarPopupTemplate.querySelector('.map__pin').cloneNode(true);

    adElement.classList.add('map__pin');
    adElement.style.left = ad.location.x - window.utils.pinWidth / 2 + 'px';
    adElement.style.top = ad.location.y - window.utils.pinHeight + 'px';

    adElement.querySelector('img').setAttribute('src', ad.author.avatar);
    adElement.querySelector('img').setAttribute('alt', ad.offer.title);

    adElement.addEventListener('click', function () {
      window.showCard(document.querySelector('.map'), ad);
    });

    return adElement;
  };

  var createPins = function (ads) {
    var fragmentPin = document.createDocumentFragment();
    if (ads.length > 0 && ads.length > 5) {
      for (var i = 0; i < 5; i++) {
        fragmentPin.appendChild(renderPin(ads[i]));
      }
    } else if (ads.length > 0 && ads.length < 5) {
      for (i = 0; i < ads.length; i++) {
        fragmentPin.appendChild(renderPin(ads[i]));
      }
    }
    document.querySelector('.map__pins').appendChild(fragmentPin);
    return;
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

  window.createCards = {
    createPins: createPins,
    renderAd: renderAd
  };
})();
