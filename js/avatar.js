'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var IMAGE_WIDTH = 70;
  var IMAGE_HEIGHT = 70;
  var MARGIN_LEFT = 5;
  var form = document.querySelector('.ad-form');
  var fileChooser = form.querySelector('.ad-form__field input[type=file]');
  var fileChooserPhoto = form.querySelector('.ad-form__upload input[type=file]');
  var container = form.querySelector('.ad-form__photo-container');
  var photo = form.querySelector('.ad-form__photo');
  var dropZone = form.querySelector('.ad-form-header__drop-zone');
  var preview = form.querySelector('.ad-form-header__preview img');

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

  var addPhoto = function (element) {
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

  fileChooserPhoto.addEventListener('change', function () {
    photo.classList.add('visually-hidden');
    container.appendChild(addPhoto(fileChooserPhoto));
  });

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
    addPhotos: addPhoto
  };
})();
