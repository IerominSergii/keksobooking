'use strict';

var AD_POSTS_AMOUNT = 4;
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var isIncluded = function (array, element) {
  var isAlreadyIncluded = false;
  if (array.length > 0) {
    isAlreadyIncluded = array.some(function (it) {
      return it === element;
    });

    return isAlreadyIncluded;
  }

  return isAlreadyIncluded;
};

// game-data
var offer = {
  title: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  type: ['palace', 'flat', 'house', 'bungalo'],
  checkin: ['12:00', '13:00', '14:00'],
  checkout: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  photos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
};

var offerType = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

var getRandomAdPost = function (advertPostsAlreadyDone) {
  var adPost = {};
  adPost.author = {};
  var authorAlreadyDone = advertPostsAlreadyDone.map(function (it) {
    return it.author.avatar;
  });

  do {
    adPost.author.avatar = 'img/avatars/user0' + getRandomNumber(1, 8) + '.png';
  } while (isIncluded(authorAlreadyDone, adPost.author.avatar));

  adPost.offer = {};
  var titlesAlreadyDone = advertPostsAlreadyDone.map(function (it) {
    return it.offer.title;
  });

  do {
    adPost.offer.title = offer.title[getRandomNumber(0, offer.title.length - 1)];
  } while (isIncluded(titlesAlreadyDone, adPost.offer.title));

  adPost.offer.address = getRandomNumber(100, 999) + ', ' + getRandomNumber(100, 999);
  adPost.offer.price = getRandomNumber(1000, 1000000);
  adPost.offer.type = offer.type[getRandomNumber(0, offer.type.length - 1)];
  adPost.offer.rooms = getRandomNumber(1, 5);
  // в задании указано случайное количество гостей, беру от 1 до 10
  adPost.offer.guests = getRandomNumber(1, 10);
  adPost.offer.checkin = offer.checkin[getRandomNumber(0, offer.checkin.length - 1)];
  adPost.offer.checkout = offer.checkout[getRandomNumber(0, offer.checkout.length - 1)];
  var featuresLength = getRandomNumber(1, 6);

  adPost.offer.features = [];
  var newFeaturesList = offer.features.slice();
  for (var i = 1; i <= featuresLength; i++) {
    var randomPosition = getRandomNumber(0, newFeaturesList.length - 1);
    var featureElement = newFeaturesList.splice(randomPosition, 1);
    adPost.offer.features.push(featureElement);
  }

  adPost.offer.description = '';
  adPost.offer.photos = [];
  var newPhotosList = offer.photos.slice();
  for (var j = 0; j < offer.photos.length; j++) {
    var randomPhotoPosition = getRandomNumber(0, newPhotosList.length - 1);
    var photo = newPhotosList.splice(randomPhotoPosition, 1);
    adPost.offer.photos.push(photo[0]);
  }

  adPost.location = {};
  adPost.location.x = getRandomNumber(300, 900);
  adPost.location.y = getRandomNumber(130, 630);

  return adPost;
};

var generateAdPosts = function (amount) {
  var adPostsList = [];
  for (var k = 1; k <= amount; k++) {
    adPostsList.push(getRandomAdPost(adPostsList));
  }

  return adPostsList;
};

var map = document.querySelector('.map');
var mapPin = document.querySelector('template').content.querySelector('.map__pin');
var mapPinsContainer = document.querySelector('.map__pins');

var renderPin = function (advert) {
  var pin = mapPin.cloneNode(true);
  pin.style.left = advert.location.x + 'px';
  pin.style.top = advert.location.y + 'px';
  pin.querySelector('img').src = advert.author.avatar;
  pin.querySelector('img').alt = advert.offer.title;

  return pin;
};

// у блока .map убери класс .map--faded
map.classList.remove('map--faded');

var advertPosts = generateAdPosts(AD_POSTS_AMOUNT);
var fragment = document.createDocumentFragment();

advertPosts.forEach(function (advert) {
  fragment.appendChild(renderPin(advert));
});

mapPinsContainer.appendChild(fragment);


var mapCard = document.querySelector('template').content.querySelector('.map__card');

var renderCard = function (post) {
  var card = mapCard.cloneNode(true);
  card.querySelector('.popup__avatar').src = post.author.avatar;
  card.querySelector('.popup__title').textContent = post.offer.title;
  card.querySelector('.popup__text--address').textContent = post.offer.address;
  card.querySelector('.popup__text--price').textContent = post.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = offerType[post.offer.type];
  card.querySelector('.popup__text--capacity').textContent = post.offer.rooms + ' комнаты для ' + post.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + post.offer.checkin + ', выезд до ' + post.offer.checkout;
  var featuresViews = card.querySelector('.popup__features');

  for (var n = 0; n <= featuresViews.children.length; n++) {
    featuresViews.removeChild(featuresViews.firstChild);
  }

  var featuresFragment = document.createDocumentFragment();
  post.offer.features.forEach(function (it) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + it);

    featuresFragment.appendChild(feature);
  });

  featuresViews.appendChild(featuresFragment);

  card.querySelector('.popup__description').textContent = post.offer.description;

  var photosContainer = card.querySelector('.popup__photos');
  var photoImage = photosContainer.querySelector('img');
  photoImage.src = post.offer.photos[0];

  for (var p = 1; p < post.offer.photos.length; p++) {
    var nextPhoto = photoImage.cloneNode(true);
    nextPhoto.src = post.offer.photos[p];
    photosContainer.appendChild(nextPhoto);
  }

  return card;
};

var titleCard = renderCard(advertPosts[0]);
var mapFiltersContainer = map.querySelector('.map__filters-container');
map.insertBefore(titleCard, mapFiltersContainer);
