'use strict';

(function () {
  // import
  var closeCard = window.card.closeCard;

  // var renderPins = window.pin.renderPins;
  var removePins = window.pin.removePins;
  var removeAttributeElements = window.util.removeAttributeElements;
  var addAttributeElements = window.util.addAttributeElements;

  // constants
  var ESC_KEYCODE = 27;
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
  var DEFAULT_MAIN_PIN_POSITION = {
    x: 570,
    y: 375,
  };
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

  // elements
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var noticeSection = document.querySelector('.notice');
  var title = noticeSection.querySelector('#title');
  var adForm = noticeSection.querySelector('.ad-form ');
  var priceForm = noticeSection.querySelector('#price');
  var formFieldsets = noticeSection.querySelectorAll('fieldset');
  var formInputs = noticeSection.querySelectorAll('input');
  var typeAccomodation = noticeSection.querySelector('#type');
  var address = noticeSection.querySelector('#address');
  var timeOut = noticeSection.querySelector('#timeout');
  var timeIn = noticeSection.querySelector('#timein');
  var capacity = noticeSection.querySelector('#capacity');
  var roomNumber = noticeSection.querySelector('#room_number');
  var description = noticeSection.querySelector('#description');
  var features = noticeSection.querySelector('.features');
  var adFormReset = noticeSection.querySelector('.ad-form__reset');
  var successPopup = document.querySelector('.success');

  // export window.form
  window.form = {};
  window.form.pageState = false;

  // functions
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

  // === form ===
  // === functions ===
  var activateMap = function () {
    map.classList.remove('map--faded');
  };

  var deactivateMap = function () {
    map.classList.add('map--faded');
  };

  // page
  var deactivatePage = function () {
    window.form.pageState = false;
    closeCard();
    deactivateMap();
    limitGuests(roomNumber.options[roomNumber.selectedIndex].value);
    makeFormDisabled();
  };

  var activatePage = function () {
    window.form.pageState = true;
    activateMap();
    makeFormActive();
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

  var addFormHandlers = function () {
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
  };

  // start
  setInitialStateForForm();
  deactivatePage();
  addFormHandlers();

  // export
  window.form.setAdressByPin = setAdressByPin;
  window.form.activatePage = activatePage;
})();
