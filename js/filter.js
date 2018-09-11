'use strict';

(function () {
  var filterGuestsByValue = {
    'any': function () {
      return true;
    },
    '1': function (value) {
      return value === 1;
    },
    '2': function (value) {
      return value === 2;
    },
    '0': function (value) {
      return value === 100;
    }
  };

  var filterRoomsByValue = {
    'any': function () {
      return true;
    },
    '1': function (value) {
      return value === 1;
    },
    '2': function (value) {
      return value === 2;
    },
    '3': function (value) {
      return value === 3;
    }
  };

  var filterPriceByValue = {
    low: function (value) {
      return value < 10000;
    },
    high: function (value) {
      return value > 50000;
    },
    middle: function (value) {
      return value >= 10000 && value <= 50000;
    },
    any: function () {
      return true;
    }
  };

  var form = document.querySelector('.map__filters');
  var housingType = form.querySelector('#housing-type');
  var housingPrice = form.querySelector('#housing-price');
  var housingRooms = form.querySelector('#housing-rooms');
  var housingGuests = form.querySelector('#housing-guests');
  var housingFeatures = form.querySelector('#housing-features');
  var mapPinsContainer = document.querySelector('.map__pins');

  var resetAdverts = function () {
    for (var i = mapPinsContainer.children.length - 1; i > 0; i--) {
      var pin = mapPinsContainer.children[i];
      if (
        !pin.classList.contains('map__pin--main') &&
        pin.classList.contains('map__pin')
      ) {
        mapPinsContainer.removeChild(pin);
      }
    }
  };

  var filterByType = function (type, initialAdverts) {
    if (type === 'any') {
      return initialAdverts.slice();
    }

    return initialAdverts.slice().filter(function (advert) {
      return type === advert.offer.type;
    });
  };

  var filterByPrice = function (price, initialAdverts) {
    return initialAdverts.slice().filter(function (advert) {
      return filterPriceByValue[price](advert.offer.price);
    });
  };

  var filterByRooms = function (rooms, initialAdverts) {
    return initialAdverts.slice().filter(function (advert) {
      return filterRoomsByValue[rooms](advert.offer.rooms);
    });
  };

  var filterByGuests = function (guests, initialAdverts) {
    return initialAdverts.slice().filter(function (advert) {
      return filterGuestsByValue[guests](advert.offer.guests);
    });
  };

  var getCheckedFeatures = function (checkedInputs) {
    var elementsFeatures = [];
    if (checkedInputs) {
      for (var i = checkedInputs.length - 1; i >= 0; i--) {
        elementsFeatures.push(checkedInputs[i].value);
      }
    }

    return elementsFeatures;
  };

  var filterByFeatures = function (checkedFeatures, initialAdverts) {
    if (!checkedFeatures.length) {
      return initialAdverts;
    }

    var filteredArray = initialAdverts.slice().filter(function (advert) {
      return advert.offer.features.some(function (advertFeature) {
        var result = checkedFeatures.some(function (checkedFeature) {
          return advertFeature === checkedFeature;
        });

        return result;
      });
    });

    return filteredArray;
  };

  var filterPinsHandler = window.debounce(function () {
    var newAdverts = [];
    newAdverts = filterByType(housingType.value, window.originalAdverts);
    newAdverts = filterByPrice(housingPrice.value, newAdverts);
    newAdverts = filterByRooms(housingRooms.value, newAdverts);
    newAdverts = filterByGuests(housingGuests.value, newAdverts);

    var checkedFeatures = getCheckedFeatures(
        housingFeatures.querySelectorAll('input:checked')
    );
    newAdverts = filterByFeatures(checkedFeatures, newAdverts);

    resetAdverts();
    window.pin.renderPins(newAdverts);
  });

  form.addEventListener('change', filterPinsHandler);
})();
