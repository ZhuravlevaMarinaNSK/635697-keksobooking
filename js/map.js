'use strict';

(function () {
  var MAIN_PIN_LEFT = 570;
  var MAIN_PIN_TOP = 375;
  var map = document.querySelector('.map');
  var filterForm = map.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var mainPin = map.querySelector('.map__pin--main');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var reset = adForm.querySelector('.ad-form__reset');
  var submit = adForm.querySelector('.ad-form__submit');
  var priceInput = adForm.querySelector('#price');
  var userTitleInput = adForm.querySelector('#title');
  var typeInput = adForm.querySelector('#type');
  var timeCheckinInput = document.querySelector('#timein');
  var timeCheckoutInput = document.querySelector('#timeout');
  var pins = [];

  var getMainPinPosition = function (isDisabled) {
    var disability = 1;
    if (isDisabled) {
      disability = 0;
    }
    var top = mainPin.offsetTop + window.utils.pinHeight / 2 + (window.utils.pinHeight * 2 + window.utils.mainPinTail) * disability;
    var left = mainPin.offsetLeft + window.utils.pinWidth / 2;
    var coordinates = left + ', ' + top;
    adForm.querySelector('#address').value = coordinates;
  };

  var setAnyForm = function () {
    var filter = document.querySelector('.map__filters');
    var features = filter.querySelectorAll('input');
    var anyValue = 'any';
    filter.querySelector('#housing-type').value = anyValue;
    filter.querySelector('#housing-price').value = anyValue;
    filter.querySelector('#housing-guests').value = anyValue;
    filter.querySelector('#housing-rooms').value = anyValue;
    features.forEach(function (feature) {
      if (feature.checked) {
        feature.checked = false;
      }
    });
  };

  var toggleMapFormDisable = function (isDisabled) {
    map.classList.toggle('map--faded', isDisabled);
    adForm.classList.toggle('ad-form--disabled', isDisabled);
    adFormFieldsets.forEach(function (item) {
      item.disabled = isDisabled;
    });
    getMainPinPosition(isDisabled);
    mainPin.addEventListener('mousedown', onMainPinClick);
    mainPin.addEventListener('keydown', onMainPinEnter);
    if (isDisabled) {
      document.removeEventListener('keydown', window.formValidation.onErrorEsc);
      priceInput.removeEventListener('invalid', window.formValidation.onTypeInput);
      priceInput.removeEventListener('input', window.formValidation.onTypeInput);
      userTitleInput.removeEventListener('invalid', window.formValidation.onTitleInputInvalid);
      userTitleInput.removeEventListener('input', window.formValidation.onTitleInput);
      typeInput.removeEventListener('change', window.formValidation.onTypeChange);
      timeCheckinInput.removeEventListener('change', window.formValidation.ontimeCheckinChange);
      timeCheckoutInput.removeEventListener('change', window.formValidation.ontimeCheckoutChange);
      submit.removeEventListener('click', window.formValidation.onSubmitClick);
      filterForm.removeEventListener('change', onChangeFilter);
      setAnyForm();
    }
    mainPin.style.left = MAIN_PIN_LEFT + 'px';
    mainPin.style.top = MAIN_PIN_TOP + 'px';
  };

  toggleMapFormDisable(true);

  var onMainPinClick = function () {
    toggleMapFormDisable(false);
    window.backend.loadFunction(getDataFromServer, window.utils.error);
    mainPin.removeEventListener('mousedown', onMainPinClick);
    mainPin.removeEventListener('keydown', onMainPinEnter);
    typeInput.addEventListener('change', window.formValidation.onTypeChange);
    window.formValidation.onTypeChange();
    document.addEventListener('keydown', window.formValidation.onErrorEsc);
    reset.addEventListener('click', window.formValidation.onResetClick);
    typeInput.addEventListener('change', window.formValidation.onTypeChange);
    timeCheckinInput.addEventListener('change', window.formValidation.ontimeCheckinChange);
    timeCheckoutInput.addEventListener('change', window.formValidation.ontimeCheckoutChange);
    submit.addEventListener('click', window.formValidation.onSubmitClick);
    filterForm.addEventListener('change', onChangeFilter);
    disableForm(true);
  };

  mainPin.addEventListener('mousedown', onMainPinClick);

  var onMainPinEnter = function (evt) {
    if (evt.keyCode === window.utils.enterKeycode) {
      onMainPinClick();
    }
  };

  mainPin.addEventListener('keydown', onMainPinEnter);

  var onPopupCloseEnterPress = function (evt) {
    if (evt.keyCode === window.utils.enterKeycode) {
      closePopup();
    }
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.utils.escKeycode) {
      closePopup();
    }
  };

  var closePopup = function () {
    var popup = map.querySelector('.popup');
    var popupClose = document.querySelector('.popup__close');
    map.removeChild(popup);
    window.createCards.desactivatePin();
    document.removeEventListener('keydown', onPopupEscPress);
    popupClose.removeEventListener('click', closePopup);
    popupClose.removeEventListener('keydown', onPopupCloseEnterPress);
  };

  var showCard = function (div, card) {
    var mapCard = div.querySelector('.map__card');
    if (mapCard) {
      closePopup();
    }
    div.insertBefore(window.createCards.renderAd(card), div.children[4]);
    var popupClose = map.querySelector('.popup__close');
    popupClose.addEventListener('click', closePopup);
    popupClose.addEventListener('keydown', onPopupCloseEnterPress);
    document.addEventListener('keydown', onPopupEscPress);
  };

  var updatePins = function () {
    var mapCard = document.querySelector('.map__card');
    if (mapCard) {
      closePopup();
    }
    window.createCards.removePins();
    var pinsData = window.filter.sortPins(pins);
    window.createCards.createPins(pinsData);
  };

  var onChangeFilter = window.utils.debounce(function () {
    updatePins();
  });

  var getDataFromServer = function (info) {
    pins = info;
    disableForm(false);
    window.createCards.createPins(pins);
    return pins;
  };

  var disableForm = function (isDisabled) {
    var inputs = filterForm.querySelectorAll('input, select');
    inputs.forEach(function (item) {
      item.disabled = isDisabled;
    });
  };

  window.map = {
    toggleMapFormDisable: toggleMapFormDisable,
    getMainPinPosition: getMainPinPosition,
    onMainPinClick: onMainPinClick,
    closePopup: closePopup,
    showCard: showCard,
    pins: pins
  };
})();
