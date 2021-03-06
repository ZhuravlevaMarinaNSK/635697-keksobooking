'use strict';

(function () {
  var form = document.querySelector('.ad-form');
  var containerPhoto = form.querySelector('.ad-form__photo-container');
  var dropZone = form.querySelector('.ad-form__drop-zone');
  var draggedItem;

  dropZone.addEventListener('dragenter', function (evt) {
    evt.preventDefault();
    evt.target.style.opacity = 0.5;
    containerPhoto.classList.remove('visually-hidden');
  });

  dropZone.addEventListener('dragleave', function (evt) {
    evt.target.style.opacity = '1';
    evt.preventDefault();
  });

  dropZone.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  dropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();
    evt.target.style.opacity = '1';
    var image = evt.dataTransfer;
    containerPhoto.appendChild(window.avatar.addPhotos(image));
  });

  containerPhoto.addEventListener('dragstart', function (evt) {
    if (evt.target.tagName === 'IMG') {
      draggedItem = evt.target;
    }
  });

  containerPhoto.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  containerPhoto.addEventListener('drop', function (evt) {
    var target = evt.target;
    evt.preventDefault();
    if (target.tagName === 'IMG') {
      if (target.offsetLeft === draggedItem.offsetLeft) {
        if (target.offsetTop < draggedItem.offsetTop) {
          target.insertAdjacentElement('beforebegin', draggedItem);
        } else if (target.offsetTop > draggedItem.offsetTop) {
          target.insertAdjacentElement('afterend', draggedItem);
        }
      } else {
        if (target.offsetLeft < draggedItem.offsetLeft) {
          target.insertAdjacentElement('beforebegin', draggedItem);
        } else if (target.offsetLeft > draggedItem.offsetLef) {
          target.insertAdjacentElement('afterend', draggedItem);
        }
      }
    }
  });
})();
