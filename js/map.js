'use strict';

// === game-data ===
var ESC_KEYCODE = 27;

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

var MAIN_PIN = {
  width: 65,
  height: 65,
};

var MAIN_PIN_POINTER_HEIGHT = 22;

var DEFAULT_FORM_STATE = {
  titleValue: '',
  typeIndex: 1,
  priceValue: null,
  timeInIndex: 0,
  timeOutIndex: 0,
  roomNumberIndex: 1,
  capacityIndex: 1,
  descriptionValue: null,
};

var DEFAULT_MAIN_PIN_POSITION = {
  x: 570,
  y: 375,
};

var MAIN_PIN_MIN_Y_POSITION = 130;
var MAIN_PIN_MAX_Y_POSITION = 630;

// === elements ===
var TEMPLATE = document.querySelector('template');
var PIN_TEMPLATE = TEMPLATE.content.querySelector('.map__pin');
var CARD_TEMPLATE = TEMPLATE.content.querySelector('.map__card');
var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var mapPinsContainer = document.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');

var noticeSection = document.querySelector('.notice');
var title = noticeSection.querySelector('#title');
var adForm = noticeSection.querySelector('.ad-form ');
var formFieldsets = noticeSection.querySelectorAll('fieldset');
var formInputs = noticeSection.querySelectorAll('input');
var typeAccomodation = noticeSection.querySelector('#type');
var priceForm = noticeSection.querySelector('#price');
var address = noticeSection.querySelector('#address');
var timeOut = noticeSection.querySelector('#timeout');
var timeIn = noticeSection.querySelector('#timein');
var capacity = noticeSection.querySelector('#capacity');
var roomNumber = noticeSection.querySelector('#room_number');
var description = noticeSection.querySelector('#description');
var features = noticeSection.querySelector('.features');

var successPopup = document.querySelector('.success');
var adFormReset = noticeSection.querySelector('.ad-form__reset');

var pageState = false;


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

var closeCard = function () {
  if (map.querySelector('.map__card')) {
    map.removeChild(map.querySelector('.map__card'));
  }
};

var showCard = function (advert) {
  closeCard();
  var titleCard = renderCard(advert);
  titleCard.querySelector('.popup__close').addEventListener('click', closeCard);
  map.insertBefore(titleCard, mapFiltersContainer);
};


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

var renderPins = function () {
  var advertPosts = generateAdvertPosts(AD_POSTS_AMOUNT);
  var fragment = document.createDocumentFragment();

  // addElementsWithFragment(parent, dataArray, callback)
  addElementsWithFragment(mapPinsContainer, advertPosts, renderPin);

  mapPinsContainer.appendChild(fragment);
};

var removePins = function () {
  var elements = mapPinsContainer.querySelectorAll('.map__pin');

  for (var i = 0; i < elements.length; i++) {
    if (!elements[i].classList.contains('map__pin--main')) {
      mapPinsContainer.removeChild(elements[i]);
    }
  }
};

// === form ===
// === functions ===
var activateMap = function () {
  map.classList.remove('map--faded');
};

var deactivateMap = function () {
  map.classList.add('map--faded');
};

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
      changeMinPrice(priceForm, value);
      break;
    case 'Квартира':
      changeMinPrice(priceForm, value);
      break;
    case 'Дом':
      changeMinPrice(priceForm, value);
      break;
    case 'Дворец':
      changeMinPrice(priceForm, value);
      break;
    default:
      throw new Error('Wrong accommodation type');
  }
};

var setTime = function (selectedIndex, element) {
  element.selectedIndex = selectedIndex;
};

var limitGuests = function (rooms) {
  capacity.querySelectorAll('option');
  for (var i = 0; i < capacity.length; i++) {
    switch (rooms) {
      case '1':
        if (capacity[i].value !== '1') {
          capacity[i].disabled = true;
        } else {
          capacity[i].disabled = false;
        }
        break;
      case '2':
        if (capacity[i].value === '3' || capacity[i].value === '0') {
          capacity[i].disabled = true;
        } else {
          capacity[i].disabled = false;
        }
        break;
      case '3':
        if (capacity[i].value === '0') {
          capacity[i].disabled = true;
        } else {
          capacity[i].disabled = false;
        }
        break;
      case '100':
        if (capacity[i].value !== '0') {
          capacity[i].disabled = true;
        } else {
          capacity[i].disabled = false;
        }
        break;
      default:
        throw new Error('Wrong rooms amount');
    }
  }
};

var setAdressByPin = function () {
  var top = parseInt(mainPin.style.top, 10) + MAIN_PIN.height / 2 + MAIN_PIN_POINTER_HEIGHT;
  var left = parseInt(mainPin.style.left, 10) + MAIN_PIN.width / 2;

  address.value = left + ', ' + top;
};

// set default form state
var setDefaultMainPinPosition = function () {
  mainPin.style.left = DEFAULT_MAIN_PIN_POSITION.x + 'px';
  mainPin.style.top = DEFAULT_MAIN_PIN_POSITION.y + 'px';
};

var setDefaultOption = function (element, index) {
  element.selectedIndex = index;
};

var setDefaultInput = function (inputElement, defaultValue) {
  inputElement.value = defaultValue;
};

var setDefaultCheckbox = function (element) {
  while (element.querySelector('input:checked')) {
    element.querySelector('input:checked').checked = false;
  }
};

var setInitialStateForForm = function () {
  setDefaultMainPinPosition();
  setAdressByPin();

  setDefaultInput(title, DEFAULT_FORM_STATE.titleValue);
  setDefaultInput(priceForm, DEFAULT_FORM_STATE.priceValue);
  setDefaultInput(description, DEFAULT_FORM_STATE.descriptionValue);

  setDefaultOption(typeAccomodation, DEFAULT_FORM_STATE.typeIndex);
  setDefaultOption(timeIn, DEFAULT_FORM_STATE.timeInIndex);
  setDefaultOption(timeOut, DEFAULT_FORM_STATE.timeOutIndex);
  setDefaultOption(roomNumber, DEFAULT_FORM_STATE.roomNumberIndex);
  setDefaultOption(capacity, DEFAULT_FORM_STATE.capacityIndex);

  setDefaultCheckbox(features);

  removePins();
};

// page
var deactivatePage = function () {
  pageState = false;
  deactivateMap();
  limitGuests(roomNumber.options[roomNumber.selectedIndex].value);
  makeFormDisabled();
};

var activatePage = function () {
  pageState = true;
  activateMap();
  makeFormActive();
};

// popup
var popupEscPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  successPopup.classList.add('hidden');
  document.removeEventListener('click', closePopup);
};

var showPopup = function () {
  successPopup.classList.remove('hidden');
  successPopup.addEventListener('click', closePopup);
  document.addEventListener('keydown', popupEscPressHandler);
};

// handlers
var typeAccomodationChangeHandler = function (evt) {
  var selectedElement = evt.target.options[evt.target.selectedIndex];
  setMinimalPrice(selectedElement.textContent);
};

var timeOutChangeHandler = function () {
  setTime(timeOut.selectedIndex, timeIn);
};

var timeInChangeHandler = function () {
  setTime(timeIn.selectedIndex, timeOut);
};

var roomNumberChangeHandler = function () {
  limitGuests(roomNumber.options[roomNumber.selectedIndex].value);
};

var setCapacityCustomValidityHandler = function () {
  if (capacity.options[capacity.selectedIndex].disabled) {
    capacity.setCustomValidity('«Количество мест» должно соответствовать «Количеству комнат». Пожалуйста, выберете из доступных вариантов.');
  } else {
    capacity.setCustomValidity('');
  }
};

var resetButtonClickHandler = function () {
  setInitialStateForForm();
  deactivatePage();
};

var formButtonSubmitHandler = function () {
  deactivatePage();
  showPopup();
  setInitialStateForForm();
};

// drag and drop
// mainPin
var mainPinMousedownHandler = function (downEvt) {
  var startCoords = {
    x: downEvt.clientX,
    y: downEvt.clientY,
  };

  var mainPinCoordsMouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY,
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY,
    };

    if (mainPin.offsetLeft < 0) {
      mainPin.style.left = 0 + 'px';
    } else if ((mainPin.offsetLeft + mainPin.offsetWidth) > map.offsetWidth) {
      mainPin.style.left = (map.offsetWidth - mainPin.offsetWidth) + 'px';
    } else {
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
    }

    if (mainPin.offsetTop < MAIN_PIN_MIN_Y_POSITION) {
      mainPin.style.top = MAIN_PIN_MIN_Y_POSITION + 'px';
    } else if (mainPin.offsetTop > MAIN_PIN_MAX_Y_POSITION) {
      mainPin.style.top = MAIN_PIN_MAX_Y_POSITION + 'px';
    } else {
      mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
    }
  };

  var mainPinCoordsMouseUpHandler = function (upEvt) {
    if (pageState) {
      upEvt.preventDefault();
      setAdressByPin();

      document.removeEventListener('mousemove', mainPinCoordsMouseMoveHandler);
      document.removeEventListener('mouseup', mainPinCoordsMouseUpHandler);
    } else {
      activatePage();
      setAdressByPin();
      renderPins();

      document.removeEventListener('mousemove', mainPinCoordsMouseMoveHandler);
      document.removeEventListener('mouseup', mainPinCoordsMouseUpHandler);
    }

  };

  document.addEventListener('mousemove', mainPinCoordsMouseMoveHandler);
  document.addEventListener('mouseup', mainPinCoordsMouseUpHandler);
};

mainPin.addEventListener('mousedown', mainPinMousedownHandler);


// === start ===
setInitialStateForForm();
deactivatePage();

typeAccomodation.addEventListener('change', typeAccomodationChangeHandler);
timeOut.addEventListener('change', timeOutChangeHandler);
timeIn.addEventListener('change', timeInChangeHandler);
roomNumber.addEventListener('change', roomNumberChangeHandler);
roomNumber.addEventListener('change', setCapacityCustomValidityHandler);
capacity.addEventListener('change', setCapacityCustomValidityHandler);
adForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  formButtonSubmitHandler();
});
adFormReset.addEventListener('click', resetButtonClickHandler);
