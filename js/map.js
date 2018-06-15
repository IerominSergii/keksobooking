'use strict';

// === game-data ===
var AD_POSTS_AMOUNT = 8;
var TITLE = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var OFFER_TYPE = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

// === elements ===
var TEMPLATE = document.querySelector('template');
var PIN_TEMPLATE = TEMPLATE.content.querySelector('.map__pin');
var CARD_TEMPLATE = TEMPLATE.content.querySelector('.map__card');
var map = document.querySelector('.map');
var mapPinsContainer = document.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');

// === functions ===
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var shuffle = function (array) {
  var newArray = array.slice();
  for (var i = array.length; i > 0; i--) {
    var l = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[l];
    array[l] = temp;
  }

  return newArray;
};

var addElementsWithFragment = function (parent, dataArray, callback) {
  var fragment = document.createDocumentFragment();
  dataArray.forEach(function (element) {
    fragment.appendChild(callback(element));
  });
  parent.appendChild(fragment);
};

var generateRandomAdvertPost = function (avatarIndex) {
  var adPost = {};
  // author
  adPost.author = {};
  // author.avatar
  adPost.author.avatar = 'img/avatars/user0' + avatarIndex + '.png';
  // offer
  adPost.offer = {};
  // offer.title
  adPost.offer.title = TITLE.splice(getRandomNumber(0, TITLE.length - 1), 1);
  // offer.address
  adPost.offer.address = getRandomNumber(100, 999) + ', ' + getRandomNumber(100, 999);
  // offer.price
  adPost.offer.price = getRandomNumber(1000, 1000000);
  // offer.type
  adPost.offer.type = TYPE[getRandomNumber(0, TYPE.length - 1)];
  // offer.rooms
  adPost.offer.rooms = getRandomNumber(1, 5);
  // offer.guests в задании указано случайное количество гостей, беру от 1 до 10
  adPost.offer.guests = getRandomNumber(1, 10);
  // offer.checkin
  adPost.offer.checkin = CHECKIN[getRandomNumber(0, CHECKIN.length - 1)];
  // offer.checkout
  adPost.offer.checkout = CHECKOUT[getRandomNumber(0, CHECKOUT.length - 1)];
  // offer.features "features": массив строк случайной длины
  adPost.offer.features = FEATURES.slice();
  adPost.offer.features.length = getRandomNumber(1, 6);
  // offer.description
  adPost.offer.description = '';
  // offer.photos
  adPost.offer.photos = shuffle(PHOTOS);
  // location
  adPost.location = {};
  // location.x
  adPost.location.x = getRandomNumber(300, 900);
  // location.y
  adPost.location.y = getRandomNumber(130, 630);

  return adPost;
};

var generateAdvertPosts = function (amount) {
  var adPostsList = [];
  for (var k = 1; k <= amount; k++) {
    adPostsList.push(generateRandomAdvertPost(k));
  }

  return adPostsList;
};

var renderPin = function (advert) {
  var pin = PIN_TEMPLATE.cloneNode(true);
  pin.style.left = (advert.location.x - 25) + 'px';
  pin.style.top = (advert.location.y - 70) + 'px';
  pin.querySelector('img').src = advert.author.avatar;
  pin.querySelector('img').alt = advert.offer.title;

  return pin;
};

var renderCard = function (post) {
  var card = CARD_TEMPLATE.cloneNode(true);
  card.querySelector('.popup__avatar').src = post.author.avatar;
  card.querySelector('.popup__title').textContent = post.offer.title;
  card.querySelector('.popup__text--address').textContent = post.offer.address;
  card.querySelector('.popup__text--price').textContent = post.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = OFFER_TYPE[post.offer.type];
  card.querySelector('.popup__text--capacity').textContent = post.offer.rooms + ' комнаты для ' + post.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + post.offer.checkin + ', выезд до ' + post.offer.checkout;
  var featuresViews = card.querySelector('.popup__features');
  featuresViews.innerHTML = '';

  var createFeature = function (featureName) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + featureName);
    return feature;
  };

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

// === start ===
// у блока .map убери класс .map--faded
map.classList.remove('map--faded');
// сгенерируй рекламные посты, количество - AD_POSTS_AMOUNT
var advertPosts = generateAdvertPosts(AD_POSTS_AMOUNT);
var fragment = document.createDocumentFragment();

// addElementsWithFragment(parent, dataArray, callback)
addElementsWithFragment(mapPinsContainer, advertPosts, renderPin);


mapPinsContainer.appendChild(fragment);


var titleCard = renderCard(advertPosts[0]);
map.insertBefore(titleCard, mapFiltersContainer);
