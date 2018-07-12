'use strict';

(function () {
  var containerPhotos = document.querySelector('.ad-form__photo-container');
  var draggedItem;
  var dropZone = document.querySelector('.ad-form__drop-zone');

  dropZone.addEventListener('dragenter', function (evt) {
    evt.preventDefault();
    evt.target.style.opacity = 0.5;
    containerPhotos.classList.remove('visually-hidden');
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
    containerPhotos.appendChild(window.avatar.addPhotos(image));
  });

  containerPhotos.addEventListener('dragstart', function (evt) {
    if (evt.target.tagName === 'IMG') {
      draggedItem = evt.target;
    }
  });

  containerPhotos.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  containerPhotos.addEventListener('drop', function (evt) {
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
