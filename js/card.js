'use strict';

(function () {
  // constants
  var OfferType = {
    FLAT: 'Квартира',
    BUNGALO: 'Бунгало',
    HOUSE: 'Дом',
    PALACE: 'Дворец',
  };

  // global
  var addElementsWithFragment = window.util.addElementsWithFragment;

  // elements
  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');

  // functions
  var createFeature = function (featureName) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + featureName);
    return feature;
  };

  var renderCard = function (post) {
    var card = cardTemplate.cloneNode(true);
    card.querySelector('.popup__avatar').src = post.author.avatar;
    card.querySelector('.popup__title').textContent = post.offer.title;
    card.querySelector('.popup__text--address').textContent = post.offer.address;
    card.querySelector('.popup__text--price').textContent = post.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = OfferType[post.offer.type.toLowerCase()];
    card.querySelector('.popup__text--capacity').textContent = post.offer.rooms + ' комнаты для ' + post.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + post.offer.checkin + ', выезд до ' + post.offer.checkout;
    var featuresViews = card.querySelector('.popup__features');
    featuresViews.innerHTML = '';

    // addElementsWithFragment(parent, dataArray, callback)
    addElementsWithFragment(featuresViews, post.offer.features, createFeature);

    card.querySelector('.popup__description').textContent = post.offer.description;

    var photosContainer = card.querySelector('.popup__photos');
    var photoImageTemplate = photosContainer.removeChild(photosContainer.querySelector('img'));

    post.offer.photos.forEach(function (element, index) {
      var nextPhoto = photoImageTemplate.cloneNode(true);
      nextPhoto.src = post.offer.photos[index];
      photosContainer.appendChild(nextPhoto);
    });

    return card;
  };


  // export
  window.card = {
    closeCard: function () {
      if (map.querySelector('.map__card')) {
        map.removeChild(map.querySelector('.map__card'));
      }
    },
    showCard: function (advert) {
      window.card.closeCard();
      var titleCard = renderCard(advert);
      titleCard.querySelector('.popup__close').addEventListener('click', window.card.closeCard);
      map.insertBefore(titleCard, mapFiltersContainer);
    },
  };
})();
