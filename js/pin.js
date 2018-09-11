'use strict';

(function () {
  // constants
  var AD_POSTS_AMOUNT = 5;

  var addElementsWithFragment = window.util.addElementsWithFragment;

  // elements
  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');
  var mapPinsContainer = document.querySelector('.map__pins');

  // functions
  var renderPin = function (advert, callback) {
    var pin = pinTemplate.cloneNode(true);
    pin.style.left = advert.location.x - 25 + 'px';
    pin.style.top = advert.location.y - 70 + 'px';
    pin.querySelector('img').src = advert.author.avatar;
    pin.querySelector('img').alt = advert.offer.title;

    pin.addEventListener('click', function () {
      callback(advert);
    });

    return pin;
  };

  window.pin = {
    renderPins: function (adverts) {
      var handler = window.card.show;
      // params (parent, dataArray, callback, handler)
      addElementsWithFragment(
          mapPinsContainer,
          adverts.slice(0, AD_POSTS_AMOUNT),
          renderPin,
          handler
      );
    },
    removePins: function () {
      var elements = mapPinsContainer.querySelectorAll('.map__pin');

      for (var i = 0; i < elements.length; i++) {
        if (!elements[i].classList.contains('map__pin--main')) {
          mapPinsContainer.removeChild(elements[i]);
        }
      }
    }
  };
})();
