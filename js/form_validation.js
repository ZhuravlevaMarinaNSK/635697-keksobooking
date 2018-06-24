'use strict';

(function () {
  var roomNumberInput = document.querySelector('#room_number');
  var adForm = document.querySelector('.ad-form');
  var priceInput = adForm.querySelector('#price');
  var typeInput = adForm.querySelector('#type');
  var guestNumberInput = adForm.querySelector('#capacity');
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');

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
    var arr = window.utils.guestRooms[roomNumberInput.value].slice();
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

  var success = document.querySelector('.success');
  success.classList.add('hidden');

  var onSubmitClick = function (evt) {
    roomCheck();
    if (userTitleInput.checkValidity() && priceInput.checkValidity() && roomNumberInput.checkValidity() && guestNumberInput.checkValidity()) {
      evt.preventDefault();
      window.map.toggleMapFormDisable(true);
      var pinsForDelete = map.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (var i = 0; i < pinsForDelete.length; i++) {
        document.querySelector('.map__pins').removeChild(pinsForDelete[i]);
      }

      adForm.reset();
      window.map.getMainPinPosition();
      mainPin.addEventListener('mouseup', window.map.onMainPinClick);
      success.classList.remove('hidden');
      document.addEventListener('keydown', onSuccessEscPress);
      success.addEventListener('click', closeSuccessMessage);
    }
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

  var closeSuccessMessage = function () {
    success.classList.add('hidden');
    document.removeEventListener('keydown', onSuccessEscPress);
    success.removeEventListener('click', closeSuccessMessage);
  };

  var onResetClick = function () {
    var popup = map.querySelector('.popup');
    if (popup) {
      window.map.closePopup();
    }
    window.map.toggleMapFormDisable(true);
    var pinsForDelete = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pinsForDelete.length; i++) {
      document.querySelector('.map__pins').removeChild(pinsForDelete[i]);
    }
    adForm.reset();
    window.map.getMainPinPosition();
    mainPin.addEventListener('mouseup', window.map.onMainPinClick);
  };

  var onSuccessEscPress = function (evt) {
    if (evt.keyCode === window.utils.esqKeycode) {
      closeSuccessMessage();
    }
  };

  window.formValidation = {
    onTypeInput: onTypeInput,
    ontimeCheckinChange: ontimeCheckinChange,
    ontimeCheckoutChange: ontimeCheckoutChange,
    onSubmitClick: onSubmitClick,
    onResetClick: onResetClick,
    onTitleInput: onTitleInput,
    onTypeChange: onTypeChange,
    onTitleInputInvalid: onTitleInputInvalid
  };
})();
