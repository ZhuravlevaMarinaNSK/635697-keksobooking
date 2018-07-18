'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var roomNumberInput = adForm.querySelector('#room_number');
  var priceInput = adForm.querySelector('#price');
  var typeInput = adForm.querySelector('#type');
  var formInputs = adForm.querySelectorAll('select, input, checkbox, textarea');
  var guestNumberInput = adForm.querySelector('#capacity');
  var addressInput = adForm.querySelector('#address');
  var map = document.querySelector('.map');
  var avatar = adForm.querySelector('.ad-form-header__preview img');
  var containerPhoto = adForm.querySelector('.ad-form__photo-container');
  var previewPhoto = containerPhoto.querySelector('.ad-form__photo');
  var reset = adForm.querySelector('.ad-form__reset');

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
    return priceInput.validity.valid === true ? unhighlightBorderError(priceInput) : highlightBorderError(priceInput);
  };

  var highlightBorderError = function (element) {
    if (element.style.borderColor !== 'red') {
      element.style.borderColor = 'red';
    }
  };

  var unhighlightBorderError = function (element) {
    if (element.style.borderColor === 'red') {
      element.style.borderColor = '';
    }
  };

  var onRoomChange = function () {
    var arr = window.utils.guestRooms[roomNumberInput.value].slice();
    guestNumberInput.setCustomValidity('');
    if (arr.indexOf(parseInt(guestNumberInput.value, 10)) < 0) {
      guestNumberInput.setCustomValidity('Число комнат не соответствует количеству гостей');
      highlightBorderError(guestNumberInput);
    } else {
      unhighlightBorderError(guestNumberInput);
    }
  };

  var timeCheckinInput = document.querySelector('#timein');
  var timeCheckoutInput = document.querySelector('#timeout');

  var ontimeCheckinChange = function () {
    timeCheckoutInput.value = timeCheckinInput.value;
  };

  var ontimeCheckoutChange = function () {
    timeCheckinInput.value = timeCheckoutInput.value;
  };

  var success = document.querySelector('.success');
  success.style.zIndex = 1000;
  success.classList.add('hidden');

  var resetForm = function () {
    avatar.src = 'img/muffin-grey.svg';
    while (containerPhoto.lastChild.tagName === 'IMG') {
      containerPhoto.removeChild(containerPhoto.lastChild);
    }
    previewPhoto.classList.remove('visually-hidden');
    adForm.reset();
  };

  var onSubmitClick = function (evt) {;
    evt.preventDefault();
    adForm.noValidate = false;

    var popup = map.querySelector('.popup');
    onRoomChange();
    roomNumberInput.addEventListener('change', function () {
      onRoomChange();
    });
    guestNumberInput.addEventListener('change', function () {
      onRoomChange();
    });
    priceInput.addEventListener('input', onTypeInput);
    priceInput.addEventListener('invalid', onTypeInput);
    if (!priceInput.validity.valid) {
      onTypeInput();
    }
    userTitleInput.addEventListener('invalid', onTitleInputInvalid);
    userTitleInput.addEventListener('input', onTitleInput);
    if (userTitleInput.checkValidity() && priceInput.checkValidity() && roomNumberInput.checkValidity() && guestNumberInput.checkValidity()) {
      if (popup) {
        window.map.closePopup();
      }
      var pinsForDelete = map.querySelectorAll('.map__pin:not(.map__pin--main)');
      pinsForDelete.forEach(function (item) {
        document.querySelector('.map__pins').removeChild(item);
      });
      window.backend.uploadFunction(new FormData(adForm), showSuccessMessage, window.utils.error);
      window.map.toggleMapFormDisable(true);
      resetForm();
      onTypeChange();
      window.map.getMainPinPosition(true);
    }
  };

  var userTitleInput = adForm.querySelector('#title');

  var onTitleInputInvalid = function () {
    if (userTitleInput.validity.tooShort) {
      userTitleInput.setCustomValidity('Заголовок должен состоять минимум из ' + userTitleInput.minLength + '-ти символов');
      highlightBorderError(userTitleInput);
    } else if (userTitleInput.validity.tooLong) {
      userTitleInput.setCustomValidity('Заголовок не должен превышать ' + userTitleInput.maxLength + ' символов');
      highlightBorderError(userTitleInput);
    } else if (userTitleInput.validity.valueMissing) {
      userTitleInput.setCustomValidity('Обязательное поле');
      highlightBorderError(userTitleInput);
    } else {
      userTitleInput.setCustomValidity('');
      unhighlightBorderError(userTitleInput);
    }
  };

  var onTitleInput = function (evt) {
    var target = evt.target;
    if (target.value.length < 30) {
      highlightBorderError(userTitleInput);
      target.setCustomValidity('Имя должно состоять минимум из 30-ти символов. Длина имени сейчас: ' + target.value.length);
    } else {
      target.setCustomValidity('');
      unhighlightBorderError(userTitleInput);
    }
  };

  var onSuccessMessageClick = function () {
    success.classList.add('hidden');
    document.removeEventListener('keydown', onSuccessEscPress);
    success.removeEventListener('click', onSuccessMessageClick);
  };

  var showSuccessMessage = function () {
    success.classList.remove('hidden');
    success.addEventListener('click', onSuccessMessageClick)
    document.documentElement.focus();
    document.addEventListener('keydown', onSuccessEscPress, false);
  };

  var onResetClick = function (evt) {
    var popup = map.querySelector('.popup');
    evt.preventDefault();
    adForm.noValidate = true;
    if (popup) {
      window.map.closePopup();
    }
    onTypeChange();
    window.map.toggleMapFormDisable(true);
    var pinsForDelete = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinsForDelete.forEach(function (item) {
      document.querySelector('.map__pins').removeChild(item);
    });
    window.map.getMainPinPosition(true);
    reset.removeEventListener('click', onResetClick);
    roomNumberInput.removeEventListener('change', function () {
      onRoomChange();
    });
    guestNumberInput.removeEventListener('change', function () {
      onRoomChange();
    });
    unhighlightBorderError(userTitleInput);
    unhighlightBorderError(priceInput);
    unhighlightBorderError(guestNumberInput);
    resetForm();
  };

  var onSuccessEscPress = function (evt) {
    if (evt.keyCode === window.utils.escKeycode) {
      onSuccessMessageClick();
    }
  };

  var onErrorEsc = function (evt) {
    var error = document.querySelector('.error-message');
    if (error && evt.keyCode === window.utils.escKeycode) {
      error.parentNode.removeChild(error);
    }
  };

  window.formValidation = {
    onTypeInput: onTypeInput,
    ontimeCheckinChange: ontimeCheckinChange,
    onTitleInputInvalid: onTitleInputInvalid,
    ontimeCheckoutChange: ontimeCheckoutChange,
    onSubmitClick: onSubmitClick,
    onTitleInput: onTitleInput,
    onErrorEsc: onErrorEsc,
    onResetClick: onResetClick,
    onTypeChange: onTypeChange
  };
})();
