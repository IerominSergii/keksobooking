'use strict';

(function () {
  // import
  var showCard = window.card.showCard;
  var generateAdvertPosts = window.data;
  var addElementsWithFragment = window.util.addElementsWithFragment;

  // constants
  var AD_POSTS_AMOUNT = 8;

  // elements
  var TEMPLATE = document.querySelector('template');
  var PIN_TEMPLATE = TEMPLATE.content.querySelector('.map__pin');
  var mapPinsContainer = document.querySelector('.map__pins');

  // functions
  var renderPin = function (advert) {
    var pin = PIN_TEMPLATE.cloneNode(true);
    pin.style.left = (advert.location.x - 25) + 'px';
    pin.style.top = (advert.location.y - 70) + 'px';
    pin.querySelector('img').src = advert.author.avatar;
    pin.querySelector('img').alt = advert.offer.title;

    pin.addEventListener('click', function () {
      showCard(advert);
    });

    return pin;
  };

  window.pin = {
    renderPins: function () {
      var advertPosts = generateAdvertPosts(AD_POSTS_AMOUNT);
      var fragment = document.createDocumentFragment();

      // addElementsWithFragment(parent, dataArray, callback)
      addElementsWithFragment(mapPinsContainer, advertPosts, renderPin);

      mapPinsContainer.appendChild(fragment);
    },
    removePins: function () {
      var elements = mapPinsContainer.querySelectorAll('.map__pin');

      for (var i = 0; i < elements.length; i++) {
        if (!elements[i].classList.contains('map__pin--main')) {
          mapPinsContainer.removeChild(elements[i]);
        }
      }
    },
  };
})();
