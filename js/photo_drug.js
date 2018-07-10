'use strict';

(function () {
  var containerPhotos = document.querySelector('.ad-form__photo-container');
  var photo = document.querySelector('.ad-form__photo-container img');
  var draggedItem;

  if (photo) {
    photo.addEventListener('drag', function (evt) {
      evt.preventDefault();
      return false;
    });
  }

  containerPhotos.addEventListener('dragstart', function (evt) {
    if (evt.target.closest('img')) {
      evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setDragImage(evt.target, 35, 35);
      draggedItem = evt.target;

      evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setData('text/plain', evt.target.innerHTML);
    }
  });

  containerPhotos.addEventListener('dragend', function (evt) {
    evt.target.style.opacity = '0.5';
    return false;
  });

  containerPhotos.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  containerPhotos.addEventListener('drop', function (evt) {
    evt.preventDefault();
    evt.target.style.opacity = '1';
    var oldItem = evt.target;
    draggedItem.parentNode.removeChild(draggedItem);
    draggedItem.parentNode.appendChild(oldItem);
    evt.target.innerHTML = evt.dataTransfer.getData('text/plain');
    evt.target.appendChild(draggedItem);
    if (evt.stopPropagation) {
      evt.stopPropagation();
    }
    return false;
  });

  containerPhotos.addEventListener('dragenter', function (evt) {
    evt.target.style.opacity = '1';
    evt.preventDefault();
    return true;
  });

  containerPhotos.addEventListener('dragleave', function (evt) {
    evt.target.style.opacity = '0.5';
    evt.preventDefault();
  });
})();
