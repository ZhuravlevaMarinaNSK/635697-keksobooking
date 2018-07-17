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
  // var mainPin = map.querySelector('.map__pin--main');
  var avatarZone = adForm.querySelector('.ad-form__field');
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

  var checkRedBorder = function (element) {
    if (element.style.borderColor === 'red') {
      unhighlightBorderError(element);
    }
  };

  var checkBlackBorder = function (element) {
    if (element.style.borderColor !== 'red') {
      highlightBorderError(priceInput);
    }
  };

  var onTypeInput = function () {
    return priceInput.validity.valid === true ? checkRedBorder(priceInput) : checkBlackBorder(priceInput);
  };

  var highlightBorderError = function (element) {
    element.style.borderColor = 'red';
  };

  var unhighlightBorderError = function (element) {
    element.style.borderColor = '#d9d9d3';
  };

  var onRoomChange = function () {
    var arr = window.utils.guestRooms[roomNumberInput.value].slice();
    guestNumberInput.setCustomValidity('');
    if (arr.indexOf(parseInt(guestNumberInput.value, 10)) < 0) {
      guestNumberInput.setCustomValidity('Число комнат не соответствует количеству гостей');
      if (guestNumberInput.style.borderColor !== 'red') {
        highlightBorderError(guestNumberInput);
      }
    } else if (guestNumberInput.style.borderColor === 'red') {
      unhighlightBorderError(guestNumberInput);
    }
  };

  roomNumberInput.addEventListener('change', function () {
    onRoomChange();
  });

  guestNumberInput.addEventListener('change', function () {
    onRoomChange();
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
  success.style.zIndex = 1000;
  success.classList.add('hidden');

  var resetForm = function () {
    formInputs.forEach(function (item) {
      var fieldType = item.type.toLowerCase();
      switch (fieldType) {
        case 'text':
        case 'textarea':
        case 'number':
          if (item !== addressInput) {
            item.value = item.defaultValue;
          }
          break;
        case 'file':
          if (item.parentNode === avatarZone) {
            avatar.src = 'img/muffin-grey.svg';
          } else {
            while (containerPhoto.lastChild.tagName === 'IMG') {
              containerPhoto.removeChild(containerPhoto.lastChild);
            }
            previewPhoto.classList.remove('visually-hidden');
          }
          break;
        case 'checkbox':
          if (item.checked) {
            item.checked = false;
          }
          break;
        case 'select-one':
        case 'select-multi':
          item.selectedIndex = 0;
          break;
        default:
          break;
      }
    });
    typeInput.selectedIndex = 1;
  };

  var onSubmitClick = function (evt) {
    var popup = map.querySelector('.popup');
    onRoomChange();
    priceInput.addEventListener('input', onTypeInput);
    priceInput.addEventListener('invalid', onTypeInput);
    if (!priceInput.validity.valid) {
      onTypeInput();
    }
    userTitleInput.addEventListener('invalid', onTitleInputInvalid);
    if (userTitleInput.checkValidity() && priceInput.checkValidity() && roomNumberInput.checkValidity() && guestNumberInput.checkValidity()) {
      evt.preventDefault();
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
      unhighlightBorderError(userTitleInput);
      unhighlightBorderError(priceInput);
      unhighlightBorderError(guestNumberInput);
      onTypeChange();
      window.map.getMainPinPosition(true);
      document.addEventListener('keydown', onSuccessEscPress);
      success.addEventListener('click', onSuccessMessageClick);
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
    }
  };

  var onSuccessMessageClick = function () {
    success.classList.add('hidden');
    document.removeEventListener('keydown', onSuccessEscPress);
    success.removeEventListener('click', onSuccessMessageClick);
  };

  var showSuccessMessage = function () {
    success.classList.remove('hidden');
  };

  var onResetClick = function (evt) {
    var popup = map.querySelector('.popup');
    evt.preventDefault();
    if (popup) {
      window.map.closePopup();
    }
    resetForm();
    onTypeChange();
    window.map.toggleMapFormDisable(true);
    var pinsForDelete = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinsForDelete.forEach(function (item) {
      document.querySelector('.map__pins').removeChild(item);
    });
    window.map.getMainPinPosition(true);
    unhighlightBorderError(userTitleInput);
    unhighlightBorderError(priceInput);
    unhighlightBorderError(guestNumberInput);
    reset.removeEventListener('click', onResetClick);
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
    ontimeCheckoutChange: ontimeCheckoutChange,
    onSubmitClick: onSubmitClick,
    onErrorEsc: onErrorEsc,
    onResetClick: onResetClick,
    onTypeChange: onTypeChange,
    onTitleInputInvalid: onTitleInputInvalid
  };
})();
