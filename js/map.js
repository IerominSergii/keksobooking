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

var PRICE_PLACEHOLDERS = {
  'Бунгало': 0,
  'Квартира': 1000,
  'Дом': 5000,
  'Дворец': 10000,
};

// === elements ===
var TEMPLATE = document.querySelector('template');
var PIN_TEMPLATE = TEMPLATE.content.querySelector('.map__pin');
var CARD_TEMPLATE = TEMPLATE.content.querySelector('.map__card');
var map = document.querySelector('.map');
var mapPinsContainer = document.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var noticeSection = document.querySelector('.notice');
var title = noticeSection.querySelector('#title');
var adForm = noticeSection.querySelector('.ad-form ');
var formFieldsets = noticeSection.querySelectorAll('fieldset');
var formInputs = noticeSection.querySelectorAll('input');
var typeForm = noticeSection.querySelector('#type').parentElement;
var priceForm = noticeSection.querySelector('#price').parentElement;
var priceFormInput = noticeSection.querySelector('#price');


// === functions ===
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var shuffle = function (array) {
  var newArray = array.slice();
  var finalArray = [];

  array.forEach(function () {
    var randomIndex = getRandomNumber(0, newArray.length - 1);
    finalArray.push(newArray.splice(randomIndex, 1)[0]);
  });

  return finalArray;
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

  adPost.author = {};
  adPost.author.avatar = 'img/avatars/user0' + (avatarIndex + 1) + '.png';

  adPost.location = {};
  adPost.location.x = getRandomNumber(300, 900);
  adPost.location.y = getRandomNumber(130, 630);

  adPost.offer = {};
  adPost.offer.title = TITLE.splice(avatarIndex, 1);
  adPost.offer.address = adPost.location.x + ', ' + adPost.location.y;
  adPost.offer.price = getRandomNumber(1000, 1000000);
  adPost.offer.type = TYPE[getRandomNumber(0, TYPE.length - 1)];
  adPost.offer.rooms = getRandomNumber(1, 5);
  adPost.offer.guests = getRandomNumber(1, 10);
  adPost.offer.checkin = CHECKIN[getRandomNumber(0, CHECKIN.length - 1)];
  adPost.offer.checkout = CHECKOUT[getRandomNumber(0, CHECKOUT.length - 1)];
  adPost.offer.features = FEATURES.slice();
  adPost.offer.features.length = getRandomNumber(1, 6);
  adPost.offer.description = '';
  adPost.offer.photos = shuffle(PHOTOS);

  return adPost;
};

var generateAdvertPosts = function (amount) {
  var adPostsList = [];

  do {
    adPostsList.push(generateRandomAdvertPost(adPostsList.length));
  } while (adPostsList.length < amount);

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

var createFeature = function (featureName) {
  var feature = document.createElement('li');
  feature.classList.add('popup__feature');
  feature.classList.add('popup__feature--' + featureName);
  return feature;
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
map.classList.remove('map--faded');
var advertPosts = generateAdvertPosts(AD_POSTS_AMOUNT);
var fragment = document.createDocumentFragment();

// addElementsWithFragment(parent, dataArray, callback)
addElementsWithFragment(mapPinsContainer, advertPosts, renderPin);

mapPinsContainer.appendChild(fragment);

var titleCard = renderCard(advertPosts[0]);
map.insertBefore(titleCard, mapFiltersContainer);


// === form ===
// === functions ===
var removeAttributeElements = function (elements, attributeName) {
  for (var i = 0; i < elements.length; i++) {
    var current = elements[i];
    if (current[attributeName]) {
      current[attributeName] = false;
    }
  }
};

var addAttributeElements = function (elements, attributeName) {
  for (var i = 0; i < elements.length; i++) {
    var current = elements[i];
    if (!current[attributeName]) {
      current[attributeName] = true;
    }
  }
};

var makeFormActive = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  removeAttributeElements(formFieldsets, 'disabled');
  removeAttributeElements(formInputs, 'disabled');
};

var makeFormDisabled = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  addAttributeElements(formFieldsets, 'disabled');
};

var changeMinPrice = function (element, minPrice) {
  element.placeholder = PRICE_PLACEHOLDERS[minPrice];
  element.min = PRICE_PLACEHOLDERS[minPrice];
};

var setMinimalPrice = function (value) {
  switch (value) {
    case 'Бунгало':
      changeMinPrice(priceFormInput, value);
      break;
    case 'Квартира':
      changeMinPrice(priceFormInput, value);
      break;
    case 'Дом':
      changeMinPrice(priceFormInput, value);
      break;
    case 'Дворец':
      changeMinPrice(priceFormInput, value);
      break;
    default:
      throw new Error('Wrong accommodation type');
  }
};

// === start ===
// makeFormDisabled();
makeFormActive();

typeForm.addEventListener('change', function (evt) {
  evt.preventDefault();
  var selectedElements = evt.target.querySelectorAll('option');

  for (var i = 0; i < selectedElements.length; i++) {
    if (selectedElements[i].selected) {
      var selectedElement = selectedElements[i];
    }
  }

  setMinimalPrice(selectedElement.textContent);
});
