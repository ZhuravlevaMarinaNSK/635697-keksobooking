'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var IMAGE_WIDTH = 70;
  var IMAGE_HEIGHT = 70;
  var MARGIN_LEFT = 5;
  var fileChooser = document.querySelector('.ad-form__field input[type=file]');
  var preview = document.querySelector('.ad-form-header__preview img');

  fileChooser.addEventListener('change', function () {
    loadFile(fileChooser, preview);
  });

  var loadFile = function (input, prew) {
    var file = input.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        prew.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
    return reader;
  };

  var fileChooserPhotos = document.querySelector('.ad-form__upload input[type=file]');
  var container = document.querySelector('.ad-form__photo-container');
  var photos = document.querySelector('.ad-form__photo');

  var addPhotos = function (element) {
    var div = document.createDocumentFragment();
    var img = document.createElement('img');
    img.classList.add('ad-form__photo');
    img.alt = 'Фотография жилья';
    img.width = IMAGE_WIDTH;
    img.height = IMAGE_HEIGHT;
    img.style.marginLeft = MARGIN_LEFT + 'px';
    loadFile(element, img);
    div.appendChild(img);
    return div;
  };

  fileChooserPhotos.addEventListener('change', function () {
    photos.classList.add('visually-hidden');
    container.appendChild(addPhotos(fileChooserPhotos));
  });

  var dropZone = document.querySelector('.ad-form-header__drop-zone');

  dropZone.addEventListener('dragenter', function (evt) {
    evt.preventDefault();
    evt.target.style.opacity = 0.5;
  });

  dropZone.addEventListener('dragleave', function (evt) {
    evt.preventDefault();
    evt.target.style.opacity = 0.7;
  });

  dropZone.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  dropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();
    evt.target.style.opacity = 1;
    loadFile(evt.dataTransfer, preview);
  });

  window.avatar = {
    addPhotos: addPhotos
  };
})();
