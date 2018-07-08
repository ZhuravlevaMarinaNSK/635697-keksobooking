'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

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
  var previewPhotos = document.querySelector('.ad-form__photo');
  var containerPhotos = document.querySelector('.ad-form__photo-container');

  var addPhotos = function () {
    var img = document.createElement('img');
    var div = previewPhotos.cloneNode(true);
    div.classList.remove('visually-hidden');
    containerPhotos.appendChild(div);
    img.classList.add('ad-form__image');
    img.alt = 'Фотография жилья';
    img.width = 70;
    img.height = 70;
    loadFile(fileChooserPhotos, img);
    div.appendChild(img);
  };

  fileChooserPhotos.addEventListener('change', function () {
    previewPhotos.classList.add('visually-hidden');
    addPhotos();
  });
})();
