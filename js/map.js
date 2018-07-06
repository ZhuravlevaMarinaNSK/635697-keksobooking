'use strict';

(function () {
  var MAIN_PIN_LEFT = 570;
  var MAIN_PIN_TOP = 375;
  var map = document.querySelector('.map');
  var allFilters = map.querySelector('.map__filters');
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

  var getMainPinPosition = function () {
    var top = mainPin.offsetTop + window.utils.pinHeight + window.utils.mainPinTail;
    var left = mainPin.offsetLeft + window.utils.pinWidth / 2;
    var coordinates = top + ', ' + left;
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

    for (var k = 0; k < adFormFieldsets.length; k++) {
      adFormFieldsets[k].disabled = isDisabled;
    }
    getMainPinPosition();
    mainPin.removeEventListener('mouseup', onMainPinClick);
    priceInput.removeEventListener('invalid', window.formValidation.onTypeInput);
    userTitleInput.removeEventListener('input', window.formValidation.onTitleInputInvalid);
    typeInput.removeEventListener('change', window.formValidation.onTypeChange);
    timeCheckinInput.removeEventListener('change', window.formValidation.ontimeCheckinChange);
    timeCheckoutInput.removeEventListener('change', window.formValidation.ontimeCheckoutChange);
    submit.removeEventListener('click', window.formValidation.onSubmitClick);
    userTitleInput.removeEventListener('input', window.formValidation.onTitleInput);
    setAnyForm();
    mainPin.style.left = MAIN_PIN_LEFT + 'px';
    mainPin.style.top = MAIN_PIN_TOP + 'px';
  };

  toggleMapFormDisable(true);

  var onMainPinClick = function () {
    toggleMapFormDisable(false);
    window.backend.loadFunction(window.filter.getData, window.utils.error);
    window.backend.loadFunction(window.createCards.createPins, window.utils.error);
    mainPin.removeEventListener('mousedown', onMainPinClick);
    window.formValidation.onTypeChange();
    reset.addEventListener('click', window.formValidation.onResetClick);
    priceInput.addEventListener('invalid', window.formValidation.onTypeInput);
    priceInput.addEventListener('input', window.formValidation.onTypeInput);
    typeInput.addEventListener('change', window.formValidation.onTypeChange);

    userTitleInput.addEventListener('invalid', window.formValidation.onTitleInputInvalid);
    userTitleInput.addEventListener('input', window.formValidation.onTitleInput);
    timeCheckinInput.addEventListener('change', window.formValidation.ontimeCheckinChange);
    timeCheckoutInput.addEventListener('change', window.formValidation.ontimeCheckoutChange);
    submit.addEventListener('click', window.formValidation.onSubmitClick);
    allFilters.addEventListener('change', onChangeFilter);
    window.filter.disableForm(true);
  };

  mainPin.addEventListener('mousedown', onMainPinClick);

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
    document.removeEventListener('keydown', onPopupEscPress);
    popupClose.removeEventListener('click', closePopup);
    popupClose.removeEventListener('keydown', onPopupCloseEnterPress);
  };

  window.showCard = function (div, card) {
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
    window.filter.getSortedPins();
  };

  var onChangeFilter = window.utils.debounce(function () {
    updatePins();
  });

  window.map = {
    toggleMapFormDisable: toggleMapFormDisable,
    onMainPinClick: onMainPinClick,
    getMainPinPosition: getMainPinPosition,
    closePopup: closePopup
  };
})();
